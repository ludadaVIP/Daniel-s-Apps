import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { percentCells, type Ratio } from './percentModels';

export function PercentGrid({
  value,
  mode,
}: {
  value: Ratio;
  mode: LanguageMode;
}) {
  const model = percentCells(value);
  return (
    <figure className="math-percent-figure">
      <div
        className="math-percent-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Hundred grids; each thick frame is the same whole'
            : '百格图；每个粗框都是同样的整体'
        }
      >
        <svg
          className="math-percent-grid"
          viewBox={`0 0 ${model.frames * 230 + 20} 245`}
          style={{ minWidth: model.frames * 230 + 20, height: 245 }}
          role="img"
          aria-label={
            mode === 'en'
              ? 'Equal hundredths with partial cells preserved; each complete frame is one reference whole'
              : '相等的百分之一，保留不足一格的面积；每个完整框代表一个参考整体'
          }
        >
          {model.cells.map((c) => (
            <g key={c.index} data-percent-cell={c.index}>
              <rect
                x={12 + c.frame * 230 + c.x * 20}
                y={12 + c.y * 20}
                width="20"
                height="20"
                className="percent-empty"
              />
              {c.filled > 0 && (
                <rect
                  data-fill={c.filled}
                  x={12 + c.frame * 230 + c.x * 20}
                  y={12 + c.y * 20}
                  width={20 * c.filled}
                  height="20"
                  className="percent-filled"
                />
              )}
            </g>
          ))}
          {Array.from({ length: model.frames }, (_, i) => (
            <g key={i}>
              <rect
                x={12 + i * 230}
                y="12"
                width="200"
                height="200"
                className="percent-whole"
              />
              <text x={12 + i * 230} y="235">
                {mode === 'en' ? 'One whole = 100%' : '一个整体 = 100%'}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '每个原整体分一百个相等面积格，一格代表 1%。不足一格只涂相应面积；超过 100% 时沿用原整体增加同样的框。',
            'Each original whole has one hundred equal-area cells: one cell represents 1%. A partial cell keeps its proportional area. Beyond 100%, add an identical frame without redefining the whole.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function PercentSource({
  selected,
  total,
  mode,
}: {
  selected: number;
  total: number;
  mode: LanguageMode;
}) {
  if (
    !Number.isInteger(total) ||
    total < 1 ||
    total > 100 ||
    !Number.isInteger(selected) ||
    selected < 0 ||
    selected > total
  )
    throw new RangeError('Use valid card counts');
  return (
    <figure className="math-percent-figure">
      <div
        className="math-percent-source"
        role="img"
        aria-label={
          mode === 'en'
            ? `${selected} marked cards out of ${total} equal cards`
            : `${total} 张同样卡片，其中标记 ${selected} 张`
        }
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            data-source-card={i}
            className={i < selected ? 'marked' : ''}
          >
            {i < selected ? '●' : '○'}
          </span>
        ))}
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            `实际有 ${total} 张卡，其中 ${selected} 张有标记；这里一张卡不一定代表 1%。`,
            `There are actually ${total} cards, with ${selected} marked. One source card need not represent 1%.`,
          )}
        />
      </figcaption>
    </figure>
  );
}
export function PercentAxis({
  rate,
  wholeLabel,
  partLabel,
  mode,
}: {
  rate: number;
  wholeLabel: string;
  partLabel: string;
  mode: LanguageMode;
}) {
  if (!Number.isFinite(rate) || rate < 0 || rate > 200)
    throw new RangeError('Use an axis rate from zero to two hundred');
  const max = rate > 150 ? 200 : rate > 100 ? 150 : 100;
  const span = 420,
    x = (p: number) => 40 + (span * p) / max;
  return (
    <figure className="math-percent-figure">
      <div
        className="math-percent-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Aligned percentage and quantity scales'
            : '百分数与实际量的对齐标尺'
        }
      >
        <svg
          viewBox="0 0 530 220"
          style={{ minWidth: 530, height: 220 }}
          role="img"
          aria-label={
            mode === 'en'
              ? `100% corresponds to ${wholeLabel}; ${rate}% corresponds to ${partLabel}`
              : `100% 对应 ${wholeLabel}；${rate}% 对应 ${partLabel}`
          }
        >
          <line x1="40" y1="55" x2="460" y2="55" className="percent-axis" />
          <line x1="40" y1="145" x2="460" y2="145" className="percent-axis" />
          {[0, 100, ...(max > 100 ? [max] : [])].map((p) => (
            <g key={p}>
              <line
                x1={x(p)}
                y1="49"
                x2={x(p)}
                y2="151"
                className="percent-guide"
              />
              <text x={x(p)} y="30" textAnchor="middle">
                {p}%
              </text>
            </g>
          ))}
          <line
            x1={x(rate)}
            y1="55"
            x2={x(rate)}
            y2="145"
            className="percent-match"
          />
          <circle cx={x(rate)} cy="55" r="5" className="percent-filled" />
          <circle cx={x(rate)} cy="145" r="5" className="percent-filled" />
          <text
            x={Math.max(50, x(rate))}
            y="87"
            textAnchor="middle"
            data-rate-label
          >
            {rate}%
          </text>
          <text x="40" y="174">
            0
          </text>
          <text x={x(100)} y="174" textAnchor="middle">
            {wholeLabel}
          </text>
          <text x="40" y="207" data-part-label>
            {rate}% ↔ {partLabel}
          </text>
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '上下两条标尺的同一位置代表同一关系。先指认 100% 的实际量；问号由你计算，图不会先给出答案。',
            'Matching positions on the two scales express the same relationship. Identify the quantity at 100% first. Work out the question mark yourself before checking.',
          )}
        />
      </figcaption>
    </figure>
  );
}
