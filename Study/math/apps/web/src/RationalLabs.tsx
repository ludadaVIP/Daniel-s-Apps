import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson } from './model';
import { Text } from './ui';
import { RationalLine } from './RationalVisuals';
import {
  rationalPair,
  rationalOperation,
  readRational,
  expressionTrace,
  mixedExpression,
  type MixedFamily,
} from './rationalModels';
export type RationalLabKind = Extract<Lesson['lab'], `rational-${string}`>;
export const isRationalLab = (kind: Lesson['lab']): kind is RationalLabKind =>
  kind.startsWith('rational-');
const label = (m: LanguageMode, text: LocalizedText) =>
  m === 'en' ? text.en : text.zh;
function Slider({
  mode,
  name,
  value,
  min = -6,
  max = 6,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min?: number;
  max?: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={label(mode, name)}
        min={min}
        max={max}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Denominator({
  mode,
  name,
  value,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={label(mode, name)}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      >
        {[2, 3, 4].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </label>
  );
}
function Assessment({
  mode,
  fields,
  gate = true,
}: {
  mode: LanguageMode;
  fields: { name: LocalizedText; answer: string }[];
  gate?: boolean;
}) {
  const [inputs, setInputs] = useState<Record<number, string>>({}),
    [status, setStatus] = useState<boolean | null>(null);
  return (
    <div className="math-rational-check">
      {fields.map((f, i) => (
        <label key={i}>
          <Text mode={mode} text={f.name} />
          <input
            type="text"
            aria-label={label(mode, f.name)}
            value={inputs[i] ?? ''}
            onChange={(e) => {
              setInputs({ ...inputs, [i]: e.target.value });
              setStatus(null);
            }}
          />
        </label>
      ))}
      <button
        className="math-button"
        onClick={() =>
          setStatus(
            gate &&
              fields.every(
                (f, i) =>
                  checkAnswer(inputs[i] ?? '', {
                    kind: 'number',
                    value: f.answer,
                    formats: ['decimal', 'fraction'],
                  }) === true,
              ),
          )
        }
      >
        <Text mode={mode} text={t('核对我的关系', 'Check my relationship')} />
      </button>
      {status !== null && (
        <p
          role="status"
          aria-label={label(mode, t('探索反馈', 'Workshop feedback'))}
        >
          <Text
            mode={mode}
            text={
              status
                ? t(
                    '数值与条件正确。再解释符号、单位长度与运算关系。',
                    'Values and conditions correct. Explain the signs, unit length and operation relationship.',
                  )
                : t(
                    '再检查符号、距离或单位分数；所有字段都要符合所问关系。可用分数保留精确值。',
                    'Recheck signs, distance or unit fractions; every field must match the requested relationship. Use fractions to keep values exact.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function SignTask({ mode, value }: { mode: LanguageMode; value: string }) {
  const [kind, setKind] = useState('unknown'),
    m = rationalPair(value, '0'),
    r = readRational(value),
    expected = r[0] < 0n ? 'negative' : r[0] > 0n ? 'positive' : 'zero';
  return (
    <>
      <label>
        <Text mode={mode} text={t('数的类别', 'Number category')} />
        <select
          aria-label={label(mode, t('数的类别', 'Number category'))}
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          {[
            ['unknown', t('先判断', 'Choose a category')],
            ['positive', t('正数', 'Positive')],
            ['negative', t('负数', 'Negative')],
            [
              'zero',
              t('零（既不正也不负）', 'Zero (neither positive nor negative)'),
            ],
          ].map(([id, text]) => (
            <option key={id as string} value={id as string}>
              {label(mode, text as LocalizedText)}
            </option>
          ))}
        </select>
      </label>
      <Assessment
        key={kind}
        mode={mode}
        fields={[
          { name: t('我写的相反数', 'My opposite'), answer: m.opposite },
        ]}
        gate={kind === expected}
      />
    </>
  );
}
function Signs({ mode }: { mode: LanguageMode }) {
  const [n, setN] = useState(-3),
    [d, setD] = useState(2),
    [show, setShow] = useState(false),
    value = `${n}/${d}`,
    m = rationalPair(value, '0');
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '分母为正时，分子决定符号。保持同一个单位长度，关于零反射得到相反数；零的相反数仍是零。相反数不是倒数。',
            'With a positive denominator, the numerator determines the sign. Reflect across zero without changing the unit to find the opposite. Zero is its own opposite. Opposite is different from reciprocal.',
          )}
        />
      </p>
      <div className="math-rational-controls">
        <Slider
          mode={mode}
          name={t('分子 n', 'Numerator n')}
          value={n}
          change={(v) => {
            setN(v);
            setShow(false);
          }}
        />
        <Denominator
          mode={mode}
          name={t('分母 d', 'Denominator d')}
          value={d}
          change={(v) => {
            setD(v);
            setShow(false);
          }}
        />
      </div>
      <RationalLine
        mode={mode}
        points={
          show
            ? [
                { label: 'A', value: m.a },
                { label: 'B', value: m.opposite },
              ]
            : [{ label: 'A', value: m.a }]
        }
      />
      <SignTask key={value} mode={mode} value={value} />
      <button className="math-button ghost" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏关于零的反射',
            'Show or hide reflection across zero',
          )}
        />
      </button>
      {show && (
        <p>
          <Text
            mode={mode}
            text={t(
              `A=${m.a}，相反数 ${m.opposite}，两者相加零；分母只是等分单位，不另变方向。`,
              `A=${m.a}, opposite ${m.opposite}; their sum is zero. The denominator partitions the unit without independently changing direction.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Distance({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(-3),
    [b, setB] = useState(1),
    [d, setD] = useState(2),
    m = rationalPair(`${a}/${d}`, `${b}/${d}`);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '绝对值是点到零的距离；两点距离是 |B−A|。B−A 的符号表示从 A 到 B 的方向，不能把它直接当非负距离。交换 A、B 会改变有向变化，但不改距离。',
            'Absolute value is distance to zero; pairwise distance is |B−A|. The sign of B−A indicates direction and is not itself a non-negative distance. Swapping A and B changes directed change but preserves distance.',
          )}
        />
      </p>
      <div className="math-rational-controls">
        <Slider
          mode={mode}
          name={t('A 的分子', 'Numerator of A')}
          value={a}
          change={setA}
        />
        <Slider
          mode={mode}
          name={t('B 的分子', 'Numerator of B')}
          value={b}
          change={setB}
        />
        <Denominator
          mode={mode}
          name={t('共同分母', 'Common denominator')}
          value={d}
          change={setD}
        />
      </div>
      <RationalLine
        mode={mode}
        points={[
          { label: 'A', value: m.a },
          { label: 'B', value: m.b },
        ]}
        segment={{ from: m.a, to: m.b }}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `有向变化 B−A=${m.delta}，A ${m.relation} B。位置、方向和距离是不同的量。`,
            `Directed change B−A=${m.delta}; A ${m.relation} B. Position, direction and distance are different quantities.`,
          )}
        />
      </p>
      <Assessment
        key={`${a}/${b}/${d}`}
        mode={mode}
        fields={[
          { name: t('我的 |A|', 'My |A|'), answer: m.absolute },
          { name: t('我的 A、B 距离', 'My A–B distance'), answer: m.distance },
        ]}
      />
    </>
  );
}
function Walk({ mode, subtract }: { mode: LanguageMode; subtract: boolean }) {
  const [a, setA] = useState(-3),
    [ad, setAd] = useState(4),
    [b, setB] = useState(subtract ? -1 : 1),
    [bd, setBd] = useState(2),
    [stage, setStage] = useState(false),
    m = rationalOperation(`${a}/${ad}`, `${b}/${bd}`, subtract ? '−' : '+'),
    delta = subtract ? m.opposite : m.b;
  const change = (setter: (n: number) => void) => (n: number) => {
    setter(n);
    setStage(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            subtract
              ? t(
                  '减去一个数等于加它的相反数。先分清运算符与数本身的负号，再把改写后的变化画成有向线段；撤销负变化会向右。',
                  'Subtracting a number equals adding its opposite. Distinguish the operation from the sign of the number, then draw the rewritten change; undoing a negative change moves right.',
                )
              : t(
                  '保留同一个单位：先通分成同样大小的小份，再把两个带符号的数量相加。数轴箭头表示变化，不把箭头长度当终点。',
                  'Keep one unit: use common-sized fractional parts before adding signed amounts. The arrow represents change; its length is different from the endpoint.',
                )
          }
        />
      </p>
      <div className="math-rational-controls">
        <Slider
          mode={mode}
          name={t('起点分子', 'Start numerator')}
          value={a}
          change={change(setA)}
        />
        <Denominator
          mode={mode}
          name={t('起点分母', 'Start denominator')}
          value={ad}
          change={change(setAd)}
        />
        <Slider
          mode={mode}
          name={t('第二数分子', 'Second numerator')}
          value={b}
          change={change(setB)}
        />
        <Denominator
          mode={mode}
          name={t('第二数分母', 'Second denominator')}
          value={bd}
          change={change(setBd)}
        />
      </div>
      <p className="math-rational-formula">
        ({m.a}) {m.op} ({m.b}) = ?
      </p>
      <button className="math-button" onClick={() => setStage(!stage)}>
        <Text
          mode={mode}
          text={
            subtract
              ? t(
                  '改写为加相反数并移动',
                  'Rewrite as adding the opposite and move',
                )
              : t('沿变化移到结果', 'Move along the change to the result')
          }
        />
      </button>
      <RationalLine
        mode={mode}
        points={
          stage
            ? [
                { label: 'A', value: m.a },
                { label: 'R', value: m.result! },
              ]
            : [{ label: 'A', value: m.a }]
        }
        segment={stage ? { from: m.a, to: m.result! } : undefined}
      />
      {stage && (
        <p>
          <Text
            mode={mode}
            text={t(
              `共同单位 1/${m.common}；起点 ${m.aParts}/${m.common}，第二数 ${m.bParts}/${m.common}。改写为 (${m.a}) + (${delta}) = ${m.result}；用结果减去变化可还原起点。`,
              `Common unit 1/${m.common}; start ${m.aParts}/${m.common}, second number ${m.bParts}/${m.common}. Rewrite as (${m.a}) + (${delta}) = ${m.result}; subtract the change from the result to recover the start.`,
            )}
          />
        </p>
      )}
      <Assessment
        key={`${a}/${ad}/${b}/${bd}`}
        mode={mode}
        fields={[
          ...(subtract
            ? [
                {
                  name: t('减数的相反数', 'Opposite of the subtrahend'),
                  answer: m.opposite,
                },
              ]
            : []),
          { name: t('我的结果', 'My result'), answer: m.result! },
        ]}
      />
    </>
  );
}
function Scale({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(-3),
    [ad, setAd] = useState(2),
    [b, setB] = useState(-2),
    [bd, setBd] = useState(3),
    [divide, setDivide] = useState(false),
    [show, setShow] = useState(false),
    m = rationalOperation(`${a}/${ad}`, `${b}/${bd}`, divide ? '÷' : '×');
  const change = (setter: (n: number) => void) => (n: number) => {
    setter(n);
    setShow(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '把乘法看成数的映射：按因子的绝对值缩放，到负因子时再关于零反射。这不是“负的份数”实物重复相加。除以非零数可乘其倒数；除数是零时不生成倒数或结果。',
            'View multiplication as a numerical map: scale by the factor’s magnitude and reflect across zero for a negative factor. This is not physical repeated addition of a negative number of copies. Divide by a nonzero number by multiplying its reciprocal; a zero divisor has no reciprocal and makes division undefined.',
          )}
        />
      </p>
      <div className="math-rational-controls">
        <Slider
          mode={mode}
          name={t('第一数分子', 'First numerator')}
          value={a}
          change={change(setA)}
        />
        <Denominator
          mode={mode}
          name={t('第一数分母', 'First denominator')}
          value={ad}
          change={change(setAd)}
        />
        <Slider
          mode={mode}
          name={t('第二数分子', 'Second numerator')}
          value={b}
          change={change(setB)}
        />
        <Denominator
          mode={mode}
          name={t('第二数分母', 'Second denominator')}
          value={bd}
          change={change(setBd)}
        />
        <label>
          <Text mode={mode} text={t('运算', 'Operation')} />
          <select
            aria-label={label(mode, t('运算', 'Operation'))}
            value={divide ? 'divide' : 'multiply'}
            onChange={(e) => {
              setDivide(e.target.value === 'divide');
              setShow(false);
            }}
          >
            <option value="multiply">×</option>
            <option value="divide">÷</option>
          </select>
        </label>
      </div>
      <p className="math-rational-formula">
        ({m.a}) {m.op} ({m.b}) = ?
      </p>
      {m.result === null ? (
        <p
          role="status"
          aria-label={label(mode, t('定义域反馈', 'Domain feedback'))}
        >
          <Text
            mode={mode}
            text={t(
              '除数为零：商未定义。若被除数非零，0×q 不可能等于它；若也为零，任意 q 都满足，不能确定唯一商。',
              'Zero divisor: the quotient is undefined. With a nonzero dividend, 0×q cannot equal it; with zero dividend, every q works, so no unique quotient is determined.',
            )}
          />
        </p>
      ) : (
        <>
          <button className="math-button" onClick={() => setShow(!show)}>
            <Text
              mode={mode}
              text={t('显示或隐藏缩放结果', 'Show or hide the scaling result')}
            />
          </button>
          <RationalLine
            mode={mode}
            points={
              show
                ? [
                    { label: 'A', value: m.a },
                    { label: 'R', value: m.result },
                  ]
                : [{ label: 'A', value: m.a }]
            }
          />
          {show && (
            <p>
              <Text
                mode={mode}
                text={t(
                  `映射因子 ${m.scale}，结果 ${m.result}。${divide ? '核验：商×原除数应等于被除数。' : '负因子反射，正因子不反射，零因子把全部位置映到零。'}`,
                  `Mapping factor ${m.scale}, result ${m.result}. ${divide ? 'Check: quotient × original divisor must recover the dividend.' : 'Negative factors reflect, positive factors do not, and zero maps every position to zero.'}`,
                )}
              />
            </p>
          )}
          <Assessment
            key={`${a}/${ad}/${b}/${bd}/${divide}`}
            mode={mode}
            fields={[{ name: t('我的结果', 'My result'), answer: m.result }]}
          />
        </>
      )}
    </>
  );
}
const mixedNames: { id: MixedFamily; name: LocalizedText }[] = [
  { id: 'fractions', name: t('分数与括号', 'Fractions and brackets') },
  {
    id: 'association',
    name: t('同级从左到右', 'Equal precedence: left to right'),
  },
  { id: 'powers', name: t('负号与乘方', 'Minus signs and powers') },
  { id: 'zero', name: t('分母先算成零', 'Denominator becoming zero') },
];
function Mixed({ mode }: { mode: LanguageMode }) {
  const [family, setFamily] = useState<MixedFamily>('fractions'),
    [a, setA] = useState(2),
    [brackets, setBrackets] = useState(false),
    [stage, setStage] = useState(0),
    trace = expressionTrace(mixedExpression(family, a, brackets));
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先处理括号内的子式，再乘方、乘除、加减；同级按原顺序从左到右。外加负号不是平方的底数，括号可能改变结构。每次只替换一处已算完的子式，保留其余整个算式。',
            'Resolve bracketed subexpressions, then powers, multiplication/division and addition/subtraction; equal precedence follows the original left-to-right structure. An outside minus is not part of a square’s base. Replace one completed subexpression at a time while preserving the whole remaining expression.',
          )}
        />
      </p>
      <div className="math-rational-controls">
        <label>
          <Text mode={mode} text={t('算式家族', 'Expression family')} />
          <select
            aria-label={label(mode, t('算式家族', 'Expression family'))}
            value={family}
            onChange={(e) => {
              setFamily(e.target.value as MixedFamily);
              setStage(0);
            }}
          >
            {mixedNames.map((f) => (
              <option key={f.id} value={f.id}>
                {label(mode, f.name)}
              </option>
            ))}
          </select>
        </label>
        <Slider
          mode={mode}
          name={t('参数 a', 'Parameter a')}
          value={a}
          min={2}
          max={6}
          change={(n) => {
            setA(n);
            setStage(0);
          }}
        />
        {(family === 'powers' || family === 'association') && (
          <button
            className="math-button ghost"
            aria-pressed={brackets}
            onClick={() => {
              setBrackets(!brackets);
              setStage(0);
            }}
          >
            <Text
              mode={mode}
              text={t(
                '切换改变结构的括号',
                'Toggle brackets that change the structure',
              )}
            />
          </button>
        )}
      </div>
      <p className="math-rational-formula" data-expression-initial>
        {trace.initial}
      </p>
      <button
        className="math-button"
        disabled={stage >= trace.rows.length}
        onClick={() => setStage(stage + 1)}
      >
        <Text
          mode={mode}
          text={t('展开下一步等值计算', 'Reveal the next equivalent step')}
        />
      </button>
      <ol className="math-rational-trace">
        {trace.rows.slice(0, stage).map((r, i) => (
          <li key={i} data-expression-step>
            <p>
              <Text mode={mode} text={t('本步子式', 'This subexpression')} />{' '}
              {r.calculation}
            </p>
            <p className="math-rational-formula">
              {r.before} →{' '}
              {r.undefined ? (
                <Text
                  mode={mode}
                  text={t('未定义（出现零除数）', 'Undefined (zero divisor)')}
                />
              ) : (
                r.after
              )}
            </p>
          </li>
        ))}
      </ol>
      {trace.result === null ? (
        <p
          role="status"
          aria-label={label(mode, t('定义域反馈', 'Domain feedback'))}
        >
          <Text
            mode={mode}
            text={t(
              '括号先得到零，接下来将除以零：整个算式未定义，不能把它当零。',
              'The denominator evaluates to zero, so the following division makes the whole expression undefined, not zero.',
            )}
          />
        </p>
      ) : (
        <Assessment
          key={`${family}/${a}/${brackets}`}
          mode={mode}
          fields={[
            {
              name: t('我的精确结果', 'My exact result'),
              answer: trace.result,
            },
          ]}
        />
      )}
    </>
  );
}
export function RationalLab({
  kind,
  mode,
}: {
  kind: RationalLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-rational-lab">
      {kind === 'rational-sign' ? (
        <Signs mode={mode} />
      ) : kind === 'rational-distance' ? (
        <Distance mode={mode} />
      ) : kind === 'rational-add' ? (
        <Walk mode={mode} subtract={false} />
      ) : kind === 'rational-subtract' ? (
        <Walk mode={mode} subtract />
      ) : kind === 'rational-scale' ? (
        <Scale mode={mode} />
      ) : (
        <Mixed mode={mode} />
      )}
    </div>
  );
}
export function RationalHookArt({
  kind,
  mode,
}: {
  kind: RationalLabKind;
  mode: LanguageMode;
}) {
  const symbols = {
    'rational-sign': '−3/2 ↔ ?',
    'rational-distance': '|−3/2| · |1/2−(−3/2)| = ?',
    'rational-add': '−3/4 + 1/2 = ?',
    'rational-subtract': '−3/4 − (−1/2) = ?',
    'rational-scale': '(−3/2) × (−2/3) = ?',
    'rational-mixed': '−2² · (−2)² · ?',
  };
  return (
    <div className="math-rational-hook">
      <strong>{symbols[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '同一单位，精确数量，完整理由。',
            'One unit, exact quantities, complete reasons.',
          )}
        />
      </p>
    </div>
  );
}
