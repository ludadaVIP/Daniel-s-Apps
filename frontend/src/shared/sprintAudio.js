export const QUEUE_PAUSE_MS = 180;

export function wait(ms = QUEUE_PAUSE_MS) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function cleanAudioText(text) {
  return String(text || "").trim();
}

export function getBlockMainAudioText(block) {
  return cleanAudioText(block?.audioText || block?.text || block?.pattern);
}

export function getBlockExamples(block) {
  if (Array.isArray(block?.examples)) return block.examples;
  return block?.example ? [block.example] : [];
}

export function buildBlockAudioItems(block, getConjugationItems = () => []) {
  const blockId = block?.id || "block";
  const items = [];
  const seen = new Set();

  const push = (key, text) => {
    const cleanText = cleanAudioText(text);
    if (!cleanText) return;

    const signature = cleanText.replace(/\s+/g, " ").toLowerCase();
    if (seen.has(signature)) return;

    seen.add(signature);
    items.push({ blockId, key, text: cleanText });
  };

  push(block?.id || `${blockId}:main`, getBlockMainAudioText(block));

  getConjugationItems(block).forEach((item) => {
    push(`${blockId}:conjugation:${item.key}`, item.text);
  });

  getBlockExamples(block).forEach((example, index) => {
    push(`${blockId}:example:${index}`, example.audioText || example.text);
  });

  return items;
}

export function buildSectionAudioItems(section, getConjugationItems) {
  return (section?.blocks || []).flatMap((block) =>
    buildBlockAudioItems(block, getConjugationItems),
  );
}
