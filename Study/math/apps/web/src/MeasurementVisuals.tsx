import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import {
  rulerLength,
  rectangleBoundary,
  tileCoverage,
  fullTiles,
  angleGeometry,
  barGeometry,
  boundedWhole,
} from './measurementModels';
export function Ruler({
  startMm,
  endMm,
  unit,
  mode,
  reveal = false,
}: {
  startMm: number;
  endMm: number;
  unit: 'cm' | 'mm';
  mode: LanguageMode;
  reveal?: boolean;
}) {
  const m = rulerLength(startMm, endMm),
    factor = unit === 'cm' ? 10 : 1,
    x = (mm: number) => 50 + (mm / 300) * 500;
  return (
    <div className="math-measure-ruler">
      <svg
        viewBox="0 0 600 165"
        role="img"
        aria-label={
          mode === 'en'
            ? `Ruler from 0 to ${300 / factor} ${unit}; endpoints ${startMm / factor} and ${endMm / factor} ${unit}. Each small interval is ${10 / factor} ${unit}.`
            : `刻度尺从 0 到 ${300 / factor} ${unit}，两端刻度 ${startMm / factor} 与 ${endMm / factor} ${unit}，每个小间隔 ${10 / factor} ${unit}。`
        }
      >
        <rect
          className="measurement-object"
          x={x(startMm)}
          y="30"
          width={((endMm - startMm) / 300) * 500}
          height="18"
          rx="3"
          fill="#9b8cb9"
        />
        {[startMm, endMm].map((mm, i) => (
          <g key={i}>
            <path
              d={`M${x(mm)} 22v68`}
              stroke="#a68a35"
              strokeDasharray="3 3"
            />
            <text
              x={x(mm)}
              y={i === 0 ? 24 : 70}
              textAnchor="middle"
              fill="#5954a3"
              fontSize="17"
            >
              {mm / factor}
            </text>
          </g>
        ))}
        <path d="M50 90H550" stroke="#7a7297" />
        {Array.from({ length: 31 }, (_, i) => (
          <g key={i}>
            <path d={`M${x(i * 10)} 90v${i % 5 ? 8 : 15}`} stroke="#7a7297" />
            {i % 5 === 0 && (
              <text
                x={x(i * 10)}
                y="132"
                textAnchor="middle"
                fontSize="17"
                fill="#5954a3"
              >
                {(i * 10) / factor}
              </text>
            )}
          </g>
        ))}
      </svg>
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            `刻度单位 ${unit}；每个小间隔 ${10 / factor} ${unit}。`,
            `Scale unit ${unit}; each small interval is ${10 / factor} ${unit}.`,
          )}
        />
      </p>
      {reveal && (
        <div className="math-measure-readout">
          {endMm / factor} − {startMm / factor} = {m.mm / factor} {unit}
          <p className="math-measure-caption">
            <Text
              mode={mode}
              text={t(
                `${m.mm} mm = ${m.cm} cm = ${m.metres} m；两端相减，不把起点前的长度计入。`,
                `${m.mm} mm = ${m.cm} cm = ${m.metres} m; subtract endpoints rather than include length before the start.`,
              )}
            />
          </p>
        </div>
      )}
    </div>
  );
}
export function Boundary({
  width,
  height,
  walked,
  mode,
}: {
  width: number;
  height: number;
  walked: number;
  mode: LanguageMode;
}) {
  const m = rectangleBoundary(width, height),
    u = 20,
    x = (400 - width * u) / 2,
    y = 40,
    last = walked ? m.segments[walked - 1]! : { x2: 0, y2: 0 };
  boundedWhole(walked, m.perimeter);
  return (
    <svg
      className="math-measure-boundary"
      viewBox={`0 0 400 ${90 + height * u}`}
      role="img"
      aria-label={
        mode === 'en'
          ? `Rectangle ${width} cm by ${height} cm; each edge segment is 1 cm. ${walked} cm walked${walked === m.perimeter ? ', back at the start' : ''}.`
          : `长方形 ${width} cm 与 ${height} cm，每段边长 1 cm；已走 ${walked} cm${walked === m.perimeter ? '，回到起点' : ''}。`
      }
    >
      <rect
        x={x}
        y={y}
        width={width * u}
        height={height * u}
        fill="#f3eff8"
        stroke="#c1b8d3"
      />
      {m.segments.map((s, i) => (
        <line
          key={i}
          className={`measurement-edge ${i < walked ? 'is-walked' : ''}`}
          x1={x + s.x1 * u}
          y1={y + s.y1 * u}
          x2={x + s.x2 * u}
          y2={y + s.y2 * u}
          stroke={i < walked ? '#aa8b32' : '#8b7aaa'}
          strokeWidth="3"
        />
      ))}
      {m.segments.map((s, i) => (
        <circle
          key={i}
          cx={x + s.x1 * u}
          cy={y + s.y1 * u}
          r="2.5"
          fill="#fff"
          stroke="#73608f"
        />
      ))}
      <circle
        className="measurement-walker"
        cx={x + last.x2 * u}
        cy={y + last.y2 * u}
        r="5"
        fill="#5954a3"
      />
      <text
        x={x + (width * u) / 2}
        y="23"
        textAnchor="middle"
        fontSize="17"
        fill="#5954a3"
      >
        {width} cm
      </text>
      <text
        x={x + (width * u) / 2}
        y={y + height * u + 28}
        textAnchor="middle"
        fontSize="17"
        fill="#5954a3"
      >
        {width} cm
      </text>
      <text
        x={x - 25}
        y={y + (height * u) / 2}
        textAnchor="middle"
        fontSize="17"
        fill="#5954a3"
      >
        {height}
      </text>
      <text
        x={x + width * u + 25}
        y={y + (height * u) / 2}
        textAnchor="middle"
        fontSize="17"
        fill="#5954a3"
      >
        {height}
      </text>
    </svg>
  );
}
export function TileGrid({
  width,
  height,
  selected,
  mode,
  onToggle,
}: {
  width: number;
  height: number;
  selected: number[];
  mode: LanguageMode;
  onToggle?: (i: number) => void;
}) {
  const m = tileCoverage(width, height, selected);
  return (
    <div className="math-measure-cover">
      <div
        className="math-measure-tiles"
        style={{ gridTemplateColumns: `repeat(${width},24px)` }}
        role={onToggle ? 'group' : 'img'}
        aria-label={
          mode === 'en'
            ? `${height} rows, ${width} columns; each cell is 1 cm by 1 cm. ${onToggle ? 'Toggle coverage with each button.' : `Covered cell counts by row: ${m.rows.join(', ')}.`}`
            : `${height} 行、${width} 列，每格 1 cm×1 cm。${onToggle ? '可用按钮切换覆盖。' : `各行覆盖格数依次为 ${m.rows.join('、')}。`}`
        }
      >
        {fullTiles(width, height).map((i) =>
          onToggle ? (
            <button
              type="button"
              key={i}
              aria-label={
                mode === 'en'
                  ? `Row ${Math.floor(i / width) + 1}, column ${(i % width) + 1}`
                  : `第 ${Math.floor(i / width) + 1} 行，第 ${(i % width) + 1} 列`
              }
              aria-pressed={selected.includes(i)}
              className={selected.includes(i) ? 'is-covered' : ''}
              onClick={() => onToggle(i)}
            >
              <span aria-hidden="true">{selected.includes(i) ? '·' : ''}</span>
            </button>
          ) : (
            <span
              key={i}
              aria-hidden="true"
              className={selected.includes(i) ? 'is-covered' : ''}
            />
          ),
        )}
      </div>
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            '每个小方格为 1 cm×1 cm；计覆盖格数，空格不计入。',
            'Each cell is 1 cm by 1 cm. Count covered cells, excluding gaps.',
          )}
        />
      </p>
    </div>
  );
}
export function AnglePicture({
  angle,
  length,
  rotation,
  mode,
}: {
  angle: number;
  length: number;
  rotation: number;
  mode: LanguageMode;
}) {
  const m = angleGeometry(angle, length, rotation);
  const u = { x: (m.first.x - 200) / length, y: (m.first.y - 170) / length },
    v = { x: (m.second.x - 200) / length, y: (m.second.y - 170) / length };
  return (
    <svg
      className="math-measure-angle"
      viewBox="0 0 400 340"
      role="img"
      aria-label={
        mode === 'en'
          ? `Opening ${angle} degrees; arm length ${length} drawing units, rotation ${rotation} degrees. Arm lengths and rotation do not change the opening.`
          : `开口 ${angle} 度，线臂图示长度 ${length}，图旋转 ${rotation} 度；线臂长短与方向不改变开口。`
      }
    >
      <line
        x1="200"
        y1="170"
        x2={m.first.x}
        y2={m.first.y}
        stroke="#8d78ac"
        strokeWidth="5"
      />
      <line
        x1="200"
        y1="170"
        x2={m.second.x}
        y2={m.second.y}
        stroke="#b99d4b"
        strokeWidth="5"
      />
      {angle > 0 && (
        <path
          d={`M${m.arcStart.x} ${m.arcStart.y}A44 44 0 0 0 ${m.arcEnd.x} ${m.arcEnd.y}`}
          fill="none"
          stroke="#5954a3"
          strokeWidth="2"
        />
      )}
      {angle === 90 && (
        <path
          className="measurement-right-mark"
          d={`M${200 + u.x * 18} ${170 + u.y * 18}L${200 + (u.x + v.x) * 18} ${170 + (u.y + v.y) * 18}L${200 + v.x * 18} ${170 + v.y * 18}`}
          fill="none"
          stroke="#5954a3"
          strokeWidth="2"
        />
      )}
      <circle cx="200" cy="170" r="4" fill="#5954a3" />
      <text x="200" y="326" textAnchor="middle" fontSize="24" fill="#5954a3">
        {angle}°
      </text>
    </svg>
  );
}
export function BarChart({
  values,
  max,
  step,
  mode,
}: {
  values: { label: LocalizedText; count: number }[];
  max: number;
  step: number;
  mode: LanguageMode;
}) {
  const m = barGeometry(
      values.map((v) => v.count),
      max,
      step,
    ),
    slot = 450 / values.length;
  return (
    <div className="math-measure-chart">
      <svg
        viewBox="0 0 560 365"
        role="img"
        aria-label={
          mode === 'en'
            ? `Illustrative bar chart of people; zero baseline, maximum ${max}, tick interval ${step}. ${values.map((v) => `${v.label.en}: ${v.count}`).join('; ')}.`
            : `假想人数条形图，纵轴从零开始，上限 ${max}，刻度间隔 ${step}。${values.map((v) => `${v.label.zh} ${v.count} 人`).join('；')}。`
        }
      >
        {m.ticks.map((tick) => (
          <g key={tick}>
            <path d={`M60 ${280 - (tick / max) * 250}H510`} stroke="#e0dbe9" />
            <text
              x="47"
              y={286 - (tick / max) * 250}
              textAnchor="end"
              fontSize="17"
              fill="#726787"
            >
              {tick}
            </text>
          </g>
        ))}
        <path d="M60 30V280H510" fill="none" stroke="#837694" strokeWidth="2" />
        {values.map((v, i) => (
          <g key={i}>
            <rect
              className="measurement-bar"
              data-count={v.count}
              x={60 + slot * i + slot / 4}
              y={280 - m.heights[i]!}
              width={slot / 2}
              height={m.heights[i]}
              fill={['#9b8ab9', '#c8b46c', '#b8a6ce', '#8e86b0'][i % 4]}
            />
            <text
              x={60 + slot * (i + 0.5)}
              y="314"
              textAnchor="middle"
              fontSize="18"
              fill="#5954a3"
            >
              {mode === 'en' ? v.label.en : v.label.zh}
            </text>
            {mode === 'bilingual' && (
              <text
                x={60 + slot * (i + 0.5)}
                y="340"
                textAnchor="middle"
                fontSize="15"
                fill="#726787"
              >
                {v.label.en}
              </text>
            )}
          </g>
        ))}
      </svg>
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            `纵轴单位：人。相邻刻度差 ${step} 人，不是每个间隔都算一人。`,
            `Vertical unit: people. Adjacent ticks differ by ${step}, rather than always by one.`,
          )}
        />
      </p>
    </div>
  );
}
