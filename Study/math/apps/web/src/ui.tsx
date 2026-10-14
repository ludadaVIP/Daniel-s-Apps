import type { LanguageMode, LocalizedText } from '@study/shared';
import ReactMarkdown from 'react-markdown';
import { Localized } from '@study/ui';
export function Text({
  text,
  mode,
}: {
  text: LocalizedText;
  mode: LanguageMode;
}) {
  return <Localized text={text} mode={mode} secondaryClassName="math-en" />;
}
export function Markdown({
  source,
  mode,
}: {
  source: string;
  mode: LanguageMode;
}) {
  const [zh = '', en = ''] = source.split('<!-- EN -->');
  return (
    <div
      className={`math-prose ${mode === 'bilingual' ? 'math-prose-pair' : ''}`}
    >
      {mode !== 'en' && (
        <section lang="zh">
          <ReactMarkdown>{zh}</ReactMarkdown>
        </section>
      )}
      {mode !== 'zh' && (
        <section lang="en">
          <ReactMarkdown>{en}</ReactMarkdown>
        </section>
      )}
    </div>
  );
}
export function Fraction({ n, d }: { n: number; d: number }) {
  return (
    <span className="math-fraction" aria-label={`${n}/${d}`}>
      <span aria-hidden="true">{n}</span>
      <span aria-hidden="true">{d}</span>
    </span>
  );
}
export function Strip({
  n,
  d,
  onChange,
}: {
  n: number;
  d: number;
  onChange?: (n: number) => void;
}) {
  return (
    <div
      className="math-strip"
      role="group"
      aria-label={`${n}/${d}`}
      style={{ gridTemplateColumns: `repeat(${d},1fr)` }}
    >
      {Array.from({ length: d }, (_, i) =>
        onChange ? (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}/${d}`}
            aria-pressed={i < n}
            className={i < n ? 'filled' : ''}
            onClick={() => onChange(i < n ? i : i + 1)}
          >
            {i + 1}
          </button>
        ) : (
          <span key={i} className={i < n ? 'filled' : ''}>
            {i + 1}
          </span>
        ),
      )}
    </div>
  );
}
