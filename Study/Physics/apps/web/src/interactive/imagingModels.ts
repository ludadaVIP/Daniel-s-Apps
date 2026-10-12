import { nf } from './newtonModels';
export type Pair = [string, string];
export type ImagingKind =
  | 'convex'
  | 'concave'
  | 'rays'
  | 'equation'
  | 'magnification'
  | 'eye'
  | 'camera'
  | 'instruments';
export const imagingKinds: ImagingKind[] = [
  'convex',
  'concave',
  'rays',
  'equation',
  'magnification',
  'eye',
  'camera',
  'instruments',
];
function valid(x: number, min: number, max: number) {
  if (!Number.isFinite(x) || x < min || x > max)
    throw new RangeError('Outside thin-lens model');
  return x;
}
export function lensImage(u: number, f: number, h = 0.5) {
  valid(u, 0.1, 10000);
  valid(h, -10, 10);
  if (!Number.isFinite(f) || Math.abs(f) < 0.1 || Math.abs(f) > 1000)
    throw new RangeError('Invalid focal length');
  const reciprocal = 1 / f - 1 / u,
    atInfinity = Math.abs(reciprocal) < 1e-12;
  const v = atInfinity ? null : 1 / reciprocal,
    m = v === null ? null : -v / u;
  return {
    u,
    f,
    h,
    reciprocal,
    v,
    m,
    imageHeight: m === null ? null : m * h,
    state: atInfinity ? 'infinity' : v! > 0 ? 'real' : 'virtual',
  };
}
export type RayState = { y: number; slope: number };
export const drift = (r: RayState, d: number): RayState => ({
  y: r.y + d * r.slope,
  slope: r.slope,
});
export function lensTransfer(r: RayState, f: number): RayState {
  if (!Number.isFinite(f) || Math.abs(f) < 0.1)
    throw new RangeError('Invalid lens');
  return { y: r.y, slope: r.slope - r.y / f };
}
export function objectRay(u: number, h: number, hit: number, f: number) {
  valid(u, 0.1, 10000);
  valid(hit, -10, 10);
  valid(h, -10, 10);
  const incoming = { y: hit, slope: (hit - h) / u },
    outgoing = lensTransfer(incoming, f);
  return { hit, incoming, outgoing };
}
export function screenBundle(
  u: number,
  h: number,
  f: number,
  z: number,
  a: number,
) {
  valid(z, 0.1, 100);
  valid(a, 0.001, 2);
  const rays = [-a, 0, a].map((hit) => objectRay(u, h, hit, f)),
    heights = rays.map((r) => drift(r.outgoing, z).y),
    centre = (-z * h) / u,
    diameter = Math.max(...heights) - Math.min(...heights);
  return { rays, heights, centre, diameter, focused: diameter < 1e-10 };
}
export function opticalInstrument(index: number, fe: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2)
    throw new RangeError('Invalid instrument');
  valid(fe, 2, 6);
  const microscope = index === 2,
    fo = microscope ? 1 : [20, 40][index]!,
    u = 1.2,
    h = 0.01,
    theta = 0.005;
  const firstImage = microscope ? lensImage(u, fo, h) : null,
    z = (firstImage?.v ?? fo) + fe;
  const rays = [-0.06, 0, 0.06].map((hit) => {
    const incoming = { y: hit, slope: microscope ? (hit - h) / u : theta },
      afterObjective = lensTransfer(incoming, fo),
      atEyepiece = drift(afterObjective, z),
      outgoing = lensTransfer(atEyepiece, fe);
    return { hit, incoming, afterObjective, atEyepiece, outgoing };
  });
  return {
    microscope,
    fo,
    fe,
    u,
    h,
    theta,
    z,
    firstImage,
    intermediateX: firstImage?.v ?? fo,
    intermediateY: firstImage?.imageHeight ?? fo * theta,
    rays,
    M: microscope ? (firstImage!.m! * 25) / fe : -fo / fe,
    referenceNearCM: 25,
  };
}
export const imagingTitles: Record<ImagingKind, Pair> = {
  convex: ['一片凸透镜，两种像', 'One converging lens, two image types'],
  concave: ['真实光发散，延长线相交', 'Real rays diverge; extensions meet'],
  rays: ['同一点发出的不同光线', 'Different rays from one object point'],
  equation: ['倒数相加，符号有意义', 'Reciprocals add; signs mean something'],
  magnification: ['高度比例与倒正分开读', 'Read height ratio and orientation'],
  eye: [
    '固定视网膜，改变等效屈光力',
    'Fixed retina; changing equivalent power',
  ],
  camera: ['移动感光面，比较点像宽度', 'Move the sensor; compare point spread'],
  instruments: [
    '物镜先成像，目镜再改视角',
    'Objective forms an image; eyepiece changes angle',
  ],
};
export const imagingOptions: Record<ImagingKind, Pair[]> = {
  convex: [
    ['物距30 cm', 'Object 30 cm'],
    ['物距20 cm', 'Object 20 cm'],
    ['物距8 cm', 'Object 8 cm'],
  ],
  concave: [
    ['物距30 cm', 'Object 30 cm'],
    ['物距20 cm', 'Object 20 cm'],
    ['物距8 cm', 'Object 8 cm'],
  ],
  rays: [
    ['平行入射线', 'Parallel incident ray'],
    ['过中心光线', 'Central ray'],
    ['一般入射线', 'General incident ray'],
  ],
  equation: [
    ['物距30 cm', 'Object 30 cm'],
    ['物距20 cm', 'Object 20 cm'],
    ['物距8 cm', 'Object 8 cm'],
  ],
  magnification: [
    ['缩小实像', 'Smaller real image'],
    ['等大实像', 'Same-size real image'],
    ['放大虚像', 'Larger virtual image'],
  ],
  eye: [
    ['远物已对焦', 'Far object focused'],
    ['移近但未调节', 'Near, unaccommodated'],
    ['近物调节后', 'Near, accommodated'],
  ],
  camera: [
    ['远物对焦', 'Far object focused'],
    ['近物沿用旧位置', 'Near with old sensor position'],
    ['近物重新对焦', 'Near refocused'],
  ],
  instruments: [
    ['20/5 cm望远镜', '20/5 cm telescope'],
    ['40/5 cm望远镜', '40/5 cm telescope'],
    ['1/2.5 cm显微镜', '1/2.5 cm microscope'],
  ],
};
export const imagingLimits: Record<
  ImagingKind,
  { min: number; max: number; step: number | 'any'; label: Pair; unit: string }
