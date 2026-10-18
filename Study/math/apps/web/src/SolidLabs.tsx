import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { rational, textR } from './algebraModels';
import {
  spaceLineRelation,
  linePlaneRelation,
  planeRelation,
  relationCases,
  solidCounts,
  solidVolume,
  sphereMeasures,
  cubeSection,
  exact3Number,
  exact3Text,
  solidNets,
  foldCubeNet,
  spaceDistances,
  compoundCase,
  boxVertices,
  type SolidCode,
  type SpacePoint,
} from './solidModels';
import {
  SolidScene,
  PolyhedronScene,
  NetScene,
  cuboidScene,
  type SpaceSegment,
} from './SolidVisuals';
export type SolidLabKind = Extract<Lesson['lab'], `solid-${string}`>;
export const isSolidLab = (kind: Lesson['lab']): kind is SolidLabKind =>
  kind.startsWith('solid-');
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const code = (value: SolidCode): AnswerSpec => ({ kind: 'solid-code', value });
const number = (
  value: string,
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'],
): AnswerSpec => ({ kind: 'number', value, unit });
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
        {values.map(([v, label]) => (
          <option key={v} value={v}>
            {word(mode, label)}
          </option>
        ))}
      </select>
    </label>
  );
}
const numericOptions = (values: number[]): [string, LocalizedText][] =>
  values.map((n) => [String(n), t(String(n), String(n))]);
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
                    '预测符合。请用条件、坐标或面对应解释。',
                    'The prediction matches. Explain with premises, coordinates or face correspondences.',
                  )
                : hint
            }
          />
        </p>
      )}
      {checked && !correct && (
        <button className="math-button" onClick={() => setReveal(true)}>
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
      <button className="math-button" onClick={() => setView(1 - view)}>
        <Text mode={mode} text={t('换观察方向', 'Change camera')} />
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
const relationshipOptions: [string, LocalizedText][] = [
  ...Object.entries(relationCases).map(
    ([key, value]): [string, LocalizedText] => [
      key,
      t(value.label[0], value.label[1]),
    ],
  ),
  ['line-contained', t('直线AB与平面z=0', 'Line AB and plane z=0')],
  ['line-parallel', t('直线EF与平面z=0', 'Line EF and plane z=0')],
  ['line-intersecting', t('直线AE与平面z=0', 'Line AE and plane z=0')],
  ['planes-intersecting', t('平面z=0与y=0', 'Planes z=0 and y=0')],
  ['planes-parallel', t('平面z=0与z=4', 'Planes z=0 and z=4')],
  ['planes-coincident', t('平面z=0与2z=0', 'Planes z=0 and 2z=0')],
];
function RelationsLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState('skew'),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    m = cuboidScene(4, 3, 4);
  let answer: SolidCode,
    highlights: SpaceSegment[] = [],
    faces: { vertices: SpacePoint[]; color?: string }[] = [
      { vertices: m.base },
    ];
  if (kind in relationCases) {
    const c = relationCases[kind as keyof typeof relationCases],
      p = c.pair;
    answer = spaceLineRelation(
      m.vertices[p[0]]!,
      m.vertices[p[1]]!,
      m.vertices[p[2]]!,
      m.vertices[p[3]]!,
    );
    highlights = [
      {
        a: m.vertices[p[0]]!,
        b: m.vertices[p[1]]!,
        color: '#7253ab',
        name: 'first-line',
      },
      {
        a: m.vertices[p[2]]!,
        b: m.vertices[p[3]]!,
        color: '#b0781e',
        name: 'second-line',
      },
    ];
  } else if (kind.startsWith('line-')) {
    const pair =
      kind === 'line-contained'
        ? [0, 1]
        : kind === 'line-parallel'
          ? [4, 5]
          : [0, 4];
    answer = linePlaneRelation(
      m.vertices[pair[0]!]!,
      m.vertices[pair[1]!]!,
      [0, 0, 1],
      0,
    );
    highlights = [
      {
        a: m.vertices[pair[0]!]!,
        b: m.vertices[pair[1]!]!,
        color: '#7253ab',
        name: 'line-plane',
      },
    ];
  } else {
    const normal: SpacePoint =
        kind === 'planes-intersecting'
          ? [0, 1, 0]
          : kind === 'planes-coincident'
            ? [0, 0, 2]
            : [0, 0, 1],
      offset = kind === 'planes-parallel' ? 4 : 0;
    answer = planeRelation([0, 0, 1], 0, normal, offset);
    faces = [
      { vertices: m.base },
      {
        vertices:
          kind === 'planes-intersecting'
            ? [m.vertices[0]!, m.vertices[1]!, m.vertices[5]!, m.vertices[4]!]
            : kind === 'planes-parallel'
              ? m.vertices.slice(4)
              : m.base,
        color: '#c39b51',
      },
    ];
  }
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '研究完整直线与平面，不只研究图中画出的有限棱段。坐标单位为cm。',
            'Study complete lines and planes, not just the finite drawn edge segments. Coordinates use centimetres.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('研究对象', 'Relationship case')}
        value={kind}
        change={setKind}
        values={relationshipOptions}
      />
      <Prediction
        key={kind}
        mode={mode}
        name={t('预测空间关系', 'Predict spatial relation')}
        answer={code(answer)}
        hint={t(
          '用intersecting/parallel/skew/coincident/contained；异面还需要不共面，图上不交不够。',
          'Use intersecting/parallel/skew/coincident/contained. Skew lines are noncoplanar; a drawing without a crossing is insufficient.',
        )}
        solution={t(
          `本例为${answer}。查看坐标并按完整直线的方向和共同点检验；一条线在平面内需要两个不同点在平面内。`,
          `This case is ${answer}. Audit directions and common points of full lines using coordinates. Two distinct points in a plane certify that their line lies in it.`,
        )}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SolidScene
        mode={mode}
        points={m.points}
        segments={[...m.segments, ...highlights]}
        faces={faces}
        view={view}
        reveal={reveal}
        caption={t(
          '紫/金线为所研究对象；有限面片代表可无限延伸的平面。换视角不会使异面线变成相交线。',
          'Purple/gold mark the studied objects. Finite patches represent unbounded planes. Changing the camera cannot turn skew lines into intersecting lines.',
        )}
      />
    </>
  );
}
function SolidsLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<'prism' | 'pyramid' | 'sphere'>('prism'),
    [n, setN] = useState('6'),
    [height, setHeight] = useState('6'),
    [shift, setShift] = useState('0'),
    [radius, setRadius] = useState('3'),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    m = solidCounts(kind, Number(n)),
    sphere = sphereMeasures(Number(radius)),
    volume =
      kind === 'sphere'
        ? `${textR(sphere.volumeCoefficient)}π`
        : textR(solidVolume(kind, 12, Number(height))),
    volumeAnswer: AnswerSpec =
      kind === 'sphere'
        ? {
            kind: 'pi-multiple',
            coefficient: textR(sphere.volumeCoefficient),
            value: volume,
            unit: 'cm³',
          }
        : number(volume, 'cm³');
  return (
    <>
      <Select
        mode={mode}
        name={t('立体类别', 'Solid type')}
        value={kind}
        change={(s) => setKind(s as typeof kind)}
        values={[
          ['prism', t('棱柱', 'Prism')],
          ['pyramid', t('棱锥', 'Pyramid')],
          ['sphere', t('球', 'Sphere')],
        ]}
      />
      {kind === 'sphere' ? (
        <Select
          mode={mode}
          name={t('半径r（cm）', 'Radius r (cm)')}
          value={radius}
          change={setRadius}
          values={numericOptions([1, 2, 3, 4])}
        />
      ) : (
        <>
          <Select
            mode={mode}
            name={t('底面边数n', 'Base side count n')}
            value={n}
            change={setN}
            values={numericOptions([3, 4, 5, 6])}
          />
          <Select
            mode={mode}
            name={t('垂直高h（cm）', 'Perpendicular height h (cm)')}
            value={height}
            change={setHeight}
            values={numericOptions([3, 4, 6])}
          />
          <Select
            mode={mode}
            name={t('上端水平错移（cm）', 'Top shear (cm)')}
            value={shift}
            change={setShift}
            values={numericOptions([0, 2])}
          />
          <p>B=12 cm²</p>
        </>
      )}
      <Prediction
        key={`faces/${kind}/${kind === 'sphere' ? '' : n}`}
        mode={mode}
        name={t('预测平面面数', 'Predict flat face count')}
        answer={number(String(m.faces))}
        hint={t(
          'n棱柱有n+2个平面面，n棱锥有n+1个；球的曲面不是平面面。',
          'An n-gonal prism has n+2 flat faces; an n-gonal pyramid has n+1. A spherical surface is not a flat face.',
        )}
        solution={t(`平面面数=${m.faces}。`, `Flat face count=${m.faces}.`)}
      />
      <Prediction
        key={`edges/${kind}/${kind === 'sphere' ? '' : n}`}
        mode={mode}
        name={t('预测棱数', 'Predict edge count')}
        answer={number(String(m.edges))}
        hint={t(
          '棱柱分两组底棱和一组侧棱；棱锥分底棱和侧棱。球面辅助圆不算棱。',
          'A prism has two sets of base edges and one set of lateral edges; a pyramid has two sets. Guide circles on a sphere are not edges.',
        )}
        solution={t(`棱数=${m.edges}。`, `Edge count=${m.edges}.`)}
      />
      <Prediction
        key={`volume/${kind}/${kind === 'sphere' ? radius : height}`}
        mode={mode}
        name={t('预测体积（cm³）', 'Predict volume (cm³)')}
        answer={volumeAnswer}
        hint={t(
          '棱柱Bh、棱锥Bh/3，h为垂直高；球用4πr³/3，保留π。',
          'Use Bh for a prism, Bh/3 for a pyramid with perpendicular h, or 4πr³/3 for a sphere. Retain π.',
        )}
        solution={t(
          `体积=${volume} cm³；侧棱或观察角度不替代垂直高。`,
          `Volume=${volume} cm³. Neither a lateral edge nor a viewing angle replaces perpendicular height.`,
        )}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <PolyhedronScene
        mode={mode}
        kind={kind}
        n={Number(n)}
        height={Number(height)}
        shift={Number(shift)}
        radius={Number(radius)}
        view={view}
        reveal={reveal}
      />
      {reveal && (
        <p>
          V={m.vertices}; E={m.edges}; F={m.faces}.{' '}
          <Text
            mode={mode}
            text={
              m.euler === null
                ? t(
                    '欧拉多面体公式不用于本课的球面计数。',
                    'The polyhedron Euler formula is not applied to these sphere counts.',
                  )
                : t(
                    'V−E+F=2，F包括所有平面面。',
                    'V−E+F=2, counting all flat faces.',
                  )
            }
          />
        </p>
      )}
    </>
  );
}
function SectionsLab({ mode }: { mode: LanguageMode }) {
  const [plane, setPlane] = useState('diagonal'),
    [offset, setOffset] = useState('6'),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    normal: SpacePoint =
      plane === 'horizontal'
        ? [0, 0, 1]
        : plane === 'edge'
          ? [1, 1, 0]
          : [1, 1, 1],
    m = cubeSection(4, normal, rational(BigInt(offset))),
    cube = cuboidScene(4, 4, 4),
    key = `${plane}/${offset}`,
    cut = m.points.map(exact3Number),
    cutSegments: SpaceSegment[] =
      cut.length >= 2
        ? cut.length === 2
          ? [{ a: cut[0]!, b: cut[1]!, color: '#258b7b', name: 'section-edge' }]
          : cut.map((a, i) => ({
              a,
              b: cut[(i + 1) % cut.length]!,
              color: '#258b7b',
              name: `section-${i}`,
            }))
        : [];
  return (
    <>
      <Select
        mode={mode}
        name={t('切平面方向', 'Cutting plane direction')}
        value={plane}
        change={setPlane}
        values={[
          ['horizontal', t('z=t', 'z=t')],
          ['diagonal', t('x+y+z=t', 'x+y+z=t')],
          ['edge', t('x+y=t', 'x+y=t')],
        ]}
      />
      <Select
        mode={mode}
        name={t('平面参数t', 'Plane parameter t')}
        value={offset}
        change={setOffset}
        values={numericOptions([-1, 0, 2, 4, 6, 8, 12, 14])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '正方体0≤x,y,z≤4 cm。空交集记0个顶点；点/线段分别记1/2个端点，不能都称为多边形。',
            'Cube bounds are 0≤x,y,z≤4 cm. Count zero vertices for an empty intersection and one/two endpoints for a point/segment; these are not all polygons.',
          )}
        />
      </p>
      <Prediction
        key={`vertices/${key}`}
        mode={mode}
        name={t('预测截面顶点数', 'Predict section vertex count')}
        answer={number(String(m.points.length))}
        hint={t(
          '找平面与12条棱的交点，重合顶点只计一次；含一条棱时保留两端。',
          'Intersect the plane with twelve edges, deduplicating common vertices. When a whole edge lies in the plane retain its endpoints.',
        )}
        solution={t(
          `不同顶点/端点数=${m.points.length}。`,
          `Distinct vertex/endpoint count=${m.points.length}.`,
        )}
      />
      <Prediction
        key={`area/${key}`}
        mode={mode}
        name={t('预测截面面积（cm²）', 'Predict section area (cm²)')}
        answer={radical(m.area)}
        hint={t(
          '面积需在真实切平面内求，不能量投影。点、线段或空集面积0；根式可用sqrt。',
          'Find area in the actual cutting plane, not its projection. Empty, point and segment intersections have area zero; use sqrt for radicals.',
        )}
        solution={t(
          `精确截面面积=${m.area} cm²。`,
          `Exact section area=${m.area} cm².`,
        )}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SolidScene
        mode={mode}
        points={[
          ...cube.points,
          ...cut.map((point, i) => ({ name: `P${i + 1}`, point })),
        ]}
        segments={[...cube.segments, ...cutSegments]}
        faces={
          cut.length >= 3
            ? [{ vertices: cut, color: '#37a491', name: 'exact-section' }]
            : []
        }
        view={view}
        reveal={false}
        caption={t(
          '绿色交线来自准确的棱/平面交点。相切点、相切棱和重合底面都保留，不伪造多边形。',
          'Green boundaries come from exact edge/plane intersections. Tangent vertices, tangent edges and coincident faces are retained without inventing polygons.',
        )}
      />
      {reveal && (
        <div
          className="math-concept-table"
          role="region"
          tabIndex={0}
          aria-label={word(mode, t('精确截面顶点', 'Exact section vertices'))}
        >
          <table>
            <thead>
              <tr>
                <th>P</th>
                <th>(x,y,z)</th>
              </tr>
            </thead>
            <tbody>
              {m.points.map((p, i) => (
                <tr key={i}>
                  <td>P{i + 1}</td>
                  <td>{exact3Text(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <Text
              mode={mode}
              text={t(
                `截面面积=${m.area} cm²；${m.dimension === 2 ? '二维交集' : m.dimension === 1 ? '线段' : m.dimension === 0 ? '一个点' : '空交集'}。`,
                `Section area=${m.area} cm²; ${m.dimension === 2 ? 'two-dimensional intersection' : m.dimension === 1 ? 'segment' : m.dimension === 0 ? 'one point' : 'empty intersection'}.`,
              )}
            />
          </p>
        </div>
      )}
    </>
  );
}
function NetsLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<keyof typeof solidNets>('cross'),
    [folded, setFolded] = useState(false),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    cells = solidNets[kind],
    m = foldCubeNet(cells),
    opposite = m.opposite(0);
  return (
    <>
      <Select
        mode={mode}
        name={t('六格排布', 'Six-square arrangement')}
        value={kind}
        change={(s) => setKind(s as typeof kind)}
        values={[
          ['cross', t('四格带与上下格', 'Four-square belt with two flaps')],
          ['stair', t('阶梯排布', 'Stair arrangement')],
          ['rectangle', t('2×3矩形', '2×3 rectangle')],
          ['strip', t('一行六格', 'Six in a row')],
        ]}
      />
      <Prediction
        key={`net/${kind}`}
        mode={mode}
        name={t('预测展开图是否有效', 'Predict net validity')}
        answer={code(m.valid ? 'valid-net' : 'invalid-net')}
        hint={t(
          '用valid-net或invalid-net。相连且六格还不够，折后每个面应占不同方向。',
          'Use valid-net or invalid-net. Six connected squares are insufficient; folded faces need distinct directions.',
        )}
        solution={t(
          `本排布${m.valid ? '有效' : '无效'}；不同面方向${m.uniqueNormals}个。`,
          `This arrangement is ${m.valid ? 'valid' : 'invalid'} with ${m.uniqueNormals} distinct face directions.`,
        )}
      />
      <Prediction
        key={`opposite/${kind}`}
        mode={mode}
        name={t(
          '预测1号对面编号（无效写undefined）',
          'Predict face opposite 1 (invalid: undefined)',
        )}
        answer={
          opposite === null ? code('undefined') : number(String(opposite))
        }
        hint={t(
          '跟踪面身份；相邻格共边，正对面折后法向相反，无效图没有唯一合法答案。',
          'Track face IDs: neighboring squares share an edge; opposite faces have opposite normals after folding. An invalid net has no valid unique answer.',
        )}
        solution={t(
          opposite === null
            ? '无效展开图：undefined。'
            : `1号正对${opposite}号。`,
          opposite === null
            ? 'Invalid net: undefined.'
            : `Face 1 is opposite face ${opposite}.`,
        )}
      />
      <button
        className="math-button"
        aria-pressed={folded}
        onClick={() => setFolded(!folded)}
      >
        <Text
          mode={mode}
          text={t('切换展开/折面核验', 'Toggle net/fold audit')}
        />
      </button>
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <NetScene
        mode={mode}
        cells={cells}
        folded={folded}
        view={view}
        reveal={reveal}
      />
    </>
  );
}
function CutsLab({ mode }: { mode: LanguageMode }) {
  const [part, setPart] = useState('section');
  return (
    <>
      <Select
        mode={mode}
        name={t('研究切面或展开', 'Study sections or nets')}
        value={part}
        change={setPart}
        values={[
          ['section', t('截面', 'Sections')],
          ['net', t('展开与折面', 'Nets and folding')],
        ]}
      />
      <section hidden={part !== 'section'}>
        <SectionsLab mode={mode} />
      </section>
      <section hidden={part !== 'net'}>
        <NetsLab mode={mode} />
      </section>
    </>
  );
}
const distanceOptions: [string, LocalizedText][] = [
  ['body', t('空间对角线AG', 'Space diagonal AG')],
  ['pointPlane', t('点G到平面ABCD', 'Point G to plane ABCD')],
  ['pointLine', t('点G到直线AB', 'Point G to line AB')],
  ['skewDistance', t('异面直线AB与CG', 'Skew lines AB and CG')],
];
function DistancesLab({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState('3'),
    [b, setB] = useState('4'),
    [h, setH] = useState('12'),
    [target, setTarget] =
      useState<
        keyof Pick<
          ReturnType<typeof spaceDistances>,
          'body' | 'pointPlane' | 'pointLine' | 'skewDistance'
        >
      >('body'),
    [angle, setAngle] = useState('plane'),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    m = spaceDistances(Number(a), Number(b), Number(h)),
    cube = cuboidScene(Number(a), Number(b), Number(h)),
    v = cube.vertices,
    ends =
      target === 'body'
        ? [0, 6]
        : target === 'pointPlane'
          ? [2, 6]
          : target === 'pointLine'
            ? [1, 6]
            : [1, 2],
    highlights: SpaceSegment[] = [
      {
        a: v[ends[0]!]!,
        b: v[ends[1]!]!,
        color: '#b17b22',
        name: 'shortest-segment',
      },
      { a: v[0]!, b: v[6]!, color: '#7354a7', name: 'AG' },
      {
        a: v[0]!,
        b: v[angle === 'plane' ? 2 : 1]!,
        color: '#278d7e',
        name: angle === 'plane' ? 'projection-AC' : 'AB',
      },
    ],
    key = `${a}/${b}/${h}`,
    distanceKey =
      target === 'skewDistance'
        ? b
        : target === 'pointPlane'
          ? h
          : target === 'pointLine'
            ? `${b}/${h}`
            : key;
  return (
    <>
      <Select
        mode={mode}
        name={t('底边a（cm）', 'Base edge a (cm)')}
        value={a}
        change={setA}
        values={numericOptions([3, 4, 6])}
      />
      <Select
        mode={mode}
        name={t('底边b（cm）', 'Base edge b (cm)')}
        value={b}
        change={setB}
        values={numericOptions([3, 4, 6])}
      />
      <Select
        mode={mode}
        name={t('高度h（cm）', 'Height h (cm)')}
        value={h}
        change={setH}
        values={numericOptions([3, 4, 12])}
      />
      <Select
        mode={mode}
        name={t('距离对象', 'Distance target')}
        value={target}
        change={(s) => setTarget(s as typeof target)}
        values={distanceOptions}
      />
      <Select
        mode={mode}
        name={t('角的对象', 'Angle target')}
        value={angle}
        change={setAngle}
        values={[
          ['plane', t('AG与底面ABCD', 'AG and base plane ABCD')],
          ['line', t('AG与AB', 'AG and AB')],
        ]}
      />
      <Prediction
        key={`base/${a}/${b}`}
        mode={mode}
        name={t('预测底面对角线AC（cm）', 'Predict base diagonal AC (cm)')}
        answer={radical(m.base)}
        hint={t(
          '先在底面用a²+b²，不包含高度。',
          'First use a²+b² in the base, excluding height.',
        )}
        solution={t(`AC=${m.base} cm。`, `AC=${m.base} cm.`)}
      />
      <Prediction
        key={`distance/${target}/${distanceKey}`}
        mode={mode}
        name={t('预测所求距离（cm）', 'Predict target distance (cm)')}
        answer={radical(m[target])}
        hint={t(
          '找垂足或公垂线；AG、GC、GB、BC描述不同距离。根式可用sqrt。',
          'Find a perpendicular foot or common perpendicular. AG, GC, GB and BC represent different distances. Use sqrt for radicals.',
        )}
        solution={t(
          `本距离=${m[target]} cm，最短线段两端必须属于题设对象。`,
          `Distance=${m[target]} cm. The shortest segment must have endpoints on the requested objects.`,
        )}
      />
      <Prediction
        key={`angle/${angle}/${key}`}
        mode={mode}
        name={t(
          '预测所求锐角的cos',
          'Predict cosine of the requested acute angle',
        )}
        answer={radical(angle === 'plane' ? m.linePlaneCos : m.lineLineCos)}
        hint={t(
          '线面角取AG与其底面投影AC；线线角取AG与AB。不能用屏幕角度或竖直线代替。',
          'Use AG and its projection AC for a line-plane angle, or AG and AB for the line-line angle. Neither the screen angle nor vertical line substitutes.',
        )}
        solution={t(
          `cos=${angle === 'plane' ? m.linePlaneCos : m.lineLineCos}。`,
          `cos=${angle === 'plane' ? m.linePlaneCos : m.lineLineCos}.`,
        )}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SolidScene
        mode={mode}
        points={cube.points}
        segments={[...cube.segments, ...highlights]}
        faces={[{ vertices: cube.base }]}
        view={view}
        reveal={reveal}
        caption={t(
          '紫为AG，青为角的另一边，金为所求距离的最短线段。GC垂直底面；AB与CG的公垂线为BC。',
          'Purple is AG, teal the other angle ray, gold the shortest segment for the target distance. GC is perpendicular to the base; BC is a common perpendicular to AB and CG.',
        )}
      />
    </>
  );
}
const boxFaces = (v: SpacePoint[]) =>
  [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 1, 5, 4],
    [1, 2, 6, 5],
    [2, 3, 7, 6],
    [3, 0, 4, 7],
  ].map((indices) => ({ vertices: indices.map((i) => v[i]!) }));
function CompoundLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<'top' | 'full-width' | 'side' | 'gap'>(
      'top',
    ),
    [scale, setScale] = useState('1'),
    [view, setView] = useState(0),
    [reveal, setReveal] = useState(false),
    m = compoundCase(kind, Number(scale)),
    av = boxVertices(m.a),
    bv = boxVertices(m.b),
    s = Number(scale),
    y = kind === 'full-width' ? 4 : 2,
    contact: SpacePoint[] =
      kind === 'gap'
        ? []
        : (kind === 'side'
            ? [
                [6, 0, 0],
                [6, 2, 0],
                [6, 2, 2],
                [6, 0, 2],
              ]
            : [
                [0, 0, 2],
                [3, 0, 2],
                [3, y, 2],
                [0, y, 2],
              ]
          ).map((p) => p.map((x) => x * s) as unknown as SpacePoint),
    key = `${kind}/${scale}`;
  return (
    <>
      <Select
        mode={mode}
        name={t('拼合方式', 'Assembly case')}
        value={kind}
        change={(v) => setKind(v as typeof kind)}
        values={[
          ['top', t('小块放顶面', 'Small block on top')],
          ['full-width', t('顶块跨满宽', 'Top block across full width')],
          ['side', t('小块放侧边', 'Small block at the side')],
          ['gap', t('两块分开', 'Separated blocks')],
        ]}
      />
      <Select
        mode={mode}
        name={t('所有长度放大倍率', 'Scale of every length')}
        value={scale}
        change={setScale}
        values={numericOptions([1, 2, 3])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `底块${m.a.size.join('×')} cm；第二块${m.b.size.join('×')} cm。完整面接触，不穿入，不计胶缝。`,
            `Base block ${m.a.size.join('×')} cm; second block ${m.b.size.join('×')} cm. Contact is flush without interpenetration; glue thickness is ignored.`,
          )}
        />
      </p>
      <Prediction
        key={`volume/${kind === 'full-width' ? 'wide' : 'small'}/${scale}`}
        mode={mode}
        name={t('预测总体积（cm³）', 'Predict total volume (cm³)')}
        answer={number(String(m.volume), 'cm³')}
        hint={t(
          '内部不重叠，两个体积相加；接触面不占体积。长度倍数的三次方作用于体积。',
          'With disjoint interiors add both volumes; a contact face has zero volume. Volume scales by the cube of the length factor.',
        )}
        solution={t(
          `总体积=${m.volume} cm³。`,
          `Total volume=${m.volume} cm³.`,
        )}
      />
      <Prediction
        key={`contact/${key}`}
        mode={mode}
        name={t('预测接触面积（cm²）', 'Predict contact area (cm²)')}
        answer={number(String(m.contact), 'cm²')}
        hint={t(
          '只算实际重合的面片，分开放时为0。面积按长度倍率平方变化。',
          'Count only the actually coincident face patch, or zero for separated blocks. Area scales with the square of the length factor.',
        )}
        solution={t(
          `接触面积=${m.contact} cm²。`,
          `Contact area=${m.contact} cm².`,
        )}
      />
      <Prediction
        key={`surface/${key}`}
        mode={mode}
        name={t('预测外露总面积（cm²）', 'Predict exposed surface area (cm²)')}
        answer={number(String(m.surface), 'cm²')}
        hint={t(
          '两个完整表面积之和，减去两份接触面积；埋住的两个面片都不涂。',
          'Add both full surface areas and subtract twice the contact area; neither buried patch is painted.',
        )}
        solution={t(
          `${m.sumSurface}−2×${m.contact}=${m.surface} cm²。`,
          `${m.sumSurface}−2×${m.contact}=${m.surface} cm².`,
        )}
      />
      <View
        mode={mode}
        view={view}
        setView={setView}
        reveal={reveal}
        setReveal={setReveal}
      />
      <SolidScene
        mode={mode}
        faces={[
          ...boxFaces(av),
          ...boxFaces(bv).map((f) => ({ ...f, color: '#d0a456' })),
          ...(contact.length
            ? [{ vertices: contact, color: '#238b7b', name: 'buried-contact' }]
            : []),
        ]}
        points={[
          { name: 'A', point: av[0]! },
          { name: 'T', point: bv[6]! },
        ]}
        view={view}
        reveal={reveal}
        caption={t(
          '透明图显示两块及绿色接触片；绿色片埋在内部，不属于外露涂色面。分开两块时所有表面均外露。',
          'Transparent blocks reveal a green contact patch. It is buried, not an exposed painted surface. Separated blocks expose their complete surfaces.',
        )}
      />
      {reveal && (
        <p>
          V={m.volume} cm³; S={m.sumSurface}−2×{m.contact}={m.surface} cm².
        </p>
      )}
    </>
  );
}
export function SolidLab({
  kind,
  mode,
}: {
  kind: SolidLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'solid-relations' ? (
        <RelationsLab mode={mode} />
      ) : kind === 'solid-types' ? (
        <SolidsLab mode={mode} />
      ) : kind === 'solid-sections' ? (
        <CutsLab mode={mode} />
      ) : kind === 'solid-distances' ? (
        <DistancesLab mode={mode} />
      ) : (
        <CompoundLab mode={mode} />
      )}
    </div>
  );
}
export function SolidHookArt({
  kind,
  mode,
}: {
  kind: SolidLabKind;
  mode: LanguageMode;
}) {
  if (kind === 'solid-types')
    return (
      <PolyhedronScene mode={mode} kind="pyramid" n={4} height={6} shift={2} />
    );
  if (kind === 'solid-sections')
    return <NetScene mode={mode} cells={solidNets.rectangle} folded={false} />;
  if (kind === 'solid-composite') {
    const m = compoundCase(),
      a = boxVertices(m.a),
      b = boxVertices(m.b);
    return (
      <SolidScene
        mode={mode}
        faces={[
          ...boxFaces(a),
          ...boxFaces(b).map((f) => ({ ...f, color: '#d0a456' })),
        ]}
        caption={t(
          '顶块仅覆盖大块顶面的一部分；先标接触片，再分别讨论体积与外露面。',
          'The upper block covers only part of the large top. Identify the contact patch before separating volume and exposed area.',
        )}
      />
    );
  }
  const m = cuboidScene(
      kind === 'solid-distances' ? 3 : 4,
      kind === 'solid-distances' ? 4 : 3,
      kind === 'solid-distances' ? 12 : 4,
    ),
    v = m.vertices;
  return (
    <SolidScene
      mode={mode}
      points={m.points}
      segments={[
        ...m.segments,
        ...(kind === 'solid-distances'
          ? [
              { a: v[0]!, b: v[6]!, color: '#7555a8', name: 'AG' },
              { a: v[0]!, b: v[2]!, color: '#26897a', name: 'AC' },
            ]
          : [
              { a: v[0]!, b: v[1]!, color: '#7555a8', name: 'AB' },
              { a: v[2]!, b: v[6]!, color: '#b3791e', name: 'CG' },
            ]),
      ]}
      faces={[{ vertices: m.base }]}
      caption={
        kind === 'solid-distances'
          ? t(
              '同一长方体有路径、直线段和垂直距离；先辨认所问对象。',
              'One cuboid offers routes, straight segments and perpendicular distances. Identify the requested object first.',
            )
          : t(
              'AB与CG研究完整直线；投影中的相交或分离不替代共面条件。',
              'Study full lines AB and CG. Crossing or separation in projection does not replace a coplanarity check.',
            )
      }
    />
  );
}
