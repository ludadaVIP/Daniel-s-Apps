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
  const accountCashBalances = (state.accounts || []).map((account) => ({
    id: account.id,
    name: account.name,
    amount: Number.isFinite(Number(account.cashBalance))
      ? Number(account.cashBalance)
      : 0,
  }));
  const accountCash = accountCashBalances
    .filter((account) => accountId === "all" || account.id === accountId)
    .reduce((sum, account) => sum + account.amount, 0);
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
  const totalCash = accountCash + cash;
  const total = value + totalCash;
  const sorted = [...groups.values()]
    .sort((a, b) => b.value - a.value)
    .map((g) => ({
      ...g,
      weight: total > 0
        ? (g.value / total) * 100
        : 0,
    }));
  const reserve = usd(state.goals.reserve || 0, state.goals.currency, state.fx);
  const available = reserve == null ? null : Math.max(0, cash - reserve);
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
    accountCashBalances,
    accountCash,
    totalCash,
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
      title: `${m.groups[0].symbol} 占总资产 ${pct(m.groups[0].weight)}`,
      text: `按代码合并持仓；证券占比以股票、账户现金和可部署弹药组成的总资产为分母。${state.goals.configured ? `历史记录的提示线为 ${state.goals.maxPosition}%。` : `${state.goals.maxPosition}% 只是界面默认观察线，不代表你的风险上限。`} ETF 占比不等同于单一公司占比。`,
    });
  if (
    state.holdings.some((h) => h.symbol === "SMH") &&
    state.holdings.some((h) => h.symbol === "SOXX")
  )
    out.push({
      tone: "amber",
      title: "半导体敞口需要合并看",
      text: "SMH 与 SOXX 属于同一行业主题，VOO、QQQM 也可能持有相同公司。可在「我的持仓」下方查看个股穿透，按已披露权重合并估算公司敞口；成分日期与行情日期分别标注。",
    });
  const unknown = state.holdings.filter((h) => !h.priceDate).length;
  if (unknown)
    out.push({
      tone: "amber",
      title: `${unknown} 条持仓尚未刷新价格`,
      text: "部分记录仍使用截图价格或买入价暂估；点击「刷新价格」加入待办，优先取美股常规盘、盘前、盘后或可核实夜盘的新鲜报价；没有新鲜报价时回退最近已完成交易日收盘价，并按价格 × 股数重算市值。",
    });
  const mismatch = state.holdings.filter(
    (h) => Math.abs(h.quantity * h.price - h.marketValue) > 0.05,
  );
  if (mismatch.length)
    out.push({
      tone: "blue",
      title: `${mismatch.length} 条市值与股数 × 价格有差异`,
      text: "截图的报价时点与市值可能不同，也可能来自四舍五入。刷新价格后，市值会自动按股数重算。",
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
export function holdingQuoteLabel(holding) {
  if (holding.priceType === "purchase") return "买入价暂估 · 待刷新行情";
  if (holding.priceType === "manual") return `${holding.priceDate || "日期未知"} · ${holding.priceSource || "手动价格"}`;
  if (!holding.priceDate) return "尚未刷新价格";
  const sessionLabels = { regular: "盘中价", premarket: "盘前价", afterhours: "盘后价", overnight: "夜盘价" };
  const type = holding.priceType === "extended"
    ? sessionLabels[holding.priceSession] || "延长时段价"
    : holding.priceType === "intraday" ? "盘中价" : holding.priceType === "close" || holding.priceSource ? "收盘价" : "报价";
  const timeZone = holding.priceTimeZone || "America/New_York";
  const time = holding.priceAsOf ? new Intl.DateTimeFormat("zh-CN", {
    timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).format(new Date(holding.priceAsOf)) : "";
  return `${holding.priceDate} · ${type}${time ? ` ${time} ${timeZone === "Europe/London" ? "伦敦" : "美东"}` : ""}${holding.priceSource ? ` · ${holding.priceSource}` : ""}`;
}
export function contextPack(state, task = "portfolio", question = "") {
  const m = calculate(state);
  const objective = state.goals.objective || state.goals.notes || "";
  const quotes = state.holdings.map((h) => ({
    symbol: h.symbol,
    price: h.price,
    priceDate: h.priceDate || (h.priceType === "purchase" ? "未取得行情（买入价暂估）" : "未知（仍为截图记录）"),
    priceSource: h.priceSource || (h.priceDate ? "未记录来源" : "截图"),
    priceType: h.priceType || (h.priceDate && h.priceSource ? "close" : "unknown"),
    priceSession: h.priceSession || "未记录",
    priceAsOf: h.priceAsOf || "未记录精确报价时间",
    priceFetchedAt: h.priceFetchedAt || "未记录取价时间",
    priceSourceUrl: h.priceSourceUrl || "未记录来源链接",
    averageCostPerShare: h.averagePrice,
    totalCost: h.cost,
    marketValue: h.marketValue,
    quantity: h.quantity,
  }));
  return `你是我的投资研究助手。用中文回答，清楚区分已查证事实、推断、情景假设和待核实项。当前日期：${new Date().toISOString()}。\n任务：${task === "watch" ? "研究近期关注的公司或证券" : task === "market" ? "分析近期市场环境与组合适配性" : "分析我的持仓与下一步资金安排"}\n我的问题：${question || "先识别风险和缺失信息，再给出有条件、可复核的下一步方案。"}\n\n重要口径：持仓的 price 是最近保存的价格快照，可能来自用户手工调整或行情待办。行情待办按执行时刻优先核实美股常规盘实时价；盘前、盘后或可核实的隔夜交易时段优先取该时段最近20分钟内报价，无新鲜可核实报价时回退最近已完成交易日正式收盘价。priceType 为 intraday、extended、close、purchase 或 manual；extended 用 priceSession 区分 premarket、afterhours、overnight，priceAsOf 为来源实际报价时间；close 是未复权正式收盘价。manual 是用户手工调整参考价，purchase 是买入价暂估，不是市场报价。任何保存报价都只是带来源、时段和时间戳的快照，并非持续推送的实时行情；不得把延迟、旧价或来源不明的价称为当前实时价。旧记录未标类型但有 priceDate 和 priceSource 时按历史收盘价理解；priceDate 为空表示没有已核实行情。priceFetchedAt 是回写时间，priceSource / priceSourceUrl 标明来源。averagePrice 是持仓成本均价；追加买入后按累计 cost / quantity 计算，历史未变动记录保留原始截图均价。cost 是累计录入总成本，新增买入包含已录入费用。holdingTrades 保存买入或合并前记录，并非券商完整成交历史。marketValue 在自动报价刷新、手动改价或追加买入后按保存价格 × 股数更新；无市场报价的新持仓按买入价暂估，未变动的历史记录保留截图市值。变动百分比周期未知，不用于累计收益。浮动盈亏按保存市值减累计录入成本计算，成本包含已录入的买入费用；未录入的分红、费用、税费和已实现收益不在其中。每个账户的 cashBalance 是手工记录的 USD 现金余额快照，计入总资产、组合配置比例和目标进度；账户现金不会自动随买入变动。资金流水是独立的可部署弹药池，只用它计算可部署金额；账户现金与弹药都分别计入总资产，不能把账户现金重复算成可部署弹药。目标是用户自己写的文字；旧字段 maxPosition/maxDrawdown 是历史默认值，不代表用户风险偏好。\n\n当前报价与成本：\n${JSON.stringify(quotes, null, 2)}\n\n投资目标：${objective || "尚未填写"}\n\n${JSON.stringify({ accounts: state.accounts, holdings: state.holdings, holdingTrades: state.holdingTrades || [], watchlist: state.watchlist, orders: state.orders || [], converter: state.converter, cashLedgerUsd: state.cash, goals: { objective }, pendingTasks: (state.jobs || []).filter((j) => j.status === "waiting"), journal: state.journal, summary: { valueUSD: m.value, costUSD: m.cost, unrealizedUSD: m.pnl, cashRecorded: state.cash.length > 0, cashUSD: state.cash.length ? m.cash : null, deployableLedgerUSD: m.cash, accountCashUSD: m.accountCash, totalCashUSD: m.totalCash, totalAssetsUSD: m.total, availableUSD: state.cash.length ? m.available : null } }, null, 2)}\n\n近期关注的价格与研究分开：watch-quotes 仅更新价格，不生成 HTML 或改写研究；watch 的 researchMode=initial 只在完整研究缺失时补充，researchMode=refresh 才是用户明确要求的新研究。已有完整研究应保留。\n\n研究要求：核实代码、名称、交易所、币种，优先使用公司公告、监管文件、基金发行方与交易所资料；需要最新市场数据时联网查证并注明时间与来源。说明商业模式、关键竞争力、估值思路、主要风险、可能的催化因素、支持与反证条件。分析账户间重复、组合集中和主题重叠；没有最新成分数据时不得编造 ETF 穿透权重。税务居民地或未来资金需求未提供时标明未知。给出保持不动与条件式备选方案，说明什么新信息会改变结论；不代替用户下单，不作收益承诺，不虚构目标价或实时价格。\n\n完成研究类待办时，请把独立、自包含的 UTF-8 中文 HTML（内联 CSS、来源链接、日期、无需外部脚本）保存到 apps/my_holdings/data/reports/${task === "watch" ? "research" : task === "market" ? "market" : "portfolio"}/。若有结构化研究，另附 research JSON：{"identity":{"name":"","symbol":"","exchange":"","currency":"","sector":""},"title":"研究标题","summary":"简述","details":"完整研究","risks":["风险"],"catalysts":["催化因素"],"sources":[{"label":"来源名","url":"https://..."}],"uncertainty":"待核实项"}。完成或无法完成时，通过本机应用 API 回写任务状态。`;
}
