import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { realSetText } from './inequalityModels';
import { unionText } from './logicModels';
import {
  mappingModel,
  mappingAt,
  representationAt,
  propertyModel,
  auditOrderedPair,
  transformModel,
  transformedAt,
  defaultTransform,
  inverseModel,
  piecewiseModel,
  piecewiseAt,
  piecewiseBudget,
  rationalNumber,
  type MappingKind,
  type RepresentationKind,
  type Family,
  type IntervalPart,
  type TransformParams,
  type InverseKind,
  type PieceKind,
} from './functionConceptModels';
import {
  ConceptPlot,
  MappingView,
  FamilyView,
  TransformView,
  InverseView,
  PiecewiseView,
  sampleCurve,
} from './FunctionConceptVisuals';
export type FunctionConceptLabKind = Extract<
  Lesson['lab'],
  `concept-${string}`
>;
export const isFunctionConceptLab = (
  kind: Lesson['lab'],
): kind is FunctionConceptLabKind => kind.startsWith('concept-');
const word = (mode: LanguageMode, v: LocalizedText) =>
  mode === 'en' ? v.en : v.zh;
function Task({
  mode,
  name,
  prompt,
  answer,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  prompt: LocalizedText;
  answer: AnswerSpec;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-concept-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={word(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
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
              checkAnswer(input, answer)
                ? t(
                    '预测符合。说明定义域、条件与完整推理；图示和几个成功例不代替证明。',
                    'The prediction matches. Explain the domain, conditions and full reasoning; a graph and a few successful cases do not replace proof.',
                  )
                : t(
                    '重新核定义域、所问对象、方向和边界。值域是实际输出，反函数也必须是函数。',
                    'Recheck domain, requested object, direction and boundaries. A range contains actual outputs, and an inverse function must itself be a function.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Pick({
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
        {options.map(([v, label]) => (
          <option key={v} value={v}>
            {word(mode, label)}
          </option>
        ))}
      </select>
    </label>
  );
}
function Slider({
  mode,
  name,
  value,
  min,
  max,
  step = 1,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  step?: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={word(mode, name)}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Reveal({
  mode,
  show,
  change,
}: {
  mode: LanguageMode;
  show: boolean;
  change: (v: boolean) => void;
}) {
  return (
    <button className="math-button secondary" onClick={() => change(!show)}>
      <Text mode={mode} text={t('显示/隐藏模型', 'Show/hide model')} />
    </button>
  );
}
function Mapping({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<MappingKind>('finite'),
    [query, setQuery] = useState(1),
    [show, setShow] = useState(false),
    m = mappingModel(kind),
    at = mappingAt(kind, String(query));
  const local: AnswerSpec = !at.admissible
    ? { kind: 'function-code', value: 'outside-domain' }
    : at.outputs.length !== 1
      ? { kind: 'function-code', value: 'not-function' }
      : { kind: 'number', value: at.outputs[0]! };
  return (
    <>
      <Pick
        mode={mode}
        name={t('对应规则', 'Mapping rule')}
        value={kind}
        change={(s) => {
          setKind(s as MappingKind);
          setShow(false);
        }}
        options={[
          ['finite', t('有限域，平方对应', 'Finite domain, square mapping')],
          [
            'interval',
            t('连续区间，平方函数', 'Continuous interval, square function'),
          ],
          ['missing', t('漏掉一个输入的输出', 'One input missing its output')],
          ['split', t('一个输入有两个输出', 'One input with two outputs')],
        ]}
      />
      <p>
        D={m.domain}; C={kind === 'interval' ? 'ℝ' : `{${m.codomain}}`}
      </p>
      <p>
        <Text
          mode={mode}
          text={
            kind === 'interval'
              ? t('完整规则f(x)=x²，−2≤x≤3。', 'Full rule f(x)=x², −2≤x≤3.')
              : t(
                  `完整对应清单：${m.edges.map((p) => `${p.x}→${p.y}`).join('；')}。`,
                  `Complete correspondence list: ${m.edges.map((p) => `${p.x}→${p.y}`).join('; ')}.`,
                )
          }
        />
      </p>
      <Task
        key={kind}
        mode={mode}
        name={t('是否为函数', 'Function status')}
        prompt={t(
          '对给定的全部D，这个对应是函数吗？写function/not-function。',
          'Is this correspondence a function on all of the stated D? Enter function/not-function.',
        )}
        answer={{
          kind: 'function-code',
          value: m.valid ? 'function' : 'not-function',
        }}
      />
      {m.valid && (
        <Task
          key={`${kind}-range`}
          mode={mode}
          name={t('实际值域', 'Actual range')}
          prompt={t(
            '写实际输出的完整集合；有限域用{…}，连续区间用区间。陪域允许未用到的值。',
            'Enter the complete set of actual outputs: a finite set or real interval. A codomain may contain unused values.',
          )}
          answer={{
            kind: kind === 'interval' ? 'real-union' : 'finite-set',
            value: m.range,
          }}
        />
      )}
      <Slider
        mode={mode}
        name={t('查询输入', 'Query input')}
        value={query}
        min={-3}
        max={3}
        step={0.5}
        change={setQuery}
      />
      <Task
        key={`${kind}-${query}`}
        mode={mode}
        name={t('当前输入的输出', 'Output at current input')}
        prompt={t(
          '这个输入有唯一输出就写数值；域外写outside-domain；此输入缺输出或多输出写not-function。',
          'For this input enter its unique output; use outside-domain if excluded, or not-function if this input lacks an output or has two.',
        )}
        answer={local}
      />
      <Reveal mode={mode} show={show} change={setShow} />
      {show && <MappingView mode={mode} kind={kind} />}
    </>
  );
}
function Representations({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<RepresentationKind>('continuous'),
    [query, setQuery] = useState(1),
    [view, setView] = useState('both'),
    [extensions, setExtensions] = useState(false),
    [wide, setWide] = useState(false),
    at = representationAt(kind, String(query));
  const rows = kind === 'observations' ? [-1, 1] : [-2, -1, 0, 1, 2],
    answer: AnswerSpec = at.value
      ? { kind: 'number', value: textR(at.value) }
      : {
          kind: 'function-code',
          value:
            at.status === 'undetermined' ? 'undetermined' : 'outside-domain',
        };
  const points = rows.map((x) => ({
      x,
      y: kind === 'observations' ? 1 : x * x - 2,
    })),
    selected = at.value
      ? { x: query, y: rationalNumber(at.value), label: 'P' }
      : null;
  const curves =
    kind === 'continuous'
      ? [sampleCurve('given-rule', (x) => x * x - 2, -2, 2)]
      : kind === 'observations' && extensions
        ? [
            sampleCurve(
              'possible-square',
              (x) => x * x,
              -2,
              2,
              '#3f8675',
              '6 4',
            ),
            sampleCurve('possible-constant', () => 1, -2, 2, '#b07b2b', '4 4'),
          ]
        : [];
  return (
    <>
      <Pick
        mode={mode}
        name={t('规则证据', 'Rule evidence')}
        value={kind}
        change={(s) => {
          setKind(s as RepresentationKind);
          setQuery(s === 'observations' ? 0 : 1);
          setExtensions(false);
        }}
        options={[
          ['continuous', t('给定f=x²−2，D=[−2,2]', 'Given f=x²−2, D=[−2,2]')],
          [
            'discrete',
            t('同规则，仅五个整数输入', 'Same rule, five integer inputs only'),
          ],
          [
            'observations',
            t('仅观测f(−1)=f(1)=1', 'Only observations f(−1)=f(1)=1'),
          ],
        ]}
      />
      <p>
        <Text
          mode={mode}
          text={
            kind === 'observations'
              ? t(
                  '已知定义域[−2,2]，但只给两个观测，没有规定函数族；不擅自连线补规则。',
                  'The domain is [−2,2], but only two observations and no function family are supplied. Do not invent a rule by joining them.',
                )
              : t(
                  `完整给定f(x)=x²−2；定义域${kind === 'continuous' ? '[−2,2]' : '{−2,−1,0,1,2}'}。`,
                  `Full stipulated rule f(x)=x²−2; domain ${kind === 'continuous' ? '[−2,2]' : '{−2,−1,0,1,2}'}.`,
                )
          }
        />
      </p>
      <Pick
        mode={mode}
        name={t('表示视图', 'Representation view')}
        value={view}
        change={setView}
        options={[
          ['table', t('表格', 'Table')],
          ['graph', t('图像', 'Graph')],
          ['both', t('两者联动', 'Linked table and graph')],
        ]}
      />
      {view !== 'graph' && (
        <div
          className="math-concept-table"
          role="region"
          tabIndex={0}
          aria-label={word(mode, t('同一规则的数表', 'Table of the same rule'))}
        >
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>f(x)</th>
                <th>
                  <Text
                    mode={mode}
                    text={t('查看同一点', 'Inspect same point')}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x} data-selected={query === x}>
                  <td>{x}</td>
                  <td>{kind === 'observations' ? 1 : x * x - 2}</td>
                  <td>
                    <button
                      className="math-button secondary"
                      onClick={() => setQuery(x)}
                      aria-label={word(
                        mode,
                        t(`查看行x=${x}`, `Inspect row x=${x}`),
                      )}
                    >
                      x={x}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {view !== 'table' && (
        <ConceptPlot
          mode={mode}
          wide={wide}
          curves={curves}
          points={[...points, ...(selected ? [selected] : [])]}
          caption={t(
            '表、点和式引用同一输入；有限输入不连线。观测模式的虚线仅为两种可能规则，不表示已知真实函数。',
            'Table, point and formula refer to the same input. Finite inputs stay unjoined. Dashed curves in observation mode are possible rules, not an established function.',
          )}
        />
      )}
      <Slider
        mode={mode}
        name={t('查询输入', 'Query input')}
        value={query}
        min={-3}
        max={3}
        step={0.5}
        change={setQuery}
      />
      <Task
        key={`${kind}-${query}`}
        mode={mode}
        name={t('函数值预测', 'Function value prediction')}
        prompt={t(
          `求f(${query})；若证据不能唯一确定写undetermined，若不在定义域写outside-domain。`,
          `Find f(${query}); use undetermined for insufficient rule evidence or outside-domain for an excluded input.`,
        )}
        answer={answer}
      />
      {selected && (
        <Task
          key={`${kind}-${query}-point`}
          mode={mode}
          name={t('同一行的坐标', 'Coordinates of the same row')}
          prompt={t(
            '将输入、输出按顺序写成(x,f(x))。',
            'Write the ordered pair (x,f(x)).',
          )}
          answer={{
            kind: 'coordinate',
            value: `(${query},${textR(at.value!)})`,
          }}
        />
      )}
      {kind === 'observations' && (
        <button
          className="math-button secondary"
          onClick={() => setExtensions(!extensions)}
        >
          <Text
            mode={mode}
            text={t('显示/隐藏两种可能规则', 'Show/hide two possible rules')}
          />
        </button>
      )}
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('只改变视窗', 'Change window only')} />
      </button>
    </>
  );
}
const familyNames: [Family, LocalizedText][] = [
  ['square', t('f(x)=x²，D=[−3,3]', 'f(x)=x², D=[−3,3]')],
  ['cube', t('f(x)=x³，D=[−2,2]', 'f(x)=x³, D=[−2,2]')],
  ['absolute', t('f(x)=|x|，D=[−3,3]', 'f(x)=|x|, D=[−3,3]')],
  ['square-plus-one', t('f(x)=x²+1，D=[−3,3]', 'f(x)=x²+1, D=[−3,3]')],
  ['zero', t('f(x)=0，D=[−3,3]', 'f(x)=0, D=[−3,3]')],
  ['restricted-square', t('f(x)=x²，D=[0,3]', 'f(x)=x², D=[0,3]')],
];
function Properties({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<Family>('square'),
    [part, setPart] = useState<IntervalPart>('whole'),
    [x1, setX1] = useState(-1),
    [x2, setX2] = useState(1),
    [wide, setWide] = useState(false),
    m = propertyModel(kind, part),
    audit = auditOrderedPair(kind, part, String(x1), String(x2));
  return (
    <>
      <Pick
        mode={mode}
        name={t('给定函数与域', 'Given function and domain')}
        value={kind}
        change={(s) => {
          setKind(s as Family);
          setPart('whole');
        }}
        options={familyNames}
      />
      <Pick
        mode={mode}
        name={t('单调性研究区间', 'Interval for monotonicity')}
        value={part}
        change={(s) => setPart(s as IntervalPart)}
        options={[
          ['whole', t('原定义域整个区间', 'Whole original interval')],
          ...(kind === 'restricted-square'
            ? []
            : [
                ['left', t('原定义域中x≤0部分', 'Part with x≤0')] as [
                  string,
                  LocalizedText,
                ],
              ]),
          ['right', t('原定义域中x≥0部分', 'Part with x≥0')],
        ]}
      />
      <Task
        key={`${kind}-${part}`}
        mode={mode}
        name={t('严格单调性', 'Strict monotonicity')}
        prompt={t(
          `在[${m.studyLo},${m.studyHi}]上写increasing/decreasing/neither-strict。这里“递增/递减”均指严格；常函数不归入严格单调。`,
          `On [${m.studyLo},${m.studyHi}], enter increasing/decreasing/neither-strict. Increasing/decreasing here mean strict; a constant is not strictly monotone.`,
        )}
        answer={{ kind: 'function-code', value: m.monotonicity }}
      />
      <Task
        key={kind}
        mode={mode}
        name={t('原函数的奇偶性', 'Parity of original function')}
        prompt={t(
          '对原定义域的完整函数写even/odd/both/neither。只换研究子区间，不改变这个原函数。',
          'For the full original domain enter even/odd/both/neither. Changing only the study subinterval does not redefine the original function.',
        )}
        answer={{ kind: 'function-code', value: m.parity }}
      />
      <Slider
        mode={mode}
        name={t('测试输入x₁', 'Test input x1')}
        value={x1}
        min={-3}
        max={3}
        step={0.5}
        change={setX1}
      />
      <Slider
        mode={mode}
        name={t('测试输入x₂', 'Test input x2')}
        value={x2}
        min={-3}
        max={3}
        step={0.5}
        change={setX2}
      />
      <p
        role="status"
        aria-label={word(mode, t('有序对核验', 'Ordered-pair audit'))}
      >
        <Text
          mode={mode}
          text={
            !audit.admissible
              ? t(
                  '候选有域外值，先把两数放进研究区间。',
                  'A candidate is outside the study interval; place both inputs inside it.',
                )
              : !audit.ordered
                ? t(
                    '要求x₁<x₂；重合或倒序的输入不能用来检验这个定义。',
                    'The definition requires x1<x2; equal or reversed inputs do not test it.',
                  )
                : t(
                    `f(x₁)=${textR(audit.f1)}，f(x₂)=${textR(audit.f2)}。一对违反例可反驳；一对成功例不证明全部。`,
                    `f(x1)=${textR(audit.f1)}, f(x2)=${textR(audit.f2)}. One violating pair can refute; one successful pair does not prove every pair.`,
                  )
          }
        />
      </p>
      <FamilyView
        mode={mode}
        kind={kind}
        lo={m.lo}
        hi={m.hi}
        wide={wide}
        points={[
          { x: x1, y: rationalNumber(audit.f1), label: 'P' },
          { x: x2, y: rationalNumber(audit.f2), label: 'Q' },
        ].filter((p) => p.x >= m.lo && p.x <= m.hi)}
      />
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('只改变视窗', 'Change window only')} />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            '严格递增要任意x₁<x₂都有f(x₁)<f(x₂)。偶/奇先要求D关于0对称，再核f(−x)=f(x)/−f(x)；零函数两者都满足。',
            'Strict increase requires f(x1)<f(x2) for every ordered pair x1<x2. Even/odd first require D symmetric about zero, then f(−x)=f(x)/−f(x); the zero function satisfies both.',
          )}
        />
      </p>
    </>
  );
}
function Transformations({ mode }: { mode: LanguageMode }) {
  const [p, setP] = useState<TransformParams>(defaultTransform),
    [source, setSource] = useState(1),
    [query, setQuery] = useState(4),
    [wide, setWide] = useState(false),
    m = transformModel(p, String(source)),
    value = transformedAt(p, String(query));
  const update = (key: 'a' | 'h' | 'k', n: number) => setP({ ...p, [key]: n });
  return (
    <>
      <Pick
        mode={mode}
        name={t('原函数', 'Source function')}
        value={p.family}
        change={(s) => setP({ ...p, family: s as TransformParams['family'] })}
        options={familyNames
          .filter(([f]) => ['square', 'cube', 'absolute'].includes(f))
          .map(([f, label]) => [
            f,
            t(label.zh.split('，')[0]!, label.en.split(',')[0]!),
          ])}
      />
      <p>g(x)=a f(b(x−h))+k</p>
      <Slider
        mode={mode}
        name={t('竖向倍率a', 'Vertical factor a')}
        value={p.a}
        min={-2}
        max={3}
        change={(n) => update('a', n)}
      />
      <Pick
        mode={mode}
        name={t('内部倍率b', 'Inner factor b')}
        value={String(p.b)}
        change={(s) => setP({ ...p, b: Number(s) })}
        options={[-2, -1, 1, 2].map((b) => [
          String(b),
          t(String(b), String(b)),
        ])}
      />
      <Slider
        mode={mode}
        name={t('水平位移h', 'Horizontal shift h')}
        value={p.h}
        min={-3}
        max={3}
        change={(n) => update('h', n)}
      />
      <Slider
        mode={mode}
        name={t('竖直位移k', 'Vertical shift k')}
        value={p.k}
        min={-3}
        max={3}
        change={(n) => update('k', n)}
      />
      <Pick
        mode={mode}
        name={t('原函数定义域', 'Source domain')}
        value={p.restricted ? 'restricted' : 'all'}
        change={(s) => setP({ ...p, restricted: s === 'restricted' })}
        options={[
          ['all', t('全体实数ℝ', 'All reals ℝ')],
          ['restricted', t('只取[−2,2]', 'Only [−2,2]')],
        ]}
      />
      <Slider
        mode={mode}
        name={t('源点输入u', 'Source-point input u')}
        value={source}
        min={-2}
        max={2}
        step={0.5}
        change={setSource}
      />
      <Task
        key={`point-${JSON.stringify(p)}-${source}`}
        mode={mode}
        name={t('变换后坐标', 'Transformed coordinates')}
        prompt={t(
          `源点P=(${textR(m.source[0])},${textR(m.source[1])})对应哪个Q？不要把内部倍率b当成横坐标乘b。`,
          `Where does P=(${textR(m.source[0])},${textR(m.source[1])}) map to Q? Do not multiply the horizontal coordinate by b.`,
        )}
        answer={{
          kind: 'coordinate',
          value: `(${textR(m.image[0])},${textR(m.image[1])})`,
        }}
      />
      <Slider
        mode={mode}
        name={t('查询新输入x', 'Query transformed input x')}
        value={query}
        min={-6}
        max={6}
        step={0.5}
        change={setQuery}
      />
      <Task
        key={`value-${JSON.stringify(p)}-${query}`}
        mode={mode}
        name={t('变换后的函数值', 'Transformed function value')}
        prompt={t(
          `求g(${query})，域外写outside-domain。`,
          `Find g(${query}); use outside-domain if excluded.`,
        )}
        answer={
          value
            ? { kind: 'number', value: textR(value) }
            : { kind: 'function-code', value: 'outside-domain' }
        }
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `新定义域 ${realSetText(m.domain)}。源横坐标u先除b再加h；纵坐标先乘a再加k。a=0压成常值，但不自动扩大给定定义域。`,
            `New domain ${realSetText(m.domain)}. Divide source u by b then add h; multiply its output by a then add k. At a=0 the graph collapses vertically, but the stipulated domain does not expand.`,
          )}
        />
      </p>
      <TransformView
        mode={mode}
        params={p}
        wide={wide}
        points={[
          {
            x: rationalNumber(m.source[0]),
            y: rationalNumber(m.source[1]),
            label: 'P',
          },
          {
            x: rationalNumber(m.image[0]),
            y: rationalNumber(m.image[1]),
            label: 'Q',
          },
        ]}
      />
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('只改变视窗', 'Change window only')} />
      </button>
    </>
  );
}
function Inverses({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<InverseKind>('square-full'),
    [query, setQuery] = useState(4),
    [wide, setWide] = useState(false),
    m = inverseModel(kind, String(query));
  const answer: AnswerSpec = !m.admissible
    ? { kind: 'function-code', value: 'outside-domain' }
    : kind === 'affine'
      ? { kind: 'number', value: m.preimages[0]! }
      : kind === 'square-full'
        ? {
            kind: 'root-set',
            radicand: String(query),
            value: m.preimages.join(','),
          }
        : { kind: 'radical', value: m.preimages[0]! };
  return (
    <>
      <Pick
        mode={mode}
        name={t('原函数及限制', 'Original function and restriction')}
        value={kind}
        change={(s) => setKind(s as InverseKind)}
        options={[
          ['affine', t('f=2x+3，D=[−2,4]', 'f=2x+3, D=[−2,4]')],
          ['square-full', t('f=x²，D=[−3,3]', 'f=x², D=[−3,3]')],
          ['square-positive', t('f=x²，D=[0,3]', 'f=x², D=[0,3]')],
          ['square-negative', t('f=x²，D=[−3,0]', 'f=x², D=[−3,0]')],
        ]}
      />
      <Task
        key={kind}
        mode={mode}
        name={t('是否有反函数', 'Inverse function status')}
        prompt={t(
          '把实际值域作为新定义域，交换对应后是函数吗？写invertible/not-invertible。',
          'Using the actual range as the new domain, is the reversed correspondence a function? Enter invertible/not-invertible.',
        )}
        answer={{
          kind: 'function-code',
          value: m.invertible ? 'invertible' : 'not-invertible',
        }}
      />
      <Slider
        mode={mode}
        name={t('从输出y反查', 'Recover input from output y')}
        value={query}
        min={-2}
        max={12}
        change={setQuery}
      />
      <Task
        key={`${kind}-${query}`}
        mode={mode}
        name={t('原像预测', 'Preimage prediction')}
        prompt={t(
          '找全部允许的原输入。完整平方域写两根；限制域只留该支；输出未出现写outside-domain。一个输出偶然只有一个原像不证明整体可逆。',
          'Find all admissible original inputs. Give both roots for the full square domain, one branch for a restricted domain, or outside-domain if the output never occurs. One output with a unique preimage does not prove global invertibility.',
        )}
        answer={answer}
      />
      {m.invertible && (
        <Task
          key={`${kind}-domain`}
          mode={mode}
          name={t('反函数定义域', 'Inverse domain')}
          prompt={t(
            '写反函数的完整定义域；它等于原函数实际值域。',
            'Enter the complete domain of the inverse: the actual range of the original function.',
          )}
          answer={{ kind: 'real-union', value: realSetText(m.range) }}
        />
      )}
      <InverseView mode={mode} kind={kind} wide={wide} />
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('只改变视窗', 'Change window only')} />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            'f⁻¹不是1/f。反函数把实际输出送回唯一原输入；原定义域与值域交换。限制到负半轴时，平方的反函数取−√y而不是√y。',
            'f⁻¹ is not 1/f. An inverse sends an actual output back to its unique input; original domain and range exchange. On the negative branch, the square function has inverse −√y rather than √y.',
          )}
        />
      </p>
    </>
  );
}
function Piecewise({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<PieceKind>('parking'),
    [query, setQuery] = useState(3),
    [budget, setBudget] = useState(4),
    [show, setShow] = useState(false),
    [wide, setWide] = useState(false),
    pieces = piecewiseModel(kind),
    at = piecewiseAt(kind, String(query)),
    set = piecewiseBudget(kind, String(budget));
  return (
    <>
      <Pick
        mode={mode}
        name={t('虚构收费规则', 'Fictional tariff rule')}
        value={kind}
        change={(s) => {
          setKind(s as PieceKind);
          setShow(false);
        }}
        options={[
          [
            'parking',
            t('免费首小时后逐段累计', 'Free first hour, then marginal tiers'),
          ],
          [
            'parcel',
            t('按总重量档收整件费用', 'Whole-parcel fee by total mass band'),
          ],
          [
            'started-hour',
            t('每开始一小时收3元', 'Three dollars per started hour'),
          ],
        ]}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '仅为纸上数学费率，金额单位NZD。停车/计时输入为小时，包裹为kg。先找输入落在哪段，再用该段完整规则。',
            'Fictional worksheet rates only, amounts in NZD. Parking/time inputs use hours, parcels kg. Locate the input branch before evaluating its complete rule.',
          )}
        />
      </p>
      <ul aria-label={word(mode, t('给定分段规则', 'Given piecewise rules'))}>
        {pieces.map((p, i) => (
          <li key={i} data-active-branch={at?.index === i}>
            <Text mode={mode} text={t(p.zh, p.en)} />
          </li>
        ))}
      </ul>
      <Slider
        mode={mode}
        name={t('当前输入', 'Current input')}
        value={query}
        min={-1}
        max={6}
        step={0.5}
        change={setQuery}
      />
      <Task
        key={`charge-${kind}-${query}`}
        mode={mode}
        name={t('当前收费预测', 'Current charge prediction')}
        prompt={t(
          `求输入${query}的收费；超过给定范围写outside-domain，不擅自外推。`,
          `Find the charge at input ${query}; use outside-domain beyond the stated range rather than extrapolating.`,
        )}
        answer={
          at
            ? { kind: 'number', value: textR(at.value), unit: 'NZD' }
            : { kind: 'function-code', value: 'outside-domain' }
        }
      />
      <Slider
        mode={mode}
        name={t('纸上预算NZD', 'Worksheet budget NZD')}
        value={budget}
        min={0}
        max={12}
        change={setBudget}
      />
      <Task
        key={`budget-${kind}-${budget}`}
        mode={mode}
        name={t('满足预算的输入集合', 'Inputs meeting the budget')}
        prompt={t(
          '找全部允许且费用不超过预算的输入，用完整实数解集。改变查询点不改变这整个集合。',
          'Find all admissible inputs whose charge is at most the budget, as a complete real set. Changing the query point does not change this entire set.',
        )}
        answer={{ kind: 'real-union', value: unionText(set) }}
      />
      <Reveal mode={mode} show={show} change={setShow} />
      {show && (
        <PiecewiseView
          mode={mode}
          kind={kind}
          wide={wide}
          query={
            at
              ? { x: query, y: rationalNumber(at.value), label: 'P' }
              : undefined
          }
        />
      )}
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('只改变视窗', 'Change window only')} />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            '逐段累计与“整件按所在档定价”不同；每开始一小时不是连续按小时比例收费。端点恰好属于一段，域外不会自动变成最后一段。',
            'Marginal accumulation differs from whole-item band pricing; per-started-hour fees differ from proportional time rates. Each endpoint belongs to exactly one branch; excluded inputs do not automatically enter the last branch.',
          )}
        />
      </p>
    </>
  );
}
export function FunctionConceptLab({
  kind,
  mode,
}: {
  kind: FunctionConceptLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'concept-mapping' ? (
        <Mapping mode={mode} />
      ) : kind === 'concept-representations' ? (
        <Representations mode={mode} />
      ) : kind === 'concept-properties' ? (
        <Properties mode={mode} />
      ) : kind === 'concept-transformations' ? (
        <Transformations mode={mode} />
      ) : kind === 'concept-inverse' ? (
        <Inverses mode={mode} />
      ) : (
        <Piecewise mode={mode} />
      )}
    </section>
  );
}
export function FunctionConceptHookArt({
  kind,
  mode,
}: {
  kind: FunctionConceptLabKind;
  mode: LanguageMode;
}) {
  return kind === 'concept-mapping' ? (
    <MappingView mode={mode} kind="finite" />
  ) : kind === 'concept-representations' ? (
    <ConceptPlot
      mode={mode}
      points={[
        { x: -1, y: 1 },
        { x: 1, y: 1 },
      ]}
      caption={t(
        '仅有两个观测点，能确定中间发生什么吗？',
        'Can two observations determine what happens between them?',
      )}
    />
  ) : kind === 'concept-properties' ? (
    <FamilyView mode={mode} kind="square" lo={-3} hi={3} />
  ) : kind === 'concept-transformations' ? (
    <TransformView mode={mode} params={defaultTransform} />
  ) : kind === 'concept-inverse' ? (
    <InverseView mode={mode} kind="square-full" />
  ) : (
    <PiecewiseView mode={mode} kind="parcel" />
  );
}
