import { useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import {
  LabMetric,
  LabOptions,
  useComparisons,
  type LabProps,
} from './LabControls';
import { useAnimation } from './useSimulation';
import {
  pointShadow,
  shadowCases,
  reflection,
  planeMirror,
  refraction,
  refractionCases,
  thinLens,
  lensCases,
  eyeFocus,
  eyeCases,
  colourBands,
  colourCases,
  prismRay,
  prismVertices,
  prismEntry,
  transmittedBands,
  pointOnPath,
  type Point,
} from './lightModels';
type Kind =
  'shadow' | 'reflection' | 'mirror' | 'refraction' | 'lens' | 'colour' | 'eye';
type Pair = [string, string];
const words = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const n = (v: number) => v.toFixed(2);
const angle = (v: number) => (v * Math.PI) / 180;
const ink = '#aa90bb',
  gold = '#c49a5f',
  teal = '#81aa9a';
const pathString = (p: Point[]) => p.map((q) => `${q.x},${q.y}`).join(' ');
function Ray({
  path,
  colour = gold,
  dotted = false,
}: {
  path: Point[];
  colour?: string;
  dotted?: boolean;
}) {
  const middle = pointOnPath(path, 0.68),
    before = pointOnPath(path, 0.66),
    turn =
      (Math.atan2(middle.y - before.y, middle.x - before.x) * 180) / Math.PI;
  return (
    <g>
      <polyline
        points={pathString(path)}
        stroke={colour}
        strokeWidth="2.5"
        fill="none"
        strokeDasharray={dotted ? '5 5' : undefined}
      />
      {!dotted && (
        <path
          d="M-7-4 0 0-7 4"
          transform={`translate(${middle.x} ${middle.y}) rotate(${turn})`}
          fill="none"
          stroke={colour}
          strokeWidth="2"
        />
      )}
    </g>
  );
}
function Trace({ paths, progress }: { paths: Point[][]; progress: number }) {
  return (
    <g>
      {paths.map((path, i) => {
        const p = pointOnPath(path, progress);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill={teal}
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}
function Arrow({
  x,
  base,
  tip,
  virtual = false,
}: {
  x: number;
  base: number;
  tip: number;
  virtual?: boolean;
}) {
  return (
    <g
      stroke={virtual ? ink : teal}
      strokeWidth="4"
      strokeDasharray={virtual ? '4 3' : undefined}
    >
      <path d={`M${x} ${base}V${tip}`} />
      <path
        d={`M${x - 6} ${tip + (tip < base ? 8 : -8)}L${x} ${tip}l6 ${tip < base ? 8 : -8}`}
        fill="none"
      />
    </g>
  );
}
function Arc({
  start,
  end,
  below = false,
  radius = 46,
}: {
  start: number;
  end: number;
  below?: boolean;
  radius?: number;
}) {
  const p = (a: number) => ({
    x: 310 + radius * Math.sin(angle(a)),
    y: 190 + (below ? 1 : -1) * radius * Math.cos(angle(a)),
  });
  const a = p(start),
    b = p(end);
  return (
    <path
      d={`M${a.x} ${a.y}A${radius} ${radius} 0 0 ${below ? 0 : 1} ${b.x} ${b.y}`}
      fill="none"
      stroke={gold}
      strokeWidth="2"
    />
  );
}
function RayFrame({
  mode,
  label,
  children,
  tall = false,
}: {
  mode: LanguageMode;
  label: Pair;
  children: ReactNode;
  tall?: boolean;
}) {
  return (
    <svg
      viewBox={`0 0 620 ${tall ? 420 : 330}`}
      role="img"
      aria-label={words(mode, ...label)}
    >
      {children}
    </svg>
  );
}
function ShadowScene({
  mode,
  distance,
  height,
  progress,
}: {
  mode: LanguageMode;
  distance: number;
  height: number;
  progress: number;
}) {
  const s = pointShadow(distance, height),
    x = 70 + distance * 75,
    cy = 165,
    half = height * 26;
  const upper = [
      { x: 70, y: cy },
      { x, y: cy - half },
      { x: 520, y: cy - s.shadowHeight * 26 },
    ],
    lower = [
      { x: 70, y: cy },
      { x, y: cy + half },
      { x: 520, y: cy + s.shadowHeight * 26 },
    ];
  return (
    <RayFrame
      mode={mode}
      label={[
        '点光源、物体与固定屏幕的边界光路',
        'Boundary rays from a point source past an object to a fixed screen',
      ]}
    >
      <path d="M70 165H520" stroke="#ddd2e4" strokeDasharray="4 5" />
      <path d="M520 35V295" stroke="#ded4e6" strokeWidth="10" />
      <path
        d={`M520 ${cy - s.shadowHeight * 26}V${cy + s.shadowHeight * 26}`}
        stroke="#93869c"
        strokeWidth="10"
      />
      <path
        d={`M${x} ${cy - half}V${cy + half}`}
        stroke={ink}
        strokeWidth="10"
      />
      <Ray path={upper} />
      <Ray path={lower} />
      <Ray
        path={[
          { x: 70, y: cy },
          { x: x - 6, y: cy },
        ]}
        colour="#d9c5a3"
      />
      <circle cx="70" cy={cy} r="9" fill={gold} />
      <Trace paths={[upper, lower]} progress={progress} />
      <text x="70" y="28">
        {words(mode, '点光源', 'Point source')}
      </text>
      <text x={x} y="305" textAnchor="middle">
        {distance} m
      </text>
      <text x="520" y="315" textAnchor="middle">
        {words(mode, '屏幕 6 m', 'Screen 6 m')}
      </text>
      <text x={x + 15} y={cy + 6}>
        {height} m
      </text>
      <text x="605" y={cy + 6} textAnchor="end">
        {n(s.shadowHeight)} m
      </text>
    </RayFrame>
  );
}
function ReflectionScene({
  mode,
  incidence,
  progress,
  water = false,
  fromWater = false,
}: {
  mode: LanguageMode;
  incidence: number;
  progress: number;
  water?: boolean;
  fromWater?: boolean;
}) {
  const r = refraction(incidence, fromWater),
    a = angle(incidence),
    len = 152;
  const start = { x: 310 - len * Math.sin(a), y: 190 - len * Math.cos(a) },
    hit = { x: 310, y: 190 },
    reflected = { x: 310 + len * Math.sin(a), y: 190 - len * Math.cos(a) };
  const out =
    r.transmitted === undefined
      ? undefined
      : {
          x: 310 + len * Math.sin(angle(r.transmitted)),
          y: 190 + len * Math.cos(angle(r.transmitted)),
        };
  const paths =
    water && !r.totalReflection && out
      ? [[start, hit, out]]
      : [[start, hit, reflected]];
  return (
    <RayFrame
      mode={mode}
      tall={water}
      label={
        water
          ? [
              '平界面折射，角度均从法线量起',
              'Refraction at one flat boundary, all angles measured from the normal',
            ]
          : [
              '平面镜反射与垂直法线的角度',
              'Plane-mirror reflection angles measured from the perpendicular normal',
            ]
      }
    >
      {water && (
        <>
          <rect
            x="30"
            y="190"
            width="560"
            height="215"
            fill={fromWater ? '#faf7fc' : '#eaf3f3'}
          />
          <text x="42" y="42">
            {words(
              mode,
              fromWater ? '水 n=1.333' : '空气 n=1',
              fromWater ? 'Water n=1.333' : 'Air n=1',
            )}
          </text>
          <text x="42" y="385">
            {words(
              mode,
              fromWater ? '空气 n=1' : '水 n=1.333',
              fromWater ? 'Air n=1' : 'Water n=1.333',
            )}
          </text>
        </>
      )}
      <path d="M35 190H585" stroke={water ? '#91b4ba' : ink} strokeWidth="4" />
      {!water && <path d="M35 198H585" stroke="#ded2e7" strokeWidth="7" />}
      <path
        d={`M310 33V${water ? 375 : 235}`}
        stroke="#b7adbF"
        strokeDasharray="5 5"
      />
      <Ray path={[start, hit]} />
      <Ray
        path={[hit, reflected]}
        colour={water && !r.totalReflection ? '#d5c8b1' : gold}
      />
      {water && out && <Ray path={[hit, out]} colour={teal} />}
      <Arc start={-incidence} end={0} />
      {(!water || r.totalReflection) && <Arc start={0} end={incidence} />}
      {water && r.transmitted !== undefined && (
        <Arc start={0} end={r.transmitted} below />
      )}
      <text x="323" y="28">
        {words(mode, '法线', 'Normal')}
      </text>
      <text x="250" y="166" textAnchor="end">
        {incidence}°
      </text>
      <text x="372" y={water && !r.totalReflection ? 240 : 166}>
        {water && !r.totalReflection ? n(r.transmitted!) : incidence}°
      </text>
      <Trace paths={paths} progress={progress} />
      {water && r.totalReflection && (
        <text x="310" y="350" textAnchor="middle">
          {words(
            mode,
            '全反射：没有透射光线',
            'Total reflection: no transmitted ray',
          )}
        </text>
      )}
    </RayFrame>
  );
}
function MirrorScene({
  mode,
  distance,
  progress,
}: {
  mode: LanguageMode;
  distance: number;
  progress: number;
}) {
  const ox = 310 - distance * 200,
    ix = 310 + distance * 200,
    tip = { x: ox, y: 104 };
  const hits = [
    { x: 310, y: 160 },
    { x: 310, y: 216 },
  ];
  const paths = hits.map((h) => {
    const dx = Math.min(265, ((310 - h.y) * (ix - 310)) / (h.y - 104));
    return [tip, h, { x: 310 - dx, y: h.y + ((h.y - 104) * dx) / (ix - 310) }];
  });
  return (
    <RayFrame
      mode={mode}
      tall
      label={[
        '平面镜的实线反射路径与虚线向后延长',
        'Solid plane-mirror reflection paths and dashed backward extensions',
      ]}
    >
      <rect x="310" y="36" width="285" height="350" fill="#f0eaf5" />
      <path d="M310 38V344" stroke={ink} strokeWidth="5" />
      <path d="M45 150H585" stroke="#d9cfe0" strokeDasharray="4 5" />
      <Arrow x={ox} base={150} tip={104} />
      <Arrow x={ix} base={150} tip={104} virtual />
      {paths.map((p, i) => (
        <Ray key={i} path={p} />
      ))}
      {hits.map((h, i) => (
        <Ray key={i} path={[h, { x: ix, y: 104 }]} dotted />
      ))}
      <Trace paths={paths} progress={progress} />
      <text x={ox} y="78" textAnchor="middle">
        {words(mode, '物', 'Object')}
      </text>
      <text x={ix} y="78" textAnchor="middle">
        {words(mode, '虚像', 'Virtual')}
      </text>
      <text x="310" y="377" textAnchor="middle">
        {words(
          mode,
          '虚线不是光穿过镜子',
          'Dashed lines are not light through the mirror',
        )}
      </text>
      <text x={(ox + 310) / 2 - 14} y="325" textAnchor="middle">
        {n(distance)} m
      </text>
      <text x={(ix + 310) / 2 + 14} y="325" textAnchor="middle">
        {n(distance)} m
      </text>
    </RayFrame>
  );
}
function LensScene({
  mode,
  object,
  focal,
  progress,
  eye = false,
}: {
  mode: LanguageMode;
  object: number;
  focal: number;
  progress: number;
  eye?: boolean;
}) {
  const lens = thinLens(object, focal),
    axis = 190,
    scale = 70,
    x = 320,
    oh = 24.5,
    tip = { x: x - object * scale, y: axis - oh };
  const e = eyeFocus(object, focal),
    retinaX = x + 1.5 * scale;
  const to = eye ? 1.5 : 3.7,
    centreEnd = { x: x + to * scale, y: axis + (oh * to) / object },
    parallelEnd = { x: x + to * scale, y: axis - oh + (oh * to) / focal };
  const paths = [
    [tip, { x, y: axis }, centreEnd],
    [tip, { x, y: axis - oh }, parallelEnd],
  ];
  const ix = lens.image === undefined ? undefined : x + lens.image * scale,
    iy =
      lens.magnification === undefined
        ? undefined
        : axis - oh * lens.magnification;
  return (
    <RayFrame
      mode={mode}
      tall
      label={
        eye
          ? [
              '固定视网膜上的两个光线交点、放大线索与焦距变化',
              'Two ray intersections at a fixed retina, enlarged cue and focal changes',
            ]
          : [
              '凸薄透镜的两条主光线，实像与虚像',
              'Two principal rays of a thin converging lens, real and virtual images',
            ]
      }
    >
      <path d="M30 190H595" stroke="#d7cdda" strokeDasharray="4 5" />
      <path
        d="M320 52Q345 190 320 330Q295 190 320 52"
        fill="#e6eff0"
        stroke="#8daeb2"
        strokeWidth="2"
      />
      {[x - focal * scale, x + focal * scale].map((fx, i) => (
        <g key={i}>
          <circle cx={fx} cy={axis} r="3" fill={ink} />
          <text x={fx} y="220" textAnchor="middle">
            F
          </text>
        </g>
      ))}
      <Arrow x={tip.x} base={axis} tip={tip.y} />
      <text x={tip.x} y={tip.y - 24} textAnchor="middle">
        {words(mode, '物体', 'Object')}
      </text>
      {paths.map((p, i) => (
        <Ray key={i} path={p} colour={i ? gold : ink} />
      ))}
      {eye && !e.focused && ix !== undefined && iy !== undefined && (
        <>
          <Ray path={[centreEnd, { x: ix, y: iy }]} dotted />
          <Ray path={[parallelEnd, { x: ix, y: iy }]} dotted />
        </>
      )}
      {!lens.real && ix !== undefined && iy !== undefined && (
        <>
          <Ray
            path={[
              { x, y: axis },
              { x: ix, y: iy },
            ]}
            dotted
          />
          <Ray
            path={[
              { x, y: axis - oh },
              { x: ix, y: iy },
            ]}
            dotted
          />
        </>
      )}
      {ix !== undefined && iy !== undefined && (
        <>
          <Arrow
            x={ix}
            base={axis}
            tip={iy}
            virtual={!lens.real || (eye && !e.focused)}
          />
          <text
            x={ix}
            y={iy < axis ? iy - 15 : eye ? 290 : 285}
            textAnchor="middle"
          >
            {words(
              mode,
              eye ? '理想成像位置' : lens.real ? '实像' : '虚像',
              eye
                ? 'Lens image position'
                : lens.real
                  ? 'Real image'
                  : 'Virtual image',
            )}
          </text>
        </>
      )}
      {eye && (
        <>
          <path d={`M${retinaX} 85V315`} stroke={teal} strokeWidth="6" />
          <circle cx={retinaX} cy={axis - oh * e.centre} r="5" fill={ink} />
          <circle cx={retinaX} cy={axis - oh * e.parallel} r="5" fill={gold} />
          <text x={retinaX} y="352" textAnchor="middle">
            {words(mode, '固定视网膜', 'Fixed retina')}
          </text>
          <rect
            x="465"
            y="55"
            width="140"
            height="115"
            rx="9"
            fill="#f8f5fa"
            stroke="#ded4e6"
          />
          <text x="535" y="80" textAnchor="middle">
            {words(mode, '放大线索', 'Zoomed cue')}
          </text>
          <path d="M535 93V153" stroke={teal} strokeWidth="3" />
          <circle
            cx="535"
            cy={125 - (e.centre - (e.centre + e.parallel) / 2) * 160}
            r="5"
            fill={ink}
          />
          <circle
            cx="535"
            cy={125 - (e.parallel - (e.centre + e.parallel) / 2) * 160}
            r="5"
            fill={gold}
          />
        </>
      )}
      {!eye && lens.real && ix !== undefined && (
        <path
          d={`M${ix} 158V272`}
          stroke={teal}
          strokeWidth="2"
          strokeDasharray="3 4"
        />
      )}
      <Trace paths={paths} progress={progress} />
      <text x="45" y="393">
        {words(
          mode,
          '模型长度单位 · 实线为光路',
          'Model length units · Solid lines carry light',
        )}
      </text>
    </RayFrame>
  );
}
function ColourScene({
  mode,
  source,
  filter,
  progress,
}: {
  mode: LanguageMode;
  source: readonly boolean[];
  filter: 'none' | 'red' | 'blue';
  progress: number;
}) {
  const passed = transmittedBands(source, filter);
  const beamColour = (bands: readonly boolean[]) =>
    bands.every(Boolean)
      ? '#bfb1ce'
      : bands[0] && bands[1]
        ? '#c7ab60'
        : bands[0]
          ? colourBands[0].colour
          : colourBands[2].colour;
  return (
    <RayFrame
      mode={mode}
      tall
      label={[
        '同方向入射的三色带在棱镜两次折射后分开',
        'Three bands entering in the same direction separate after two prism refractions',
      ]}
    >
      <polygon
        points={pathString(prismVertices)}
        fill="#e9e2f1"
        stroke={ink}
        strokeWidth="2"
      />
      <path
        d="M130 80V167"
        stroke={
          filter === 'red'
            ? colourBands[0].colour
            : filter === 'blue'
              ? colourBands[2].colour
              : '#d9d0e0'
        }
        strokeWidth="8"
      />
      <text x="130" y="57" textAnchor="middle">
        {words(mode, '滤片', 'Filter')}
      </text>
      <Ray
        path={[
          { x: 35, y: prismEntry.y },
          { x: 130, y: prismEntry.y },
        ]}
        colour={beamColour(source)}
      />
      {passed.some(Boolean) && (
        <Ray
          path={[{ x: 130, y: prismEntry.y }, prismEntry]}
          colour={beamColour(passed)}
        />
      )}
      {passed.map((present, i) => {
        if (!present) return null;
        const r = prismRay(colourBands[i]!.n),
          p = [{ x: 130, y: prismEntry.y }, prismEntry, r.exit, r.end];
        return (
          <g key={i}>
            <Ray
              path={[prismEntry, r.exit, r.end]}
              colour={colourBands[i]!.colour}
            />
            <Trace paths={[p]} progress={progress} />
            <circle
              cx={r.end.x}
              cy={r.end.y}
              r="4"
              fill={colourBands[i]!.colour}
            />
          </g>
        );
      })}
      {!passed.some(Boolean) && (
        <text x="410" y="286" textAnchor="middle">
          {words(mode, '无透射色带', 'No transmitted bands')}
        </text>
      )}
      <text x="307" y="250" textAnchor="middle">
        {words(mode, '60°棱镜', '60° prism')}
      </text>
      <text x="45" y="398">
        {words(
          mode,
          '示意三色带；真实白光是宽光谱',
          'Three representative bands; white light has a broad spectrum',
        )}
      </text>
    </RayFrame>
  );
}
const labels: Record<Kind, Pair> = {
  shadow: ['影子边界光路', 'Shadow boundary rays'],
  reflection: ['两角从法线量', 'Two angles from the normal'],
  mirror: ['寻找表观来源', 'Locate the apparent source'],
  refraction: ['跨过一道界面', 'Cross one boundary'],
  lens: ['真正交会，还是向后延长？', 'Real meeting or backward construction?'],
  colour: ['分开已有的成分', 'Separate existing components'],
  eye: ['把光对到视网膜', 'Focus on the retina'],
};
const conditions: Record<Kind, Pair> = {
  shadow: [
    '点光源、完全不透明物体、均匀透明介质；物体和屏幕平行，屏距6 m。无半影/衍射。',
    'Point source, opaque object, uniform transparent medium; object parallel to screen at 6 m. No penumbra/diffraction.',
  ],
  reflection: [
    '二维平滑理想镜面；角度从法线量。不计算散射、吸收或亮度。',
    'Two-dimensional ideal smooth mirror; angles from the normal. No scattering, absorption or intensity prediction.',
  ],
  mirror: [
    '理想平面镜，物和像等高等距。向后延长线没有真实光；示意选取两条反射路径，不规定观察者位置。',
    'Ideal plane mirror with equal heights/distances. Backward extensions carry no real light; two illustrative reflected paths do not fix an observer position.',
  ],
  refraction: [
    '单个平界面，空气n=1、水n=1.333，近似单色。淡线提醒部分反射，不代表功率比例。全反射时省略倏逝场。',
    'One flat interface, air n=1, water n=1.333, approximately monochromatic. Faint reflection is not a power ratio. Evanescent fields are omitted in total reflection.',
  ],
  lens: [
    '理想凸薄透镜，近轴单色近似；同一坐标比例、任意模型长度单位。负像距表示物体侧；无像差和亮度预测。',
    'Ideal converging thin lens, paraxial monochromatic approximation; shared coordinate scale and arbitrary model units. Negative image distance is on the object side. No aberration/intensity prediction.',
  ],
  colour: [
    '60°透明棱镜，入射45°；代表红绿蓝色带n=1.51/1.52/1.53，两次折射计算。滤片完全通过指定色带、吸收其余。没有波长转换；这不是完整雨滴模型。',
    'Transparent 60° prism, 45° incidence; representative RGB indices 1.51/1.52/1.53 and two computed refractions. Ideal filters transmit selected bands and absorb others. No wavelength conversion; not a complete raindrop model.',
  ],
  eye: [
    '整个眼的折射合并为一个凸薄透镜，模型视网膜距离固定1.5并接收光。其后虚线只延长方向，表示若没有屏幕遮挡的理想成像位置。两条光来自同一物点；交点间距不是实际模糊直径。这不是视力检查。',
    'Eye refraction represented by one converging thin lens; retina receives light at fixed distance 1.5. Beyond it, dashed directions locate the ideal image if no screen intercepted the rays. Two rays from one object point; separation is not an actual blur diameter. Not a vision test.',
  ],
};
function LightLab({ mode, onExplore, kind }: LabProps & { kind: Kind }) {
  const [choice, setChoice] = useState(0),
    [customAngle, setCustomAngle] = useState<number | undefined>(),
    [filter, setFilter] = useState<'none' | 'red' | 'blue'>('none');
  const [records, setRecords] = useState<number[]>([]),
    [probe, setProbe] = useState(0);
  const gate = useComparisons(['0', '1', '2'], onExplore),
    animation = useAnimation(2.2, () => {
      setProbe(1);
      if (customAngle === undefined && filter === 'none') {
        setRecords((prev) => [...new Set([...prev, choice])]);
        gate.record(String(choice));
      }
    });
  const progress = animation.running ? animation.time / 2.2 : probe;
  const choose = (v: number) => {
    animation.reset();
    setProbe(0);
    setChoice(v);
    setCustomAngle(undefined);
    setFilter('none');
  };
  let options: Pair[],
    scene: ReactNode,
    metrics: { title: Pair; value: ReactNode }[],
    columns: Pair[],
    row: (i: number) => ReactNode[];
  const d = shadowCases[choice]!,
    l = lensCases[choice]!,
    e = eyeCases[choice]!,
    r = refractionCases[choice]!;
  const incidence =
    customAngle ??
    (kind === 'refraction' ? r.incidence : [20, 45, 60][choice]!);
  if (kind === 'shadow') {
    options = [
      ['1 m · 距灯2 m', '1 m · 2 m from source'],
      ['1 m · 距灯3 m', '1 m · 3 m from source'],
      ['2 m · 距灯3 m', '2 m · 3 m from source'],
    ];
    const m = pointShadow(d.distance, d.height);
    scene = <ShadowScene mode={mode} {...d} progress={progress} />;
    metrics = [
      { title: ['物体高度', 'Object height'], value: `${d.height} m` },
      { title: ['屏幕影高', 'Shadow height'], value: `${n(m.shadowHeight)} m` },
      { title: ['灯到物体', 'Source → object'], value: `${d.distance} m` },
    ];
    columns = [
      ['物高', 'Object height'],
      ['物距', 'Object distance'],
      ['影高', 'Shadow height'],
    ];
    row = (i) => {
      const c = shadowCases[i]!;
      return [
        `${c.height} m`,
        `${c.distance} m`,
        `${n(pointShadow(c.distance, c.height).shadowHeight)} m`,
      ];
    };
  } else if (kind === 'reflection') {
    options = [
      ['20°', '20°'],
      ['45°', '45°'],
      ['60°', '60°'],
    ];
    scene = (
      <ReflectionScene mode={mode} incidence={incidence} progress={progress} />
    );
    const m = reflection(incidence);
    metrics = [
      { title: ['入射角', 'Incidence'], value: `${incidence}°` },
      { title: ['反射角', 'Reflection'], value: `${m.reflected}°` },
      { title: ['与镜面夹角', 'Angle to surface'], value: `${m.toSurface}°` },
    ];
    columns = [
      ['入射', 'Incidence'],
      ['反射', 'Reflection'],
      ['与镜面', 'To surface'],
    ];
    row = (i) => {
      const a = [20, 45, 60][i]!;
      return [`${a}°`, `${a}°`, `${90 - a}°`];
    };
  } else if (kind === 'mirror') {
    options = [
      ['0.40 m', '0.40 m'],
      ['0.60 m', '0.60 m'],
      ['0.80 m', '0.80 m'],
    ];
    const distance = [0.4, 0.6, 0.8][choice]!,
      m = planeMirror(distance);
    scene = <MirrorScene mode={mode} distance={distance} progress={progress} />;
    metrics = [
      { title: ['物距', 'Object distance'], value: `${n(distance)} m` },
      {
        title: ['像距（镜后）', 'Image distance (behind)'],
        value: `${n(m.imageDistance)} m`,
      },
      {
        title: ['物与像间距', 'Object–image separation'],
        value: `${n(m.separation)} m`,
      },
    ];
    columns = [
      ['物距', 'Object distance'],
      ['像距', 'Image distance'],
      ['总间距', 'Separation'],
    ];
    row = (i) => {
      const v = [0.4, 0.6, 0.8][i]!;
      return [`${n(v)} m`, `${n(v)} m`, `${n(2 * v)} m`];
    };
  } else if (kind === 'refraction') {
    options = [
      ['空气→水 · 0°', 'Air → water · 0°'],
      ['空气→水 · 45°', 'Air → water · 45°'],
      ['水→空气 · 30°', 'Water → air · 30°'],
    ];
    const m = refraction(incidence, r.fromWater);
    scene = (
      <ReflectionScene
        mode={mode}
        water
        fromWater={r.fromWater}
        incidence={incidence}
        progress={progress}
      />
    );
    metrics = [
      { title: ['入射角', 'Incidence'], value: `${incidence}°` },
      {
        title: ['折射角', 'Transmission'],
        value: m.transmitted === undefined ? '—' : `${n(m.transmitted)}°`,
      },
      {
        title: ['介质速度比 v₂/v₁', 'Medium speed ratio v₂/v₁'],
        value: `${n(m.speedRatio)}×`,
      },
    ];
    columns = [
      ['路径', 'Path'],
      ['入射', 'Incidence'],
      ['折射', 'Transmission'],
    ];
    row = (i) => {
      const c = refractionCases[i]!,
        m = refraction(c.incidence, c.fromWater);
      return [
        <B
          key={i}
          zh={c.fromWater ? '水→空气' : '空气→水'}
          en={c.fromWater ? 'Water → air' : 'Air → water'}
          mode={mode}
        />,
        `${c.incidence}°`,
        `${n(m.transmitted!)}°`,
      ];
    };
  } else if (kind === 'lens') {
    options = [
      ['物距3', 'Object at 3'],
      ['物距2', 'Object at 2'],
      ['物距0.75', 'Object at 0.75'],
    ];
    const m = thinLens(l.object, l.focal);
    scene = <LensScene mode={mode} {...l} progress={progress} />;
    metrics = [
      { title: ['物距', 'Object distance'], value: n(l.object) },
      { title: ['有符号像距', 'Signed image distance'], value: n(m.image!) },
      {
        title: ['像的大小/方向', 'Image size/orientation'],
        value: (
          <B
            zh={`${n(Math.abs(m.magnification!))}× · ${m.real ? '倒立' : '正立'}`}
            en={`${n(Math.abs(m.magnification!))}× · ${m.real ? 'inverted' : 'upright'}`}
            mode={mode}
          />
        ),
      },
    ];
    columns = [
      ['物距', 'Object distance'],
      ['像距', 'Image distance'],
      ['类型', 'Type'],
    ];
    row = (i) => {
      const c = lensCases[i]!,
        m = thinLens(c.object, c.focal);
      return [
        n(c.object),
        n(m.image!),
        <B
          key={i}
          zh={m.real ? '倒立实像' : '正立虚像'}
          en={m.real ? 'Inverted real' : 'Upright virtual'}
          mode={mode}
        />,
      ];
    };
  } else if (kind === 'eye') {
    options = [
      ['远处已对焦', 'Far, focused'],
      ['近处未调整', 'Near, unadjusted'],
      ['近处已调整', 'Near, adjusted'],
    ];
    const m = eyeFocus(e.object, e.focal);
    scene = <LensScene mode={mode} {...e} progress={progress} eye />;
    metrics = [
      { title: ['模型焦距', 'Model focal length'], value: n(e.focal) },
      {
        title: ['像距 / 视网膜距', 'Image / retinal distance'],
        value: `${n(m.image!)} / 1.50`,
      },
      {
        title: ['对焦线索', 'Focusing cue'],
        value: (
          <B
            zh={m.focused ? '交在视网膜' : '交在视网膜后'}
            en={m.focused ? 'On retina' : 'Behind retina'}
            mode={mode}
          />
        ),
      },
    ];
    columns = [
      ['条件', 'Case'],
      ['焦距', 'Focal length'],
      ['像距', 'Image distance'],
    ];
    row = (i) => {
      const c = eyeCases[i]!;
      return [
        <B key={i} zh={options[i]![0]} en={options[i]![1]} mode={mode} />,
        n(c.focal),
        n(eyeFocus(c.object, c.focal).image!),
      ];
    };
  } else {
    options = [
      ['白光代表组', 'White representative'],
      ['仅红光', 'Red only'],
      ['红+绿光', 'Red + green'],
    ];
    const source = colourCases[choice]!,
      passed = transmittedBands(source, filter);
    scene = (
      <ColourScene
        mode={mode}
        source={source}
        filter={filter}
        progress={progress}
      />
    );
    const count = passed.filter(Boolean).length;
    metrics = [
      {
        title: ['输入色带数', 'Input bands'],
        value: source.filter(Boolean).length,
      },
      { title: ['通过色带数', 'Transmitted bands'], value: count },
      {
        title: ['缺少的色带', 'Absent bands'],
        value: (
          <B
            zh={
              count === 0
                ? '全部'
                : colourBands
                    .filter((_, i) => !passed[i])
                    .map((b) => b.zh)
                    .join('、') || '无'
            }
            en={
              count === 0
                ? 'All'
                : colourBands
                    .filter((_, i) => !passed[i])
                    .map((b) => b.en)
                    .join(', ') || 'None'
            }
            mode={mode}
          />
        ),
      },
    ];
    columns = [
      ['输入', 'Input'],
      ['输出色带数', 'Output bands'],
      ['新造色带', 'Created bands'],
    ];
    row = (i) => [
      <B key={i} zh={options[i]![0]} en={options[i]![1]} mode={mode} />,
      colourCases[i]!.filter(Boolean).length,
      0,
    ];
  }
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-light-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">LIGHT / FOLLOW THE RAYS</span>
        <B zh={labels[kind][0]} en={labels[kind][1]} mode={mode} />
      </div>
      <p className="phy-model-note">
        <B
          zh="教学构图 · 绿点只追踪方向，不是测光速、光子大小或实际飞行时间。"
          en="Teaching construction · Green markers trace direction, not light speed, photon size or physical flight time."
          mode={mode}
        />
      </p>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={options.map(([zh, en], id) => ({ id, zh, en }))}
        value={customAngle === undefined ? choice : -1}
        disabled={animation.running}
        set={choose}
      />
      {kind === 'lens' && (
        <p className="phy-model-note">
          <B
            zh="焦距固定为1个模型长度单位。实线交会是实像；虚线向后交会是虚像。"
            en="Focal length stays 1 model unit. Solid rays meet at a real image; backward dashed directions meet at a virtual image."
            mode={mode}
          />
        </p>
      )}
      {kind === 'eye' && (
        <p className="phy-model-note">
          <B
            zh="视网膜固定在1.5处并接收光；其后虚线只做推演。右上方放大同一物点的两个交点，不是测模糊直径。"
            en="The retina receives light at fixed distance 1.5; dashed directions beyond it are constructions. The inset enlarges two hits from one object point, not a measured blur diameter."
            mode={mode}
          />
        </p>
      )}
      {(kind === 'reflection' || kind === 'refraction') && (
        <label className="phy-energy-probe">
          <span>
            <B zh="自由调整入射角" en="Adjust incidence freely" mode={mode} /> ·{' '}
            {incidence}°
          </span>
          <input
            type="range"
            min="0"
            max={kind === 'refraction' ? 70 : 75}
            step="5"
            value={incidence}
            disabled={animation.running}
            aria-label={words(
              mode,
              '自由调整入射角',
              'Adjust incidence freely',
            )}
            onChange={(ev) => {
              animation.reset();
              setProbe(0);
              const v = Number(ev.target.value);
              const preset =
                kind === 'refraction' ? r.incidence : [20, 45, 60][choice]!;
              setCustomAngle(v === preset ? undefined : v);
            }}
          />
        </label>
      )}
      {kind === 'colour' && (
        <LabOptions
          mode={mode}
          name={['理想滤光片', 'Ideal filter']}
          values={[
            { id: 0, zh: '无滤片', en: 'None' },
            { id: 1, zh: '红滤片', en: 'Red filter' },
            { id: 2, zh: '蓝滤片', en: 'Blue filter' },
          ]}
          value={['none', 'red', 'blue'].indexOf(filter)}
          disabled={animation.running}
          set={(i) => {
            animation.reset();
            setProbe(0);
            setFilter((['none', 'red', 'blue'] as const)[i]!);
          }}
        />
      )}
      {scene}
      <div className="phy-thermal-metrics">
        {metrics.map((m) => (
          <LabMetric key={m.title[1]} mode={mode} title={m.title}>
            {m.value}
          </LabMetric>
        ))}
      </div>
      <label className="phy-energy-probe">
        <span>
          <B zh="构图进度" en="Tracing progress" mode={mode} /> ·{' '}
          {Math.round(progress * 100)}%
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress * 100}
          disabled={animation.running}
          aria-label={words(mode, '构图进度', 'Tracing progress')}
          onChange={(ev) => setProbe(Number(ev.target.value) / 100)}
        />
      </label>
      <button
        className="phy-button"
        disabled={animation.running}
        onClick={() => {
          setProbe(0);
          animation.start();
        }}
      >
        <B
          zh={animation.running ? '追踪中…' : '完整追踪这组光路'}
          en={animation.running ? 'Tracing…' : 'Trace this complete path'}
          mode={mode}
        />
      </button>
      <p className="phy-force-record" role="status">
        <B
          zh={`已比较 ${gate.count}/3：三组规定条件都要完整追踪。拖动进度和自由设置不会代替规定比较。`}
          en={`Compared ${gate.count}/3: trace all three prescribed cases completely. Seeking and custom settings do not replace these comparisons.`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="保留比较 · 规定模型结果"
                en="Retained comparisons · Prescribed model results"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c[1]} scope="col">
                    <B zh={c[0]} en={c[1]} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((i) => (
                <tr key={i}>
                  {row(i).map((v, j) =>
                    j === 0 ? (
                      <th key={j} scope="row">
                        {v}
                      </th>
                    ) : (
                      <td key={j}>{v}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {kind === 'colour' && (
        <>
          <div className="phy-light-bands">
            {colourBands.map((band, i) => (
              <span key={band.en} style={{ color: band.colour }}>
                <B zh={band.zh} en={band.en} mode={mode} /> ·{' '}
                {transmittedBands(colourCases[choice]!, filter)[i]
                  ? `${n(prismRay(band.n).deviation)}°`
                  : '—'}
              </span>
            ))}
          </div>
          <p className="phy-model-note">
            <B
              zh="上述角度是相对原入射方向的偏转。三色带代表不等于完整光谱；红+绿混光可看黄，不能照搬到颜料。"
              en="Angles above are deviations from the original incoming direction. Three bands are not a full spectrum; red+green light can look yellow, unlike mixing paint."
              mode={mode}
            />
          </p>
        </>
      )}
      <details className="phy-energy-assumptions">
        <summary>
          <B zh="这份模型的条件" en="Conditions of this model" mode={mode} />
        </summary>
        <p className="phy-model-note">
          <B zh={conditions[kind][0]} en={conditions[kind][1]} mode={mode} />
        </p>
      </details>
    </div>
  );
}
export const LightShadowLab = (p: LabProps) => (
  <LightLab {...p} kind="shadow" />
);
export const LightReflectionLab = (p: LabProps) => (
  <LightLab {...p} kind="reflection" />
);
export const LightMirrorLab = (p: LabProps) => (
  <LightLab {...p} kind="mirror" />
);
export const LightRefractionLab = (p: LabProps) => (
  <LightLab {...p} kind="refraction" />
);
export const LightLensLab = (p: LabProps) => <LightLab {...p} kind="lens" />;
export const LightColourLab = (p: LabProps) => (
  <LightLab {...p} kind="colour" />
);
export const LightEyeLab = (p: LabProps) => <LightLab {...p} kind="eye" />;
