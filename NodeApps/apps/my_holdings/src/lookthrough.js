import { usd } from "./model.js";

const normalize = (symbol) => String(symbol || "").trim().toUpperCase().replaceAll("/", ".");
const ISSUERS = {
  GOOG: ["ALPHABET", "Alphabet / 谷歌"], GOOGL: ["ALPHABET", "Alphabet / 谷歌"],
  "BRK.A": ["BERKSHIRE", "伯克希尔·哈撒韦"], "BRK.B": ["BERKSHIRE", "伯克希尔·哈撒韦"],
  "BRK-B": ["BERKSHIRE", "伯克希尔·哈撒韦"],
  FOX: ["FOX", "Fox"], FOXA: ["FOX", "Fox"],
  NWS: ["NEWS-CORP", "News Corp"], NWSA: ["NEWS-CORP", "News Corp"],
};
const NAMES = { NVDA: "英伟达", MSFT: "微软", AAPL: "苹果", AMZN: "亚马逊", AVGO: "博通", META: "Meta", TSLA: "特斯拉", TSM: "台积电", AMD: "AMD", MU: "美光", LLY: "礼来", ORCL: "甲骨文", IBKR: "盈透证券" };
export const FUND_COLORS = { VOO: "#4d7b69", QQQM: "#6b80a8", SOXX: "#b69757", SMH: "#8b7fa7", VGT: "#5d9299", direct: "#8b9988" };
export const fundColor = (symbol) => FUND_COLORS[symbol] || "#84998f";

export function validateFundHoldings(data) {
  if (data?.version !== 1 || !Array.isArray(data.funds) || !data.funds.length) throw new Error("基金权重文件格式无效。");
  const seen = new Set();
  for (const fund of data.funds) {
    if (!fund.symbol || seen.has(fund.symbol) || normalize(fund.symbol) !== fund.symbol ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fund.asOf) || !Number.isFinite(Date.parse(fund.asOf)) || new Date(fund.asOf).toISOString().slice(0, 10) !== fund.asOf ||
      !fund.source || !/^https:\/\//.test(fund.sourceUrl || "") || !Number.isFinite(Date.parse(fund.retrievedAt)) ||
      fund.asOf > fund.retrievedAt.slice(0, 10) || fund.complete !== true || !Array.isArray(fund.holdings) || !fund.holdings.length)
      throw new Error(`基金 ${fund.symbol || "未知"} 缺少完整披露、日期或来源。`);
    seen.add(fund.symbol);
    let equityWeight = 0;
    const securities = new Set();
    for (const item of fund.holdings) {
      if (!item.assetType || !item.name || (item.weightPct !== null && (!Number.isFinite(item.weightPct) || Math.abs(item.weightPct) > 100)))
        throw new Error(`${fund.symbol} 的成分权重无效。`);
      if (item.assetType !== "equity") continue;
      const symbol = normalize(item.symbol);
      if (!symbol || securities.has(symbol) || !Number.isFinite(item.weightPct) || item.weightPct < 0)
        throw new Error(`${fund.symbol} 的股票代码重复或权重缺失。`);
      securities.add(symbol);
      equityWeight += item.weightPct;
    }
    // Keep the issuer's weights, including cash/derivatives and rounding differences.
    if (equityWeight < 80 || equityWeight > 100.5) throw new Error(`${fund.symbol} 的完整股票权重合计异常。`);
  }
  return data;
}

