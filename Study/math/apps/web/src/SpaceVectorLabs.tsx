import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { textR, rational, mulR } from './algebraModels';
import { DataTable } from './DataModellingVisuals';
import {
  SpaceVectorFigure,
  spatialEquationText,
  type SpatialArrow,
} from './SpaceVectorVisuals';
import {
  vec3,
  vec3Text,
  zeroVec3,
  addVec3,
  subVec3,
  scaleVec3,
  midpointVec3,
  squareVec3,
  dotVec3,
  spatialAngle,
  spatialOperands,
  spatialPartners,
  anglePartners,
  spatialRelationCases,
  vectorLine3,
  vectorPlane3,
  vectorLinePlaneRelation,
  vectorLineRelation,
  vectorPlaneRelation,
  pointPlaneProjection,
  pointLineProjection,
  planeResidual3,
  spatialPlane,
  spatialDistanceLine,
  spatialDistancePoints,
  type Vec3,
} from './spaceVectorModels';
export type SpaceVectorLabKind = Extract<Lesson['lab'], `spatial-${string}`>;
export const isSpaceVectorLab = (
  kind: Lesson['lab'],
): kind is SpaceVectorLabKind => kind.startsWith('spatial-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
const num = (value: string): AnswerSpec => ({ kind: 'number', value });
const triple = (value: Vec3): AnswerSpec => ({
  kind: 'coordinate3',
  value: vec3Text(value),
});
const radical = (value: string): AnswerSpec => ({ kind: 'radical', value });
function Select({
  mode,
  name,
  value,
  values,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  values: [string, LocalizedText][];
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
        {values.map(([v, n]) => (
          <option key={v} value={v}>
            {word(mode, n)}
          </option>
        ))}
      </select>
    </label>
  );
}
const vectorOptions = (values: Vec3[]): [string, LocalizedText][] =>
  values.map((v, i) => [String(i), t(vec3Text(v), vec3Text(v))]);
function Prediction({
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
    [reveal, setReveal] = useState(false),
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
            setReveal(false);
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
                    '预测符合。请用分量、非零条件或垂直投影解释，不能只凭屏幕外观。',
                    'The prediction matches. Explain using components, nonzero conditions or perpendicular projection, rather than screen appearance.',
                  )
                : hint
            }
          />
        </p>
      )}
      {checked && !correct && (
        <button className="math-button" onClick={() => setReveal(!reveal)}>
          <Text mode={mode} text={t('查看推导', 'Reveal derivation')} />
        </button>
      )}
      {reveal && (
        <p>
          <Text mode={mode} text={solution} />
        </p>
      )}
    </div>
  );
}
function View({
  mode,
  view,
  setView,
  reveal,
  setReveal,
}: {
  mode: LanguageMode;
  view: number;
  setView: (n: number) => void;
  reveal: boolean;
  setReveal: (b: boolean) => void;
}) {
  return (
    <>
      <button className="math-button" onClick={() => setView(view ? 0 : 1)}>
        <Text mode={mode} text={t('换一个视角', 'Change camera')} />
      </button>
      <button
        className="math-button"
        aria-expanded={reveal}
        onClick={() => setReveal(!reveal)}
      >
        <Text mode={mode} text={t('显示/隐藏核验', 'Show/hide audit')} />
      </button>
    </>
  );
}
const caption = t(
  '箭头按真实三维起终点绘制，零向量用点而不给假方向。屏幕图是正投影，不能量读空间长度或角度；平面色块和直线片段只是无限对象的显示窗口。换视角不改坐标或关系。',
  'Arrows use actual 3D tails and heads; zero vectors use points without invented direction. This is an orthographic projection, so screen lengths and angles are not spatial measurements. Plane patches and line pieces are viewing windows into infinite objects. Camera changes preserve coordinates and relations.',
);
function CoordinatesLab({ mode }: { mode: LanguageMode }) {
  const [ai, setAi] = useState(0),
    [bi, setBi] = useState(0),
    [shift, setShift] = useState('0'),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    as = [vec3(1, -2, 3), vec3(-1, 1, 0), zeroVec3()],
    bs = [vec3(4, 2, -1), vec3(1, -2, 3), vec3(-1, 1, 0), zeroVec3()],
    translation = shift === '0' ? zeroVec3() : vec3(2, -1, 1),
    a = addVec3(as[ai]!, translation),
    b = addVec3(bs[bi]!, translation),
    u = subVec3(b, a),
    mid = midpointVec3(a, b),
    sq = squareVec3(u);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '点坐标从选定原点量起；AB的分量为终点减起点。两点共同平移改变点坐标和中点，不改变位移AB或长度。三轴互相垂直且单位一致。',
            'Point coordinates refer to a chosen origin; AB is head minus tail. Translating both points changes their coordinates and midpoint, but preserves displacement AB and its length. The three coordinate axes are perpendicular with equal units.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('基准起点A', 'Base point A')}
        value={String(ai)}
        values={vectorOptions(as)}
        change={(v) => {
          setAi(Number(v));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('基准终点B', 'Base point B')}
        value={String(bi)}
        values={vectorOptions(bs)}
        change={(v) => {
          setBi(Number(v));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('两点共同平移', 'Translate both points')}
        value={shift}
        values={[
          ['0', t('(0,0,0)', '(0,0,0)')],
          ['1', t('(2,-1,1)', '(2,-1,1)')],
        ]}
        change={(v) => {
          setShift(v);
          setReveal(false);
        }}
      />
      <p>
        A={vec3Text(a)}；B={vec3Text(b)}
      </p>
      <Prediction
        key={`u-${vec3Text(u)}`}
        mode={mode}
        name={t('预测AB的三分量', 'Predict the three components of AB')}
        answer={triple(u)}
        hint={t(
          '逐坐标算B−A，保留第三分量和负号。',
          'Subtract A from B component by component, retaining z and signs.',
        )}
        solution={t(`AB=${vec3Text(u)}`, `AB=${vec3Text(u)}`)}
      />
      <Prediction
        key={`mid-${vec3Text(mid)}`}
        mode={mode}
        name={t('预测中点M坐标', 'Predict midpoint M coordinates')}
        answer={triple(mid)}
        hint={t(
          '三个坐标分别取两端的平均，不是只把终点除以2。',
          'Average the two endpoints in each coordinate; do not simply halve B.',
        )}
        solution={t(`M=${vec3Text(mid)}`, `M=${vec3Text(mid)}`)}
      />
      <Prediction
        key={`length-${textR(sq)}`}
        mode={mode}
        name={t('预测AB精确长度', 'Predict exact length AB')}
        answer={radical(`sqrt(${textR(sq)})`)}
        hint={t(
          '长度平方为三个位移分量平方和，最后取非负根。',
          'Sum all three squared displacement components, then take the nonnegative root.',
        )}
        solution={t(`|AB|²=${textR(sq)}`, `|AB|²=${textR(sq)}`)}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SpaceVectorFigure
        mode={mode}
        view={view}
        reveal={reveal}
        axes
        points={[
          { name: 'A', point: a },
          { name: 'B', point: b },
          ...(reveal ? [{ name: 'M', point: mid }] : []),
        ]}
        arrows={[{ name: 'AB', tail: a, value: u }]}
        caption={caption}
      />
    </>
  );
}
function OperationsLab({ mode }: { mode: LanguageMode }) {
  const [ui, setUi] = useState(0),
    [vi, setVi] = useState(0),
    [op, setOp] = useState('add'),
    [k, setK] = useState('2'),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    u = spatialOperands[ui]!,
    v = spatialPartners[vi]!,
    factor = rational(k === '1/2' ? 1n : BigInt(k), k === '1/2' ? 2n : 1n),
    w =
      op === 'add'
        ? addVec3(u, v)
        : op === 'subtract'
          ? subVec3(u, v)
          : op === 'scale'
            ? scaleVec3(factor, u)
            : subVec3(scaleVec3(rational(2n), u), v),
    tail = op === 'combine' ? scaleVec3(rational(2n), u) : u,
    second =
      op === 'subtract' || op === 'combine' ? scaleVec3(rational(-1n), v) : v;
  const arrows: SpatialArrow[] =
    op === 'scale'
      ? [
          { name: 'u', tail: zeroVec3(), value: u },
          { name: 'ku', tail: zeroVec3(), value: w, color: '#9a6b18' },
        ]
      : [
          {
            name: op === 'combine' ? '2u' : 'u',
            tail: zeroVec3(),
            value: tail,
          },
          {
            name: op === 'add' ? 'v' : '−v',
            tail,
            value: second,
            color: '#50796d',
          },
          ...(reveal
            ? [{ name: 'w', tail: zeroVec3(), value: w, color: '#9a6b18' }]
            : []),
        ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '线性运算在三个分量分别进行。首尾相接表示加法；减v要先反向；实数倍k同时作用所有分量，k=0得到零向量而不是原方向的箭头。',
            'Apply linear operations to all three components. Head-to-tail arrows represent addition; subtraction reverses v. A scalar k multiplies every component, with k=0 giving a zero vector without direction.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('向量u', 'Vector u')}
        value={String(ui)}
        values={vectorOptions(spatialOperands)}
        change={(x) => {
          setUi(Number(x));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('向量v', 'Vector v')}
        value={String(vi)}
        values={vectorOptions(spatialPartners)}
        change={(x) => {
          setVi(Number(x));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('线性操作', 'Linear operation')}
        value={op}
        values={[
          ['add', t('u+v', 'u+v')],
          ['subtract', t('u−v', 'u−v')],
          ['scale', t('ku', 'ku')],
          ['combine', t('2u−v', '2u−v')],
        ]}
        change={(x) => {
          setOp(x);
          setReveal(false);
        }}
      />
      {op === 'scale' && (
        <Select
          mode={mode}
          name={t('实数倍k', 'Scalar k')}
          value={k}
          values={['-2', '-1', '0', '1/2', '2'].map((v) => [v, t(v, v)])}
          change={(x) => {
            setK(x);
            setReveal(false);
          }}
        />
      )}
      <Prediction
        key={`w-${vec3Text(w)}`}
        mode={mode}
        name={t('预测结果向量w', 'Predict result vector w')}
        answer={triple(w)}
        hint={t(
          '三个位置一一对应，先处理倍数与减号，再分别相加。',
          'Match coordinates, apply scalars and minus signs, then combine each position.',
        )}
        solution={t(`w=${vec3Text(w)}`, `w=${vec3Text(w)}`)}
      />
      <Prediction
        key={`sq-${textR(squareVec3(w))}`}
        mode={mode}
        name={t('预测|w|²', 'Predict |w|²')}
        answer={num(textR(squareVec3(w)))}
        hint={t(
          '先算w，再把三个分量平方求和；不能把|u|+|v|当一般答案。',
          'First find w, then sum its three squared components; lengths do not generally add.',
        )}
        solution={t(
          `|w|²=${textR(squareVec3(w))}`,
          `|w|²=${textR(squareVec3(w))}`,
        )}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SpaceVectorFigure
        mode={mode}
        arrows={arrows}
        points={[
          { name: 'O', point: zeroVec3() },
          { name: 'T', point: op === 'scale' ? u : tail },
          ...(reveal ? [{ name: 'W', point: w }] : []),
        ]}
        view={view}
        reveal={reveal}
        caption={caption}
      />
    </>
  );
}
function DotLab({ mode }: { mode: LanguageMode }) {
  const [ui, setUi] = useState(0),
    [vi, setVi] = useState(0),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    u = spatialOperands[ui]!,
    v = anglePartners[vi]!,
    a = spatialAngle(u, v),
    cosAnswer: AnswerSpec =
      a.cosine === null
        ? { kind: 'vector-code', value: 'undefined' }
        : radical(a.cosine);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            'u·v=x₁x₂+y₁y₂+z₁z₂是实数，不是向量。两向量非零才用cosθ=(u·v)/(|u||v|)。零向量点积仍为0，但方向和夹角无定义，不能叫成直角。',
            'u·v=x₁x₂+y₁y₂+z₁z₂ is a scalar, not a vector. Use cosθ=(u·v)/(|u||v|) only for nonzero vectors. A zero vector has dot product zero but no direction or angle, so it does not define a right angle.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('向量u', 'Vector u')}
        value={String(ui)}
        values={vectorOptions(spatialOperands)}
        change={(x) => {
          setUi(Number(x));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('夹角向量v', 'Angle vector v')}
        value={String(vi)}
        values={vectorOptions(anglePartners)}
        change={(x) => {
          setVi(Number(x));
          setReveal(false);
        }}
      />
      <Prediction
        key={`dot-${textR(a.dot)}`}
        mode={mode}
        name={t('预测数量积u·v', 'Predict dot product u·v')}
        answer={num(textR(a.dot))}
        hint={t(
          '三个对应分量乘积都要相加，结果保留正负。',
          'Add all three matching component products and retain the sign.',
        )}
        solution={t(`u·v=${textR(a.dot)}`, `u·v=${textR(a.dot)}`)}
      />
      <Prediction
        key={`cos-${a.cosine}`}
        mode={mode}
        name={t('预测cosθ或undefined', 'Predict cosθ or undefined')}
        answer={cosAnswer}
        hint={t(
          '先查两长度是否非零，再除以两模之积；不能只用数量积当余弦。',
          'Check both lengths are nonzero, then divide by their product; the dot product alone is not cosine.',
        )}
        solution={t(
          a.cosine === null ? '零向量参与，夹角无定义。' : `cosθ=${a.cosine}`,
          a.cosine === null
            ? 'A zero vector makes the angle undefined.'
            : `cosθ=${a.cosine}`,
        )}
      />
      <Prediction
        key={`angle-${a.kind}`}
        mode={mode}
        name={t('预测夹角类型', 'Predict angle type')}
        answer={{ kind: 'vector-code', value: a.kind }}
        hint={t(
          '非零时按数量积符号判acute/right/obtuse；同反向用zero-angle/straight，零向量用undefined。',
          'For nonzero vectors use acute/right/obtuse by dot-product sign; use zero-angle/straight for same/opposite direction and undefined for a zero vector.',
        )}
        solution={t(`类型=${a.kind}`, `Type=${a.kind}`)}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SpaceVectorFigure
        mode={mode}
        view={view}
        reveal={reveal}
        points={[
          { name: 'O', point: zeroVec3() },
          { name: 'U', point: u },
          { name: 'V', point: v },
        ]}
        arrows={[
          { name: 'u', tail: zeroVec3(), value: u },
          { name: 'v', tail: zeroVec3(), value: v, color: '#50796d' },
        ]}
        caption={caption}
      />
      {reveal && (
        <DataTable
          mode={mode}
          headers={[t('量', 'Quantity'), t('精确值', 'Exact value')]}
          rows={[
            ['u·v', textR(a.dot)],
            ['|u|²', textR(squareVec3(u))],
            ['|v|²', textR(squareVec3(v))],
            ['cosθ', a.cosine ?? 'undefined'],
            ['θ', a.kind],
          ]}
        />
      )}
    </>
  );
}
function RelationsLab({ mode }: { mode: LanguageMode }) {
  const [family, setFamily] = useState('line-plane'),
    [index, setIndex] = useState(0),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    sample = spatialRelationCases[index]!,
    a = vectorLine3(zeroVec3(), vec3(1, 0, 0)),
    b = vectorLine3(
      index === 0
        ? vec3(0, 1, 1)
        : index === 1
          ? vec3(0, 1, 0)
          : index === 2
            ? vec3(0, 1, 0)
            : vec3(1, 0, 0),
      index < 2 ? vec3(0, 1, 0) : index === 2 ? vec3(2, 0, 0) : vec3(-2, 0, 0),
    ),
    p1 = vectorPlane3(vec3(0, 0, 1), 0),
    p2 =
      index === 0
        ? vectorPlane3(vec3(0, 0, -2), -4)
        : index === 1
          ? vectorPlane3(vec3(0, 0, -2), 0)
          : index === 2
            ? vectorPlane3(vec3(1, 0, 0), 0)
            : vectorPlane3(vec3(1, 0, 1), 1),
    result = vectorLinePlaneRelation(sample.line, sample.plane),
    kind =
      family === 'line-plane'
        ? result.kind
        : family === 'line-line'
          ? vectorLineRelation(a, b)
          : vectorPlaneRelation(p1, p2),
    diagnostic =
      family === 'line-plane'
        ? result.dot
        : family === 'line-line'
          ? dotVec3(a.direction, b.direction)
          : dotVec3(p1.normal, p2.normal),
    name =
      family === 'line-plane'
        ? t('预测u·n', 'Predict u·n')
        : family === 'line-line'
          ? t('预测u·v', 'Predict u·v')
          : t('预测n₁·n₂', 'Predict n₁·n₂');
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '直线X=A+tu、平面n·X=d都要求非零方向/法向。u·n=0先说明方向沿平面，再代A区分contained与严格parallel；u·n≠0有唯一交点。判断直线或平面之间关系还须检查位置，不能只看投影或一个点积。',
            'Line X=A+tu and plane n·X=d require nonzero direction and normal. If u·n=0, test A to distinguish contained from strictly parallel; nonzero u·n gives one intersection. Relations between lines or planes also require position information, not merely a projection or one dot product.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('关系对象', 'Relation objects')}
        value={family}
        values={[
          ['line-plane', t('直线与平面', 'Line and plane')],
          ['line-line', t('两条直线', 'Two lines')],
          ['plane-plane', t('两个平面', 'Two planes')],
        ]}
        change={(x) => {
          setFamily(x);
          setIndex(0);
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('空间配置', 'Spatial configuration')}
        value={String(index)}
        values={[0, 1, 2, 3].map((i) => [
          String(i),
          t(`配置${i + 1}`, `Configuration ${i + 1}`),
        ])}
        change={(x) => {
          setIndex(Number(x));
          setReveal(false);
        }}
      />
      <p>
        {family === 'line-plane'
          ? `A=${vec3Text(sample.line.point)}; u=${vec3Text(sample.line.direction)}; ${spatialEquationText(sample.plane)}`
          : family === 'line-line'
            ? `A=${vec3Text(a.point)},u=${vec3Text(a.direction)}; B=${vec3Text(b.point)},v=${vec3Text(b.direction)}`
            : `α: ${spatialEquationText(p1)}; β: ${spatialEquationText(p2)}`}
      </p>
      <Prediction
        key={`relation-${family}-${index}`}
        mode={mode}
        name={t('预测位置关系', 'Predict positional relation')}
        answer={{ kind: 'solid-code', value: kind }}
        hint={t(
          '可用parallel、contained、intersecting、coincident或skew；先核方向条件，再核已知点的位置。',
          'Use parallel, contained, intersecting, coincident or skew. Check direction conditions and the supplied positions.',
        )}
        solution={t(
          `结论=${kind}。注意位置关系与方向垂直不是同一问题。`,
          `Verdict=${kind}. Positional relation and perpendicular directions are different questions.`,
        )}
      />
      <Prediction
        key={`dot-${family}-${textR(diagnostic)}`}
        mode={mode}
        name={name}
        answer={num(textR(diagnostic))}
        hint={t(
          '按三个对应分量求积再相加；点积为0不能替代完整的位置判断。',
          'Sum three matching products; a zero dot product does not replace the full position test.',
        )}
        solution={t(
          `数量积=${textR(diagnostic)}`,
          `Dot product=${textR(diagnostic)}`,
        )}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      {family === 'line-plane' ? (
        <SpaceVectorFigure
          mode={mode}
          plane={sample.plane}
          line={sample.line}
          view={view}
          reveal={reveal}
          points={[
            { name: 'A', point: sample.line.point },
            ...(reveal && result.intersection
              ? [{ name: 'H', point: result.intersection }]
              : []),
          ]}
          caption={caption}
        />
      ) : family === 'line-line' ? (
        <SpaceVectorFigure
          mode={mode}
          line={a}
          view={view}
          reveal={reveal}
          points={[
            { name: 'A', point: a.point },
            { name: 'B', point: b.point },
          ]}
          segments={[
            {
              name: 'line m (window)',
              a: addVec3(b.point, scaleVec3(rational(-3n), b.direction)),
              b: addVec3(b.point, scaleVec3(rational(3n), b.direction)),
            },
          ]}
          caption={caption}
        />
      ) : (
        <SpaceVectorFigure
          mode={mode}
          plane={p1}
          otherPlane={p2}
          view={view}
          reveal={reveal}
          points={[
            { name: 'B', point: pointPlaneProjection(zeroVec3(), p2).foot },
          ]}
          arrows={[
            {
              name: 'n₂',
              tail: pointPlaneProjection(zeroVec3(), p2).foot,
              value: p2.normal,
              color: '#50796d',
            },
          ]}
          caption={t(
            '两色块分别是α、β的有限显示片，B在β上，箭头n₂是β法向量；重合时色块叠加。位置关系由两个完整方程和法向量确定，不由色块边缘或画面相交决定。',
            'The two patches display finite parts of α and β; B lies on β and n₂ is its normal. Coincident patches overlap. Determine the relation from both full equations and normals, not from patch edges or screen intersections.',
          )}
        />
      )}
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={
              family === 'line-plane'
                ? t(
                    `u·n=${textR(result.dot)}；n·A−d=${textR(result.residual)}。${result.parameter ? `交点参数t=${textR(result.parameter)}。` : ''}${result.perpendicular ? '方向u与n平行，所以直线垂直平面。' : '未满足u与n平行，不能由画面说直线垂直平面。'}`,
                    `u·n=${textR(result.dot)}; n·A−d=${textR(result.residual)}. ${result.parameter ? `Intersection parameter t=${textR(result.parameter)}. ` : ''}${result.perpendicular ? 'u is parallel to n, so the line is perpendicular to the plane.' : 'u is not parallel to n; the picture cannot establish line-plane perpendicularity.'}`,
                  )
                : t(
                    `位置=${kind}；还需核方向向量是否成比例，以及连接两基点的位移或平面常数。`,
                    `Relation=${kind}; also inspect proportional direction vectors and the displacement between base points or plane constants.`,
                  )
            }
          />
        </p>
      )}
    </>
  );
}
function DistanceLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState('plane'),
    [pi, setPi] = useState(0),
    [scale, setScale] = useState('1'),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    p = spatialDistancePoints[pi]!,
    k = rational(BigInt(scale)),
    plane = {
      normal: scaleVec3(k, spatialPlane.normal),
      offset: mulR(k, spatialPlane.offset),
    },
    line = {
      point: spatialDistanceLine.point,
      direction: scaleVec3(k, spatialDistanceLine.direction),
    },
    model =
      kind === 'plane'
        ? pointPlaneProjection(p, plane)
        : pointLineProjection(p, line),
    residual =
      kind === 'plane'
        ? planeResidual3(plane, model.foot)
        : dotVec3(model.displacement, line.direction);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '最短距离沿垂线PH。到平面时沿法向扣去投影；到直线时先取沿方向的分量，再减去它。平方距离为非负，点在对象上时为0；方向或法向不能是零向量。',
            'Shortest distance follows perpendicular PH. For a plane subtract the normal projection; for a line retain the along-line component and subtract it. Squared distance is nonnegative and zero on the object. Directions and normals must be nonzero.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('距离对象', 'Distance object')}
        value={kind}
        values={[
          ['plane', t('平面x+2y+2z=3', 'Plane x+2y+2z=3')],
          ['line', t('直线A(1,0,1)+t(1,1,0)', 'Line (1,0,1)+t(1,1,0)')],
        ]}
        change={(x) => {
          setKind(x);
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('空间点P', 'Spatial point P')}
        value={String(pi)}
        values={vectorOptions(spatialDistancePoints)}
        change={(x) => {
          setPi(Number(x));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('方向或方程的非零倍数', 'Nonzero direction or equation scale')}
        value={scale}
        values={[
          ['1', t('1', '1')],
          ['-2', t('−2', '−2')],
        ]}
        change={(x) => {
          setScale(x);
          setReveal(false);
        }}
      />
      <p>
        P={vec3Text(p)}；
        {kind === 'plane'
          ? spatialEquationText(plane)
          : `A=${vec3Text(line.point)}, u=${vec3Text(line.direction)}`}
      </p>
      <Prediction
        key={`foot-${kind}-${vec3Text(model.foot)}`}
        mode={mode}
        name={t('预测空间垂足H', 'Predict spatial foot H')}
        answer={triple(model.foot)}
        hint={t(
          '垂足必须在指定对象上，且PH与平面法向平行或与直线方向垂直。',
          'H must lie on the object; PH is parallel to a plane normal or perpendicular to a line direction.',
        )}
        solution={t(`H=${vec3Text(model.foot)}`, `H=${vec3Text(model.foot)}`)}
      />
      <Prediction
        key={`distance-${kind}-${textR(model.distanceSquare)}`}
        mode={mode}
        name={t('预测空间精确距离', 'Predict exact spatial distance')}
        answer={radical(`sqrt(${textR(model.distanceSquare)})`)}
        hint={t(
          '算P−H的三个分量平方和，再开非负根；投影图的线段长度不是答案。',
          'Sum the three squared components of P−H and take the nonnegative root; the projected screen length is not the answer.',
        )}
        solution={t(
          `d²=${textR(model.distanceSquare)}，d=${model.distance}`,
          `d²=${textR(model.distanceSquare)}, d=${model.distance}`,
        )}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SpaceVectorFigure
        mode={mode}
        view={view}
        reveal={reveal}
        plane={kind === 'plane' ? plane : undefined}
        line={kind === 'line' ? line : undefined}
        points={[
          { name: 'P', point: p },
          ...(reveal ? [{ name: 'H', point: model.foot }] : []),
        ]}
        segments={reveal ? [{ name: 'PH', a: p, b: model.foot }] : []}
        caption={caption}
      />
      {reveal && (
        <DataTable
          mode={mode}
          name={t('空间距离核验', 'Spatial distance audit')}
          headers={[t('量', 'Quantity'), t('精确结果', 'Exact result')]}
          rows={[
            ['H', vec3Text(model.foot)],
            ['P−H', vec3Text(model.displacement)],
            ['d²', textR(model.distanceSquare)],
            ['d', model.distance],
            [kind === 'plane' ? 'n·H−d' : '(P−H)·u', textR(residual)],
          ]}
        />
      )}
    </>
  );
}
export function SpaceVectorLab({
  kind,
  mode,
}: {
  kind: SpaceVectorLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'spatial-coordinates' ? (
        <CoordinatesLab mode={mode} />
      ) : kind === 'spatial-operations' ? (
        <OperationsLab mode={mode} />
      ) : kind === 'spatial-dot' ? (
        <DotLab mode={mode} />
      ) : kind === 'spatial-relations' ? (
        <RelationsLab mode={mode} />
      ) : (
        <DistanceLab mode={mode} />
      )}
    </div>
  );
}
export function SpaceVectorHookArt({
  kind,
  mode,
}: {
  kind: SpaceVectorLabKind;
  mode: LanguageMode;
}) {
  if (kind === 'spatial-operations')
    return (
      <SpaceVectorFigure
        mode={mode}
        points={[
          { name: 'O', point: zeroVec3() },
          { name: 'U', point: spatialOperands[0]! },
        ]}
        arrows={[
          { name: 'u', tail: zeroVec3(), value: spatialOperands[0]! },
          {
            name: 'v',
            tail: spatialOperands[0]!,
            value: spatialPartners[0]!,
            color: '#50796d',
          },
        ]}
        caption={t(
          '先让第二支箭头的起点接在第一支的终点，预测第三分量怎样相加。换位置不改自由向量。',
          'Place the second arrow’s tail at the first arrow’s head. Predict how the third components add; translation preserves a free vector.',
        )}
      />
    );
  if (kind === 'spatial-dot')
    return (
      <SpaceVectorFigure
        mode={mode}
        points={[
          { name: 'O', point: zeroVec3() },
          { name: 'U', point: spatialOperands[0]! },
          { name: 'V', point: anglePartners[0]! },
        ]}
        arrows={[
          { name: 'u', tail: zeroVec3(), value: spatialOperands[0]! },
          {
            name: 'v',
            tail: zeroVec3(),
            value: anglePartners[0]!,
            color: '#50796d',
          },
        ]}
        caption={t(
          '屏幕上看起来的角不是空间夹角；分别乘三个分量，再决定是否垂直。',
          'The screen angle is not the spatial angle. Multiply matching components in all three coordinates to test perpendicularity.',
        )}
      />
    );
  return kind === 'spatial-distance' ? (
    <SpaceVectorFigure
      mode={mode}
      plane={spatialPlane}
      points={[{ name: 'P', point: spatialDistancePoints[0]! }]}
      caption={caption}
    />
  ) : kind === 'spatial-relations' ? (
    <SpaceVectorFigure
      mode={mode}
      plane={spatialRelationCases[0]!.plane}
      line={spatialRelationCases[0]!.line}
      points={[{ name: 'A', point: spatialRelationCases[0]!.line.point }]}
      caption={caption}
    />
  ) : (
    <SpaceVectorFigure
      mode={mode}
      axes={kind === 'spatial-coordinates'}
      points={[
        { name: 'A', point: vec3(1, -2, 3) },
        { name: 'B', point: vec3(4, 2, -1) },
      ]}
      arrows={[{ name: 'AB', tail: vec3(1, -2, 3), value: vec3(3, 4, -4) }]}
      caption={caption}
    />
  );
}
