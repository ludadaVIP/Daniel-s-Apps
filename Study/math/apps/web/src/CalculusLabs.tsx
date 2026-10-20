import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { DataTable } from './DataModellingVisuals';
import {
  ConceptPlot,
  type ConceptCurve,
  type GraphPoint,
} from './FunctionConceptVisuals';
import { rational, textR, addR, type Rational } from './algebraModels';
import { polynomialText } from './polynomialModels';
import {
  asNumber,
  rateModel,
  secantModel,
  tangentModel,
  calculusPolynomial,
  valueAt,
  derivativeText,
  derivativeRules,
  limitModel,
  limitValue,
  cornerModel,
  type LimitFamily,
} from './calculusModels';
export type CalculusLabKind = Extract<Lesson['lab'], `calculus-${string}`>;
export const isCalculusLab = (kind: Lesson['lab']): kind is CalculusLabKind =>
  kind.startsWith('calculus-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
const number = (r: Rational | null): AnswerSpec =>
  r
    ? { kind: 'number', value: textR(r) }
    : { kind: 'calculus-code', value: 'undefined' };
const show = (r: Rational | null) => (r ? textR(r) : 'undefined');
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
const options = (values: string[]): [string, LocalizedText][] =>
  values.map((v) => [
    v,
    t(v === 'absolute' ? '|x|' : v, v === 'absolute' ? '|x|' : v),
  ]);
function Predict({
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
                    '预测符合。请用原规则、非零增量与两侧极限解释；有限小数表不是证明。',
                    'The prediction matches. Explain from the rule, nonzero increments and two-sided limits; a finite table is not a proof.',
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
const rateHint = t(
  '变化率是输出变化除以输入变化，保留符号与单位；输入增量为0时写undefined。',
  'Divide output change by input change, retaining sign and units; enter undefined for a zero input increment.',
);
const limitHint = t(
  '左右趋向同一有限数才有有限双侧极限；点值另查。无定义写undefined，双侧极限不存在写does-not-exist。',
  'A two-sided limit needs agreement from both sides; inspect the point value separately. Enter undefined for an undefined value, does-not-exist for a missing two-sided limit.',
);
const curve = (raw: string, name = 'f', color = '#6254a1'): ConceptCurve => {
  const p = calculusPolynomial(raw);
  return {
    name,
    color,
    points: Array.from({ length: 641 }, (_, i) => {
      const x = rational(BigInt(i - 320), 20n);
      return { x: asNumber(x), y: asNumber(valueAt(p, x)) };
    }),
  };
};
const line = (
  m: Rational,
  c: Rational,
  name: string,
  color: string,
): ConceptCurve => ({
  name,
  color,
  dash: '7 4',
  points: [-20, 20].map((x) => ({
    x,
    y: asNumber(addR(rational(BigInt(x) * m[0], m[1]), c)),
  })),
});
function Graph({
  mode,
  curves,
  points = [],
  ends = [],
  wide,
  setWide,
  caption,
}: {
  mode: LanguageMode;
  curves: ConceptCurve[];
  points?: GraphPoint[];
  ends?: GraphPoint[];
  wide: boolean;
  setWide: (v: boolean) => void;
  caption: LocalizedText;
}) {
  return (
    <>
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('切换显示视窗', 'Change display window')} />
      </button>
      <ConceptPlot
        mode={mode}
        curves={curves}
        points={points}
        ends={ends}
        wide={wide}
        caption={caption}
      />
    </>
  );
}
function Average({ mode }: { mode: LanguageMode }) {
  const [raw, setRaw] = useState('x^2'),
    [a, setA] = useState('1'),
    [b, setB] = useState('3'),
    [shift, setShift] = useState('0'),
    [wide, setWide] = useState(false),
    source = `(${raw})+(${shift})`,
    m = rateModel(source, a, b);
  const tangentAtA = tangentModel(source, a),
    sec = m.average
      ? line(
          m.average,
          addR(m.fa, rational(-m.average[0] * m.a[0], m.average[1] * m.a[1])),
          'secant',
          '#b57e22',
        )
      : null;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '完整区间的平均变化率是Δy/Δx。交换端点同时反转两个差，平均值不变；相同端点的差商未定义，不能拿导数代填。',
            'Average rate over an interval is Δy/Δx. Swapping endpoints reverses both differences but preserves the ratio. Equal endpoints give an undefined quotient, not a substituted derivative.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('函数规则', 'Function rule')}
        value={raw}
        options={options(['x^2', 'x^3', '-2x+3', '5'])}
        change={setRaw}
      />
      <Select
        mode={mode}
        name={t('起点a', 'Start a')}
        value={a}
        options={options(['-1', '0', '1', '2', '3'])}
        change={setA}
      />
      <Select
        mode={mode}
        name={t('终点b', 'End b')}
        value={b}
        options={options(['-1', '0', '1', '2', '3'])}
        change={setB}
      />
      <Select
        mode={mode}
        name={t('整体竖直平移', 'Vertical translation')}
        value={shift}
        options={options(['0', '4'])}
        change={setShift}
      />
      <Predict
        key={`dy-${show(m.dy)}`}
        mode={mode}
        name={t('预测输出变化Δy', 'Predict output change Δy')}
        answer={number(m.dy)}
        hint={rateHint}
      />
      <Predict
        key={`average-${show(m.average)}`}
        mode={mode}
        name={t('预测平均变化率', 'Predict average rate')}
        answer={number(m.average)}
        hint={rateHint}
      />
      <Graph
        mode={mode}
        wide={wide}
        setWide={setWide}
        curves={[curve(source), ...(sec ? [sec] : [])]}
        points={[
          { x: asNumber(m.a), y: asNumber(m.fa), label: 'A' },
          { x: asNumber(m.b), y: asNumber(m.fb), label: 'B' },
        ]}
        caption={t(
          '紫为函数，金为通过两个不同横坐标点的割线。显示视窗与竖直平移不改变当前变化率。',
          'Purple is the function; gold is the secant through two points with different inputs. Display changes and vertical translation preserve the rate.',
        )}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[t('量', 'Quantity'), t('精确值', 'Exact value')]}
          rows={[
            ['f(a)', show(m.fa)],
            ['f(b)', show(m.fb)],
            ['Δx', show(m.dx)],
            ['Δy', show(m.dy)],
            ['Δy/Δx', show(m.average)],
            ['f′(a)', show(tangentAtA.slope)],
          ]}
        />
      </Audit>
    </>
  );
}
const increments = [
  '-1',
  '-1/2',
  '-1/10',
  '-1/100',
  '0',
  '1/100',
  '1/10',
  '1/2',
  '1',
];
function Secants({
  mode,
  instant = false,
}: {
  mode: LanguageMode;
  instant?: boolean;
}) {
  const [raw, setRaw] = useState('x^2'),
    [a, setA] = useState(instant ? '2' : '1'),
    [h, setH] = useState('1'),
    [shift, setShift] = useState('0'),
    [wide, setWide] = useState(false),
    source = `(${raw === 'absolute' ? 'x^2' : raw})+(${shift})`,
    m = raw === 'absolute' ? cornerModel(a, h) : secantModel(source, a, h),
    tan = raw === 'absolute' ? null : tangentModel(source, a),
    d = raw === 'absolute' ? m.derivative : tan!.slope;
  const curves =
      raw === 'absolute'
        ? [
            {
              name: 'f',
              points: Array.from({ length: 641 }, (_, i) => ({
                x: (i - 320) / 20,
                y: Math.abs((i - 320) / 20),
              })),
            },
          ]
        : [curve(source)],
    sec = m.average
      ? line(
          m.average,
          addR(m.fa, rational(-m.average[0] * m.a[0], m.average[1] * m.a[1])),
          'secant',
          '#b57e22',
        )
      : null;
  if (sec) curves.push(sec);
  if (d)
    curves.push(
      line(
        d,
        addR(m.fa, rational(-d[0] * m.a[0], d[1] * m.a[1])),
        'tangent',
        '#348277',
      ),
    );
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            instant
              ? t(
                  '位移函数的导数是有符号瞬时速度，不是整段平均，也不是总为非负的速率。时间相对于参照时刻，允许负输入。|x|在0有尖点，左右差商不一致。',
                  'A position derivative is signed instantaneous velocity, not interval average or nonnegative speed. Time is relative to a reference instant and may be negative. At zero, |x| has unequal one-sided quotients.',
                )
              : t(
                  '保留固定点A，移动第二点到a+h。h只趋近0，不把0代入差商。对x²有差商2a+h，故极限2a；切线由这个极限给出。',
                  'Hold A fixed and move the second point to a+h. Let h approach zero without substituting it into the quotient. For x² the quotient is 2a+h, whose limit 2a supplies the tangent.',
                )
          }
        />
      </p>
      <Select
        mode={mode}
        name={t('函数规则', 'Function rule')}
        value={raw}
        options={options(instant ? ['x^2', 'x^3', 'absolute'] : ['x^2', 'x^3'])}
        change={setRaw}
      />
      <Select
        mode={mode}
        name={t('固定输入a', 'Fixed input a')}
        value={a}
        options={options(['-1', '0', '1', '2'])}
        change={setA}
      />
      <Select
        mode={mode}
        name={t('非零增量或零边界h', 'Increment h or zero boundary')}
        value={h}
        options={options(increments)}
        change={setH}
      />
      {raw !== 'absolute' && (
        <Select
          mode={mode}
          name={t('位置常数平移', 'Position constant shift')}
          value={shift}
          options={options(['0', '4'])}
          change={setShift}
        />
      )}
      <Predict
        key={`quotient-${show(m.average)}`}
        mode={mode}
        name={t('预测当前差商', 'Predict current quotient')}
        answer={number(m.average)}
        hint={rateHint}
      />
      <Predict
        key={`derivative-${show(d)}`}
        mode={mode}
        name={t('预测有限导数', 'Predict finite derivative')}
        answer={number(d)}
        hint={limitHint}
      />
      <Graph
        mode={mode}
        wide={wide}
        setWide={setWide}
        curves={curves}
        points={[
          { x: asNumber(m.a), y: asNumber(m.fa), label: 'A' },
          { x: asNumber(m.b), y: asNumber(m.fb), label: 'B' },
        ]}
        caption={t(
          '金为当前割线，绿为存在时的有限斜率切线。h=0不画假割线；尖点不画假切线。图像样本不替代代数极限。',
          'Gold is the current secant; green is the finite-slope tangent when it exists. Zero h creates no fake secant; a corner creates no fake tangent. Samples do not replace an algebraic limit.',
        )}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[t('增量h', 'Increment h'), t('精确差商', 'Exact quotient')]}
          rows={increments.map((v) => [
            v,
            show(
              raw === 'absolute'
                ? cornerModel(a, v).average
                : secantModel(source, a, v).average,
            ),
          ])}
        />
        <p>{`f′(${a})=${show(d)}`}</p>
        <p>
          <Text
            mode={mode}
            text={t(
              '有限表只提供观察。x³的差商为3a²+3ah+h²；|x|在0的左右差商分别−1、1。',
              'A finite table supports observation only. For x³ the quotient is 3a²+3ah+h²; at zero, |x| has left and right quotients −1 and 1.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Limits({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<LimitFamily>('hole'),
    [h, setH] = useState('1/10'),
    [wide, setWide] = useState(false),
    m = limitModel(kind),
    step = rateModel('x', '0', h).b;
  const curves: ConceptCurve[] = [];
  for (const side of [-1, 1])
    curves.push({
      name: side < 0 ? 'left branch' : 'right branch',
      points: Array.from({ length: 401 }, (_, i) => {
        const offset = rational(BigInt(side * (400 - i)), 20n),
          x = addR(m.a, offset);
        return {
          x: asNumber(x),
          y:
            i === 400
              ? asNumber(side < 0 ? m.left : m.right)
              : asNumber(limitValue(kind, x)!),
        };
      }),
    });
  const points: GraphPoint[] = [
    {
      x: asNumber(addR(m.a, step)),
      y: asNumber(limitValue(kind, addR(m.a, step))!),
      label: 'R',
    },
    {
      x: asNumber(addR(m.a, rational(-step[0], step[1]))),
      y: asNumber(limitValue(kind, addR(m.a, rational(-step[0], step[1])))!),
      label: 'L',
    },
  ];
  const ends: GraphPoint[] = [
    { x: asNumber(m.a), y: asNumber(m.left), closed: false },
    { x: asNumber(m.a), y: asNumber(m.right), closed: false },
    ...(m.at ? [{ x: asNumber(m.a), y: asNumber(m.at), closed: true }] : []),
  ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '两侧靠近的值和中心点值分开读。空洞函数在x≠1时等于x+1；补点只令f(1)=5。跳跃左0右2；绝对值在0连续但下一课会看到它不可导。',
            'Read approaching values separately from the centre value. The hole function equals x+1 for x≠1; patching sets only f(1)=5. The jump is zero on the left and two on the right. Absolute value is continuous at zero but will fail differentiability.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('极限情形', 'Limit case')}
        value={kind}
        options={[
          ['hole', t('(x²−1)/(x−1)，x≠1', '(x²−1)/(x−1), x≠1')],
          [
            'patched',
            t('同一邻域，补f(1)=5', 'Same neighbourhood, set f(1)=5'),
          ],
          ['jump', t('x<1取0，x≥1取2', 'Zero for x<1, two for x≥1')],
          ['absolute', t('|x|，趋近0', '|x|, approach zero')],
        ]}
        change={(v) => setKind(v as LimitFamily)}
      />
      <Select
        mode={mode}
        name={t('靠近距离δ', 'Approach distance δ')}
        value={h}
        options={options(['1', '1/2', '1/10', '1/100'])}
        change={setH}
      />
      <Predict
        key={`limit-${show(m.limit)}`}
        mode={mode}
        name={t('预测双侧极限', 'Predict two-sided limit')}
        answer={
          m.limit
            ? number(m.limit)
            : { kind: 'calculus-code', value: 'does-not-exist' }
        }
        hint={limitHint}
      />
      <Predict
        key={`point-${show(m.at)}`}
        mode={mode}
        name={t('预测中心点值', 'Predict centre value')}
        answer={number(m.at)}
        hint={limitHint}
      />
      <Graph
        mode={mode}
        wide={wide}
        setWide={setWide}
        curves={curves}
        points={asNumber(step) >= 0.5 ? points : []}
        ends={ends}
        caption={t(
          '空心为分支端点未取，实心为真实点值；分支不跨跳跃连线。小距离样本在下表精确列出，不用重叠的点盖住空心标记。',
          'Open marks exclude branch endpoints; filled marks show actual point values. Branches never bridge a jump. Small-distance samples are listed exactly below rather than covering the open mark with overlapping dots.',
        )}
      />
      <DataTable
        mode={mode}
        name={t('当前靠近样本', 'Current approach samples')}
        headers={[t('侧', 'Side'), t('输入', 'Input'), t('输出', 'Output')]}
        rows={points.map((p) => {
          const x = addR(
            m.a,
            p.label === 'L' ? rational(-step[0], step[1]) : step,
          );
          return [p.label!, textR(x), show(limitValue(kind, x))];
        })}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('距离', 'Distance'),
            t('左侧值', 'Left value'),
            t('右侧值', 'Right value'),
          ]}
          rows={['1', '1/2', '1/10', '1/100'].map((v) => {
            const d = rateModel('x', '0', v).b;
            return [
              v,
              show(limitValue(kind, addR(m.a, rational(-d[0], d[1])))),
              show(limitValue(kind, addR(m.a, d))),
            ];
          })}
        />
        <p>{`lim₋=${show(m.left)}, lim₊=${show(m.right)}, f(a)=${show(m.at)}`}</p>
        <p>
          <Text
            mode={mode}
            text={t(
              '约去(x−1)仅在x≠1合法，它解释邻域极限，不重新定义原函数的点值。有限表本身不能证明所有邻近输入。',
              'Cancellation of (x−1) is valid only for x≠1. It explains the neighbourhood limit without redefining the original point value. A finite table cannot prove behaviour at every nearby input.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Rules({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState('5'),
    [a, setA] = useState('1'),
    [wide, setWide] = useState(false),
    raw = derivativeRules[Number(index)]!.source,
    m = tangentModel(raw, a),
    d = polynomialText(m.derivative);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '本课基本规则限常数、非负整数幂、常数倍及有限和差：c′=0，(xⁿ)′=nxⁿ⁻¹（n≥1）。导数函数f′(x)与某点导数f′(a)分开。乘积与复合函数在H26另学。',
            'Here basic rules cover constants, nonnegative integer powers, constant multiples and finite sums: c′=0, (xⁿ)′=nxⁿ⁻¹ for n≥1. Distinguish f′(x) from f′(a). Products and compositions are studied in H26.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('待求导多项式', 'Polynomial to differentiate')}
        value={index}
        options={derivativeRules.map((r, i) => [
          String(i),
          t(r.source, r.source),
        ])}
        change={setIndex}
      />
      <Select
        mode={mode}
        name={t('求值点a', 'Evaluation input a')}
        value={a}
        options={options(['-1', '0', '1', '2'])}
        change={setA}
      />
      <Predict
        key={`rule-${d}`}
        mode={mode}
        name={t('预测导数函数', 'Predict derivative function')}
        answer={{ kind: 'polynomial', value: d, variables: ['x'] }}
        hint={t(
          '逐项降低幂并乘原指数；常数项导数0。写关于x的式子，不能只写某点值。',
          'Reduce each exponent and multiply by its original exponent; constants differentiate to zero. Give an expression in x, not merely a value at one input.',
        )}
      />
      <Predict
        key={`rule-at-${show(m.slope)}`}
        mode={mode}
        name={t('预测该点导数值', 'Predict derivative value here')}
        answer={number(m.slope)}
        hint={rateHint}
      />
      <Graph
        mode={mode}
        wide={wide}
        setWide={setWide}
        curves={[curve(raw, 'f'), curve(d, 'derivative', '#348277')]}
        points={[{ x: asNumber(m.a), y: asNumber(m.slope), label: 'D' }]}
        caption={t(
          '紫为f，绿为导数函数f′，D点在导数图上；其纵坐标等于原曲线该处切线斜率，并非原曲线高度。',
          'Purple is f and green is f′. D lies on the derivative graph; its height equals the original curve’s tangent slope, not the original curve’s height.',
        )}
      />
      <Audit mode={mode}>
        <p>{`f(x)=${raw}; f′(x)=${derivativeText(raw)}; f′(${a})=${show(m.slope)}`}</p>
        <DataTable
          mode={mode}
          headers={[t('原项', 'Original term'), t('导数项', 'Derivative term')]}
          rows={[...m.p].map(([key, c]) => {
            const term = polynomialText(new Map([[key, c]]));
            return [term, derivativeText(term)];
          })}
        />
      </Audit>
    </>
  );
}
function Tangents({ mode }: { mode: LanguageMode }) {
  const [raw, setRaw] = useState('x^2'),
    [a, setA] = useState('2'),
    [wide, setWide] = useState(false),
    m = tangentModel(raw, a);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先定接触点(a,f(a))，再用有限导数斜率m=f′(a)：y−f(a)=m(x−a)。切线可以穿过曲线，也可以在别处再次相交；不能靠相交次数定义一般函数的切线。',
            'Find the contact point (a,f(a)), then finite slope m=f′(a): y−f(a)=m(x−a). A tangent may cross the curve or meet it elsewhere; intersection count does not define a general function’s tangent.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('曲线规则', 'Curve rule')}
        value={raw}
        options={options(['x^2', 'x^3', 'x^3-3x', '5'])}
        change={setRaw}
      />
      <Select
        mode={mode}
        name={t('接触横坐标a', 'Contact input a')}
        value={a}
        options={options(['-1', '0', '1', '2'])}
        change={setA}
      />
      <Predict
        key={`height-${show(m.y)}`}
        mode={mode}
        name={t('预测接触点纵坐标', 'Predict contact height')}
        answer={number(m.y)}
        hint={t(
          '把a代入原函数，不要代入导数。',
          'Substitute a into the original function, not its derivative.',
        )}
      />
      <Predict
        key={`tangent-${m.equation}`}
        mode={mode}
        name={t('预测完整切线方程', 'Predict complete tangent equation')}
        answer={{ kind: 'plane-equation', value: m.equation }}
        hint={t(
          '必须同时经过接触点并具有f′(a)斜率。可写y−f(a)=f′(a)(x−a)，接受展开和非零倍数。',
          'The line must pass through the contact point and have slope f′(a). Use y−f(a)=f′(a)(x−a); expanded forms and nonzero multiples are accepted.',
        )}
      />
      <Graph
        mode={mode}
        wide={wide}
        setWide={setWide}
        curves={[curve(raw), line(m.slope, m.intercept, 'tangent', '#348277')]}
        points={[{ x: asNumber(m.a), y: asNumber(m.y), label: 'A' }]}
        caption={t(
          '绿线由真实点和精确斜率确定，绘图窗口不改变方程。x³在0穿过水平切线；x³−3x在a=1的切线还经过x=−2。',
          'The green line uses the exact contact point and slope; the window does not change its equation. x³ crosses its horizontal tangent at zero; the tangent to x³−3x at a=1 also meets the curve at x=−2.',
        )}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[t('核对', 'Check'), t('精确值', 'Exact value')]}
          rows={[
            ['a', show(m.a)],
            ['f(a)', show(m.y)],
            ['f′(a)', show(m.slope)],
            ['y', m.equation.slice(2)],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '点在直线上和斜率正确缺一不可。水平切线斜率0仍是有效直线，不是竖直线。',
              'Both incidence and correct slope are necessary. A horizontal tangent with slope zero is a valid line, not a vertical line.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function CalculusLab({
  kind,
  mode,
}: {
  kind: CalculusLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'calculus-average' ? (
        <Average mode={mode} />
      ) : kind === 'calculus-secant' ? (
        <Secants mode={mode} />
      ) : kind === 'calculus-limit' ? (
        <Limits mode={mode} />
      ) : kind === 'calculus-instant' ? (
        <Secants mode={mode} instant />
      ) : kind === 'calculus-rules' ? (
        <Rules mode={mode} />
      ) : (
        <Tangents mode={mode} />
      )}
    </div>
  );
}
export function CalculusHookArt({
  kind,
  mode,
}: {
  kind: CalculusLabKind;
  mode: LanguageMode;
}) {
  const captions: Record<CalculusLabKind, LocalizedText> = {
    'calculus-average': t(
      '两点之间的输出变化与输入变化同时保留。',
      'Retain both output and input changes between two points.',
    ),
    'calculus-secant': t(
      '第二点靠近第一点，但差商不把h=0代入。',
      'The second point approaches the first without putting h=0 into the quotient.',
    ),
    'calculus-limit': t(
      '空洞的邻域可以有共同极限，而点值未定义。',
      'A punctured neighbourhood can have a common limit while the point value is undefined.',
    ),
    'calculus-instant': t(
      '瞬时变化率来自差商极限，而不是一个很小区间的值。',
      'Instantaneous rate comes from a quotient limit, not one small interval’s value.',
    ),
    'calculus-rules': t(
      '导数函数的高度表示原函数的斜率。',
      'The derivative function’s height represents the original function’s slope.',
    ),
    'calculus-tangent': t(
      '切线需要正确接触点与正确斜率。',
      'A tangent requires both the correct contact point and the correct slope.',
    ),
  };
  if (kind === 'calculus-limit')
    return (
      <ConceptPlot
        mode={mode}
        curves={[curve('x+1')]}
        ends={[{ x: 1, y: 2, closed: false }]}
        caption={captions[kind]}
      />
    );
  if (kind === 'calculus-rules')
    return (
      <ConceptPlot
        mode={mode}
        curves={[curve('x^2'), curve('2x', 'derivative', '#348277')]}
        points={[{ x: 1, y: 2, label: 'D' }]}
        caption={captions[kind]}
      />
    );
  if (kind === 'calculus-average')
    return (
      <ConceptPlot
        mode={mode}
        curves={[
          curve('x^2'),
          line(rational(4n), rational(-3n), 'secant', '#b57e22'),
        ]}
        points={[
          { x: 1, y: 1, label: 'A' },
          { x: 3, y: 9, label: 'B' },
        ]}
        caption={captions[kind]}
      />
    );
  const at = kind === 'calculus-instant' ? 2 : 1;
  return (
    <ConceptPlot
      mode={mode}
      curves={[
        curve('x^2'),
        line(
          rational(BigInt(2 * at)),
          rational(BigInt(-at * at)),
          'tangent',
          '#348277',
        ),
        ...(kind === 'calculus-secant'
          ? [line(rational(3n), rational(-2n), 'secant', '#b57e22')]
          : []),
      ]}
      points={[
        { x: at, y: at * at, label: 'A' },
        ...(kind === 'calculus-secant' ? [{ x: 2, y: 4, label: 'B' }] : []),
      ]}
      caption={captions[kind]}
    />
  );
}
