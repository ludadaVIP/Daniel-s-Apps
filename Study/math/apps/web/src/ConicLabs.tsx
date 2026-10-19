import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { textR, divR, negR, mulR } from './algebraModels';
import { coordinateText } from './cartesianModels';
import { DataTable } from './DataModellingVisuals';
import { ConicFigure, FocalFigure } from './ConicVisuals';
import {
  cq,
  cp,
  planeLine,
  lineEquation,
  projectionFoot,
  lineDistanceSquare,
  exactDistance,
  circleLocus,
  circlePosition,
  parabolaModel,
  focalModel,
  conicPoint,
  type ConicAxis,
} from './conicModels';
export type ConicLabKind = Extract<Lesson['lab'], `conic-${string}`>;
export const isConicLab = (kind: Lesson['lab']): kind is ConicLabKind =>
  kind.startsWith('conic-');
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
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
const options = (values: string[]): [string, LocalizedText][] =>
  values.map((v) => [v, t(v, v)]);
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
    [show, setShow] = useState(false),
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
              correct
                ? t(
                    '预测符合。再指出定义中的距离、方向或非退化条件。',
                    'The prediction matches. Identify the distances, orientation or nondegeneracy condition in the definition.',
                  )
                : hint
            }
          />
        </p>
      )}
      {checked && !correct && (
        <button className="math-button" onClick={() => setShow(!show)}>
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
function View({
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
        <Text mode={mode} text={t('显示/隐藏核验', 'Show/hide audit')} />
      </button>
    </>
  );
}
const equation = (value: string): AnswerSpec => ({
  kind: 'plane-equation',
  value,
});
const number = (value: string): AnswerSpec => ({ kind: 'number', value });
const coordinate = (value: string): AnswerSpec => ({
  kind: 'coordinate',
  value,
});
const radial = (value: string): AnswerSpec => ({ kind: 'radical', value });
const lines = [
  [2, -1, 1],
  [1, 0, -2],
  [0, 1, 3],
  [-4, 2, -2],
] as const;
const distanceLines = [
  [3, 4, -5],
  [-6, -8, 10],
  [1, 0, -2],
  [0, 1, 3],
] as const;
const fromCoeffs = (v: readonly [number, number, number]) =>
  planeLine(v[0], v[1], v[2]);
function LineLab({
  mode,
  distance,
}: {
  mode: LanguageMode;
  distance: boolean;
}) {
  const [index, setIndex] = useState(0),
    [point, setPoint] = useState(0),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false);
  const line = fromCoeffs((distance ? distanceLines : lines)[index]!),
    p = [cp(1, 3), cp(2, 0), cp(-1, -2), cp(0, 0)][point]!,
    foot = projectionFoot(line, p),
    sq = lineDistanceSquare(line, p),
    eq = lineEquation(line),
    d = exactDistance(sq),
    base = projectionFoot(line, cp(0, 0));
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            distance
              ? t(
                  '距离是到垂足H的最短线段PH，不是竖直差。Ax+By+C=0的(A,B)是法向量；改用非零倍数不会改变直线或距离。',
                  'Distance is the shortest segment PH to the perpendicular foot, not a vertical gap. The vector (A,B) is normal to Ax+By+C=0; nonzero scaling changes neither the line nor its distance.',
                )
              : t(
                  '一点和一个非零方向决定直线。先由图中P₀和方向(B,−A)写任意等价直线方程；斜率式不能表示竖直线。',
                  'A point and a nonzero direction determine a line. Use P₀ and direction (B,−A) to write any equivalent line equation. Slope form cannot represent a vertical line.',
                )
          }
        />
      </p>
      <Select
        mode={mode}
        name={t('选择直线', 'Choose a line')}
        value={String(index)}
        values={(distance ? distanceLines : lines).map((v, i) => [
          String(i),
          t(
            distance
              ? `${v[0]}x+(${v[1]})y+(${v[2]})=0`
              : `P₀${coordinateText(projectionFoot(fromCoeffs(v), cp(0, 0)))}；方向(${v[1]},${-v[0]})`,
            distance
              ? `${v[0]}x+(${v[1]})y+(${v[2]})=0`
              : `P₀${coordinateText(projectionFoot(fromCoeffs(v), cp(0, 0)))}; direction (${v[1]},${-v[0]})`,
          ),
        ])}
        change={(v) => {
          setIndex(Number(v));
          setReveal(false);
        }}
      />
      {distance ? (
        <>
          <Select
            mode={mode}
            name={t('选择点P', 'Choose point P')}
            value={String(point)}
            values={['(1,3)', '(2,0)', '(-1,-2)', '(0,0)'].map((v, i) => [
              String(i),
              t(v, v),
            ])}
            change={(v) => {
              setPoint(Number(v));
              setReveal(false);
            }}
          />
          <Prediction
            key={`foot-${eq}-${coordinateText(p)}`}
            mode={mode}
            name={t('预测垂足H坐标', 'Predict foot H coordinates')}
            answer={coordinate(coordinateText(foot))}
            hint={t(
              '沿法向量扣去(Ax₀+By₀+C)/(A²+B²)倍(A,B)，再代回直线。',
              'Subtract (Ax₀+By₀+C)/(A²+B²) times the normal (A,B), then substitute into the line.',
            )}
            solution={t(
              `H=${coordinateText(foot)}，PH垂直直线且H在直线上。`,
              `H=${coordinateText(foot)} lies on the line and PH is perpendicular to it.`,
            )}
          />
          <Prediction
            key={`distance-${textR(sq)}`}
            mode={mode}
            name={t(
              '预测点到直线的精确距离',
              'Predict exact point-to-line distance',
            )}
            answer={radial(`sqrt(${textR(sq)})`)}
            hint={t(
              '用|Ax₀+By₀+C|/sqrt(A²+B²)，不可丢绝对值或分母。',
              'Use |Ax₀+By₀+C|/sqrt(A²+B²), retaining absolute value and denominator.',
            )}
            solution={t(
              `距离平方=${textR(sq)}，非负距离=${d}。`,
              `Squared distance=${textR(sq)}; nonnegative distance=${d}.`,
            )}
          />
        </>
      ) : (
        <>
          <p>
            P₀={coordinateText(base)}；(B,−A)=({textR(line.b)},
            {textR(negR(line.a))})
          </p>
          <Prediction
            key={eq}
            mode={mode}
            name={t('写出这条直线的方程', 'Write this line equation')}
            answer={equation(eq)}
            hint={t(
              '一般式Ax+By+C=0包含竖直线；检验P₀在直线上，法向量与所给方向点积为0。',
              'General form Ax+By+C=0 includes vertical lines. Check P₀ and that the normal is perpendicular to the given direction.',
            )}
            solution={t(
              `可写${eq}；两边移项或乘非零常数仍是同一直线。`,
              `One form is ${eq}; rearrangement or nonzero scaling describes the same line.`,
            )}
          />
          <Prediction
            key={`slope-${eq}`}
            mode={mode}
            name={t('预测斜率或undefined', 'Predict slope or undefined')}
            answer={
              line.b[0]
                ? number(textR(divR(negR(line.a), line.b)))
                : { kind: 'conic-code', value: 'undefined' }
            }
            hint={t(
              'B≠0时斜率−A/B；B=0时x固定，斜率无定义，不是0。',
              'For B≠0 the slope is −A/B; B=0 fixes x and has undefined slope, not zero.',
            )}
            solution={t(
              line.b[0]
                ? `m=${textR(divR(negR(line.a), line.b))}`
                : '竖直线Δx=0，不能除以0。',
              line.b[0]
                ? `m=${textR(divR(negR(line.a), line.b))}`
                : 'A vertical line has Δx=0; division by zero is undefined.',
            )}
          />
        </>
      )}
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <ConicFigure
        mode={mode}
        line={line}
        wide={wide}
        points={
          distance
            ? [
                { name: 'P', point: p },
                ...(reveal ? [{ name: 'H', point: foot }] : []),
              ]
            : [{ name: 'P₀', point: base }]
        }
        segments={distance && reveal ? [{ name: 'PH', from: p, to: foot }] : []}
        caption={t(
          '紫线为整条直线的图窗部分；垂足通过法向投影计算。若P在线上，P与H合并，距离为0。两轴同单位。',
          'Purple shows the line within this window. The foot is computed by normal projection. If P lies on the line, P and H coincide and distance is zero. Axes use equal units.',
        )}
      />
      {reveal && (
        <DataTable
          mode={mode}
          headers={[t('量', 'Quantity'), t('精确结果', 'Exact result')]}
          rows={
            distance
              ? [
                  ['P', coordinateText(p)],
                  ['H', coordinateText(foot)],
                  ['d²', textR(sq)],
                  ['d', d],
                ]
              : [
                  ['Ax+By+C=0', eq],
                  [
                    word(mode, t('法向量(A,B)', 'Normal (A,B)')),
                    `(${textR(line.a)},${textR(line.b)})`,
                  ],
                  [
                    word(mode, t('斜率', 'Slope')),
                    line.b[0] ? textR(divR(negR(line.a), line.b)) : 'undefined',
                  ],
                ]
          }
        />
      )}
    </>
  );
}
function CircleLab({ mode }: { mode: LanguageMode }) {
  const [h, setH] = useState(1),
    [k, setK] = useState(-2),
    [rs, setRs] = useState(25),
    [point, setPoint] = useState(0),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false),
    m = circleLocus(h, k, rs),
    p = [cp(4, 2), cp(1, -2), cp(0, 0), cp(1, 3)][point]!;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '圆上每点到中心C(h,k)的距离都是r>0；平方后得到(x−h)²+(y−k)²=r²。右边是半径平方。零对应一个点，负数没有实点。',
            'A circle consists of points at distance r>0 from C(h,k). Squaring gives (x−h)²+(y−k)²=r². The right side is radius squared: zero gives one point and a negative value gives no real points.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('圆心横坐标h', 'Centre x-coordinate h')}
        value={String(h)}
        values={options(['-2', '0', '1', '3'])}
        change={(v) => {
          setH(Number(v));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('圆心纵坐标k', 'Centre y-coordinate k')}
        value={String(k)}
        values={options(['-2', '0', '1', '3'])}
        change={(v) => {
          setK(Number(v));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('右端半径平方r²', 'Right side r²')}
        value={String(rs)}
        values={options(['-1', '0', '1', '4', '9', '25'])}
        change={(v) => {
          setRs(Number(v));
          setReveal(false);
        }}
      />
      <Select
        mode={mode}
        name={t('待核对点P', 'Point P to check')}
        value={String(point)}
        values={['(4,2)', '(1,-2)', '(0,0)', '(1,3)'].map((v, i) => [
          String(i),
          t(v, v),
        ])}
        change={(v) => {
          setPoint(Number(v));
          setReveal(false);
        }}
      />
      <Prediction
        key={m.equation}
        mode={mode}
        name={t('写出轨迹方程', 'Write the locus equation')}
        answer={equation(m.equation)}
        hint={t(
          '每项减圆心坐标后平方，右边用r²；接受移项和展开的等价方程。',
          'Square each coordinate difference from the centre and set the sum to r²; rearranged or expanded equations are accepted.',
        )}
        solution={t(m.equation, m.equation)}
      />
      <Prediction
        key={`class-${rs}`}
        mode={mode}
        name={t(
          '预测轨迹circle、point或empty',
          'Predict circle, point or empty',
        )}
        answer={{ kind: 'conic-code', value: m.kind }}
        hint={t(
          '两项平方和非负；正、零、负的右端要分别处理。',
          'A sum of two real squares is nonnegative; distinguish positive, zero and negative right sides.',
        )}
        solution={t(`分类=${m.kind}。`, `Classification=${m.kind}.`)}
      />
      <Prediction
        key={`position-${m.equation}-${coordinateText(p)}`}
        mode={mode}
        name={t(
          '预测点on、inside、outside或empty',
          'Predict on, inside, outside or empty',
        )}
        answer={{
          kind: 'conic-code',
          value: circlePosition(p, m.centre, m.radiusSquare),
        }}
        hint={t(
          '比较到中心的距离平方与r²。右端负数时先判无实轨迹。',
          'Compare squared distance from the centre with r². A negative right side has no real locus.',
        )}
        solution={t(
          `结论=${circlePosition(p, m.centre, m.radiusSquare)}。`,
          `Verdict=${circlePosition(p, m.centre, m.radiusSquare)}.`,
        )}
      />
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      {rs < 0 ? (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '无实点：不画一个假的圆。C只标示方程中的坐标基准。',
              'No real points: no circle is drawn. C marks only the coordinate reference in the equation.',
            )}
          />
        </p>
      ) : null}
      <ConicFigure
        mode={mode}
        circle={{ centre: m.centre, radiusSquare: rs }}
        wide={wide}
        points={[
          { name: 'C', point: m.centre },
          { name: 'P', point: p },
        ]}
        segments={
          reveal && rs >= 0 ? [{ name: 'CP', from: m.centre, to: p }] : []
        }
        caption={t(
          'C是中心，P是待检验点，并不保证在圆上；用距离条件检查。r²=0时轨迹只有C，r²<0时曲线为空。',
          'C is the centre; P is a test point, not necessarily on the circle. Check its distance. For r²=0 the locus is C alone; for r²<0 it is empty.',
        )}
      />
      {reveal && (
        <DataTable
          mode={mode}
          headers={[t('量', 'Quantity'), t('结果', 'Result')]}
          rows={[
            ['C', coordinateText(m.centre)],
            ['r²', String(rs)],
            [
              'r',
              rs < 0
                ? word(mode, t('无实数半径', 'No real radius'))
                : exactDistance(cq(rs)),
            ],
            [word(mode, t('轨迹', 'Locus')), m.kind],
            [word(mode, t('方程', 'Equation')), m.equation],
          ]}
        />
      )}
    </>
  );
}
function FocusLab({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: 'parabola' | 'ellipse' | 'hyperbola';
}) {
  const [axis, setAxis] = useState<ConicAxis>('horizontal'),
    [centre, setCentre] = useState('0'),
    [size, setSize] = useState('0'),
    [p, setP] = useState('1'),
    [trace, setTrace] = useState('1/2'),
    [branch, setBranch] = useState<1 | -1>(1),
    [wide, setWide] = useState(false),
    [reveal, setReveal] = useState(false);
  const [h, k] = centre === '0' ? [0, 0] : [1, -2],
    m =
      kind === 'parabola'
        ? parabolaModel(h!, k!, p, axis)
        : focalModel(kind, h!, k!, Number(size), axis),
    s = conicPoint(m, trace, branch),
    par = kind === 'parabola';
  const intro = par
    ? t(
        '抛物线是到固定焦点F与固定准线距离相等的点集。参数p是顶点到焦点的有向位移，方程系数为4p；p≠0。图中D为到准线的垂足，比较PF与PD。',
        'A parabola consists of points equidistant from focus F and a directrix. Parameter p is the signed vertex-to-focus displacement; the equation uses 4p and requires p≠0. D is the perpendicular foot on the directrix; compare PF and PD.',
      )
    : kind === 'ellipse'
      ? t(
          '椭圆满足PF1+PF2=2a，焦点间距2c；本工作台使用不同焦点，0<c<a且b²=a²−c²。c=0时为圆的特例。中心和轴向改变位置，距离和仍为2a。',
          'An ellipse satisfies PF1+PF2=2a with focal separation 2c. This workbench uses distinct foci, 0<c<a and b²=a²−c². Coincident foci, c=0, give the circle special case. Translation and axis orientation preserve the sum 2a.',
        )
      : t(
          '双曲线满足|PF1−PF2|=2a，必须0<a<c，b²=c²−a²。它有两支；换支时有向距离差变号，绝对差不变。方程正项指出实轴，不按字母固定猜轴。',
          'A hyperbola satisfies |PF1−PF2|=2a with 0<a<c and b²=c²−a². Its two branches have opposite signed distance differences but the same absolute difference. The positive squared term identifies its transverse axis.',
        );
  const change = (set: (v: string) => void) => (v: string) => {
    set(v);
    setReveal(false);
  };
  return (
    <>
      <p>
        <Text mode={mode} text={intro} />
      </p>
      <Select
        mode={mode}
        name={t('中心或顶点', 'Centre or vertex')}
        value={centre}
        values={[
          ['0', t('(0,0)', '(0,0)')],
          ['1', t('(1,-2)', '(1,-2)')],
        ]}
        change={change(setCentre)}
      />
      <Select
        mode={mode}
        name={t('轴向', 'Axis orientation')}
        value={axis}
        values={[
          ['horizontal', t('水平', 'Horizontal')],
          ['vertical', t('竖直', 'Vertical')],
        ]}
        change={change((v) => setAxis(v as ConicAxis))}
      />
      {par ? (
        <Select
          mode={mode}
          name={t('焦参数p', 'Focal parameter p')}
          value={p}
          values={options(['-2', '-1', '-1/2', '1/2', '1', '2'])}
          change={change(setP)}
        />
      ) : (
        <Select
          mode={mode}
          name={t('选择a与c', 'Choose a and c')}
          value={size}
          values={(kind === 'ellipse'
            ? [
                [5, 3],
                [5, 4],
                [13, 5],
              ]
            : [
                [3, 5],
                [4, 5],
                [5, 13],
              ]
          ).map(([a, c], i) => [
            String(i),
            t(`a=${a}, c=${c}`, `a=${a}, c=${c}`),
          ])}
          change={change(setSize)}
        />
      )}
      <Select
        mode={mode}
        name={t(
          '描点参数t（不是横坐标）',
          'Trace parameter t (not x-coordinate)',
        )}
        value={trace}
        values={options(
          kind === 'hyperbola'
            ? ['-1/2', '0', '1/2']
            : ['-2', '-1', '-1/2', '0', '1/2', '1', '2'],
        )}
        change={change(setTrace)}
      />
      {kind === 'hyperbola' && (
        <Select
          mode={mode}
          name={t('双曲线分支', 'Hyperbola branch')}
          value={String(branch)}
          values={[
            ['1', t('正轴一支', 'Positive-axis branch')],
            ['-1', t('负轴一支', 'Negative-axis branch')],
          ]}
          change={change((v) => setBranch(Number(v) as 1 | -1))}
        />
      )}
      <p>
        {par ? 'V' : 'C'}={coordinateText(m.centre)}；{par ? 'F' : 'F1'}=
        {coordinateText(m.focusMinus)}
        {!par ? `；F2=${coordinateText(m.focusPlus)}` : ''}
        {m.directrix
          ? `；${mode === 'en' ? 'directrix' : '准线'} ${m.directrix.axis}=${textR(m.directrix.value)}`
          : ''}
        ；P={coordinateText(s.point)}
      </p>
      <Prediction
        key={m.equation}
        mode={mode}
        name={t('写出这条曲线的方程', 'Write this curve equation')}
        answer={equation(m.equation)}
        hint={t(
          par
            ? '检查平方的是横向还是纵向位移；非平方项系数4p，位移从顶点量起。'
            : kind === 'ellipse'
              ? '两个平方项相加，沿焦点轴的分母为a²，另一项为a²−c²。'
              : '两个平方项相减，沿实轴为正项，分母a²；负项分母c²−a²。',
          par
            ? 'Check which displacement is squared; the other has coefficient 4p, measured from the vertex.'
            : kind === 'ellipse'
              ? 'Add squared terms; use a² along the focal axis and a²−c² across it.'
              : 'Subtract squared terms; the transverse-axis term is positive over a², the other negative over c²−a².',
        )}
        solution={t(m.equation, m.equation)}
      />
      <Prediction
        key={`first-${textR(s.dMinus)}`}
        mode={mode}
        name={t(
          par ? '预测PF距离' : '预测PF1距离',
          par ? 'Predict PF distance' : 'Predict PF1 distance',
        )}
        answer={number(textR(s.dMinus))}
        hint={t(
          '用两点坐标差的平方和开非负根；先检查对应焦点。',
          'Take the nonnegative root of squared coordinate differences; identify the matching focus first.',
        )}
        solution={t(
          `${par ? 'PF' : 'PF1'}=${textR(s.dMinus)}。`,
          `${par ? 'PF' : 'PF1'}=${textR(s.dMinus)}.`,
        )}
      />
      <Prediction
        key={`constant-${kind}-${textR(s.constant)}`}
        mode={mode}
        name={t(
          par
            ? '预测PD垂直距离'
            : kind === 'ellipse'
              ? '预测距离和PF1+PF2'
              : '预测绝对距离差|PF1−PF2|',
          par
            ? 'Predict perpendicular distance PD'
            : kind === 'ellipse'
              ? 'Predict sum PF1+PF2'
              : 'Predict absolute difference |PF1−PF2|',
        )}
        answer={number(textR(s.constant))}
        hint={t(
          par
            ? '到直线的距离沿垂线量，不是到准线上任意点的斜线。'
            : kind === 'ellipse'
              ? '常数为2a而非2c；移动P仍保持此和。'
              : '绝对差为2a而非焦距2c，不能漏绝对值。',
          par
            ? 'Measure perpendicular to the directrix, not along an arbitrary slanted segment.'
            : kind === 'ellipse'
              ? 'The constant is 2a, not focal separation 2c.'
              : 'The absolute difference is 2a, not 2c; retain the absolute value.',
        )}
        solution={t(
          par ? `PD=PF=${textR(s.constant)}` : `2a=${textR(mulR(cq(2), m.a))}`,
          par ? `PD=PF=${textR(s.constant)}` : `2a=${textR(mulR(cq(2), m.a))}`,
        )}
      />
      {kind === 'hyperbola' && (
        <Prediction
          key={`signed-${textR(s.signedDifference)}`}
          mode={mode}
          name={t('预测有向差PF1−PF2', 'Predict signed difference PF1−PF2')}
          answer={number(textR(s.signedDifference))}
          hint={t(
            'F1在负轴，F2在正轴；换支后同样的距离标签给相反差。',
            'F1 is on the negative axis and F2 on the positive axis; switching branch reverses this labelled difference.',
          )}
          solution={t(
            `PF1−PF2=${textR(s.signedDifference)}`,
            `PF1−PF2=${textR(s.signedDifference)}`,
          )}
        />
      )}
      <View
        mode={mode}
        wide={wide}
        setWide={setWide}
        reveal={reveal}
        setReveal={setReveal}
      />
      <FocalFigure
        mode={mode}
        model={m}
        trace={trace}
        branch={branch}
        wide={wide}
      />
      {reveal && (
        <DataTable
          mode={mode}
          name={t('焦点距离核验', 'Focal distance audit')}
          headers={[t('量', 'Quantity'), t('精确值', 'Exact value')]}
          rows={[
            ['P', coordinateText(s.point)],
            [par ? 'PF' : 'PF1', textR(s.dMinus)],
            [par ? 'PD' : 'PF2', textR(s.dPlus)],
            [
              par ? 'PF=PD' : kind === 'ellipse' ? 'PF1+PF2' : '|PF1−PF2|',
              textR(s.constant),
            ],
            ...(!par
              ? [
                  ['PF1−PF2', textR(s.signedDifference)],
                  ['2c', textR(mulR(cq(2), m.c))],
                  ['b²', textR(mulR(m.b, m.b))],
                ]
              : []),
            [word(mode, t('方程', 'Equation')), m.equation],
          ]}
        />
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            't只用于选择示范点，不是方程自变量；当前精确坐标可直接代入距离定义。描点不替代对所有轨迹点的证明。',
            'The trace parameter t selects an example point; it is not the equation variable. Substitute the displayed exact coordinates into the distance definition. Sampled points do not replace a proof about the whole locus.',
          )}
        />
      </p>
    </>
  );
}
export function ConicLab({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: ConicLabKind;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'conic-line' ? (
        <LineLab mode={mode} distance={false} />
      ) : kind === 'conic-distance' ? (
        <LineLab mode={mode} distance />
      ) : kind === 'conic-circle' ? (
        <CircleLab mode={mode} />
      ) : (
        <FocusLab
          mode={mode}
          kind={
            kind === 'conic-parabola'
              ? 'parabola'
              : kind === 'conic-ellipse'
                ? 'ellipse'
                : 'hyperbola'
          }
        />
      )}
    </div>
  );
}
export function ConicHookArt({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: ConicLabKind;
}) {
  if (kind === 'conic-circle')
    return (
      <ConicFigure
        mode={mode}
        circle={{ centre: cp(1, -2), radiusSquare: 25 }}
        points={[
          { name: 'C', point: cp(1, -2) },
          { name: 'P', point: cp(4, 2) },
        ]}
        segments={[{ name: 'CP', from: cp(1, -2), to: cp(4, 2) }]}
        caption={t(
          '从固定中心量距离；图上的右端必须是半径平方。',
          'Measure from a fixed centre; the equation uses radius squared.',
        )}
      />
    );
  if (kind === 'conic-line' || kind === 'conic-distance')
    return (
      <ConicFigure
        mode={mode}
        line={planeLine(3, 4, -5)}
        points={[{ name: 'P', point: cp(1, 3) }]}
        caption={t(
          '同单位网格上，竖直间隔未必是最短距离。',
          'On an equal-unit grid, a vertical gap need not be the shortest distance.',
        )}
      />
    );
  return (
    <FocalFigure
      mode={mode}
      model={
        kind === 'conic-parabola'
          ? parabolaModel(0, 0, '1', 'horizontal')
          : focalModel(
              kind === 'conic-ellipse' ? 'ellipse' : 'hyperbola',
              0,
              0,
              0,
              'horizontal',
            )
      }
    />
  );
}
