import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson } from './model';
import { checkNumberSet } from './numberSetAnswers';
import { Text } from './ui';
import {
  OrderedCards,
  Spinner,
  ChanceTokens,
  FrequencyPlot,
} from './ChanceVisuals';
import {
  orderedSummary,
  spinnerModel,
  eventChance,
  bagChance,
  runSpinnerTrials,
  frequencySummary,
  fractionText,
} from './chanceModels';
export type ChanceLabKind = Extract<Lesson['lab'], `chance-${string}`>;
export const isChanceLab = (kind: Lesson['lab']): kind is ChanceLabKind =>
  kind.startsWith('chance-');
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Check({
  mode,
  text,
  click,
  disabled = false,
}: {
  mode: LanguageMode;
  text: LocalizedText;
  click: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="math-button" onClick={click} disabled={disabled}>
      <Text mode={mode} text={text} />
    </button>
  );
}
function Feedback({
  mode,
  text,
}: {
  mode: LanguageMode;
  text: LocalizedText | null;
}) {
  return text ? (
    <p
      role="status"
      aria-label={word(mode, t('探索反馈', 'Workshop feedback'))}
    >
      <Text mode={mode} text={text} />
    </p>
  ) : null;
}
function Slider({
  mode,
  label,
  value,
  min,
  max,
  change,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  value: number;
  min: number;
  max: number;
  change: (v: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        aria-label={word(mode, label)}
        value={value}
        min={min}
        max={max}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
const dataSets = [
  { id: 'odd', values: [9, 1, 3, 3, 4] },
  { id: 'even', values: [8, 2, 6, 4] },
  { id: 'ties', values: [1, 1, 2, 2, 3] },
  { id: 'zero', values: [0, 0, 0] },
];
function Order({ mode }: { mode: LanguageMode }) {
  const [data, setData] = useState('odd'),
    [sorted, setSorted] = useState(false),
    [median, setMedian] = useState(''),
    [modes, setModes] = useState(''),
    [status, setStatus] = useState<LocalizedText | null>(null),
    values = dataSets.find((d) => d.id === data)!.values,
    m = orderedSummary(values);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先排序，再找位置。众数看频数；并列最高且重复的数要全写。本课约定所有数只出现一次时记“无众数”，不是零；偶数条的中位数可能不是原数据之一。',
            'Sort before locating middle positions. Mode uses frequency: report every tied highest repeated value. Here all-singleton data have “no mode”, not mode zero. An even-count median may be absent from the original observations.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('记录组', 'Observation set')} />
        <select
          aria-label={word(mode, t('记录组', 'Observation set'))}
          value={data}
          onChange={(e) => {
            setData(e.target.value);
            setSorted(false);
            setMedian('');
            setModes('');
            setStatus(null);
          }}
        >
          {dataSets.map((d) => (
            <option key={d.id} value={d.id}>
              {d.values.join(', ')}
            </option>
          ))}
        </select>
      </label>
      <OrderedCards
        values={values}
        sorted={sorted}
        highlight={sorted}
        mode={mode}
      />
      <button
        className="math-quiet"
        onClick={() => {
          setSorted(!sorted);
          setStatus(null);
        }}
      >
        <Text
          mode={mode}
          text={
            sorted
              ? t('查看原记录顺序', 'View original order')
              : t(
                  '保留全部记录并排序',
                  'Sort while retaining every observation',
                )
          }
        />
      </button>
      <div className="math-chance-controls">
        <label>
          <Text mode={mode} text={t('我的中位数', 'My median')} />
          <input
            aria-label={word(mode, t('我的中位数', 'My median'))}
            value={median}
            onChange={(e) => {
              setMedian(e.target.value);
              setStatus(null);
            }}
          />
        </label>
        <label>
          <Text
            mode={mode}
            text={t(
              '全部众数（逗号分隔，或无众数）',
              'All modes (commas, or no mode)',
            )}
          />
          <input
            aria-label={word(
              mode,
              t(
                '全部众数（逗号分隔，或无众数）',
                'All modes (commas, or no mode)',
              ),
            )}
            value={modes}
            onChange={(e) => {
              setModes(e.target.value);
              setStatus(null);
            }}
          />
        </label>
      </div>
      <Check
        mode={mode}
        text={t(
          '核对中间位置与最高频数',
          'Check middle positions and highest frequency',
        )}
        click={() => {
          const med = checkAnswer(median, {
              kind: 'number',
              value: fractionText(m.median),
            }),
            mod = checkNumberSet(modes, m.modes.map(String));
          setStatus(
            t(
              `${med ? '中位数正确' : '再查排序后的中间位置'}；${mod ? '众数完整' : '众数还需按频数完整核对'}。中间是第 ${m.middle.map((i) => i + 1).join('、')} 位，中位数 ${fractionText(m.median)}；${m.modes.length ? `众数 ${m.modes.join('、')}，各出现 ${m.maxFrequency} 次` : '每个数只出现一次，记无众数'}。`,
              `${med ? 'Median correct' : 'Recheck the ordered middle positions'}; ${mod ? 'modes complete' : 'recheck all highest frequencies'}. The middle position${m.middle.length > 1 ? 's are' : ' is'} ${m.middle.map((i) => i + 1).join(' and ')}, giving median ${fractionText(m.median)}. ${m.modes.length ? `Mode${m.modes.length > 1 ? 's' : ''}: ${m.modes.join(', ')}, each occurring ${m.maxFrequency} times` : 'Every value occurs once: no mode'}.`,
            ),
          );
        }}
      />
      <Feedback mode={mode} text={status} />
    </>
  );
}
function Summary({ mode }: { mode: LanguageMode }) {
  const [last, setLast] = useState(28),
    [goal, setGoal] = useState('typical'),
    [measure, setMeasure] = useState('mean'),
    [show, setShow] = useState(false),
    values = [2, 3, 3, 4, last],
    m = orderedSummary(values),
    correct =
      goal === 'typical' ? 'median' : goal === 'share' ? 'mean' : 'mode';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '这些是假想的五次等待分钟数，最后一条是真实保留的较大观察值，不自动删除。描述典型中间位置、分摊完整总量与找最常见类别，是不同问题。',
            'These are five fictional waiting times in minutes. The large final observation is retained, not automatically deleted. Describing a middle position, sharing the full total and finding a common category are different questions.',
          )}
        />
      </p>
      <Slider
        mode={mode}
        label={t('最后一次等待（分钟）', 'Last wait (minutes)')}
        value={last}
        min={8}
        max={40}
        change={(v) => {
          setLast(v);
          setShow(false);
        }}
      />
      <OrderedCards values={values} sorted mode={mode} />
      <label>
        <Text mode={mode} text={t('要回答的问题', 'Question to answer')} />
        <select
          aria-label={word(mode, t('要回答的问题', 'Question to answer'))}
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            setShow(false);
          }}
        >
          <option value="typical">
            {word(
              mode,
              t(
                '用中间位置稳健描述这五次等待',
                'Describe these waits by a resistant middle position',
              ),
            )}
          </option>
          <option value="share">
            {word(
              mode,
              t(
                '把这五次总分钟数等分五份',
                'Share their full total equally into five parts',
              ),
            )}
          </option>
          <option value="category">
            {word(
              mode,
              t(
                '找纸卡类别 A,A,B,C 中最常见类别',
                'Find the common category in A,A,B,C',
              ),
            )}
          </option>
        </select>
      </label>
      {goal === 'category' && <p>A, A, B, C</p>}
      <label>
        <Text mode={mode} text={t('选择统计量', 'Choose a summary')} />
        <select
          aria-label={word(mode, t('选择统计量', 'Choose a summary'))}
          value={measure}
          onChange={(e) => {
            setMeasure(e.target.value);
            setShow(false);
          }}
        >
          <option value="mean">{word(mode, t('平均数', 'Mean'))}</option>
          <option value="median">{word(mode, t('中位数', 'Median'))}</option>
          <option value="mode">{word(mode, t('众数', 'Mode'))}</option>
        </select>
      </label>
      <Check
        mode={mode}
        text={t('按问题核对选择', 'Check the choice against the question')}
        click={() => setShow(true)}
      />
      <Feedback
        mode={mode}
        text={
          show
            ? t(
                `${measure === correct ? '选择与问题相符。' : '先重读问题问什么。'}等待数据总量 ${m.total}，平均数 ${fractionText(m.mean)}，中位数 ${fractionText(m.median)}，众数三。${goal === 'typical' ? '中间位置描述用中位数，不会被最后一条远处数值同样拉动。' : goal === 'share' ? '等分完整总量用平均数，较大值也必须计入。' : '类别用众数 A；不能把类别字母求平均或按字母表当数值中位数。'}这些只描述给定记录，不代表所有人或下一次。`,
                `${measure === correct ? 'The choice matches the question.' : 'Reread the requested quantity.'} Wait total ${m.total}, mean ${fractionText(m.mean)}, median ${fractionText(m.median)}, mode three. ${goal === 'typical' ? 'Use median for the requested resistant middle position.' : goal === 'share' ? 'Use mean to share the complete total, retaining the large value.' : 'Use category mode A; category letters have no numerical mean or numerical median.'} These describe the given records, not everyone or the next observation.`,
              )
            : null
        }
      />
    </>
  );
}
export const chanceSetups = [
  { id: 'half', labels: ['A', 'B', 'C'], weights: [2, 1, 1] },
  { id: 'thirds', labels: ['A', 'B', 'C'], weights: [1, 1, 1] },
  { id: 'repeated', labels: ['A', 'A', 'B', 'C'], weights: [1, 1, 1, 1] },
];
function Setup({
  mode,
  value,
  change,
}: {
  mode: LanguageMode;
  value: string;
  change: (s: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={t('转盘结构', 'Spinner structure')} />
      <select
        aria-label={word(mode, t('转盘结构', 'Spinner structure'))}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        <option value="half">
          {word(
            mode,
            t('A 半圆，B/C 各四分之一', 'A half, B/C one quarter each'),
          )}
        </option>
        <option value="thirds">
          {word(mode, t('A/B/C 等分三份', 'A/B/C equal thirds'))}
        </option>
        <option value="repeated">
          {word(mode, t('等分四份：A,A,B,C', 'Four equal sectors: A,A,B,C'))}
        </option>
      </select>
    </label>
  );
}
function Equal({ mode }: { mode: LanguageMode }) {
  const [setup, setSetup] = useState('half'),
    [event, setEvent] = useState('A'),
    [guess, setGuess] = useState('possible'),
    [show, setShow] = useState(false),
    config = chanceSetups.find((s) => s.id === setup)!,
    m = spinnerModel(config.labels, config.weights),
    chosen = event === 'all' ? m.labels : [event],
    p = eventChance(m, chosen);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '理想均匀角度模型中，先看扇区大小，再合并相同字母。出现三个字母不自动各占三分之一；“可能但不必然”既不等于必然，也不等于所有结果等可能。',
            'For an ideal uniform-angle spinner, inspect sector sizes and combine matching letters. Three letter names do not automatically mean one third each. Possible but uncertain differs from both certainty and equal likelihood.',
          )}
        />
      </p>
      <Setup
        mode={mode}
        value={setup}
        change={(v) => {
          setSetup(v);
          setShow(false);
        }}
      />
      <Spinner {...config} mode={mode} />
      <label>
        <Text mode={mode} text={t('观察事件', 'Observed event')} />
        <select
          aria-label={word(mode, t('观察事件', 'Observed event'))}
          value={event}
          onChange={(e) => {
            setEvent(e.target.value);
            setShow(false);
          }}
        >
          {['A', 'B', 'D', 'all'].map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'A or B or C' : s}
            </option>
          ))}
        </select>
      </label>
      <label>
        <Text mode={mode} text={t('事件判断', 'Event classification')} />
        <select
          aria-label={word(mode, t('事件判断', 'Event classification'))}
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            setShow(false);
          }}
        >
          <option value="impossible">
            {word(mode, t('不可能', 'Impossible'))}
          </option>
          <option value="possible">
            {word(mode, t('可能但不必然', 'Possible but uncertain'))}
          </option>
          <option value="certain">{word(mode, t('必然', 'Certain'))}</option>
        </select>
      </label>
      <Check
        mode={mode}
        text={t(
          '核对事件与等可能条件',
          'Check the event and equal-likelihood conditions',
        )}
        click={() => setShow(true)}
      />
      <Feedback
        mode={mode}
        text={
          show
            ? t(
                `${guess === p.kind ? '事件判断正确。' : '再看事件占了哪些扇区。'}事件概率 ${fractionText(p.probability)}；${p.kind === 'impossible' ? '没有符合结果，不可能' : p.kind === 'certain' ? '覆盖全部结果，必然' : '有符合也有不符合结果，可能但不必然'}。各不同字母${m.equalLabels ? '等可能' : '不等可能'}：${m.labelWeights.map((v) => `${v.label}=${v.weight}/${m.total}`).join('，')}。等扇区与等字母是两层不同的判断。`,
                `${guess === p.kind ? 'Classification correct.' : 'Recheck which sectors belong to the event.'} Event probability ${fractionText(p.probability)}: ${p.kind === 'impossible' ? 'no matching outcomes, impossible' : p.kind === 'certain' ? 'all outcomes match, certain' : 'matching and nonmatching outcomes, possible but uncertain'}. Distinct letters are ${m.equalLabels ? 'equally' : 'not equally'} likely: ${m.labelWeights.map((v) => `${v.label}=${v.weight}/${m.total}`).join(', ')}. Equal sectors and equal letter events are different checks.`,
              )
            : null
        }
      />
    </>
  );
}
const eventIndices = (event: string) =>
  event === 'AB'
    ? [0, 1]
    : event === 'all'
      ? [0, 1, 2]
      : event === 'D'
        ? []
        : [event.charCodeAt(0) - 65];
