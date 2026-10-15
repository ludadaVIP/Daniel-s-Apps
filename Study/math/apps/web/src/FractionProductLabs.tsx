import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import {
  repeatFraction,
  areaProduct,
  partOfAmount,
  shareFraction,
  fractionQuotient,
  fractionText,
} from './fractionProductModels';
import type { FractionValue as F } from './fractionModels';
import {
  RepeatedFraction,
  ProductArea,
  SharedFraction,
  GroupedMeasure,
  ProductFrame,
} from './FractionProductVisuals';
export type FractionProductLabKind = Extract<
  Lesson['lab'],
  `product-${string}`
>;
export const isFractionProductLab = (
  kind: Lesson['lab'],
): kind is FractionProductLabKind => kind.startsWith('product-');
const word = (mode: LanguageMode, copy: LocalizedText) =>
  mode === 'en' ? copy.en : copy.zh;
function Range({
  label,
  value,
  max,
  min = 0,
  mode,
  change,
}: {
  label: LocalizedText;
  value: number;
  max: number;
  min?: number;
  mode: LanguageMode;
  change: (v: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        aria-label={word(mode, label)}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Factor({
  prefix,
  value,
  maximum = 2,
  mode,
  change,
}: {
  prefix: LocalizedText;
  value: F;
  maximum?: number;
  mode: LanguageMode;
  change: (v: F) => void;
}) {
  return (
    <fieldset className="math-product-factor">
      <legend>
        <Text mode={mode} text={prefix} />: {value.n}/{value.d}
      </legend>
      <label>
        <Text
          mode={mode}
          text={t('等分数（分母）', 'Equal parts (denominator)')}
        />
        <select
          aria-label={`${word(mode, prefix)} ${mode === 'en' ? 'denominator' : '分母'}`}
          value={value.d}
          onChange={(e) => {
            const d = Number(e.target.value);
            change({ n: Math.min(value.n, maximum * d), d });
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <Range
        label={t(`${prefix.zh}分子`, `${prefix.en} numerator`)}
        mode={mode}
        value={value.n}
        max={maximum * value.d}
        change={(n) => change({ ...value, n })}
      />
    </fieldset>
  );
}
function Repeat({ mode }: { mode: LanguageMode }) {
  const [count, setCount] = useState(3),
    [part, setPart] = useState<F>({ n: 3, d: 4 }),
    [reveal, setReveal] = useState(false);
  const m = repeatFraction(count, part);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测同样的分数升重复加入几次。一个粗框始终是一升，不会把所有分数条合在一起重新当作一。',
            'Predict repeated additions of the same fractional litres. One thick frame always represents one litre; combining strips does not redefine the whole.',
          )}
        />
      </p>
      <Range
        label={t('重复组数', 'Number of groups')}
        value={count}
        max={6}
        mode={mode}
        change={(v) => {
          setCount(v);
          setReveal(false);
        }}
      />
      <Factor
        prefix={t('每组分数', 'Fraction per group')}
        value={part}
        mode={mode}
        change={(v) => {
          setPart(v);
          setReveal(false);
        }}
      />
      <RepeatedFraction count={count} part={part} mode={mode} />
      <button className="math-button" onClick={() => setReveal(true)}>
        <Text
          mode={mode}
          text={t(
            '我已合并，核对总量',
            'I combined the groups; check the total',
          )}
        />
      </button>
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `${count} 组各 ${part.n}/${part.d} L，${count}×${part.n}/${part.d}=${m.raw.n}/${m.raw.d}=${fractionText(m.result)} L。分母标记同一升的等份大小。`,
              `${count} groups of ${part.n}/${part.d} L give ${count}×${part.n}/${part.d}=${m.raw.n}/${m.raw.d}=${fractionText(m.result)} L. The denominator keeps the same one-litre reference parts.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Area({ mode }: { mode: LanguageMode }) {
  const [left, setLeft] = useState<F>({ n: 2, d: 3 }),
    [right, setRight] = useState<F>({ n: 3, d: 4 }),
    [reveal, setReveal] = useState(false);
  const m = areaProduct(left, right);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测两种选取的交叠占原整体多少。把因数改到超过一时，原来一的粗框保持不变，画面向旁边或下方扩展。',
            'Predict the overlap as a fraction of the original whole. When a factor exceeds one, the original unit frame stays fixed and the drawing extends sideways or downwards.',
          )}
        />
      </p>
      <div className="math-product-controls">
        <Factor
          prefix={t('横向因数', 'Horizontal factor')}
          value={left}
          mode={mode}
          change={(v) => {
            setLeft(v);
            setReveal(false);
          }}
        />
        <Factor
          prefix={t('纵向因数', 'Vertical factor')}
          value={right}
          mode={mode}
          change={(v) => {
            setRight(v);
            setReveal(false);
          }}
        />
      </div>
      <ProductArea left={left} right={right} mode={mode} />
      <button className="math-button" onClick={() => setReveal(true)}>
        <Text
          mode={mode}
          text={t(
            '我已数交叠，核对乘积',
            'I counted the overlap; check the product',
          )}
        />
      </button>
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `一个原整体含 ${m.cellsPerWhole} 个同面积小格，交叠 ${m.raw.n} 格；${left.n}/${left.d}×${right.n}/${right.d}=${m.raw.n}/${m.raw.d}=${fractionText(m.result)}。图中较大外框不是新的整体。`,
              `One original whole contains ${m.cellsPerWhole} equal-area cells; ${m.raw.n} overlap. ${left.n}/${left.d}×${right.n}/${right.d}=${m.raw.n}/${m.raw.d}=${fractionText(m.result)}. The enlarged outer drawing is not a new whole.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Amount({ mode }: { mode: LanguageMode }) {
  const [amount, setAmount] = useState(12),
    [part, setPart] = useState<F>({ n: 2, d: 3 }),
    [reveal, setReveal] = useState(false);
  const m = partOfAmount(amount, part);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '这里整条代表题给的总升数，不是每条一升。先把总量按分母平均分，再选分子份；水允许分数升，精确余量保留。',
            'Here the entire bar represents the stated total litres, not one litre. Divide the amount into denominator-many equal shares, then choose numerator-many. Water can be measured in fractional litres; retain exact amounts.',
          )}
        />
      </p>
      <Range
        label={t('总水量（L）', 'Total water (L)')}
        value={amount}
        max={24}
        min={1}
        mode={mode}
        change={(v) => {
          setAmount(v);
          setReveal(false);
        }}
      />
      <Factor
        prefix={t('所取分数', 'Fraction selected')}
        value={part}
        maximum={1}
        mode={mode}
        change={(v) => {
          setPart(v);
          setReveal(false);
        }}
      />
      <ProductFrame
        mode={mode}
        caption={t(
          `整条明确代表 ${amount} L，分成 ${part.d} 等份；每一份的实际升数由总量决定。`,
          `The complete bar explicitly represents ${amount} L in ${part.d} equal shares. Each share’s actual litres depend on this total.`,
        )}
      >
        <svg
          className="math-product-svg"
          viewBox="0 0 430 130"
          style={{ minWidth: 430, height: 130 }}
          role="img"
          aria-label={
            mode === 'en'
              ? `A total of ${amount} L partitioned into ${part.d} equal parts; select ${part.n} parts.`
              : `总量 ${amount} L 分为 ${part.d} 等份，取 ${part.n} 份。`
          }
        >
          {Array.from({ length: part.d }, (_, i) => (
            <rect
              data-amount-part={i}
              className={i < part.n ? 'product-selected' : 'product-empty'}
              key={i}
              x={40 + (i * 350) / part.d}
              y="25"
              width={350 / part.d}
              height="40"
            />
          ))}
          <text x="40" y="108">
            {mode === 'en' ? 'Whole bar' : '整条'} = {amount} L
          </text>
        </svg>
      </ProductFrame>
      <button className="math-button" onClick={() => setReveal(true)}>
        <Text
          mode={mode}
          text={t(
            '我已分份，核对所取量',
            'I divided into shares; check the selected amount',
          )}
        />
      </button>
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `每份 ${amount}÷${part.d}=${fractionText(m.each)} L，取 ${part.n} 份：${amount}×${part.n}/${part.d}=${fractionText(m.result)} L。分数没有升单位，结果保留升。`,
              `Each share is ${amount}÷${part.d}=${fractionText(m.each)} L; take ${part.n} shares: ${amount}×${part.n}/${part.d}=${fractionText(m.result)} L. The fraction is dimensionless; the result keeps litres.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Share({ mode }: { mode: LanguageMode }) {
  const [amount, setAmount] = useState<F>({ n: 3, d: 4 }),
    [people, setPeople] = useState(2),
    [stage, setStage] = useState(0);
  const m = shareFraction(amount, people);
  const labels = [
    t('先细分原来的每小份', 'Subdivide every original part'),
    t('按人数分配颜色', 'Allocate colours to the people'),
    t('我已分好，核对每人量', 'I shared it; check each person’s amount'),
  ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '把已有的分数升水平均分给同样多的人。先预测每人比总量大还是小；保持总水量与一升标尺不变，只细分并分配颜色。',
            'Share a fractional amount of water equally. Predict whether each share is larger or smaller than the total. Keep total water and the one-litre reference fixed; only subdivide and allocate colours.',
          )}
        />
      </p>
      <Factor
        prefix={t('总水量分数', 'Total-water fraction')}
        value={amount}
        mode={mode}
        change={(v) => {
          setAmount(v);
          setStage(0);
        }}
      />
      <Range
        label={t('平均分给几人', 'People sharing')}
        value={people}
        min={1}
        max={6}
        mode={mode}
        change={(v) => {
          setPeople(v);
          setStage(0);
        }}
      />
      <SharedFraction
        amount={amount}
        people={people}
        stage={stage}
        mode={mode}
      />
      {stage >= 2 && (
        <div className="math-product-legend">
          {Array.from({ length: people }, (_, i) => (
            <span key={i}>
              <i className={`product-owner owner-${i}`} />
              <Text mode={mode} text={t(`第 ${i + 1} 人`, `Person ${i + 1}`)} />
            </span>
          ))}
        </div>
      )}
      {stage < 3 && (
        <button className="math-button" onClick={() => setStage(stage + 1)}>
          <Text mode={mode} text={labels[stage]!} />
        </button>
      )}
      {stage === 3 && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `原来的每个 1/${amount.d} L 再分 ${people} 份，得到 1/${m.denominator} L 小份。每人 ${m.perPerson} 小份，即 ${amount.n}/${amount.d}÷${people}=${fractionText(m.result)} L。所有人的份额合起来恢复 ${amount.n}/${amount.d} L。`,
              `Each original 1/${amount.d} L part is divided into ${people}, making 1/${m.denominator} L pieces. Each person gets ${m.perPerson} pieces: ${amount.n}/${amount.d}÷${people}=${fractionText(m.result)} L. All shares together restore ${amount.n}/${amount.d} L.`,
            )}
          />
        </p>
      )}
    </>
  );
}
const readF = (raw: string): F => {
  const [n, d] = raw.split('/').map(Number);
  return { n: n!, d: d! };
};
function Divide({
  mode,
  fractional,
}: {
  mode: LanguageMode;
  fractional: boolean;
}) {
  const amounts = fractional
    ? ['3/4', '2/3', '1/2', '5/4', '0/1']
    : ['2/1', '1/1', '3/1', '0/1'];
  const [raw, setRaw] = useState(amounts[0]!),
    [divisor, setDivisor] = useState(fractional ? '2/3' : '3/4'),
    [stage, setStage] = useState(0),
    [candidate, setCandidate] = useState(''),
    [feedback, setFeedback] = useState<LocalizedText | null>(null);
  const amount = readF(raw),
    group = readF(divisor),
    m = group.n ? fractionQuotient(amount, group) : null;
  const reset = () => {
    setStage(0);
    setCandidate('');
    setFeedback(null);
  };
  const reciprocalOptions = [
    ...new Set([`${group.n}/${group.d}`, `${group.d}/${group.n}`, '1/1']),
  ];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '“除以每份的量”是在问总量中含有多少份。先把两种升数改写成同样小份，再比较小份个数；不足一整份的部分也保留，不能把商一律取整。',
            'Dividing by a group size asks how many such groups fit in the total. Express both litre amounts in identical small pieces, then compare piece counts. Keep an incomplete group rather than rounding every quotient to a whole number.',
          )}
        />
      </p>
      <div className="math-product-controls">
        <label>
          <Text mode={mode} text={t('已有水量（L）', 'Water available (L)')} />
          <select
            aria-label={word(mode, t('已有水量', 'Water available'))}
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              reset();
            }}
          >
            {amounts.map((s) => (
              <option key={s} value={s}>
                {s} L
              </option>
            ))}
          </select>
        </label>
        <label>
          <Text mode={mode} text={t('每份水量（L）', 'Water per group (L)')} />
          <select
            aria-label={word(mode, t('每份水量', 'Water per group'))}
            value={divisor}
            onChange={(e) => {
              setDivisor(e.target.value);
              reset();
            }}
          >
            {['1/2', '2/3', '3/4', '3/2', '0/1'].map((s) => (
              <option key={s} value={s}>
                {s} L
              </option>
            ))}
          </select>
        </label>
      </div>
      {!m ? (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '每份零升不能确定要多少份，不能除以零；零也没有乘法倒数。请选正的每份量。',
              'Zero litres per group cannot determine a group count. Division by zero is undefined, and zero has no multiplicative reciprocal. Choose a positive group size.',
            )}
          />
        </p>
      ) : (
        <>
          <GroupedMeasure amount={amount} group={group} mode={mode} />
          {stage === 0 && (
            <button className="math-button" onClick={() => setStage(1)}>
              <Text
                mode={mode}
                text={t(
                  '我已写出同样小份，核对分割',
                  'I wrote equal small pieces; check the partition',
                )}
              />
            </button>
          )}
          {stage >= 1 && (
            <p>
              <Text
                mode={mode}
                text={t(
                  `共同小份为 1/${m.denominator} L；总量 ${m.total} 小份，一份目标量 ${m.perGroup} 小份。比较的两种小份单位完全相同。`,
                  `A common piece is 1/${m.denominator} L: ${m.total} pieces available and ${m.perGroup} pieces per target group. Both piece counts use exactly the same unit.`,
                )}
              />
            </p>
          )}
          {stage === 1 && (
            <button className="math-button" onClick={() => setStage(2)}>
              <Text
                mode={mode}
                text={t(
                  '我已比较小份数，核对商',
                  'I compared piece counts; check the quotient',
                )}
              />
            </button>
          )}
          {stage >= 2 && (
            <p role="status">
              <Text
                mode={mode}
                text={t(
                  `精确商 ${m.total}/${m.perGroup}=${fractionText(m.result)} 份；可装满 ${m.fullGroups} 份，剩 ${fractionText(m.remainder)} L，这部分占一份的 ${fractionText(m.fractionOfGroup)}。份数与剩余升数不能混写。`,
                  `Exact quotient ${m.total}/${m.perGroup}=${fractionText(m.result)} groups; ${m.fullGroups} complete ${m.fullGroups === 1 ? 'group' : 'groups'}, with ${fractionText(m.remainder)} L left, equal to ${fractionText(m.fractionOfGroup)} of one group. Group count and remaining litres are different quantities.`,
                )}
              />
            </p>
          )}
          {fractional && stage >= 2 && (
            <>
              <label>
                <Text
                  mode={mode}
                  text={t(
                    '除数的倒数是什么？',
                    'What is the divisor’s reciprocal?',
                  )}
                />
                <select
                  aria-label={word(
                    mode,
                    t('选择倒数', 'Choose the reciprocal'),
                  )}
                  value={candidate}
                  onChange={(e) => {
                    setCandidate(e.target.value);
                    setFeedback(null);
                  }}
                >
                  <option value="">
                    {word(mode, t('先选择', 'Choose first'))}
                  </option>
                  {reciprocalOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="math-button"
                disabled={!candidate}
                onClick={() =>
                  setFeedback(
                    candidate === `${group.d}/${group.n}`
                      ? t(
                          `${group.n}/${group.d}×${group.d}/${group.n}=1，因此总量乘 ${group.d}/${group.n}。${amount.n}/${amount.d}×${group.d}/${group.n}=${fractionText(m.result)}，与同小份比较相符。`,
                          `Since ${group.n}/${group.d}×${group.d}/${group.n}=1, multiply the dividend by ${group.d}/${group.n}. ${amount.n}/${amount.d}×${group.d}/${group.n}=${fractionText(m.result)}, matching the common-piece comparison.`,
                        )
                      : t(
                          '倒数要与原除数相乘得一；翻转的是除数，不是总量。',
                          'A reciprocal multiplies the original divisor to make one. Invert the divisor, not the dividend.',
                        ),
                  )
                }
              >
                <Text
                  mode={mode}
                  text={t('核对倒数的理由', 'Check the reciprocal reasoning')}
                />
              </button>
              {feedback && (
                <p role="status">
                  <Text mode={mode} text={feedback} />
                </p>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
export function FractionProductLab({
  kind,
  mode,
}: {
  kind: FractionProductLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-product-lab">
      <span className="math-eyebrow">
        <Text
          mode={mode}
          text={t(
            '动手数学 · 同一整体，解释乘除',
            'HANDS-ON MATHS · ONE REFERENCE, EXPLAIN MULTIPLICATION AND DIVISION',
          )}
        />
      </span>
      {kind === 'product-repeat' ? (
        <Repeat mode={mode} />
      ) : kind === 'product-area' ? (
        <Area mode={mode} />
      ) : kind === 'product-amount' ? (
        <Amount mode={mode} />
      ) : kind === 'product-share' ? (
        <Share mode={mode} />
      ) : (
        <Divide mode={mode} fractional={kind === 'product-fraction-divide'} />
      )}
    </section>
  );
}
export function FractionProductHookArt({
  kind,
  mode,
}: {
  kind: FractionProductLabKind;
  mode: LanguageMode;
}) {
  return kind === 'product-repeat' ? (
    <RepeatedFraction count={3} part={{ n: 3, d: 4 }} mode={mode} />
  ) : kind === 'product-area' ? (
    <ProductArea left={{ n: 2, d: 3 }} right={{ n: 3, d: 4 }} mode={mode} />
  ) : kind === 'product-share' ? (
    <SharedFraction amount={{ n: 3, d: 4 }} people={2} mode={mode} />
  ) : kind === 'product-amount' ? (
    <p>
      <Text
        mode={mode}
        text={t(
          '整条是 12 L，取 2/3；“一”是十二升还是一升？',
          'The full bar is 12 L; select 2/3. Does the whole mean twelve litres or one litre?',
        )}
      />
    </p>
  ) : (
    <GroupedMeasure
      amount={kind === 'product-whole-divide' ? { n: 2, d: 1 } : { n: 3, d: 4 }}
      group={kind === 'product-whole-divide' ? { n: 3, d: 4 } : { n: 2, d: 3 }}
      mode={mode}
    />
  );
}
