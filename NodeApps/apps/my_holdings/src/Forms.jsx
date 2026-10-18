import { useEffect, useRef, useState } from "react";
import { X, Save, RefreshCw } from "lucide-react";
import { CURRENCIES, id } from "./model.js";
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
export function HoldingForm({ item, accounts, onSave, busy }) {
  const [v, set] = useState(
    item || {
      id: id(),
      accountId: accounts[0].id,
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
        <Field label="公司 / 基金名称">
          <input
            maxLength={300}
            value={v.name}
            onChange={(e) => change("name", e.target.value)}
            placeholder="可留空，使用代码"
          />
        </Field>
        <Field label="币种">
          <select
            value={v.currency}
            onChange={(e) => change("currency", e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        {[
          ["quantity", "持有股数"],
          ["price", "参考股价"],
          ["cost", "总成本"],
          ["marketValue", "总市值"],
          ["averagePrice", "平均成本价"],
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
      <button
        className="mh-text-button"
        type="button"
        onClick={() =>
          set((s) => ({
            ...s,
            marketValue:
              Math.round(Number(s.quantity) * Number(s.price) * 100) / 100,
            averagePrice: s.quantity
              ? Math.round((Number(s.cost) / Number(s.quantity)) * 10000) /
                10000
              : 0,
          }))
        }
      >
        <RefreshCw size={14} /> 按股数和参考价重算市值 / 均价
      </button>
      <Field label="持有理由">
        <textarea
          value={v.thesis}
          maxLength={12000}
          onChange={(e) => change("thesis", e.target.value)}
          placeholder="为什么持有？哪些证据支持？"
        />
      </Field>
      <Field label="重新评估 / 退出条件">
        <textarea
          value={v.exitRule}
          maxLength={12000}
          onChange={(e) => change("exitRule", e.target.value)}
          placeholder="什么变化会让你改变判断？"
        />
      </Field>
      <SaveButton busy={busy} />
    </form>
  );
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
    },
  );
  const change = (k, value) => set((s) => ({ ...s, [k]: value }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...v,
          name: v.name.trim(),
          symbol: v.symbol.trim().toUpperCase(),
        });
      }}
    >
      <Field label="只填一个公司名或代码，就可以开始">
        <input
          required
          maxLength={300}
          placeholder="例如：微软 / MSFT"
          value={v.name}
          onChange={(e) => change("name", e.target.value)}
        />
      </Field>
      <div className="mh-form-grid">
        <Field label="证券代码（可选）">
          <input
            maxLength={40}
            value={v.symbol}
            onChange={(e) => change("symbol", e.target.value)}
          />
        </Field>
        <Field label="研究状态">
          <select
            value={v.status}
            onChange={(e) => change("status", e.target.value)}
          >
            {["观察中", "等待价格", "等待验证", "已放弃"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="关注原因（可选）">
        <textarea
          value={v.note}
          onChange={(e) => change("note", e.target.value)}
          placeholder="我想了解这家公司的长期竞争力…"
        />
      </Field>
      <Field label="入场条件（可选）">
        <textarea
          value={v.trigger}
          onChange={(e) => change("trigger", e.target.value)}
          placeholder="估值、业绩证据、价格区间，或继续等待的条件"
        />
      </Field>
      <p className="mh-help">
        新增后自动请求 Codex 研究。研究会发送到本机 Codex
        登录所连接的服务；失败时保留关注记录，可重试或导入外部 AI 结果。
      </p>
      <SaveButton busy={busy} label={item ? "保存关注" : "添加并生成研究"} />
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
        <Field label="金额">
          <input
            required
            type="number"
            step="any"
            min="0.01"
            value={v.amount}
            onChange={(e) => change("amount", e.target.value)}
          />
        </Field>
        <Field label="币种">
          <select
            value={v.currency}
            onChange={(e) => change("currency", e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
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
        弹药是你记录的独立资金池。买入证券时，同时新增 /
        更新持仓，并在这里记一笔投资拨款，以免重复计算资产。
      </p>
      <SaveButton busy={busy} />
    </form>
  );
}
export function GoalsForm({ state, onSave, busy }) {
  const [g, set] = useState(state.goals),
    [fx, setFx] = useState(state.fx);
  const change = (k, v) => set((s) => ({ ...s, [k]: v }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ goals: { ...g, configured: true }, fx });
      }}
    >
      <div className="mh-form-grid">
        <Field label="目标币种">
          <select
            value={g.currency}
            onChange={(e) => change("currency", e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="目标资产金额（可留空）">
          <input
            type="number"
            min="0.01"
            step="any"
            value={g.target ?? ""}
            onChange={(e) =>
              change("target", e.target.value ? Number(e.target.value) : null)
            }
          />
        </Field>
        <Field label="应急 / 暂不投资的预留金额">
          <input
            required
            type="number"
            min="0"
            step="any"
            value={g.reserve}
            onChange={(e) => change("reserve", Number(e.target.value))}
          />
        </Field>
        <Field label="目标日期（可选）">
          <input
            type="date"
            value={g.date}
            onChange={(e) => change("date", e.target.value)}
          />
        </Field>
        <Field label="单一证券占比提醒线 %">
          <input
            required
            type="number"
            min="1"
            max="100"
            value={g.maxPosition}
            onChange={(e) => change("maxPosition", Number(e.target.value))}
          />
        </Field>
        <Field label="可承受的回撤 %">
          <input
            required
            type="number"
            min="0"
            max="100"
            value={g.maxDrawdown}
            onChange={(e) => change("maxDrawdown", Number(e.target.value))}
          />
        </Field>
      </div>
      <Field label="投资期限">
        <input
          maxLength={300}
          placeholder="例如 10 年；未来 3 年可能买房"
          value={g.horizon}
          onChange={(e) => change("horizon", e.target.value)}
        />
      </Field>
      <Field label="个人约束与目标">
        <textarea
          value={g.notes}
          onChange={(e) => change("notes", e.target.value)}
          placeholder="税务居民地、家庭开支、未来资金需求、希望实现的生活目标"
        />
      </Field>
      <p className="mh-help">
        首次预填的 80% 占比线与 20%
        回撤仅供设置参考，请改为符合自己实际情况的数值。
      </p>
      <h3>手动汇率</h3>
      <p className="mh-help">
        每 1 单位外币 = 多少 USD。留空的币种不计入美元合计。
      </p>
      <div className="mh-form-grid">
        {CURRENCIES.filter((c) => c !== "USD").map((c) => (
          <Field key={c} label={`1 ${c} → USD`}>
            <input
              type="number"
              min="0.00000001"
              step="any"
              value={fx[c] ?? ""}
              onChange={(e) =>
                setFx((s) => ({
                  ...s,
                  [c]: e.target.value ? Number(e.target.value) : null,
                }))
              }
            />
          </Field>
        ))}
      </div>
      <SaveButton busy={busy} />
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
