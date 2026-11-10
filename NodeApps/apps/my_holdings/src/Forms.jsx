import { useEffect, useRef, useState } from "react";
import { X, Save } from "lucide-react";
import { id, money, CURRENCIES } from "./model.js";
import { previewBuy, roundMoney } from "./positions.js";
import { findDuplicateWatch, normalizeWatchSymbol, symbolFromWatchInput } from "./watch-identity.js";
import { localDate } from "./api.js";
const TRADE_TIME_ZONES = [
  ["Pacific/Auckland", "新西兰时间"],
  ["America/New_York", "美东时间"],
  ["UTC", "UTC"],
  ["Europe/London", "伦敦时间"],
  ["Asia/Hong_Kong", "香港时间"],
  ["exchange-local", "交易所当地时间"],
  ["other", "其他 / 未确定"],
];
export function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef();
  useEffect(() => {
    const prev = document.activeElement;
    const node = ref.current;
    node.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = [
          ...node.querySelectorAll(
            'button,input,textarea,select,a[href],[tabindex="0"]',
          ),
        ].filter((n) => !n.disabled);
        if (!nodes.length) {
          e.preventDefault();
          return;
        }
        const first = nodes[0],
          last = nodes.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === node)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      prev?.focus();
    };
  }, []);
  return (
    <div
      className="mh-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className={`mh-modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <header>
          <div>
            <span className="mh-eyebrow">MY HOLDINGS</span>
            <h2>{title}</h2>
          </div>
          <button className="mh-icon" aria-label="关闭" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
export function Field({ label, children, hint }) {
  return (
    <label className="mh-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function BuyForm({ holding, holdings, accounts, defaultAccountId, onSave, busy }) {
  const [v, set] = useState(() => ({ id: id(), accountId: holding?.accountId || defaultAccountId || accounts[0].id,
    symbol: holding?.symbol || "", currency: holding?.currency || "USD", quantity: "", price: "", fees: 0, date: localDate(), time: "", timeZone: "Pacific/Auckland", orderType: "market", limitPrice: "", rationale: "" }));
  const change = (key, value) => set((current) => ({ ...current, [key]: value }));
  const preview = previewBuy(holdings, v);
  const accountName = accounts.find((account) => account.id === v.accountId)?.name;
  const ready = Number(v.quantity) > 0 && Number(v.price) > 0;
  const symbols = [...new Map(holdings.map((h) => [h.symbol, h])).values()];
  return <form onSubmit={(event) => {
    event.preventDefault();
    onSave({ ...v, quantity: Number(v.quantity), price: Number(v.price), fees: Number(v.fees || 0), decision: { orderType: v.orderType, limitPrice: v.orderType === "limit" ? Number(v.limitPrice) : null, body: v.rationale.trim() } });
  }}>
    <p className="mh-help">记录已成交买入并同步保存理由。持仓与成本按成交数量、成交均价和费用重算；交易日志不会重复计入持仓。</p>
    <div className="mh-form-grid">
      <Field label="账户"><select value={v.accountId} onChange={(e) => change("accountId", e.target.value)}>{accounts.map((a) => <option value={a.id} key={a.id}>{a.name}</option>)}</select></Field>
      <Field label="证券代码"><input required autoFocus maxLength={40} list="mh-buy-symbols" placeholder="例如 QQQM" value={v.symbol} onChange={(e) => change("symbol", e.target.value.toUpperCase())} /><datalist id="mh-buy-symbols">{symbols.map((h) => <option key={h.symbol} value={h.symbol}>{h.name}</option>)}</datalist></Field>
      <Field label="本次买入股数"><input required type="number" min="0.00000001" max="100000000000000" step="any" placeholder="例如 50" value={v.quantity} onChange={(e) => change("quantity", e.target.value)} /></Field>
      <Field label={`买入单价 · ${v.currency}`}><input required type="number" min="0.00000001" max="100000000000000" step="any" placeholder="例如 290" value={v.price} onChange={(e) => change("price", e.target.value)} /></Field>
      <Field label={`本次费用 · ${v.currency}`} hint="可留空；计入买入总成本"><input type="number" min="0" max="100000000000000" step="any" value={v.fees} onChange={(e) => change("fees", e.target.value)} /></Field>
      <Field label="成交日期"><input required type="date" value={v.date} onChange={(e) => change("date", e.target.value)} /></Field>
      <Field label="成交时间（可选）"><input type="time" value={v.time} onChange={(e) => change("time", e.target.value)} /></Field>
      <Field label="时间所属时区"><select value={v.timeZone} onChange={(e) => change("timeZone", e.target.value)}>{TRADE_TIME_ZONES.map(([zone, label]) => <option key={zone} value={zone}>{label}</option>)}</select></Field>
      <Field label="交易币种"><select value={v.currency} onChange={(e) => change("currency", e.target.value)}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></Field>
      <Field label="成交方式"><select value={v.orderType} onChange={(e) => change("orderType", e.target.value)}><option value="market">市价单成交</option><option value="limit">限价单成交</option></select></Field>
      {v.orderType === "limit" && <Field label={`限价 · ${v.currency}`}><input required type="number" min="0.000001" max="100000000000000" step="any" value={v.limitPrice} onChange={(e) => change("limitPrice", e.target.value)} placeholder="例如 285" /></Field>}
    </div>
    {v.symbol.trim() && <section className="mh-buy-preview" aria-live="polite">
      <strong>{preview.existing ? `追加到 ${accountName} · ${preview.existing.symbol}` : `在 ${accountName} 建立 ${v.symbol.trim()} 持仓`}</strong>
      <p>{preview.existing ? `已有 ${preview.existing.quantity} 股 · 总成本 ${money(preview.existing.cost, v.currency)}` : "其他账户的同名证券分别保留。"}</p>
      {ready && <dl>
        <div><dt>买入后股数</dt><dd>{preview.quantity} 股</dd></div>
        <div><dt>本次计入成本</dt><dd>{money(preview.addedCost, v.currency)}</dd></div>
        <div><dt>买入后总成本</dt><dd>{money(preview.cost, v.currency)}</dd></div>
        <div><dt>买入后成本均价</dt><dd>{money(preview.averagePrice, v.currency)}</dd></div>
      </dl>}
      <p>{preview.quote ? `市值沿用已保存报价 ${money(preview.quote.price, v.currency)}${preview.quote.priceDate ? `（${preview.quote.priceDate}）` : "（截图记录）"}。` : "尚无行情报价，将按买入价暂估市值，并标注待刷新。"}</p>
    </section>}
    <Field label="为什么做这笔买入？" hint="这段理由会和成交数量、价格、费用、账户及关联标的一起进入决策日志。">
      <textarea required rows={4} maxLength={20000} value={v.rationale} onChange={(event) => change("rationale", event.target.value)} placeholder="记录买入依据、触发条件、反面证据，以及什么变化会推翻判断。" />
    </Field>
    <p className="mh-help">资金台账由你另行记录；填写交易理由不会自动调整现金或弹药余额。</p>
    <SaveButton busy={busy} label={preview.existing ? "确认追加买入" : "保存买入"} />
  </form>;
}
export function HoldingTradeForm({ item, holding, onSave, busy }) {
  const isAdjustment = item.type === "adjustment";
  const [v, set] = useState(() => isAdjustment
    ? { quantity: String(item.quantity), cost: String(item.cost), date: item.date || localDate() }
    : { quantity: String(item.quantity), price: String(item.price), fees: String(item.fees || 0), date: item.date || localDate() });
  const change = (key, value) => set((current) => ({ ...current, [key]: value }));
  const batchCost = isAdjustment ? Number(v.cost || 0) : Number(v.quantity || 0) * Number(v.price || 0) + Number(v.fees || 0);
  return <form onSubmit={(event) => {
    event.preventDefault();
    onSave(isAdjustment
      ? { quantity: Number(v.quantity), cost: Number(v.cost), date: v.date }
      : { quantity: Number(v.quantity), price: Number(v.price), fees: Number(v.fees || 0), date: v.date });
  }}>
    <p className="mh-help">{isAdjustment
      ? "这是旧版总持仓与买入记录之间的历史差额。可用正负数调整股数和成本，保存后会同步重算持仓。"
      : `编辑 ${holding.symbol} 的这笔记录；保存后股数、成本均价、市值和组合汇总会同步重算。`}</p>
    <div className="mh-form-grid">
      <Field label={isAdjustment ? "股数变化（可正可负）" : "本批股数"}>
        <input autoFocus required type="number" step="any" min={isAdjustment ? -100000000000000 : 0.00000001} max="100000000000000" value={v.quantity} onChange={(event) => change("quantity", event.target.value)} />
      </Field>
      {isAdjustment ? <Field label={`成本变化 · ${holding.currency}`} hint="正数增加总成本，负数减少总成本">
        <input required type="number" step="any" min="-100000000000000" max="100000000000000" value={v.cost} onChange={(event) => change("cost", event.target.value)} />
      </Field> : <>
        <Field label={`买入单价 · ${holding.currency}`}>
          <input required type="number" step="any" min="0.00000001" max="100000000000000" value={v.price} onChange={(event) => change("price", event.target.value)} />
        </Field>
        <Field label={`交易费用 · ${holding.currency}`} hint="计入这笔买入的总成本">
          <input type="number" step="any" min="0" max="100000000000000" value={v.fees} onChange={(event) => change("fees", event.target.value)} />
        </Field>
      </>}
      <Field label="记录日期">
        <input required type="date" value={v.date} onChange={(event) => change("date", event.target.value)} />
      </Field>
    </div>
    <div className={`mh-trade-edit-preview ${batchCost < 0 ? "negative" : ""}`}>
      <span>{isAdjustment ? "成本调整" : "本批总成本"}</span>
      <strong>{money(batchCost, holding.currency)}</strong>
    </div>
    <SaveButton busy={busy} label="保存批次" />
  </form>;
}
export function HoldingPriceForm({ holding, onSave, busy }) {
  const [price, setPrice] = useState(String(holding.price ?? ""));
  const [priceDate, setPriceDate] = useState(holding.priceDate || localDate());
  const [basis, setBasis] = useState("盘后参考");
  return <form onSubmit={(event) => {
    event.preventDefault();
    const nextPrice = Number(price);
    onSave({
      price: nextPrice,
      marketValue: roundMoney(Number(holding.quantity) * nextPrice),
      priceDate,
      priceType: "manual",
      priceSource: `手动调整 · ${basis}`,
    });
  }}>
    <p className="mh-help">适合记录盘后波动或临时参考价。保存后会按持仓股数重算市值，成本不变；此价格会标为手动调整，不会伪装成自动行情。</p>
    <div className="mh-form-grid">
      <Field label={`当前价格（${holding.currency}）`}><input autoFocus required type="number" min="0.000001" max="100000000000000" step="any" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} /></Field>
      <Field label="价格对应日期" hint={holding.priceDate ? "默认保留当前报价日期，请按新价格对应的交易日修改。" : "尚无已知报价日期，请选择新价格对应的交易日。"}><input type="date" required value={priceDate} onChange={(event) => setPriceDate(event.target.value)} /></Field>
      <Field label="手动价格类型"><select value={basis} onChange={(event) => setBasis(event.target.value)}><option>盘后参考</option><option>盘中手动更新</option><option>手动收盘价</option><option>其他手动价格</option></select></Field>
    </div>
    <SaveButton busy={busy} label="保存当前价格" />
  </form>;
}
export function SaveButton({ busy, disabled = false, label = "保存到本地" }) {
  return (
    <footer className="mh-form-footer">
      <span>保存后自动保留历史备份</span>
      <button className="mh-primary" disabled={busy || disabled}>
        <Save size={16} />
        {busy ? "正在保存…" : label}
      </button>
    </footer>
  );
}
export function WatchForm({ item, onSave, busy, watchlist = [] }) {
  const [v, set] = useState(
    item || {
      id: id(),
      name: "",
      symbol: "",
      note: "",
      trigger: "",
      status: "观察中",
      attention: 2,
    },
  );
  const change = (k, value) => set((s) => ({ ...s, [k]: value }));
  const input = v.name || v.symbol;
  const candidate = { ...v, name: input.trim(), symbol: symbolFromWatchInput(input) || normalizeWatchSymbol(v.symbol) };
  const duplicate = findDuplicateWatch(watchlist, candidate);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!duplicate) onSave(candidate);
      }}
    >
      <Field label="公司名称或股票代码">
        <input
          required
          maxLength={300}
          placeholder="例如：Microsoft 或 MSFT"
          value={input}
          onChange={(e) => set((s) => ({ ...s, name: e.target.value, symbol: "" }))}
        />
      </Field>
      <Field label="业务简介（可选）" hint="写清客户、产品或收入来源；留空时优先显示公司资料，未知标的会显示待补充。">
        <input maxLength={300} value={v.businessSummary || ''} onChange={e => change('businessSummary', e.target.value)} placeholder="例如：为餐厅提供收银软件并收取支付手续费" />
      </Field>
      {duplicate && <p className="mh-help" role="alert">{duplicate.symbol || duplicate.name} 已在关注列表中，请编辑已有卡片。</p>}
      <SaveButton busy={busy} disabled={Boolean(duplicate)} label={item ? "保存关注" : "添加并排入待办"} />
    </form>
  );
}
export function CashForm({ item, onSave, busy }) {
  const [v, set] = useState(
    item
      ? {
          ...item,
          amount: Math.abs(item.amount),
          direction: item.amount < 0 ? "out" : "in",
        }
      : {
          id: id(),
          amount: "",
          currency: "USD",
          date: localDate(),
          kind: "工资收入",
          note: "",
          direction: "in",
        },
  );
  const change = (k, value) => set((s) => ({ ...s, [k]: value }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const { direction, ...row } = v;
        onSave({
          ...row,
          currency: "USD",
          amount: Number(v.amount) * (direction === "out" ? -1 : 1),
        });
      }}
    >
      <div className="mh-form-grid">
        <Field label="方向">
          <select
            value={v.direction}
            onChange={(e) => change("direction", e.target.value)}
          >
            <option value="in">收入 / 新增可投资金</option>
            <option value="out">支出 / 投资拨款</option>
          </select>
        </Field>
        <Field label="金额（USD）">
          <input
            required
            type="number"
            step="any"
            min="0.01"
            value={v.amount}
            onChange={(e) => change("amount", e.target.value)}
          />
        </Field>
        <Field label="日期">
          <input
            type="date"
            required
            value={v.date}
            onChange={(e) => change("date", e.target.value)}
          />
        </Field>
        <Field label="来源 / 用途">
          <input
            required
            maxLength={100}
            value={v.kind}
            onChange={(e) => change("kind", e.target.value)}
          />
        </Field>
      </div>
      <Field label="备注">
        <textarea
          maxLength={2000}
          value={v.note}
          onChange={(e) => change("note", e.target.value)}
          placeholder="这笔钱的安排或限制"
        />
      </Field>
      <p className="mh-help">
        资金流水是独立的可部署弹药池。买入时记一笔投资拨款；如果同步维护账户现金快照，也要手动扣减相应余额，以免重复计入资产。
      </p>
      <SaveButton busy={busy} />
    </form>
  );
}
export function OrderForm({ item, watchlist, accounts, defaultAccountId, onSave, busy }) {
  const [v, set] = useState(() => item ? {
    ...item,
    accountId: item.accountId || defaultAccountId || accounts[0]?.id || "",
    quantity: String(item.quantity),
    filledQuantity: String(item.filledQuantity ?? 0),
    limitPrice: item.limitPrice == null ? "" : String(item.limitPrice),
  } : {
    id: id(), watchId: "", symbol: "", exchange: "", name: "", side: "buy", orderType: "limit",
    quantity: "", filledQuantity: "0", limitPrice: "", currency: "USD", timeInForce: "GTC",
    status: "draft", brokerStatus: "", submittedAtText: "", accountId: defaultAccountId || accounts[0]?.id || "", note: "", source: "手工记录",
  });
  const change = (key, value) => set((current) => ({ ...current, [key]: value }));
  const chooseWatch = (watchId) => {
    const watch = watchlist.find((row) => row.id === watchId);
    set((current) => ({
      ...current,
      watchId,
      ...(watch ? {
        symbol: watch.symbol || watch.name || current.symbol,
        exchange: watch.research?.identity?.exchange || current.exchange,
        name: watch.research?.identity?.name || watch.name || current.name,
        currency: watch.priceCurrency || watch.research?.identity?.currency || current.currency || "USD",
      } : {}),
    }));
  };
  return <form onSubmit={(event) => {
    event.preventDefault();
    onSave({ ...v, symbol: v.symbol.trim().toUpperCase(), name: v.name.trim() || v.symbol.trim().toUpperCase(),
      quantity: Number(v.quantity), filledQuantity: Number(v.filledQuantity || 0),
      limitPrice: v.orderType === "limit" ? Number(v.limitPrice) : null });
  }}>
    <p className="mh-help">仅记录潜在委托与成交进度，不会向券商提交、修改或撤销订单。</p>
    <div className="mh-form-grid">
      <Field label="关联近期关注"><select value={v.watchId} onChange={(event) => chooseWatch(event.target.value)}>
        <option value="">不关联</option>
        {watchlist.map((watch) => <option key={watch.id} value={watch.id}>{watch.symbol || watch.name} · {watch.name}</option>)}
      </select></Field>
      <Field label="证券代码"><input required maxLength={40} value={v.symbol} onChange={(event) => change("symbol", event.target.value.toUpperCase())} placeholder="例如 GOOG" /></Field>
      <Field label="交易所"><input maxLength={80} value={v.exchange} onChange={(event) => change("exchange", event.target.value)} placeholder="例如 NASDAQ.NMS" /></Field>
      <Field label="名称"><input maxLength={300} value={v.name} onChange={(event) => change("name", event.target.value)} placeholder="公司或基金名称" /></Field>
      <Field label="方向"><select value={v.side} onChange={(event) => change("side", event.target.value)}><option value="buy">买入</option><option value="sell">卖出</option></select></Field>
      <Field label="订单类型"><select value={v.orderType} onChange={(event) => change("orderType", event.target.value)}><option value="limit">限价单</option><option value="market">市价单</option></select></Field>
      {v.orderType === "limit" && <Field label={`限价（${v.currency}）`}><input required type="number" min="0.000001" max="100000000000000" step="any" value={v.limitPrice} onChange={(event) => change("limitPrice", event.target.value)} placeholder="例如 275" /></Field>}
      <Field label="委托数量"><input required type="number" min="0.00000001" max="100000000000000" step="any" value={v.quantity} onChange={(event) => change("quantity", event.target.value)} /></Field>
      <Field label="已成交数量"><input required type="number" min="0" max="100000000000000" step="any" value={v.filledQuantity} onChange={(event) => change("filledQuantity", event.target.value)} /></Field>
      <Field label="币种"><select value={v.currency} onChange={(event) => change("currency", event.target.value)}>{CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select></Field>
      <Field label="有效期"><select value={v.timeInForce} onChange={(event) => change("timeInForce", event.target.value)}><option value="GTC">GTC · 撤销前有效</option><option value="DAY">DAY · 当日有效</option><option value="GTD">GTD · 指定日期前有效</option><option value="IOC">IOC · 立即成交或取消</option><option value="FOK">FOK · 全部成交或取消</option></select></Field>
      <Field label="台账状态"><select value={v.status} onChange={(event) => change("status", event.target.value)}><option value="draft">计划中</option><option value="working">委托中</option><option value="partial">部分成交</option><option value="filled">已成交</option><option value="cancelled">已撤销</option><option value="rejected">已拒绝</option><option value="expired">已过期</option></select></Field>
      <Field label="券商状态"><input maxLength={100} value={v.brokerStatus} onChange={(event) => change("brokerStatus", event.target.value)} placeholder="例如 PreSubmitted" /></Field>
      <Field label="提交时间（按原始显示记录）"><input maxLength={100} value={v.submittedAtText} onChange={(event) => change("submittedAtText", event.target.value)} placeholder="例如 2026/10/28 21:47" /></Field>
      <Field label="账户"><select value={v.accountId} onChange={(event) => change("accountId", event.target.value)}><option value="">未指定</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></Field>
      <Field label="记录来源"><input maxLength={100} value={v.source} onChange={(event) => change("source", event.target.value)} placeholder="手工记录或截图导入" /></Field>
    </div>
    <Field label="备注"><textarea maxLength={2000} value={v.note} onChange={(event) => change("note", event.target.value)} placeholder="记录计划依据、条件或需核实的信息" /></Field>
    <SaveButton busy={busy} label={item ? "保存委托记录" : "记录委托"} />
  </form>;
}
export function OrderFillForm({ order, accounts, defaultAccountId, onSave, busy }) {
  const [v, set] = useState(() => ({
    accountId: order.accountId || defaultAccountId || accounts[0]?.id || "",
    price: order.status === "partial" || order.orderType !== "limit" || order.limitPrice == null
      ? ""
      : String(order.limitPrice),
    fees: "0",
    date: localDate(),
    rationale: String(order.note || ""),
  }));
  const change = (key, value) => set((current) => ({ ...current, [key]: value }));
  const quantity = Number(order.quantity || 0);
  const previouslyFilled = Number(order.filledQuantity || 0);
  return <form onSubmit={(event) => {
    event.preventDefault();
    onSave({ ...v, price: Number(v.price), fees: Number(v.fees || 0) });
  }}>
    <p className="mh-help">确认后会把整笔买入委托记成持仓批次，并从待办委托中移除。此操作只更新本地台账。</p>
    <section className="mh-order-fill-summary">
      <div><small>委托标的</small><strong>{order.symbol} · {order.name || order.symbol}</strong></div>
      <div><small>本次并入股数</small><strong>{quantity.toLocaleString("en-US", { maximumFractionDigits: 8 })} 股</strong></div>
      {previouslyFilled > 0 && <p>委托中已有 {previouslyFilled.toLocaleString("en-US", { maximumFractionDigits: 8 })} 股标为部分成交；本次按整笔 {quantity.toLocaleString("en-US", { maximumFractionDigits: 8 })} 股入账。请填写整笔委托的加权成交均价。</p>}
    </section>
    <div className="mh-form-grid">
      <Field label="计入账户"><select required value={v.accountId} onChange={(event) => change("accountId", event.target.value)}>
        {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
      </select></Field>
      <Field label="实际成交日期"><input required type="date" value={v.date} onChange={(event) => change("date", event.target.value)} /></Field>
      <Field label={`实际成交均价 · ${order.currency}`} hint={order.status === "partial" ? "填写整笔委托的加权平均成交价。" : order.orderType === "limit" ? "默认使用限价；若成交价不同，请改成实际均价。" : "市价单请填券商成交回报中的均价。"}>
        <input required type="number" min="0.000001" max="100000000000000" step="any" value={v.price} onChange={(event) => change("price", event.target.value)} placeholder="填写成交均价" />
      </Field>
      <Field label={`成交费用 · ${order.currency}`} hint="计入这笔买入批次的总成本。">
        <input type="number" min="0" max="100000000000000" step="any" value={v.fees} onChange={(event) => change("fees", event.target.value)} />
      </Field>
    </div>
    <Field label="交易理由（可选）">
      <textarea rows={3} maxLength={20000} value={v.rationale} onChange={(event) => change("rationale", event.target.value)} placeholder="留空时会自动记录为从委托单确认成交。" />
    </Field>
    <p className="mh-help">持仓均价与市值会同步重算；账户现金快照和弹药台账仍按原方式单独维护。</p>
    <SaveButton busy={busy} label="确认成交并入持仓" />
  </form>;
}
export function AccountCashForm({ account, onSave, busy }) {
  const [amount, setAmount] = useState(String(account?.cashBalance ?? 0));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(Number(amount));
      }}
    >
      <Field label="当前现金余额（USD）" hint="计入账户资产和现金比例；不影响可部署弹药与资金流水。">
        <input
          required
          type="number"
          min="0"
          max="100000000000000"
          step="0.01"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="例如：12500.00"
        />
      </Field>
      <p className="mh-help">这是账户当前现金余额快照。转入股票后，请同步更新现金余额；买卖流水不会自动修改这个数字。</p>
      <SaveButton busy={busy} label="保存现金余额" />
    </form>
  );
}

