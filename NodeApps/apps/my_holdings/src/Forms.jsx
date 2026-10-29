import { useEffect, useRef, useState } from "react";
import { X, Save } from "lucide-react";
import { id, money, CURRENCIES } from "./model.js";
import { previewBuy, roundMoney } from "./positions.js";
import { localDate } from "./api.js";
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
    symbol: holding?.symbol || "", currency: holding?.currency || "USD", quantity: "", price: "", fees: 0, date: localDate() }));
  const change = (key, value) => set((current) => ({ ...current, [key]: value }));
  const preview = previewBuy(holdings, v);
  const accountName = accounts.find((account) => account.id === v.accountId)?.name;
  const ready = Number(v.quantity) > 0 && Number(v.price) > 0;
  const symbols = [...new Map(holdings.map((h) => [h.symbol, h])).values()];
  return <form onSubmit={(event) => {
    event.preventDefault();
    onSave({ ...v, quantity: Number(v.quantity), price: Number(v.price), fees: Number(v.fees || 0) });
  }}>
    <p className="mh-help">记录这一次买入的股数和单价。同一账户、同一代码和币种会自动合并，成本均价按总成本重新计算。</p>
    <div className="mh-form-grid">
      <Field label="账户"><select value={v.accountId} onChange={(e) => change("accountId", e.target.value)}>{accounts.map((a) => <option value={a.id} key={a.id}>{a.name}</option>)}</select></Field>
      <Field label="证券代码"><input required autoFocus maxLength={40} list="mh-buy-symbols" placeholder="例如 QQQM" value={v.symbol} onChange={(e) => change("symbol", e.target.value.toUpperCase())} /><datalist id="mh-buy-symbols">{symbols.map((h) => <option key={h.symbol} value={h.symbol}>{h.name}</option>)}</datalist></Field>
      <Field label="本次买入股数"><input required type="number" min="0.00000001" max="100000000000000" step="any" placeholder="例如 50" value={v.quantity} onChange={(e) => change("quantity", e.target.value)} /></Field>
      <Field label={`买入单价 · ${v.currency}`}><input required type="number" min="0.00000001" max="100000000000000" step="any" placeholder="例如 290" value={v.price} onChange={(e) => change("price", e.target.value)} /></Field>
      <Field label={`本次费用 · ${v.currency}`} hint="可留空；计入买入总成本"><input type="number" min="0" max="100000000000000" step="any" value={v.fees} onChange={(e) => change("fees", e.target.value)} /></Field>
      <Field label="买入日期"><input required type="date" value={v.date} onChange={(e) => change("date", e.target.value)} /></Field>
      <Field label="交易币种"><select value={v.currency} onChange={(e) => change("currency", e.target.value)}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></Field>
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
    <p className="mh-help">每笔买入单独留存记录。资金台账由你另行记录。</p>
    <SaveButton busy={busy} label={preview.existing ? "确认追加买入" : "保存买入"} />
  </form>;
}
export function HoldingForm({ item, accounts, defaultAccountId, onSave, busy }) {
  const [v, set] = useState(
    item || {
      id: id(),
      accountId: defaultAccountId || accounts[0].id,
      symbol: "",
      name: "",
      quantity: 0,
      price: 0,
      cost: 0,
      marketValue: 0,
      averagePrice: 0,
      changePct: null,
      currency: "USD",
      sector: "其他",
      source: "手工录入",
      priceDate: "",
      recordedAt: localDate(),
      thesis: "",
      exitRule: "",
    },
  );
  const change = (k, value) => set((s) => ({ ...s, [k]: value }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...v,
          symbol: v.symbol.trim().toUpperCase(),
          name: v.name.trim() || v.symbol.trim().toUpperCase(),
        cost:
          item &&
          Number(v.quantity) === Number(item.quantity) &&
          Number(v.averagePrice) === Number(item.averagePrice)
            ? v.cost
            : Math.round(Number(v.averagePrice) * Number(v.quantity) * 100) / 100,
        marketValue:
          item && Number(v.quantity) === Number(item.quantity)
            ? v.marketValue
            : Math.round(Number(v.quantity) * Number(v.price) * 100) / 100,
        });
      }}
    >
      <div className="mh-form-grid">
        <Field label="账户">
          <select
            value={v.accountId}
            onChange={(e) => change("accountId", e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="证券代码">
          <input
            required
            maxLength={40}
            value={v.symbol}
            onChange={(e) => change("symbol", e.target.value)}
            placeholder="例如 VOO"
          />
        </Field>
        <Field label="名称（可选）">
          <input
            maxLength={300}
            value={v.name}
            onChange={(e) => change("name", e.target.value)}
            placeholder="可留空，使用代码"
          />
        </Field>
        {[
          ["quantity", "持仓总股数"],
          ["averagePrice", "成本均价 · USD"],
        ].map(([k, label]) => (
          <Field key={k} label={label}>
            <input
              required
              type="number"
              step="any"
              min="0"
              max="100000000000000"
              value={v[k]}
              onChange={(e) =>
                change(k, e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </Field>
        ))}
        <Field label="报价日期" hint="未知请留空；不要用录入日冒充行情日">
          <input
            type="date"
            value={v.priceDate}
            onChange={(e) => change("priceDate", e.target.value)}
          />
        </Field>
        <Field label="分类">
          <input
            required
            value={v.sector}
            maxLength={100}
            onChange={(e) => change("sector", e.target.value)}
          />
        </Field>
        <Field label="截图变动 %（周期未知）">
          <input
            type="number"
            step="any"
            min="-100"
            value={v.changePct ?? ""}
            onChange={(e) =>
              change(
                "changePct",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          />
        </Field>
      </div>
      <p className="mh-help">这里用于修正持仓总数和成本，不会新增买入记录。追加买入请使用「记录买入」。</p>
      <SaveButton busy={busy} />
    </form>
  );
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
export function SaveButton({ busy, label = "保存到本地" }) {
  return (
    <footer className="mh-form-footer">
      <span>保存后自动保留历史备份</span>
      <button className="mh-primary" disabled={busy}>
        <Save size={16} />
        {busy ? "正在保存…" : label}
      </button>
    </footer>
  );
}
export function WatchForm({ item, onSave, busy }) {
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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...v,
          name: input.trim(),
          symbol: /^[A-Za-z][A-Za-z0-9.-]{0,14}$/.test(input.trim())
            ? input.trim().toUpperCase()
            : v.symbol.trim().toUpperCase(),
        });
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
      <SaveButton busy={busy} label={item ? "保存关注" : "添加并排入待办"} />
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
export function JournalForm({ item, onSave, busy }) {
  const [v, set] = useState(
    item || { id: id(), date: localDate(), title: "", body: "" },
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(v);
      }}
    >
      <Field label="日期">
        <input
          type="date"
          required
          value={v.date}
          onChange={(e) => set({ ...v, date: e.target.value })}
        />
      </Field>
      <Field label="决策 / 复盘标题">
        <input
          required
          maxLength={300}
          value={v.title}
          onChange={(e) => set({ ...v, title: e.target.value })}
          placeholder="例如：为什么这次选择继续持有"
        />
      </Field>
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
