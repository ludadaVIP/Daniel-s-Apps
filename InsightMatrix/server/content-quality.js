import { createHash } from 'node:crypto';
import { categories } from './content.js';

export const caseSections = [
  '事件与当时的信息', '决策与因果机制', '结果与证据',
  '反事实与适用边界', '判断练习', '来源与核验',
];

const cjkCount = (text) => (String(text ?? '').match(/[\u3400-\u9fff]/g) || []).length;
const normalized = (text) => String(text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const withoutLinks = (text) => text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/https?:\/\/\S+/g, '');

function sectionsOf(body) {
  const sections = {};
  let current;
  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = heading[1];
      sections[current] = (sections[current] || '') + '\n';
    } else if (current) sections[current] += line + '\n';
  }
  return sections;
}

export function contentHash(article) {
  const fields = ['id', 'title', 'category', 'eventKey', 'summary', 'learningObjective', 'sources', 'related', 'body'];
  return createHash('sha256').update(JSON.stringify(Object.fromEntries(fields.map((key) => [key, article[key]])))).digest('hex');
}

function shingles(text) {
  const clean = normalized(withoutLinks(text));
  return new Set(Array.from({ length: Math.max(0, clean.length - 3) }, (_, index) => clean.slice(index, index + 4)));
}

function similarity(a, b) {
  let matches = 0;
  for (const gram of a) if (b.has(gram)) matches++;
  return a.size + b.size ? 2 * matches / (a.size + b.size) : 0;
}