export function GoalsForm({ state, onSave, busy }) {
  const [objective, setObjective] = useState(
    state.goals.objective || state.goals.notes || "",
  );
  const [target, setTarget] = useState(
    state.goals.target == null ? "" : String(state.goals.target),
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          goals: {
            ...state.goals,
            currency: "USD",
            target: target === "" ? null : Number(target),
            objective,
            notes: objective,
          },
        });
      }}
    >
      <Field
        label="金额目标（USD）"
        hint="按账户总资产计算进度；留空保存可取消金额目标。"
      >
        <input
          type="number"
          min="0.01"
          max="100000000000000"
          step="any"
          inputMode="decimal"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="例如：500000"
        />
      </Field>
      <Field label="你希望这笔投资最终帮你实现什么？">
        <textarea
          rows={5}
          maxLength={5000}
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="例如：长期积累退休资产，同时保留未来几年买房所需的资金。"
        />
      </Field>
      <p className="mh-help">目标可以随时修改；总资产进度会同步显示在总览和本页。</p>
      <SaveButton busy={busy} label="保存目标" />
    </form>
  );
}
export function JournalForm({ item, watchlist = [], holdings = [], instrument, onSave, busy }) {
  const [v, set] = useState(() => item || { id: id(), date: localDate(), title: "", body: "", watchId: "", holdingId: "", symbol: "", name: "", ...instrumentSeed(instrument) });
  const [linkValue, setLinkValue] = useState(() => linkedInstrumentValue(item) || instrumentSeedValue(instrument));
  const changeLink = (value) => {
    setLinkValue(value);
    const instrument = linkedInstrument(value, watchlist, holdings);
    if (!instrument) {
      set((current) => ({ ...current, watchId: "", holdingId: "" }));
      return;
    }
    const isWatch = value.startsWith("watch:");
    set((current) => ({ ...current, watchId: isWatch ? instrument.id : "", holdingId: isWatch ? "" : instrument.id,
      symbol: instrument.symbol || instrument.name || "", name: instrument.name || instrument.symbol || "" }));
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...v, title: v.title.trim(), body: v.body.trim(), symbol: (v.symbol || "").trim().toUpperCase(), name: (v.name || "").trim() });
      }}
    >
      <div className="mh-form-grid">
        <Field label="日期">
          <input type="date" required value={v.date} onChange={(e) => set({ ...v, date: e.target.value })} />
        </Field>
        <Field label="决策 / 复盘标题">
          <input required maxLength={300} value={v.title} onChange={(e) => set({ ...v, title: e.target.value })} placeholder="例如：为什么这次选择继续持有" />
        </Field>
        <InstrumentLinkField value={linkValue} watchlist={watchlist} holdings={holdings} onChange={changeLink} />
      </div>
      {(linkValue === "custom" || !linkValue) && <div className="mh-form-grid">
        <Field label="关联代码（可选）"><input maxLength={40} value={v.symbol || ""} onChange={(event) => set({ ...v, symbol: event.target.value.toUpperCase() })} placeholder="例如 QQQM" /></Field>
        <Field label="标的名称（可选）"><input maxLength={300} value={v.name || ""} onChange={(event) => set({ ...v, name: event.target.value })} placeholder="用于保留关联快照" /></Field>
      </div>}
      <Field label="当时的判断、反证与后续结果">
        <textarea
          required
          rows={9}
          maxLength={20000}
          value={v.body}
          onChange={(e) => set({ ...v, body: e.target.value })}
          placeholder={
            "行动：\n理由和证据：\n如果判断错了，会发生什么：\n下次复盘日期：\n后续结果："
          }
        />
      </Field>
      <SaveButton busy={busy} />
    </form>
  );
}

