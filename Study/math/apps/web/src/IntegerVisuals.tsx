import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  positiveFactors,
  commonNumbers,
  positiveMultiples,
} from './integerModels';
export function FactorArray({
  n,
  rows,
  mode,
  hideColumns = false,
}: {
  n: number;
  rows: number;
  mode: LanguageMode;
  hideColumns?: boolean;
}) {
  if (!positiveFactors(n).includes(rows))
    throw new RangeError('Use a complete factor array');
  const columns = n / rows,
    u = 14;
  return (
    <figure className="math-integer-array">
      <svg
        viewBox={`0 0 ${20 + columns * u} ${20 + rows * u}`}
        style={{ height: Math.min(240, 20 + rows * u) }}
        role="img"
        aria-label={
          mode === 'en'
            ? `${n} ${n === 1 ? 'counter' : 'counters'} in ${rows} equal ${rows === 1 ? 'row' : 'rows'}${hideColumns ? '' : `, ${columns} per row`}. Each tile counts one.`
            : `${n} 个计数小格，分 ${rows} 个相等行${hideColumns ? '' : `，每行 ${columns} 个`}，每格计一个。`
        }
      >
        {Array.from({ length: n }, (_, i) => (
          <rect
            className="integer-counter"
            key={i}
            x={10 + (i % columns) * u}
            y={10 + Math.floor(i / columns) * u}
            width="12"
            height="12"
            rx="1"
            fill={Math.floor(i / columns) % 2 ? '#cabb7b' : '#9d8bb9'}
          />
        ))}
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            `${rows} 行 · 每行 ${hideColumns ? '?' : columns} 个 · 合计 ${n} 个。每格是计数单位，不是平方厘米。`,
            `${rows} ${rows === 1 ? 'row' : 'rows'} · ${hideColumns ? '?' : columns} per row · ${n} in total. Each tile is a count unit, not a square centimetre.`,
          )}
        />
      </figcaption>
    </figure>
  );
}
export function CommonLists({
  a,
  b,
  kind,
  mode,
  reveal = false,
  expanded = false,
}: {
  a: number;
  b: number;
  expanded?: boolean;
  kind: 'factors' | 'multiples';
  mode: LanguageMode;
  reveal?: boolean;
}) {
  const m = commonNumbers(a, b),
    lists =
      kind === 'factors'
        ? [m.aFactors, m.bFactors]
        : expanded
          ? [positiveMultiples(a, m.lcm / a), positiveMultiples(b, m.lcm / b)]
          : [m.aMultiples, m.bMultiples],
    common =
      kind === 'factors'
        ? m.commonFactors
        : expanded
          ? [m.lcm]
          : m.visibleCommon;
  return (
    <div className="math-integer-lists">
      {lists.map((list, i) => (
        <div key={i}>
          <strong>
            <Text
              mode={mode}
              text={
                kind === 'factors'
                  ? t(
                      `${i === 0 ? a : b} 的正因数`,
                      `Positive factors of ${i === 0 ? a : b}`,
                    )
                  : expanded
                    ? t(
                        `${i === 0 ? a : b} 的正倍数，直到首个共同点`,
                        `Positive multiples of ${i === 0 ? a : b}, through the first common value`,
                      )
                    : t(
                        `${i === 0 ? a : b} 的前 8 个正倍数`,
                        `First 8 positive multiples of ${i === 0 ? a : b}`,
                      )
              }
            />
          </strong>
          <div>
            {list.map((v) => (
              <span
                key={v}
                className={reveal && common.includes(v) ? 'is-common' : ''}
              >
                {v}
                {reveal && common.includes(v) && (
                  <b aria-label={mode === 'en' ? 'Common' : '共同'}> ·</b>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
