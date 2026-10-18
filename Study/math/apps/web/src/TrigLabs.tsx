import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import {
  trigTriangle,
  trigTriangles,
  trigValues,
  roundTrig,
  inverseTrig,
  inverseTrigCases,
  treeHeight,
  slopeModel,
  type TrigFunction,
  type TrigReference,
} from './trigModels';
import {
  TrigTriangleView,
  TrigAngleView,
  TrigGraph,
  HeightView,
  SlopeView,
} from './TrigVisuals';
export type TrigLabKind = Extract<Lesson['lab'], `trig-${string}`>;
export const isTrigLab = (kind: Lesson['lab']): kind is TrigLabKind =>
  kind.startsWith('trig-');
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Task({
  mode,
  answer,
  prompt,
  name = t('我的三角函数结论', 'My trigonometry conclusion'),
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
        <Text
          mode={mode}
          text={t('核对三角函数结论', 'Check trigonometry conclusion')}
        />
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
                    '结论符合。另说明参照角、边的身份、度数制与模型前提；完整解释由家长核验。',
                    'The conclusion matches. Explain the reference angle, side roles, degree mode and model premises; a parent reviews the full reasoning.',
                  )
                : t(
                    '重核对/邻/斜边、所求函数、角度单位、指定小数位及水平/视线距离。精确题不以近似值替代，近似题按要求保留尾零。',
                    'Recheck opposite/adjacent/hypotenuse, the function, angle units, required decimal places and horizontal/sight distance. Keep exact answers exact and retain required trailing zeros when rounding.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Slider({
  mode,
  name,
  value,
  min,
  max,
  step = 1,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  step?: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={word(mode, name)}
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
  change: (n: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={word(mode, name)}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {word(mode, o.text)}
          </option>
        ))}
      </select>
    </label>
  );
}
function useView() {
  const [rotation, setRotation] = useState(0),
    [mirror, setMirror] = useState(false),
    [zoom, setZoom] = useState(1);
  return { rotation, setRotation, mirror, setMirror, zoom, setZoom };
}
function ViewControls({
  mode,
  view,
}: {
  mode: LanguageMode;
  view: ReturnType<typeof useView>;
}) {
  return (
    <div className="math-quadratic-controls">
      <button
        className="math-button"
        onClick={() => view.setRotation((view.rotation + 90) % 360)}
      >
        <Text mode={mode} text={t('仅旋转图形', 'Rotate the diagram only')} />
      </button>
      <button
        className="math-button"
        onClick={() => view.setMirror(!view.mirror)}
      >
        <Text mode={mode} text={t('仅反射图形', 'Reflect the diagram only')} />
      </button>
      <button
        className="math-button"
        onClick={() => view.setZoom(view.zoom === 1 ? 0.8 : 1)}
      >
        <Text
          mode={mode}
          text={t('仅改变显示缩放', 'Change display zoom only')}
        />
      </button>
    </div>
  );
}
function Reveal({
  mode,
  shown,
  setShown,
  text,
}: {
  mode: LanguageMode;
  shown: boolean;
  setShown: (n: boolean) => void;
  text: LocalizedText;
}) {
  return (
    <>
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('显示或隐藏比值核验', 'Show or hide ratio audit')}
        />
      </button>
      {shown && (
        <p
          role="status"
          aria-label={word(mode, t('三角函数核验', 'Trigonometry audit'))}
        >
          <Text mode={mode} text={text} />
        </p>
      )}
    </>
  );
}
const exact = (value: string): AnswerSpec => ({
  kind: 'radical',
  value,
  simplified: false,
});
const references = [
  { value: 'A', text: t('锐角A', 'Acute angle A') },
  { value: 'B', text: t('锐角B', 'Acute angle B') },
];
const triangles = trigTriangles.map((c, i) => ({
  value: String(i),
  text: t(`三角形${c.id}`, `Triangle ${c.id}`),
}));
function Sine({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [reference, setReference] = useState<TrigReference>('A'),
    [scale, setScale] = useState(1),
    [given, setGiven] = useState(true),
    [shown, setShown] = useState(false),
    view = useView(),
    c = trigTriangles[index]!,
    m = trigTriangle(c.adjacent, c.opposite, reference, String(scale)),
    key = `${index}:${reference}:${given}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先找给定直角C，再找参照锐角。斜边AB总在直角对面；对边与邻直角边随参照角交换。sinθ=对边/斜边。只统一改变长度倍率，不会改变同一锐角的正弦。',
            'Find the given right angle C, then the reference acute angle. Hypotenuse AB stays opposite the right angle; opposite and adjacent legs swap when the reference changes. sinθ=opposite/hypotenuse. Uniform length scaling preserves the sine of the same angle.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('正弦三角形', 'Sine triangle')}
        value={String(index)}
        options={triangles}
        change={(v) => {
          setIndex(Number(v));
          setShown(false);
        }}
      />
      <Select
        mode={mode}
        name={t('参照锐角', 'Reference acute angle')}
        value={reference}
        options={references}
        change={(v) => {
          setReference(v as TrigReference);
          setShown(false);
        }}
      />
      <Slider
        mode={mode}
        name={t('所有边统一倍率', 'Uniform scale for every side')}
        value={scale}
        min={1}
        max={3}
        change={setScale}
      />
      <label className="math-trig-toggle">
        <input
          type="checkbox"
          aria-label={word(
            mode,
            t('已给直角前提', 'Right-angle premise supplied'),
          )}
          checked={given}
          onChange={(e) => {
            setGiven(e.target.checked);
            setShown(false);
          }}
        />
        <Text
          mode={mode}
          text={t('已给直角前提', 'Right-angle premise supplied')}
        />
      </label>
      <ViewControls mode={mode} view={view} />
      <TrigTriangleView
        mode={mode}
        adjacent={c.adjacent}
        opposite={c.opposite}
        reference={reference}
        scale={String(scale)}
        right={given}
        showRoles={shown}
        {...view}
      />
      <Task
        key={key}
        mode={mode}
        answer={
          given
            ? exact(m.ratio('sin'))
            : { kind: 'proof-verdict', value: 'insufficient' }
        }
        prompt={
          given
            ? t(
                '求当前参照角的sin，给精确分数或根式，不附单位。',
                'Find the selected angle’s sine as an exact fraction or radical, without units.',
              )
            : t(
                '未给直角或边长，足以直接套直角三角函数边比吗？写sufficient/insufficient。',
                'Without a right angle or lengths, is the evidence sufficient for right-triangle trig ratios? Enter sufficient or insufficient.',
              )
        }
      />
      {given && (
        <>
          <Task
            key={`${key}:opposite`}
            name={t('对边的字母', 'Opposite side letters')}
            mode={mode}
            answer={{
              kind: 'geometry-code',
              value: m.roles.opposite,
              reversible: true,
            }}
            prompt={t(
              '写当前参照角对边的两个字母。',
              'Enter the two letters of the side opposite the selected angle.',
            )}
          />
          <Task
            key={`${key}:hypotenuse`}
            name={t('斜边的字母', 'Hypotenuse letters')}
            mode={mode}
            answer={{ kind: 'geometry-code', value: 'AB', reversible: true }}
            prompt={t(
              '写给定直角对面的斜边字母。',
              'Enter the hypotenuse letters, opposite the given right angle.',
            )}
          />
        </>
      )}
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={
          given
            ? t(
                `参照${reference}：O=${m.roles.opposite}，A=${m.roles.adjacent}，H=AB；sin=${m.ratio('sin')}。全边同乘${scale}，分子分母同时变化，角与比值不变。`,
                `For reference ${reference}: O=${m.roles.opposite}, A=${m.roles.adjacent}, H=AB; sin=${m.ratio('sin')}. Scaling every side by ${scale} changes numerator and denominator together, preserving angle and ratio.`,
              )
            : t(
                '缺少直角条件不能直接套SOH；如果另给足够边长可先用勾股逆定理证明，但本例没有给这些边长。',
                'Without the right-angle premise, SOH does not apply directly. Sufficient side data might establish a right angle by the converse of Pythagoras, but none are supplied here.',
              )
        }
      />
    </>
  );
}
function CosTan({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState('ratio'),
    [index, setIndex] = useState(0),
    [reference, setReference] = useState<TrigReference>('A'),
    [f, setF] = useState<TrigFunction>('cos'),
    [shown, setShown] = useState(false),
    view = useView(),
    c = kind === 'ratio' ? trigTriangles[index]! : trigTriangles[0]!,
    ref = kind === 'ratio' ? reference : 'A',
    m = trigTriangle(c.adjacent, c.opposite, ref),
    key = `${kind}:${index}:${ref}:${f}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            'cosθ=邻直角边/斜边，tanθ=对边/邻直角边。邻边指邻直角边，不把同样接触角的斜边混进来。先匹配边，再判断乘比值还是除比值。',
            'cosθ=adjacent leg/hypotenuse; tanθ=opposite/adjacent leg. “Adjacent” means the adjacent leg, not the hypotenuse that also touches the angle. Match the sides before deciding to multiply or divide by a ratio.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('余弦正切用途', 'Cosine-tangent use')}
        value={kind}
        change={(v) => {
          setKind(v);
          setShown(false);
        }}
        options={[
          { value: 'ratio', text: t('计算精确边比', 'Find an exact ratio') },
          {
            value: 'cos-side',
            text: t('已知cos求邻边', 'Use cosine to find an adjacent side'),
          },
          {
            value: 'tan-side',
            text: t(
              '已知tan反求邻边',
              'Use tangent to recover an adjacent side',
            ),
          },
        ]}
      />
      {kind === 'ratio' && (
        <>
          <Select
            mode={mode}
            name={t('边比三角形', 'Ratio triangle')}
            value={String(index)}
            options={triangles}
            change={(v) => {
              setIndex(Number(v));
              setShown(false);
            }}
          />
          <Select
            mode={mode}
            name={t('参照锐角', 'Reference acute angle')}
            value={reference}
            options={references}
            change={(v) => {
              setReference(v as TrigReference);
              setShown(false);
            }}
          />
          <Select
            mode={mode}
            name={t('所求比值函数', 'Requested ratio function')}
            value={f}
            change={(v) => {
              setF(v as TrigFunction);
              setShown(false);
            }}
            options={[
              { value: 'cos', text: t('余弦cos', 'Cosine cos') },
              { value: 'tan', text: t('正切tan', 'Tangent tan') },
            ]}
          />
        </>
      )}
      <ViewControls mode={mode} view={view} />
      {kind === 'ratio' ? (
        <TrigTriangleView
          mode={mode}
          adjacent={c.adjacent}
          opposite={c.opposite}
          reference={ref}
          showRoles={shown}
          {...view}
        />
      ) : (
        <>
          <p>
            {kind === 'cos-side'
              ? 'cosA=4/5; AB=10 cm; AC=?'
              : 'tanA=3/4; BC=6 cm; AC=?'}
          </p>
          <TrigTriangleView
            mode={mode}
            scale="2"
            unknown="AC"
            only={kind === 'cos-side' ? ['AB'] : ['BC']}
            showRoles={shown}
            {...view}
          />
        </>
      )}
      <Task
        key={key}
        mode={mode}
        answer={
          kind === 'ratio'
            ? exact(m.ratio(f))
            : { kind: 'number', value: '8', unit: 'cm' }
        }
        prompt={
          kind === 'ratio'
            ? t(
                `求参照角${ref}的${f}精确值，不附单位。`,
                `Find exact ${f} of reference angle ${ref}, without units.`,
              )
            : kind === 'cos-side'
              ? t(
                  '由AC/AB=4/5求AC，可附cm。',
                  'Use AC/AB=4/5 to find AC, optionally in cm.',
                )
              : t(
                  '由BC/AC=3/4反求AC，可附cm；不是再把6乘3/4。',
                  'Recover AC from BC/AC=3/4, optionally in cm; do not simply multiply six by 3/4.',
                )
        }
      />
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={
          kind === 'ratio'
            ? t(
                `O=${m.roles.opposite}，A=${m.roles.adjacent}，H=AB；cos=${m.ratio('cos')}，tan=${m.ratio('tan')}。`,
                `O=${m.roles.opposite}, A=${m.roles.adjacent}, H=AB; cos=${m.ratio('cos')}, tan=${m.ratio('tan')}.`,
              )
            : kind === 'cos-side'
              ? t(
                  'AC=AB cosA=10×4/5=8 cm；已知斜边求邻边用乘法。',
                  'AC=AB cosA=10×4/5=8 cm: multiply when recovering the adjacent side from a known hypotenuse.',
                )
              : t(
                  '6/AC=3/4，所以AC=6÷(3/4)=8 cm；这里未知量在分母，按原比例反求。',
                  '6/AC=3/4, so AC=6÷(3/4)=8 cm. The unknown is in the denominator; solve the original proportion.',
                )
        }
      />
    </>
  );
}
function Variation({ mode }: { mode: LanguageMode }) {
  const [degrees, setDegrees] = useState(30),
    [f, setF] = useState<TrigFunction>('sin'),
    [boundary, setBoundary] = useState(false),
    [shown, setShown] = useState(false),
    [zoom, setZoom] = useState(1),
    angle = boundary ? 90 : degrees,
    active = boundary ? 'tan' : f,
    m = trigValues(angle),
    value = m[active],
    key = `${angle}:${active}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '只在0<θ<90°的锐角直角三角形里比较：sin随θ增大，cos减小，tan增大且可超过1。图窗外不等于不存在；90°正切的零分母单独检查。',
            'Compare ordinary acute right triangles only for 0<θ<90°: sine increases, cosine decreases and tangent increases beyond one. Outside the graph window does not mean nonexistent; inspect the zero denominator at 90° separately.',
          )}
        />
      </p>
      {!boundary && (
        <>
          <Slider
            mode={mode}
            name={t('锐角θ：度', 'Acute θ in degrees')}
            value={degrees}
            min={5}
            max={85}
            step={5}
            change={(n) => {
              setDegrees(n);
              setShown(false);
            }}
          />
          <Select
            mode={mode}
            name={t('观察的三角函数', 'Trig function to inspect')}
            value={f}
            change={(v) => {
              setF(v as TrigFunction);
              setShown(false);
            }}
            options={(['sin', 'cos', 'tan'] as const).map((v) => ({
              value: v,
              text: t(v, v),
            }))}
          />
        </>
      )}
      <button
        className="math-button"
        onClick={() => {
          setBoundary(!boundary);
          setShown(false);
        }}
      >
        <Text
          mode={mode}
          text={
            boundary
              ? t('回到锐角范围', 'Return to the acute domain')
              : t('检查90度正切边界', 'Inspect tangent at 90 degrees')
          }
        />
      </button>
      <button
        className="math-button"
        onClick={() => setZoom(zoom === 1 ? 0.8 : 1)}
      >
        <Text
          mode={mode}
          text={t('仅改变三角形显示缩放', 'Change triangle display zoom only')}
        />
      </button>
      <TrigAngleView mode={mode} degrees={angle} shown={shown} zoom={zoom} />
      <TrigGraph mode={mode} degrees={angle} active={active} />
      <Task
        key={key}
        mode={mode}
        answer={
          boundary
            ? { kind: 'proof-verdict', value: 'insufficient' }
            : { kind: 'trig-rounded', value: roundTrig(value!, 4), places: 4 }
        }
        prompt={
          boundary
            ? t(
                '邻边为零，足以把tan90°算成有限实数吗？写sufficient/insufficient。',
                'With adjacent side zero, is division sufficient to give a finite real tan90°? Enter sufficient or insufficient.',
              )
            : t(
                `求${f}${degrees}°，四舍五入为恰好4位小数，不附单位。`,
                `Find ${f}${degrees}°, rounded to exactly four decimal places without units.`,
              )
        }
      />
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={
          boundary
            ? t(
                '正切为对边/邻边；邻边为零不可除。tan90°无定义，不能用浮点库给出的巨大有限数代替；退化图不是本课普通锐角三角形。',
                'Tangent is opposite/adjacent. Division by zero is undefined, so tan90° is not a huge finite floating-point value. The degenerate picture is not an ordinary acute triangle.',
              )
            : t(
                `sin≈${roundTrig(m.sin, 4)}，cos≈${roundTrig(m.cos, 4)}，tan≈${roundTrig(m.tan!, 4)}。比值无单位；题目指定4位小数，精确分数是另一种表示要求。`,
                `sin≈${roundTrig(m.sin, 4)}, cos≈${roundTrig(m.cos, 4)}, tan≈${roundTrig(m.tan!, 4)}. Ratios are dimensionless; this question requires four decimal places, a different representation from an exact fraction.`,
              )
        }
      />
    </>
  );
}
function Inverse({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [display, setDisplay] = useState('DEG'),
    [shown, setShown] = useState(false),
    [f, ratio] = inverseTrigCases[index]!,
    m = index === 5 ? null : inverseTrig(f, ratio),
    triangle =
      index === 3
        ? trigTriangles[4]!
        : index === 4
          ? trigTriangles[3]!
          : trigTriangles[0]!;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '已知边比反求角，用sin⁻¹/cos⁻¹/tan⁻¹的反函数键，不是取倒数。所求角度仍用度；计算器RAD显示必须转换，不能直接加°。sin和cos的锐角比须介于0与1之间。',
            'Use inverse sin/cos/tan to recover an angle, not reciprocals. The requested answer remains in degrees; a RAD display must be converted rather than merely given a degree symbol. Acute sine and cosine ratios must lie between zero and one.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('已知边比求角案例', 'Inverse-trig case')}
        value={String(index)}
        change={(v) => {
          setIndex(Number(v));
          setShown(false);
        }}
        options={inverseTrigCases.map(([f, r], i) => ({
          value: String(i),
          text: t(`${f}θ=${r}`, `${f}θ=${r}`),
        }))}
      />
      <Select
        mode={mode}
        name={t('计算器显示单位', 'Calculator display unit')}
        value={display}
        change={setDisplay}
        options={[
          { value: 'DEG', text: t('度数制DEG', 'Degrees DEG') },
          { value: 'RAD', text: t('弧度制RAD', 'Radians RAD') },
        ]}
      />
      {m ? (
        <TrigTriangleView
          mode={mode}
          adjacent={triangle.adjacent}
          opposite={triangle.opposite}
        />
      ) : (
        <p>
          <Text
            mode={mode}
            text={t(
              '6/5>1，不可能是普通锐角直角三角形的正弦；不画伪造的合法三角形。',
              '6/5>1 cannot be an acute right-triangle sine; no false valid triangle is drawn.',
            )}
          />
        </p>
      )}
      <Task
        key={index}
        mode={mode}
        answer={
          m
            ? {
                kind: 'trig-rounded',
                value: roundTrig(m.degrees, 1),
                places: 1,
                unit: '°',
              }
            : { kind: 'proof-verdict', value: 'insufficient' }
        }
        prompt={
          m
            ? t(
                '求θ的度数，四舍五入为恰好1位小数，可附°；显示单位切换不改变题意。',
                'Find θ in degrees to exactly one decimal place, optionally with °. Changing calculator display units does not change the requested quantity.',
              )
            : t(
                '给sinθ=6/5，足以得到合法锐角吗？写sufficient/insufficient。',
                'Is sinθ=6/5 sufficient to determine a valid acute angle? Enter sufficient or insufficient.',
              )
        }
      />
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={
          m
            ? t(
                `${f}⁻¹(${ratio})的角约${roundTrig(m.degrees, 1)}°；反函数是在锐角范围找对应角，不是1/${f}θ。`,
                `${f}⁻¹(${ratio}) gives approximately ${roundTrig(m.degrees, 1)}°. The inverse finds an angle in the acute domain, rather than 1/${f}θ.`,
              )
            : t(
                '正弦=对边/斜边，而斜边最长；锐角比严格小于1，6/5不满足。',
                'Sine is opposite/hypotenuse and the hypotenuse is longest; an acute ratio is strictly below one, excluding 6/5.',
              )
        }
      />
      {shown && m && (
        <p
          role="status"
          aria-label={word(
            mode,
            t('反函数计算器显示', 'Inverse calculator display'),
          )}
        >
          {display}: {roundTrig(display === 'DEG' ? m.degrees : m.radians, 4)}{' '}
          {display === 'DEG' ? '°' : 'rad'} ·{' '}
          <Text
            mode={mode}
            text={t(
              '显示单位不是题目单位',
              'Display units are not the requested units',
            )}
          />
        </p>
      )}
    </>
  );
}
function Applications({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [eye, setEye] = useState(1.5),
    [rise, setRise] = useState(3),
    [run, setRun] = useState(4),
    [base, setBase] = useState(0),
    [shown, setShown] = useState(false),
    [zoom, setZoom] = useState(1),
    slope = index === 3,
    missing = index === 4,
    kind = index === 2 ? 'sight' : 'horizontal',
    distance = index === 1 || index === 2 ? 10 : 12,
    degrees = index === 1 || index === 2 ? 30 : 45,
    m = treeHeight(distance, degrees, eye, kind, missing ? base : 0),
    s = slopeModel(String(rise), String(run)),
    key = `${index}:${eye}:${rise}:${run}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构模型先说明垂直目标、仰角单位、已知距离种类和基面关系。树高=高于仪器的部分+仪器高，仅在两处基面同高时直接相加。坡度百分数用竖升/水平距，不用斜长。',
            'For the fictional model, state verticality, angle units, distance type and ground-level relationship. Height equals rise above the instrument plus instrument height only when the base levels agree. Percentage grade uses rise/horizontal run, not inclined length.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('测高与坡度案例', 'Height-and-slope case')}
        value={String(index)}
        change={(v) => {
          setIndex(Number(v));
          setShown(false);
          setBase(0);
        }}
        options={[
          {
            value: '0',
            text: t('水平12 m，仰角45°', 'Horizontal 12 m, elevation 45°'),
          },
          {
            value: '1',
            text: t('水平10 m，仰角30°', 'Horizontal 10 m, elevation 30°'),
          },
          {
            value: '2',
            text: t('视线10 m，仰角30°', 'Sight 10 m, elevation 30°'),
          },
          {
            value: '3',
            text: t('坡度百分数与坡角', 'Percentage grade and slope angle'),
          },
          {
            value: '4',
            text: t('树基高差未知', 'Tree-base level difference unknown'),
          },
        ]}
      />
      {slope ? (
        <>
          <Slider
            mode={mode}
            name={t('竖直升高', 'Vertical rise')}
            value={rise}
            min={1}
            max={5}
            change={(n) => {
              setRise(n);
              setShown(false);
            }}
          />
          <Slider
            mode={mode}
            name={t('水平前进', 'Horizontal run')}
            value={run}
            min={1}
            max={8}
            change={(n) => {
              setRun(n);
              setShown(false);
            }}
          />
          <SlopeView mode={mode} rise={rise} run={run} zoom={zoom} />
        </>
      ) : (
        <>
          <Slider
            mode={mode}
            name={t('仪器离地高度', 'Instrument height above ground')}
            value={eye}
            min={0}
            max={2}
            step={0.5}
            change={(n) => {
              setEye(n);
              setShown(false);
            }}
          />
          <HeightView
            mode={mode}
            distance={distance}
            degrees={degrees}
            eye={eye}
            distanceKind={kind}
            baseElevation={missing ? base : 0}
            knownLevel={!missing}
            zoom={zoom}
          />
          {missing && (
            <button
              className="math-button"
              onClick={() => setBase(base === 0 ? 2 : 0)}
            >
              <Text
                mode={mode}
                text={t(
                  '仅显示另一种可能基面',
                  'Show another possible base level only',
                )}
              />
            </button>
          )}
        </>
      )}
      <button
        className="math-button"
        onClick={() => setZoom(zoom === 1 ? 0.8 : 1)}
      >
        <Text
          mode={mode}
          text={t('仅改变情境显示缩放', 'Change scenario display zoom only')}
        />
      </button>
      <Task
        key={key}
        mode={mode}
        answer={
          missing
            ? { kind: 'proof-verdict', value: 'insufficient' }
            : {
                kind: 'trig-rounded',
                value: roundTrig(slope ? s.percent : m.height, 1),
                places: 1,
                unit: slope ? '%' : 'm',
              }
        }
        prompt={
          missing
            ? t(
                '未给两处地面同高，足以唯一确定树高吗？写sufficient/insufficient。',
                'Without equal base levels, is the evidence sufficient for a unique tree height? Enter sufficient or insufficient.',
              )
            : slope
              ? t(
                  '求坡度百分数，恰好1位小数，可附%。不是坡角。',
                  'Find percentage grade to exactly one decimal place, optionally with %. This is not the slope angle.',
                )
              : t(
                  '求完整树高，恰好1位小数，可附m；包括仪器高。',
                  'Find the full tree height to exactly one decimal place, optionally with m, including instrument height.',
                )
        }
      />
      {slope && (
        <Task
          key={`${key}:angle`}
          name={t('坡角的度数', 'Slope angle in degrees')}
          mode={mode}
          answer={{
            kind: 'trig-rounded',
            value: roundTrig(s.degrees, 1),
            places: 1,
            unit: '°',
          }}
          prompt={t(
            '另求坡角，恰好1位小数；百分数不能直接加°。',
            'Separately find the slope angle to exactly one decimal place; a percentage does not become an angle by adding °.',
          )}
        />
      )}
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={
          missing
            ? t(
                `同一仰角和距离给顶点高于观测地面${roundTrig(m.top, 1)} m；树基可能在0或2 m，因此树高可为${roundTrig(m.top, 1)}或${roundTrig(m.top - 2, 1)} m，不能唯一确定。`,
                `The same angle and distance put the top ${roundTrig(m.top, 1)} m above observer ground. A base at zero or two metres gives heights ${roundTrig(m.top, 1)} or ${roundTrig(m.top - 2, 1)} m, so the height is not unique.`,
              )
            : slope
              ? t(
                  `坡度=${rise}/${run}×100%=${roundTrig(s.percent, 1)}%；坡角=tan⁻¹(${rise}/${run})≈${roundTrig(s.degrees, 1)}°。两者单位和数值含义不同。`,
                  `Grade=${rise}/${run}×100%=${roundTrig(s.percent, 1)}%; angle=tan⁻¹(${rise}/${run})≈${roundTrig(s.degrees, 1)}°. They are different quantities with different units.`,
                )
              : t(
                  `${kind === 'horizontal' ? '水平距用tan' : '视线距用sin'}，高于仪器部分≈${roundTrig(m.rise, 3)} m，加仪器高${eye} m，完整高度≈${roundTrig(m.height, 1)} m；中间不提前截断。`,
                  `${kind === 'horizontal' ? 'Use tan with horizontal distance' : 'Use sin with sight distance'}: rise≈${roundTrig(m.rise, 3)} m. Add instrument height ${eye} m for full height≈${roundTrig(m.height, 1)} m; retain extra digits in intermediate calculations.`,
                )
        }
      />
    </>
  );
}
export function TrigLab({
  kind,
  mode,
}: {
  kind: TrigLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-quadratic-lab math-trig-lab">
      {kind === 'trig-sine' ? (
        <Sine mode={mode} />
      ) : kind === 'trig-cos-tan' ? (
        <CosTan mode={mode} />
      ) : kind === 'trig-variation' ? (
        <Variation mode={mode} />
      ) : kind === 'trig-inverse' ? (
        <Inverse mode={mode} />
      ) : (
        <Applications mode={mode} />
      )}
    </section>
  );
}
export function TrigHookArt({
  kind,
  mode,
}: {
  kind: TrigLabKind;
  mode: LanguageMode;
}) {
  const hooks: Record<TrigLabKind, LocalizedText> = {
    'trig-sine': t(
      '三角形放大三倍，sin会放大三倍吗？',
      'If a triangle triples in size, does its sine triple?',
    ),
    'trig-cos-tan': t(
      '哪条邻边？斜边也接触角，为什么不算它？',
      'Which adjacent side? The hypotenuse also touches the angle, so why exclude it?',
    ),
    'trig-variation': t(
      '所有三角比都不能超过1吗？',
      'Must every trigonometric ratio stay below one?',
    ),
    'trig-inverse': t(
      'sin⁻¹是找角，还是把sin取倒数？',
      'Does sin⁻¹ find an angle or take a reciprocal?',
    ),
    'trig-height': t(
      '同样“10 m”，量水平距离和视线距离会得到相同树高吗？',
      'Does the same “10 m” give the same height when it measures horizontal or sight distance?',
    ),
  };
  return (
    <div className="math-quadratic-hook">
      <p>
        <Text mode={mode} text={hooks[kind]} />
      </p>
      <div aria-hidden="true">θ · O / A / H · ?</div>
    </div>
  );
}
