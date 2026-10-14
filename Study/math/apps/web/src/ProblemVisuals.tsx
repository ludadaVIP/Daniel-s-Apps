import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { barRelation, type Relation, type Unknown } from './problemModels';
export function ProblemBars({
  relation,
  a,
  b,
  unknown,
  unit,
  mode,
  reveal = false,
}: {
  relation: Relation;
  a: number;
  b: number;
  unknown: Unknown;
  unit: LocalizedText;
  mode: LanguageMode;
  reveal?: boolean;
}) {
  const m = barRelation(relation, a, b, unknown);
  const result = reveal ? String(m.result) : '?';
  const label =
    relation === 'parts'
      ? t(
          `部分 ${a} 与 ${unknown === 'component' ? result : b}；整体 ${unknown === 'result' ? result : m.whole}。`,
          `Parts ${a} and ${unknown === 'component' ? result : b}; whole ${unknown === 'result' ? result : m.whole}.`,
        )
      : relation === 'comparison'
        ? t(
            `较大量 ${unknown === 'component' ? result : a}，较小量 ${b}，相差 ${unknown === 'result' ? result : a - b}。`,
            `Larger quantity ${unknown === 'component' ? result : a}, smaller ${b}, difference ${unknown === 'result' ? result : a - b}.`,
          )
        : t(
            `${a} 个相等组，每组 ${b}，合计 ${result}。`,
            `${a} equal groups of ${b}; total ${result}.`,
          );
  const number = (x: number, y: number, value: number | string) => (
    <text x={x} y={y} textAnchor="middle" fontSize="24" fill="#514879">
      {value}
    </text>
  );
  return (
    <figure className="math-problem-bars">
      <svg
        viewBox="0 0 500 160"
        role="img"
        aria-label={`${mode === 'en' ? label.en : label.zh} ${mode === 'en' ? 'Unit' : '单位'}: ${mode === 'en' ? unit.en : unit.zh}`}
      >
        {relation === 'parts' ? (
          <>
            <path
              d={`M40 35v-8h${m.whole * m.scale}v8`}
              fill="none"
              stroke="#8675a4"
            />
            {number(250, 20, unknown === 'result' ? result : m.whole)}
            <rect
              className="problem-part-a"
              x="40"
              y="50"
              width={m.aWidth}
              height="48"
              fill="#dfd7ed"
              stroke="#8675a4"
            />
            <rect
              className="problem-part-b"
              x={40 + m.aWidth}
              y="50"
              width={m.bWidth}
              height="48"
              fill="#e4d7a8"
              stroke="#b39a4c"
            />
            {number(40 + m.aWidth / 2, 128, a)}
            {number(
              m.whole === 0 ? 120 : 40 + m.aWidth + m.bWidth / 2,
              128,
              unknown === 'component' ? result : b,
            )}
          </>
        ) : relation === 'comparison' ? (
          <>
            <rect
              className="problem-larger"
              x="40"
              y="20"
              width={a * m.scale}
              height="34"
              fill="#dfd7ed"
              stroke="#8675a4"
            />
            <rect
              className="problem-smaller"
              x="40"
              y="94"
              width={m.bWidth}
              height="34"
              fill="#dfd7ed"
              stroke="#8675a4"
            />
            <rect
              className="problem-gap"
              x={40 + m.bWidth}
              y="94"
              width={m.gapWidth}
              height="34"
              fill="#e4d7a8"
              stroke="#b39a4c"
              strokeDasharray="4 3"
            />
            {number(250, 80, unknown === 'component' ? result : a)}
            {number(40 + m.bWidth / 2, 152, b)}
            {number(
              m.whole === 0 ? 120 : 40 + m.bWidth + m.gapWidth / 2,
              152,
              unknown === 'result' ? result : a - b,
            )}
          </>
        ) : (
          <>
            {Array.from({ length: a }, (_, i) => (
              <rect
                key={i}
                className="problem-group"
                x={40 + i * m.aWidth}
                y="50"
                width={m.aWidth}
                height="48"
                fill="#dfd7ed"
                stroke="#8675a4"
              />
            ))}
            <path
              d={`M40 35v-8h${m.whole * m.scale}v8`}
              fill="none"
              stroke="#8675a4"
            />
            {number(250, 20, result)}
            {number(
              250,
              132,
              mode === 'en' ? `${a} groups · ${b} each` : `${a} 组 · 每组 ${b}`,
            )}
          </>
        )}
      </svg>
      <figcaption>
        <Text mode={mode} text={label} />{' '}
        <Text
          mode={mode}
          text={t(
            `单位：${unit.zh}。同图条形共用比例，问号表示要找的量。`,
            `Unit: ${unit.en}. Bars share a scale within this diagram; the question mark identifies the unknown.`,
          )}
        />
      </figcaption>
    </figure>
  );
}
