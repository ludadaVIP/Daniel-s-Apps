import { useState, useId, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { DataFigure, DataTable } from './DataModellingVisuals';
import { ConceptPlot, sampleCurve } from './FunctionConceptVisuals';
import { valueR } from './rationalModels';
import {
  inductionAudit,
  recurrenceAudit,
  shortestAudit,
  graphCase,
  bisectionAudit,
  matrices,
  matrixApply,
  matrixProduct,
  matrixText,
  matrixDet,
  type InductionCase,
  type RecurrenceCase,
  type GraphSpec,
  type GraphCase,
  type Matrix2,
  type NumericalCase,
} from './extensionModels';
type Kind = Extract<Lesson['lab'], `extension-${string}`>;
export const isExtensionLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('extension-');
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
                    '预测符合。请用定义、计算过程与适用条件解释。',
                    'The prediction matches. Explain the definition, calculation and conditions.',
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
  '先核规则和前提，再按步骤重算；注意起点、方向和误差界。',
  'Check the rule and prerequisites, then recalculate. Watch the starting index, direction and error bound.',
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

function InductionFigure({
  mode,
  kind,
  n,
}: {
  mode: LanguageMode;
  kind: InductionCase;
  n: number;
}) {
  const m = inductionAudit(kind, n);
  return (
    <DataFigure
      mode={mode}
      name={t('归纳链示意', 'Induction chain')}
      caption={t(
        '实线箭头表示假设P(k)后推出P(k+1)，不是单独计算下一例。缺基例时链条没有真起点；叉号表示环节失败。有限图只画前六项。',
        'Solid arrows mean P(k) implies P(k+1), not merely that another case was calculated. A missing base leaves no true starting point; crosses mark a broken link. The finite picture shows only six terms.',
      )}
    >
      <svg
        viewBox="0 0 640 230"
        role="img"
        aria-label={word(mode, t('起点与传递步骤', 'Base and propagation'))}
      >
        <text x="30" y="30">
          P(n):{' '}
          {kind === 'missing-base'
            ? 'Σ(2i−1)=n²+1'
            : kind === 'broken-step'
              ? 'Σ(2i−1)=n'
              : 'Σ(2i−1)=n²'}
        </text>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} data-induction-link={i + 1}>
            <circle
              cx={55 + i * 103}
              cy="92"
              r="26"
              fill={i === 0 && !m.base ? 'white' : '#ebe6f5'}
              stroke="#6254a1"
              strokeDasharray={i === 0 && !m.base ? '5 4' : undefined}
            />
            <text x={55 + i * 103} y="98" textAnchor="middle">
              {i + 1}
            </text>
            {i < 5 && (
              <text x={106 + i * 103} y="98" textAnchor="middle">
                {m.step ? '⇒' : kind === 'finite' ? '?' : '×'}
              </text>
            )}
          </g>
        ))}
        <text x="30" y="157">
          {word(mode, t('实际', 'Actual'))} k={n}: {m.sum} + {m.next} ={' '}
          {m.nextSquare}
        </text>
        <text x="30" y="200">
          {word(
            mode,
            m.provesAll
              ? t('基例✓；任意k步骤✓', 'Base ✓; arbitrary-k step ✓')
              : t(
                  '当前材料不足以证明全体',
                  'Current evidence does not prove all cases',
                ),
          )}
        </text>
      </svg>
    </DataFigure>
  );
}
function Induction({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<InductionCase>('odd'),
    [n, N] = useState(4),
    m = inductionAudit(kind, n);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先判断证明结构，再显示核验。P(n)的范围为所有整数n≥1。观察项数滑块只改变例子，不扩大证明范围。',
            'Judge the proof structure before revealing the audit. P(n) concerns every integer n≥1. Changing the displayed index changes an example, not the scope of a proof.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('证明材料', 'Proof evidence')}
        value={kind}
        options={[
          [
            'odd',
            t('奇数和：基例与任意k步骤', 'Odd sum: base and arbitrary-k step'),
          ],
          [
            'missing-base',
            t('错误命题n²+1：只有传递', 'False claim n²+1: propagation only'),
          ],
          ['broken-step', t('错误命题n：只有基例', 'False claim n: base only')],
          ['finite', t('奇数和：只验证六项', 'Odd sum: six checks only')],
        ]}
        change={(v) => K(v as InductionCase)}
      />
      <Select
        mode={mode}
        name={t('展示索引k', 'Displayed index k')}
        value={String(n)}
        options={opts([1, 2, 3, 4, 5, 6, 8, 12])}
        change={(v) => N(Number(v))}
      />
      <Task
        mode={mode}
        name={t(
          '材料证明所有n≥1（true/false）',
          'Evidence proves every n≥1 (true/false)',
        )}
        answer={{ kind: 'logic-code', value: m.provesAll ? 'true' : 'false' }}
      />
      <Task
        mode={mode}
        name={t('从k到k+1新增的奇数', 'New odd summand from k to k+1')}
        answer={num(m.next)}
      />
      <InductionFigure mode={mode} kind={kind} n={n} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('真实前k项和', 'Actual first-k sum'), String(m.sum)],
            [t('材料声称的值', 'Claimed value'), String(m.claimed)],
            [t('基例成立', 'Base established'), String(m.base)],
            [
              t('任意k的传递成立', 'Arbitrary-k implication established'),
              String(m.step),
            ],
            [
              t('完整归纳证明', 'Complete induction proof'),
              String(m.provesAll),
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '归纳假设是暂用P(k)，再加2k+1得到k²+2k+1=(k+1)²。n²+1的传递代数虽成立，n=1却给1=2；有限检查没有任意k步骤。',
              'Assume P(k), then add 2k+1 to obtain k²+2k+1=(k+1)². The n²+1 propagation is algebraically valid, but its base says 1=2. Finite checks supply no arbitrary-k implication.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function RecurrenceFigure({
  mode,
  rows,
  rule,
  maskedIndex,
}: {
  mode: LanguageMode;
  rows: string[][];
  rule: string;
  maskedIndex?: number;
}) {
  return (
    <DataFigure
      mode={mode}
      name={t('递推状态链', 'Recurrence state chain')}
      caption={t(
        '方框只画有定义的离散项，不用连续曲线补造中间项。两阶规则需要两项初值。',
        'Boxes show defined discrete terms only; no continuous curve invents intermediate terms. A second-order rule needs two initial values.',
      )}
    >
      <svg
        viewBox="0 0 640 210"
        role="img"
        aria-label={word(
          mode,
          t('初值决定递推', 'Initial values determine a recurrence'),
        )}
      >
        <text x="24" y="30">
          {rule}
        </text>
        {rows.slice(0, 6).map(([i, v], j) => (
          <g key={i} data-recurrence-index={i}>
            <rect
              x={22 + j * 103}
              y="65"
              width="82"
              height="72"
              rx="8"
              fill="#ebe6f5"
              stroke="#6254a1"
            />
            <text x={63 + j * 103} y="91" textAnchor="middle">
              u({i})
            </text>
            <text x={63 + j * 103} y="121" textAnchor="middle">
              {Number(i) === maskedIndex ? '?' : v}
            </text>
            {j < Math.min(rows.length, 6) - 1 && (
              <text x={115 + j * 103} y="108" textAnchor="middle">
                →
              </text>
            )}
          </g>
        ))}
        <text x="24" y="181">
          {word(
            mode,
            t(
              '从n=0开始，逐项代入',
              'Start at n=0 and substitute term by term',
            ),
          )}
        </text>
      </svg>
    </DataFigure>
  );
}
function Recurrences({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<RecurrenceCase>('affine'),
    [n, N] = useState(4),
    [seed, S] = useState(1),
    [p, P] = useState(2),
    [q, Q] = useState(1),
    m = recurrenceAudit(kind, n, seed, p, q);
  return (
    <>
      <Select
        mode={mode}
        name={t('递推类型', 'Recurrence type')}
        value={kind}
        options={[
          ['affine', t('一次仿射递推', 'First-order affine recurrence')],
          ['fibonacci', t('二阶相加递推', 'Second-order addition')],
          ['missing-seed', t('缺失第二个初值', 'Missing second initial value')],
        ]}
        change={(v) => K(v as RecurrenceCase)}
      />
      {kind === 'affine' && (
        <>
          <Select
            mode={mode}
            name={t('初值u(0)', 'Initial u(0)')}
            value={String(seed)}
            options={opts([-2, 0, 1, 3])}
            change={(v) => S(Number(v))}
          />
          <Select
            mode={mode}
            name={t('乘数p', 'Multiplier p')}
            value={String(p)}
            options={opts([-1, 0, 1, 2])}
            change={(v) => P(Number(v))}
          />
          <Select
            mode={mode}
            name={t('加数q', 'Addition q')}
            value={String(q)}
            options={opts([-1, 0, 1, 2])}
            change={(v) => Q(Number(v))}
          />
        </>
      )}
      <Select
        mode={mode}
        name={t('所求索引n', 'Requested index n')}
        value={String(n)}
        options={opts([0, 1, 2, 3, 4, 5, 8, 12])}
        change={(v) => N(Number(v))}
      />
      <p>{m.rule}</p>
      <Task
        mode={mode}
        name={t('所求项或insufficient', 'Requested term or insufficient')}
        answer={
          kind === 'missing-seed'
            ? n === 0
              ? num(0)
              : { kind: 'sequence-code', value: 'insufficient' }
            : num(m.value!)
        }
      />
      <RecurrenceFigure
        mode={mode}
        rows={m.rows}
        rule={m.rule}
        maskedIndex={n}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[t('索引n', 'Index n'), t('u(n)', 'u(n)')]}
          rows={m.rows}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              'u(n+1)=2u(n)+1、u(0)=1时，令v(n)=u(n)+1，得v(n+1)=2v(n)，所以u(n)=2^(n+1)−1。改成p=1时不能除以p−1，应单独得到u(n)=u(0)+nq。缺初值不代表没有任何解，而是不能唯一确定；本例n=0仍知为0。',
              'For u(n+1)=2u(n)+1 with u(0)=1, set v(n)=u(n)+1 to get v(n+1)=2v(n), hence u(n)=2^(n+1)−1. At p=1 do not divide by p−1; use u(n)=u(0)+nq. A missing seed means non-uniqueness, not impossibility; u(0) remains known here.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
const nodePositions: Record<string, [number, number]> = {
  A: [70, 175],
  B: [230, 70],
  C: [230, 280],
  D: [410, 280],
  E: [565, 175],
  F: [410, 70],
};
function GraphFigure({ mode, g }: { mode: LanguageMode; g: GraphSpec }) {
  const id = useId().replace(/:/g, '');
  return (
    <DataFigure
      mode={mode}
      name={t('带权网络', 'Weighted network')}
      caption={t(
        '边旁数字是通行成本；线段长度不代表成本。箭头只允许指定方向；无箭头可双向。所有边权非负，路线从A到E，禁止重复顶点。',
        'Numbers on edges are travel costs; drawn lengths do not encode cost. Arrows permit one direction; unmarked edges are bidirectional. All weights are nonnegative; routes run from A to E without repeated vertices.',
      )}
    >
      <svg
        viewBox="0 0 640 350"
        role="img"
        aria-label={word(
          mode,
          t('A到E的路线网络', 'Route network from A to E'),
        )}
      >
        <defs>
          <marker
            id={id}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8" fill="#6254a1" />
          </marker>
        </defs>
        {g.edges.map(([a, b, w]) => {
          const [x, y] = nodePositions[a]!,
            [xx, yy] = nodePositions[b]!,
            d = Math.hypot(xx - x, yy - y),
            ex = xx - ((xx - x) * 25) / d,
            ey = yy - ((yy - y) * 25) / d;
          return (
            <g key={a + b} data-edge={a + b}>
              <line
                x1={x}
                y1={y}
                x2={ex}
                y2={ey}
                stroke="#6254a1"
                strokeWidth="3"
                markerEnd={g.directed ? `url(#${id})` : undefined}
              />
              <rect
                x={(x + xx) / 2 - 14}
                y={(y + yy) / 2 - 14}
                width="28"
                height="28"
                rx="5"
                fill="white"
              />
              <text x={(x + xx) / 2} y={(y + yy) / 2 + 6} textAnchor="middle">
                {w}
              </text>
            </g>
          );
        })}
        {g.nodes.map((n) => {
          const [x, y] = nodePositions[n]!;
          return (
            <g key={n} data-graph-node={n}>
              <circle cx={x} cy={y} r="23" fill="#ebe6f5" stroke="#6254a1" />
              <text x={x} y={y + 6} textAnchor="middle">
                {n}
              </text>
            </g>
          );
        })}
      </svg>
    </DataFigure>
  );
}
function Graphs({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<GraphCase>('standard'),
    g = graphCase(kind),
    m = shortestAudit(g);
  return (
    <>
      <Select
        mode={mode}
        name={t('网络情形', 'Network case')}
        value={kind}
        options={[
          ['standard', t('常规网络', 'Standard network')],
          ['trap', t('局部最便宜陷阱', 'Locally cheapest trap')],
          ['ties', t('并列最短路', 'Tied shortest routes')],
          ['disconnected', t('终点不可达', 'Unreachable goal')],
          ['directed', t('单向网络', 'Directed network')],
          ['zero', t('含零成本边', 'Zero-cost edges')],
        ]}
        change={(v) => K(v as GraphCase)}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '按顺序用连字符连接顶点，如A-…-E；无路径写unreachable，成本栏写not-reached。',
            'Join route vertices in order with hyphens, as A-…-E. If no route exists, enter unreachable for the route and not-reached for the cost.',
          )}
        />
      </p>
      <Task
        key={kind}
        mode={mode}
        name={t('一条最短简单路径', 'One shortest simple route')}
        answer={{
          kind: 'graph-route',
          graph: g,
          value:
            m.distance === null
              ? 'unreachable'
              : kind === 'standard'
                ? 'A-B-C-D-E'
                : kind === 'ties'
                  ? 'A-B-E'
                  : kind === 'zero'
                    ? 'A-E'
                    : 'A-C-D-E',
        }}
      />
      <Task
        mode={mode}
        name={t('最短总成本或not-reached', 'Minimum cost or not-reached')}
        answer={
          m.distance === null
            ? { kind: 'sequence-code', value: 'not-reached' }
            : num(m.distance)
        }
      />
      <GraphFigure mode={mode} g={g} />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('确定顶点', 'Settled vertex'),
            ...g.nodes.map((n) => t(n, n)),
          ]}
          rows={m.rows.map((r) => [
            r.node,
            ...g.nodes.map((n) =>
              Number.isFinite(r.labels[n]) ? String(r.labels[n]) : '∞',
            ),
          ])}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '每轮选全体未确定顶点中暂定距离最小者，再松弛相邻边：d(v)=min(d(v),d(u)+w)。非负边权保证该距离可以确定，不是“沿当前点最便宜的边走”。∞表示未找到路径，不是一条长度很大的实际边。',
              'Choose the globally smallest unsettled tentative distance, then relax adjacent edges: d(v)=min(d(v),d(u)+w). Nonnegative weights justify settling that distance. This is not taking the cheapest outgoing edge. Infinity means no path found, not an actual very long edge.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function MatrixFigure({
  mode,
  m,
  p = ['1', '2'],
}: {
  mode: LanguageMode;
  m: Matrix2;
  p?: readonly [string, string];
}) {
  const q = matrixApply(m, p),
    e1 = matrixApply(m, ['1', '0']),
    e2 = matrixApply(m, ['0', '1']);
  return (
    <ConceptPlot
      mode={mode}
      curves={(
        [
          [e1, '#c47b30'],
          [e2, '#6254a1'],
          [q, '#34846a'],
        ] as [readonly [string, string], string][]
      ).map(([v, c], i) => ({
        name: `vector${i}`,
        color: String(c),
        points: [
          { x: 0, y: 0 },
          { x: valueR(v[0]!), y: valueR(v[1]!) },
        ],
      }))}
      points={[
        { x: valueR(e1[0]), y: valueR(e1[1]), label: 'M e1' },
        { x: valueR(e2[0]), y: valueR(e2[1]), label: 'M e2' },
        { x: valueR(q[0]), y: valueR(q[1]), label: 'M v' },
      ]}
      caption={t(
        `列向量约定，输入v=(${p.join(',')})。橙色、紫色分别表示e1、e2的像，绿色表示v的像。由两根基向量的像构造复合矩阵，再打开核验。图保持等单位。`,
        `Column-vector convention, input v=(${p.join(',')}). Orange and purple show the images of e1 and e2; green shows the image of v. Build the composite matrix from the two basis images before revealing the audit. Axes use equal units.`,
      )}
    />
  );
}
function Matrices({ mode }: { mode: LanguageMode }) {
  const [a, A] = useState<keyof typeof matrices>('stretch'),
    [b, B] = useState<keyof typeof matrices>('rotate'),
    [order, O] = useState('AB'),
    m =
      order === 'AB'
        ? matrixProduct(matrices[a], matrices[b])
        : matrixProduct(matrices[b], matrices[a]),
    p = ['1', '2'] as const,
    q = matrixApply(m, p);
  const names: Record<keyof typeof matrices, LocalizedText> = {
    stretch: t('水平伸长', 'Horizontal stretch'),
    rotate: t('逆时针90°', '90° anticlockwise'),
    shear: t('水平错切', 'Horizontal shear'),
    collapse: t('投影到x轴', 'Projection onto x-axis'),
    zero: t('零变换', 'Zero map'),
    identity: t('恒等变换', 'Identity'),
  };
  const options = Object.entries(names) as [
    keyof typeof matrices,
    LocalizedText,
  ][];
  return (
    <>
      <Select
        mode={mode}
        name={t('变换A', 'Transformation A')}
        value={a}
        options={options}
        change={(v) => A(v as keyof typeof matrices)}
      />
      <Select
        mode={mode}
        name={t('变换B', 'Transformation B')}
        value={b}
        options={options}
        change={(v) => B(v as keyof typeof matrices)}
      />
      <Select
        mode={mode}
        name={t('复合顺序', 'Composition order')}
        value={order}
        options={[
          ['AB', t('AB：先B，后A', 'AB: B first, then A')],
          ['BA', t('BA：先A，后B', 'BA: A first, then B')],
        ]}
        change={O}
      />
      <p>
        A={matrixText(matrices[a])}; B={matrixText(matrices[b])}; v=(1,2)
      </p>
      <Task
        mode={mode}
        name={t('复合矩阵[a,b;c,d]', 'Composite matrix [a,b;c,d]')}
        answer={{ kind: 'matrix2', value: matrixText(m) }}
      />
      <Task
        mode={mode}
        name={t('复合后的向量坐标', 'Transformed vector coordinates')}
        answer={{ kind: 'coordinate', value: `(${q.join(',')})` }}
      />
      <MatrixFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('复合矩阵', 'Composite matrix'), matrixText(m)],
            [t('e1的像', 'Image of e1'), matrixApply(m, ['1', '0']).join(',')],
            [t('e2的像', 'Image of e2'), matrixApply(m, ['0', '1']).join(',')],
            [t('有向面积倍率det', 'Signed area factor det'), matrixDet(m)],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '列向量约定中(AB)v=A(Bv)，右边先作用。先看两根基向量的像再拼矩阵。det=0时二维图形压到线或点，原输入通常不能唯一找回；不能随意使用逆矩阵。',
              'With column vectors, (AB)v=A(Bv): the right-hand map acts first. Build the matrix from the two basis images. At det=0, a plane figure collapses to a line or point, so the input generally cannot be uniquely recovered; an inverse is unavailable.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function NumericalFigure({
  mode,
  kind,
  steps,
}: {
  mode: LanguageMode;
  kind: NumericalCase;
  steps: number;
}) {
  const m = bisectionAudit(kind, steps),
    broken = kind === 'discontinuous',
    f = (x: number) => (broken ? 1 / x : x * x - m.c);
  const curves = broken
    ? [-1, 1].map((s) =>
        sampleCurve(`branch${s}`, f, s < 0 ? -2 : 0.12, s < 0 ? -0.12 : 2),
      )
    : [sampleCurve('f', f, -2.5, 3.2)];
  return (
    <>
      <ConceptPlot
        mode={mode}
        curves={curves}
        points={[
          { x: valueR(m.lo), y: 0, label: 'L' },
          { x: valueR(m.hi), y: 0, label: 'U' },
        ]}
        caption={t(
          `函数${broken ? '1/x' : `x²−${m.c}`}，当前端点[${m.lo},${m.hi}]。端点符号异号还需要闭区间连续；不连续反例的两支没有穿过零点。图不能代替连续性与误差论证。`,
          `Function ${broken ? '1/x' : `x²−${m.c}`}; current endpoints [${m.lo},${m.hi}]. Opposite endpoint signs still require continuity on the closed interval. The discontinuous example has separate branches with no zero. The plot does not replace continuity or an error argument.`,
        )}
      />
      {(m.status === 'bracket' || m.status === 'exact') && (
        <DataFigure
          mode={mode}
          name={t('当前区间放大示意', 'Current interval zoom')}
          caption={t(
            '此条单独放大当前区间，不与上方函数图共用尺度。L、U是当前端点，M是更新后的区间中点；先计算M与半宽，再打开核验。精确命中时区间退为一点。',
            'This strip magnifies the current interval on its own scale. L and U are the current endpoints; M is the updated interval midpoint. Calculate M and half-width before revealing the audit. An exact hit collapses the interval to one point.',
          )}
        >
          <svg
            viewBox="0 0 640 160"
            role="img"
            aria-label={word(
              mode,
              t('根包围区间与中点', 'Root enclosure and midpoint'),
            )}
          >
            {m.lo === m.hi ? (
              <>
                <circle cx="320" cy="70" r="6" fill="#6254a1" />
                <text x="320" y="42" textAnchor="middle">
                  L=M=U
                </text>
                <text x="320" y="110" textAnchor="middle">
                  {m.lo}
                </text>
              </>
            ) : (
              <>
                <line
                  x1="80"
                  y1="70"
                  x2="560"
                  y2="70"
                  stroke="#6254a1"
                  strokeWidth="4"
                />
                {[80, 320, 560].map((x, i) => (
                  <g key={x}>
                    <line
                      x1={x}
                      y1="57"
                      x2={x}
                      y2="83"
                      stroke="#6254a1"
                      strokeWidth="2"
                    />
                    <text x={x} y="40" textAnchor="middle">
                      {['L', 'M', 'U'][i]}
                    </text>
                    <text x={x} y="115" textAnchor="middle">
                      {[m.lo, '(L+U)/2', m.hi][i]}
                    </text>
                  </g>
                ))}
              </>
            )}
          </svg>
        </DataFigure>
      )}
    </>
  );
}
function Numerical({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<NumericalCase>('sqrt2'),
    [steps, S] = useState(3),
    m = bisectionAudit(kind, steps),
    valid = m.status === 'bracket' || m.status === 'exact';
  return (
    <>
      <Select
        mode={mode}
        name={t('函数与初始区间', 'Function and initial interval')}
        value={kind}
        options={[
          ['sqrt2', t('x²−2；[1,2]', 'x²−2; [1,2]')],
          ['sqrt3', t('x²−3；[1,2]', 'x²−3; [1,2]')],
          ['exact', t('x²−4；[1,3]', 'x²−4; [1,3]')],
          ['endpoint', t('x²−4；[2,3]', 'x²−4; [2,3]')],
          ['same-sign', t('x²−2；[2,3]', 'x²−2; [2,3]')],
          ['discontinuous', t('1/x；[−1,1]', '1/x; [−1,1]')],
          ['even-root', t('x²；[−1,1]', 'x²; [−1,1]')],
        ]}
        change={(v) => K(v as NumericalCase)}
      />
      <Select
        mode={mode}
        name={t('二分更新次数', 'Bisection updates')}
        value={String(steps)}
        options={opts([0, 1, 2, 3, 4, 6, 8, 12])}
        change={(v) => S(Number(v))}
      />
      <Task
        mode={mode}
        name={t(
          '当前是否得到有保证的包围（true/false）',
          'Certified enclosure obtained (true/false)',
        )}
        answer={{ kind: 'logic-code', value: valid ? 'true' : 'false' }}
      />
      {valid && (
        <>
          <Task
            key={`${kind}:${steps}:mid`}
            mode={mode}
            name={t(
              '当前区间中点近似值',
              'Current interval midpoint approximation',
            )}
            answer={num(m.mid)}
          />
          <Task
            key={`${kind}:${steps}:error`}
            mode={mode}
            name={t('中点绝对误差上界', 'Midpoint absolute-error bound')}
            answer={num(m.error)}
          />
        </>
      )}
      <NumericalFigure mode={mode} kind={kind} steps={steps} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('算法状态', 'Algorithm status'), m.status],
            [t('完成更新数', 'Completed updates'), String(m.halvings)],
            [t('区间端点', 'Interval endpoints'), `[${m.lo},${m.hi}]`],
            ...(valid
              ? [
                  [t('中点近似', 'Midpoint approximation'), m.mid] as [
                    LocalizedText,
                    string,
                  ],
                  [t('绝对误差上界', 'Absolute-error bound'), m.error] as [
                    LocalizedText,
                    string,
                  ],
                ]
              : []),
          ]}
        />
        <DataTable
          mode={mode}
          headers={[
            t('步', 'Step'),
            t('旧下端点', 'Old lower'),
            t('旧上端点', 'Old upper'),
            t('所试中点', 'Tested midpoint'),
            t('f中点符号', 'Sign at midpoint'),
          ]}
          rows={m.rows.map((r) => [r.step, r.lo, r.hi, r.mid, r.sign])}
          name={t('二分更新记录表', 'Bisection update table')}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '先检查连续性和端点根，再要求异号。每次保留含根的半区间；更新n次后宽≤初始宽/2^n，中点绝对误差≤当前宽/2。残差|f(m)|不是自动等于横坐标误差。同号只能说本判据不适用，不能断言无根（如x²的偶重根）。',
              'Check continuity and endpoint roots before requiring opposite signs. Retain a half-interval containing a root; after n updates its width is at most initial width/2^n. Midpoint absolute error is at most half the current width. Residual |f(m)| is not automatically coordinate error. Same signs mean this test is inconclusive, not that no root exists, as x² shows.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function ExtensionLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'extension-induction' ? (
        <Induction mode={mode} />
      ) : kind === 'extension-recurrence' ? (
        <Recurrences mode={mode} />
      ) : kind === 'extension-graphs' ? (
        <Graphs mode={mode} />
      ) : kind === 'extension-matrices' ? (
        <Matrices mode={mode} />
      ) : (
        <Numerical mode={mode} />
      )}
    </section>
  );
}
export function ExtensionHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'extension-induction')
    return <InductionFigure mode={mode} kind="odd" n={4} />;
  if (kind === 'extension-recurrence') {
    const m = recurrenceAudit('affine', 4);
    return <RecurrenceFigure mode={mode} rows={m.rows} rule={m.rule} />;
  }
  if (kind === 'extension-graphs')
    return <GraphFigure mode={mode} g={graphCase('trap')} />;
  if (kind === 'extension-matrices')
    return (
      <MatrixFigure
        mode={mode}
        m={matrixProduct(matrices.stretch, matrices.rotate)}
      />
    );
  return <NumericalFigure mode={mode} kind="sqrt2" steps={3} />;
}
