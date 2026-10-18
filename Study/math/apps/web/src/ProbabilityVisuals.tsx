import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import {
  jointModel,
  numberedPairs,
  eventHit,
  type PairTrial,
  probabilityString,
} from './probabilityModels';
import type { TreeEvent } from './inferenceModels';
import type { Rational } from './algebraModels';
export function ProbabilityFrame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-probability-figure">
      <div
        role="region"
        tabIndex={0}
        className="math-probability-scroll"
        aria-label={
          mode === 'en'
            ? 'Probability model; scroll locally'
            : '概率模型；需要时在图内滚动'
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
export function JointView({
  mode,
  cells,
  swap = false,
}: {
  mode: LanguageMode;
  cells: number[];
  swap?: boolean;
}) {
  const m = jointModel(cells),
    c = swap ? [cells[0]!, cells[2]!, cells[1]!, cells[3]!] : cells;
  return (
    <ProbabilityFrame
      mode={mode}
      caption={t(
        '¬A表示A不发生，¬B表示B不发生。四格互不重叠，合起来是完整等可能编号空间。格内数目不表示每格等可能；交换表的行列只改变看法。',
        '¬A means A does not occur, and ¬B means B does not occur. The four disjoint cells exhaust equally likely numbered outcomes. Cell counts need not be equal; transposing the table changes only the view.',
      )}
    >
      <table className="math-probability-joint">
        <caption>
          <Text
            mode={mode}
            text={t(
              `共${m.total}个等可能编号；不是抽样观测表`,
              `All ${m.total} equally likely IDs; a model, not a survey sample`,
            )}
          />
        </caption>
        <thead>
          <tr>
            <th>{swap ? 'B / A' : 'A / B'}</th>
            <th>{swap ? 'A' : 'B'}</th>
            <th>{swap ? '¬A' : '¬B'}</th>
            <th>
              <Text mode={mode} text={t('合计', 'Total')} />
            </th>
          </tr>
        </thead>
        <tbody>
          {[0, 1].map((r) => (
            <tr key={r}>
              <th>{swap ? (r ? '¬B' : 'B') : r ? '¬A' : 'A'}</th>
              {[0, 1].map((k) => (
                <td key={k} data-joint-cell={`${r}${k}`}>
                  {c[r * 2 + k]}
                </td>
              ))}
              <td>{c[r * 2]! + c[r * 2 + 1]!}</td>
            </tr>
          ))}
          <tr>
            <th>
              <Text mode={mode} text={t('合计', 'Total')} />
            </th>
            <td>{c[0]! + c[2]!}</td>
            <td>{c[1]! + c[3]!}</td>
            <td>{m.total}</td>
          </tr>
        </tbody>
      </table>
    </ProbabilityFrame>
  );
}
export function PairGrid({
  mode,
  red,
  blue,
  replace,
  event = 'different',
  reveal = false,
}: {
  mode: LanguageMode;
  red: number;
  blue: number;
  replace: boolean;
  event?: TreeEvent;
  reveal?: boolean;
}) {
  const m = numberedPairs(red, blue, replace);
  return (
    <ProbabilityFrame
      mode={mode}
      caption={t(
        '行是第一次，列是第二次；R红/B蓝。×表示不放回时不能再抽同一编号，不是一个可计数结果。每个可用编号有序对等可能，颜色类别不一定等可能。',
        'Rows are first draw, columns second; R=red, B=blue. × excludes drawing the same ID without replacement. Eligible ordered ID pairs are equally likely; colour categories need not be.',
      )}
    >
      <table className="math-probability-grid">
        <caption>
          <Text
            mode={mode}
            text={t(
              `${replace ? '放回' : '不放回'}：${m.labelledTotal}个可用编号有序对`,
              `${replace ? 'With' : 'Without'} replacement: ${m.labelledTotal} eligible ordered ID pairs`,
            )}
          />
        </caption>
        <thead>
          <tr>
            <th>1 → 2</th>
            {m.tokens.map((x) => (
              <th key={x}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {m.tokens.map((a) => (
            <tr key={a}>
              <th>{a}</th>
              {m.tokens.map((b) => {
                const possible = replace || a !== b,
                  hit = possible && eventHit(a[0]! + b[0]!, event);
                return (
                  <td
                    key={b}
                    data-pair={`${a}-${b}`}
                    data-pair-possible={possible}
                    className={reveal && hit ? 'is-hit' : undefined}
                  >
                    {possible ? (
                      <>
                        {a}–{b}
                        {reveal && hit ? ' ✓' : ''}
                      </>
                    ) : (
                      '×'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ProbabilityFrame>
  );
}
export function FrequencyRecord({
  mode,
  hits,
  total,
}: {
  mode: LanguageMode;
  hits: number;
  total: number;
}) {
  return (
    <ProbabilityFrame
      mode={mode}
      caption={t(
        '只根据给定观测算命中次数/试验次数；不把理论值替换成记录。零次试验时频率未定义。',
        'Calculate hits/trials from the supplied observations, retaining the record. A theoretical probability does not replace it; frequency is undefined at zero trials.',
      )}
    >
      <table>
        <thead>
          <tr>
            <th>
              <Text mode={mode} text={t('命中', 'Hits')} />
            </th>
            <th>
              <Text mode={mode} text={t('未命中', 'Misses')} />
            </th>
            <th>
              <Text mode={mode} text={t('总试验数', 'Total trials')} />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{hits}</td>
            <td>{total - hits}</td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </ProbabilityFrame>
  );
}
export function FrequencyPlot({
  mode,
  records,
  theory,
}: {
  mode: LanguageMode;
  records: PairTrial[];
  theory: Rational;
}) {
  const p = Number(theory[0]) / Number(theory[1]),
    max = Math.max(10, records.length),
    x = (n: number) => 65 + (n / max) * 560,
    y = (v: number) => 270 - v * 220;
  return (
    <ProbabilityFrame
      mode={mode}
      caption={t(
        '同一次运行的累计频率折线；横轴最大值随记录数调整，纵轴固定0–1。虚线是模型理论值；零次不画频率点。有限运行不保证每一步更接近，也不要求最后恰好相等。',
        'Cumulative frequency within one run; horizontal range grows with records, vertical range stays 0–1. The dashed line is model theory. There is no point at zero trials, no guaranteed stepwise convergence, and no forced final equality.',
      )}
    >
      <svg
        viewBox="0 0 680 340"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Cumulative frequency and theoretical probability'
            : '累计频率与理论概率'
        }
      >
        <line x1="65" y1="50" x2="65" y2="270" stroke="currentColor" />
        <line x1="65" y1="270" x2="625" y2="270" stroke="currentColor" />
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line x1="60" x2="625" y1={y(v)} y2={y(v)} stroke="#ddd" />
            <text x="35" y={y(v) + 5}>
              {v}
            </text>
          </g>
        ))}
        <line
          data-probability-theory
          x1="65"
          x2="625"
          y1={y(p)}
          y2={y(p)}
          stroke="#a14532"
          strokeDasharray="7 4"
        />
        <text x="70" y="25">
          P={probabilityString(theory)}
        </text>
        {records.length > 0 && (
          <>
            <polyline
              data-probability-frequency
              points={records
                .map((r) => `${x(r.n)},${y(r.hits / r.n)}`)
                .join(' ')}
              fill="none"
              stroke="#5954a3"
              strokeWidth="2"
            />
            {records.length === 1 && (
              <circle cx={x(1)} cy={y(records[0]!.hits)} r="4" fill="#5954a3" />
            )}
          </>
        )}
        <text x="65" y="292">
          0
        </text>
        <text x="610" y="292">
          {max}
        </text>
        <text x="65" y="320">
          {mode === 'en'
            ? 'Trial count n · frequency = hits/n'
            : '试验次数n · 频率=命中/n'}
        </text>
      </svg>
    </ProbabilityFrame>
  );
}
