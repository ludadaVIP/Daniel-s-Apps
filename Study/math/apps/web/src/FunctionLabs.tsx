import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { CartesianPlot } from './CartesianVisuals';
import { textR, sameR, type Affine } from './algebraModels';
import {
  coordinateText,
  type Coordinate,
  type PlotBounds,
} from './cartesianModels';
import {
  functionModel,
  functionAt,
  functionText,
  functionCurve,
  functionBounds,
  functionWideBounds,
  slopePointCases,
  twoPointCases,
  pointsFrom,
  functionFromPoints,
  slopeBetween,
  functionComparisons,
  functionContext,
  auditFunctionContext,
  contextFunctionGraph,
  type FunctionContextKind,
} from './functionModels';
export type FunctionLabKind = Extract<Lesson['lab'], `function-${string}`>;
export const isFunctionLab = (kind: Lesson['lab']): kind is FunctionLabKind =>
  kind.startsWith('function-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
function Field({
  mode,
  name,
  value,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  change: (s: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        aria-label={label(mode, name)}
        value={value}
        onChange={(e) => change(e.target.value)}
        type="text"
      />
    </label>
  );
}
function Task({ mode, answer }: { mode: LanguageMode; answer: AnswerSpec }) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div
      className="math-function-task"
      role="group"
      aria-label={label(mode, t('我的函数结论', 'My function answer'))}
    >
      <Field
        mode={mode}
        name={t('我的函数结论', 'My function answer')}
        value={input}
        change={(s) => {
          setInput(s);
          setChecked(false);
        }}
      />
      <p>
        <Text
          mode={mode}
          text={
            answer.kind === 'expression'
              ? t(
                  '写 y 右侧的一般式，只用 x，不写 y=；精确等值式可，不用某一次代入数代替。',
                  'Write the general expression after y= using x, omitting y=. Exact equivalent forms are allowed; one evaluated number is insufficient.',
                )
              : answer.kind === 'coordinate'
                ? t(
                    '写 (x,y) 数对，留意截距点的 x 是否为零。',
                    'Write (x,y), checking whether an intercept point has x=0.',
                  )
                : answer.kind === 'function-class'
                  ? t(
                      '按本课 m≠0 约定写分类：正比例、一次但非正比例、常函数、非线性函数、竖直线或无法唯一确定。只用题目需要的一类。',
                      'Under this unit’s m≠0 convention, enter the required class: direct proportion, linear but not direct, constant, nonlinear, vertical line or undetermined.',
                    )
                  : t(
                      '只写所求精确数值，分数可；单位另在题意中说明。',
                      'Enter only the requested exact number; fractions are allowed. Explain its units separately.',
                    )
          }
        />
      </p>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对我的结论', 'Check my conclusion')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('函数反馈', 'Function feedback'))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(input, answer)
                ? t(
                    '结论符合。再说明变化量、截距与适用范围。',
                    'The conclusion matches. Explain changes, intercept and domain.',
                  )
                : t(
                    '再核 Δy/Δx 的顺序、x=0 的截距、完整一般式或特殊情形；像素角度和单个代入值都不能代替关系。',
                    'Recheck Δy/Δx, the intercept at x=0, the general expression or exceptional case. Pixel angles and one evaluated value cannot replace a relationship.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Range({
  mode,
  name,
  value,
  min = -4,
  max = 4,
  step = 1,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={label(mode, name)}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
const convention = t(
  '本单元按中文教材约定：一次函数 y=mx+b 要求 m≠0；b=0 时为正比例。m=0 是常函数，仍是函数，但本单元不归入一次或正比例。英语对 linear/affine 的命名有不同约定，这里以公式与上述条件为准。',
  'This unit uses the first-degree convention m≠0 for y=mx+b; b=0 then gives direct proportion. m=0 is a constant function, still a function but not first-degree or direct here. English linear/affine terminology varies; use the formula and these stated conditions.',
);
const pointNumber = (p: Coordinate) => ({
  x: Number(p[0][0]) / Number(p[0][1]),
  y: Number(p[1][0]) / Number(p[1][1]),
});
const visible = (p: { x: number; y: number }, b: PlotBounds) =>
  p.x >= b.xMin && p.x <= b.xMax && p.y >= b.yMin && p.y <= b.yMax;
function Graph({
  f,
  b,
  mode,
  points = [],
}: {
  f: Affine;
  b: PlotBounds;
  mode: LanguageMode;
  points?: { x: number; y: number; label?: string }[];
}) {
  return (
    <CartesianPlot
      mode={mode}
      bounds={b}
      curves={[{ points: functionCurve(f, b), name: `y = ${functionText(f)}` }]}
      points={points.filter((p) => visible(p, b))}
      caption={t(
        '原关系不随图窗改变；横轴与纵轴分别按标注刻度读取。图仅显示关系的一部分。',
        'The relationship stays fixed when the window changes. Read each labelled axis scale separately; the graph shows only part of the relationship.',
      )}
    />
  );
}
function Parameters({
  kind,
  mode,
}: {
  kind: 'function-form' | 'function-intercept';
  mode: LanguageMode;
}) {
  const [m, setM] = useState(kind === 'function-form' ? 2 : -1),
    [b, setB] = useState(3),
    [x, setX] = useState(1),
    [wide, setWide] = useState(false),
    f = functionModel(String(m), String(b)),
    bounds = wide ? functionWideBounds : functionBounds,
    point = {
      x,
      y:
        Number(functionAt(f, String(x))[0]) /
        Number(functionAt(f, String(x))[1]),
      label: 'A',
    },
    intercept = { x: 0, y: b, label: 'B' };
  return (
    <>
      <div className="math-function-controls">
        <Range
          mode={mode}
          name={t('斜率 m', 'Slope m')}
          value={m}
          step={0.5}
          min={-3}
          max={3}
          change={setM}
        />
        <Range
          mode={mode}
          name={t('截距 b', 'Intercept b')}
          value={b}
          min={-8}
          max={8}
          change={setB}
        />
        <Range
          mode={mode}
          name={t('代入的 x', 'Input x')}
          value={x}
          change={setX}
        />
      </div>
      <p data-function-parameters>
        m={m}; b={b}; x={x}
      </p>
      <Graph
        f={f}
        b={bounds}
        mode={mode}
        points={kind === 'function-intercept' ? [intercept] : [point]}
      />
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('改变函数视窗', 'Change function window')} />
      </button>
      <p>
        <Text
          mode={mode}
          text={
            kind === 'function-intercept'
              ? t(
                  `令 x=0 时 y=${b}，截距点是 (0,${b})。图窗可能不含这个点；b 不会随图窗改变，也不等于 x 轴交点。`,
                  `At x=0, y=${b}, so the intercept point is (0,${b}). It may lie outside this window. b does not change with the window and is not the x-axis crossing.`,
                )
              : t(
                  `同一个 x 的对应 y=${textR(functionAt(f, String(x)))}。改变 x 是同一关系上的移动；改变 m 或 b 才改变一般关系。`,
                  `This input gives y=${textR(functionAt(f, String(x)))}. Changing x moves along one relationship; changing m or b changes that relationship.`,
                )
          }
        />
      </p>
      <table>
        <thead>
          <tr>
            <th>x</th>
            <th>y</th>
          </tr>
        </thead>
        <tbody>
          {[-2, -1, 0, 1, 2].map((v) => (
            <tr key={v}>
              <td>{v}</td>
              <td>{textR(functionAt(f, String(v)))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Task
        key={`${m}:${b}`}
        mode={mode}
        answer={
          kind === 'function-intercept'
            ? { kind: 'coordinate', value: `(0,${b})` }
            : { kind: 'expression', value: functionText(f), variable: 'x' }
        }
      />
      <p>
        <Text mode={mode} text={convention} />
      </p>
    </>
  );
}
function Slope({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [reversed, setReversed] = useState(false),
    [shown, setShown] = useState(false),
    [scale, setScale] = useState(false),
    source = slopePointCases[index]!,
    pair = pointsFrom(source),
    [p, q] = reversed ? [pair[1], pair[0]] : pair,
    delta = slopeBetween(p, q),
    f = functionFromPoints(p, q),
    bounds = scale ? { ...functionWideBounds, yMax: 24 } : functionWideBounds,
    pn = pointNumber(p),
    qn = pointNumber(q);
  return (
    <>
      <label>
        <Text mode={mode} text={t('斜率点对', 'Slope point pair')} />
        <select
          aria-label={label(mode, t('斜率点对', 'Slope point pair'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setReversed(false);
            setShown(false);
          }}
        >
          {slopePointCases.map((r, i) => (
            <option key={i} value={i}>
              {r.join(' → ')}
            </option>
          ))}
        </select>
      </label>
      <p>
        P={coordinateText(p)}; Q={coordinateText(q)}
      </p>
      <CartesianPlot
        mode={mode}
        bounds={bounds}
        points={[
          { ...pn, label: 'P' },
          { ...qn, label: 'Q' },
        ]}
        curves={[
          {
            points: f.kind === 'one' ? functionCurve(f.model, bounds) : [],
            name: label(mode, t('两点所在直线', 'Line through the two points')),
          },
          ...(shown
            ? [
                {
                  points: [pn, { x: qn.x, y: pn.y }, qn],
                  name: 'Δx → Δy',
                  dash: '6 4',
                  color: '#a14532',
                },
              ]
            : []),
        ]}
        caption={t(
          '按各轴单位计算变化量，不把屏幕倾角当斜率。交换点序须同时交换分子与分母的次序。',
          'Use changes in labelled axis units rather than screen angles. Reversing point order reverses both numerator and denominator.',
        )}
      />
      <div className="math-function-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t('显示或隐藏变化三角形', 'Show or hide change triangle')}
          />
        </button>
        <button className="math-button" onClick={() => setReversed(!reversed)}>
          <Text mode={mode} text={t('交换 P 与 Q', 'Swap P and Q')} />
        </button>
        <button className="math-button" onClick={() => setScale(!scale)}>
          <Text
            mode={mode}
            text={t('改变纵轴显示范围', 'Change vertical display range')}
          />
        </button>
      </div>
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('变化量核算', 'Change calculation'))}
        >
          Δx={textR(delta.dx)}; Δy={textR(delta.dy)}; m=Δy/Δx=
          {textR(delta.slope!)}
        </p>
      )}
      <Task
        key={index}
        mode={mode}
        answer={{
          kind: 'number',
          value: textR(delta.slope!),
          formats: ['decimal', 'fraction'],
        }}
      />
    </>
  );
}
function TwoPoints({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(true),
    pair = pointsFrom(twoPointCases[index]!),
    r = functionFromPoints(...pair),
    bounds = wide ? functionWideBounds : functionBounds,
    p = pointNumber(pair[0]),
    q = pointNumber(pair[1]),
    same = sameR(pair[0][0], pair[1][0]) && sameR(pair[0][1], pair[1][1]),
    points = same
      ? [{ ...p, label: 'P=Q' }]
      : [
          { ...p, label: 'P' },
          { ...q, label: 'Q' },
        ],
    answer: AnswerSpec =
      r.kind === 'one'
        ? { kind: 'expression', value: functionText(r.model), variable: 'x' }
        : { kind: 'function-class', value: r.kind };
  return (
    <>
      <label>
        <Text mode={mode} text={t('两点定线案例', 'Two-point case')} />
        <select
          aria-label={label(mode, t('两点定线案例', 'Two-point case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          {twoPointCases.map((v, i) => (
            <option value={i} key={i}>
              {v.join(' ; ')}
            </option>
          ))}
        </select>
      </label>
      <p>
        P={coordinateText(pair[0])}; Q={coordinateText(pair[1])}
      </p>
      <CartesianPlot
        mode={mode}
        bounds={bounds}
        points={points.filter((v) => visible(v, bounds))}
        curves={
          !shown
            ? []
            : r.kind === 'one'
              ? [{ points: functionCurve(r.model, bounds), name: 'y = mx+b' }]
              : r.kind === 'vertical' &&
                  p.x >= bounds.xMin &&
                  p.x <= bounds.xMax
                ? [
                    {
                      points: [
                        { x: p.x, y: bounds.yMin },
                        { x: p.x, y: bounds.yMax },
                      ],
                      name: `x=${p.x}`,
                    },
                  ]
                : []
        }
        caption={t(
          '先看两点的 x 是否不同。重复同一点并未增加独立信息；竖直线不是 y 关于 x 的函数。',
          'First check whether the x coordinates differ. Repeating one point adds no independent information; a vertical line is not y as a function of x.',
        )}
      />
      <Task key={index} mode={mode} answer={answer} />
      <div className="math-function-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t('显示或隐藏定线核算', 'Show or hide line audit')}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变函数视窗', 'Change function window')}
          />
        </button>
      </div>
      {shown && (
        <div
          role="status"
          aria-label={label(mode, t('两点核算', 'Two-point audit'))}
        >
          {r.kind === 'one' ? (
            <>
              <p>
                m={textR(r.model.a)}; b={textR(r.model.b)}; y=
                {functionText(r.model)}
              </p>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    '同一关系须把两个点都代回。水平线的斜率为零，属于常函数。',
                    'Substitute both points into the same relationship. A horizontal line has zero slope and is a constant function.',
                  )}
                />
              </p>
            </>
          ) : (
            <Text
              mode={mode}
              text={
                r.kind === 'vertical'
                  ? t(
                      '相同 x 对应不同 y，没有 y=mx+b 能通过两点；竖直线斜率未定义，不是零。',
                      'One x has different y values. No y=mx+b passes both; a vertical slope is undefined, not zero.',
                    )
                  : t(
                      '只给了同一个点两次，可有许多个 m/b，无法唯一确定关系，不是无解。',
                      'The same point was supplied twice. Many m/b choices remain, so the relationship is undetermined rather than inconsistent.',
                    )
              }
            />
          )}
        </div>
      )}
    </>
  );
}
function Comparison({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [wide, setWide] = useState(false),
    c = functionComparisons[index]!,
    f =
      c.kind === 'nonlinear'
        ? null
        : functionModel(
            c.source === '2x' || c.source === '2x+3'
              ? '2'
              : c.source === '-x/2'
                ? '-1/2'
                : '0',
            c.source === '2x+3' ? '3' : c.source === '4' ? '4' : '0',
          ),
    bounds = wide ? functionWideBounds : functionBounds;
  const curve = f
    ? functionCurve(f, bounds)
    : Array.from({ length: 161 }, (_, i) => ({
        x: -10 + i / 8,
        y: (-10 + i / 8) ** 2,
      })).filter((p) => visible(p, bounds));
  return (
    <>
      <label>
        <Text mode={mode} text={t('关系式对照', 'Relationship comparison')} />
        <select
          aria-label={label(mode, t('关系式对照', 'Relationship comparison'))}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          {functionComparisons.map((v, i) => (
            <option value={i} key={i}>
              y={v.source}
            </option>
          ))}
        </select>
      </label>
      <p>y={c.source}</p>
      <CartesianPlot
        mode={mode}
        bounds={bounds}
        curves={[{ points: curve, name: `y=${c.source}` }]}
        caption={t(
          '公式为给定模型；有限图窗和几个表格点不能证明任意未知规律整体为直线。',
          'The formula is the supplied model. A finite window or a few table values cannot prove an unknown rule is globally straight.',
        )}
      />
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('改变函数视窗', 'Change function window')} />
      </button>
      <table>
        <thead>
          <tr>
            <th>x</th>
            <th>y</th>
            <th>y/x</th>
          </tr>
        </thead>
        <tbody>
          {[-1, 0, 1, 2].map((x) => {
            const y = f
              ? Number(functionAt(f, String(x))[0]) /
                Number(functionAt(f, String(x))[1])
              : x * x;
            return (
              <tr key={x}>
                <td>{x}</td>
                <td>{y}</td>
                <td>
                  {x === 0
                    ? label(
                        mode,
                        t('未定义（除零）', 'undefined (zero divisor)'),
                      )
                    : y / x}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        <Text mode={mode} text={convention} />
      </p>
      <p>
        <Text
          mode={mode}
          text={t(
            '非零 m 且 b=0 才属于本课正比例；过原点本身不够，x² 是反例。y/x 在 x=0 没有定义。',
            'Direct proportion here requires nonzero m and b=0. Passing through the origin alone is insufficient: x² is a counterexample. y/x is undefined at x=0.',
          )}
        />
      </p>
      <Task
        key={index}
        mode={mode}
        answer={{ kind: 'function-class', value: c.kind }}
      />
    </>
  );
}
const stories: Record<FunctionContextKind, LocalizedText> = {
  travel: t(
    '虚构接送模型：行程 x km（0≤x≤8），启动费 NZ$5，每 km 加 NZ$2，费用 y NZD。这里只讨论已启动服务的理想模型，x=0 仍含启动费。',
    'Fictional transport: x km with 0≤x≤8, an NZ$5 starting fee and NZ$2 per km; cost y NZD. The service is already started, so its model at x=0 includes the fee.',
  ),
  drain: t(
    '虚构恒速排水：初有 12 L，每分钟减少 2 L，x 为分钟、y 为余水升数，只到第六分钟排空。排空后若继续观察须换成 y=0，不能继续画负水量。',
    'Fictional constant draining: start with 12 L and lose 2 L per minute. x is minutes and y remaining litres, only through emptying at six minutes. Later water stays at zero; do not extend the decreasing rule into negative amounts.',
  ),
  cards: t(
    '虚构卡片模型：已有两张，每包三张，最多打开四包。x 是 0、1、2、3、4 的整包数，y 是总张数。只画允许离散点，不用连线暗示半包也允许。',
    'Fictional cards: two initially, three per pack, at most four packs opened. x is an integer from zero to four and y the total cards. Draw discrete allowed points; a joined line would suggest fractional packs.',
  ),
  temperature: t(
    '给定虚构降温模型：x 小时（0≤x≤8），起点 4°C，每小时变化 −1/2°C，y 为模型温度。它不是实际天气数据，也不保证八小时以后继续线性。',
    'A supplied fictional cooling model: x hours with 0≤x≤8, starting at 4°C and changing by -1/2°C per hour; y is model temperature. These are not observed weather data and no linear extrapolation beyond eight hours is promised.',
  ),
};
function Context({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<FunctionContextKind>('travel');
  return (
    <>
      <label>
        <Text
          mode={mode}
          text={t('虚构线性情境', 'Fictional linear context')}
        />
        <select
          aria-label={label(
            mode,
            t('虚构线性情境', 'Fictional linear context'),
          )}
          value={kind}
          onChange={(e) => setKind(e.target.value as FunctionContextKind)}
        >
          {(['travel', 'drain', 'cards', 'temperature'] as const).map((k) => (
            <option key={k} value={k}>
              {label(
                mode,
                {
                  travel: t('接送费用', 'Transport cost'),
                  drain: t('排水', 'Draining'),
                  cards: t('卡片整包', 'Whole card packs'),
                  temperature: t('模型温度', 'Model temperature'),
                }[k],
              )}
            </option>
          ))}
        </select>
      </label>
      <ContextExperiment key={kind} kind={kind} mode={mode} />
    </>
  );
}
function ContextExperiment({
  kind,
  mode,
}: {
  kind: FunctionContextKind;
  mode: LanguageMode;
}) {
  const [x, setX] = useState('0'),
    [y, setY] = useState('0'),
    [checked, setChecked] = useState(false),
    [wide, setWide] = useState(true),
    c = functionContext(kind),
    bounds = wide ? functionWideBounds : functionBounds,
    graph = contextFunctionGraph(c, bounds),
    audit = auditFunctionContext(c, x, y);
  return (
    <>
      <p>
        <Text mode={mode} text={stories[kind]} />
      </p>
      <p>
        m: {textR(c.model.a)} {c.rateUnit}; b: {textR(c.model.b)} {c.outputUnit}
        ; x: {c.inputUnit}; y: {c.outputUnit}
      </p>
      <CartesianPlot
        mode={mode}
        bounds={bounds}
        points={graph.points}
        curves={
          graph.curve.length
            ? [{ points: graph.curve, name: label(mode, stories[kind]) }]
            : []
        }
        xLabel={`x (${c.inputUnit})`}
        yLabel={`y (${c.outputUnit})`}
        caption={t(
          '只画题设允许域。实线表示连续量，计数情境仅画离散点；改变图窗不放宽原条件。',
          'Only the stated domain is drawn. Lines represent continuous quantities; count contexts show discrete points only. Widening the window does not broaden the domain.',
        )}
      />
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('改变函数视窗', 'Change function window')} />
      </button>
      <Task
        mode={mode}
        answer={{
          kind: 'expression',
          value: functionText(c.model),
          variable: 'x',
        }}
      />
      <div className="math-function-controls">
        <Field
          mode={mode}
          name={t('情境候选 x', 'Context candidate x')}
          value={x}
          change={(s) => {
            setX(s);
            setChecked(false);
          }}
        />
        <Field
          mode={mode}
          name={t('预测输出 y', 'Predicted output y')}
          value={y}
          change={(s) => {
            setY(s);
            setChecked(false);
          }}
        />
      </div>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t('核关系、单位和范围', 'Audit relationship, units and domain')}
        />
      </button>
      {checked && (
        <div
          role="status"
          aria-label={label(mode, t('线性情境核验', 'Linear context audit'))}
        >
          {!audit ? (
            <Text
              mode={mode}
              text={t(
                '输入有效精确数值或分数。',
                'Enter valid exact values or fractions.',
              )}
            />
          ) : (
            <>
              <p>
                x={audit.x} {c.inputUnit}; y={audit.y} {c.outputUnit};{' '}
                <Text mode={mode} text={t('公式给出', 'Formula gives')} />{' '}
                {audit.expected} {c.outputUnit}
              </p>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    `关系：${audit.relationPass ? '成立' : '不成立'}；原范围：${audit.inRange ? '通过' : '未通过'}；整数限制：${audit.integerPass ? '通过' : '未通过'}。${audit.accepted ? '在模型条件内允许。' : '不能只因代数可算就允许。'}`,
                    `Relationship: ${audit.relationPass ? 'passes' : 'fails'}; stated range: ${audit.inRange ? 'passes' : 'fails'}; integer restriction: ${audit.integerPass ? 'passes' : 'fails'}. ${audit.accepted ? 'Allowed within the model.' : 'An algebraic output alone does not make this allowed.'}`,
                  )}
                />
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
export function FunctionLab({
  kind,
  mode,
}: {
  kind: FunctionLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-function-lab">
      {kind === 'function-form' || kind === 'function-intercept' ? (
        <Parameters key={kind} kind={kind} mode={mode} />
      ) : kind === 'function-slope' ? (
        <Slope mode={mode} />
      ) : kind === 'function-points' ? (
        <TwoPoints mode={mode} />
      ) : kind === 'function-compare' ? (
        <Comparison mode={mode} />
      ) : (
        <Context mode={mode} />
      )}
    </section>
  );
}
export function FunctionHookArt({
  kind,
  mode,
}: {
  kind: FunctionLabKind;
  mode: LanguageMode;
}) {
  const text: Record<FunctionLabKind, LocalizedText> = {
    'function-form': t(
      '同一条规则里改变 x，与改变 m 或 b，有何不同？',
      'How does changing x differ from changing m or b in one rule?',
    ),
    'function-slope': t(
      '从 P 到 Q 横变三、纵变六，变化速度是六还是二？',
      'From P to Q, x changes by three and y by six. Is the rate six or two?',
    ),
    'function-intercept': t(
      'y 轴上的点，哪个坐标一定是零？',
      'Which coordinate must be zero on the y axis?',
    ),
    'function-points': t(
      '两个点若有相同的 x，还能总写成 y=mx+b 吗？',
      'If two points share x, can they always define y=mx+b?',
    ),
    'function-compare': t(
      '过原点的图像，就一定是正比例吗？',
      'Does passing through the origin guarantee direct proportion?',
    ),
    'function-context': t(
      '排空后还沿原直线延长，会得到什么不可能的量？',
      'What impossible amount appears if a draining line continues after emptying?',
    ),
  };
  return (
    <p className="math-function-hook">
      <Text mode={mode} text={text[kind]} />
    </p>
  );
}
