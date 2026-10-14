import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text, Fraction } from './ui';
import { compareFractions, mixedFraction } from './fractionModels';
import {
  fractionOperation,
  commonDenominatorChoices,
  fractionStories,
  type FractionOperation,
} from './fractionOperationModels';
import {
  FractionOperands,
  FractionOperationGrid,
} from './FractionOperationVisuals';
export type FractionOperationLabKind =
  | 'fraction-add-like'
  | 'fraction-subtract-like'
  | 'fraction-add-unlike'
  | 'fraction-subtract-unlike'
  | 'fraction-story';
export const isFractionOperationLab = (
  kind: Lesson['lab'],
): kind is FractionOperationLabKind =>
  [
    'fraction-add-like',
    'fraction-subtract-like',
    'fraction-add-unlike',
    'fraction-subtract-unlike',
    'fraction-story',
  ].includes(kind);
function Counter({
  label,
  mode,
  value,
  min = 0,
  max,
  onChange,
}: {
  label: LocalizedText;
  mode: LanguageMode;
  value: number;
  min?: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={mode === 'en' ? label.en : label.zh}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function FractionWorkbench({
  kind,
  mode,
}: {
  kind: FractionOperationLabKind;
  mode: LanguageMode;
}) {
  const storyMode = kind === 'fraction-story',
    like = kind.endsWith('-like');
  const subtract = kind.includes('subtract');
  const [a, setA] = useState(subtract ? (like ? 7 : 3) : like ? 3 : 2),
    [b, setB] = useState(subtract ? (like ? 3 : 1) : like ? 2 : 1);
  const [da, setDa] = useState(like ? 8 : subtract ? 4 : 3),
    [db, setDb] = useState(subtract ? 6 : 4);
  const [stage, setStage] = useState(0),
    [candidate, setCandidate] = useState(''),
    [checked, setChecked] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0),
    [sign, setSign] = useState<FractionOperation | ''>(''),
    [storyChecked, setStoryChecked] = useState(false);
  const [secondStep, setSecondStep] = useState(false);
  const story = fractionStories[storyIndex]!;
  const left = storyMode ? story.left : { n: a, d: da };
  const right = storyMode ? story.right : { n: b, d: like ? da : db };
  const operation: FractionOperation = storyMode
    ? story.operation
    : subtract
      ? '−'
      : '+';
  const nonnegative = operation === '+' || compareFractions(left, right) >= 0;
  const validCandidate =
    !!candidate &&
    Number(candidate) % left.d === 0 &&
    Number(candidate) % right.d === 0;
  const model = nonnegative
    ? fractionOperation(
        left,
        right,
        operation,
        validCandidate ? Number(candidate) : undefined,
      )
    : null;
  const unlike = left.d !== right.d;
  const canReveal =
    nonnegative &&
    (!storyMode || (storyChecked && sign === story.operation)) &&
    (!unlike || (checked && validCandidate));
  const reset = () => {
    setStage(0);
    setSecondStep(false);
    setCandidate('');
    setChecked(false);
  };
  const change = (setter: (n: number) => void, value: number) => {
    setter(value);
    reset();
  };
  return (
    <>
      {storyMode ? (
        <>
          <div className="math-fraction-story-options">
            {fractionStories.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="math-button secondary"
                aria-pressed={storyIndex === i}
                onClick={() => {
                  setStoryIndex(i);
                  setSign('');
                  setStoryChecked(false);
                  reset();
                }}
              >
                <Text mode={mode} text={s.title} />
              </button>
            ))}
          </div>
          <p>
            <Text mode={mode} text={story.stem} />
          </p>
          <label>
            <Text
              mode={mode}
              text={t('先选关系', 'Choose the relationship first')}
            />
            <select
              aria-label={mode === 'en' ? 'Story operation' : '情境运算'}
              value={sign}
              onChange={(e) => {
                setSign(e.target.value as FractionOperation | '');
                setStoryChecked(false);
                reset();
              }}
            >
              <option value="">{mode === 'en' ? 'Choose…' : '请选择…'}</option>
              <option value="+">
                {mode === 'en' ? 'Add: combine amounts' : '加法：合并各量'}
              </option>
              <option value="−">
                {mode === 'en'
                  ? 'Subtract: find what remains'
                  : '减法：求剩余量'}
              </option>
            </select>
          </label>
          <button
            type="button"
            className="math-button secondary"
            disabled={!sign}
            onClick={() => setStoryChecked(true)}
          >
            <Text
              mode={mode}
              text={t('核对情境关系', 'Check the story relationship')}
            />
          </button>
          {storyChecked && (
            <p role="status">
              <Text
                mode={mode}
                text={
                  sign === story.operation
                    ? t(
                        `关系正确。统一单位 ${story.unit} 后，再统一每份大小。`,
                        `Relationship checked. Use the same unit ${story.unit}, then the same fraction-piece size.`,
                      )
                    : t(
                        '再看所求对象：合在一起用加法；从原量中用去或剪去，求剩余用减法。',
                        'Recheck the unknown: combining uses addition; using or cutting away to find what remains uses subtraction.',
                      )
                }
              />
            </p>
          )}
        </>
      ) : (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                like
                  ? '先预测：每份大小相同，数份数时分母会不会改变？可以跨过一个整体；减法先比较能否划去。'
                  : '先预测：这两种份一样大吗？选一个两分母的公倍数，同步细分，再数相同大小的份。',
                like
                  ? 'Predict: with equal-size pieces, does the denominator change when counting pieces? Addition may exceed one whole; compare before taking away.'
                  : 'Predict: are these pieces equally sized? Choose a common multiple of both denominators, refine both, then count equal-size pieces.',
              )}
            />
          </p>
          <div className="math-fraction-control-grid">
            <Counter
              label={t('A 的分母', 'Denominator of A')}
              mode={mode}
              min={2}
              max={12}
              value={da}
              onChange={(n) => {
                setDa(n);
                setA((v) => Math.min(v, 2 * n));
                if (like) setB((v) => Math.min(v, 2 * n));
                reset();
              }}
            />
            {!like && (
              <Counter
                label={t('B 的分母', 'Denominator of B')}
                mode={mode}
                min={2}
                max={12}
                value={db}
                onChange={(n) => {
                  setDb(n);
                  setB((v) => Math.min(v, 2 * n));
                  reset();
                }}
              />
            )}
            <Counter
              label={t('A 的分子', 'Numerator of A')}
              mode={mode}
              max={2 * da}
              value={a}
              onChange={(n) => change(setA, n)}
            />
            <Counter
              label={t('B 的分子', 'Numerator of B')}
              mode={mode}
              max={2 * (like ? da : db)}
              value={b}
              onChange={(n) => change(setB, n)}
            />
          </div>
        </>
      )}
      {/* Hide the story operation until the child chooses it correctly. */}
      {stage === 0 &&
        (!storyMode || (storyChecked && sign === story.operation)) && (
          <FractionOperands
            left={left}
            right={right}
            operation={operation}
            mode={mode}
          />
        )}
      {!nonnegative && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              'B 大于 A，划去量超过原有量。本单元研究非负差；调整已知量再试，后续负数课程再研究这个结果。',
              'B exceeds A, so the removed amount exceeds what is available. This unit explores non-negative differences; change the known quantities to continue. A later negative-number unit will study this result.',
            )}
          />
        </p>
      )}
      {unlike && (!storyMode || (storyChecked && sign === story.operation)) && (
        <div className="math-row math-fraction-denominator-controls">
          <label>
            <Text
              mode={mode}
              text={t('共同分母候选', 'Candidate common denominator')}
            />
            <select
              aria-label={
                mode === 'en' ? 'Candidate common denominator' : '共同分母候选'
              }
              value={candidate}
              onChange={(e) => {
                setCandidate(e.target.value);
                setChecked(false);
                setStage(0);
              }}
            >
              <option value="">{mode === 'en' ? 'Choose…' : '请选择…'}</option>
              {commonDenominatorChoices(left, right).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="math-button secondary"
            disabled={!candidate || !nonnegative}
            onClick={() => setChecked(true)}
          >
            <Text
              mode={mode}
              text={t('核对等份是否相同', 'Check equal-piece size')}
            />
          </button>
          {checked && (
            <p role="status">
              <Text
                mode={mode}
                text={
                  validCandidate
                    ? t(
                        `可用 ${candidate}：同时是 ${left.d} 与 ${right.d} 的倍数。最小公倍数更省格子，但其他公倍数也有效。`,
                        `${candidate} works: it is a multiple of both ${left.d} and ${right.d}. The least common multiple uses fewer pieces; other common multiples also work.`,
                      )
                    : t(
                        `不能用 ${candidate}：新分母必须同时被 ${left.d} 与 ${right.d} 整除。改变分母时，分子也要同倍改变。`,
                        `${candidate} does not work: both ${left.d} and ${right.d} must divide the new denominator. Scale each numerator by the same factor as its denominator.`,
                      )
                }
              />
            </p>
          )}
        </div>
      )}
      {canReveal && model && (
        <>
          {stage < 3 && (
            <button
              type="button"
              className="math-button"
              onClick={() => setStage((v) => v + 1)}
            >
              <Text
                mode={mode}
                text={t(
                  stage === 0
                    ? '我已预测，显示相同单位的份'
                    : stage === 1
                      ? '我已数好，显示合并或划去'
                      : '核对最简形式与整体数',
                  stage === 0
                    ? 'I predicted; show equal-size pieces'
                    : stage === 1
                      ? 'I counted; show joining or removal'
                      : 'Check simplest form and whole count',
                )}
              />
            </button>
          )}
          {stage >= 1 && (
            <>
              <div className="math-fraction-op-equation">
                <Fraction n={left.n} d={left.d} />
                <span>{operation}</span>
                <Fraction n={right.n} d={right.d} />
                <span>=</span>
                <Fraction n={model.left.n} d={model.left.d} />
                <span>{operation}</span>
                <Fraction n={model.right.n} d={model.right.d} />
                <span>= ?</span>
              </div>
              <FractionOperationGrid
                left={left}
                right={right}
                operation={operation}
                denominator={model.raw.d}
                mode={mode}
              />
            </>
          )}
          {stage >= 2 && (
            <>
              <FractionOperationGrid
                left={left}
                right={right}
                operation={operation}
                denominator={model.raw.d}
                mode={mode}
                result
              />
              <p className="math-fraction-op-result" role="status">
                <Text
                  mode={mode}
                  text={t(
                    `相同大小的份：${model.left.n}${operation}${model.right.n}=${model.raw.n}，所以结果是 ${model.raw.n}/${model.raw.d}${storyMode ? ` ${story.unit}` : ''}。`,
                    `Equal-size pieces: ${model.left.n}${operation}${model.right.n}=${model.raw.n}, so the result is ${model.raw.n}/${model.raw.d}${storyMode ? ` ${story.unit}` : ''}.`,
                  )}
                />
              </p>
            </>
          )}
          {stage >= 3 &&
            (() => {
              const s = model.simplest,
                mixed = mixedFraction(s);
              const value = s.d === 1 ? String(s.n) : `${s.n}/${s.d}`;
              const mixedValue =
                mixed.whole && mixed.n
                  ? `${mixed.whole} ${mixed.n}/${mixed.d}`
                  : value;
              return (
                <p role="status">
                  <Text
                    mode={mode}
                    text={t(
                      `最简表示 ${value}${storyMode ? ` ${story.unit}` : ''}；${mixed.whole && mixed.n ? `也可写 ${mixedValue}。` : ''} ${s.n === 0 ? '差为零仍合法；整体标尺与单位没有消失。' : '约分改变写法，不改变涂色数量。'} 用逆运算核查。`,
                      `Simplest representation ${value}${storyMode ? ` ${story.unit}` : ''}; ${mixed.whole && mixed.n ? `also ${mixedValue}. ` : ''}${s.n === 0 ? 'A zero difference is valid; the reference whole and measurement unit still exist.' : 'Simplifying changes the writing, not the shaded amount.'} Check using the inverse operation.`,
                    )}
                  />
                </p>
              );
            })()}
          {storyMode && story.id === 'water' && stage >= 3 && (
            <section className="math-fraction-second-step">
              <p>
                <Text
                  mode={mode}
                  text={t(
                    '再走一步：从刚合并的水中用去 1/2 L。先写最终剩余的关系，再预测它是否小于 1 L。',
                    'One more step: use 1/2 L of the combined water. Write the final-remainder relationship first, then predict whether it is below 1 L.',
                  )}
                />
              </p>
              {!secondStep && (
                <button
                  className="math-button secondary"
                  type="button"
                  onClick={() => setSecondStep(true)}
                >
                  <Text
                    mode={mode}
                    text={t(
                      '我已预测，核查第二步的剩余',
                      'I predicted; check the second-step remainder',
                    )}
                  />
                </button>
              )}
              {secondStep && (
                <>
                  <FractionOperationGrid
                    left={model.simplest}
                    right={{ n: 1, d: 2 }}
                    operation="−"
                    denominator={model.least}
                    mode={mode}
                    result
                  />
                  <p role="status">
                    <Text
                      mode={mode}
                      text={t(
                        '最终剩余：17/12 L−6/12 L=11/12 L。加回 1/2 L 恢复 17/12 L 的合计量；最终剩余与中间总量不同。',
                        'Final remainder: 17/12 L−6/12 L=11/12 L. Add back 1/2 L to recover the combined 17/12 L; distinguish the final remainder from the intermediate total.',
                      )}
                    />
                  </p>
                </>
              )}
            </section>
          )}
        </>
      )}
    </>
  );
}
export function FractionOperationLab({
  kind,
  mode,
}: {
  kind: FractionOperationLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-fraction-operation-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '动手数学 · 先预测，再核查',
              'HANDS-ON MATHS · PREDICT, THEN CHECK',
            )}
          />
        </span>
        <span className="math-live">
          <Text
            mode={mode}
            text={t('精确等份模型', 'EXACT EQUAL-PART MODEL')}
          />
        </span>
      </div>
      <FractionWorkbench key={kind} kind={kind} mode={mode} />
    </section>
  );
}
export function FractionOperationHookArt({
  kind,
  mode,
}: {
  kind: FractionOperationLabKind;
  mode: LanguageMode;
}) {
  const subtract = kind.includes('subtract');
  return (
    <FractionOperands
      left={{ n: subtract ? 3 : 2, d: 4 }}
      right={{ n: 1, d: kind.endsWith('-unlike') ? 3 : 4 }}
      operation={subtract ? '−' : '+'}
      mode={mode}
    />
  );
}
