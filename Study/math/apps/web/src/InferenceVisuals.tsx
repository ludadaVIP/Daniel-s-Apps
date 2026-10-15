import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import { distribution, drawTree, probabilityText } from './inferenceModels';
export function DotDistribution({
  values,
  max = 10,
  step = 1,
  showSummary = false,
  mode,
  name,
}: {
  values: number[];
  max?: number;
  step?: number;
  showSummary?: boolean;
  mode: LanguageMode;
  name: string;
}) {
  const m = distribution(values);
  if (
    values.some((v) => v < 0 || v > max) ||
    max <= 0 ||
    step <= 0 ||
    !Number.isInteger(max / step) ||
    max / step > 25
  )
    throw new RangeError('Supported nonnegative dot-plot scale');
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step),
    counts = new Map<number, number>(),
    radius = Math.min(5, (400 / max) * 0.38);
  return (
    <figure className="math-inference-figure">
      <figcaption>
        {name} ·{' '}
        <Text
          mode={mode}
          text={t(
            '每个点一条记录，重复值逐个堆叠；两图共用同一数值尺度。',
            'Each dot is one record, with duplicates stacked individually; both plots share the same numerical scale.',
          )}
        />
      </figcaption>
      <div
        className="math-inference-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? `${name}: distribution; scroll locally`
            : `${name}：分布图，可在图内滚动`
        }
      >
        <svg
          viewBox="0 0 520 260"
          role="img"
          aria-label={
            mode === 'en'
              ? `${name}, values ${values.join(', ')}`
              : `${name}，记录 ${values.join('、')}`
          }
        >
          <line
            x1="62"
            y1="210"
            x2="480"
            y2="210"
            stroke="currentColor"
            strokeWidth="2"
          />
          {ticks.map((v) => (
            <g key={v}>
              <line
                x1={72 + (v / max) * 400}
                y1="205"
                x2={72 + (v / max) * 400}
                y2="216"
                stroke="currentColor"
              />
              <text x={72 + (v / max) * 400} y="237" textAnchor="middle">
                {v}
              </text>
            </g>
          ))}
          {values.map((value, id) => {
            const count = counts.get(value) ?? 0;
            counts.set(value, count + 1);
            return (
              <circle
                key={id}
                data-record-id={id}
                data-record-value={value}
                cx={72 + (value / max) * 400}
                cy={193 - count * 18}
                r={radius}
                fill="#5954a3"
              />
            );
          })}
          {showSummary && (
            <line
              data-mean-marker
              x1={72 + (Number(m.mean[0]) / Number(m.mean[1]) / max) * 400}
              x2={72 + (Number(m.mean[0]) / Number(m.mean[1]) / max) * 400}
              y1="35"
              y2="210"
              stroke="#a14532"
              strokeDasharray="6 4"
            />
          )}
        </svg>
      </div>
      {showSummary && (
        <p>
          <Text
            mode={mode}
            text={t('均值 / 中位数 / 极差', 'Mean / median / range')}
          />
          ：{probabilityText(m.mean)} / {probabilityText(m.median)} / {m.range}
        </p>
      )}
    </figure>
  );
}
export function ProbabilityTree({
  red,
  blue,
  replace,
  mode,
}: {
  red: number;
  blue: number;
  replace: boolean;
  mode: LanguageMode;
}) {
  const tree = drawTree(red, blue, replace);
  return (
    <figure className="math-inference-figure">
      <div
        className="math-inference-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Conditional probability tree; scroll locally'
            : '条件概率树；可在图内滚动'
        }
      >
        <svg
          viewBox="0 0 700 340"
          role="img"
          aria-label={
            mode === 'en'
              ? `${red} red and ${blue} blue numbered tokens, ${replace ? 'with' : 'without'} replacement`
              : `${red} 红 ${blue} 蓝编号球，${replace ? '放回' : '不放回'}`
          }
        >
          <text x="18" y="170">
            {mode === 'en' ? 'Start' : '开始'}
          </text>
          {(['R', 'B'] as const).map((first, i) => {
            const leaves = tree.leaves.filter((l) => l.first === first);
            if (!leaves.length) return null;
            const y = 90 + i * 160;
            return (
              <g key={first}>
                <line x1="70" y1="165" x2="260" y2={y} stroke="currentColor" />
                <text x="110" y={i ? 245 : 95}>
                  {first} · {probabilityText(leaves[0]!.firstProbability)}
                </text>
                <text x="270" y={y + 5}>
                  {first}
                </text>
                {leaves.map((leaf, j) => {
                  const ly = y - 40 + j * 80;
                  return (
                    <g
                      key={leaf.code}
                      data-tree-path={leaf.code}
                      data-path-possible={leaf.possible}
                    >
                      <line
                        x1="290"
                        y1={y}
                        x2="500"
                        y2={ly}
                        stroke="currentColor"
                        strokeDasharray={leaf.possible ? undefined : '5 4'}
                      />
                      <text x="325" y={ly + 5}>
                        {leaf.second} ·{' '}
                        {probabilityText(leaf.conditionalProbability)}
                      </text>
                      <text x="510" y={ly + 5}>
                        {leaf.code}: {probabilityText(leaf.probability)}
                        {leaf.possible
                          ? ''
                          : mode === 'en'
                            ? ' (impossible)'
                            : '（不可能）'}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            'H/T 用于硬币，R/B 用于红/蓝；这里每个编号球等机会，路径概率是首步概率乘条件概率。虚线零概率分支不计入可发生结果；颜色路径不一定等可能。',
            'R/B mean red/blue here; H/T elsewhere label coin faces. Each numbered token is equally likely. Multiply the first probability by the conditional one. Dashed zero-probability branches are impossible, and colour paths need not be equally likely.',
          )}
        />
      </figcaption>
      <table>
        <caption>
          <Text
            mode={mode}
            text={t('每条路径的数量依据', 'Counts supporting each path')}
          />
        </caption>
        <thead>
          <tr>
            <th>
              <Text mode={mode} text={t('路径', 'Path')} />
            </th>
            <th>
              <Text mode={mode} text={t('第一步', 'First draw')} />
            </th>
            <th>
              <Text
                mode={mode}
                text={t('第二步条件', 'Second draw, given first')}
              />
            </th>
            <th>P</th>
          </tr>
        </thead>
        <tbody>
          {tree.leaves.map((l) => (
            <tr key={l.code}>
              <th>{l.code}</th>
              <td>
                {l.firstCount}/{l.firstTotal}
              </td>
              <td>
                {l.secondCount}/{l.secondTotal}
              </td>
              <td>{probabilityText(l.probability)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
