import type { LanguageMode } from '@study/shared';
import { areaProduct, splitProduct } from './calculationModels';
import { t } from './model';
import { Text } from './ui';
export function SplitArray({
  groups,
  size,
  cut,
  mode,
}: {
  groups: number;
  size: number;
  cut: number;
  mode: LanguageMode;
}) {
  const m = splitProduct(groups, size, cut);
  return (
    <div className="math-calc-picture">
      <svg
        viewBox="0 0 400 330"
        role="img"
        aria-label={
          mode === 'en'
            ? `${groups} rows of ${size}; split each row into ${cut} and ${m.rest}. Each dot is one object.`
            : `${groups} 行，每行 ${size} 个；每行拆成 ${cut} 与 ${m.rest} 个。每个圆点代表一个物体。`
        }
      >
        {Array.from({ length: groups }, (_, row) =>
          Array.from({ length: size }, (_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={35 + col * 28}
              cy={24 + row * 25}
              r="8"
              fill={col < cut ? '#a99042' : '#8674ae'}
            />
          )),
        )}
        {groups > 0 && cut > 0 && cut < size && (
          <path
            d={`M${21 + cut * 28} 10v${groups * 25}`}
            stroke="#514774"
            strokeDasharray="5 4"
          />
        )}
      </svg>
      {!m.total && (
        <p>
          <Text
            mode={mode}
            text={t('没有物体，总量为零。', 'No objects: the total is zero.')}
          />
        </p>
      )}
    </div>
  );
}
export function ProductArea({
  a,
  b,
  mode,
  showProducts = false,
}: {
  a: number;
  b: number;
  mode: LanguageMode;
  showProducts?: boolean;
}) {
  const m = areaProduct(a, b),
    scale = Math.min(500 / Math.max(1, a), 280 / Math.max(1, b));
  return (
    <div className="math-calc-area">
      <svg
        viewBox="0 0 600 355"
        role="img"
        aria-label={
          mode === 'en'
            ? `Rectangle ${a} units by ${b} units, with a common unit scale on both axes. Width splits into ${m.aTens} and ${m.aOnes}; height into ${m.bTens} and ${m.bOnes}.`
            : `长方形两边为 ${a} 与 ${b} 个长度单位，两轴使用同一单位标尺。宽拆为 ${m.aTens} 与 ${m.aOnes}，高拆为 ${m.bTens} 与 ${m.bOnes}。`
        }
      >
        <text x="300" y="30" textAnchor="middle" fill="#5954a3" fontSize="17">
          {m.aTens} + {m.aOnes} = {a}
        </text>
        <text
          x="30"
          y="185"
          textAnchor="middle"
          transform="rotate(-90 30 185)"
          fill="#5954a3"
          fontSize="17"
        >
          {m.bTens} + {m.bOnes} = {b}
        </text>
        {m.parts
          .filter((p) => p.area)
          .map((p, i) => (
            <rect
              key={`${p.x}-${p.y}`}
              data-unit-width={p.width}
              data-unit-height={p.height}
              x={55 + p.x * scale}
              y={48 + p.y * scale}
              width={p.width * scale}
              height={p.height * scale}
              fill={['#a496c3', '#d1c5e3', '#c5b16c', '#eadca6'][i]}
              stroke="#726487"
            />
          ))}
      </svg>
      {!m.total && (
        <p>
          <Text
            mode={mode}
            text={t('一边为零，面积为零。', 'A zero side gives zero area.')}
          />
        </p>
      )}
      {showProducts && (
        <div className="math-calc-partials">
          {m.parts.map((p, i) => (
            <div key={i}>
              <strong>
                {p.width} × {p.height} = {p.area}
              </strong>
              <Text mode={mode} text={t('面积单位', 'square units')} />
            </div>
          ))}
        </div>
      )}
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            '每块面积用两边长度相乘。图按同一单位比例绘制；零宽或零高的部分没有面积。',
            'Multiply each region’s side lengths. Both axes use the same unit scale; zero-width or zero-height regions have zero area.',
          )}
        />
      </p>
    </div>
  );
}