function Event({ mode }: { mode: LanguageMode }) {
  const [counts, setCounts] = useState([3, 2, 1]),
    [event, setEvent] = useState('A'),
    [input, setInput] = useState(''),
    [show, setShow] = useState(false),
    selected = eventIndices(event),
    m = counts.some(Boolean) ? bagChance(counts, selected) : null;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '假想袋中圆片同样大小，充分混匀后每一枚等可能抽到，抽后放回。先数对象，再把事件所含类别相加；不是按有几个类别平均分概率。',
            'The fictional tokens are same-sized and mixed so each individual token is equally likely, with replacement after drawing. Count objects and combine event categories; do not divide chance equally among label names.',
          )}
        />
      </p>
      {counts.map((n, i) => (
        <Slider
          key={i}
          mode={mode}
          label={t(
            `${String.fromCharCode(65 + i)} 圆片个数`,
            `${String.fromCharCode(65 + i)} token count`,
          )}
          value={n}
          min={0}
          max={8}
          change={(v) => {
            setCounts(counts.map((x, j) => (j === i ? v : x)));
            setShow(false);
          }}
        />
      ))}
      <label>
        <Text mode={mode} text={t('抽取事件', 'Drawing event')} />
        <select
          aria-label={word(mode, t('抽取事件', 'Drawing event'))}
          value={event}
          onChange={(e) => {
            setEvent(e.target.value);
            setInput('');
            setShow(false);
          }}
        >
          {['A', 'B', 'C', 'AB', 'D', 'all'].map((s) => (
            <option key={s} value={s}>
              {s === 'AB' ? 'A or B' : s === 'all' ? 'A or B or C' : s}
            </option>
          ))}
        </select>
      </label>
      <ChanceTokens counts={counts} selected={selected} mode={mode} />
      {!m && (
        <p>
          <Text
            mode={mode}
            text={t(
              '空袋没有抽取结果，概率模型未定义；不是把空袋记为概率零。',
              'An empty bag has no drawing outcome: the probability model is undefined, rather than assigned zero.',
            )}
          />
        </p>
      )}
      <label>
        <Text
          mode={mode}
          text={t(
            '我的概率（分数、小数或百分数）',
            'My probability (fraction, decimal or percent)',
          )}
        />
        <input
          aria-label={word(
            mode,
            t(
              '我的概率（分数、小数或百分数）',
              'My probability (fraction, decimal or percent)',
            ),
          )}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShow(false);
          }}
        />
      </label>
      <Check
        mode={mode}
        disabled={!m}
        text={t('核对有利对象与全部对象', 'Check favourable and total objects')}
        click={() => setShow(true)}
      />
      <Feedback
        mode={mode}
        text={
          show && m
            ? t(
                `${checkAnswer(input, { kind: 'number', value: fractionText(m.probability), formats: ['decimal', 'fraction', 'percent'] }) ? '概率正确。' : '重数事件和全部对象。'}符合 ${m.favourable} 枚，共 ${m.total} 枚，P=${m.favourable}/${m.total}=${fractionText(m.probability)}。概率是无单位的比例；零表示此非空模型没有符合结果，一表示全部符合，下一次不由以前结果补偿。`,
                `${checkAnswer(input, { kind: 'number', value: fractionText(m.probability), formats: ['decimal', 'fraction', 'percent'] }) ? 'Probability correct.' : 'Recount the event and the whole bag.'} ${m.favourable} favourable out of ${m.total}: P=${m.favourable}/${m.total}=${fractionText(m.probability)}. Probability is a unitless proportion. Zero means no matching outcome in this nonempty model; one means all match. Previous draws do not force compensation on the next draw.`,
              )
            : null
        }
      />
    </>
  );
}
function Frequency({ mode }: { mode: LanguageMode }) {
  const [setup, setSetup] = useState('half'),
    [seed, setSeed] = useState(7),
    [state, setState] = useState(7),
    [event, setEvent] = useState('A'),
    [trials, setTrials] = useState<
      { label: string; sector: number; u: number }[]
    >([]),
    [show, setShow] = useState(false),
    config = chanceSetups.find((s) => s.id === setup)!,
    model = spinnerModel(config.labels, config.weights),
    chosen = [event],
    summary = frequencySummary(
      trials.map((t) => t.label),
      chosen,
    ),
    theory = eventChance(model, chosen);
  const reset = (nextSeed = seed) => {
    setState(nextSeed);
    setTrials([]);
    setShow(false);
  };
  const run = (count: number) => {
    const next = runSpinnerTrials(model, state, count);
    setState(next.state);
    setTrials([...trials, ...next.outcomes]);
    setShow(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '这是可重复的伪随机模拟，不是实测。理论值基于理想均匀角度；相同结构和种子可重放同一序列。改变结构或种子会开启新批次；换观察字母只重新统计同批记录。',
            'This reproducible pseudorandom simulation is not observed data. Theory assumes ideal uniform angles. The same structure and seed replay the sequence. Changing structure or seed starts a new batch; changing the observed letter recounts the existing batch.',
          )}
        />
      </p>
      <Setup
        mode={mode}
        value={setup}
        change={(v) => {
          setSetup(v);
          reset();
        }}
      />
      <Slider
        mode={mode}
        label={t('演示种子', 'Demonstration seed')}
        value={seed}
        min={1}
        max={99}
        change={(v) => {
          setSeed(v);
          reset(v);
        }}
      />
      <Spinner {...config} mode={mode} angle={trials[trials.length - 1]?.u} />
      <label>
        <Text mode={mode} text={t('统计字母', 'Count letter')} />
        <select
          aria-label={word(mode, t('统计字母', 'Count letter'))}
          value={event}
          onChange={(e) => {
            setEvent(e.target.value);
            setShow(false);
          }}
        >
          {['A', 'B', 'C'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <div className="math-chance-actions">
        {[1, 10, 100].map((n) => (
          <button
            className="math-quiet"
            key={n}
            disabled={trials.length + n > 1000}
            onClick={() => run(n)}
          >
            <Text
              mode={mode}
              text={t(
                `模拟 ${n} 次`,
                `Simulate ${n} ${n === 1 ? 'trial' : 'trials'}`,
              )}
            />
          </button>
        ))}
        <button className="math-quiet" onClick={() => reset()}>
          <Text
            mode={mode}
            text={t('清空并重放本种子', 'Clear and replay this seed')}
          />
        </button>
      </div>
      <p className="math-chance-frequency" aria-live="polite">
        <Text
          mode={mode}
          text={t(
            `理论 P(${event})=${fractionText(theory.probability)}；累计 ${summary.trials} 次，符合 ${summary.hits} 次；实验频率${summary.frequency ? ` ${summary.hits}/${summary.trials}=${fractionText(summary.frequency)}` : '未定义（尚无试验）'}。`,
            `Theory P(${event})=${fractionText(theory.probability)}; ${summary.trials} ${summary.trials === 1 ? 'trial' : 'trials'}, ${summary.hits} ${summary.hits === 1 ? 'hit' : 'hits'}; experimental frequency ${summary.frequency ? `${summary.hits}/${summary.trials}=${fractionText(summary.frequency)}` : 'undefined (no trials)'}.`,
          )}
        />
      </p>
      <FrequencyPlot
        outcomes={trials.map((t) => t.label)}
        event={chosen}
        model={model}
        mode={mode}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '最近八次结果；累计统计仍保留本批全部记录（上限一千次）。',
            'Latest eight outcomes; cumulative statistics retain the whole batch, up to one thousand trials.',
          )}
        />
      </p>
      <ol
        className="math-chance-history"
        start={Math.max(1, trials.length - 7)}
        aria-label={word(mode, t('最近模拟结果', 'Latest simulated outcomes'))}
      >
        {trials.slice(-8).map((v, i) => (
          <li
            key={trials.length - Math.min(trials.length, 8) + i}
            data-trial-index={
              trials.length - Math.min(trials.length, 8) + i + 1
            }
          >
            {v.label} / S{v.sector + 1}
          </li>
        ))}
      </ol>
      <Check
        mode={mode}
        disabled={!trials.length}
        text={t('解释频率与下一次机会', 'Explain frequency and the next trial')}
        click={() => setShow(true)}
      />
      <Feedback
        mode={mode}
        text={
          show
            ? t(
                `观察到的频率 ${fractionText(summary.frequency!)} 描述这 ${summary.trials} 次，不会改掉理想概率 ${fractionText(theory.probability)}。多做一次可能更接近，也可能更远；过去连续某字母不要求下一次“补回来”。伪随机演示不能证明所有长序列的性质，也不保证每批恰好达到理论比例。`,
                `Observed frequency ${fractionText(summary.frequency!)} describes these ${summary.trials} trials; ideal probability remains ${fractionText(theory.probability)}. One more trial can move closer or farther. A run of one letter does not force the next to compensate. The simulation proves no universal long-run claim and does not guarantee each batch matches theory exactly.`,
              )
            : null
        }
      />
    </>
  );
}
export function ChanceLab({
  kind,
  mode,
}: {
  kind: ChanceLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-chance-lab">
      <span className="math-eyebrow">
        <Text
          mode={mode}
          text={t(
            '动手数学 · 数据、条件与机会',
            'HANDS-ON MATHS · DATA, ASSUMPTIONS AND CHANCE',
          )}
        />
      </span>
      {kind === 'chance-order' ? (
        <Order mode={mode} />
      ) : kind === 'chance-summary' ? (
        <Summary mode={mode} />
      ) : kind === 'chance-equal' ? (
        <Equal mode={mode} />
      ) : kind === 'chance-event' ? (
        <Event mode={mode} />
      ) : (
        <Frequency mode={mode} />
      )}
    </section>
  );
}
export function ChanceHookArt({
  kind,
  mode,
}: {
  kind: ChanceLabKind;
  mode: LanguageMode;
}) {
  const prompt = {
    'chance-order': '1, 3, 3, 4, 9 → ?',
    'chance-summary': '2, 3, 3, 4, 28 → ?',
    'chance-equal': 'A, A, B, C → ?',
    'chance-event': 'P(E) = ?',
    'chance-frequency': 'P(E) ↔ f(E) ?',
  }[kind];
  return (
    <div className="math-chance-hook">
      <b>{prompt}</b>
      <Text
        mode={mode}
        text={t(
          '先说记录对象、问题与理想条件，再用证据解释。',
          'Name the observations, question and ideal assumptions, then explain from evidence.',
        )}
      />
    </div>
  );
}
