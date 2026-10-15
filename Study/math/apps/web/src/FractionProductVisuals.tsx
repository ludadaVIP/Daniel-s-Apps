import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import {
  areaProduct,
  fractionQuotient,
  repeatFraction,
  shareFraction,
} from './fractionProductModels';
import type { FractionValue as F } from './fractionModels';

export function ProductFrame({
  children,
  mode,
  caption,
}: {
  children: React.ReactNode;
  mode: LanguageMode;
  caption: ReturnType<typeof t>;
}) {
  return (
    <figure className="math-product-figure">
      <div
        className="math-product-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Fraction model; scroll to compare equal reference units'
            : '分数模型；可滚动比较同样的参考单位'
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
export function RepeatedFraction({
  count,
  part,
  mode,
}: {
  count: number;
  part: F;
  mode: LanguageMode;
}) {
  repeatFraction(count, part);
  const wholes = Math.max(1, Math.ceil(part.n / part.d)),
    step = 240 / part.d,
    width = wholes * 240 + 100,
    height = Math.max(1, count) * 55 + 65;
  return (
    <ProductFrame
      mode={mode}
      caption={t(
        '每条完整框都是 1 L；每组取同样的分数升，跨组相加时这个标尺不变。零组表示没有加入任何量。',
        'Each complete frame is 1 L. Each group contributes the same fractional litres; the reference unit stays fixed when groups are combined. Zero groups contribute no quantity.',
      )}
    >
      <svg
        className="math-product-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width, height }}
        role="img"
        aria-label={
          mode === 'en'
            ? `${count} groups, each ${part.n}/${part.d} L. Each full frame is one litre.`
            : `${count} 组，每组 ${part.n}/${part.d} L；每个完整框为一升。`
        }
      >
        {Array.from({ length: count }, (_, row) => (
          <g key={row}>
            <text x="12" y={35 + row * 55}>
              {row + 1}
            </text>
            {Array.from({ length: wholes * part.d }, (_, i) => (
              <rect
                key={i}
                data-repeat-cell={`${row}-${i}`}
                className={i < part.n ? 'product-selected' : 'product-empty'}
                x={50 + i * step}
                y={15 + row * 55}
                width={step}
                height="30"
              />
            ))}
            {Array.from({ length: wholes }, (_, i) => (
              <rect
                key={i}
                x={50 + i * 240}
                y={15 + row * 55}
                width="240"
                height="30"
                className="product-whole-border"
              />
            ))}
          </g>
        ))}
        <text x="50" y={height - 12}>
          {mode === 'en' ? 'One complete frame = 1 L' : '一个完整框 = 1 L'}
        </text>
      </svg>
    </ProductFrame>
  );
}
export function ProductArea({
  left,
  right,
  mode,
}: {
  left: F;
  right: F;
  mode: LanguageMode;
}) {
  const m = areaProduct(left, right),
    sx = 240 / left.d,
    sy = 240 / right.d,
    width = m.across * 240 + 100,
    height = m.down * 240 + 100;
  return (
    <ProductFrame
      mode={mode}
      caption={t(
        '每个粗框才是一个参考整体。竖向与横向选取的交叠表示乘积；每小格面积为原整体的 1/(两分母相乘)，超过一时扩展原标尺，不把大画框重新当作一。',
        'Each thick frame is one reference whole. The overlap of vertical and horizontal selections represents the product. A small cell is 1/(product of denominators) of the original whole. Extend the reference when exceeding one; do not redefine the larger drawing as one.',
      )}
    >
      <svg
        className="math-product-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width, height }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Area model: horizontal factor ${left.n}/${left.d}, vertical factor ${right.n}/${right.d}; each thick square is one whole.`
            : `面积模型：横向因数 ${left.n}/${left.d}、纵向因数 ${right.n}/${right.d}；每个粗方框是一个整体。`
        }
      >
        {m.cells.map((c, i) => (
          <rect
            key={i}
            data-product-cell={i}
            data-overlap={c.overlap ? 'true' : 'false'}
            className={
              c.overlap
                ? 'product-overlap'
                : c.vertical
                  ? 'product-vertical'
                  : c.horizontal
                    ? 'product-horizontal'
                    : 'product-empty'
            }
            x={50 + c.x * sx}
            y={35 + c.y * sy}
            width={sx}
            height={sy}
          />
        ))}
        {Array.from({ length: m.across * m.down }, (_, i) => (
          <rect
            key={i}
            className="product-whole-border"
            x={50 + (i % m.across) * 240}
            y={35 + Math.floor(i / m.across) * 240}
            width="240"
            height="240"
          />
        ))}
        <text x="50" y={height - 20}>
          {left.n}/{left.d} × {right.n}/{right.d}
        </text>
      </svg>
    </ProductFrame>
  );
}
export function SharedFraction({
  amount,
  people,
  stage = 0,
  mode,
}: {
  amount: F;
  people: number;
  stage?: number;
  mode: LanguageMode;
}) {
  const m = shareFraction(amount, people),
    d = stage > 0 ? m.denominator : amount.d,
    n = stage > 0 ? m.selected : amount.n,
    wholes = Math.max(1, Math.ceil(amount.n / amount.d)),
    step = Math.max(12, 300 / d),
    width = wholes * d * step + 90;
  return (
    <ProductFrame
      mode={mode}
      caption={t(
        '每个完整粗框是 1 L。先把每个原小份细分成相同人数份，再轮流分颜色；每种颜色的量相同，总涂色量仍是原来的水。',
        'Each complete thick frame is 1 L. Subdivide every original part for the people, then allocate colours cyclically. Colours receive equal amounts while the total coloured water stays unchanged.',
      )}
    >
      <svg
        className="math-product-svg"
        viewBox={`0 0 ${width} 135`}
        style={{ minWidth: width, height: 135 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Share ${amount.n}/${amount.d} L among ${people} people. ${stage > 0 ? 'Refined divisions' : 'Original divisions'}; original whole remains one litre.`
            : `${amount.n}/${amount.d} L 平均分给 ${people} 人；${stage > 0 ? '已细分' : '原等份'}，整体仍是一升。`
        }
      >
        {Array.from({ length: wholes * d }, (_, i) => (
          <rect
            key={i}
            data-share-cell={i}
            data-owner={i < n && stage >= 2 ? i % people : undefined}
            className={
              i < n
                ? stage >= 2
                  ? `product-owner owner-${i % people}`
                  : 'product-selected'
                : 'product-empty'
            }
            x={40 + i * step}
            y="25"
            width={step}
            height="42"
          />
        ))}
        {Array.from({ length: wholes }, (_, i) => (
          <rect
            key={i}
            className="product-whole-border"
            x={40 + i * d * step}
            y="25"
            width={d * step}
            height="42"
          />
        ))}
        <text x="40" y="112">
          {mode === 'en'
            ? 'Each thick frame = 1 L; colour identifies a person'
            : '每个粗框 = 1 L；颜色区分接收者'}
        </text>
      </svg>
    </ProductFrame>
  );
}
export function GroupedMeasure({
  amount,
  group,
  mode,
}: {
  amount: F;
  group: F;
  mode: LanguageMode;
}) {
  const m = fractionQuotient(amount, group),
    end = Math.max(
      m.denominator,
      Math.max(1, Math.ceil(m.total / m.perGroup)) * m.perGroup,
    ),
    step = Math.max(10, 240 / m.denominator),
    width = end * step + 105;
  return (
    <ProductFrame
      mode={mode}
      caption={t(
        '横轴始终用升。每个括框代表一份除数的量；最后不足一份的空白用虚框保留。剩余升数与“占一份的几分之几”用不同参照，不可混写。',
        'The horizontal axis stays in litres. Each bracket spans one divisor-sized group. The last incomplete group retains its unfilled guide. Remaining litres and the fraction of one group use different references.',
      )}
    >
      <svg
        className="math-product-svg"
        viewBox={`0 0 ${width} 185`}
        style={{ minWidth: width, height: 185 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Measure ${amount.n}/${amount.d} L in groups of ${group.n}/${group.d} L. Axis uses litres; count complete and partial groups.`
            : `用每份 ${group.n}/${group.d} L 量 ${amount.n}/${amount.d} L；横轴单位升，比较完整与不足的份。`
        }
      >
        {Array.from(
          { length: Math.max(1, Math.ceil(m.total / m.perGroup)) },
          (_, g) => (
            <g key={g}>
              <rect
                className="product-group-guide"
                data-group-guide={g}
                x={45 + g * m.perGroup * step}
                y="18"
                width={m.perGroup * step}
                height="58"
              />
              <text
                x={45 + (g + 0.5) * m.perGroup * step}
                y="15"
                textAnchor="middle"
              >
                {g + 1}
              </text>
            </g>
          ),
        )}
        {Array.from({ length: end }, (_, i) => (
          <rect
            key={i}
            data-measure-cell={i}
            data-filled={i < m.total ? 'true' : 'false'}
            className={
              i < m.total
                ? `product-owner owner-${Math.floor(i / m.perGroup) % 6}`
                : 'product-empty'
            }
            x={45 + i * step}
            y="30"
            width={step}
            height="30"
          />
        ))}
        <line
          x1="45"
          x2={45 + end * step}
          y1="105"
          y2="105"
          className="product-axis"
        />
        {Array.from({ length: Math.floor(end / m.denominator) + 1 }, (_, i) => (
          <g key={i}>
            <line
              x1={45 + i * m.denominator * step}
              x2={45 + i * m.denominator * step}
              y1="100"
              y2="112"
              className="product-axis"
            />
            <text x={45 + i * m.denominator * step} y="133" textAnchor="middle">
              {i} L
            </text>
          </g>
        ))}
        <text x="45" y="169">
          {mode === 'en'
            ? `Each bracket: ${group.n}/${group.d} L`
            : `每个括框：${group.n}/${group.d} L`}
        </text>
      </svg>
    </ProductFrame>
  );
}
