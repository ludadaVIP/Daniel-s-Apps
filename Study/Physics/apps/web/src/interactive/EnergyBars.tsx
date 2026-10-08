import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
type Label = [string, string];
const j = (value: number) =>
  (Math.abs(value) < 1e-9 ? 0 : value).toFixed(2) + ' J';
export function EnergyBars({
  mode,
  scale,
  rows,
}: {
  mode: LanguageMode;
  scale: number;
  rows: { label: Label; value: number; color: string }[];
}) {
  return (
    <div
      className="phy-energy-bars"
      aria-label={
        mode === 'en'
          ? 'Energy readings on one fixed scale'
          : '同一固定标尺的能量读数'
      }
    >
      <p>
        <B zh="同一条长尺" en="One shared scale" mode={mode} /> · 0 — {scale} J
      </p>
      {rows.map((row) => (
        <div className="phy-energy-bar-row" key={row.label[1]}>
          <div>
            <B zh={row.label[0]} en={row.label[1]} mode={mode} />
            <strong>{j(row.value)}</strong>
          </div>
          <div className="phy-energy-bar-track" aria-hidden="true">
            <span
              style={{
                width: (100 * row.value) / scale + '%',
                background: row.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
