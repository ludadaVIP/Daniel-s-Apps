import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { readRational } from './rationalModels';
import {
  rational,
  textR,
  negR,
  mulR,
  addR,
  type Rational,
} from './algebraModels';
import {
  sequenceAt,
  prefixExtension,
  arithmeticCases,
  arithmeticCase,
  recoveredTerm,
  arithmeticTerm,
  arithmeticSum,
  geometricTerm,
  geometricTail,
  geometricSum,
  geometricDefinition,
  adjacentRatio,
  differenceR,
  savingsCase,
  savingsCases,
  savingsLedger,
  savingsFormula,
  firstSavingsPeriod,
  moneyText,
  type SequenceCode,
  type RuleCase,
  type DepositTiming,
  type PostingPolicy,
} from './sequenceModels';
import {
  SequencePlot,
  ArithmeticPairFigure,
  GeometricShiftFigure,
  SavingsTimeline,
  type SequenceSeries,
} from './SequenceVisuals';
export type SequenceLabKind = Extract<Lesson['lab'], `sequence-${string}`>;
export const isSequenceLab = (kind: Lesson['lab']): kind is SequenceLabKind =>
  kind.startsWith('sequence-');
const word = (mode: LanguageMode, v: LocalizedText) =>
  mode === 'en' ? v.en : v.zh;
const numeric = (value: Rational, unit?: 'NZD'): AnswerSpec => ({
  kind: 'number',
  value: textR(value),
  unit,
});
const code = (value: SequenceCode): AnswerSpec => ({
  kind: 'sequence-code',
  value,
});
const answerFor = (value: Rational | SequenceCode): AnswerSpec =>
  typeof value === 'string' ? code(value) : numeric(value);
const options = (values: string[]): [string, LocalizedText][] =>
  values.map((v) => [v, t(v, v)]);
function Select({
  mode,
  name,
  value,
  values,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  values: [string, LocalizedText][];
  change: (s: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={word(mode, name)}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {values.map(([v, label]) => (
          <option key={v} value={v}>
            {word(mode, label)}
          </option>
        ))}
      </select>
    </label>
  );
}
function Prediction({
  mode,
  name,
  answer,
  hint,
  solution,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  hint: LocalizedText;
  solution: LocalizedText;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false),
    [show, setShow] = useState(false),
    correct = checkAnswer(input, answer);
  return (
    <div className="math-concept-task">
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={word(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
            setShow(false);
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
              correct
                ? t(
                    '预测符合。请说明序号、规则、前提或存入时点。',
                    'The prediction matches. Explain the index, rule, premises or deposit timing.',
                  )
                : hint
            }
          />
        </p>
      )}
      {checked && !correct && (
        <button className="math-button" onClick={() => setShow(true)}>
          <Text mode={mode} text={t('查看推导', 'Reveal derivation')} />
        </button>
      )}
      {show && (
        <p>
          <Text mode={mode} text={solution} />
        </p>
      )}
    </div>
  );
}
function View({
  mode,
  wide,
  setWide,
  reveal,
  setReveal,
}: {
  mode: LanguageMode;
  wide: boolean;
  setWide: (b: boolean) => void;
  reveal: boolean;
  setReveal: (b: boolean) => void;
}) {
  return (
    <>
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('切换图窗', 'Change window')} />
      </button>
      <button
        className="math-button"
        aria-expanded={reveal}
        onClick={() => setReveal(!reveal)}
      >
        <Text mode={mode} text={t('显示/隐藏核验', 'Show/hide audit')} />
      </button>
    </>
  );
}
const points = (get: (n: number) => Rational, count = 8) =>
  Array.from({ length: count }, (_, i) => ({
    index: i + 1,
    value: get(i + 1),
  }));
function RulesLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<RuleCase>('add'),
    [index, setIndex] = useState('4'),
    [extensions, setExtensions] = useState(false),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    n = Number(index),
    value = sequenceAt(kind, n),
    definitions: Record<RuleCase, LocalizedText> = {
      add: t(
        'a₁=2，aₙ₊₁=aₙ+2，n为正整数。',
        'a₁=2 and aₙ₊₁=aₙ+2 for positive integer n.',
      ),
      square: t('aₙ=n²+1，n为正整数。', 'aₙ=n²+1 for positive integer n.'),
      double: t(
        'a₁=2，aₙ₊₁=2aₙ，n为正整数。',
        'a₁=2 and aₙ₊₁=2aₙ for positive integer n.',
      ),
      observed: t(
        '只观测a₁=2、a₂=4、a₃=6，没有给出后续规则。',
        'Only a₁=2,a₂=4,a₃=6 are observed; no continuation rule is supplied.',
      ),
    },
    series: SequenceSeries[] =
      kind === 'observed'
        ? [
            {
              name: word(mode, t('已知观测', 'Known observations')),
              points: points((k) => rational(BigInt(2 * k)), 3),
            },
            ...(extensions
              ? [
                  { name: '2n', points: points((k) => prefixExtension(k), 6) },
                  {
                    name: '2n+(n−1)(n−2)(n−3)',
                    points: points((k) => prefixExtension(k, true), 6),
                  },
                ]
              : []),
          ]
        : [
            {
              name: word(mode, t('给定完整规则', 'Given complete rule')),
              points: points((k) => sequenceAt(kind, k) as Rational),
            },
          ];
  return (
    <>
      <Select
        mode={mode}
        name={t('信息与规则', 'Information and rule')}
        value={kind}
        change={(v) => setKind(v as RuleCase)}
        values={[
          ['add', t('给定加法递推', 'Given additive recurrence')],
          ['square', t('给定平方通项', 'Given quadratic nth term')],
          ['double', t('给定倍增递推', 'Given doubling recurrence')],
          ['observed', t('只有前三项观测', 'Only three observed terms')],
        ]}
      />
      <p>
        <Text mode={mode} text={definitions[kind]} />
      </p>
      <Select
        mode={mode}
        name={t('所求序号n', 'Requested index n')}
        value={index}
        change={setIndex}
        values={options(['0', '1', '2', '3', '4', '6', '10'])}
      />
      <Prediction
        key={`${kind}/${n}`}
        mode={mode}
        name={t(
          '预测aₙ（信息不足/域外可写代码）',
          'Predict a_n (insufficient/outside-domain if needed)',
        )}
        answer={answerFor(value)}
        hint={t(
          '先核n是否为正整数。完整规则可逐步追踪；只有前三项时，后续可有不同延伸，写insufficient。n=0在本题域外。',
          'First check a positive integer index. Follow the complete rule when given; three observations alone allow different continuations, so use insufficient. Here n=0 is outside-domain.',
        )}
        solution={t(
          `本次：${typeof value === 'string' ? value : textR(value)}。先说明依据是明确规则还是有限观测。`,
          `Result: ${typeof value === 'string' ? value : textR(value)}. Identify whether the evidence is a complete rule or finite observation.`,
        )}
      />
      {kind === 'observed' && (
        <button
          className="math-button"
          aria-pressed={extensions}
          onClick={() => setExtensions(!extensions)}
        >
          <Text
            mode={mode}
            text={t('对照两种可能延伸', 'Compare two possible extensions')}
          />
        </button>
      )}
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SequencePlot
        mode={mode}
        series={series}
        bound={wide ? 100 : 20}
        selected={n}
        reveal={reveal}
        caption={t(
          '序列从n=1开始，a₁是第一项而非第0项。对照延伸只是说明可能性，不替原题选择一个规则；图中点不连成连续函数。',
          'The sequence starts at n=1. The first term is not a zeroth term. Candidate extensions demonstrate possibilities without selecting a rule for the original observations. Points are not joined into a continuous function.',
        )}
      />
    </>
  );
}
function ArithmeticLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<keyof typeof arithmeticCases>('standard'),
    [index, setIndex] = useState('6'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    c = arithmeticCases[kind],
    m = arithmeticCase(kind),
    n = Number(index),
    value = recoveredTerm(m, n),
    series: SequenceSeries[] =
      m.kind === 'unique'
        ? [
            {
              name: 'aₙ',
              points: points((k) => arithmeticTerm(m.first, m.step, k), 10),
            },
          ]
        : [
            {
              name: `a${c.p}`,
              points: [{ index: c.p, value: readRational(c.ap) }],
            },
            {
              name: `a${c.r} (${mode === 'en' ? 'second given' : '第二已知'})`,
              points: [{ index: c.r, value: readRational(c.ar) }],
            },
          ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '已知完整数列应为等差数列。由两个带序号的条件恢复d与a₁；重复序号不提供新间隔。',
            'The complete sequence is required to be arithmetic. Recover d and a₁ from two indexed conditions; repeating an index supplies no new gap.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('已知条件案例', 'Indexed givens case')}
        value={kind}
        change={(v) => setKind(v as typeof kind)}
        values={[
          ['standard', t('两项确定公差', 'Two distinct indexed terms')],
          ['decreasing', t('负公差', 'Negative difference')],
          ['fraction', t('分数公差', 'Fractional difference')],
          ['constant', t('常数数列', 'Constant sequence')],
          ['repeated', t('同一条件重复', 'The same condition repeated')],
          ['conflict', t('同序号矛盾数值', 'Conflicting values at one index')],
        ]}
      />
      <p>
        a{c.p}={c.ap}; a{c.r}={c.ar}
      </p>
      <Select
        mode={mode}
        name={t('所求序号n', 'Requested index n')}
        value={index}
        change={setIndex}
        values={options(['1', '3', '6', '10'])}
      />
      <Prediction
        key={`d/${kind}`}
        mode={mode}
        name={t(
          '预测d（不足/矛盾用代码）',
          'Predict d (insufficient/inconsistent if needed)',
        )}
        answer={m.kind === 'unique' ? numeric(m.step) : code(m.kind)}
        hint={t(
          '两个不同序号相差r−p步，所以d=(aᵣ−aₚ)/(r−p)；同序号不能除0。',
          'Distinct indices are r−p steps apart, so d=(aᵣ−aₚ)/(r−p). Do not divide by zero for repeated indices.',
        )}
        solution={t(
          m.kind === 'unique' ? `d=${textR(m.step)}。` : `条件${m.kind}。`,
          m.kind === 'unique'
            ? `d=${textR(m.step)}.`
            : `The givens are ${m.kind}.`,
        )}
      />
      <Prediction
        key={`first/${kind}`}
        mode={mode}
        name={t(
          '预测a₁（不足/矛盾用代码）',
          'Predict a_1 (insufficient/inconsistent if needed)',
        )}
        answer={m.kind === 'unique' ? numeric(m.first) : code(m.kind)}
        hint={t(
          '从aₚ退回p−1个公差；不能把序号p当成已经走过p步。',
          'Move back p−1 differences from aₚ; index p does not mean p completed steps.',
        )}
        solution={t(
          m.kind === 'unique' ? `a₁=${textR(m.first)}。` : `条件${m.kind}。`,
          m.kind === 'unique'
            ? `a₁=${textR(m.first)}.`
            : `The givens are ${m.kind}.`,
        )}
      />
      <Prediction
        key={`term/${kind}/${n}`}
        mode={mode}
        name={t('预测所求aₙ', 'Predict requested a_n')}
        answer={answerFor(value)}
        hint={t(
          '唯一规则用a₁+(n−1)d；若只有一个有效已知点，该点的值仍可知，但其他项不唯一。',
          'Use a₁+(n−1)d for a unique rule. With only one valid known point that value remains known, while other terms need not be unique.',
        )}
        solution={t(
          `本次：${typeof value === 'string' ? value : textR(value)}。`,
          `Result: ${typeof value === 'string' ? value : textR(value)}.`,
        )}
      />
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SequencePlot
        mode={mode}
        series={series}
        bound={wide ? 100 : 20}
        selected={n}
        reveal={reveal}
        caption={t(
          '改变所求n保留已恢复的d和a₁；条件矛盾时只画原条件，不伪造一条数列。',
          'Changing only n preserves recovered d and a₁. Conflicting givens remain plotted as givens without inventing a sequence.',
        )}
      />
    </>
  );
}
function ArithmeticSumLab({ mode }: { mode: LanguageMode }) {
  const [first, setFirst] = useState('2'),
    [step, setStep] = useState('3'),
    [count, setCount] = useState('5'),
    [paired, setPaired] = useState(false),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    a = readRational(first),
    d = readRational(step),
    n = Number(count),
    last = arithmeticTerm(a, d, n),
    pairTotal = addR(a, last),
    sum = arithmeticSum(a, d, n),
    key = `${first}/${step}/${n}`;
  return (
    <>
      <Select
        mode={mode}
        name={t('首项a₁', 'First term a_1')}
        value={first}
        change={setFirst}
        values={options(['-3', '2', '5'])}
      />
      <Select
        mode={mode}
        name={t('公差d', 'Common difference d')}
        value={step}
        change={setStep}
        values={options(['-2', '0', '1/2', '3'])}
      />
      <Select
        mode={mode}
        name={t('项数n', 'Term count n')}
        value={count}
        change={setCount}
        values={options(['1', '2', '5', '6', '10'])}
      />
      <Prediction
        key={`last/${key}`}
        mode={mode}
        name={t('预测末项aₙ', 'Predict final term a_n')}
        answer={numeric(last)}
        hint={t(
          '末项是a₁+(n−1)d，求和公式用它而不是a₁+nd。',
          'The last term is a₁+(n−1)d, not a₁+nd.',
        )}
        solution={t(`aₙ=${textR(last)}。`, `aₙ=${textR(last)}.`)}
      />
      <Prediction
        key={`pair/${key}`}
        mode={mode}
        name={t('预测一列配对总值', 'Predict one paired-column total')}
        answer={numeric(pairTotal)}
        hint={t(
          '一列来自正序和倒序各一项，总值a₁+aₙ；不是把一行先拆成两半。',
          'One column takes a term from each full copy, totaling a₁+aₙ; do not first split a row in half.',
        )}
        solution={t(
          `每列总值=${textR(pairTotal)}。`,
          `Each column total=${textR(pairTotal)}.`,
        )}
      />
      <Prediction
        key={`sum/${key}`}
        mode={mode}
        name={t('预测Sₙ', 'Predict S_n')}
        answer={numeric(sum)}
        hint={t(
          '两份和2Sₙ=n(a₁+aₙ)，再整体除2；保留负项符号。',
          'Two copies give 2Sₙ=n(a₁+aₙ); halve the whole total, retaining signed terms.',
        )}
        solution={t(`Sₙ=${textR(sum)}。`, `Sₙ=${textR(sum)}.`)}
      />
      <button
        className="math-button"
        aria-pressed={paired}
        onClick={() => setPaired(!paired)}
      >
        <Text
          mode={mode}
          text={t('切换倒序配对', 'Toggle reverse-copy pairing')}
        />
      </button>
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <ArithmeticPairFigure
        mode={mode}
        first={a}
        step={d}
        n={n}
        paired={paired}
        reveal={reveal}
      />
      <SequencePlot
        mode={mode}
        series={[
          { name: 'aₙ', points: points((k) => arithmeticTerm(a, d, k), n) },
        ]}
        bound={wide ? 100 : 20}
        reveal={reveal}
        selected={n}
        caption={t(
          '卡片表示带符号的项值，不把负数画成负面积。Sₙ是前n项之和，不是末项，也不是平均数。',
          'Cards represent signed term values, not negative areas. Sₙ is the sum of n terms, not the last term or their average.',
        )}
      />
    </>
  );
}
function GeometricLab({ mode }: { mode: LanguageMode }) {
  const [first, setFirst] = useState('3'),
    [ratio, setRatio] = useState('-2'),
    [index, setIndex] = useState('4'),
    [magnitude, setMagnitude] = useState(false),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    a = readRational(first),
    q = readRational(ratio),
    n = Number(index),
    value = geometricTerm(a, q, n),
    r = adjacentRatio(a, q, n),
    valid = geometricDefinition(a, q),
    series: SequenceSeries[] = [
      { name: 'aₙ', points: points((k) => geometricTerm(a, q, k), 10) },
      ...(magnitude
        ? [
            {
              name: '|aₙ|',
              points: points((k) => {
                const v = geometricTerm(a, q, k);
                return v[0] < 0n ? negR(v) : v;
              }, 10),
            },
          ]
        : []),
    ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '本单元等比定义要求各项非零、相邻比值为同一非零q。零倍递推仍可计算，但不满足这个定义。',
            'This unit’s geometric definition requires every term and the common adjacent ratio to be nonzero. A zero multiplier recurrence remains computable but fails that definition.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('首项a₁', 'First term a_1')}
        value={first}
        change={setFirst}
        values={options(['-2', '0', '3', '5'])}
      />
      <Select
        mode={mode}
        name={t('倍率q', 'Multiplier q')}
        value={ratio}
        change={setRatio}
        values={options(['-2', '-1', '0', '1/2', '1', '2'])}
      />
      <Select
        mode={mode}
        name={t('所求序号n', 'Requested index n')}
        value={index}
        change={setIndex}
        values={options(['1', '2', '4', '6', '10'])}
      />
      <Prediction
        key={`term/${first}/${ratio}/${n}`}
        mode={mode}
        name={t('预测aₙ', 'Predict a_n')}
        answer={numeric(value)}
        hint={t(
          '从第一项到第n项乘n−1次q，负q交替变号。n=1直接取首项。',
          'From term one to n multiply by q exactly n−1 times. A negative q alternates signs; n=1 is the initial term.',
        )}
        solution={t(`aₙ=${textR(value)}。`, `aₙ=${textR(value)}.`)}
      />
      <Prediction
        key={`ratio/${first}/${ratio}/${n}`}
        mode={mode}
        name={t(
          '预测aₙ₊₁/aₙ（零分母写undefined）',
          'Predict a_(n+1)/a_n (zero denominator: undefined)',
        )}
        answer={r === null ? code('undefined') : numeric(r)}
        hint={t(
          '只有分母aₙ非零才能取比；0/0不是0或任意给定倍率。',
          'An adjacent ratio requires nonzero denominator aₙ. Zero divided by zero is not zero or an arbitrarily supplied multiplier.',
        )}
        solution={t(
          r === null ? '分母为零：undefined。' : `本比值=${textR(r)}。`,
          r === null
            ? 'Zero denominator: undefined.'
            : `This ratio=${textR(r)}.`,
        )}
      />
      <Prediction
        key={`definition/${first}/${ratio}`}
        mode={mode}
        name={t(
          '预测是否符合等比定义',
          'Predict geometric status (geometric/not-geometric)',
        )}
        answer={code(valid ? 'geometric' : 'not-geometric')}
        hint={t(
          '核首项和q都非零；非零常数数列q=1也满足等比。',
          'Check that both initial term and q are nonzero. A nonzero constant with q=1 is geometric too.',
        )}
        solution={t(
          `本组${valid ? '符合' : '不符合'}本单元等比定义。`,
          `This recurrence ${valid ? 'meets' : 'does not meet'} the unit’s geometric definition.`,
        )}
      />
      <button
        className="math-button"
        aria-pressed={magnitude}
        onClick={() => setMagnitude(!magnitude)}
      >
        <Text mode={mode} text={t('对照绝对值点', 'Compare magnitude dots')} />
      </button>
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SequencePlot
        mode={mode}
        series={series}
        bound={wide ? 10000 : 100}
        selected={n}
        reveal={reveal}
        caption={t(
          '倍率符号、绝对值和首项符号各有作用。正q不保证数列递增；零分母时保留无定义，不补出一个比值。',
          'The multiplier sign, magnitude and first-term sign have separate roles. Positive q does not guarantee increase. A zero denominator remains undefined rather than receiving a fabricated ratio.',
        )}
      />
    </>
  );
}
function GeometricSumLab({ mode }: { mode: LanguageMode }) {
  const [first, setFirst] = useState('3'),
    [ratio, setRatio] = useState('2'),
    [count, setCount] = useState('4'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    a = readRational(first),
    q = readRational(ratio),
    n = Number(count),
    sum = geometricSum(a, q, n),
    tail = geometricTail(a, q, n),
    identity = mulR(differenceR(rational(1n), q), sum),
    key = `${first}/${ratio}/${n}`;
  return (
    <>
      <Select
        mode={mode}
        name={t('首项a₁', 'First term a_1')}
        value={first}
        change={setFirst}
        values={options(['0', '1', '3', '4', '5'])}
      />
      <Select
        mode={mode}
        name={t('倍率q', 'Multiplier q')}
        value={ratio}
        change={setRatio}
        values={options(['-1', '0', '1/2', '1', '2'])}
      />
      <Select
        mode={mode}
        name={t('项数n', 'Term count n')}
        value={count}
        change={setCount}
        values={options(['1', '2', '4', '5', '6'])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '有限和只有n项。q=1直接用na₁；q=0时计算乘法递推的有限和，另保留非零比值定义的限制。',
            'A finite sum contains n terms. At q=1 use na₁ directly. At q=0 the multiplicative recurrence still has a finite sum, separate from the nonzero-ratio definition.',
          )}
        />
      </p>
      <Prediction
        key={`sum/${key}`}
        mode={mode}
        name={t('预测Sₙ', 'Predict S_n')}
        answer={numeric(sum)}
        hint={t(
          'q≠1用a₁(1−qⁿ)/(1−q)；q=1用na₁，不能把0/0当成0。',
          'For q≠1 use a₁(1−qⁿ)/(1−q); for q=1 use na₁. Zero divided by zero is not zero.',
        )}
        solution={t(`Sₙ=${textR(sum)}。`, `Sₙ=${textR(sum)}.`)}
      />
      <Prediction
        key={`tail/${key}`}
        mode={mode}
        name={t('预测错位后的尾项a₁qⁿ', 'Predict shifted tail a_1 q^n')}
        answer={numeric(tail)}
        hint={t(
          '原和末项是a₁qⁿ⁻¹，再乘q后才出现a₁qⁿ，不能漏掉它。',
          'The original last term is a₁q^(n−1); multiplying by q creates tail a₁q^n. Do not omit it.',
        )}
        solution={t(`尾项=${textR(tail)}。`, `Tail=${textR(tail)}.`)}
      />
      <Prediction
        key={`identity/${key}`}
        mode={mode}
        name={t('预测(1−q)Sₙ', 'Predict (1−q)S_n')}
        answer={numeric(identity)}
        hint={t(
          '它等于a₁−a₁qⁿ；q=1时只给0=0，不足以反推出Sₙ。',
          'This equals a₁−a₁qⁿ. At q=1 the identity 0=0 does not recover Sₙ.',
        )}
        solution={t(
          `(1−q)Sₙ=${textR(identity)}。`,
          `(1−q)Sₙ=${textR(identity)}.`,
        )}
      />
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <GeometricShiftFigure
        mode={mode}
        first={a}
        ratio={q}
        n={n}
        reveal={reveal}
      />
      <SequencePlot
        mode={mode}
        series={[
          { name: 'aₙ', points: points((k) => geometricTerm(a, q, k), n) },
        ]}
        bound={wide ? 1000 : 100}
        reveal={reveal}
        selected={n}
        caption={t(
          '只累加指定的有限n项；图窗变大不会增加项数，也不会把有限和替换成无穷和。',
          'Only the specified n terms are summed. Enlarging a window neither adds terms nor replaces a finite sum by an infinite one.',
        )}
      />
    </>
  );
}
function SavingsLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<keyof typeof savingsCases>('standard'),
    [timing, setTiming] = useState<DepositTiming>('end'),
    [policy, setPolicy] = useState<PostingPolicy>('ideal'),
    [count, setCount] = useState('2'),
    [compare, setCompare] = useState(false),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    n = Number(count),
    config = savingsCase(kind, timing, policy),
    ledger = savingsLedger(config, n),
    window = savingsLedger(config, 6),
    target = readRational(savingsCases[kind].target),
    hit = firstSavingsPeriod(config, target, 6),
    effectiveTiming = config.deposit[0] === 0n ? 'none' : timing,
    key = `${kind}/${effectiveTiming}/${policy}`,
    balanceKey = n === 0 ? textR(config.initial) : `${key}/${n}`,
    other = savingsLedger(
      { ...config, timing: timing === 'end' ? 'start' : 'end' },
      6,
    ),
    series: SequenceSeries[] = [
      {
        name: word(mode, t('当前模型Bₖ', 'Current Bₖ')),
        points: [
          { index: 0, value: config.initial },
          ...window.rows.map((r) => ({ index: r.period, value: r.closing })),
        ],
      },
      ...(compare
        ? [
            {
              name: word(mode, t('另一存入时点', 'Other deposit timing')),
              points: [
                { index: 0, value: config.initial },
                ...other.rows.map((r) => ({
                  index: r.period,
                  value: r.closing,
                })),
              ],
            },
          ]
        : []),
    ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构学习模型，以“期”为单位，不代表现实账户利率；不计税费。B₀是第一期所有操作之前的余额，每期只存一次。理想模型保留精确值，逐期入账模型在每期增长后的余额上按分四舍五入。',
            'This fictional learning model uses periods, not a real account rate, with no taxes or fees. B₀ precedes all first-period actions; one recurring deposit occurs each period. The ideal model retains exact values; the posting model rounds each grown balance to cents.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('储蓄案例', 'Savings case')}
        value={kind}
        change={(v) => setKind(v as typeof kind)}
        values={[
          [
            'standard',
            t(
              '100起存，每期存10，倍率1.1',
              'Start 100, deposit 10, multiplier 1.1',
            ),
          ],
          [
            'tiny',
            t(
              '0.05起存、不加存，观察舍入',
              'Start 0.05, no deposits: inspect rounding',
            ),
          ],
          ['zeroRate', t('倍率1，不计增长', 'Multiplier 1, no growth')],
          [
            'beyond',
            t(
              '不加存，6期窗内尚未达标',
              'No deposits: target beyond six periods',
            ),
          ],
          ['already', t('开始时已达到目标', 'Target already met initially')],
        ]}
      />
      <Select
        mode={mode}
        name={t('存入时点', 'Deposit timing')}
        value={timing}
        change={(v) => setTiming(v as DepositTiming)}
        values={[
          ['end', t('每期期末', 'End of each period')],
          ['start', t('每期期初', 'Start of each period')],
        ]}
      />
      <Select
        mode={mode}
        name={t('入账规则', 'Posting policy')}
        value={policy}
        change={(v) => setPolicy(v as PostingPolicy)}
        values={[
          ['ideal', t('理想模型：不逐期舍入', 'Ideal: no per-period rounding')],
          ['cents', t('逐期按分四舍五入', 'Round to cents each period')],
        ]}
      />
      <Select
        mode={mode}
        name={t('经过期数n', 'Elapsed period count n')}
        value={count}
        change={setCount}
        values={options(['0', '1', '2', '3', '5', '6'])}
      />
      <p>
        B₀={textR(config.initial)} NZD; c={textR(config.deposit)} NZD; q=
        {textR(config.multiplier)}.{' '}
        <Text
          mode={mode}
          text={t(
            `目标${textR(target)} NZD，只查0至6期。`,
            `Target ${textR(target)} NZD, checking only periods 0–6.`,
          )}
        />
      </p>
      <Prediction
        key={`balance/${balanceKey}`}
        mode={mode}
        name={t('预测Bₙ（NZD）', 'Predict B_n (NZD)')}
        answer={numeric(ledger.balance, 'NZD')}
        hint={t(
          '期末存用Bₖ=qBₖ₋₁+c；期初存用Bₖ=q(Bₖ₋₁+c)。先核本题是否逐期按分入账，不能只把最后结果舍入。',
          'Use Bₖ=qBₖ₋₁+c for end deposits, or q(Bₖ₋₁+c) for start deposits. Check whether every period is rounded, rather than rounding only the final ideal result.',
        )}
        solution={t(
          `本模型Bₙ=${textR(ledger.balance)} NZD；显示为${moneyText(ledger.balance)}。`,
          `Here Bₙ=${textR(ledger.balance)} NZD; displayed as ${moneyText(ledger.balance)}.`,
        )}
      />
      <Prediction
        key={`contribution/${textR(config.initial)}/${textR(config.deposit)}/${n}`}
        mode={mode}
        name={t(
          '预测累计投入（含起存额，NZD）',
          'Predict contributions including initial balance (NZD)',
        )}
        answer={numeric(ledger.contributed, 'NZD')}
        hint={t(
          '累计投入=B₀+nc，不把增长所得算作投入；第0期没有定期加存。',
          'Contributions=B₀+nc, excluding growth. Period zero has no recurring deposit.',
        )}
        solution={t(
          `投入=${textR(ledger.contributed)} NZD。`,
          `Contributions=${textR(ledger.contributed)} NZD.`,
        )}
      />
      <Prediction
        key={`hit/${key}`}
        mode={mode}
        name={t(
          '预测0至6期内首次达标期（否则not-reached）',
          'Predict first target period within 0–6 (otherwise not-reached)',
        )}
        answer={
          hit.kind === 'reached'
            ? numeric(rational(BigInt(hit.period)))
            : code('not-reached')
        }
        hint={t(
          '从B₀开始逐期核对，首次≥目标还要检查前一期。窗内未达标不等于永远无法达标。',
          'Check from B₀ onward; the first balance at least the target must have its predecessor checked. Not reached within the window does not mean never reached.',
        )}
        solution={t(
          hit.kind === 'reached'
            ? `首次第${hit.period}期，余额${textR(hit.balance)}。`
            : '0至6期内未达到，写not-reached。',
          hit.kind === 'reached'
            ? `First reached at period ${hit.period}, balance ${textR(hit.balance)}.`
            : 'Not reached within 0–6: not-reached.',
        )}
      />
      <button
        className="math-button"
        aria-pressed={compare}
        onClick={() => setCompare(!compare)}
      >
        <Text
          mode={mode}
          text={t('对照另一存入时点', 'Compare other deposit timing')}
        />
      </button>
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SavingsTimeline
        mode={mode}
        config={config}
        period={n}
        row={reveal && n > 0 ? ledger.rows[n - 1] : undefined}
      />
      <SequencePlot
        mode={mode}
        series={series}
        bound={kind === 'tiny' ? (wide ? 0.2 : 0.1) : wide ? 2000 : 500}
        target={target}
        nonnegative
        selected={n}
        reveal={reveal}
        caption={t(
          '仅画每期期末及开始时的离散余额，不在期间插值找“首次整期”。≈表示显示金额四舍五入，不等于账户已按分入账。',
          'Only initial and period-end balances are plotted; do not interpolate a fractional first period. ≈ marks a rounded display, not a claim that the account posted that rounded amount.',
        )}
      />
      {reveal && (
        <div
          className="math-concept-table"
          role="region"
          tabIndex={0}
          aria-label={mode === 'en' ? 'Savings posting ledger' : '储蓄入账流水'}
        >
          <table>
            <thead>
              <tr>
                <th>k</th>
                <th>
                  <Text mode={mode} text={t('期初余额', 'Opening')} />
                </th>
                <th>
                  <Text mode={mode} text={t('先存', 'Deposit before')} />
                </th>
                <th>
                  <Text mode={mode} text={t('入账增长额', 'Posted gain')} />
                </th>
                <th>
                  <Text mode={mode} text={t('后存', 'Deposit after')} />
                </th>
                <th>
                  <Text mode={mode} text={t('精确期末', 'Exact closing')} />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>{textR(config.initial)}</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>{textR(config.initial)}</td>
              </tr>
              {ledger.rows.map((r) => (
                <tr key={r.period}>
                  <td>{r.period}</td>
                  <td>{textR(r.opening)}</td>
                  <td>{textR(r.before)}</td>
                  <td>{textR(r.interest)}</td>
                  <td>{textR(r.after)}</td>
                  <td>
                    {textR(r.closing)} ({moneyText(r.closing)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <Text
              mode={mode}
              text={
                policy === 'ideal'
                  ? t(
                      `理想闭式核验=${textR(savingsFormula(config, n))} NZD；增长所得=${textR(ledger.gain)} NZD。`,
                      `Ideal closed-form audit=${textR(savingsFormula(config, n))} NZD; gain=${textR(ledger.gain)} NZD.`,
                    )
                  : t(
                      `逐期入账，不能直接用无舍入闭式代替。增长所得=${textR(ledger.gain)} NZD。`,
                      `Per-period posting cannot be replaced directly by the unrounded closed form. Gain=${textR(ledger.gain)} NZD.`,
                    )
              }
            />
          </p>
        </div>
      )}
    </>
  );
}
export function SequenceLab({
  kind,
  mode,
}: {
  kind: SequenceLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'sequence-rules' ? (
        <RulesLab mode={mode} />
      ) : kind === 'sequence-arithmetic' ? (
        <ArithmeticLab mode={mode} />
      ) : kind === 'sequence-arithmetic-sum' ? (
        <ArithmeticSumLab mode={mode} />
      ) : kind === 'sequence-geometric' ? (
        <GeometricLab mode={mode} />
      ) : kind === 'sequence-geometric-sum' ? (
        <GeometricSumLab mode={mode} />
      ) : (
        <SavingsLab mode={mode} />
      )}
    </div>
  );
}
export function SequenceHookArt({
  kind,
  mode,
}: {
  kind: SequenceLabKind;
  mode: LanguageMode;
}) {
  if (kind === 'sequence-arithmetic-sum')
    return (
      <ArithmeticPairFigure
        mode={mode}
        first={rational(2n)}
        step={rational(3n)}
        n={5}
        paired
        reveal={false}
      />
    );
  if (kind === 'sequence-geometric-sum')
    return (
      <GeometricShiftFigure
        mode={mode}
        first={rational(3n)}
        ratio={rational(2n)}
        n={4}
        reveal={false}
      />
    );
  if (kind === 'sequence-savings')
    return (
      <SavingsTimeline
        mode={mode}
        config={savingsCase('standard', 'start')}
        period={1}
      />
    );
  const series: SequenceSeries[] =
    kind === 'sequence-rules'
      ? [
          {
            name: word(mode, t('仅前三项观测', 'Only three observed terms')),
            points: points((n) => rational(BigInt(2 * n)), 3),
          },
        ]
      : kind === 'sequence-arithmetic'
        ? [
            {
              name: word(mode, t('已知a₂、a₅', 'Known a₂ and a₅')),
              points: [
                { index: 2, value: rational(8n) },
                { index: 5, value: rational(17n) },
              ],
            },
          ]
        : [
            {
              name: 'aₙ=3(−2)ⁿ⁻¹',
              points: points(
                (n) => geometricTerm(rational(3n), rational(-2n), n),
                5,
              ),
            },
          ];
  return (
    <SequencePlot
      mode={mode}
      series={series}
      bound={kind === 'sequence-geometric' ? 100 : 20}
      caption={t(
        '先区分已知项、完整规则、项值与前n项之和。整数序号之间没有自动补出的数列项。',
        'Separate known observations, a complete rule, an individual term and a partial sum. No sequence terms are automatically inserted between integer indices.',
      )}
    />
  );
}
