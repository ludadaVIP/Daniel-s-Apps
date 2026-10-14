import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import { ProblemBars } from './ProblemVisuals';
import {
  barRelation,
  cardJourney,
  relevantFacts,
  exactSelection,
  type Relation,
  type Unknown,
} from './problemModels';
export type ProblemLabKind = Extract<Lesson['lab'], `problem-${string}`>;
export const isProblemLab = (kind: Lesson['lab']): kind is ProblemLabKind =>
  kind.startsWith('problem-');
const primary = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const optionText = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : primary(mode, text);
function Range({
  label,
  value,
  min = 0,
  max,
  set,
  mode,
}: {
  label: LocalizedText;
  value: number;
  min?: number;
  max: number;
  set: (v: number) => void;
  mode: LanguageMode;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={primary(mode, label)}
        onChange={(e) => set(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
const infoCards = [
  t('步道全长 18 m', 'The full track is 18 m'),
  t('已走 7 m', '7 m have been walked'),
  t('还剩多少 m？', 'How many m remain?'),
  t('草地上有 4 只鸟', 'There are 4 birds on the grass'),
];
const roles = [
  t('相关已知', 'Relevant known'),
  t('待求量', 'Unknown to find'),
  t('不用信息', 'Unused here'),
];
function Information({ mode }: { mode: LanguageMode }) {
  const [answers, setAnswers] = useState(['', '', '', '']),
    [checked, setChecked] = useState(false);
  const good = answers.every((a, i) => a === ['0', '0', '1', '2'][i]);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '目标：找步道剩余长度。为四张卡选角色，并说出每个数的单位；不是见到数字就相加。',
            'Goal: find remaining track length. Choose each card’s role and name its unit; do not add every number you see.',
          )}
        />
      </p>
      <div className="math-problem-facts">
        {infoCards.map((card, i) => (
          <label key={i}>
            <strong>
              <Text mode={mode} text={card} />
            </strong>
            <select
              aria-label={primary(
                mode,
                t(`信息卡 ${i + 1} 的角色`, `Role of card ${i + 1}`),
              )}
              value={answers[i]}
              onChange={(e) => {
                setAnswers(
                  answers.map((a, j) => (j === i ? e.target.value : a)),
                );
                setChecked(false);
              }}
            >
              <option value="">
                {optionText(mode, t('选择角色', 'Choose a role'))}
              </option>
              {roles.map((role, j) => (
                <option key={j} value={j}>
                  {optionText(mode, role)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <button
        className="math-button secondary"
        onClick={() => setChecked(true)}
      >
        <Text mode={mode} text={t('检查信息角色', 'Check information roles')} />
      </button>
      {checked && (
        <p role="status" className="math-hint">
          <Text
            mode={mode}
            text={
              good
                ? t(
                    '已知全长与已走，未知剩余，鸟数本题不用。7 m+剩余=18 m；先用同一长度单位建立关系。',
                    'Known full and walked lengths, unknown remaining length; bird count is unused here. 7 m + remaining = 18 m. Establish the relationship in matching units.',
                  )
                : t(
                    '还要核对角色：问题句提出未知；两段长度关系有用；鸟数虽是事实，却不能求剩余长度。',
                    'Recheck roles: the question identifies the unknown, the two lengths are relevant, and the bird count is a fact but cannot determine remaining length.',
                  )
            }
          />
        </p>
      )}
      <ProblemBars
        relation="parts"
        a={7}
        b={11}
        unknown="component"
        unit={t('米', 'metres')}
        mode={mode}
      />
    </>
  );
}
const relationNames = {
  parts: t('整体与部分', 'Whole and parts'),
  comparison: t('两量与差距', 'Two quantities and a difference'),
  groups: t('相等组', 'Equal groups'),
};
function Represent({ mode }: { mode: LanguageMode }) {
  const [relation, setRelation] = useState<Relation>('parts'),
    [a, setA] = useState(9),
    [b, setB] = useState(6),
    [unknown, setUnknown] = useState<Unknown>('result'),
    [reveal, setReveal] = useState(false);
  const m = barRelation(relation, a, b, unknown),
    unit = relation === 'groups' ? t('张卡', 'cards') : t('米', 'metres');
  const changeRelation = (r: Relation) => {
    setRelation(r);
    setA(r === 'parts' ? 9 : r === 'comparison' ? 17 : 3);
    setB(r === 'parts' ? 6 : r === 'comparison' ? 9 : 4);
    setUnknown('result');
    setReveal(false);
  };
  const equation =
    relation === 'parts'
      ? unknown === 'result'
        ? `${a}+${b}=${m.whole}`
        : `${m.whole}−${a}=${b}`
      : relation === 'comparison'
        ? unknown === 'result'
          ? `${a}−${b}=${a - b}`
          : `${b}+${a - b}=${a}`
        : `${a}×${b}=${m.whole}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先说明关系，再放问号。部分条首尾相接，比较条对齐起点，相等组中每段代表同样数量。改变要找的量，同一关系也会用不同运算。',
            'Describe the relationship before placing the question mark. Parts join end to end, comparison bars align their starts, and equal-group segments hold equal quantities. Changing the unknown can change the operation within the same relationship.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {(['parts', 'comparison', 'groups'] as const).map((r) => (
          <button
            key={r}
            className="math-button secondary"
            aria-pressed={r === relation}
            onClick={() => changeRelation(r)}
          >
            <Text mode={mode} text={relationNames[r]} />
          </button>
        ))}
      </div>
      <div className="math-measure-controls">
        <Range
          mode={mode}
          label={
            relation === 'groups'
              ? t('组数', 'Group count')
              : relation === 'comparison'
                ? unknown === 'component'
                  ? t('差距（m）', 'Difference (m)')
                  : t('较大量（m）', 'Larger quantity (m)')
                : t('第一部分（m）', 'First part (m)')
          }
          value={
            relation === 'comparison' && unknown === 'component' ? a - b : a
          }
          min={relation === 'groups' ? 1 : 0}
          max={
            relation === 'groups'
              ? 8
              : relation === 'parts'
                ? unknown === 'component'
                  ? m.whole
                  : 30 - b
                : unknown === 'component'
                  ? 30 - b
                  : 30
          }
          set={(n) => {
            if (relation === 'parts' && unknown === 'component') {
              setA(n);
              setB(m.whole - n);
            } else if (relation === 'comparison' && unknown === 'component')
              setA(b + n);
            else {
              setA(n);
              if (relation === 'comparison') setB(Math.min(b, n));
            }
            setReveal(false);
          }}
        />
        <Range
          mode={mode}
          label={
            relation === 'groups'
              ? t('每组张数', 'Cards per group')
              : relation === 'comparison'
                ? t('较小量（m）', 'Smaller quantity (m)')
                : unknown === 'component'
                  ? t('整体（m）', 'Whole (m)')
                  : t('第二部分（m）', 'Second part (m)')
          }
          value={relation === 'parts' && unknown === 'component' ? m.whole : b}
          min={
            relation === 'groups'
              ? 1
              : relation === 'parts' && unknown === 'component'
                ? a
                : 0
          }
          max={
            relation === 'groups'
              ? 20
              : relation === 'comparison'
                ? unknown === 'component'
                  ? 30 - (a - b)
                  : a
                : unknown === 'component'
                  ? 30
                  : 30 - a
          }
          set={(n) => {
            if (relation === 'parts' && unknown === 'component') setB(n - a);
            else if (relation === 'comparison' && unknown === 'component') {
              setA(n + (a - b));
              setB(n);
            } else setB(n);
            setReveal(false);
          }}
        />
      </div>
      {relation !== 'groups' && (
        <label className="math-problem-select">
          <Text
            mode={mode}
            text={t('问号放在哪个量？', 'Which quantity is unknown?')}
          />
          <select
            aria-label={primary(mode, t('要找的量', 'Quantity to find'))}
            value={unknown}
            onChange={(e) => {
              setUnknown(e.target.value as Unknown);
              setReveal(false);
            }}
          >
            <option value="result">
              {optionText(
                mode,
                relation === 'parts'
                  ? t('整体', 'Whole')
                  : t('差距', 'Difference'),
              )}
            </option>
            <option value="component">
              {optionText(
                mode,
                relation === 'parts'
                  ? t('第二部分', 'Second part')
                  : t('较大量', 'Larger quantity'),
              )}
            </option>
          </select>
        </label>
      )}
      <ProblemBars
        relation={relation}
        a={a}
        b={b}
        unknown={unknown}
        unit={unit}
        mode={mode}
        reveal={reveal}
      />
      <button
        className="math-button secondary"
        onClick={() => setReveal(!reveal)}
      >
        <Text
          mode={mode}
          text={
            reveal
              ? t('收起数值核对', 'Hide numerical check')
              : t(
                  '我已列式，核对关系',
                  'I made an expression; check the relationship',
                )
          }
        />
      </button>
      {reveal && (
        <p role="status" className="math-problem-result">
          {equation} <Text mode={mode} text={unit} />
        </p>
      )}
    </>
  );
}
function TwoStep({ mode }: { mode: LanguageMode }) {
  const [boxes, setBoxes] = useState(4),
    [each, setEach] = useState(6),
    [given, setGiven] = useState(5),
    [first, setFirst] = useState(''),
    [second, setSecond] = useState(''),
    [checked, setChecked] = useState(false),
    [stage, setStage] = useState(0);
  const m = cardJourney(boxes, each, given),
    good = first === '×' && second === '−';
  const reset = () => {
    setChecked(false);
    setStage(0);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            `${boxes} 盒，每盒 ${each} 张卡。送出 ${given} 张后还剩多少？先找原有张数，再扣掉送出的张数。`,
            `${boxes} boxes hold ${each} cards each. How many remain after giving away ${given}? First find the original card count, then subtract cards given away.`,
          )}
        />
      </p>
      <div className="math-measure-controls">
        <Range
          mode={mode}
          label={t('盒数', 'Box count')}
          value={boxes}
          min={1}
          max={6}
          set={(n) => {
            setBoxes(n);
            setGiven(Math.min(given, n * each));
            reset();
          }}
        />
        <Range
          mode={mode}
          label={t('每盒张数', 'Cards per box')}
          value={each}
          min={1}
          max={10}
          set={(n) => {
            setEach(n);
            setGiven(Math.min(given, boxes * n));
            reset();
          }}
        />
        <Range
          mode={mode}
          label={t('送出张数', 'Cards given away')}
          value={given}
          max={m.total}
          set={(n) => {
            setGiven(n);
            reset();
          }}
        />
      </div>
      <div className="math-problem-plans">
        {[0, 1].map((i) => (
          <label key={i}>
            <Text
              mode={mode}
              text={
                i === 0
                  ? t('第一步：原有张数', 'Step 1: original cards')
                  : t('第二步：剩余张数', 'Step 2: remaining cards')
              }
            />
            <select
              aria-label={primary(
                mode,
                i === 0
                  ? t('第一步运算', 'First operation')
                  : t('第二步运算', 'Second operation'),
              )}
              value={i === 0 ? first : second}
              onChange={(e) => {
                (i === 0 ? setFirst : setSecond)(e.target.value);
                reset();
              }}
            >
              <option value="">
                {optionText(mode, t('先选运算', 'Choose an operation'))}
              </option>
              {['+', '−', '×', '÷'].map((op) => (
                <option key={op}>{op}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <button
        className="math-button secondary"
        onClick={() => setChecked(true)}
      >
        <Text mode={mode} text={t('检查两步计划', 'Check the two-step plan')} />
      </button>
      {checked && (
        <p role="status" className="math-hint">
          <Text
            mode={mode}
            text={
              good
                ? t(
                    '计划关系成立：盒数×每盒张数得到张数，才能减去送出的张数。展开时给中间量命名。',
                    'The plan fits: boxes times cards per box gives cards, from which cards given away can be subtracted. Name the intermediate quantity as you expand.',
                  )
                : t(
                    '先求原有张数：盒数不能与每盒张数直接相加。送出使张数减少，第二步需减。',
                    'Find original cards first: box count and cards per box cannot be added directly. Giving cards away reduces the count, so the second step subtracts.',
                  )
            }
          />
        </p>
      )}
      <ProblemBars
        relation="groups"
        a={boxes}
        b={each}
        unknown="result"
        unit={t('张卡', 'cards')}
        mode={mode}
        reveal={stage >= 1}
      />
      {checked && good && stage < 2 && (
        <button className="math-button" onClick={() => setStage(stage + 1)}>
          <Text
            mode={mode}
            text={
              stage === 0
                ? t('展开第一步', 'Expand step one')
                : t('展开第二步', 'Expand step two')
            }
          />
        </button>
      )}
      {stage >= 1 && (
        <p className="math-problem-result">
          <Text
            mode={mode}
            text={t(
              `原有：${boxes}×${each}=${m.total} 张。`,
              `Original: ${boxes}×${each}=${m.total} cards.`,
            )}
          />
        </p>
      )}
      {stage === 2 && (
        <p className="math-problem-result">
          <Text
            mode={mode}
            text={t(
              `剩余：${m.total}−${given}=${m.remaining} 张。核查 ${m.remaining}+${given}=${m.total}。`,
              `Remaining: ${m.total}−${given}=${m.remaining} cards. Check ${m.remaining}+${given}=${m.total}.`,
            )}
          />
        </p>
      )}
    </>
  );
}
const budgetFacts = [
  t('预算 NZ$30', 'Budget NZ$30'),
  t('买 4 本笔记本', 'Buy 4 notebooks'),
  t('每本笔记本 NZ$5', 'NZ$5 per notebook'),
  t('铅笔每包 6 支', '6 pencils per pack'),
  t('每包铅笔 NZ$3', 'NZ$3 per pencil pack'),
];
const goals = {
  change: t('买后余钱', 'Money remaining'),
  cost: t('笔记本总价', 'Total notebook cost'),
  mass: t('笔记本总质量', 'Total notebook mass'),
};
function Relevance({ mode }: { mode: LanguageMode }) {
  const [goal, setGoal] = useState<'change' | 'cost' | 'mass'>('change'),
    [selected, setSelected] = useState<number[]>([]),
    [checked, setChecked] = useState(false);
  const required = relevantFacts(goal),
    good = required !== null && exactSelection(selected, required);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '只买笔记本，不买铅笔。先选要回答的问题，再选它需要的信息。相关性取决于目标；同样是钱数，也未必需要。',
            'Only notebooks are bought, not pencils. Choose the question, then the information it needs. Relevance depends on the goal; even another money amount may be unnecessary.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {(['change', 'cost', 'mass'] as const).map((g) => (
          <button
            key={g}
            className="math-button secondary"
            aria-pressed={goal === g}
            onClick={() => {
              setGoal(g);
              setSelected([]);
              setChecked(false);
            }}
          >
            <Text mode={mode} text={goals[g]} />
          </button>
        ))}
      </div>
      <div className="math-problem-facts">
        {budgetFacts.map((fact, i) => (
          <button
            className="math-problem-fact"
            key={i}
            aria-pressed={selected.includes(i)}
            onClick={() => {
              setSelected(
                selected.includes(i)
                  ? selected.filter((j) => j !== i)
                  : [...selected, i],
              );
              setChecked(false);
            }}
          >
            <Text mode={mode} text={fact} />
            <span aria-hidden="true">{selected.includes(i) ? '✓' : '○'}</span>
          </button>
        ))}
      </div>
      <button
        className="math-button secondary"
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t(
            '核对信息是否足够',
            'Check whether the information is sufficient',
          )}
        />
      </button>
      {checked && (
        <p role="status" className="math-hint">
          <Text
            mode={mode}
            text={
              required === null
                ? t(
                    '信息不足：缺每本质量或四本合计质量。价格和数量不能推出质量，不能猜一个答案。',
                    'Insufficient information: mass per notebook or total mass is missing. Price and count cannot determine mass; do not invent an answer.',
                  )
                : good
                  ? goal === 'cost'
                    ? t(
                        '本数×单价：4×5=NZ$20。预算不影响这次总价，铅笔信息不用。',
                        'Count × unit price: 4×5=NZ$20. Budget does not affect this total cost; pencil facts are unused.',
                      )
                    : t(
                        '先算笔记本总价 NZ$20，再用 30−20=NZ$10。铅笔数量和价格本题不用。',
                        'First find notebook cost NZ$20, then 30−20=NZ$10. Pencil count and price are unused here.',
                      )
                  : t(
                      '重选：总价需要本数与单价；余钱还需要预算。没有买铅笔，不把铅笔价格加进来。',
                      'Reselect: cost needs notebook count and unit price; remaining money also needs budget. No pencils are bought, so do not add their price.',
                    )
            }
          />
        </p>
      )}
    </>
  );
}
const explanations = [
  t('还剩 17 张。', '17 cards remain.'),
  t('5+4−3=17，所以还剩 17 张。', '5+4−3=17, so 17 cards remain.'),
  t(
    '5 袋每袋 4 张，原有 5×4=20 张；送出 3 张，剩 20−3=17 张。核查 17+3=20，与原有张数一致。',
    '5 bags of 4 cards hold 5×4=20 cards. Giving away 3 leaves 20−3=17 cards. Checking 17+3=20 recovers the original count.',
  ),
];
const explanationCategories = [
  t('缺少理由', 'Missing steps'),
  t('关系/算错', 'Invalid steps'),
  t('完整说明', 'Sound reason'),
];
function Explain({ mode }: { mode: LanguageMode }) {
  const [example, setExample] = useState(0),
    [judgement, setJudgement] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '情境：5 袋卡片，每袋 4 张，送出 3 张。比较三种说明；最终数字一样，不代表理由一样可靠。练习中的自己的解释需家长核对。',
            'Story: 5 bags of 4 cards, with 3 given away. Compare three explanations; the same final number does not ensure equally sound reasoning. Your own written explanation in practice needs parent review.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {explanations.map((_, i) => (
          <button
            key={i}
            className="math-button secondary"
            aria-pressed={i === example}
            onClick={() => {
              setExample(i);
              setJudgement('');
              setChecked(false);
            }}
          >
            <Text
              mode={mode}
              text={t(`说明 ${i + 1}`, `Explanation ${i + 1}`)}
            />
          </button>
        ))}
      </div>
      <blockquote className="math-problem-quote">
        <Text mode={mode} text={explanations[example]!} />
      </blockquote>
      <label className="math-problem-select">
        <Text mode={mode} text={t('你发现了什么？', 'What did you notice?')} />
        <select
          aria-label={primary(mode, t('说明检查', 'Explanation check'))}
          value={judgement}
          onChange={(e) => {
            setJudgement(e.target.value);
            setChecked(false);
          }}
        >
          <option value="">
            {optionText(mode, t('选择观察', 'Choose an observation'))}
          </option>
          {explanationCategories.map((c, i) => (
            <option value={i} key={i}>
              {optionText(mode, c)}
            </option>
          ))}
        </select>
      </label>
      <button
        className="math-button secondary"
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t('对照理由卡', 'Compare with the reasoning guide')}
        />
      </button>
      {checked && (
        <p role="status" className="math-hint">
          <Text
            mode={mode}
            text={
              judgement === String(example)
                ? example === 0
                  ? t(
                      '数字、单位与剩余情境已有，但缺少如何得到 17 以及怎样核查。补上组数×每组，再扣送出。',
                      'Number, unit and remaining-card context are present, but the route to 17 and verification are missing. Add groups × cards per group, then subtract cards given away.',
                    )
                  : example === 1
                    ? t(
                        '5 是袋数，4 是每袋张数，应相乘；5+4−3 实际为 6，并不等于 17。答案碰巧写 17 不能修好理由。',
                        '5 counts bags and 4 counts cards per bag, so multiply. 5+4−3 actually equals 6, not 17. Writing 17 at the end does not repair the reasoning.',
                      )
                    : t(
                        '这份说明把每步数量、单位、剩余含义与加回核查连起来。请在练习里换一个情境，用自己的话写。',
                        'This explanation connects quantities at each step, units, the meaning of remaining and an add-back check. Use your own words for a new story in practice.',
                      )
                : t(
                    '再看一次：有答案不一定有推理；算式应匹配组与每组关系，核查应回到原有量。',
                    'Look again: an answer may lack reasoning. Expressions must match groups and quantity per group; verification should recover the original quantity.',
                  )
            }
          />
        </p>
      )}
    </>
  );
}
export function ProblemLab({
  kind,
  mode,
}: {
  kind: ProblemLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-problem-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '解题工作台 · 先整理关系',
              'PROBLEM WORKSHOP · ORGANISE THE RELATIONSHIP',
            )}
          />
        </span>
        <span className="math-live">
          <Text
            mode={mode}
            text={t(
              '读题 → 画图 → 列式 → 核查',
              'READ → REPRESENT → CALCULATE → CHECK',
            )}
          />
        </span>
      </div>
      {kind === 'problem-information' ? (
        <Information mode={mode} />
      ) : kind === 'problem-represent' ? (
        <Represent mode={mode} />
      ) : kind === 'problem-two-step' ? (
        <TwoStep mode={mode} />
      ) : kind === 'problem-relevance' ? (
        <Relevance mode={mode} />
      ) : (
        <Explain mode={mode} />
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '说出每个数在计什么，问号在哪里，结果怎样回答原问题。信息不足时，也可以说明缺了什么。',
            'Name what each number counts, where the unknown is, and how the result answers the question. If information is insufficient, explain what is missing.',
          )}
        />
      </div>
    </section>
  );
}
export function ProblemHookArt({
  kind,
  mode,
}: {
  kind: ProblemLabKind;
  mode: LanguageMode;
}) {
  const groups =
    kind === 'problem-two-step' ||
    kind === 'problem-explain' ||
    kind === 'problem-relevance';
  return (
    <div className="math-number-hook">
      <ProblemBars
        relation={groups ? 'groups' : 'parts'}
        a={
          kind === 'problem-two-step' || kind === 'problem-relevance'
            ? 4
            : kind === 'problem-explain'
              ? 5
              : kind === 'problem-represent'
                ? 4
                : 7
        }
        b={
          kind === 'problem-two-step'
            ? 6
            : kind === 'problem-explain'
              ? 4
              : kind === 'problem-relevance' || kind === 'problem-represent'
                ? 5
                : 11
        }
        unknown={groups ? 'result' : 'component'}
        unit={
          kind === 'problem-relevance'
            ? t('新西兰元', 'NZD')
            : groups || kind === 'problem-represent'
              ? t('张卡', 'cards')
              : t('米', 'metres')
        }
        mode={mode}
      />
    </div>
  );
}
