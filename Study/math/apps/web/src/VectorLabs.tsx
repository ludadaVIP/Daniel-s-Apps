import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { readRational } from './rationalModels';
import { rational, textR } from './algebraModels';
import {
  readVector,
  vectorText,
  addV,
  subtractV,
  scaleV,
  betweenV,
  midpointV,
  sameV,
  directionV,
  lengthV,
  angleV,
  dotV,
  geometricCase,
  vectorZero,
  type Vector,
  type VectorCode,
} from './vectorModels';
import { VectorPlot, type VectorArrow, originPoint } from './VectorVisuals';
export type VectorLabKind = Extract<Lesson['lab'], `vector-${string}`>;
export const isVectorLab = (kind: Lesson['lab']): kind is VectorLabKind =>
  kind.startsWith('vector-');
const word = (mode: LanguageMode, v: LocalizedText) =>
    mode === 'en' ? v.en : v.zh,
  options = (vs: string[]) =>
    vs.map((v): [string, LocalizedText] => [v, t(v, v)]);
const xy = (value: Vector): AnswerSpec => ({
    kind: 'coordinate',
    value: vectorText(value),
  }),
  code = (value: VectorCode): AnswerSpec => ({ kind: 'vector-code', value });
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
        {values.map(([v, n]) => (
          <option key={v} value={v}>
            {word(mode, n)}
          </option>
        ))}
      </select>
    </label>
  );
}
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
    [show, setShow] = useState(false);
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
              checkAnswer(input, answer)
                ? t(
                    '预测符合。说明对象、方向和前提，再用另一表示核验。',
                    'The prediction matches. Explain the object, direction and premises, then audit another representation.',
                  )
                : hint
            }
          />
        </p>
      )}
      {checked && !checkAnswer(input, answer) && (
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
function ViewButtons({
  mode,
  wide,
  setWide,
  reveal,
  setReveal,
}: {
  mode: LanguageMode;
  wide: boolean;
  setWide: (v: boolean) => void;
  reveal: boolean;
  setReveal: (v: boolean) => void;
}) {
  return (
    <>
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('切换图窗', 'Change window')} />
      </button>
      <button
        className="math-button"
        aria-expanded={reveal}
        onClick={() => setReveal(!reveal)}
      >
        <Text
          mode={mode}
          text={t('显示/隐藏精确核验', 'Show/hide exact audit')}
        />
      </button>
    </>
  );
}
function MeaningLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState('equal'),
    [tail, setTail] = useState('(1,-3)'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false);
  const u = readVector(
      kind === 'zero' || kind === 'one-zero' ? '(0,0)' : '(3,4)',
    ),
    v = readVector(
      (
        {
          equal: '(3,4)',
          scaled: '(6,8)',
          reversed: '(-3,-4)',
          other: '(4,3)',
          zero: '(0,0)',
          'one-zero': '(3,4)',
        } as Record<string, string>
      )[kind]!,
    ),
    a = readVector('(-4,-2)'),
    c = readVector(tail),
    arrows: VectorArrow[] = [
      { name: 'u', tail: a, value: u },
      { name: 'v', tail: c, value: v },
    ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '比较自由向量的值，而非箭头放在哪里。相等与同向是两个不同问题。',
            'Compare free-vector values rather than arrow locations. Equality and same direction are different questions.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('比较案例', 'Comparison case')}
        value={kind}
        change={setKind}
        values={[
          ['equal', t('等位移', 'Equal displacement')],
          ['scaled', t('同向两倍', 'Same direction, double size')],
          ['reversed', t('反向', 'Reversed')],
          ['other', t('同长不同向', 'Equal length, different direction')],
          ['zero', t('两个零向量', 'Two zero vectors')],
          ['one-zero', t('仅一个零向量', 'One zero vector')],
        ]}
      />
      <Select
        mode={mode}
        name={t('v的箭头起点', 'Tail of arrow v')}
        value={tail}
        change={setTail}
        values={options(['(1,-3)', '(-4,-2)', '(2,-1)'])}
      />
      <Task
        key={`equal/${kind}`}
        mode={mode}
        name={t(
          '预测向量是否相等（equal/different）',
          'Predict equality (equal/different)',
        )}
        answer={code(sameV(u, v) ? 'equal' : 'different')}
        hint={t(
          '平移不改值；大小与方向都相同才相等。两个零向量也相等。',
          'Translation preserves value; equal magnitude and direction are both needed. Two zero vectors are equal.',
        )}
        solution={t(
          `分量比较：u=${vectorText(u)}，v=${vectorText(v)}，${sameV(u, v) ? '相等' : '不相等'}。`,
          `Components u=${vectorText(u)}, v=${vectorText(v)} are ${sameV(u, v) ? 'equal' : 'different'}.`,
        )}
      />
      <Task
        key={`dir/${kind}`}
        mode={mode}
        name={t('预测方向关系', 'Predict direction relation')}
        answer={code(directionV(u, v))}
        hint={t(
          '用same-direction、opposite-direction、not-parallel；零向量用undefined。同向不代表等长。',
          'Use same-direction, opposite-direction or not-parallel; use undefined for a zero vector. Same direction does not imply equal size.',
        )}
        solution={t(
          `方向分类：${directionV(u, v)}。`,
          `Direction classification: ${directionV(u, v)}.`,
        )}
      />
      <Task
        key={vectorText(u)}
        mode={mode}
        name={t('预测u的模长', 'Predict magnitude of u')}
        answer={{ kind: 'radical', value: lengthV(u) }}
        hint={t(
          '用直角分量平方和开主平方根，不把路线长度当模长。',
          'Take the principal root of squared components, not the route length.',
        )}
        solution={t(`|u|=${lengthV(u)}。`, `|u|=${lengthV(u)}.`)}
      />
      <ViewButtons
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <VectorPlot
        mode={mode}
        arrows={arrows}
        points={[
          { name: 'A', position: a },
          { name: 'U', position: addV(a, u) },
          { name: 'C', position: c },
          { name: 'V', position: addV(c, v) },
        ]}
        wide={wide}
        reveal={reveal}
        caption={t(
          '只移动v起点，预测保持；两个同向箭头仍可能不等长。重合的零向量没有箭头方向。',
          'Moving only v’s tail preserves predictions. Same-direction arrows can differ in length; zero vectors have no arrow direction.',
        )}
      />
    </>
  );
}
function AdditionLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState('standard'),
    [operation, setOperation] = useState('add'),
    [order, setOrder] = useState('uv'),
    [anchor, setAnchor] = useState('(0,0)'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    [us, vs] = (
      {
        standard: ['(3,2)', '(-1,4)'],
        cancel: ['(3,2)', '(-3,-2)'],
        fraction: ['(1/2,-1)', '(3/2,2)'],
      } as Record<string, [string, string]>
    )[kind]!,
    u = readVector(us),
    v = readVector(vs),
    a = readVector(anchor),
    sum = operation === 'add',
    result = sum ? addV(u, v) : subtractV(u, v),
    end = addV(a, result),
    first = order === 'uv' ? u : v,
    second = order === 'uv' ? v : u;
  const arrows: VectorArrow[] = sum
    ? [
        { name: order === 'uv' ? 'u' : 'v', tail: a, value: first },
        {
          name: order === 'uv' ? 'v' : 'u',
          tail: addV(a, first),
          value: second,
        },
        { name: 'u+v', tail: a, value: result },
      ]
    : [
        { name: 'u', tail: a, value: u },
        { name: 'v', tail: a, value: v },
        { name: 'u-v', tail: addV(a, v), value: result },
      ];
  return (
    <>
      <Select
        mode={mode}
        name={t('位移案例', 'Displacement case')}
        value={kind}
        change={setKind}
        values={[
          ['standard', t('两步位移', 'Two displacements')],
          ['cancel', t('往返抵消', 'Out and back')],
          ['fraction', t('分数分量', 'Fractional components')],
        ]}
      />
      <Select
        mode={mode}
        name={t('运算', 'Operation')}
        value={operation}
        change={setOperation}
        values={[
          ['add', t('u+v', 'u+v')],
          ['subtract', t('u−v', 'u−v')],
        ]}
      />
      {sum && (
        <Select
          mode={mode}
          name={t('首尾路线次序', 'Head-to-tail order')}
          value={order}
          change={setOrder}
          values={[
            ['uv', t('先u后v', 'u then v')],
            ['vu', t('先v后u', 'v then u')],
          ]}
        />
      )}
      <Select
        mode={mode}
        name={t('起点A', 'Start A')}
        value={anchor}
        change={setAnchor}
        values={options(['(0,0)', '(-3,-2)'])}
      />
      <p>
        u={vectorText(u)}; v={vectorText(v)}
      </p>
      <Task
        key={`${kind}/${operation}`}
        mode={mode}
        name={t('预测运算结果向量', 'Predict result vector')}
        answer={xy(result)}
        hint={t(
          '和用首尾相接，差用u+(−v)；输出分量，不是箭头终点位置。',
          'Add head to tail or subtract using u+(−v). Give components, not an endpoint position.',
        )}
        solution={t(
          `结果${vectorText(result)}。`,
          `Result ${vectorText(result)}.`,
        )}
      />
      {sum && (
        <Task
          key={`${kind}/${anchor}`}
          mode={mode}
          name={t('预测从A出发的最终位置', 'Predict final position from A')}
          answer={xy(end)}
          hint={t(
            '终点=A+净位移。换起点会换位置，却不换自由向量。',
            'Endpoint=A+net displacement. Changing the start changes the position, not the free vector.',
          )}
          solution={t(
            `终点${vectorText(end)}。`,
            `Endpoint ${vectorText(end)}.`,
          )}
        />
      )}
      <ViewButtons
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <VectorPlot
        mode={mode}
        arrows={arrows}
        points={
          sum
            ? [
                { name: 'A', position: a },
                { name: 'M', position: addV(a, first) },
                { name: 'F', position: end },
              ]
            : [
                { name: 'A', position: a },
                { name: 'U', position: addV(a, u) },
                { name: 'V', position: addV(a, v) },
              ]
        }
        wide={wide}
        reveal={reveal}
        caption={
          sum
            ? t(
                '改变首尾路线保留结果和终点；改变起点仅重算位置。返程净位移为0不代表路程0。',
                'Changing route order preserves result and endpoint. Changing the start only resets position. Zero net displacement on a return trip does not mean zero distance.',
              )
            : t(
                '同尾箭头的u−v从V指向U；没有把减法顺序反过来。',
                'For common tails, u−v runs from V to U, preserving subtraction order.',
              )
        }
      />
    </>
  );
}
function ScalingLab({ mode }: { mode: LanguageMode }) {
  const [source, setSource] = useState('(3,-1)'),
    [scalar, setScalar] = useState('-2'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    u = readVector(source),
    scaled = scaleV(readRational(scalar), u),
    key = `${source}/${scalar}`;
  return (
    <>
      <Select
        mode={mode}
        name={t('原向量u', 'Source vector u')}
        value={source}
        change={setSource}
        values={options(['(3,-1)', '(0,2)', '(0,0)'])}
      />
      <Select
        mode={mode}
        name={t('标量k', 'Scalar k')}
        value={scalar}
        change={setScalar}
        values={options(['-2', '-1', '-1/2', '0', '1/2', '1', '2'])}
      />
      <Task
        key={`value/${key}`}
        mode={mode}
        name={t('预测ku', 'Predict ku')}
        answer={xy(scaled)}
        hint={t(
          '每个分量乘同一个k，负号使方向反转。',
          'Multiply each component by the same k; a negative sign reverses direction.',
        )}
        solution={t(`ku=${vectorText(scaled)}。`, `ku=${vectorText(scaled)}.`)}
      />
      <Task
        key={`length/${key}`}
        mode={mode}
        name={t('预测|ku|', 'Predict |ku|')}
        answer={{ kind: 'radical', value: lengthV(scaled) }}
        hint={t(
          '模长为|k||u|，永不为负。根式可用sqrt。',
          'Magnitude is |k||u| and is never negative; use sqrt for radicals.',
        )}
        solution={t(`|ku|=${lengthV(scaled)}。`, `|ku|=${lengthV(scaled)}.`)}
      />
      <Task
        key={`direction/${key}`}
        mode={mode}
        name={t('预测ku相对u的方向', 'Predict direction of ku relative to u')}
        answer={code(directionV(u, scaled))}
        hint={t(
          '正k同向、负k反向；有零向量写undefined。',
          'Positive k keeps direction, negative k reverses it; a zero vector gives undefined.',
        )}
        solution={t(
          `方向关系${directionV(u, scaled)}。`,
          `Direction relation ${directionV(u, scaled)}.`,
        )}
      />
      <ViewButtons
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <VectorPlot
        mode={mode}
        arrows={[
          { name: 'u', tail: vectorZero, value: u },
          { name: 'ku', tail: vectorZero, value: scaled },
        ]}
        points={[
          originPoint,
          { name: 'U', position: u },
          { name: 'K', position: scaled },
        ]}
        wide={wide}
        reveal={reveal}
        caption={t(
          '比较同一原点上的两支箭头；k=0或u=0时只画圆点，不画假方向。',
          'Compare the two arrows at one origin; k=0 or u=0 uses a dot without an invented direction.',
        )}
      />
    </>
  );
}
function ComponentsLab({ mode }: { mode: LanguageMode }) {
  const [baseB, setBaseB] = useState('(3,4)'),
    [translation, setTranslation] = useState('(0,0)'),
    [direction, setDirection] = useState('AB'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    baseA = readVector('(-2,1)'),
    b0 = readVector(baseB),
    shift = readVector(translation),
    a = addV(baseA, shift),
    b = addV(b0, shift),
    v = direction === 'AB' ? betweenV(a, b) : betweenV(b, a),
    mid = midpointV(a, b);
  return (
    <>
      <Select
        mode={mode}
        name={t('原始终点B', 'Original endpoint B')}
        value={baseB}
        change={setBaseB}
        values={options(['(3,4)', '(-2,1)', '(1,-2)'])}
      />
      <Select
        mode={mode}
        name={t('共同平移t', 'Common translation t')}
        value={translation}
        change={setTranslation}
        values={options(['(0,0)', '(2,-1)'])}
      />
      <Select
        mode={mode}
        name={t('箭头方向', 'Arrow direction')}
        value={direction}
        change={setDirection}
        values={options(['AB', 'BA'])}
      />
      <p>
        A={vectorText(a)}; B={vectorText(b)}
      </p>
      <Task
        key={`vector/${baseB}/${direction}`}
        mode={mode}
        name={t('预测当前向量分量', 'Predict current vector components')}
        answer={xy(v)}
        hint={t(
          '箭头终点减起点；AB与BA次序不同。共同平移会抵消。',
          'Subtract the arrow start from its endpoint. AB and BA differ; common translation cancels.',
        )}
        solution={t(
          `${direction}=${vectorText(v)}。`,
          `${direction}=${vectorText(v)}.`,
        )}
      />
      <Task
        key={`mid/${baseB}/${translation}`}
        mode={mode}
        name={t('预测当前中点位置', 'Predict current midpoint position')}
        answer={xy(mid)}
        hint={t(
          '对应点坐标取平均；中点是位置，会随平移移动。',
          'Average corresponding position coordinates; a midpoint is a position and moves under translation.',
        )}
        solution={t(`M=${vectorText(mid)}。`, `M=${vectorText(mid)}.`)}
      />
      <ViewButtons
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <VectorPlot
        mode={mode}
        arrows={[
          { name: direction, tail: direction === 'AB' ? a : b, value: v },
        ]}
        points={[
          originPoint,
          { name: 'A', position: a },
          { name: 'B', position: b },
          { name: 'M', position: mid },
        ]}
        wide={wide}
        reveal={reveal}
        caption={t(
          '共同平移保留向量预测，但重算中点位置；反转箭头重算向量，不改变两点的中点。',
          'Common translation preserves vector prediction but resets midpoint position. Reversing the arrow resets components without changing the midpoint.',
        )}
      />
    </>
  );
}
function DotLab({ mode }: { mode: LanguageMode }) {
  const [us, setU] = useState('(2,1)'),
    [vs, setV] = useState('(-1,2)'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    u = readVector(us),
    v = readVector(vs),
    m = angleV(u, v),
    key = `${us}/${vs}`;
  return (
    <>
      <Select
        mode={mode}
        name={t('向量u', 'Vector u')}
        value={us}
        change={setU}
        values={options(['(2,1)', '(1,0)', '(0,0)'])}
      />
      <Select
        mode={mode}
        name={t('向量v', 'Vector v')}
        value={vs}
        change={setV}
        values={options([
          '(-1,2)',
          '(2,1)',
          '(-2,-1)',
          '(-2,1)',
          '(1,1)',
          '(0,0)',
        ])}
      />
      <Task
        key={`dot/${key}`}
        mode={mode}
        name={t('预测u·v（标量）', 'Predict u·v (scalar)')}
        answer={{ kind: 'number', value: textR(m.dot) }}
        hint={t(
          '把对应分量乘积相加，结果不是数对。',
          'Add corresponding component products; the result is not a pair.',
        )}
        solution={t(`u·v=${textR(m.dot)}。`, `u·v=${textR(m.dot)}.`)}
      />
      <Task
        key={`cos/${key}`}
        mode={mode}
        name={t(
          '预测cosθ（零向量写undefined）',
          'Predict cosθ (zero vector: undefined)',
        )}
        answer={{ kind: 'circle-trig', value: m.cosine ?? 'undefined' }}
        hint={t(
          '两个向量都非零才除以|u||v|；根式可用sqrt。',
          'Divide by |u||v| only when both vectors are nonzero; use sqrt for exact radicals.',
        )}
        solution={t(
          m.cosine === null
            ? '零向量没有方向，夹角无定义。'
            : `cosθ=${m.cosine}。`,
          m.cosine === null
            ? 'A zero vector has no direction, so the angle is undefined.'
            : `cosθ=${m.cosine}.`,
        )}
      />
      <Task
        key={`kind/${key}`}
        mode={mode}
        name={t('预测夹角分类', 'Predict angle class')}
        answer={code(m.kind)}
        hint={t(
          '用acute/right/obtuse；端点分别zero-angle/straight，零向量undefined。',
          'Use acute/right/obtuse; endpoints are zero-angle/straight and zero vectors give undefined.',
        )}
        solution={t(
          `夹角分类${m.kind}，先保留非零前提。`,
          `Angle class ${m.kind}, retaining the nonzero premise.`,
        )}
      />
      <ViewButtons
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <VectorPlot
        mode={mode}
        arrows={[
          { name: 'u', tail: vectorZero, value: u },
          { name: 'v', tail: vectorZero, value: v },
        ]}
        points={[
          originPoint,
          { name: 'U', position: u },
          { name: 'V', position: v },
        ]}
        wide={wide}
        reveal={reveal}
        caption={t(
          '夹角按非零箭头方向在[0,π]内定义；点积0的计算与几何直角的条件分开。',
          'The angle between nonzero directions lies in [0,π]. Separate a zero dot-product calculation from the conditions for a geometric right angle.',
        )}
      />
    </>
  );
}
function GeometryLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] =
      useState<Parameters<typeof geometricCase>[0]>('general'),
    [translation, setTranslation] = useState('(0,0)'),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    m = geometricCase(kind, translation),
    key = `${kind}/${translation}`;
  return (
    <>
      <Select
        mode={mode}
        name={t('邻边案例', 'Adjacent-side case')}
        value={kind}
        change={(v) => setKind(v as typeof kind)}
        values={[
          ['general', t('一般两边', 'General sides')],
          ['rectangle', t('垂直不等长', 'Perpendicular, unequal lengths')],
          ['rhombus', t('等长不垂直', 'Equal lengths, not perpendicular')],
          ['square', t('等长且垂直', 'Equal and perpendicular')],
          ['degenerate', t('共线边界', 'Collinear boundary')],
        ]}
      />
      <Select
        mode={mode}
        name={t('场地共同平移', 'Common site translation')}
        value={translation}
        change={setTranslation}
        values={options(['(0,0)', '(2,-1)'])}
      />
      <p>
        A={vectorText(m.a)}; B={vectorText(m.b)}; D={vectorText(m.d)}
      </p>
      <Task
        key={`C/${key}`}
        mode={mode}
        name={t('预测第四点C', 'Predict fourth vertex C')}
        answer={xy(m.c)}
        hint={t(
          '按顺序C=B+D−A；这只给位置关系，还要查非退化。',
          'Use C=B+D−A in the stated order; this supplies a position relation, not a nondegeneracy guarantee.',
        )}
        solution={t(`C=${vectorText(m.c)}。`, `C=${vectorText(m.c)}.`)}
      />
      <Task
        key={`M/${key}`}
        mode={mode}
        name={t('预测对角线共同中点', 'Predict common diagonal midpoint')}
        answer={xy(m.midAC)}
        hint={t(
          '分别核(A+C)/2和(B+D)/2；平移会移动它们。',
          'Audit (A+C)/2 and (B+D)/2 independently; translation moves them.',
        )}
        solution={t(
          `共同中点${vectorText(m.midAC)}。`,
          `Common midpoint ${vectorText(m.midAC)}.`,
        )}
      />
      <Task
        key={`kind/${kind}`}
        mode={mode}
        name={t('预测最具体图形分类', 'Predict most specific shape class')}
        answer={code(m.kind)}
        hint={t(
          '先查面积非零，再用点积和平方模；共线写degenerate。',
          'Check nonzero area first, then dot product and squared magnitudes. Use degenerate for collinear cases.',
        )}
        solution={t(
          `分类${m.kind}；平移不改边向量或该结论。`,
          `Classification ${m.kind}; translation changes neither side vectors nor this conclusion.`,
        )}
      />
      <ViewButtons
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <VectorPlot
        mode={mode}
        polygon={[m.a, m.b, m.c, m.d]}
        segments={[
          { a: m.a, b: m.c },
          { a: m.b, b: m.d },
        ]}
        arrows={[
          { name: 'AB', tail: m.a, value: m.u },
          { name: 'AD', tail: m.a, value: m.v },
        ]}
        points={[
          { name: 'A', position: m.a },
          { name: 'B', position: m.b },
          { name: 'C', position: m.c },
          { name: 'D', position: m.d },
          { name: 'M', position: m.midAC },
        ]}
        wide={wide}
        reveal={reveal}
        caption={t(
          '两条虚线是对角线，M为共同中点；共线图的面积为0，不能仅凭中点等式判成非退化四边形。',
          'Dashed segments are diagonals with common midpoint M. A collinear figure has zero area; midpoint equality alone does not certify a nondegenerate quadrilateral.',
        )}
      />
      {reveal && (
        <p>
          <Text
            mode={mode}
            text={t(
              `AB·AD=${textR(dotVForDisplay(m.u, m.v))}，面积=${textR(m.area)}。证明还需说明图形原有前提。`,
              `AB·AD=${textR(dotVForDisplay(m.u, m.v))}, area=${textR(m.area)}. A proof must also state the original geometric premises.`,
            )}
          />
        </p>
      )}
    </>
  );
}
const dotVForDisplay = dotV;
export function VectorLab({
  kind,
  mode,
}: {
  kind: VectorLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'vector-meaning' ? (
        <MeaningLab mode={mode} />
      ) : kind === 'vector-addition' ? (
        <AdditionLab mode={mode} />
      ) : kind === 'vector-scaling' ? (
        <ScalingLab mode={mode} />
      ) : kind === 'vector-components' ? (
        <ComponentsLab mode={mode} />
      ) : kind === 'vector-dot' ? (
        <DotLab mode={mode} />
      ) : (
        <GeometryLab mode={mode} />
      )}
    </div>
  );
}
export function VectorHookArt({
  kind,
  mode,
}: {
  kind: VectorLabKind;
  mode: LanguageMode;
}) {
  if (kind === 'vector-geometry') {
    const m = geometricCase('square', '(2,1)');
    return (
      <VectorPlot
        mode={mode}
        polygon={[m.a, m.b, m.c, m.d]}
        points={[
          { name: 'A', position: m.a },
          { name: 'B', position: m.b },
          { name: 'C', position: m.c },
          { name: 'D', position: m.d },
        ]}
        caption={t(
          '用边向量检验斜置图形；画得像不等于已经证明。',
          'Test the tilted figure using side vectors; appearance alone is not proof.',
        )}
      />
    );
  }
  if (kind === 'vector-addition') {
    const u = readVector('(3,0)'),
      v = readVector('(-5,0)'),
      sum = addV(u, v);
    return (
      <VectorPlot
        mode={mode}
        arrows={[
          { name: 'u', tail: vectorZero, value: u },
          { name: 'v', tail: u, value: v },
          { name: 'u+v', tail: vectorZero, value: sum },
        ]}
        points={[
          originPoint,
          { name: 'M', position: u },
          { name: 'F', position: sum },
        ]}
        caption={t(
          '先东3再西5，按首尾相接查看最终位置；路程与净位移不同。',
          'Go three east then five west, head to tail. Travelled distance differs from net displacement.',
        )}
      />
    );
  }
  if (kind === 'vector-components') {
    const a = readVector('(-2,1)'),
      b = readVector('(3,4)');
    return (
      <VectorPlot
        mode={mode}
        arrows={[{ name: 'AB', tail: a, value: betweenV(a, b) }]}
        points={[
          originPoint,
          { name: 'A', position: a },
          { name: 'B', position: b },
        ]}
        caption={t(
          'B的位置不等于从A出发的位移，除非A就是原点。',
          'B’s position is not displacement from A unless A is the origin.',
        )}
      />
    );
  }
  const u = readVector(
      kind === 'vector-dot'
        ? '(1,1)'
        : kind === 'vector-scaling'
          ? '(3,-1)'
          : '(3,4)',
    ),
    v =
      kind === 'vector-scaling'
        ? scaleV(rational(-2n), u)
        : readVector(kind === 'vector-dot' ? '(0,0)' : '(3,4)'),
    a = vectorZero,
    b = kind === 'vector-meaning' ? readVector('(-4,-3)') : vectorZero;
  return (
    <VectorPlot
      mode={mode}
      arrows={[
        { name: 'u', tail: a, value: u },
        { name: 'v', tail: b, value: v },
      ]}
      points={[
        originPoint,
        { name: 'U', position: addV(a, u) },
        { name: 'V', position: addV(b, v) },
      ]}
      caption={t(
        '先描述大小、方向与起点；接下来用同单位网格和分量核验。',
        'Describe magnitude, direction and tails first, then audit with equal grid units and components.',
      )}
    />
  );
}
