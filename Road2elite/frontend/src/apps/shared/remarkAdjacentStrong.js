// CommonMark treats punctuation immediately before ** as an invalid closing
// delimiter when the next character is a letter. Chinese prose often writes
// **名称（译名）**的人 without a separating space, so recover that emphasis.
// Work on parsed text nodes to leave code, link destinations, and Markdown
// that was already parsed normally alone.
const punctuation = /[\p{P}\p{S}]/u;
const word = /[\p{L}\p{N}]/u;

export default function remarkAdjacentStrong() {
  return (tree, file) => {
    const source = String(file.value);

    function visit(parent) {
      if (!parent.children) return;
      parent.children = parent.children.flatMap((node) => {
        if (node.type !== "text") {
          visit(node);
          return [node];
        }

        // An escape or entity changes node.value. In that case, leave the
        // node intact so literal/escaped asterisks never become formatting.
        const start = node.position?.start.offset;
        const end = node.position?.end.offset;
        if (start == null || end == null || source.slice(start, end) !== node.value) return [node];

        const value = node.value;
        const result = [];
        let cursor = 0;
        for (const match of value.matchAll(/\*\*([^*\r\n]+?)\*\*/gu)) {
          const index = match.index;
          const after = index + match[0].length;
          const inner = match[1];
          if ((index > 0 && value[index - 1] === "*") || value[after] === "*" ||
              /^\s/u.test(inner) || !punctuation.test([...inner].at(-1)) || !word.test(value[after] || "")) continue;

          if (index > cursor) result.push({ type: "text", value: value.slice(cursor, index) });
          result.push({ type: "strong", children: [{ type: "text", value: inner }] });
          cursor = after;
        }
        if (!result.length) return [node];
        if (cursor < value.length) result.push({ type: "text", value: value.slice(cursor) });
        return result;
      });
    }

    visit(tree);
  };
}
