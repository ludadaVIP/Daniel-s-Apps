// AI answers commonly contain non-breaking spaces, decorative bullets and
// almost-correct Markdown. Repair only the preview, outside code examples.
const codeSegments = /(?:`{3,}[\s\S]*?`{3,}|~{3,}[\s\S]*?~{3,}|(?<!`)(`+)(?!`)(?:(?!\1)[^\n])*\1(?!`)|^ {4}.*$|^\t.*$)/gm;

function repairBlockquoteStrongContinuation(segment) {
  const blocks = segment.split(/(\n[ \t]*\n)/);
  for (let index = 0; index + 2 < blocks.length; index += 2) {
    const quote = blocks[index];
    const paragraph = blocks[index + 2];
    const quoteMarkers = quote.match(/(?<!\\)\*\*/g) ?? [];
    const paragraphMarkers = paragraph.match(/(?<!\\)\*\*/g) ?? [];

    // A strong span cannot cross Markdown block boundaries. When a quote
    // opens it and the immediately following paragraph closes it, split the
    // emphasis so both blocks retain the author's apparent intent.
    if (
      /^[ \t]{0,3}>[ \t]*\*\*/.test(quote)
      && quoteMarkers.length === 1
      && !/^[ \t]*>/.test(paragraph)
      && paragraphMarkers.length === 1
      && /(?<!\\)\*\*[ \t]*$/.test(paragraph)
    ) {
      blocks[index] = `${quote}**`;
      blocks[index + 2] = paragraph.replace(/^([ \t]*)/, '$1**');
    }
  }
  return blocks.join('');
}

function normalizeText(segment) {
  return repairBlockquoteStrongContinuation(segment)
    .replace(/[\u00a0\u200b\ufeff]/g, ' ')
    .replace(/^([ ]{0,3})[•◦●▪‣][ \t]+/gm, '$1- ')
    .replace(/^([ ]{0,3})([0-9０-９]+)[、．）][ \t]*/gm, (_match, indent, number) => `${indent}${number.replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 65248))}. `)
    .replace(/^([ ]{0,3})(#{1,6})(?!#)(?=\S)/gm, '$1$2 ')
    .replace(/^([ ]{0,3})(\d+[.)])(?=\S)/gm, '$1$2 ')
    .replace(/^([ ]{0,3})((?:[|｜][^\n]*)?｜[^\n]*｜[^\n]*)$/gm, (line) => line.replaceAll('｜', '|'))
    // Markdown emphasis cannot contain whitespace immediately after its
    // opening marker or before its closing marker. AI-written quotes and
    // blockquotes often add those spaces, so repair paired markers anywhere
    // in prose (not just when the entire line is bold).
    .replace(/(?<!\\)\*\*[ \t]+([^*\n]*?\S)[ \t]*\*\*/gu, '**$1**')
    .replace(/(?<!\\)\*\*([^*\n]+?)\*\*/gu, (whole, inner, offset, text) => {
      const next = text[offset + whole.length] || '';
      return /[\p{P}\p{S}]$/u.test(inner) && /[\p{L}\p{N}]/u.test(next) ? `${whole} ` : whole;
    });
}

export function prepareMarkdown(source) {
  let text = String(source ?? '').replace(/\r\n?/g, '\n');
  // A whole answer wrapped in a markdown fence is usually a copy artifact.
  const wrapped = /^\s*(`{3,}|~{3,})markdown[ \t]*\n([\s\S]*?)\n\1[ \t]*\s*$/i.exec(text);
  if (wrapped) text = wrapped[2];
  let result = '';
  let cursor = 0;
  for (const match of text.matchAll(codeSegments)) {
    result += normalizeText(text.slice(cursor, match.index)) + match[0];
    cursor = match.index + match[0].length;
  }
  return result + normalizeText(text.slice(cursor));
}
