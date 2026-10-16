import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { checkFactorisation } from './factorModels';
import { radicalText } from './radicalModels';
import { QuadraticGraph, CompletingArea } from './QuadraticVisuals';
import {
  solveQuadratic,
  completingSquare,
  quadraticCandidateAudit,
  zeroPolynomialText,
  meaningCases,
  factoringCases,
  completingCases,
  applicationCases,
  feasibleQuadraticRoots,
} from './quadraticModels';
export type QuadraticLabKind = Extract<Lesson['lab'], `quadratic-${string}`>;
export const isQuadraticLab = (kind: Lesson['lab']): kind is QuadraticLabKind =>
  kind.startsWith('quadratic-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
const rootsAnswer = (source: string): AnswerSpec => {
  const s = solveQuadratic(source);
  return {
    kind: 'quadratic-roots',
    values: s.roots!.map(radicalText),
    value: s.roots!.map(radicalText).join(',') || 'no real solutions',
  };
};
function Task({
  mode,
  answer,
  prompt,
  name = t('我的二次方程结论', 'My quadratic conclusion'),
}: {
  mode: LanguageMode;
  answer: AnswerSpec;
  prompt: LocalizedText;
  name?: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false),
    correct = checkAnswer(value, answer),
    formOnly =
      answer.kind === 'quadratic-equation' &&
      !correct &&
      checkAnswer(value, { ...answer, model: false }) === true;
  return (
    <div className="math-quadratic-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={label(mode, name)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button
        className="math-button"
        aria-label={label(mode, t(`核对：${name.zh}`, `Check: ${name.en}`))}
        onClick={() => setChecked(true)}
      >
        <Text mode={mode} text={t('核对本次结论', 'Check this conclusion')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t(`${name.zh}反馈`, `${name.en} feedback`))}
        >
          <Text
            mode={mode}
            text={
              correct
                ? t(
                    '结论符合。请另解释保留两根、变形条件或情境范围。',
                    'The conclusion matches. Explain complete roots, transformation conditions or domain separately.',
                  )
                : formOnly
                  ? t(
                      '解集已相同，但建模题仍需保留两种原数量在等号两边。',
                      'The solution set matches, but retain both original quantities on opposite sides for the model.',
                    )
                  : t(
                      '重核合并后次数、零积前提、两根/重根、系数符号与原条件。',
                      'Recheck degree after collecting, the zero-product premise, distinct/repeated roots, signs and original conditions.',
                    )
            }
          />
        </p>
      )}
    </div>
  );
}
function Candidate({
  mode,
  source,
  domain = 'real',
}: {
  mode: LanguageMode;
  source: string;
  domain?: Parameters<typeof quadraticCandidateAudit>[2];
}) {
  const [raw, setRaw] = useState(''),
    [checked, setChecked] = useState(false),
    r = checked ? quadraticCandidateAudit(source, raw, domain) : null;
  return (
    <div className="math-quadratic-task">
      <label>
        <Text
          mode={mode}
          text={t(
            '代回原式与范围的候选值',
            'Candidate for original equation and domain',
          )}
        />
        <input
          aria-label={label(
            mode,
            t(
              '代回原式与范围的候选值',
              'Candidate for original equation and domain',
            ),
          )}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t('核原式与范围', 'Check original equation and domain')}
        />
      </button>
      {checked && (
        <div
          role="status"
          aria-label={label(mode, t('候选双核验', 'Candidate double audit'))}
        >
          {r ? (
            <>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    `原式左=${r.left}；右=${r.right}；等式 ${r.equationPass ? '通过' : '不通过'}。`,
                    `Original left=${r.left}; right=${r.right}; equation ${r.equationPass ? 'passes' : 'fails'}.`,
                  )}
                />
              </p>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    `情境范围 ${r.contextPass ? '通过' : '不通过'}；最终 ${r.accepted ? '接受' : '不接受'}。`,
                    `Context ${r.contextPass ? 'passes' : 'fails'}; final ${r.accepted ? 'accepted' : 'not accepted'}.`,
                  )}
                />
              </p>
            </>
          ) : (
            <p>
              <Text
                mode={mode}
                text={t(
                  '请输入本课支持的精确有理数或两项以内数值根式，不附单位。',
                  'Enter a supported exact rational or radical with at most two canonical terms, without units.',
                )}
              />
            </p>
          )}
        </div>
      )}
    </div>
  );
}
function Meaning({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(false),
    source = meaningCases[index]!,
    s = solveQuadratic(source);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先移到一边并合并，再看未知数最高次数及二次项系数。图像画原式左减右；原式成立当且仅当差为零。不要因表面出现 x² 就判二次。',
            'Move to one side and collect before identifying degree and a nonzero quadratic coefficient. The graph is original left minus right; the equation holds exactly when that difference is zero. A visible x² alone does not ensure a quadratic.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('原方程案例', 'Original equation case')} />
        <select
          aria-label={label(mode, t('原方程案例', 'Original equation case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          {meaningCases.map((v, i) => (
            <option value={i} key={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <p>
        {source}; f(x)={zeroPolynomialText(source)}
      </p>
      <QuadraticGraph source={source} mode={mode} shown={shown} wide={wide} />
      <div className="math-quadratic-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t('显示或隐藏零点核验', 'Show or hide zero audit')}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text mode={mode} text={t('改变图像窗口', 'Change graph window')} />
        </button>
      </div>
      <Task
        key={`${index}:kind`}
        mode={mode}
        name={t('合并后的方程类型', 'Equation type after collecting')}
        answer={{ kind: 'quadratic-kind', value: s.kind }}
        prompt={t(
          '写 quadratic / linear / identity / contradiction（或一元二次方程/一次方程/恒等式/矛盾）。',
          'Enter quadratic, linear, identity or contradiction.',
        )}
      />
      {s.kind === 'quadratic' && (
        <Task
          key={index}
          mode={mode}
          answer={rootsAnswer(source)}
          prompt={t(
            '给出全部不同实数根，逗号分隔；可写含中心的 ±，无实数解写 no real solutions。',
            'Give every distinct real root, comma-separated or using a centred ± expression; use no real solutions if none.',
          )}
        />
      )}
      <Candidate key={`candidate:${index}`} source={source} mode={mode} />
    </>
  );
}
function Factor({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [factor, setFactor] = useState(''),
    [checked, setChecked] = useState(false),
    [shown, setShown] = useState(false),
    c = factoringCases[index]!,
    zero = zeroPolynomialText(c.source),
    valid = checked && checkFactorisation(factor, c.factor, ['x']),
    rightIsZero = c.source.endsWith('=0');
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '零积法先要乘积等于零，再把每个因子分别等于零。不能除以可能为零的 x 而漏掉零根；原右边不是零时先整体移项。',
            'The zero-product rule requires a product equal to zero, then sets each factor to zero. Dividing by a possibly zero x can lose a root. If the original right side is nonzero, move the whole equation first.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('因式求解案例', 'Factoring solution case')} />
        <select
          aria-label={label(mode, t('因式求解案例', 'Factoring solution case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setFactor('');
            setChecked(false);
            setShown(false);
          }}
        >
          {factoringCases.map((v, i) => (
            <option value={i} key={v.source}>
              {v.source}
            </option>
          ))}
        </select>
      </label>
      <p>{c.source}</p>
      <p>
        <Text
          mode={mode}
          text={
            rightIsZero
              ? t(
                  `已整理为 ${zero}=0，给零左式写完成的因式乘积。`,
                  `The zero form is ${zero}=0. Factor its whole left expression.`,
                )
              : t(
                  `原右边是4，不能直接用x=0或x=3。移项为 ${zero}=0，须对整个左式分解。`,
                  `The original right side is four, so x=0 or x=3 does not follow. Move to ${zero}=0 and factor the entire left side.`,
                )
          }
        />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('零左式的因式乘积', 'Factored zero expression')}
        />
        <input
          aria-label={label(
            mode,
            t('零左式的因式乘积', 'Factored zero expression'),
          )}
          value={factor}
          onChange={(e) => {
            setFactor(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t('核因式与原式', 'Check factors against the original')}
        />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('因式求解反馈', 'Factoring solution feedback'),
          )}
        >
          <Text
            mode={mode}
            text={
              valid
                ? t(
                    '因式乘积正确，令每个因子为零，并代回原方程；这里还未自动证明你的根集合完整。',
                    'The factorisation matches. Set each factor to zero and substitute into the original; this does not yet verify your complete root set.',
                  )
                : t(
                    '重核零右边和整个左式的完整因式分解；原式等值但仍有加法或可分因子也要继续。',
                    'Recheck a zero right side and complete factorisation of the whole left side; equivalent unfinished sums/factors still need work.',
                  )
            }
          />
        </p>
      )}
      <Task
        key={index}
        mode={mode}
        answer={rootsAnswer(c.source)}
        prompt={t(
          '由零积给全部不同实根；重根只列一次。',
          'Give all distinct real roots from the zero product; list a repeated root once.',
        )}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏因式到根的核算',
            'Show or hide factor-to-root audit',
          )}
        />
      </button>
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('零积核验', 'Zero-product audit'))}
        >
          {c.factor}=0 →{' '}
          {solveQuadratic(c.source).roots!.map(radicalText).join(', ')};{' '}
          <Text
            mode={mode}
            text={t(
              '每根都要代回原式，不是同时要求两个因子都为零。',
              'Check each in the original; the rule does not require both factors to vanish simultaneously.',
            )}
          />
        </p>
      )}
    </>
  );
}
function Complete({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [stage, setStage] = useState(0),
    [x, setX] = useState(3),
    [notice, setNotice] = useState(false),
    source = completingCases[index]!,
    m = completingSquare(source);
  const step = (wanted: number) => {
    if (stage === wanted - 1) {
      setStage(wanted);
      setNotice(false);
    } else setNotice(true);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先除二次项非零系数，再把一次系数的一半平方，同时加到两边。图只用正长度说明恒等式，代数仍需全部实根；负半系数不画成负宽度。',
            'First divide by the nonzero quadratic coefficient, then add the square of half the linear coefficient to both sides. A positive-length diagram explains the identity; algebra retains all real roots. A negative half-coefficient is not a negative-width piece.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('配方案例', 'Completing-square case')} />
        <select
          aria-label={label(mode, t('配方案例', 'Completing-square case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setStage(0);
            setNotice(false);
          }}
        >
          {completingCases.map((v, i) => (
            <option value={i} key={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <p>{source}</p>
      <label>
        <Text
          mode={mode}
          text={t('仅改变正长度图例 x', 'Illustration x only')}
        />
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          aria-label={label(
            mode,
            t('仅改变正长度图例 x', 'Illustration x only'),
          )}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
        />
        <output>{x}</output>
      </label>
      <CompletingArea
        source={source}
        mode={mode}
        xValue={x}
        filled={stage >= 1}
      />
      <Task
        key={`${index}:term`}
        name={t('应同加的平方项', 'Completing term to add')}
        mode={mode}
        answer={{ kind: 'number', value: textR(m.added) }}
        prompt={t(
          '两边都应添加哪个数值？先算半系数的平方。',
          'What number should be added to both sides? Square the half-coefficient first.',
        )}
      />
      <div className="math-quadratic-actions">
        <button className="math-button" onClick={() => step(1)}>
          <Text
            mode={mode}
            text={t('两边同加配方项', 'Add completing term to both sides')}
          />
        </button>
        <button className="math-button" onClick={() => step(2)}>
          <Text
            mode={mode}
            text={t('改写为完整平方', 'Rewrite as a complete square')}
          />
        </button>
        <button className="math-button" onClick={() => step(3)}>
          <Text
            mode={mode}
            text={t('取全体实数分支', 'Take all real branches')}
          />
        </button>
        <button
          className="math-button"
          disabled={!stage}
          onClick={() => {
            setStage(stage - 1);
            setNotice(false);
          }}
        >
          <Text
            mode={mode}
            text={t('撤回配方末步', 'Undo final completing step')}
          />
        </button>
      </div>
      {notice && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('配方依赖反馈', 'Completing dependency feedback'),
          )}
        >
          <Text
            mode={mode}
            text={t(
              '请按原式依次同加、平方改写、取两分支；不能跳过依据或重复加入。',
              'Use the original order: add to both sides, rewrite the square, then take branches. Do not skip a premise or add a duplicate step.',
            )}
          />
        </p>
      )}
      <ol>
        {stage >= 1 && (
          <li data-completing-step="1">
            p={textR(m.p)}; p²={textR(m.added)};{' '}
            <Text
              mode={mode}
              text={t(
                `两边同加后右边 ${textR(m.rhs)}+${textR(m.added)}=${textR(m.completed)}`,
                `Add to both sides: right ${textR(m.rhs)}+${textR(m.added)}=${textR(m.completed)}`,
              )}
            />
          </li>
        )}
        {stage >= 2 && (
          <li data-completing-step="2">
            (x+({textR(m.p)}))²={textR(m.completed)}
          </li>
        )}
        {stage >= 3 && (
          <li data-completing-step="3">
            {m.completed[0] < 0n ? (
              <Text
                mode={mode}
                text={t(
                  '平方不能为负，无实数根。',
                  'A real square cannot be negative: no real roots.',
                )}
              />
            ) : (
              <>
                x+({textR(m.p)})=
                {m.completed[0] === 0n ? '0' : `±√(${textR(m.completed)})`}; x=
                {m.roots!.map(radicalText).join(', ')}
              </>
            )}
          </li>
        )}
      </ol>
      <Task
        key={index}
        mode={mode}
        answer={rootsAnswer(source)}
        prompt={t(
          '写原方程全部不同实根，允许 (−3±√13)/2 这类简写。',
          'Give all distinct real roots of the original, allowing shorthand such as (-3±√13)/2.',
        )}
      />
    </>
  );
}
const formulaReasons = [
  t(
    'a≠0，先两边除以a，再将常数移到右边。',
    'With a≠0 divide both sides by a, then move the constant.',
  ),
  t(
    '两边同加 (b/(2a))²，得到 (x+b/(2a))²=Δ/(4a²)。',
    'Add (b/(2a))² to both sides, obtaining (x+b/(2a))²=Δ/(4a²).',
  ),
  t(
    'Δ≥0时取两分支；√(4a²)=2|a|，±同时取使负a只交换分支。Δ<0时没有实根。',
    'For Δ≥0 take both branches. √(4a²)=2|a|; using both ± branches means negative a only exchanges them. For Δ<0 there are no real roots.',
  ),
  t(
    '由此得 x=(−b±√Δ)/(2a)，重根只列一个不同值，并代回原式。',
    'Thus x=(-b±√Δ)/(2a). List one distinct value for a repeated root and substitute into the original.',
  ),
];
function Formula({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(1),
    [b, setB] = useState(-3),
    [c, setC] = useState(1),
    [stage, setStage] = useState(0),
    source = `${a}x²+(${b})x+(${c})=0`,
    s = solveQuadratic(source),
    key = `${a}:${b}:${c}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '公式来自一般配方，不只背代入。负b要加括号，分母是整个2a；先检查a≠0。改变任何系数都会换题。',
            'The formula follows from general completing, not substitution alone. Parenthesise a negative b and divide the whole numerator by 2a; check a≠0 first. Any coefficient change creates a new task.',
          )}
        />
      </p>
      <div className="math-quadratic-controls">
        {[
          ['a', a, setA],
          ['b', b, setB],
          ['c', c, setC],
        ].map(([name, value, change]) => (
          <label key={String(name)}>
            {String(name)}
            <input
              type="range"
              min={name === 'a' ? -3 : -6}
              max={name === 'a' ? 3 : 6}
              step="1"
              aria-label={`${mode === 'en' ? 'Coefficient' : '系数'} ${name}`}
              value={value as number}
              onChange={(e) => {
                (change as (n: number) => void)(Number(e.target.value));
                setStage(0);
              }}
            />
            <output>{value as number}</output>
          </label>
        ))}
      </div>
      <p>{source}</p>
      {s.kind === 'quadratic' ? (
        <>
          <p>
            Δ=({b})²−4×({a})×({c})={textR(s.discriminant!)}
          </p>
          <button
            className="math-button"
            disabled={stage === 4}
            onClick={() => setStage(stage + 1)}
          >
            <Text
              mode={mode}
              text={t('下一条公式推导依据', 'Next formula derivation')}
            />
          </button>
          <button
            className="math-button"
            disabled={!stage}
            onClick={() => setStage(stage - 1)}
          >
            <Text
              mode={mode}
              text={t('撤回公式依据', 'Undo formula derivation')}
            />
          </button>
          <ol>
            {formulaReasons.slice(0, stage).map((r, i) => (
              <li data-formula-step={i} key={i}>
                <Text mode={mode} text={r} />
              </li>
            ))}
          </ol>
          <QuadraticGraph source={source} mode={mode} shown={stage === 4} />
          <Task
            key={key}
            mode={mode}
            answer={rootsAnswer(source)}
            prompt={t(
              '给全部不同实根；允许精确分数与含 ± 的根式，不能把整个分母漏括号。',
              'Give all distinct real roots using exact fractions or ± radicals. Parenthesise the full numerator/denominator correctly.',
            )}
          />
        </>
      ) : (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                'a=0，原式不是二次方程；二次求根公式不得除以零，先按合并结果分类。',
                'a=0: this is not a quadratic. Do not divide by zero using its formula; classify the collected equation first.',
              )}
            />
          </p>
          <Task
            key={key}
            mode={mode}
            answer={{ kind: 'quadratic-kind', value: s.kind }}
            prompt={t(
              '按实际原式写 linear / identity / contradiction。',
              'Classify the actual equation as linear, identity or contradiction.',
            )}
          />
        </>
      )}
    </>
  );
}
function Discriminant({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [c, setC] = useState(0),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(false),
    source =
      index === 0
        ? `x²-2x+(${c})=0`
        : index === 1
          ? '(x-8)(x-10)=0'
          : '0x²+2x-4=0',
    s = solveQuadratic(source);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先确认a≠0，再由Δ的符号判断不同实根数：正二、零一、负零。Δ=0是二重根，但不同数值只有一个；不是两个可分开的交点。',
            'First verify a≠0, then use Δ: positive gives two distinct real roots, zero one repeated root, negative none. A double root is one distinct value, not two separated crossings.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('判别式案例', 'Discriminant case')} />
        <select
          aria-label={label(mode, t('判别式案例', 'Discriminant case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          <option value="0">x²−2x+c=0</option>
          <option value="1">(x−8)(x−10)=0</option>
          <option value="2">a=0</option>
        </select>
      </label>
      {index === 0 && (
        <label>
          c
          <input
            aria-label={label(mode, t('常数 c', 'Constant c'))}
            type="range"
            min="0"
            max="3"
            step="1"
            value={c}
            onChange={(e) => {
              setC(Number(e.target.value));
              setShown(false);
            }}
          />
          <output>{c}</output>
        </label>
      )}
      <p>{source}</p>
      <QuadraticGraph source={source} mode={mode} shown={shown} wide={wide} />
      <div className="math-quadratic-actions">
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text mode={mode} text={t('改变图像窗口', 'Change graph window')} />
        </button>
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t('显示或隐藏判别式核验', 'Show or hide discriminant audit')}
          />
        </button>
      </div>
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('判别式核验', 'Discriminant audit'))}
        >
          <Text
            mode={mode}
            text={
              s.kind === 'quadratic'
                ? t(
                    `a≠0；Δ=${textR(s.discriminant!)}，${s.roots!.length} 个不同实根。显示窗口不改变根数。`,
                    `a≠0; Δ=${textR(s.discriminant!)}, ${s.roots!.length} distinct real roots. The window does not change their count.`,
                  )
                : t(
                    'a=0，不能用二次判别式规则计根；此式为一次方程，解x=2。',
                    'a=0: the quadratic discriminant rule is inapplicable. This is linear with solution x=2.',
                  )
            }
          />
        </p>
      )}
      <Task
        key={`${index}:${c}`}
        mode={mode}
        answer={
          s.kind === 'quadratic'
            ? { kind: 'number', value: String(s.roots!.length) }
            : { kind: 'quadratic-kind', value: s.kind }
        }
        prompt={
          s.kind === 'quadratic'
            ? t(
                '只写不同实根的个数，不重复计算重根。',
                'Enter the number of distinct real roots, counting a repeated root once.',
              )
            : t(
                '先分类合并后的方程，不强套二次判别式。',
                'Classify the collected equation rather than applying the quadratic discriminant.',
              )
        }
      />
    </>
  );
}
function Application({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    c = applicationCases[index]!,
    feasible = feasibleQuadraticRoots(c.source, c.domain);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '原数量建模、代数全部解、情境允许值是三步。正长度、完整卡数和规定时间范围分别检查，不靠四舍五入修复不合条件的根。',
            'Model original quantities, solve for all algebraic roots, then check context. Positive lengths, whole-card counts and a stated time range are different restrictions. Rounding cannot repair an inadmissible root.',
          )}
        />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('二次应用案例', 'Quadratic application case')}
        />
        <select
          aria-label={label(
            mode,
            t('二次应用案例', 'Quadratic application case'),
          )}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          {applicationCases.map((v, i) => (
            <option value={i} key={v.id}>
              {i + 1} · {v.id}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text mode={mode} text={c.story} />
      </p>
      <Task
        key={`${index}:model`}
        name={t('我的原数量二次模型', 'My original quadratic model')}
        mode={mode}
        answer={{ kind: 'quadratic-equation', value: c.source }}
        prompt={t(
          '用x列两种原数量的等式，可展开或交换两边；不要只交根或先移到零边。',
          'Write the original quantity equation in x. Expansion or swapping sides is allowed; roots alone or a transposed zero form do not show the model.',
        )}
      />
      <Candidate key={index} source={c.source} domain={c.domain} mode={mode} />
      <Task
        key={`${index}:feasible`}
        mode={mode}
        answer={{
          kind: 'quadratic-roots',
          values: feasible,
          value: feasible.join(',') || 'no feasible solutions',
        }}
        prompt={t(
          '最后只写满足题设范围的全部不同根；没有符合条件的值写空集 ∅、无可行解或 no feasible solutions。',
          'Finally list every distinct root satisfying the stated domain. Use ∅ or no feasible solutions if no value is feasible in this context.',
        )}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏原模型与根的审计',
            'Show or hide original-model root audit',
          )}
        />
      </button>
      {shown && (
        <div
          role="status"
          aria-label={label(mode, t('二次模型核验', 'Quadratic model audit'))}
        >
          <p>
            {c.source};{' '}
            <Text mode={mode} text={t('全部代数根', 'All algebraic roots')} />:{' '}
            {solveQuadratic(c.source).roots!.map(radicalText).join(', ')}
          </p>
          <p>
            <Text
              mode={mode}
              text={t('范围内接受', 'Accepted within the domain')}
            />
            : {feasible.join(', ') || label(mode, t('没有', 'none'))}
          </p>
          <p>
            <Text
              mode={mode}
              text={t(
                '没有情境解不等于方程没有实根；每个候选分别核原式和范围。',
                'No feasible contextual solution does not mean no algebraic real roots. Check each candidate against both the original equation and domain.',
              )}
            />
          </p>
        </div>
      )}
    </>
  );
}
export function QuadraticLab({
  kind,
  mode,
}: {
  kind: QuadraticLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-quadratic-lab">
      {kind === 'quadratic-meaning' ? (
        <Meaning mode={mode} />
      ) : kind === 'quadratic-factor' ? (
        <Factor mode={mode} />
      ) : kind === 'quadratic-complete' ? (
        <Complete mode={mode} />
      ) : kind === 'quadratic-formula' ? (
        <Formula mode={mode} />
      ) : kind === 'quadratic-discriminant' ? (
        <Discriminant mode={mode} />
      ) : (
        <Application mode={mode} />
      )}
    </section>
  );
}
export function QuadraticHookArt({
  kind,
  mode,
}: {
  kind: QuadraticLabKind;
  mode: LanguageMode;
}) {
  const hooks: Record<QuadraticLabKind, LocalizedText> = {
    'quadratic-meaning': t(
      '式中出现x²，合并以后就一定还是二次方程吗？',
      'Does seeing x² guarantee the collected equation is still quadratic?',
    ),
    'quadratic-factor': t(
      'x(x−3)=0时，能直接除以x吗？',
      'May x(x−3)=0 simply be divided by x?',
    ),
    'quadratic-complete': t(
      '两条半宽长条围成L形，缺角要补多大？',
      'Two half-width strips form an L; how large is the missing corner?',
    ),
    'quadratic-formula': t(
      '求根公式里a为负数时，为什么不能把|a|问题略过？',
      'When a is negative, why must the absolute-value step in the formula derivation be explained?',
    ),
    'quadratic-discriminant': t(
      '两个相同的公式分支，是两个不同交点吗？',
      'Do identical formula branches represent two distinct intersections?',
    ),
    'quadratic-apply': t(
      '一个根代回等式成立，就一定能作实际宽度或卡数吗？',
      'If a root satisfies the equation, must it be a valid width or card count?',
    ),
  };
  return (
    <p>
      <Text mode={mode} text={hooks[kind]} />
    </p>
  );
}
