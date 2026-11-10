import { watchIdentityKey, normalizeWatchSymbol } from "../src/watch-identity.js";
import { WATCH_UNCLASSIFIED_ID } from "../src/watch-categories.js";

const stamp = (value) => Date.parse(value) || 0;
const populated = (value) => value !== undefined && value !== null && value !== "";
const joinText = (values, limit) => [...new Set(values.filter(Boolean))].join("\n\n").slice(0, limit);
const researchScore = (row) => row.research?.details && row.report ? 2 : row.research ? 1 : 0;

function mergeWatch(rows) {
  const merged = { ...rows[0] };
  // Keep the first ID stable and keep user choices; fill gaps from other cards.
  for (const row of rows.slice(1)) {
    for (const [key, value] of Object.entries(row)) if (!populated(merged[key]) && populated(value)) merged[key] = value;
  }
  merged.symbol = normalizeWatchSymbol(merged.symbol || merged.research?.identity?.symbol);
  merged.note = joinText(rows.map((row) => row.note), 12000);
  merged.trigger = joinText(rows.map((row) => row.trigger), 12000);
  merged.attention = Math.max(...rows.map((row) => row.attention || 2));
  merged.watchCategoryId = rows.find((row) => row.watchCategoryId && row.watchCategoryId !== WATCH_UNCLASSIFIED_ID)?.watchCategoryId || WATCH_UNCLASSIFIED_ID;
  // Quote, research and P/E each have their own clock. Never mix quote fields.
  const quote = rows.filter((row) => row.price > 0).sort((a, b) =>
    stamp(b.priceAsOf || b.priceDate) - stamp(a.priceAsOf || a.priceDate) || stamp(b.priceFetchedAt) - stamp(a.priceFetchedAt),
  )[0];
  for (const key of Object.keys(merged)) if (key.startsWith("price")) delete merged[key];
  if (quote) for (const key of Object.keys(quote)) if (key.startsWith("price")) merged[key] = quote[key];
  const researched = rows.filter((row) => row.research).sort((a, b) =>
    researchScore(b) - researchScore(a) || stamp(b.researchedAt) - stamp(a.researchedAt),
  )[0];
  for (const key of ["research", "report", "researchedAt"]) {
    delete merged[key];
    if (researched?.[key] !== undefined) merged[key] = researched[key];
  }
  const pe = rows.filter((row) => row.pe).sort((a, b) => stamp(b.pe.asOf) - stamp(a.pe.asOf) || stamp(b.pe.updatedAt) - stamp(a.pe.updatedAt))[0];
  if (pe) merged.pe = pe.pe;
  const decision = rows.filter((row) => row.decisionReport).sort((a, b) => stamp(b.decisionReport.updatedAt) - stamp(a.decisionReport.updatedAt))[0];
  if (decision) merged.decisionReport = decision.decisionReport;
  return merged;
}

function mergePlans(plans) {
  const score = (entry) => Object.values(entry.plan || {}).filter(populated).length;
  const ordered = [...plans].sort((a, b) => score(b) - score(a) || stamp(b.date) - stamp(a.date));
  const merged = { ...ordered[0], plan: { ...ordered[0].plan } };
  for (const entry of ordered.slice(1)) {
    if (!populated(merged.plan.allocationPct) && populated(entry.plan.allocationPct)) merged.plan.allocationPct = entry.plan.allocationPct;
    for (const tier of ["safety", "discount"]) {
      const low = `${tier}Low`, high = `${tier}High`;
      if (!populated(merged.plan[low]) && !populated(merged.plan[high]) && populated(entry.plan[low]) && populated(entry.plan[high])) {
        merged.plan[low] = entry.plan[low];
        merged.plan[high] = entry.plan[high];
      }
    }
  }
  merged.body = joinText(ordered.map((entry) => entry.body), 20000);
  return merged;
}

export function consolidateStateWatchlist(state, mergedAt) {
  const groups = new Map();
  for (const row of state.watchlist) {
    const key = watchIdentityKey(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  const duplicates = [...groups.values()].filter((rows) => rows.length > 1);
  if (!duplicates.length) return false;
  const aliases = new Map();
  const replacements = new Map();
  state.watchMergeHistory ||= [];
  for (const rows of duplicates) {
    const survivor = mergeWatch(rows);
    const ids = new Set(rows.map((row) => row.id));
    state.watchMergeHistory.push({ mergedAt, watchId: survivor.id, originals: structuredClone(rows), plans: structuredClone((state.journal || []).filter((entry) => entry.kind === "plan" && ids.has(entry.watchId))) });
    replacements.set(survivor.id, survivor);
    for (const row of rows) aliases.set(row.id, survivor.id);
  }
  state.watchlist = state.watchlist.filter((row) => !aliases.has(row.id) || aliases.get(row.id) === row.id).map((row) => replacements.get(row.id) || row);
  for (const key of ["journal", "jobs", "analyses", "orders", "disciplines"]) {
    for (const entry of state[key] || []) {
      const oldId = entry.watchId;
      if (!aliases.has(oldId)) continue;
      entry.watchId = aliases.get(oldId);
      if (typeof entry.question === "string") entry.question = entry.question.replaceAll(oldId, entry.watchId);
    }
  }
  for (const snapshot of state.watchRankHistory || []) snapshot.watchIds = [...new Set(snapshot.watchIds.map((id) => aliases.get(id) || id))];
  // Preserve one editable plan, and archive all pre-merge versions above.
  for (const watchId of replacements.keys()) {
    const plans = (state.journal || []).filter((entry) => entry.kind === "plan" && entry.watchId === watchId);
    if (plans.length > 1) {
      const merged = mergePlans(plans);
      state.journal = state.journal.filter((entry) => entry.kind !== "plan" || entry.watchId !== watchId || entry.id === merged.id).map((entry) => entry.id === merged.id ? merged : entry);
    }
  }
  const active = new Map();
  for (const job of [...(state.jobs || [])].sort((a, b) => Number(Boolean(b.quotePolicy) || b.status === "running") - Number(Boolean(a.quotePolicy) || a.status === "running"))) {
    if (!replacements.has(job.watchId) || !["waiting", "running"].includes(job.status)) continue;
    const key = `${job.watchId}:${job.kind}:${job.researchMode || ""}`;
    if (!active.has(key)) active.set(key, job);
    else Object.assign(job, { status: "cancelled", cancelledAt: mergedAt, error: "", summary: `重复关注已合并；此任务由 ${active.get(key).id} 继续处理。` });
  }
  return true;
}
