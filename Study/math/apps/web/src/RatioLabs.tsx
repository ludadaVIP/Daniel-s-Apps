import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import {
  RatioCounters,
  RatioShares,
  RatioMap,
  ProportionGraph,
} from './RatioVisuals';
import {
  orderedRatio,
  simplifyRatio,
  reduceBy,
  allocateRatio,
  ratioTable,
  checkRatioPair,
  mapScale,
  costCurve,
  type CurveKind,
} from './ratioModels';
import { ratioText, decimalText } from './percentModels';
export type RatioLabKind = Extract<Lesson['lab'], `ratio-${string}`>;
export const isRatioLab = (kind: Lesson['lab']): kind is RatioLabKind =>
  kind.startsWith('ratio-');
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Slider({
  label,
  value,
  min = 0,
  max,
  step = 1,
  mode,
  change,
}: {
  label: LocalizedText;
  value: number;
  min?: number;
  max: number;
  step?: number;
  mode: LanguageMode;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        aria-label={word(mode, label)}
        type="range"
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
function Check({
  label,
  mode,
  click,
}: {
  label: LocalizedText;
  mode: LanguageMode;
  click: () => void;
}) {
  return (
    <button className="math-button" onClick={click}>
      <Text mode={mode} text={label} />
    </button>
  );
}
function Compare({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(4),
    [b, setB] = useState(6),
    [target, setTarget] = useState('part'),
    [show, setShow] = useState(false);
  const m = orderedRatio(a, b),
    first = target === 'reverse' ? b : a,
    second = target === 'whole' ? a + b : target === 'reverse' ? a : b;
  const reset = () => setShow(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先说比较哪两种量、顺序是什么，再看图。A:B、B:A 与 A:总量分别回答不同问题；比不表示两个量相差多少。',
            'Name both quantities and their order before reading the figure. A:B, B:A and A:total answer different questions. A ratio does not describe the difference.',
          )}
        />
      </p>
      <Slider
        label={t('A 的个数', 'Count A')}
        value={a}
        min={1}
        max={12}
        mode={mode}
        change={(n) => {
          setA(n);
          reset();
        }}
      />
      <Slider
        label={t('B 的个数', 'Count B')}
        value={b}
        min={1}
        max={12}
        mode={mode}
        change={(n) => {
          setB(n);
          reset();
        }}
      />
      <label>
        <Text mode={mode} text={t('比较对象与顺序', 'Comparison and order')} />
        <select
          aria-label={word(mode, t('比较对象与顺序', 'Comparison and order'))}
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            reset();
          }}
        >
          <option value="part">A:B</option>
          <option value="reverse">B:A</option>
          <option value="whole">A:{word(mode, t('总量', 'total'))}</option>
        </select>
      </label>
      <RatioCounters a={a} b={b} mode={mode} />
      <Check
        mode={mode}
        label={t(
          '我已确认顺序，核对比',
          'I identified the order; check the ratio',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `${target === 'reverse' ? 'B:A' : target === 'whole' ? 'A:总量' : 'A:B'}=${first}:${second}；比值为 ${ratioText(orderedRatio(first, second).value)}。总量为 ${m.total}，部分比部分不能直接当部分占整体。`,
              `${target === 'reverse' ? 'B:A' : target === 'whole' ? 'A:total' : 'A:B'}=${first}:${second}; its quotient is ${ratioText(orderedRatio(first, second).value)}. The total is ${m.total}; a part-to-part ratio is not a part-to-whole fraction.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Simplify({ mode }: { mode: LanguageMode }) {
  const [raw, setRaw] = useState('6:9'),
    [stage, setStage] = useState(0),
    [divisor, setDivisor] = useState(3),
    [checked, setChecked] = useState(false);
  const m = simplifyRatio(raw),
    r = reduceBy(m.first, m.second, divisor);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '这些比的两项已用同一种单位。先把小数或分数改成同样小单位的整数个数，再尝试两项同时除同一个非零公因数。分组保留原量，最简比还要求两项互质。',
            'Both terms already use a common unit. First express decimals or fractions as integer counts of equal small units, then divide both terms by the same nonzero common factor. Grouping preserves quantities; simplest terms must also be coprime.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('待化简的比', 'Ratio to simplify')} />
        <select
          aria-label={word(mode, t('待化简的比', 'Ratio to simplify'))}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setStage(0);
            setDivisor(1);
            setChecked(false);
          }}
        >
          {['6:9', '18:24', '0.6:0.9', '1/2:3/4', '1.2:1.8', '15:10'].map(
            (s) => (
              <option key={s}>{s}</option>
            ),
          )}
        </select>
      </label>
      {stage === 0 ? (
        <Check
          mode={mode}
          label={t(
            '我已统一小单位，核对整数项',
            'I used equal small units; check integer terms',
          )}
          click={() => setStage(1)}
        />
      ) : (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                `用同样的 1/${m.denominator} 单位计数：${raw} 对应 ${m.first}:${m.second}。`,
                `Counting equal 1/${m.denominator} units, ${raw} corresponds to ${m.first}:${m.second}.`,
              )}
            />
          </p>
          <label>
            <Text
              mode={mode}
              text={t('两项同时除以', 'Divide both terms by')}
            />
            <select
              aria-label={word(mode, t('两项同时除以', 'Divide both terms by'))}
              value={divisor}
              onChange={(e) => {
                setDivisor(Number(e.target.value));
                setChecked(false);
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1}>{i + 1}</option>
              ))}
            </select>
          </label>
          <RatioCounters
            a={m.first}
            b={m.second}
            group={checked && r.kind !== 'invalid' ? divisor : 0}
            mode={mode}
          />
          <Check
            mode={mode}
            label={t(
              '核对同除与最简条件',
              'Check equal division and simplest terms',
            )}
            click={() => setChecked(true)}
          />
          {checked && (
            <p role="status">
              <Text
                mode={mode}
                text={
                  r.kind === 'invalid'
                    ? t(
                        `${divisor} 不是两项共同的整数因数，不能把小数商截断来假装整组。`,
                        `${divisor} is not an integer factor of both terms. Do not truncate quotients to invent complete groups.`,
                      )
                    : r.kind === 'equivalent'
                      ? t(
                          `${m.first}:${m.second}=${r.first}:${r.second} 保持比值，但仍有公因数，尚未最简。`,
                          `${m.first}:${m.second}=${r.first}:${r.second} preserves the quotient, but a common factor remains; it is not simplest yet.`,
                        )
                      : t(
                          `${m.first}:${m.second}=${r.first}:${r.second}，两项互质，是最简整数比。原数量保留，只改比较的计数单位。`,
                          `${m.first}:${m.second}=${r.first}:${r.second}; the terms are coprime, so this is the simplest integer ratio. Original quantities remain; only the counting unit changes.`,
                        )
                }
              />
            </p>
          )}
        </>
      )}
    </>
  );
}
function Share({ mode }: { mode: LanguageMode }) {
  const [total, setTotal] = useState(25),
    [a, setA] = useState(2),
    [b, setB] = useState(3),
    [show, setShow] = useState(false),
    m = allocateRatio(total, a, b);
  const reset = () => setShow(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '把假想总升数按 A:B 分配。先加两项得到总份数，不能只除其中一项。水量可以有分数升；总量零时分配都是零，但 0:0 不能用来定义实际比值。',
            'Allocate fictional total litres in ratio A:B. Add both terms for the total number of parts; do not divide by only one term. Fractional litres are valid. A zero total gives zero to both, but 0:0 cannot define an observed ratio quotient.',
          )}
        />
      </p>
      <Slider
        label={t('待分总量（L）', 'Total to share (L)')}
        value={total}
        max={40}
        mode={mode}
        change={(n) => {
          setTotal(n);
          reset();
        }}
      />
      <Slider
        label={t('A 的权重', 'A weight')}
        value={a}
        min={1}
        max={6}
        mode={mode}
        change={(n) => {
          setA(n);
          reset();
        }}
      />
      <Slider
        label={t('B 的权重', 'B weight')}
        value={b}
        min={1}
        max={6}
        mode={mode}
        change={(n) => {
          setB(n);
          reset();
        }}
      />
      <RatioShares total={total} a={a} b={b} mode={mode} />
      <Check
        mode={mode}
        label={t(
          '我已找总份数，核对分配',
          'I found all the parts; check the allocation',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `总份数 ${a}+${b}=${m.parts}；每份 ${ratioText(m.each)} L。A 得 ${ratioText(m.first)} L，B 得 ${ratioText(m.second)} L；合计 ${total} L。${total === 0 ? '这是零总量的分配，实际 0:0 没有定义比值。' : '两部分与原权重交叉相乘相等。'}`,
              `All parts: ${a}+${b}=${m.parts}; each is ${ratioText(m.each)} L. A gets ${ratioText(m.first)} L and B gets ${ratioText(m.second)} L, totaling ${total} L. ${total === 0 ? 'This allocates a zero total; the observed 0:0 has no defined quotient.' : 'Cross products of the two allocations and original weights agree.'}`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Table({ mode }: { mode: LanguageMode }) {
  const [base, setBase] = useState('2:3'),
    [x, setX] = useState(4),
    [y, setY] = useState(5),
    [show, setShow] = useState(false);
  const [a, b] = base.split(':').map(Number) as [number, number],
    rows = ratioTable(a, b),
    result = checkRatioPair(a, b, x, y);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '两项同时乘同一个正数，才沿用原来的比。表中每行都是同样配方的升数；给候选行找证据，不要只比较两项相差多少。',
            'Scale both terms by the same positive multiplier to preserve the ratio. Each row gives litres for the same recipe. Check a candidate row using evidence rather than a matching difference.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('原配方 A:B', 'Original recipe A:B')} />
        <select
          aria-label={word(mode, t('原配方 A:B', 'Original recipe A:B'))}
          value={base}
          onChange={(e) => {
            setBase(e.target.value);
            setShow(false);
          }}
        >
          {['2:3', '3:5', '4:6'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <div
        className="math-ratio-table-scroll"
        tabIndex={0}
        role="region"
        aria-label={word(mode, t('配方比值表', 'Recipe ratio table'))}
      >
        <table>
          <thead>
            <tr>
              <th>
                <Text mode={mode} text={t('共同倍数', 'Common multiplier')} />
              </th>
              <th>A (L)</th>
              <th>B (L)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.factor}>
                <td>×{r.factor}</td>
                <td>{r.x}</td>
                <td>{r.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Slider
        label={t('候选行 A（L）', 'Candidate A (L)')}
        value={x}
        max={24}
        mode={mode}
        change={(n) => {
          setX(n);
          setShow(false);
        }}
      />
      <Slider
        label={t('候选行 B（L）', 'Candidate B (L)')}
        value={y}
        max={24}
        mode={mode}
        change={(n) => {
          setY(n);
          setShow(false);
        }}
      />
      <Check
        mode={mode}
        label={t(
          '我已比较两项，核对候选行',
          'I compared both terms; check the row',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={
              result === 'origin'
                ? t(
                    '零升与零升表示没有配制，满足两量同时为零的关系；但 0:0 的比值没有定义，不能拿零行相除证明比值相同。',
                    'Zero litres of both means no mixture and fits the zero-quantity relationship. However, 0:0 has no defined quotient; the zero row cannot prove equal ratios by division.',
                  )
                : result === 'equivalent'
                  ? t(
                      `${x}×${b}=${y}×${a}=${x * b}，候选行与 ${a}:${b} 保持同比。`,
                      `${x}×${b}=${y}×${a}=${x * b}; the candidate preserves ${a}:${b}.`,
                    )
                  : t(
                      `${x}×${b}=${x * b}，${y}×${a}=${y * a}，不相等。两项同加某数或差相同，不保证比相同。`,
                      `${x}×${b}=${x * b}, while ${y}×${a}=${y * a}. The unequal products show a different ratio. Adding the same amount or keeping the same difference is insufficient.`,
                    )
            }
          />
        </p>
      )}
    </>
  );
}
function Map({ mode }: { mode: LanguageMode }) {
  const [horizontal, setH] = useState(3),
    [vertical, setV] = useState(2),
    [scale, setScale] = useState(50000),
    [zoom, setZoom] = useState(1),
    [show, setShow] = useState(false),
    m = mapScale(horizontal, vertical, scale, zoom);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '比例尺两项先用相同单位。原地图 1 cm 对应实际多少厘米？沿两段路线相加，不把端点直线当行走距离。屏幕放大只改显示，原图坐标不变。',
            'Use the same units on both sides of a map scale. How many real centimetres correspond to one original-map centimetre? Add both route legs instead of using a straight shortcut. Screen zoom changes display, preserving original-map coordinates.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('原地图比例尺', 'Original map scale')} />
        <select
          aria-label={word(mode, t('原地图比例尺', 'Original map scale'))}
          value={scale}
          onChange={(e) => {
            setScale(Number(e.target.value));
            setShow(false);
          }}
        >
          {[10000, 25000, 50000, 100000].map((n) => (
            <option key={n} value={n}>
              1:{n}
            </option>
          ))}
        </select>
      </label>
      <Slider
        label={t('原图第一段（cm）', 'First original-map leg (cm)')}
        value={horizontal}
        min={1}
        max={6}
        step={0.5}
        mode={mode}
        change={(n) => {
          setH(n);
          setShow(false);
        }}
      />
      <Slider
        label={t('原图第二段（cm）', 'Second original-map leg (cm)')}
        value={vertical}
        min={1}
        max={5}
        step={0.5}
        mode={mode}
        change={(n) => {
          setV(n);
          setShow(false);
        }}
      />
      <label>
        <Text mode={mode} text={t('显示放大', 'Display zoom')} />
        <select
          aria-label={word(mode, t('显示放大', 'Display zoom'))}
          value={zoom}
          onChange={(e) => {
            setZoom(Number(e.target.value));
            setShow(false);
          }}
        >
          <option value="1">1×</option>
          <option value="2">2×</option>
        </select>
      </label>
      <RatioMap
        horizontal={horizontal}
        vertical={vertical}
        scale={scale}
        zoom={zoom}
        mode={mode}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `图形放大 ${zoom} 倍，原坐标仍是 ${horizontal} cm 与 ${vertical} cm。若把整张原地图放大 ${zoom} 倍后印出，新数值比例尺应为 1:${m.printedScale}；原图的 1:${scale} 不能直接配合放大纸图上的厘米。`,
            `Display zoom is ${zoom}×; original coordinates remain ${horizontal} cm and ${vertical} cm. If the original map is printed ${zoom} times larger, its new numerical scale is 1:${m.printedScale}. Do not apply the original 1:${scale} to centimetres measured on that enlarged print.`,
          )}
        />
      </p>
      <Check
        mode={mode}
        label={t(
          '我已统一单位，核对路线距离',
          'I matched units; check the route distance',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `原图路线 ${horizontal}+${vertical}=${m.route} cm；实际 ${ratioText(m.realCm)} cm=${ratioText(m.realM)} m=${decimalText(m.realKm) ?? ratioText(m.realKm)} km。显示缩放不改变这段真实路线。`,
              `The original-map route is ${horizontal}+${vertical}=${m.route} cm: ${ratioText(m.realCm)} real cm=${ratioText(m.realM)} m=${decimalText(m.realKm) ?? ratioText(m.realKm)} km. Display zoom does not change the real route.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Graph({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<CurveKind>('direct'),
    [rate, setRate] = useState(3),
    [wide, setWide] = useState(false),
    [show, setShow] = useState(false),
    m = costCurve(kind, rate);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '这里直接给定假想水量与总价的规则，允许 0–8 L 的连续量。检查正水量时总价÷升数是否恒定，并看零升对应多少。几个点不能自行证明所有情形；直线或过原点也各自不够。',
            'A fictional continuous volume-to-price rule is given for 0–8 L. Check whether price÷litres stays constant for positive volumes and inspect the value at zero. A few points alone do not prove a universal rule; being straight or passing through the origin is not individually enough.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('给定关系', 'Given relationship')} />
        <select
          aria-label={word(mode, t('给定关系', 'Given relationship'))}
          value={kind}
          onChange={(e) => {
            setKind(e.target.value as CurveKind);
            setShow(false);
          }}
        >
          <option value="direct">y={rate}x</option>
          <option value="fee">y={rate}x+4</option>
          <option value="square">y=x×x</option>
        </select>
      </label>
      {kind !== 'square' && (
        <Slider
          label={t('每升系数', 'Coefficient per litre')}
          value={rate}
          min={1}
          max={5}
          mode={mode}
          change={(n) => {
            setRate(n);
            setShow(false);
          }}
        />
      )}
      <label>
        <Text mode={mode} text={t('纵轴显示范围', 'Vertical display range')} />
        <select
          aria-label={word(mode, t('纵轴显示范围', 'Vertical display range'))}
          value={wide ? 'wide' : 'standard'}
          onChange={(e) => {
            setWide(e.target.value === 'wide');
            setShow(false);
          }}
        >
          <option value="standard">0–{m.minimumY}</option>
          <option value="wide">0–{m.minimumY * 2}</option>
        </select>
      </label>
      <ProportionGraph kind={kind} rate={rate} wide={wide} mode={mode} />
      <div
        className="math-ratio-table-scroll"
        tabIndex={0}
        role="region"
        aria-label={word(mode, t('给定关系数据', 'Given relationship data'))}
      >
        <table>
          <thead>
            <tr>
              <th>x (L)</th>
              <th>y (NZ$)</th>
            </tr>
          </thead>
          <tbody>
            {[m.points[0]!, ...m.rates].map((p) => (
              <tr key={p.x}>
                <td>{p.x}</td>
                <td>{p.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Check
        mode={mode}
        label={t(
          '我已检查零点与比值，核对关系',
          'I checked zero and quotients; check the relationship',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={
              m.proportional
                ? t(
                    `给定规则 y=${rate}x：正水量时 y/x 恒为 ${rate} NZ$/L，零升对应零元，图线为过原点的直线，是正比例。零行不能算 0/0；依据是给定规则。`,
                    `The given rule y=${rate}x has constant y/x=${rate} NZ$/L for positive volumes and maps zero litres to zero dollars. Its straight line through the origin is direct proportion. Do not calculate 0/0 for the zero row; the given rule provides the basis.`,
                  )
                : kind === 'fee'
                  ? t(
                      `y=${rate}x+4 是直线，但零升对应四元；1 L 与 2 L 的比值分别为 ${ratioText(m.rates[0]!.perLitre)} 与 ${ratioText(m.rates[1]!.perLitre)} NZ$/L，不恒定，不是正比例。`,
                      `y=${rate}x+4 is straight, but zero litres costs four dollars. At 1 L and 2 L, y/x is ${ratioText(m.rates[0]!.perLitre)} and ${ratioText(m.rates[1]!.perLitre)} NZ$/L, so it is not direct proportion.`,
                    )
                  : t(
                      'y=x×x 过原点，但 1 L、2 L、4 L 的 y/x 为 1、2、4 NZ$/L，不恒定，图线弯曲，不是正比例。',
                      'y=x×x passes through the origin, but y/x at 1 L, 2 L and 4 L is 1, 2 and 4 NZ$/L. The quotient changes and the curve is not direct proportion.',
                    )
            }
          />
        </p>
      )}
    </>
  );
}
export function RatioLab({
  kind,
  mode,
}: {
  kind: RatioLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-ratio-lab">
      <span className="math-eyebrow">
        <Text
          mode={mode}
          text={t(
            '动手数学 · 同比的证据',
            'HANDS-ON MATHS · EVIDENCE FOR A CONSTANT RATIO',
          )}
        />
      </span>
      {kind === 'ratio-compare' ? (
        <Compare mode={mode} />
      ) : kind === 'ratio-simplify' ? (
        <Simplify mode={mode} />
      ) : kind === 'ratio-share' ? (
        <Share mode={mode} />
      ) : kind === 'ratio-table' ? (
        <Table mode={mode} />
      ) : kind === 'ratio-map' ? (
        <Map mode={mode} />
      ) : (
        <Graph mode={mode} />
      )}
    </section>
  );
}
export function RatioHookArt({
  kind,
  mode,
}: {
  kind: RatioLabKind;
  mode: LanguageMode;
}) {
  return kind === 'ratio-compare' ? (
    <RatioCounters a={4} b={6} mode={mode} />
  ) : kind === 'ratio-share' ? (
    <RatioShares total={25} a={2} b={3} mode={mode} />
  ) : kind === 'ratio-map' ? (
    <RatioMap mode={mode} />
  ) : kind === 'ratio-graph' ? (
    <ProportionGraph mode={mode} />
  ) : (
    <p>
      <Text
        mode={mode}
        text={
          kind === 'ratio-simplify'
            ? t(
                '6:9、2:3 与 3:4：哪些保持相同关系？原数量是否被拿走？',
                'Which of 6:9, 2:3 and 3:4 preserve the same relationship? Are original quantities removed?',
              )
            : t(
                '2:3 → 4:6；2:3 → 4:5。两项乘二与两项加二，哪个保持比值？',
                '2:3 → 4:6 versus 2:3 → 4:5. Does doubling or adding two to both terms preserve the quotient?',
              )
        }
      />
    </p>
  );
}
