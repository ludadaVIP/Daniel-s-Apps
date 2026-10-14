import type { LanguageMode, LocalizedText } from '@study/shared';
import { Fraction, Text } from './ui';
import { t } from './model';
import { fractionWholes, type FractionValue } from './fractionModels';
export function FractionStrip({
  value,
  mode,
  refinedDenominator,
}: {
  value: FractionValue;
  mode: LanguageMode;
  refinedDenominator?: number;
}) {
  return (
    <svg
      className="math-fraction-strip-svg"
      viewBox="0 0 602 44"
      preserveAspectRatio="none"
      role="img"
      aria-label={
        mode === 'en'
          ? `${value.n} shaded of ${value.d} equal parts of one whole`
          : `一个整体等分 ${value.d} 份，涂色 ${value.n} 份`
      }
    >
      <rect
        className="fraction-background"
        x="1"
        y="2"
        width="600"
        height="40"
      />
      <rect
        className="fraction-shading"
        x="1"
        y="2"
        width={(600 * value.n) / value.d}
        height="40"
      />
      {refinedDenominator &&
        Array.from({ length: refinedDenominator - 1 }, (_, i) => (
          <line
            className="fraction-fine-line"
            key={i}
            x1={1 + ((i + 1) * 600) / refinedDenominator}
            x2={1 + ((i + 1) * 600) / refinedDenominator}
            y1="2"
            y2="42"
          />
        ))}
      {Array.from({ length: value.d - 1 }, (_, i) => (
        <line
          key={i}
          x1={1 + ((i + 1) * 600) / value.d}
          x2={1 + ((i + 1) * 600) / value.d}
          y1="2"
          y2="42"
        />
      ))}
      <rect className="fraction-border" x="1" y="2" width="600" height="40" />
    </svg>
  );
}
export function FractionBars({
  value,
  mode,
  showValue = true,
  label,
}: {
  value: FractionValue;
  mode: LanguageMode;
  showValue?: boolean;
  label?: string | LocalizedText;
}) {
  const wholes = fractionWholes(value);
  return (
    <section className="math-fraction-bars">
      <div className="math-row">
        {label && (
          <strong>
            {typeof label === 'string' ? (
              label
            ) : (
              <Text mode={mode} text={label} />
            )}
          </strong>
        )}
        {showValue && <Fraction n={value.n} d={value.d} />}
        <span className="math-muted">
          <Text
            mode={mode}
            text={t(
              '每一整条 = 1 个相同的整体',
              'Each complete strip = one equal whole',
            )}
          />
        </span>
      </div>
      <div className="math-fraction-wholes">
        {wholes.map((whole, i) => (
          <div key={i}>
            <small>
              <Text mode={mode} text={t(`整体 ${i + 1}`, `Whole ${i + 1}`)} />
            </small>
            <FractionStrip value={whole} mode={mode} />
          </div>
        ))}
      </div>
    </section>
  );
}
export function FractionDiagram({
  values,
  mode,
}: {
  values: FractionValue[];
  mode: LanguageMode;
}) {
  return (
    <div className="math-fraction-diagram">
      {values.map((value, i) => (
        <FractionBars
          key={i}
          value={value}
          mode={mode}
          showValue={false}
          label={values.length > 1 ? String.fromCharCode(65 + i) : undefined}
        />
      ))}
    </div>
  );
}
