import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text, Fraction } from './ui';
import { DecimalPlaceChart, DecimalZoom, DecimalAxis } from './DecimalVisuals';
import {
  decimalDigits,
  decimalColumns,
  decimalDivision,
  decimalPlaceNames,
  firstDifferentDecimal,
  formatMilli,
  roundMilli,
  shoppingModel,
} from './decimalModels';
export type DecimalLabKind =
  | 'decimal-place'
  | 'decimal-compare'
  | 'decimal-add'
  | 'decimal-multiply'
  | 'decimal-divide'
  | 'decimal-application';
export const isDecimalLab = (kind: Lesson['lab']): kind is DecimalLabKind =>
  [
    'decimal-place',
    'decimal-compare',
    'decimal-add',
    'decimal-multiply',
    'decimal-divide',
    'decimal-application',
  ].includes(kind);
function Slider({
  label,
  mode,
  value,
  min,
  max,
  onChange,
  display = formatMilli(value),
  step = 1,
}: {
  label: LocalizedText;
  mode: LanguageMode;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  display?: string;
  step?: number;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        aria-label={mode === 'en' ? label.en : label.zh}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{display}</output>
    </label>
  );
}
function Place({ mode }: { mode: LanguageMode }) {
  const [milli, setMilli] = useState(2306);
  const nonzero = decimalDigits(milli).filter((p) => p.digit);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先猜：只把千分位加一，数会增加多少？改动一列，再用不同单位核对。',
            'Predict: if only thousandths increases by one, how much does the value increase? Change one column and check its units.',
          )}
        />
      </p>
      <div className="math-number-readout">{formatMilli(milli)}</div>
      <DecimalPlaceChart
        milli={milli}
        mode={mode}
        onDigit={(unit, digit) => {
          const old = decimalDigits(milli).find((p) => p.unit === unit)!.digit;
          setMilli(milli + (digit - old) * unit);
        }}
      />
      <div className="math-lab-presets">
        {[2306, 3006, 30, 407].map((n) => (
          <button
            className="math-button secondary"
            key={n}
            onClick={() => setMilli(n)}
          >
            {formatMilli(n)}
          </button>
        ))}
      </div>
      <div className="math-expanded-form">
        <Text
          mode={mode}
          text={t(
            '每列贡献相加，仍是同一个数',
            'Each place contributes to the same number',
          )}
        />
        <strong>
          {nonzero.length
            ? nonzero.map((p) => formatMilli(p.contribution)).join(' + ')
            : '0.000'}{' '}
          = {formatMilli(milli)}
        </strong>
        <p>
          <Text
            mode={mode}
            text={t(
              `${milli} 个千分之一；个位也计入总量。`,
              `${milli} thousandths in total, including the ones place.`,
            )}
          />
        </p>
      </div>
      <DecimalZoom milli={milli} mode={mode} />
    </>
  );
}
function Compare({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(805),
    [b, setB] = useState(800),
    [digits, setDigits] = useState<1 | 2>(1);
  const place = firstDifferentDecimal(a, b),
    rounded = roundMilli(a, digits),
    sign = a === b ? '=' : a > b ? '>' : '<';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先比较原数，再看舍入报告。末尾补零可以对齐，写的位数多不代表数更大。',
            'Compare the original values before rounding them. Trailing zeros align places; more digits do not mean a larger value.',
          )}
        />
      </p>
      <div className="math-number-readout">
        {formatMilli(a)} {sign} {formatMilli(b)}
      </div>
      <div className="math-decimal-pair">
        <section>
          <strong>A</strong>
          <DecimalPlaceChart milli={a} mode={mode} highlight={place} />
        </section>
        <section>
          <strong>B</strong>
          <DecimalPlaceChart milli={b} mode={mode} highlight={place} />
        </section>
      </div>
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            place < 0
              ? t(
                  '每列相同：两种写法表示相同数量。',
                  'Every place matches: the two representations have the same value.',
                )
              : t(
                  `第一次不同在${decimalPlaceNames[place]!.zh}，两数精确相差 ${formatMilli(Math.abs(a - b))}。`,
                  `The first differing place is ${decimalPlaceNames[place]!.en.toLowerCase()}; the exact difference is ${formatMilli(Math.abs(a - b))}.`,
                )
          }
        />
      </p>
      <DecimalAxis a={a} b={b} mode={mode} />
      <Slider
        label={t('数 A', 'Number A')}
        mode={mode}
        min={0}
        max={2999}
        value={a}
        onChange={setA}
      />
      <Slider
        label={t('数 B', 'Number B')}
        mode={mode}
        min={0}
        max={2999}
        value={b}
        onChange={setB}
      />
      <div className="math-lab-presets">
        {[
          [805, 800],
          [500, 450],
          [70, 700],
          [300, 300],
          [1995, 2000],
        ].map(([left, right]) => (
          <button
            key={`${left}-${right}`}
            className="math-button secondary"
            onClick={() => {
              setA(left!);
              setB(right!);
            }}
          >
            {formatMilli(left!)} / {formatMilli(right!)}
          </button>
        ))}
      </div>
      <div
        className="math-lab-presets"
        role="group"
        aria-label={mode === 'en' ? 'Rounding place' : '舍入位置'}
      >
        {([1, 2] as const).map((n) => (
          <button
            className="math-button secondary"
            key={n}
            aria-pressed={digits === n}
            onClick={() => setDigits(n)}
          >
            <Text
              mode={mode}
              text={
                n === 1
                  ? t('最近的十分之一', 'Nearest tenth')
                  : t('最近的百分之一', 'Nearest hundredth')
              }
            />
          </button>
        ))}
      </div>
      <div className="math-expanded-form">
        <Text
          mode={mode}
          text={t(
            'A 的舍入报告 · 中点取上边',
            'Rounded report for A · halfway ties up',
          )}
        />
        <strong>
          {formatMilli(a)} ≈ {(rounded / 1000).toFixed(digits)}
        </strong>
        <p>
          <Text
            mode={mode}
            text={t(
              '这是近似报告。即使 A 和 B 舍入后相同，也不能推出原数相等。',
              'This is a rounded report. Matching rounded results do not imply matching original values.',
            )}
          />
        </p>
      </div>
    </>
  );
}
function Add({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(2750),
    [b, setB] = useState(680),
    [operation, setOperation] = useState<'add' | 'subtract'>('add'),
    [show, setShow] = useState(false);
  const model = decimalColumns(a, b, operation),
    sign = operation === 'add' ? '+' : '−';
  const rows = [a, b, model.result];
  const update = (side: 'a' | 'b', n: number) => {
    (side === 'a' ? setA : setB)(n);
    setShow(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测结果和某一列的交换。对齐小数点，从右边的小单位开始，再展开步骤核对。',
            'Predict the result and an exchange in one column. Align decimal points, start from small units on the right, then reveal the steps to check.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {(['add', 'subtract'] as const).map((op) => (
          <button
            key={op}
            className="math-button secondary"
            aria-pressed={operation === op}
            onClick={() => {
              setOperation(op);
              setShow(false);
            }}
          >
            <Text
              mode={mode}
              text={
                op === 'add' ? t('加法', 'Addition') : t('减法', 'Subtraction')
              }
            />
          </button>
        ))}
      </div>
      <div className="math-number-readout">
        {formatMilli(a)} {sign} {formatMilli(b)} = {formatMilli(model.result)}
      </div>
      <div
        className="math-chart-scroll"
        tabIndex={0}
        aria-label={
          mode === 'en' ? 'Aligned decimal calculation' : '小数对齐计算'
        }
      >
        <table className="math-place-chart math-decimal-chart math-decimal-calculation">
          <thead>
            <tr>
              <th scope="col">
                <Text mode={mode} text={t('行', 'Row')} />
              </th>
              {decimalPlaceNames.map((name, i) => (
                <th key={i} scope="col">
                  <Text mode={mode} text={name} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((n, i) => (
              <tr key={i}>
                <th scope="row">{i === 0 ? 'A' : i === 1 ? sign : '='}</th>
                {decimalDigits(n).map((p) => (
                  <td key={p.unit}>
                    <strong>{p.digit}</strong>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Slider
        label={t('第一项', 'First amount')}
        mode={mode}
        min={1000}
        max={9000}
        value={a}
        onChange={(n) => update('a', n)}
      />
      <Slider
        label={t('第二项', 'Second amount')}
        mode={mode}
        min={0}
        max={999}
        value={b}
        onChange={(n) => update('b', n)}
      />
      <div className="math-lab-presets">
        {[
          { a: 1200, b: 450, op: 'add' },
          { a: 2750, b: 680, op: 'add' },
          { a: 3006, b: 580, op: 'subtract' },
          { a: 1003, b: 508, op: 'subtract' },
        ].map((p) => (
          <button
            className="math-button secondary"
            key={`${p.a}-${p.b}`}
            onClick={() => {
              setA(p.a);
              setB(p.b);
              setOperation(p.op as 'add' | 'subtract');
              setShow(false);
            }}
          >
            {formatMilli(p.a)} {p.op === 'add' ? '+' : '−'} {formatMilli(p.b)}
          </button>
        ))}
      </div>
      <button
        className="math-button secondary"
        aria-expanded={show}
        onClick={() => setShow(!show)}
      >
        <Text
          mode={mode}
          text={
            show
              ? t('收起列步骤', 'Hide column steps')
              : t('我已预测，展开列步骤', 'I predicted; show column steps')
          }
        />
      </button>
      {show && (
        <ol className="math-decimal-column-steps">
          {model.columns.map((c) => (
            <li key={c.place}>
              <Text
                mode={mode}
                text={
                  operation === 'add'
                    ? t(
                        `${decimalPlaceNames[c.place]!.zh}：${c.left}+${c.right}+${c.incoming}（从右边进来）=${c.raw}。写 ${c.digit}，向左进 ${c.outgoing} 个大单位。`,
                        `${decimalPlaceNames[c.place]!.en}: ${c.left}+${c.right}+${c.incoming} (carried from the right)=${c.raw}. Write ${c.digit}; carry ${c.outgoing} larger units left.`,
                      )
                    : t(
                        `${decimalPlaceNames[c.place]!.zh}：本列原有 ${c.left}，已向右邻借出 ${c.incoming}，还需减 ${c.right}。${c.outgoing ? '不够减，先向左借 1 个大单位，换成这里的 10 个单位。' : ''}${c.left + 10 * c.outgoing}−${c.incoming}−${c.right}=${c.digit}，写 ${c.digit}。`,
                        `${decimalPlaceNames[c.place]!.en}: start with ${c.left}; ${c.incoming} was lent to the right and ${c.right} must be subtracted. ${c.outgoing ? 'There is not enough. Borrow one larger unit from the left, worth ten units here. ' : ''}${c.left + 10 * c.outgoing}−${c.incoming}−${c.right}=${c.digit}. Write ${c.digit}.`,
                      )
                }
              />
            </li>
          ))}
        </ol>
      )}
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            operation === 'add'
              ? t(
                  `反向检查：${formatMilli(model.result)} − ${formatMilli(b)} = ${formatMilli(a)}。`,
                  `Inverse check: ${formatMilli(model.result)} − ${formatMilli(b)} = ${formatMilli(a)}.`,
                )
              : t(
                  `反向检查：${formatMilli(model.result)} + ${formatMilli(b)} = ${formatMilli(a)}。`,
                  `Inverse check: ${formatMilli(model.result)} + ${formatMilli(b)} = ${formatMilli(a)}.`,
                )
          }
        />
      </p>
    </>
  );
}
function Multiply({ mode }: { mode: LanguageMode }) {
  const [amount, setAmount] = useState(325),
    [count, setCount] = useState(4),
    total = amount * count;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先估算：四组 0.325 会超过 1 吗？改变每组量或组数，检查同样大的组如何合成总量。',
            'Estimate: will four groups of 0.325 exceed one? Change the amount or group count and inspect how equal groups make the total.',
          )}
        />
      </p>
      <div className="math-number-readout">
        {formatMilli(amount)} × {count} = {formatMilli(total)}
      </div>
      <Slider
        label={t('每组量', 'Amount per group')}
        mode={mode}
        min={0}
        max={2000}
        value={amount}
        onChange={setAmount}
      />
      <Slider
        label={t('组数', 'Group count')}
        mode={mode}
        min={0}
        max={4}
        value={count}
        display={String(count)}
        onChange={setCount}
      />
      <div
        className="math-decimal-groups"
        role="img"
        aria-label={
          mode === 'en'
            ? `${count} equal groups, each ${formatMilli(amount)}, total ${formatMilli(total)}`
            : `${count} 个相同的组，每组 ${formatMilli(amount)}，合计 ${formatMilli(total)}`
        }
      >
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>
            <span>{i + 1}</span>
            <div className="math-decimal-group-track">
              <i style={{ width: `${(amount / 2000) * 100}%` }} />
            </div>
            <strong>{formatMilli(amount)}</strong>
          </div>
        ))}
        {count === 0 && (
          <p>
            <Text
              mode={mode}
              text={t(
                '零组：没有添加数量，总量为 0。',
                'Zero groups: no amount is added, so the total is zero.',
              )}
            />
          </p>
        )}
      </div>
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            '每条完整轨道表示 2 个单位，涂色长度按每组量成比例；组数是条数。',
            'Every complete track represents two units. Shaded length is proportional to the amount per group; the number of tracks is the group count.',
          )}
        />
      </p>
      <div className="math-expanded-form">
        <Text
          mode={mode}
          text={t('换成千分之一计数', 'Count in thousandths')}
        />
        <strong>
          {amount} × {count} = {total}
        </strong>
        <p>
          <Text
            mode={mode}
            text={t(
              `${total} 个千分之一 = ${formatMilli(total)}。整数乘法计算的是小单位的个数。`,
              `${total} thousandths = ${formatMilli(total)}. Whole-number multiplication counts these small units.`,
            )}
          />
        </p>
      </div>
    </>
  );
}
function Divide({ mode }: { mode: LanguageMode }) {
  const [amount, setAmount] = useState(1500),
    [groups, setGroups] = useState(4),
    m = decimalDivision(amount, groups);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先猜每份是多少，再用乘法检查。总量平均分成相同份额；有限显示不一定就是精确值。',
            'Predict each share, then check by multiplying. The total is split into equal shares; a finite display is not always an exact value.',
          )}
        />
      </p>
      <div className="math-number-readout">
        {formatMilli(amount)} ÷ {groups} {m.exactAtThousandths ? '=' : '≈'}{' '}
        {formatMilli(m.roundedThousandths)}
      </div>
      <Slider
        label={t('总量（升）', 'Total (litres)')}
        mode={mode}
        min={0}
        max={3000}
        value={amount}
        onChange={setAmount}
      />
      <Slider
        label={t('平均份数', 'Equal-share count')}
        mode={mode}
        min={1}
        max={6}
        value={groups}
        display={String(groups)}
        onChange={setGroups}
      />
      <div className="math-lab-presets">
        {[
          [1500, 4],
          [1000, 3],
          [2000, 3],
          [0, 4],
        ].map(([a, g]) => (
          <button
            className="math-button secondary"
            key={`${a}-${g}`}
            onClick={() => {
              setAmount(a!);
              setGroups(g!);
            }}
          >
            {formatMilli(a!)} ÷ {g}
          </button>
        ))}
      </div>
      <div
        className="math-decimal-sharing"
        role="img"
        aria-label={
          mode === 'en'
            ? `${formatMilli(amount)} litres shared equally ${groups} ways; exactly ${m.exact} litre each`
            : `${formatMilli(amount)} 升平均分为 ${groups} 份，每份精确为 ${m.exact} 升`
        }
        style={{ gridTemplateColumns: `repeat(${groups},minmax(0,1fr))` }}
      >
        {Array.from({ length: groups }, (_, i) => (
          <span className={amount ? 'filled' : ''} key={i} aria-hidden="true">
            {i + 1}
          </span>
        ))}
      </div>
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            `这一整条表示总量 ${formatMilli(amount)} 升，等宽部分表示相等份额；总量为零时没有涂色。`,
            `This entire strip represents ${formatMilli(amount)} litres. Equal widths represent equal shares; a zero total has no shading.`,
          )}
        />
      </p>
      <div className="math-expanded-form">
        <Text mode={mode} text={t('每份精确量', 'Exact amount per share')} />
        <strong className="math-decimal-exact">
          <Fraction n={m.numerator} d={m.denominator} />
          <span>
            L × {groups} = {formatMilli(amount)} L
          </span>
        </strong>
        {!m.exactAtThousandths && (
          <p className="math-hint">
            <Text
              mode={mode}
              text={t(
                `每份约 ${formatMilli(m.roundedThousandths)} 升。把这 ${groups} 个显示值相加是 ${formatMilli(m.roundedThousandths * groups)} 升；显示差别来自舍入，精确分数仍合成原总量。`,
                `Each display is about ${formatMilli(m.roundedThousandths)} litre. Adding ${groups} rounded displays gives ${formatMilli(m.roundedThousandths * groups)} litres. The discrepancy comes from rounding; the exact fractions still recover the total.`,
              )}
            />
          </p>
        )}
      </div>
    </>
  );
}
const money = (cents: number) => `NZ$${(cents / 100).toFixed(2)}`;
function Applications({ mode }: { mode: LanguageMode }) {
  const [price, setPrice] = useState(125),
    [count, setCount] = useState(3),
    [budget, setBudget] = useState(500),
    m = shoppingModel(price, count, budget);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '假想采购：先预测预算是否足够，再算总价与余额。单价、件数、预算是不同角色；不需要真实购买。',
            'Imaginary shopping: predict whether the budget is enough, then calculate total cost and balance. Unit price, count and budget have different roles; no purchase is needed.',
          )}
        />
      </p>
      <Slider
        label={t('单价（NZD）', 'Unit price (NZD)')}
        mode={mode}
        min={10}
        max={400}
        value={price}
        display={money(price)}
        onChange={setPrice}
      />
      <Slider
        label={t('件数', 'Item count')}
        mode={mode}
        min={1}
        max={4}
        value={count}
        display={String(count)}
        onChange={setCount}
      />
      <Slider
        label={t('预算（NZD）', 'Budget (NZD)')}
        mode={mode}
        min={500}
        max={3000}
        step={50}
        value={budget}
        display={money(budget)}
        onChange={setBudget}
      />
      <div className="math-number-readout">
        {money(price)} × {count} = {money(m.total)}
      </div>
      <div className="math-round-distances">
        <div>
          <Text
            mode={mode}
            text={t(
              '先把单价估到最近 10 分',
              'First round unit price to nearest ten cents',
            )}
          />
          <strong>≈ {money(m.estimate)}</strong>
        </div>
        <div>
          <Text mode={mode} text={t('精确总价', 'Exact total price')} />
          <strong>{money(m.total)}</strong>
        </div>
      </div>
      <div
        className="math-decimal-budget"
        role="img"
        aria-label={
          mode === 'en'
            ? `Budget ${money(budget)}, cost ${money(m.total)}, ${m.shortfall ? 'shortfall' : 'change'} ${money(m.shortfall || m.change)}`
            : `预算 ${money(budget)}，成本 ${money(m.total)}，${m.shortfall ? '还差' : '余额'} ${money(m.shortfall || m.change)}`
        }
      >
        <i
          style={{ width: `${(m.total / Math.max(budget, m.total)) * 100}%` }}
        />
        <span
          style={{ left: `${(budget / Math.max(budget, m.total)) * 100}%` }}
        />
      </div>
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            '涂色是总价；标线是预算。标线落在涂色里面时，预算不足。',
            'Shading is total price; the marker is the budget. A marker inside the shading means the budget is insufficient.',
          )}
        />
      </p>
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            m.shortfall
              ? t(
                  `还差 ${money(m.shortfall)}：${money(m.total)} − ${money(budget)}。不能把负余额当作找零。`,
                  `Shortfall ${money(m.shortfall)}: ${money(m.total)} − ${money(budget)}. A negative balance is not change.`,
                )
              : t(
                  `余额 ${money(m.change)}；检查 ${money(m.total)} + ${money(m.change)} = ${money(budget)}。`,
                  `Change ${money(m.change)}; check ${money(m.total)} + ${money(m.change)} = ${money(budget)}.`,
                )
          }
        />
      </p>
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            '这是整数分的数学模型，估算与精算分开；不涉及商店现金舍入。',
            'This mathematical model uses integer cents and separates estimates from exact totals; it does not model shop cash rounding.',
          )}
        />
      </p>
    </>
  );
}
export function DecimalLab({
  kind,
  mode,
}: {
  kind: DecimalLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-decimal-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '小数工作台 · 先预测，再操作',
              'DECIMAL WORKSHOP · PREDICT, THEN EXPLORE',
            )}
          />
        </span>
        <span className="math-live">
          <Text mode={mode} text={t('实时模型', 'LIVE MODEL')} />
        </span>
      </div>
      {kind === 'decimal-place' ? (
        <Place mode={mode} />
      ) : kind === 'decimal-compare' ? (
        <Compare mode={mode} />
      ) : kind === 'decimal-add' ? (
        <Add mode={mode} />
      ) : kind === 'decimal-multiply' ? (
        <Multiply mode={mode} />
      ) : kind === 'decimal-divide' ? (
        <Divide mode={mode} />
      ) : (
        <Applications mode={mode} />
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '解释：每个数的单位是什么？你改动了什么，怎样检查结果？',
            'Explain: what unit belongs to each number, what changed, and how can you check the result?',
          )}
        />
      </div>
    </section>
  );
}
export function DecimalHookArt({
  kind,
  mode,
}: {
  kind: DecimalLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-number-hook">
      {kind === 'decimal-place' ? (
        <DecimalPlaceChart milli={307} mode={mode} />
      ) : kind === 'decimal-compare' ? (
        <DecimalAxis a={805} b={800} mode={mode} />
      ) : (
        <div className="math-decimal-preview">
          <Text
            mode={mode}
            text={t('先辨认数量关系', 'Identify the relationship first')}
          />
          <strong>
            {kind === 'decimal-add'
              ? '2.750 + 0.680 = ?'
              : kind === 'decimal-multiply'
                ? '0.325 × 4 = ?'
                : kind === 'decimal-divide'
                  ? '1.500 ÷ 4 = ?'
                  : 'NZ$1.25 × 3 → NZ$5 − ?'}
          </strong>
        </div>
      )}
    </div>
  );
}
