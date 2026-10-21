import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { DataFigure, DataTable } from './DataModellingVisuals';
import { valueR } from './rationalModels';
import {
  rainAudit,
  captureAudit,
  capturePrediction,
  searchAudit,
  argumentAudit,
  projectAudit,
  type CaptureModel,
  type SearchCase,
  type ProjectScope,
  type WaterRow,
} from './capstoneModels';
type Kind = Extract<Lesson['lab'], `capstone-${string}`>;
export const isCapstoneLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('capstone-');
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
  '先核单位、先后顺序和约束，再逐步核对水量、数据或搜索条件。',
  'Check units, order and constraints, then audit the water balance, data or search conditions.',
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

function TankFigure({
  mode,
  capacity,
  row,
}: {
  mode: LanguageMode;
  capacity: number;
  row: WaterRow;
}) {
  const height = capacity === 0 ? 0 : (160 * valueR(row.closing)) / capacity;
  return (
    <DataFigure
      mode={mode}
      name={t('每日雨水箱平衡', 'Daily tank balance')}
      caption={t(
        '虚构教学模型：先收集进水至容量上限，多余溢流，再满足当天用水。图中水位是日末存水，所有水量单位为升；容量0时不计算水位比例。',
        'Fictional teaching model: collect up to capacity, spill excess, then serve daily demand. The water level shows end-of-day storage, in litres. Zero capacity has no water-level ratio.',
      )}
    >
      <svg
        viewBox="0 0 640 280"
        role="img"
        aria-label={word(
          mode,
          t(
            '进水、溢流、用水与日末存水',
            'Inflow, spill, use and closing storage',
          ),
        )}
      >
        <text x="24" y="32">
          {word(mode, t(`第${row.day}天`, `Day ${row.day}`))}; C={capacity} L
        </text>
        <path
          d="M220 65 V230 H420 V65"
          fill="none"
          stroke="#6254a1"
          strokeWidth="4"
        />
        <rect
          x="223"
          y={230 - height}
          width="194"
          height={height}
          fill="#b2d9df"
        />
        <path
          d="M60 85 H205 m-12-7 12 7-12 7 M435 85 H580 m-12-7 12 7-12 7 M435 200 H580 m-12-7 12 7-12 7"
          fill="none"
          stroke="#6254a1"
          strokeWidth="3"
        />
        <text x="24" y="63">
          {word(mode, t('进水', 'Inflow'))}: I=Aηr
        </text>
        <text x="440" y="63">
          {word(mode, t('溢流', 'Spill'))}: ? L
        </text>
        <text x="440" y="180">
          {word(mode, t('实际供水', 'Served'))}: {row.served} L
        </text>
        <text x="320" y="260" textAnchor="middle">
          {word(
            mode,
            t('日末水量先自行计算', 'Calculate closing storage first'),
          )}
        </text>
      </svg>
    </DataFigure>
  );
}
function Ledger({ mode, rows }: { mode: LanguageMode; rows: WaterRow[] }) {
  return (
    <DataTable
      mode={mode}
      name={t('逐日水量账本', 'Daily water ledger')}
      headers={[
        t('日', 'Day'),
        t('期初/L', 'Opening/L'),
        t('进水/L', 'Inflow/L'),
        t('溢流/L', 'Spill/L'),
        t('供水/L', 'Served/L'),
        t('缺口/L', 'Deficit/L'),
        t('期末/L', 'Closing/L'),
      ]}
      rows={rows.map((r) => [
        r.day,
        r.opening,
        r.inflow,
        r.overflow,
        r.served,
        r.deficit,
        r.closing,
      ])}
    />
  );
}
function Modelling({ mode }: { mode: LanguageMode }) {
  const [capacity, C] = useState(60),
    [area, A] = useState(20),
    [eta, E] = useState('3/4'),
    [day, D] = useState(1),
    m = rainAudit(capacity, 'nominal', area, eta),
    row = m.rows[day - 1]!;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构校园雨水项目：初始存水0，五天雨量[6,0,0,6,0]mm，每天需30L。屋顶面积A m²、收集率η；先收雨、再用水，无蒸发或额外水源。',
            'Fictional school project: initial storage zero, rainfall [6,0,0,6,0] mm, daily demand 30 L. Roof area A m² and collection fraction η; collect before use, with no evaporation or backup source.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('水箱容量/L', 'Tank capacity/L')}
        value={String(capacity)}
        options={opts([0, 40, 60, 89, 90, 100, 120])}
        change={(v) => C(Number(v))}
      />
      <Select
        mode={mode}
        name={t('屋顶面积/m²', 'Roof area/m²')}
        value={String(area)}
        options={opts([10, 20, 30])}
        change={(v) => A(Number(v))}
      />
      <Select
        mode={mode}
        name={t('收集率η', 'Collection fraction η')}
        value={eta}
        options={opts(['0', '1/2', '3/4', '1'])}
        change={E}
      />
      <Select
        mode={mode}
        name={t('观察天数', 'Inspected day')}
        value={String(day)}
        options={opts([1, 2, 3, 4, 5])}
        change={(v) => D(Number(v))}
      />
      <Task
        mode={mode}
        name={t('当天入箱前的收集量/L', 'Collected inflow before storage/L')}
        answer={num(row.inflow)}
      />
      <Task
        mode={mode}
        name={t('当天溢流/L', 'Daily overflow/L')}
        answer={num(row.overflow)}
      />
      <Task
        mode={mode}
        name={t('当天日末存水/L', 'Daily closing storage/L')}
        answer={num(row.closing)}
      />
      <TankFigure mode={mode} capacity={capacity} row={row} />
      <Audit mode={mode}>
        <Ledger mode={mode} rows={m.rows} />
        <p>
          <Text
            mode={mode}
            text={t(
              '1mm×1m²=1L，所以进水=Aηr。先取min(C,期初+进水)，超出为溢流，再取min(需求,存水)供水。不能先扣需求再套容量，也不能把负存水当成真实供水。',
              'Since 1 mm × 1 m² = 1 L, inflow is Aηr. First take min(C,opening+inflow), spilling the excess; then serve min(demand,stored). Reversing the order changes the model. Negative storage is not supplied water.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function CaptureFigure({
  mode,
  kind,
  revealed,
}: {
  mode: LanguageMode;
  kind: CaptureModel;
  revealed: boolean;
}) {
  const x = (r: number) => 70 + 50 * r,
    y = (v: number) => 350 - 1.9 * v,
    m = captureAudit(kind),
    points = m.rows.filter((r) => revealed || r.set === 'calibration');
  return (
    <DataFigure
      mode={mode}
      name={t('校准与留出数据图', 'Calibration and validation plot')}
      caption={t(
        '横轴为雨量mm，纵轴为入箱前收集量L，尺度和单位不同。紫实心点是校准，橙空心点是留出数据；曲线是声明的候选模型，不连接观测来暗示连续事实。数据均为虚构。',
        'Rainfall is horizontal in mm; collected volume before storage is vertical in L, with different units and scales. Purple filled points are calibration; orange open points are validation. The curve is the declared candidate model, not a line joining observations. All data are fictional.',
      )}
    >
      <svg
        viewBox="0 0 640 415"
        role="img"
        aria-label={word(
          mode,
          t(
            '雨量与收集量，校准和验证分开',
            'Rainfall versus collection, with separated data roles',
          ),
        )}
      >
        <path d="M70 35 V350 H590" fill="none" stroke="currentColor" />
        {[0, 2, 4, 6, 8, 10].map((r) => (
          <g key={r}>
            <line x1={x(r)} y1="350" x2={x(r)} y2="357" stroke="currentColor" />
            <text x={x(r)} y="380" textAnchor="middle">
              {r}
            </text>
          </g>
        ))}
        {[0, 40, 80, 120, 160].map((v) => (
          <g key={v}>
            <line x1="64" y1={y(v)} x2="570" y2={y(v)} stroke="#ddd7e6" />
            <text x="53" y={y(v) + 6} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <text x="32" y="23">
          V / L
        </text>
        <text x="595" y="405" textAnchor="end">
          r / mm
        </text>
        <polyline
          data-capture-model={kind}
          points={Array.from(
            { length: 101 },
            (_, i) => `${x(i / 10)},${y(capturePrediction(kind, i / 10))}`,
          ).join(' ')}
          fill="none"
          stroke="#6254a1"
          strokeWidth="3"
        />
        {points.map((r) => (
          <circle
            key={r.rain}
            data-capture-set={r.set}
            cx={x(r.rain)}
            cy={y(r.litres)}
            r="6"
            fill={r.set === 'calibration' ? '#6254a1' : 'white'}
            stroke={r.set === 'calibration' ? '#6254a1' : '#c47b30'}
            strokeWidth="3"
          />
        ))}
      </svg>
    </DataFigure>
  );
}
function Validation({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<CaptureModel>('proportional'),
    [revealed, R] = useState(false),
    m = captureAudit(kind);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '校准数据(r mm,V L)：(0,0)、(2,30)、(4,60)、(6,90)。先声明候选模型；事先规定留出误差|实测−预测|≤5L才算本次合格。',
            'Calibration (r mm,V L): (0,0), (2,30), (4,60), (6,90). Declare a model first. The predeclared validation rule is |observed−predicted|≤5 L at every held-out point.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('候选收集模型', 'Candidate capture model')}
        value={kind}
        options={[
          ['proportional', t('V=15r', 'V=15r')],
          ['offset', t('V=15r+10', 'V=15r+10')],
          ['capped', t('V=min(15r,105)', 'V=min(15r,105)')],
        ]}
        change={(v) => K(v as CaptureModel)}
      />
      <Task
        mode={mode}
        name={t('雨量8mm的模型预测/L', 'Model prediction at 8 mm/L')}
        answer={num(capturePrediction(kind, 8))}
      />
      <button
        className="math-button secondary"
        aria-expanded={revealed}
        onClick={() => R(!revealed)}
      >
        <Text
          mode={mode}
          text={t('显示/隐藏留出数据', 'Show/hide validation data')}
        />
      </button>
      {revealed && (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '留出数据：(8,105)、(10,100)。有符号残差=实测−预测。若用这些数据选改模型，它们就成为开发资料，需新的独立验证。',
                'Held-out observations: (8,105), (10,100). Signed residual is observed minus predicted. If these observations guide revision or model selection, they become development data; use new independent validation.',
              )}
            />
          </p>
          <Task
            mode={mode}
            name={t('8mm处有符号残差/L', 'Signed residual at 8 mm/L')}
            answer={num(m.rows[4]!.residual)}
          />
          <Task
            mode={mode}
            name={t(
              '留出点均在5L容差内（true/false）',
              'All validation points within 5 L (true/false)',
            )}
            answer={{
              kind: 'logic-code',
              value: m.withinTolerance ? 'true' : 'false',
            }}
          />
        </>
      )}
      <CaptureFigure mode={mode} kind={kind} revealed={revealed} />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('用途', 'Role'),
            t('雨量/mm', 'Rain/mm'),
            t('实测/L', 'Observed/L'),
            t('预测/L', 'Predicted/L'),
            t('残差/L', 'Residual/L'),
          ]}
          rows={m.rows
            .filter((r) => revealed || r.set === 'calibration')
            .map((r) => [
              word(
                mode,
                r.set === 'calibration'
                  ? t('校准', 'Calibration')
                  : t('留出', 'Validation'),
              ),
              r.rain,
              r.litres,
              r.prediction,
              r.residual,
            ])}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '校准吻合不是全域证明。零雨量仍预测10L违反本模型无额外水源的条件；换成带上限模型虽能解释当前留出数据，也没有证明物理原因或未来必准。',
              'Calibration agreement is not a universal proof. Predicting 10 L at zero rain conflicts with the no-extra-source model. A capped revision can fit these held-out points without proving a physical cause or future accuracy.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function SearchFigure({
  mode,
  maximum,
}: {
  mode: LanguageMode;
  maximum: number;
}) {
  const mid = Math.floor((maximum + 1) / 2);
  return (
    <DataFigure
      mode={mode}
      name={t('两种搜索策略', 'Two search strategies')}
      caption={t(
        '比较同一个判据调用次数，每次均模拟完整五天。上行逐个候选，下行按单调判据分半；次数不是实际运行秒数。',
        'Compare calls to the same predicate, each simulating all five days. The upper lane scans candidates; the lower lane halves a range using a monotone predicate. Counts are not measured runtime seconds.',
      )}
    >
      <svg
        viewBox="0 0 640 235"
        role="img"
        aria-label={word(
          mode,
          t('线性扫描与二分搜索', 'Linear scan and binary search'),
        )}
      >
        <text x="24" y="30">
          {word(mode, t('逐个扫描', 'Scan one by one'))}
        </text>
        {[0, 1, 2, '…', maximum].map((n, i) => (
          <g key={i}>
            <rect
              x={40 + i * 116}
              y="48"
              width="92"
              height="45"
              rx="6"
              fill="#ebe6f5"
            />
            <text x={86 + i * 116} y="77" textAnchor="middle">
              {n}
            </text>
          </g>
        ))}
        <text x="24" y="136">
          {word(mode, t('单调时分半', 'Halve when monotone'))}
        </text>
        <path d="M55 175 H585 M320 160 V190" stroke="#6254a1" strokeWidth="3" />
        <text x="55" y="215" textAnchor="middle">
          0
        </text>
        <text x="320" y="215" textAnchor="middle">
          mid={mid}
        </text>
        <text x="585" y="215" textAnchor="middle">
          {maximum}
        </text>
      </svg>
    </DataFigure>
  );
}
function Efficiency({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<SearchCase>('water'),
    [maximum, M] = useState(150),
    m = searchAudit(kind, maximum);
  return (
    <>
      <Select
        mode={mode}
        name={t('搜索判据', 'Search predicate')}
        value={kind}
        options={[
          ['water', t('每天供水达标', 'Every day supplied')],
          [
            'budget-window',
            t('供水且预算≤240筹码', 'Supply and budget ≤240 toy credits'),
          ],
          [
            'impossible',
            t(
              '更长干期下每天供水达标',
              'Every day supplied in a longer dry spell',
            ),
          ],
        ]}
        change={(v) => K(v as SearchCase)}
      />
      <Select
        mode={mode}
        name={t('最大候选容量/L', 'Maximum candidate capacity/L')}
        value={String(maximum)}
        options={opts([60, 100, 150, 200])}
        change={(v) => M(Number(v))}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '候选为0到上限的所有整数升。寻找最小满足者；全部不满足则报告无解。预算费用=40+2C，单位为虚构筹码。',
            'Candidates are every integer litre from zero through the upper bound. Find the first passing value or report none. Budget cost is 40+2C in fictional toy credits.',
          )}
        />
      </p>
      <p>
        <Text
          mode={mode}
          text={t(
            `固定A20m²、η3/4、初始0、每日30L，先收后用。雨量${kind === 'impossible' ? '[6,0,0,0,6]' : '[6,0,0,6,0]'}mm。二分从lo=0、hi=${maximum + 1}（不含）开始，试mid=floor((lo+hi)/2)；合格令hi=mid，否则lo=mid+1，直到相遇。`,
            `Fix A20 m², η3/4, initial zero and demand 30 L/day, collecting before use. Rain is ${kind === 'impossible' ? '[6,0,0,0,6]' : '[6,0,0,6,0]'} mm. Binary search starts lo=0, hi=${maximum + 1} exclusive, tests mid=floor((lo+hi)/2), sets hi=mid on success or lo=mid+1 otherwise, and stops when they meet.`,
          )}
        />
      </p>
      <Task
        mode={mode}
        name={t(
          '本判据可直接用二分（true/false）',
          'Binary search justified (true/false)',
        )}
        answer={{ kind: 'logic-code', value: m.monotone ? 'true' : 'false' }}
      />
      {m.binary && (
        <Task
          key={`${kind}:${maximum}`}
          mode={mode}
          name={t('本次二分判据调用次数', 'Actual binary predicate calls')}
          answer={num(m.binary.evaluations)}
        />
      )}
      <Task
        key={`${kind}:${maximum}:linear`}
        mode={mode}
        name={t('本次逐个扫描调用次数', 'Actual linear predicate calls')}
        answer={num(m.linear.evaluations)}
      />
      <SearchFigure mode={mode} maximum={maximum} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [
              t('逐个扫描答案', 'Linear answer'),
              m.linear.answer === null ? 'none' : String(m.linear.answer),
            ],
            [t('逐个扫描调用', 'Linear calls'), String(m.linear.evaluations)],
            [
              t('二分答案', 'Binary answer'),
              !m.binary
                ? 'not justified'
                : m.binary.answer === null
                  ? 'none'
                  : String(m.binary.answer),
            ],
            [
              t('二分调用', 'Binary calls'),
              m.binary ? String(m.binary.evaluations) : 'not justified',
            ],
            [
              t('二分最坏调用上界', 'Binary worst-case call bound'),
              m.binary ? String(m.worstBinary) : 'not justified',
            ],
          ]}
        />
        {m.binary && (
          <DataTable
            mode={mode}
            name={t('二分搜索轨迹', 'Binary search trace')}
            headers={[
              t('lo', 'lo'),
              t('hi（不含）', 'hi (exclusive)'),
              t('mid', 'mid'),
              t('判据', 'Predicate'),
            ]}
            rows={m.binary.rows.map((r) => [
              r.lo,
              r.hi,
              r.mid,
              String(r.passes),
            ])}
          />
        )}
        <p>
          <Text
            mode={mode}
            text={t(
              '容量增加且其他条件固定时，期末存水不减、缺口不增，可归纳证明供水判据从false变true后不再变回。加预算却使C90可行、C110超预算，不能盲用二分。两算法必须解同一问题，再比较调用次数；只对一次计时不足以证明一般效率。',
              'For fixed inputs, greater capacity cannot reduce closing storage or increase deficit; induction gives an upward-closed supply predicate. Adding the budget makes C90 pass and C110 fail, so binary search is unjustified. Compare calls for the same task; timing one run does not establish general efficiency.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function ArgumentFigure({
  mode,
  capacity,
}: {
  mode: LanguageMode;
  capacity: number;
}) {
  return (
    <DataFigure
      mode={mode}
      name={t('完整论证结构', 'Complete argument structure')}
      caption={t(
        '证明最小需要两个方向：下界排除更小容量，逐日构造证明候选足够。可行不等于最优，模型内结论不等于现实保证。',
        'Minimality needs two directions: a lower bound excludes smaller tanks, and a day-by-day construction proves the candidate suffices. Feasible does not imply optimal; a model conclusion is not a real-world guarantee.',
      )}
    >
      <svg
        viewBox="0 0 640 260"
        role="img"
        aria-label={word(
          mode,
          t(
            '问题、前提、必要性、充分性和范围',
            'Question, assumptions, necessity, sufficiency and scope',
          ),
        )}
      >
        {[
          [
            'C ≥ 3 × 30',
            t('必要：首三日水量', 'Necessary: first-three-day volume'),
          ],
          [
            'C = ' + capacity,
            t('充分：逐日账本核验', 'Sufficient: daily ledger check'),
          ],
          [
            'C = 90 ?',
            t('结论：最小性与适用范围', 'Conclusion: minimality and scope'),
          ],
        ].map(([formula, label], i) => (
          <g key={i}>
            <rect
              x="35"
              y={18 + 78 * i}
              width="570"
              height="60"
              rx="8"
              fill="#ebe6f5"
              stroke="#6254a1"
            />
            <text x="55" y={43 + 78 * i}>
              {String(formula)}
            </text>
            <text x="55" y={66 + 78 * i}>
              {word(mode, label as LocalizedText)}
            </text>
          </g>
        ))}
      </svg>
    </DataFigure>
  );
}
function Argument({ mode }: { mode: LanguageMode }) {
  const [capacity, C] = useState(90),
    m = argumentAudit(capacity);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '只讨论名义五天：雨量[6,0,0,6,0]mm，A20m²，η3/4，每日30L，初始0，先收后用；容量为任意非负整数升，暂不含目录或预算。',
            'Use only the nominal five days: rainfall [6,0,0,6,0] mm, A=20 m², η=3/4, demand 30 L/day, initial zero, collect before use. Capacity is any nonnegative integer litre; catalog and budget are not yet included.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('待论证容量/L', 'Candidate for argument/L')}
        value={String(capacity)}
        options={opts([60, 89, 90, 100, 120])}
        change={(v) => C(Number(v))}
      />
      <Task
        mode={mode}
        name={t(
          '此候选每天够用（true/false）',
          'Candidate supplies every day (true/false)',
        )}
        answer={{ kind: 'logic-code', value: m.sufficient ? 'true' : 'false' }}
      />
      <Task
        mode={mode}
        name={t(
          '此候选为最小容量（true/false）',
          'Candidate is minimal (true/false)',
        )}
        answer={{ kind: 'logic-code', value: m.minimal ? 'true' : 'false' }}
      />
      <ArgumentFigure mode={mode} capacity={capacity} />
      <Audit mode={mode}>
        <Ledger mode={mode} rows={m.model.rows} />
        <Evidence
          mode={mode}
          rows={[
            [t('必要下界/L', 'Necessary lower bound/L'), String(m.necessary)],
            [t('此候选总缺水/L', 'Candidate total deficit/L'), m.model.deficit],
            [
              t(
                '前一整数容量总缺水/L',
                'Deficit at previous integer capacity/L',
              ),
              m.previous?.deficit ?? 'not applicable',
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '前三天只有首日进水，每天30L，首日收集后最多存C，故C≥90必要。C90的日末存水60,30,0,60,30且每天供水30，证明充分；C89第三天缺1L。C100虽可行却不是最小。完整报告要给问题、变量单位、先后规则、必要与充分、核验及范围，由人审查逻辑。',
              'Only day one supplies inflow for the first three days, each needing 30 L. At most C is stored after collection, so C≥90 is necessary. At C90, closing stores 60,30,0,60,30 and every demand is met, proving sufficiency; C89 is short one litre on day three. C100 is feasible but not minimal. A full report states question, variables, units, order, both proof directions, checks and scope; a person reviews its logic.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function ProjectFigure({
  mode,
  scope,
  budget,
}: {
  mode: LanguageMode;
  scope: ProjectScope;
  budget: number;
}) {
  const m = projectAudit(scope, budget),
    x = (c: number) => 75 + c * 3.15,
    y = (cost: number) => 325 - cost * 0.7;
  return (
    <DataFigure
      mode={mode}
      name={t('目录容量与约束', 'Catalog capacities and constraints')}
      caption={t(
        '每个点是一种目录容量，不能连成可以买任意容量的直线。紫点满足所选情景供水，空心点不满足；橙虚线为预算。最终需同时满足供水与预算，再比较成本。',
        'Each point is a catalog size; do not join points to imply every capacity is purchasable. Purple points meet supply in the selected scenarios; open points do not. The orange dashed line is the budget. Require both supply and budget before minimising cost.',
      )}
    >
      <svg
        viewBox="0 0 640 395"
        role="img"
        aria-label={word(
          mode,
          t(
            '离散水箱方案的容量、费用与供水',
            'Discrete tank options: capacity, cost and supply',
          ),
        )}
      >
        <path d="M75 30 V325 H595" stroke="currentColor" fill="none" />
        {[0, 80, 160, 240, 320, 400].map((v) => (
          <g key={v}>
            <text x="61" y={y(v) + 6} textAnchor="end">
              {v}
            </text>
            <line x1="75" y1={y(v)} x2="580" y2={y(v)} stroke="#e4dfeb" />
          </g>
        ))}
        <line
          x1="75"
          y1={y(budget)}
          x2="580"
          y2={y(budget)}
          stroke="#c47b30"
          strokeWidth="2"
          strokeDasharray="7 5"
        />
        {m.rows.map((r) => (
          <g
            key={r.capacity}
            data-project-capacity={r.capacity}
            data-water-ok={r.waterOK}
          >
            <circle
              cx={x(r.capacity)}
              cy={y(r.cost)}
              r="6"
              stroke="#6254a1"
              strokeWidth="2"
              fill={r.waterOK ? '#6254a1' : 'white'}
            />
            <text x={x(r.capacity)} y="355" textAnchor="middle">
              {r.capacity}
            </text>
          </g>
        ))}
        <text x="22" y="20">
          {word(mode, t('费用/筹码', 'Cost/credits'))}
        </text>
        <text x="590" y="385" textAnchor="end">
          C / L
        </text>
      </svg>
    </DataFigure>
  );
}
function Project({ mode }: { mode: LanguageMode }) {
  const [scope, S] = useState<ProjectScope>('nominal'),
    [budget, B] = useState(240),
    m = projectAudit(scope, budget);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '终章虚构采购项目：目录容量0,20,…,160L，费用40+2C筹码；A20m²、η3/4、初始0、先收后用。名义：雨量[6,0,0,6,0]mm、每日30L；高用量：[8,0,0,8,0]mm、每日40L；长干期：[6,0,0,0,6]mm、每日30L。',
            'Fictional final project: catalog 0,20,…,160 L; cost 40+2C toy credits; A20 m², η3/4, initial zero, collect before use. Nominal: rain [6,0,0,6,0] mm, demand 30 L/day; high use: [8,0,0,8,0] mm, demand 40; longer dry spell: [6,0,0,0,6] mm, demand 30.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('必须覆盖的情景', 'Required scenarios')}
        value={scope}
        options={[
          ['nominal', t('只覆盖名义情景', 'Nominal only')],
          ['both', t('名义与高用量', 'Nominal and high use')],
          ['including-dry', t('还包括长干期', 'Also include longer dry spell')],
        ]}
        change={(v) => S(v as ProjectScope)}
      />
      <Select
        mode={mode}
        name={t('预算/虚构筹码', 'Budget/toy credits')}
        value={String(budget)}
        options={opts([200, 240, 280, 360])}
        change={(v) => B(Number(v))}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '用集合格式作答，例如{20,40}；没有可行容量写∅或{}。',
            'Use set notation, for example {20,40}; enter ∅ or {} when no capacity is feasible.',
          )}
        />
      </p>
      <Task
        key={`${scope}:${budget}`}
        mode={mode}
        name={t('全部可行目录容量集合', 'All feasible catalog capacities')}
        answer={{ kind: 'finite-set', value: `{${m.feasible.join(',')}}` }}
      />
      <Task
        mode={mode}
        name={t(
          '预算内存在方案（true/false）',
          'A plan exists within budget (true/false)',
        )}
        answer={{ kind: 'logic-code', value: m.best ? 'true' : 'false' }}
      />
      <ProjectFigure mode={mode} scope={scope} budget={budget} />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('容量/L', 'Capacity/L'),
            t('费用/筹码', 'Cost/credits'),
            t('情景缺水/L', 'Scenario deficits/L'),
            t('全供水', 'Supply met'),
            t('预算', 'Budget met'),
            t('可行', 'Feasible'),
          ]}
          rows={m.rows.map((r) => [
            r.capacity,
            r.cost,
            r.ledgers.map((l) => `${l.scenario}:${l.deficit}`).join('; '),
            String(r.waterOK),
            String(r.budgetOK),
            String(r.feasible),
          ])}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '项目报告至少包含：问题与成功标准；数据来源（此处虚构）；变量/单位/假设；模型与完整可行集合；最便宜方案及核验；压力情景与局限。长干期首批进水仅90L，前四日需120L，增大空箱也不能创造缺少的30L。没有可行方案也是有效结论。',
              'A project report includes the question and success criteria; data provenance (fictional here); variables, units and assumptions; model and complete feasible set; cheapest option with checks; stress scenarios and limits. The dry-spell case has only 90 L before four days need 120 L: enlarging an empty tank cannot create the missing 30 L. No feasible plan is a valid conclusion.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function CapstoneLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'capstone-model' ? (
        <Modelling mode={mode} />
      ) : kind === 'capstone-validation' ? (
        <Validation mode={mode} />
      ) : kind === 'capstone-efficiency' ? (
        <Efficiency mode={mode} />
      ) : kind === 'capstone-argument' ? (
        <Argument mode={mode} />
      ) : (
        <Project mode={mode} />
      )}
    </section>
  );
}
export function CapstoneHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'capstone-model')
    return (
      <TankFigure mode={mode} capacity={60} row={rainAudit(60).rows[0]!} />
    );
  if (kind === 'capstone-validation')
    return <CaptureFigure mode={mode} kind="proportional" revealed={false} />;
  if (kind === 'capstone-efficiency')
    return <SearchFigure mode={mode} maximum={150} />;
  if (kind === 'capstone-argument')
    return <ArgumentFigure mode={mode} capacity={100} />;
  return <ProjectFigure mode={mode} scope="both" budget={240} />;
}
