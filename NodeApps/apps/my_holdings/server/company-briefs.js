import fs from "node:fs/promises";
import path from "node:path";
import { validateDecisionReport } from "../src/decision-reports.js";

export async function readCompanyEvidence(reports, symbol) {
  const slug = symbol.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const directory = path.join(reports, "decisions");
  const names = await fs.readdir(directory).catch(() => []);
  const candidates = await Promise.all(names.filter(name => name.startsWith(slug + "-") && name.endsWith(".json")).map(async name => {
    try {
      const file = path.join(directory, name);
      const report = validateDecisionReport(JSON.parse(await fs.readFile(file, "utf8")), { symbol });
      return { report, modified: (await fs.stat(file)).mtimeMs };
    } catch { return null; }
  }));
  const latest = candidates.filter(Boolean).sort((a, b) => b.report.analysisDate.localeCompare(a.report.analysisDate) || b.modified - a.modified)[0]?.report;
  if (!latest) return null;
  return { symbol: latest.symbol, analysisDate: latest.analysisDate, financialPeriod: latest.financialPeriod,
    sections: latest.sections, verdict: latest.verdict, sources: latest.sources,
    risks: latest.invalidation, triggers: latest.reviewTriggers, currency: latest.currency };
}
