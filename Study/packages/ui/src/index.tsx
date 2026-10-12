import { useEffect, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';

function storedLanguage(): LanguageMode {
  try {
    const stored = window.localStorage.getItem('study-language');
    return stored === 'zh' || stored === 'en' || stored === 'bilingual'
      ? stored
      : 'bilingual';
  } catch {
    return 'bilingual';
  }
}

export function useLanguageMode() {
  const [mode, setMode] = useState<LanguageMode>(storedLanguage);

  useEffect(() => {
    document.documentElement.lang = mode === 'en' ? 'en' : 'zh';
    try {
      window.localStorage.setItem('study-language', mode);
    } catch {
      // Continue without persistence when storage is unavailable.
    }
  }, [mode]);

  return [mode, setMode] as const;
}

export function LanguageSwitcher({
  mode,
  onChange,
  className,
}: {
  mode: LanguageMode;
  onChange: (mode: LanguageMode) => void;
  className?: string;
}) {
  return (
    <div className={className} role="group" aria-label="Language / 语言">
      {(
        [
          ['zh', '中文'],
          ['en', 'EN'],
          ['bilingual', '双语'],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={mode === value ? 'selected' : ''}
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type LocalizedProps = {
  text: LocalizedText;
  mode: LanguageMode;
  className?: string;
  secondaryClassName?: string;
};

export function Localized({
  text,
  mode,
  className,
  secondaryClassName,
}: LocalizedProps) {
  if (mode === 'en') return <span className={className}>{text.en}</span>;
  if (mode === 'zh') return <span className={className}>{text.zh}</span>;

  return (
    <span className={className}>
      <span>{text.zh}</span>
      <span
        className={
          secondaryClassName ?? 'block text-[0.78em] font-normal opacity-70'
        }
      >
        {text.en}
      </span>
    </span>
  );
}

/** Shared, space-efficient navigation for every Study subject. */
export function StudyHeader({
  brand,
  navigation,
  controls,
  home,
  label,
}: {
  brand: ReactNode;
  navigation: ReactNode;
  controls?: ReactNode;
  home: ReactNode;
  label: string;
}) {
  return (
    <header className="study-learning-header">
      <div className="study-learning-brand">{brand}</div>
      <nav className="study-learning-nav" aria-label={label}>
        {navigation}
      </nav>
      <div className="study-learning-tools">
        {controls}
        {home}
      </div>
    </header>
  );
}

export function QuestionNavigator({
  index,
  count,
  onChange,
  mode,
}: {
  index: number;
  count: number;
  onChange: (index: number) => void;
  mode: LanguageMode;
}) {
  return (
    <div
      className="study-question-navigation"
      role="group"
      aria-label={mode === 'en' ? 'Practice questions' : '练习题目'}
    >
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onChange(index - 1)}
      >
        {mode === 'en' ? '← Previous' : '← 上一题'}
      </button>
      <div>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            aria-pressed={index === i}
            aria-label={mode === 'en' ? `Question ${i + 1}` : `第 ${i + 1} 题`}
            onClick={() => onChange(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={index === count - 1}
        onClick={() => onChange(index + 1)}
      >
        {mode === 'en' ? 'Next →' : '下一题 →'}
      </button>
    </div>
  );
}
