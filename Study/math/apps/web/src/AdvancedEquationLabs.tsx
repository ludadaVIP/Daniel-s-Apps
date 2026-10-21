import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { ConceptPlot, sampleCurve } from './FunctionConceptVisuals';
import { DataTable } from './DataModellingVisuals';
import {
  compositionAudit,
  logEquationAudit,
  identityAudit,
  parameterAudit,
  solutionAudit,
  finiteText,
  type SquareBranch,
  type LogEquationKind,
  type IdentityCase,
  type EquationAuditCase,
} from './advancedEquationModels';
type Kind = Extract<Lesson['lab'], `equation-${string}`>;
export const isAdvancedEquationLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('equation-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
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
                    '预测符合。请解释原式定义域、变形方向与完整解集。',
                    'The prediction matches. Explain the original domain, transformation and complete solution set.',
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

const hint = t(
  '先保留原式条件，再代入；候选数不一定是原方程的解。',
  'Keep the original restrictions before substituting; a candidate need not solve the original equation.',
);
function Task({
  mode,
  name,
  answer,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
}) {
  return (
    <Predict
      key={JSON.stringify(answer)}
      mode={mode}
      name={name}
      answer={answer}
      hint={hint}
    />
  );
}
const num = (value: string | number): AnswerSpec => ({
  kind: 'number',
  value: String(value),
});
const set = (xs: (string | number)[]): AnswerSpec => ({
  kind: 'finite-set',
  value: finiteText(xs),
});
const domain = (value: string): AnswerSpec => ({ kind: 'real-union', value });
function Evidence({
  mode,
  rows,
}: {
  mode: LanguageMode;
  rows: [LocalizedText, string][];
}) {
  return (
    <DataTable
      mode={mode}
      headers={[
        t('核验量', 'Audit quantity'),
        t('精确结果/条件', 'Exact result / condition'),
      ]}
      rows={rows.map(([p, v]) => [word(mode, p), v])}
    />
  );
}
function CompositionFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof compositionAudit>;
}) {
  const inverse = (sign: number) =>
    sampleCurve(
      sign > 0 ? 'inverse-right' : 'inverse-left',
      (y) => sign * Math.sqrt(y) - m.shift,
      0,
      16,
      '#b86b42',
      '7 4',
    );
  return (
    <ConceptPlot
      mode={mode}
      wide
      curves={[
        sampleCurve(
          'H=f∘g',
          (x) => (x + m.shift) ** 2,
          m.branch === 'right' ? -m.shift : -8,
          m.branch === 'left' ? -m.shift : 8,
        ),
        ...(m.branch === 'whole'
          ? [inverse(1), inverse(-1)]
          : [inverse(m.branch === 'right' ? 1 : -1)]),
        sampleCurve('y=x', (x) => x, -16, 16, '#7b9295', '3 5'),
      ]}
      points={
        m.output === null
          ? []
          : [
              { x: m.x, y: m.output, label: 'H' },
              { x: m.output, y: m.x, label: 'swap' },
            ]
      }
      caption={t(
        `f(u)=u²，分支${m.branch}；g(x)=x+(${m.shift})。紫线H，橙虚线为交换坐标后的关系，灰线y=x。whole时橙线有两支，是逆关系而非反函数。H定义域${m.domain}。`,
        `f(u)=u² on branch ${m.branch}; g(x)=x+(${m.shift}). Purple: H; orange dashed: swapped relation; grey: y=x. With the whole domain, orange has two branches and is an inverse relation, not an inverse function. Domain of H: ${m.domain}.`,
      )}
    />
  );
}
function Composition({ mode }: { mode: LanguageMode }) {
  const [shift, S] = useState('1'),
    [branch, B] = useState<SquareBranch>('right'),
    [x, X] = useState('2'),
    m = compositionAudit(+shift, branch, +x);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先走g，再核f的分支；交换坐标前确认一对一。',
            'Apply g first, check the branch of f, and establish one-to-one behaviour before swapping coordinates.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('平移s', 'Shift s')}
        value={shift}
        options={opts([-2, -1, 0, 1, 2])}
        change={S}
      />
      <Select
        mode={mode}
        name={t('f的定义域分支', 'Domain branch of f')}
        value={branch}
        options={[
          ['right', t('u≥0', 'u≥0')],
          ['left', t('u≤0', 'u≤0')],
          ['whole', t('全部实数', 'All real u')],
        ]}
        change={(v) => B(v as SquareBranch)}
      />
      <Select
        mode={mode}
        name={t('输入x', 'Input x')}
        value={x}
        options={opts([-2, -1, 0, 1, 2])}
        change={X}
      />
      <Task
        mode={mode}
        name={t('H(x)=f(g(x))', 'H(x)=f(g(x))')}
        answer={
          m.output === null
            ? { kind: 'function-code', value: 'outside-domain' }
            : num(m.output)
        }
      />
      <Task
        mode={mode}
        name={t('H的定义域', 'Domain of H')}
        answer={domain(m.domain)}
      />
      <Task
        mode={mode}
        name={t('H(x)=9的完整原像', 'All preimages of 9 under H')}
        answer={set(m.inverseCandidates(9))}
      />
      <CompositionFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('中间值g(x)', 'Intermediate g(x)'), String(m.inner)],
            [
              t('反序g(f(x))', 'Reverse order g(f(x))'),
              m.reverse === null ? 'outside-domain' : String(m.reverse),
            ],
            [
              t('一对一/反函数', 'One-to-one / inverse function'),
              m.invertible ? 'invertible' : 'not-invertible',
            ],
            [
              t(
                '反函数输入范围（限制分支时）',
                'Inverse input range when restricted',
              ),
              '[0,∞)',
            ],
            [
              t(
                'H的代数式，定义域另保留',
                'Formula of H; keep its domain separately',
              ),
              m.expression,
            ],
          ]}
        />
      </Audit>
    </>
  );
}
function LogFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof logEquationAudit>;
}) {
  return (
    <ConceptPlot
      mode={mode}
      curves={[
        sampleCurve(
          'original LHS',
          (x) => m.lhs(x)!,
          m.kind === 'exponential' ? -6 : m.shift + 0.03,
          8,
        ),
        sampleCurve('target', () => m.rhs, -10, 10, '#b86b42', '7 4'),
      ]}
      caption={t(
        `原式${m.expression}；定义域${m.domain}。紫线仅在原式有定义处采样，虚线为右侧常量；交点观察不能代替单调性与代回检验。`,
        `Original equation ${m.expression}; domain ${m.domain}. Purple is sampled only on the original domain; dashed is the target. Intersections support inspection, while monotonicity and substitution establish the full solution set.`,
      )}
    />
  );
}
function LogEquations({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<LogEquationKind>('product'),
    [example, E] = useState('1'),
    [base, B] = useState('2'),
    [shift, S] = useState('1'),
    [power, P] = useState('3');
  const m =
    kind === 'product'
      ? logEquationAudit(kind, 2, +example, +example === 1 ? 3 : 4)
      : logEquationAudit(kind, +base, +shift, +power);
  return (
    <>
      <Select
        mode={mode}
        name={t('方程类型', 'Equation family')}
        value={kind}
        options={[
          ['exponential', t('同底指数', 'Equal-base exponential')],
          ['logarithm', t('单对数', 'Single logarithm')],
          ['product', t('两对数相加', 'Sum of two logarithms')],
        ]}
        change={(v) => K(v as LogEquationKind)}
      />
      {kind === 'product' ? (
        <Select
          mode={mode}
          name={t('乘积例子的h', 'Product example h')}
          value={example}
          options={opts([1, 3])}
          change={E}
        />
      ) : (
        <>
          <Select
            mode={mode}
            name={t('底数b', 'Base b')}
            value={base}
            options={opts([2, 3, 4])}
            change={B}
          />
          <Select
            mode={mode}
            name={t('平移h', 'Shift h')}
            value={shift}
            options={opts([-1, 0, 1])}
            change={S}
          />
          <Select
            mode={mode}
            name={t('目标指数k', 'Target exponent k')}
            value={power}
            options={opts([-2, -1, 0, 1, 2, 3])}
            change={P}
          />
        </>
      )}
      <p>{m.expression}</p>
      <Task
        mode={mode}
        name={t('原式定义域', 'Original domain')}
        answer={domain(m.domain)}
      />
      <Task
        mode={mode}
        name={t('原方程完整解集', 'Complete original solution set')}
        answer={set(m.solutions)}
      />
      <LogFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('代数候选数', 'Algebraic candidates'), finiteText(m.candidates)],
            [
              t(
                '通过全部原式条件的解',
                'Solutions passing all original conditions',
              ),
              finiteText(m.solutions),
            ],
            [
              t('合法底数', 'Allowed bases'),
              'b>0, b≠1; controls use b∈{2,3,4}',
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              'log(A)+log(B)合并前必须A>0且B>0；仅AB>0不够。底数在0与1之间仍一对一，本台仅选大于1便于观察。',
              'Combining log(A)+log(B) requires A>0 and B>0; AB>0 alone is insufficient. Bases between zero and one remain one-to-one; these controls use bases greater than one for inspection.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function IdentityFigure({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: IdentityCase;
}) {
  const xs =
    kind === 'quotient' ? [0, 2] : kind === 'tangent' ? [0.5, 1.5] : [0, 1, 2];
  const fn = (x: number) =>
    kind === 'quotient' ? 1 + Math.cos(x * Math.PI) : Math.sin(x * Math.PI);
  const breaks = [...new Set([0, ...xs, 2])].sort((a, b) => a - b);
  return (
    <figure className="math-concept-figure">
      <div
        className="math-concept-scroll"
        role="region"
        tabIndex={0}
        aria-label={word(
          mode,
          t('恒等式图；图内滚动', 'Identity graph; scroll within plot'),
        )}
      >
        <svg
          viewBox="0 0 640 390"
          role="img"
          aria-label={word(
            mode,
            t(
              '原式与延拓及排除点',
              'Original expression, extension and excluded points',
            ),
          )}
        >
          {[0, 0.5, 1, 1.5, 2].map((x) => (
            <g key={x}>
              <path d={`M${70 + 250 * x} 35V315`} stroke="#e1ddea" />
              <text x={70 + 250 * x} y="343" textAnchor="middle">
                {x}
              </text>
            </g>
          ))}
          {[-2, -1, 0, 1, 2].map((y) => (
            <g key={y}>
              <path d={`M70 ${175 - 65 * y}H570`} stroke="#e1ddea" />
              <text x="56" y={180 - 65 * y} textAnchor="end">
                {y}
              </text>
            </g>
          ))}
          <path d="M70 175H580M70 315V25" stroke="currentColor" />
          <polyline
            data-identity-curve="extension"
            points={Array.from({ length: 201 }, (_, i) => {
              const x = i / 100;
              return `${70 + 250 * x},${175 - 65 * fn(x)}`;
            }).join(' ')}
            stroke="#b86b42"
            strokeWidth="3"
            fill="none"
          />
          {breaks.slice(0, -1).map((lo, i) => {
            const hi = breaks[i + 1]!;
            return (
              <polyline
                key={i}
                data-identity-curve="original"
                points={Array.from({ length: 61 }, (_, j) => {
                  const x = lo + ((hi - lo) * j) / 60;
                  return `${70 + 250 * x},${175 - 65 * fn(x)}`;
                }).join(' ')}
                stroke="#6254a1"
                strokeWidth="3"
                strokeDasharray="7 4"
                fill="none"
              />
            );
          })}
          {xs.map((x) => (
            <g key={x} data-excluded-angle={x}>
              <circle
                cx={70 + 250 * x}
                cy={175 - 65 * fn(x)}
                r="7"
                fill="white"
                stroke="#6254a1"
                strokeWidth="2"
              />
              <circle
                cx={70 + 250 * x}
                cy={175 - 65 * fn(x)}
                r="2"
                fill="#b86b42"
              />
            </g>
          ))}
          <text x="570" y="378" textAnchor="end">
            θ/π
          </text>
          <text x="80" y="22">
            y
          </text>
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '横轴为θ/π，显示[0,2]。橙实线为化简式的自然延拓，紫虚线为原式；白圈标原式排除点，中心橙点仅属延拓。两式在原式定义域内相等，不能填平原式的孔。',
            'The horizontal coordinate is θ/π, from 0 to 2. Orange solid is the simplified extension; purple dashed is the original expression. White circles mark excluded original inputs; orange centres belong only to the extension. Equality on the original domain does not fill its holes.',
          )}
        />
      </figcaption>
    </figure>
  );
}
function Identities({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<IdentityCase>('quotient'),
    [angle, A] = useState('0'),
    m = identityAudit(kind, angle);
  return (
    <>
      <Select
        mode={mode}
        name={t('恒等变形例子', 'Identity example')}
        value={kind}
        options={[
          ['quotient', t('s²/(1−c)', 's²/(1−c)')],
          ['tangent', t('(s/c)c', '(s/c)c')],
          ['sine-division', t('(1−c²)/s', '(1−c²)/s')],
        ]}
        change={(v) => K(v as IdentityCase)}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '规定s=sinθ、c=cosθ；化简目标为仅含指定字母的多项式，定义域另核。',
            'Let s=sinθ and c=cosθ. Give a polynomial in the specified letter; audit the domain separately.',
          )}
        />
      </p>
      <Task
        mode={mode}
        name={t(
          `化简结果（仅${m.only}）`,
          `Simplified result (only ${m.only})`,
        )}
        answer={{ kind: 'trig-identity', value: m.rewrite, only: m.only }}
      />
      <Task
        mode={mode}
        name={t(
          '[0,2π]内排除角（写π倍数）',
          'Excluded angles in [0,2π] (multiples of pi)',
        )}
        answer={{
          kind: 'radian-set',
          values: m.excluded,
          value: m.excluded.map((v) => `${v}pi`).join(','),
        }}
      />
      <Select
        mode={mode}
        name={t('探查角θ/π', 'Probe angle θ/π')}
        value={angle}
        options={opts(['0', '1/6', '1/2', '1', '3/2', '2'])}
        change={A}
      />
      <Task
        mode={mode}
        name={t('该角是否属于原式定义域', 'Probe belongs to original domain')}
        answer={{ kind: 'logic-code', value: m.hole ? 'out' : 'in' }}
      />
      <IdentityFigure mode={mode} kind={kind} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('原式', 'Original'), m.original],
            [t('域内化简式', 'Rewrite on original domain'), m.rewrite],
            [
              t('该角原式', 'Original at probe'),
              m.hole ? 'outside-domain' : m.value,
            ],
            [t('延拓在该角的值', 'Extended value at probe'), m.value],
          ]}
        />
      </Audit>
    </>
  );
}
function ParameterFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof parameterAudit>;
}) {
  return (
    <ConceptPlot
      mode={mode}
      wide
      curves={[
        sampleCurve('f(u)=u²+u', (x) => x * x + x, -5, 5, '#7b9295', '5 5'),
        sampleCurve('G', m.value, -8, 8),
      ]}
      points={
        m.x === null
          ? []
          : [
              {
                x: Number(
                  m.x.includes('/')
                    ? m.x
                        .split('/')
                        .map(Number)
                        .reduce((a, b) => a / b)
                    : m.x,
                ),
                y: Number(m.y),
                label: 'mapped',
              },
            ]
      }
      caption={t(
        `G(x)=${m.a}f(${m.b}(x−(${m.h})))+(${m.k})，f(u)=u²+u。灰虚线是源图，紫线是G。b≠0时(u,f(u))映为(h+u/b,af(u)+k)，a或b为0需单独分析。`,
        `G(x)=${m.a}f(${m.b}(x−(${m.h})))+(${m.k}), f(u)=u²+u. Grey dashed is the source and purple is G. For b≠0, (u,f(u)) maps to (h+u/b,af(u)+k). Treat a=0 or b=0 separately.`,
      )}
    />
  );
}
function Parameters({ mode }: { mode: LanguageMode }) {
  const [a, A] = useState('2'),
    [b, B] = useState('2'),
    [h, H] = useState('1'),
    [k, K] = useState('-1'),
    [u, U] = useState('1'),
    m = parameterAudit(+a, +b, +h, +k, +u);
  return (
    <>
      {[
        ['a', a, A],
        ['b', b, B],
        ['h', h, H],
        ['k', k, K],
        ['u', u, U],
      ].map(([name, v, change]) => (
        <Select
          key={String(name)}
          mode={mode}
          name={t(`参数${name}`, `Parameter ${name}`)}
          value={v as string}
          options={opts([-2, -1, 0, 1, 2])}
          change={change as (s: string) => void}
        />
      ))}
      <p>f(u)=u²+u; G(x)=a f(b(x−h))+k</p>
      <Task
        mode={mode}
        name={t('源输入u对应的x', 'x corresponding to source input u')}
        answer={
          m.x === null
            ? { kind: 'function-code', value: m.preimageCode! }
            : num(m.x)
        }
      />
      <Task
        mode={mode}
        name={t('G的多项式', 'Polynomial for G')}
        answer={{
          kind: 'polynomial',
          variables: ['x'],
          value: m.expression,
          collected: true,
        }}
      />
      <Task
        mode={mode}
        name={t('G(1)', 'G(1)')}
        answer={num(m.exactValue(1))}
      />
      <ParameterFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('源点', 'Source point'), `(${u},${m.sourceY})`],
            [
              t(
                '映射点；b0时未唯一指定',
                'Mapped point; not uniquely specified when b=0',
              ),
              m.x === null ? m.preimageCode! : `(${m.x},${m.y})`,
            ],
            [
              t('水平长度因子', 'Horizontal length factor'),
              m.horizontalScale ?? 'not applicable',
            ],
            [t('是否恒定', 'Constant graph'), String(m.constant)],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              'b=0时内部恒0：u≠0无对应x；u=0对应全部x，不能指定唯一点。此时G恒k。a=0时G也恒k；仍要保留原模型全部实数的定义域。',
              'When b=0 the inner input is always zero: u≠0 has no corresponding x, while u=0 has every x, so no unique point is specified. G is then k. It is also k when a=0; retain this polynomial model’s full real domain.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function SolutionFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof solutionAudit>;
}) {
  const curves =
    m.kind === 'rational'
      ? [
          sampleCurve('LHS left', (x) => x + m.p, -8, m.p - 0.002),
          sampleCurve('LHS right', (x) => x + m.p, m.p + 0.002, 8),
        ]
      : [
          sampleCurve(
            'original LHS',
            (x) => m.lhs(x)!,
            m.kind === 'radical' ? -m.p : -8,
            8,
          ),
        ];
  return (
    <ConceptPlot
      mode={mode}
      curves={[
        ...curves,
        sampleCurve('original RHS', m.rhs, -10, 10, '#b86b42', '7 4'),
      ]}
      ends={
        m.kind === 'rational'
          ? [{ x: m.p, y: 2 * m.p, closed: false }]
          : m.kind === 'radical'
            ? [{ x: -m.p, y: 0, closed: true }]
            : []
      }
      points={m.rows
        .filter((r) => r.valid)
        .map((r) => ({ x: r.x, y: r.left!, label: 'solution' }))}
      caption={t(
        `原式${m.expression}，定义域${m.domain}。紫线原左侧、虚线原右侧，仅标已核验的交点。空心点不是交点；图示视窗不能证明域外没有更多解。`,
        `Original ${m.expression}, domain ${m.domain}. Purple is the original left side and dashed the original right side; only verified intersections are marked. An open point is excluded. A finite graph window cannot prove completeness.`,
      )}
    />
  );
}
function Solutions({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<EquationAuditCase>('radical'),
    [p, P] = useState('2'),
    [target, T] = useState('hole');
  const parameter =
    kind === 'radical'
      ? p === '6'
        ? 6
        : 2
      : kind === 'rational'
        ? 2
        : kind === 'absolute'
          ? 1
          : 3;
  const q =
      kind === 'rational'
        ? target === 'hole'
          ? 4
          : 5
        : kind === 'absolute'
          ? target === 'negative'
            ? -1
            : target === 'zero'
              ? 0
              : 2
          : 0,
    m = solutionAudit(kind, parameter, q);
  return (
    <>
      <Select
        mode={mode}
        name={t('审查类型', 'Audit family')}
        value={kind}
        options={[
          ['radical', t('开方与平方', 'Square roots and squaring')],
          ['rational', t('约分与孔', 'Cancellation and holes')],
          ['absolute', t('绝对值分支', 'Absolute-value branches')],
          [
            'product',
            t('除以未知数会丢解', 'Dividing by an unknown loses roots'),
          ],
        ]}
        change={(v) => {
          K(v as EquationAuditCase);
          T(v === 'rational' ? 'hole' : 'other');
        }}
      />
      {kind === 'radical' && (
        <Select
          mode={mode}
          name={t('根号内加数', 'Radicand shift')}
          value={p}
          options={opts([2, 6])}
          change={P}
        />
      )}
      {(kind === 'rational' || kind === 'absolute') && (
        <Select
          mode={mode}
          name={t('右侧情形', 'Right-side case')}
          value={target}
          options={
            kind === 'rational'
              ? [
                  ['hole', t('解落在孔', 'Candidate at hole')],
                  ['other', t('有效交点', 'Valid intersection')],
                ]
              : [
                  ['negative', t('负数', 'Negative')],
                  ['zero', t('零', 'Zero')],
                  ['other', t('正数', 'Positive')],
                ]
          }
          change={T}
        />
      )}
      <p>{m.expression}</p>
      <Task
        mode={mode}
        name={t('完整实数解集', 'Complete real solution set')}
        answer={set(m.solutions)}
      />
      <Task
        mode={mode}
        name={t('原式定义域', 'Original domain')}
        answer={domain(m.domain)}
      />
      <SolutionFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          name={t('候选数逐项审查', 'Candidate-by-candidate audit')}
          headers={[
            t('候选', 'Candidate'),
            t('原域内', 'In original domain'),
            t('平方符号条件', 'Sign for squaring'),
            t('原左侧', 'Original LHS'),
            t('原右侧', 'Original RHS'),
            t('保留', 'Retain'),
          ]}
          rows={m.rows.map((r) => [
            r.x,
            String(r.domain),
            String(r.sign),
            r.left === null ? 'undefined' : String(r.left),
            String(r.right),
            String(r.valid),
          ])}
        />
        <Evidence
          mode={mode}
          rows={[
            [t('候选集', 'Candidate set'), finiteText(m.candidates)],
            [t('最终解集', 'Final solution set'), finiteText(m.solutions)],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '无候选或全被排除写∅；绝对值右侧0只有一个根。对sqrt(x+h)=x，负候选可在原域内却不满足原式，不能只查根号有定义。',
              'Use ∅ for no candidates or all rejected. A zero absolute-value target gives one root. For sqrt(x+h)=x, a negative candidate can lie in the original domain yet fail the equation; checking the radicand alone is insufficient.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function AdvancedEquationLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'equation-composition' ? (
        <Composition mode={mode} />
      ) : kind === 'equation-logarithms' ? (
        <LogEquations mode={mode} />
      ) : kind === 'equation-identities' ? (
        <Identities mode={mode} />
      ) : kind === 'equation-parameters' ? (
        <Parameters mode={mode} />
      ) : (
        <Solutions mode={mode} />
      )}
    </section>
  );
}
export function AdvancedEquationHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'equation-composition')
    return (
      <CompositionFigure mode={mode} m={compositionAudit(1, 'whole', 2)} />
    );
  if (kind === 'equation-logarithms')
    return <LogFigure mode={mode} m={logEquationAudit('product', 2, 1, 3)} />;
  if (kind === 'equation-identities')
    return <IdentityFigure mode={mode} kind="quotient" />;
  if (kind === 'equation-parameters')
    return <ParameterFigure mode={mode} m={parameterAudit(2, 2, 1, -1, 1)} />;
  return <SolutionFigure mode={mode} m={solutionAudit('radical', 2, 0)} />;
}
