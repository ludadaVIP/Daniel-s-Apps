import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import { FactorArray, CommonLists } from './IntegerVisuals';
import {
  arithmeticTrace,
  mixedCases,
  orderCases,
  positiveFactors,
  factorPairs,
  positiveMultiples,
  trialDivision,
  numberKind,
  commonNumbers,
} from './integerModels';
export type IntegerLabKind = Extract<Lesson['lab'], `integer-${string}`>;
export const isIntegerLab = (kind: Lesson['lab']): kind is IntegerLabKind =>
  kind.startsWith('integer-');
const primary = (mode: LanguageMode, copy: LocalizedText) =>
  mode === 'en' ? copy.en : copy.zh;
function Range({
  label,
  value,
  min = 1,
  max,
  step = 1,
  set,
  mode,
}: {
  label: LocalizedText;
  value: number;
  min?: number;
  max: number;
  step?: number;
  set: (v: number) => void;
  mode: LanguageMode;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        aria-label={primary(mode, label)}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => set(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
const ruleNames = {
  brackets: t('先括号', 'Brackets first'),
  'multiply-divide': t('先乘除', 'Multiply/divide first'),
  'same-level': t('同级从左往右', 'Same level, left to right'),
};
function Calculation({
  mode,
  order = false,
}: {
  mode: LanguageMode;
  order?: boolean;
}) {
  const [index, setIndex] = useState(0),
    [leading, setLeading] = useState(1200),
    [visible, setVisible] = useState(0),
    [rule, setRule] = useState(''),
    [checked, setChecked] = useState(false);
  const tokens = order
      ? orderCases[index]!.tokens
      : index === 0
        ? [leading, ...mixedCases[0]!.slice(1)]
        : mixedCases[index]!,
    m = arithmeticTrace(tokens),
    good = !order || rule === orderCases[index]!.rule;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            order
              ? t(
                  '先确定括号与同级顺序，再预测下一段。乘除同级，加减同级；不能把“先乘后除”当成规则。',
                  'Determine brackets and same-level order before predicting the next part. Multiplication/division share a level, as do addition/subtraction; “multiply before divide” is not the rule.',
                )
              : t(
                  '先标运算关系，纸笔算下一段，再展开核对。每一行与原表达式等值；大数的零、位值与单位不能漏。',
                  'Mark the operation relationships, calculate the next part on paper, then reveal. Each line remains equivalent to the original expression; keep zeroes, place values and units.',
                )
          }
        />
      </p>
      <div className="math-lab-presets">
        {(order ? orderCases.map((c) => c.tokens) : mixedCases).map(
          (tokens, i) => (
            <button
              className="math-button secondary"
              key={i}
              aria-pressed={
                index === i && (order || i !== 0 || leading === 1200)
              }
              onClick={() => {
                setIndex(i);
                setLeading(1200);
                setVisible(0);
                setRule('');
                setChecked(false);
              }}
            >
              {tokens.join(' ')}
            </button>
          ),
        )}
      </div>
      {!order && index === 0 && (
        <Range
          mode={mode}
          label={t('加在最前的数', 'Leading added quantity')}
          value={leading}
          min={0}
          max={3000}
          step={100}
          set={(n) => {
            setLeading(n);
            setVisible(0);
          }}
        />
      )}
      <div className="math-integer-expression">
        {visible ? m.steps[visible - 1]!.after : m.original}
      </div>
      {order && (
        <>
          <label className="math-problem-select">
            <Text
              mode={mode}
              text={t('这次先用哪条规则？', 'Which rule applies first here?')}
            />
            <select
              aria-label={primary(mode, t('先用规则', 'First rule'))}
              value={rule}
              onChange={(e) => {
                setRule(e.target.value);
                setChecked(false);
                setVisible(0);
              }}
            >
              <option value="">
                {primary(mode, t('先选择规则', 'Choose a rule'))}
              </option>
              {Object.entries(ruleNames).map(([key, copy]) => (
                <option key={key} value={key}>
                  {mode === 'bilingual'
                    ? key === 'same-level'
                      ? '同级左→右 / Same level: L→R'
                      : `${copy.zh} / ${copy.en}`
                    : primary(mode, copy)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="math-button secondary"
            onClick={() => setChecked(true)}
          >
            <Text
              mode={mode}
              text={t('核对顺序依据', 'Check the order rule')}
            />
          </button>
          {checked && (
            <p role="status" className="math-hint">
              <Text
                mode={mode}
                text={
                  good
                    ? t(
                        '规则匹配。先处理括号；同一层乘除先于加减，同级从左往右。逐步核对，不跳过等值关系。',
                        'The rule fits. Handle brackets first; within one level, multiplication/division precede addition/subtraction, and equal-level operations go left to right. Check equivalence one step at a time.',
                      )
                    : t(
                        '重新看结构：有括号先处理括号；无括号先乘除；全是同级时按从左往右。不能只看某个运算名字。',
                        'Recheck the structure: handle brackets first, otherwise multiplication/division first; when operations share a level, go left to right. Do not rely on an operation’s name alone.',
                      )
                }
              />
            </p>
          )}
        </>
      )}
      <ol className="math-integer-steps">
        {m.steps.slice(0, visible).map((s, i) => (
          <li key={i}>
            <strong>
              {s.left} {s.op} {s.right} = {s.result}
            </strong>
            <span>
              {s.before} = {s.after}
            </span>
            <small>
              <Text
                mode={mode}
                text={
                  s.depth > 0
                    ? t('括号内的运算', 'Operation inside brackets')
                    : ['×', '÷'].includes(s.op)
                      ? t(
                          '乘除层，同级按原式先后',
                          'Multiply/divide level; keep same-level order',
                        )
                      : t(
                          '加减层，同级按原式先后',
                          'Add/subtract level; keep same-level order',
                        )
                }
              />
            </small>
          </li>
        ))}
      </ol>
      {(!order || (checked && good)) && visible < m.steps.length && (
        <button className="math-button" onClick={() => setVisible(visible + 1)}>
          <Text
            mode={mode}
            text={t(
              '我已预测，展开下一步',
              'I predicted; reveal the next step',
            )}
          />
        </button>
      )}
      {visible === m.steps.length && (
        <p role="status" className="math-problem-result">
          <Text
            mode={mode}
            text={t(
              `最终值 ${m.result}；上面的每一行都保留原表达式的值。`,
              `Final value ${m.result}; every line above retains the original expression’s value.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Factors({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(24),
    [rows, setRows] = useState(4),
    [reveal, setReveal] = useState(false),
    [zero, setZero] = useState(false),
    pairs = factorPairs(n),
    factors = positiveFactors(n),
    multiples = positiveMultiples(n);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '正因数能整除这个正整数；相等行排放没有余下格。倍数由这个数乘整数得到，列表可以继续。0 是任何非零整数的零倍，本课找最小公倍数时只比较正倍数。',
            'Positive factors divide this positive integer exactly; equal rows leave no counters over. Multiples come from multiplying by integers and the list continues. Zero is the zero multiple of every nonzero integer; least-common-multiple work here compares positive multiples.',
          )}
        />
      </p>
      <Range
        mode={mode}
        label={t('要研究的正整数', 'Positive integer to explore')}
        value={n}
        max={60}
        set={(v) => {
          setN(v);
          const closest = factorPairs(v).at(-1)!;
          setRows(closest.a);
          setReveal(false);
        }}
      />
      <div className="math-lab-presets">
        {pairs.map((p) => (
          <button
            key={p.a}
            className="math-button secondary"
            aria-pressed={rows === p.a || rows === p.b}
            onClick={() => setRows(p.a)}
          >
            {p.a} × {p.b}
          </button>
        ))}
        <button
          className="math-button secondary"
          onClick={() => setRows(n / rows)}
        >
          <Text mode={mode} text={t('交换行与列', 'Swap rows and columns')} />
        </button>
      </div>
      <FactorArray n={n} rows={rows} mode={mode} />
      <button
        className="math-button secondary"
        aria-expanded={reveal}
        onClick={() => setReveal(!reveal)}
      >
        <Text
          mode={mode}
          text={
            reveal
              ? t('收起正因数列表', 'Hide the positive-factor list')
              : t(
                  '我已列因数对，核对完整列表',
                  'I listed factor pairs; check the full list',
                )
          }
        />
      </button>
      {reveal && (
        <p role="status" className="math-problem-result">
          <Text
            mode={mode}
            text={t(
              `${n} 的正因数：${factors.join('、')}。平方数中相同的一对只计同一个因数一次。`,
              `Positive factors of ${n}: ${factors.join(', ')}. An equal pair in a square number contributes that factor once.`,
            )}
          />
        </p>
      )}
      <h3>
        <Text
          mode={mode}
          text={t(
            '前 8 个正倍数，还能继续',
            'First 8 positive multiples; the list continues',
          )}
        />
      </h3>
      <label className="math-integer-checkbox">
        <input
          type="checkbox"
          checked={zero}
          onChange={(e) => setZero(e.target.checked)}
        />
        <Text
          mode={mode}
          text={t('另显示零倍 0', 'Also show the zero multiple 0')}
        />
      </label>
      <div className="math-integer-chips">
        {(zero ? [0, ...multiples] : multiples).map((v) => (
          <span key={v}>{v}</span>
        ))}
        <span>…</span>
      </div>
    </>
  );
}
const kindNames = {
  prime: t('质数', 'prime'),
  composite: t('合数', 'composite'),
  neither: t('既非质数也非合数', 'neither prime nor composite'),
};
function Prime({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(9),
    [divisor, setDivisor] = useState(2),
    [trial, setTrial] = useState(false),
    [reveal, setReveal] = useState(false),
    m = trialDivision(n, divisor),
    kind = numberKind(n),
    full = n - m.remainder;
  const change = (v: number) => {
    setN(v);
    setDivisor(2);
    setTrial(false);
    setReveal(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '大于 1 的整数，恰有 1 与自己两个正因数才是质数；有其他正因数就是合数。一次试除没余数要看是不是非平凡因数，一次不整除也不能证明质数。',
            'An integer greater than one is prime with exactly two positive factors, one and itself; other positive factors make it composite. Exact trial division needs a nontrivial factor, and one failed division does not prove primality.',
          )}
        />
      </p>
      <Range
        mode={mode}
        label={t('待分类整数', 'Integer to classify')}
        value={n}
        min={0}
        max={60}
        set={change}
      />
      <div className="math-lab-presets">
        {[0, 1, 2, 9, 13, 49].map((v) => (
          <button
            key={v}
            className="math-button secondary"
            aria-pressed={n === v}
            onClick={() => change(v)}
          >
            {v}
          </button>
        ))}
      </div>
      {n >= 2 && (
        <>
          <Range
            mode={mode}
            label={t('试除数', 'Trial divisor')}
            value={divisor}
            min={2}
            max={Math.max(2, n - 1)}
            set={(d) => {
              setDivisor(d);
              setTrial(false);
            }}
          />
          <button
            className="math-button secondary"
            onClick={() => setTrial(true)}
          >
            <Text
              mode={mode}
              text={t(
                '我已预测余数，核对试除',
                'I predicted the remainder; check trial division',
              )}
            />
          </button>
          {trial && (
            <>
              <p role="status" className="math-problem-result">
                {n} = {divisor} × {m.quotient} + {m.remainder}
                <Text
                  mode={mode}
                  text={
                    m.divides && divisor < n
                      ? t(
                          '找到非平凡因数，可以确定为合数。',
                          'A nontrivial factor proves this number composite.',
                        )
                      : m.divides
                        ? t(
                            '试除数是它自己，不能据此判合数。',
                            'The divisor is the number itself; this does not prove compositeness.',
                          )
                        : t(
                            '这次有余数；还不能由一次失败证明质数。',
                            'This trial has a remainder; one failed trial does not prove primality.',
                          )
                  }
                />
              </p>
              {full > 0 && <FactorArray n={full} rows={divisor} mode={mode} />}
              <div className="math-integer-leftover">
                <Text
                  mode={mode}
                  text={t(
                    `未装入完整组的余量：${m.remainder} 个`,
                    `Counters outside complete groups: ${m.remainder}`,
                  )}
                />
                {Array.from({ length: m.remainder }, (_, i) => (
                  <i key={i} aria-hidden="true" />
                ))}
              </div>
            </>
          )}
        </>
      )}
      <button
        className="math-button secondary"
        aria-expanded={reveal}
        onClick={() => setReveal(!reveal)}
      >
        <Text
          mode={mode}
          text={
            reveal
              ? t('收起分类核对', 'Hide the classification check')
              : t(
                  '核对全部正因数与分类',
                  'Check all positive factors and classification',
                )
          }
        />
      </button>
      {reveal && (
        <p role="status" className="math-problem-result">
          <Text
            mode={mode}
            text={t(
              `${n}：${kindNames[kind].zh}。${n === 0 ? '0 的情况不套有限正因数表；质数与合数定义要求大于 1。' : `正因数 ${positiveFactors(n).join('、')}；定义还要求大于 1。`}`,
              `${n}: ${kindNames[kind].en}. ${n === 0 ? 'Do not apply a finite positive-factor list to zero; prime/composite definitions require greater than one.' : `Positive factors ${positiveFactors(n).join(', ')}; the definition also requires greater than one.`}`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Common({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(18),
    [b, setB] = useState(24),
    [kind, setKind] = useState<'factors' | 'multiples'>('factors'),
    [candidate, setCandidate] = useState(2),
    [checked, setChecked] = useState(false),
    [answer, setAnswer] = useState(false),
    [window, setWindow] = useState(false),
    m = commonNumbers(a, b),
    left = trialDivision(a, candidate),
    right = trialDivision(b, candidate);
  const reset = () => {
    setChecked(false);
    setAnswer(false);
    setWindow(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            kind === 'factors'
              ? t(
                  '要把两批分别平均分进相同数量的袋，且都不剩。候选袋数必须同时整除两批；能分不等于已经找到了最大。',
                  'Divide two batches among the same number of bags with nothing left in either. The bag count must divide both; a valid count need not be the greatest.',
                )
              : t(
                  '两种节奏从零同时开始，分别每隔 a、b 分钟出现。找下一次同现，用最小正公倍数；开始时的零不算下一次。',
                  'Two rhythms start together at zero and recur every a and b minutes. Their next coincidence uses the least positive common multiple; the initial zero is not the next time.',
                )
          }
        />
      </p>
      <div className="math-lab-presets">
        {(['factors', 'multiples'] as const).map((k) => (
          <button
            key={k}
            className="math-button secondary"
            aria-pressed={kind === k}
            onClick={() => {
              setKind(k);
              reset();
            }}
          >
            <Text
              mode={mode}
              text={
                k === 'factors'
                  ? t(
                      '公因数 · 最大袋数',
                      'Common factors · greatest bag count',
                    )
                  : t(
                      '公倍数 · 下次同现',
                      'Common multiples · next coincidence',
                    )
              }
            />
          </button>
        ))}
      </div>
      <div className="math-measure-controls">
        <Range
          mode={mode}
          label={t('第一个正整数 a', 'First positive integer a')}
          value={a}
          max={36}
          set={(n) => {
            setA(n);
            setCandidate(Math.min(candidate, n, b));
            reset();
          }}
        />
        <Range
          mode={mode}
          label={t('第二个正整数 b', 'Second positive integer b')}
          value={b}
          max={36}
          set={(n) => {
            setB(n);
            setCandidate(Math.min(candidate, n, a));
            reset();
          }}
        />
      </div>
      <CommonLists
        a={a}
        b={b}
        kind={kind}
        mode={mode}
        reveal={kind === 'factors' ? answer : window || answer}
        expanded={kind === 'multiples' && answer}
      />
      {kind === 'factors' ? (
        <>
          <Range
            mode={mode}
            label={t('候选袋数', 'Candidate bag count')}
            value={candidate}
            max={Math.min(a, b)}
            set={(d) => {
              setCandidate(d);
              setChecked(false);
            }}
          />
          <button
            className="math-button secondary"
            onClick={() => setChecked(true)}
          >
            <Text
              mode={mode}
              text={t(
                '检验候选是否两边都整除',
                'Check whether the candidate divides both',
              )}
            />
          </button>
          {checked && (
            <p role="status" className="math-problem-result">
              {a}={candidate}×{left.quotient}+{left.remainder}；{b}={candidate}×
              {right.quotient}+{right.remainder}
              <Text
                mode={mode}
                text={
                  left.divides && right.divides
                    ? t(
                        '这是公因数；再比较是否还有更大的共同数。',
                        'This is a common factor; compare whether a larger common factor exists.',
                      )
                    : t(
                        '至少一批有余量，不是两者的公因数。',
                        'At least one batch has a remainder; this is not a common factor.',
                      )
                }
              />
            </p>
          )}
        </>
      ) : (
        <>
          {!answer && (
            <button
              className="math-button secondary"
              aria-pressed={window}
              onClick={() => setWindow(!window)}
            >
              <Text
                mode={mode}
                text={t(
                  '点亮当前窗的共同数',
                  'Highlight common values in this window',
                )}
              />
            </button>
          )}
          {window && !answer && !m.visibleCommon.length && (
            <p role="status" className="math-hint">
              <Text
                mode={mode}
                text={t(
                  '前 8 倍的窗里还没共同点，不等于没有公倍数。扩大列表再核对。',
                  'No common value appears in the first-eight window. That does not mean common multiples do not exist. Expand the lists to check.',
                )}
              />
            </p>
          )}
        </>
      )}
      <button
        className="math-button"
        aria-expanded={answer}
        onClick={() => setAnswer(!answer)}
      >
        <Text
          mode={mode}
          text={
            answer
              ? t('收起最终核对', 'Hide the final check')
              : kind === 'factors'
                ? t('核对最大公因数', 'Check the greatest common factor')
                : t(
                    '展开到首个正共同点',
                    'Expand to the first positive common value',
                  )
          }
        />
      </button>
      {answer && (
        <p role="status" className="math-problem-result">
          <Text
            mode={mode}
            text={
              kind === 'factors'
                ? t(
                    `共有正因数 ${m.commonFactors.join('、')}，最大为 ${m.gcf}；可分 ${m.gcf} 袋，每袋分别 ${a / m.gcf} 与 ${b / m.gcf} 个。`,
                    `Common positive factors ${m.commonFactors.join(', ')}; greatest ${m.gcf}. Use ${m.gcf} ${m.gcf === 1 ? 'bag' : 'bags'}, with ${a / m.gcf} and ${b / m.gcf} from the respective batches in each.`,
                  )
                : t(
                    `首个正共同点 ${m.lcm}；分别是 a 的第 ${m.lcm / a} 个与 b 的第 ${m.lcm / b} 个正倍数，更早的正倍数没有重合。`,
                    `First positive common value ${m.lcm}: ${a}×${m.lcm / a}=${m.lcm} and ${b}×${m.lcm / b}=${m.lcm}. Earlier positive multiples do not coincide.`,
                  )
            }
          />
        </p>
      )}
    </>
  );
}
export function IntegerLab({
  kind,
  mode,
}: {
  kind: IntegerLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-integer-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '整数工作台 · 用依据核查',
              'WHOLE-NUMBER WORKSHOP · CHECK THE REASON',
            )}
          />
        </span>
        <span className="math-live">
          <Text
            mode={mode}
            text={t('每一步都要成立', 'EVERY STEP MUST HOLD')}
          />
        </span>
      </div>
      {kind === 'integer-mixed' ? (
        <Calculation key={kind} mode={mode} />
      ) : kind === 'integer-order' ? (
        <Calculation key={kind} mode={mode} order />
      ) : kind === 'integer-factors' ? (
        <Factors mode={mode} />
      ) : kind === 'integer-prime' ? (
        <Prime mode={mode} />
      ) : (
        <Common mode={mode} />
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '说明用到的顺序或整除关系。因数、倍数、最大与最小正值，回答的是不同目标。',
            'Explain the order or divisibility relationship. Factors, multiples, greatest and least positive values address different goals.',
          )}
        />
      </div>
    </section>
  );
}
export function IntegerHookArt({
  kind,
  mode,
}: {
  kind: IntegerLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-number-hook">
      {kind === 'integer-mixed' || kind === 'integer-order' ? (
        <div className="math-integer-expression">
          {(kind === 'integer-mixed'
            ? mixedCases[0]!
            : orderCases[2]!.tokens
          ).join(' ')}
        </div>
      ) : kind === 'integer-common' ? (
        <CommonLists a={18} b={24} kind="factors" mode={mode} />
      ) : (
        <FactorArray
          n={kind === 'integer-prime' ? 15 : 24}
          rows={3}
          mode={mode}
        />
      )}
    </div>
  );
}
