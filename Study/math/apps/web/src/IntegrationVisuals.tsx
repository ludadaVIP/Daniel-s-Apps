import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { CartesianPlot } from './CartesianVisuals';
import {
  rectangleLink,
  integrationGraph,
  rampModel,
  defaultRamp,
  type RampParams,
  type IntegrationGraphKind,
} from './integrationModels';
import { textR } from './algebraModels';
const value = (r: readonly bigint[]) => Number(r[0]) / Number(r[1]);
function SvgWords({
  x,
  mode,
  text,
}: {
  x: number;
  mode: LanguageMode;
  text: LocalizedText;
}) {
  return (
    <>
      <tspan x={x}>{mode === 'en' ? text.en : text.zh}</tspan>
      {mode === 'bilingual' && (
        <tspan x={x} dy="18">
          {text.en}
        </tspan>
      )}
    </>
  );
}
export function IntegrationFrame({
  mode,
  caption,
  children,
}: {
  mode: LanguageMode;
  caption: LocalizedText;
  children: React.ReactNode;
}) {
  return (
    <figure className="math-integration-figure">
      <div
        className="math-integration-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Integration model; scroll locally'
            : '知识联结图；需要时在图内滚动'
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
export function RectangleLinkView({
  mode,
  x = '3',
  offset = 2,
  reveal = false,
  zoom = 1,
}: {
  mode: LanguageMode;
  x?: string;
  offset?: number;
  reveal?: boolean;
  zoom?: number;
}) {
  const m = rectangleLink(x, offset),
    a = value(m.x),
    b = value(m.long),
    u = Math.min(400 / b, 200 / a) * zoom,
    left = 130,
    top = 105,
    w = b * u,
    h = a * u;
  return (
    <IntegrationFrame
      mode={mode}
      caption={t(
        '同一长度单位的正长方形分为x×x与x×d两块。移动x改变例图大小，不改变同一d下的一般代数关系；面积与周长单位不同。',
        'A positive rectangle uses common length units and splits into x×x and x×d. Moving x changes this instance, while the general relation for fixed d stays unchanged. Area and perimeter have different units.',
      )}
    >
      <svg
        viewBox="0 0 720 430"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Rectangle split into square and strip'
            : '长方形分成正方形与长条'
        }
      >
        <text x="30" y="30">
          <SvgWords
            x={30}
            mode={mode}
            text={t(`当前x=${x}；d=${offset}`, `Current x=${x}; d=${offset}`)}
          />
        </text>
        <rect
          data-integration-square
          x={left}
          y={top}
          width={a * u}
          height={h}
          fill="#e8e3f3"
          stroke="#5954a3"
        />
        {offset > 0 && (
          <rect
            data-integration-strip
            x={left + a * u}
            y={top}
            width={offset * u}
            height={h}
            fill="#dcefed"
            stroke="#237e87"
          />
        )}
        <text x={left + w / 2} y={top + h + 32} textAnchor="middle">
          {offset ? `x + ${offset}` : 'x'}
        </text>
        <text x={left - 30} y={top + h / 2} textAnchor="middle">
          x
        </text>
        {reveal && (
          <>
            <text
              x={left + (a * u) / 2}
              y={top + h / 2 + 5}
              textAnchor="middle"
            >
              x²
            </text>
            {offset > 0 && (
              <text
                x={left + (a + offset / 2) * u}
                y={top + h / 2 + 5}
                textAnchor="middle"
              >
                {offset}x
              </text>
            )}
          </>
        )}
      </svg>
    </IntegrationFrame>
  );
}
export function IntegrationGraphView({
  mode,
  kind = 'affine',
  query = '2',
  wide = false,
  alternatives = false,
}: {
  mode: LanguageMode;
  kind?: IntegrationGraphKind;
  query?: string;
  wide?: boolean;
  alternatives?: boolean;
}) {
  const m = integrationGraph(kind, query),
    q = value(m.x),
    selected = m.domain && m.value ? { x: q, y: value(m.value) } : undefined;
  if (kind === 'drain')
    return (
      <CartesianPlot
        mode={mode}
        bounds={{
          xMin: 0,
          xMax: wide ? 12 : 10,
          yMin: 0,
          yMax: wide ? 15 : 12,
          xStep: wide ? 2 : 1,
          yStep: 3,
        }}
        curves={[
          {
            name: 'given full piecewise-linear trace',
            points: [
              { x: 0, y: 12 },
              { x: 3, y: 6 },
              { x: 6, y: 6 },
              { x: 9, y: 0 },
            ],
          },
        ]}
        points={[
          { x: 0, y: 12, label: 'A' },
          { x: 3, y: 6, label: 'B' },
          { x: 6, y: 6, label: 'C' },
          { x: 9, y: 0, label: 'D' },
        ]}
        selected={selected}
        xLabel={mode === 'en' ? 't (min)' : 't（分钟）'}
        yLabel={mode === 'en' ? 'V (L)' : 'V（升）'}
        caption={t(
          '题目给定完整直线段规则：0–3分钟匀速下降，3–6分钟暂停，6–9分钟再下降，到空停止。不是仅凭四个观测点假设线性；横纵轴表示不同量。',
          'The complete straight-segment rule is given: drain at a constant rate for 0–3 min, pause during 3–6, then drain during 6–9 and stop at empty. Linearity is supplied rather than inferred from four samples; axes represent different quantities.',
        )}
      />
    );
  if (kind === 'observations')
    return (
      <CartesianPlot
        mode={mode}
        bounds={{
          xMin: 0,
          xMax: wide ? 4 : 3,
          yMin: 0,
          yMax: wide ? 8 : 5,
          xStep: 1,
          yStep: 1,
        }}
        points={[
          { x: 0, y: 0, label: 'A' },
          { x: 1, y: 1, label: 'B' },
        ]}
        curves={
          alternatives
            ? [
                {
                  name: 'possible f=x',
                  points: [
                    { x: 0, y: 0 },
                    { x: 2, y: 2 },
                  ],
                  dash: '7 4',
                },
                {
                  name: 'possible f=x²',
                  points: Array.from({ length: 17 }, (_, i) => ({
                    x: i / 8,
                    y: (i / 8) ** 2,
                  })),
                  color: '#237e87',
                  dash: '2 4',
                },
              ]
            : []
        }
        xLabel="x"
        yLabel="f(x)"
        caption={t(
          '仅给A(0,0)、B(1,1)两个观测点。虚线若显示，分别是可行延伸f=x与f=x²，不是推定的真实规律；在2处给2与4。',
          'Only observations A(0,0), B(1,1) are supplied. Dashed examples, when shown, are possible extensions f=x and f=x², not established true rules; they give 2 and 4 at two.',
        )}
      />
    );
  const count = kind === 'count',
    points = count
      ? Array.from({ length: 6 }, (_, n) => ({
          x: n,
          y: 2 * n + 3,
          label: String(n),
        }))
      : [
          { x: 0, y: 3, label: 'A' },
          { x: 4, y: 11, label: 'B' },
        ];
  return (
    <CartesianPlot
      mode={mode}
      bounds={{
        xMin: 0,
        xMax: wide ? 8 : 6,
        yMin: 0,
        yMax: wide ? 18 : 15,
        xStep: 1,
        yStep: 3,
      }}
      points={points}
      curves={
        count
          ? []
          : [
              {
                name: 'given affine rule on [0,4]',
                points: [
                  { x: 0, y: 3 },
                  { x: 4, y: 11 },
                ],
              },
            ]
      }
      selected={selected}
      xLabel={count ? (mode === 'en' ? 'n (cards)' : 'n（卡片数）') : 'x'}
      yLabel={count ? 'C (NZ$)' : 'y'}
      caption={
        count
          ? t(
              '规则给C=2n+3，但只出售整数0–5张；只画允许点，不用连线允许半张。',
              'C=2n+3 is supplied, but only integer counts 0–5 are sold. Plot permitted points without connecting them to authorise half a card.',
            )
          : t(
              '题目明确为0≤x≤4上的一次函数，给A(0,3)、B(4,11)。用数值变化比求斜率，屏幕倾斜角不代替斜率。',
              'An affine function on 0≤x≤4 is explicitly given through A(0,3), B(4,11). Use numerical changes to recover slope; screen inclination is not the numerical rate.',
            )
      }
    />
  );
}
export function RampView({
  mode,
  params = defaultRamp,
  reveal = false,
  zoom = 1,
}: {
  mode: LanguageMode;
  params?: RampParams;
  reveal?: boolean;
  zoom?: number;
}) {
  const m = rampModel(params),
    h = value(m.h),
    r = value(m.r),
    w = value(m.w),
    u = Math.min(400 / r, 190 / h) * zoom,
    x = 100,
    y = 290,
    right = x + r * u,
    top = y - h * u,
    pu = Math.min(330 / m.length, 70 / w),
    sx = 130,
    sy = 365;
  return (
    <IntegrationFrame
      mode={mode}
      caption={t(
        '纸上虚构模型：侧面为给定直角三角形，坡面是一块长方形。每个图内横纵长度同单位、同标尺；展开图与侧视图各有自己的显示比例。只计算单块坡面，不包括支架、厚度、浪费与实际施工条件。',
        'Fictional paper model: a given right-triangle side and one rectangular inclined surface. Each panel uses a common horizontal/vertical length scale; side and unfolded panels have their own display scales. Count only the surface, excluding supports, thickness, waste and actual construction conditions.',
      )}
    >
      <svg
        viewBox="0 0 720 500"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Paper ramp side and unfolded surface'
            : '纸上坡道侧面与展开坡面'
        }
      >
        <text x="30" y="30">
          <SvgWords
            x={30}
            mode={mode}
            text={t(
              '侧视：直角是给定条件',
              'Side view: the right angle is given',
            )}
          />
        </text>
        <polygon
          data-ramp-side
          points={`${x},${y} ${right},${y} ${right},${top}`}
          fill="#e8e3f3"
          stroke="#5954a3"
          strokeWidth="2"
        />
        <polyline
          points={`${right - 10},${y} ${right - 10},${y - 10} ${right},${y - 10}`}
          fill="none"
          stroke="currentColor"
        />
        <text x={(x + right) / 2} y={y + 30} textAnchor="middle">
          r={textR(m.r)} m
        </text>
        <text x={right + 14} y={(y + top) / 2 + 4}>
          h={textR(m.h)} m
        </text>
        <text x={(x + right) / 2} y={(y + top) / 2 - 22} textAnchor="middle">
          s={reveal ? m.lengthExact : '?'} m
        </text>
        <rect
          data-ramp-surface
          x={sx}
          y={sy}
          width={m.length * pu}
          height={w * pu}
          fill="#dcefed"
          stroke="#237e87"
        />
        <text x={sx + (m.length * pu) / 2} y={sy - 12} textAnchor="middle">
          A = s × w
        </text>
        <text x={sx + m.length * pu + 15} y={sy + (w * pu) / 2 + 5}>
          w={textR(m.w)} m
        </text>
        <text x="30" y="475">
          <SvgWords
            x={30}
            mode={mode}
            text={t(
              '展开图：长s、宽w；不是底面r×w',
              'Unfolded: length s, width w; not the base r×w',
            )}
          />
        </text>
      </svg>
    </IntegrationFrame>
  );
}