/** Structural checks find review candidates; they do not measure learning outcomes or prove causation. */
export function auditCases(articles, { minimumPerCategory = 10, reviews = [], requireEditorialReview = true } = {}) {
  const cases = articles.filter((article) => article.type === 'case');
  const errors = [], warnings = [], inventory = [];
  const report = (target, rule, ids, message) => target.push({ rule, ids, message });
  const reviewById = new Map();
  for (const review of reviews) {
    if (reviewById.has(review.id)) report(errors, 'duplicate-review', [review.id], '同一案例存在多个编辑验收记录');
    reviewById.set(review.id, review);
  }
  const eventOwners = new Map(), titleOwners = new Map(), paragraphOwners = new Map();
  const analyzed = [];
  const counts = Object.fromEntries(categories.map((category) => [category, cases.filter((a) => a.category === category).length]));
  for (const [category, count] of Object.entries(counts)) {
    if (count < minimumPerCategory) report(errors, 'category-coverage', [], `${category} 只有 ${count} 篇案例，需要至少 ${minimumPerCategory} 篇`);
  }

  for (const article of cases) {
    const id = article.id;
    const fail = (rule, message) => report(errors, rule, [id], message);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.eventKey || '')) fail('event-key', '缺少规范的历史事件 eventKey');
    else if (eventOwners.has(article.eventKey)) report(errors, 'duplicate-event', [eventOwners.get(article.eventKey), id], '同一历史事件重复收录，请合并或明确不同研究对象');
    else eventOwners.set(article.eventKey, id);

    const title = normalized(article.title);
    if (titleOwners.has(title)) report(errors, 'duplicate-title', [titleOwners.get(title), id], '标题实质相同');
    else titleOwners.set(title, id);
    if (cjkCount(article.learningObjective) < 20) fail('learning-objective', '需要说明至少 20 个汉字的具体学习目标');

    const sections = sectionsOf(article.body);
    for (const heading of caseSections) {
      if (!sections[heading]?.trim()) fail('missing-section', `缺少“${heading}”`);
      else if (heading !== '来源与核验' && cjkCount(withoutLinks(sections[heading])) < 90) fail('thin-section', `“${heading}”不足 90 个汉字，请补充有用的论证或练习标准`);
    }
    const prose = Object.entries(sections).filter(([heading]) => heading !== '来源与核验').map(([, text]) => text).join('\n');
    const chineseCharacters = cjkCount(withoutLinks(prose));
    if (chineseCharacters < 750) fail('thin-case', '有效正文不足 750 个汉字；需要补足证据和论证，不能靠参考链接或模板凑字');
    if (/(?:TODO|TBD|待补充|此处填写|lorem ipsum)/i.test(article.body)) fail('placeholder', '包含未完成的占位内容');

    const sources = Array.isArray(article.sources) ? article.sources : [];
    const sourceUrls = new Set();
    const sourceDocuments = new Set();
    for (const source of sources) {
      if (!source || typeof source !== 'object' || Array.isArray(source)) {
        fail('source-format', '来源必须为包含标题、URL 和支持事实的对象');
        continue;
      }
      try {
        const url = new URL(source.url);
        if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error();
        sourceUrls.add(url.href.replace(/\/$/, ''));
      } catch { fail('source-url', '来源链接无效'); }
      if (typeof source.title !== 'string' || !source.title.trim() || typeof source.claim !== 'string' || source.claim.trim().length < 15) fail('source-claim', '每个来源必须注明标题及其支持的具体事实');
      else sourceDocuments.add(normalized(source.title.replace(/（[^）]*）|\([^)]*\)/g, '')));
      if (typeof source.url === 'string' && !article.body.includes(source.url)) fail('uncited-source', `来源没有在正文中出现：${source.url}`);
    }
    if (sourceUrls.size < 2) fail('source-count', '至少需要两个不同的可追溯来源页面；来源是否支持事实仍需编辑核验');
    if (sourceUrls.size >= 2 && sourceDocuments.size < 2) fail('duplicate-source-document', '同一文件的镜像不能算作两份资料，请补充不同文件并由编辑核对');

    for (const paragraph of prose.split(/\n\s*\n/)) {
      const clean = normalized(withoutLinks(paragraph));
      if (cjkCount(clean) < 80) continue;
      const previous = paragraphOwners.get(clean);
      if (previous) report(errors, 'repeated-paragraph', [previous, id], '存在重复长段落，应检查模板填充或重复收录');
      else paragraphOwners.set(clean, id);
    }
    const hash = contentHash(article);
    const review = reviewById.get(id);
    if (requireEditorialReview) {
      if (!review || review.decision !== 'approved') fail('editorial-review', '缺少编辑逐篇审读记录；自动规则通过不等于内容质量合格');
      else {
        if (review.hash !== hash) fail('stale-review', '正文或关键元数据已修改，需要重新审读');
        for (const field of ['reviewer', 'checkedAt', 'cognitiveValue', 'limitations', 'distinctness', 'sourceVerification']) {
          if (typeof review[field] !== 'string' || !review[field].trim()) fail('incomplete-review', `编辑记录缺少 ${field}`);
        }
      }
    }
    inventory.push({ id, category: article.category, eventKey: article.eventKey, title: article.title, chineseCharacters, sourceCount: sourceUrls.size, hash, editorialDecision: review?.decision || 'pending' });
    analyzed.push({ article, grams: shingles(prose), sourceUrls });
  }

  for (let i = 0; i < analyzed.length; i++) for (let j = i + 1; j < analyzed.length; j++) {
    const a = analyzed[i], b = analyzed[j], score = similarity(a.grams, b.grams);
    const ids = [a.article.id, b.article.id];
    if (score >= 0.65) report(errors, 'near-duplicate', ids, `正文四字片段相似度 ${(score * 100).toFixed(1)}%，需要合并或重写`);
    else if (score >= 0.3) report(warnings, 'similarity-candidate', ids, `正文相似度 ${(score * 100).toFixed(1)}%，编辑需检查是否重复讲述`);
    const shared = [...a.sourceUrls].filter((url) => b.sourceUrls.has(url));
    if (shared.length >= 2) report(warnings, 'shared-sources', ids, '共同引用至少两份相同资料，请确认研究对象和学习目标确实不同');
  }
  return { passed: errors.length === 0, counts, totalCases: cases.length, errors, warnings, inventory,
    limits: '规则用于发现内容缺漏、重复候选和过期审读记录；不能证明历史因果或保证读者认知改善。认知价值、来源支持程度和类比边界需要逐篇审读。' };
}
