import { useEffect, useState } from "react";
import { ArrowUpRight, Pencil, Save } from "lucide-react";
import { money } from "./model.js";

function formatRange(low, high) {
  if (low == null || high == null) return "";
  return `${low}–${high}`;
}

function parseRange(value) {
  const clean = value.trim().replace(/[,$\s]/g, "").replace(/[−—–]/g, "-");
  if (!clean) return { low: null, high: null };
  const match = clean.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const low = Number(match[1]);
  const high = Number(match[2]);
  if (!Number.isFinite(low) || !Number.isFinite(high) || low <= 0 || high < low)
    return null;
  return { low, high };
}

function makeDraft(watch, record) {
  const plan = record?.plan || {};
  return {
    allocationPct: plan.allocationPct == null ? "" : String(plan.allocationPct),
    observationPrice: watch.targetPrice == null ? "" : String(watch.targetPrice),
    safetyRange: formatRange(plan.safetyLow, plan.safetyHigh),
    discountRange: formatRange(plan.discountLow, plan.discountHigh),
  };
}

export function DecisionPlanCard({
  watch,
  cardTitle,
  categoryId,
  categories = [],
  viewMode = "card",
  onMoveCategory,
  record,
  busy,
  attention,
  attentionOptions,
  attentionOpen,
  onToggleAttention,
  onSelectAttention,
  onSave,
  onSelect,
}) {
  const [draft, setDraft] = useState(() => makeDraft(watch, record));
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const plan = record?.plan || {};
  const originalDraft = makeDraft(watch, record);
  const hasChanges = Object.keys(originalDraft).some((key) => draft[key] !== originalDraft[key]);

  useEffect(() => {
    setDraft(makeDraft(watch, record));
    setError("");
  }, [
    watch.id,
    watch.targetPrice,
    record?.id,
    plan.allocationPct,
    plan.safetyLow,
    plan.safetyHigh,
    plan.discountLow,
    plan.discountHigh,
  ]);

  const currency = watch.priceCurrency || watch.research?.quote?.currency || watch.research?.identity?.currency || "USD";
  const quote = Number(watch.price);
  const hasQuote = Number.isFinite(quote) && quote > 0;
  const observationTarget = watch.targetPrice == null ? NaN : Number(watch.targetPrice);
  const hasObservationTarget = Number.isFinite(observationTarget) && observationTarget > 0;
  const waiting = draft.observationPrice.trim() === "" ? NaN : Number(draft.observationPrice);
  const reached = hasQuote && hasObservationTarget && quote <= observationTarget;
  const waitGapPct = !Number.isFinite(quote) || quote <= 0 || !Number.isFinite(waiting) || waiting <= 0
    ? null
    : quote <= waiting ? 0 : ((quote - waiting) / quote) * 100;
  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const finishEditing = () => {
    if (!hasChanges) {
      setDraft(originalDraft);
      setEditing(false);
      setError("");
      return;
    }
    const allocationPct = draft.allocationPct.trim() === "" ? null : Number(draft.allocationPct);
    const observationPrice = draft.observationPrice.trim() === "" ? null : Number(draft.observationPrice);
    if (allocationPct !== null && (!Number.isFinite(allocationPct) || allocationPct < 0 || allocationPct > 100)) {
      setError("仓位请填写 0 到 100 之间的百分比。");
      return;
    }
    if (observationPrice !== null && (!Number.isFinite(observationPrice) || observationPrice <= 0)) {
      setError("观察价请填写大于 0 的价格。");
      return;
    }
    const safety = parseRange(draft.safetyRange);
    const discount = parseRange(draft.discountRange);
    if (!safety || !discount) {
      setError("价格区间请按“低价-高价”填写；清空可删除区间。");
      return;
    }
    const updateResult = onSave(watch.id, {
      targetPrice: observationPrice,
      plan: {
        allocationPct,
        safetyLow: safety.low,
        safetyHigh: safety.high,
        discountLow: discount.low,
        discountHigh: discount.high,
      },
    });
    Promise.resolve(updateResult).then((saved) => {
      if (saved) setEditing(false);
    });
  };
  const editOrFinish = () => {
    if (!editing) {
      setDraft(originalDraft);
      setError("");
      setEditing(true);
      return;
    }
    finishEditing();
  };
  const allocationText = plan.allocationPct == null
    ? "—"
    : `${Number(plan.allocationPct).toLocaleString("zh-CN", { maximumFractionDigits: 2 })}%`;
  const pricePrefix = currency === "USD" ? "$" : `${currency} `;
  const observationText = watch.targetPrice == null ? "—" : money(watch.targetPrice, currency);
  const statusLabel = !hasObservationTarget
    ? "未设观察价"
    : !hasQuote
      ? "报价待更新"
      : reached
        ? "已触及观察价"
        : "高于观察价";
  const statusTitle = !hasObservationTarget
    ? "尚未为此标的设置观察价。"
    : !hasQuote
      ? `已设观察价 ${observationText}，但目前没有有效报价。`
      : reached
        ? `当前报价 ${money(quote, currency)} 已触及观察价 ${observationText}。`
        : `当前报价 ${money(quote, currency)} 高于观察价 ${observationText}；这不是工作台待办。`;
  const safetyText = formatRange(plan.safetyLow, plan.safetyHigh) || "—";
  const discountText = formatRange(plan.discountLow, plan.discountHigh) || "—";
  const trailingPe = watch.pe?.status === "available" && Number.isFinite(Number(watch.pe.value))
    ? `${Number(watch.pe.value).toLocaleString("zh-CN", { maximumFractionDigits: 2 })}x`
    : watch.pe?.status === "unavailable" ? "N/M" : watch.pe?.status === "unverified" ? "待核实" : "—";
  const peTitle = watch.pe
    ? `Trailing P/E (TTM) · ${watch.pe.asOf || "日期待核实"} · ${watch.pe.source || "来源待核实"}${watch.pe.note ? ` · ${watch.pe.note}` : ""}${watch.pe.sourceUrl ? ` · ${watch.pe.sourceUrl}` : ""}`
    : "尚未核实市盈率。请在「近期关注」页点击“刷新市盈率”交给 Codex 更新。";
  const peField = watch.pe?.sourceUrl
    ? <a className="mh-decision-field mh-decision-pe-link" href={watch.pe.sourceUrl} target="_blank" rel="noreferrer" title={peTitle} aria-label={peTitle}><span>市盈率 (TTM) ↗</span><strong>{trailingPe}</strong></a>
    : <div className="mh-decision-field" title={peTitle} aria-label={peTitle}><span>市盈率 (TTM)</span><strong>{trailingPe}</strong></div>;

  return (
    <article className={`mh-decision-card attention-${attention} ${viewMode === "list" ? "is-list" : "is-card"}`}>
      <header>
        <button type="button" className="mh-decision-identity" onClick={onSelect} title={cardTitle || "查看近期关注"}>
          <strong>{cardTitle || `${watch.symbol || "代码待核实"} - ${watch.name || "公司名称待核实"}`}</strong>
          <ArrowUpRight size={12} />
        </button>
        {categories.length > 0 && <label className="mh-decision-category-control">
          <span className="mh-sr-only">分类</span>
          <select aria-label={`${watch.symbol || watch.name} 所属分类`} value={categoryId} disabled={busy}
            onChange={(event) => onMoveCategory?.(watch.id, event.target.value)}>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>}
        <div className="mh-decision-actions">
          <span className={`mh-decision-status ${reached ? "reached" : !hasQuote ? "quote-missing" : !hasObservationTarget ? "no-target" : "above-target"}`} title={statusTitle} aria-label={statusTitle}>
            {statusLabel}
          </span>
          <div
            className="mh-watch-attention-control"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) onToggleAttention(false);
            }}
          >
            <button
              type="button"
              className="mh-watch-attention-trigger"
              aria-label={`当前关注度 ${attention}，点击更改`}
              aria-haspopup="true"
              aria-expanded={attentionOpen}
              title={`关注度 ${attention} · ${attentionOptions.find((option) => option.level === attention)?.label}`}
              onClick={onToggleAttention}
            >
              <span className={`mh-watch-attention-swatch attention-${attention}`} aria-hidden="true" />
            </button>
            {attentionOpen && <div className="mh-watch-attention-menu" role="group" aria-label="选择关注度">
              {attentionOptions.map((option) => (
                <button
                  key={option.level}
                  type="button"
                  className={attention === option.level ? "selected" : ""}
                  aria-label={`${option.level}，${option.label}`}
                  aria-pressed={attention === option.level}
                  title={`${option.level} · ${option.label}`}
                  disabled={busy}
                  onClick={() => onSelectAttention(option.level)}
                >
                  <span className={`mh-watch-attention-swatch attention-${option.level}`}>{option.level}</span>
                </button>
              ))}
            </div>}
          </div>
          <button type="button" className="mh-text-button mh-decision-save" disabled={busy} onClick={editOrFinish}>
            {editing
              ? hasChanges ? <><Save size={13} /> 保存</> : "完成"
              : <><Pencil size={13} /> 编辑</>}
          </button>
        </div>
      </header>
      <div className="mh-decision-quote">
        <span>当前报价</span>
        <strong>{watch.price == null ? "未更新" : money(watch.price, currency)}</strong>
        {watch.priceDate && <small>{watch.priceDate}</small>}
      </div>
      <div className={`mh-decision-fields ${editing ? "editing" : ""}`}>
        <div className="mh-decision-field-row primary">
          {peField}
          {editing ? <>
            <label>
              <span>仓位</span>
              <div><input type="number" min="0" max="100" step="any" inputMode="decimal" value={draft.allocationPct} onChange={(event) => update("allocationPct", event.target.value)} placeholder="—" /><i>%</i></div>
            </label>
            <label>
              <span>观察价</span>
              <div><i>{pricePrefix}</i><input type="number" min="0.01" step="any" inputMode="decimal" value={draft.observationPrice} onChange={(event) => update("observationPrice", event.target.value)} placeholder="—" /></div>
            </label>
          </> : <>
            <div className="mh-decision-field"><span>仓位</span><strong>{allocationText}</strong></div>
            <div className="mh-decision-field"><span>观察价</span><strong>{observationText}</strong></div>
          </>}
        </div>
        <div className="mh-decision-field-row secondary">
          <div className="mh-decision-field computed"><span>价差</span><strong>{waitGapPct == null ? "—" : `${waitGapPct.toFixed(2)}%`}</strong></div>
          {editing ? <>
            <label>
              <span>安全边际</span>
              <div><i>{pricePrefix}</i><input type="text" inputMode="text" maxLength={32} value={draft.safetyRange} onChange={(event) => update("safetyRange", event.target.value)} /></div>
            </label>
            <label>
              <span>折价</span>
              <div><i>{pricePrefix}</i><input type="text" inputMode="text" maxLength={32} value={draft.discountRange} onChange={(event) => update("discountRange", event.target.value)} /></div>
            </label>
          </> : <>
            <div className="mh-decision-field"><span>安全边际</span><strong>{safetyText === "—" ? safetyText : `${pricePrefix}${safetyText}`}</strong></div>
            <div className="mh-decision-field"><span>折价</span><strong>{discountText === "—" ? discountText : `${pricePrefix}${discountText}`}</strong></div>
          </>}
        </div>
      </div>
      {error && <p className="mh-decision-error" role="alert">{error}</p>}
    </article>
  );
}
