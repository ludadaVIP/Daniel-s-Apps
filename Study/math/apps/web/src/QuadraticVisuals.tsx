import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { completingSquare, solveQuadratic, numericQ } from './quadraticModels';
import { radicalText, type RadicalValue } from './radicalModels';
export function QuadraticFrame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-quadratic-figure">
      <div
        className="math-quadratic-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Quadratic or area diagram; scroll locally'
            : '二次关系或面积图；需要时在图内滚动'
        }
      >
        {children}
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export const approximateRoot = (r: RadicalValue) =>
  [...r].reduce((s, [k, c]) => s + Math.sqrt(Number(k)) * numericQ(c), 0);
export function quadraticCurve(source: string, wide = false) {
  const s = solveQuadratic(source);
  if (s.kind === 'higher') throw new RangeError('Not a quadratic/linear graph');
  const a = numericQ(s.a),
    b = numericQ(s.b),
    c = numericQ(s.c),
    xmin = -4,
    xmax = wide ? 12 : 6,
    span = xmax - xmin,
    f = (x: number) => a * x * x + b * x + c;
  return {
    xmin,
    xmax,
    a,
    b,
    c,
    control: [
      { x: xmin, y: f(xmin) },
      { x: xmin + span / 2, y: f(xmin) + ((2 * a * xmin + b) * span) / 2 },
      { x: xmax, y: f(xmax) },
    ],
    roots:
      s.roots?.map((r, i) => ({
        x: approximateRoot(r),
        value: radicalText(r),
        name: `r${i + 1}`,
      })) ?? [],
    solution: s,
  };
}
export function QuadraticGraph({
  source,
  mode,
  shown = false,
  wide = false,
}: {
  source: string;
  mode: LanguageMode;
  shown?: boolean;
  wide?: boolean;
}) {
  const id = useId().replace(/:/g, ''),
    m = quadraticCurve(source, wide),
    x = (v: number) => 60 + ((v - m.xmin) / (m.xmax - m.xmin)) * 480,
    y = (v: number) => 300 - ((v + 4) / 16) * 270,
    p = m.control,
    xticks = Array.from(
      { length: wide ? 9 : 11 },
      (_, i) => -4 + i * (wide ? 2 : 1),
    ),
    yticks = Array.from({ length: 9 }, (_, i) => -4 + i * 2),
    visible = m.roots.filter((r) => r.x >= m.xmin && r.x <= m.xmax);
  return (
    <QuadraticFrame
      mode={mode}
      caption={t(
        '画的是原方程左边减右边 f(x)，零点才对应方程解。曲线只在标尺窗口内显示；根位置像素近似、根值与判别式用精确运算。窗内无交点不代表无实根。',
        'The graph is original left minus right, f(x); zeros correspond to equation solutions. The curve is shown only inside the labelled window. Root pixels are approximate; values/discriminants use exact arithmetic. No visible crossing does not prove no real roots.',
      )}
    >
      <svg
        viewBox="0 0 600 360"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Equation zero graph with labelled axes'
            : '标明坐标轴的方程零点图'
        }
      >
        <defs>
          <clipPath id={id}>
            <rect x="60" y="30" width="480" height="270" />
          </clipPath>
        </defs>
        {xticks.map((v) => (
          <g key={`x${v}`}>
            <path d={`M${x(v)} 30V300`} stroke="#e0dbe8" />
            <text x={x(v)} y={y(0) + 20} textAnchor="middle" fontSize="12">
              {v}
            </text>
          </g>
        ))}
        {yticks.map((v) => (
          <g key={`y${v}`}>
            <path d={`M60 ${y(v)}H540`} stroke="#e0dbe8" />
            {v !== 0 && (
              <text x={x(0) - 10} y={y(v) + 4} textAnchor="end" fontSize="12">
                {v}
              </text>
            )}
          </g>
        ))}
        <path
          d={`M50 ${y(0)}H550M${x(0)} 310V20`}
          stroke="currentColor"
          fill="none"
        />
        <text x="550" y={y(0) - 8}>
          x
        </text>
        <text x={x(0) + 10} y="22">
          f(x)
        </text>
        <path
          data-quadratic-curve
          d={`M${x(p[0]!.x)} ${y(p[0]!.y)} Q${x(p[1]!.x)} ${y(p[1]!.y)} ${x(p[2]!.x)} ${y(p[2]!.y)}`}
          clipPath={`url(#${id})`}
          fill="none"
          stroke="#5954a3"
          strokeWidth="3"
        />
        {shown &&
          visible.map((r, i) => (
            <g key={r.name} data-quadratic-zero={r.value}>
              <circle cx={x(r.x)} cy={y(0)} r="5" fill="#a14532" />
              <text x={x(r.x) + 6} y={y(0) - 12 - (i % 2) * 19} fontSize="12">
                {r.name}
              </text>
            </g>
          ))}
        <text x="60" y="340" fontSize="12">
          {mode === 'en' ? 'x window' : '横轴窗口'}: [{m.xmin},{m.xmax}]; y:
          [-4,12]
        </text>
      </svg>
      {shown && (
        <div className="math-quadratic-legend">
          {m.solution.kind === 'identity' ? (
            <Text
              mode={mode}
              text={t(
                '原式恒等，所有实数都满足，不能只列某个孤立根。',
                'The equation is an identity; every real number satisfies it, not one isolated root.',
              )}
            />
          ) : (
            <>
              <p>
                {m.roots.map((r) => `${r.name}=${r.value}`).join('; ') ||
                  labelNone(mode)}
              </p>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    `本窗可见 ${visible.length} 个零点；${m.roots.length - visible.length} 个在窗外。重根只标一个位置。`,
                    `This window shows ${visible.length} zeros; ${m.roots.length - visible.length} lie outside. A repeated root marks one location.`,
                  )}
                />
              </p>
            </>
          )}
        </div>
      )}
    </QuadraticFrame>
  );
}
const labelNone = (mode: LanguageMode) =>
  mode === 'en' ? 'No real zeros.' : '没有实数零点。';
