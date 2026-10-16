import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import {
  equalPolynomial,
  polynomialText,
  monomialText,
} from './polynomialModels';
import { textR } from './algebraModels';
import {
  commonCases,
  commonFactor,
  inspectCommonFactor,
  quadraticSearch,
  checkingCases,
  inspectFactorProposal,
  factorProbe,
} from './factorModels';
import { ProductArea } from './IdentityVisuals';
export type FactorLabKind = Extract<Lesson['lab'], `factor-${string}`>;
export const isFactorLab = (kind: Lesson['lab']): kind is FactorLabKind =>
  kind.startsWith('factor-');
const label = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Slider({
  mode,
  name,
  value,
  min,
  max,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={label(mode, name)}
        value={value}
        min={min}
        max={max}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Task({
  mode,
  value,
  variables = ['x'],
  expand = false,
}: {
  mode: LanguageMode;
  value: string;
  variables?: string[];
  expand?: boolean;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false),
    name = expand
      ? t('我的展开回查式', 'My expanded check')
      : t('我的因式乘积', 'My product of factors'),
    answer: AnswerSpec = expand
      ? {
          kind: 'polynomial',
          value,
          variables,
          collected: true,
          finishedProduct: true,
        }
      : { kind: 'factorisation', value, variables };
  const correct = checkAnswer(input, answer),
    equivalent = equalPolynomial(input, value, variables);
  return (
    <div
      className="math-factor-task"
      role="group"
      aria-label={label(mode, name)}
    >
      <label>
        <Text mode={mode} text={name} />
        <input
          type="text"
          aria-label={label(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <p>
        <Text
          mode={mode}
          text={
            expand
              ? t(
                  '此处展开合并，完成乘积，每字母用一个幂。',
                  'Expand and collect here, finishing products and writing each letter as one power.',
                )
              : t(
                  '在整数系数范围内分解完整，提出各数公因子；因式次序可换，可用平方。不附等号或零点。',
                  'Factor completely over integer coefficients, extracting numerical content. Reorder factors or use powers; omit equal signs and roots.',
                )
          }
        />
      </p>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对我的结果', 'Check my result')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('分解反馈', 'Factor feedback'))}
        >
          <Text
            mode={mode}
            text={
              correct
                ? t(
                    '关系与所求形式符合。用完整展开解释每项来源。',
                    'The relationship and requested form match. Explain every term through complete expansion.',
                  )
                : equivalent
                  ? t(
                      '已经等值，但尚未完成所求分解或展开。检查剩余公因子、可继续分解的括号或未合并项。',
                      'Already equivalent, but the requested factorisation or expansion is unfinished. Check remaining common factors, reducible brackets or uncollected terms.',
                    )
                  : t(
                      '重新核对系数、符号、中间项与常数。原式与结果必须是一般恒等关系。',
                      'Recheck coefficients, signs, middle terms and constants. The result must be identical to the source expression.',
                    )
            }
          />
        </p>
      )}
    </div>
  );
}
function Common({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [candidate, setCandidate] = useState<string | null>(null),
    [shown, setShown] = useState(false),
    m = commonFactor(commonCases[index]!),
    candidates = [
      ['3x', '6x', '6x^2'],
      ['3', '3x', '3x^2'],
      ['2xy', '4xy', '4x^2y'],
      ['3x', '3x^2', '3x^3'],
    ][index]!,
    c = candidate ? inspectCommonFactor(m.terms, candidate) : null;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '数系数取最大公因数；每个字母只取所有项共同拥有的最低次数。每一项都要能写成同一因子乘余项，不能只看第一项。',
            'Take the greatest common divisor of numerical coefficients and the minimum shared exponent of each letter. Every term, not just the first, must contain the factor.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('公因子实验', 'Common-factor experiment')} />
        <select
          aria-label={label(mode, t('公因子实验', 'Common-factor experiment'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setCandidate(null);
            setShown(false);
          }}
        >
          {commonCases.map((v, i) => (
            <option key={i} value={i}>
              {commonFactor(v).source}
            </option>
          ))}
        </select>
      </label>
      <p className="math-factor-expression">{m.source}</p>
      <div className="math-factor-candidates">
        {candidates.map((v) => (
          <button
            key={v}
            className="math-button secondary"
            onClick={() => setCandidate(v)}
          >
            <Text
              mode={mode}
              text={t(`检查公因子 ${v}`, `Test common factor ${v}`)}
            />
          </button>
        ))}
      </div>
      {c && (
        <p
          role="status"
          aria-label={label(mode, t('公因子观察', 'Common-factor observation'))}
        >
          <Text
            mode={mode}
            text={
              !c.valid
                ? t(
                    '不是每项的整数单项式因子。不要靠除字母引入分母。',
                    'It is not an integer monomial factor of every term. Do not introduce letter denominators.',
                  )
                : c.greatest
                  ? t(
                      '它覆盖全部项，且已取最大数公因数和共同最低次数。',
                      'It divides every term and uses the greatest numerical divisor and minimum shared exponents.',
                    )
                  : t(
                      '每项都含它，但还有共同因子留在括号里，应继续提出。',
                      'It divides every term, but a common factor remains inside and must also be extracted.',
                    )
            }
          />
        </p>
      )}
      <Task key={index} mode={mode} value={m.result} variables={['x', 'y']} />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('展开或收起逐项余项', 'Show or hide term remainders')}
        />
      </button>
      {shown && (
        <div className="math-factor-records">
          {m.terms.map((term, i) => (
            <p key={i} data-common-remainder={i}>
              {polynomialText(
                new Map([[term.key, [BigInt(term.coefficient), 1n]]]),
              )}{' '}
              = ({m.factor}) × (
              {polynomialText(
                new Map([
                  [
                    m.quotients[i]!.key,
                    [BigInt(m.quotients[i]!.coefficient), 1n],
                  ],
                ]),
              )}
              )
            </p>
          ))}
        </div>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '分解是恒等改写，不是将等式两边除 x；x=0 仍保留，不是在求零点。',
            'Factorisation is an identical rewrite, not division of an equation by x. The value x=0 is retained; this is not solving for roots.',
          )}
        />
      </p>
    </>
  );
}
const differences = [
  { source: 'x²−9', result: '(x-3)(x+3)', split: '(x−3)(x+3)', area: true },
  { source: '4x²−25', result: '(2x-5)(2x+5)', split: '(2x−5)(2x+5)' },
  { source: 'x⁴−16', result: '(x-2)(x+2)(x^2+4)', split: '(x²−4)(x²+4)' },
  { source: '2x²−18', result: '2(x-3)(x+3)', split: '2(x²−9)' },
  { source: 'x²+9', result: null, split: null },
];
function Difference({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    m = differences[index]!;
  return (
    <>
      <label>
        <Text
          mode={mode}
          text={t('平方差实验', 'Difference-of-squares experiment')}
        />
        <select
          aria-label={label(
            mode,
            t('平方差实验', 'Difference-of-squares experiment'),
          )}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          {differences.map((v, i) => (
            <option key={i} value={i}>
              {v.source}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            '先提公因子，再识别两个整体的平方相减，写成和乘差；检查新因式是否还能分解。范围是整数系数，不把平方和当平方差。',
            'Extract common factors first, identify a difference of two whole squares, then form conjugate factors. Inspect the new factors again. Work over integer coefficients; a sum of squares is different.',
          )}
        />
      </p>
      <p className="math-factor-expression">{m.source}</p>
      {m.result ? (
        <>
          <Task key={index} mode={mode} value={m.result} />
          <button className="math-button" onClick={() => setShown(!shown)}>
            <Text
              mode={mode}
              text={t('展开或收起第一步', 'Show or hide the first step')}
            />
          </button>
          {shown && (
            <p data-first-factor-step>
              {m.split}
              <Text
                mode={mode}
                text={t(
                  '；这一步未必完成，检查每个括号。x²+4 在整数范围不继续分解。',
                  '; this step may be unfinished. Inspect each bracket. x²+4 does not split further over the integers.',
                )}
              />
            </p>
          )}
          {m.area && (
            <ProductArea
              mode={mode}
              rows={[{ label: 'x−3', value: 2 }]}
              columns={[{ label: 'x+3', value: 8 }]}
            />
          )}
        </>
      ) : (
        <p
          role="status"
          aria-label={label(mode, t('结构观察', 'Structure observation'))}
        >
          <Text
            mode={mode}
            text={t(
              '这里是平方和，不满足 A²−B²。不能写 (x−3)(x+3)，它展开为 x²−9。在本课整数系数范围内不作这种分解。',
              'This is a sum of squares, not A²−B². (x−3)(x+3) expands to x²−9. This expression does not have that integer factorisation.',
            )}
          />
        </p>
      )}
    </>
  );
}
function Squares({ mode }: { mode: LanguageMode }) {
  const [middle, setMiddle] = useState(6),
    [shown, setShown] = useState(false),
    perfect = Math.abs(middle) === 6,
    result = middle === 6 ? '(x+3)^2' : '(x-3)^2';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '调查 x²+mx+9。两端平方还不够，中项必须恰为 ±2·x·3。先检查三项，再决定能否写成一个平方。',
            'Investigate x²+mx+9. Square ends are insufficient: the middle must be exactly ±2·x·3. Check all three terms before using one square.',
          )}
        />
      </p>
      <Slider
        mode={mode}
        name={t('中项系数 m', 'Middle coefficient m')}
        min={-6}
        max={6}
        value={middle}
        change={(n) => {
          setMiddle(n);
          setShown(false);
        }}
      />
      <p className="math-factor-expression">x² + ({middle})x + 9</p>
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('比较两个候选平方', 'Compare both candidate squares')}
        />
      </button>
      {shown && (
        <div className="math-factor-records">
          <p>(x+3)² = x² + 6x + 9</p>
          <p>(x−3)² = x² − 6x + 9</p>
        </div>
      )}
      {perfect ? (
        <Task key={middle} mode={mode} value={result} />
      ) : (
        <p
          role="status"
          aria-label={label(mode, t('结构观察', 'Structure observation'))}
        >
          <Text
            mode={mode}
            text={t(
              '中项不符，本式不是本实验的完全平方。不能改动给定中项来套公式；这不等于对所有范围宣称“无法分解”。',
              'The middle term does not match either square. Do not change the given coefficient to fit a formula. This statement is not a universal claim of irreducibility.',
            )}
          />
        </p>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '负中项对应差的平方，末项仍为正。复合首项需连系数一起平方；若三项有共同整数因子，先提出再识别。',
            'A negative middle corresponds to a squared difference with a positive final square. Square coefficients with whole terms; extract common integer content before recognising the pattern.',
          )}
        />
      </p>
    </>
  );
}
function PairTask({
  mode,
  p,
  q,
}: {
  mode: LanguageMode;
  p: number;
  q: number;
}) {
  const [r, setR] = useState(''),
    [s, setS] = useState(''),
    [checked, setChecked] = useState(false),
    valid = /^[+-]?\d{1,3}$/.test(r.trim()) && /^[+-]?\d{1,3}$/.test(s.trim()),
    a = Number(r),
    b = Number(s);
  return (
    <div
      className="math-factor-task"
      role="group"
      aria-label={label(mode, t('整数配对检查', 'Integer-pair check'))}
    >
      {[
        [t('第一个整数 r', 'First integer r'), r, setR],
        [t('第二个整数 s', 'Second integer s'), s, setS],
      ].map(([title, value, set], i) => (
        <label key={i}>
          <Text mode={mode} text={title as LocalizedText} />
          <input
            type="text"
            aria-label={label(mode, title as LocalizedText)}
            value={value as string}
            onChange={(e) => {
              (set as (v: string) => void)(e.target.value);
              setChecked(false);
            }}
          />
        </label>
      ))}
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('检查我的整数对', 'Check my pair')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('配对反馈', 'Pair feedback'))}
        >
          <Text
            mode={mode}
            text={
              !valid
                ? t(
                    '此任务需两个有符号整数。',
                    'This task needs two signed integers.',
                  )
                : t(
                    `积 ${a * b}，目标 ${q}；和 ${a + b}，目标 ${p}。${a * b === q && a + b === p ? '两项条件都符合。' : '两项条件必须同时符合。'}`,
                    `Product ${a * b}, target ${q}; sum ${a + b}, target ${p}. ${a * b === q && a + b === p ? 'Both conditions match.' : 'Both conditions must match together.'}`,
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Quadratics({ mode }: { mode: LanguageMode }) {
  const [p, setP] = useState(5),
    [q, setQ] = useState(6),
    [shown, setShown] = useState(false),
    m = quadraticSearch(p, q),
    key = `${p}/${q}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '只研究首项系数为一的整数二次式 x²+px+q。若分成 (x+r)(x+s)，必须同时 rs=q、r+s=p。',
            'Study monic integer quadratics x²+px+q. Factors (x+r)(x+s) require both rs=q and r+s=p.',
          )}
        />
      </p>
      <Slider
        mode={mode}
        name={t('一次项系数 p', 'Linear coefficient p')}
        value={p}
        min={-8}
        max={8}
        change={(n) => {
          setP(n);
          setShown(false);
        }}
      />
      <Slider
        mode={mode}
        name={t('常数 q', 'Constant q')}
        value={q}
        min={-12}
        max={12}
        change={(n) => {
          setQ(n);
          setShown(false);
        }}
      />
      <p className="math-factor-expression">{m.source}</p>
      <PairTask key={key} mode={mode} p={p} q={q} />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('展开或收起整数乘积对', 'Show or hide integer product pairs')}
        />
      </button>
      {shown && (
        <>
          {q === 0 ? (
            <p>
              <Text
                mode={mode}
                text={t(
                  '常数为零先提出 x，余 x+p；这里直接列同时满足积与和的零配对，不声称列举无穷多个积零整数对。',
                  'With zero constant, extract x first, leaving x+p. This lists the zero pair meeting both constraints, not infinitely many product-zero pairs.',
                )}
              />
            </p>
          ) : null}
          <table>
            <caption>
              <Text
                mode={mode}
                text={t('整数配对与和', 'Integer pairs and sums')}
              />
            </caption>
            <thead>
              <tr>
                <th>r</th>
                <th>s</th>
                <th>r+s</th>
                <th>rs</th>
              </tr>
            </thead>
            <tbody>
              {m.pairs.map((v) => (
                <tr
                  key={`${v.r}/${v.s}`}
                  data-integer-pair={`${v.r},${v.s}`}
                  data-pair-hit={v.hit}
                >
                  <td>{v.r}</td>
                  <td>{v.s}</td>
                  <td>
                    {v.sum}
                    {v.hit ? ' ✓' : ''}
                  </td>
                  <td>{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {m.factor ? (
        <Task key={`task/${key}`} mode={mode} value={m.factor} />
      ) : (
        <p
          role="status"
          aria-label={label(
            mode,
            t('整数范围观察', 'Integer-scope observation'),
          )}
        >
          <Text
            mode={mode}
            text={t(
              '在此整数系数、首项为 x² 的范围内，没有同时满足积与和的整数对，不能写成两个整数一次因式；这不是说在其他数域永远不能分解。',
              'No integer pair meets both constraints in this monic integer setting. It has no two integer linear factors; this is not a claim about every other number domain.',
            )}
          />
        </p>
      )}
      {shown && m.match && m.match.r >= 0 && m.match.s >= 0 && (
        <ProductArea
          mode={mode}
          rows={[
            { label: 'x', value: 4 },
            { label: 'r', value: m.match.r },
          ]}
          columns={[
            { label: 'x', value: 4 },
            { label: 's', value: m.match.s },
          ]}
        />
      )}
    </>
  );
}
function Checking({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [input, setInput] = useState(checkingCases[0]!.proposal),
    [checked, setChecked] = useState(false),
    [probe, setProbe] = useState<number | null>(null),
    m = checkingCases[index]!,
    report = checked ? inspectFactorProposal(m.source, m.result, input) : null,
    p = probe === null ? null : factorProbe(m.source, input, probe);
  return (
    <>
      <label>
        <Text mode={mode} text={t('回查实验', 'Expansion-check experiment')} />
        <select
          aria-label={label(mode, t('回查实验', 'Expansion-check experiment'))}
          value={index}
          onChange={(e) => {
            const i = Number(e.target.value);
            setIndex(i);
            setInput(checkingCases[i]!.proposal);
            setChecked(false);
            setProbe(null);
          }}
        >
          {checkingCases.map((v, i) => (
            <option key={i} value={i}>
              {v.source}
            </option>
          ))}
        </select>
      </label>
      <p className="math-factor-expression">{m.source}</p>
      <label>
        <Text
          mode={mode}
          text={t('待核对的分解主张', 'Proposed factorisation')}
        />
        <input
          type="text"
          aria-label={label(
            mode,
            t('待核对的分解主张', 'Proposed factorisation'),
          )}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
            setProbe(null);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('展开我的主张', 'Expand my proposal')} />
      </button>
      {report && (
        <>
          <p data-proposal-expansion>{report.expanded ?? '?'}</p>
          <p
            role="status"
            aria-label={label(mode, t('回查反馈', 'Expansion-check feedback'))}
          >
            <Text
              mode={mode}
              text={
                report.status === 'invalid'
                  ? t(
                      '表达式不在本课受限语法内；只用给定字母和整式运算。',
                      'The expression is outside the supported grammar; use the given letter and polynomial operations.',
                    )
                  : report.status === 'different'
                    ? t(
                        '展开系数不同，分解关系错误。逐类查平方项、一次项和常数。',
                        'Expanded coefficients differ, so the relationship is false. Compare square, linear and constant terms.',
                      )
                    : report.status === 'unfinished'
                      ? t(
                          '展开已相同，但分解尚未完成；继续提公因子或分解括号。',
                          'Expansion matches, but factorisation is unfinished; extract remaining common factors or split reducible brackets.',
                        )
                      : t(
                          '展开恒等且整数范围分解完整，仍需说明结构。',
                          'Expansion is identical and the integer factorisation is complete. Explain the structure.',
                        )
              }
            />
          </p>
          {report.coefficients.length > 0 && (
            <table>
              <caption>
                <Text
                  mode={mode}
                  text={t(
                    '按字母部分核系数',
                    'Compare coefficients by variable part',
                  )}
                />
              </caption>
              <thead>
                <tr>
                  <th>
                    <Text mode={mode} text={t('字母部分', 'Part')} />
                  </th>
                  <th>
                    <Text mode={mode} text={t('原式', 'Source')} />
                  </th>
                  <th>
                    <Text mode={mode} text={t('主张', 'Proposal')} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.coefficients.map((v) => (
                  <tr key={v.key}>
                    <th>{monomialText(v.key) || '1'}</th>
                    <td>{textR(v.source)}</td>
                    <td>{textR(v.proposed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {[0, 1].map((x) => (
        <button
          key={x}
          className="math-button secondary"
          onClick={() => setProbe(x)}
        >
          <Text mode={mode} text={t(`检验 x=${x}`, `Test x=${x}`)} />
        </button>
      ))}
      {p && (
        <p
          role="status"
          aria-label={label(mode, t('代入观察', 'Substitution observation'))}
        >
          <Text
            mode={mode}
            text={t(
              `x=${p.x}，原式 ${p.source ?? '无效'}，主张 ${p.proposal ?? '无效'}。相同不能证明恒等，不同则可否证；完整系数回查才覆盖所有取值。`,
              `At x=${p.x}, source ${p.source ?? 'invalid'}, proposal ${p.proposal ?? 'invalid'}. Agreement cannot prove identity; disagreement disproves it. A complete coefficient check covers every input.`,
            )}
          />
        </p>
      )}
      <Task key={index} mode={mode} value={m.result} />
      <Task key={`expand/${index}`} mode={mode} value={m.source} expand />
    </>
  );
}
export function FactorLab({
  kind,
  mode,
}: {
  kind: FactorLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-factor-lab">
      {kind === 'factor-common' ? (
        <Common mode={mode} />
      ) : kind === 'factor-difference' ? (
        <Difference mode={mode} />
      ) : kind === 'factor-square' ? (
        <Squares mode={mode} />
      ) : kind === 'factor-quadratic' ? (
        <Quadratics mode={mode} />
      ) : (
        <Checking mode={mode} />
      )}
    </div>
  );
}
export function FactorHookArt({
  kind,
  mode,
}: {
  kind: FactorLabKind;
  mode: LanguageMode;
}) {
  const words = {
    'factor-common': 'WHAT DOES EVERY TERM SHARE ?',
    'factor-difference': 'TWO SQUARES · DIFFERENCE → ?',
    'factor-square': 'SQUARE ENDS · WHICH MIDDLE ?',
    'factor-quadratic': 'PRODUCT AND SUM · BOTH ?',
    'factor-check': 'SAME EXPANSION · FINISHED FACTORS ?',
  };
  return (
    <div className="math-factor-hook">
      <strong>{words[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '结构 → 因式乘积 → 完整展开 → 范围内完成',
            'Structure → factors → full expansion → completion within scope',
          )}
        />
      </p>
    </div>
  );
}