> = {
  convex: {
    min: 5,
    max: 40,
    step: 1,
    label: ['自由物距u', 'Free object distance u'],
    unit: 'cm',
  },
  concave: {
    min: 5,
    max: 40,
    step: 1,
    label: ['自由物距u', 'Free object distance u'],
    unit: 'cm',
  },
  rays: {
    min: -0.75,
    max: 0.75,
    step: 0.05,
    label: ['自由透镜交点高度H', 'Free lens-hit height H'],
    unit: 'cm',
  },
  equation: {
    min: 5,
    max: 40,
    step: 1,
    label: ['自由物距u', 'Free object distance u'],
    unit: 'cm',
  },
  magnification: {
    min: 0.2,
    max: 1.2,
    step: 0.1,
    label: ['自由物高h', 'Free object height h'],
    unit: 'cm',
  },
  eye: {
    min: 55,
    max: 65,
    step: 'any',
    label: ['自由等效屈光力P', 'Free equivalent power P'],
    unit: 'D',
  },
  camera: {
    min: 4.5,
    max: 7,
    step: 'any',
    label: ['自由感光面距离z', 'Free sensor distance z'],
    unit: 'cm',
  },
  instruments: {
    min: 2,
    max: 6,
    step: 0.5,
    label: ['自由目镜焦距fₑ', 'Free eyepiece focal length fₑ'],
    unit: 'cm',
  },
};
export function imagingDefault(kind: ImagingKind, index: number) {
  if (
    !imagingKinds.includes(kind) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 2
  )
    throw new RangeError('Invalid imaging case');
  return kind === 'rays'
    ? [0.5, 0, -0.5][index]!
    : kind === 'magnification'
      ? 0.5
      : kind === 'eye'
        ? 100 * (1 / 1.7 + 1 / (index === 2 ? 25 : 100))
        : kind === 'camera'
          ? index === 2
            ? 6.25
            : (100 * 5) / 95
          : kind === 'instruments'
            ? index === 2
              ? 2.5
              : 5
            : [30, 20, 8][index]!;
}
export function imagingParameters(
  kind: ImagingKind,
  index: number,
  custom: number | null = null,
  smallAperture = false,
) {
  const value = custom ?? imagingDefault(kind, index);
  imagingDefault(kind, index);
  const lim = imagingLimits[kind];
  valid(value, lim.min, lim.max);
  if (smallAperture && kind !== 'camera')
    throw new RangeError('Aperture control belongs to camera');
  const u =
      kind === 'rays'
        ? 30
        : kind === 'eye' || kind === 'camera'
          ? index === 0
            ? 100
            : 25
          : kind === 'instruments'
            ? 1.2
            : kind === 'magnification'
              ? [30, 20, 8][index]!
              : value,
    f =
      kind === 'concave'
        ? -10
        : kind === 'eye'
          ? 100 / value
          : kind === 'camera'
            ? 5
            : kind === 'instruments'
              ? 1
              : 10,
    h =
      kind === 'magnification'
        ? value
        : kind === 'eye'
          ? 0.3
          : kind === 'camera'
            ? 0.5
            : kind === 'instruments'
              ? 0.01
              : 0.5,
    lens = lensImage(u, f, h),
    z = kind === 'eye' ? 1.7 : kind === 'camera' ? value : 30,
    a =
      kind === 'eye'
        ? 0.06
        : kind === 'camera'
          ? smallAperture
            ? 0.075
            : 0.3
          : 0.75,
    bundle = screenBundle(u, h, f, z, a),
    ray = objectRay(u, h, kind === 'rays' ? value : 0.5, f),
    instrument =
      kind === 'instruments' ? opticalInstrument(index, value) : null;
  return {
    kind,
    index,
    value,
    u,
    f,
    h,
    z,
    a,
    lens,
    bundle,
    ray,
    instrument,
    smallAperture,
  };
}
export type ImagingParameters = ReturnType<typeof imagingParameters>;
export type Vec = { x: number; y: number };
export type Box = { left: number; right: number; bottom: number; top: number };
export function clipSegment(from: Vec, to: Vec, b: Box): [Vec, Vec] | null {
  let low = 0,
    high = 1;
  const dx = to.x - from.x,
    dy = to.y - from.y;
  for (const [p, q] of [
    [-dx, from.x - b.left],
    [dx, b.right - from.x],
    [-dy, from.y - b.bottom],
    [dy, b.top - from.y],
  ]) {
    if (Math.abs(p!) < 1e-15) {
      if (q! < 0) return null;
    } else {
      const t = q! / p!;
      if (p! < 0) low = Math.max(low, t);
      else high = Math.min(high, t);
      if (low > high) return null;
    }
  }
  return [
    { x: from.x + low * dx, y: from.y + low * dy },
    { x: from.x + high * dx, y: from.y + high * dy },
  ];
}
export function imagingRecord(p: ImagingParameters) {
  const l = p.lens;
  if (p.instrument) {
    const m = p.instrument;
    return `fₒ=${nf(m.fo)} cm; fₑ=${nf(m.fe)} cm; separation=${nf(m.z)} cm; intermediate=(${nf(m.intermediateX)},${nf(m.intermediateY)}) cm; angular M=${nf(m.M)}; final rays parallel`;
  }
  if (p.kind === 'eye' || p.kind === 'camera')
    return `u=${nf(p.u)} cm; f=${nf(p.f)} cm; ideal v=${nf(l.v!)} cm; receiving z=${nf(p.z)} cm; aperture diameter=${nf(2 * p.a * 10)} mm; point spread=${nf(p.bundle.diameter * 10)} mm; ${p.bundle.focused ? 'focused' : 'geometrically defocused'}`;
  return `u=${nf(p.u)} cm; f=${nf(p.f)} cm; v=${l.v === null ? 'infinite' : nf(l.v) + ' cm'}; M=${l.m === null ? 'undefined' : nf(l.m)}; h=${nf(p.h)} cm; h′=${l.imageHeight === null ? 'undefined' : nf(l.imageHeight) + ' cm'}; ${l.state}${p.kind === 'rays' ? `; lens H=${nf(p.ray.hit)} cm; outgoing slope=${nf(p.ray.outgoing.slope)}` : ''}`;
}
const common: Pair = [
  '单色、空气中的薄透镜与近轴光线；用斜率近似小角，透镜在一个平面改变斜率。忽略厚度、像差、衍射、吸收及反射损失。有限空间窗口只裁切显示，不改变计算；图上虚线不传光。检查进度是光路构造顺序，不是光子旅行计时。',
  'Monochromatic thin lenses in air, paraxial slope approximation, with slope changed at one plane. Thickness, aberrations, diffraction, absorption and reflection losses are omitted. Window clipping changes display only. Dashed extensions carry no light. Inspection progress reveals construction order, not photon flight time.',
];
export const imagingConditions: Record<ImagingKind, Pair> = Object.fromEntries(
  imagingKinds.map((k) => [
    k,
    [
      common[0] +
        (k === 'eye'
          ? ' 角膜与晶状体合成一个等效透镜；视网膜距1.7 cm固定，I*及其虚线表示移开接收面才会达到的预测焦点，接收光路在接收面终止。纵向放大10倍，横向160 px/cm。不是诊断或处方模型。'
          : k === 'camera'
            ? ' 感光面收集同一物点的三条取样光线，几何散布直径以毫米读；I*及虚线表示移开接收面后的预测，实际接收光路在感光面终止。纵向放大4倍，横向70 px/cm。缩小孔径减少离焦散布，但不在这里预测曝光量或衍射极限。'
            : k === 'instruments'
              ? ' 目镜始终放在中间像后一个目镜焦距，最终出射平行。望远镜横向10 px/cm、纵向×10；显微镜40 px/cm、纵向×15，不能比较两图的像素大小。显微镜角倍率相对裸眼25 cm参考，不代表最大分辨率。'
              : ' 空间图横向5 px/cm、纵向×8；显示窗口边界裁切图形，计算值不裁切。发散透镜用f<0；实物u>0，实像v>0、虚像v<0；焦点处v与线倍率没有有限值。'),
      common[1] +
        (k === 'eye'
          ? ' Cornea and crystalline lens form one equivalent lens; retina fixed at 1.7 cm. I* and dashed continuation predict focus with receiving plane removed; received rays stop at that plane. Vertical ×10, horizontal 160 px/cm. No diagnosis or prescription model.'
          : k === 'camera'
            ? ' Three rays sample one object point; geometric spread is read in mm. I* and dashed continuation predict focus after sensor removal; received rays stop at the sensor. Vertical ×4, horizontal 70 px/cm. Smaller aperture reduces defocus but exposure and diffraction limits are not predicted.'
            : k === 'instruments'
              ? ' Eyepiece remains one eyepiece focal length after the intermediate image for parallel final rays. Telescope 10 px/cm, vertical ×10; microscope 40 px/cm, vertical ×15. Do not compare pixel sizes across instruments. Microscope angular M uses a 25 cm unaided reference and is not resolving power.'
              : ' Horizontal 5 px/cm, vertical ×8; finite windows clip drawing, never calculated positions. Diverging f<0; real object u>0, real image v>0, virtual v<0. At focus, v and linear M have no finite value.'),
    ],
  ]),
) as Record<ImagingKind, Pair>;
const base = 'https://openstax.org/books/university-physics-volume-3/pages/';
export const imagingSources: Record<ImagingKind, string> = Object.fromEntries(
  imagingKinds.map((k) => [
    k,
    base +
      (k === 'eye'
        ? '2-5-the-eye'
        : k === 'camera'
          ? '2-6-the-camera'
          : k === 'instruments'
            ? '2-8-microscopes-and-telescopes'
            : '2-4-thin-lenses'),
  ]),
) as Record<ImagingKind, string>;
