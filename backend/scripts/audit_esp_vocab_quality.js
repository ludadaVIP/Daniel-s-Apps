#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../data/EspVocab");
const LEVELS_DIR = path.join(DATA_DIR, "levels");
const MAX_PHRASES_PER_GROUP = 15;
const SINGLE_WORD_POS = new Set(["noun", "verb", "adj", "adv"]);
const BAD_EXAMPLE_PATTERNS = [
  /es una expresión útil para organizar tus ideas/i,
  /es importante en este contexto/i,
  /is important in this context/i,
  /is a useful expression for organising your ideas/i,
  /is a useful expression for organizing your ideas/i,
  /^tengo un[ao] .+ en casa\.?$/i,
  /^compré un[ao] .+ esta mañana\.?$/i,
  /^necesito un[ao] .+ para hoy\.?$/i,
  /^busco un[ao] .+ para la clase\.?$/i,
  /^intento .+ un poco cada día\.?$/i,
  /^tengo que .+ antes de salir\.?$/i,
  /^quiero .+ con más seguridad\.?$/i,
  /^es importante .+ con calma\.?$/i,
  /^aprendo a .+ en situaciones reales\.?$/i,
  /^este tema es .+\.?$/i,
  /^me parece .+\.?$/i,
  /^es un detalle .+\.?$/i,
  /^normalmente respondo .+\.?$/i,
  /^la situación cambia .+\.?$/i,
  /^lo hago .+ cuando puedo\.?$/i,
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function normaliseExample(text) {
  return String(text || "")
    .normalize("NFC")
    .toLowerCase()
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

function comparableText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function inspectGroup(levelId, group) {
  const file = path.join(LEVELS_DIR, levelId, `${group.id}.json`);
  const data = readJson(file);
  const posCounts = {};
  const families = new Map();
  const exactExamples = new Map();
  const badExamples = [];
  const multiWordNonPhrases = [];
  const suspiciousTranslations = [];

  for (const word of data.words || []) {
    const pos = word.pos || "other";
    posCounts[pos] = (posCounts[pos] || 0) + 1;

    if (SINGLE_WORD_POS.has(pos) && /\s/.test(String(word.lemma || "").trim())) {
      multiWordNonPhrases.push(word.lemma);
    }

    const lemmaComparable = comparableText(word.lemma);
    const translationComparable = comparableText(word.translation_en);
    if (
      lemmaComparable &&
      translationComparable &&
      (lemmaComparable === translationComparable ||
        translationComparable.startsWith(`${lemmaComparable} `) ||
        translationComparable.endsWith(` ${lemmaComparable}`))
    ) {
      suspiciousTranslations.push(word.lemma);
    }

    const family = lemmaFamily(word.lemma);
    if (family) families.set(family, (families.get(family) || 0) + 1);

    const exact = normaliseExample(word.example);
    if (exact) exactExamples.set(exact, (exactExamples.get(exact) || 0) + 1);

    const combined = `${word.example || ""}\n${word.example_en || ""}`;
    if (BAD_EXAMPLE_PATTERNS.some((pattern) => pattern.test(combined))) {
      badExamples.push(word.lemma);
    }
  }

  const repeatedExamples = [...exactExamples.entries()]
    .filter(([, count]) => count >= 2)
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
  if (multiWordNonPhrases.length) {
    issues.push(
      `${multiWordNonPhrases.length} multi-word non-phrase lemmas: ${multiWordNonPhrases
        .slice(0, 8)
        .join(", ")}`
    );
  }
  if (suspiciousTranslations.length) {
    issues.push(
      `${suspiciousTranslations.length} suspicious translations: ${suspiciousTranslations
        .slice(0, 8)
        .join(", ")}`
    );
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
