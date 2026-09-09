import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from '../server/content.js';
import { auditCases } from '../server/content-quality.js';

const root = fileURLToPath(new URL('../', import.meta.url));
export function loadEditorialReviews(directory = path.join(root, 'docs', 'reviews')) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((name) => name.endsWith('-editorial.json')).flatMap((name) => {
    const data = JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'));
    if (!Array.isArray(data)) throw new Error(`${name} 必须包含审读记录数组`);
    return data;
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = auditCases(loadContent(path.join(root, 'content')), { reviews: loadEditorialReviews(), requireEditorialReview: !process.argv.includes('--draft') });
    const destination = path.join(root, 'artifacts', 'content-audit.json');
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, JSON.stringify({ checkedAt: new Date().toISOString(), ...result }, null, 2));
    console.log(`${process.argv.includes('--draft') ? '草稿检查（不代表编辑验收）' : '内容发布检查'}：${result.totalCases} 篇历史案例`);
    console.table(result.counts);
    for (const issue of result.errors) console.error(`[${issue.rule}] ${issue.ids.join(', ')}: ${issue.message}`);
    for (const issue of result.warnings) console.warn(`[需审读] ${issue.ids.join(', ')}: ${issue.message}`);
    console.log(`错误 ${result.errors.length}，待关注 ${result.warnings.length}；报告：${destination}`);
    process.exitCode = result.passed ? 0 : 1;
  } catch (error) { console.error('内容检查失败：', error.message); process.exitCode = 1; }
}
