export const CURRENCIES = ["USD", "NZD", "CNY", "HKD"];
export const money = (value, currency = "USD") =>
  value == null
    ? "待填写"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(value);
export const pct = (v) => `${Number(v || 0).toFixed(2)}%`;
export const id = () => crypto.randomUUID();
export function usd(value, currency, fx) {
  if (value === 0) return 0;
  const rate = currency === "USD" ? 1 : fx[currency];
  return Number.isFinite(rate) && rate > 0 ? value * rate : null;
}
export function calculate(state, accountId = "all") {
  const holdings = state.holdings.filter(
    (h) => accountId === "all" || h.accountId === accountId,
  );
  const groups = new Map();
  let value = 0,
    cost = 0,
    unconverted = 0;
  for (const h of holdings) {
    const v = usd(h.marketValue, h.currency, state.fx),
      c = usd(h.cost, h.currency, state.fx);
    if (v == null) {
      unconverted++;
      continue;
    }
    value += v;
    cost += c;
    const key = `${h.symbol}:${h.currency}`;
    const g = groups.get(key) || {
      symbol: h.symbol,
      name: h.name,
      currency: h.currency,
      quantity: 0,
      value: 0,
      cost: 0,
      sector: h.sector,
    };
    g.quantity += h.quantity;
    g.value += v;
    g.cost += c;
    groups.set(key, g);
  }
  const cashByCurrency = Object.fromEntries(
    CURRENCIES.map((c) => [
      c,
      state.cash
        .filter((t) => t.currency === c)
        .reduce((sum, t) => sum + t.amount, 0),
    ]),
  );
  const cash = Object.entries(cashByCurrency).reduce(
    (s, [c, n]) => s + (usd(n, c, state.fx) ?? 0),
    0,
  );
  const pendingCash = Object.entries(cashByCurrency).filter(
    ([c, n]) => n !== 0 && usd(n, c, state.fx) == null,
  );
  const sorted = [...groups.values()]
    .sort((a, b) => b.value - a.value)
    .map((g) => ({ ...g, weight: value ? (g.value / value) * 100 : 0 }));
  const reserve = usd(state.goals.reserve || 0, state.goals.currency, state.fx);
  const available = reserve == null ? null : Math.max(0, cash - reserve);
  const total = value + cash;
  const target =
    state.goals.target == null
      ? null
      : usd(state.goals.target, state.goals.currency, state.fx);
  return {
    holdings,
    groups: sorted,
    value,
    cost,
    pnl: value - cost,
    returnPct: cost ? ((value - cost) / cost) * 100 : 0,
    cashByCurrency,
    cash,
    pendingCash,
    unconverted,
    available,
    reserve,
    total,
    target,
    progress: target > 0 ? (total / target) * 100 : null,
  };
}
export function observations(state) {
  const m = calculate(state);
  const out = [];
  if (m.groups[0])
    out.push({
      tone: m.groups[0].weight > state.goals.maxPosition ? "amber" : "blue",
      title: `${m.groups[0].symbol} 占持仓 ${pct(m.groups[0].weight)}`,
      text: `按代码合并两个账户。${state.goals.configured ? "你设置的单一标的提醒线为" : "默认占比提醒线（可修改）为"} ${state.goals.maxPosition}%；ETF 占比不等同于单一公司占比。`,
    });
  if (
    state.holdings.some((h) => h.symbol === "SMH") &&
    state.holdings.some((h) => h.symbol === "SOXX")
  )
    out.push({
      tone: "amber",
      title: "半导体敞口需要合并看",
      text: "SMH 与 SOXX 属于同一行业主题；VOO、QQQM 也可能间接持有相关公司。精确重叠需最新成分股数据，当前未做穿透估算。",
    });
  const unknown = state.holdings.filter((h) => !h.priceDate).length;
  if (unknown)
    out.push({
      tone: "amber",
      title: `${unknown} 条持仓的行情日期待确认`,
      text: "录入日期不等于行情日期。分析基于已保存快照，更新股价时请同时填写报价日期。",
    });
  const mismatch = state.holdings.filter(
    (h) => Math.abs(h.quantity * h.price - h.marketValue) > 0.05,
  );
  if (mismatch.length)
    out.push({
      tone: "blue",
      title: `${mismatch.length} 条市值与股数 × 价格有差异`,
      text: "保留原始市值；可能来自报价时点、四舍五入或截图显示差异。可在编辑时重新计算。",
    });
  if (m.unconverted || m.pendingCash.length)
    out.push({
      tone: "amber",
      title: "存在未折算的币种",
      text: "请填写每 1 单位外币兑换的 USD 金额；美元合计暂不包含缺少汇率的部分。",
    });
  if (!state.goals.target || !state.goals.horizon)
    out.push({
      tone: "blue",
      title: "先让投资目标有一个坐标",
      text: "补齐目标金额、投资期限和应急预留后，AI 才能判断新增资金与现有组合是否匹配。",
    });
  return out;
}
export function contextPack(state, task = "portfolio", question = "") {
  const m = calculate(state);
  return `你是我的投资研究助手。请用中文，以事实、推断、情景假设、待核实项分别标明。当前日期：${new Date().toISOString()}。\n任务：${task === "watch" ? "对关注标的开展研究" : task === "market" ? "市场环境与我的组合适配性" : "分析我的持仓与下一步资金安排"}\n我的问题：${question || "请先识别风险与缺失信息，再给出有条件的行动方案。"}\n\n数据为本地人工录入快照，并非实时行情；截图未显示行情日期，变动百分比周期未知。总市值、浮盈亏不含分红、交易费用、税费与已实现收益；可用资金不是券商余额。cashLedger 为空表示未录入现金，不能据此断定现金为零。汇率为用户手工填写，不得默认为实时。goals.configured 为 false 或缺失时，maxPosition/maxDrawdown 只是界面预填值，不能当成用户风险偏好。\n\n${JSON.stringify({ accounts: state.accounts, holdings: state.holdings, watchlist: state.watchlist, cashLedger: state.cash, goals: state.goals, fxUsdPerUnit: state.fx, journal: state.journal, summary: { valueUSD: m.value, costUSD: m.cost, unrealizedUSD: m.pnl, cashRecorded: state.cash.length > 0, cashUSD: state.cash.length ? m.cash : null, availableUSD: state.cash.length ? m.available : null, unconvertedHoldings: m.unconverted, unconvertedCash: m.pendingCash } }, null, 2)}\n\n研究要求：查证公司名称和证券代码、交易所、币种；结构化输出 identity 对象（name、symbol、exchange、currency、sector），无法确认的值留空，名称歧义时不得猜测证券代码；给出商业模式、竞争力、估值方法、主要风险、催化因素、适合关注的条件与反证条件。核实最新官方资料和财报；报价与统计必须附日期及可点击来源，无法核实明确写未知。不要编造目标价、实时价格、ETF 穿透权重、新闻或回报承诺。分析跨账户重复、行业/因子集中、流动性、资金需求、汇率与可能的税务信息缺口（税务居民地如未提供则为未知）。至少包含保持不动的方案和压力情景，解释哪些额外信息会改变结论。\n\n请交付一份独立、自包含的 UTF-8 HTML 中文研究报告（内联 CSS、移动端可读、来源链接和生成日期，不需要外部脚本），我会保存到 apps/my_holdings/data/reports/${task === "watch" ? "research" : task === "market" ? "market" : "portfolio"}/。如需回填关注卡片，也给出 JSON：{"title":"公司研究","summary":"简述","details":"完整研究","risks":["风险"],"catalysts":["催化因素"],"sources":[{"label":"来源名","url":"https://..."}],"uncertainty":"待核实项"}。`;
}