function linkedInstrumentValue(item) {
  if (item?.watchId) return `watch:${item.watchId}`;
  if (item?.holdingId) return `holding:${item.holdingId}`;
  return item?.symbol ? "custom" : "";
}

function linkedInstrument(value, watchlist, holdings) {
  if (!value) return null;
  const [kind, instrumentId] = value.split(":", 2);
  if (kind === "watch") return watchlist.find((item) => item.id === instrumentId) || null;
  if (kind === "holding") return holdings.find((item) => item.id === instrumentId) || null;
  return null;
}

function instrumentSeed(instrument) {
  const item = instrument?.item;
  if (!item) return {};
  const isWatch = instrument.kind === "watch";
  return {
    watchId: isWatch ? item.id : "", holdingId: isWatch ? "" : item.id,
    symbol: item.symbol || item.name || "", name: item.name || item.symbol || "",
    currency: (isWatch ? item.priceCurrency || item.research?.quote?.currency || item.research?.identity?.currency : item.currency) || "USD",
  };
}

function instrumentSeedValue(instrument) {
  return instrument?.item?.id ? `${instrument.kind}:${instrument.item.id}` : "";
}

function InstrumentLinkField({ value, watchlist, holdings, onChange }) {
  return <Field label="关联标的" hint="可关联近期关注或持仓；选择后会同步代码、名称和币种。">
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">不关联标的</option>
      <option value="custom">自定义标的</option>
      {watchlist.length > 0 && <optgroup label="近期关注">
        {watchlist.map((item) => <option key={`watch-${item.id}`} value={`watch:${item.id}`}>{item.symbol || item.name} · {item.name || "关注标的"}</option>)}
      </optgroup>}
      {holdings.length > 0 && <optgroup label="我的持仓">
        {holdings.map((item) => <option key={`holding-${item.id}`} value={`holding:${item.id}`}>{item.symbol} · {item.name || "持仓标的"}</option>)}
      </optgroup>}
    </select>
  </Field>;
}

