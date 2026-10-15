import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import {
  journey,
  workModel,
  budgetModel,
  chartRows,
  chartCost,
  routes,
  activities,
  tripModel,
  money,
  clock,
} from './appliedModels';
export type AppliedLabKind = Extract<Lesson['lab'], `applied-${string}`>;
export const isAppliedLab = (kind: Lesson['lab']): kind is AppliedLabKind =>
  kind.startsWith('applied-');
const label = (m: LanguageMode, text: LocalizedText) =>
  m === 'en' ? text.en : text.zh;
function Range({
  mode,
  name,
  value,
  min = 0,
  max,
  step = 1,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min?: number;
  max: number;
  step?: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={label(mode, name)}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Frame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-applied-figure">
      <div
        role="region"
        tabIndex={0}
        aria-label={label(
          mode,
          t('应用模型，可局部滚动', 'Applied model; scroll locally'),
        )}
      >
        {children}
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
function Prediction({
  mode,
  answer,
  unit,
  prompt,
  onResetKey,
}: {
  mode: LanguageMode;
  answer: string;
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'];
  prompt: LocalizedText;
  onResetKey: string;
}) {
  // Remounting on a changed model prevents carrying a correct prediction into new data.
  return (
    <Answer
      key={onResetKey}
      mode={mode}
      answer={answer}
      unit={unit}
      prompt={prompt}
    />
  );
}
function Answer({
  mode,
  answer,
  unit,
  prompt,
}: {
  mode: LanguageMode;
  answer: string;
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'];
  prompt: LocalizedText;
}) {
  const [input, setInput] = useState(''),
    [status, setStatus] = useState<boolean | null>(null);
  return (
    <div className="math-applied-predict">
      <label>
        <Text mode={mode} text={prompt} />
        <input
          type="text"
          aria-label={label(mode, prompt)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setStatus(null);
          }}
        />
      </label>
      <button
        className="math-button"
        onClick={() =>
          setStatus(
            checkAnswer(input, {
              kind: 'number',
              value: answer,
              unit,
              formats: ['decimal', 'fraction'],
            }) === true,
          )
        }
      >
        <Text mode={mode} text={t('核对数量关系', 'Check the relationship')} />
      </button>
      {status !== null && (
        <p
          role="status"
          aria-label={label(mode, t('探索反馈', 'Workshop feedback'))}
        >
          <Text
            mode={mode}
            text={
              status
                ? t(
                    `正确：${answer}${unit ? ` ${unit}` : ''}。请说明分母、单位与条件。`,
                    `Correct: ${answer}${unit ? ` ${unit}` : ''}. Explain the denominator, unit and assumptions.`,
                  )
                : t(
                    '再检查整体、单位和各步关系；不是只找题目里的数字。',
                    'Recheck the whole, units and each step, rather than combining numbers without a relationship.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Travel({ mode }: { mode: LanguageMode }) {
  const [d, setD] = useState(6),
    [moving, setMoving] = useState(60),
    [stop, setStop] = useState(30),
    m = journey(d, moving, stop);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '假想匀速行进后停留一次。行进速度用移动时间；全程平均速度要含停留。图中横轴每格都是十五分钟。',
            'Fictional constant-speed travel with one stop. Moving speed uses moving time; whole-trip average includes the stop. Each horizontal grid interval is fifteen minutes.',
          )}
        />
      </p>
      <div className="math-applied-controls">
        <Range
          mode={mode}
          name={t('路程（km）', 'Distance (km)')}
          value={d}
          min={1}
          max={12}
          change={setD}
        />
        <Range
          mode={mode}
          name={t('移动时间（min）', 'Moving time (min)')}
          value={moving}
          min={15}
          max={120}
          step={15}
          change={setMoving}
        />
        <Range
          mode={mode}
          name={t('停留时间（min）', 'Stop time (min)')}
          value={stop}
          max={60}
          step={15}
          change={setStop}
        />
      </div>
      <Frame
        mode={mode}
        caption={t(
          `路程 ${d} km，移动 ${moving} min，停留 ${stop} min；斜率区分移动与全程。`,
          `Distance ${d} km, moving ${moving} min, stop ${stop} min; slopes distinguish moving and whole-trip averages.`,
        )}
      >
        <svg
          viewBox="0 0 650 220"
          width="650"
          height="220"
          role="img"
          aria-label={label(mode, t('路程时间图', 'Distance–time graph'))}
        >
          <path d="M45 20V175H615" fill="none" stroke="currentColor" />
          {Array.from({ length: 13 }, (_, i) => (
            <g key={i}>
              <path d={`M${45 + i * 45} 175v5`} stroke="currentColor" />
              <text x={45 + i * 45} y={196} textAnchor="middle">
                {i * 15}
              </text>
            </g>
          ))}
          <polyline
            data-moving-path
            points={`45,175 ${45 + moving * 3},35 ${45 + m.elapsed * 3},35`}
            fill="none"
            stroke="#156a66"
            strokeWidth="4"
          />
          <path
            d={`M45 175L${45 + m.elapsed * 3} 35`}
            stroke="#b45226"
            strokeDasharray="7 4"
            fill="none"
          />
          <text x="6" y="38">
            {d} km
          </text>
          <text x="575" y="217">
            min
          </text>
        </svg>
      </Frame>
      <p>
        <Text
          mode={mode}
          text={t(
            `移动速度 ${m.movingSpeed} km/h；总时间 ${m.elapsed} min。虚线从全程起点连到终点，不代表实际每刻速度。`,
            `Moving speed ${m.movingSpeed} km/h; elapsed time ${m.elapsed} min. The dashed start-to-finish line does not describe the actual speed at each instant.`,
          )}
        />
      </p>
      <Prediction
        mode={mode}
        answer={m.averageSpeed}
        unit="km/h"
        prompt={t('我的全程平均速度（km/h）', 'My whole-trip average (km/h)')}
        onResetKey={`${d}-${moving}-${stop}`}
      />
    </>
  );
}
function Work({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(3),
    [b, setB] = useState(2),
    [time, setTime] = useState(4),
    m = workModel(60, [a, b], time);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '理想水泵向同一空容器注水，速率恒定、互不干扰、无漏水；满六十升自动停泵。只有这些条件下可把每分钟工作量相加。',
            'Ideal pumps fill one empty container at constant rates without interference or leaks. Both stop automatically at sixty litres. Rates add only under these stated assumptions.',
          )}
        />
      </p>
      <div className="math-applied-controls">
        <Range
          mode={mode}
          name={t('泵 A（L/min）', 'Pump A (L/min)')}
          value={a}
          max={6}
          change={setA}
        />
        <Range
          mode={mode}
          name={t('泵 B（L/min）', 'Pump B (L/min)')}
          value={b}
          max={6}
          change={setB}
        />
        <Range
          mode={mode}
          name={t('运行时间（min）', 'Elapsed time (min)')}
          value={time}
          max={30}
          change={setTime}
        />
      </div>
      <Frame
        mode={mode}
        caption={t(
          `共同速率 ${m.rate} L/min；已注 ${m.done} L，剩余 ${m.remaining} L。`,
          `Combined rate ${m.rate} L/min; filled ${m.done} L, remaining ${m.remaining} L.`,
        )}
      >
        <svg
          width="480"
          height="160"
          viewBox="0 0 480 160"
          role="img"
          aria-label={label(mode, t('六十升工作量条', 'Sixty-litre work bar'))}
        >
          <rect
            x="20"
            y="50"
            width="420"
            height="44"
            fill="#eee7da"
            stroke="currentColor"
          />
          <rect
            data-work-done
            x="20"
            y="50"
            width={m.done * 7}
            height="44"
            fill="#156a66"
          />
          <text x="20" y="34">
            0 L
          </text>
          <text x="400" y="34">
            60 L
          </text>
          <text x="20" y="125">
            {a} + {b} = {m.rate} L/min · {time} min
          </text>
        </svg>
      </Frame>
      <p>
        <Text
          mode={mode}
          text={
            m.finish === null
              ? t(
                  '两个速率都为零：任务无法完成，不能计算 60÷0。',
                  'Both rates are zero: the task cannot finish. Do not calculate 60÷0.',
                )
              : t(
                  `理论完成时间 ${m.finish} min；满后不继续增加，不能把两台各自用时相加。`,
                  `Ideal completion time ${m.finish} min. Water stops increasing at capacity; do not add the individual completion times.`,
                )
          }
        />
      </p>
      <Prediction
        mode={mode}
        answer={String(m.remaining)}
        unit="L"
        prompt={t('我算的剩余工作量（L）', 'My remaining work (L)')}
        onResetKey={`${a}-${b}-${time}`}
      />
    </>
  );
}
function Budget({ mode }: { mode: LanguageMode }) {
  const [discount, setDiscount] = useState(25),
    [reserve, setReserve] = useState(10),
    [budget, setBudget] = useState(100),
    m = budgetModel(budget * 100, 8000, discount, 2000, reserve);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构票价合计 NZ$80，仅门票可折扣，另有不可折扣交通 NZ$20。预留金按完整预算计算，并非已花的钱。本模型金额精确到分，不需舍入。',
            'Fictional tickets total NZ$80; only tickets receive a discount. Transport is NZ$20 without a discount. Reserve is based on the full budget and is not spent money. These model amounts are exact cents without rounding.',
          )}
        />
      </p>
      <div className="math-applied-controls">
        <Range
          mode={mode}
          name={t('预算（NZD）', 'Budget (NZD)')}
          value={budget}
          min={60}
          max={160}
          step={10}
          change={setBudget}
        />
        <Range
          mode={mode}
          name={t('票价折扣（%）', 'Ticket discount (%)')}
          value={discount}
          max={100}
          step={5}
          change={setDiscount}
        />
        <Range
          mode={mode}
          name={t('预留预算（%）', 'Reserve of budget (%)')}
          value={reserve}
          max={50}
          step={5}
          change={setReserve}
        />
      </div>
      <div className="math-applied-ledger">
        <p>
          <Text
            mode={mode}
            text={t('折扣基数：门票', 'Discount base: tickets')}
          />{' '}
          {money(8000)} × {100 - discount}% = {money(m.tickets)}
        </p>
        <p>
          <Text mode={mode} text={t('全部支出', 'Total spending')} />{' '}
          {money(m.tickets)} + {money(2000)} = {money(m.spend)}
        </p>
        <p>
          <Text
            mode={mode}
            text={t('预留金 / 可用金额', 'Reserve / available to spend')}
          />{' '}
          {money(m.reserve)} / {money(m.usable)}
        </p>
        <p role="status">
          <Text
            mode={mode}
            text={
              m.feasible
                ? t(
                    `预算可行；扣除预留金后还可用 ${money(m.headroom)}。`,
                    `Budget feasible; ${money(m.headroom)} remains after protecting the reserve.`,
                  )
                : t(
                    `预算不足；保护预留金还缺 ${money(-m.headroom)}。`,
                    `Budget insufficient; protecting the reserve leaves a shortfall of ${money(-m.headroom)}.`,
                  )
            }
          />
        </p>
      </div>
      <Prediction
        mode={mode}
        answer={String(m.spend / 100)}
        unit="NZD"
        prompt={t('我的全部支出（NZD）', 'My total spending (NZD)')}
        onResetKey={`${budget}-${discount}-${reserve}`}
      />
    </>
  );
}
function Charts({ mode }: { mode: LanguageMode }) {
  const [row, setRow] = useState(1),
    [max, setMax] = useState(30),
    m = chartCost(chartRows[row]!.count);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '给定虚构到访人数。每人票价 NZ$4，每组一次固定费 NZ$10。先读人数，再乘票价，最后加一次固定费；不能把缺测当零。改变纵轴上限不改变记录。',
            'Supplied fictional visitor counts. Tickets cost NZ$4 each, plus one NZ$10 fee per group. Read people, multiply by the fare, then add the fee once. Missing is not zero. Changing the axis maximum does not change records.',
          )}
        />
      </p>
      <div className="math-applied-controls">
        <label>
          <Text mode={mode} text={t('选择日期', 'Select day')} />
          <select
            aria-label={label(mode, t('选择日期', 'Select day'))}
            value={row}
            onChange={(e) => setRow(Number(e.target.value))}
          >
            {chartRows.map((r, i) => (
              <option key={r.en} value={i}>
                {label(mode, t(r.zh, r.en))}
              </option>
            ))}
          </select>
        </label>
        <label>
          <Text
            mode={mode}
            text={t('纵轴上限（人）', 'Axis maximum (people)')}
          />
          <select
            aria-label={label(
              mode,
              t('纵轴上限（人）', 'Axis maximum (people)'),
            )}
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          >
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
        </label>
      </div>
      <Frame
        mode={mode}
        caption={t(
          '原始记录：周一 12 人次、周二 18 人次、周三缺测、周四 24 人次。人数轴从零开始，周三不画零柱、不用邻日补值；图不能单独证明来访原因。',
          'Original records: Monday 12 visits, Tuesday 18, Wednesday missing, Thursday 24. The people axis starts at zero: no zero bar or imputed value for Wednesday. The chart alone does not establish a cause of attendance.',
        )}
      >
        <svg
          width="520"
          height="260"
          viewBox="0 0 520 260"
          role="img"
          aria-label={label(
            mode,
            t('到访人数条形图', 'Visitor count bar chart'),
          )}
        >
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M45 ${205 - i * 60}H505`} stroke="#d2c9b8" />
              <text x="38" y={210 - i * 60} textAnchor="end">
                {(max * i) / 3}
              </text>
            </g>
          ))}
          {chartRows.map((r, i) => (
            <g key={r.en}>
              {r.count === null ? (
                <text x={100 + i * 120} y="190" textAnchor="middle">
                  ?
                </text>
              ) : (
                <>
                  <rect
                    data-count={r.count}
                    x={70 + i * 120}
                    y={205 - (r.count / max) * 180}
                    width="60"
                    height={(r.count / max) * 180}
                    fill={i === row ? '#b45226' : '#156a66'}
                  />
                  <text
                    x={100 + i * 120}
                    y={195 - (r.count / max) * 180}
                    textAnchor="middle"
                  >
                    {r.count}
                  </text>
                </>
              )}
              <text x={100 + i * 120} y="235" textAnchor="middle">
                {label(mode, t(r.zh, r.en))}
              </text>
            </g>
          ))}
        </svg>
      </Frame>
      {m === null ? (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '缺少人数，无法确定当日总费用；需要补充原始记录。',
              'The count is missing, so total cost cannot be determined. Obtain the original record.',
            )}
          />
        </p>
      ) : (
        <Prediction
          mode={mode}
          answer={String(m / 100)}
          unit="NZD"
          prompt={t('我的该组总费用（NZD）', 'My group total cost (NZD)')}
          onResetKey={String(row)}
        />
      )}
    </>
  );
}
const segmentNames: Record<string, LocalizedText> = {
  out: t('去程', 'Outbound'),
  visit: t('活动', 'Visit'),
  lunch: t('午餐', 'Lunch'),
  back: t('返程', 'Return'),
  buffer: t('机动', 'Buffer'),
};
function Trip({ mode }: { mode: LanguageMode }) {
  const [people, setPeople] = useState(4),
    [budget, setBudget] = useState(160),
    [route, setRoute] = useState('direct'),
    [activity, setActivity] = useState('museum'),
    [deadline, setDeadline] = useState(360),
    [note, setNote] = useState('');
  const m = tripModel(people, budget * 100, 10, 25, route, activity, deadline);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '纸上虚构计划，09:00 出发。交通按整组往返收费；门票每人，门票总额减 25%；午餐每人 NZ$6 且用时三十分钟。另留三十分钟机动和预算的 10%，预留金不算支出。所有数据仅用于课堂。',
            'A fictional paper plan leaves at 09:00. Transport is one return fare for the group; tickets are per person with 25% off their total. Lunch is NZ$6 per person and takes thirty minutes. Protect thirty minutes of buffer and 10% of the budget; reserve is not spending. All supplied data are for this classroom task.',
          )}
        />
      </p>
      <Frame
        mode={mode}
        caption={t(
          '比较所有给定选项，先读每组与每人的单位。',
          'Compare all supplied options; distinguish group and per-person prices.',
        )}
      >
        <table>
          <thead>
            <tr>
              <th>
                <Text mode={mode} text={t('选项', 'Option')} />
              </th>
              <th>min</th>
              <th>NZD</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id}>
                <th>{label(mode, t(r.zh, r.en))}</th>
                <td>{r.oneWay} × 2</td>
                <td>
                  {money(r.groupFare)} /{' '}
                  <Text mode={mode} text={t('组（往返）', 'group (return)')} />
                </td>
              </tr>
            ))}
            {activities.map((a) => (
              <tr key={a.id}>
                <th>{label(mode, t(a.zh, a.en))}</th>
                <td>{a.minutes}</td>
                <td>
                  {money(a.ticket)} /{' '}
                  <Text
                    mode={mode}
                    text={t('人（折前）', 'person (before discount)')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Frame>
      <div className="math-applied-controls">
        <Range
          mode={mode}
          name={t('人数', 'People')}
          value={people}
          min={1}
          max={8}
          change={setPeople}
        />
        <Range
          mode={mode}
          name={t('预算（NZD）', 'Budget (NZD)')}
          value={budget}
          min={60}
          max={240}
          step={10}
          change={setBudget}
        />
        <Range
          mode={mode}
          name={t('允许时长（min）', 'Allowed duration (min)')}
          value={deadline}
          min={180}
          max={360}
          step={30}
          change={setDeadline}
        />
        <label>
          <Text mode={mode} text={t('路线', 'Route')} />
          <select
            aria-label={label(mode, t('路线', 'Route'))}
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          >
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {label(mode, t(r.zh, r.en))}
              </option>
            ))}
          </select>
        </label>
        <label>
          <Text mode={mode} text={t('活动', 'Activity')} />
          <select
            aria-label={label(mode, t('活动', 'Activity'))}
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {label(mode, t(a.zh, a.en))}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Frame
        mode={mode}
        caption={t(
          `时间按分钟累计，含午餐与机动。截止 ${clock(deadline)}。`,
          `Minutes accumulate, including lunch and buffer. Deadline ${clock(deadline)}.`,
        )}
      >
        <ol className="math-applied-timeline">
          {m.timeline.map((s) => (
            <li key={s.id} data-segment={s.id}>
              <strong>
                {clock(s.from)}–{clock(s.to)}
              </strong>
              <Text mode={mode} text={segmentNames[s.id]!} />
              <span>{s.minutes} min</span>
            </li>
          ))}
        </ol>
      </Frame>
      <div className="math-applied-ledger">
        <p>
          <Text
            mode={mode}
            text={t('整组往返交通', 'Group return transport')}
          />{' '}
          {money(m.transport)}
        </p>
        <p>
          <Text
            mode={mode}
            text={t('门票折前 × 付款率', 'Original tickets × payment rate')}
          />{' '}
          {money(m.originalTickets)} × 75% = {money(m.tickets)}
        </p>
        <p>
          <Text mode={mode} text={t('午餐按人', 'Lunch per person')} /> {people}{' '}
          × NZ$6 = {money(m.lunch)}
        </p>
        <p>
          <Text
            mode={mode}
            text={t('支出 / 预留 / 可用', 'Spending / reserve / available')}
          />{' '}
          {money(m.spend)} / {money(m.reserve)} / {money(m.usable)}
        </p>
        <p>
          <Text
            mode={mode}
            text={
              m.headroom >= 0
                ? t(
                    `钱还余 ${money(m.headroom)}（已保护预留）。`,
                    `Money headroom ${money(m.headroom)} after protecting reserve.`,
                  )
                : t(
                    `钱还缺 ${money(-m.headroom)}（需保护预留）。`,
                    `Money shortfall ${money(-m.headroom)} while protecting reserve.`,
                  )
            }
          />
        </p>
        <p>
          <Text
            mode={mode}
            text={t(
              `含机动结束 ${clock(m.elapsed)}，共 ${m.elapsed} min；时间${m.timeHeadroom >= 0 ? '还余' : '还缺'} ${Math.abs(m.timeHeadroom)} min。`,
              `Finish including buffer ${clock(m.elapsed)}, total ${m.elapsed} min; time ${m.timeHeadroom >= 0 ? 'headroom' : 'shortfall'} ${Math.abs(m.timeHeadroom)} min.`,
            )}
          />
        </p>
        <p role="status">
          <Text
            mode={mode}
            text={
              m.feasible
                ? t(
                    '两项约束均满足：此给定模型下可行。便宜或快并不自动等于唯一最优。',
                    'Both constraints met: feasible in this supplied model. Cheapest or fastest is not automatically the unique best choice.',
                  )
                : t(
                    '当前方案不可行：分别检查钱与时间，修改方案后重新核验。',
                    'This itinerary is infeasible: check money and time separately, then revise and recheck.',
                  )
            }
          />
        </p>
      </div>
      <label>
        <Text
          mode={mode}
          text={t(
            '我的方案理由（工作台临时草稿）',
            'My plan justification (temporary workshop draft)',
          )}
        />
        <textarea
          aria-label={label(
            mode,
            t(
              '我的方案理由（工作台临时草稿）',
              'My plan justification (temporary workshop draft)',
            ),
          )}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            '解释你取舍了什么，并举出一个改动会让方案失效的条件。正式练习和家长核验会保存；此临时草稿刷新后清空。',
            'Explain your trade-off and one changed condition that would break feasibility. Formal practice and parent checks are saved; this temporary draft clears on reload.',
          )}
        />
      </p>
    </>
  );
}
export function AppliedLab({
  kind,
  mode,
}: {
  kind: AppliedLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-applied-lab">
      {kind === 'applied-travel' ? (
        <Travel mode={mode} />
      ) : kind === 'applied-work' ? (
        <Work mode={mode} />
      ) : kind === 'applied-budget' ? (
        <Budget mode={mode} />
      ) : kind === 'applied-chart' ? (
        <Charts mode={mode} />
      ) : (
        <Trip mode={mode} />
      )}
    </div>
  );
}
export function AppliedHookArt({
  kind,
  mode,
}: {
  kind: AppliedLabKind;
  mode: LanguageMode;
}) {
  const symbols = {
    'applied-travel': '6 km ÷ (60 + 30) min = ?',
    'applied-work': '3 L/min + 2 L/min → ?',
    'applied-budget': '80 × 75% + 20 = ?',
    'applied-chart': '18 × 4 + 10 = ?',
    'applied-trip': '09:00 → ? · NZ$160 → ?',
  };
  return (
    <div className="math-applied-hook">
      <strong>{symbols[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '量名 → 单位 → 关系 → 约束',
            'Quantity → unit → relationship → constraints',
          )}
        />
      </p>
    </div>
  );
}
