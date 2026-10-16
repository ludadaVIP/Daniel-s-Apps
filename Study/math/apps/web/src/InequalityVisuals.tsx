import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import {
  parseRealSet,
  realSetText,
  type RealInterval,
} from './inequalityModels';
export function InequalityLine({
  set,
  mode,
  wide = false,
  name = 'Solution set',
  caption = true,
}: {
  set: RealInterval;
  mode: LanguageMode;
  wide?: boolean;
  name?: string;
  caption?: boolean;
}) {
  const min = wide ? -12 : -5,
    max = wide ? 12 : 5,
    step = wide ? 2 : 1,
    x = (v: number) => 56 + ((v - min) * 488) / (max - min),
    num = (r: readonly [bigint, bigint]) => Number(r[0]) / Number(r[1]);
  const lo = set.kind === 'interval' && set.low ? num(set.low) : -Infinity,
    hi = set.kind === 'interval' && set.high ? num(set.high) : Infinity;
  const visible = set.kind === 'interval' && hi >= min && lo <= max;
  const a = Math.max(min, lo),
    b = Math.min(max, hi);
  return (
    <figure className="math-inequality-figure">
      <div
        className="math-inequality-scroll"
        role="region"
        aria-label={name}
        tabIndex={0}
      >
        <svg
          viewBox="0 0 600 150"
          role="img"
          aria-label={
            mode === 'en'
              ? `${name}: ${realSetText(set)}. Window ${min} to ${max}; open circles exclude, filled circles include endpoints.`
              : `${name}：${realSetText(set)}。视窗 ${min} 至 ${max}；空心不包含、实心包含端点。`
          }
        >
          <path
            d="M40 80H560m-8-5 8 5-8 5M48 75l-8 5 8 5"
            fill="none"
            stroke="currentColor"
          />
          {Array.from(
            { length: (max - min) / step + 1 },
            (_, i) => min + i * step,
          ).map((v) => (
            <g key={v}>
              <path d={`M${x(v)} 74v12`} stroke="currentColor" />
              <text x={x(v)} y="108" textAnchor="middle">
                {v}
              </text>
            </g>
          ))}
          {visible && (
            <g data-set-visible="true" stroke="#5954a3" strokeWidth="5">
              <path d={`M${x(a)} 58H${x(b)}`} />
              {lo < min && (
                <path
                  data-set-continuation="left"
                  d={`M${x(min) + 10} 50l-10 8 10 8`}
                  fill="none"
                />
              )}
              {hi > max && (
                <path
                  data-set-continuation="right"
                  d={`M${x(max) - 10} 50l10 8-10 8`}
                  fill="none"
                />
              )}
            </g>
          )}
          {set.kind === 'interval' &&
            [
              set.low && { value: set.low, closed: set.lowClosed, edge: 'low' },
              set.high && {
                value: set.high,
                closed: set.highClosed,
                edge: 'high',
              },
            ]
              .filter(
                (
                  p,
                ): p is {
                  value: readonly [bigint, bigint];
                  closed: boolean;
                  edge: string;
                } => !!p,
              )
              .filter(
                (p, i, arr) =>
                  num(p.value) >= min &&
                  num(p.value) <= max &&
                  (i === 0 || num(p.value) !== num(arr[0]!.value)),
              )
              .map((p) => (
                <g
                  key={p.edge}
                  data-set-endpoint={textR(p.value)}
                  data-closed={p.closed}
                >
                  <circle
                    cx={x(num(p.value))}
                    cy="58"
                    r="7"
                    fill={p.closed ? '#5954a3' : 'white'}
                    stroke="#5954a3"
                    strokeWidth="3"
                  />
                  <text x={x(num(p.value))} y="30" textAnchor="middle">
                    {textR(p.value)}
                  </text>
                </g>
              ))}
          {!visible && (
            <text x="300" y="42" textAnchor="middle">
              {set.kind === 'empty'
                ? '∅'
                : mode === 'en'
                  ? 'No part in this window'
                  : '此视窗内无部分'}
            </text>
          )}
        </svg>
      </div>
      {caption && (
        <figcaption>
          <Text
            mode={mode}
            text={t(
              `解集 ${realSetText(set)}。空心不包含，实心包含；箭头表示继续超出视窗。`,
              `Set ${realSetText(set)}. Open excludes, filled includes; arrows continue beyond the window.`,
            )}
          />
        </figcaption>
      )}
    </figure>
  );
}
export function InequalityDiagram({
  source,
  mode,
  wide,
}: {
  source: string;
  mode: LanguageMode;
  wide?: boolean;
}) {
  const set = parseRealSet(source);
  return set ? (
    <InequalityLine set={set} mode={mode} wide={wide} caption={false} />
  ) : null;
}
