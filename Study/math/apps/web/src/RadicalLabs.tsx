import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { readRational } from './rationalModels';
import { RealRootLine, RadicalTiles, RootBoundsView } from './RadicalVisuals';
import {
  squareRoots,
  readRadical,
  radicalText,
  rootCases,
  realCases,
  radicalClass,
  simplifyCases,
  operationCases,
  estimateCases,
  rootBracket,
  type RealClass,
} from './radicalModels';
export type RadicalLabKind = Extract<Lesson['lab'], `radical-${string}`>;
export const isRadicalLab = (kind: Lesson['lab']): kind is RadicalLabKind =>
  kind.startsWith('radical-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
function Task({
  mode,
  answer,
  prompt,
}: {
  mode: LanguageMode;
  answer: AnswerSpec;
  prompt: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  const right = checkAnswer(value, answer);
  return (
    <div className="math-radical-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('我的根式或实数结论', 'My radical or real-number conclusion')}
        />
        <input
          aria-label={label(
            mode,
            t('我的根式或实数结论', 'My radical or real-number conclusion'),
          )}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t('核对根式结论', 'Check radical conclusion')}
        />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('根式结论反馈', 'Radical conclusion feedback'),
          )}
        >
          <Text
            mode={mode}
            text={
              right
                ? t(
                    '结论符合。再说明符号、数域、化简形式或界限依据。',
                    'The conclusion matches. Explain signs, domain, simplified form or bounding evidence.',
                  )
                : answer.kind === 'radical' &&
                    readRadical(value) &&
                    checkAnswer(value, { ...answer, simplified: false })
                  ? t(
                      '数值已等价，但题目要求完成化简：提出平方因子、分母去根号、合并同类根式，并省零项。',
                      'Equivalent in value, but finish the requested simplification: extract square factors, rationalise the denominator, collect like radicals and omit zero terms.',
                    )
                  : t(
                      '重核主根与两根、被开方/分母条件、精确值、化简形式及指定小数位。',
                      'Recheck principal versus both roots, radicand/denominator conditions, exact values, simplified form and required decimal places.',
                    )
            }
          />
        </p>
      )}
    </div>
  );
}
function Meaning({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [both, setBoth] = useState(false),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(false),
    raw = rootCases[index]!,
    r = readRational(raw),
    roots = squareRoots(raw),
    positive = r[0] >= 0n,
    principal = positive ? radicalText(readRadical(`sqrt(${raw})`)!) : '',
    point = Math.sqrt(Math.max(0, Number(r[0]) / Number(r[1]))),
    points = positive
      ? both && point !== 0
        ? [
            { value: -point, label: `−√(${raw})` },
            { value: point, label: `√(${raw})` },
          ]
        : [{ value: point, label: `√(${raw})` }]
      : [];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '平方根问 x²=a 的全部实数解；算术平方根 √a 只取非负的一个。正数两个、零一个、负数没有实数平方根；此处不进入复数。',
            'Square roots are all real solutions of x²=a; the principal root √a is the nonnegative one. Positive a has two roots, zero one, negative a none in the reals; complex numbers are outside this lesson.',
          )}
        />
      </p>
      <div className="math-radical-controls">
        <label>
          <Text mode={mode} text={t('被开方数', 'Radicand')} />
          <select
            aria-label={label(mode, t('被开方数', 'Radicand'))}
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              setShown(false);
            }}
          >
            {rootCases.map((v, i) => (
              <option value={i} key={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            aria-label={label(
              mode,
              t('改问全部平方根', 'Ask for all square roots'),
            )}
            checked={both}
            onChange={(e) => {
              setBoth(e.target.checked);
              setShown(false);
            }}
          />
          <Text
            mode={mode}
            text={t('改问全部平方根', 'Ask for all square roots')}
          />
        </label>
      </div>
      <RealRootLine mode={mode} points={points} shown={shown} wide={wide} />
      <div className="math-radical-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t(
              '显示或隐藏根与原式检验',
              'Show or hide roots and substitution',
            )}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变数轴窗口', 'Change real-line window')}
          />
        </button>
      </div>
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('平方根核验', 'Square-root audit'))}
        >
          <Text
            mode={mode}
            text={
              !positive
                ? t(
                    '实数的平方不能为负，没有实数根；不画虚假的实数点。',
                    'A real square cannot be negative: no real roots and no false real-line point.',
                  )
                : t(
                    `x²=${raw} 的根为 ${roots.join(', ')}；√(${raw})=${principal}。两者不是同一个问题。`,
                    `x²=${raw} has roots ${roots.join(', ')}; √(${raw})=${principal}. These are different questions.`,
                  )
            }
          />
        </p>
      )}
      <Task
        key={`${index}:${both}`}
        mode={mode}
        answer={
          both || !positive
            ? {
                kind: 'root-set',
                radicand: raw,
                value: roots.join(',') || 'no real roots',
              }
            : { kind: 'radical', value: principal }
        }
        prompt={
          both || !positive
            ? t(
                `写 x²=${raw} 的全部实数根，逗号分隔，可用 ±；没有写“无实数根”。`,
                `Give all real roots of x²=${raw}, separated by commas or using ±; enter “no real roots” if none.`,
              )
            : t(
                `求 √(${raw}) 的精确非负值。`,
                `Find the exact nonnegative value √(${raw}).`,
              )
        }
      />
    </>
  );
}
const classText: Record<RealClass, LocalizedText> = {
  rational: t('有理数', 'rational'),
  irrational: t('无理数', 'irrational'),
  'not-real': t('非实数', 'not real'),
};
function RealNumbers({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(false),
    c = realCases[index]!,
    kind = radicalClass(c.expression),
    v = readRadical(c.expression),
    value = v
      ? [...v].reduce(
          (s, [k, r]) =>
            s + (Math.sqrt(Number(k)) * Number(r[0])) / Number(r[1]),
          0,
        )
      : 0;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '有理数可写成整数比，无理数是不能这样写的实数。循环小数有理；有限小数也有理。屏幕只显示有限位，不能凭“不整齐”或一个前缀证明无理。√2 无理的理由在正文，数轴近似不是证明。',
            'Rational numbers are integer ratios; irrational numbers are real but not integer ratios. Repeating and terminating decimals are rational. A finite display or untidy prefix cannot prove irrationality. The body explains √2’s irrationality; its approximate point is not a proof.',
          )}
        />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('待分类的精确数', 'Exact number to classify')}
        />
        <select
          aria-label={label(
            mode,
            t('待分类的精确数', 'Exact number to classify'),
          )}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          {realCases.map((v, i) => (
            <option value={i} key={v.display}>
              {v.display}
            </option>
          ))}
        </select>
      </label>
      <RealRootLine
        points={kind === 'not-real' ? [] : [{ value, label: c.display }]}
        mode={mode}
        wide={wide}
        shown={shown}
      />
      <div className="math-radical-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t(
              '显示或隐藏位置与分类依据',
              'Show or hide position and classification',
            )}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变数轴窗口', 'Change real-line window')}
          />
        </button>
      </div>
      {shown && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('实数分类核验', 'Real-number classification audit'),
          )}
        >
          {c.display}: <Text mode={mode} text={classText[kind]} />;{' '}
          <Text
            mode={mode}
            text={
              index === 4
                ? t(
                    '所写的是有限小数，不是 √2 的另一种精确写法。',
                    'This is a terminating decimal, not another exact spelling of √2.',
                  )
                : index === 3
                  ? t(
                      '0.(3) 表示三无限循环，等于 1/3；不是随意省略后续数字。',
                      '0.(3) explicitly repeats threes forever and equals 1/3; it is not an unspecified prefix.',
                    )
                  : kind === 'not-real'
                    ? t(
                        '负被开方数没有实数主根，不属于实数轴。',
                        'A negative radicand has no real principal root or real-line point.',
                      )
                    : t(
                        '先按定义或化简分类；图上只给近似位置。',
                        'Use the definition or simplification; the graph gives only approximate placement.',
                      )
            }
          />
        </p>
      )}
      <Task
        key={index}
        mode={mode}
        answer={{ kind: 'real-class', value: kind }}
        prompt={t(
          `分类 ${c.display}：有理数 / 无理数 / 非实数，也可用 rational / irrational / not-real。`,
          `Classify ${c.display}: rational, irrational or not-real.`,
        )}
      />
    </>
  );
}
function Simplify({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [negative, setNegative] = useState(false),
    [reveal, setReveal] = useState(false),
    r = simplifyCases[index]!,
    source = `${negative ? '-' : ''}sqrt(${r})`,
    value = radicalText(readRadical(source)!);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先找被开方数的平方因子，不把被开方数本身当边长。最简数值根式要无可提出平方因子、根号内无分母、分母无根号，同类项已合并，系数算完且省零项。允许等价的有理分数系数。',
            'Find square factors rather than treating the radicand as side length. A finished numerical radical has no extractable square factor, no fractional radicand or radical denominator, and collected terms with evaluated coefficients and no zero terms. Equivalent rational coefficients are allowed.',
          )}
        />
      </p>
      <div className="math-radical-controls">
        <label>
          <Text mode={mode} text={t('化简案例', 'Simplification case')} />
          <select
            aria-label={label(mode, t('化简案例', 'Simplification case'))}
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              setReveal(false);
            }}
          >
            {simplifyCases.map((v, i) => (
              <option value={i} key={v}>
                √({v})
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={negative}
            aria-label={label(
              mode,
              t('根号外加负号', 'Put a minus outside the root'),
            )}
            onChange={(e) => {
              setNegative(e.target.checked);
              setReveal(false);
            }}
          />
          <Text
            mode={mode}
            text={t('根号外加负号', 'Put a minus outside the root')}
          />
        </label>
      </div>
      <p>{source}</p>
      <RadicalTiles radicand={r} mode={mode} reveal={reveal} />
      <Task
        key={`${index}:${negative}`}
        mode={mode}
        answer={{ kind: 'radical', value, simplified: true }}
        prompt={t(
          '写完成化简的精确结果。允许 √ 或 sqrt(...)；不附单位、不用近似小数。',
          'Enter the finished exact simplification using √ or sqrt(...), without units or approximate decimals.',
        )}
      />
      <button className="math-button" onClick={() => setReveal(!reveal)}>
        <Text
          mode={mode}
          text={t('显示或隐藏因子核算', 'Show or hide the factor audit')}
        />
      </button>
      {reveal && (
        <p
          role="status"
          aria-label={label(mode, t('根式因子核验', 'Radical factor audit'))}
        >
          {source}={value};{' '}
          <Text
            mode={mode}
            text={t(
              '将结果平方并核外部符号。√(a²)=|a|；外面的负号不进入绝对值自动消失。',
              'Square the magnitude and check the outside sign. √(a²)=|a|; an existing outside minus does not vanish.',
            )}
          />
        </p>
      )}
    </>
  );
}
const operationZh = [
  ['√8=2√2；√18=3√2', '2√2+3√2=5√2'],
  ['√12=2√3；√27=3√3', '2√3−3√3=−√3'],
  ['3≥0；12≥0', '√(3×12)=√36=6'],
  ['18≥0；2>0', '√(18/2)=√9=3'],
  ['√2≠0', '1/√2=√2/2'],
  ['(√3+√2)(√3−√2)=3−2=1', '1/(√3+√2)=√3−√2'],
  ['二和三是不同的无平方因子被开方数', '√2+√3不能合并成√5'],
  ['负被开方数在实数范围无平方根', '不能忽略非负前提强套乘法规则'],
  ['√0=0', '不能除以零'],
];
function Operations({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [stage, setStage] = useState(0),
    c = operationCases[index]!,
    v = readRadical(c.source),
    value = v ? radicalText(v) : null;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '乘法规则要求两被开方数非负；除法还要求分母被开方数严格正。加减先化简再合并同类，不能把被开方数直接相加。分母有根式时，乘同一个非零数的比或用共轭。',
            'Products require nonnegative radicands; division also needs a strictly positive denominator radicand. Simplify before collecting like terms. Addition does not add radicands. Rationalise a denominator by a nonzero factor ratio or a conjugate.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('根式运算案例', 'Radical operation case')} />
        <select
          aria-label={label(mode, t('根式运算案例', 'Radical operation case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setStage(0);
          }}
        >
          {operationCases.map((v, i) => (
            <option value={i} key={v.source}>
              {v.source}
            </option>
          ))}
        </select>
      </label>
      <p className="math-lab-equation">{c.source}</p>
      <Task
        key={index}
        mode={mode}
        answer={
          value !== null
            ? { kind: 'radical', value, simplified: true }
            : { kind: 'proof-verdict', value: 'insufficient' }
        }
        prompt={
          value !== null
            ? t(
                '写完成化简的精确值，不附单位；不支持字母或三项以上的分母。',
                'Enter the finished exact value without units. Letters and denominators with more than two terms are unsupported.',
              )
            : t(
                '这里是否满足实数根式运算的条件？写充分/条件不足，或 sufficient / insufficient。',
                'Are the required real radical-operation conditions satisfied? Enter sufficient or insufficient.',
              )
        }
      />
      <div className="math-radical-actions">
        <button
          className="math-button"
          disabled={stage === 2}
          onClick={() => setStage(stage + 1)}
        >
          <Text
            mode={mode}
            text={t('下一条运算依据', 'Next operation justification')}
          />
        </button>
        <button
          className="math-button"
          disabled={!stage}
          onClick={() => setStage(stage - 1)}
        >
          <Text
            mode={mode}
            text={t('撤回运算依据', 'Undo operation justification')}
          />
        </button>
      </div>
      <ol>
        {c.steps.slice(0, stage).map((s, i) => (
          <li key={s} data-radical-step={i}>
            <Text mode={mode} text={t(operationZh[index]![i]!, s)} />
          </li>
        ))}
      </ol>
      <p>
        <Text
          mode={mode}
          text={t(
            '数值判对不代替解释条件。加法反例：√1+√1=2，而 √(1+1)=√2，不相等。',
            'A numerical match does not explain the conditions. Addition counterexample: √1+√1=2, while √(1+1)=√2, a different value.',
          )}
        />
      </p>
    </>
  );
}
function Estimate({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [places, setPlaces] = useState(1),
    [shown, setShown] = useState(false),
    r = estimateCases[index]!,
    b = rootBracket(r, places);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '从相邻平方夹住非负根，再比较舍入中点的平方。下界、精确值与按指定位数的近似值分别写；不把显示的小数当精确根式。',
            'Bound the nonnegative root using adjacent squares, then compare the squared rounding midpoint. Distinguish bounds, exact roots and rounded decimals; a displayed decimal is not the exact root.',
          )}
        />
      </p>
      <div className="math-radical-controls">
        <label>
          <Text
            mode={mode}
            text={t('待估算被开方数', 'Radicand to estimate')}
          />
          <select
            aria-label={label(
              mode,
              t('待估算被开方数', 'Radicand to estimate'),
            )}
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              setShown(false);
            }}
          >
            {estimateCases.map((v, i) => (
              <option value={i} key={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          <Text mode={mode} text={t('保留小数位数', 'Decimal places')} />
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            aria-label={label(mode, t('保留小数位数', 'Decimal places'))}
            value={places}
            onChange={(e) => {
              setPlaces(Number(e.target.value));
              setShown(false);
            }}
          />
          <output>{places}</output>
        </label>
      </div>
      <RootBoundsView radicand={r} places={places} mode={mode} shown={shown} />
      <Task
        key={`${index}:${places}`}
        mode={mode}
        answer={{ kind: 'root-rounded', radicand: r, places, value: b.rounded }}
        prompt={t(
          `把 √(${r}) 四舍五入为恰好 ${places} 位小数；若为零位只写整数，不写分数。`,
          `Round √(${r}) to exactly ${places} decimal places; at zero places enter an integer, not a fraction.`,
        )}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏平方界与舍入',
            'Show or hide squared bounds and rounding',
          )}
        />
      </button>
      {shown && (
        <div
          role="status"
          aria-label={label(mode, t('平方夹界核验', 'Squared-bound audit'))}
        >
          <p>
            {b.exact
              ? `√(${r})=${textR(b.lower)}`
              : `(${textR(b.lower)})² < ${r} < (${textR(b.upper)})²`}
          </p>
          <p>
            <Text
              mode={mode}
              text={t(
                `舍入中点 ${textR(b.midpoint)}，比较它的平方与 ${r}；结果约为 ${b.rounded}。`,
                `Compare the square of midpoint ${textR(b.midpoint)} with ${r}; the rounded result is ${b.rounded}.`,
              )}
            />
          </p>
          <p>
            <Text
              mode={mode}
              text={t(
                '等号只用于精确结果；舍入保留指定尾零。',
                'Use equality for exact results only and retain required trailing zeros when rounding.',
              )}
            />
          </p>
        </div>
      )}
    </>
  );
}
export function RadicalLab({
  kind,
  mode,
}: {
  kind: RadicalLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-radical-lab">
      {kind === 'radical-meaning' ? (
        <Meaning mode={mode} />
      ) : kind === 'radical-real' ? (
        <RealNumbers mode={mode} />
      ) : kind === 'radical-simplify' ? (
        <Simplify mode={mode} />
      ) : kind === 'radical-operations' ? (
        <Operations mode={mode} />
      ) : (
        <Estimate mode={mode} />
      )}
    </section>
  );
}
export function RadicalHookArt({
  kind,
  mode,
}: {
  kind: RadicalLabKind;
  mode: LanguageMode;
}) {
  const prompts: Record<RadicalLabKind, LocalizedText> = {
    'radical-meaning': t(
      '−3 的平方也是九，为什么 √9 仍只写三？',
      'If minus three also squares to nine, why is √9 only three?',
    ),
    'radical-real': t(
      '屏幕上显示1.414，足以证明它是无理数吗？',
      'Does a displayed 1.414 prove a number is irrational?',
    ),
    'radical-simplify': t(
      '面积十二的正方形，怎样用四块面积三的正方形解释边长？',
      'How do four area-three squares explain the side of an area-twelve square?',
    ),
    'radical-operations': t(
      '√1+√1 和 √(1+1) 会相等吗？',
      'Are √1+√1 and √(1+1) equal?',
    ),
    'radical-estimate': t(
      '1.41² 小于二、1.42² 大于二，能推出什么？',
      'What follows if 1.41² is below two and 1.42² above it?',
    ),
  };
  return (
    <p>
      <Text mode={mode} text={prompts[kind]} />
    </p>
  );
}
