const fields = {
  identity: {
    type: "object",
    properties: Object.fromEntries(
      ["name", "symbol", "exchange", "currency", "sector"].map((k) => [
        k,
        { type: "string" },
      ]),
    ),
    required: ["name", "symbol", "exchange", "currency", "sector"],
    additionalProperties: false,
  },
  title: { type: "string" },
  summary: { type: "string" },
  details: { type: "string" },
  risks: { type: "array", items: { type: "string" } },
  catalysts: { type: "array", items: { type: "string" } },
  sources: {
    type: "array",
    items: {
      type: "object",
      properties: { label: { type: "string" }, url: { type: "string" } },
      required: ["label", "url"],
      additionalProperties: false,
    },
  },
  uncertainty: { type: "string" },
  quote: {
    type: "object",
    properties: {
      price: { type: "number" },
      date: { type: "string" },
      currency: { type: "string" },
      source: { type: "string" },
      sourceUrl: { type: "string" },
    },
    required: ["price", "date", "currency", "source", "sourceUrl"],
    additionalProperties: false,
  },
};
const invalid = (message) => Object.assign(new Error(message), { status: 400 });
export function validateResearch(r) {
  if (!r || typeof r !== "object" || Array.isArray(r))
    throw invalid("AI 返回内容应为 JSON 对象。");
  for (const key of ["title", "summary", "details", "uncertainty"])
    if (typeof r[key] !== "string" || r[key].length > 80000)
      throw invalid(`AI 内容缺少或超出长度：${key}`);
  for (const key of ["risks", "catalysts"])
    if (
      !Array.isArray(r[key]) ||
      r[key].length > 40 ||
      r[key].some((v) => typeof v !== "string" || v.length > 5000)
    )
      throw invalid(`无效的 ${key}`);
  if (
    !Array.isArray(r.sources) ||
    r.sources.length > 40 ||
    r.sources.some(
      (s) =>
        !s ||
        typeof s.label !== "string" ||
        typeof s.url !== "string" ||
        !/^https?:\/\//.test(s.url),
    )
  )
    throw invalid("来源必须是 http/https 链接。");
  if (
    r.identity &&
    (!r.identity ||
      typeof r.identity !== "object" ||
      ["name", "symbol", "exchange", "currency", "sector"].some(
        (k) => typeof r.identity[k] !== "string" || r.identity[k].length > 300,
      ))
  )
    throw invalid("证券身份信息无效。");
  if (
    r.quote !== undefined &&
    (!r.quote || typeof r.quote !== "object" || Array.isArray(r.quote) ||
      typeof r.quote.price !== "number" || !Number.isFinite(r.quote.price) || r.quote.price <= 0 ||
      typeof r.quote.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(r.quote.date) || Number.isNaN(Date.parse(r.quote.date)) ||
      typeof r.quote.currency !== "string" || r.quote.currency.length > 8 ||
      typeof r.quote.source !== "string" || !r.quote.source.trim() || r.quote.source.length > 200 ||
      typeof r.quote.sourceUrl !== "string" || !/^https?:\/\//.test(r.quote.sourceUrl) || r.quote.sourceUrl.length > 1000)
  )
    throw invalid("报价必须包含有效价格、交易日期、币种和来源链接。");
  const normalized = Object.fromEntries(Object.keys(fields).filter((k) => k !== "quote").map((k) => [k, r[k]]));
  if (r.quote) normalized.quote = r.quote;
  return normalized;
}
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function researchHtml(r, date) {
  const quote = r.quote ? `<section class="quote"><b>最近完整交易日收盘</b><strong>${esc(r.quote.currency)} ${Number(r.quote.price).toFixed(2)}</strong><small>${esc(r.quote.date)} · <a href="${esc(r.quote.sourceUrl)}" rel="noopener noreferrer">${esc(r.quote.source)}</a></small></section>` : "";
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(r.summary)}"><title>${esc(r.title)}</title><style>body{margin:0;background:#f4f6f3;color:#233b33;font:16px/1.85 system-ui}main{max-width:900px;margin:40px auto;padding:40px;background:white;border:1px solid #dce5dd;border-radius:20px}h1{line-height:1.4}h2{margin-top:32px;font-size:21px}small{color:#64766c}p{white-space:pre-wrap}a{color:#1b7056}.quote{display:grid;grid-template-columns:1fr auto;gap:3px 14px;padding:16px;background:#f0f5ed;border-radius:10px}.quote strong{text-align:right}.quote small{grid-column:1/-1}@media(max-width:600px){main{margin:12px;padding:22px}}</style><main><small>MY HOLDINGS · AI 研究 · ${esc(date)}</small><h1>${esc(r.title)}</h1><p>${esc(r.summary)}</p>${quote}<h2>研究与分析</h2><p>${esc(r.details)}</p><h2>风险</h2><ul>${r.risks.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><h2>催化因素与关注条件</h2><ul>${r.catalysts.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><h2>待核实项</h2><p>${esc(r.uncertainty)}</p><h2>资料来源</h2><ul>${r.sources.map((s) => `<li><a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}</ul><small>AI 生成；持仓为保存的快照，所有情景与研究结论需结合数据日期阅读。</small></main></html>`;
}