export function lookThrough(holdings, data, { fx = {}, accountId = "all", now = new Date(), fundSymbols = [] } = {}) {
  const funds = new Map((data?.funds || []).map(f => [f.symbol, f]));
  const knownFunds = new Set(fundSymbols.map(normalize));
  const companies = new Map(), usedFunds = new Map(), excluded = [];
  let totalValue = 0, fundValue = 0, directValue = 0, unclassifiedValue = 0;
  const add = (symbol, name, amount, via) => {
    const ticker = normalize(symbol), issuer = ISSUERS[ticker];
    const key = issuer?.[0] || ticker;
    const company = companies.get(key) || { key, name: issuer?.[1] || NAMES[ticker] || name || ticker, symbols: new Set(), value: 0, directValue: 0, contributions: new Map() };
    company.symbols.add(ticker);
    company.value += amount;
    if (via === "direct") company.directValue += amount;
    const contribution = company.contributions.get(via) || { symbol: via, value: 0, fundWeightPct: 0 };
    contribution.value += amount;
    // Across accounts the fund's weight is the same; across share classes it adds.
    company.contributions.set(via, contribution);
    companies.set(key, company);
  };
  for (const h of holdings.filter(h => accountId === "all" || h.accountId === accountId)) {
    const quoted = Number.isFinite(h.quantity) && Number.isFinite(h.price) && h.price > 0;
    const localValue = quoted ? Math.round(h.quantity * h.price * 100) / 100 : h.marketValue;
    const value = Number.isFinite(localValue) ? usd(localValue, h.currency, fx) : null;
    if (value === null || value < 0) { excluded.push({ symbol: h.symbol, reason: value === null ? "市值或汇率缺失" : "暂不支持空头持仓" }); continue; }
    if (!value) continue;
    totalValue += value;
    const symbol = normalize(h.symbol), fund = funds.get(symbol);
    if (fund) {
      fundValue += value;
      usedFunds.set(symbol, { ...fund, value: (usedFunds.get(symbol)?.value || 0) + value });
      for (const item of fund.holdings) if (item.assetType === "equity" && item.weightPct > 0) add(item.symbol, item.name, value * item.weightPct / 100, symbol);
    } else if (knownFunds.has(symbol) || /ETF|\bindex\b|基金|指数/i.test(`${h.name || ""} ${h.sector || ""}`)) {
      unclassifiedValue += value;
      excluded.push({ symbol, value, reason: "尚无成分权重，未当作个股计算" });
    } else {
      directValue += value;
      add(symbol, h.name, value, "direct");
    }
  }
  // Compute each issuer's fund weight once (not once per account).
  for (const fund of usedFunds.values()) for (const item of fund.holdings) {
    if (item.assetType !== "equity" || !(item.weightPct > 0)) continue;
    const ticker = normalize(item.symbol), company = companies.get(ISSUERS[ticker]?.[0] || ticker);
    company.contributions.get(fund.symbol).fundWeightPct += item.weightPct;
  }
  const rows = [...companies.values()].map(c => ({ ...c, symbols: [...c.symbols].sort(), weight: totalValue ? c.value / totalValue * 100 : 0,
    contributions: [...c.contributions.values()].sort((a, b) => b.value - a.value),
    fundCount: [...c.contributions.keys()].filter(s => s !== "direct").length,
  })).sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));
  const equityValue = rows.reduce((sum, r) => sum + r.value, 0);
  const top10 = rows.slice(0, 10), top10Value = top10.reduce((sum, r) => sum + r.value, 0);
  return { rows, top10, totalValue, fundValue, directValue, equityValue, unclassifiedValue,
    residualValue: totalValue - equityValue - unclassifiedValue,
    top10Value, top10Weight: totalValue ? top10Value / totalValue * 100 : 0,
    usedFunds: [...usedFunds.values()].map(f => ({ ...f, stale: (now - new Date(`${f.asOf}T00:00:00Z`)) / 86400000 > 45 })),
    excluded, priceDates: [...new Set(holdings.filter(h => accountId === "all" || h.accountId === accountId).map(h => h.priceDate).filter(Boolean))].sort(),
  };
}

export const FUND_REVIEW_PROMPT = `请复核 My Holdings 个股穿透。先读 apps/my_holdings/README.md 的「个股穿透」与 apps/my_holdings/data/fund-holdings.json，按各发行商最新完整持仓更新该独立文件，保留真实 asOf、retrievedAt、官方来源URL、全部成分及原始百分比精度。支持 VOO、QQQM、SOXX、SMH、VGT；如实际持有其他ETF则核实身份后补齐。equity 才进入公司排行；现金、货基、期货、衍生品及权利单独分类，缺失权重保留null，不归一化，不把期货名义金额当股票市值。用 validateFundHoldings 校验并运行 lookthrough.test.js；通过 GET /my-holdings/api/fund-holdings 确认新数据。未能核实的基金保留原数据并说明，不用二手最新价格冒充成分权重，不改持仓、成本、行情或研究。`;
