import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { bookRemarkPlugins, bookHeadingId, normalizeBookMarkdown } from "./bookMarkdownModel.js";
import "./bookMarkdown.css";

export { bookHeadingId, normalizeBookMarkdown } from "./bookMarkdownModel.js";

const IMAGE_EXTENSION = /\.(?:avif|bmp|gif|jpe?g|png|svg|tiff?|webp)$/i;

function looksLikeImageUrl(href) {
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return IMAGE_EXTENSION.test(url.pathname) || url.searchParams.get("purpose") === "inline";
  } catch {
    return false;
  }
}

function LinkedImage({ href, children }) {
  const [failed, setFailed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fallback = <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>;
  if (!looksLikeImageUrl(href) || failed) return fallback;

  return <figure className="book-markdown-link-image">
    <button className="book-markdown-image-button" type="button" onClick={() => setIsOpen(true)} aria-label="查看大图">
      <img src={href} alt="" loading="lazy" onError={() => setFailed(true)} />
    </button>
    <figcaption>{children}</figcaption>
    {isOpen && <ImageLightbox src={href} onClose={() => setIsOpen(false)} />}
  </figure>;
}

function ImageLightbox({ src, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return <div className="book-markdown-lightbox" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <div className="book-markdown-lightbox-panel" role="dialog" aria-modal="true" aria-label="图片预览">
      <button className="book-markdown-lightbox-close" type="button" onClick={onClose} aria-label="关闭图片预览">×</button>
      <img src={src} alt="" />
    </div>
  </div>;
}

function MarkdownImage({ src, alt, ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    const label = alt || (() => {
      try { return new URL(src).pathname.split("/").filter(Boolean).at(-1) || src; }
      catch { return src; }
    })();
    return <span className="book-markdown-image-fallback">{label}</span>;
  }
  return <img src={src} alt={alt || ""} loading="lazy" onError={() => setFailed(true)} {...props} />;
}

export default function BookMarkdown({ markdown, className, emptyText = "还没填内容。", withAnchors = false }) {
  const content = useMemo(() => normalizeBookMarkdown(markdown), [markdown]);
  const components = {
    a: ({ node, href, children, ...props }) => looksLikeImageUrl(href)
      ? <LinkedImage href={href}>{children}</LinkedImage>
      : <a href={href} target="_blank" rel="noreferrer noopener" {...props}>{children}</a>,
    table: ({ node, children, ...props }) => <div className="book-table-wrap"><table {...props}>{children}</table></div>,
    img: ({ node, alt, src, ...props }) => <MarkdownImage src={src} alt={alt} {...props} />,
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
