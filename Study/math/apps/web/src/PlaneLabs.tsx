import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import {
  ObjectView,
  AngleView,
  IntersectionView,
  ParallelView,
  TriangleView,
} from './PlaneVisuals';
import {
  intersectionAngles,
  triangleAngles,
  triangleSides,
  thirdSideInterval,
  proofSelection,
  type ProofReason,
} from './planeModels';
export type PlaneLabKind = Extract<Lesson['lab'], `plane-${string}`>;
export const isPlaneLab = (kind: Lesson['lab']): kind is PlaneLabKind =>
  kind.startsWith('plane-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
const number = (value: number, angle = true): AnswerSpec => ({
  kind: 'number',
  value: String(value),
  formats: ['decimal', 'fraction'],
  ...(angle ? { unit: '°' as const } : {}),
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
        min={min}
        max={max}
        value={value}
        aria-label={label(mode, name)}
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
    [checked, setChecked] = useState(false),
    correct = checked && checkAnswer(input, answer) === true;
  return (
    <div
      className="math-plane-task"
      role="group"
      aria-label={label(mode, name)}
    >
      <label>
        <Text mode={mode} text={name} />
        <input
          type="text"
          aria-label={label(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对我的结果', 'Check my result')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('几何反馈', 'Geometry feedback'))}
        >
          <Text
            mode={mode}
            text={
              correct
                ? t(
                    '结果符合。请说清已知条件和使用的理由；数值正确不代替证明。',
                    'The result matches. Explain the given conditions and reasons; a correct result does not replace proof.',
                  )
                : t(
                    '再核对图中字母、角的位置与已知条件。不能只靠外观；边长要先检查能否围成三角形。',
                    'Recheck labels, angle positions and givens. Appearance is insufficient; side lengths must first form a triangle.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Objects({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<'line' | 'ray' | 'segment'>('ray'),
    [angle, setAngle] = useState(45),
    [rotation, setRotation] = useState(0),
    [length, setLength] = useState(110);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            'A、B 是位置标记，不一定是端点。看箭头表示的无限延伸方向，不把屏幕裁切处当端点。角由两条射线的方向决定，顶点必须写在角名中间。',
            'A and B mark positions, not necessarily endpoints. Arrows show indefinite extension; screen edges are not endpoints. Ray directions determine the angle, whose vertex goes in the middle of its name.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('观察对象', 'Object to inspect')} />
        <select
          aria-label={label(mode, t('观察对象', 'Object to inspect'))}
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
        >
          <option value="ray">{label(mode, t('射线 AB', 'Ray AB'))}</option>
          <option value="line">{label(mode, t('直线 AB', 'Line AB'))}</option>
          <option value="segment">
            {label(mode, t('线段 AB', 'Segment AB'))}
          </option>
        </select>
      </label>
      <ObjectView kind={kind} mode={mode} />
      <Task
        key={kind}
        mode={mode}
        name={t('有限端点有几个', 'How many endpoints?')}
        answer={number(kind === 'line' ? 0 : kind === 'ray' ? 1 : 2, false)}
      />
      <div className="math-plane-controls">
        <Range
          mode={mode}
          name={t('射线的指定转角（°）', 'Specified turn (°)')}
          value={angle}
          min={10}
          max={170}
          change={setAngle}
        />
        <Range
          mode={mode}
          name={t('整体转向（°）', 'Whole-figure rotation (°)')}
          value={rotation}
          min={-90}
          max={90}
          change={setRotation}
        />
        <Range
          mode={mode}
          name={t('画出的射线长度', 'Drawn arm length')}
          value={length}
          min={60}
          max={125}
          change={setLength}
        />
      </div>
      <AngleView
        angle={angle}
        rotation={rotation}
        length={length}
        mode={mode}
      />
      <Task
        key={angle}
        mode={mode}
        name={t('∠AOB 的度数', 'Measure of ∠AOB')}
        answer={number(angle)}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '先固定转角，单独改变边长和整体转向，角度应保持。长度滑块只改变画出的有限部分，不把射线变成有限线段。',
            'Keep the specified turn fixed while changing length and orientation; the angle stays fixed. The length control changes the finite drawing, not the indefinite ray.',
          )}
        />
      </p>
    </>
  );
}
function Intersect({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(58),
    [rotation, setRotation] = useState(0),
    values = intersectionAngles(a);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先找对顶或邻补关系，再求角度。两个角只因“共享顶点”不一定是对顶角；互补也不一定相邻，本图的邻补还需要反向射线。',
            'Identify vertically opposite or adjacent straight-angle pairs before calculating. A shared vertex alone does not make vertically opposite angles. Supplementary angles need not be adjacent; this diagram also supplies opposite rays.',
          )}
        />
      </p>
      <Range
        mode={mode}
        name={t('已知角 A（°）', 'Given angle A (°)')}
        value={a}
        min={20}
        max={160}
        change={setA}
      />
      <Range
        mode={mode}
        name={t('两直线整体转向（°）', 'Rotate both lines (°)')}
        value={rotation}
        min={-80}
        max={80}
        change={setRotation}
      />
      <IntersectionView angle={a} rotation={rotation} mode={mode} />
      <Task
        key={`C/${a}`}
        mode={mode}
        name={t('对顶角 C（°）', 'Vertically opposite C (°)')}
        answer={number(values[2])}
      />
      <Task
        key={`B/${a}`}
        mode={mode}
        name={t('邻补角 B（°）', 'Adjacent supplementary B (°)')}
        answer={number(values[1])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '解释链：A+B=180°，B+C=180°，从相同总量各减同一个 B 得 A=C。对顶角相等不能反过来说明任意两角只要相等就对顶。',
            'Reason chain: A+B=180°, B+C=180°. Subtract the same B from equal totals to obtain A=C. Equal measures alone do not make arbitrary angles vertically opposite.',
          )}
        />
      </p>
    </>
  );
}
function Parallel({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(65),
    [given, setGiven] = useState(true),
    [shape, setShape] = useState(1),
    offset = [-20, 20, 0][shape]!,
    bottom = given ? a : a - offset;
  return (
    <>
      <label>
        <Text
          mode={mode}
          text={t('题设平行条件', 'Parallel condition in the givens')}
        />
        <select
          aria-label={label(
            mode,
            t('题设平行条件', 'Parallel condition in the givens'),
          )}
          value={given ? 'yes' : 'no'}
          onChange={(e) => setGiven(e.target.value === 'yes')}
        >
          <option value="yes">{label(mode, t('已知 ℓ∥m', 'Given ℓ∥m'))}</option>
          <option value="no">
            {label(mode, t('没有给平行条件', 'Parallelism not given'))}
          </option>
        </select>
      </label>
      <Range
        mode={mode}
        name={t('已知角 A（°）', 'Given angle A (°)')}
        value={a}
        min={40}
        max={120}
        change={setA}
      />
      {!given && (
        <label>
          <Text
            mode={mode}
            text={t(
              '更换未标度数的下线外形',
              'Change the unmeasured lower line',
            )}
          />
          <select
            aria-label={label(
              mode,
              t('更换未标度数的下线外形', 'Change the unmeasured lower line'),
            )}
            value={shape}
            onChange={(e) => setShape(Number(e.target.value))}
          >
            {[0, 1, 2].map((n) => (
              <option key={n} value={n}>
                {label(mode, t(`外形 ${n + 1}`, `Shape ${n + 1}`))}
              </option>
            ))}
          </select>
        </label>
      )}
      <ParallelView top={a} bottom={bottom} parallel={given} mode={mode} />
      <Task
        key={`${a}/${given}`}
        mode={mode}
        name={t('仅凭题设能确定的 E', 'E determined by the givens alone')}
        answer={
          given ? number(a) : { kind: 'geometry-class', value: 'undetermined' }
        }
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '已知平行→同位角/内错角相等、同旁内角互补。反过来，有明确位置的一对同位角相等可以判平行；不能把“想证明平行”当作已知再套性质。无足够条件请写“无法确定”。',
            'Given parallel lines imply equal corresponding/alternate interior angles and supplementary co-interior angles. Conversely, a specified equal corresponding pair can establish parallelism. Do not assume the conclusion to prove it. Write “undetermined” when givens are insufficient.',
          )}
        />
      </p>
    </>
  );
}
function Sum({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(48),
    [b, setB] = useState(67),
    [proof, setProof] = useState(false);
  const changeA = (n: number) => {
    setA(n);
    setB(Math.min(b, 160 - n));
    setProof(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '本课是在平面欧氏几何中，非退化三角形三个内角和为 180°。本模型保持每角至少 20°；调 A 时必要会缩小 B，显示的新数据就是新题设。',
            'In plane Euclidean geometry, a nondegenerate triangle has interior sum 180°. This model keeps each angle at least 20°; increasing A may reduce B, and the displayed data become the new givens.',
          )}
        />
      </p>
      <div className="math-plane-controls">
        <Range
          mode={mode}
          name={t('内角 A（°）', 'Interior A (°)')}
          value={a}
          min={20}
          max={120}
          change={changeA}
        />
        <Range
          mode={mode}
          name={t('内角 B（°）', 'Interior B (°)')}
          value={b}
          min={20}
          max={160 - a}
          change={(n) => {
            setB(n);
            setProof(false);
          }}
        />
      </div>
      <TriangleView a={a} b={b} proof={proof} mode={mode} />
      <Task
        key={`${a}/${b}`}
        mode={mode}
        name={t('第三内角 C（°）', 'Third interior C (°)')}
        answer={number(180 - a - b)}
      />
      <button className="math-button" onClick={() => setProof(!proof)}>
        <Text
          mode={mode}
          text={
            proof
              ? t('收起平行辅助线', 'Hide the parallel auxiliary line')
              : t(
                  '过 C 作平行线并拼角',
                  'Draw a parallel through C and compare angle copies',
                )
          }
        />
      </button>
      <p>
        <Text
          mode={mode}
          text={t(
            '剪拼和测量支持猜想；理由是平行线内错角与平角。三角形外角等于不相邻的两个内角之和，不能把外角再计入三个内角。',
            'Measuring and rearranging support a conjecture; alternate interior angles and a straight angle justify it. An exterior angle equals the two non-adjacent interior angles, rather than being an extra interior angle.',
          )}
        />
      </p>
    </>
  );
}
function Classify({ mode }: { mode: LanguageMode }) {
  const [axis, setAxis] = useState<'side' | 'angle'>('side'),
    [sides, setSides] = useState([3, 4, 5]),
    [a, setA] = useState(55),
    [b, setB] = useState(45),
    m = triangleSides(sides[0]!, sides[1]!, sides[2]!),
    angles = triangleAngles(a, b),
    key = `${axis}/${sides}/${a}/${b}`,
    interval = thirdSideInterval(sides[0]!, sides[1]!);
  return (
    <>
      <label>
        <Text mode={mode} text={t('分类依据', 'Classification basis')} />
        <select
          aria-label={label(mode, t('分类依据', 'Classification basis'))}
          value={axis}
          onChange={(e) => setAxis(e.target.value as typeof axis)}
        >
          <option value="side">
            {label(
              mode,
              t('按边，写最具体名称', 'By sides: most specific name'),
            )}
          </option>
          <option value="angle">{label(mode, t('按角', 'By angles'))}</option>
        </select>
      </label>
      {axis === 'side' ? (
        <>
          <div className="math-plane-controls">
            {sides.map((s, i) => (
              <Range
                key={i}
                mode={mode}
                name={t(`边 ${'abc'[i]}（cm）`, `Side ${'abc'[i]} (cm)`)}
                value={s}
                min={1}
                max={12}
                change={(n) => setSides(sides.map((v, j) => (j === i ? n : v)))}
              />
            ))}
          </div>
          {m.valid ? (
            <TriangleView
              a={m.angles[0]}
              b={m.angles[1]}
              sides={sides}
              mode={mode}
            />
          ) : (
            <figure className="math-plane-figure">
              <svg
                viewBox="0 0 440 170"
                role="img"
                aria-label={label(
                  mode,
                  t(
                    '不能围成三角形的三根线段',
                    'Three segments that cannot close a triangle',
                  ),
                )}
              >
                {sides.map((s, i) => (
                  <g key={i}>
                    <line
                      data-rod-length={s}
                      x1="60"
                      y1={35 + i * 50}
                      x2={60 + s * 26}
                      y2={35 + i * 50}
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <text x="12" y={40 + i * 50}>
                      {s}
                    </text>
                  </g>
                ))}
              </svg>
              <figcaption>
                <Text
                  mode={mode}
                  text={t(
                    '较短两边之和不大于最长边，不能围成非退化三角形；没有画一个假三角形。',
                    'The shorter pair does not exceed the longest side, so no nondegenerate triangle closes; no false triangle is drawn.',
                  )}
                />
              </figcaption>
            </figure>
          )}
          <p>
            <Text
              mode={mode}
              text={t(
                `固定前两边时，第三边必须严格满足 ${interval.lower}<c<${interval.upper} cm，两端不取。按边先判断能否成形，再写等边、等腰或不等边中最具体的名称。`,
                `With the first two sides fixed, the third must satisfy the strict interval ${interval.lower}<c<${interval.upper} cm, excluding both endpoints. First test existence, then give the most specific side name: equilateral, isosceles or scalene.`,
              )}
            />
          </p>
        </>
      ) : (
        <>
          <Range
            mode={mode}
            name={t('内角 A（°）', 'Interior A (°)')}
            value={a}
            min={20}
            max={120}
            change={(n) => {
              setA(n);
              setB(Math.min(b, 160 - n));
            }}
          />
          <Range
            mode={mode}
            name={t('内角 B（°）', 'Interior B (°)')}
            value={b}
            min={20}
            max={160 - a}
            change={setB}
          />
          <TriangleView a={a} b={b} mode={mode} />
          <p>
            <Text
              mode={mode}
              text={t(
                '先用内角和求第三角，再看最大角：全小于 90° 为锐角，有一个 90° 为直角，有一个大于 90° 为钝角。',
                'Find the third angle using the sum, then inspect the largest: all below 90° is acute, one 90° is right, and one above 90° is obtuse.',
              )}
            />
          </p>
        </>
      )}
      <Task
        key={key}
        mode={mode}
        name={t(
          '我的分类（不能成形也要说明）',
          'My classification (or impossible)',
        )}
        answer={{
          kind: 'geometry-class',
          value: axis === 'side' ? m.kind : angles.kind,
        }}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '等腰按“至少两边相等”定义，所以等边是等腰的特殊情形；本题要求最具体名称。按边和按角是两个方向，同一三角形可同时是等腰与直角；只凭边长相等不证明直角。',
            'Isosceles means at least two equal sides, so equilateral is a special case; this task asks for the most specific name. Side and angle classifications are separate: a triangle can be both isosceles and right, and equal sides alone do not prove a right angle.',
          )}
        />
      </p>
    </>
  );
}
const reasonNames: Record<ProofReason, LocalizedText> = {
  straight: t(
    '反向射线构成平角，邻角和 180°',
    'Opposite rays form a straight angle; adjacent sum 180°',
  ),
  subtract: t(
    '从相等量中减同一量',
    'Subtract the same quantity from equal quantities',
  ),
  parallel: t(
    '已知平行，指定同位角相等',
    'Given parallel lines, the specified corresponding angles are equal',
  ),
  insufficient: t(
    '没有给足够条件，结论不能确定',
    'Insufficient givens: the conclusion cannot be determined',
  ),
  triangle: t(
    '非退化平面三角形内角和 180°',
    'A nondegenerate plane triangle has interior sum 180°',
  ),
  appearance: t('图上看起来相等或平行', 'It looks equal or parallel'),
  vertical: t(
    '同一交点的对顶角相等',
    'Vertically opposite angles at the same intersection are equal',
  ),
};
const caseCopy: LocalizedText[] = [
  t(
    '两直线相交，A/B 与 B/C 各构成邻补角。请用平角和相等量相减推导 A=C，不直接引用待解释的对顶角定理。',
    'Two lines intersect; A/B and B/C are adjacent supplementary pairs. Derive A=C using straight angles and subtraction, without citing the vertically opposite theorem being explained.',
  ),
  t(
    '已知 ℓ∥m，A/E 是指定同位角。证明 A=E。',
    'Given ℓ∥m, A/E are corresponding angles. Establish A=E.',
  ),
  t(
    '题目没有平行记号或其他条件，只有外形相近的两线，想断言 A=E。条件足够吗？',
    'No parallel marks or other conditions are given, only two similarly drawn lines. Is there enough information to claim A=E?',
  ),
  t(
    '已知 A/B/C 是一个非退化平面三角形的三个内角，求和关系；本案例可引用已学三角形内角和定理。',
    'A/B/C are the three interior angles of a nondegenerate plane triangle. State their sum using the previously established triangle-sum theorem.',
  ),
];
function Reasons({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [selected, setSelected] = useState<ProofReason[]>([]),
    [checked, setChecked] = useState(false),
    [notes, setNotes] = useState(''),
    [reviewed, setReviewed] = useState(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '完整说明包含：已知什么→由什么理由得到哪条关系→怎样推出结论。依据勾选只能核对可用规则，不能自动证明你的整段文字。',
            'An explanation links givens, a reason, the resulting relationship and the conclusion. Selecting usable reasons cannot automatically verify a written proof.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('推理案例', 'Reasoning case')} />
        <select
          aria-label={label(mode, t('推理案例', 'Reasoning case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setSelected([]);
            setChecked(false);
            setNotes('');
            setReviewed(false);
          }}
        >
          {caseCopy.map((_, i) => (
            <option key={i} value={i}>
              {label(mode, t(`案例 ${i + 1}`, `Case ${i + 1}`))}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text mode={mode} text={caseCopy[index]!} />
      </p>
      {index === 0 ? (
        <IntersectionView angle={58} mode={mode} />
      ) : index === 1 || index === 2 ? (
        <ParallelView
          top={65}
          bottom={index === 1 ? 65 : 45}
          parallel={index === 1}
          mode={mode}
        />
      ) : (
        <TriangleView a={48} b={67} mode={mode} />
      )}
      <fieldset>
        <legend>
          <Text
            mode={mode}
            text={t(
              '选择本条推理直接需要的全部依据',
              'Select all reasons directly needed for this argument',
            )}
          />
        </legend>
        {(Object.keys(reasonNames) as ProofReason[]).map((r) => (
          <label className="math-plane-check" key={r}>
            <input
              type="checkbox"
              checked={selected.includes(r)}
              onChange={() => {
                setSelected(
                  selected.includes(r)
                    ? selected.filter((x) => x !== r)
                    : [...selected, r],
                );
                setChecked(false);
                setReviewed(false);
              }}
            />
            <Text mode={mode} text={reasonNames[r]} />
          </label>
        ))}
      </fieldset>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对可用依据', 'Check usable reasons')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('依据反馈', 'Reason feedback'))}
        >
          <Text
            mode={mode}
            text={
              proofSelection(index, selected)
                ? t(
                    '依据选择符合本条推理；现在逐条连接关系，文字仍需家长复核。',
                    'The selected reasons fit this argument. Link each relationship; a parent must still review the written reasoning.',
                  )
                : t(
                    '检查是否漏依据、循环论证或把外观当条件；只选本条推理直接需要的依据。',
                    'Check missing reasons, circular arguments and assumed appearances. Select only reasons directly needed here.',
                  )
            }
          />
        </p>
      )}
      <label>
        <Text
          mode={mode}
          text={t('我的已知—理由—结论链', 'My givens–reason–conclusion chain')}
        />
        <textarea
          aria-label={label(
            mode,
            t('我的已知—理由—结论链', 'My givens–reason–conclusion chain'),
          )}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setReviewed(false);
          }}
        />
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            '家长核对每条关系引用的角位置与条件、计算及结论；此处只记录本次工作台复核，正式课内解释另有学习记录。',
            'A parent checks each angle position, condition, calculation and conclusion. This workshop review is local to this exploration; formal reasoning has its separate lesson record.',
          )}
        />
      </p>
      <button
        className="math-button secondary"
        disabled={!notes.trim() || reviewed}
        onClick={() => setReviewed(true)}
      >
        <Text
          mode={mode}
          text={t('家长确认推理链合理', 'Parent confirms the reasoning chain')}
        />
      </button>
      {reviewed && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '本次工作台推理已由家长核对。',
              'This workshop reasoning was reviewed by a parent.',
            )}
          />
        </p>
      )}
    </>
  );
}
export function PlaneLab({
  kind,
  mode,
}: {
  kind: PlaneLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-plane-lab">
      {kind === 'plane-objects' ? (
        <Objects mode={mode} />
      ) : kind === 'plane-intersect' ? (
        <Intersect mode={mode} />
      ) : kind === 'plane-parallel' ? (
        <Parallel mode={mode} />
      ) : kind === 'plane-sum' ? (
        <Sum mode={mode} />
      ) : kind === 'plane-classify' ? (
        <Classify mode={mode} />
      ) : (
        <Reasons mode={mode} />
      )}
    </div>
  );
}
export function PlaneHookArt({
  kind,
  mode,
}: {
  kind: PlaneLabKind;
  mode: LanguageMode;
}) {
  const text = {
    'plane-objects': '∠AOB · O → ?',
    'plane-intersect': 'A + B = 180° · C = ?',
    'plane-parallel': 'ℓ ∥ m ? · A = E ?',
    'plane-sum': 'A + B + C = ?',
    'plane-classify': 'a + b > c ? · MAX ∠ ?',
    'plane-reasons': 'GIVEN → REASON → ?',
  };
  return (
    <div className="math-plane-hook">
      <strong>{text[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '观察 → 核条件 → 给理由',
            'Observe → check conditions → give reasons',
          )}
        />
      </p>
    </div>
  );
}
