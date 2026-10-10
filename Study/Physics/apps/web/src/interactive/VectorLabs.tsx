import { useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import { useAnimation } from './useSimulation';
import {
  LabOptions,
  LabMetric,
  useComparisons,
  type LabProps,
} from './LabControls';
import {
  vectorDefault,
  routeReading,
  directionReading,
  arrowReading,
  boatReading,
  ropeReading,
  type Vec,
  type VectorKind,
} from './vectorModels';
type Pair = [string, string];
const ink = '#263f39',
  cream = '#efeee3',
  blue = '#90c5d0',
  teal = '#95bda9',
  gold = '#e8c782',
  muted = '#536b63';
const f = (n: number) =>
  Math.abs(n) < 1e-9 ? '0' : Number(n.toFixed(4)).toString();
const w = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const titles: Record<VectorKind, Pair> = {
  quantities: ['一趟路，两本账', 'One trip, two accounts'],
  direction: ['方向与转动的坐标轴', 'Direction and rotated coordinates'],
  arrows: ['箭头的比例与表示', 'Arrow scales and representations'],
  addition: ['水流中的两份速度', 'Two velocities in a current'],
  components: ['一根绳，两份分量', 'One rope, two components'],
};
const options: Record<VectorKind, Pair[]> = {
  quantities: [
    ['拐角路', 'Corner route'],
    ['原路返回', 'Out and back'],
    ['直达书架', 'Direct to shelf'],
  ],
  direction: [
    ['向东3 m/s', '3 m/s east'],
    ['向北3 m/s', '3 m/s north'],
    ['向西3 m/s', '3 m/s west'],
  ],
  arrows: [
    ['3 m/s', '3 m/s'],
    ['6 m/s', '6 m/s'],
    ['6 m/s，平移表示', '6 m/s, shifted drawing'],
  ],
  addition: [
    ['北流4 m/s', 'North current 4 m/s'],
    ['西流4 m/s', 'West current 4 m/s'],
    ['西流3 m/s', 'West current 3 m/s'],
  ],
  components: [
    ['水平0°', 'Horizontal 0°'],
    ['斜拉36.87°', 'Slanted 36.87°'],
    ['竖直90°', 'Vertical 90°'],
  ],
};
const notes: Record<VectorKind, Pair> = {
  quantities: [
    '共用等比例东/北坐标，每米45像素。路线速度为1 m/s，转弯理想化为瞬时改变方向，不计算转弯的加速度。选定路线全程压缩到2.4秒；零路线不产生运动。蓝线是已走路径，金箭头是起点到当前位置的位移。',
    'Equal east/north scales: 45 pixels per metre. Route speed is 1 m/s, with ideal instantaneous turns; turning acceleration is omitted. The selected whole trip compresses into 2.4 seconds; a zero route has no motion. Blue is travelled path; gold is start-to-current displacement.',
  ],
  direction: [
    '实际速度固定为向东、北或西3 m/s；角度从东逆时针量。灰色东/北方向固定，浅绿坐标轴可旋转，分量按投影计算。播放仅检查描述，不是机器人真的转向或走动。',
    'Velocity is fixed at 3 m/s east, north or west; angles start east and increase counterclockwise. Grey east/north references stay fixed; teal coordinate axes rotate and components are projections. Playback inspects a description, not actual turning or travel.',
  ],
  arrows: [
    '均匀风速的箭头表示，大小3或6 m/s、方向向东。改变像素比例或箭尾的绘图位置不改变风。金点仅检查表示；不模拟风的粒子，也不推广到改变真实力的作用点。',
    'Arrow representations of uniform wind velocity: 3 or 6 m/s east. Changing pixels per unit or a drawing tail does not change wind. The gold probe inspects the representation; it is not a wind particle or permission to move a real force application point.',
  ],
  addition: [
    '二维均匀水流，船相对水始终向东3 m/s，无转向过程。左图速度尺25像素/(m/s)，右图位置尺5像素/m，两图各自等比例，不能跨图比箭长。右图跟踪4 s相对岸运动，压缩到2.4秒；左图是速度合成，不是先航行再漂流的路径。',
    'Uniform 2D current; boat/water velocity stays 3 m/s east with steering omitted. Left velocity scale is 25 pixels/(m/s); right position scale is 5 pixels/m, each equal on both axes. Do not compare lengths across panels. Right tracks 4 s bank-relative motion compressed to 2.4 seconds; left composes velocities, not successive journey legs.',
  ],
  components: [
    '水平无摩擦、小车始终接触地面，重量20 N、绳力10 N，角度从水平+x量。支持力N=20−Fy，竖直合力为零。蓝色完整力与虚线分量是同一份信息，不能重复计入。播放检查力图，不模拟加速；图上每牛顿18像素。',
    'Frictionless horizontal surface; cart remains in contact, weight 20 N, rope force 10 N, angle measured from horizontal +x. Normal force N=20−Fy keeps vertical net force zero. Blue full force and dashed components encode the same information; do not count both. Playback inspects forces, not acceleration; scale is 18 pixels/N.',
  ],
};
const sliders: Record<
  VectorKind,
  { title: Pair; min: number; max: number; step: number | string; unit: string }
> = {
  quantities: {
    title: ['自由路线倍数', 'Free route scale'],
    min: 0,
    max: 1.5,
    step: 0.25,
    unit: '×',
  },
  direction: {
    title: ['自由坐标轴转角', 'Free coordinate rotation'],
    min: -90,
    max: 90,
    step: 15,
    unit: '°',
  },
  arrows: {
    title: ['自由绘图比例', 'Free drawing scale'],
    min: 5,
    max: 30,
    step: 5,
    unit: 'px/(m/s)',
  },
  addition: {
    title: [
      '自由水流方向（从东逆时针）',
      'Free current direction (counterclockwise from east)',
    ],
    min: 0,
    max: 360,
    step: 15,
    unit: '°',
  },
  components: {
    title: ['自由绳子角度（从水平）', 'Free rope angle (from horizontal)'],
    min: 0,
    max: 90,
    step: 'any',
    unit: '°',
  },
};
function Arrow({
  a,
  b,
  color = blue,
  dashed = false,
}: {
  a: Vec;
  b: Vec;
  color?: string;
  dashed?: boolean;
}) {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    len = Math.hypot(dx, dy);
  if (len < 0.01) return <circle cx={a.x} cy={a.y} r="4" fill={color} />;
  const u = { x: dx / len, y: dy / len },
    size = Math.min(10, len * 0.35);
  return (
    <g>
      <path
        d={`M${a.x} ${a.y}L${b.x} ${b.y}`}
        stroke={color}
        strokeWidth="3"
        strokeDasharray={dashed ? '5 4' : undefined}
        fill="none"
      />
      <polygon
        points={`${b.x},${b.y} ${b.x - size * u.x + size * 0.45 * u.y},${b.y - size * u.y - size * 0.45 * u.x} ${b.x - size * u.x - size * 0.45 * u.y},${b.y - size * u.y + size * 0.45 * u.x}`}
        fill={color}
      />
    </g>
  );
}
const line = (points: Vec[]) =>
  points.map((v, i) => `${i ? 'L' : 'M'}${v.x} ${v.y}`).join(' ');
const label = (
  x: number,
  y: number,
  text: string,
  anchor: 'middle' | 'start' | 'end' = 'middle',
  size = 21,
) => (
  <text
    key={`${x}:${y}:${text}`}
    x={x}
    y={y}
    textAnchor={anchor}
    style={{ fontSize: size }}
  >
    {text}
  </text>
);
type Data = {
  scene: ReactNode;
  metrics: { title: Pair; value: string }[];
  row: string[];
  steps: Pair[];
};
function data(
  kind: VectorKind,
  index: number,
  value: number,
  p: number,
  mode: LanguageMode,
): Data {
  const metrics: Data['metrics'] = [],
    metric = (title: Pair, v: string) => metrics.push({ title, value: v });
  let scene: ReactNode, row: string[], steps: Pair[];
  switch (kind) {
    case 'quantities': {
      const m = routeReading(index, value, p),
        full = routeReading(index, value),
        pos = (v: Vec) => ({ x: 110 + 45 * v.x, y: 335 - 45 * v.y }),
        points = [
          { x: 0, y: 0 },
          ...full.legs.reduce<Vec[]>(
            (arr, v) => [
              ...arr,
              { x: (arr.at(-1)?.x ?? 0) + v.x, y: (arr.at(-1)?.y ?? 0) + v.y },
            ],
            [],
          ),
        ];
      scene = (
        <>
          {label(
            310,
            32,
            w(
              mode,
              '蓝色走过的路 · 金色位移',
              'Blue travelled path · gold displacement',
            ),
          )}
          <path d="M110 60V335H500" stroke={cream} fill="none" />
          {[0, 2, 4, 6, 8].map((n) => (
            <g key={n}>
              {label(110 + 45 * n, 360, String(n), 'middle', 18)}
              {n <= 6 && label(95, 340 - 45 * n, String(n), 'end', 18)}
            </g>
          ))}
          {label(525, 335, 'E / m', 'middle', 18)}
          {label(110, 55, 'N / m', 'middle', 18)}
          <path
            d={line(points.map(pos))}
            stroke={muted}
            strokeWidth="3"
            strokeDasharray="6 5"
            fill="none"
          />
          <path
            d={line(m.points.map(pos))}
            stroke={blue}
            strokeWidth="5"
            fill="none"
          />
          <Arrow a={pos({ x: 0, y: 0 })} b={pos(m.position)} color={gold} />
          <circle
            cx={pos(m.position).x}
            cy={pos(m.position).y}
            r="7"
            fill={cream}
          />
          {label(
            310,
            413,
            `t = ${f(m.elapsed)} s · |Δr| = ${f(m.displacement)} m`,
          )}
        </>
      );
      metric(['已走路程', 'Distance travelled'], `${f(m.distance)} m`);
      metric(
        ['位移（东，北）', 'Displacement (east, north)'],
        `(${f(m.position.x)}, ${f(m.position.y)}) m`,
      );
      metric(['位移大小', 'Displacement magnitude'], `${f(m.displacement)} m`);
      row = [
        `${f(full.totalDistance)} m`,
        `(${f(full.position.x)}, ${f(full.position.y)}) m`,
        `${f(full.displacement)} m`,
      ];
      steps = [
        [
          '路径的每一段长度都进入路程账',
          'Every path length enters the distance account',
        ],
        [
          `位移 = (${f(full.position.x)}, ${f(full.position.y)}) m`,
          `Displacement = (${f(full.position.x)}, ${f(full.position.y)}) m`,
        ],
        [
          `|Δr| = ${f(full.displacement)} m；${full.direction === null ? '零向量无唯一方向' : '有方向，与路程不同'}`,
          `|Δr| = ${f(full.displacement)} m; ${full.direction === null ? 'zero vector has no unique direction' : 'direction matters; this is not distance'}`,
        ],
      ];
      break;
    }
    case 'direction': {
      const m = directionReading(index, value),
        center = { x: 310, y: 230 },
        physical = {
          x: center.x + 38 * m.velocity.x,
          y: center.y - 38 * m.velocity.y,
        },
        r = (value * Math.PI) / 180,
        axis = (a: number) => ({
          x: center.x + 155 * Math.cos(a),
          y: center.y - 155 * Math.sin(a),
        }),
        basisX = axis(r),
        basisY = axis(r + Math.PI / 2);
      scene = (
        <>
          {label(
            310,
            32,
            w(
              mode,
              '实际箭头固定 · 坐标轴可以旋转',
              'Physical arrow fixed · axes may rotate',
            ),
          )}
          <path
            d="M90 230H530M310 70V390"
            stroke={muted}
            strokeDasharray="4 5"
          />
          {label(553, 235, 'E', 'middle', 18)}
          {label(336, 88, 'N', 'middle', 18)}
          <Arrow a={center} b={basisX} color={teal} />
          <Arrow a={center} b={basisY} color={teal} />
          {label(
            basisX.x + 15 * Math.cos(r),
            basisX.y - 15 * Math.sin(r),
            '+x′',
            'middle',
            18,
          )}
          {label(
            basisY.x + 15 * Math.cos(r + Math.PI / 2),
            basisY.y - 15 * Math.sin(r + Math.PI / 2),
            '+y′',
            'middle',
            18,
          )}
          <Arrow a={center} b={physical} />
          <circle
            cx={center.x + (physical.x - center.x) * p}
            cy={center.y + (physical.y - center.y) * p}
            r="5"
            fill={gold}
          />
          {label(
            310,
            423,
            `v′ = (${f(m.components.x)}, ${f(m.components.y)}) m/s`,
          )}
        </>
      );
      metric(
        ['实际方向（从东）', 'Physical heading (from east)'],
        `${m.heading}°`,
      );
      metric(['速率', 'Speed'], `${m.speed} m/s`);
      metric(
        ['当前坐标分量', 'Current components'],
        `(${f(m.components.x)}, ${f(m.components.y)}) m/s`,
      );
      row = [
        `${m.heading}°`,
        `${m.speed} m/s`,
        `(${f(m.components.x)}, ${f(m.components.y)}) m/s`,
      ];
      steps = [
        [
          '先写实际方向与轴的正方向',
          'State physical heading and positive axis directions',
        ],
        [
          `坐标轴转角 ${f(value)}°；速度的大小仍3 m/s`,
          `Axes rotate ${f(value)}°; speed stays 3 m/s`,
        ],
        [
          '分量改变不等于实际速度向量改变',
          'Changing components does not change the physical velocity vector',
        ],
      ];
      break;
    }
    case 'arrows': {
      const m = arrowReading(index, value),
        reference = arrowReading(0, value);
      scene = (
        <>
          {label(
            310,
            32,
            w(
              mode,
              '表示长度随比例变 · 风速不变',
              'Representation changes scale · wind does not',
            ),
          )}
          {label(310, 76, `${f(value)} px/(m/s)`)}
          <Arrow a={reference.tail} b={reference.head} color={muted} />
          {label(110, 120, '3 m/s E', 'start', 18)}
          <Arrow a={m.tail} b={m.head} />
          {label(
            m.tail.x,
            m.tail.y + 32,
            `${m.speed} m/s E · ${f(m.pixels)} px`,
            'start',
            18,
          )}
          <circle
            cx={m.tail.x + (m.head.x - m.tail.x) * p}
            cy={m.tail.y}
            r="5"
            fill={gold}
          />
          <path d={`M100 350h${6 * value}`} stroke={cream} />
          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
            <g key={n}>
              <path d={`M${100 + n * value} 345v10`} stroke={cream} />
              {label(100 + n * value, 378, String(n), 'middle', 15)}
            </g>
          ))}
          {label(
            310,
            419,
            w(
              mode,
              '标尺数字：m/s，不是物体的米数',
              'Ruler numbers: m/s, not object metres',
            ),
          )}
        </>
      );
      metric(['真实风速大小', 'Physical wind speed'], `${m.speed} m/s`);
      metric(['箭头像素长度', 'Arrow pixel length'], `${f(m.pixels)} px`);
      metric(['实际方向', 'Physical direction'], w(mode, '向东', 'East'));
      row = [`${m.speed} m/s`, `${f(value)} px/(m/s)`, `${f(m.pixels)} px`];
      steps = [
        ['先检查单位与绘图比例', 'Check physical units and drawing scale'],
        [
          `${f(value)} px/(m/s) × ${m.speed} m/s = ${f(m.pixels)} px`,
          `${f(value)} px/(m/s) × ${m.speed} m/s = ${f(m.pixels)} px`,
        ],
        [
          '本课只平移速度表示，不移动真实力的作用点',
          'This translates a velocity representation, not a real force application point',
        ],
      ];
      break;
    }
    case 'addition': {
      const m = boatReading(index, value, 4 * p),
        full = boatReading(index, value),
        vpos = (v: Vec) => ({ x: 150 + 25 * v.x, y: 240 - 25 * v.y }),
        gpos = (v: Vec) => ({ x: 450 + 5 * v.x, y: 260 - 5 * v.y });
      scene = (
        <>
          {label(
            310,
            32,
            w(
              mode,
              '同时运动 · 首尾接速度',
              'Simultaneous motion · add velocities',
            ),
          )}
          {label(
            175,
            76,
            w(mode, '速度图 / m/s', 'Velocities / m/s'),
            'middle',
            19,
          )}
          {label(
            475,
            76,
            w(mode, '岸边位置 / m', 'Bank position / m'),
            'middle',
            19,
          )}
          <path d="M335 92V377" stroke={muted} />
          <path d="M65 240H325M150 100V370" stroke={muted} />
          {label(315, 264, 'E', 'middle', 16)}
          {label(150, 97, 'N', 'middle', 16)}
          <Arrow a={vpos({ x: 0, y: 0 })} b={vpos(m.boat)} />
          <Arrow a={vpos(m.boat)} b={vpos(m.ground)} color={teal} />
          <Arrow a={vpos({ x: 0, y: 0 })} b={vpos(m.ground)} color={gold} />
          {label(
            173,
            394,
            w(
              mode,
              '蓝：船/水 · 绿：水/岸',
              'Blue: boat/water · teal: water/bank',
            ),
            'middle',
            14,
          )}
          <path d="M410 260H600M450 150V360" stroke={muted} />
          {[-8, 0, 12, 28].map((n) =>
            label(450 + n * 5, 283, String(n), 'middle', 15),
          )}
          {[-16, 0, 16].map((n) =>
            label(438, 265 - n * 5, String(n), 'end', 15),
          )}
          <path
            d={line([gpos({ x: 0, y: 0 }), gpos(full.position)])}
            stroke={muted}
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <path
            d={line([gpos({ x: 0, y: 0 }), gpos(m.position)])}
            stroke={gold}
            strokeWidth="3"
          />
          <g
            transform={`translate(${gpos(m.position).x},${gpos(m.position).y})`}
          >
            <path d="M-10-5H8l8 5-8 5h-18z" fill={cream} />
          </g>
          {label(480, 394, `t = ${f(m.seconds)} s`, 'middle', 18)}
          {label(
            310,
            425,
            `v = (${f(m.ground.x)}, ${f(m.ground.y)}) m/s · |v| = ${f(m.speed)} m/s`,
          )}
        </>
      );
      metric(
        ['船相对岸速度', 'Boat/bank velocity'],
        `(${f(m.ground.x)}, ${f(m.ground.y)}) m/s`,
      );
      metric(['岸上看到的速率', 'Ground speed'], `${f(m.speed)} m/s`);
      metric(
        ['当前岸上位置', 'Current bank position'],
        `(${f(m.position.x)}, ${f(m.position.y)}) m`,
      );
      row = [
        `(${f(m.ground.x)}, ${f(m.ground.y)}) m/s`,
        `${f(m.speed)} m/s`,
        `(${f(full.position.x)}, ${f(full.position.y)}) m`,
      ];
      steps = [
        [
          `v合 = (3, 0) + (${f(m.current.x)}, ${f(m.current.y)}) m/s`,
          `v_resultant = (3, 0) + (${f(m.current.x)}, ${f(m.current.y)}) m/s`,
        ],
        [
          `|v合| = ${f(m.speed)} m/s；不是直接相加大小`,
          `|v_resultant| = ${f(m.speed)} m/s; do not simply add magnitudes`,
        ],
        [
          `4 s位置 = (${f(full.position.x)}, ${f(full.position.y)}) m`,
          `Position at 4 s = (${f(full.position.x)}, ${f(full.position.y)}) m`,
        ],
      ];
      break;
    }
    case 'components': {
      const m = ropeReading(value),
        origin = { x: 150, y: 300 },
        head = { x: 150 + 18 * m.force.x, y: 300 - 18 * m.force.y },
        corner = { x: head.x, y: 300 },
        a = (value * Math.PI) / 180;
      scene = (
        <>
          {label(
            310,
            32,
            w(
              mode,
              '完整拉力 = 两个垂直分量',
              'Full pull = two perpendicular components',
            ),
          )}
          <path d="M75 325H395" stroke={cream} />
          <rect x="112" y="278" width="65" height="33" rx="6" fill={muted} />
          <circle cx="125" cy="319" r="6" fill={cream} />
          <circle cx="164" cy="319" r="6" fill={cream} />
          <path d="M150 80V300H380" stroke={muted} />
          {label(150, 76, '+y / N', 'middle', 18)}
          {label(368, 315, '+x / N', 'middle', 18)}
          <Arrow a={origin} b={head} />
          <Arrow a={origin} b={corner} color={gold} dashed />
          <Arrow a={corner} b={head} color={teal} dashed />
          {value > 0 && (
            <path
              d={`M186 300A36 36 0 0 0 ${150 + 36 * Math.cos(a)} ${300 - 36 * Math.sin(a)}`}
              stroke={cream}
              fill="none"
            />
          )}
          {label(210, 346, `θ = ${f(value)}°`, 'middle', 18)}
          <circle
            cx={origin.x + (head.x - origin.x) * p}
            cy={origin.y + (head.y - origin.y) * p}
            r="5"
            fill={gold}
          />
          <rect
            x="405"
            y="100"
            width="185"
            height="247"
            rx="12"
            fill="#314d43"
          />
          {label(
            498,
            131,
            w(mode, '竖直力账', 'Vertical ledger'),
            'middle',
            20,
          )}
          {label(498, 177, `W = 20 N`, 'middle', 20)}
          {label(498, 220, `Fy = ${f(m.force.y)} N`, 'middle', 20)}
          {label(498, 263, `N = ${f(m.normal)} N`, 'middle', 20)}
          {label(498, 308, 'Fy + N − W = 0', 'middle', 17)}
          {label(310, 416, `cosθ = ${f(m.cosine)} · sinθ = ${f(m.sine)}`)}
        </>
      );
      metric(['水平分量Fx', 'Horizontal component Fx'], `${f(m.force.x)} N`);
      metric(['竖直分量Fy', 'Vertical component Fy'], `${f(m.force.y)} N`);
      metric(
        ['完整绳力大小', 'Full rope-force magnitude'],
        `${f(m.magnitude)} N`,
      );
      row = [`${f(m.force.x)} N`, `${f(m.force.y)} N`, `${f(m.normal)} N`];
      steps = [
        [
          `Fx = 10 cos(${f(value)}°) = ${f(m.force.x)} N`,
          `Fx = 10 cos(${f(value)}°) = ${f(m.force.x)} N`,
        ],
        [
          `Fy = 10 sin(${f(value)}°) = ${f(m.force.y)} N`,
          `Fy = 10 sin(${f(value)}°) = ${f(m.force.y)} N`,
        ],
        [
          'Fx、Fy还原完整F，不能把F再加一次',
          'Fx and Fy reconstruct F; do not add F a second time',
        ],
      ];
      break;
    }
  }
  return { scene, metrics, row, steps };
}
const headers: Record<VectorKind, Pair[]> = {
  quantities: [
    ['路程', 'Distance'],
    ['位移（东，北）', 'Displacement (E, N)'],
    ['位移大小', 'Magnitude'],
  ],
  direction: [
    ['实际方向', 'Physical heading'],
    ['速率', 'Speed'],
    ['坐标分量', 'Components'],
  ],
  arrows: [
    ['风速', 'Wind speed'],
    ['比例', 'Scale'],
    ['像素长度', 'Pixel length'],
  ],
  addition: [
    ['船/岸速度', 'Boat/bank velocity'],
    ['速率', 'Speed'],
    ['4 s位置', 'Position at 4 s'],
  ],
  components: [
    ['水平Fx', 'Horizontal Fx'],
    ['竖直Fy', 'Vertical Fy'],
    ['支持力', 'Normal force'],
  ],
};
export function VectorLab({
  kind,
  mode,
  onExplore,
}: LabProps & { kind: VectorKind }) {
  const [index, setIndex] = useState(0),
    [custom, setCustom] = useState<number | null>(null),
    [probe, setProbe] = useState(0),
    [records, setRecords] = useState<number[]>([]);
  const value = custom ?? vectorDefault(kind, index),
    canonical = Math.abs(value - vectorDefault(kind, index)) < 1e-8;
  const gate = useComparisons(['0', '1', '2'], onExplore),
    animation = useAnimation(2.4, () => {
      if (canonical) {
        gate.record(String(index));
        setRecords((r) => [...new Set([...r, index])]);
      }
    });
  const reset = () => {
      animation.reset();
      setProbe(0);
    },
    choose = (i: number) => {
      reset();
      setIndex(i);
      setCustom(null);
    },
    p = probe || animation.time / 2.4,
    m = data(kind, index, value, p, mode),
    slider = sliders[kind];
  return (
    <div
      className={`phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-vector-lab phy-vector-${kind}`}
    >
      <div className="phy-lab-toolbar">
        <span>PHYSICS BRIDGE / GIVE DIRECTION</span>
        <B zh={titles[kind][0]} en={titles[kind][1]} mode={mode} />
      </div>
      <LabOptions
        mode={mode}
        name={['规定比较', 'Required comparisons']}
        values={options[kind].map(([zh, en], id) => ({ id, zh, en }))}
        value={canonical ? index : -1}
        set={choose}
        disabled={animation.running}
      />
      <label className="phy-algebra-free">
        <B zh={slider.title[0]} en={slider.title[1]} mode={mode} />
        <output>
          {f(value)} {slider.unit}
        </output>
        <input
          type="range"
          min={slider.min}
          max={slider.max}
          step={slider.step}
          value={value}
          aria-label={w(mode, ...slider.title)}
          disabled={animation.running}
          onChange={(e) => {
            reset();
            setCustom(Number(e.target.value));
          }}
        />
      </label>
      <svg
        viewBox="0 0 620 440"
        role="img"
        aria-label={w(mode, ...titles[kind])}
      >
        <rect width="620" height="440" rx="18" fill={ink} />
        <g fill={cream}>{m.scene}</g>
      </svg>
      <div className="phy-thermal-metrics">
        {m.metrics.map((x) => (
          <LabMetric key={x.title[1]} mode={mode} title={x.title}>
            {x.value}
          </LabMetric>
        ))}
      </div>
      <ol
        className="phy-algebra-steps"
        aria-label={w(mode, '向量读数与检查', 'Vector readings and checks')}
      >
        {m.steps.map((s, i) => (
          <li key={i} className={p >= (i + 1) / 3 ? 'inspected' : ''}>
            {s[0] === s[1] ? s[0] : <B zh={s[0]} en={s[1]} mode={mode} />}
          </li>
        ))}
      </ol>
      <p className="phy-model-note">
        <B zh={notes[kind][0]} en={notes[kind][1]} mode={mode} />
      </p>
      <label className="phy-algebra-free">
        <B zh="检查进度" en="Inspection progress" mode={mode} />
        <output>{Math.round(p * 100)}%</output>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={Math.round(p * 100)}
          aria-label={w(mode, '检查进度', 'Inspection progress')}
          disabled={animation.running}
          onChange={(e) => {
            animation.reset();
            setProbe(Number(e.target.value) / 100);
          }}
        />
      </label>
      <div className="phy-lab-actions">
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setProbe(0);
            animation.start();
          }}
        >
          <B zh="完整观察并记录" en="Observe vectors and record" mode={mode} />
        </button>
        <button
          className="phy-button secondary"
          disabled={animation.running}
          onClick={reset}
        >
          <B zh="回到起点" en="Back to start" mode={mode} />
        </button>
      </div>
      <p className="phy-lab-progress" role="status">
        <B
          zh={`已完成 ${gate.count}/3 个规定比较；拖动或自由设置不替代完整观察。`}
          en={`${gate.count}/3 required comparisons complete; seeking or free settings do not replace full observation.`}
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-electric-table">
          <table className="phy-data-table">
            <caption>
              <B
                zh="保留的模型比较（不是自己的实测）"
                en="Retained model comparisons (not your measurements)"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                <th>
                  <B zh="条件" en="Condition" mode={mode} />
                </th>
                {headers[kind].map((h) => (
                  <th key={h[1]}>
                    <B zh={h[0]} en={h[1]} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...records].sort().map((i) => (
                <tr key={i}>
                  <td>
                    {options[kind][i]![0] === options[kind][i]![1] ? (
                      options[kind][i]![0]
                    ) : (
                      <B
                        zh={options[kind][i]![0]}
                        en={options[kind][i]![1]}
                        mode={mode}
                      />
                    )}
                  </td>
                  {data(kind, i, vectorDefault(kind, i), 1, mode).row.map(
                    (s, j) => (
                      <td key={j}>{s}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
