import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import {
  finiteSet,
  setText,
  subset,
  operateSets,
  conditionCases,
  conditionClass,
  counterexample,
  absoluteSolution,
  unionText,
  unionContains,
  type SetOperation,
} from './logicModels';
import { readRational } from './rationalModels';
import { SetRegions, UnionLine } from './LogicVisuals';
export type LogicLabKind = Extract<Lesson['lab'], `logic-${string}`>;
export const isLogicLab = (kind: Lesson['lab']): kind is LogicLabKind =>
  kind.startsWith('logic-');
const word = (mode: LanguageMode, v: LocalizedText) =>
  mode === 'en' ? v.en : v.zh;
function Task({
  mode,
  prompt,
  answer,
}: {
  mode: LanguageMode;
  prompt: LocalizedText;
  answer: AnswerSpec;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-logic-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text mode={mode} text={t('我的预测', 'My prediction')} />
        <input
          aria-label={word(mode, t('我的预测', 'My prediction'))}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对预测', 'Check prediction')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={word(mode, t('预测反馈', 'Prediction feedback'))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(input, answer)
                ? t(
                    '预测符合。再解释定义、范围与边界；理由由家长核对。',
                    'The prediction matches. Explain definitions, domain and boundaries; a parent reviews the reasoning.',
                  )
                : t(
                    '再核对象、量词和端点。一个符合的例子不证明全称结论。',
                    'Recheck objects, quantifiers and endpoints. One confirming example does not prove a universal claim.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Pick({
  mode,
  name,
  value,
  options,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  options: [string, LocalizedText][];
  change: (s: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={word(mode, name)}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {options.map(([v, label]) => (
          <option key={v} value={v}>
            {word(mode, label)}
          </option>
        ))}
      </select>
    </label>
  );
}
function Elements({ mode }: { mode: LanguageMode }) {
  const [source, setSource] = useState('0,1,1,2'),
    [query, setQuery] = useState('0'),
    [relation, setRelation] = useState('element'),
    [show, setShow] = useState(false);
  const a = finiteSet(source)!,
    candidate = finiteSet(query)!,
    answer: AnswerSpec = {
      kind: 'logic-code',
      value:
        relation === 'element'
          ? a.includes(query)
            ? 'in'
            : 'out'
          : subset(candidate, a)
            ? 'subset'
            : 'not-subset',
    };
  const key = `${setText(a)}|${query}|${relation}`;
  return (
    <>
      <Pick
        mode={mode}
        name={t('集合原始清单', 'Source list')}
        value={source}
        change={(s) => {
          setSource(s);
          setShow(false);
        }}
        options={[
          ['0,1,1,2', t('0,1,1,2（先去重复）', '0,1,1,2 (remove repetition)')],
          ['2,0,1', t('2,0,1（换序）', '2,0,1 (reordered)')],
          ['{}', t('空集', 'Empty set')],
          ['0', t('只有0', 'Only zero')],
        ]}
      />
      <Pick
        mode={mode}
        name={t('关系类型', 'Relation type')}
        value={relation}
        change={setRelation}
        options={[
          ['element', t('元素属于？', 'Element membership?')],
          ['subset', t('集合包含于？', 'Subset relation?')],
        ]}
      />
      <Pick
        mode={mode}
        name={t('待查数字或子集清单', 'Candidate number or subset list')}
        value={query}
        change={setQuery}
        options={[
          ['0', t('0 或 {0}', '0 or {0}')],
          ['3', t('3 或 {3}', '3 or {3}')],
          ['{}', t('空集（切到子集关系）', 'Empty set (use subset relation)')],
        ]}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `原始记录 ${source}；集合A=${setText(a)}。本模型的元素只有有理数，未使用嵌套集合。`,
            `Raw record ${source}; set A=${setText(a)}. Elements in this model are rational numbers; nested sets are not used.`,
          )}
        />
      </p>
      {relation === 'element' && query === '{}' ? (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '此处“空集”是集合对象，请切到子集关系。一般数学中集合也能作元素，但此数字集合没有集合元素。',
              'Empty set is a set object here; switch to subset relation. Sets can be elements in general, but this numerical set has no set-valued elements.',
            )}
          />
        </p>
      ) : (
        <Task
          key={key}
          mode={mode}
          answer={answer}
          prompt={t(
            relation === 'element'
              ? `${query} __ A：写in/out（∈/∉）。`
              : `${setText(candidate)} __ A：写subset/not-subset（⊆/⊈）。`,
            relation === 'element'
              ? `${query} __ A: enter in/out (∈/∉).`
              : `${setText(candidate)} __ A: enter subset/not-subset (⊆/⊈).`,
          )}
        />
      )}
      <Task
        key={`${setText(a)}-count`}
        mode={mode}
        answer={{ kind: 'number', value: String(a.length) }}
        prompt={t(
          '集合A有多少个不同元素？（换序不清除这一预测）',
          'How many distinct elements does A have?',
        )}
      />
      <button className="math-button secondary" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t('显示/隐藏元素卡', 'Show/hide distinct element cards')}
        />
      </button>
      {show && (
        <div className="math-logic-cards">
          {a.length ? a.map((x) => <span key={x}>{x}</span>) : '∅'}
        </div>
      )}
    </>
  );
}
function Operations({ mode }: { mode: LanguageMode }) {
  const [size, setSize] = useState(6),
    [a, setA] = useState(['1', '2', '4']),
    [b, setB] = useState(['2', '3', '4']),
    [op, setOp] = useState<SetOperation>('intersection'),
    [show, setShow] = useState(false);
  const u = Array.from({ length: size }, (_, i) => String(i + 1)),
    result = operateSets(u, a, b, op),
    key = `${u}|${a}|${b}|${op}`;
  const toggle = (x: string, which: 'A' | 'B') => {
    const s = which === 'A' ? a : b;
    const next = s.includes(x)
      ? s.filter((v) => v !== x)
      : u.filter((v) => s.includes(v) || v === x);
    (which === 'A' ? setA : setB)(next);
    setShow(false);
  };
  return (
    <>
      <Pick
        mode={mode}
        name={t('全集', 'Universe')}
        value={String(size)}
        change={(s) => {
          setSize(Number(s));
          setA(a.filter((x) => Number(x) <= Number(s)));
          setB(b.filter((x) => Number(x) <= Number(s)));
          setShow(false);
        }}
        options={[
          ['6', t('U={1,…,6}', 'U={1,…,6}')],
          ['8', t('U={1,…,8}', 'U={1,…,8}')],
        ]}
      />
      <div className="math-logic-members">
        {(['A', 'B'] as const).map((which) => (
          <fieldset key={which}>
            <legend>{which}</legend>
            {u.map((x) => (
              <label key={x}>
                <input
                  type="checkbox"
                  aria-label={`${which}: ${x}`}
                  checked={(which === 'A' ? a : b).includes(x)}
                  onChange={() => toggle(x, which)}
                />
                {x}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <Pick
        mode={mode}
        name={t('集合运算', 'Set operation')}
        value={op}
        change={(s) => {
          setOp(s as SetOperation);
          setShow(false);
        }}
        options={[
          ['intersection', t('A∩B（且）', 'A∩B (and)')],
          ['union', t('A∪B（或，可同时）', 'A∪B (inclusive or)')],
          ['complement', t('U内A的补集', 'Complement of A in U')],
          ['difference', t('A∖B（在A不在B）', 'A∖B (A but not B)')],
        ]}
      />
      <Task
        key={key}
        mode={mode}
        answer={{ kind: 'finite-set', value: setText(result) }}
        prompt={t(
          '先写结果集合，再显示分区。可写{2,4}或∅；顺序和重复不改变集合。',
          'Predict the result before showing regions. Enter a set such as {2,4} or ∅; order and repetition do not change a set.',
        )}
      />
      <button className="math-button secondary" onClick={() => setShow(!show)}>
        <Text mode={mode} text={t('显示/隐藏分区', 'Show/hide regions')} />
      </button>
      {show && (
        <>
          <SetRegions mode={mode} u={u} a={a} b={b} />
          <p>{setText(result)}</p>
        </>
      )}
    </>
  );
}
function Statements({ mode }: { mode: LanguageMode }) {
  const [integers, setIntegers] = useState(true),
    [raw, setRaw] = useState('1/2'),
    [tested, setTested] = useState(false),
    [proof, setProof] = useState(false),
    [sentence, setSentence] = useState('quantified');
  const test = counterexample(raw, integers),
    key = `${integers}|${sentence}`;
  return (
    <>
      <Pick
        mode={mode}
        name={t('语句', 'Sentence')}
        value={sentence}
        change={(s) => {
          setSentence(s);
          setTested(false);
          setProof(false);
        }}
        options={[
          [
            'quantified',
            t(
              '所有x都有x²≥x（先指定范围）',
              'Every x satisfies x²≥x (specify domain)',
            ),
          ],
          ['open', t('x+1=3（未指定x/量词）', 'x+1=3 (x free, no quantifier)')],
          ['command', t('请打开窗户', 'Please open the window')],
        ]}
      />
      <Pick
        mode={mode}
        name={t('x的范围', 'Domain of x')}
        value={integers ? 'integers' : 'reals'}
        change={(s) => {
          setIntegers(s === 'integers');
          setTested(false);
          setProof(false);
        }}
        options={[
          ['integers', t('所有整数ℤ', 'All integers ℤ')],
          ['reals', t('所有实数ℝ', 'All real numbers ℝ')],
        ]}
      />
      <Task
        key={key}
        mode={mode}
        answer={{
          kind: 'logic-code',
          value:
            sentence !== 'quantified'
              ? 'not-statement'
              : integers
                ? 'true'
                : 'false',
        }}
        prompt={t(
          '写true/false/not-statement（真/假/不是命题）。不知道真假，不代表不是命题。',
          'Enter true/false/not-statement. Not knowing the truth does not make a sentence a non-statement.',
        )}
      />
      {sentence === 'quantified' && (
        <>
          <label>
            <Text
              mode={mode}
              text={t('候选反例x', 'Candidate counterexample x')}
            />
            <input
              aria-label={word(
                mode,
                t('候选反例x', 'Candidate counterexample x'),
              )}
              value={raw}
              onChange={(e) => {
                setRaw(e.target.value);
                setTested(false);
              }}
            />
          </label>
          <button className="math-button" onClick={() => setTested(true)}>
            <Text
              mode={mode}
              text={t('测试候选反例', 'Test candidate counterexample')}
            />
          </button>
          {tested && (
            <p
              role="status"
              aria-label={word(mode, t('反例反馈', 'Counterexample feedback'))}
            >
              <Text
                mode={mode}
                text={
                  !test
                    ? t('请输入一个有理数。', 'Enter a rational number.')
                    : !test.admissible
                      ? t(
                          '不在整数范围内，不能反驳这个整数命题。',
                          'Outside the integer domain; this cannot refute the integer statement.',
                        )
                      : test.refutes
                        ? t(
                            `${test.x}在范围内，平方${test.square}<${test.x}：有效反例。`,
                            `${test.x} is admissible; its square ${test.square}<${test.x}: a valid counterexample.`,
                          )
                        : t(
                            '这个数符合原结论，不是反例；单个符合例不能证明所有数。',
                            'This value satisfies the claim and is not a counterexample; one confirming case does not prove all cases.',
                          )
                }
              />
            </p>
          )}
          <button
            className="math-button secondary"
            onClick={() => setProof(!proof)}
          >
            <Text
              mode={mode}
              text={t('显示/隐藏完整论证', 'Show/hide full argument')}
            />
          </button>
          {proof && (
            <p>
              <Text
                mode={mode}
                text={t(
                  integers
                    ? '整数n≤0或n≥1。n(n−1)的两因子同为非正或同为非负，故n²−n≥0；没有整数在0与1之间。'
                    : '实数x=1/2给1/4<1/2，单个合域反例已推翻全称命题。原命题的否定是“存在实数x使x²<x”。',
                  integers
                    ? 'Every integer n has n≤0 or n≥1. Both factors of n(n−1) are nonpositive or nonnegative, so n²−n≥0. No integer lies strictly between zero and one.'
                    : 'The real x=1/2 gives 1/4<1/2. One admissible counterexample refutes the universal statement. Its negation is: there exists a real x with x²<x.',
                )}
              />
            </p>
          )}
        </>
      )}
    </>
  );
}
function Conditions({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [reverse, setReverse] = useState(false),
    [show, setShow] = useState(false),
    c = conditionCases[index]!,
    p = reverse ? c.q : c.p,
    q = reverse ? c.p : c.q;
  const rows = [...new Set([...p, ...q, '0', '3'])];
  return (
    <>
      <Pick
        mode={mode}
        name={t('条件对', 'Condition pair')}
        value={String(index)}
        change={(s) => {
          setIndex(Number(s));
          setReverse(false);
          setShow(false);
        }}
        options={conditionCases.map((v, i) => [String(i), t(v.zh, v.en)])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            reverse ? '已互换P和Q。' : '按原题的P和Q。',
            reverse
              ? 'P and Q have been exchanged.'
              : 'Use P and Q as originally stated.',
          )}
        />
      </p>
      <p>
        P: {setText(p)}; Q: {setText(q)}{' '}
        <Text
          mode={mode}
          text={t(
            '（各条件在ℝ中的完整真值集合）',
            '(complete truth sets over ℝ)',
          )}
        />
      </p>
      <button
        className="math-button secondary"
        onClick={() => {
          setReverse(!reverse);
          setShow(false);
        }}
      >
        <Text mode={mode} text={t('互换P与Q', 'Exchange P and Q')} />
      </button>
      <Task
        key={`${index}-${reverse}`}
        mode={mode}
        answer={{ kind: 'logic-code', value: conditionClass(p, q) }}
        prompt={t(
          'P是Q的什么条件？写sufficient-only/necessary-only/both/neither（充分不必要/必要不充分/充要/既不充分也不必要）。',
          'What kind of condition is P for Q? Enter sufficient-only, necessary-only, both or neither.',
        )}
      />
      <button className="math-button secondary" onClick={() => setShow(!show)}>
        <Text
          mode={mode}
          text={t('显示/隐藏双向核验', 'Show/hide two-direction audit')}
        />
      </button>
      {show && (
        <>
          <div
            className="math-logic-scroll"
            role="region"
            tabIndex={0}
            aria-label={word(
              mode,
              t('双向核验表', 'Two-direction audit table'),
            )}
          >
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>P</th>
                  <th>Q</th>
                  <th>P⇒Q</th>
                  <th>Q⇒P</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x}>
                    <td>{x}</td>
                    <td>{String(p.includes(x))}</td>
                    <td>{String(q.includes(x))}</td>
                    <td>{String(!p.includes(x) || q.includes(x))}</td>
                    <td>{String(!q.includes(x) || p.includes(x))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <Text
              mode={mode}
              text={t(
                '其余实数都不在两个真值集合中，P、Q均假，两箭头均真。P真Q假推翻P⇒Q；P假Q真推翻Q⇒P。P无解时，P⇒Q没有反例，仍为真。',
                'Every other real lies outside both complete truth sets, so P and Q are both false and both implications true. P true/Q false refutes P⇒Q; P false/Q true refutes Q⇒P. If P has no solutions, P⇒Q has no counterexample and is true.',
              )}
            />
          </p>
        </>
      )}
    </>
  );
}
function Absolute({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(1),
    [b, setB] = useState(-2),
    [c, setC] = useState(3),
    [sign, setSign] = useState<'<' | '<=' | '>' | '>='>('<'),
    [show, setShow] = useState(false),
    [wide, setWide] = useState(false),
    [raw, setRaw] = useState('5'),
    [tested, setTested] = useState(false);
  const set = absoluteSolution(String(a), String(b), String(c), sign),
    key = `${a}|${b}|${c}|${sign}`;
  let belongs: boolean | null = null;
  try {
    belongs = unionContains(set, readRational(raw));
  } catch {
    /* invalid candidate */
  }
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            `对实数x解 |${a}x${b < 0 ? '' : '+'}${b}| ${sign.replace('<=', '≤').replace('>=', '≥')} ${c}。`,
            `For real x solve |${a}x${b < 0 ? '' : '+'}${b}| ${sign.replace('<=', '≤').replace('>=', '≥')} ${c}.`,
          )}
        />
      </p>
      {[
        [a, setA, 'a', -3, 3],
        [b, setB, 'b', -4, 4],
        [c, setC, 'c', -2, 5],
      ].map(([v, fn, label, min, max]) => (
        <label key={String(label)}>
          {String(label)}
          <input
            type="range"
            aria-label={String(label)}
            min={Number(min)}
            max={Number(max)}
            value={Number(v)}
            onChange={(e) => {
              (fn as (n: number) => void)(Number(e.target.value));
              setShow(false);
              setTested(false);
            }}
          />
          <output>{Number(v)}</output>
        </label>
      ))}
      <Pick
        mode={mode}
        name={t('不等号', 'Inequality sign')}
        value={sign}
        change={(s) => {
          setSign(s as typeof sign);
          setShow(false);
          setTested(false);
        }}
        options={['<', '<=', '>', '>='].map((s) => [
          s,
          t(
            s.replace('<=', '≤').replace('>=', '≥'),
            s.replace('<=', '≤').replace('>=', '≥'),
          ),
        ])}
      />
      <Task
        key={key}
        mode={mode}
        answer={{ kind: 'real-union', value: unionText(set) }}
        prompt={t(
          '先写完整解集。例如−1<x<5；两段写x<−1 or x>5；也可用区间、∅、ℝ。',
          'Predict the complete solution. Examples: −1<x<5; x<−1 or x>5; interval notation, ∅ and ℝ are also accepted.',
        )}
      />
      <button className="math-button secondary" onClick={() => setShow(!show)}>
        <Text mode={mode} text={t('显示/隐藏解集', 'Show/hide solution')} />
      </button>
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text
          mode={mode}
          text={t('只改变数轴视窗', 'Change line window only')}
        />
      </button>
      {show && <UnionLine mode={mode} set={set} wide={wide} />}
      <label>
        <Text mode={mode} text={t('代回核验x', 'Substitution check x')} />
        <input
          aria-label={word(mode, t('代回核验x', 'Substitution check x'))}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setTested(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setTested(true)}>
        <Text mode={mode} text={t('核验这个数', 'Audit this number')} />
      </button>
      {tested && (
        <p
          role="status"
          aria-label={word(mode, t('代回反馈', 'Substitution feedback'))}
        >
          <Text
            mode={mode}
            text={
              belongs === null
                ? t('请输入有理数。', 'Enter a rational number.')
                : belongs
                  ? t(
                      '满足原不等式。单个成功例不证明解集完整。',
                      'Satisfies the original inequality. One successful case does not prove the set is complete.',
                    )
                  : t(
                      '不满足原不等式，检查严格端点或两段之间的空隙。',
                      'Does not satisfy the original inequality; check strict endpoints or the gap between the two rays.',
                    )
            }
          />
        </p>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '先核绝对值非负与a=0。c>0时，小于取两边之间且同时成立，大于取外侧两段并集；c=0单独核等号。图示不授予课程掌握。',
            'First use nonnegativity and check a=0. For c>0, less-than gives simultaneous inner bounds; greater-than gives the union of two outer rays. Check equality separately at c=0. This display does not award mastery.',
          )}
        />
      </p>
    </>
  );
}
export function LogicLab({
  kind,
  mode,
}: {
  kind: LogicLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-logic-lab">
      {kind === 'logic-elements' ? (
        <Elements mode={mode} />
      ) : kind === 'logic-operations' ? (
        <Operations mode={mode} />
      ) : kind === 'logic-statements' ? (
        <Statements mode={mode} />
      ) : kind === 'logic-conditions' ? (
        <Conditions mode={mode} />
      ) : (
        <Absolute mode={mode} />
      )}
    </section>
  );
}
export function LogicHookArt({
  kind,
  mode,
}: {
  kind: LogicLabKind;
  mode: LanguageMode;
}) {
  return kind === 'logic-absolute' ? (
    <UnionLine mode={mode} set={absoluteSolution('1', '-2', '3', '>')} />
  ) : (
    <SetRegions
      mode={mode}
      u={['0', '1', '2', '3', '4', '5']}
      a={['0', '1', '2']}
      b={['2', '3']}
    />
  );
}
