import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { textR, mulR, negR, rational } from './algebraModels';
import { DataTable } from './DataModellingVisuals';
import { ComplexPlot, PowersOfIFigure } from './ComplexVisuals';
import {
  complex,
  complexText,
  complexZero,
  realOrNonreal,
  pureImaginary,
  conjugateComplex,
  squareModulus,
  modulusComplex,
  squareEquationRoots,
  complexSetText,
  powerI,
  applyComplexOperation,
  complexOperands,
  complexPartners,
  subtractComplex,
  transformComplex,
  isZeroComplex,
  type Complex,
  type ComplexCode,
  type ComplexOperation,
  type ComplexTransform,
} from './complexModels';
export type ComplexLabKind = Extract<Lesson['lab'], `complex-${string}`>;
export const isComplexLab = (kind: Lesson['lab']): kind is ComplexLabKind =>
  kind.startsWith('complex-');
const word = (mode: LanguageMode, v: LocalizedText) =>
  mode === 'en' ? v.en : v.zh;
const N = (value: string): AnswerSpec => ({ kind: 'number', value });
const C = (value: ComplexCode): AnswerSpec => ({ kind: 'complex-code', value });
const Z = (value: Complex): AnswerSpec => ({
  kind: 'complex',
  value: complexText(value),
  standard: true,
});
const rootsSpec = (roots: Complex[]): AnswerSpec => ({
  kind: 'complex-set',
  value: complexSetText(roots),
  values: roots.map(complexText),
});
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
  derivation,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  hint: LocalizedText;
  derivation: LocalizedText;
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
                    '预测符合。再用i²=−1、两部分、距离或旋转中心解释。',
                    'The prediction matches. Explain it using i²=−1, components, distance or the rotation centre.',
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
          <Text mode={mode} text={derivation} />
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
  setWide: (v: boolean) => void;
  reveal: boolean;
  setReveal: (v: boolean) => void;
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
function RootsLab({ mode }: { mode: LanguageMode }) {
  const [rhs, setRhs] = useState('-4'),
    [domain, setDomain] = useState<'real' | 'complex'>('complex'),
    [exponent, setExponent] = useState('7'),
    [reveal, setReveal] = useState(false),
    [wide, setWide] = useState(false),
    roots = squareEquationRoots(Number(rhs), domain),
    reset = (fn: (s: string) => void) => (v: string) => {
      fn(v);
      setReveal(false);
    };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先声明数域。实数的平方非负，不是只因表中几个例子如此；引入i满足i²=−1，运算仍遵守分配律。i是选定的一个数，方程z²=−1在复数域有i与−i两个根。',
            'State the domain. Every real square is nonnegative, not merely the few examples in this table. Introduce i with i²=−1 while retaining distributive arithmetic. i denotes one chosen number; z²=−1 has both i and −i as complex roots.',
          )}
        />
      </p>
      <DataTable
        mode={mode}
        headers={[t('实数x（例子）', 'Real x (examples)'), t('x²', 'x²')]}
        rows={[-3, -2, -1, 0, 1, 2, 3].map((x) => [x, x * x])}
      />
      <Select
        mode={mode}
        name={t('方程右端r：z²=r', 'Equation RHS r: z²=r')}
        value={rhs}
        values={options(['-9', '-4', '-1', '0', '1', '4', '9'])}
        change={reset(setRhs)}
      />
      <Select
        mode={mode}
        name={t('允许的数域', 'Allowed number domain')}
        value={domain}
        values={[
          ['real', t('实数域', 'Real numbers')],
          ['complex', t('复数域', 'Complex numbers')],
        ]}
        change={reset((v) => setDomain(v as 'real' | 'complex'))}
      />
      <Prediction
        key={`${rhs}/${domain}`}
        mode={mode}
        name={t('预测全部根（无解写∅）', 'Predict all roots (∅ if none)')}
        answer={rootsSpec(roots)}
        hint={t(
          '检查当前数域并代回平方；非零的两个相反根都须写，不能只给一个主平方根。',
          'Check the stated domain and square each candidate. Include both opposite nonzero roots, not only a principal square root.',
        )}
        derivation={t(
          `本数域完整解集${complexSetText(roots)}；0只算一个根。`,
          `The full root set in this domain is ${complexSetText(roots)}; zero is one distinct root.`,
        )}
      />
      <Select
        mode={mode}
        name={t('i的整数指数n', 'Integer exponent n for i')}
        value={exponent}
        values={options(['0', '1', '2', '3', '4', '7', '10', '12'])}
        change={reset(setExponent)}
      />
      <Prediction
        key={exponent}
        mode={mode}
        name={t('预测iⁿ的化简值', 'Predict the simplified value of i^n')}
        answer={Z(powerI(Number(exponent)))}
        hint={t(
          '循环为1,i,−1,−i；i⁰=1，按n除4的余数定位，答案须完成化简。',
          'Use the cycle 1,i,−1,−i, starting with i⁰=1. Reduce the index modulo four and finish simplifying.',
        )}
        derivation={t(
          `n=${exponent}，余数${Number(exponent) % 4}，结果${complexText(powerI(Number(exponent)))}。`,
          `n=${exponent}, remainder ${Number(exponent) % 4}, giving ${complexText(powerI(Number(exponent)))}.`,
        )}
      />
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <PowersOfIFigure
        mode={mode}
        exponent={reveal ? Number(exponent) : undefined}
      />
      {reveal && (
        <ComplexPlot
          mode={mode}
          wide={wide}
          reveal
          points={roots.map((z, i) => ({ name: `z${i + 1}`, position: z }))}
          caption={t(
            `只画${domain === 'real' ? '实数' : '复数'}域内的解，空图表示当前域无解，不表示更大数域也无解。`,
            `Only solutions in the ${domain === 'real' ? 'real' : 'complex'} domain are shown. An empty plot says nothing about a larger domain.`,
          )}
        />
      )}
    </>
  );
}
function ComponentsLab({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState('3'),
    [b, setB] = useState('-2'),
    [projections, setProjections] = useState(false),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    z = complex(a, b),
    real = complex(a, '0'),
    imaginary = complex('0', b),
    reset = (fn: (v: string) => void) => (v: string) => {
      fn(v);
      setReveal(false);
    };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            'z=a+bi中的a与b均为实数，虚部是系数b，不是bi。复数对应点(a,b)，实轴与虚轴的坐标刻度都是实数。这里纯虚数指a=0且b≠0，0属于实数。',
            'Both a and b in z=a+bi are real numbers. The imaginary part is coefficient b, not the term bi. The point is (a,b), with real coordinate values on both axes. Here purely imaginary means a=0 and b≠0; zero is real.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('实系数a', 'Real coefficient a')}
        value={a}
        values={options(['-3', '0', '1/2', '1', '3'])}
        change={reset(setA)}
      />
      <Select
        mode={mode}
        name={t('虚部系数b', 'Imaginary coefficient b')}
        value={b}
        values={options(['-4', '-2', '0', '1/2', '2', '4'])}
        change={reset(setB)}
      />
      <p>z={complexText(z)}</p>
      <Prediction
        key={`re/${a}`}
        mode={mode}
        name={t('预测Re(z)', 'Predict Re(z)')}
        answer={N(textR(z[0]))}
        hint={t(
          '读不带i的实系数；只改变b不改变实部。',
          'Read the real coefficient; changing b alone does not change the real part.',
        )}
        derivation={t(`Re(z)=${textR(z[0])}。`, `Re(z)=${textR(z[0])}.`)}
      />
      <Prediction
        key={`im/${b}`}
        mode={mode}
        name={t('预测Im(z)（不是bi）', 'Predict Im(z), not bi')}
        answer={N(textR(z[1]))}
        hint={t(
          '虚部是实数b，不附i；负号与分数保留。',
          'The imaginary part is the real number b, without i. Retain signs and fractions.',
        )}
        derivation={t(
          `Im(z)=${textR(z[1])}，虚数项为${complexText(imaginary)}。`,
          `Im(z)=${textR(z[1])}; the imaginary term is ${complexText(imaginary)}.`,
        )}
      />
      <Prediction
        key={`class/${b}`}
        mode={mode}
        name={t('预测real或nonreal', 'Predict real or nonreal')}
        answer={C(realOrNonreal(z))}
        hint={t(
          '虚部b为0时是实数，包括0；实部为0不够判断是实数。',
          'A zero imaginary coefficient makes the number real, including zero. A zero real part alone does not.',
        )}
        derivation={t(
          `b=${textR(z[1])}，所以${realOrNonreal(z)}。`,
          `b=${textR(z[1])}, so ${realOrNonreal(z)}.`,
        )}
      />
      <Prediction
        key={`pure/${a}/${b}`}
        mode={mode}
        name={t(
          '预测pure-imaginary或not-pure-imaginary',
          'Predict pure-imaginary or not-pure-imaginary',
        )}
        answer={C(pureImaginary(z))}
        hint={t(
          '本单元要求实部0且虚部非0，零不算纯虚数。',
          'Here the real part must be zero and the imaginary part nonzero; zero is excluded.',
        )}
        derivation={t(
          `本定义下为${pureImaginary(z)}。`,
          `Under this definition: ${pureImaginary(z)}.`,
        )}
      />
      <button
        className="math-button"
        aria-pressed={projections}
        onClick={() => setProjections(!projections)}
      >
        <Text
          mode={mode}
          text={t('显示/隐藏分量投影', 'Show/hide component projections')}
        />
      </button>
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <ComplexPlot
        mode={mode}
        wide={wide}
        reveal={reveal}
        points={[{ name: 'z', position: z }]}
        arrows={[{ name: 'Oz', tail: complexZero(), value: z }]}
        segments={
          projections
            ? [
                { a: z, b: real },
                { a: z, b: imaginary },
              ]
            : []
        }
        caption={t(
          '横坐标读实部，纵坐标读虚部系数。表示数的原点箭头与自由平移的几何箭头要区分；图窗或投影不改变z。',
          'Read Re horizontally and the imaginary coefficient vertically. Distinguish the origin-based representation of a number from a freely translated geometric arrow. The window or projections do not change z.',
        )}
      />
    </>
  );
}
function OperationsLab({ mode }: { mode: LanguageMode }) {
  const [ui, setUi] = useState('0'),
    [vi, setVi] = useState('0'),
    [op, setOp] = useState<ComplexOperation>('multiply'),
    [wide, setWide] = useState(true),
    [reveal, setReveal] = useState(false),
    u = complexOperands[Number(ui)]!,
    v = complexPartners[Number(vi)]!,
    result = applyComplexOperation(u, v, op),
    reset = (fn: (s: string) => void) => (s: string) => {
      fn(s);
      setReveal(false);
    },
    symbol = op === 'add' ? '+' : op === 'subtract' ? '−' : '×',
    crossReal = negR(mulR(u[1], v[1])),
    points = [
      { name: 'u', position: u },
      { name: 'v', position: v },
      ...(reveal
        ? [
            {
              name: op === 'add' ? 'u+v' : op === 'subtract' ? 'u−v' : 'uv',
              position: result,
            },
          ]
        : []),
    ],
    arrows = [
      { name: 'Ou', tail: complexZero(), value: u },
      { name: 'Ov', tail: complexZero(), value: v },
      ...(reveal
        ? [{ name: 'result', tail: complexZero(), value: result }]
        : []),
      ...(reveal && op === 'add'
        ? [{ name: 'v from u', tail: u, value: v }]
        : reveal && op === 'subtract'
          ? [{ name: 'u−v from v', tail: v, value: result }]
          : []),
    ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '加减分别合并实部与虚部，减法作用于整个括号。乘法保留四个分配项，最后用i²=−1；复数不只按分量相乘。答案须化成a+bi或单独实数/虚数项。',
            'Add or subtract the two components, subtracting the entire bracket. Multiplication distributes into four terms, then uses i²=−1; it is not componentwise multiplication. Finish in a+bi form or a single real/imaginary term.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('第一个复数u', 'First complex number u')}
        value={ui}
        values={complexOperands.map((z, i) => [
          String(i),
          t(complexText(z), complexText(z)),
        ])}
        change={reset(setUi)}
      />
      <Select
        mode={mode}
        name={t('第二个复数v', 'Second complex number v')}
        value={vi}
        values={complexPartners.map((z, i) => [
          String(i),
          t(complexText(z), complexText(z)),
        ])}
        change={reset(setVi)}
      />
      <Select
        mode={mode}
        name={t('运算', 'Operation')}
        value={op}
        values={[
          ['add', t('加法u+v', 'Add u+v')],
          ['subtract', t('减法u−v', 'Subtract u−v')],
          ['multiply', t('乘法uv', 'Multiply uv')],
        ]}
        change={reset((s) => setOp(s as ComplexOperation))}
      />
      <p>
        ({complexText(u)}) {symbol} ({complexText(v)})
      </p>
      <Prediction
        key={`${ui}/${vi}/${op}`}
        mode={mode}
        name={t('预测化简后的结果', 'Predict the simplified result')}
        answer={Z(result)}
        hint={t(
          '先按运算处理符号与全部项，i²要换成−1；仅重写原乘积还未完成化简。',
          'Apply signs to all required terms, replace i² by −1 and collect. Merely rewriting the original product does not finish simplification.',
        )}
        derivation={t(
          `结果${complexText(result)}；实部${textR(result[0])}，虚部${textR(result[1])}。`,
          `The result is ${complexText(result)}, with real part ${textR(result[0])} and imaginary part ${textR(result[1])}.`,
        )}
      />
      {op === 'multiply' && (
        <Prediction
          key={`cross/${textR(u[1])}/${textR(v[1])}`}
          mode={mode}
          name={t(
            '预测两虚数项乘积的实贡献',
            'Predict the real contribution from imaginary-term multiplication',
          )}
          answer={N(textR(crossReal))}
          hint={t(
            'bi×di=bd i²=−bd；不要漏掉i²的负号。',
            'bi×di=bd i²=−bd. Include the minus from i².',
          )}
          derivation={t(
            `−(${textR(u[1])})×(${textR(v[1])})=${textR(crossReal)}。`,
            `−(${textR(u[1])})×(${textR(v[1])})=${textR(crossReal)}.`,
          )}
        />
      )}
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      {reveal && op === 'multiply' && (
        <DataTable
          mode={mode}
          headers={[
            t('分配项', 'Distributed term'),
            t('确切值', 'Exact value'),
          ]}
          rows={[
            ['ac', textR(mulR(u[0], v[0]))],
            ['a·di', complexText([rational(0n), mulR(u[0], v[1])])],
            ['bi·c', complexText([rational(0n), mulR(u[1], v[0])])],
            ['bi·di = −bd', textR(crossReal)],
          ]}
        />
      )}
      <ComplexPlot
        mode={mode}
        wide={wide}
        reveal={reveal}
        points={points}
        arrows={arrows}
        caption={t(
          '表中带符号项表示数值，不用负面积解释。加法把第二箭头接到第一箭头末端；差u−v从v端指向u端；乘积按复数乘法决定。',
          'Signed table entries are numerical contributions, not negative areas. Addition places the second arrow at the first head; u−v points from v to u. Products follow complex multiplication.',
        )}
      />
    </>
  );
}
function ConjugateLab({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState('3'),
    [b, setB] = useState('-4'),
    [reflection, setReflection] = useState(false),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    z = complex(a, b),
    bar = conjugateComplex(z),
    norm = squareModulus(z),
    reset = (fn: (s: string) => void) => (s: string) => {
      fn(s);
      setReveal(false);
    },
    points = [
      { name: 'z', position: z },
      ...(reflection ? [{ name: 'conj(z)', position: bar }] : []),
    ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '共轭只改变虚部符号，不是把整个数取负。z·conj(z)=a²+b²为实数，模|z|是其非负平方根；|z|²与|z|必须分开。零的模为0，共轭也为0，但零箭头没有方向。',
            'Conjugation changes only the imaginary sign, not the whole number. z·conj(z)=a²+b² is real, and |z| is its nonnegative square root. Keep |z|² separate from |z|. Zero has modulus and conjugate zero but no arrow direction.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('实部a', 'Real part a')}
        value={a}
        values={options(['-3', '0', '1', '3'])}
        change={reset(setA)}
      />
      <Select
        mode={mode}
        name={t('虚部b', 'Imaginary part b')}
        value={b}
        values={options(['-4', '0', '1', '4'])}
        change={reset(setB)}
      />
      <p>z={complexText(z)}</p>
      <Prediction
        key={`conj/${a}/${b}`}
        mode={mode}
        name={t('预测共轭的化简式', 'Predict the simplified conjugate')}
        answer={Z(bar)}
        hint={t(
          '实部保持，虚部系数变成相反数；与−z区分。',
          'Retain the real part and negate the imaginary coefficient; distinguish this from −z.',
        )}
        derivation={t(
          `conj(z)=${complexText(bar)}。`,
          `conj(z)=${complexText(bar)}.`,
        )}
      />
      <Prediction
        key={`square/${textR(norm)}`}
        mode={mode}
        name={t('预测|z|²', 'Predict |z|²')}
        answer={N(textR(norm))}
        hint={t(
          '实部和虚部系数分别平方后相加，不是(a+b)²。',
          'Square the real and imaginary coefficients separately, then add; do not square their sum.',
        )}
        derivation={t(
          `${a}²+(${b})²=${textR(norm)}。`,
          `(${a})²+(${b})²=${textR(norm)}.`,
        )}
      />
      <Prediction
        key={`norm/${textR(norm)}`}
        mode={mode}
        name={t('预测精确模|z|', 'Predict exact modulus |z|')}
        answer={{ kind: 'radical', value: modulusComplex(z) }}
        hint={t(
          '对|z|²开非负根；模不能为负，也不附i。',
          'Take the nonnegative root of |z|². Modulus cannot be negative and has no i.',
        )}
        derivation={t(
          `|z|=sqrt(${textR(norm)})=${modulusComplex(z)}。`,
          `|z|=sqrt(${textR(norm)})=${modulusComplex(z)}.`,
        )}
      />
      <button
        className="math-button"
        aria-pressed={reflection}
        onClick={() => setReflection(!reflection)}
      >
        <Text
          mode={mode}
          text={t('显示/隐藏共轭反射', 'Show/hide conjugate reflection')}
        />
      </button>
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <ComplexPlot
        mode={mode}
        wide={wide}
        reveal={reveal}
        points={points}
        arrows={points.map((p) => ({
          name: `O→${p.name}`,
          tail: complexZero(),
          value: p.position,
        }))}
        segments={reflection ? [{ a: z, b: bar }] : []}
        triangle={reveal ? [complexZero(), complex(a, '0'), z] : undefined}
        caption={t(
          '共轭关于实轴反射；图中直角三角形的直角边长为|a|与|b|，斜边为模。实轴点与其共轭重合，身份保留。',
          'Conjugation reflects in the real axis. The right triangle has leg lengths |a| and |b| and hypotenuse |z|. A real-axis point coincides with its conjugate; both identities remain.',
        )}
      />
    </>
  );
}
function GeometryLab({ mode }: { mode: LanguageMode }) {
  const [zi, setZi] = useState('0'),
    [kind, setKind] = useState<ComplexTransform>('times-i'),
    [ci, setCi] = useState('0'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    zs = [
      complex('2', '1'),
      complex('-1', '2'),
      complexZero(),
      complex('1', '1'),
    ],
    centres = [complexZero(), complex('1', '1'), complex('2', '-1')],
    z = zs[Number(zi)]!,
    centre = kind === 'turn-centre' ? centres[Number(ci)]! : complexZero(),
    w = transformComplex(z, kind, centre),
    relative = subtractComplex(z, centre),
    imageRelative = subtractComplex(w, centre),
    context = `${zi}/${kind}/${kind === 'turn-centre' ? ci : 'origin'}`,
    turn =
      kind === 'times-i' || kind === 'times-minus-i' || kind === 'turn-centre',
    reset = (fn: (s: string) => void) => (s: string) => {
      fn(s);
      setReveal(false);
    };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            'a+bi对应点(a,b)。乘i表示绕原点逆时针90°，不是平移；绕c旋转须用w=c+i(z−c)。先减中心、转相对位移、再加回中心。中心控件仅在“绕c”时改变数学问题。',
            'a+bi corresponds to point (a,b). Multiplication by i turns 90° anticlockwise about the origin; it is not translation. About c, use w=c+i(z−c): subtract the centre, turn the relative displacement and add the centre back. The centre control affects only the about-c action.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('选择原像点z', 'Choose original point z')}
        value={zi}
        values={zs.map((v, i) => [
          String(i),
          t(complexText(v), complexText(v)),
        ])}
        change={reset(setZi)}
      />
      <Select
        mode={mode}
        name={t('复平面操作', 'Complex-plane action')}
        value={kind}
        values={[
          ['translate', t('加1+i：平移', 'Add 1+i: translate')],
          [
            'times-i',
            t(
              '乘i：绕原点逆时针90°',
              'Multiply by i: anticlockwise 90° at origin',
            ),
          ],
          [
            'times-minus-i',
            t(
              '乘−i：绕原点顺时针90°',
              'Multiply by −i: clockwise 90° at origin',
            ),
          ],
          [
            'conjugate',
            t('取共轭：实轴反射', 'Conjugate: reflect in real axis'),
          ],
          [
            'double',
            t('乘2：从原点放大', 'Multiply by two: scale from origin'),
          ],
          ['zero', t('乘0：所有点到0', 'Multiply by zero: all points to zero')],
          [
            'turn-centre',
            t('绕中心c逆时针90°', 'Turn anticlockwise 90° about centre c'),
          ],
        ]}
        change={reset((v) => setKind(v as ComplexTransform))}
      />
      <Select
        mode={mode}
        name={t(
          '中心c（仅绕c时使用）',
          'Centre c (used only for about-c turns)',
        )}
        value={ci}
        values={centres.map((v, i) => [
          String(i),
          t(complexText(v), complexText(v)),
        ])}
        change={(v) => {
          setCi(v);
          if (kind === 'turn-centre') setReveal(false);
        }}
      />
      <p>
        z={complexText(z)};{' '}
        {word(mode, t('本次距离参照中心', 'Distance reference centre'))}=
        {complexText(centre)}
      </p>
      <Prediction
        key={`image/${context}`}
        mode={mode}
        name={t('预测像w的化简式', 'Predict the simplified image w')}
        answer={Z(w)}
        hint={t(
          '先确认是加法、乘法、反射还是绕c；绕c不直接写iz。',
          'Identify addition, multiplication, reflection or turning about c; an about-c turn is not simply iz.',
        )}
        derivation={t(
          `像为${complexText(w)}；绕c时先处理z−c。`,
          `The image is ${complexText(w)}; for an about-c turn, act on z−c first.`,
        )}
      />
      <Prediction
        key={`coord/${context}`}
        mode={mode}
        name={t('预测像点坐标(Re,Im)', 'Predict image coordinates (Re,Im)')}
        answer={{
          kind: 'coordinate',
          value: `(${textR(w[0])},${textR(w[1])})`,
        }}
        hint={t(
          '有序数对为实部在前、虚部系数在后，不把i写进坐标数值。',
          'Put the real part first and imaginary coefficient second; coordinate values do not contain i.',
        )}
        derivation={t(
          `坐标(${textR(w[0])},${textR(w[1])})。`,
          `Coordinates (${textR(w[0])},${textR(w[1])}).`,
        )}
      />
      <Prediction
        key={`distance/${complexText(centre)}/${textR(squareModulus(imageRelative))}`}
        mode={mode}
        name={t(
          '预测像点到参照中心的距离',
          'Predict image distance from reference centre',
        )}
        answer={{ kind: 'radical', value: modulusComplex(imageRelative) }}
        hint={t(
          '用|w−中心|，是非负实数；不要把平方距离当距离。',
          'Use |w−centre|, a nonnegative real value, rather than its square.',
        )}
        derivation={t(
          `|w−中心|=${modulusComplex(imageRelative)}。`,
          `|w−centre|=${modulusComplex(imageRelative)}.`,
        )}
      />
      {turn && (
        <p role="status">
          <Text
            mode={mode}
            text={
              isZeroComplex(relative)
                ? t(
                    '点在旋转中心，像仍为该点；零相对位移没有方向或夹角，不给它捏造90°夹角。',
                    'The point is at the centre and stays fixed. Zero relative displacement has no direction or angle; do not invent a 90° angle between zero arrows.',
                  )
                : t(
                    kind === 'times-minus-i'
                      ? '相对中心顺时针90°，距离不变。'
                      : '相对中心逆时针90°，距离不变。',
                    kind === 'times-minus-i'
                      ? 'Clockwise 90° relative to the centre, with distance preserved.'
                      : 'Anticlockwise 90° relative to the centre, with distance preserved.',
                  )
            }
          />
        </p>
      )}
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <ComplexPlot
        mode={mode}
        wide={wide}
        reveal={reveal}
        points={[
          { name: 'z', position: z },
          { name: 'c', position: centre },
          ...(reveal ? [{ name: 'w', position: w }] : []),
        ]}
        arrows={[
          { name: 'c→z', tail: centre, value: relative },
          ...(reveal
            ? [{ name: 'c→w', tail: centre, value: imageRelative }]
            : []),
        ]}
        caption={t(
          '先看中心再读箭头；原点复数表示与绕c的相对位移不同。正向虚轴朝上，乘i由正实轴朝正虚轴转；乘0仍有像点，只是丢失原方向与长度。',
          'Locate the centre before reading arrows. An origin-based complex representation differs from displacement about c. Positive Im is upward, so i turns positive Re toward positive Im. Multiplication by zero still has an image but loses the original length and direction.',
        )}
      />
    </>
  );
}
export function ComplexLab({
  kind,
  mode,
}: {
  kind: ComplexLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'complex-roots' ? (
        <RootsLab mode={mode} />
      ) : kind === 'complex-components' ? (
        <ComponentsLab mode={mode} />
      ) : kind === 'complex-operations' ? (
        <OperationsLab mode={mode} />
      ) : kind === 'complex-conjugate' ? (
        <ConjugateLab mode={mode} />
      ) : (
        <GeometryLab mode={mode} />
      )}
    </div>
  );
}
export function ComplexHookArt({
  kind,
  mode,
}: {
  kind: ComplexLabKind;
  mode: LanguageMode;
}) {
  if (kind === 'complex-roots')
    return (
      <DataTable
        mode={mode}
        headers={[t('实数x（例子）', 'Real x (examples)'), t('x²', 'x²')]}
        rows={[-2, -1, 0, 1, 2].map((v) => [v, v * v])}
      />
    );
  if (kind === 'complex-operations')
    return (
      <ComplexPlot
        mode={mode}
        points={[
          { name: 'u', position: complexOperands[0]! },
          { name: 'v', position: complexPartners[0]! },
        ]}
        arrows={[
          { name: 'Ou', tail: complexZero(), value: complexOperands[0]! },
          { name: 'Ov', tail: complexZero(), value: complexPartners[0]! },
        ]}
        caption={t(
          '先保留两个因子的实部和虚部；乘积必须用分配律和i²=−1计算。',
          'Retain both factors and both components. Derive the product using distribution and i²=−1.',
        )}
      />
    );
  const z =
    kind === 'complex-components'
      ? complex('3', '-2')
      : kind === 'complex-conjugate'
        ? complex('3', '-4')
        : complex('2', '1');
  return (
    <ComplexPlot
      mode={mode}
      points={[{ name: 'z', position: z }]}
      arrows={[{ name: 'Oz', tail: complexZero(), value: z }]}
      caption={t(
        '先说明复数、实部、虚部系数和所用原点；不要把显示位置当运算规则。',
        'Identify the complex number, its two coefficients and the origin. A displayed position does not replace an arithmetic rule.',
      )}
    />
  );
}
