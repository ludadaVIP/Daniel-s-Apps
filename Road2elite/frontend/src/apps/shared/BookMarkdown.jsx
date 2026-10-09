import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { bookRemarkPlugins, bookHeadingId, normalizeBookMarkdown } from "./bookMarkdownModel.js";
import "./bookMarkdown.css";

export { bookHeadingId, normalizeBookMarkdown } from "./bookMarkdownModel.js";

export default function BookMarkdown({ markdown, className, emptyText = "还没填内容。", withAnchors = false }) {
  const content = useMemo(() => normalizeBookMarkdown(markdown), [markdown]);
  const components = {
    a: ({ node, href, children, ...props }) => <a href={href} target="_blank" rel="noreferrer noopener" {...props}>{children}</a>,
    table: ({ node, children, ...props }) => <div className="book-table-wrap"><table {...props}>{children}</table></div>,
    img: ({ node, alt, ...props }) => <img alt={alt || ""} loading="lazy" {...props} />,
    ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((level) => {
      const Tag = `h${level}`;
      return [Tag, ({ node, children, ...props }) => {
        const id = withAnchors ? bookHeadingId(node.position.start) : undefined;
        return <Tag id={id} {...props}>{children}</Tag>;
      }];
    })),
  };
  return <article className={`${className} book-markdown`}>
    {content.trim() ? <ReactMarkdown remarkPlugins={bookRemarkPlugins} components={components}>{content}</ReactMarkdown> : <p className="book-markdown-empty">{emptyText}</p>}
  </article>;
}

export function BookInlineMarkdown({ markdown }) {
  return <ReactMarkdown remarkPlugins={bookRemarkPlugins} components={{ p: ({ children }) => <>{children}</> }}>
    {String(markdown || "")}
  </ReactMarkdown>;
}
