#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../data/EspVocab");
const LEVELS_DIR = path.join(DATA_DIR, "levels");
const MAX_PHRASES_PER_GROUP = 15;
const BAD_EXAMPLE_PATTERNS = [
  /es una expresión útil para organizar tus ideas/i,
  /is a useful expression for organising your ideas/i,
  /is a useful expression for organizing your ideas/i,
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function signature(text) {
  return String(text || "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[a-záéíóúüñ]+/gi, "_")
    .replace(/\s+/g, " ")
    .trim();
}

function lemmaFamily(lemma) {
  const words = String(lemma || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return words[0] || "";
}

function inspectGroup(levelId, group) {
  const file = path.join(LEVELS_DIR, levelId, `${group.id}.json`);
  const data = readJson(file);
  const posCounts = {};
  const families = new Map();
  const exampleSigs = new Map();
  const badExamples = [];

  for (const word of data.words || []) {
    const pos = word.pos || "other";
    posCounts[pos] = (posCounts[pos] || 0) + 1;

    const family = lemmaFamily(word.lemma);
    if (family) families.set(family, (families.get(family) || 0) + 1);

    const sig = signature(word.example);
    if (sig) exampleSigs.set(sig, (exampleSigs.get(sig) || 0) + 1);

    const combined = `${word.example || ""}\n${word.example_en || ""}`;
    if (BAD_EXAMPLE_PATTERNS.some((pattern) => pattern.test(combined))) {
      badExamples.push(word.lemma);
    }
  }

  const repeatedExamples = [...exampleSigs.entries()]
    .filter(([, count]) => count >= 8)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const repeatedFamilies = [...families.entries()]
    .filter(([, count]) => count >= 8)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const issues = [];
  if ((posCounts.phrase || 0) > MAX_PHRASES_PER_GROUP) {
    issues.push(`phrase count ${posCounts.phrase} > ${MAX_PHRASES_PER_GROUP}`);
  }
  if (badExamples.length) {
    issues.push(`${badExamples.length} filler examples`);
  }
  if (repeatedExamples.length) {
    issues.push(`repeated example templates: ${repeatedExamples.map(([sig, count]) => `${count}× ${sig}`).join("; ")}`);
  }
  if (repeatedFamilies.length) {
    issues.push(`possible matrix lemmas: ${repeatedFamilies.map(([family, count]) => `${family}:${count}`).join(", ")}`);
  }

  return {
    level: levelId,
    group: group.id,
    title: group.title,
    total: (data.words || []).length,
    posCounts,
    issues,
  };
}

function main() {
  const levels = readJson(path.join(DATA_DIR, "levels.json")).levels || [];
  const results = [];
  for (const level of levels) {
    const index = readJson(path.join(LEVELS_DIR, level.id, "index.json"));
    for (const group of index.groups || []) {
      results.push(inspectGroup(level.id, group));
    }
  }

  let issueCount = 0;
  for (const result of results) {
    if (!result.issues.length) continue;
    issueCount += result.issues.length;
    console.log(`\n${result.level}/${result.group} · ${result.title}`);
    console.log(`  total=${result.total} pos=${JSON.stringify(result.posCounts)}`);
    for (const issue of result.issues) console.log(`  - ${issue}`);
  }
  console.log(`\nQuality issues: ${issueCount}`);
  process.exitCode = issueCount ? 1 : 0;
}

main();
