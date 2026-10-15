import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import { PercentGrid, PercentSource, PercentAxis } from './PercentVisuals';
import {
  perHundred,
  decimalPercent,
  fractionPercent,
  percentText,
  ratioText,
  decimalText,
  percentOf,
  wholeFromPercent,
  priceChange,
  moneyText,
} from './percentModels';
export type PercentLabKind = Extract<Lesson['lab'], `percent-${string}`>;
export const isPercentLab = (kind: Lesson['lab']): kind is PercentLabKind =>
  kind.startsWith('percent-');
const word = (mode: LanguageMode, label: LocalizedText) =>
  mode === 'en' ? label.en : label.zh;
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
      <Text text={label} mode={mode} />
      <input
        type="range"
        aria-label={word(mode, label)}
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
function Hundred({ mode }: { mode: LanguageMode }) {
  const [total, setTotal] = useState(40),
    [selected, setSelected] = useState(10),
    [show, setShow] = useState(false);
  const m = perHundred(selected, total);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先看实际卡片，再把相同比例映到百格图。百格图是比较用的标准整体，不会凭空多出卡片。',
            'Inspect the actual cards, then map the same proportion to a hundred grid. The standardized grid compares proportions; it does not create extra cards.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('实际卡片总数', 'Actual card total')} />
        <select
          aria-label={word(mode, t('实际卡片总数', 'Actual card total'))}
          value={total}
          onChange={(e) => {
            const n = Number(e.target.value);
            setTotal(n);
            setSelected(Math.min(n, selected));
            setShow(false);
          }}
        >
          {[20, 40, 50, 80, 100].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <Slider
        label={t('有标记的卡片', 'Marked cards')}
        value={selected}
        max={total}
        mode={mode}
        change={(n) => {
          setSelected(n);
          setShow(false);
        }}
      />
      <PercentSource selected={selected} total={total} mode={mode} />
      <PercentGrid value={m.value} mode={mode} />
      <Check
        mode={mode}
        label={t(
          '我已比较比例，核对每百份',
          'I compared the proportions; check per hundred',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `${selected}/${total}=${ratioText(m.value)}，每百份为 ${ratioText(m.coefficient)}，即 ${percentText(m.value)}。实际标记数仍为 ${selected} 张。`,
              `${selected}/${total}=${ratioText(m.value)} equals ${ratioText(m.coefficient)} per hundred, or ${percentText(m.value)}. The actual marked count remains ${selected} ${selected === 1 ? 'card' : 'cards'}.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Decimal({ mode }: { mode: LanguageMode }) {
  const [milli, setMilli] = useState(375),
    [show, setShow] = useState(false);
  const m = decimalPercent(milli);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '改变的是表示方式，数本身不变。想一想：百分数前面的数为何是一百倍，而加上 % 后表示的量没有放大？',
            'Change the representation while preserving the number. Why is the coefficient one hundred times as large, while the percent sign keeps the represented quantity unchanged?',
          )}
        />
      </p>
      <Slider
        label={t('千分之几', 'Thousandths')}
        value={milli}
        max={2000}
        mode={mode}
        change={(n) => {
          setMilli(n);
          setShow(false);
        }}
      />
      <p className="math-percent-value">{m.decimal} = ?%</p>
      <div className="math-row">
        {[35, 375, 1000, 1250].map((n) => (
          <button
            key={n}
            className="math-quiet"
            onClick={() => {
              setMilli(n);
              setShow(false);
            }}
          >
            {decimalPercent(n).decimal}
          </button>
        ))}
      </div>
      <PercentGrid value={m.value} mode={mode} />
      <Check
        mode={mode}
        label={t(
          '我已换算，核对同一个数',
          'I converted it; check the same number',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `${m.decimal}=${milli}/1000=${decimalText({ n: milli, d: 10 })}/100=${m.percent}。百分号本身表示除以一百；${milli === 0 ? '0 与 0% 都表示零。' : `${m.decimal} 并不等于 ${m.decimal}%。`}`,
              `${m.decimal}=${milli}/1000=${decimalText({ n: milli, d: 10 })}/100=${m.percent}. The percent sign means divide by one hundred. ${milli === 0 ? 'Both 0 and 0% represent zero.' : `${m.decimal} is not equal to ${m.decimal}%.`}`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Fraction({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(3),
    [d, setD] = useState(8),
    [show, setShow] = useState(false);
  const m = fractionPercent(n, d);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '能扩成分母一百时用等值分数；不能用整数份扩成一百时，仍可把分数乘一百作为百分数前面的数。循环结果保留精确形式，近似另写约等号。',
            'Use an equivalent denominator of one hundred when possible. Otherwise multiply the fraction by one hundred for the percent coefficient. Keep recurring results exact and mark rounded displays with an approximation sign.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('分母', 'Denominator')} />
        <select
          aria-label={word(mode, t('分母', 'Denominator'))}
          value={d}
          onChange={(e) => {
            const next = Number(e.target.value);
            setD(next);
            setN(Math.min(n, 2 * next));
            setShow(false);
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1}>{i + 1}</option>
          ))}
        </select>
      </label>
      <Slider
        label={t('分子', 'Numerator')}
        value={n}
        max={2 * d}
        mode={mode}
        change={(v) => {
          setN(v);
          setShow(false);
        }}
      />
      <p className="math-percent-value">
        {n}/{d} = ?%
      </p>
      <PercentGrid value={m.value} mode={mode} />
      <Check
        mode={mode}
        label={t(
          '我已保持等值，核对百分数',
          'I kept the value; check the percentage',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `${n}/${d}×100=${ratioText(m.coefficient)}，所以 ${n}/${d}=${m.exact}。${decimalText(m.coefficient) === null ? `按一位小数约为 ${m.approximate}，只能写约等号，不能取代精确值。` : '这里的百分数是精确值。'}`,
              `${n}/${d}×100=${ratioText(m.coefficient)}, so ${n}/${d}=${m.exact}. ${decimalText(m.coefficient) === null ? `Rounded to one decimal place: ≈${m.approximate}. Use an approximation sign; rounding does not replace the exact value.` : 'This percentage is exact.'}`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Amount({ mode }: { mode: LanguageMode }) {
  const [whole, setWhole] = useState(80),
    [rate, setRate] = useState(35),
    [show, setShow] = useState(false);
  const m = percentOf(whole, rate);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '100% 对应已有总升数。先预测所取量，再从 1% 或分数乘法计算。超过 100% 可以表示比参考总量更多的需求；这不是从原桶里凭空取出更多水。',
            '100% refers to the stated total litres. Predict the amount, then use 1% or fraction multiplication. A rate above 100% can express a larger requirement relative to the reference amount; it does not create water inside the original container.',
          )}
        />
      </p>
      <Slider
        label={t('参考总量（L）', 'Reference whole (L)')}
        value={whole}
        max={100}
        mode={mode}
        change={(v) => {
          setWhole(v);
          setShow(false);
        }}
      />
      <Slider
        label={t('所求百分数', 'Requested percentage')}
        value={rate}
        max={150}
        mode={mode}
        change={(v) => {
          setRate(v);
          setShow(false);
        }}
      />
      <PercentAxis
        rate={rate}
        wholeLabel={`${whole} L`}
        partLabel="? L"
        mode={mode}
      />
      <Check
        mode={mode}
        label={t(
          '我已求份额，核对实际量',
          'I found the share; check the amount',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `1% 是 ${whole}÷100=${ratioText(m.one)} L；${rate}% 是 ${whole}×${rate}/100=${ratioText(m.amount)} L。实际量保留升单位。`,
              `1% is ${whole}÷100=${ratioText(m.one)} L; ${rate}% is ${whole}×${rate}/100=${ratioText(m.amount)} L. Keep litres for the measured amount.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Whole({ mode }: { mode: LanguageMode }) {
  const [part, setPart] = useState(18),
    [rate, setRate] = useState(30),
    [stage, setStage] = useState(0);
  const m = wholeFromPercent(part, rate);
  const invalid = m.kind !== 'unique';
  const warning =
    m.kind === 'undetermined'
      ? t(
          '0% 对应零升，不能确定唯一的正整体：任意正整体的 0% 都是零。',
          'Zero percent corresponds to zero litres, so no unique positive whole is determined: every positive whole has zero as its 0%.',
        )
      : m.kind === 'zero-whole'
        ? t(
            '这个等式只会给出零整体；部分占零整体的百分比无法用部分除整体定义。请换正的已知量。',
            'The equation gives only a zero whole. A part-to-zero-whole percentage cannot be defined by dividing the part by the whole. Choose a positive known amount.',
          )
        : t(
            '正的已知升数不可能对应 0%；条件矛盾，不能除以零。',
            'A positive known amount cannot correspond to 0%. These conditions conflict; do not divide by zero.',
          );
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '已知量对应的是给定百分数，不一定是 100%。先找 1% 再找整体，最后乘回原百分数检查。不要把已知部分直接当整体相乘。',
            'The known amount corresponds to the given percentage, which need not be 100%. Find 1%, then the whole, and multiply back to check. Do not treat the known part as the whole.',
          )}
        />
      </p>
      <Slider
        label={t('已知部分（L）', 'Known part (L)')}
        value={part}
        max={60}
        mode={mode}
        change={(v) => {
          setPart(v);
          setStage(0);
        }}
      />
      <Slider
        label={t('已知部分对应百分数', 'Known percentage')}
        value={rate}
        max={150}
        mode={mode}
        change={(v) => {
          setRate(v);
          setStage(0);
        }}
      />
      {invalid ? (
        <p role="status">
          <Text mode={mode} text={warning} />
        </p>
      ) : (
        <>
          <PercentAxis
            rate={rate}
            wholeLabel="? L"
            partLabel={`${part} L`}
            mode={mode}
          />
          {stage === 0 && (
            <Check
              mode={mode}
              label={t(
                '我已找到 1%，核对单位份',
                'I found 1%; check one percent',
              )}
              click={() => setStage(1)}
            />
          )}
          {stage >= 1 && (
            <p>
              <Text
                mode={mode}
                text={t(
                  `1% 对应 ${part}÷${rate}=${ratioText(m.one)} L。`,
                  `1% corresponds to ${part}÷${rate}=${ratioText(m.one)} L.`,
                )}
              />
            </p>
          )}
          {stage === 1 && (
            <Check
              mode={mode}
              label={t(
                '我已找回 100%，核对整体',
                'I recovered 100%; check the whole',
              )}
              click={() => setStage(2)}
            />
          )}
          {stage === 2 && (
            <p role="status">
              <Text
                mode={mode}
                text={t(
                  `整体为 ${part}÷(${rate}/100)=${ratioText(m.whole)} L；核回 ${ratioText(m.whole)}×${rate}/100=${part} L。100% 的参照是这个整体。`,
                  `The whole is ${part}÷(${rate}/100)=${ratioText(m.whole)} L. Check ${ratioText(m.whole)}×${rate}/100=${part} L. This recovered whole is the 100% reference.`,
                )}
              />
            </p>
          )}
        </>
      )}
    </>
  );
}
function Change({ mode }: { mode: LanguageMode }) {
  const [cents, setCents] = useState(8000),
    [rate, setRate] = useState(20),
    [direction, setDirection] = useState<'discount' | 'increase'>('discount'),
    [stage, setStage] = useState(0);
  const first = priceChange(cents, rate, direction),
    second = priceChange(
      first.next,
      rate,
      direction === 'discount' ? 'increase' : 'discount',
    );
  const reset = () => setStage(0);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '以下是假想价格，没有税费、运费或额外优惠。先把原价标为 100%，分清减少/增加的钱与变化后价格；再以新价格为 100% 反向变化同样百分数。',
            'These are fictional prices with no tax, delivery or extra offers. Mark the original price as 100%, distinguish the change from the final price, then use the new price as 100% for the same rate in the opposite direction.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('原价', 'Original price')} />
        <select
          aria-label={word(mode, t('原价', 'Original price'))}
          value={cents}
          onChange={(e) => {
            setCents(Number(e.target.value));
            reset();
          }}
        >
          {[2000, 4000, 8000, 10000].map((n) => (
            <option key={n} value={n}>
              {moneyText(n)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <Text mode={mode} text={t('变化方向', 'Change direction')} />
        <select
          aria-label={word(mode, t('变化方向', 'Change direction'))}
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value as typeof direction);
            reset();
          }}
        >
          <option value="discount">{word(mode, t('降价', 'Discount'))}</option>
          <option value="increase">{word(mode, t('涨价', 'Increase'))}</option>
        </select>
      </label>
      <Slider
        label={t('变化率（%）', 'Change rate (%)')}
        value={rate}
        max={100}
        step={5}
        mode={mode}
        change={(v) => {
          setRate(v);
          reset();
        }}
      />
      <div
        className="math-percent-price"
        aria-label={word(mode, t('价格参照', 'Price references'))}
      >
        <span>
          <Text mode={mode} text={t('第一步的 100%', 'Step 1: 100%')} />
          <strong>{moneyText(cents)}</strong>
        </span>
        <span>
          <Text
            mode={mode}
            text={t(
              direction === 'discount' ? '保留原价的' : '相当于原价的',
              'New price as a percentage of original',
            )}
          />
          <strong>{direction === 'discount' ? 100 - rate : 100 + rate}%</strong>
        </span>
      </div>
      {stage === 0 && (
        <Check
          mode={mode}
          label={t(
            '我已区分钱与价格，核对变化',
            'I separated change and price; check',
          )}
          click={() => setStage(1)}
        />
      )}
      {stage >= 1 && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `原价 ${moneyText(cents)} 的 ${rate}% 为 ${moneyText(first.change)}；${direction === 'discount' ? '减去' : '加上'}这笔钱，得到 ${moneyText(first.next)}。`,
              `${rate}% of ${moneyText(cents)} is ${moneyText(first.change)}. ${direction === 'discount' ? 'Subtract' : 'Add'} this change to get ${moneyText(first.next)}.`,
            )}
          />
        </p>
      )}
      {stage === 1 && (
        <Check
          mode={mode}
          label={t(
            '以新价为整体，反向变化同一百分数',
            'Use the new base; reverse the same rate',
          )}
          click={() => setStage(2)}
        />
      )}
      {stage === 2 && (
        <div className="math-percent-result">
          {first.next === 0 && (
            <p>
              <Text
                mode={mode}
                text={t(
                  '第一步价格降到零。零乘任何有限倍仍为零，无法定义以零为分母的相对涨幅，不能靠有限百分比恢复正价格。',
                  'The first step reaches a zero price. Zero times any finite multiplier remains zero. Relative growth with zero as denominator is undefined; a finite percentage cannot restore a positive price.',
                )}
              />
            </p>
          )}
          <p>
            <Text
              mode={mode}
              text={t(
                `第二步的 100% 是 ${moneyText(first.next)}，不再是 ${moneyText(cents)}。它的 ${rate}% 为 ${moneyText(second.change)}，反向变化后为 ${moneyText(second.next)}。`,
                `Step 2 uses ${moneyText(first.next)} as 100%, replacing ${moneyText(cents)}. Its ${rate}% is ${moneyText(second.change)}, giving ${moneyText(second.next)} after the opposite change.`,
              )}
            />
          </p>
          <p>
            <Text
              mode={mode}
              text={t(
                rate === 0
                  ? '变化率零，两步都不改变价格。'
                  : '相同百分数的参照整体改变，通常不会回到原价。涨价百分比以原价作分母；两个百分率相差多少“百分点”是另一个问题。',
                rate === 0
                  ? 'A zero rate changes neither price.'
                  : 'The same percentage acts on a different base, so it generally does not restore the original price. Relative price change divides by the original price. A difference in percentage points asks a different question.',
              )}
            />
          </p>
        </div>
      )}
    </>
  );
}
export function PercentLab({
  kind,
  mode,
}: {
  kind: PercentLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-percent-lab">
      <span className="math-eyebrow">
        <Text
          mode={mode}
          text={t(
            '动手数学 · 先找 100%',
            'HANDS-ON MATHS · IDENTIFY 100% FIRST',
          )}
        />
      </span>
      {kind === 'percent-hundred' ? (
        <Hundred mode={mode} />
      ) : kind === 'percent-decimal' ? (
        <Decimal mode={mode} />
      ) : kind === 'percent-fraction' ? (
        <Fraction mode={mode} />
      ) : kind === 'percent-amount' ? (
        <Amount mode={mode} />
      ) : kind === 'percent-whole' ? (
        <Whole mode={mode} />
      ) : (
        <Change mode={mode} />
      )}
    </section>
  );
}
export function PercentHookArt({
  kind,
  mode,
}: {
  kind: PercentLabKind;
  mode: LanguageMode;
}) {
  return kind === 'percent-whole' ? (
    <PercentAxis rate={30} wholeLabel="? L" partLabel="18 L" mode={mode} />
  ) : kind === 'percent-amount' ? (
    <PercentAxis rate={35} wholeLabel="80 L" partLabel="? L" mode={mode} />
  ) : kind === 'percent-change' ? (
    <p>
      <Text
        mode={mode}
        text={t(
          '原价 → 降 20% → 新价 → 涨 20%：第二次的 100% 是谁？',
          'Original → 20% off → new price → 20% up: which amount is 100% the second time?',
        )}
      />
    </p>
  ) : (
    <PercentGrid
      value={kind === 'percent-hundred' ? { n: 1, d: 4 } : { n: 3, d: 8 }}
      mode={mode}
    />
  );
}
