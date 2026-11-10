import { test } from "node:test";
import assert from "node:assert/strict";
import { watchIdentityKey, findDuplicateWatch, symbolFromWatchInput } from "../src/watch-identity.js";
import { consolidateStateWatchlist } from "./watchlist.js";

test("watch identity ignores symbol case, outside whitespace and full-width characters", () => {
  const watch = { id: "a", symbol: "CLFD", name: "Clearfield" };
  assert.equal(findDuplicateWatch([watch], { id: "b", symbol: " ｃｌｆｄ ", name: "Other label" }), watch);
  assert.equal(findDuplicateWatch([watch], { ...watch, symbol: "clfd" }), undefined);
  assert.equal(watchIdentityKey({ name: "  Example   Company ", symbol: "" }), watchIdentityKey({ name: "example company", symbol: "" }));
  assert.equal(watchIdentityKey({ name: "clfd", symbol: "" }), watchIdentityKey(watch));
  assert.equal(watchIdentityKey({ name: "未识别", symbol: "", research: { identity: { symbol: "CLFD" } } }), watchIdentityKey(watch));
  assert.notEqual(watchIdentityKey({ symbol: "GOOG" }), watchIdentityKey({ symbol: "GOOGL" }));
  assert.equal(symbolFromWatchInput(" ｃｌｆｄ "), "CLFD");
});

test("legacy merge preserves independent snapshots, manual choices, original cards and all instrument links", () => {
  const first = { id: "a", symbol: "CLFD", name: "CLFD", note: "旧笔记", trigger: "原条件", attention: 2, targetPrice: 25,
    watchCategoryId: "uncategorized", price: 30, priceDate: "2026-11-09", priceAsOf: "2026-11-09T20:00:00Z", priceSourceUrl: "https://example.com/new-price",
    research: { details: "完整旧研究" }, report: "research/old.html", researchedAt: "2026-11-04T00:00:00Z",
    pe: { value: 10, asOf: "2026-11-10", updatedAt: "2026-11-10T00:00:00Z" } };
  const second = { id: "b", symbol: " clfd ", name: "Clearfield", note: "补充笔记", trigger: "另一条件", attention: 4, targetPrice: 28,
    watchCategoryId: "potential", price: 29, priceDate: "2026-11-06", priceFetchedAt: "2026-11-10T00:00:00Z", priceSession: "regular",
    research: { details: "完整新研究" }, report: "research/new.html", researchedAt: "2026-11-07T00:00:00Z",
    pe: { value: 9, asOf: "2026-11-09", updatedAt: "2026-11-10T01:00:00Z" } };
  const plan = (id, watchId, date, values = {}) => ({ id, watchId, date, kind: "plan", body: "", plan: { allocationPct: null, safetyLow: null, safetyHigh: null, discountLow: null, discountHigh: null, ...values } });
  const state = { watchlist: [first,second,{ id: "other", symbol: "MSFT" }], journal: [plan("p1","a","2026-11-04",{ allocationPct: 3, safetyLow: 20, safetyHigh: 25 }),plan("p2","b","2026-11-07",{ discountLow: 15, discountHigh: 19 }),{ id: "trade", watchId: "b", kind: "trade" }],
    jobs: [{ id: "job1", watchId: "a", kind: "watch-pe", status: "waiting" },{ id: "job2", watchId: "b", kind: "watch-pe", status: "waiting", quotePolicy: {}, question: "watchId=b" }],
    analyses: [{ watchId: "b", report: "research/new.html" }], orders: [{ watchId: "b" }], disciplines: [{ watchId: "b" }], watchRankHistory: [{ watchIds: ["b","other","a"] }] };
  const originals = structuredClone(state.watchlist.slice(0,2));
  assert.equal(consolidateStateWatchlist(state,"2026-11-10T02:00:00Z"),true);
  assert.equal(state.watchlist.length,2);
  const merged=state.watchlist[0];
  assert.equal(merged.id,"a");
  assert.equal(merged.symbol,"CLFD");
  assert.equal(merged.price,30);
  assert.equal(merged.priceSession,undefined);
  assert.equal(merged.priceSourceUrl,first.priceSourceUrl);
  assert.equal(merged.report,"research/new.html");
  assert.equal(merged.pe.value,10);
  assert.equal(merged.targetPrice,25);
  assert.equal(merged.attention,4);
  assert.equal(merged.watchCategoryId,"potential");
  assert.match(merged.note,/旧笔记/); assert.match(merged.note,/补充笔记/);
  assert.deepEqual(state.watchMergeHistory[0].originals,originals);
  assert.equal(state.watchMergeHistory[0].plans.length,2);
  assert.equal(state.journal.filter((entry)=>entry.kind==="plan").length,1);
  assert.deepEqual(state.journal[0].plan,{ allocationPct:3,safetyLow:20,safetyHigh:25,discountLow:15,discountHigh:19 });
  for (const key of ["journal","jobs","analyses","orders","disciplines"]) assert.ok(state[key].every((entry)=>entry.watchId==="a"));
  assert.deepEqual(state.watchRankHistory[0].watchIds,["a","other"]);
  assert.equal(state.jobs[0].status,"cancelled");
  assert.equal(state.jobs[1].status,"waiting");
  assert.equal(state.jobs[1].question,"watchId=a");
  const saved=JSON.stringify(state);
  assert.equal(consolidateStateWatchlist(state,"2026-11-11T00:00:00Z"),false);
  assert.equal(JSON.stringify(state),saved);
});

test("incomplete newer research does not replace a complete report, and losing ranges remain archived", () => {
  const state={ watchlist:[{ id:"a",symbol:"EX",name:"EX",note:"",trigger:"",research:{details:"完整"},report:"old.html",researchedAt:"2026-01-01T00:00:00Z" },{ id:"b",symbol:"EX",name:"EX",note:"",trigger:"",research:{details:""},researchedAt:"2026-11-10T00:00:00Z" }],
    journal:[{ id:"p1",kind:"plan",watchId:"a",date:"2026-01-01",body:"手填理由",plan:{safetyLow:10,safetyHigh:15} },{id:"p2",kind:"plan",watchId:"b",date:"2026-11-10",body:"另一个理由",plan:{safetyLow:20,safetyHigh:25}}] };
  consolidateStateWatchlist(state,"2026-11-10T00:00:00Z");
  assert.equal(state.watchlist[0].report,"old.html");
  assert.equal(state.journal[0].plan.safetyLow,20);
  assert.equal(state.watchMergeHistory[0].plans[0].plan.safetyLow,10);
  assert.match(state.journal[0].body,/手填理由/);
});
