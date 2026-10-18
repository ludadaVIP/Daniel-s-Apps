import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { checkAnswer, t, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import {
  lineCircle,
  inscribedModel,
  tangentModel,
  tangentAngle,
  sectorExact,
  circleProofCases,
  auditCircleProof,
} from './circleGeometryModels';
import {
  ChordLineView,
  CentralAngleView,
  InscribedView,
  TangentsView,
  SectorGeometryView,
  CircleProofView,
} from './CircleGeometryVisuals';
export type CircleGeometryLabKind = Extract<Lesson['lab'], `cyclic-${string}`>;
export const isCircleGeometryLab = (
  kind: Lesson['lab'],
): kind is CircleGeometryLabKind => kind.startsWith('cyclic-');
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Task({
  mode,
  answer,
  prompt,
  name = t('我的圆几何结论', 'My circle-geometry conclusion'),
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
          text={t('核对圆几何结论', 'Check circle-geometry conclusion')}
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
                    '结论符合。请另说明同圆、所对弧、切点或对应依据；完整证明由家长核验。',
                    'The conclusion matches. Explain the common circle, intercepted arc, contact or correspondence; a parent reviews the full proof.',
                  )
                : t(
                    '重核前提、是否含顶点的弧、半径与直径、平方关系及单位；根式或π量保持精确。',
                    'Recheck premises, the arc excluding the vertex, radius versus diameter, squared relationships and units; keep radicals or pi quantities exact.',
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
  onChange,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
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
        onChange={(e) => onChange(Number(e.target.value))}
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
  onChange,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  options: { value: string; text: LocalizedText }[];
  onChange: (n: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={word(mode, name)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
function useCircleView() {
  const [rotation, setRotation] = useState(0),
    [zoom, setZoom] = useState(1);
  return { rotation, zoom, setRotation, setZoom };
}
function ViewControls({
  mode,
  view,
}: {
  mode: LanguageMode;
  view: ReturnType<typeof useCircleView>;
}) {
  return (
    <div className="math-quadratic-controls">
      <button
        className="math-button"
        onClick={() => view.setRotation((view.rotation + 90) % 360)}
      >
        <Text
          mode={mode}
          text={t('仅旋转整幅图', 'Rotate the entire diagram only')}
        />
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
          text={t('显示或隐藏依据核验', 'Show or hide premise audit')}
        />
      </button>
      {shown && (
        <p
          role="status"
          aria-label={word(
            mode,
            t('圆几何依据核验', 'Circle-geometry premise audit'),
          )}
        >
          <Text mode={mode} text={text} />
        </p>
      )}
    </>
  );
}
function Elements({ mode }: { mode: LanguageMode }) {
  const [part, setPart] = useState('line'),
    [distance, setDistance] = useState(3),
    [sweep, setSweep] = useState(120),
    [shown, setShown] = useState(false),
    view = useCircleView(),
    m = lineCircle('5', String(distance)),
    key = `${part}:${distance}:${sweep}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '弦连接圆上两点，直径是经过圆心的特殊弦；切线是与圆只有一个公共点的整条直线。圆心角顶点在O，半径OA=OB提供等腰结构。先区分这些对象，再计算。',
            'A chord joins two points on a circle; a diameter is a chord through the centre. A tangent is an infinite line meeting the circle at exactly one point. A central angle has vertex O, with equal radii OA=OB providing isosceles structure.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('圆要素案例', 'Circle-elements case')}
        value={part}
        onChange={(v) => {
          setPart(v);
          setShown(false);
        }}
        options={[
          {
            value: 'line',
            text: t('圆心距与交点', 'Centre distance and intersections'),
          },
          {
            value: 'central',
            text: t(
              '圆心角与等腰三角形',
              'Central angle and isosceles triangle',
            ),
          },
        ]}
      />
      <ViewControls mode={mode} view={view} />
      {part === 'line' ? (
        <>
          <Slider
            mode={mode}
            name={t(
              '直线到圆心的垂距',
              'Perpendicular line-to-centre distance',
            )}
            value={distance}
            min={0}
            max={7}
            onChange={(n) => {
              setDistance(n);
              setShown(false);
            }}
          />
          <ChordLineView
            mode={mode}
            distance={distance}
            {...view}
            shown={shown}
          />
          <Task
            key={key}
            mode={mode}
            answer={{ kind: 'circle-line', value: m.kind }}
            prompt={t(
              '这条整直线是割线、切线还是不相交？写secant/tangent/disjoint。',
              'Classify the infinite line as secant, tangent or disjoint.',
            )}
          />
          {m.chordSquare && (
            <Task
              key={`${key}:length`}
              name={t('弦AB的精确长度', 'Exact chord AB length')}
              mode={mode}
              answer={{
                kind: 'root-length',
                value: m.chord!,
                square: textR(m.chordSquare),
              }}
              prompt={t(
                '只写AB的精确长度数值，不附单位。OM⊥AB，先求半弦再加倍；d=0时是直径。',
                'Enter only the exact length of AB without units. OM⊥AB; find half the chord then double it. At d=0 the chord is a diameter.',
              )}
            />
          )}
        </>
      ) : (
        <>
          <Slider
            mode={mode}
            name={t('小圆心角θ', 'Minor central angle θ')}
            value={sweep}
            min={30}
            max={180}
            step={30}
            onChange={(n) => {
              setSweep(n);
              setShown(false);
            }}
          />
          <CentralAngleView mode={mode} sweep={sweep} {...view} shown={shown} />
          <Task
            key={key}
            mode={mode}
            answer={
              sweep === 180
                ? { kind: 'proof-verdict', value: 'insufficient' }
                : {
                    kind: 'number',
                    value: String((180 - sweep) / 2),
                    unit: '°',
                  }
            }
            prompt={
              sweep === 180
                ? t(
                    'O、A、B此时共线，足以组成非退化等腰三角形吗？写sufficient/insufficient。',
                    'O, A and B are collinear. Is this sufficient for a nondegenerate isosceles triangle? Enter sufficient or insufficient.',
                  )
                : t(
                    '求△OAB的一个底角，单位度。',
                    'Find one base angle of triangle OAB, in degrees.',
                  )
            }
          />
        </>
      )}
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={
          part === 'line'
            ? t(
                `d=${distance}与r=5比较；${m.kind === 'secant' ? `半弦²=25−${distance * distance}，AB=${m.chord} cm${distance === 0 ? '，经过O是直径' : ''}` : m.kind === 'tangent' ? '只有一个公共点，切点的半径垂直此线' : '没有公共点，不能把最近的点叫切点'}。`,
                `Compare d=${distance} with r=5; ${m.kind === 'secant' ? `half-chord squared=25−${distance * distance}, AB=${m.chord} cm${distance === 0 ? ', a diameter through O' : ''}` : m.kind === 'tangent' ? 'one common point, where its radius is perpendicular to the line' : 'no intersections, so the nearest point is not a contact'}.`,
              )
            : sweep === 180
              ? t(
                  'θ=180°是直径扫角，三点共线，不能继续把退化图叫三角形。',
                  'At θ=180° the endpoints form a diameter and the three points are collinear; do not call this a triangle.',
                )
              : t(
                  `OA=OB，两个底角相等；每个=(180−${sweep})/2=${(180 - sweep) / 2}°。`,
                  `OA=OB gives equal base angles, each (180−${sweep})/2=${(180 - sweep) / 2}°.`,
                )
        }
      />
    </>
  );
}
function Inscribed({ mode }: { mode: LanguageMode }) {
  const [sweep, setSweep] = useState(80),
    [side, setSide] = useState<'selected' | 'other'>('other'),
    [shown, setShown] = useState(false),
    view = useCircleView(),
    m = inscribedModel(sweep, side),
    key = `${sweep}:${side}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '不要先按“较小圆心角的一半”算。先找AB之间不含P的弧：当P换到弦另一侧，这条弧也换边。圆周角等于其所截弧度数的一半。',
            'Do not automatically halve the smaller central angle. First find the arc AB that excludes P. Moving P across the chord changes that arc. The inscribed angle is half its intercepted arc measure.',
          )}
        />
      </p>
      <Slider
        mode={mode}
        name={t('选定逆时针扫角', 'Selected counterclockwise sweep')}
        value={sweep}
        min={20}
        max={340}
        step={10}
        onChange={(n) => {
          setSweep(n);
          setShown(false);
        }}
      />
      <Select
        mode={mode}
        name={t('顶点P所在弧', 'Arc containing vertex P')}
        value={side}
        onChange={(v) => {
          setSide(v as typeof side);
          setShown(false);
        }}
        options={[
          { value: 'other', text: t('P在另一条弧上', 'P on the other arc') },
          {
            value: 'selected',
            text: t('P在选定弧上', 'P on the selected arc'),
          },
        ]}
      />
      <ViewControls mode={mode} view={view} />
      <InscribedView
        mode={mode}
        sweep={sweep}
        side={side}
        {...view}
        shown={shown}
      />
      <Task
        key={key}
        mode={mode}
        answer={{ kind: 'number', value: String(m.angle), unit: '°' }}
        prompt={t(
          '求∠APB，单位度。先口头指出不含P的弧。',
          'Find ∠APB in degrees, first pointing out the arc that excludes P.',
        )}
      />
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={t(
          `不含P的弧${m.intercepted}°，圆周角${m.intercepted}/2=${m.angle}°。${sweep === 180 ? '直径两侧都给90°。' : '换到另一侧时取另一条弧，两角之和180°；同侧同弧的不同顶点则给相等角。'}`,
          `The arc excluding P measures ${m.intercepted}°, giving ${m.intercepted}/2=${m.angle}°. ${sweep === 180 ? 'Both sides of a diameter give 90°.' : 'On the other side use the other arc: the angles sum to 180°. Vertices on the same side intercepting the same arc give equal angles.'}`,
        )}
      />
    </>
  );
}
const tangentCases = [
  { r: 3, d: 5 },
  { r: 5, d: 13 },
  { r: 5, d: 7 },
];
function Tangents({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState('0'),
    [central, setCentral] = useState(100),
    [shown, setShown] = useState(false),
    view = useCircleView(),
    c = tangentCases[Number(index)] ?? tangentCases[0]!,
    angle = index === '3',
    given = index !== '4',
    d = angle ? c.r / Math.cos((central * Math.PI) / 360) : c.d,
    m = tangentModel(String(c.r), String(c.d)),
    key = `${index}:${central}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '半径垂直切线必须发生在切点。由直角△OTP，PT²=OP²−r²；同一外点向同一圆的两切线段相等。若只给两条到圆的线段，不能偷加相切。',
            'The radius is perpendicular to the tangent at the contact. Right triangle OTP gives PT²=OP²−r²; two tangent segments from one external point to one circle are equal. Two segments ending on a circle alone do not establish tangency.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('切线案例', 'Tangent case')}
        value={index}
        onChange={(v) => {
          setIndex(v);
          setShown(false);
        }}
        options={[
          { value: '0', text: t('r=3，OP=5', 'r=3, OP=5') },
          { value: '1', text: t('r=5，OP=13', 'r=5, OP=13') },
          {
            value: '2',
            text: t('r=5，OP=7：精确根式', 'r=5, OP=7: exact radical'),
          },
          {
            value: '3',
            text: t('两个切线之间的角', 'Angle between two tangents'),
          },
          { value: '4', text: t('没有相切前提', 'Tangency premise missing') },
        ]}
      />
      {angle && (
        <Slider
          mode={mode}
          name={t('两切点的小圆心角', 'Minor central angle between contacts')}
          value={central}
          min={40}
          max={140}
          step={20}
          onChange={(n) => {
            setCentral(n);
            setShown(false);
          }}
        />
      )}
      <ViewControls mode={mode} view={view} />
      <TangentsView
        mode={mode}
        radius={c.r}
        distance={d}
        given={given}
        central={angle ? central : undefined}
        shown={shown}
        {...view}
      />
      <Task
        key={key}
        mode={mode}
        answer={
          !given
            ? { kind: 'proof-verdict', value: 'insufficient' }
            : angle
              ? {
                  kind: 'number',
                  value: String(tangentAngle(central)),
                  unit: '°',
                }
              : {
                  kind: 'root-length',
                  value: m.length,
                  square: textR(m.square),
                }
        }
        prompt={
          !given
            ? t(
                '未给相切，足以使用PT²=OP²−r²及PT=PS吗？写sufficient/insufficient。',
                'Without tangency, is the evidence sufficient for PT²=OP²−r² and PT=PS? Enter sufficient or insufficient.',
              )
            : angle
              ? t(
                  '求两条切线段夹角∠TPS，单位度。',
                  'Find ∠TPS between the two tangent segments, in degrees.',
                )
              : t(
                  '求PT的精确长度数值，不附单位。不能把OP当作半径，也不取负根。',
                  'Enter only the exact length of PT without units. OP is not a radius, and a length does not take a negative root.',
                )
        }
      />
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={
          !given
            ? t(
                '这些未标相切的线段无需垂直半径，也不必相等。需补切点条件，不能由外观补证明。',
                'Unmarked segments need not be perpendicular to radii or equal to one another. Supply contact premises rather than inferring them from appearance.',
              )
            : angle
              ? t(
                  `四边形OTPS内角和360°，两个切点各90°，所以∠TPS=180−${central}=${180 - central}°。`,
                  `In quadrilateral OTPS the two contact angles are 90°, so ∠TPS=360−90−90−${central}=${180 - central}°.`,
                )
              : t(
                  `PT²=${c.d}²−${c.r}²=${textR(m.square)}，PT=${m.length} cm。△OTP与△OSP有公共斜边OP及等半径，故两切线段相等。`,
                  `PT²=${c.d}²−${c.r}²=${textR(m.square)}, so PT=${m.length} cm. Right triangles OTP and OSP share hypotenuse OP and equal radii, so the tangent segments agree.`,
                )
        }
      />
    </>
  );
}
function Sector({ mode }: { mode: LanguageMode }) {
  const [radius, setRadius] = useState(6),
    [sweep, setSweep] = useState(60),
    [quantity, setQuantity] = useState('arc'),
    [shown, setShown] = useState(false),
    view = useCircleView(),
    m = sectorExact(String(radius), String(sweep)),
    key = `${radius}:${sweep}:${quantity}`,
    value =
      quantity === 'area' ? textR(m.areaCoefficient) : textR(m.arcCoefficient);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '扇形占整圆θ/360。弧长=(θ/360)·2πr，面积=(θ/360)·πr²；选定大弧时也用实际θ，不换成较小角。求周长还要加两条半径。',
            'A sector is θ/360 of a full turn. Arc length=(θ/360)·2πr; area=(θ/360)·πr². Use the stated sweep even for a major arc. Sector perimeter also includes two radii.',
          )}
        />
      </p>
      <Slider
        mode={mode}
        name={t('扇形半径', 'Sector radius')}
        value={radius}
        min={1}
        max={10}
        onChange={(n) => {
          setRadius(n);
          setShown(false);
        }}
      />
      <Slider
        mode={mode}
        name={t('扇形选定扫角', 'Selected sector sweep')}
        value={sweep}
        min={30}
        max={330}
        step={30}
        onChange={(n) => {
          setSweep(n);
          setShown(false);
        }}
      />
      <Select
        mode={mode}
        name={t('扇形所求量', 'Requested sector quantity')}
        value={quantity}
        onChange={(v) => {
          setQuantity(v);
          setShown(false);
        }}
        options={[
          { value: 'arc', text: t('弧长', 'Arc length') },
          { value: 'area', text: t('扇形面积', 'Sector area') },
        ]}
      />
      <ViewControls mode={mode} view={view} />
      <SectorGeometryView mode={mode} radius={radius} sweep={sweep} {...view} />
      <Task
        key={key}
        mode={mode}
        answer={{
          kind: 'pi-multiple',
          value: `${value}π`,
          coefficient: value,
          unit: quantity === 'area' ? 'cm²' : 'cm',
        }}
        prompt={
          quantity === 'area'
            ? t(
                '求选定扇形面积，保留π，可附cm²。不是弓形面积。',
                'Find the selected sector area, retaining π, optionally with cm². This is not circular-segment area.',
              )
            : t(
                '求选定弧长，保留π，可附cm。不是弦长或扇形完整周长。',
                'Find the selected arc length, retaining π, optionally with cm. This is neither chord length nor full sector perimeter.',
              )
        }
      />
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={t(
          `份额=${textR(m.fraction)}，弧长=${textR(m.arcCoefficient)}π cm，面积=${textR(m.areaCoefficient)}π cm²。此扇形完整周长另加2r=${2 * radius} cm；只有直线部分加两半径。`,
          `Fraction=${textR(m.fraction)}, arc=${textR(m.arcCoefficient)}π cm, area=${textR(m.areaCoefficient)}π cm². Add the straight boundary 2r=${2 * radius} cm for this sector's full perimeter.`,
        )}
      />
    </>
  );
}
function Proof({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [chain, setChain] = useState<string[]>([]),
    [feedback, setFeedback] = useState<LocalizedText | null>(null),
    [shown, setShown] = useState(false),
    [sketch, setSketch] = useState(''),
    view = useCircleView(),
    c = circleProofCases[index]!;
  function add(id: string) {
    const next = [...chain, id],
      a = auditCircleProof(index, next);
    if (!a.valid) {
      setFeedback(
        t(
          '这步缺少已建立的依据，或已经使用。先建立同圆、直角、相似或比例，不可倒用结论。',
          'This step lacks an established premise or was already used. Establish the common circle, right angle, similarity or proportion before using its conclusion.',
        ),
      );
      return;
    }
    setChain(next);
    setFeedback(
      t(
        '这一步的依赖已建立；继续说明几何理由，卡片顺序检查不代替完整证明。',
        'The step dependencies are established. Continue explaining the geometry; a card-order check does not replace a full proof.',
      ),
    );
  }
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先写已知，再按依赖添加理由。数值预测与证明卡片分开；文字证明仍由家长阅读。撤回一步可检查是否偷用了尚未证明的结论。',
            'State givens, then add steps in dependency order. Numerical prediction and proof cards are separate; a parent still reads the written proof. Undo a step to check whether a conclusion was used before it was justified.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('圆综合证明案例', 'Circle proof case')}
        value={String(index)}
        onChange={(v) => {
          setIndex(Number(v));
          setChain([]);
          setFeedback(null);
          setShown(false);
          setSketch('');
        }}
        options={[
          {
            value: '0',
            text: t('四点共圆：对角', 'Four concyclic points: opposite angles'),
          },
          {
            value: '1',
            text: t('直径、垂线与相似', 'Diameter, altitude and similarity'),
          },
          { value: '2', text: t('未给四点共圆', 'Concyclicity not given') },
        ]}
      />
      <ViewControls mode={mode} view={view} />
      <CircleProofView mode={mode} index={index} shown={shown} {...view} />
      <Task
        key={index}
        mode={mode}
        answer={
          index === 2
            ? { kind: 'proof-verdict', value: 'insufficient' }
            : {
                kind: 'number',
                value: index === 0 ? '110' : '15',
                unit: index === 0 ? '°' : 'cm',
              }
        }
        prompt={
          index === 2
            ? t(
                '只给∠A=70°，没有四点共圆前提，能保证∠C=110°吗？写sufficient/insufficient。',
                'Only A=70° is given, without concyclicity. Is it sufficient to guarantee C=110°? Enter sufficient or insufficient.',
              )
            : index === 0
              ? t(
                  '求对角C，单位度；先作自己的预测。',
                  'Predict opposite angle C in degrees.',
                )
              : t(
                  '求弦AB长度，单位cm；先作自己的预测。',
                  'Predict chord AB in cm.',
                )
        }
      />
      <div className="math-quadratic-controls">
        {c.steps.map((s) => (
          <button
            key={s.id}
            className="math-button secondary"
            disabled={chain.includes(s.id)}
            onClick={() => add(s.id)}
          >
            <Text mode={mode} text={s.label} />
          </button>
        ))}
      </div>
      <ol
        aria-label={word(
          mode,
          t('已建立的证明步骤', 'Established proof steps'),
        )}
      >
        {chain.map((id) => (
          <li key={id}>
            <Text mode={mode} text={c.steps.find((s) => s.id === id)!.label} />
          </li>
        ))}
      </ol>
      <button
        className="math-button"
        onClick={() => {
          setChain(chain.slice(0, -1));
          setFeedback(null);
        }}
      >
        <Text
          mode={mode}
          text={t('撤回最后一步', 'Undo the last proof step')}
        />
      </button>
      {feedback && (
        <p
          role="status"
          aria-label={word(
            mode,
            t('证明依赖反馈', 'Proof-dependency feedback'),
          )}
        >
          <Text mode={mode} text={feedback} />
        </p>
      )}
      <label>
        <Text
          mode={mode}
          text={t(
            '我的证明草稿：由家长阅读',
            'My proof sketch: for parent review',
          )}
        />
        <textarea
          aria-label={word(mode, t('我的证明草稿', 'My proof sketch'))}
          value={sketch}
          onChange={(e) => setSketch(e.target.value)}
        />
      </label>
      <Reveal
        mode={mode}
        shown={shown}
        setShown={setShown}
        text={
          index === 0
            ? t(
                '四点依次共圆时，对角截弧相加360°，各取一半得180°；C=180−70=110°。',
                'For four points in cyclic order, opposite intercepted arcs total 360°, so their half-angle sum is 180°; C=110°.',
              )
            : index === 1
              ? t(
                  '直径给∠ABC=90°，BD⊥AC给∠ADB=90°；共用A，△ADB∼△ABC，AD/AB=AB/AC，AB²=9×25=225，取正根15 cm。',
                  'The diameter gives ABC=90° and BD⊥AC gives ADB=90°. With common A, ADB∼ABC, so AD/AB=AB/AC, AB²=9×25=225 and positive length AB=15 cm.',
                )
              : t(
                  '缺少四点共圆，不可启用圆内接四边形定理；草图中移动C仍可保留A=70°而改变C角。',
                  'Without concyclicity the cyclic quadrilateral theorem is unavailable. Moving C can keep A=70° while changing angle C.',
                )
        }
      />
    </>
  );
}
export function CircleGeometryLab({
  kind,
  mode,
}: {
  kind: CircleGeometryLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-quadratic-lab math-cyclic-lab">
      {kind === 'cyclic-elements' ? (
        <Elements mode={mode} />
      ) : kind === 'cyclic-inscribed' ? (
        <Inscribed mode={mode} />
      ) : kind === 'cyclic-tangents' ? (
        <Tangents mode={mode} />
      ) : kind === 'cyclic-sector' ? (
        <Sector mode={mode} />
      ) : (
        <Proof mode={mode} />
      )}
    </section>
  );
}
export function CircleGeometryHookArt({
  kind,
  mode,
}: {
  kind: CircleGeometryLabKind;
  mode: LanguageMode;
}) {
  const hooks: Record<CircleGeometryLabKind, LocalizedText> = {
    'cyclic-elements': t(
      '直线离圆心多远时，只碰到圆一次？',
      'How far from the centre does a line meet a circle just once?',
    ),
    'cyclic-inscribed': t(
      '同一条弦两侧看到的角一定相等吗？',
      'Must angles viewing the same chord from opposite sides be equal?',
    ),
    'cyclic-tangents': t(
      '两条到圆上的线段，什么时候才能叫两切线？',
      'When do two segments to a circle count as two tangents?',
    ),
    'cyclic-sector': t(
      '同一弦的大弧和小弧，长度一样吗？',
      'Do the major and minor arcs of one chord have equal lengths?',
    ),
    'cyclic-proof': t(
      '能在证明相似之前先用对应边比例吗？',
      'May you use corresponding-side ratios before proving similarity?',
    ),
  };
  return (
    <div className="math-quadratic-hook">
      <p>
        <Text mode={mode} text={hooks[kind]} />
      </p>
      <div aria-hidden="true">◯ · ∠ · ?</div>
    </div>
  );
}
