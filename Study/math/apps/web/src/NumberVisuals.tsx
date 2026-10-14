import type { LanguageMode } from '@study/shared';
import { t, type NumberDiagram } from './model';
import { axisPosition, placeValues, type Blocks } from './numberModels';
import { DecimalPlaceChart } from './DecimalVisuals';
import { FractionDiagram } from './FractionVisuals';
import { ProductArea } from './CalculationVisuals';
import {
  PartCounters,
  GroupCounters,
  SharedCounters,
} from './OperationVisuals';
import { Text } from './ui';
export function PlaceChart({
  value,
  mode,
  places = 7,
  onDigit,
}: {
  value: number;
  mode: LanguageMode;
  places?: number;
  onDigit?: (unit: number, digit: number) => void;
}) {
  return (
    <div
      className="math-chart-scroll"
      tabIndex={0}
      aria-label={
        mode === 'en'
          ? 'Place-value chart; scroll to read all columns'
          : '位值表；可滚动查看各列'
      }
    >
      <table
        className="math-place-chart"
        style={{ minWidth: Math.max(220, places * 64) }}
      >
        <thead>
          <tr>
            {placeValues(value, places).map((p) => (
              <th key={p.unit} scope="col">
                <Text mode={mode} text={p.name} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {placeValues(value, places).map((p) => (
              <td key={p.unit}>
                {onDigit ? (
                  <select
                    aria-label={`${mode === 'en' ? p.name.en : p.name.zh} ${mode === 'en' ? 'digit' : '数字'}`}
                    value={p.digit}
                    onChange={(e) => onDigit(p.unit, Number(e.target.value))}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                ) : (
                  <strong>{p.digit}</strong>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export function NumberAxis({
  start,
  end,
  divisions,
  point,
  label,
  mode,
}: {
  start: number;
  end: number;
  divisions: number;
  point: number;
  label?: string;
  mode: LanguageMode;
}) {
  const position = axisPosition(point, start, end),
    step = (end - start) / divisions;
  return (
    <div className="math-number-axis">
      <svg
        viewBox="0 0 640 126"
        role="img"
        aria-label={
          mode === 'en'
            ? `Number line from ${start} to ${end}, ${divisions} equal intervals; point ${label ?? point} lies ${(point - start) / step} intervals after the start.`
            : `数轴从 ${start} 到 ${end}，分成 ${divisions} 个等长区间；点 ${label ?? point} 在起点之后 ${(point - start) / step} 个区间处。`
        }
      >
        <path d="M35 55H605" stroke="#b9b5cc" strokeWidth="3" />
        {Array.from({ length: divisions + 1 }, (_, i) => (
          <g key={i}>
            <path
              d={`M${35 + (i / divisions) * 570} 47v16`}
              stroke="#625b92"
              strokeWidth="2"
            />
            <text
              x={35 + (i / divisions) * 570}
              y="91"
              textAnchor="middle"
              fontSize="17"
              fill="#625b92"
            >
              {start + i * step}
            </text>
          </g>
        ))}
        <circle cx={35 + position * 570} cy="55" r="8" fill="#5954a3" />
        <text
          x={35 + position * 570}
          y="30"
          textAnchor="middle"
          fontSize="20"
          fontWeight="600"
          fill="#5954a3"
        >
          {label ?? point}
        </text>
      </svg>
      <div className="math-axis-scale">
        <span>{start.toLocaleString('en-NZ')}</span>
        <span>
          <Text mode={mode} text={t(`每格 ${step}`, `${step} per interval`)} />
        </span>
        <span>{end.toLocaleString('en-NZ')}</span>
      </div>
    </div>
  );
}
export function BaseTenBlocks({
  blocks,
  mode,
}: {
  blocks: Blocks;
  mode: LanguageMode;
}) {
  const rows = [
    {
      key: 'hundreds',
      label: t('百方格', 'Hundred squares'),
      size: 100,
      count: blocks.hundreds,
    },
    { key: 'tens', label: t('十条', 'Ten rods'), size: 10, count: blocks.tens },
    {
      key: 'ones',
      label: t('一小格', 'Single units'),
      size: 1,
      count: blocks.ones,
    },
  ];
  return (
    <div className="math-block-model">
      {rows.map((row) => (
        <section key={row.key}>
          <div className="math-row">
            <Text mode={mode} text={row.label} />
            <b>
              {row.count} × {row.size}
            </b>
          </div>
          <div
            className="math-block-pieces"
            role="img"
            aria-label={
              mode === 'en'
                ? `${row.count} blocks of ${row.size} units; ${row.count * row.size} units total`
                : `${row.count} 块，每块 ${row.size} 个单位，总计 ${row.count * row.size} 个单位`
            }
          >
            {Array.from({ length: row.count }, (_, i) => (
              <span
                className={`math-base-block ${row.key}`}
                key={i}
                aria-hidden="true"
              >
                {Array.from({ length: row.size }, (_, j) => (
                  <i key={j} />
                ))}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
export function NumberDiagramView({
  diagram,
  mode,
}: {
  diagram: NumberDiagram;
  mode: LanguageMode;
}) {
  if (diagram.kind === 'calculation-area')
    return <ProductArea a={diagram.a} b={diagram.b} mode={mode} />;
  if (diagram.kind === 'decimal-place')
    return <DecimalPlaceChart milli={diagram.milli} mode={mode} />;
  if (diagram.kind === 'fraction-bars')
    return <FractionDiagram values={diagram.values} mode={mode} />;
  if (diagram.kind === 'operation-counters')
    return (
      <PartCounters
        a={diagram.a}
        b={diagram.b}
        kind={diagram.mode}
        mode={mode}
        explain={false}
      />
    );
  if (diagram.kind === 'operation-array')
    return (
      <GroupCounters
        groups={diagram.groups}
        perGroup={diagram.perGroup}
        mode={mode}
        array
        explain={false}
      />
    );
  if (diagram.kind === 'operation-sharing')
    return (
      <SharedCounters
        total={diagram.total}
        divisor={diagram.divisor}
        kind={diagram.mode}
        mode={mode}
        explain={false}
      />
    );
  return diagram.kind === 'place' ? (
    <PlaceChart
      value={diagram.value}
      places={diagram.places ?? 7}
      mode={mode}
    />
  ) : (
    <NumberAxis
      start={diagram.start}
      end={diagram.end}
      divisions={diagram.divisions}
      point={diagram.point}
      label={diagram.label ?? 'P'}
      mode={mode}
    />
  );
}
