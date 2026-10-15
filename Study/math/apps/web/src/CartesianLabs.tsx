import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { CartesianPlot } from './CartesianVisuals';
import {
  readCoordinate,
  checkCoordinate,
  coordinateRegion,
  basicBounds,
  plottingCases,
  plotNumber,
  lineSegment,
  tableValues,
  contextGraph,
  type PlotPoint,
  type CoordinateContext,
} from './cartesianModels';
export type CartesianLabKind = Extract<Lesson['lab'], `cart-${string}`>;
export const isCartesianLab = (kind: Lesson['lab']): kind is CartesianLabKind =>
  kind.startsWith('cart-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
function Range({
  mode,
  name,
  value,
  min,
  max,
  step = 1,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  step?: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={label(mode, name)}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Task({
  mode,
  name,
  answer,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-cart-task" role="group" aria-label={label(mode, name)}>
      <label>
        <Text mode={mode} text={name} />
        <input
          type="text"
          value={input}
          aria-label={label(mode, name)}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对我的结果', 'Check my result')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('坐标反馈', 'Coordinate feedback'))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(input, answer) === true
                ? t(
                    '结果符合；再说明顺序、刻度、关系和允许范围。',
                    'The result matches; explain the order, scale, relationship and domain.',
                  )
                : t(
                    '再核对先 x 后 y、正负与轴刻度；表达式应对所有允许值成立，情境不能超出模型范围。',
                    'Recheck x before y, signs and tick intervals. An expression must hold for every permitted input; stay within the context domain.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Plane({ mode }: { mode: LanguageMode }) {
  const [x, setX] = useState(3),
    [y, setY] = useState(-2),
    [wide, setWide] = useState(false),
    region = coordinateRegion(readCoordinate(`(${x},${y})`)!);
  const names = {
    origin: t('原点，不属于任何象限', 'Origin; not in any quadrant'),
    'x-axis': t('x 轴上，不属于任何象限', 'On the x-axis; not in a quadrant'),
    'y-axis': t('y 轴上，不属于任何象限', 'On the y-axis; not in a quadrant'),
    I: t('第一象限：(+,+)', 'Quadrant I: (+,+)'),
    II: t('第二象限：(−,+)', 'Quadrant II: (−,+)'),
    III: t('第三象限：(−,−)', 'Quadrant III: (−,−)'),
    IV: t('第四象限：(+,-)', 'Quadrant IV: (+,−)'),
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '两条相互垂直的有向数轴共用原点。横轴 x、纵轴 y，数对按 (x,y)，轴上的点不放入任何象限。',
            'Two perpendicular directed number lines share an origin. Horizontal x precedes vertical y in (x,y); points on either axis belong to no quadrant.',
          )}
        />
      </p>
      <div className="math-cart-controls">
        <Range
          mode={mode}
          name={t('横坐标 x', 'Horizontal coordinate x')}
          value={x}
          min={-5}
          max={5}
          change={setX}
        />
        <Range
          mode={mode}
          name={t('纵坐标 y', 'Vertical coordinate y')}
          value={y}
          min={-5}
          max={5}
          change={setY}
        />
      </div>
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text
          mode={mode}
          text={t(
            '只改横轴显示范围',
            'Change only the horizontal viewing range',
          )}
        />
      </button>
      <CartesianPlot
        mode={mode}
        bounds={
          wide ? { ...basicBounds, xMin: -10, xMax: 10, xStep: 2 } : basicBounds
        }
        points={[{ x, y, label: 'P' }]}
      />
      <p>
        <Text mode={mode} text={names[region]} />
      </p>
      <Task
        key={`${x}/${y}`}
        mode={mode}
        name={t('我读出的 P 坐标', 'My reading of P')}
        answer={{ kind: 'coordinate', value: `(${x},${y})` }}
      />
    </>
  );
}
function Plotting({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [selected, setSelected] = useState<PlotPoint>({ x: 0, y: 0 }),
    [checked, setChecked] = useState(false),
    s = plottingCases[index]!,
    pick = (p: PlotPoint) => {
      setSelected(p);
      setChecked(false);
    };
  return (
    <>
      <label>
        <Text mode={mode} text={t('描点任务', 'Plotting task')} />
        <select
          aria-label={label(mode, t('描点任务', 'Plotting task'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setSelected({ x: 0, y: 0 });
            setChecked(false);
          }}
        >
          {plottingCases.map((s, i) => (
            <option key={s.id} value={i}>{`P(${s.x}, ${s.y})`}</option>
          ))}
        </select>
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            `把 P(${s.x},${s.y}) 描在格点：先按 x 沿横轴，再按 y 平行纵轴。可点格点；键盘聚焦描点板后用方向键移动，每步遵从本轴刻度。`,
            `Plot P(${s.x},${s.y}): locate x horizontally, then move parallel to y. Click a grid intersection, or focus the plotting board and use arrow keys; each step follows that axis interval.`,
          )}
        />
      </p>
      <CartesianPlot
        mode={mode}
        bounds={s.bounds}
        selected={selected}
        onPick={pick}
      />
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对描点位置', 'Check plotted position')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('描点反馈', 'Plotting feedback'))}
        >
          <Text
            mode={mode}
            text={
              checkCoordinate(
                `(${selected.x},${selected.y})`,
                `(${s.x},${s.y})`,
              )
                ? t(
                    '位置正确；说明横纵顺序和每格数值。',
                    'The position matches; explain the coordinate order and tick intervals.',
                  )
                : t(
                    '位置还不对。先找横坐标所在直线，再与纵坐标所在直线相交；不要交换坐标或把半格当一。',
                    'Recheck the horizontal and vertical coordinate lines. Do not swap coordinates or count a half-unit tick as one.',
                  )
            }
          />
        </p>
      )}
      <Task
        key={index}
        mode={mode}
        name={t('该点的有序数对', 'The ordered pair at that point')}
        answer={{ kind: 'coordinate', value: `(${s.x},${s.y})` }}
      />
    </>
  );
}
function Table({ mode }: { mode: LanguageMode }) {
  const [k, setK] = useState(2),
    [b, setB] = useState(1),
    [continuous, setContinuous] = useState(true),
    [shown, setShown] = useState(false),
    rows = tableValues(String(k), String(b), ['0', '1', '2', '3']),
    bounds = { xMin: 0, xMax: 4, yMin: -4, yMax: 16, xStep: 1, yStep: 2 },
    points = rows.map((r, i) => ({
      x: Number(r.x),
      y: plotNumber(r.y),
      label: String.fromCharCode(65 + i),
    }));
  const reset = (fn: (n: number) => void, n: number) => {
    fn(n);
    setShown(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            `已给规则 y=${k}x+(${b})。每行是同一输入与输出，不把两行交叉配对。当前${continuous ? '给定连续模型，允许 0≤x≤3 的中间输入，本课用有理数计算' : 'x 只取 0、1、2、3 这些整数份数，点间不定义输出'}。`,
            `The rule y=${k}x+(${b}) is supplied. Pair input and output from the same row. ${continuous ? 'The supplied continuous model allows intermediate inputs from 0 to 3; calculations here use rationals.' : 'Only integer counts 0,1,2,3 are permitted; values between points are not defined.'}`,
          )}
        />
      </p>
      <div className="math-cart-controls">
        <Range
          mode={mode}
          name={t('给定每单位变化 k', 'Supplied change per unit k')}
          value={k}
          min={-1}
          max={3}
          change={(n) => reset(setK, n)}
        />
        <Range
          mode={mode}
          name={t('给定初始量 b', 'Supplied initial value b')}
          value={b}
          min={0}
          max={4}
          change={(n) => reset(setB, n)}
        />
      </div>
      <label>
        <Text mode={mode} text={t('输入类型', 'Input type')} />
        <select
          aria-label={label(mode, t('输入类型', 'Input type'))}
          value={continuous ? 'continuous' : 'count'}
          onChange={(e) => {
            setContinuous(e.target.value === 'continuous');
            setShown(false);
          }}
        >
          <option value="continuous">
            {label(mode, t('给定连续模型', 'Supplied continuous model'))}
          </option>
          <option value="count">
            {label(mode, t('仅整数份数', 'Integer counts only'))}
          </option>
        </select>
      </label>
      <table>
        <caption>
          <Text
            mode={mode}
            text={t('同一行组成一个点', 'Each row forms one point')}
          />
        </caption>
        <thead>
          <tr>
            <th>x</th>
            <th>y</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.x}>
              <td>{r.x}</td>
              <td>{i === 3 && !shown ? '?' : r.y}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Task
        key={`${k}/${b}/${continuous}`}
        mode={mode}
        name={t('最后一行 y', 'Last-row y')}
        answer={{
          kind: 'number',
          value: rows[3]!.y,
          formats: ['decimal', 'fraction'],
        }}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('显示或收起图像', 'Show or hide the graph')}
        />
      </button>
      {shown && (
        <CartesianPlot
          mode={mode}
          bounds={bounds}
          points={points}
          curves={
            continuous
              ? [
                  {
                    name: 'supplied-linear-model',
                    points: lineSegment(k, b, bounds, [0, 3]),
                  },
                ]
              : []
          }
          caption={
            continuous
              ? t(
                  '连线来自明确给定的连续规则，不是因为几个点恰好排直。',
                  'The line comes from the explicitly supplied continuous rule, not merely collinear samples.',
                )
              : t(
                  '整数份数只画离散点，不把半份输入偷偷加入范围。',
                  'Integer counts are discrete points; do not silently add half-count inputs.',
                )
          }
        />
      )}
    </>
  );
}
function Linear({ mode }: { mode: LanguageMode }) {
  const [k, setK] = useState(2),
    [b, setB] = useState(3),
    [trap, setTrap] = useState(false),
    [tested, setTested] = useState(false),
    bounds = trap
      ? { xMin: 0, xMax: 4, yMin: 0, yMax: 10, xStep: 1, yStep: 2 }
      : { xMin: -4, xMax: 4, yMin: -12, yMax: 12, xStep: 1, yStep: 3 };
  return (
    <>
      <label>
        <Text mode={mode} text={t('关系调查', 'Relationship investigation')} />
        <select
          aria-label={label(mode, t('关系调查', 'Relationship investigation'))}
          value={trap ? 'trap' : 'line'}
          onChange={(e) => {
            setTrap(e.target.value === 'trap');
            setTested(false);
          }}
        >
          <option value="line">
            {label(mode, t('给定 y=kx+b', 'Supplied y=kx+b'))}
          </option>
          <option value="trap">
            {label(mode, t('两个试值吻合的陷阱', 'Two matching samples trap'))}
          </option>
        </select>
      </label>
      {trap ? (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '两个明确给定的模型 y=x 与 y=x²，在 x=0、1 时都吻合。两次吻合能说明模型相同吗？再检验 x=2。',
                'Two supplied models, y=x and y=x², agree at x=0 and 1. Do two matches prove identity? Test x=2.',
              )}
            />
          </p>
          <CartesianPlot
            mode={mode}
            bounds={bounds}
            caption={
              tested
                ? t(
                    '展开后，y=x 是直线，y=x² 是曲线；图中只画 0≤x≤3 的比较部分。两种模型已经给定，不是从两个样本唯一推出来的。',
                    'After revealing, y=x is straight and y=x² is curved; only the comparison on 0≤x≤3 is drawn. Both models are supplied, not uniquely inferred from two samples.',
                  )
                : undefined
            }
            curves={
              tested
                ? [
                    {
                      name: 'y=x',
                      points: [
                        { x: 0, y: 0 },
                        { x: 3, y: 3 },
                      ],
                    },
                    {
                      name: 'y=x²',
                      color: '#a14532',
                      points: Array.from({ length: 31 }, (_, i) => ({
                        x: i / 10,
                        y: (i / 10) ** 2,
                      })),
                    },
                  ]
                : []
            }
            points={
              tested
                ? [
                    { x: 2, y: 2, label: 'L' },
                    { x: 2, y: 4, label: 'Q' },
                  ]
                : [
                    { x: 0, y: 0, label: 'A' },
                    { x: 1, y: 1, label: 'B' },
                  ]
            }
          />
          <button className="math-button" onClick={() => setTested(true)}>
            <Text mode={mode} text={t('再检验 x=2', 'Test x=2')} />
          </button>
          {tested && (
            <p role="status">
              <Text
                mode={mode}
                text={t(
                  '直线模型给 2，平方模型给 4；一个反例否定恒等，几个吻合不能证明一般关系。两条图线来自已给模型。',
                  'The line gives 2 and the square gives 4. One counterexample refutes identity; a few matches cannot prove a general rule. Both curves come from the supplied models.',
                )}
              />
            </p>
          )}
        </>
      ) : (
        <>
          <div className="math-cart-controls">
            <Range
              mode={mode}
              name={t('每单位变化 k', 'Change per unit k')}
              value={k}
              min={-3}
              max={3}
              change={setK}
            />
            <Range
              mode={mode}
              name={t('初始量 b', 'Initial value b')}
              value={b}
              min={-4}
              max={4}
              change={setB}
            />
          </div>
          <CartesianPlot
            mode={mode}
            bounds={bounds}
            curves={[{ name: 'y=kx+b', points: lineSegment(k, b, bounds) }]}
            points={[{ x: 0, y: b, label: 'B' }]}
          />
          <p>
            <Text
              mode={mode}
              text={t(
                '每次 x 增一，y 变 k；x=0 时 y=b。本课广义线性指 y=kx+b，含 k=0 的常数情形；严格的一次函数通常另要求 k≠0。b 非零时不叫正比例。',
                'For each unit increase in x, y changes by k; at x=0, y=b. Here “linear” broadly includes y=kx+b and the constant case k=0. A strictly first-degree function requires k≠0. A nonzero b rules out direct proportion.',
              )}
            />
          </p>
          <Task
            key={`${k}/${b}`}
            mode={mode}
            name={t(
              'y 右侧的一般式（不写等号）',
              'General expression after y= (omit the equal sign)',
            )}
            answer={{
              kind: 'expression',
              value: `${k}x+(${b})`,
              variable: 'x',
            }}
          />
        </>
      )}
    </>
  );
}
function Context({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<CoordinateContext>('water'),
    [query, setQuery] = useState(2),
    m = contextGraph(kind, String(query)),
    titles = {
      water: t(
        '虚构水箱：V=12−2t，t 分钟，0≤t≤6；V 升。空箱后本模型停止，不预测负水量。',
        'Fictional tank: V=12−2t, t minutes with 0≤t≤6; V litres. The model ends at empty, without negative volumes.',
      ),
      cards: t(
        '虚构卡片费：C=3n+5，n 为 0–6 的整数张数，C 为 NZD。固定费只一次，不接受半张。',
        'Fictional card cost: C=3n+5, integer n from 0 to 6; C in NZD. One fixed fee, with no half-card inputs.',
      ),
      temperature: t(
        '假想摄氏读数：T=−4+(3/2)t，t 小时，0≤t≤4；T 为 °C。仅在给定时段作均匀变化模型。',
        'Fictional Celsius reading: T=−4+(3/2)t, t hours with 0≤t≤4; T in °C. Uniform change is assumed only over that interval.',
      ),
    },
    unit = kind === 'water' ? 'L' : kind === 'cards' ? 'NZD' : '°C',
    xLabel =
      kind === 'water'
        ? 't (min)'
        : kind === 'cards'
          ? mode === 'en'
            ? 'n (cards)'
            : mode === 'zh'
              ? 'n (张)'
              : 'n (张/cards)'
          : 't (h)',
    yLabel =
      kind === 'water' ? 'V (L)' : kind === 'cards' ? 'C (NZD)' : 'T (°C)',
    points =
      kind === 'cards'
        ? Array.from({ length: 7 }, (_, x) => ({ x, y: 3 * x + 5, label: '' }))
        : [],
    curves = m.continuous
      ? [
          {
            name: kind,
            points: lineSegment(
              plotNumber(m.k),
              Number(m.b),
              m.bounds,
              m.domain,
            ),
          },
        ]
      : [];
  return (
    <>
      <label>
        <Text mode={mode} text={t('虚构模型', 'Fictional model')} />
        <select
          aria-label={label(mode, t('虚构模型', 'Fictional model'))}
          value={kind}
          onChange={(e) => {
            setKind(e.target.value as CoordinateContext);
            setQuery(2);
          }}
        >
          <option value="water">
            {label(
              mode,
              t('排水与空箱边界', 'Draining and the empty boundary'),
            )}
          </option>
          <option value="cards">
            {label(mode, t('整数张数与固定费', 'Integer counts and fixed fee'))}
          </option>
          <option value="temperature">
            {label(
              mode,
              t('负起点与均匀升温', 'Negative start and uniform warming'),
            )}
          </option>
        </select>
      </label>
      <p>
        <Text mode={mode} text={titles[kind]} />
      </p>
      <CartesianPlot
        mode={mode}
        bounds={m.bounds}
        points={points}
        curves={curves}
        xLabel={xLabel}
        yLabel={yLabel}
      />
      <Range
        mode={mode}
        name={t('待检验输入', 'Input to inspect')}
        value={query}
        min={0}
        max={8}
        step={0.5}
        change={setQuery}
      />
      {m.allowed ? (
        <Task
          key={`${kind}/${query}`}
          mode={mode}
          name={t('该输入的情境输出', 'Context output for this input')}
          answer={{
            kind: 'number',
            value: m.value!,
            formats: ['decimal', 'fraction'],
            unit,
          }}
        />
      ) : (
        <p
          role="status"
          aria-label={label(mode, t('模型范围', 'Model domain'))}
        >
          <Text
            mode={mode}
            text={t(
              `机械代入得 ${m.rawValue}，但输入不在本模型范围，不把它作为有效预测。这不同于“方程无解”；先回到允许输入再计算。`,
              `Algebraic extension gives ${m.rawValue}, but this input is outside the model domain and no valid prediction is asserted. This differs from an equation having no solution; return to an allowed input.`,
            )}
          />
        </p>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '解释每单位变化的符号、初始量与单位。图的倾斜外观随两轴刻度改变，数值变化率不变；给定模型的假设与观察数据要分开。',
            'Explain the sign of change, initial value and units. Visual steepness changes with axis scales, while the numerical rate does not. Distinguish supplied model assumptions from observed data.',
          )}
        />
      </p>
    </>
  );
}
export function CartesianLab({
  kind,
  mode,
}: {
  kind: CartesianLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-cart-lab">
      {kind === 'cart-plane' ? (
        <Plane mode={mode} />
      ) : kind === 'cart-plot' ? (
        <Plotting mode={mode} />
      ) : kind === 'cart-table' ? (
        <Table mode={mode} />
      ) : kind === 'cart-linear' ? (
        <Linear mode={mode} />
      ) : (
        <Context mode={mode} />
      )}
    </div>
  );
}
export function CartesianHookArt({
  kind,
  mode,
}: {
  kind: CartesianLabKind;
  mode: LanguageMode;
}) {
  const text = {
    'cart-plane': '(x, y) ≠ (y, x) ?',
    'cart-plot': 'AXIS · SCALE · ( ? , ? )',
    'cart-table': 'ROW → POINT → LINE ?',
    'cart-linear': 'Δy / Δx · y(0) → ?',
    'cart-context': 'QUANTITY · UNIT · DOMAIN ?',
  };
  return (
    <div className="math-cart-hook">
      <strong>{text[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '有序位置 → 刻度图像 → 有条件的关系',
            'Ordered positions → scaled graphs → conditional relationships',
          )}
        />
      </p>
    </div>
  );
}
