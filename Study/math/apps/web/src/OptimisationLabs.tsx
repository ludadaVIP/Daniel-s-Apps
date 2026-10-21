import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { DataTable } from './DataModellingVisuals';
import { ConceptPlot, type ConceptCurve } from './FunctionConceptVisuals';
import { FenceFigure, MotionFigure } from './OptimisationVisuals';
import {
  implicitAudit,
  extremaAudit,
  fenceAudit,
  motionAudit,
  type AdvancedCode,
  type ExtremaInterval,
} from './optimisationModels';
import { rational, textR } from './algebraModels';
import { asNumber } from './calculusModels';
type Kind = Extract<Lesson['lab'], `optimisation-${string}`>;
export const isOptimisationLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('optimisation-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
const number = (n: string | number): AnswerSpec => ({
  kind: 'number',
  value: String(n),
});
const code = (value: AdvancedCode): AnswerSpec => ({
  kind: 'advanced-code',
  value,
});
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
        {options.map(([v, p]) => (
          <option key={v} value={v}>
            {word(mode, p)}
          </option>
        ))}
      </select>
    </label>
  );
}
const opts = (values: (string | number)[]): [string, LocalizedText][] =>
  values.map((v) => [String(v), t(String(v), String(v))]);
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
                    '预测符合。请解释规则、单位、定义域及是否覆盖全部候选。',
                    'The prediction matches. Explain rules, units, domain and coverage of all candidates.',
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
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="math-button secondary"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Text mode={mode} text={t('显示/隐藏核验', 'Show/hide audit')} />
      </button>
      {open && children}
    </>
  );
}
const curve = (
  f: (x: number) => number,
  name: string,
  color = '#5c4e9c',
  lo = -3,
  hi = 3,
): ConceptCurve => ({
  name,
  color,
  points: Array.from({ length: 241 }, (_, i) => {
    const x = lo + ((hi - lo) * i) / 240;
    return { x, y: f(x) };
  }),
});
const ruleHint = t(
  '逐项求导，保留内导、符号与给定函数参数；用规范函数括号，不用近似采样证明恒等。',
  'Differentiate term by term, retaining inner factors, signs and the given arguments. Use function brackets; numerical samples do not prove identity.',
);
const reviewCases = [
  {
    id: 'sum',
    label: '3x³−2x+eˣ',
    f: (x: number) => 3 * x ** 3 - 2 * x + Math.exp(x),
    df: (x: number) => 9 * x * x - 2 + Math.exp(x),
    answer: {
      kind: 'advanced-derivative',
      family: 'natural',
      value: '9x^2-2+e^x',
    } as AnswerSpec,
    at: number(-1),
  },
  {
    id: 'inner',
    label: '5e^(2x)',
    f: (x: number) => 5 * Math.exp(2 * x),
    df: (x: number) => 10 * Math.exp(2 * x),
    answer: {
      kind: 'advanced-derivative',
      family: 'natural',
      rate: '2',
      value: '10e^(2x)',
    } as AnswerSpec,
    at: number(10),
  },
  {
    id: 'base',
    label: '2ˣ',
    f: (x: number) => 2 ** x,
    df: (x: number) => Math.LN2 * 2 ** x,
    answer: {
      kind: 'advanced-derivative',
      family: 'base',
      base: 2,
      value: 'ln(2)*2^x',
    } as AnswerSpec,
    at: {
      kind: 'advanced-derivative',
      family: 'base',
      base: 2,
      value: 'ln(2)',
    } as AnswerSpec,
  },
  {
    id: 'negative',
    label: 'e^(−x)',
    f: (x: number) => Math.exp(-x),
    df: (x: number) => -Math.exp(-x),
    answer: {
      kind: 'advanced-derivative',
      family: 'natural',
      rate: '-1',
      value: '-e^(-x)',
    } as AnswerSpec,
    at: number(-1),
  },
];
function Review({ mode }: { mode: LanguageMode }) {
  const [id, setId] = useState('sum'),
    [tangent, setTangent] = useState(false),
    m = reviewCases.find((c) => c.id === id)!;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测，再显示核验。公式输入支持有理系数、括号、e^x/exp(x)或ln(2)*2^x；保留题中同一个指数内层。图只作近似观察。',
            'Predict before auditing. Formula inputs support rational coefficients, brackets,e^x/exp(x),or ln(2)*2^x, retaining the stated exponential argument. The plot is an approximation.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('函数', 'Function')}
        value={id}
        options={reviewCases.map((c) => [c.id, t(c.label, c.label)])}
        change={setId}
      />
      <Predict
        key={id}
        mode={mode}
        name={t('预测导函数', 'Predict derivative function')}
        answer={m.answer}
        hint={ruleHint}
      />
      <Predict
        key={JSON.stringify(m.at)}
        mode={mode}
        name={t('预测0处斜率', 'Predict slope at zero')}
        answer={m.at}
        hint={ruleHint}
      />
      <button
        className="math-button secondary"
        aria-pressed={tangent}
        onClick={() => setTangent(!tangent)}
      >
        <Text
          mode={mode}
          text={t('显示/隐藏0处切线', 'Show/hide tangent at zero')}
        />
      </button>
      <ConceptPlot
        mode={mode}
        curves={[
          curve(m.f, 'f', '#5c4e9c', -2, 2),
          curve(m.df, 'f′', '#187969', -2, 2),
          ...(tangent
            ? [curve((x) => m.f(0) + m.df(0) * x, 'tangent', '#af5b26', -2, 2)]
            : []),
        ]}
        points={[{ x: 0, y: m.f(0), label: 'P' }]}
        caption={t(
          '紫f，绿f′，可选橙切线；两函数的同一横坐标不同纵值分别表示值与斜率。窗外曲线被裁切，不压成水平平台。',
          'Purple f, green f′ and optional orange tangent. At the same input, the two vertical values represent value and slope. Out-of-view curves are clipped, not flattened.',
        )}
      />
      <Audit mode={mode}>
        <p>
          <Text
            mode={mode}
            text={t(
              `导函数：${'value' in m.answer ? m.answer.value : ''}；0处斜率${'value' in m.at ? m.at.value : ''}。幂与指数不可混用，底数2的ln因子必须保留。`,
              `Derivative: ${'value' in m.answer ? m.answer.value : ''}; slope at zero ${'value' in m.at ? m.at.value : ''}. Power and exponential rules differ; retain the logarithmic factor for base two.`,
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Trig({ mode }: { mode: LanguageMode }) {
  const [family, setFamily] = useState('sin'),
    [k, setK] = useState(2),
    [angle, setAngle] = useState(0),
    x = (angle * Math.PI) / 2,
    quadrant = (((k * angle) % 4) + 4) % 4,
    sin = [0, 1, 0, -1][quadrant]!,
    cos = [1, 0, -1, 0][quadrant]!,
    undefinedAt = family === 'tan' && cos === 0,
    slope = undefinedAt
      ? null
      : family === 'sin'
        ? k * cos
        : family === 'cos'
          ? -k * sin
          : k,
    formula =
      family === 'sin'
        ? `${k}cos(${k}x)`
        : family === 'cos'
          ? `-${k}sin(${k}x)`
          : `${k}/cos(${k}x)^2`;
  const f = (x: number) =>
      family === 'sin'
        ? Math.sin(k * x)
        : family === 'cos'
          ? Math.cos(k * x)
          : Math.tan(k * x),
    df = (x: number) =>
      family === 'sin'
        ? k * Math.cos(k * x)
        : family === 'cos'
          ? -k * Math.sin(k * x)
          : k / Math.cos(k * x) ** 2;
  const breaks =
      family === 'tan'
        ? Array.from(
            { length: 2 * k },
            (_, i) => ((-k + 0.5 + i) * Math.PI) / k,
          )
        : [],
    edges = [-Math.PI, ...breaks, Math.PI],
    curves = edges
      .slice(1)
      .flatMap((end, i) => [
        curve(f, `f-${i}`, '#5c4e9c', edges[i]! + 1e-5, end - 1e-5),
        curve(df, `f′-${i}`, '#187969', edges[i]! + 1e-5, end - 1e-5),
      ]);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            'x以弧度输入。所选点以π/2倍数标记；正切在cos(kx)=0处未定义。函数名选项不显示预测答案。',
            'x is in radians. Selected inputs are multiples of π/2; tangent is undefined where cos(kx)=0. Function options do not reveal predictions.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('三角函数', 'Trig function')}
        value={family}
        options={opts(['sin', 'cos', 'tan'])}
        change={setFamily}
      />
      <Select
        mode={mode}
        name={t('内层系数k', 'Inner coefficient k')}
        value={String(k)}
        options={opts([1, 2, 3])}
        change={(v) => setK(Number(v))}
      />
      <Select
        mode={mode}
        name={t('输入x（π/2倍数）', 'Input x (multiples of π/2)')}
        value={String(angle)}
        options={opts([0, 1, 2, 3])}
        change={(v) => setAngle(Number(v))}
      />
      {family !== 'tan' && (
        <Predict
          key={`${family}-${k}`}
          mode={mode}
          name={t('预测导函数', 'Predict derivative function')}
          answer={{
            kind: 'advanced-derivative',
            family: 'trig',
            rate: String(k),
            value: formula,
          }}
          hint={ruleHint}
        />
      )}
      <Predict
        key={String(slope)}
        mode={mode}
        name={t(
          '预测所选点斜率（或undefined）',
          'Predict selected slope (or undefined)',
        )}
        answer={
          slope === null
            ? { kind: 'calculus-code', value: 'undefined' }
            : number(slope)
        }
        hint={ruleHint}
      />
      <ConceptPlot
        mode={mode}
        curves={curves}
        points={
          undefinedAt
            ? []
            : [
                {
                  x,
                  y: family === 'tan' ? 0 : family === 'sin' ? sin : cos,
                  label: 'P',
                },
              ]
        }
        caption={t(
          '紫为函数，绿为导函数。正切逐支绘制，不跨渐近线连接；选择窗外点时保留原坐标并提示。精确值由弧度规则核验。',
          'Purple is the function, green its derivative. Tangent branches are separate across asymptotes. Out-of-view points retain their coordinates and trigger a notice. Radian rules establish exact values.',
        )}
      />
      <Audit mode={mode}>
        <p>
          <Text
            mode={mode}
            text={t(
              `导函数${formula}；所选斜率${slope === null ? 'undefined' : slope}。度数变量d须先代入πd/180并乘换算内导。`,
              `Derivative ${formula}; selected slope ${slope === null ? 'undefined' : slope}. A degree variable d requires argument πd/180 and its inner factor.`,
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Implicit({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<'circle' | 'cross'>('circle'),
    [point, setPoint] = useState('3,4'),
    [xr, yr] = point.split(',') as [string, string],
    m = implicitAudit(kind, xr, yr),
    x = asNumber(m.x),
    y = asNumber(m.y),
    slope = m.slope ? asNumber(m.slope) : 0,
    curves =
      kind === 'circle'
        ? [
            {
              name: 'circle',
              color: '#5c4e9c',
              points: Array.from({ length: 241 }, (_, i) => ({
                x: 5 * Math.cos((i * Math.PI) / 120),
                y: 5 * Math.sin((i * Math.PI) / 120),
              })),
            },
          ]
        : [curve((x) => x, 'branch1'), curve((x) => -x, 'branch2')];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先代回曲线。斜率有限时填数值，否则填vertical（竖直）、singular（奇点）或off-curve（不在曲线）。两偏导为0不能直接判竖直。',
            'Check membership first. Enter a finite slope, or vertical, singular, or off-curve. Two zero partial derivatives do not automatically imply a vertical tangent.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('隐曲线', 'Implicit curve')}
        value={kind}
        options={[
          ['circle', t('x²+y²=25', 'x²+y²=25')],
          ['cross', t('x²−y²=0', 'x²−y²=0')],
        ]}
        change={(v) => setKind(v as typeof kind)}
      />
      <Select
        mode={mode}
        name={t('待核点', 'Point to audit')}
        value={point}
        options={opts(['3,4', '0,5', '5,0', '3,3', '0,0', '1,1'])}
        change={setPoint}
      />
      <Predict
        key={`${m.status}-${m.slope ? textR(m.slope) : ''}`}
        mode={mode}
        name={t('预测斜率或点类型', 'Predict slope or point status')}
        answer={
          m.slope ? number(textR(m.slope)) : code(m.status as AdvancedCode)
        }
        hint={t(
          '先查点在曲线上，再查Fy是否非0；圆的竖直端点与交叉奇点不同。',
          'Check membership and Fy≠0 first. Vertical circle endpoints differ from crossing singularities.',
        )}
      />
      <ConceptPlot
        mode={mode}
        curves={[
          ...curves,
          ...(m.status === 'regular'
            ? [curve((t) => y + slope * (t - x), 'tangent', '#b36d2c', -7, 7)]
            : m.status === 'vertical'
              ? [
                  {
                    name: 'vertical',
                    color: '#b36d2c',
                    points: [
                      { x, y: -8 },
                      { x, y: 8 },
                    ],
                  },
                ]
              : []),
        ]}
        points={[{ x, y, label: 'P' }]}
        caption={t(
          '横纵同单位。橙线只在核验后的正则点或竖直端点显示；奇点不画一条冒充唯一切线的线。',
          'Both axes use the same scale. Orange tangents appear only after regular or vertical-point checks; singularities do not receive a falsely unique tangent.',
        )}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('在曲线上', 'On curve'),
            t('Fx', 'Fx'),
            t('Fy', 'Fy'),
            t('类型', 'Status'),
            t('dy/dx', 'dy/dx'),
          ]}
          rows={[
            [
              m.on ? '✓' : '×',
              textR(m.fx),
              textR(m.fy),
              m.status,
              m.slope ? textR(m.slope) : '—',
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '沿F(x,y(x))=0有Fx+Fy·y′=0。Fy非0才可除；交叉原点有两条斜率±1分支。',
              'Along F(x,y(x))=0, Fx+Fy·y′=0. Divide only when Fy≠0; the crossing origin has two slopes±1.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
const intervals: Record<string, ExtremaInterval> = {
  closed: { left: '-2', right: '2', leftClosed: true, rightClosed: true },
  open: { left: '0', right: '2', leftClosed: false, rightClosed: false },
  half: { left: '0', right: '2', leftClosed: true, rightClosed: false },
  shifted: { left: '-3', right: '1', leftClosed: true, rightClosed: true },
};
function Extrema({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<'cubic-turn' | 'square' | 'corner'>(
      'cubic-turn',
    ),
    [interval, setInterval] = useState('closed'),
    m = extremaAudit(kind, intervals[interval]!),
    value = (x: number) =>
      asNumber(m.m.value(rational(BigInt(Math.round(x * 10000)), 10000n))),
    lo = asNumber(m.left),
    hi = asNumber(m.right);
  return (
    <>
      <Select
        mode={mode}
        name={t('极值函数', 'Extrema function')}
        value={kind}
        options={[
          ['cubic-turn', t('x³−3x', 'x³−3x')],
          ['square', t('x²', 'x²')],
          ['corner', t('|x|', '|x|')],
        ]}
        change={(v) => setKind(v as typeof kind)}
      />
      <Select
        mode={mode}
        name={t('输入区间', 'Input interval')}
        value={interval}
        options={[
          ['closed', t('[−2,2]', '[−2,2]')],
          ['open', t('(0,2)', '(0,2)')],
          ['half', t('[0,2)', '[0,2)')],
          ['shifted', t('[−3,1]', '[−3,1]')],
        ]}
        change={setInterval}
      />
      <Predict
        key={`min-${m.min ? textR(m.min) : 'none'}`}
        mode={mode}
        name={t(
          '预测最小值（未取到写not-attained）',
          'Predict minimum value (or not-attained)',
        )}
        answer={m.min ? number(textR(m.min)) : code('not-attained')}
        hint={t(
          '比较候选值，并核最小输出是否在实际域内取到。',
          'Compare candidates and check whether the least bound is attained in the domain.',
        )}
      />
      <Predict
        key={`max-${m.max ? m.maxAt.join(',') : 'none'}`}
        mode={mode}
        name={t(
          '预测全部最大值位置集合（或not-attained）',
          'Predict all maximum locations (or not-attained)',
        )}
        answer={
          m.max
            ? { kind: 'finite-set', value: `{${m.maxAt.join(',')}}` }
            : code('not-attained')
        }
        hint={t(
          '只保留被包含且取到最大输出的点，所有并列都要写。',
          'Retain every included point attaining the largest output, including ties.',
        )}
      />
      <ConceptPlot
        mode={mode}
        curves={[curve(value, 'f', '#5c4e9c', lo, hi)]}
        points={m.candidates
          .filter((c) => c.reason !== 'left' && c.reason !== 'right')
          .map((c) => ({
            x: asNumber(c.x),
            y: asNumber(c.y),
            label: kind === 'corner' ? 'corner' : 'stationary',
          }))}
        ends={[
          { x: lo, y: value(lo), closed: m.interval.leftClosed },
          { x: hi, y: value(hi), closed: m.interval.rightClosed },
        ]}
        caption={t(
          '只画所给区间；空心端点不在域内。驻点与不可导点都是候选，图窗裁切不改变原数值，精确表与单调性确认全域结论。',
          'Plot only the stated interval; open endpoints are excluded. Stationary and nondifferentiable points are candidates. Clipping does not change source values; exact tables and monotonicity establish the global result.',
        )}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('候选x', 'Candidate x'),
            t('f(x)或端点极限', 'f(x) or endpoint limit'),
            t('包含', 'Included'),
            t('原因', 'Reason'),
          ]}
          rows={m.candidates.map((c) => [
            textR(c.x),
            textR(c.y),
            c.included ? '✓' : '×',
            word(
              mode,
              c.reason === 'left'
                ? t('左端', 'Left endpoint')
                : c.reason === 'right'
                  ? t('右端', 'Right endpoint')
                  : c.reason === 'stationary'
                    ? t('驻点', 'Stationary')
                    : t('不可导', 'Nondifferentiable'),
            ),
          ])}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              `下确界${textR(m.inf)}，上确界${textR(m.sup)}；最小值位置{${m.minAt.join(',')}}，最大值位置{${m.maxAt.join(',')}}。空集合表示该界未取到，不表示没有允许输入。`,
              `Infimum ${textR(m.inf)}, supremum ${textR(m.sup)}; minimum locations {${m.minAt.join(',')}}, maximum locations {${m.maxAt.join(',')}}. An empty location set means an unattained bound, not an empty input domain.`,
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Fence({ mode }: { mode: LanguageMode }) {
  const [length, setLength] = useState(24),
    [cap, setCap] = useState(4),
    [domain, setDomain] = useState('continuous'),
    m = fenceAudit(length, cap, domain === 'integer');
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '靠直墙围矩形，两深一宽：2x+y=L；x>0、y>0、x≤c。米为长度单位，忽略接缝损耗。整数模式要求两尺寸均为整米。',
            'Against a straight wall, fence two depths and one width:2x+y=L, x>0,y>0,x≤c. Lengths are metres with no joining losses. Integer mode requires both dimensions to be whole metres.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('围栏总长L', 'Total fence L')}
        value={String(length)}
        options={opts([21, 22, 24, 30])}
        change={(v) => setLength(Number(v))}
      />
      <Select
        mode={mode}
        name={t('深度上限c', 'Depth cap c')}
        value={String(cap)}
        options={opts([0, 4, 6, 9, 20])}
        change={(v) => setCap(Number(v))}
      />
      <Select
        mode={mode}
        name={t('长度定义域', 'Length domain')}
        value={domain}
        options={[
          ['continuous', t('连续长度', 'Continuous lengths')],
          ['integer', t('整米长度', 'Whole metres')],
        ]}
        change={setDomain}
      />
      <Predict
        key={m.bestText}
        mode={mode}
        name={t(
          '预测全部最优深度集合（无可行解写empty-domain）',
          'Predict all optimal depths (or empty-domain)',
        )}
        answer={
          m.best.length
            ? { kind: 'finite-set', value: m.bestText }
            : code('empty-domain')
        }
        hint={t(
          '先给可行域，再核连续驻点、约束端点或整数邻点，并保留并列。',
          'Specify the feasible domain, then check stationary points, constraint endpoints or integer neighbours, retaining ties.',
        )}
      />
      <Predict
        key={m.max ? textR(m.max) : 'none'}
        mode={mode}
        name={t(
          '预测最大面积（或empty-domain）',
          'Predict maximum area (or empty-domain)',
        )}
        answer={m.max ? number(textR(m.max)) : code('empty-domain')}
        hint={t(
          '面积x(L−2x)，单位平方米；无正边长可行点不等于最优面积0。',
          'Area is x(L−2x) in square metres; no feasible positive sides does not mean optimum zero.',
        )}
      />
      <Audit mode={mode}>
        <FenceFigure mode={mode} m={m} />
        <DataTable
          mode={mode}
          headers={[
            t('深度x/米', 'Depth x/m'),
            t('宽y/米', 'Width y/m'),
            t('面积/平方米', 'Area/m²'),
          ]}
          rows={m.candidates.map((c) => [
            textR(c.x),
            textR(c.y),
            textR(c.area),
          ])}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              'A=L²/8−2(x−L/4)²。离中心最近的可行点最优；连续域需核深度上限，整数域需保留等距并列。表在连续模式列推导的最优候选，在整数模式列全部可行整数。',
              'A=L²/8−2(x−L/4)². Feasible points closest to the centre optimise. Check the cap for continuous lengths and equal-distance ties for integers. The table shows the derived continuous optimum or every feasible integer.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Motion({ mode }: { mode: LanguageMode }) {
  const [scale, setScale] = useState(1),
    [offset, setOffset] = useState(0),
    [time, setTime] = useState('2'),
    [view, setView] = useState<'position' | 'velocity' | 'acceleration'>(
      'position',
    ),
    m = motionAudit(scale, offset, time);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '位置s(t)=c(t³−6t²+9t)+d米，t∈[0,4]秒。v=s′米/秒，a=v′米/秒²，速率|v|。缩放c会改方向或大小；平移d不改运动变化量。',
            'Position s(t)=c(t³−6t²+9t)+d metres on[0,4] seconds. v=s′ in m/s, a=v′ in m/s², speed|v|. Scale c changes direction or magnitude; shift d leaves motion changes unchanged.',
          )}
        />
      </p>
      <p>
        <Text
          mode={mode}
          text={t(
            '状态代码：speeding-up（速率增加）、slowing-down（速率减小）、instant-rest（瞬时静止）、neither（非零速度、此刻加速度为0）。',
            'Codes: speeding-up, slowing-down, instant-rest, or neither for nonzero velocity and zero acceleration at this instant.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('位置缩放c', 'Position scale c')}
        value={String(scale)}
        options={opts([-1, 1, 2])}
        change={(v) => setScale(Number(v))}
      />
      <Select
        mode={mode}
        name={t('位置平移d（米）', 'Position shift d (m)')}
        value={String(offset)}
        options={opts([0, 10])}
        change={(v) => setOffset(Number(v))}
      />
      <Select
        mode={mode}
        name={t('所选时刻（秒）', 'Selected time (s)')}
        value={time}
        options={opts([0, 1, 2, 3, 4])}
        change={setTime}
      />
      <Select
        mode={mode}
        name={t('图示量', 'Plotted quantity')}
        value={view}
        options={[
          ['position', t('位置s', 'Position s')],
          ['velocity', t('速度v', 'Velocity v')],
          ['acceleration', t('加速度a', 'Acceleration a')],
        ]}
        change={(v) => setView(v as typeof view)}
      />
      <Predict
        key={`v${textR(m.v)}`}
        mode={mode}
        name={t('预测所选有向速度', 'Predict selected signed velocity')}
        answer={number(textR(m.v))}
        hint={t(
          '先求s′再代时刻；负号表达方向。',
          'Differentiate position, then substitute time; the sign gives direction.',
        )}
      />
      <Predict
        key={`s${textR(m.speed)}`}
        mode={mode}
        name={t('预测所选速率', 'Predict selected speed')}
        answer={number(textR(m.speed))}
        hint={t('取有向速度的绝对值。', 'Take the absolute value of velocity.')}
      />
      <Predict
        key={`d${textR(m.distance)}`}
        mode={mode}
        name={t('预测0至4秒总路程', 'Predict total distance over0–4 s')}
        answer={number(textR(m.distance))}
        hint={t(
          '在v变号的1、3秒分段，累加绝对位置变化。',
          'Split at velocity sign changes one and three, then sum absolute position changes.',
        )}
      />
      <Predict
        key={m.classification}
        mode={mode}
        name={t('预测速率状态代码', 'Predict speed-change code')}
        answer={code(m.classification)}
        hint={t(
          '写speeding-up、slowing-down、instant-rest或neither。非零v,a同号加速、异号减速；v0瞬时静止，v非0而a0写neither。',
          'Use speeding-up,slowing-down,instant-rest or neither. Matching nonzero v,a signs speed up, opposite signs slow down; v0 is instantaneous rest, while nonzero v with a0 is neither.',
        )}
      />
      <MotionFigure mode={mode} m={m} view={view} />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          name={t(
            '位置速度加速度精确表',
            'Exact position velocity acceleration table',
          )}
          headers={[
            t('秒t', 'Seconds t'),
            t('米s', 'Metres s'),
            t('米/秒v', 'm/s v'),
            t('米/秒²a', 'm/s² a'),
          ]}
          rows={[0, 1, 2, 3, 4].map((n) => {
            const x = rational(BigInt(n));
            return [
              n,
              textR(m.position(x)),
              textR(m.velocity(x)),
              textR(m.acceleration(x)),
            ];
          })}
        />
        <DataTable
          mode={mode}
          name={t('路程分段核验', 'Distance segment audit')}
          headers={[
            t('从/秒', 'From/s'),
            t('到/秒', 'To/s'),
            t('位移/米', 'Displacement/m'),
            t('路程/米', 'Distance/m'),
          ]}
          rows={m.segments.map((s) => [
            s.from,
            s.to,
            textR(s.change),
            textR(s.distance),
          ])}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              `位移${textR(m.displacement)}米，路程${textR(m.distance)}米；平均速度${textR(m.averageVelocity)}米/秒，平均速率${textR(m.averageSpeed)}米/秒。a=0只是一瞬间条件；v=0还需左右变号才转向。`,
              `Displacement ${textR(m.displacement)} m, distance ${textR(m.distance)} m; average velocity ${textR(m.averageVelocity)} m/s, average speed ${textR(m.averageSpeed)} m/s. Zero acceleration is an instantaneous condition; reversal at zero velocity requires a sign change.`,
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function OptimisationLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'optimisation-review' ? (
        <Review mode={mode} />
      ) : kind === 'optimisation-trig' ? (
        <Trig mode={mode} />
      ) : kind === 'optimisation-implicit' ? (
        <Implicit mode={mode} />
      ) : kind === 'optimisation-extrema' ? (
        <Extrema mode={mode} />
      ) : kind === 'optimisation-fence' ? (
        <Fence mode={mode} />
      ) : (
        <Motion mode={mode} />
      )}
    </section>
  );
}
export function OptimisationHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'optimisation-fence')
    return <FenceFigure mode={mode} m={fenceAudit(24, 4)} />;
  if (kind === 'optimisation-motion')
    return <MotionFigure mode={mode} m={motionAudit()} view="velocity" />;
  if (kind === 'optimisation-implicit')
    return (
      <ConceptPlot
        mode={mode}
        curves={[
          {
            name: 'circle',
            points: Array.from({ length: 241 }, (_, i) => ({
              x: 5 * Math.cos((i * Math.PI) / 120),
              y: 5 * Math.sin((i * Math.PI) / 120),
            })),
          },
        ]}
        points={[
          { x: 3, y: 4, label: 'P' },
          { x: 5, y: 0, label: 'Q' },
        ]}
        caption={t(
          '在局部点谈斜率，先核是否能表示y(x)。',
          'Discuss slope locally and first check a y(x) branch.',
        )}
      />
    );
  const f =
    kind === 'optimisation-trig'
      ? (x: number) => Math.sin(x)
      : kind === 'optimisation-extrema'
        ? (x: number) => x ** 3 - 3 * x
        : (x: number) => Math.exp(x);
  return (
    <ConceptPlot
      mode={mode}
      curves={[curve(f, 'f')]}
      caption={t(
        '图示提出问题，精确规则与完整定义域给出论证。',
        'The plot poses a question; exact rules and the full domain justify conclusions.',
      )}
    />
  );
}
