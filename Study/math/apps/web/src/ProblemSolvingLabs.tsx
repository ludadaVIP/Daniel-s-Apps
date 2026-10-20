import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { DataTable } from './DataModellingVisuals';
import {
  DependencyFigure,
  PacketFigure,
  CostFigure,
  WitnessFigure,
  stepLabels,
} from './ProblemSolvingVisuals';
import {
  workshopModel,
  workshopMaximum,
  workshopStep,
  workshopComparison,
  boundaryAudit,
  witnessModel,
  workshopSensitivity,
  type WorkshopStep,
  type BoundaryRule,
  type WitnessClaim,
  type WorkshopPlan,
} from './problemSolvingModels';
type Kind = Extract<Lesson['lab'], `problem-${string}`>;
export const isProblemSolvingLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('problem-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
const numeric = (n: number): AnswerSpec => ({
  kind: 'number',
  value: String(n),
});
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
  change: (v: string) => void;
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
const opts = (ns: number[]): [string, LocalizedText][] =>
  ns.map((n) => [String(n), t(String(n), String(n))]);
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
                    '预测符合。用单位、前提和适用范围解释你的方法。',
                    'The prediction matches. Explain your method with units, premises and scope.',
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
const packetHint = t(
  '先算需求，扣库存后除8向上取整；正活动还收固定费。',
  'Compute demand, subtract stock and round upward after division by eight; positive events also pay a fixed fee.',
);
const scenarioRules = t(
  '虚构筹码模型：库存4张、备用5张，每包8张。A=7+6k、B=19+4k（正活动）。人数0取消、需求费用均0；容量20。默认每人3张、预算50。',
  'Fictional toy-credit model: four cards in stock, five spares, eight per packet. Positive-event prices A=7+6k, B=19+4k. Zero attendance cancels for zero demand and cost; capacity twenty. Defaults are three cards each and budget fifty.',
);
function Decompose({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(18),
    [stock, setStock] = useState(4),
    [budget, setBudget] = useState(50),
    [done, setDone] = useState<WorkshopStep[]>([]),
    [message, setMessage] = useState<LocalizedText | null>(null),
    m = workshopModel({ n, stock, budget });
  const reset = () => {
    setDone([]);
    setMessage(null);
  };
  return (
    <>
      <p>
        <Text mode={mode} text={scenarioRules} />
      </p>
      <div className="math-concept-lab">
        <Select
          mode={mode}
          name={t('人数', 'Attendance')}
          value={String(n)}
          options={opts([0, 1, 18, 19, 20, 21])}
          change={(v) => {
            setN(Number(v));
            reset();
          }}
        />
        <Select
          mode={mode}
          name={t('库存张数', 'Stock cards')}
          value={String(stock)}
          options={opts([0, 4, 60])}
          change={(v) => {
            setStock(Number(v));
            reset();
          }}
        />
        <Select
          mode={mode}
          name={t('预算筹码', 'Budget credits')}
          value={String(budget)}
          options={opts([13, 49, 50, 55])}
          change={(v) => {
            setBudget(Number(v));
            reset();
          }}
        />
      </div>
      <p>
        <Text
          mode={mode}
          text={t(
            '按你认为合理的顺序执行任务。依赖未满足时不会推进；容量可在材料链前、中或后检查。',
            'Execute tasks in a valid order. Unmet prerequisites block progress; check capacity before, during or after the materials chain.',
          )}
        />
      </p>
      <DependencyFigure mode={mode} done={done} />
      <div className="math-concept-lab">
        {(Object.keys(stepLabels) as WorkshopStep[]).map((step) => (
          <button
            key={step}
            className="math-button secondary"
            disabled={done.includes(step)}
            onClick={() => {
              const r = workshopStep(done, step);
              if (r.accepted) {
                setDone([...done, step]);
                setMessage(
                  t(
                    '步骤已执行。请说明该步骤的输入与单位。',
                    'Step executed. Explain its inputs and units.',
                  ),
                );
              } else
                setMessage(
                  t(
                    `还需要：${r.missing.map((s) => stepLabels[s].zh).join('、')}。`,
                    `Still needed: ${r.missing.map((s) => stepLabels[s].en).join(', ')}.`,
                  ),
                );
            }}
          >
            <Text mode={mode} text={stepLabels[step]} />
          </button>
        ))}
      </div>
      {message && (
        <p
          role="status"
          aria-label={word(mode, t('任务顺序反馈', 'Task order feedback'))}
        >
          <Text mode={mode} text={message} />
        </p>
      )}
      <Predict
        key={`d${m.demand}`}
        mode={mode}
        name={t('预测总需求（张）', 'Predict demand (cards)')}
        answer={numeric(m.demand)}
        hint={packetHint}
      />
      <Predict
        key={`k${m.packets}`}
        mode={mode}
        name={t('预测最少包数', 'Predict minimum packets')}
        answer={numeric(m.packets)}
        hint={packetHint}
      />
      <Predict
        key={`c${m.cost}`}
        mode={mode}
        name={t('预测A费用（筹码）', 'Predict A cost (credits)')}
        answer={numeric(m.cost)}
        hint={packetHint}
      />
      <Audit mode={mode}>
        <PacketFigure mode={mode} n={n} stock={stock} />
        <DataTable
          mode={mode}
          headers={[
            t('需求/张', 'Demand/cards'),
            t('缺口/张', 'Shortage/cards'),
            t('包数', 'Packets'),
            t('费用/筹码', 'Cost/credits'),
            t('剩余/张', 'Surplus/cards'),
            t('预算且容量', 'Budget and capacity'),
          ]}
          rows={[
            [
              m.demand,
              m.net,
              m.packets,
              m.cost,
              m.surplus,
              m.feasible ? '✓' : '×',
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              `同库存与预算下最大人数${workshopMaximum({ stock, budget })}。最大值由约束推导并可逐个整数复核；一个可行人数不自动是最大。`,
              `Maximum attendance at this stock and budget: ${workshopMaximum({ stock, budget })}. Derive it from constraints and check whole inputs; one feasible attendance is not automatically maximal.`,
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Represent({ mode }: { mode: LanguageMode }) {
  const [axis, setAxis] = useState<'people' | 'packets'>('people'),
    [budget, setBudget] = useState(50),
    m = workshopComparison(budget);
  return (
    <>
      <p>
        <Text mode={mode} text={scenarioRules} />
      </p>
      <div className="math-concept-lab">
        <Select
          mode={mode}
          name={t('横轴变量', 'Horizontal variable')}
          value={axis}
          options={[
            ['people', t('人数n', 'Attendance n')],
            ['packets', t('包数k', 'Packet count k')],
          ]}
          change={(v) => setAxis(v as typeof axis)}
        />
        <Select
          mode={mode}
          name={t('预算筹码', 'Budget credits')}
          value={String(budget)}
          options={opts([49, 50, 51])}
          change={(v) => setBudget(Number(v))}
        />
      </div>
      <Predict
        mode={mode}
        name={t(
          '预测正活动相等包数',
          'Predict equal-cost positive packet count',
        )}
        answer={numeric(6)}
        hint={t(
          '将7+6k与19+4k相等，注意k数包。',
          'Equate 7+6k and 19+4k; k counts packets.',
        )}
      />
      <Predict
        mode={mode}
        name={t(
          '预测完整相等人数集合',
          'Predict complete equal-cost attendance set',
        )}
        answer={{ kind: 'finite-set', value: '{0,14,15}' }}
        hint={t(
          '写{…}；检查取整区间和取消分支。',
          'Use {…}; check the ceiling interval and cancellation branch.',
        )}
      />
      <CostFigure mode={mode} axis={axis} budget={budget} />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('人数n', 'Attendance n'),
            t('包数k', 'Packets k'),
            t('A筹码', 'A credits'),
            t('B筹码', 'B credits'),
            t('B−A', 'B−A'),
          ]}
          rows={m.rows.map((r) => [r.n, r.packets, r.a, r.b, r.gap])}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              `相等人数{${m.ties.join(',')}}；当前预算最大人数A=${m.aMaximum}、B=${m.bMaximum}。正活动差B−A=12−2k；六包相等，转回40<3n+1≤48。`,
              `Equal attendance {${m.ties.join(',')}}; current budget maxima A=${m.aMaximum}, B=${m.bMaximum}. Positive-event difference B−A=12−2k. Six packets means 40<3n+1≤48.`,
            )}
          />
        </p>
      </Audit>
    </>
  );
}
const boundaryNames: Record<BoundaryRule, LocalizedText> = {
  'floor-packets': t('候选一：向下取整', 'Candidate one: floor packets'),
  'keep-fee': t('候选二：零人也收固定费', 'Candidate two: retain fee at zero'),
  'ignore-capacity': t('候选三：只查费用', 'Candidate three: cost only'),
  'derived-rule': t('候选四：完整推导规则', 'Candidate four: derived rule'),
};
function Boundaries({ mode }: { mode: LanguageMode }) {
  const [rule, setRule] = useState<BoundaryRule>('floor-packets'),
    [n, setN] = useState(4),
    [budget, setBudget] = useState(50),
    m = boundaryAudit(rule, n, budget);
  return (
    <>
      <p>
        <Text mode={mode} text={scenarioRules} />
      </p>
      <div className="math-concept-lab">
        <Select
          mode={mode}
          name={t('候选规则', 'Candidate rule')}
          value={rule}
          options={Object.entries(boundaryNames)}
          change={(v) => setRule(v as BoundaryRule)}
        />
        <Select
          mode={mode}
          name={t('测试人数', 'Test attendance')}
          value={String(n)}
          options={opts([0, 1, 2, 3, 4, 5, 6, 20, 21])}
          change={(v) => setN(Number(v))}
        />
        <Select
          mode={mode}
          name={t('预算筹码', 'Budget credits')}
          value={String(budget)}
          options={opts([12, 13, 49, 50, 55, 200])}
          change={(v) => setBudget(Number(v))}
        />
      </div>
      <p>
        <Text
          mode={mode}
          text={t(
            '候选一比较包数，候选二与四比较费用，候选三比较可行性布尔判断。valid只表示当前输入与完整规则相符，不表示全域已证。',
            'Candidate one compares packet counts, two and four compare costs, three compares feasibility. valid means agreement at this input, not a universal proof.',
          )}
        />
      </p>
      <Predict
        key={`c${m.correct.cost}`}
        mode={mode}
        name={t('预测正确A费用', 'Predict correct A cost')}
        answer={numeric(m.correct.cost)}
        hint={packetHint}
      />
      <Predict
        key={`${rule}-${n}-${budget}`}
        mode={mode}
        name={t(
          '预测候选核验（valid/invalid）',
          'Predict candidate audit (valid/invalid)',
        )}
        answer={{
          kind: 'integration-verdict',
          value: m.valid ? 'valid' : 'invalid',
        }}
        hint={t(
          '用完整取消、取整、预算和容量规则逐项比较。',
          'Compare against the complete cancellation, rounding, budget and capacity rules.',
        )}
      />
      <Audit mode={mode}>
        <PacketFigure mode={mode} n={n} />
        <DataTable
          mode={mode}
          headers={[
            t('候选输出', 'Candidate output'),
            t('正确输出', 'Correct output'),
            t('候选缺张', 'Candidate shortage'),
            t('当前输入相符', 'Agreement here'),
          ]}
          rows={[
            [
              String(m.candidate),
              String(m.expected),
              m.shortage,
              m.valid ? '✓' : '×',
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '4人：缺13张，向下1包少5张；5人：缺16张，两种取整碰巧一致。零人检取消，21人检容量。有限通过与覆盖全域的证明有不同作用。',
              'At four: shortage thirteen, floor one leaves five missing. At five: shortage sixteen, floor and ceiling happen to agree. Zero probes cancellation; twenty-one probes capacity. Finite passes differ from an argument covering the whole domain.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
const claims: Record<WitnessClaim, LocalizedText> = {
  'square-sum': t('平方和命题', 'Square-sum claim'),
  'cancel-factor': t('消去因子命题', 'Factor-cancellation claim'),
  'finite-table': t('有限表格命题', 'Finite-table claim'),
  'equal-perimeter': t('同周长命题', 'Equal-perimeter claim'),
};
const statements: Record<WitnessClaim, LocalizedText> = {
  'square-sum': t(
    '对所有有理数a,b，(a+b)²=a²+b²。输入(a,b)。',
    'For all rational a,b, (a+b)²=a²+b². Enter (a,b).',
  ),
  'cancel-factor': t(
    '对所有有理数x，若x²=x，则x=1。输入x。',
    'For all rational x, if x²=x then x=1. Enter x.',
  ),
  'finite-table': t(
    'f(x)=x+x(x−1)(x−2)在0、1、2与x相等，因此声称对所有有理数f(x)=x。输入x。',
    'f(x)=x+x(x−1)(x−2) agrees with x at 0,1,2; the claim extends equality to all rationals. Enter x.',
  ),
  'equal-perimeter': t(
    '矩形(a,6−a)、(b,6−b)，0<a,b<6，周长同12，所以声称面积相同。输入(a,b)。',
    'Rectangles (a,6−a), (b,6−b) with 0<a,b<6 have perimeter twelve, so the claim is equal area. Enter (a,b).',
  ),
};
function Counterexample({ mode }: { mode: LanguageMode }) {
  const [claim, setClaim] = useState<WitnessClaim>('square-sum'),
    [raw, setRaw] = useState(''),
    [checked, setChecked] = useState(false),
    m = witnessModel(claim, raw);
  return (
    <>
      <Select
        mode={mode}
        name={t('命题', 'Claim')}
        value={claim}
        options={Object.entries(claims)}
        change={(v) => {
          setClaim(v as WitnessClaim);
          setRaw('');
          setChecked(false);
        }}
      />
      <p>
        <Text mode={mode} text={statements[claim]} />
      </p>
      <p>
        <Text
          mode={mode}
          text={t(
            '实验输入：有理数绝对值≤20、约分后分母≤100。分数与小数均可；矩形还要满足严格正边长条件。数值核验不代替你对量词和反驳理由的解释。',
            'Workbench inputs are rationals of magnitude ≤20 and reduced denominator ≤100. Fractions and decimals are accepted; rectangles also need strictly positive sides. Numerical checking does not replace your explanation of quantifiers and refutation.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('你的反例', 'Your counterexample')} />
        <input
          aria-label={word(mode, t('你的反例', 'Your counterexample'))}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核验反例', 'Check counterexample')} />
      </button>
      {checked && (
        <>
          <p
            role="status"
            aria-label={word(mode, t('反例反馈', 'Counterexample feedback'))}
          >
            <Text
              mode={mode}
              text={
                !m.parsed
                  ? t(
                      '输入格式或有理数边界未通过。按命题输入单数或数对。',
                      'Input format or rational bounds failed. Use a scalar or pair as requested.',
                    )
                  : !m.premise
                    ? t(
                        '输入可读取，但前提不成立，不能作为反例。',
                        'Input parsed, but the premise fails: this is not a counterexample.',
                      )
                    : m.valid
                      ? t(
                          '有效反例：前提真、结论假。请解释它推翻的全称断言。',
                          'Valid counterexample: true premise, false conclusion. Explain which universal assertion it refutes.',
                        )
                      : t(
                          '这个输入符合结论；它不是反例，也不能独自证明全称命题。',
                          'This input agrees with the conclusion. It is not a counterexample or a proof of the universal claim.',
                        )
              }
            />
          </p>
          {m.parsed && (
            <DataTable
              mode={mode}
              headers={[
                t('前提成立', 'Premise holds'),
                t('结论左侧', 'Conclusion left'),
                t('结论右侧', 'Conclusion right'),
                t('结论相等', 'Conclusion equality'),
              ]}
              rows={[
                [
                  m.premise ? '✓' : '×',
                  m.left!,
                  m.right!,
                  m.conclusion ? '✓' : '×',
                ],
              ]}
            />
          )}
        </>
      )}
      <Audit mode={mode}>
        <WitnessFigure mode={mode} />
        <p>
          <Text
            mode={mode}
            text={t(
              '平方差为2ab；x²=x的解是0与1；有限表格函数差为x(x−1)(x−2)。这些结构帮助选择新输入，但提交你自己的数值并检查前提。',
              'The square-sum difference is 2ab; roots of x²=x are zero and one; the finite-table difference is x(x−1)(x−2). Use structure to choose a new input, then verify its premise.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function Report({ mode }: { mode: LanguageMode }) {
  const [plan, setPlan] = useState<WorkshopPlan>('A'),
    [range, setRange] = useState('18-20'),
    [budget, setBudget] = useState(50),
    [low, high] = range.split('-').map(Number) as [number, number],
    m = workshopSensitivity(plan, low, high, budget);
  return (
    <>
      <p>
        <Text mode={mode} text={scenarioRules} />
      </p>
      <p>
        <Text
          mode={mode}
          text={t(
            '本报告明确假设：人数在所选闭区间内取整数；每人用量q只能是3或4张；无额外损耗和收费。逐一枚举全部(n,q)，不赋予概率。',
            'Explicit report assumptions: attendance is every integer in the selected closed interval; cards each q is either three or four; no extra losses or charges. Enumerate all (n,q) without assigning probabilities.',
          )}
        />
      </p>
      <div className="math-concept-lab">
        <Select
          mode={mode}
          name={t('计价方案', 'Price plan')}
          value={plan}
          options={['A', 'B'].map((v) => [v, t(v, v)])}
          change={(v) => setPlan(v as WorkshopPlan)}
        />
        <Select
          mode={mode}
          name={t('人数假设范围', 'Assumed attendance range')}
          value={range}
          options={['18-20', '16-20', '0-20', '18-22'].map((v) => [v, t(v, v)])}
          change={setRange}
        />
        <Select
          mode={mode}
          name={t('预算筹码', 'Budget credits')}
          value={String(budget)}
          options={opts([49, 50, 63, 70, 73, 200])}
          change={(v) => setBudget(Number(v))}
        />
      </div>
      <Predict
        key={`base${m.base.cost}`}
        mode={mode}
        name={t(
          '预测基准费用（下界人数、每人3张）',
          'Predict baseline cost (lowest attendance, three each)',
        )}
        answer={numeric(m.base.cost)}
        hint={packetHint}
      />
      <Predict
        key={`worst${m.worst}`}
        mode={mode}
        name={t(
          '预测假设内最高费用',
          'Predict maximum cost within assumptions',
        )}
        answer={numeric(m.worst)}
        hint={t(
          '检查人数上界、每人4张、整包取整；若人数为0用取消规则。',
          'Check upper attendance, four each and whole-packet rounding; apply cancellation at zero.',
        )}
      />
      <Predict
        key={`${plan}-${range}-${budget}`}
        mode={mode}
        name={t(
          '预测全部情景可行（valid/invalid）',
          'Predict feasibility throughout (valid/invalid)',
        )}
        answer={{
          kind: 'integration-verdict',
          value: m.robust ? 'valid' : 'invalid',
        }}
        hint={t(
          '每一行都必须同时满足预算与容量。',
          'Every row must satisfy both budget and capacity.',
        )}
      />
      <Audit mode={mode}>
        <DataTable
          mode={mode}
          headers={[
            t('人数n', 'People n'),
            t('每人张数q', 'Cards each q'),
            t('总需求', 'Demand'),
            t('包数', 'Packets'),
            t('筹码', 'Credits'),
            t('预算', 'Budget'),
            t('容量', 'Capacity'),
          ]}
          rows={m.scenarios.map((s) => [
            s.n,
            s.perPerson,
            s.demand,
            s.packets,
            s.cost,
            s.withinBudget ? '✓' : '×',
            s.withinCapacity ? '✓' : '×',
          ])}
        />
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `共${m.scenarios.length}个情景；基准${m.base.cost}，最高${m.worst}筹码。全部可行：${m.robust ? '是' : '否'}。容量超限：${m.overCapacity ? '有' : '无'}。`,
              `Across ${m.scenarios.length} scenarios: baseline ${m.base.cost}, maximum ${m.worst} credits. Feasible throughout: ${m.robust ? 'yes' : 'no'}. Capacity violations: ${m.overCapacity ? 'present' : 'none'}.`,
            )}
          />
        </p>
        <p>
          <Text
            mode={mode}
            text={t(
              '这是明确假设内的穷举，不是所有真实情况的保证，也不是置信界。每人5张、损耗、改价或额外收费都需重新计算。请在正式解释题中写完整报告，由家长核验。',
              'This exhausts explicit assumptions, not all real situations, and is not a confidence bound. Usage five, losses, repricing or extra charges require recalculation. Write the full report in the explanation task for parent review.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function ProblemSolvingLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'problem-decompose' ? (
        <Decompose mode={mode} />
      ) : kind === 'problem-represent' ? (
        <Represent mode={mode} />
      ) : kind === 'problem-boundaries' ? (
        <Boundaries mode={mode} />
      ) : kind === 'problem-counterexample' ? (
        <Counterexample mode={mode} />
      ) : (
        <Report mode={mode} />
      )}
    </section>
  );
}
export function ProblemSolvingHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'problem-decompose') return <DependencyFigure mode={mode} />;
  if (kind === 'problem-counterexample') return <WitnessFigure mode={mode} />;
  if (kind === 'problem-represent') return <CostFigure mode={mode} />;
  return (
    <PacketFigure mode={mode} n={kind === 'problem-boundaries' ? 4 : 18} />
  );
}
