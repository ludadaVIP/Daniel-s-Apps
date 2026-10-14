import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import { ProductArea, SplitArray } from './CalculationVisuals';
import {
  columnCalculation,
  splitProduct,
  longDivision,
  estimateCalculation,
  estimateCases,
} from './calculationModels';
export type CalculationLabKind =
  | 'calculation-regroup'
  | 'calculation-split'
  | 'calculation-area'
  | 'calculation-division'
  | 'calculation-estimate';
export const isCalculationLab = (
  kind: Lesson['lab'],
): kind is CalculationLabKind => kind.startsWith('calculation-');
const places = (place: number) =>
  ({
    1: t('个', 'ones'),
    10: t('十', 'tens'),
    100: t('百', 'hundreds'),
    1000: t('千', 'thousands'),
  })[place]!;
function Range({
  text,
  value,
  max,
  min = 0,
  mode,
  set,
}: {
  text: LocalizedText;
  value: number;
  max: number;
  min?: number;
  mode: LanguageMode;
  set: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={text} />
      <input
        type="range"
        aria-label={mode === 'en' ? text.en : text.zh}
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
const columnCases = [
  { a: 268, b: 157, operation: 'add' },
  { a: 408, b: 179, operation: 'subtract' },
  { a: 1000, b: 1, operation: 'subtract' },
  { a: 999, b: 1, operation: 'add' },
  { a: 100, b: 100, operation: 'subtract' },
] as const;
function Regroup({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [visible, setVisible] = useState(0);
  const m = columnCalculation(
    columnCases[index]!.a,
    columnCases[index]!.b,
    columnCases[index]!.operation,
  );
  const last = m.steps[visible - 1],
    top = m.operation === 'subtract' && last ? last.after : m.top;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先算下一列，再展开核对。一列计的是个、十、百或千，不能把进位当成一整个数位的原数字。',
            'Calculate the next column before revealing it. Each column counts ones, tens, hundreds or thousands; a carry has a place value.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {columnCases.map((c, i) => (
          <button
            key={i}
            className="math-button secondary"
            aria-pressed={index === i}
            onClick={() => {
              setIndex(i);
              setVisible(0);
            }}
          >
            {c.a} {c.operation === 'add' ? '+' : '−'} {c.b}
          </button>
        ))}
      </div>
      <div className="math-calc-table-wrap">
        <table className="math-calc-table">
          <caption>
            <Text
              mode={mode}
              text={t(
                '同位对齐 · 每列单位不变',
                'ALIGN MATCHING PLACES · KEEP THE UNIT',
              )}
            />
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <Text mode={mode} text={t('数量', 'Quantity')} />
              </th>
              {m.top.map((_, i) => (
                <th scope="col" key={i}>
                  <Text
                    mode={mode}
                    text={places(10 ** (m.top.length - i - 1))}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{m.a}</th>
              {top.map((digit, i) => (
                <td
                  key={i}
                  className={digit !== m.top[i] ? 'is-exchanged' : ''}
                >
                  {digit}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">
                {m.operation === 'add' ? '+' : '−'} {m.b}
              </th>
              {m.bottom.map((digit, i) => (
                <td key={i}>{digit}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">
                <Text mode={mode} text={t('本列答案', 'Result digits')} />
              </th>
              {m.top.map((_, i) => (
                <td key={i}>
                  {m.steps.slice(0, visible).find((s) => s.index === i)
                    ?.digit ?? '·'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <ol className="math-calc-steps">
        {m.steps.slice(0, visible).map((s) => (
          <li key={s.index}>
            <strong>
              <Text mode={mode} text={places(s.place)} />：
              {m.operation === 'add'
                ? `${s.top} + ${s.bottom} + ${s.incoming} = ${s.raw}`
                : `${s.top} − ${s.bottom} = ${s.digit}`}
            </strong>
            <Text
              mode={mode}
              text={
                m.operation === 'add'
                  ? t(
                      `本列合计 ${s.raw} 个当前单位，留下 ${s.digit}，向左进 ${s.outgoing} 个更大单位。`,
                      `This column totals ${s.raw} current units; keep ${s.digit} and carry ${s.outgoing} larger units left.`,
                    )
                  : s.donor === undefined
                    ? t(
                        '本列够减，直接在同一单位内相减。',
                        'Enough units in this column: subtract in the same unit.',
                      )
                    : t(
                        `从 ${places(10 ** (m.top.length - s.donor - 1)).zh}位换组；经过的零位先得十个再换出一个，留下九个。换组前后顶行仍表示 ${m.a}。`,
                        `Exchange from the ${places(10 ** (m.top.length - s.donor - 1)).en} column. An intervening zero column receives ten then exchanges one onward, leaving nine. The top row still represents ${m.a}.`,
                      )
              }
            />
          </li>
        ))}
      </ol>
      <button
        className="math-button secondary"
        disabled={visible === m.steps.length}
        onClick={() => setVisible(visible + 1)}
      >
        <Text
          mode={mode}
          text={t('我已试算，看下一列', 'I calculated; show next column')}
        />
      </button>
      {visible === m.steps.length && (
        <div className="math-number-readout">
          {m.a} {m.operation === 'add' ? '+' : '−'} {m.b} = {m.result}
          <p className="math-muted">
            <Text
              mode={mode}
              text={
                m.finalCarry
                  ? t(
                      `左端还要写 ${m.finalCarry} 个更大单位，不能丢掉。`,
                      `Write the final ${m.finalCarry} larger unit at the left; do not drop it.`,
                    )
                  : t(
                      '用反向运算再检查一次。',
                      'Check once more with the inverse operation.',
                    )
              }
            />
          </p>
        </div>
      )}
    </>
  );
}
function Split({ mode }: { mode: LanguageMode }) {
  const [groups, setGroups] = useState(6),
    [size, setSize] = useState(8),
    [cut, setCut] = useState(5),
    [reveal, setReveal] = useState(false);
  const m = splitProduct(groups, size, cut);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '同一阵列沿每一行拆分。先算两块，再合计；改变分界线不会增加或删去物体。',
            'Split every row of the same array. Calculate each part before combining; moving the cut adds or removes no objects.',
          )}
        />
      </p>
      <div className="math-calc-controls">
        <Range
          text={t('行数', 'Row count')}
          value={groups}
          max={12}
          mode={mode}
          set={(n) => {
            setGroups(n);
            setReveal(false);
          }}
        />
        <Range
          text={t('每行个数', 'Objects per row')}
          value={size}
          max={12}
          mode={mode}
          set={(n) => {
            setSize(n);
            setCut(Math.min(cut, n));
            setReveal(false);
          }}
        />
        <Range
          text={t('左块每行个数', 'Left part per row')}
          value={cut}
          max={size}
          mode={mode}
          set={(n) => {
            setCut(n);
            setReveal(false);
          }}
        />
      </div>
      <SplitArray groups={groups} size={size} cut={cut} mode={mode} />
      <div className="math-number-readout">
        {groups} × ({cut} + {m.rest}) = {groups} × {cut} + {groups} × {m.rest}
      </div>
      <button
        className="math-button secondary"
        aria-expanded={reveal}
        onClick={() => setReveal(!reveal)}
      >
        <Text
          mode={mode}
          text={t('我已算两块，展开核对', 'I calculated both parts; check')}
        />
      </button>
      {reveal && (
        <p className="math-hint">
          {m.left} + {m.right} = {m.total}
          <Text
            mode={mode}
            text={t(
              '每一行的两部分都重复相同行数，不能只给一部分乘行数。',
              'Both parts repeat in every row; multiply both by the row count.',
            )}
          />
        </p>
      )}
    </>
  );
}
function Area({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(23),
    [b, setB] = useState(14),
    [reveal, setReveal] = useState(false);
  const m = areaProduct(a, b);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '把两条边都拆成整十与个位，先找四块。移动边长时，长和宽使用同一个单位标尺。',
            'Split both sides into tens and ones and identify four regions. Both changing side lengths use the same unit scale.',
          )}
        />
      </p>
      <div className="math-calc-controls">
        <Range
          text={t('宽的单位数', 'Width in units')}
          value={a}
          min={10}
          max={49}
          mode={mode}
          set={(n) => {
            setA(n);
            setReveal(false);
          }}
        />
        <Range
          text={t('高的单位数', 'Height in units')}
          value={b}
          min={10}
          max={49}
          mode={mode}
          set={(n) => {
            setB(n);
            setReveal(false);
          }}
        />
      </div>
      <ProductArea a={a} b={b} mode={mode} showProducts={reveal} />
      <button
        className="math-button secondary"
        aria-expanded={reveal}
        onClick={() => setReveal(!reveal)}
      >
        <Text
          mode={mode}
          text={t(
            '我已算四块，展开面积',
            'I calculated four regions; show areas',
          )}
        />
      </button>
      {reveal && (
        <div className="math-number-readout">
          {m.parts.map((p) => p.area).join(' + ')} = {m.total}
        </div>
      )}
      <p className="math-hint">
        <Text
          mode={mode}
          text={t(
            '竖式中乘十位得到的是若干个十。例如 23×10=230，不是 23；四块面积都必须计入。',
            'The tens-digit partial product counts tens. For example, 23×10=230, not 23; include all four regions.',
          )}
        />
      </p>
    </>
  );
}
const divisionCases = [
  [936, 12],
  [1005, 5],
  [235, 6],
  [0, 4],
  [408, 4],
] as const;
function Division({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [visible, setVisible] = useState(0),
    [n, d] = divisionCases[index]!,
    m = longDivision(n, d);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '逐位分组，先说本行计什么单位，再求商、乘回、相减。余量换成下一小单位后，才与下一位合并。',
            'Work by place: name the current unit, find the quotient digit, multiply back and subtract. Exchange the remainder to the next smaller unit before combining the next digit.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {divisionCases.map(([a, b], i) => (
          <button
            key={i}
            className="math-button secondary"
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              setVisible(0);
            }}
          >
            {a} ÷ {b}
          </button>
        ))}
      </div>
      <ol className="math-calc-steps">
        {m.steps.slice(0, visible).map((s, i) => (
          <li key={i}>
            <strong>
              <Text mode={mode} text={places(s.place)} />：{s.available} = {d} ×{' '}
              {s.quotientDigit} + {s.remainder}
            </strong>
            <Text
              mode={mode}
              text={
                i === 0
                  ? t(
                      `先处理 ${s.available} 个当前单位。商的这一位是 ${s.quotientDigit}。`,
                      `Start with ${s.available} current units. This quotient digit is ${s.quotientDigit}.`,
                    )
                  : t(
                      `上行余 ${s.previous} 个较大单位，换成 ${s.previous * 10} 个当前单位，加本位 ${s.digit}，得到 ${s.available}。`,
                      `Exchange the previous ${s.previous} larger units for ${s.previous * 10} current units, then add this digit ${s.digit}, giving ${s.available}.`,
                    )
              }
            />
            <Text
              mode={mode}
              text={t(
                `分走 ${d}×${s.quotientDigit}=${s.used}，剩 ${s.remainder}，小于除数 ${d}。`,
                `Use ${d}×${s.quotientDigit}=${s.used}; remainder ${s.remainder} is less than divisor ${d}.`,
              )}
            />
          </li>
        ))}
      </ol>
      <button
        className="math-button secondary"
        disabled={visible === m.steps.length}
        onClick={() => setVisible(visible + 1)}
      >
        <Text
          mode={mode}
          text={t('我已试算，展开下一位', 'I calculated; reveal next place')}
        />
      </button>
      {visible === m.steps.length && (
        <>
          <div className="math-number-readout">
            {n} = {d} × {m.quotient} + {m.remainder}
          </div>
          <p className="math-hint">
            <Text
              mode={mode}
              text={t(
                `整数商 ${m.quotient}，余 ${m.remainder}。商中开头的零可省，中间的零必须保留。${m.remainder ? '这是完整组数与余量；普通除法的精确值还包括余量除以除数。' : '没有余量，整数商也是精确的除法结果。'}`,
                `Whole-number quotient ${m.quotient}, remainder ${m.remainder}. Omit leading zeros, but keep internal zeros. ${m.remainder ? 'This describes full groups and leftovers; the exact numerical quotient also includes remainder divided by divisor.' : 'With no remainder, this whole quotient is the exact division result.'}`,
              )}
            />
          </p>
        </>
      )}
    </>
  );
}
function Estimate({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [candidate, setCandidate] = useState<number>(),
    [bounds, setBounds] = useState(false),
    [exact, setExact] = useState(false);
  const c = estimateCases[index]!,
    m = estimateCalculation(c.a, c.b, c.operation, c.unit),
    symbol =
      c.operation === 'add' ? '+' : c.operation === 'subtract' ? '−' : '×';
  const outside =
    candidate !== undefined && (candidate < m.lower || candidate > m.upper);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先选择一个候选结果。估算可排除明显离谱的数，却不能证明接近的数一定正确；范围内的候选还要精算。',
            'Choose a candidate. Estimation can reject an implausible magnitude, but cannot prove a nearby answer correct; candidates inside the bounds still need exact calculation.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {estimateCases.map((item, i) => (
          <button
            className="math-button secondary"
            key={i}
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              setCandidate(undefined);
              setBounds(false);
              setExact(false);
            }}
          >
            {item.a}{' '}
            {item.operation === 'add'
              ? '+'
              : item.operation === 'subtract'
                ? '−'
                : '×'}{' '}
            {item.b}
          </button>
        ))}
      </div>
      <div
        className="math-lab-presets"
        role="group"
        aria-label={mode === 'en' ? 'Candidate result' : '候选结果'}
      >
        {c.candidates.map((v) => (
          <button
            key={v}
            className="math-button secondary"
            aria-pressed={candidate === v}
            onClick={() => {
              setCandidate(v);
              setBounds(false);
              setExact(false);
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <button
        className="math-button secondary"
        disabled={candidate === undefined}
        onClick={() => setBounds(true)}
      >
        <Text
          mode={mode}
          text={t('先看估算与界限', 'Inspect estimate and bounds first')}
        />
      </button>
      {bounds && (
        <>
          <div className="math-number-readout">
            {c.a} {symbol} {c.b} ≈ {m.roundA} {symbol} {m.roundB} = {m.estimate}
          </div>
          <div className="math-calc-bounds">
            <div>
              <Text mode={mode} text={t('不小于', 'At least')} />
              <strong>{m.lower}</strong>
            </div>
            <div>
              <Text mode={mode} text={t('不大于', 'At most')} />
              <strong>{m.upper}</strong>
            </div>
          </div>
          <p>
            <Text
              mode={mode}
              text={t(
                `原数分别在 ${m.aLow}–${m.aHigh} 与 ${m.bLow}–${m.bHigh} 之间。${c.operation === 'subtract' ? '差的下界用较小的被减数减较大的减数，上界反过来。' : '这里的数非负，可分别用下界与上界计算总量范围。'}`,
                `The operands lie in ${m.aLow}–${m.aHigh} and ${m.bLow}–${m.bHigh}. ${c.operation === 'subtract' ? 'For the lower difference subtract the larger subtrahend from the smaller minuend; reverse these for the upper bound.' : 'These operands are non-negative, so their lower and upper endpoints bound the result.'}`,
              )}
            />
          </p>
          <p className="math-hint" role="status">
            <Text
              mode={mode}
              text={
                outside
                  ? t(
                      '候选在可靠范围之外，可以排除。',
                      'The candidate is outside the reliable bounds and can be ruled out.',
                    )
                  : t(
                      '候选在范围内，暂不能判对。请用精确计算或反向运算核查。',
                      'The candidate is inside the bounds; do not mark it correct yet. Use exact calculation or an inverse check.',
                    )
              }
            />
          </p>
          <button
            className="math-button secondary"
            onClick={() => setExact(true)}
          >
            <Text
              mode={mode}
              text={t('我已精算，再核对', 'I calculated exactly; check')}
            />
          </button>
        </>
      )}
      {exact && (
        <p className="math-hint">
          {c.a} {symbol} {c.b} = {m.exact}
          <Text
            mode={mode}
            text={
              candidate === m.exact
                ? t(
                    '精算结果与候选一致。',
                    'Exact calculation matches the candidate.',
                  )
                : t(
                    '候选与精算不同；接近不等于相等。',
                    'The candidate differs from the exact result; close is not equal.',
                  )
            }
          />
        </p>
      )}
    </>
  );
}
export function CalculationLab({
  kind,
  mode,
}: {
  kind: CalculationLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-calc-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '计算工作台 · 每一步都有数量意义',
              'CALCULATION WORKSHOP · EVERY STEP HAS MEANING',
            )}
          />
        </span>
        <span className="math-live">
          <Text
            mode={mode}
            text={t('先预测，再展开', 'PREDICT, THEN REVEAL')}
          />
        </span>
      </div>
      {kind === 'calculation-regroup' ? (
        <Regroup mode={mode} />
      ) : kind === 'calculation-split' ? (
        <Split mode={mode} />
      ) : kind === 'calculation-area' ? (
        <Area mode={mode} />
      ) : kind === 'calculation-division' ? (
        <Division mode={mode} />
      ) : (
        <Estimate mode={mode} />
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '说明：这一位或这一块计什么单位？变换前后数量如何保持？怎样用另一个方法检查？',
            'Explain the unit of this column or region. How is quantity preserved, and how can another method check it?',
          )}
        />
      </div>
    </section>
  );
}
export function CalculationHookArt({
  kind,
  mode,
}: {
  kind: CalculationLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-number-hook">
      {kind === 'calculation-area' ? (
        <ProductArea a={23} b={14} mode={mode} />
      ) : kind === 'calculation-split' ? (
        <SplitArray groups={6} size={8} cut={5} mode={mode} />
      ) : (
        <div className="math-number-readout">
          {kind === 'calculation-regroup'
            ? '10 × 1 ↔ 1 × 10'
            : kind === 'calculation-division'
              ? 'n = d × q + r'
              : '≈ ？ = ？'}
          <Text
            mode={mode}
            text={
              kind === 'calculation-regroup'
                ? t(
                    '同一数量，换一种单位计数',
                    'The same quantity, counted in another unit',
                  )
                : kind === 'calculation-division'
                  ? t(
                      '总量 = 除数 × 整数商 + 余量',
                      'Total = divisor × whole quotient + remainder',
                    )
                  : t(
                      '近似检查与精确证明',
                      'Approximate checking and exact evidence',
                    )
            }
          />
        </div>
      )}
    </div>
  );
}
