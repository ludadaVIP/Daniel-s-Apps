import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import {
  PartCounters,
  GroupCounters,
  SharedCounters,
} from './OperationVisuals';
import {
  partWhole,
  equalGroups,
  divideObjects,
  inverseFacts,
  operationScenarios,
} from './operationModels';
export type OperationLabKind =
  | 'operation-parts'
  | 'operation-array'
  | 'operation-division'
  | 'operation-inverse'
  | 'operation-choose';
export const isOperationLab = (kind: Lesson['lab']): kind is OperationLabKind =>
  [
    'operation-parts',
    'operation-array',
    'operation-division',
    'operation-inverse',
    'operation-choose',
  ].includes(kind);
function Count({
  label,
  mode,
  value,
  min = 0,
  max,
  onChange,
}: {
  label: LocalizedText;
  mode: LanguageMode;
  value: number;
  min?: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        aria-label={mode === 'en' ? label.en : label.zh}
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Parts({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(7),
    [b, setB] = useState(5),
    [total, setTotal] = useState(12),
    [removed, setRemoved] = useState(5),
    [kind, setKind] = useState<'join' | 'take' | 'compare'>('join'),
    m = partWhole(a, b);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            kind === 'take'
              ? t(
                  '先预测：原总量固定，只增加拿走量，剩下会怎样？每个记号代表一个单位，划线表示拿走。',
                  'Predict: with original total fixed, what happens if more is removed? Each mark is one unit; crossing marks identify removal.',
                )
              : kind === 'join'
                ? t(
                    '先预测第二部分加一个，总量怎样变？两部分合成整体，每个物体只数一次。',
                    'Predict what adding one to the second part does to the total. Both parts form the whole; count each object once.',
                  )
                : t(
                    '先预测两组差距，再一一配对。比较没有拿走任何物体。',
                    'Predict the difference, then pair the groups. Comparing removes no objects.',
                  )
          }
        />
      </p>
      <div className="math-lab-presets">
        {(['join', 'take', 'compare'] as const).map((k) => (
          <button
            key={k}
            className="math-button secondary"
            aria-pressed={k === kind}
            onClick={() => setKind(k)}
          >
            <Text
              mode={mode}
              text={
                k === 'join'
                  ? t('合并', 'Combine')
                  : k === 'take'
                    ? t('拿走', 'Take away')
                    : t('比较差距', 'Compare difference')
              }
            />
          </button>
        ))}
      </div>
      <div className="math-number-readout">
        {kind === 'join'
          ? `${a} + ${b} = ${m.total}`
          : kind === 'take'
            ? `${total} − ${removed} = ${total - removed}`
            : `${m.larger} − ${m.smaller} = ${m.difference}`}
      </div>
      {kind === 'take' ? (
        <>
          <Count
            label={t('原总量', 'Original total')}
            mode={mode}
            min={removed}
            max={20}
            value={total}
            onChange={setTotal}
          />
          <Count
            label={t('拿走量', 'Amount removed')}
            mode={mode}
            max={total}
            value={removed}
            onChange={setRemoved}
          />
        </>
      ) : (
        <>
          <Count
            label={t('数量 A', 'Count A')}
            mode={mode}
            max={20}
            value={a}
            onChange={setA}
          />
          <Count
            label={t('数量 B', 'Count B')}
            mode={mode}
            max={20}
            value={b}
            onChange={setB}
          />
        </>
      )}
      <PartCounters
        a={kind === 'take' ? total - removed : a}
        b={kind === 'take' ? removed : b}
        kind={kind}
        mode={mode}
      />
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            kind === 'join'
              ? t(
                  `整体为 ${m.total}；用 ${m.total}−${b}=${a} 可以找回第一部分。`,
                  `The whole is ${m.total}; ${m.total}−${b}=${a} recovers the first part.`,
                )
              : kind === 'take'
                ? t(
                    `留下 ${total - removed}，拿走 ${removed}，合起来 ${total - removed}+${removed}=${total}。`,
                    `Remaining ${total - removed} plus removed ${removed} gives ${total - removed}+${removed}=${total}.`,
                  )
                : t(
                    `较少量 ${m.smaller} 加差距 ${m.difference} 恢复较多量 ${m.larger}；差距不是总量。`,
                    `Smaller amount ${m.smaller} plus difference ${m.difference} recovers larger amount ${m.larger}; the difference is not their total.`,
                  )
          }
        />
      </p>
    </>
  );
}
function Groups({ mode }: { mode: LanguageMode }) {
  const [count, setCount] = useState(3),
    [size, setSize] = useState(4),
    [array, setArray] = useState(false),
    m = equalGroups(count, size);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先猜总量。切换等组与阵列时，物体总数不变；交换因数时，说明新的组数与每组量。',
            'Predict the total. Switching groups and arrays retains object count; swapping factors requires explaining the new group count and amount per group.',
          )}
        />
      </p>
      <Count
        label={t('组数', 'Group count')}
        mode={mode}
        max={8}
        value={count}
        onChange={setCount}
      />
      <Count
        label={t('每组量', 'Amount per group')}
        mode={mode}
        max={8}
        value={size}
        onChange={setSize}
      />
      <div className="math-number-readout">
        {count} × {size} = {m.total}
      </div>
      <div className="math-lab-presets">
        <button
          className="math-button secondary"
          aria-pressed={!array}
          onClick={() => setArray(false)}
        >
          <Text mode={mode} text={t('等组', 'Equal groups')} />
        </button>
        <button
          className="math-button secondary"
          aria-pressed={array}
          onClick={() => setArray(true)}
        >
          <Text mode={mode} text={t('阵列', 'Array')} />
        </button>
        <button
          className="math-button secondary"
          onClick={() => {
            setCount(size);
            setSize(count);
          }}
        >
          <Text mode={mode} text={t('交换因数', 'Swap factors')} />
        </button>
      </div>
      <GroupCounters groups={count} perGroup={size} mode={mode} array={array} />
      <p className="math-hint">
        <Text
          mode={mode}
          text={t(
            `${count} 个相同的 ${size} 合计 ${m.total}。${array ? `行数为 ${count}、每行 ${size} 个。` : '每框是一个组。'}零组或每组零个时，总量为零。`,
            `${count} equal amounts of ${size} total ${m.total}. ${array ? `There are ${count} rows with ${size} per row.` : 'Each box is a group.'} Zero groups or zero per group give zero total.`,
          )}
        />
      </p>
    </>
  );
}
function Division({ mode }: { mode: LanguageMode }) {
  const [total, setTotal] = useState(24),
    [divisor, setDivisor] = useState(6),
    [kind, setKind] = useState<'share' | 'group'>('share'),
    m = divideObjects(total, divisor, kind);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先说商在计什么。本模型不拆小球；不能分尽时，把余量单独保留，而不是假装总量少了。',
            'Identify what the quotient counts. Counters are indivisible here; retain leftovers separately rather than pretend the total shrank.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {(['share', 'group'] as const).map((k) => (
          <button
            key={k}
            className="math-button secondary"
            aria-pressed={k === kind}
            onClick={() => setKind(k)}
          >
            <Text
              mode={mode}
              text={
                k === 'share'
                  ? t('已知份数 · 平均分', 'Known share count · sharing')
                  : t('已知每组量 · 包含', 'Known group size · grouping')
              }
            />
          </button>
        ))}
      </div>
      <Count
        label={t('小球总量', 'Total counters')}
        mode={mode}
        max={30}
        value={total}
        onChange={setTotal}
      />
      <Count
        label={
          kind === 'share'
            ? t('接收者人数', 'Recipient count')
            : t('每组固定数量', 'Fixed amount per group')
        }
        mode={mode}
        min={1}
        max={6}
        value={divisor}
        onChange={setDivisor}
      />
      <div className="math-number-readout">
        {total} = {divisor} × {m.quotient} + {m.remainder}
      </div>
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            kind === 'share'
              ? t(
                  `每人先得 ${m.quotient} 个完整小球，${divisor} 人，余 ${m.remainder} 个另放。`,
                  `Each of ${divisor} people first receives ${m.quotient} whole counters; ${m.remainder} remain outside.`,
                )
              : t(
                  `每组 ${divisor} 个，可以装满 ${m.quotient} 组，余 ${m.remainder} 个另放。`,
                  `With ${divisor} per group, ${m.quotient} groups are full and ${m.remainder} remain outside.`,
                )
          }
        />
      </p>
      <SharedCounters total={total} divisor={divisor} kind={kind} mode={mode} />
      <div className="math-lab-presets">
        {[
          [24, 6],
          [23, 5],
          [0, 4],
        ].map(([n, d]) => (
          <button
            key={`${n}-${d}`}
            className="math-button secondary"
            onClick={() => {
              setTotal(n!);
              setDivisor(d!);
            }}
          >
            {n} ÷ {d}
          </button>
        ))}
      </div>
      <p className="math-muted">
        <Text
          mode={mode}
          text={
            m.remainder
              ? t(
                  '上面的等号恢复总量；不是把普通除法的精确商写成完整组数。若物体可分割，每份量还可包含分数。',
                  'The equality recovers the total; it does not claim the complete-group count is the exact numerical quotient. Divisible objects may allow fractional shares.',
                )
              : t(
                  '这里没有余量，整数商恰好能完整恢复总量。',
                  'There is no remainder here; the whole-number quotient recovers the total exactly.',
                )
          }
        />
      </p>
    </>
  );
}
function Inverse({ mode }: { mode: LanguageMode }) {
  const [count, setCount] = useState(3),
    [size, setSize] = useState(4),
    m = inverseFacts(count, size);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测另外的算式。总量、组数、每组量保持同一关系；反向除法必须使用非零除数。',
            'Predict the related expressions. Total, group count and amount per group retain one relationship; inverse division needs a non-zero divisor.',
          )}
        />
      </p>
      <Count
        label={t('组数', 'Group count')}
        mode={mode}
        max={8}
        value={count}
        onChange={setCount}
      />
      <Count
        label={t('每组量', 'Amount per group')}
        mode={mode}
        max={8}
        value={size}
        onChange={setSize}
      />
      <GroupCounters groups={count} perGroup={size} mode={mode} />
      <div className="math-op-facts">
        {[...new Set([...m.products, ...m.divisions])].map((fact) => (
          <strong key={fact}>{fact}</strong>
        ))}
      </div>
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            count === 0 || size === 0
              ? t(
                  '零总量仍可以除以非零数；除以零的式子不显示，因为不能唯一恢复因数。',
                  'A zero total can divide by a non-zero number; divisions by zero are omitted because they cannot uniquely recover a factor.',
                )
              : t(
                  `用 ${m.total} 除以组数 ${count} 得每组量 ${size}；除以每组量 ${size} 得组数 ${count}。`,
                  `Dividing ${m.total} by group count ${count} gives ${size} per group; dividing by group size ${size} gives ${count} groups.`,
                )
          }
        />
      </p>
    </>
  );
}
const scenarioText = [
  {
    stem: t(
      '14 个红球与 9 个蓝球一起装箱，总量是多少？',
      'Put fourteen red and nine blue balls in one box. What is the total?',
    ),
    roles: [
      t('红球部分：14 个', 'Red part: 14 balls'),
      t('蓝球部分：9 个', 'Blue part: 9 balls'),
      t('整体：? 个', 'Whole: ? balls'),
    ],
    reason: t(
      '两部分合成整体，加法求总量。',
      'Two parts combine into a whole; addition finds the total.',
    ),
    check: t('23−9=14，恢复第一部分。', '23−9=14 recovers the first part.'),
  },
  {
    stem: t(
      '30 米绳子用去 12 米，还剩多少米？',
      'Use twelve metres of a thirty-metre rope. How many metres remain?',
    ),
    roles: [
      t('原整体：30 米', 'Original whole: 30 m'),
      t('用去：12 米', 'Used: 12 m'),
      t('剩下：? 米', 'Remaining: ? m'),
    ],
    reason: t(
      '原整体减去已用部分，求另一部分。',
      'Subtract the used part from the whole to find the other part.',
    ),
    check: t(
      '18+12=30 米；每个记号代表一米。',
      '18+12=30 metres; each counter represents one metre.',
    ),
  },
  {
    stem: t(
      '5 袋，每袋 7 个橙子，总共有几个橙子？',
      'Five bags each hold seven oranges. How many oranges altogether?',
    ),
    roles: [
      t('组数：5 袋', 'Groups: 5 bags'),
      t('每组量：7 个', 'Per group: 7 oranges'),
      t('总量：? 个', 'Total: ? oranges'),
    ],
    reason: t(
      '组数乘相同每组量，求总量。',
      'Multiply group count by equal amount per group to find total.',
    ),
    check: t('35÷5=7，恢复每袋量。', '35÷5=7 recovers amount per bag.'),
  },
  {
    stem: t(
      '24 个球平均分给 6 人，每人几个？',
      'Share twenty-four balls equally among six people. How many per person?',
    ),
    roles: [
      t('总量：24 个', 'Total: 24 balls'),
      t('接收者：6 人', 'Recipients: 6 people'),
      t('每人：? 个', 'Each person: ? balls'),
    ],
    reason: t(
      '总量除以已知人数，求每人量。',
      'Divide total by known recipient count for amount per person.',
    ),
    check: t(
      '6×4=24；商 4 是每人球数。',
      '6×4=24; quotient four counts balls per person.',
    ),
  },
  {
    stem: t(
      '28 张纸卡，每袋 4 张，有几袋？',
      'Pack twenty-eight paper cards four per bag. How many bags?',
    ),
    roles: [
      t('总量：28 张', 'Total: 28 cards'),
      t('每袋：4 张', 'Per bag: 4 cards'),
      t('袋数：? 袋', 'Bag count: ? bags'),
    ],
    reason: t(
      '总量除以已知每袋量，求袋数。',
      'Divide total by known amount per bag for bag count.',
    ),
    check: t('7×4=28；商 7 是袋数。', '7×4=28; quotient seven counts bags.'),
  },
];
function Choose({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [selection, setSelection] = useState<string | undefined>(),
    scenario = operationScenarios[index]!,
    copy = scenarioText[index]!,
    correct = selection === scenario.operation;
  const expression =
    index === 0
      ? '14 + 9 = 23'
      : index === 1
        ? '30 − 12 = 18'
        : index === 2
          ? '5 × 7 = 35'
          : index === 3
            ? '24 ÷ 6 = 4'
            : '28 ÷ 4 = 7';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先读故事并辨认未知量，再选择运算。选对后看模型，选错时先重看关系；这里不计分。',
            'Read the story and identify the unknown before choosing an operation. A match reveals a model; a mismatch revisits the relationship. This workshop is unscored.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {scenarioText.map((_, i) => (
          <button
            key={i}
            className="math-button secondary"
            aria-pressed={index === i}
            onClick={() => {
              setIndex(i);
              setSelection(undefined);
            }}
          >
            <Text mode={mode} text={t(`情境 ${i + 1}`, `Case ${i + 1}`)} />
          </button>
        ))}
      </div>
      <h3>
        <Text mode={mode} text={copy.stem} />
      </h3>
      <div className="math-op-role-cards">
        {copy.roles.map((role, i) => (
          <div key={i}>
            <Text mode={mode} text={role} />
          </div>
        ))}
      </div>
      <div
        className="math-lab-presets"
        role="group"
        aria-label={mode === 'en' ? 'Choose an operation' : '选择运算'}
      >
        {(['add', 'subtract', 'multiply', 'divide'] as const).map((op) => (
          <button
            key={op}
            className="math-button secondary"
            aria-pressed={selection === op}
            onClick={() => setSelection(op)}
          >
            <Text
              mode={mode}
              text={
                op === 'add'
                  ? t('加法 +', 'Addition +')
                  : op === 'subtract'
                    ? t('减法 −', 'Subtraction −')
                    : op === 'multiply'
                      ? t('乘法 ×', 'Multiplication ×')
                      : t('除法 ÷', 'Division ÷')
              }
            />
          </button>
        ))}
      </div>
      {selection && (
        <p className="math-hint" role="status">
          <Text
            mode={mode}
            text={
              correct
                ? t(
                    '关系相符，看看模型并检查。',
                    'The relationship matches. Inspect the model and check.',
                  )
                : t(
                    `暂不显示得数。${copy.reason.zh}`,
                    `The result is not shown yet. ${copy.reason.en}`,
                  )
            }
          />
        </p>
      )}
      {correct && (
        <>
          <div className="math-number-readout">{expression}</div>
          {index === 0 ? (
            <PartCounters a={14} b={9} kind="join" mode={mode} />
          ) : index === 1 ? (
            <PartCounters a={18} b={12} kind="take" mode={mode} />
          ) : index === 2 ? (
            <GroupCounters groups={5} perGroup={7} mode={mode} />
          ) : (
            <SharedCounters
              total={index === 3 ? 24 : 28}
              divisor={index === 3 ? 6 : 4}
              kind={index === 3 ? 'share' : 'group'}
              mode={mode}
            />
          )}
          <p className="math-muted">
            <Text mode={mode} text={copy.check} />
          </p>
        </>
      )}
    </>
  );
}
export function OperationLab({
  kind,
  mode,
}: {
  kind: OperationLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-op-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '运算工作台 · 先说关系，再操作',
              'OPERATION WORKSHOP · RELATIONSHIP BEFORE SYMBOL',
            )}
          />
        </span>
        <span className="math-live">
          <Text mode={mode} text={t('实时数量', 'LIVE QUANTITIES')} />
        </span>
      </div>
      {kind === 'operation-parts' ? (
        <Parts mode={mode} />
      ) : kind === 'operation-array' ? (
        <Groups mode={mode} />
      ) : kind === 'operation-division' ? (
        <Division mode={mode} />
      ) : kind === 'operation-inverse' ? (
        <Inverse mode={mode} />
      ) : (
        <Choose mode={mode} />
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '解释：各数的单位与角色是什么？图、算式和反向检查能否说同一个关系？',
            'Explain each number’s unit and role. Do the diagram, expression and inverse check describe the same relationship?',
          )}
        />
      </div>
    </section>
  );
}
export function OperationHookArt({
  kind,
  mode,
}: {
  kind: OperationLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-number-hook">
      {kind === 'operation-parts' ? (
        <PartCounters a={12} b={7} kind="compare" mode={mode} explain={false} />
      ) : kind === 'operation-array' || kind === 'operation-inverse' ? (
        <GroupCounters groups={3} perGroup={4} mode={mode} array />
      ) : kind === 'operation-division' ? (
        <SharedCounters total={24} divisor={6} kind="share" mode={mode} />
      ) : (
        <div className="math-op-role-cards">
          {[
            t('总量', 'total'),
            t('份数', 'group count'),
            t('每份量', 'amount per group'),
          ].map((v, i) => (
            <div key={i}>
              <Text mode={mode} text={v} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
