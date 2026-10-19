import { useId } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import { textR, mulR, type Rational } from './algebraModels';
import {
  sequenceNumber,
  arithmeticPairs,
  geometricTerm,
  geometricTail,
  type SavingsConfig,
  type SavingsRow,
} from './sequenceModels';
export type SequencePoint = { index: number; value: Rational };
export type SequenceSeries = {
  name: string;
  points: SequencePoint[];
  color?: string;
};
export function SequencePlot({
  mode,
  series,
  bound = 20,
  nonnegative = false,
  selected,
  target,
  caption,
  reveal = false,
}: {
  mode: LanguageMode;
  series: SequenceSeries[];
  bound?: number;
  nonnegative?: boolean;
  selected?: number;
  target?: Rational;
  caption: LocalizedText;
  reveal?: boolean;
}) {
  const id = useId().replace(/:/g, ''),
    low = nonnegative ? 0 : -bound,
    px = (n: number) => 70 + (n * 500) / 12,
    py = (v: number) => 300 - ((v - low) * 260) / (bound - low),
    colors = ['#6652a1', '#b87a1c', '#248577'],
    inside = (p: SequencePoint) =>
      p.index >= 0 &&
      p.index <= 12 &&
      sequenceNumber(p.value) >= low &&
      sequenceNumber(p.value) <= bound;
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Discrete sequence graph; scroll within plot'
            : '离散数列图；需要时在图内滚动'
        }
      >
        <svg
          viewBox="0 0 640 370"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Separate points at integer indices; no continuous interpolation'
              : '整数序号的独立点；不作连续插值'
          }
        >
          <defs>
            <clipPath id={`seq-${id}`}>
              <rect x="60" y="30" width="520" height="280" />
            </clipPath>
          </defs>
          {Array.from({ length: 7 }, (_, i) => i * 2).map((n) => (
            <g key={n}>
              <path d={`M${px(n)} 40V300`} stroke="#e4dfeb" />
              <text x={px(n)} y="328" textAnchor="middle">
                {n}
              </text>
            </g>
          ))}
          {Array.from(
            { length: 5 },
            (_, i) => low + ((bound - low) * i) / 4,
          ).map((v) => (
            <g key={v}>
              <path d={`M70 ${py(v)}H570`} stroke="#e4dfeb" />
              <text x="58" y={py(v) + 5} textAnchor="end">
                {Number(v.toPrecision(8))}
              </text>
            </g>
          ))}
          <path d={`M60 ${py(0)}H590M70 310V25`} fill="none" stroke="#8b7e99" />
          <text x="604" y={Math.min(315, py(0) + 20)}>
            n
          </text>
          <text x="77" y="22">
            {nonnegative ? 'Bₙ' : 'aₙ'}
          </text>
          {target &&
            sequenceNumber(target) >= low &&
            sequenceNumber(target) <= bound && (
              <g>
                <path
                  d={`M70 ${py(sequenceNumber(target))}H570`}
                  stroke="#a86c1a"
                  strokeDasharray="7 5"
                />
                <text x="578" y={Math.max(48, py(sequenceNumber(target)) - 6)}>
                  {mode === 'en' ? 'target' : '目标'}
                </text>
              </g>
            )}
          <g clipPath={`url(#seq-${id})`}>
            {series.map((s, j) => (
              <g key={s.name}>
                {s.points.filter(inside).map((p) => {
                  const color = s.color ?? colors[j % colors.length];
                  return (
                    <g
                      key={p.index}
                      data-sequence-series={s.name}
                      data-sequence-index={p.index}
                      data-sequence-value={textR(p.value)}
                    >
                      <path
                        d={`M${px(p.index)} ${py(0)}V${py(sequenceNumber(p.value))}`}
                        stroke={color}
                        strokeOpacity="0.35"
                        strokeDasharray="3 4"
                      />
                      <circle
                        cx={px(p.index)}
                        cy={py(sequenceNumber(p.value))}
                        r={selected === p.index ? 7 : 5}
                        fill={color}
                        stroke={selected === p.index ? '#302536' : 'white'}
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
          <text x="320" y="355" textAnchor="middle">
            {mode === 'en'
              ? 'Integer indices · gaps do not define intermediate terms'
              : '序号取整数 · 点间空隙不定义中间项'}
          </text>
        </svg>
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
        <p>
          {series.map((s, i) => (
            <span
              key={s.name}
              style={{
                color: s.color ?? colors[i % colors.length],
                marginInlineEnd: '1rem',
              }}
            >
              {s.name}
            </span>
          ))}
        </p>
        {series.some((s) => s.points.some((p) => !inside(p))) && (
          <p role="status">
            <Text
              mode={mode}
              text={t(
                '部分点超出显示窗；数值保留在精确表中，不把图框当数列终点，也不把越窗点压在边缘。',
                'Some points lie outside the viewing window. Exact values remain in the audit; the frame is not the end of the sequence and out-of-window points are not flattened onto it.',
              )}
            />
          </p>
        )}
      </figcaption>
      {reveal && (
        <div
          className="math-concept-table"
          role="region"
          tabIndex={0}
          aria-label={
            mode === 'en' ? 'Exact sequence values' : '精确数列核验表'
          }
        >
          <table>
            <thead>
              <tr>
                <th>
                  <Text mode={mode} text={t('数列/模型', 'Sequence/model')} />
                </th>
                <th>n</th>
                <th>
                  <Text mode={mode} text={t('精确值', 'Exact value')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {series.flatMap((s) =>
                s.points.map((p) => (
                  <tr key={`${s.name}/${p.index}`}>
                    <td>{s.name}</td>
                    <td>{p.index}</td>
                    <td>{textR(p.value)}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}
export function ArithmeticPairFigure({
  mode,
  first,
  step,
  n,
  paired,
  reveal,
}: {
  mode: LanguageMode;
  first: Rational;
  step: Rational;
  n: number;
  paired: boolean;
  reveal: boolean;
}) {
  const m = arithmeticPairs(first, step, n),
    width = 510 / n,
    x = (i: number) => 70 + i * width;
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Two copies paired in reverse order'
            : '两份数列倒序配对'
        }
      >
        <svg
          viewBox="0 0 640 330"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Each column adds one term from each full copy'
              : '每列来自两份完整数列各一项'
          }
        >
          <text x="20" y="37">
            Sₙ
          </text>
          {m.forward.map((v, i) => (
            <g key={i} data-pair-row="forward" data-original-index={i + 1}>
              <rect
                x={x(i)}
                y="55"
                width={width}
                height="60"
                fill="#ebe4f6"
                stroke="#a99abd"
              />
              <text x={x(i) + width / 2} y="91" textAnchor="middle">
                {textR(v)}
              </text>
            </g>
          ))}
          {paired && (
            <>
              <text x="20" y="163">
                Sₙ
              </text>
              {m.reverse.map((v, i) => (
                <g key={i} data-pair-row="reverse" data-original-index={n - i}>
                  <rect
                    x={x(i)}
                    y="138"
                    width={width}
                    height="60"
                    fill="#f4e8d0"
                    stroke="#baa67d"
                  />
                  <text x={x(i) + width / 2} y="175" textAnchor="middle">
                    {textR(v)}
                  </text>
                  {reveal && (
                    <text x={x(i) + width / 2} y="241" textAnchor="middle">
                      {textR(m.pairTotal)}
                    </text>
                  )}
                </g>
              ))}
            </>
          )}
          {reveal && (
            <text x="320" y="298" textAnchor="middle">
              {paired
                ? `2Sₙ = ${n} × ${textR(m.pairTotal)} ; Sₙ = ${textR(m.sum)}`
                : `Sₙ = ${textR(m.sum)}`}
            </text>
          )}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '每行都是完整一份数列，不是把同一行拆成两半。奇数项时中间项在两份中各出现一次；负项仍保留符号。',
            'Each row is one complete copy, not half of one row. With odd n the middle term appears once in each copy. Negative terms retain their signs.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function GeometricShiftFigure({
  mode,
  first,
  ratio,
  n,
  reveal,
}: {
  mode: LanguageMode;
  first: Rational;
  ratio: Rational;
  n: number;
  reveal: boolean;
}) {
  const width = 510 / (n + 1),
    x = (i: number) => 70 + i * width,
    forward = Array.from({ length: n }, (_, i) =>
      geometricTerm(first, ratio, i + 1),
    ),
    shifted = forward.map((v) => mulR(v, ratio));
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en' ? 'Finite sum shifted by one power' : '有限和按幂次错位'
        }
      >
        <svg
          viewBox="0 0 640 330"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Subtract q times the finite sum and retain its final tail'
              : '有限和减去q倍自身，保留最后尾项'
          }
        >
          <text x="12" y="94">
            Sₙ
          </text>
          <text x="12" y="179">
            qSₙ
          </text>
          {forward.map((v, i) => (
            <g key={i}>
              <rect
                x={x(i)}
                y="57"
                width={width}
                height="60"
                fill="#ebe4f6"
                stroke="#ab9dbd"
              />
              <text x={x(i) + width / 2} y="94" textAnchor="middle">
                {textR(v)}
              </text>
              {reveal && i > 0 && (
                <path
                  d={`M${x(i) + 5} 105L${x(i) + width - 5} 70`}
                  stroke="#b18c88"
                />
              )}
            </g>
          ))}
          {shifted.map((v, i) => (
            <g
              key={i}
              data-geometric-power={i + 1}
              data-geometric-value={textR(v)}
            >
              <rect
                x={x(i + 1)}
                y="143"
                width={width}
                height="60"
                fill="#f4e8d0"
                stroke="#baa67d"
              />
              <text x={x(i + 1) + width / 2} y="180" textAnchor="middle">
                {textR(v)}
              </text>
              {reveal && i < n - 1 && (
                <path
                  d={`M${x(i + 1) + 5} 191L${x(i + 1) + width - 5} 156`}
                  stroke="#b18c88"
                />
              )}
            </g>
          ))}
          {reveal && (
            <>
              <text x="320" y="254" textAnchor="middle">
                (1−q)Sₙ = a₁−a₁qⁿ
              </text>
              <text
                x="320"
                y="291"
                textAnchor="middle"
              >{`a₁qⁿ = ${textR(geometricTail(first, ratio, n))}`}</text>
            </>
          )}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '按相同幂次对齐后相减；末尾a₁qⁿ不是原和的最后一项。q=1时恒等式两边为0，仍须直接数n项，不能除以0。',
            'Align equal powers before subtracting. The tail a₁qⁿ is not the last term of the original sum. At q=1 the identity becomes 0=0; count n terms directly rather than dividing by zero.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function SavingsTimeline({
  mode,
  config,
  period,
  row,
}: {
  mode: LanguageMode;
  config: SavingsConfig;
  period: number;
  row?: SavingsRow;
}) {
  const start = config.timing === 'start',
    labels =
      mode === 'en'
        ? ['opening', 'deposit', 'grow × q', 'deposit', 'closing']
        : ['期初余额', '先存入', '增长 × q', '后存入', '期末余额'];
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en' ? 'Within-period deposit timeline' : '期内存入时间线'
        }
      >
        <svg
          viewBox="0 0 640 210"
          role="img"
          aria-label={
            mode === 'en'
              ? 'Order of deposit and multiplication is explicit'
              : '明确存入与乘倍率的先后'
          }
        >
          {period === 0 ? (
            <>
              <text x="320" y="85" textAnchor="middle">
                B₀
              </text>
              <text x="320" y="124" textAnchor="middle">
                {mode === 'en'
                  ? 'Initial balance · no period or recurring deposit yet'
                  : '初始余额 · 尚未经过任何期或定期存入'}
              </text>
            </>
          ) : (
            labels.map((label, i) => (
              <g key={i}>
                <rect
                  x={14 + i * 124}
                  y="47"
                  width="115"
                  height="83"
                  rx="9"
                  fill={
                    i === 2
                      ? '#e4f0e9'
                      : i === (start ? 1 : 3)
                        ? '#f2e4c9'
                        : '#eee8f5'
                  }
                  stroke="#ab9dbd"
                />
                <text x={71 + i * 124} y="79" textAnchor="middle">
                  {label}
                </text>
                <text x={71 + i * 124} y="111" textAnchor="middle">
                  {i === 0
                    ? `B${period - 1}`
                    : i === 4
                      ? `B${period}`
                      : i === 2
                        ? textR(config.multiplier)
                        : i === (start ? 1 : 3)
                          ? textR(config.deposit)
                          : '0'}
                </text>
                {i < 4 && (
                  <text x={129 + i * 124} y="154" textAnchor="middle">
                    →
                  </text>
                )}
              </g>
            ))
          )}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            start
              ? '期初存入先参与本期增长。B₀不是a₁；第0期没有定期存入。'
              : '期末存入不参与本期增长，从下一期开始。B₀不是a₁；第0期没有定期存入。',
            start
              ? 'A start deposit participates in this period’s growth. B₀ is not a₁; period zero has no recurring deposit.'
              : 'An end deposit begins growing next period. B₀ is not a₁; period zero has no recurring deposit.',
          )}
        />
        {row && (
          <p>
            <Text
              mode={mode}
              text={t(
                `本期期末精确值=${textR(row.closing)} NZD；${config.policy === 'ideal' ? '理想模型不逐期舍入。' : '逐期增长后按分四舍五入入账。'}`,
                `Exact closing value for this period=${textR(row.closing)} NZD; ${config.policy === 'ideal' ? 'the ideal model does not round each period.' : 'growth is rounded to cents each period before posting.'}`,
              )}
            />
          </p>
        )}
      </figcaption>
    </figure>
  );
}
