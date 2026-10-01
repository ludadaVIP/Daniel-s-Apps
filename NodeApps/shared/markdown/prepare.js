// Some existing notes place a closing ** immediately after punctuation and
// immediately before a letter. CommonMark treats that marker as text. Add a
// separator for rendering only; the saved Markdown stays untouched.
const codeSegments = /(`{3,}[\s\S]*?`{3,}|~{3,}[\s\S]*?~{3,}|`[^`\n]*`)/g;

export function prepareMarkdown(source) {
  return String(source ?? '').split(codeSegments).map((segment, index) => {
    if (index % 2) return segment;
    return segment.replace(/\*\*([^*\n]+?)\*\*/gu, (whole, inner, offset, text) => {
      const next = text[offset + whole.length] || '';
      return /[\p{P}\p{S}]$/u.test(inner) && /[\p{L}\p{N}]/u.test(next) ? `${whole} ` : whole;
    });
  }).join('');
}