export function DisciplineForm({ item, watchlist = [], holdings = [], instrument, onSave, busy }) {
  const [v, set] = useState(() => item || {
    id: id(), title: "", category: "执行流程", rule: "", reason: "", scope: "all", active: true,
    watchId: "", holdingId: "", symbol: "", name: "", reviewDate: "", ...instrumentSeed(instrument),
  });
  const [linkValue, setLinkValue] = useState(() => linkedInstrumentValue(item) || instrumentSeedValue(instrument));
  const change = (key, value) => set((current) => ({ ...current, [key]: value }));
  const changeLink = (value) => {
    setLinkValue(value);
    const instrument = linkedInstrument(value, watchlist, holdings);
    if (!instrument) {
      set((current) => ({ ...current, watchId: "", holdingId: "" }));
      return;
    }
    const isWatch = value.startsWith("watch:");
    set((current) => ({ ...current,
      watchId: isWatch ? instrument.id : "", holdingId: isWatch ? "" : instrument.id,
      symbol: instrument.symbol || instrument.name || "", name: instrument.name || instrument.symbol || "",
    }));
  };
  return <form onSubmit={(event) => {
    event.preventDefault();
    onSave({ ...v, title: v.title.trim(), rule: v.rule.trim(), reason: v.reason.trim(), updatedAt: new Date().toISOString() });
  }}>
    <p className="mh-help">把能在下单前核对的规则写具体。启用的纪律会出现在交易记录表单中，方便逐笔对照。</p>
    <div className="mh-form-grid">
      <Field label="纪律名称"><input required autoFocus maxLength={120} value={v.title} onChange={(event) => change("title", event.target.value)} placeholder="例如：单笔风险不超过组合的 1%" /></Field>
      <Field label="纪律类别"><select value={v.category} onChange={(event) => change("category", event.target.value)}>{["执行流程", "仓位管理", "买入规则", "卖出规则", "风险控制", "研究与验证"].map((category) => <option key={category}>{category}</option>)}</select></Field>
      <Field label="适用范围"><select value={v.scope} onChange={(event) => change("scope", event.target.value)}><option value="all">全部标的</option><option value="stocks">个股</option><option value="funds">指数 / ETF</option></select></Field>
      <Field label="状态"><select value={v.active ? "active" : "paused"} onChange={(event) => change("active", event.target.value === "active")}><option value="active">启用</option><option value="paused">暂停</option></select></Field>
      <InstrumentLinkField value={linkValue} watchlist={watchlist} holdings={holdings} onChange={changeLink} />
      <Field label="复核日期（可选）"><input type="date" value={v.reviewDate || ""} onChange={(event) => change("reviewDate", event.target.value)} /></Field>
    </div>
    {linkValue === "custom" && <div className="mh-form-grid">
      <Field label="证券代码"><input maxLength={40} value={v.symbol || ""} onChange={(event) => change("symbol", event.target.value.toUpperCase())} placeholder="例如 NVDA" /></Field>
      <Field label="名称"><input maxLength={300} value={v.name || ""} onChange={(event) => change("name", event.target.value)} placeholder="例如 NVIDIA" /></Field>
    </div>}
    <Field label="纪律内容" hint="尽量写成可执行、可核对的条件。">
      <textarea required rows={4} maxLength={5000} value={v.rule} onChange={(event) => change("rule", event.target.value)} placeholder="例如：只有价格进入预设区间且核心投资逻辑仍成立时才分批买入。" />
    </Field>
    <Field label="制定原因 / 例外条件">
      <textarea rows={3} maxLength={5000} value={v.reason || ""} onChange={(event) => change("reason", event.target.value)} placeholder="这条规则要避免什么错误？哪些情况需要重新评估？" />
    </Field>
    <SaveButton busy={busy} label={item ? "保存纪律修改" : "添加决策纪律"} />
  </form>;
}

