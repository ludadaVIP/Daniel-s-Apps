import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import {
  ConceptPlot,
  sampleCurve,
  type ConceptCurve,
} from './FunctionConceptVisuals';
import { DataTable } from './DataModellingVisuals';
import {
  lineConicAudit,
  midpointLocus,
  rationalCircle,
  diameterAudit,
  ellipseRoof,
  pointSetText,
  exactPointNumber,
  type IntersectionConic,
  type LineDirection,
  type MidpointMotion,
  type ExactPoint,
  type ClearanceCase,
} from './analyticGeometryModels';
type Kind = Extract<Lesson['lab'], `analytic-${string}`>;
export const isAnalyticGeometryLab = (kind: Lesson['lab']): kind is Kind =>
  kind.startsWith('analytic-');
const word = (mode: LanguageMode, p: LocalizedText) =>
  mode === 'en' ? p.en : p.zh;
function Select({
  mode,
  name,
  value,
  options,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  options: [string, LocalizedText][];
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
        {options.map(([v, p]) => (
          <option key={v} value={v}>
            {word(mode, p)}
          </option>
        ))}
      </select>
    </label>
  );
}
const opts = (values: (string | number)[]): [string, LocalizedText][] =>
  values.map((v) => [String(v), t(String(v), String(v))]);
function Predict({
  mode,
  name,
  answer,
  hint,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  hint: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-concept-task">
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
              checkAnswer(value, answer)
                ? t(
                    '预测符合。请解释原几何条件、方程与反向核验。',
                    'The prediction matches. Explain the geometric conditions, equation and reverse verification.',
                  )
                : hint
            }
          />
        </p>
      )}
    </div>
  );
}
function Audit({
  mode,
  children,
}: {
  mode: LanguageMode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="math-button secondary"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Text mode={mode} text={t('显示/隐藏核验', 'Show/hide audit')} />
      </button>
      {open && children}
    </>
  );
}

const hint = t(
  '同时核方程与原几何限制，检查是否漏点或多点。',
  'Check both the equation and original geometric restrictions for missing or extra points.',
);
function Task({
  mode,
  name,
  answer,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
}) {
  return (
    <Predict
      key={JSON.stringify(answer)}
      mode={mode}
      name={name}
      answer={answer}
      hint={hint}
    />
  );
}
const num = (value: string | number): AnswerSpec => ({
  kind: 'number',
  value: String(value),
});
const pointSet = (ps: readonly ExactPoint[]): AnswerSpec => ({
  kind: 'plane-point-set',
  value: pointSetText(ps),
});
const domain = (value: string): AnswerSpec => ({ kind: 'real-union', value });
function Evidence({
  mode,
  rows,
}: {
  mode: LanguageMode;
  rows: [LocalizedText, string][];
}) {
  return (
    <DataTable
      mode={mode}
      headers={[
        t('核验量', 'Audit quantity'),
        t('精确结果/条件', 'Exact result / condition'),
      ]}
      rows={rows.map(([p, v]) => [word(mode, p), v])}
    />
  );
}

