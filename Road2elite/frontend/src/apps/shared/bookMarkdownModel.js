import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkAdjacentStrong from "./remarkAdjacentStrong.js";

export const bookRemarkPlugins = [remarkGfm, remarkAdjacentStrong];
const processor = unified().use(remarkParse).use(bookRemarkPlugins);

// Some AI responses use one or two dashes in table separators. GFM requires three.
export function normalizeBookMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
  let fence = null;
  return lines.map((line, index) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = { char: marker[1][0], length: marker[1].length };
      else if (marker[1][0] === fence.char && marker[1].length >= fence.length) fence = null;
      return line;
    }
    if (fence || !line.includes("|")) return line;
    const trimmed = line.trim();
    const cells = trimmed.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
    if (cells.length < 2 || ![lines[index - 1], lines[index + 1]].some((row) => row?.includes("|")) ||
        !cells.every((cell) => /^:?-{1,}:?$/.test(cell))) return line;
    const fixed = cells.map((cell) => cell.replace(/-+/, (dashes) => "-".repeat(Math.max(3, dashes.length))));
    return `${trimmed.startsWith("|") ? "| " : ""}${fixed.join(" | ")}${trimmed.endsWith("|") ? " |" : ""}`;
  }).join("\n");
}

// Source positions stay stable when React renders a heading more than once.
export function bookHeadingId(position) {
  return `bid-h-${position.line}-${position.column}`;
}

function headingText(node) {
  if (node.type === "image") return node.alt || "";
  if (node.type === "break") return " ";
  return node.children ? node.children.map(headingText).join("") : node.value || "";
}

export function extractBookToc(markdown) {
  const content = normalizeBookMarkdown(markdown);
  const tree = processor.runSync(processor.parse(content), { value: content });
  const items = [];
  function visit(node) {
    if (node.type === "heading") {
      items.push({ level: node.depth, text: headingText(node), id: bookHeadingId(node.position.start) });
    }
    node.children?.forEach(visit);
  }
  visit(tree);
  return items;
}