export function TradeLogForm({ item, order, watchlist = [], holdings = [], accounts = [], disciplines = [], instrument, onSave, busy }) {
  const orderDate = order?.submittedAtText?.match(/^(\d{4})[/-](\d{2})[/-](\d{2})/)?.slice(1).join("-");
  const orderStatus = order?.status === "draft" ? "working" : order?.status || "filled";
  const [v, set] = useState(() => item ? {
    ...item,
    quantity: String(item.quantity ?? ""), filledQuantity: item.filledQuantity ? String(item.filledQuantity) : "",
    price: item.price == null ? "" : String(item.price), limitPrice: item.limitPrice == null ? "" : String(item.limitPrice),
    fees: String(item.fees ?? 0),
  } : {
    id: id(), date: localDate(), time: "", timeZone: "Pacific/Auckland", title: "", body: "", kind: "trade", side: "buy", orderType: "market", status: "filled",
    quantity: "", filledQuantity: "", price: "", limitPrice: "", fees: "0", currency: "USD", accountId: accounts[0]?.id || "",
    watchId: "", holdingId: "", symbol: "", name: "", timeInForce: "DAY", broker: "", brokerOrderId: "", disciplineId: "",
    ...(order ? {
      date: orderDate || localDate(),
      title: `${order.side === "sell" ? "卖出" : "买入"} ${order.symbol} · ${order.orderType === "limit" ? "限价单" : "市价单"}`,
      body: "",
      side: order.side,
      orderType: order.orderType,
      status: orderStatus,
      quantity: String(order.quantity),
      filledQuantity: order.status === "filled" ? String(order.quantity) : String(order.filledQuantity || ""),
      limitPrice: order.limitPrice == null ? "" : String(order.limitPrice),
      currency: order.currency || "USD",
      accountId: order.accountId || "",
      watchId: order.watchId || "",
      symbol: order.symbol,
      name: order.name || order.symbol,
      timeInForce: order.timeInForce || "DAY",
    } : {}),
    ...instrumentSeed(instrument),
  });
  const [linkValue, setLinkValue] = useState(() => linkedInstrumentValue(item) || (order?.watchId ? `watch:${order.watchId}` : order?.symbol ? "custom" : instrumentSeedValue(instrument)));
  const change = (key, value) => set((current) => ({ ...current, [key]: value }));
  const clearFillValidity = (event) => event.currentTarget.form?.elements.namedItem("filledQuantity")?.setCustomValidity("");
  const changeLink = (value) => {
    setLinkValue(value);
    const instrument = linkedInstrument(value, watchlist, holdings);
    if (!instrument) {
      set((current) => ({ ...current, watchId: "", holdingId: "" }));
      return;
    }
    const isWatch = value.startsWith("watch:");
    const watchCurrency = instrument.priceCurrency || instrument.research?.quote?.currency || instrument.research?.identity?.currency;
    set((current) => ({ ...current,
      watchId: isWatch ? instrument.id : "", holdingId: isWatch ? "" : instrument.id,
      symbol: instrument.symbol || instrument.name || "", name: instrument.name || instrument.symbol || "",
      currency: (isWatch ? watchCurrency : instrument.currency) || current.currency || "USD",
    }));
  };
  const onSubmit = (event) => {
    event.preventDefault();
    const quantity = Number(v.quantity);
    const filledQuantity = v.filledQuantity === "" && v.status === "filled" ? quantity : Number(v.filledQuantity || 0);
    const filledField = event.currentTarget.elements.namedItem("filledQuantity");
    filledField?.setCustomValidity(v.status === "partial" && filledQuantity >= quantity ? "部分成交数量必须大于 0 且小于委托数量。" : "");
    if (!event.currentTarget.reportValidity()) return;
    onSave({ ...v, kind: "trade", date: v.date, time: v.time || "", timeZone: v.time ? v.timeZone || "Pacific/Auckland" : "", title: v.title.trim(), body: v.body.trim(), symbol: v.symbol.trim().toUpperCase(), name: v.name.trim() || v.symbol.trim().toUpperCase(),
      quantity, filledQuantity, price: v.price === "" ? null : Number(v.price), limitPrice: v.limitPrice === "" ? null : Number(v.limitPrice), fees: Number(v.fees || 0),
      accountName: v.accountId ? accounts.find((account) => account.id === v.accountId)?.name || v.accountName || "" : "",
      broker: (v.broker || "").trim(), brokerOrderId: (v.brokerOrderId || "").trim() });
  };
  return <form onSubmit={onSubmit}>
    <p className="mh-help">记录委托和成交决策，不会自动改变持仓或现金。未成交的限价单也可以保存，后续可编辑状态与成交数量。</p>
    <div className="mh-form-grid">
      <Field label="交易 / 委托日期"><input required type="date" value={v.date} onChange={(event) => change("date", event.target.value)} /></Field>
      <Field label="时间（可选）"><input type="time" value={v.time || ""} onChange={(event) => change("time", event.target.value)} /></Field>
      <Field label="时间所属时区"><select value={v.timeZone || "Pacific/Auckland"} onChange={(event) => change("timeZone", event.target.value)}>{TRADE_TIME_ZONES.map(([zone, label]) => <option key={zone} value={zone}>{label}</option>)}</select></Field>
      <Field label="操作"><select value={v.side} onChange={(event) => change("side", event.target.value)}><option value="buy">买入</option><option value="sell">卖出</option></select></Field>
      <Field label="委托类型"><select value={v.orderType} onChange={(event) => change("orderType", event.target.value)}><option value="market">市价单</option><option value="limit">限价单</option></select></Field>
      <Field label="委托状态"><select value={v.status} onChange={(event) => { clearFillValidity(event); change("status", event.target.value); }}>
        <option value="filled">已成交</option><option value="working">等待成交</option><option value="partial">部分成交</option><option value="cancelled">已撤销</option><option value="rejected">已拒绝</option><option value="expired">已过期</option>
      </select></Field>
      <InstrumentLinkField value={linkValue} watchlist={watchlist} holdings={holdings} onChange={changeLink} />
      <Field label="账户"><select value={v.accountId || ""} onChange={(event) => change("accountId", event.target.value)}><option value="">未指定</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></Field>
    </div>
    {(linkValue === "custom" || !linkValue) && <div className="mh-form-grid">
      <Field label="证券代码"><input required maxLength={40} value={v.symbol || ""} onChange={(event) => change("symbol", event.target.value.toUpperCase())} placeholder="例如 NVDA" /></Field>
      <Field label="名称"><input maxLength={300} value={v.name || ""} onChange={(event) => change("name", event.target.value)} placeholder="可留空，默认使用代码" /></Field>
    </div>}
    <div className="mh-form-grid">
      <Field label="委托数量"><input required type="number" min="0.00000001" max="100000000000000" step="any" value={v.quantity} onChange={(event) => { clearFillValidity(event); change("quantity", event.target.value); }} placeholder="例如 10" /></Field>
      {v.orderType === "limit" && <Field label={`限价 · ${v.currency}`}><input required type="number" min="0.000001" max="100000000000000" step="any" value={v.limitPrice} onChange={(event) => change("limitPrice", event.target.value)} /></Field>}
      <Field label="已成交数量" hint="未成交填 0；完整成交可留空，自动按委托数量记录。"><input name="filledQuantity" type="number" min={v.status === "partial" ? "0.00000001" : "0"} max={Number(v.quantity) || 100000000000000} step="any" required={v.status === "partial"} value={v.filledQuantity} onChange={(event) => { event.currentTarget.setCustomValidity(""); change("filledQuantity", event.target.value); }} placeholder={v.status === "filled" ? "默认等于委托数量" : "0"} /></Field>
      <Field label={`成交均价 · ${v.currency}`} hint="有成交时填写；未成交可留空。"><input type="number" min="0.000001" max="100000000000000" step="any" required={v.status === "filled" || Number(v.filledQuantity) > 0} value={v.price} onChange={(event) => change("price", event.target.value)} /></Field>
      <Field label={`费用 · ${v.currency}`}><input type="number" min="0" max="100000000000000" step="any" value={v.fees} onChange={(event) => change("fees", event.target.value)} /></Field>
      <Field label="交易币种"><select value={v.currency} onChange={(event) => change("currency", event.target.value)}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></Field>
      <Field label="有效期"><select value={v.timeInForce || "DAY"} onChange={(event) => change("timeInForce", event.target.value)}>{["DAY", "GTC", "GTD", "IOC", "FOK"].map((term) => <option key={term}>{term}</option>)}</select></Field>
      <Field label="券商（可选）"><input maxLength={100} value={v.broker || ""} onChange={(event) => change("broker", event.target.value)} placeholder="例如 IBKR" /></Field>
      <Field label="券商委托编号（可选）"><input maxLength={100} value={v.brokerOrderId || ""} onChange={(event) => change("brokerOrderId", event.target.value)} /></Field>
      <Field label="核对的决策纪律"><select value={v.disciplineId || ""} onChange={(event) => change("disciplineId", event.target.value)}><option value="">未关联纪律</option>{disciplines.map((discipline) => <option key={discipline.id} value={discipline.id}>{discipline.active ? "启用" : "暂停"} · {discipline.title}</option>)}</select></Field>
    </div>
    <Field label="为什么做这笔交易？" hint="记录当时的依据、触发条件、反面证据，以及什么变化会推翻判断。">
      <textarea required rows={6} maxLength={20000} value={v.body} onChange={(event) => change("body", event.target.value)} placeholder="投资理由与证据：\n触发本次操作的条件：\n主要风险与反证：\n什么情况会改变决定：" />
    </Field>
    <Field label="记录标题"><input required maxLength={300} value={v.title} onChange={(event) => change("title", event.target.value)} placeholder="例如：分两次买入 QQQM，按计划建立指数仓位" /></Field>
    <SaveButton busy={busy} label={item ? "保存交易记录" : "保存决策日志"} />
  </form>;
}
