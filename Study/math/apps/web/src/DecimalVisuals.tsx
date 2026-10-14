import type { LanguageMode } from '@study/shared';
import { decimalDigits, formatMilli } from './decimalModels';
import { t } from './model';
import { Text } from './ui';

export function DecimalPlaceChart({
  milli,
  mode,
  onDigit,
  highlight = -1,
}: {
  milli: number;
  mode: LanguageMode;
  onDigit?: (unit: number, digit: number) => void;
  highlight?: number;
}) {
  const places = decimalDigits(milli);
  return (
    <div
      className="math-chart-scroll"
      tabIndex={0}
      aria-label={mode === 'en' ? 'Decimal place-value chart' : '小数位值表'}
    >
      <table className="math-place-chart math-decimal-chart">
        <thead>
          <tr>
            {places.map((place, i) => (
              <th
                key={place.unit}
                scope="col"
                className={i === highlight ? 'is-different' : undefined}
              >
                <Text mode={mode} text={place.name} />
                <small>{formatMilli(place.unit, true)}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {places.map((place, i) => (
              <td
                key={place.unit}
                className={i === highlight ? 'is-different' : undefined}
              >
                {onDigit ? (
                  <select
                    aria-label={`${mode === 'en' ? place.name.en : place.name.zh} ${mode === 'en' ? 'digit' : '数字'}`}
                    value={place.digit}
                    onChange={(e) =>
                      onDigit(place.unit, Number(e.target.value))
                    }
                  >
                    {Array.from({ length: 10 }, (_, digit) => (
                      <option key={digit} value={digit}>
                        {digit}
                      </option>
                    ))}
                  </select>
                ) : (
                  <strong>{place.digit}</strong>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function DecimalZoom({
  milli,
  mode,
}: {
  milli: number;
  mode: LanguageMode;
}) {
  const fractional = milli % 1000;
  const tenthsStart = Math.floor(fractional / 100) * 100;
  const hundredthsStart = Math.floor(fractional / 10) * 10;
  const rows = [
    {
      whole: 1000,
      unit: 100,
      start: 0,
      amount: fractional,
      label: t('整体 → 十分之一', 'Whole → tenths'),
    },
    {
      whole: 100,
      unit: 10,
      start: tenthsStart,
      amount: fractional % 100,
      label: t('放大一个十分之一 → 百分之一', 'Zoom one tenth → hundredths'),
    },
    {
      whole: 10,
      unit: 1,
      start: hundredthsStart,
      amount: fractional % 10,
      label: t(
        '放大一个百分之一 → 千分之一',
        'Zoom one hundredth → thousandths',
      ),
    },
  ];
  return (
    <div className="math-decimal-zoom">
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            `只观察小数部分 ${formatMilli(fractional)}。下面三条使用不同放大倍数，相同画宽不代表相同数量。`,
            `Observe only the fractional part ${formatMilli(fractional)}. These strips use different zoom levels: equal drawn widths do not mean equal amounts.`,
          )}
        />
      </p>
      {rows.map((row) => (
        <section key={row.unit}>
          <div className="math-row">
            <strong>
              <Text mode={mode} text={row.label} />
            </strong>
            <span>
              {formatMilli(row.start)} – {formatMilli(row.start + row.whole)}
            </span>
          </div>
          <div
            className="math-decimal-cells"
            role="img"
            aria-label={
              mode === 'en'
                ? `Window ${formatMilli(row.start)} to ${formatMilli(row.start + row.whole)}; each cell is ${formatMilli(row.unit)}; shaded amount ${formatMilli(row.amount)}`
                : `视窗 ${formatMilli(row.start)} 到 ${formatMilli(row.start + row.whole)}；每格 ${formatMilli(row.unit)}；涂色量 ${formatMilli(row.amount)}`
            }
          >
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} aria-hidden="true">
                <i
                  style={{
                    width: `${Math.min(1, Math.max(0, (row.amount - i * row.unit) / row.unit)) * 100}%`,
                  }}
                />
              </span>
            ))}
          </div>
          <p className="math-muted">
            <Text
              mode={mode}
              text={t(
                `这一整条表示 ${formatMilli(row.whole)}；每格表示 ${formatMilli(row.unit)}。`,
                `This entire strip represents ${formatMilli(row.whole)}; each cell represents ${formatMilli(row.unit)}.`,
              )}
            />
          </p>
        </section>
      ))}
    </div>
  );
}

export function DecimalAxis({
  a,
  b,
  mode,
}: {
  a: number;
  b: number;
  mode: LanguageMode;
}) {
  const x = (n: number) => 40 + (n / 3000) * 560;
  return (
    <div
      className="math-chart-scroll"
      tabIndex={0}
      aria-label={mode === 'en' ? 'Decimal number line' : '小数数轴'}
    >
      <svg
        className="math-decimal-axis"
        viewBox="0 0 640 160"
        role="img"
        aria-label={
          mode === 'en'
            ? `Number line from 0 to 3; A=${formatMilli(a)}, B=${formatMilli(b)}`
            : `数轴从 0 到 3；A=${formatMilli(a)}，B=${formatMilli(b)}`
        }
      >
        <line x1="40" x2="600" y1="80" y2="80" />
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i}>
            <line x1={x(i * 500)} x2={x(i * 500)} y1="74" y2="86" />
            <text x={x(i * 500)} y="148" textAnchor="middle">
              {formatMilli(i * 500, true)}
            </text>
          </g>
        ))}
        <g>
          <line x1={x(a)} x2={x(a)} y1="54" y2="80" />
          <circle cx={x(a)} cy="54" r="6" />
          <text
            x={Math.max(85, Math.min(555, x(a)))}
            y="30"
            textAnchor="middle"
          >
            A = {formatMilli(a)}
          </text>
        </g>
        <g>
          <line x1={x(b)} x2={x(b)} y1="80" y2="100" />
          <circle cx={x(b)} cy="100" r="6" />
          <text
            x={Math.max(85, Math.min(555, x(b)))}
            y="124"
            textAnchor="middle"
          >
            B = {formatMilli(b)}
          </text>
        </g>
      </svg>
    </div>
  );
}
