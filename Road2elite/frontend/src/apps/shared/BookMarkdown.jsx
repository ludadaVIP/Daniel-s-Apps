import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkAdjacentStrong from "./remarkAdjacentStrong";
import "./bookMarkdown.css";

const remarkPlugins = [remarkGfm, remarkAdjacentStrong];

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

export function bookHeadingId(index) {
  return `bid-h-${index}`;
}

export default function BookMarkdown({ markdown, className, emptyText = "还没填内容。", withAnchors = false }) {
  const content = useMemo(() => normalizeBookMarkdown(markdown), [markdown]);
  let headingIndex = 0;
  const components = {
    a: ({ node, href, children, ...props }) => <a href={href} target="_blank" rel="noreferrer noopener" {...props}>{children}</a>,
    table: ({ node, children, ...props }) => <div className="book-table-wrap"><table {...props}>{children}</table></div>,
    img: ({ node, alt, ...props }) => <img alt={alt || ""} loading="lazy" {...props} />,
    ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((level) => {
      const Tag = `h${level}`;
      return [Tag, ({ node, children, ...props }) => {
        const id = withAnchors ? bookHeadingId(headingIndex++) : undefined;
        return <Tag id={id} {...props}>{children}</Tag>;
      }];
    })),
  };
  return <article className={`${className} book-markdown`}>
    {content.trim() ? <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>{content}</ReactMarkdown> : <p className="book-markdown-empty">{emptyText}</p>}
  </article>;
}

export function BookInlineMarkdown({ markdown }) {
  return <ReactMarkdown remarkPlugins={remarkPlugins} components={{ p: ({ children }) => <>{children}</> }}>
    {String(markdown || "")}
  </ReactMarkdown>;
}
