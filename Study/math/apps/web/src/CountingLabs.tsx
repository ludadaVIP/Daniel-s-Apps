import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { DataFigure, DataTable } from './DataModellingVisuals';
import { textR, type Rational } from './algebraModels';
import {
  factorial,
  permutations,
  combinations,
  orderedSelections,
  selectionGroups,
  countingUnion,
  countingStages,
  pascalRow,
  binomialCoefficient,
  simulateBinomial,
  contingency,
  sourceFlagModel,
} from './countingModels';

export type CountingLabKind = Extract<Lesson['lab'], `counting-${string}`>;
export const isCountingLab = (kind: Lesson['lab']): kind is CountingLabKind =>
  kind.startsWith('counting-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
const number = (value: string | number | bigint): AnswerSpec => ({
  kind: 'number',
  value: String(value),
});
const probability = (v: Rational | null): AnswerSpec =>
  v ? number(textR(v)) : { kind: 'vector-code', value: 'undefined' };
const show = (v: Rational | null) => (v ? textR(v) : 'undefined');
function Select({
  mode,
  name,
  value,
  options,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  options: [string, LocalizedText][];
  change: (v: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={word(mode, name)}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {options.map(([v, p]) => (
          <option key={v} value={v}>
            {word(mode, p)}
          </option>
        ))}
      </select>
    </label>
  );
}
const ints = (lo: number, hi: number): [string, LocalizedText][] =>
  Array.from({ length: hi - lo + 1 }, (_, i) => [
    String(lo + i),
    t(String(lo + i), String(lo + i)),
  ]);
function Prediction({
  mode,
  name,
  answer,
  hint,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  hint: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-concept-task">
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={word(mode, name)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button
        className="math-button"
        aria-label={word(mode, t(`核对：${name.zh}`, `Check: ${name.en}`))}
        onClick={() => setChecked(true)}
      >
        <Text mode={mode} text={t('核对预测', 'Check prediction')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={word(mode, t(`${name.zh}反馈`, `${name.en} feedback`))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(value, answer)
                ? t(
                    '预测符合。请继续解释结果身份、计数条件和分母。',
                    'The prediction matches. Explain outcome identities, counting conditions and the denominator.',
                  )
                : hint
            }
          />
        </p>
      )}
    </div>
  );
}
function Audit({
  mode,
  children,
}: {
  mode: LanguageMode;
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  return (
    <>
      <button
        className="math-button secondary"
        aria-expanded={shown}
        onClick={() => setShown(!shown)}
      >
        <Text mode={mode} text={t('显示/隐藏核验', 'Show/hide audit')} />
      </button>
      {shown && children}
    </>
  );
}
const countHint = t(
  '先确定完整结果：只选一种，还是每步都要完成？限制使每个分支剩下多少选择？',
  'Define a complete outcome: one alternative, or all stages? Count choices left on each branch under the restriction.',
);
const conditionalHint = t(
  '分母只包含条件内的结果；分子是同时满足两事件的结果。条件事件概率为零时未定义，用undefined。',
  'The denominator contains only outcomes satisfying the condition. The numerator satisfies both events. A zero-probability condition is undefined; enter undefined.',
);

function Principles({ mode }: { mode: LanguageMode }) {
  const [rule, setRule] = useState('union'),
    [overlap, setOverlap] = useState('0'),
    [restricted, setRestricted] = useState('0');
  const u = countingUnion(
      ['A', 'B', 'C'],
      overlap === '1' ? ['C', 'D'] : ['D', 'E'],
    ),
    s = countingStages(3, 2, restricted === '1');
  const answer = rule === 'union' ? u.union.length : s.total;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '类别内每个字母是一张独特卡。分步时结果是有序数对，必须完成两步；相同编号限制按分支逐项删除。',
            'Each letter names one distinct card. A staged outcome is an ordered pair completing both stages; a same-number restriction removes pairs branch by branch.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('计数结构', 'Counting structure')}
        value={rule}
        options={[
          ['union', t('两类任选一张', 'One card from either category')],
          ['stages', t('第一步1–3，第二步1–2', 'Stage one 1–3, stage two 1–2')],
        ]}
        change={setRule}
      />
      {rule === 'union' ? (
        <Select
          mode={mode}
          name={t('类别是否重叠', 'Category overlap')}
          value={overlap}
          options={[
            ['0', t('ABC与DE，无重复', 'ABC and DE, disjoint')],
            ['1', t('ABC与CD，共有C', 'ABC and CD, shared C')],
          ]}
          change={setOverlap}
        />
      ) : (
        <Select
          mode={mode}
          name={t('分步限制', 'Stage restriction')}
          value={restricted}
          options={[
            ['0', t('允许相同编号', 'Same numbers allowed')],
            ['1', t('禁止相同编号', 'Same numbers forbidden')],
          ]}
          change={setRestricted}
        />
      )}
      <Prediction
        key={`principles-${rule}-${answer}`}
        mode={mode}
        name={t('预测不同结果数', 'Predict distinct outcome count')}
        answer={number(answer)}
        hint={countHint}
      />
      <Audit mode={mode}>
        {rule === 'union' ? (
          <DataTable
            mode={mode}
            headers={[
              t('对象', 'Object'),
              t('逐个身份', 'Individual identities'),
            ]}
            rows={[
              [word(mode, t('第一类', 'Category one')), u.a.join(', ')],
              [word(mode, t('第二类', 'Category two')), u.b.join(', ')],
              ['∩', u.overlap.join(', ') || '∅'],
              ['∪', u.union.join(', ')],
              [
                '|A∪B|',
                `${u.a.length}+${u.b.length}−${u.overlap.length}=${answer}`,
              ],
            ]}
          />
        ) : (
          <DataTable
            mode={mode}
            headers={[
              t('第一步', 'First stage'),
              t('允许的第二步', 'Allowed second stages'),
              t('该分支数量', 'Branch count'),
            ]}
            rows={[
              ...s.rows.map((row, i) => [
                i + 1,
                row.map((p) => `(${p.first},${p.second})`).join(' ') || '∅',
                row.length,
              ]),
              ['Σ', '', s.total],
            ]}
          />
        )}
      </Audit>
    </>
  );
}
function Selections({
  mode,
  unordered = false,
}: {
  mode: LanguageMode;
  unordered?: boolean;
}) {
  const [n, setN] = useState(4),
    [r, setR] = useState(2),
    [repeat, setRepeat] = useState('0');
  const rows = orderedSelections(n, r, !unordered && repeat === '1'),
    groups = unordered ? selectionGroups(n, r) : [];
  const result = unordered
    ? combinations(n, r)
    : permutations(n, r, repeat === '1');
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            unordered
              ? t(
                  '每个字母是不同成员，同一人只选一次，同组不分职位。把所有有序选法按成员集合归组，观察每组恰有r!种顺序。',
                  'Letters identify distinct people, each selected at most once, with equal roles. Group ordered selections by membership; each group has exactly r! orders.',
                )
              : t(
                  '位置有名称，交换字母会改变结果。不放回时同一字母不能重复；允许重复时，每个位置都重新获得全部字母。',
                  'Positions are labelled, so swapping letters changes the outcome. Without repetition a letter cannot recur; with repetition every position has the full alphabet again.',
                )
          }
        />
      </p>
      <Select
        mode={mode}
        name={t('不同对象数n', 'Distinct objects n')}
        value={String(n)}
        options={ints(3, 5)}
        change={(v) => setN(Number(v))}
      />
      <Select
        mode={mode}
        name={t('位置或成员数r', 'Positions or members r')}
        value={String(r)}
        options={ints(0, 3)}
        change={(v) => setR(Number(v))}
      />
      {!unordered && (
        <Select
          mode={mode}
          name={t('重复规则', 'Repetition rule')}
          value={repeat}
          options={[
            ['0', t('不可重复', 'No repetition')],
            ['1', t('可以重复', 'Repetition allowed')],
          ]}
          change={setRepeat}
        />
      )}
      <Prediction
        key={`selection-${unordered}-${result}`}
        mode={mode}
        name={t('预测选法数', 'Predict selection count')}
        answer={number(result)}
        hint={t(
          '检查是否分位置以及能否重复。r=0有一个空选法，不是没有选法；组合要除去同组的r!个顺序。',
          'Check labelled positions and repetition. For r=0 there is one empty selection; combinations remove the r! orders of each group.',
        )}
      />
      <Audit mode={mode}>
        <p>
          {unordered
            ? `P(${n},${r})=${permutations(n, r)} = C(${n},${r}) × ${factorial(r)}`
            : repeat === '1'
              ? `${n}^${r}=${result}`
              : `P(${n},${r})=${result}`}
        </p>
        <DataTable
          mode={mode}
          headers={
            unordered
              ? [
                  t('同一成员集合', 'One membership set'),
                  t('全部顺序', 'All orders'),
                  t('重复倍数', 'Multiplicity'),
                ]
              : [
                  t('序号', 'Index'),
                  t('完整有序结果', 'Complete ordered outcome'),
                ]
          }
          rows={
            unordered
              ? groups.map((g) => [
                  g.key,
                  g.orders.map((p) => p.join('') || '∅').join(', '),
                  g.orders.length,
                ])
              : rows.map((p, i) => [i + 1, p.join('') || '∅'])
          }
        />
      </Audit>
    </>
  );
}
function Binomial({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(4),
    [k, setK] = useState(2),
    [b, setB] = useState(1),
    [trials, setTrials] = useState(0),
    [seed, setSeed] = useState(12345);
  const row = pascalRow(n),
    coefficient = binomialCoefficient(n, k, b),
    simulation = simulateBinomial(n, trials, seed);
  const changeN = (v: string) => {
    const next = Number(v);
    setN(next);
    setK(Math.min(k, next));
    setTrials(0);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '在n个有标签的因子中，选k个取b，其余取x，得到C(n,k)x^(n−k)b^k。行号从n=0起；每个系数数的是位置子集。',
            'Choose k of n labelled factors to contribute b, and x from the rest: C(n,k)x^(n−k)b^k. Rows start at n=0; each binomial coefficient counts a subset of factor positions.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('幂n', 'Power n')}
        value={String(n)}
        options={ints(0, 7)}
        change={changeN}
      />
      <Select
        mode={mode}
        name={t('取常数的因子数k', 'Factors contributing the constant k')}
        value={String(k)}
        options={ints(0, n)}
        change={(v) => setK(Number(v))}
      />
      <Select
        mode={mode}
        name={t('常数b', 'Constant b')}
        value={String(b)}
        options={[-2, 1, 2].map((v) => [String(v), t(String(v), String(v))])}
        change={(v) => setB(Number(v))}
      />
      <p>{`(x+(${b}))^${n}, x^${n - k}`}</p>
      <Prediction
        key={`coefficient-${coefficient}`}
        mode={mode}
        name={t('预测该幂的系数', 'Predict the coefficient of this power')}
        answer={number(coefficient)}
        hint={t(
          '先数C(n,k)，再乘b^k；负b须保留奇偶符号。',
          'Count C(n,k), then multiply by b^k, preserving the sign for negative b.',
        )}
      />
      <Audit mode={mode}>
        <DataFigure
          mode={mode}
          name={t('杨辉三角', 'Pascal triangle')}
          caption={t(
            '端点为1；内部数为上一行相邻两数之和。高亮的是当前C(n,k)，不是乘过b^k的系数。',
            'Edges are one; each interior entry sums its two parents. The highlight is C(n,k), before multiplication by b^k.',
          )}
        >
          <svg
            width="640"
            height="350"
            viewBox="0 0 640 350"
            role="img"
            aria-label={word(
              mode,
              t(
                '第0至7行的精确二项式系数',
                'Exact binomial coefficients in rows zero through seven',
              ),
            )}
          >
            {Array.from({ length: 8 }, (_, i) =>
              pascalRow(i).map((v, j) => (
                <g key={`${i}-${j}`} data-pascal-row={i} data-pascal-k={j}>
                  <circle
                    cx={320 + (j - i / 2) * 70}
                    cy={30 + i * 42}
                    r="19"
                    fill={i === n && j === k ? '#e7b74c' : '#e9e6f5'}
                  />
                  <text
                    x={320 + (j - i / 2) * 70}
                    y={35 + i * 42}
                    textAnchor="middle"
                    fontSize="14"
                    fill="#252038"
                  >
                    {String(v)}
                  </text>
                </g>
              )),
            )}
          </svg>
        </DataFigure>
        <p>{`C(${n},${k})=${row[k]}, ${row[k]}×(${b})^${k}=${coefficient}; Σ C(${n},j)=${2n ** BigInt(n)}`}</p>
      </Audit>
      <p>
        <Text
          mode={mode}
          text={t(
            '可选实验：每轮独立抛n枚公平硬币。理论上恰有j枚正面的概率为C(n,j)/2^n；这与当前b的代数取值无关。下表模拟记录不会被强改为理论值。',
            'Optional experiment: independently flip n fair coins per trial. Exactly j heads has theoretical probability C(n,j)/2^n, independent of the algebraic value b. The simulated counts below are never forced to match theory.',
          )}
        />
      </p>
      <button
        className="math-button"
        onClick={() => setTrials(Math.min(1000, trials + 20))}
        disabled={trials === 1000}
      >
        <Text mode={mode} text={t('增加20轮模拟', 'Add 20 simulated trials')} />
      </button>
      <button
        className="math-button secondary"
        onClick={() => {
          setSeed((seed + 1) >>> 0);
          setTrials(0);
        }}
      >
        <Text
          mode={mode}
          text={t('换种子并清空模拟', 'Change seed and clear simulation')}
        />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            `可复现伪随机模拟；种子${seed}，${trials}轮。零轮频率未定义。`,
            `Reproducible pseudorandom simulation; seed ${seed}, ${trials} trials. Zero-trial frequency is undefined.`,
          )}
        />
      </p>
      <DataTable
        mode={mode}
        headers={[
          t('正面数j', 'Heads j'),
          t('理论概率', 'Theoretical probability'),
          t('模拟次数', 'Simulated count'),
          t('观察频率', 'Observed frequency'),
        ]}
        rows={simulation.bins.map((count, j) => [
          j,
          textR(simulation.theory[j]!),
          count,
          show(simulation.frequencies[j]!),
        ])}
      />
      <details>
        <summary>
          <Text
            mode={mode}
            text={t('查看逐轮原记录', 'Inspect trial records')}
          />
        </summary>
        <p>
          {simulation.records.map((v, i) => `${i + 1}:${v}`).join(' · ') || '∅'}
        </p>
      </details>
    </>
  );
}
export const conditionalCases = [
  [3, 1, 2, 4],
  [1, 1, 1, 1],
  [0, 3, 0, 2],
  [0, 0, 2, 3],
  [0, 2, 3, 1],
];
function Conditional({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState('0'),
    [direction, setDirection] = useState('A|B');
  const cells = conditionalCases[Number(index)]!,
    m = contingency(cells),
    v =
      direction === 'A|B' ? m.aGivenB : direction === 'B|A' ? m.bGivenA : m.pA;
  const active = (cell: number) =>
    direction === 'A'
      ? true
      : direction === 'A|B'
        ? cell === 0 || cell === 2
        : cell === 0 || cell === 1;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '每个小点是等可能且有独特编号的结果。灰色点被条件排除，不能留在分母；改换条件方向，通常得到不同概率。',
            'Every dot is an equally likely, uniquely numbered outcome. Grey dots are excluded by the condition and leave the denominator. Reversing the condition generally changes the probability.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('四格结果模型', 'Four-cell outcome model')}
        value={index}
        options={conditionalCases.map((c, i) => [
          String(i),
          t(
            `AB,A独有,B独有,皆非：${c.join(',')}`,
            `AB,A-only,B-only,neither: ${c.join(',')}`,
          ),
        ])}
        change={setIndex}
      />
      <Select
        mode={mode}
        name={t('条件方向', 'Condition direction')}
        value={direction}
        options={['A|B', 'B|A', 'A'].map((v) => [v, t(`P(${v})`, `P(${v})`)])}
        change={setDirection}
      />
      <Prediction
        key={`conditional-${direction}-${show(v)}`}
        mode={mode}
        name={t('预测条件概率或undefined', 'Predict probability or undefined')}
        answer={probability(v)}
        hint={conditionalHint}
      />
      <DataFigure
        mode={mode}
        name={t('条件筛选结果空间', 'Condition-filtered outcome space')}
        caption={t(
          '四格按AB、A独有、B独有、皆非分开；格面积不表示概率，只按逐个点计数。',
          'The four cells are AB, A-only, B-only and neither. Cell areas do not encode probability; count the individual dots.',
        )}
      >
        <svg
          width="640"
          height="270"
          viewBox="0 0 640 270"
          role="img"
          aria-label={word(
            mode,
            t('有编号的条件结果', 'Numbered conditional outcomes'),
          )}
        >
          {cells.map((count, i) => (
            <g key={i} data-condition-active={active(i)}>
              <rect
                x={15 + i * 157}
                y="15"
                width="145"
                height="240"
                rx="8"
                fill={active(i) ? '#eae6f5' : '#eee'}
              />
              <text x={87 + i * 157} y="42" textAnchor="middle" fill="#252038">
                {['A∩B', 'A∩Bᶜ', 'Aᶜ∩B', 'Aᶜ∩Bᶜ'][i]}
              </text>
              {Array.from({ length: count }, (_, j) => (
                <g key={j}>
                  <circle
                    cx={45 + i * 157 + (j % 3) * 40}
                    cy={80 + Math.floor(j / 3) * 38}
                    r="15"
                    fill={
                      active(i) ? (i === 0 ? '#a37915' : '#5a4e9c') : '#999'
                    }
                  />
                  <text
                    x={45 + i * 157 + (j % 3) * 40}
                    y={85 + Math.floor(j / 3) * 38}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                  >
                    {cells.slice(0, i).reduce((s, v) => s + v, 0) + j + 1}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </svg>
      </DataFigure>
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[t('量', 'Quantity'), t('精确值', 'Exact value')]}
          rows={[
            ['|Ω|', m.total],
            ['|A∩B|', m.ab],
            ['|A|', m.a],
            ['|B|', m.b],
            ['P(A)', textR(m.pA)],
            ['P(A|B)', show(m.aGivenB)],
            ['P(B|A)', show(m.bGivenA)],
          ]}
        />
      </Audit>
    </>
  );
}
function Bayes({ mode }: { mode: LanguageMode }) {
  const [prior, setPrior] = useState('5'),
    [rates, setRates] = useState('80,10');
  const [aRate, otherRate] = rates.split(',').map(Number) as [number, number],
    m = sourceFlagModel(Number(prior), aRate, otherRate);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构分类机给来自A厂或其他厂的包装打标记F。参数是事先假定的模型率，不是调查观测。先按来源分流，再按各自标记率分流；反向问：已标记的包装来自哪里？',
            'A fictional sorter flags packages F from source A or another source. Rates are assumed model parameters, not survey observations. Split by source, then by each source’s flag rate. Reverse the question: where did a flagged package originate?',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('A来源基础占比', 'Source A base rate')}
        value={prior}
        options={[0, 5, 50, 100].map((v) => [String(v), t(`${v}%`, `${v}%`)])}
        change={setPrior}
      />
      <Select
        mode={mode}
        name={t('两来源标记率', 'Flag rates for the two sources')}
        value={rates}
        options={[
          ['80,10', t('A:80%，其他:10%', 'A:80%, other:10%')],
          ['20,20', t('两来源都是20%', 'Both sources:20%')],
          ['0,0', t('两来源都是0%', 'Both sources:0%')],
        ]}
        change={setRates}
      />
      <Prediction
        key={`posterior-${show(m.posterior)}`}
        mode={mode}
        name={t('预测P(A|F)', 'Predict P(A|F)')}
        answer={probability(m.posterior)}
        hint={conditionalHint}
      />
      <Prediction
        key={`independent-${m.independent}`}
        mode={mode}
        name={t('预测独立性', 'Predict independence')}
        answer={{
          kind: 'independence',
          value: m.independent ? 'independent' : 'dependent',
        }}
        hint={t(
          '用P(A∩F)=P(A)P(F)核对。互斥不等于独立；空条件不做除法。可输入independent或dependent。',
          'Check P(A∩F)=P(A)P(F). Disjoint does not mean independent; do not divide by a zero condition. Enter independent or dependent.',
        )}
      />
      <DataFigure
        mode={mode}
        name={t('来源与标记面积模型', 'Source and flag area model')}
        caption={t(
          '整个矩形表示1000份模型质量，宽度按来源占比，高度按该来源的标记率；金色面积为标记F。',
          'The rectangle represents 1,000 units of model mass. Width encodes source proportion and height that source’s flag rate; gold area is F.',
        )}
      >
        <svg
          width="640"
          height="290"
          viewBox="0 0 640 290"
          role="img"
          aria-label={word(
            mode,
            t(
              '基础占比改变标记来源构成',
              'Base rate changes the composition of flagged outcomes',
            ),
          )}
        >
          <rect
            x="20"
            y="30"
            width={6 * Number(prior)}
            height="200"
            fill="#e9e6f5"
          />
          <rect
            x={20 + 6 * Number(prior)}
            y="30"
            width={600 - 6 * Number(prior)}
            height="200"
            fill="#e3edf1"
          />
          <rect
            data-source="A"
            x="20"
            y="30"
            width={6 * Number(prior)}
            height={2 * aRate}
            fill="#c3932c"
          />
          <rect
            data-source="other"
            x={20 + 6 * Number(prior)}
            y="30"
            width={600 - 6 * Number(prior)}
            height={2 * otherRate}
            fill="#c3932c"
          />
          <rect
            x="20"
            y="30"
            width="600"
            height="200"
            fill="none"
            stroke="#554c71"
          />
          <text
            x="20"
            y="260"
            fill="#252038"
          >{`A: ${prior}% × ${aRate}%`}</text>
          <text
            x="330"
            y="260"
            fill="#252038"
          >{`Aᶜ: ${100 - Number(prior)}% × ${otherRate}%`}</text>
        </svg>
      </DataFigure>
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('来源', 'Source'),
            t('总模型质量', 'Total model mass'),
            t('标记模型质量', 'Flagged model mass'),
          ]}
          rows={[
            ['A', m.aMass, textR(m.aFlag)],
            ['Aᶜ', m.otherMass, textR(m.otherFlag)],
          ]}
        />
        <p>{`P(A|F)=${show(m.posterior)}; P(F|A)=${show(m.likelihoodA)}; P(A)=${textR(m.pA)}`}</p>
        <p>
          <Text
            mode={mode}
            text={
              m.independent
                ? t(
                    '乘积判据成立，A与F独立。零概率来源或零概率标记也按乘积判据处理，但相应条件概率仍可能未定义。',
                    'The product criterion holds: A and F are independent. Zero-probability sources or flags still use this criterion, while conditional probabilities may remain undefined.',
                  )
                : t(
                    '乘积判据不成立，来源与标记相依；标记率不等于反向的来源概率。',
                    'The product criterion fails: source and flag are dependent. The flag rate is not the reverse source probability.',
                  )
            }
          />
        </p>
      </Audit>
    </>
  );
}
export function CountingLab({
  kind,
  mode,
}: {
  kind: CountingLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'counting-principles' ? (
        <Principles mode={mode} />
      ) : kind === 'counting-permutations' ? (
        <Selections mode={mode} />
      ) : kind === 'counting-combinations' ? (
        <Selections mode={mode} unordered />
      ) : kind === 'counting-binomial' ? (
        <Binomial mode={mode} />
      ) : kind === 'counting-conditional' ? (
        <Conditional mode={mode} />
      ) : (
        <Bayes mode={mode} />
      )}
    </div>
  );
}
export function CountingHookArt({
  kind,
  mode,
}: {
  kind: CountingLabKind;
  mode: LanguageMode;
}) {
  const captions: Record<CountingLabKind, LocalizedText> = {
    'counting-principles': t(
      'ABC或CD：C出现两次，但它是一张卡。',
      'ABC or CD: C appears twice but is one card.',
    ),
    'counting-permutations': t(
      'AB与BA：同两个人，不同职位。',
      'AB and BA: the same people, different roles.',
    ),
    'counting-combinations': t(
      '{A,B}：交换顺序，成员集合不变。',
      '{A,B}: swapping order preserves membership.',
    ),
    'counting-binomial': t(
      '(x+b)^4：选哪两个因子贡献b？',
      '(x+b)^4: which two factors contribute b?',
    ),
    'counting-conditional': t(
      '知道B发生后，分母还包含B外的结果吗？',
      'After learning B occurred, do outcomes outside B remain in the denominator?',
    ),
    'counting-bayes': t(
      'P(F|A)与P(A|F)：箭头反向，分母改变。',
      'P(F|A) and P(A|F): reverse the arrow, change the denominator.',
    ),
  };
  return (
    <DataFigure
      mode={mode}
      name={t('计数与条件思考卡', 'Counting and conditioning thought card')}
      caption={captions[kind]}
    >
      <svg
        width="640"
        height="180"
        viewBox="0 0 640 180"
        role="img"
        aria-label={word(mode, captions[kind])}
      >
        <rect x="20" y="25" width="600" height="130" rx="20" fill="#eeeaf7" />
        <text x="320" y="100" textAnchor="middle" fontSize="24" fill="#514784">
          {kind === 'counting-principles'
            ? 'A ∪ B'
            : kind === 'counting-permutations'
              ? 'AB ≠ BA'
              : kind === 'counting-combinations'
                ? '{A,B} = {B,A}'
                : kind === 'counting-binomial'
                  ? '1   4   6   4   1'
                  : kind === 'counting-conditional'
                    ? 'P(A|B) = P(A∩B)/P(B)'
                    : 'P(A|F) ← P(F|A), P(A)'}
        </text>
      </svg>
    </DataFigure>
  );
}
