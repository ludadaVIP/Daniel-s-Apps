import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import {
  VectorPlot,
  type VectorArrow,
  type VectorPoint,
} from './VectorVisuals';
import { DataFigure, DataTable } from './DataModellingVisuals';
import {
  complexText,
  complexNumber,
  powerI,
  type Complex,
} from './complexModels';
import { textR } from './algebraModels';
export function ComplexPlot({
  mode,
  points,
  arrows = [],
  segments = [],
  triangle,
  wide = false,
  reveal = false,
  caption,
}: {
  mode: LanguageMode;
  points: VectorPoint[];
  arrows?: VectorArrow[];
  segments?: { a: Complex; b: Complex }[];
  triangle?: Complex[];
  wide?: boolean;
  reveal?: boolean;
  caption: LocalizedText;
}) {
  return (
    <>
      <VectorPlot
        mode={mode}
        points={points}
        arrows={arrows}
        segments={segments}
        polygon={triangle}
        wide={wide}
        complexPlane
        caption={caption}
      />
      {reveal && (
        <DataTable
          mode={mode}
          name={t('复数与坐标核验', 'Complex numbers and coordinates audit')}
          headers={[
            t('名称', 'Name'),
            t('复数', 'Complex number'),
            t('实部', 'Real part'),
            t('虚部（实系数）', 'Imaginary part (real coefficient)'),
            t('坐标', 'Coordinates'),
          ]}
          rows={points.map((p) => [
            p.name,
            complexText(p.position),
            textR(p.position[0]),
            textR(p.position[1]),
            `(${textR(p.position[0])},${textR(p.position[1])})`,
          ])}
        />
      )}
    </>
  );
}
export function PowersOfIFigure({
  mode,
  exponent,
}: {
  mode: LanguageMode;
  exponent?: number;
}) {
  const id = useId().replace(/:/g, ''),
    where = (n: number) => {
      const z = powerI(n);
      return [320 + 90 * complexNumber(z[0]), 150 - 90 * complexNumber(z[1])];
    };
  return (
    <DataFigure
      mode={mode}
      name={t('乘i的四步循环', 'The four-step multiplication-by-i cycle')}
      caption={t(
        '从1出发，每乘一次i绕原点逆时针转90°；四步回到1。这个循环解释整数幂，不把方程的两个根合并成一个根。',
        'Starting at one, each multiplication by i turns 90° anticlockwise about the origin. Four steps return to one. The cycle explains integer powers; it does not merge two equation roots into one.',
      )}
    >
      <svg
        viewBox="0 0 640 300"
        role="img"
        aria-label={
          mode === 'en'
            ? 'One, i, minus one and minus i in a counterclockwise cycle'
            : '1、i、负1、负i的逆时针循环'
        }
      >
        <defs>
          <marker
            id={`cycle-${id}`}
            markerWidth="5"
            markerHeight="5"
            refX="9"
            refY="5"
            orient="auto"
            viewBox="0 0 10 10"
          >
            <path d="M0 0L10 5L0 10Z" fill="#6652a1" />
          </marker>
        </defs>
        <line x1="180" x2="460" y1="150" y2="150" stroke="#bdb6cb" />
        <line x1="320" x2="320" y1="20" y2="275" stroke="#bdb6cb" />
        {[0, 1, 2, 3].map((n) => {
          const a = where(n),
            b = where(n + 1);
          return (
            <g key={n}>
              <path
                d={`M${a[0]} ${a[1]}A90 90 0 0 0 ${b[0]} ${b[1]}`}
                fill="none"
                stroke="#6652a1"
                strokeWidth="2"
                markerEnd={`url(#cycle-${id})`}
              />
              <circle
                data-i-power={n}
                data-i-value={complexText(powerI(n))}
                cx={a[0]}
                cy={a[1]}
                r="5"
                fill="#6652a1"
              />
            </g>
          );
        })}
        <text x="430" y="155">
          1
        </text>
        <text x="320" y="40" textAnchor="middle">
          i
        </text>
        <text x="210" y="155" textAnchor="end">
          −1
        </text>
        <text x="320" y="266" textAnchor="middle">
          −i
        </text>
        <text x="478" y="155">
          Re
        </text>
        <text x="335" y="25">
          Im
        </text>
        {exponent !== undefined && (
          <>
            <circle
              cx={where(exponent)[0]}
              cy={where(exponent)[1]}
              r="13"
              fill="none"
              stroke="#248577"
              strokeWidth="3"
            />
            <text x="30" y="285">
              i^{exponent} = {complexText(powerI(exponent))}
            </text>
          </>
        )}
      </svg>
    </DataFigure>
  );
}
