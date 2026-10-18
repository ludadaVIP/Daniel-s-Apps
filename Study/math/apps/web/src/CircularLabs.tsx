import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { rational, textR, mulR } from './algebraModels';
import { readRational } from './rationalModels';
import {
  angleText,
  degreeToPi,
  circularAt,
  circularNumber,
  waveModel,
  circularSolutions,
  solutionText,
  type CircularFamily,
  type WaveParams,
} from './circularModels';
import { CircularArt, WavePlot, numericPi } from './CircularVisuals';
export type CircularLabKind = Extract<Lesson['lab'], `circular-${string}`>;
export const isCircularLab = (kind: Lesson['lab']): kind is CircularLabKind =>
  kind.startsWith('circular-');
const word = (mode: LanguageMode, v: LocalizedText) =>
  mode === 'en' ? v.en : v.zh;
const num = (value: string): AnswerSpec => ({ kind: 'number', value });
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
        {options.map(([v, label]) => (
          <option key={v} value={v}>
            {word(mode, label)}
          </option>
        ))}
      </select>
    </label>
  );
}
const options = (values: string[]) =>
  values.map((v): [string, LocalizedText] => [v, t(v, v)]);
function Task({
  mode,
  name,
  answer,
  hint,
  solution,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  hint: LocalizedText;
  solution: LocalizedText;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false),
    [show, setShow] = useState(false),
    correct = checkAnswer(input, answer);
  return (
    <div className="math-concept-task">
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={word(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
            setShow(false);
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
              correct
                ? t(
                    '预测符合。再解释角的单位、坐标、原域或完整分支。',
                    'The prediction matches. Explain the angle unit, coordinate, original domain or complete branches.',
                  )
                : hint
            }
          />
        </p>
      )}
      {checked && !correct && (
        <button className="math-button" onClick={() => setShow(true)}>
          <Text mode={mode} text={t('查看推导', 'Reveal derivation')} />
        </button>
      )}
      {show && (
        <p>
          <Text mode={mode} text={solution} />
        </p>
      )}
    </div>
  );
}
function Toggle({
  mode,
  show,
  change,
  name,
}: {
  mode: LanguageMode;
  show: boolean;
  change: () => void;
  name: LocalizedText;
}) {
  return (
    <button className="math-button" aria-expanded={show} onClick={change}>
      <Text mode={mode} text={name} />
    </button>
  );
}
function AngleSlider({
  mode,
  tick,
  setTick,
}: {
  mode: LanguageMode;
  tick: number;
  setTick: (n: number) => void;
}) {
  const a = rational(BigInt(tick), 12n);
  return (
    <label>
      <Text mode={mode} text={t('有向角', 'Directed angle')} />
      <input
        aria-label={word(mode, t('有向角', 'Directed angle'))}
        type="range"
        min="-24"
        max="24"
        step="1"
        value={tick}
        onChange={(e) => setTick(Number(e.target.value))}
      />
      <output>
        {tick * 15}° = {angleText(a)} rad
      </output>
    </label>
  );
}
function RadianLab({ mode }: { mode: LanguageMode }) {
  const [degrees, setDegrees] = useState('150'),
    [radius, setRadius] = useState('2'),
    [show, setShow] = useState(false),
    a = degreeToPi(degrees),
    arc = mulR(rational(a[0] < 0n ? -a[0] : a[0], a[1]), readRational(radius));
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '弧度数是有向弧量与半径之比。先用π rad=180°换算；换半径不改角。弧长本身是非负的累计长度。',
            'Radian measure is directed arc measure divided by radius. Convert with π rad=180°; changing radius preserves the angle. Arc length itself is nonnegative travelled length.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('角度（度）', 'Angle in degrees')}
        value={degrees}
        change={(v) => {
          setDegrees(v);
          setShow(false);
        }}
        options={options([
          '-450',
          '-180',
          '-90',
          '0',
          '30',
          '45',
          '60',
          '90',
          '150',
          '180',
          '360',
          '450',
        ])}
      />
      <Select
        mode={mode}
        name={t('半径（cm）', 'Radius in cm')}
        value={radius}
        change={setRadius}
        options={options(['1', '2', '3'])}
      />
      <Task
        key={`angle/${degrees}`}
        mode={mode}
        name={t('预测弧度（用pi）', 'Predict radians (use pi)')}
        answer={{ kind: 'radian', coefficient: textR(a), value: angleText(a) }}
        hint={t(
          '乘π/180，保留负号与整周。小数π近似不作确切换算。',
          'Multiply by π/180, retaining sign and full turns. Decimal approximations to π are not exact conversions.',
        )}
        solution={t(`θ=${angleText(a)} rad。`, `θ=${angleText(a)} rad.`)}
      />
      <Task
        key={`arc/${degrees}/${radius}`}
        mode={mode}
        name={t(
          '预测累计弧长（cm，用pi）',
          'Predict travelled arc length (cm, use pi)',
        )}
        answer={{
          kind: 'pi-multiple',
          coefficient: textR(arc),
          value: angleText(arc),
          unit: 'cm',
        }}
        hint={t(
          '长度取r|θ|；角为弧度。改变半径会改变弧长，却不改变弧度数。',
          'Length is r|θ| with θ in radians. Radius changes length but not the radian angle.',
        )}
        solution={t(
          `弧长${angleText(arc)} cm。`,
          `Arc length ${angleText(arc)} cm.`,
        )}
      />
      <CircularArt
        mode={mode}
        theta={circularNumber(a) * Math.PI}
        radius={Number(radius)}
        arc
      />
      <Toggle
        mode={mode}
        show={show}
        change={() => setShow(!show)}
        name={t('显示/隐藏换算依据', 'Show/hide conversion reasoning')}
      />
      {show && (
        <p>
          <Text
            mode={mode}
            text={t(
              `${degrees}×π/180=${angleText(a)}；s/r=|θ|，半径${radius}时弧长${angleText(arc)} cm。`,
              ` ${degrees}×π/180=${angleText(a)}; s/r=|θ|, with arc length ${angleText(arc)} cm at radius ${radius}.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function UnitLab({
  mode,
  graphs = false,
}: {
  mode: LanguageMode;
  graphs?: boolean;
}) {
  const [tick, setTick] = useState(graphs ? 6 : 8),
    [family, setFamily] = useState<'sin' | 'cos'>('sin'),
    [show, setShow] = useState(false),
    [wide, setWide] = useState(false),
    m = circularAt(textR(rational(BigInt(tick), 12n)));
  return (
    <>
      <AngleSlider mode={mode} tick={tick} setTick={setTick} />
      {graphs && (
        <Select
          mode={mode}
          name={t('读取函数', 'Read function')}
          value={family}
          change={(v) => setFamily(v as 'sin' | 'cos')}
          options={options(['sin', 'cos'])}
        />
      )}
      <CircularArt mode={mode} theta={m.radians} />
      {(graphs ? [family] : (['sin', 'cos', 'tan'] as CircularFamily[])).map(
        (f) => (
          <Task
            key={`${tick}/${f}`}
            mode={mode}
            name={t(`预测${f}θ`, `Predict ${f}θ`)}
            answer={{ kind: 'circle-trig', value: m[f] ?? 'undefined' }}
            hint={t(
              'sin读纵坐标，cos读横坐标，tan先核分母非零；无定义写undefined，根式可用sqrt。',
              'Sine reads vertical, cosine horizontal; check a nonzero denominator for tangent. Use undefined or an exact sqrt expression.',
            )}
            solution={t(
              `${f}θ=${m[f] ?? '无定义'}。`,
              `${f}θ=${m[f] ?? 'undefined'}.`,
            )}
          />
        ),
      )}
      <Toggle
        mode={mode}
        show={show}
        change={() => setShow(!show)}
        name={t('显示/隐藏精确对照', 'Show/hide exact comparison')}
      />
      {show && (
        <div
          className="math-concept-table"
          tabIndex={0}
          role="region"
          aria-label={word(mode, t('精确坐标表', 'Exact coordinate table'))}
        >
          <table>
            <thead>
              <tr>
                <th>θ / rad</th>
                <th>cosθ / x</th>
                <th>sinθ / y</th>
                <th>tanθ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{angleText(m.theta)}</td>
                <td>{m.cos}</td>
                <td>{m.sin}</td>
                <td>{m.tan ?? word(mode, t('无定义', 'undefined'))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {graphs && (
        <>
          <Toggle
            mode={mode}
            show={wide}
            change={() => setWide(!wide)}
            name={t('切换纵向图窗', 'Change vertical window')}
          />
          <WavePlot
            mode={mode}
            family={family}
            compare
            query={circularNumber(m.theta)}
            wide={wide}
          />
          <p>
            <Text
              mode={mode}
              text={t(
                '圆上读坐标，图上用角为横轴。两条基本曲线最小正周期都为2π；cos偶、sin奇。改变窗口或揭示数表不清除预测。',
                'Read a coordinate on the circle, then use its angle on the graph’s horizontal axis. Both basic curves have least positive period 2π; cosine is even and sine odd. Window and table changes preserve predictions.',
              )}
            />
          </p>
        </>
      )}
    </>
  );
}
function TransformLab({ mode }: { mode: LanguageMode }) {
  const [p, setP] = useState<WaveParams>({
      family: 'sin',
      a: '-2',
      b: '2',
      h: '1/4',
      d: '1',
    }),
    [x, setX] = useState('1/4'),
    [wide, setWide] = useState(false),
    m = waveModel(p, x),
    set = (name: keyof WaveParams, value: string) =>
      setP({ ...p, [name]: value });
  return (
    <>
      <p>
        y=({p.a}){p.family}(({p.b})(x−({angleText(readRational(p.h))})))+({p.d})
      </p>
      <Select
        mode={mode}
        name={t('基本函数', 'Base function')}
        value={p.family}
        change={(v) => set('family', v)}
        options={options(['sin', 'cos'])}
      />
      {(
        [
          [
            'a',
            t('外部倍率A', 'External scale A'),
            ['-3', '-2', '-1', '0', '1', '2', '3'],
          ],
          ['b', t('内部倍率B', 'Inner scale B'), ['-2', '-1', '1', '2']],
          [
            'h',
            t('给定h（π的系数）', 'Stated h (coefficient of pi)'),
            ['-1/2', '0', '1/4', '1/2'],
          ],
          ['d', t('中线D', 'Midline D'), ['-2', '-1', '0', '1', '2']],
        ] as [keyof WaveParams, LocalizedText, string[]][]
      ).map(([name, label, vals]) => (
        <Select
          key={name}
          mode={mode}
          name={label}
          value={p[name]}
          change={(v) => set(name, v)}
          options={options(vals)}
        />
      ))}
      <Select
        mode={mode}
        name={t('查询x（π的系数）', 'Query x (coefficient of pi)')}
        value={x}
        change={setX}
        options={options(['0', '1/4', '1/2', '1'])}
      />
      <Task
        key={`amp/${p.a}`}
        mode={mode}
        name={t('预测振幅', 'Predict amplitude')}
        answer={num(textR(m.amplitude))}
        hint={t(
          '振幅是范围宽的一半，取|A|。',
          'Amplitude is half the range width: |A|.',
        )}
        solution={t(
          `振幅${textR(m.amplitude)}。`,
          `Amplitude ${textR(m.amplitude)}.`,
        )}
      />
      <Task
        key={`period/${p.a === '0'}/${p.b}`}
        mode={mode}
        name={t(
          '预测最小正周期（常数写undefined）',
          'Predict least positive period (constant: undefined)',
        )}
        answer={
          m.period
            ? {
                kind: 'radian',
                coefficient: textR(m.period),
                value: angleText(m.period),
              }
            : { kind: 'circle-trig', value: 'undefined' }
        }
        hint={t(
          'A非零时取2π/|B|；常数任意正T都是周期，没有最小正周期。',
          'For nonzero A use 2π/|B|. A constant has every positive period and no least positive one.',
        )}
        solution={t(
          m.period
            ? `最小正周期${angleText(m.period)}。`
            : 'A=0，图为常数；不存在最小正周期。',
          m.period
            ? `Least positive period ${angleText(m.period)}.`
            : 'A=0 gives a constant; no least positive period exists.',
        )}
      />
      <Task
        key={JSON.stringify([p, x])}
        mode={mode}
        name={t('预测当前输出', 'Predict current output')}
        answer={{ kind: 'circle-trig', value: m.output }}
        hint={t(
          '先算B(x−h)，再读基本函数值，最后乘A加D。',
          'Evaluate B(x−h), read the base function, then multiply by A and add D.',
        )}
        solution={t(
          `内部角${angleText(m.argument)}，输出${m.output}。`,
          `Inner angle ${angleText(m.argument)}, output ${m.output}.`,
        )}
      />
      <Toggle
        mode={mode}
        show={wide}
        change={() => setWide(!wide)}
        name={t('切换纵向图窗', 'Change vertical window')}
      />
      <WavePlot
        mode={mode}
        family={p.family}
        a={Number(p.a)}
        b={Number(p.b)}
        h={numericPi(p.h)}
        d={Number(p.d)}
        query={numericPi(x)}
        wide={wide}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '给定h是题式的参数；相位可有整周期等价表示。A=0时中线恒定，无法从图唯一识别B或h。',
            'The stated h is a formula parameter, with phase representations equivalent modulo full periods. When A=0, the graph cannot identify B or h uniquely.',
          )}
        />
      </p>
    </>
  );
}
function IdentityLab({ mode }: { mode: LanguageMode }) {
  const [task, setTask] = useState('c'),
    [quadrant, setQuadrant] = useState('II'),
    [show, setShow] = useState(false),
    left = task === 'c' ? '1-s^2' : task === 's' ? '1-c^2' : '(s+c)^2-2sc',
    right = task === 'c' ? 'c^2' : task === 's' ? 's^2' : '1',
    c = quadrant === 'I' ? '4/5' : '-4/5';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '令s=sinθ、c=cosθ，单位圆给s²+c²=1。代数框只收次数不超过4的多项式；含分母的原域另由人工解释。',
            'Let s=sinθ and c=cosθ; the unit circle gives s²+c²=1. The algebra field accepts polynomials of degree at most four; original domains of quotients need a separate explanation.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('恒等式任务', 'Identity task')}
        value={task}
        change={setTask}
        options={[
          ['c', t('1−s²，只含c', '1−s² using only c')],
          ['s', t('1−c²，只含s', '1−c² using only s')],
          ['constant', t('(s+c)²−2sc，化为常数', '(s+c)²−2sc as a constant')],
        ]}
      />
      <p>{left}</p>
      <Task
        key={task}
        mode={mode}
        name={t('预测等值形式', 'Predict equivalent form')}
        answer={{
          kind: 'trig-identity',
          value: right,
          only: task as 's' | 'c' | 'constant',
        }}
        hint={t(
          '由平方和推导；还要完成题目要求的只含s、只含c或常数形式。数值试点不能证明恒等。',
          'Use the sum of squares and finish the requested s-only, c-only or constant form. Numerical samples cannot prove an identity.',
        )}
        solution={t(
          `按c²=1−s²代数消去，可得${right}。`,
          `Algebraic elimination with c²=1−s² gives ${right}.`,
        )}
      />
      <Select
        mode={mode}
        name={t('已知sinθ=3/5，选择象限', 'Given sinθ=3/5, choose quadrant')}
        value={quadrant}
        change={setQuadrant}
        options={options(['I', 'II'])}
      />
      <Task
        key={quadrant}
        mode={mode}
        name={t('预测带符号cosθ', 'Predict signed cosθ')}
        answer={{ kind: 'circle-trig', value: c }}
        hint={t(
          'cos²θ=16/25，主根4/5只是绝对值；再按象限定正负。',
          'cos²θ=16/25 and its principal root 4/5 is only the absolute value. Use the quadrant for the sign.',
        )}
        solution={t(
          `象限${quadrant}中cosθ=${c}。`,
          `In quadrant ${quadrant}, cosθ=${c}.`,
        )}
      />
      <CircularArt
        mode={mode}
        theta={Math.atan2(0.6, quadrant === 'I' ? 0.8 : -0.8)}
      />
      <Toggle
        mode={mode}
        show={show}
        change={() => setShow(!show)}
        name={t('显示/隐藏证明与条件', 'Show/hide proof and conditions')}
      />
      {show && (
        <p>
          <Text
            mode={mode}
            text={t(
              '任意单位圆点满足x²+y²=1，代入坐标即证平方和。除以cos²θ才得1+tan²θ=1/cos²θ，必须保留cosθ≠0。√(cos²θ)=|cosθ|，不能无条件删绝对值。',
              'Every unit-circle point satisfies x²+y²=1, proving the sum of squares. Dividing by cos²θ gives 1+tan²θ=1/cos²θ only when cosθ≠0. The principal √(cos²θ)=|cosθ|, so the absolute value cannot be dropped unconditionally.',
            )}
          />
        </p>
      )}
    </>
  );
}
function EquationLab({ mode }: { mode: LanguageMode }) {
  const [family, setFamily] = useState<CircularFamily>('sin'),
    [target, setTarget] = useState('1/2'),
    [b, setB] = useState('1'),
    [h, setH] = useState('0'),
    [interval, setInterval] = useState('half-open'),
    [show, setShow] = useState(false),
    [wide, setWide] = useState(false);
  const domain =
      interval === 'negative'
        ? { low: '-1', high: '1', lowClosed: true, highClosed: false }
        : {
            low: '0',
            high: '2',
            lowClosed: interval !== 'open-left',
            highClosed: interval !== 'half-open',
          },
    p = { family, target, b, h, ...domain },
    roots = circularSolutions(p),
    key = JSON.stringify(p);
  return (
    <>
      <Select
        mode={mode}
        name={t('方程函数', 'Equation function')}
        value={family}
        change={(v) => {
          setFamily(v as CircularFamily);
          setTarget(v === 'tan' ? '1' : '1/2');
          setShow(false);
        }}
        options={options(['sin', 'cos', 'tan'])}
      />
      <Select
        mode={mode}
        name={t('目标值', 'Target value')}
        value={target}
        change={(v) => {
          setTarget(v);
          setShow(false);
        }}
        options={options(
          family === 'tan'
            ? ['0', '1', '-1']
            : ['0', '1/2', '-1/2', '1', '-1', '2'],
        )}
      />
      <Select
        mode={mode}
        name={t('内部倍率', 'Inner multiplier')}
        value={b}
        change={(v) => {
          setB(v);
          setShow(false);
        }}
        options={options(['1', '2', '-1'])}
      />
      <Select
        mode={mode}
        name={t('相位参数（π的系数）', 'Phase parameter (coefficient of pi)')}
        value={h}
        change={(v) => {
          setH(v);
          setShow(false);
        }}
        options={options(['0', '1/2'])}
      />
      <Select
        mode={mode}
        name={t('原解区间', 'Original solution interval')}
        value={interval}
        change={(v) => {
          setInterval(v);
          setShow(false);
        }}
        options={[
          ['half-open', t('[0,2π)', '[0,2π)')],
          ['closed', t('[0,2π]', '[0,2π]')],
          ['open-left', t('(0,2π]', '(0,2π]')],
          ['negative', t('[−π,π)', '[−π,π)')],
        ]}
      />
      <p>
        {family}(({b})(x−({angleText(readRational(h))}))) = {target}
      </p>
      <Task
        key={key}
        mode={mode}
        name={t(
          '预测全部角（如{pi/6,5pi/6}）',
          'Predict all angles (e.g. {pi/6,5pi/6})',
        )}
        answer={{
          kind: 'radian-set',
          values: roots.map(textR),
          value: solutionText(roots),
        }}
        hint={t(
          '单位圆找全分支，加周期后反解内部角，最后筛原区间；空集写∅，不要只报主值或把同终边归并。',
          'Find all unit-circle branches, add periods, invert the inner angle and filter the original interval. Use ∅ for an empty set; do not give only a principal value or merge coterminal solutions.',
        )}
        solution={t(
          `原域筛选后的完整解集${solutionText(roots)}；逐一代回原式。`,
          `The complete set after original-domain filtering is ${solutionText(roots)}. Substitute every root into the original equation.`,
        )}
      />
      <Toggle
        mode={mode}
        show={show}
        change={() => setShow(!show)}
        name={t('显示/隐藏交点核验', 'Show/hide intersection audit')}
      />
      <Toggle
        mode={mode}
        show={wide}
        change={() => setWide(!wide)}
        name={t('切换纵向图窗', 'Change vertical window')}
      />
      {show && (
        <>
          <WavePlot
            mode={mode}
            family={family}
            b={Number(b)}
            h={numericPi(h)}
            target={Number(
              target.includes('/')
                ? Number(target.split('/')[0]) / Number(target.split('/')[1])
                : target,
            )}
            roots={roots.map(circularNumber)}
            domain={{
              ...domain,
              low: Number(domain.low),
              high: Number(domain.high),
            }}
            wide={wide}
          />
          <p>
            <Text
              mode={mode}
              text={t(
                `精确分支筛选：${solutionText(roots)}。端点只按原区间包含或排除；近似图不决定答案。`,
                `Exact branch filtering: ${solutionText(roots)}. Original bounds decide endpoint membership; the approximate plot does not decide the answer.`,
              )}
            />
          </p>
        </>
      )}
    </>
  );
}
export function CircularLab({
  kind,
  mode,
}: {
  kind: CircularLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'circular-radians' ? (
        <RadianLab mode={mode} />
      ) : kind === 'circular-unit' ? (
        <UnitLab mode={mode} />
      ) : kind === 'circular-graphs' ? (
        <UnitLab mode={mode} graphs />
      ) : kind === 'circular-transform' ? (
        <TransformLab mode={mode} />
      ) : kind === 'circular-identities' ? (
        <IdentityLab mode={mode} />
      ) : (
        <EquationLab mode={mode} />
      )}
    </div>
  );
}
export function CircularHookArt({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: CircularLabKind;
}) {
  if (kind === 'circular-transform')
    return <WavePlot mode={mode} a={3} b={2} h={0.5} d={4} wide />;
  if (kind === 'circular-equations')
    return (
      <WavePlot
        mode={mode}
        target={0.5}
        domain={{ low: 0, high: 2, lowClosed: true, highClosed: false }}
      />
    );
  if (kind === 'circular-graphs') return <WavePlot mode={mode} compare />;
  return (
    <CircularArt
      mode={mode}
      theta={
        kind === 'circular-identities'
          ? Math.atan2(0.6, -0.8)
          : kind === 'circular-radians'
            ? (Math.PI * 5) / 6
            : (Math.PI * 2) / 3
      }
    />
  );
}
