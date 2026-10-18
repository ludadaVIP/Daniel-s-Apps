import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { unionText, type RealUnion } from './logicModels';

export function SetRegions({
  u,
  a,
  b,
  mode,
}: {
  u: string[];
  a: string[];
  b: string[];
  mode: LanguageMode;
}) {
  const regions = [
    u.filter((x) => a.includes(x) && !b.includes(x)),
    u.filter((x) => a.includes(x) && b.includes(x)),
    u.filter((x) => !a.includes(x) && b.includes(x)),
    u.filter((x) => !a.includes(x) && !b.includes(x)),
  ];
  return (
    <figure className="math-logic-figure">
      <div
        className="math-logic-scroll"
        role="region"
        tabIndex={0}
        aria-label={mode === 'en' ? 'Finite universe regions' : '有限全集分区'}
      >
        <svg
          viewBox="0 0 640 275"
          role="img"
          aria-label={`U={${u}}; A={${a}}; B={${b}}`}
        >
          <rect
            x="15"
            y="15"
            width="610"
            height="245"
            rx="12"
            fill="#faf8f0"
            stroke="currentColor"
          />
          <ellipse
            cx="255"
            cy="135"
            rx="150"
            ry="95"
            fill="#dbeae2"
            stroke="#287365"
          />
          <ellipse
            cx="405"
            cy="135"
            rx="150"
            ry="95"
            fill="#e3def0"
            fillOpacity=".65"
            stroke="#6553a1"
          />
          <text x="35" y="45">
            U
          </text>
          <text x="185" y="70">
            A
          </text>
          <text x="470" y="70">
            B
          </text>
          {regions.map((v, i) => (
            <text
              key={i}
              x={[195, 330, 470, 330][i]}
              y={i === 3 ? 245 : 140}
              textAnchor="middle"
              data-set-region={i}
            >
              {v.length ? v.join(', ') : '∅'}
            </text>
          ))}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '全集分成仅A、交叠、仅B、两者外四区；∅标记该区域无元素，不是一颗元素。图形大小不代表元素个数。',
            'The universe splits into A only, overlap, B only and outside both. ∅ marks an empty region, not an element. Region area does not encode cardinality.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function UnionLine({
  set,
  mode,
  wide = false,
}: {
  set: RealUnion;
  mode: LanguageMode;
  wide?: boolean;
}) {
  const min = wide ? -16 : -8,
    max = -min,
    px = (v: number) => 50 + ((v - min) * 540) / (max - min),
    num = (r: readonly bigint[]) => Number(r[0]) / Number(r[1]);
  const endpoints = set
    .flatMap((s) =>
      s.kind === 'empty'
        ? []
        : [
            s.low && { v: s.low, closed: s.lowClosed },
            s.high && { v: s.high, closed: s.highClosed },
          ],
    )
    .filter((p): p is { v: readonly [bigint, bigint]; closed: boolean } => !!p)
    .filter(
      (p, i, arr) =>
        num(p.v) >= min &&
        num(p.v) <= max &&
        arr.findIndex((q) => textR(q.v) === textR(p.v)) === i,
    );
  return (
    <figure className="math-logic-figure">
      <div
        className="math-logic-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en' ? 'Absolute-value solution line' : '绝对值解集数轴'
        }
      >
        <svg
          viewBox="0 0 640 165"
          role="img"
          aria-label={`${unionText(set)}; ${min}…${max}`}
        >
          <path
            d="M30 95H610m-8-5 8 5-8 5M38 90l-8 5 8 5"
            stroke="currentColor"
            fill="none"
          />
          {Array.from({ length: 9 }, (_, i) => min + (i * (max - min)) / 8).map(
            (x) => (
              <g key={x}>
                <path d={`M${px(x)} 90v10`} stroke="currentColor" />
                <text x={px(x)} y="125" textAnchor="middle">
                  {x}
                </text>
              </g>
            ),
          )}
          {set.map((s, i) => {
            if (s.kind === 'empty') return null;
            const lo = s.low ? num(s.low) : -Infinity,
              hi = s.high ? num(s.high) : Infinity;
            if (lo > max || hi < min) return null;
            return (
              <g key={i} data-solution-part={i}>
                <path
                  d={`M${px(Math.max(min, lo))} 65H${px(Math.min(max, hi))}`}
                  stroke="#6553a1"
                  strokeWidth="5"
                />
                {lo < min && (
                  <path
                    d={`M${px(min) + 10} 57l-10 8 10 8`}
                    fill="none"
                    stroke="#6553a1"
                    strokeWidth="3"
                  />
                )}
                {hi > max && (
                  <path
                    d={`M${px(max) - 10} 57l10 8-10 8`}
                    fill="none"
                    stroke="#6553a1"
                    strokeWidth="3"
                  />
                )}
              </g>
            );
          })}
          {endpoints.map((p, i) => {
            const labelX = endpoints.length === 1 ? 320 : i === 0 ? 175 : 465;
            return (
              <g
                key={textR(p.v)}
                data-endpoint={textR(p.v)}
                data-closed={p.closed}
              >
                <path
                  d={`M${px(num(p.v))} 57L${labelX} 42`}
                  stroke="#8b80aa"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={px(num(p.v))}
                  cy="65"
                  r="7"
                  fill={p.closed ? '#6553a1' : 'white'}
                  stroke="#6553a1"
                  strokeWidth="3"
                />
                <text x={labelX} y="30" textAnchor="middle">
                  {textR(p.v)}
                </text>
              </g>
            );
          })}
          {!set.length && (
            <text x="320" y="45" textAnchor="middle">
              ∅
            </text>
          )}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            `解集 ${unionText(set)}。空心不含、实心含；箭头表示超出视窗继续。视窗不是定义域。`,
            `Solution ${unionText(set)}. Open excludes, filled includes; arrows continue beyond the window. The window is not the domain.`,
          )}
        />
      </figcaption>
    </figure>
  );
}
