import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import {
  LabMetric,
  LabOptions,
  useComparisons,
  type LabProps,
} from './LabControls';
import { useAnimation } from './useSimulation';
import { nf } from './newtonModels';
import {
  imagingParameters,
  imagingRecord,
  imagingTitles,
  imagingOptions,
  imagingLimits,
  imagingDefault,
  imagingConditions,
  imagingSources,
  lensImage,
  objectRay,
  clipSegment,
  type ImagingKind,
  type ImagingParameters,
  type Pair,
  type Vec,
  type Box,
} from './imagingModels';
const word = (mode: LanguageMode, p: Pair) => (mode === 'en' ? p[1] : p[0]);
const gold = '#efd28e',
  blue = '#a2bec3',
  purple = '#bba4cf',
  grey = '#91a1a7';
const path = (p: Vec[]) =>
  p.map((q, i) => (i ? 'L' : 'M') + q.x + ' ' + q.y).join(' ');
function trace(points: Vec[], progress: number) {
  const n = points.length - 1,
    s = progress * n,
    i = Math.min(n - 1, Math.floor(s)),
    t = Math.min(1, s - i);
  return [
    ...points.slice(0, i + 1),
    {
      x: points[i]!.x + (points[i + 1]!.x - points[i]!.x) * t,
      y: points[i]!.y + (points[i + 1]!.y - points[i]!.y) * t,
    },
  ];
}
function Scene({
  p,
  progress,
  mode,
}: {
  p: ImagingParameters;
  progress: number;
  mode: LanguageMode;
}) {
  const screen = p.kind === 'eye' || p.kind === 'camera',
    eye = p.kind === 'eye',
    instrument = p.instrument,
    micro = instrument?.microscope,
    sx = instrument ? (micro ? 40 : 10) : screen ? (eye ? 160 : 70) : 5,
    sy = instrument ? (micro ? 600 : 100) : screen ? sx * (eye ? 10 : 4) : 40,
    origin = instrument ? 70 : screen ? (eye ? 120 : 80) : 260,
    X = (x: number) => origin + sx * x,
    Y = (y: number) => 210 - sy * y,
    box: Box = {
      left: (25 - origin) / sx,
      right: (590 - origin) / sx,
      bottom: -128 / sy,
      top: 128 / sy,
    };
  const title: Pair = instrument
    ? ['先形成中间像，再通过目镜', 'Intermediate image, then eyepiece']
    : screen
      ? ['交会位置与接收面分开', 'Focus position and receiving plane']
      : [
          '实线向前走；虚线只回看',
          'Solid rays go forward; extensions look back',
        ];
  const segments = (points: Vec[]) =>
    points
      .slice(1)
      .map((to, i) => clipSegment(points[i]!, to, box))
      .filter((x): x is [Vec, Vec] => x !== null)
      .map((s) => path(s.map((q) => ({ x: X(q.x), y: Y(q.y) }))))
      .join(' ');
  const rayPaths: Vec[][] = instrument
    ? instrument.rays.map((r) => [
        {
          x: micro ? -1.2 : -5,
          y: r.hit + (micro ? -1.2 : -5) * r.incoming.slope,
        },
        { x: 0, y: r.hit },
        { x: instrument.z, y: r.atEyepiece.y },
        {
          x: instrument.z + (micro ? 1 : 5),
          y: r.atEyepiece.y + (micro ? 1 : 5) * r.outgoing.slope,
        },
      ])
    : (screen
        ? p.bundle.rays
        : [
            objectRay(p.u, p.h, p.h, p.f),
            objectRay(p.u, p.h, 0, p.f),
            objectRay(p.u, p.h, p.kind === 'rays' ? p.value : p.h - 1, p.f),
          ]
      ).map((r) => [
        { x: -p.u, y: p.h },
        { x: 0, y: r.hit },
        {
          x: screen ? p.z : box.right,
          y: r.hit + (screen ? p.z : box.right) * r.outgoing.slope,
        },
      ]);
  const image = instrument
      ? { x: instrument.intermediateX, y: instrument.intermediateY }
      : p.lens.v === null
        ? null
        : { x: p.lens.v, y: p.lens.imageHeight! },
    inside =
      image &&
      image.x >= box.left &&
      image.x <= box.right &&
      image.y >= box.bottom &&
      image.y <= box.top;
  const lensShape = (x: number, concave = false) =>
    `M${X(x)} ${Y(1.4)}Q${X(x) + (concave ? 10 : -10)} 210 ${X(x)} ${Y(-1.4)}Q${X(x) + (concave ? -10 : 10)} 210 ${X(x)} ${Y(1.4)}`;
  const lensRadius = instrument
    ? micro
      ? 0.21
      : 0.55
    : screen
      ? eye
        ? 0.07
        : 0.34
      : 1.4;
  const lensAt = (x: number, f: number) => {
    const y1 = Y(lensRadius),
      y2 = Y(-lensRadius);
    return (
      <path
        d={
          screen || instrument
            ? `M${X(x)} ${y1}Q${X(x) - 10} 210 ${X(x)} ${y2}Q${X(x) + 10} 210 ${X(x)} ${y1}`
            : lensShape(x, f < 0)
        }
        fill={blue}
        fillOpacity=".13"
        stroke={blue}
        strokeWidth="2"
      />
    );
  };
  return (
    <svg viewBox="0 0 620 410" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      <text x="310" y="65" textAnchor="middle">
        {word(mode, ['光路构造', 'Ray construction'])} {nf(progress * 100)}%
      </text>
      <path d="M25 210H590" stroke={grey} strokeDasharray="5 5" />
      {lensAt(0, p.f)}
      {instrument && lensAt(instrument.z, instrument.fe)}
      {screen && (
        <path d={`M${X(p.z)} 85V335`} stroke={purple} strokeWidth="3" />
      )}
      {!screen && !instrument && (
        <>
          {[-1, 1].map((sign) => (
            <g key={sign}>
              <circle
                cx={X(sign * Math.abs(p.f))}
                cy="210"
                r="3"
                fill={purple}
              />
              <text x={X(sign * Math.abs(p.f))} y="362" textAnchor="middle">
                F
              </text>
            </g>
          ))}
          <path
            d={`M${X(-p.u)} 210V${Y(p.h)}l-4 6m4-6l4 6`}
            stroke={gold}
            strokeWidth="3"
          />
          <text x={X(-p.u)} y="145" textAnchor="middle">
            O
          </text>
        </>
      )}
      {rayPaths.map((points, j) => (
        <g key={j}>
          <path
            d={segments(points)}
            fill="none"
            stroke={grey}
            opacity=".45"
            strokeWidth="1.5"
          />
          <path
            d={segments(trace(points, progress))}
            fill="none"
            stroke={
              p.kind === 'rays' && j !== 2
                ? blue
                : j === 1
                  ? blue
                  : j === 2
                    ? purple
                    : gold
            }
            strokeWidth={p.kind === 'rays' && j === 2 ? 3 : 2}
          />
        </g>
      ))}
      {!screen &&
        !instrument &&
        p.lens.state === 'virtual' &&
        image &&
        rayPaths.map((points, j) => (
          <path
            key={'v' + j}
            d={segments([{ x: 0, y: points[1]!.y }, image])}
            fill="none"
            stroke={purple}
            strokeDasharray="4 4"
            opacity=".8"
          />
        ))}
      {screen &&
        !p.bundle.focused &&
        image &&
        rayPaths.map((points, j) => (
          <path
            key={'predicted' + j}
            d={segments([points[2]!, image])}
            fill="none"
            stroke={grey}
            strokeDasharray="4 4"
            opacity=".6"
          />
        ))}
      {inside && image && (
        <>
          <path
            d={`M${X(image.x)} 210V${Y(image.y)}l-4 ${image.y < 0 ? -6 : 6}m4 ${image.y < 0 ? 6 : -6}l4 ${image.y < 0 ? -6 : 6}`}
            fill="none"
            stroke={purple}
            strokeWidth="3"
            strokeDasharray={
              (p.lens.state === 'virtual' && !instrument) ||
              (screen && !p.bundle.focused)
                ? '4 4'
                : undefined
            }
          />
          <text x={X(image.x)} y={screen ? 160 : 120} textAnchor="middle">
            {instrument ? 'I₁' : screen && !p.bundle.focused ? 'I*' : 'I'}
          </text>
        </>
      )}
      {screen && (
        <>
          <text x="565" y="90" textAnchor="end">
            u={nf(p.u)} cm
          </text>
          <text x="565" y="115" textAnchor="end">
            {word(mode, ['物在窗口外', 'Object outside view'])}
          </text>
          <text x={X(p.z)} y="362" textAnchor="middle">
            {word(mode, eye ? ['视网膜', 'Retina'] : ['感光面', 'Sensor'])}
          </text>
        </>
      )}
      {instrument && (
        <>
          <text x="70" y="145">
            fₒ={nf(instrument.fo)} cm
          </text>
          <text x="310" y="362" textAnchor="middle">
            {word(mode, [
              '中间像后fₑ：平行出射',
              'Eyepiece fₑ after image: parallel output',
            ])}
          </text>
        </>
      )}
      <text x="310" y="390" textAnchor="middle">
        {word(
          mode,
          instrument
            ? micro
              ? [
                  '显微镜：横向40 px/cm；纵向×15',
                  'Microscope: 40 px/cm; vertical ×15',
                ]
              : [
                  '望远镜：横向10 px/cm；纵向×10',
                  'Telescope: 10 px/cm; vertical ×10',
                ]
            : screen
              ? eye
                ? [
                    '横向160 px/cm；纵向×10',
                    'Horizontal 160 px/cm; vertical ×10',
                  ]
                : ['横向70 px/cm；纵向×4', 'Horizontal 70 px/cm; vertical ×4']
              : p.lens.state === 'infinity'
                ? [
                    '焦点处平行出射：无有限像距',
                    'At focus: parallel output, no finite image',
                  ]
                : !inside
                  ? [
                      '像在窗口外；读数仍保留真实位置',
                      'Image outside window; numerical position retained',
                    ]
                  : ['横向5 px/cm；纵向×8', 'Horizontal 5 px/cm; vertical ×8'],
        )}
      </text>
    </svg>
  );
}
function graphPath(
  fn: (x: number) => number,
  min: number,
  max: number,
  X: (x: number) => number,
  Y: (x: number) => number,
  ymin: number,
  ymax: number,
) {
  let result = '',
    pen = false;
  for (let j = 0; j <= 400; j++) {
    const x = min + ((max - min) * j) / 400,
      y = fn(x);
    if (!Number.isFinite(y) || y < ymin || y > ymax) {
      pen = false;
      continue;
    }
    result += (pen ? 'L' : 'M') + X(x) + ' ' + Y(y);
    pen = true;
  }
  return result;
}
function Relation({ p, mode }: { p: ImagingParameters; mode: LanguageMode }) {
  const k = p.kind,
    screen = k === 'eye' || k === 'camera',
    instrument = p.instrument;
  let xmin = 5,
    xmax = 40,
    ymin = -120,
    ymax = 120,
    xlabel = 'u / cm',
    ylabel = 'v / cm',
    title: Pair = [
      '像距不是物距的正比例',
      'Image distance is not proportional',
    ],
    currentX = p.u,
    currentY = p.lens.v,
    functions: ((x: number) => number)[] = [(x) => lensImage(x, p.f).v ?? NaN];
  if (k === 'concave') {
    ymin = -10;
    ymax = 0;
  }
  if (k === 'equation') {
    xmin = 0.025;
    xmax = 0.2;
    ymin = -0.1;
    ymax = 0.1;
    xlabel = '1/u / cm⁻¹';
    ylabel = '1/v / cm⁻¹';
    title = ['倒数图是一条直线', 'Reciprocal plot is a straight line'];
    currentX = 1 / p.u;
    currentY = p.lens.reciprocal;
    functions = [(x) => 0.1 - x];
  }
  if (k === 'rays') {
    xmin = 0;
    xmax = 45;
    ymin = -2;
    ymax = 2;
    xlabel = 'x / cm';
    ylabel = 'y / cm';
    title = [
      '同一物点：不同线共用像点',
      'One object point: rays share an image',
    ];
    currentX = p.lens.v!;
    currentY = p.lens.imageHeight;
    functions = [p.h, 0, p.value].map((hit) => {
      const r = objectRay(p.u, p.h, hit, p.f);
      return (x) => hit + x * r.outgoing.slope;
    });
  }
  if (k === 'magnification') {
    xmin = 0.2;
    xmax = 1.2;
    ymin = -3;
    ymax = 6;
    xlabel = 'h / cm';
    ylabel = 'h′ / cm';
    title = [
      '倍率保持，高度随物高变',
      'Fixed M, image height follows object height',
    ];
    currentX = p.h;
    currentY = p.lens.imageHeight;
    functions = [(x) => p.lens.m! * x];
  }
  if (screen) {
    xmin = k === 'eye' ? 55 : 4.5;
    xmax = k === 'eye' ? 65 : 7;
    ymin = 0;
    ymax = k === 'eye' ? 0.4 : 2;
    xlabel = k === 'eye' ? 'P / D' : 'z / cm';
    ylabel = 'spread / mm';
    title = [
      '几何点像宽度：零处合焦',
      'Geometric point spread: zero is focused',
    ];
    currentX = p.value;
    currentY = p.bundle.diameter * 10;
    functions = [
      (x) => 2 * p.a * Math.abs(1 + p.z / p.u - (p.z * x) / 100) * 10,
    ];
    if (k === 'camera')
      functions = [0.3, 0.075].map(
        (a) => (x) => 2 * a * Math.abs(1 + x / p.u - x / p.f) * 10,
      );
  }
  if (instrument) {
    xmin = 2;
    xmax = 6;
    ymin = -80;
    ymax = 0;
    xlabel = 'fₑ / cm';
    ylabel = 'M_angle';
    title = ['角倍率与目镜焦距', 'Angular M and eyepiece focal length'];
    currentX = p.value;
    currentY = instrument.M;
    functions = [
      (x) =>
        instrument.microscope
          ? (instrument.firstImage!.m! * 25) / x
          : -instrument.fo / x,
    ];
  }
  const X = (x: number) => 80 + (460 * (x - xmin)) / (xmax - xmin),
    Y = (y: number) => 325 - (225 * (y - ymin)) / (ymax - ymin);
  return (
    <svg viewBox="0 0 620 410" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      <text x="25" y="80">
        {ylabel}
      </text>
      <path d="M80 100V325H540" stroke={grey} fill="none" />
      <text x="65" y="110" textAnchor="end">
        {nf(ymax)}
      </text>
      <text x="65" y="325" textAnchor="end">
        {nf(ymin)}
      </text>
      <text x="80" y="355" textAnchor="middle">
        {nf(xmin)}
      </text>
      <text x="540" y="355" textAnchor="middle">
        {nf(xmax)}
      </text>
      <text x="555" y="390" textAnchor="end">
        {xlabel}
      </text>
      {ymin < 0 && ymax > 0 && (
        <path d={`M80 ${Y(0)}H540`} stroke={grey} opacity=".4" />
      )}
      {(k === 'convex' || k === 'equation') && (
        <path
          d={`M${X(k === 'equation' ? 0.1 : 10)} 100V325`}
          stroke={grey}
          strokeDasharray="4 4"
        />
      )}
      {k === 'camera' && (
        <>
          <text x="310" y="75" fill={blue}>
            6 mm
          </text>
          <text x="440" y="75" fill={purple}>
            1.5 mm
          </text>
        </>
      )}
      {functions.map((fn, j) => (
        <path
          key={j}
          d={graphPath(fn, xmin, xmax, X, Y, ymin, ymax)}
          stroke={j === 0 ? blue : j === 1 ? purple : gold}
          strokeWidth="2"
          fill="none"
        />
      ))}
      {currentY !== null && currentY >= ymin && currentY <= ymax && (
        <circle cx={X(currentX)} cy={Y(currentY)} r="5" fill={gold} />
      )}
      {currentY === null && (
        <text x="310" y="70" textAnchor="middle">
          {word(mode, [
            '没有有限像距，曲线不跨接极点',
            'No finite image; curve never joins across pole',
          ])}
        </text>
      )}
    </svg>
  );
}
function Ledger({ p, mode }: { p: ImagingParameters; mode: LanguageMode }) {
  if (p.kind === 'eye' || p.kind === 'camera' || p.instrument) {
    const instrument = p.instrument,
      title: Pair = instrument
        ? ['三条出射线的斜率角', 'Slope angles of three outgoing rays']
        : [
            '同一物点在接收面上的散布',
            'One object point on the receiving plane',
          ],
      values = instrument
        ? instrument.rays.map((r) => r.outgoing.slope * 1000)
        : p.bundle.heights.map((y) => y * 10),
      max = instrument ? 100 : 2,
      X = (x: number) => 310 + (230 * x) / max;
    return (
      <svg viewBox="0 0 620 300" role="img" aria-label={word(mode, title)}>
        <text x="310" y="35" textAnchor="middle">
          {word(mode, title)}
        </text>
        <path d="M80 155H540M310 145V165" stroke={grey} />
        {values.map((v, j) => (
          <circle
            key={j}
            cx={X(v)}
            cy="155"
            r={6 - j}
            fill={j === 0 ? gold : j === 1 ? blue : purple}
          />
        ))}
        <text x="80" y="195" textAnchor="middle">
          −{max}
        </text>
        <text x="310" y="195" textAnchor="middle">
          0
        </text>
        <text x="540" y="195" textAnchor="middle">
          {max}
        </text>
        <text x="540" y="230" textAnchor="end">
          {instrument ? 'θ ≈ slope / mrad' : 'y / mm'}
        </text>
        <text x="310" y="270" textAnchor="middle">
          {word(
            mode,
            instrument
              ? [
                  '点重合：最终同方向；没有有限最终像',
                  'Overlapping dots: parallel output, no finite final image',
                ]
              : [
                  '几何散布；不代表衍射光斑或分辨率',
                  'Geometric spread, not diffraction spot or resolution',
                ],
          )}
        </text>
      </svg>
    );
  }
  let title: Pair = ['带符号的位置账', 'Signed position ledger'],
    values: (number | null)[] = [p.u, p.lens.v],
    labels = ['u / cm', 'v / cm'],
    max = 120;
  if (p.kind === 'equation') {
    title = ['同单位倒数：相加得到1/f', 'Same-unit reciprocals add to 1/f'];
    values = [1 / p.u, p.lens.reciprocal, 1 / p.f];
    labels = ['1/u / cm⁻¹', '1/v / cm⁻¹', '1/f / cm⁻¹'];
    max = 0.2;
  }
  if (p.kind === 'magnification') {
    title = [
      '高度有正负；能量没有因此变负',
      'Signed height does not mean negative energy',
    ];
    values = [p.h, p.lens.imageHeight];
    labels = ['h / cm', 'h′ / cm'];
    max = 6;
  }
  if (p.kind === 'rays') {
    title = ['透镜前后斜率账', 'Slope ledger across the lens'];
    values = [p.ray.incoming.slope, -p.ray.hit / p.f, p.ray.outgoing.slope];
    labels = ['θ_in ≈ slope', 'Δθ = −H/f', 'θ_out ≈ slope'];
    max = 0.15;
  }
  return (
    <svg viewBox="0 0 620 330" role="img" aria-label={word(mode, title)}>
      <text x="310" y="35" textAnchor="middle">
        {word(mode, title)}
      </text>
      {values.map((v, j) => {
        const y = 95 + j * 75,
          width = v === null ? 0 : (200 * Math.abs(v)) / max;
        return (
          <g key={j}>
            <text x="25" y={y - 10}>
              {labels[j]} = {v === null ? '∞' : nf(v)}
            </text>
            <path d={`M310 ${y}v25`} stroke={grey} />
            {v !== null && (
              <rect
                x={v < 0 ? 310 - width : 310}
                y={y}
                width={width}
                height="18"
                fill={j === 0 ? gold : j === 1 ? purple : blue}
              />
            )}
          </g>
        );
      })}
      <text x="310" y="315" textAnchor="middle">
        {word(mode, [
          '共用带符号刻度；读数按公式计算',
          'Shared signed scale; readings calculated from the model',
        ])}
      </text>
    </svg>
  );
}
export function ImagingLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: ImagingKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState<number | null>(null),
    [records, setRecords] = useState<{ index: number; reading: string }[]>([]);
  const [smallAperture, setSmallAperture] = useState(false);
  const p = imagingParameters(kind, index, custom, smallAperture),
    canonical = custom === null && !smallAperture,
    gate = useComparisons(['0', '1', '2'], onExplore);
  const animation = useAnimation(2.4, () => {
    if (!canonical) return;
    gate.record(String(index));
    setRecords((old) =>
      [
        ...old.filter((r) => r.index !== index),
        { index, reading: imagingRecord(p) },
      ].sort((a, b) => a.index - b.index),
    );
  });
  const progress = probe ?? animation.time / 2.4,
    lim = imagingLimits[kind];
  const reset = () => {
    animation.reset();
    setProbe(null);
  };
  const metrics: [Pair, string][] = p.instrument
    ? [
        [['物镜焦距fₒ', 'Objective focal length'], nf(p.instrument.fo) + ' cm'],
        [['目镜焦距fₑ', 'Eyepiece focal length'], nf(p.instrument.fe) + ' cm'],
        [['两镜间距', 'Lens separation'], nf(p.instrument.z) + ' cm'],
        [['角放大率M', 'Angular magnification M'], nf(p.instrument.M)],
      ]
    : kind === 'eye' || kind === 'camera'
      ? [
          [['理想像距v', 'Ideal image distance v'], nf(p.lens.v!) + ' cm'],
          [['接收面距离z', 'Receiving plane distance z'], nf(p.z) + ' cm'],
          [
            ['几何点像直径', 'Geometric point spread'],
            nf(p.bundle.diameter * 10) + ' mm',
          ],
          [
            ['是否合焦', 'Focused'],
            p.bundle.focused
              ? word(mode, ['是', 'Yes'])
              : word(mode, ['否', 'No']),
          ],
        ]
      : [
          [['物距u', 'Object distance u'], nf(p.u) + ' cm'],
          [
            ['像距v', 'Image distance v'],
            p.lens.v === null ? '∞' : nf(p.lens.v) + ' cm',
          ],
          [
            ['线放大率M', 'Linear magnification M'],
            p.lens.m === null ? '—' : nf(p.lens.m),
          ],
          [
            ['像的性质', 'Image type'],
            word(
              mode,
              p.lens.state === 'real'
                ? ['实像·倒立', 'Real · inverted']
                : p.lens.state === 'virtual'
                  ? ['虚像·正立', 'Virtual · upright']
                  : ['无有限像', 'No finite image'],
            ),
          ],
        ];
  return (
    <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-circular-lab phy-wave-lab">
      <div className="phy-lab-toolbar">
        <span>LIGHT / IMAGES & INSTRUMENTS</span>
        <B
          zh={imagingTitles[kind][0]}
          en={imagingTitles[kind][1]}
          mode={mode}
        />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={imagingOptions[kind].map(([zh, en], id) => ({
          zh,
          en,
          id,
        }))}
        value={canonical ? index : -1}
        disabled={animation.running}
        set={(i) => {
          setIndex(i);
          setCustom(null);
          setSmallAperture(false);
          reset();
        }}
      />
      <label className="phy-electric-slider">
        <B zh={lim.label[0]} en={lim.label[1]} mode={mode} />
        <output>
          {nf(custom ?? imagingDefault(kind, index))} {lim.unit}
        </output>
        <input
          type="range"
          min={lim.min}
          max={lim.max}
          step={lim.step}
          value={custom ?? imagingDefault(kind, index)}
          aria-label={word(mode, lim.label)}
          disabled={animation.running}
          onChange={(e) => {
            setCustom(Number(e.target.value));
            reset();
          }}
        />
      </label>
      {kind === 'camera' && (
        <label className="phy-model-note">
          <input
            type="checkbox"
            checked={smallAperture}
            disabled={animation.running}
            aria-label={word(mode, ['缩小入瞳', 'Smaller entrance pupil'])}
            onChange={(e) => {
              setSmallAperture(e.target.checked);
              reset();
            }}
          />{' '}
          <B
            zh="缩小入瞳：6 mm → 1.5 mm"
            en="Smaller entrance pupil: 6 mm → 1.5 mm"
            mode={mode}
          />
        </label>
      )}
      <div className="phy-circular-scenes">
        <Scene p={p} progress={progress} mode={mode} />
        <Relation p={p} mode={mode} />
      </div>
      <div className="phy-thermal-metrics">
        {metrics.map(([title, value]) => (
          <LabMetric key={title[1]} mode={mode} title={title}>
            {value}
          </LabMetric>
        ))}
      </div>
      <Ledger p={p} mode={mode} />
      <p className="phy-model-note">
        <B
          zh="构造分2.4秒展示，进度不代表真实光子计时。灰线给完整方向，彩色线逐步画出光路；数据由当前条件计算。纵向放大使光路可见，尺寸和点像宽度请读带单位的数字。"
          en="Construction is revealed over 2.4 seconds, not photon flight time. Grey gives full directions; colour reveals rays. Readings follow current parameters. Vertical enlargement makes paths visible; use numerical units for dimensions and spread."
          mode={mode}
        />
      </p>
      <details className="phy-model-note">
        <summary>
          <B
            zh="模型条件与原理来源"
            en="Model conditions and sources"
            mode={mode}
          />
        </summary>
        <p>
          <B
            zh={imagingConditions[kind][0]}
            en={imagingConditions[kind][1]}
            mode={mode}
          />
        </p>
        <a href={imagingSources[kind]} target="_blank" rel="noreferrer">
          <B
            zh="原理延伸 · OpenStax"
            en="Explore the principle · OpenStax"
            mode={mode}
          />
        </a>
      </details>
      <label className="phy-electric-slider">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{nf(progress * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="2.5"
          value={progress * 100}
          aria-label={word(mode, ['检查进度', 'Inspection progress'])}
          disabled={animation.running}
          onChange={(e) => setProbe(Number(e.target.value) / 100)}
        />
      </label>
      <div className="phy-lab-actions">
        <button
          disabled={animation.running}
          onClick={() => {
            setProbe(null);
            animation.start();
          }}
        >
          <B zh="完整观察并记录" en="Observe motion and record" mode={mode} />
        </button>
        <button disabled={animation.running} onClick={reset}>
          <B zh="回到起点" en="Back to start" mode={mode} />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          zh={`已完成 ${gate.count}/3 个规定比较；检查时刻与自由设置不代替完整观察。`}
          en={`${gate.count}/3 required comparisons complete; inspection and free settings do not replace full observation.`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table">
          <table>
            <caption>
              <B
                zh="完整观察的模型记录"
                en="Fully observed model records"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                <th>
                  <B zh="规定比较" en="Required comparison" mode={mode} />
                </th>
                <th>
                  <B zh="读数与检查" en="Readings and checks" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.index}>
                  <td>
                    {imagingOptions[kind][r.index]![0] ===
                    imagingOptions[kind][r.index]![1] ? (
                      imagingOptions[kind][r.index]![0]
                    ) : (
                      <B
                        zh={imagingOptions[kind][r.index]![0]}
                        en={imagingOptions[kind][r.index]![1]}
                        mode={mode}
                      />
                    )}
                  </td>
                  <td>{r.reading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
