import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text, Fraction } from './ui';
import { FractionBars, FractionStrip } from './FractionVisuals';
import {
  fractionKind,
  mixedFraction,
  refineFraction,
  commonFractionFactors,
  divideFraction,
  simplifyFraction,
  commonDenominator,
  compareFractions,
  type FractionValue,
} from './fractionModels';
export type FractionLabKind =
  | 'fraction-whole'
  | 'fraction-kind'
  | 'fraction-mixed'
  | 'fraction-equivalent'
  | 'fraction-simplify'
  | 'fraction-compare';
export const isFractionLab = (kind: Lesson['lab']): kind is FractionLabKind =>
  [
    'fraction-whole',
    'fraction-kind',
    'fraction-mixed',
    'fraction-equivalent',
    'fraction-simplify',
    'fraction-compare',
  ].includes(kind);
function Counter({
  label,
  mode,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: LocalizedText;
  mode: LanguageMode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        aria-label={mode === 'en' ? label.en : label.zh}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Amount({ value }: { value: FractionValue }) {
  return value.d === 1 ? (
    <span>{value.n}</span>
  ) : (
    <Fraction n={value.n} d={value.d} />
  );
}
function UnitWhole({ mode }: { mode: LanguageMode }) {
  const [whole, setWhole] = useState(12),
    [d, setD] = useState(4),
    part = simplifyFraction({ n: whole, d });
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先猜：整体长度减半，但仍取 1/4，实际长度会怎样？固定灰色标尺，只改变整体与每整体等份数。',
            'Predict: if whole length halves but you still take 1/4, what happens to actual length? Keep the grey scale fixed while changing the whole and its equal-part count.',
          )}
        />
      </p>
      <div className="math-fraction-readout">
        <Fraction n={1} d={d} />
        <span>× {whole} m =</span>
        <Amount value={part} />
        <span>m</span>
      </div>
      <Counter
        label={t('整体长度（米）', 'Whole length (metres)')}
        mode={mode}
        min={6}
        max={18}
        step={6}
        value={whole}
        onChange={setWhole}
      />
      <Counter
        label={t('每整体等份数', 'Equal parts per whole')}
        mode={mode}
        min={2}
        max={8}
        value={d}
        onChange={setD}
      />
      <div
        className="math-fraction-length-track"
        role="img"
        aria-label={
          mode === 'en'
            ? `Fixed track represents eighteen metres; whole ${whole} metres, one of ${d} equal parts is ${part.n}/${part.d} metres`
            : `固定轨道为十八米；整体 ${whole} 米，${d} 等份的一份为 ${part.n}/${part.d} 米`
        }
      >
        <div style={{ width: `${(whole / 18) * 100}%` }}>
          <FractionStrip value={{ n: 1, d }} mode={mode} />
        </div>
      </div>
      <div className="math-row math-muted">
        <span>0 m</span>
        <span>18 m</span>
      </div>
      <p className="math-hint">
        <Text
          mode={mode}
          text={t(
            `整个灰色轨道表示 18 米，分割轮廓表示这根 ${whole} 米绳子；只涂一小份，比例为 1/${d}。改变整体时，不可把相同分数当成相同实际长度。`,
            `The grey track represents eighteen metres, and the partitioned outline is this ${whole}-metre rope. One part is shaded, a fraction 1/${d}. A changed whole can change actual length even when the fraction stays fixed.`,
          )}
        />
      </p>
    </>
  );
}
function Parts({
  mode,
  conversion,
}: {
  mode: LanguageMode;
  conversion: boolean;
}) {
  const [n, setN] = useState(conversion ? 11 : 7),
    [d, setD] = useState(4),
    value = { n, d },
    m = mixedFraction(value),
    classification = fractionKind(value);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            conversion
              ? t(
                  '先按小份计数，再按完整整体与余下小份计数。改变记法不会改变涂色总量。',
                  'Count small parts first, then complete wholes and leftover parts. Changing notation does not change shading.',
                )
              : t(
                  '先预测它小于、等于还是大于一。分母说明每个整体要几份，分子数选了多少份；所有整条都一样大。',
                  'Predict whether the amount is below, equal to or above one. The denominator counts parts per whole; the numerator counts selected parts. Every complete strip is the same size.',
                )
          }
        />
      </p>
      <div className="math-fraction-readout">
        <Fraction n={n} d={d} />
        {conversion && (
          <>
            <span>=</span>
            {(m.whole > 0 || m.n === 0) && <span>{m.whole}</span>}
            {m.n > 0 && (
              <>
                {m.whole > 0 && <span>+</span>}
                <Fraction n={m.n} d={m.d} />
              </>
            )}
          </>
        )}
      </div>
      <Counter
        label={t('小份总数（分子）', 'Total part count (numerator)')}
        mode={mode}
        min={0}
        max={18}
        value={n}
        onChange={setN}
      />
      <Counter
        label={t('每整体等份数（分母）', 'Parts per whole (denominator)')}
        mode={mode}
        min={2}
        max={8}
        value={d}
        onChange={setD}
      />
      <FractionBars value={value} mode={mode} showValue={false} />
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            '滑杆改变份数或每份单位，会改变数值；同一组设置下的两种记法才是同一个数量。',
            'The sliders change the part count or unit and therefore the value. The two notations for one set of settings describe the same amount.',
          )}
        />
      </p>
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            conversion
              ? t(
                  `${n}=${m.whole}×${d}+${m.n}，完整整体 ${m.whole} 个，余下 ${m.n} 个 ${d} 分之一。${m.n ? (m.whole ? '带分数的空格表示加上分数部分。' : '不足一个整体，直接写真分数，不加前导零整数部分。') : '没有余下小份，直接写整数。'}`,
                  `${n}=${m.whole}×${d}+${m.n}: ${m.whole} complete wholes and ${m.n} parts of 1/${d} remain. ${m.n ? (m.whole ? 'The space in a mixed number means adding the fractional part.' : 'Below one whole: keep a proper fraction without a leading zero whole part.') : 'There is no remainder; write an integer.'}`,
                )
              : classification === 'zero'
                ? t(
                    '零：没有涂色。这里的正分数分类先不使用零。',
                    'Zero: no shading. The positive-fraction classifications here do not use zero.',
                  )
                : classification === 'proper'
                  ? t(
                      `${n}<${d}，还不足一个整体：真分数。`,
                      `${n}<${d}: less than a whole, a proper fraction.`,
                    )
                  : t(
                      `${n}≥${d}，至少一个整体：假分数。${n === d ? '这里恰好等于 1。' : ''}`,
                      `${n}≥${d}: at least one whole, an improper fraction. ${n === d ? 'Here it equals exactly one.' : ''}`,
                    )
          }
        />
      </p>
      <div className="math-lab-presets">
        {[
          [3, 4],
          [4, 4],
          [7, 4],
          [13, 6],
          [8, 4],
        ].map(([num, den]) => (
          <button
            className="math-button secondary"
            key={`${num}-${den}`}
            onClick={() => {
              setN(num!);
              setD(den!);
            }}
          >
            {num}/{den}
          </button>
        ))}
      </div>
      {conversion && (
        <div className="math-expanded-form">
          <Text mode={mode} text={t('反向检查', 'Convert back to check')} />
          <strong>
            {m.whole} × {d} + {m.n} = {n}
          </strong>
          <p>
            <Text
              mode={mode}
              text={t(
                '先把完整整体换成同样的小份，再加余下份数。分母一直说明小份的单位。',
                'Convert complete wholes to the same small parts, then add the remainder. The denominator keeps identifying their unit.',
              )}
            />
          </p>
        </div>
      )}
    </>
  );
}
function Equivalent({ mode }: { mode: LanguageMode }) {
  const [base, setBase] = useState<FractionValue>({ n: 2, d: 3 }),
    [factor, setFactor] = useState(2),
    [overlay, setOverlay] = useState(false),
    fine = refineFraction(base, factor);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测细分后会有几个涂色小份。整体和涂色量固定，每一份都分成同样数量的小份。',
            'Predict the new shaded-part count. Keep the whole and amount fixed; split every original part into the same number of smaller parts.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {[
          { n: 1, d: 2 },
          { n: 2, d: 3 },
          { n: 3, d: 5 },
        ].map((v) => (
          <button
            className="math-button secondary"
            key={v.d}
            onClick={() => {
              setBase(v);
              setOverlay(false);
            }}
          >
            {v.n}/{v.d}
          </button>
        ))}
      </div>
      <Counter
        label={t('每一份细分成几份', 'Refinement factor')}
        mode={mode}
        min={1}
        max={4}
        value={factor}
        onChange={(n) => {
          setFactor(n);
          setOverlay(false);
        }}
      />
      <div className="math-fraction-readout">
        <Fraction n={base.n} d={base.d} />
        <span>=</span>
        <Fraction n={fine.n} d={fine.d} />
      </div>
      <FractionBars
        value={base}
        mode={mode}
        label={t('原来单位', 'Original units')}
      />
      <FractionBars
        value={fine}
        mode={mode}
        label={t('细分单位', 'Finer units')}
      />
      <button
        className="math-button secondary"
        aria-expanded={overlay}
        onClick={() => setOverlay(!overlay)}
      >
        <Text
          mode={mode}
          text={
            overlay
              ? t('收起重合检查', 'Hide overlay')
              : t('我已预测，重合检查', 'I predicted; overlay the strips')
          }
        />
      </button>
      {overlay && (
        <div className="math-fraction-overlay">
          <FractionStrip value={base} refinedDenominator={fine.d} mode={mode} />
          <p className="math-muted">
            <Text
              mode={mode}
              text={t(
                '粗线是原分割，细线是新分割；同一涂色区域的端点保持不动。',
                'Thick lines are original cuts and fine lines are refined cuts. The shaded region retains its endpoint.',
              )}
            />
          </p>
        </div>
      )}
      <p className="math-hint">
        <Text
          mode={mode}
          text={t(
            `分子 ${base.n}×${factor}=${fine.n}，分母 ${base.d}×${factor}=${fine.d}。这是同一次等分，不能只改变分母。`,
            `Numerator ${base.n}×${factor}=${fine.n}; denominator ${base.d}×${factor}=${fine.d}. This is one shared repartitioning, not a change to only the denominator.`,
          )}
        />
      </p>
    </>
  );
}
function Simplify({ mode }: { mode: LanguageMode }) {
  const [original, setOriginal] = useState<FractionValue>({ n: 12, d: 18 }),
    [value, setValue] = useState<FractionValue>({ n: 12, d: 18 }),
    [history, setHistory] = useState<string[]>([]),
    factors = commonFractionFactors(value);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先找一个共同因数，预测分组后两数怎样变。可以分几次约分；每次都要检查数量保持、两数同除以及是否已经最简。',
            'Find a common factor and predict the regrouped numbers. Simplify in several steps if useful; check unchanged value, common division and whether the result is simplest.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {[
          { n: 12, d: 18 },
          { n: 8, d: 12 },
          { n: 15, d: 20 },
          { n: 7, d: 12 },
          { n: 18, d: 18 },
        ].map((v) => (
          <button
            key={v.n + '-' + v.d}
            className="math-button secondary"
            onClick={() => {
              setOriginal(v);
              setValue(v);
              setHistory([]);
            }}
          >
            {v.n}/{v.d}
          </button>
        ))}
      </div>
      <div className="math-fraction-readout">
        <Fraction n={original.n} d={original.d} />
        <span>=</span>
        <Fraction n={value.n} d={value.d} />
      </div>
      <FractionBars
        value={original}
        mode={mode}
        label={t('原分组', 'Original groups')}
      />
      <FractionBars
        value={value}
        mode={mode}
        label={t('当前分组', 'Current groups')}
      />
      <div className="math-lab-presets">
        {factors.map((factor) => (
          <button
            key={factor}
            className="math-button secondary"
            onClick={() => {
              const next = divideFraction(value, factor);
              setHistory((old) => [
                ...old,
                `(${value.n} ÷ ${factor}) / (${value.d} ÷ ${factor}) = ${next.n}/${next.d}`,
              ]);
              setValue(next);
            }}
          >
            <Text
              mode={mode}
              text={t(`分子分母同除以 ${factor}`, `Divide both by ${factor}`)}
            />
          </button>
        ))}
      </div>
      {history.length > 0 && (
        <ol className="math-fraction-history">
          {history.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            factors.length
              ? t(
                  `仍有共同因数 ${factors.join('、')}，当前写法等值，但还不是最简。`,
                  `Common factors ${factors.join(', ')} remain. The current form is equivalent, but not simplest.`,
                )
              : t(
                  '已经最简：分子分母没有大于 1 的共同因数。涂色量与原来完全相同。',
                  'Simplest form: numerator and denominator share no factor above one. Shading matches the original amount.',
                )
          }
        />
      </p>
    </>
  );
}
function Compare({ mode }: { mode: LanguageMode }) {
  const pairs = [
    [
      { n: 3, d: 4 },
      { n: 2, d: 3 },
    ],
    [
      { n: 5, d: 8 },
      { n: 2, d: 3 },
    ],
    [
      { n: 3, d: 5 },
      { n: 7, d: 10 },
    ],
    [
      { n: 1, d: 8 },
      { n: 1, d: 6 },
    ],
    [
      { n: 2, d: 3 },
      { n: 4, d: 6 },
    ],
  ] as const;
  const [index, setIndex] = useState(0),
    [show, setShow] = useState(false),
    [a, b] = pairs[index]!,
    common = commonDenominator(a, b),
    comparison = compareFractions(a, b),
    sign = comparison === 0 ? '=' : comparison < 0 ? '<' : '>';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '两条代表同样大小的整体。先用原来的分割预测，再揭示共同小单位；不要只比分子或分母。',
            'Both strips represent equal-sized wholes. Predict from the original cuts, then reveal a common small unit. Do not compare only numerators or denominators.',
          )}
        />
      </p>
      <div className="math-lab-presets">
        {pairs.map(([left, right], i) => (
          <button
            key={i}
            className="math-button secondary"
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              setShow(false);
            }}
          >
            {left.n}/{left.d} · {right.n}/{right.d}
          </button>
        ))}
      </div>
      <FractionBars value={a} mode={mode} label="A" />
      <FractionBars value={b} mode={mode} label="B" />
      <button
        className="math-button secondary"
        aria-expanded={show}
        onClick={() => setShow(!show)}
      >
        <Text
          mode={mode}
          text={
            show
              ? t('收起共同分母', 'Hide common denominator')
              : t(
                  '我已预测，显示共同分母',
                  'I predicted; show common denominator',
                )
          }
        />
      </button>
      {show && (
        <div className="math-fraction-common">
          <p>
            <Text
              mode={mode}
              text={t(
                `最小共同分母是 ${common.d}，每小份为 1/${common.d} 个相同整体。`,
                `The least common denominator is ${common.d}; each small part is 1/${common.d} of the same whole.`,
              )}
            />
          </p>
          <FractionBars value={common.left} mode={mode} label="A" />
          <FractionBars value={common.right} mode={mode} label="B" />
          <div className="math-fraction-readout">
            <Fraction n={common.left.n} d={common.d} />
            <span>{sign}</span>
            <Fraction n={common.right.n} d={common.d} />
          </div>
          <p className="math-hint">
            <Text
              mode={mode}
              text={t(
                `同样大小的小单位，比较 ${common.left.n} 与 ${common.right.n}；两数的写法变了，原量没变。`,
                `Compare ${common.left.n} and ${common.right.n} matching small units. Both representations changed while their values stayed fixed.`,
              )}
            />
          </p>
        </div>
      )}
    </>
  );
}
export function FractionLab({
  kind,
  mode,
}: {
  kind: FractionLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-fraction-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '分数工作台 · 先预测，再操作',
              'FRACTION WORKSHOP · PREDICT, THEN EXPLORE',
            )}
          />
        </span>
        <span className="math-live">
          <Text
            mode={mode}
            text={t('同一整体，精确份数', 'SAME WHOLE, EXACT PARTS')}
          />
        </span>
      </div>
      {kind === 'fraction-whole' ? (
        <UnitWhole mode={mode} />
      ) : kind === 'fraction-kind' || kind === 'fraction-mixed' ? (
        <Parts mode={mode} conversion={kind === 'fraction-mixed'} />
      ) : kind === 'fraction-equivalent' ? (
        <Equivalent mode={mode} />
      ) : kind === 'fraction-simplify' ? (
        <Simplify mode={mode} />
      ) : (
        <Compare mode={mode} />
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '解释：整体是谁？小份的单位怎样变？哪些数量保持不变？',
            'Explain: what is the whole, how did the part unit change, and which amounts stayed fixed?',
          )}
        />
      </div>
    </section>
  );
}
export function FractionHookArt({
  kind,
  mode,
}: {
  kind: FractionLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-number-hook">
      {kind === 'fraction-whole' ? (
        <div className="math-fraction-preview">
          <Text
            mode={mode}
            text={t(
              '同样的一半，先看整体',
              'Same fraction: identify each whole',
            )}
          />
          <strong>1/2 × 12 m · 1/2 × 6 m</strong>
        </div>
      ) : (
        <FractionBars
          value={
            kind === 'fraction-kind'
              ? { n: 7, d: 4 }
              : kind === 'fraction-mixed'
                ? { n: 11, d: 4 }
                : kind === 'fraction-simplify'
                  ? { n: 12, d: 18 }
                  : { n: 2, d: 3 }
          }
          mode={mode}
          showValue={false}
        />
      )}
    </div>
  );
}
