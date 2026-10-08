import { useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
export type LabProps = { mode: LanguageMode; onExplore?: () => void };
export function LabOptions({
  mode,
  name,
  values,
  value,
  set,
  disabled = false,
}: {
  mode: LanguageMode;
  name: [string, string];
  values: { id: number; zh: string; en: string }[];
  value: number;
  set: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="phy-force-options">
      <span>
        <B zh={name[0]} en={name[1]} mode={mode} />
      </span>
      <div
        className="phy-segment"
        role="group"
        aria-label={mode === 'en' ? name[1] : name[0]}
      >
        {values.map((o) => (
          <button
            key={o.id}
            aria-pressed={value === o.id}
            className={value === o.id ? 'selected' : ''}
            disabled={disabled}
            onClick={() => set(o.id)}
          >
            {o.zh === o.en ? o.zh : <B zh={o.zh} en={o.en} mode={mode} />}
          </button>
        ))}
      </div>
    </div>
  );
}
export function LabMetric({
  mode,
  title,
  children,
}: {
  mode: LanguageMode;
  title: [string, string];
  children: ReactNode;
}) {
  return (
    <div>
      <B zh={title[0]} en={title[1]} mode={mode} />
      <strong>{children}</strong>
    </div>
  );
}
export function useComparisons(required: string[], onExplore?: () => void) {
  const [seen, setSeen] = useState<string[]>([]);
  return {
    count: required.filter((key) => seen.includes(key)).length,
    record: (key: string) => {
      const next = [...new Set([...seen, key])];
      setSeen(next);
      if (required.every((item) => next.includes(item))) onExplore?.();
    },
  };
}
