import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { readRational } from './rationalModels';
import { sssTriangle } from './congruenceModels';
import {
  dissection,
  rigidImage,
  transformTriangle,
  exactRootText,
  pythagoreanClassification,
  type PlanePoint,
  type RigidTransform,
} from './pythagoreanModels';
import type { Coordinate } from './cartesianModels';
const num = (r: readonly [bigint, bigint]) => Number(r[0]) / Number(r[1]);
const poly = (p: PlanePoint[]) => p.map((p) => `${p.x},${p.y}`).join(' ');
export function PythFrame({
  mode,
  children,
  caption,
}: {
  mode: LanguageMode;
  children: React.ReactNode;
  caption: ReturnType<typeof t>;
}) {
  return (
    <figure className="math-pyth-figure">
      <div
        className="math-pyth-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Transformation or area diagram; scroll locally'
            : '变换或面积图；需要时在图内滚动'
        }
      >
        {children}
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export function TransformBoard({
  mode,
  transform,
  shown,
  wide = false,
}: {
  mode: LanguageMode;
  transform: RigidTransform;
  shown: boolean;
  wide?: boolean;
}) {
  const min = wide ? -8 : -5,
    max = -min,
    step = wide ? 2 : 1,
    pos = (p: Coordinate) => ({
      x: 50 + ((num(p[0]) - min) * 460) / (max - min),
      y: 510 - ((num(p[1]) - min) * 460) / (max - min),
    }),
    zero = pos([
      [0n, 1n],
      [0n, 1n],
    ]),
    source = transformTriangle.map(pos),
    target = transformTriangle.map((p) => pos(rigidImage(p, transform))),
    ticks = Array.from(
      { length: (max - min) / step + 1 },
      (_, i) => min + i * step,
    ),
    groups = new Map<string, { point: PlanePoint; names: string[] }>();
  [
    ...source.map((p, i) => ({ point: p, name: 'ABC'[i]! })),
    ...(shown
      ? target.map((p, i) => ({ point: p, name: `${'ABC'[i]}′` }))
      : []),
  ].forEach((p) => {
    const key = `${p.point.x},${p.point.y}`,
      old = groups.get(key);
    if (old) old.names.push(p.name);
    else groups.set(key, { point: p.point, names: [p.name] });
  });
  return (
    <PythFrame
      mode={mode}
      caption={t(
        '横纵同单位、同显示比例。原图实线、像图虚线；改变视窗不改坐标。重合点合并身份标签。',
        'Axes use equal unit lengths and display scales. The original is solid and its image dashed. Windows do not change coordinates; coincident identities share a label.',
      )}
    >
      <svg
        viewBox="0 0 560 560"
        role="img"
        aria-label={
          mode === 'en' ? 'Equal-unit transformation grid' : '等单位变换网格'
        }
      >
        {ticks.map((v) => {
          const p = pos([
            [BigInt(v), 1n],
            [BigInt(v), 1n],
          ]);
          return (
            <g key={v}>
              <path d={`M${p.x} 50V510M50 ${p.y}H510`} stroke="#ded9e7" />
              <text x={p.x} y={zero.y + 20} textAnchor="middle">
                {v}
              </text>
              {v !== 0 && (
                <text x={zero.x - 10} y={p.y + 5} textAnchor="end">
                  {v}
                </text>
              )}
            </g>
          );
        })}
        <path
          d={`M40 ${zero.y}H520m-8-5 8 5-8 5M${zero.x} 520V40m-5 8 5-8 5 8`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text x="530" y={zero.y - 8}>
          x
        </text>
        <text x={zero.x + 10} y="35">
          y
        </text>
        <polygon
          data-rigid-source
          points={poly(source)}
          fill="none"
          stroke="#5954a3"
          strokeWidth="3"
        />
        {shown && (
          <polygon
            data-rigid-image
            points={poly(target)}
            fill="none"
            stroke="#a14532"
            strokeWidth="3"
            strokeDasharray="7 4"
          />
        )}
        {[...groups.values()].map((g, i) => (
          <g key={i} data-transform-label={g.names.join('/')}>
            <circle cx={g.point.x} cy={g.point.y} r="4" fill="currentColor" />
            <text x={g.point.x + 8} y={g.point.y - 10}>
              {g.names.join('/')}
            </text>
          </g>
        ))}
        {transform.kind === 'rotate' &&
          (() => {
            const p = pos(transform.center);
            return (
              <g data-rotation-center>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="white"
                  stroke="currentColor"
                />
                <text x={p.x - 16} y={p.y - 10}>
                  O
                </text>
              </g>
            );
          })()}
      </svg>
    </PythFrame>
  );
}
export function DissectionView({
  a,
  b,
  mode,
  rearranged = false,
}: {
  a: number;
  b: number;
  mode: LanguageMode;
  rearranged?: boolean;
}) {
  const m = dissection(a, b),
    unit = 25,
    colors = ['#ece7f6', '#e5edf4', '#f3e9df', '#e7eee0'];
  return (
    <PythFrame
      mode={mode}
      caption={t(
        '两个框使用相同单位与同一边长 a+b。编号 1–4 是同样的四个直角三角形，重排不改变每块面积；未覆盖部分由几何证明为正方形。',
        'Both frames use the same units and side a+b. Pieces 1–4 are the same four right triangles; rearrangement preserves each area. The uncovered regions are squares by the geometric argument.',
      )}
    >
      <svg
        viewBox="0 0 680 360"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Two arrangements of four congruent right triangles'
            : '四个全等直角三角形的两种排法'
        }
      >
        {(['hyp', 'legs'] as const).map((name, i) => {
          const x = 30 + i * 330,
            y = 45,
            data = m[name],
            p = (p: PlanePoint) => ({ x: x + p.x * unit, y: y + p.y * unit }),
            visible = i === 0 || rearranged;
          return (
            <g key={name} data-dissection-layout={name}>
              <rect
                x={x}
                y={y}
                width={m.s * unit}
                height={m.s * unit}
                fill="white"
                stroke="currentColor"
                strokeWidth="2"
              />
              <text x={x} y="25">
                {i === 0 ? 'c²' : rearranged ? 'a² + b²' : '?'}
              </text>
              {visible && (
                <>
                  {data.pieces.map((piece, j) => {
                    const points = piece.map(p),
                      center = {
                        x: points.reduce((s, p) => s + p.x, 0) / 3,
                        y: points.reduce((s, p) => s + p.y, 0) / 3,
                      };
                    return (
                      <g key={j} data-puzzle-piece={j + 1}>
                        <polygon
                          points={poly(points)}
                          fill={colors[j]}
                          stroke="#5954a3"
                          strokeWidth="1.5"
                        />
                        <text
                          x={center.x}
                          y={center.y + 3}
                          fontSize="11"
                          textAnchor="middle"
                        >
                          {j + 1}
                        </text>
                      </g>
                    );
                  })}
                  {data.gaps.map((gap, j) => {
                    const points = gap.map(p),
                      center = {
                        x: points.reduce((s, p) => s + p.x, 0) / 4,
                        y: points.reduce((s, p) => s + p.y, 0) / 4,
                      };
                    return (
                      <g key={j} data-puzzle-gap={j}>
                        <polygon
                          points={poly(points)}
                          fill="none"
                          stroke="#a14532"
                          strokeWidth="2"
                        />
                        <text x={center.x} y={center.y + 5} textAnchor="middle">
                          {name === 'hyp' ? 'c²' : j === 0 ? 'a²' : 'b²'}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}
            </g>
          );
        })}
      </svg>
    </PythFrame>
  );
}
function Corner({
  at,
  first,
  second,
}: {
  at: PlanePoint;
  first: PlanePoint;
  second: PlanePoint;
}) {
  const u = {
      x: ((first.x - at.x) / Math.hypot(first.x - at.x, first.y - at.y)) * 15,
      y: ((first.y - at.y) / Math.hypot(first.x - at.x, first.y - at.y)) * 15,
    },
    v = {
      x:
        ((second.x - at.x) / Math.hypot(second.x - at.x, second.y - at.y)) * 15,
      y:
        ((second.y - at.y) / Math.hypot(second.x - at.x, second.y - at.y)) * 15,
    };
  return (
    <path
      data-right-angle
      d={`M${at.x + u.x} ${at.y + u.y}l${v.x} ${v.y}l${-u.x} ${-u.y}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  );
}
export function PythagoreanTriangleView({
  a,
  b,
  unknown = 'c',
  right = true,
  rectangle = false,
  reveal = false,
  mode,
}: {
  a: string;
  b: string;
  unknown?: 'b' | 'c';
  right?: boolean;
  rectangle?: boolean;
  reveal?: boolean;
  mode: LanguageMode;
}) {
  const ar = readRational(a),
    br = readRational(b),
    x = num(ar),
    y = num(br);
  if (x <= 0 || y <= 0) throw new RangeError('Positive drawing lengths');
  const scale = Math.min(360 / x, 215 / y),
    p = [
      { x: 100, y: 265 },
      { x: 100 + x * scale, y: 265 },
      {
        x: 100 + (right ? 0 : y / 2) * scale,
        y: 265 - (right ? y : (y * Math.sqrt(3)) / 2) * scale,
      },
    ],
    square = ar[0] * ar[0] * br[1] * br[1] + br[0] * br[0] * ar[1] * ar[1],
    den = ar[1] * ar[1] * br[1] * br[1],
    ctext = right ? exactRootText([square, den]) : '?';
  return (
    <PythFrame
      mode={mode}
      caption={
        right
          ? t(
              '直角由题设给定；a、b 是两直角边，c 是斜边，不能任意选第三条作斜边。图按同单位构造，数值判定用精确运算。',
              'The right angle is given. a,b are legs and c the hypotenuse, not an arbitrary third side. The drawing uses equal units; checking uses exact arithmetic.',
            )
          : t(
              '这只是两个边长条件下的一种合法形状，没有额外给直角；不能从图形补条件。',
              'This is one valid shape under the two side-length conditions. No right angle is supplied; do not import one from appearance.',
            )
      }
    >
      <svg
        viewBox="0 0 600 320"
        role="img"
        aria-label={
          right
            ? mode === 'en'
              ? 'Given right triangle'
              : '给定直角三角形'
            : mode === 'en'
              ? 'Triangle without a right-angle premise'
              : '没有直角前提的三角形'
        }
      >
        {rectangle && right && (
          <rect
            x={p[0]!.x}
            y={p[2]!.y}
            width={x * scale}
            height={y * scale}
            fill="none"
            stroke="#999"
            strokeDasharray="4 4"
          />
        )}
        <polygon
          points={poly(p)}
          fill="none"
          stroke="#5954a3"
          strokeWidth="3"
        />
        {right && <Corner at={p[0]!} first={p[1]!} second={p[2]!} />}
        <text x={(p[0]!.x + p[1]!.x) / 2} y="293" textAnchor="middle">
          a={a}
        </text>
        <text x={p[2]!.x - 12} y={(p[0]!.y + p[2]!.y) / 2} textAnchor="end">
          b={unknown === 'b' && !reveal ? '?' : b}
        </text>
        <text x={(p[1]!.x + p[2]!.x) / 2 + 15} y={(p[1]!.y + p[2]!.y) / 2 - 10}>
          c={unknown === 'c' && !reveal ? '?' : ctext}
        </text>
      </svg>
    </PythFrame>
  );
}
export function ConverseView({
  sides,
  mode,
  reveal = false,
}: {
  sides: string[];
  mode: LanguageMode;
  reveal?: boolean;
}) {
  const m = pythagoreanClassification(sides);
  if (!m || m.kind === 'impossible')
    return (
      <p>
        <Text
          mode={mode}
          text={t(
            '不能构成非退化三角形，不画假三角形。',
            'These do not form a nondegenerate triangle; no false triangle is drawn.',
          )}
        />
      </p>
    );
  const [a, b, c] = m.sides.map(num),
    source = sssTriangle(1, a! / c!, b! / c!);
  if (!source || Math.max(...source.map((p) => p.y)) < 1e-10)
    return (
      <p>
        <Text
          mode={mode}
          text={t(
            '精确三边检验仍有效，但该比例超出图形分辨率；按精确边值作答。',
            'The exact side test remains valid, but these proportions exceed drawing resolution. Use the exact values.',
          )}
        />
      </p>
    );
  const scale = Math.min(360, 210 / Math.max(...source.map((p) => p.y))),
    p = source.map((q) => ({ x: 100 + q.x * scale, y: 260 - q.y * scale }));
  return (
    <PythFrame
      mode={mode}
      caption={t(
        '先检查正长度与严格三角形不等式，再把最长边命名为 c。外观不是精确判定；直角标记只在核验后显示。',
        'Check positive lengths and strict triangle inequalities first, then name the longest side c. Appearance is not an exact test; a right-angle mark appears only after verification.',
      )}
    >
      <svg
        viewBox="0 0 600 320"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Triangle constructed from the supplied lengths'
            : '由给定三边构造的三角形'
        }
      >
        <polygon
          points={poly(p)}
          fill="none"
          stroke="#5954a3"
          strokeWidth="3"
        />
        <text x={(p[0]!.x + p[1]!.x) / 2} y="290" textAnchor="middle">
          c={textR(m.sides[2]!)}
        </text>
        <text x={(p[1]!.x + p[2]!.x) / 2 + 12} y={(p[1]!.y + p[2]!.y) / 2}>
          a={textR(m.sides[0]!)}
        </text>
        <text
          x={(p[0]!.x + p[2]!.x) / 2 - 10}
          y={(p[0]!.y + p[2]!.y) / 2}
          textAnchor="end"
        >
          b={textR(m.sides[1]!)}
        </text>
        {reveal && m.kind === 'right' && (
          <Corner at={p[2]!} first={p[0]!} second={p[1]!} />
        )}
      </svg>
    </PythFrame>
  );
}