const xy = (p: ExactPoint, label?: string) => {
  const [x, y] = exactPointNumber(p);
  return { x, y, label };
};
const pair = (p: ExactPoint) => `(${p[0]},${p[1]})`;
const ellipseCurve = (
  name: string,
  cx: number,
  cy: number,
  a: number,
  b: number,
  lo = 0,
  hi = 2 * Math.PI,
  color = '#6254a1',
  dash?: string,
): ConceptCurve => ({
  name,
  color,
  dash,
  points: Array.from({ length: 201 }, (_, i) => {
    const u = lo + ((hi - lo) * i) / 200;
    return { x: cx + a * Math.cos(u), y: cy + b * Math.sin(u) };
  }),
});
function IntersectionFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof lineConicAudit>;
}) {
  const conic: ConceptCurve[] =
    m.kind === 'circle'
      ? [ellipseCurve('circle', 0, 0, 5, 5)]
      : m.kind === 'ellipse'
        ? [ellipseCurve('ellipse', 0, 0, 5, 3)]
        : m.kind === 'parabola'
          ? [sampleCurve('parabola', (x) => x * x, -10, 10)]
          : [-1, 1].map((sign) => ({
              name: `hyperbola ${sign}`,
              points: Array.from({ length: 201 }, (_, i) => {
                const y = -12 + (24 * i) / 200;
                return { x: sign * Math.sqrt(1 + y * y), y };
              }),
            }));
  const [px, py] = m.p.map(Number),
    [dx, dy] = m.d.map(Number);
  return (
    <ConceptPlot
      mode={mode}
      curves={[
        ...conic,
        {
          name: 'line',
          color: '#b86b42',
          dash: '7 4',
          points: [-15, 15].map((t) => ({
            x: px! + dx! * t,
            y: py! + dy! * t,
          })),
        },
      ]}
      points={m.points.map((p, i) => xy(p, `S${i + 1}`))}
      caption={t(
        `${m.conic}与${m.line}，标全部有限交点。先核代入式次数：二次才使用判别式；一次交点不自动叫相切，常数矛盾时无交点。`,
        `Intersect ${m.conic} with ${m.line}; every finite intersection is marked. Check the substituted degree before using a quadratic discriminant. One linear intersection need not be a tangency; a nonzero constant gives no intersections.`,
      )}
    />
  );
}
function Intersections({ mode }: { mode: LanguageMode }) {
  const [kind, K] = useState<IntersectionConic>('circle'),
    [direction, D] = useState<LineDirection>('horizontal'),
    [offset, O] = useState('3'),
    m = lineConicAudit(kind, direction, +offset);
  return (
    <>
      <Select
        mode={mode}
        name={t('圆锥曲线', 'Conic')}
        value={kind}
        options={[
          ['circle', t('圆x²+y²=25', 'Circle x²+y²=25')],
          ['ellipse', t('椭圆9x²+25y²=225', 'Ellipse 9x²+25y²=225')],
          ['parabola', t('抛物线y=x²', 'Parabola y=x²')],
          ['hyperbola', t('双曲线x²−y²=1', 'Hyperbola x²−y²=1')],
        ]}
        change={(v) => {
          K(v as IntersectionConic);
          O('0');
        }}
      />
      <Select
        mode={mode}
        name={t('直线方向', 'Line direction')}
        value={direction}
        options={[
          ['horizontal', t('y=c', 'y=c')],
          ['vertical', t('x=c', 'x=c')],
          ['diagonal', t('y=x+c', 'y=x+c')],
        ]}
        change={(v) => D(v as LineDirection)}
      />
      <Select
        mode={mode}
        name={t('直线常数c', 'Line constant c')}
        value={offset}
        options={opts(kind === 'circle' ? [0, 3, 4, 5, 6] : [0, 1, 2, 3, 4])}
        change={O}
      />
      <p>
        {m.conic}; {m.line}; (x,y)={pair(m.p)}+t{pair(m.d)}
      </p>
      <Task
        mode={mode}
        name={t('全部有限交点', 'All finite intersection points')}
        answer={pointSet(m.points)}
      />
      <Task
        mode={mode}
        name={t('代入后的次数', 'Substituted degree')}
        answer={num(m.degree)}
      />
      <IntersectionFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [
              t('At²+Bt+C=0的系数', 'Coefficients of At²+Bt+C=0'),
              `${m.A},${m.B},${m.C}`,
            ],
            [
              t('判别式（仅二次时使用）', 'Discriminant, only for degree two'),
              m.discriminant ?? 'not quadratic',
            ],
            [
              t('有限参数根', 'Finite parameter roots'),
              `{${m.parameters.join(',')}}`,
            ],
            [
              t('二重根相切', 'Quadratic repeated-root tangency'),
              String(m.tangent),
            ],
            [t('完整点集', 'Complete point set'), pointSetText(m.points)],
          ]}
        />
      </Audit>
    </>
  );
}
function LocusFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof midpointLocus>;
}) {
  const centre = Number(
    m.centre[0].includes('/')
      ? m.centre[0]
          .split('/')
          .map(Number)
          .reduce((a, b) => a / b)
      : m.centre[0],
  );
  return (
    <ConceptPlot
      mode={mode}
      curves={[
        ellipseCurve(
          'source circle',
          0,
          0,
          m.r,
          m.r,
          0,
          2 * Math.PI,
          '#7b9295',
          '5 5',
        ),
        ellipseCurve(
          'midpoint locus',
          centre,
          0,
          m.r / 2,
          m.r / 2,
          0,
          m.motion === 'all' ? 2 * Math.PI : Math.PI,
        ),
      ]}
      points={[
        { x: m.a, y: 0, label: 'A' },
        ...(m.admitted ? [xy(m.source, 'P'), xy(m.midpoint, 'M')] : []),
      ]}
      ends={
        m.motion === 'upper-excluded' ? [{ ...xy(m.hole), closed: false }] : []
      }
      caption={t(
        `灰虚线是完整源圆参照，紫线才是允许的M轨迹。源运动${m.motion}；只标合法P/M，非法代数候选在表中检查。反构P=(2x−a,2y)须同时回到圆和原运动范围。`,
        `Grey dashed is the full source-circle reference; purple is the admissible M locus for motion ${m.motion}. Only admissible P/M are marked; audit rejected algebraic candidates in the table. Reconstruction P=(2x−a,2y) must recover both the circle and original motion restrictions.`,
      )}
    />
  );
}
function Loci({ mode }: { mode: LanguageMode }) {
  const [a, A] = useState('2'),
    [r, R] = useState('4'),
    [motion, M] = useState<MidpointMotion>('all'),
    [card, C] = useState('0'),
    m = midpointLocus(+a, +r, motion, +card);
  return (
    <>
      <Select
        mode={mode}
        name={t('固定点A的横坐标a', 'Fixed point A coordinate a')}
        value={a}
        options={opts([-2, 0, 2])}
        change={A}
      />
      <Select
        mode={mode}
        name={t('源圆半径r', 'Source circle radius r')}
        value={r}
        options={opts([2, 4, 6])}
        change={R}
      />
      <Select
        mode={mode}
        name={t('源点允许范围', 'Allowed source motion')}
        value={motion}
        options={[
          ['all', t('完整圆', 'Full circle')],
          ['upper', t('上半圆含端点', 'Upper semicircle, endpoints included')],
          [
            'upper-excluded',
            t('上半圆但排除(r,0)', 'Upper semicircle excluding (r,0)'),
          ],
        ]}
        change={(v) => M(v as MidpointMotion)}
      />
      <Select
        mode={mode}
        name={t('源候选P', 'Source candidate P')}
        value={card}
        options={[
          ['0', t('(0,r)', '(0,r)')],
          ['1', t('(0,−r)', '(0,−r)')],
          ['2', t('(r,0)', '(r,0)')],
          ['3', t('(−r,0)', '(−r,0)')],
        ]}
        change={C}
      />
      <Task
        mode={mode}
        name={t('代数中点候选M', 'Algebraic midpoint candidate M')}
        answer={{ kind: 'coordinate', value: pair(m.midpoint) }}
      />
      <Task
        mode={mode}
        name={t('M满足的圆方程', 'Circle equation satisfied by M')}
        answer={{ kind: 'plane-equation', value: m.equation }}
      />
      <Task
        mode={mode}
        name={t('M属于原几何轨迹', 'M belongs to original geometric locus')}
        answer={{ kind: 'logic-code', value: m.admitted ? 'in' : 'out' }}
      />
      <LocusFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [
              t('代数候选P / M', 'Algebraic P / M'),
              `${pair(m.source)} / ${pair(m.midpoint)}`,
            ],
            [t('中点方程', 'Midpoint equation'), m.equation],
            [
              t('圆心 / 半径平方', 'Centre / squared radius'),
              `${pair(m.centre)} / ${m.radiusSquare}`,
            ],
            [t('反构的P', 'Reconstructed P'), pair(m.reconstruct(m.midpoint))],
            [
              t('额外限制', 'Additional restrictions'),
              m.motion === 'all'
                ? 'none'
                : m.motion === 'upper'
                  ? 'y≥0'
                  : `y≥0; M≠${pair(m.hole)}`,
            ],
          ]}
        />
      </Audit>
    </>
  );
}
function ParameterFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof rationalCircle>;
}) {
  const lo = m.restricted ? 0 : -4,
    hi = m.restricted ? 1 : 4;
  const trace: ConceptCurve = {
    name: 'rational parameter trace',
    points: Array.from({ length: 241 }, (_, i) => {
      const t = lo + ((hi - lo) * i) / 240;
      return {
        x: (m.r * (1 - t * t)) / (1 + t * t),
        y: (2 * m.r * t) / (1 + t * t),
      };
    }),
  };
  return (
    <ConceptPlot
      mode={mode}
      curves={[
        ellipseCurve(
          'full circle',
          0,
          0,
          m.r,
          m.r,
          0,
          2 * Math.PI,
          '#7b9295',
          '5 5',
        ),
        trace,
      ]}
      points={[xy(m.point, m.admitted ? 'P' : 'candidate')]}
      ends={[{ ...xy(m.omitted), closed: false }]}
      caption={t(
        `灰圆为x²+y²=${m.r * m.r}，紫线仅绘参数窗t∈[${lo},${hi}]；完整参数域${m.domain}不等于此绘图窗。空心E${pair(m.omitted)}仍属于圆，但没有有限t表示；要覆盖整个圆须另补E。限制t∈[0,1]时只取第一象限弧。`,
        `Grey is the full circle x²+y²=${m.r * m.r}; purple draws only t∈[${lo},${hi}], distinct from the full parameter domain ${m.domain}. Open E${pair(m.omitted)} belongs to the circle but has no finite t; add it separately to cover the whole circle. Restricting t to [0,1] gives only the first-quadrant arc.`,
      )}
    />
  );
}
function Parameters({ mode }: { mode: LanguageMode }) {
  const [r, R] = useState('5'),
    [tRaw, T] = useState('1/2'),
    [scope, S] = useState('all'),
    m = rationalCircle(+r, tRaw, scope === 'arc');
  return (
    <>
      <Select
        mode={mode}
        name={t('圆半径r', 'Circle radius r')}
        value={r}
        options={opts([3, 5])}
        change={R}
      />
      <Select
        mode={mode}
        name={t('参数t', 'Parameter t')}
        value={tRaw}
        options={opts(['-2', '-1', '0', '1/2', '1', '2'])}
        change={T}
      />
      <Select
        mode={mode}
        name={t('参数定义域', 'Parameter domain')}
        value={scope}
        options={[
          ['all', t('全部实数t', 'All real t')],
          ['arc', t('闭区间[0,1]', 'Closed interval [0,1]')],
        ]}
        change={S}
      />
      <p>x=r(1−t²)/(1+t²), y=2rt/(1+t²)</p>
      <Task
        mode={mode}
        name={t('代数参数点P', 'Algebraic parameter point P')}
        answer={{ kind: 'coordinate', value: pair(m.point) }}
      />
      <Task
        mode={mode}
        name={t('当前t是否允许', 'Current t is allowed')}
        answer={{ kind: 'logic-code', value: m.admitted ? 'in' : 'out' }}
      />
      <Task
        mode={mode}
        name={t('漏掉的圆点E', 'Omitted circle point E')}
        answer={{ kind: 'coordinate', value: pair(m.omitted) }}
      />
      <ParameterFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('代数点', 'Algebraic point'), pair(m.point)],
            [
              t('允许的反参数y/(x+r)', 'Admissible inverse parameter y/(x+r)'),
              m.inverse(m.point) ?? 'outside-domain',
            ],
            [
              t('E的有限反参数', 'Finite inverse parameter for E'),
              m.inverse(m.omitted) ?? 'outside-domain',
            ],
            [t('轨迹方程', 'Locus equation'), m.equation],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '分母1+t²始终正，但这不证明覆盖整个圆；反参数在E处分母为0。t不是时间，也不保证等参数步长对应等弧长。',
              'The denominator 1+t² is positive, but this does not prove coverage of the whole circle. The inverse denominator vanishes at E. Parameter t is not automatically time or uniform arc length.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
function VectorFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof diameterAudit>;
}) {
  const [px, py] = exactPointNumber(m.p),
    a = m.a;
  return (
    <ConceptPlot
      mode={mode}
      curves={[
        ellipseCurve('candidate equation circle', 0, 0, a, a),
        {
          name: 'PA segment',
          color: '#b86b42',
          points: [
            { x: px, y: py },
            { x: -a, y: 0 },
          ],
        },
        {
          name: 'PB segment',
          color: '#7b9295',
          dash: '6 4',
          points: [
            { x: px, y: py },
            { x: a, y: 0 },
          ],
        },
      ]}
      points={m.angle === 'undefined' ? [] : [xy(m.p, 'P candidate')]}
      ends={[
        { x: -a, y: 0, closed: false },
        { x: a, y: 0, closed: false },
      ]}
      caption={t(
        `A=(−${a},0)、B=(${a},0)。圆仅是代数候选；原直角轨迹排除空心A/B。线段PA/PB须都非零才谈夹角。当前P${pair(m.p)}：${m.angle}，点积${m.dot}；红点不自动是轨迹点。`,
        `A=(−${a},0), B=(${a},0). The circle is the algebraic candidate; the right-angle locus excludes open A/B. Both PA and PB must be nonzero to define an angle. Current P${pair(m.p)}: ${m.angle}, dot product ${m.dot}; a red candidate is not automatically in the locus.`,
      )}
    />
  );
}
function Vectors({ mode }: { mode: LanguageMode }) {
  const [a, A] = useState('3'),
    [probe, P] = useState('top'),
    size = +a;
  const point: ExactPoint =
    probe === 'top'
      ? ['0', a]
      : probe === 'inside'
        ? ['0', `${size}/2`]
        : probe === 'outside'
          ? ['0', String(2 * size)]
          : probe === 'A'
            ? [String(-size), '0']
            : probe === 'B'
              ? [a, '0']
              : ['0', '0'];
  const m = diameterAudit(size, point);
  return (
    <>
      <Select
        mode={mode}
        name={t('半直径a', 'Half-diameter a')}
        value={a}
        options={opts([2, 3, 4])}
        change={A}
      />
      <Select
        mode={mode}
        name={t('点P的情形', 'Point P case')}
        value={probe}
        options={[
          ['top', t('圆顶点', 'Top of circle')],
          ['inside', t('圆内非共线', 'Inside, non-collinear')],
          ['outside', t('圆外非共线', 'Outside, non-collinear')],
          ['A', t('端点A', 'Endpoint A')],
          ['B', t('端点B', 'Endpoint B')],
          ['centre', t('圆心', 'Centre')],
        ]}
        change={P}
      />
      <Task
        mode={mode}
        name={t('向量点积', 'Vector dot product')}
        answer={num(m.dot)}
      />
      <Task
        mode={mode}
        name={t('角APB类型', 'Angle APB classification')}
        answer={{ kind: 'vector-code', value: m.angle }}
      />
      <Task
        mode={mode}
        name={t(
          '原直角轨迹排除的点',
          'Points excluded from the original right-angle locus',
        )}
        answer={pointSet(m.endpoints)}
      />
      <VectorFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [t('候选P', 'Candidate P'), pair(point)],
            [t('点积 / 叉积', 'Dot / planar cross'), `${m.dot} / ${m.cross}`],
            [
              t('满足圆方程', 'Satisfies circle equation'),
              String(m.onEquation),
            ],
            [
              t(
                '满足非零直角条件',
                'Satisfies the nonzero right-angle condition',
              ),
              String(m.admitted),
            ],
            [t('代数候选方程', 'Algebraic candidate equation'), m.equation],
          ]}
        />
      </Audit>
    </>
  );
}
function RoofFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof ellipseRoof>;
}) {
  return (
    <ConceptPlot
      mode={mode}
      wide={m.scale === 2}
      xLabel="x/m"
      yLabel="y/m"
      curves={[
        ellipseCurve('roof', 0, 0, m.a, m.b, 0, Math.PI),
        ellipseCurve(
          'excluded lower ellipse',
          0,
          0,
          m.a,
          m.b,
          Math.PI,
          2 * Math.PI,
          '#7b9295',
          '4 5',
        ),
        sampleCurve(
          'clearance',
          () =>
            Number(
              m.height.includes('/')
                ? m.height
                    .split('/')
                    .map(Number)
                    .reduce((a, b) => a / b)
                : m.height,
            ),
          -15,
          15,
          '#b86b42',
          '7 4',
        ),
      ]}
      points={m.points.map((p, i) => xy(p, `C${i + 1}`))}
      caption={t(
        `屋顶为上半椭圆${m.equation}，y≥0，坐标单位米。灰虚线下半椭圆不属于屋顶；橙虚线为净高${m.height}m。宽度为左右横坐标之差，顶点单点宽0，超过顶高无可行横坐标，不写成宽0。`,
        `The roof is the upper half of ${m.equation}, y≥0, with both coordinates in metres. Grey lower ellipse is excluded; orange dashed is clearance ${m.height}m. Width is the difference of left and right coordinates. The apex has width zero; above the apex there is no feasible x set, rather than a zero-width opening.`,
      )}
    />
  );
}
function Modelling({ mode }: { mode: LanguageMode }) {
  const [scale, S] = useState('1'),
    [clearance, C] = useState<ClearanceCase>('low'),
    m = ellipseRoof(+scale, clearance);
  return (
    <>
      <Select
        mode={mode}
        name={t('椭圆尺度', 'Ellipse scale')}
        value={scale}
        options={[
          ['1', t('a5m,b3m', 'a=5m, b=3m')],
          ['2', t('a10m,b6m', 'a=10m, b=6m')],
        ]}
        change={S}
      />
      <Select
        mode={mode}
        name={t('预设净高', 'Prespecified clearance')}
        value={clearance}
        options={[
          ['floor', t('地面0', 'Floor zero')],
          ['low', t('3b/5', '3b/5')],
          ['high', t('4b/5', '4b/5')],
          ['apex', t('顶高b', 'Apex height b')],
          ['above', t('超过顶高1米', 'One metre above apex')],
        ]}
        change={(v) => C(v as ClearanceCase)}
      />
      <Task
        mode={mode}
        name={t('净高处可行横坐标集合', 'Feasible x set at clearance')}
        answer={domain(m.admissibleX)}
      />
      <Task
        mode={mode}
        name={t(
          '完整宽度/米（无可行则empty）',
          'Full width in metres (empty if infeasible)',
        )}
        answer={
          m.width === null
            ? { kind: 'conic-code', value: 'empty' }
            : num(m.width)
        }
      />
      <Task
        mode={mode}
        name={t('净高与屋顶全部交点', 'All roof intersections at clearance')}
        answer={pointSet(m.points)}
      />
      <RoofFigure mode={mode} m={m} />
      <Audit mode={mode}>
        <Evidence
          mode={mode}
          rows={[
            [
              t('屋顶模型与限制', 'Roof model and restriction'),
              `${m.equation}; y≥0`,
            ],
            [t('净高/米', 'Clearance/metres'), m.height],
            [t('半宽/米', 'Half-width/metres'), m.half ?? 'empty'],
            [t('完整宽/米', 'Full width/metres'), m.width ?? 'empty'],
            [
              t('有正宽度开口', 'Has a positive-width opening'),
              String(m.positiveOpening),
            ],
          ]}
        />
        <p>
          <Text
            mode={mode}
            text={t(
              '这是零厚度截面模型，保留地面、对称、单位和净高要求；几何可行不等于承载或施工条件已验证。',
              'This zero-thickness cross-section model retains floor, symmetry, units and clearance requirements. Geometric feasibility does not establish load-bearing or construction conditions.',
            )}
          />
        </p>
      </Audit>
    </>
  );
}
export function AnalyticGeometryLab({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-concept-lab">
      {kind === 'analytic-intersections' ? (
        <Intersections mode={mode} />
      ) : kind === 'analytic-locus' ? (
        <Loci mode={mode} />
      ) : kind === 'analytic-parameter' ? (
        <Parameters mode={mode} />
      ) : kind === 'analytic-vectors' ? (
        <Vectors mode={mode} />
      ) : (
        <Modelling mode={mode} />
      )}
    </section>
  );
}
export function AnalyticGeometryHookArt({
  kind,
  mode,
}: {
  kind: Kind;
  mode: LanguageMode;
}) {
  if (kind === 'analytic-intersections')
    return (
      <IntersectionFigure
        mode={mode}
        m={lineConicAudit('circle', 'horizontal', 3)}
      />
    );
  if (kind === 'analytic-locus')
    return (
      <LocusFigure mode={mode} m={midpointLocus(2, 4, 'upper-excluded', 0)} />
    );
  if (kind === 'analytic-parameter')
    return <ParameterFigure mode={mode} m={rationalCircle(5, '1/2')} />;
  if (kind === 'analytic-vectors')
    return <VectorFigure mode={mode} m={diameterAudit(3, ['0', '3'])} />;
  return <RoofFigure mode={mode} m={ellipseRoof(1, 'low')} />;
}
