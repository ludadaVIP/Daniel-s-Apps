import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import {
  sampleRecords,
  fictionalPopulation,
  distributionPairs,
  distribution,
  changedRecord,
  sampleSpace,
  drawTree,
  treeEvent,
  probabilityText,
  type SpaceKind,
  type TreeEvent,
} from './inferenceModels';
import { DotDistribution, ProbabilityTree } from './InferenceVisuals';
export type InferenceLabKind = Extract<Lesson['lab'], `infer-${string}`>;
export const isInferenceLab = (kind: Lesson['lab']): kind is InferenceLabKind =>
  kind.startsWith('infer-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
const number = (value: string, probability = false): AnswerSpec => ({
  kind: 'number',
  value,
  formats: probability
    ? ['decimal', 'fraction', 'percent']
    : ['decimal', 'fraction'],
});
function Range({
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
function Task({
  mode,
  name,
  answer,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div
      className="math-inference-task"
      role="group"
      aria-label={label(mode, name)}
    >
      <label>
        <Text mode={mode} text={name} />
        <input
          type="text"
          value={input}
          aria-label={label(mode, name)}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      {answer.kind === 'outcome-set' && (
        <p>
          <Text
            mode={mode}
            text={t(
              '用给定代码、逗号分隔，可加大括号；集合不重不漏，代码内部顺序不能颠倒。',
              'Use the supplied codes separated by commas, optionally in braces. No duplicates or omissions; order within each code matters.',
            )}
          />
        </p>
      )}
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对我的结果', 'Check my result')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('推理反馈', 'Reasoning feedback'))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(input, answer) === true
                ? t(
                    '结果符合；解释抽样、记录或等可能及条件变化的依据。',
                    'The result matches; explain the sampling, records, equal-likelihood assumptions or conditional changes.',
                  )
                : t(
                    '再核总体和样本、全部记录、基本结果是否等可能及第二步条件。集合要完整，不重复，也不合并有序结果。',
                    'Recheck population/sample, all records, equal likelihood of basic outcomes and second-step conditions. List complete distinct outcomes without merging ordered codes.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Sampling({ mode }: { mode: LanguageMode }) {
  const [size, setSize] = useState(6),
    [method, setMethod] = useState<'random' | 'nearby'>('nearby'),
    [round, setRound] = useState(0),
    [seedBase, setSeedBase] = useState(12345),
    [shown, setShown] = useState(false),
    seed = (seedBase + round * 7919) >>> 0,
    m = sampleRecords(size, method, seed);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '总体是 24 条虚构通勤分钟记录，A/B/C 三个编号组各八条。样本为本次取出的不同编号；本示例抽样不放回。只取 A 组与让全部编号有资格不同，样本大不自动消除覆盖偏差。',
            'The population is 24 fictional commute-minute records, eight each in numbered groups A/B/C. The sample contains distinct records drawn without replacement. Sampling only A differs from making all records eligible; size alone does not remove coverage bias.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('抽样方法', 'Sampling method')} />
        <select
          aria-label={label(mode, t('抽样方法', 'Sampling method'))}
          value={method}
          onChange={(e) => {
            setMethod(e.target.value as typeof method);
            setShown(false);
          }}
        >
          <option value="nearby">
            {label(
              mode,
              t('只取容易接触的 A 组', 'Convenience frame: group A only'),
            )}
          </option>
          <option value="random">
            {label(
              mode,
              t(
                '从全部编号模拟随机抽取',
                'Simulated random draw from all records',
              ),
            )}
          </option>
        </select>
      </label>
      <Range
        mode={mode}
        name={t('样本条数', 'Sample size')}
        value={size}
        min={2}
        max={8}
        change={(n) => {
          setSize(n);
          setShown(false);
        }}
      />
      <button
        className="math-button"
        disabled={method === 'nearby'}
        onClick={() => {
          setRound(round + 1);
          setShown(false);
        }}
      >
        <Text
          mode={mode}
          text={
            method === 'nearby'
              ? t('切换随机模式后可重抽', 'Switch to random to resample')
              : t('换一组可重现模拟', 'Next reproducible simulation')
          }
        />
      </button>
      <button
        className="math-button secondary"
        onClick={() => {
          setMethod('random');
          setSize(2);
          setSeedBase(17);
          setRound(0);
          setShown(false);
        }}
      >
        <Text
          mode={mode}
          text={t('比较一个两条记录的模拟', 'Compare a two-record simulation')}
        />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            `抽取资格覆盖 ${m.frameSize} 条，本次样本 ${size} 条；各组实际抽到 ${m.groups.map((g) => `${g.group}:${g.count}`).join('，')}。`,
            `The frame covers ${m.frameSize} records; this sample has ${size}. Realised group counts: ${m.groups.map((g) => `${g.group}:${g.count}`).join(', ')}.`,
          )}
        />
      </p>
      <div className="math-inference-records">
        {m.sample.map((p) => (
          <span key={p.id} data-sample-id={p.id}>
            {p.id}: {p.value} min
          </span>
        ))}
      </div>
      <Task
        key={`${size}/${method}/${seed}`}
        mode={mode}
        name={t('本次样本的均值（分钟数）', 'Mean of this sample (minutes)')}
        answer={number(probabilityText(m.summary.mean))}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '展开或收起总体对照',
            'Show or hide the population comparison',
          )}
        />
      </button>
      {shown && (
        <>
          <div className="math-inference-records">
            {fictionalPopulation.map((p) => (
              <span key={p.id} data-population-id={p.id}>
                {p.id}: {p.value}
              </span>
            ))}
          </div>
          <p>
            <Text
              mode={mode}
              text={t('此虚构总体均值为', 'This fictional population mean is')}
            />{' '}
            {probabilityText(m.population.mean)} min
          </p>
          {method === 'random' && (
            <p>
              <Text
                mode={mode}
                text={t(
                  '同条数、只取 A 前几条的对照均值为',
                  'The same-size A-only comparison mean is',
                )}
              />{' '}
              {probabilityText(
                sampleRecords(size, 'nearby', seed).summary.mean,
              )}{' '}
              min{mode === 'en' ? '. ' : '。'}
              <Text
                mode={mode}
                text={t(
                  '比较与总体的距离，只能判断这一次，不能从一次结果断言哪种方法每次都更准。',
                  'Compare distances from the population for this run; one result cannot establish which method is closer every time.',
                )}
              />
            </p>
          )}
        </>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '随机机制设定全部编号等机会，程序用固定种子伪随机次序作可重复演示，不是真实调查。随机样本也有抽样误差，不保证每次更接近总体或每组都被抽中；抽样框覆盖与本次样本构成要分开。',
            'The model assumes equal eligibility of all records; a fixed-seed pseudorandom ordering makes the demonstration reproducible, not a real survey. Random samples still vary and need not be closer every time or include every group. Frame coverage differs from realised composition.',
          )}
        />
      </p>
    </>
  );
}
function Distributions({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    m = distributionPairs[index]!;
  return (
    <>
      <label>
        <Text mode={mode} text={t('分布对照', 'Distribution comparison')} />
        <select
          aria-label={label(mode, t('分布对照', 'Distribution comparison'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          <option value="0">
            {label(
              mode,
              t('中心相同，分散不同', 'Same centre, different spread'),
            )}
          </option>
          <option value="1">
            {label(
              mode,
              t('形状相同，位置移动', 'Same shape, shifted location'),
            )}
          </option>
        </select>
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            '每组六条虚构同单位记录，共用 0–10 刻度。先看集中位置、分散、空隙与簇，再用统计量描述；均值相同不代表分布相同。',
            'Each group has six fictional same-unit records on a shared 0–10 scale. Inspect centre, spread, gaps and clusters before summaries; equal means do not imply equal distributions.',
          )}
        />
      </p>
      <DotDistribution name="A" values={m.a} mode={mode} showSummary={shown} />
      <DotDistribution name="B" values={m.b} mode={mode} showSummary={shown} />
      <Task
        key={index}
        mode={mode}
        name={t('B 组的极差', 'Range of group B')}
        answer={number(String(distribution(m.b).range))}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('显示或收起统计量', 'Show or hide summaries')}
        />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            '整体向右移动可以改变中心而保持形状和极差；把中间记录移向两端可保持中心却改变分散。点图不能自动说明产生差异的原因。',
            'A shift can change centre while preserving shape and range. Moving middle values towards both ends can preserve centre while changing spread. The plot alone does not identify a cause.',
          )}
        />
      </p>
    </>
  );
}
function Outliers({ mode }: { mode: LanguageMode }) {
  const [last, setLast] = useState(50),
    [verified, setVerified] = useState(false),
    m = changedRecord(last);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '原五条为 4、5、6、7、8，保持条数，只把最后一条改为指定值。两图共用 0–60 刻度，不删掉极端点，也不把零当缺失。',
            'Start with 4,5,6,7,8 and replace only the final record, retaining five observations. Both plots share 0–60; do not delete an extreme value or treat zero as missing.',
          )}
        />
      </p>
      <Range
        mode={mode}
        name={t('替换的最后一条', 'Replacement final value')}
        value={last}
        min={0}
        max={60}
        change={(n) => {
          setLast(n);
          setVerified(false);
        }}
      />
      <DotDistribution
        name={label(mode, t('原记录', 'Original'))}
        values={m.original}
        max={60}
        step={10}
        mode={mode}
      />
      <DotDistribution
        name={label(mode, t('改后一组', 'Changed'))}
        values={m.changed}
        max={60}
        step={10}
        mode={mode}
      />
      <p>{m.changed.join(', ')}</p>
      <Task
        key={`mean/${last}`}
        mode={mode}
        name={t('改后均值', 'Changed mean')}
        answer={number(probabilityText(m.after.mean))}
      />
      <Task
        key={`median/${last}`}
        mode={mode}
        name={t('改后中位数', 'Changed median')}
        answer={number(probabilityText(m.after.median))}
      />
      <label className="math-inference-check">
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
        />
        <Text
          mode={mode}
          text={t(
            '在此虚构情境中已核对原始记录',
            'Original record checked in this fictional context',
          )}
        />
      </label>
      <p>
        <Text
          mode={mode}
          text={
            verified
              ? t(
                  '已核对仍是有效记录，保留并说明它如何影响均值与分布；中位数也并非永远不变。',
                  'The checked record remains valid: retain it and describe its influence. The median is not guaranteed to remain unchanged.',
                )
              : t(
                  '异常只提示需要核来源、单位或录入，不自动等于错误；核实前仍保留这条记录，不偷偷删掉。',
                  'An unusual value suggests checking source, units or entry; it is not automatically an error. Retain it while checking.',
                )
          }
        />
      </p>
    </>
  );
}
function Spaces({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<SpaceKind>('coins'),
    [shown, setShown] = useState(false),
    m = sampleSpace(kind),
    names = {
      coins: t(
        '两次独立公平硬币：H 正面、T 反面。事件是恰一次 H。',
        'Two independent fair coin tosses: H/T label faces. The event is exactly one H.',
      ),
      'coin-spinner': t(
        '独立公平硬币与三等分 1/2/3 转盘，硬币记前。事件 T2。',
        'Independent fair coin and equal-sector 1/2/3 spinner, coin first. Event T2.',
      ),
      dice: t(
        '两枚可区分的独立公平六面骰，先第一枚再第二枚，11 表示 (1,1)。事件是和七。',
        'Two distinguishable independent fair six-sided dice, first then second; 11 codes (1,1). Event: sum seven.',
      ),
    };
  return (
    <>
      <label>
        <Text
          mode={mode}
          text={t('给定等可能实验', 'Supplied equally likely experiment')}
        />
        <select
          aria-label={label(
            mode,
            t('给定等可能实验', 'Supplied equally likely experiment'),
          )}
          value={kind}
          onChange={(e) => {
            setKind(e.target.value as SpaceKind);
            setShown(false);
          }}
        >
          <option value="coins">
            {label(mode, t('两次硬币', 'Two tosses'))}
          </option>
          <option value="coin-spinner">
            {label(mode, t('硬币与转盘', 'Coin and spinner'))}
          </option>
          <option value="dice">{label(mode, t('两枚骰子', 'Two dice'))}</option>
        </select>
      </label>
      <p>
        <Text mode={mode} text={names[kind]} />
      </p>
      <Task
        key={`space/${kind}`}
        mode={mode}
        name={t('完整样本空间代码', 'Complete sample-space codes')}
        answer={{
          kind: 'outcome-set',
          values: m.outcomes.map((o) => o.id),
          value: m.outcomes.map((o) => o.id).join(','),
        }}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('展开或收起逐项列表', 'Show or hide the systematic list')}
        />
      </button>
      {shown && (
        <div
          className="math-inference-outcomes"
          role="list"
          aria-label={label(mode, t('有序基本结果', 'Ordered basic outcomes'))}
        >
          {m.outcomes.map((o) => (
            <span
              role="listitem"
              key={o.id}
              data-outcome={o.id}
              data-event-hit={o.hit}
            >
              {o.id}
              {o.hit ? ' ✓' : ''}
            </span>
          ))}
        </div>
      )}
      <Task
        key={`prob/${kind}`}
        mode={mode}
        name={t('指定事件的概率', 'Probability of the specified event')}
        answer={number(probabilityText(m.probability), true)}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '先说明每个基本结果等可能，才用符合数除以总数。顺序结果不能合并；骰子和 2–12 的十一种数值不是等可能基本结果，不能直接写 1/11。✓ 只标事件结果。',
            'Count favourable over total only after establishing equally likely basic outcomes. Keep order. Dice sums 2–12 are eleven values but are not equally likely, so 1/11 is unjustified. A tick marks event membership.',
          )}
        />
      </p>
    </>
  );
}
function Trees({ mode }: { mode: LanguageMode }) {
  const [red, setRed] = useState(2),
    [blue, setBlue] = useState(1),
    [replace, setReplace] = useState(false),
    [event, setEvent] = useState<TreeEvent>('two-red'),
    [shown, setShown] = useState(false),
    tree = drawTree(red, blue, replace),
    m = treeEvent(tree, event),
    key = `${red}/${blue}/${replace}/${event}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '每个球都有不同编号，每一步在现存球中等机会抽一个。R/B 只表示颜色，先后顺序保留；放回须混匀，不放回则第二步总数与相应颜色个数都改变。',
            'Every token has a distinct ID and each remaining token is equally likely at a draw. R/B record colour in order. Replacement includes remixing; without it, both the total and the drawn colour count change.',
          )}
        />
      </p>
      <div className="math-inference-controls">
        <Range
          mode={mode}
          name={t('红球个数', 'Red tokens')}
          value={red}
          min={1}
          max={4}
          change={(n) => {
            setRed(n);
            setShown(false);
          }}
        />
        <Range
          mode={mode}
          name={t('蓝球个数', 'Blue tokens')}
          value={blue}
          min={1}
          max={4}
          change={(n) => {
            setBlue(n);
            setShown(false);
          }}
        />
      </div>
      <label>
        <Text mode={mode} text={t('第二步前的处理', 'Between draws')} />
        <select
          aria-label={label(mode, t('第二步前的处理', 'Between draws'))}
          value={replace ? 'replace' : 'keep'}
          onChange={(e) => {
            setReplace(e.target.value === 'replace');
            setShown(false);
          }}
        >
          <option value="keep">
            {label(mode, t('不放回', 'Without replacement'))}
          </option>
          <option value="replace">
            {label(mode, t('放回并混匀', 'Replace and remix'))}
          </option>
        </select>
      </label>
      <ProbabilityTree red={red} blue={blue} replace={replace} mode={mode} />
      <label>
        <Text mode={mode} text={t('目标事件', 'Target event')} />
        <select
          aria-label={label(mode, t('目标事件', 'Target event'))}
          value={event}
          onChange={(e) => setEvent(e.target.value as TreeEvent)}
        >
          <option value="two-red">{label(mode, t('两红', 'Two red'))}</option>
          <option value="different">
            {label(mode, t('不同色', 'Different colours'))}
          </option>
          <option value="at-least-blue">
            {label(mode, t('至少一蓝', 'At least one blue'))}
          </option>
        </select>
      </label>
      <Task
        key={key}
        mode={mode}
        name={t('由路径得到的事件概率', 'Event probability from paths')}
        answer={number(probabilityText(m.probability), true)}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('核对编号球基本结果', 'Inspect numbered-token outcomes')}
        />
      </button>
      {shown && (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                `等可能编号路径总数 ${tree.labelledTotal}，符合 ${m.labelledHits}；颜色路径本身未必等可能。`,
                `There are ${tree.labelledTotal} equally likely ID paths, with ${m.labelledHits} favourable. Colour paths themselves need not be equally likely.`,
              )}
            />
          </p>
          <div className="math-inference-outcomes">
            {tree.labelled.map((o) => (
              <span key={o.id} data-numbered-outcome={o.id}>
                {o.id}
              </span>
            ))}
          </div>
        </>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '沿一条路径乘条件概率，互斥路径再相加。树把可能性列完整，不会预测下一次一定抽到什么。',
            'Multiply conditional probabilities along a path, then add mutually exclusive paths. A complete tree lists possibilities; it does not predict the next realised result.',
          )}
        />
      </p>
    </>
  );
}
export function InferenceLab({
  kind,
  mode,
}: {
  kind: InferenceLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-inference-lab">
      {kind === 'infer-sample' ? (
        <Sampling mode={mode} />
      ) : kind === 'infer-distribution' ? (
        <Distributions mode={mode} />
      ) : kind === 'infer-outlier' ? (
        <Outliers mode={mode} />
      ) : kind === 'infer-space' ? (
        <Spaces mode={mode} />
      ) : (
        <Trees mode={mode} />
      )}
    </div>
  );
}
export function InferenceHookArt({
  kind,
  mode,
}: {
  kind: InferenceLabKind;
  mode: LanguageMode;
}) {
  const text = {
    'infer-sample': 'POPULATION → SAMPLE → ?',
    'infer-distribution': 'SAME MEAN ≠ SAME SHAPE ?',
    'infer-outlier': 'ONE RECORD → WHICH SUMMARY ?',
    'infer-space': 'HH · HT · TH · TT → ?',
    'infer-tree': 'FIRST × CONDITIONAL → ?',
  };
  return (
    <div className="math-inference-hook">
      <strong>{text[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '范围 → 记录 → 条件 → 有依据的结论',
            'Scope → records → conditions → supported conclusion',
          )}
        />
      </p>
    </div>
  );
}