export function CompletingArea({
  source,
  mode,
  xValue = 3,
  filled = false,
}: {
  source: string;
  mode: LanguageMode;
  xValue?: number;
  filled?: boolean;
}) {
  const m = completingSquare(source),
    p = numericQ(m.p);
  if (p <= 0)
    return (
      <p>
        <Text
          mode={mode}
          text={t(
            '此式半系数不为正；用带符号代数配方，不画负宽度的正面积图。',
            'Here the half-coefficient is not positive. Complete algebraically with signs; do not draw a positive-area diagram with negative widths.',
          )}
        />
      </p>
    );
  const unit = 280 / (xValue + p),
    start = { x: 80, y: 40 },
    x = unit * xValue,
    side = unit * p;
  return (
    <QuadraticFrame
      mode={mode}
      caption={t(
        '图只用正 x 示意 x²+2px+p²=(x+p)²；两条 px 不重叠，缺角真实是 p×p。图不要求方程所有解都为正，负根仍由代数保留。改变图例 x 不改变原方程。',
        'Positive x illustrates x²+2px+p²=(x+p)². The two px strips do not overlap and the missing corner is p×p. This does not require all equation roots to be positive: retain negative algebraic roots. Changing the illustration’s x does not change the equation.',
      )}
    >
      <svg
        viewBox="0 0 600 380"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Completing-square pieces with an actual missing corner'
            : '有真实缺角的配方面积拼块'
        }
      >
        <rect
          data-complete-piece="square"
          x={start.x}
          y={start.y}
          width={x}
          height={x}
          fill="#ece7f6"
          stroke="#5954a3"
        />
        <text x={start.x + x / 2} y={start.y + x / 2 + 5} textAnchor="middle">
          x²
        </text>
        <rect
          data-complete-piece="right"
          x={start.x + x}
          y={start.y}
          width={side}
          height={x}
          fill="#e5edf4"
          stroke="#5954a3"
        />
        <text
          x={start.x + x + side / 2}
          y={start.y + x / 2 + 5}
          textAnchor="middle"
        >
          px
        </text>
        <rect
          data-complete-piece="bottom"
          x={start.x}
          y={start.y + x}
          width={x}
          height={side}
          fill="#e5edf4"
          stroke="#5954a3"
        />
        <text
          x={start.x + x / 2}
          y={start.y + x + side / 2 + 5}
          textAnchor="middle"
        >
          px
        </text>
        <rect
          data-completing-corner
          x={start.x + x}
          y={start.y + x}
          width={side}
          height={side}
          fill={filled ? '#f3e7dd' : 'none'}
          stroke="#a14532"
          strokeDasharray={filled ? undefined : '5 4'}
        />
        <text
          x={start.x + x + side / 2}
          y={start.y + x + side / 2 + 5}
          textAnchor="middle"
        >
          {filled ? 'p²' : '?'}
        </text>
        <text x="220" y="352" textAnchor="middle">
          x+p
        </text>
        <text x="390" y="120">
          x={xValue}; p={textR(m.p)}
        </text>
        <text x="390" y="155">
          {filled ? `p²=${textR(m.added)}` : 'p²=?'}
        </text>
      </svg>
    </QuadraticFrame>
  );
}
