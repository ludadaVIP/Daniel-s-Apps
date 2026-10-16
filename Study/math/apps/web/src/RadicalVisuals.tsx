import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { readRational } from './rationalModels';
import { textR } from './algebraModels';
import { squareFactor, rootBracket, fixedDecimal } from './radicalModels';
export function RadicalFrame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-radical-figure">
      <div
        className="math-radical-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Real-number or root diagram; scroll locally'
            : '实数或根式图；需要时在图内滚动'
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
export function RealRootLine({
  points,
  mode,
  wide = false,
  shown = false,
}: {
  points: { value: number; label: string }[];
  mode: LanguageMode;
  wide?: boolean;
  shown?: boolean;
}) {
  const max = wide ? 8 : 4,
    x = (v: number) => 300 + (v / max) * 245;
  return (
    <RadicalFrame
      mode={mode}
      caption={t(
        '数轴等单位。点只给近似显示位置，分数或根式标签才保留精确值；改变窗口不改变这个数。没有实数值的表达式不画点。',
        'The real line has equal units. A plotted point is a display approximation; its fraction or radical label retains the exact value. Windows do not change numbers, and expressions without real values have no point.',
      )}
    >
      <svg
        viewBox="0 0 600 180"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Real line with exact-value labels'
            : '带精确值标签的实数轴'
        }
      >
        <path d="M45 100H555m-8-5 8 5-8 5" stroke="currentColor" fill="none" />
        {Array.from({ length: 9 }, (_, i) => (i - 4) * (wide ? 2 : 1)).map(
          (v) => (
            <g key={v}>
              <path d={`M${x(v)} 94v12`} stroke="currentColor" />
              <text x={x(v)} y="130" textAnchor="middle">
                {v}
              </text>
            </g>
          ),
        )}
        {shown &&
          points.map((p, i) => (
            <g key={i} data-real-point={p.label}>
              <circle cx={x(p.value)} cy="100" r="5" fill="#5954a3" />
              <text x={x(p.value)} y={65 - (i % 2) * 18} textAnchor="middle">
                {p.label}
              </text>
            </g>
          ))}
      </svg>
    </RadicalFrame>
  );
}
export function RadicalTiles({
  radicand,
  mode,
  reveal = false,
}: {
  radicand: string;
  mode: LanguageMode;
  reveal?: boolean;
}) {
  const r = readRational(radicand);
  if (r[0] <= 0n || r[1] !== 1n)
    return (
      <p>
        <Text
          mode={mode}
          text={
            r[0] === 0n
              ? t(
                  '面积为零时边长为零，不伪造有面积的正方形。',
                  'Zero area has zero side length; do not draw a positive-area square.',
                )
              : t(
                  '分数被开方数先分别提出平方因子并处理分母；这里不把分子面积当整个分数面积。',
                  'For a fractional radicand extract factors in numerator and denominator; the numerator area is not the whole fractional area.',
                )
          }
        />
      </p>
    );
  const f = squareFactor(r[0]),
    a = Number(f.outside),
    b = Number(f.inside),
    cell = 250 / a;
  return (
    <RadicalFrame
      mode={mode}
      caption={t(
        '同样小正方形组成 a×a 阵列。每块面积 b、边长 √b；外框面积 a²b、边长 a√b。面积和长度分开，不将 √b 标成 b。各案例按外框缩放，不用跨图像素大小比较边长。',
        'Equal small squares form an a×a array. Each has area b and side √b; the outer area is a²b and side a√b. Area and length are distinct: √b is not b. Each case fits its own frame; pixel sizes across cases do not compare lengths.',
      )}
    >
      <svg
        viewBox="0 0 600 340"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Square-factor area and side-length construction'
            : '平方因子的面积与边长构造'
        }
      >
        {Array.from({ length: a * a }, (_, i) => (
          <g key={i} data-root-tile>
            <rect
              x={120 + (i % a) * cell}
              y={35 + Math.floor(i / a) * cell}
              width={cell}
              height={cell}
              fill={i % 2 ? '#e5edf4' : '#ece7f6'}
              stroke="#5954a3"
            />
            {cell >= 30 && (
              <text
                x={120 + ((i % a) + 0.5) * cell}
                y={35 + (Math.floor(i / a) + 0.5) * cell + 4}
                textAnchor="middle"
                fontSize="12"
              >
                {b}
              </text>
            )}
          </g>
        ))}
        <text x="390" y="150">
          {mode === 'en' ? 'area' : '面积'}={radicand}
        </text>
        <text x="245" y="315" textAnchor="middle">
          {reveal ? `${a}×√${b}` : `√${radicand}`}
        </text>
        {reveal && (
          <text x="390" y="180">
            {a}²×{b}={radicand}
          </text>
        )}
      </svg>
    </RadicalFrame>
  );
}
export function RootBoundsView({
  radicand,
  places,
  mode,
  shown = false,
}: {
  radicand: string;
  places: number;
  mode: LanguageMode;
  shown?: boolean;
}) {
  const b = rootBracket(radicand, places),
    scale = Number(b.scale),
    l = Number(b.k) / scale,
    h = b.exact ? l + 1 / scale : (Number(b.k) + 1) / scale,
    min = b.exact ? Math.max(0, l - 1 / scale) : l,
    max = h,
    point = Math.sqrt(Number(b.radicand[0]) / Number(b.radicand[1])),
    x = (v: number) => 70 + ((v - min) / (max - min)) * 450;
  return (
    <RadicalFrame
      mode={mode}
      caption={t(
        '放大的是数轴区间，不是把根式改成小数。实心点为显示近似；严格上下界及舍入由精确平方比较决定，不凭像素或先截断后舍入。',
        'This magnifies a real-line interval without replacing an exact root by a decimal. The dot is approximate; strict bounds and rounding use exact squared comparisons, not pixels or prior truncation.',
      )}
    >
      <svg
        viewBox="0 0 600 210"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Magnified root interval with labelled bounds'
            : '有端点标记的根式放大区间'
        }
      >
        <path d="M60 120H530" stroke="currentColor" />
        <path d={`M${x(l)} 112v16M${x(h)} 112v16`} stroke="currentColor" />
        <text x={x(l)} y="150" textAnchor="middle">
          {fixedDecimal(b.k, places)}
        </text>
        <text x={x(h)} y="150" textAnchor="middle">
          {fixedDecimal(b.k + 1n, places)}
        </text>
        {shown && (
          <>
            <circle
              data-root-location
              cx={x(point)}
              cy="120"
              r="5"
              fill="#5954a3"
            />
            <text x={x(point)} y="80" textAnchor="middle">
              √({textR(b.radicand)})
            </text>
            <path
              d={`M${x(l + 0.5 / scale)} 104v32`}
              stroke="#a14532"
              strokeDasharray="3 3"
            />
            <text x={x(l + 0.5 / scale)} y="185" textAnchor="middle">
              {mode === 'en' ? 'rounding midpoint' : '舍入中点'}:{' '}
              {textR(b.midpoint)}
            </text>
          </>
        )}
      </svg>
    </RadicalFrame>
  );
}
