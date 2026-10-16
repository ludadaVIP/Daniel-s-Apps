import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { readRational } from './rationalModels';
import { radicalText } from './radicalModels';
import { quadraticCandidateAudit } from './quadraticModels';
import { ParabolaGraph } from './ParabolaVisuals';
import {
  parabolaModel,
  parabolaAt,
  parabolaForms,
  formCases,
  intersectionCases,
  horizontalIntersections,
  maximumCases,
  intervalExtrema,
  type QuadraticForm,
} from './parabolaModels';
export type ParabolaLabKind = Extract<Lesson['lab'], `parabola-${string}`>;
export const isParabolaLab = (kind: Lesson['lab']): kind is ParabolaLabKind =>
  kind.startsWith('parabola-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
function Task({
  mode,
  answer,
  prompt,
  name = t('我的二次函数结论', 'My parabola conclusion'),
}: {
  mode: LanguageMode;
  answer: AnswerSpec;
  prompt: LocalizedText;
  name?: LocalizedText;
}) {
  const [raw, setRaw] = useState(''),
    [checked, setChecked] = useState(false),
    correct = checkAnswer(raw, answer),
    formOnly =
      answer.kind === 'quadratic-form' &&
      !correct &&
      checkAnswer(raw, { ...answer, form: undefined });
  return (
    <div className="math-quadratic-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={label(mode, name)}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button
        className="math-button"
        aria-label={label(mode, t(`核对：${name.zh}`, `Check: ${name.en}`))}
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t('核对函数结论', 'Check parabola conclusion')}
        />
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
                    '结论符合。请另说明平方非负、对称、等价变形或范围依据。',
                    'The conclusion matches. Explain nonnegative squares, symmetry, equivalent transformations or domain separately.',
                  )
                : formOnly
                  ? t(
                      '函数值对所有输入都等价，但还需完成题目指定的一般式、顶点式或因式形式。',
                      'The functions are identical, but finish the requested standard, vertex or factored form.',
                    )
                  : t(
                      '重核非零二次系数、移位符号、完整交点或允许范围。',
                      'Recheck the nonzero quadratic coefficient, shift signs, complete intersections or allowed domain.',
                    )
            }
          />
        </p>
      )}
    </div>
  );
}
function Opening({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(1),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(false),
    source = `(${a})x²`,
    m = parabolaModel(source);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '固定同一坐标标尺，实线y=ax²与虚线y=x²比较。a的符号决定开口；|a|比较同一x距离的高度差，不从页面缩放猜宽窄。a=0时是常函数，不是二次函数。',
            'On the same labelled scales compare solid y=ax² with dashed y=x². The sign of a determines opening; |a| compares output displacement at the same x-distance. Screen zoom does not decide width. At a=0 this is constant, not quadratic.',
          )}
        />
      </p>
      <label>
        a
        <input
          type="range"
          min="-3"
          max="3"
          step="0.5"
          aria-label={label(mode, t('二次项系数 a', 'Quadratic coefficient a'))}
          value={a}
          onChange={(e) => {
            setA(Number(e.target.value));
            setShown(false);
          }}
        />
        <output>{a}</output>
      </label>
      <p>y={source}</p>
      <ParabolaGraph
        source={source}
        mode={mode}
        reference
        shown={shown}
        wide={wide}
      />
      <div className="math-quadratic-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t('显示或隐藏开口核验', 'Show or hide opening audit')}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变函数图像窗口', 'Change function window')}
          />
        </button>
      </div>
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('开口核验', 'Opening audit'))}
        >
          <Text
            mode={mode}
            text={t(
              `a=${a}，${a === 0 ? '非二次函数' : a > 0 ? '开口向上' : '开口向下'}；x=2时y=${4 * a}，参照函数为4。`,
              `a=${a}: ${m.opening}; at x=2, y=${4 * a}, while the reference is four.`,
            )}
          />
        </p>
      )}
      <Task
        key={`${a}:opening`}
        mode={mode}
        answer={{ kind: 'parabola-class', value: m.opening }}
        prompt={t(
          '先预测up/down/not-quadratic（或向上/向下/非二次函数）。',
          'Predict up, down or not-quadratic before revealing.',
        )}
      />
      <Task
        key={a}
        mode={mode}
        name={t('同一输入的函数值', 'Output at the same input')}
        answer={{ kind: 'number', value: String(4 * a) }}
        prompt={t(
          '只写x=2时的函数值，区分平方与外系数。',
          'Enter the output at x=2, distinguishing the square from its outside coefficient.',
        )}
      />
    </>
  );
}
function Vertex({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(1),
    [h, setH] = useState(2),
    [k, setK] = useState(-1),
    [d, setD] = useState(1),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(false),
    source = `(${a})(x-(${h}))²+(${k})`,
    m = parabolaModel(source),
    key = `${a}:${h}:${k}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            'y=a(x−h)²+k在a≠0时顶点(h,k)、轴x=h。括号中是减h，不是读见减号就向左。先预测，再看等距点P、Q的函数值。d只改变示意点，不改变函数。',
            'For a≠0, y=a(x−h)²+k has vertex (h,k) and axis x=h. The bracket subtracts h; a visible minus does not mean a left shift. Predict before revealing equal-distance P,Q. d changes only illustrative points.',
          )}
        />
      </p>
      <div className="math-quadratic-controls">
        {[
          ['a', a, setA],
          ['h', h, setH],
          ['k', k, setK],
        ].map(([name, value, change]) => (
          <label key={String(name)}>
            {String(name)}
            <input
              type="range"
              min={name === 'a' ? -2 : -4}
              max={name === 'a' ? 2 : 4}
              step="1"
              aria-label={label(
                mode,
                t(`顶点式参数 ${name}`, `Vertex parameter ${name}`),
              )}
              value={value as number}
              onChange={(e) => {
                (change as (n: number) => void)(Number(e.target.value));
                setShown(false);
              }}
            />
            <output>{value as number}</output>
          </label>
        ))}
      </div>
      <label>
        d
        <input
          type="range"
          min="0"
          max="3"
          step="1"
          aria-label={label(
            mode,
            t('离轴示意距离 d', 'Illustration distance d'),
          )}
          value={d}
          onChange={(e) => setD(Number(e.target.value))}
        />
        <output>{d}</output>
      </label>
      <p>y={m.vertex ? parabolaForms(source).vertex : `${k}`}</p>
      <ParabolaGraph
        source={source}
        mode={mode}
        shown={shown}
        wide={wide}
        mirrorDistance={d}
      />
      <div className="math-quadratic-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t('显示或隐藏对称核验', 'Show or hide symmetry audit')}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变函数图像窗口', 'Change function window')}
          />
        </button>
      </div>
      {m.vertex ? (
        <>
          <Task
            key={`${key}:vertex`}
            mode={mode}
            answer={{ kind: 'coordinate', value: `(${h},${k})` }}
            prompt={t(
              '写顶点坐标，按先横后纵的顺序。',
              'Give the vertex coordinate, x first and y second.',
            )}
          />
          <Task
            key={key}
            name={t('对称轴的横坐标', 'Symmetry-axis x-value')}
            mode={mode}
            answer={{ kind: 'number', value: String(h) }}
            prompt={t(
              '对称轴x=多少？只填数值；轴是一条竖直线，不是一个点。',
              'For the axis x=what, enter only the value. The axis is a vertical line, not a point.',
            )}
          />
        </>
      ) : (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                'a=0后函数为常数，不能再宣布有唯一顶点或唯一对称轴。',
                'At a=0 the function is constant: do not claim a unique parabola vertex or symmetry axis.',
              )}
            />
          </p>
          <Task
            key={key}
            mode={mode}
            answer={{ kind: 'parabola-class', value: 'not-quadratic' }}
            prompt={t('按实际函数写分类。', 'Classify the actual function.')}
          />
        </>
      )}
    </>
  );
}
const givenForms = ['(x-1)(x-3)', '2(x-3)(x+1)', '-(x-2)²', 'x²+1', 'x²-2'];
function Forms({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [form, setForm] = useState<QuadraticForm>('vertex'),
    [shown, setShown] = useState(false),
    source = formCases[index]!,
    forms = parabolaForms(source),
    unsupported = form === 'factored' && !forms.factored;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '一般式便于读截距c，顶点式读轴与最值，因式形式读零点；它们须对所有x表示同一函数，只在几个点吻合不够。输入只写y右边、有理系数。无理因子与没有实因子另用精确根和解释处理。',
            'Standard form exposes intercept c, vertex form the axis/extremum, and factored form zeros. All must represent the same function for every x; agreement at a few points is insufficient. Enter only the right side using rational coefficients. Irrational factors or absence of real factors are handled with exact roots and explanation.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('函数形式案例', 'Function-form case')} />
        <select
          aria-label={label(mode, t('函数形式案例', 'Function-form case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          {givenForms.map((v, i) => (
            <option value={i} key={v}>
              y={v}
            </option>
          ))}
        </select>
      </label>
      <p>y={givenForms[index]}</p>
      <label>
        <Text
          mode={mode}
          text={t('指定的目标形式', 'Requested function form')}
        />
        <select
          aria-label={label(
            mode,
            t('指定的目标形式', 'Requested function form'),
          )}
          value={form}
          onChange={(e) => {
            setForm(e.target.value as QuadraticForm);
            setShown(false);
          }}
        >
          <option value="standard">ax²+bx+c</option>
          <option value="vertex">a(x−h)²+k</option>
          <option value="factored">a(x−r₁)(x−r₂)</option>
        </select>
      </label>
      <ParabolaGraph source={source} mode={mode} shown={shown} />
      {unsupported ? (
        <>
          <p>
            <Text
              mode={mode}
              text={
                forms.roots.length
                  ? t(
                      '本例有无理根，实因式为(x−√2)(x+√2)，不属于此框的有理系数语法。请写全部精确零点，再在纸上展开这两个因子核验。',
                      'This case has irrational roots and real factors (x−√2)(x+√2), outside this field’s rational-coefficient syntax. Give every exact zero, then expand those factors on paper.',
                    )
                  : t(
                      '本例没有实零点，不能写成两个实一次因子的乘积；不能由“整数因子没找到”就推断这一结论，要用平方非负或Δ。',
                      'This case has no real zeros and no product of two real linear factors. Failing to find integer factors alone does not prove this; use a nonnegative square or Δ.',
                    )
              }
            />
          </p>
          <Task
            key={`${index}:${form}`}
            mode={mode}
            answer={{
              kind: 'quadratic-roots',
              values: forms.roots,
              value: forms.roots.join(',') || 'no real solutions',
            }}
            prompt={t(
              '改为写全部精确零点；没有写∅。因式解释另由家长核。',
              'Give all exact zeros instead; use ∅ for none. A parent checks the factor explanation separately.',
            )}
          />
        </>
      ) : (
        <Task
          key={`${index}:${form}`}
          name={t('我的精确函数形式', 'My exact function form')}
          mode={mode}
          answer={{ kind: 'quadratic-form', value: source, form }}
          prompt={t(
            `改写为${form === 'standard' ? '一般式' : form === 'vertex' ? '顶点式' : '因式形式'}，既核函数等价也核形式。`,
            `Rewrite in ${form} form, checking both function identity and form.`,
          )}
        />
      )}
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('显示或隐藏三形式核验', 'Show or hide three-form audit')}
        />
      </button>
      {shown && (
        <div
          role="status"
          aria-label={label(mode, t('三形式核验', 'Three-form audit'))}
        >
          <p>y={forms.standard}</p>
          <p>y={forms.vertex}</p>
          <p>
            {forms.factored
              ? `y=${forms.factored}`
              : index === 4
                ? 'y=(x−√2)(x+√2)'
                : label(
                    mode,
                    t('没有实一次因式形式', 'No real linear-factor form'),
                  )}
          </p>
          <Text
            mode={mode}
            text={t(
              '展开后逐项系数相同才是恒等，不是根集相同就函数相同。',
              'Matching every expanded coefficient establishes identity; equal zero sets alone do not make functions identical.',
            )}
          />
        </div>
      )}
    </>
  );
}
function Intersections({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [level, setLevel] = useState('0'),
    [cursor, setCursor] = useState('1'),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(false),
    [candidate, setCandidate] = useState(''),
    [checked, setChecked] = useState(false),
    c = intersectionCases[index]!,
    roots = horizontalIntersections(c.source, level).roots!,
    audit = checked
      ? quadraticCandidateAudit(`(${c.source})=(${level})`, candidate)
      : null;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '解f(x)=q，要找原曲线y=f(x)与水平线y=q的交点横坐标。不要把交点纵坐标q当作x的答案。图像只给近似与猜测；根式须回原等式精确核验，窗口外也可能有交点。',
            'Solve f(x)=q using x-coordinates where original y=f(x) meets horizontal y=q. The ordinate q is not the x-answer. Graphs give estimates; radicals require exact substitution, and intersections may lie outside the window.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('图像方程案例', 'Graph-equation case')} />
        <select
          aria-label={label(mode, t('图像方程案例', 'Graph-equation case'))}
          value={index}
          onChange={(e) => {
            const n = Number(e.target.value);
            setIndex(n);
            setLevel(intersectionCases[n]!.level);
            setShown(false);
            setCandidate('');
            setChecked(false);
          }}
        >
          {intersectionCases.map((v, i) => (
            <option key={i} value={i}>
              {v.source}={v.level}
            </option>
          ))}
        </select>
      </label>
      <label>
        q
        <input
          type="range"
          min="-3"
          max="5"
          step="1"
          aria-label={label(
            mode,
            t('目标水平值 q', 'Target horizontal value q'),
          )}
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            setShown(false);
            setCandidate('');
            setChecked(false);
          }}
        />
        <output>{level}</output>
      </label>
      <label>
        <Text
          mode={mode}
          text={t('图像游标x（仅示意）', 'Graph cursor x (illustration only)')}
        />
        <input
          type="range"
          min="-4"
          max="6"
          step="0.25"
          aria-label={label(
            mode,
            t('图像游标x（仅示意）', 'Graph cursor x (illustration only)'),
          )}
          value={cursor}
          onChange={(e) => setCursor(e.target.value)}
        />
        <output>
          x={cursor}; y={textR(parabolaAt(c.source, readRational(cursor)))}
        </output>
      </label>
      <p>
        y={c.source}; y={level}
      </p>
      <ParabolaGraph
        source={c.source}
        mode={mode}
        level={level}
        cursor={cursor}
        shown={shown}
        wide={wide}
      />
      <div className="math-quadratic-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t('显示或隐藏交点核验', 'Show or hide intersection audit')}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变函数图像窗口', 'Change function window')}
          />
        </button>
      </div>
      <Task
        key={`${index}:${level}`}
        mode={mode}
        answer={{
          kind: 'quadratic-roots',
          values: roots.map(radicalText),
          value: roots.map(radicalText).join(',') || 'no real solutions',
        }}
        prompt={t(
          '写全部精确交点横坐标，允许±，重合只列一次；没有写∅。',
          'Give every exact intersection x-value, allowing ±; list a coincident value once or ∅ for none.',
        )}
      />
      <div className="math-quadratic-task">
        <label>
          <Text
            mode={mode}
            text={t('候选交点横坐标', 'Candidate intersection x')}
          />
          <input
            aria-label={label(
              mode,
              t('候选交点横坐标', 'Candidate intersection x'),
            )}
            value={candidate}
            onChange={(e) => {
              setCandidate(e.target.value);
              setChecked(false);
            }}
          />
        </label>
        <button className="math-button" onClick={() => setChecked(true)}>
          <Text
            mode={mode}
            text={t('代回原水平等式', 'Check original horizontal equation')}
          />
        </button>
        {checked && (
          <p
            role="status"
            aria-label={label(
              mode,
              t('水平等式核验', 'Horizontal-equation audit'),
            )}
          >
            {audit ? (
              <Text
                mode={mode}
                text={t(
                  `f(x)=${audit.left}；q=${audit.right}；${audit.equationPass ? '精确成立' : '不成立，近似点不能代替精确解'}。`,
                  `f(x)=${audit.left}; q=${audit.right}; ${audit.equationPass ? 'exact equality passes' : 'fails; a nearby pixel is not an exact solution'}.`,
                )}
              />
            ) : (
              <Text
                mode={mode}
                text={t(
                  '请用本课支持的精确数值根式或有理数，不附坐标括号或单位。',
                  'Use a supported exact numerical radical or rational, without coordinate brackets or units.',
                )}
              />
            )}
          </p>
        )}
      </div>
    </>
  );
}
function Maximum({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [cursor, setCursor] = useState('1'),
    [goal, setGoal] = useState<'maximum' | 'minimum'>('maximum'),
    [shown, setShown] = useState(false),
    c = maximumCases[index]!,
    e = intervalExtrema(c.source, c.lower, c.upper, c.whole),
    key = `${index}:${goal}`,
    best = e[goal],
    maxInputs = best.inputs.map(textR);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先列函数和允许输入，再决定候选。连续闭区间比较端点与区间内顶点；整数输入只比较允许整数，不把连续顶点硬舍入。得分/面积的最值与达到它的x是两个答案。',
            'Model the function and domain first. On a continuous closed interval compare endpoints and an in-range vertex. For integer inputs compare allowed integers, rather than blindly rounding the continuous vertex. An extreme output and inputs attaining it are separate answers.',
          )}
        />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('有范围最值案例', 'Constrained-extremum case')}
        />
        <select
          aria-label={label(
            mode,
            t('有范围最值案例', 'Constrained-extremum case'),
          )}
          value={index}
          onChange={(ev) => {
            const n = Number(ev.target.value);
            setIndex(n);
            setCursor(maximumCases[n]!.lower);
            setShown(false);
          }}
        >
          {maximumCases.map((v, i) => (
            <option key={v.id} value={i}>
              {i + 1} · {v.id}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text mode={mode} text={c.story} />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('要研究哪种最值', 'Extremum to investigate')}
        />
        <select
          aria-label={label(
            mode,
            t('要研究哪种最值', 'Extremum to investigate'),
          )}
          value={goal}
          onChange={(ev) => {
            setGoal(ev.target.value as 'maximum' | 'minimum');
            setShown(false);
          }}
        >
          <option value="maximum">{label(mode, t('最大值', 'Maximum'))}</option>
          <option value="minimum">{label(mode, t('最小值', 'Minimum'))}</option>
        </select>
      </label>
      <p>
        x: [{c.lower},{c.upper}] {c.xUnit};{' '}
        {c.whole ? (
          <Text mode={mode} text={t('仅整数', 'integers only')} />
        ) : (
          <Text mode={mode} text={t('连续输入', 'continuous inputs')} />
        )}
      </p>
      <Task
        key={`${index}:model`}
        name={t('我的面积或得分函数', 'My area or score function')}
        mode={mode}
        answer={{ kind: 'polynomial', value: c.source, variables: ['x'] }}
        prompt={t(
          '先写y右边的一般关系，不附y=；不能只给某次代入值。',
          'Write the general right-side relation without y=; one substituted output is insufficient.',
        )}
      />
      <label>
        <Text
          mode={mode}
          text={t('允许范围内的候选x', 'Candidate x within the domain')}
        />
        <input
          type="range"
          min={c.lower}
          max={c.upper}
          step={c.whole ? '1' : '0.5'}
          aria-label={label(
            mode,
            t('允许范围内的候选x', 'Candidate x within the domain'),
          )}
          value={cursor}
          onChange={(ev) => setCursor(ev.target.value)}
        />
        <output>
          x={cursor} {c.xUnit}; y=
          {textR(parabolaAt(c.source, readRational(cursor)))} {c.yUnit}
        </output>
      </label>
      <ParabolaGraph
        source={c.source}
        mode={mode}
        wide
        domain={{ lower: c.lower, upper: c.upper, whole: c.whole }}
        cursor={cursor}
        shown={shown}
        xUnit={c.xUnit}
        yUnit={c.yUnit}
        window={
          c.id === 'cards' ? 'score' : c.id === 'time' ? 'signal' : 'area'
        }
      />
      <Task
        key={`${key}:value`}
        name={
          goal === 'maximum'
            ? t('最大函数值', 'Largest output')
            : t('最小函数值', 'Smallest output')
        }
        mode={mode}
        answer={{ kind: 'number', value: textR(best.value) }}
        prompt={t(
          `只写${goal === 'maximum' ? '最大' : '最小'}函数值，单位${c.yUnit}在解释中说明。`,
          `Enter only the ${goal === 'maximum' ? 'largest' : 'smallest'} output; explain its ${c.yUnit} unit separately.`,
        )}
      />
      <Task
        key={key}
        mode={mode}
        answer={{
          kind: 'quadratic-roots',
          values: maxInputs,
          value: maxInputs.join(','),
        }}
        prompt={t(
          `写所有达到${goal === 'maximum' ? '最大' : '最小'}值的允许x；并列最优都要保留，不附单位。`,
          `Give every allowed x attaining the ${goal}, retaining ties and omitting units.`,
        )}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏最值候选核验',
            'Show or hide extremum-candidate audit',
          )}
        />
      </button>
      {shown && (
        <div
          role="status"
          aria-label={label(
            mode,
            t('最值候选核验', 'Extremum-candidate audit'),
          )}
        >
          <p>
            <Text
              mode={mode}
              text={t('比较候选(x,y)', 'Compare candidate (x,y)')}
            />
            :{' '}
            {e.candidates
              .map((p) => `(${textR(p.x)},${textR(p.y)})`)
              .join('; ')}
          </p>
          <p>
            <Text
              mode={mode}
              text={t(
                `${goal === 'maximum' ? '最大' : '最小'}值${textR(best.value)} ${c.yUnit}，全部达到输入${maxInputs.join(', ')} ${c.xUnit}。`,
                `${goal === 'maximum' ? 'Maximum' : 'Minimum'} ${textR(best.value)} ${c.yUnit}, attained at every listed input ${maxInputs.join(', ')} ${c.xUnit}.`,
              )}
            />
          </p>
          <p>
            <Text
              mode={mode}
              text={t(
                '候选完整性需由平方结构、单调变化或全部整数穷举说明；只试几个点不证明最优。',
                'Candidate completeness needs the square structure, monotonic change or exhaustive allowed integers; a few trials alone do not prove optimality.',
              )}
            />
          </p>
        </div>
      )}
    </>
  );
}
export function ParabolaLab({
  kind,
  mode,
}: {
  kind: ParabolaLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-quadratic-lab math-parabola-lab">
      {kind === 'parabola-opening' ? (
        <Opening mode={mode} />
      ) : kind === 'parabola-vertex' ? (
        <Vertex mode={mode} />
      ) : kind === 'parabola-forms' ? (
        <Forms mode={mode} />
      ) : kind === 'parabola-intersections' ? (
        <Intersections mode={mode} />
      ) : (
        <Maximum mode={mode} />
      )}
    </section>
  );
}
export function ParabolaHookArt({
  kind,
  mode,
}: {
  kind: ParabolaLabKind;
  mode: LanguageMode;
}) {
  const hooks: Record<ParabolaLabKind, LocalizedText> = {
    'parabola-opening': t(
      'y=2x²与y=x²，怎样在同一标尺上比较开口和形状？',
      'How can y=2x² and y=x² be compared on the same scales?',
    ),
    'parabola-vertex': t(
      'y=(x−2)²−1中的减二，为什么顶点却在右边？',
      'Why is the vertex to the right in y=(x−2)²−1 despite the minus two?',
    ),
    'parabola-forms': t(
      '有相同零点的两个函数，就一定是同一条抛物线吗？',
      'Do two functions with the same zeros have to be the same parabola?',
    ),
    'parabola-intersections': t(
      '解x²=2时，图上要找横轴交点还是y=2的交点？',
      'For x²=2, should the original graph meet the x-axis or y=2?',
    ),
    'parabola-maximum': t(
      '连续顶点不在允许范围或不为整数，最优答案会怎样？',
      'What happens when the continuous vertex is outside the domain or is not an integer?',
    ),
  };
  return (
    <p>
      <Text mode={mode} text={hooks[kind]} />
    </p>
  );
}
