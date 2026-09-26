// CommonMark can show literal ** around Chinese answer labels such as
// “？**答案：**15”. Add a separator after a closing marker whose text ends
// in punctuation, while leaving fenced and inline code untouched.
const codeSegments = /(`{3,}[\s\S]*?`{3,}|~{3,}[\s\S]*?~{3,}|`[^`\n]*`)/g;

export function renderReadyMarkdown(source) {
  return String(source).split(codeSegments).map((segment, index) => {
    if (index % 2) return segment;
    return segment.replace(/\*\*([^*\n]+?)\*\*/gu, (whole, inner, offset, text) => {
      const next = text[offset + whole.length] || '';
      return /[\p{P}\p{S}]$/u.test(inner) && /[\p{L}\p{N}]/u.test(next) ? `${whole} ` : whole;
    });
  }).join('');
}
