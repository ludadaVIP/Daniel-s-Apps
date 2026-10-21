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
      text: `按代码合并两个账户。${state.goals.configured ? `历史记录的提示线为 ${state.goals.maxPosition}%。` : `${state.goals.maxPosition}% 只是界面默认观察线，不代表你的风险上限。`} ETF 占比不等同于单一公司占比。`,
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
      title: `${unknown} 条持仓尚未刷新收盘价`,
      text: "当前价格仍是截图时记录的值；点击「刷新收盘价」后，市值会按最近完整交易日收盘价重算。",
    });
  const mismatch = state.holdings.filter(
    (h) => Math.abs(h.quantity * h.price - h.marketValue) > 0.05,
  );
  if (mismatch.length)
    out.push({
      tone: "blue",
      title: `${mismatch.length} 条市值与股数 × 价格有差异`,
      text: "截图的报价时点与市值可能不同，也可能来自四舍五入。刷新最近收盘价后，市值会自动按股数重算。",
    });
  if (m.unconverted || m.pendingCash.length)
    out.push({
      tone: "amber",
      title: "存在未折算的币种",
      text: "请填写每 1 单位外币兑换的 USD 金额；美元合计暂不包含缺少汇率的部分。",
    });
  if (!(state.goals.objective || state.goals.notes || "").trim())
    out.push({
      tone: "blue",
      title: "先写下你的投资目标",
      text: "用自己的话说明资金要支持什么，后续组合分析就能围绕这个目标展开。",
    });
  return out;
}
export function contextPack(state, task = "portfolio", question = "") {
  const m = calculate(state);
  const objective = state.goals.objective || state.goals.notes || "";
  const quotes = state.holdings.map((h) => ({
    symbol: h.symbol,
    price: h.price,
    priceDate: h.priceDate || "未知（仍为截图记录）",
    priceSource: h.priceSource || (h.priceDate ? "未记录来源" : "截图"),
    averageCostPerShare: h.averagePrice,
    screenshotTotalCost: h.cost,
    marketValue: h.marketValue,
    quantity: h.quantity,
  }));
  return `你是我的投资研究助手。用中文回答，清楚区分已查证事实、推断、情景假设和待核实项。当前日期：${new Date().toISOString()}。\n任务：${task === "watch" ? "研究近期关注的公司或证券" : task === "market" ? "分析近期市场环境与组合适配性" : "分析我的持仓与下一步资金安排"}\n我的问题：${question || "先识别风险和缺失信息，再给出有条件、可复核的下一步方案。"}\n\n重要口径：持仓的 price 是用户最近一次点击刷新后取得的最近完整美股交易日收盘价；priceDate 为空表示仍是截图中的旧值，不可称为当前行情。priceSource 标明报价来源。averagePrice 是 IBKR 截图的每股平均成本；cost 是截图总成本。marketValue 在报价刷新后按收盘价 × 股数更新，未刷新前是截图市值。变动百分比周期未知，不用于累计收益。浮动盈亏不含分红、费用、税费或已实现收益。弹药只记 USD，是个人手工记录，不是券商余额；空流水表示尚未录入。目标是用户自己写的文字；旧字段 maxPosition/maxDrawdown 是历史默认值，不代表用户风险偏好。\n\n当前报价与成本：\n${JSON.stringify(quotes, null, 2)}\n\n投资目标：${objective || "尚未填写"}\n\n${JSON.stringify({ accounts: state.accounts, holdings: state.holdings, watchlist: state.watchlist, converter: state.converter, cashLedgerUsd: state.cash, goals: { objective }, pendingTasks: (state.jobs || []).filter((j) => j.status === "waiting"), journal: state.journal, summary: { valueUSD: m.value, costUSD: m.cost, unrealizedUSD: m.pnl, cashRecorded: state.cash.length > 0, cashUSD: state.cash.length ? m.cash : null, availableUSD: state.cash.length ? m.available : null } }, null, 2)}\n\n研究要求：核实代码、名称、交易所、币种，优先使用公司公告、监管文件、基金发行方与交易所资料；需要最新市场数据时联网查证并注明时间与来源。说明商业模式、关键竞争力、估值思路、主要风险、可能的催化因素、支持与反证条件。分析账户间重复、组合集中和主题重叠；没有最新成分数据时不得编造 ETF 穿透权重。税务居民地或未来资金需求未提供时标明未知。给出保持不动与条件式备选方案，说明什么新信息会改变结论；不代替用户下单，不作收益承诺，不虚构目标价或实时价格。\n\n完成待办时，请把独立、自包含的 UTF-8 中文 HTML（内联 CSS、来源链接、日期、无需外部脚本）保存到 apps/my_holdings/data/reports/${task === "watch" ? "research" : task === "market" ? "market" : "portfolio"}/。若有结构化研究，另附 research JSON：{"identity":{"name":"","symbol":"","exchange":"","currency":"","sector":""},"title":"研究标题","summary":"简述","details":"完整研究","risks":["风险"],"catalysts":["催化因素"],"sources":[{"label":"来源名","url":"https://..."}],"uncertainty":"待核实项"}。完成或无法完成时，通过本机应用 API 回写任务状态。`;
}
