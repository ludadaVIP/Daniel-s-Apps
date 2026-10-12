import { Localized } from '@study/ui';
import type { LanguageMode, LocalizedText } from '@study/shared';
import ReactMarkdown from 'react-markdown';
export function Text({
  text,
  mode,
  className = '',
}: {
  text: LocalizedText;
  mode: LanguageMode;
  className?: string;
}) {
  return (
    <Localized
      text={text}
      mode={mode}
      className={className}
      secondaryClassName="bio-en"
    />
  );
}
export function Markdown({
  text,
  mode,
}: {
  text: LocalizedText;
  mode: LanguageMode;
}) {
  return (
    <div className="bio-prose">
      {mode !== 'en' && <ReactMarkdown>{text.zh}</ReactMarkdown>}
      {mode !== 'zh' && (
        <div
          className={mode === 'bilingual' ? 'bio-translation' : ''}
          lang="en"
        >
          <ReactMarkdown>{text.en}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
