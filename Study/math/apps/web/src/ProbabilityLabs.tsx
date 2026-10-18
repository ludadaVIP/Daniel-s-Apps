import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import {
  jointModel,
  jointCases,
  numberedPairs,
  surveySample,
  surveyPopulation,
  simulatePairs,
  probabilityString,
  type SurveyMethod,
} from './probabilityModels';
import { treeEvent, type TreeEvent } from './inferenceModels';
import { ProbabilityTree } from './InferenceVisuals';
import {
  JointView,
  PairGrid,
  FrequencyRecord,
  FrequencyPlot,
} from './ProbabilityVisuals';
export type ProbabilityLabKind = Extract<
  Lesson['lab'],
  `probability-${string}`
>;
export const isProbabilityLab = (
  kind: Lesson['lab'],
): kind is ProbabilityLabKind => kind.startsWith('probability-');
const label = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const num = (value: string): AnswerSpec => ({ kind: 'number', value });
function Task({
  mode,
  answer,
  prompt,
  name = t('我的概率结论', 'My probability conclusion'),
}: {
  mode: LanguageMode;
  answer: AnswerSpec;
  prompt: LocalizedText;
  name?: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-quadratic-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={label(mode, name)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button
        className="math-button"
        aria-label={label(mode, t(`核对：${name.zh}`, `Check: ${name.en}`))}
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t('核对概率结论', 'Check probability conclusion')}
        />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t(`${name.zh}反馈`, `${name.en} feedback`))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(value, answer)
                ? t(
                    '结论符合。请解释结果空间、条件、分母及记录来源；完整理由由家长阅读。',
                    'The conclusion matches. Explain the space, conditions, denominator and source of the record; a parent reviews the full reasoning.',
                  )
                : t(
                    '再核等可能编号、第一步后的数量、条件分母、缺失记录与理论/频率的区别。',
                    'Recheck equally likely IDs, updated counts, conditional denominators, missing responses and theory versus frequency.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
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
  options: { value: string; text: LocalizedText }[];
  change: (s: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={label(mode, name)}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {label(mode, o.text)}
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
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={label(mode, name)}
        value={value}
        min={min}
        max={max}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Reveal({
  mode,
  shown,
  toggle,
  children,
}: {
  mode: LanguageMode;
  shown: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <button className="math-button secondary" onClick={toggle}>
        <Text
          mode={mode}
          text={t('显示或隐藏概率核验', 'Show or hide probability audit')}
        />
      </button>
      {shown && (
        <div
          role="status"
          aria-label={label(mode, t('概率核验', 'Probability audit'))}
        >
          {children}
        </div>
      )}
    </>
  );
}
const eventOptions = [
  { value: 'two-red', text: t('两次红RR', 'Two reds RR') },
  {
    value: 'different',
    text: t('颜色不同RB或BR', 'Different colours RB or BR'),
  },
  { value: 'at-least-blue', text: t('至少一次蓝', 'At least one blue') },
];
function IndependenceLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [swap, setSwap] = useState(false),
    [shown, setShown] = useState(false),
    c = jointCases[index]!,
    m = jointModel(c.cells);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先算P(A)、P(B)及P(A且B)，比较后再判断独立。这里是完整等可能模型，不能从一张有限样本观测表直接证明现实独立。',
            'First calculate P(A), P(B) and P(A and B). Compare before judging independence. This is a complete equally likely model; a finite observational sample cannot prove real-world independence.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('独立性模型', 'Independence model')}
        value={String(index)}
        options={jointCases.map((v, i) => ({
          value: String(i),
          text: t(v.zh, v.en),
        }))}
        change={(v) => {
          setIndex(Number(v));
          setShown(false);
        }}
      />
      <button className="math-button secondary" onClick={() => setSwap(!swap)}>
        <Text
          mode={mode}
          text={t('仅交换表的行列', 'Transpose table view only')}
        />
      </button>
      <JointView mode={mode} cells={c.cells} swap={swap} />
      <Task
        key={index}
        mode={mode}
        answer={{
          kind: 'independence',
          value: m.independent ? 'independent' : 'dependent',
        }}
        prompt={t(
          'A与B独立吗？写independent/独立或dependent/不独立。',
          'Are A and B independent? Enter independent or dependent.',
        )}
      />
      <Task
        key={`${index}:joint`}
        mode={mode}
        name={t('同时发生的概率', 'Joint probability')}
        answer={num(probabilityString(m.pAB))}
        prompt={t(
          '写P(A且B)的精确概率，无单位。',
          'Enter exact P(A and B), without units.',
        )}
      />
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <p>
          P(A)={probabilityString(m.pA)}; P(B)={probabilityString(m.pB)};
          P(A∩B)={probabilityString(m.pAB)}; P(A)P(B)=
          {probabilityString(m.product)}.
        </p>
        <p>
          <Text
            mode={mode}
            text={
              m.givenA === null
                ? t(
                    'A不可能，所以P(B|A)未定义；乘积定义仍给独立，不能算0/0。',
                    'A is impossible, so P(B|A) is undefined. The product definition still gives independence; do not calculate 0/0.',
                  )
                : t(
                    `P(B|A)=${probabilityString(m.givenA)}，与P(B)比较；不相交与独立不是同义词。`,
                    `P(B|A)=${probabilityString(m.givenA)}; compare with P(B). Disjoint and independent mean different things.`,
                  )
            }
          />
        </p>
      </Reveal>
    </>
  );
}
function TreeLab({ mode, without }: { mode: LanguageMode; without: boolean }) {
  const [red, setRed] = useState(3),
    [blue, setBlue] = useState(2),
    [replace, setReplace] = useState(!without),
    [path, setPath] = useState('RR'),
    [event, setEvent] = useState<TreeEvent>('different'),
    [shown, setShown] = useState(false),
    [view, setView] = useState(false),
    m = numberedPairs(red, blue, replace),
    leaf = m.leaves.find((l) => l.code === path)!,
    e = treeEvent(m, event),
    key = `${red}:${blue}:${replace}:${without ? event : path}`;
  const change = () => setShown(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            without
              ? t(
                  '每个编号等机会。每次试验抽两次，不放回只指第二次前不放回；用编号有序对核树状图。异色有RB与BR两条互斥路径。',
                  'Each numbered token is equally likely. A trial has two draws; without replacement means no return before the second draw. Audit the tree with ordered ID pairs; different colours have the disjoint paths RB and BR.',
                )
              : t(
                  '路径概率=首步概率×该首步条件下次步概率；这条一般乘法法则不要求独立。只有有依据的独立情形才可用未改变的边际概率。',
                  'Path probability = first probability × second conditional probability. This general multiplication rule does not require independence; unchanged marginals need a justified independence premise.',
                )
          }
        />
      </p>
      <Slider
        mode={mode}
        name={t('红色编号球数', 'Red token count')}
        value={red}
        min={1}
        max={5}
        change={(n) => {
          setRed(n);
          change();
        }}
      />
      <Slider
        mode={mode}
        name={t('蓝色编号球数', 'Blue token count')}
        value={blue}
        min={1}
        max={5}
        change={(n) => {
          setBlue(n);
          change();
        }}
      />
      <label className="math-trig-toggle">
        <input
          type="checkbox"
          aria-label={label(
            mode,
            t('第二次前放回', 'Replace before second draw'),
          )}
          checked={replace}
          onChange={(e) => {
            setReplace(e.target.checked);
            change();
          }}
        />
        <Text
          mode={mode}
          text={t(
            '第二次前放回并重新混匀',
            'Replace and remix before the second draw',
          )}
        />
      </label>
      {without ? (
        <Select
          mode={mode}
          name={t('所求事件', 'Requested event')}
          value={event}
          options={eventOptions}
          change={(v) => {
            setEvent(v as TreeEvent);
            change();
          }}
        />
      ) : (
        <Select
          mode={mode}
          name={t('指定颜色路径', 'Selected colour path')}
          value={path}
          options={['RR', 'RB', 'BR', 'BB'].map((v) => ({
            value: v,
            text: t(v, v),
          }))}
          change={(v) => {
            setPath(v);
            change();
          }}
        />
      )}
      <button className="math-button secondary" onClick={() => setView(!view)}>
        <Text
          mode={mode}
          text={t(
            '仅切换编号表与树的显示',
            'Switch ID-grid and tree view only',
          )}
        />
      </button>
      {view ? (
        <ProbabilityTree red={red} blue={blue} replace={replace} mode={mode} />
      ) : (
        <PairGrid
          mode={mode}
          red={red}
          blue={blue}
          replace={replace}
          event={event}
          reveal={shown && without}
        />
      )}
      <Task
        key={key}
        mode={mode}
        answer={num(
          probabilityString(without ? e.probability : leaf.probability),
        )}
        prompt={
          without
            ? t(
                '写所求事件的精确概率；合并路径先确认互不重叠。',
                'Enter the exact event probability, adding only disjoint paths.',
              )
            : t(
                `写完整${path}路径的精确概率。`,
                `Enter exact probability of the complete ${path} path.`,
              )
        }
      />
      {!without && (
        <Task
          key={`${key}:conditional`}
          mode={mode}
          name={t('第二步条件概率', 'Second-step conditional probability')}
          answer={num(probabilityString(leaf.conditionalProbability))}
          prompt={t(
            `已知第一步${path[0]}，第二步${path[1]}的概率？`,
            `Given first ${path[0]}, find probability of second ${path[1]}.`,
          )}
        />
      )}
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <p>
          {without
            ? `${e.paths.join(' + ') || '∅'}: ${e.labelledHits}/${m.labelledTotal} = ${probabilityString(e.probability)}`
            : `${path}: ${probabilityString(leaf.firstProbability)} × ${probabilityString(leaf.conditionalProbability)} = ${probabilityString(leaf.probability)}`}
        </p>
        <p>
          <Text
            mode={mode}
            text={t(
              '四种颜色路径不是四个等可能结果。不放回时总数与对应颜色数都按已抽编号更新。',
              'Four colour categories are not four equally likely outcomes. Without replacement, update both total and the relevant colour count.',
            )}
          />
        </p>
      </Reveal>
    </>
  );
}
function SurveyLab({ mode }: { mode: LanguageMode }) {
  const [method, setMethod] = useState<SurveyMethod>('nearby'),
    [size, setSize] = useState(8),
    [seed, setSeed] = useState(19),
    [shown, setShown] = useState(false),
    [reverse, setReverse] = useState(false),
    m = surveySample(size, method, seed),
    key = `${method}:${size}:${seed}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构24张编号资料卡分A/B/C三组各8张。研究全部24张的“是”比例。比较全编号抽样框、只取A组与C组不回答；“未回答”不能改成“否”。',
            'Twenty-four fictional ID cards form groups A/B/C of eight. Study the yes proportion among all 24. Compare full-frame selection, A-only coverage and C nonresponse; missing responses are not no answers.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('抽样办法', 'Sampling method')}
        value={method}
        options={[
          {
            value: 'all',
            text: t('全部24编号的抽样框', 'All 24 IDs in frame'),
          },
          {
            value: 'nearby',
            text: t('只取身边A组8张', 'Nearby A-only frame of 8'),
          },
          {
            value: 'nonresponse',
            text: t('全框抽取但C组未回答', 'Full frame but C does not respond'),
          },
        ]}
        change={(v) => {
          setMethod(v as SurveyMethod);
          setSize(Math.min(size, v === 'nearby' ? 8 : 24));
          setShown(false);
        }}
      />
      <Slider
        mode={mode}
        name={t('邀请数量', 'Invited count')}
        value={size}
        min={1}
        max={method === 'nearby' ? 8 : 24}
        change={(n) => {
          setSize(n);
          setShown(false);
        }}
      />
      <button
        className="math-button secondary"
        onClick={() => {
          setSeed(seed + 1);
          setShown(false);
        }}
      >
        <Text
          mode={mode}
          text={t(
            '使用下一个可重放抽样种子',
            'Use next reproducible sampling seed',
          )}
        />
      </button>
      <button
        className="math-button secondary"
        onClick={() => setReverse(!reverse)}
      >
        <Text
          mode={mode}
          text={t('仅反转记录显示顺序', 'Reverse record display only')}
        />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            `抽样框${m.frameSize}/24；邀请${size}；有效回答${m.respondents}；其中是${m.yes}；未回答${m.missing}。种子${seed}。`,
            `Frame ${m.frameSize}/24; invited ${size}; responses ${m.respondents}; yes ${m.yes}; missing ${m.missing}. Seed ${seed}.`,
          )}
        />
      </p>
      <div className="math-probability-records">
        {(reverse ? [...m.invited].reverse() : m.invited).map((p) => (
          <div key={p.id} data-survey-id={p.id}>
            <strong>{p.id}</strong>
            <Text
              mode={mode}
              text={
                p.response === null
                  ? t('未回答', 'No response')
                  : p.response
                    ? t('是', 'Yes')
                    : t('否', 'No')
              }
            />
          </div>
        ))}
      </div>
      <Task
        key={key}
        mode={mode}
        answer={{
          kind: 'proof-verdict',
          value: m.census ? 'sufficient' : 'insufficient',
        }}
        prompt={t(
          '只凭这批已回答记录，足以断定全部24张的精确比例吗？写sufficient/insufficient。',
          'Do these responses determine the exact proportion among all 24 cards? Enter sufficient or insufficient.',
        )}
      />
      <Task
        key={`${key}:frequency`}
        mode={mode}
        name={t('回答者中的比例', 'Proportion among respondents')}
        answer={
          m.frequency
            ? num(probabilityString(m.frequency))
            : { kind: 'proof-verdict', value: 'insufficient' }
        }
        prompt={
          m.frequency
            ? t(
                '只在回答者中计算“是”的比例。',
                'Calculate the yes proportion among respondents only.',
              )
            : t(
                '无人回答，比例可计算吗？写insufficient。',
                'No responses: can a proportion be calculated? Enter insufficient.',
              )
        }
      />
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <p>
          <Text
            mode={mode}
            text={t(
              '模型全体真值：A有2/8，B有4/8，C有6/8，所以全部12/24=1/2。只扩大A组到8张仍漏B/C；全框随机小样本也可能波动，随机不保证每次完美代表。只有全体24张完整回答才是本数据的普查。',
              'Model population truth: A has 2/8 yes, B 4/8 and C 6/8, giving 12/24=1/2. All eight A cards still omit B/C. Even full-frame random samples vary; randomness does not guarantee perfect representation in every sample. All 24 complete responses form the census here.',
            )}
          />
        </p>
        <p>
          {surveyPopulation
            .map((p) => `${p.id}:${p.yes ? 'Y' : 'N'}`)
            .join(' · ')}
        </p>
      </Reveal>
    </>
  );
}
function SimulationRun({
  mode,
  red,
  blue,
  replace,
  event,
  seed,
}: {
  mode: LanguageMode;
  red: number;
  blue: number;
  replace: boolean;
  event: TreeEvent;
  seed: number;
}) {
  const [trials, setTrials] = useState(0),
    [shown, setShown] = useState(false),
    [last, setLast] = useState(true),
    m = simulatePairs(red, blue, replace, event, seed, trials),
    records = last ? m.records.slice(-10) : m.records.slice(0, 10);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '这是本地可重放伪随机模型，不是真实测量。每轮都恢复原袋，再按指定放回规则抽两次；一次试验的两抽可能相依，而不同试验按同一模型重新开始。',
            'This is a local reproducible pseudorandom model, not field data. Restore the original bag each trial, then draw twice using the selected rule. Draws within a trial may be dependent; each new trial restarts the same model.',
          )}
        />
      </p>
      <p>
        Seed {seed} · n={trials} ·{' '}
        <Text mode={mode} text={t(`命中${m.hits}`, `Hits ${m.hits}`)} />
      </p>
      <Task
        mode={mode}
        name={t('理论概率预测', 'Theoretical probability prediction')}
        answer={num(probabilityString(m.theory))}
        prompt={t(
          '先给模型理论概率；追加同一运行的试验不改变这个预测。',
          'Predict the model probability first; appending trials in this run does not change this quantity.',
        )}
      />
      <div className="math-probability-actions">
        {[1, 10, 100].map((n) => (
          <button
            key={n}
            className="math-button"
            disabled={trials === 1000}
            onClick={() => setTrials(Math.min(1000, trials + n))}
          >
            <Text
              mode={mode}
              text={t(
                `追加${n}次试验`,
                `Append ${n} ${n === 1 ? 'trial' : 'trials'}`,
              )}
            />
          </button>
        ))}
        <button
          className="math-button secondary"
          onClick={() => {
            setTrials(0);
            setShown(false);
          }}
        >
          <Text
            mode={mode}
            text={t('用相同种子重新开始', 'Restart with the same seed')}
          />
        </button>
      </div>
      <FrequencyPlot mode={mode} records={m.records} theory={m.theory} />
      <Task
        key={trials}
        mode={mode}
        answer={
          m.frequency
            ? num(probabilityString(m.frequency))
            : { kind: 'proof-verdict', value: 'insufficient' }
        }
        prompt={
          m.frequency
            ? t(
                '根据这批实际记录，写累计频率；不能直接交理论概率。',
                'From this run’s records, enter cumulative frequency; do not substitute theory.',
              )
            : t(
                '零次试验有定义的频率吗？写insufficient。',
                'Is frequency defined at zero trials? Enter insufficient.',
              )
        }
      />
      <button className="math-button secondary" onClick={() => setLast(!last)}>
        <Text
          mode={mode}
          text={t(
            '仅切换最初/最近10条记录',
            'Switch first/latest 10 records only',
          )}
        />
      </button>
      <div className="math-probability-records">
        {records.map((r) => (
          <div key={r.n} data-trial={r.n}>
            <strong>#{r.n}</strong>
            {r.first}→{r.second} · {r.hit ? '✓' : '×'}
          </div>
        ))}
      </div>
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <FrequencyRecord mode={mode} hits={m.hits} total={m.trials} />
        <p>
          <Text
            mode={mode}
            text={t(
              `模型P=${probabilityString(m.theory)}；本次频率=${probabilityString(m.frequency)}。更多试验不保证每一步靠近，也不能从一次吻合证明模型。`,
              `Model P=${probabilityString(m.theory)}; observed frequency=${probabilityString(m.frequency)}. More trials do not guarantee every step moves closer, and one matching run does not prove a model.`,
            )}
          />
        </p>
      </Reveal>
    </>
  );
}
function SimulationLab({ mode }: { mode: LanguageMode }) {
  const [red, setRed] = useState(3),
    [blue, setBlue] = useState(2),
    [replace, setReplace] = useState(false),
    [event, setEvent] = useState<TreeEvent>('different'),
    [seed, setSeed] = useState(37);
  return (
    <>
      <Slider
        mode={mode}
        name={t('模拟红球数', 'Simulation red count')}
        value={red}
        min={1}
        max={5}
        change={setRed}
      />
      <Slider
        mode={mode}
        name={t('模拟蓝球数', 'Simulation blue count')}
        value={blue}
        min={1}
        max={5}
        change={setBlue}
      />
      <label className="math-trig-toggle">
        <input
          type="checkbox"
          aria-label={label(
            mode,
            t('模拟第二次前放回', 'Simulation replacement'),
          )}
          checked={replace}
          onChange={(e) => setReplace(e.target.checked)}
        />
        <Text
          mode={mode}
          text={t(
            '同一次试验的第二抽前放回',
            'Replace before the second draw within a trial',
          )}
        />
      </label>
      <Select
        mode={mode}
        name={t('模拟事件', 'Simulation event')}
        value={event}
        options={eventOptions}
        change={(v) => setEvent(v as TreeEvent)}
      />
      <button
        className="math-button secondary"
        onClick={() => setSeed(seed + 1)}
      >
        <Text
          mode={mode}
          text={t('换种子并开始新运行', 'Change seed and start a new run')}
        />
      </button>
      <SimulationRun
        key={`${red}:${blue}:${replace}:${event}:${seed}`}
        mode={mode}
        red={red}
        blue={blue}
        replace={replace}
        event={event}
        seed={seed}
      />
    </>
  );
}
export function ProbabilityHookArt({
  kind,
  mode,
}: {
  kind: ProbabilityLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-probability-hook">
      <strong>
        {kind === 'probability-independent'
          ? 'P(A∩B) = P(A)P(B) ?'
          : kind === 'probability-tree'
            ? 'P(A) × P(B|A) ?'
            : kind === 'probability-without'
              ? 'RB + BR ?'
              : kind === 'probability-bias'
                ? '8 / 24 · WHO IS MISSING ?'
                : 'hits / n ≈ P ?'}
      </strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测，再按编号、条件和记录核验。',
            'Predict first, then audit IDs, conditions and records.',
          )}
        />
      </p>
    </div>
  );
}
export function ProbabilityLab({
  kind,
  mode,
}: {
  kind: ProbabilityLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-probability-lab">
      {kind === 'probability-independent' ? (
        <IndependenceLab mode={mode} />
      ) : kind === 'probability-tree' ? (
        <TreeLab mode={mode} without={false} />
      ) : kind === 'probability-without' ? (
        <TreeLab mode={mode} without />
      ) : kind === 'probability-bias' ? (
        <SurveyLab mode={mode} />
      ) : (
        <SimulationLab mode={mode} />
      )}
    </section>
  );
}
