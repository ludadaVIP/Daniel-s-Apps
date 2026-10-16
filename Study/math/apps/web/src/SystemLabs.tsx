import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import {
  coordinateText,
  basicBounds,
  type PlotBounds,
} from './cartesianModels';
import { CartesianPlot } from './CartesianVisuals';
import {
  relationSystems,
  substitutionSystems,
  eliminationSystems,
  graphSystems,
  systemText,
  rowText,
  solveSystem,
  auditSystemPair,
  firstRelationSamples,
  substitutionTrace,
  replaceSystemRow,
  systemLineSegment,
  pointInSystemWindow,
  systemContext,
  auditSystemContext,
  parseLinearSystem,
  sameSystemSolutions,
  type LinearSystem,
  type SystemContextKind,
} from './systemModels';
export type SystemLabKind = Extract<Lesson['lab'], `system-${string}`>;
export const isSystemLab = (kind: Lesson['lab']): kind is SystemLabKind =>
  kind.startsWith('system-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
const answerFor = (s: LinearSystem): AnswerSpec => {
  const r = solveSystem(s);
  return r.kind === 'one'
    ? { kind: 'coordinate', value: coordinateText(r.point) }
    : { kind: 'system-class', value: r.kind === 'none' ? 'none' : 'infinite' };
};
function Task({
  mode,
  name,
  answer,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false),
    correct = checkAnswer(input, answer),
    modelSame =
      answer.kind === 'linear-system' &&
      !!parseLinearSystem(input) &&
      sameSystemSolutions(
        parseLinearSystem(input)!,
        parseLinearSystem(answer.value)!,
      );
  return (
    <div
      className="math-system-task"
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
            answer.kind === 'linear-system'
              ? t(
                  '两条方程用分号或换行分开。保留原数量关系，可换序、换边、同乘非零常数；不先改成最后两个解。',
                  'Separate two equations with a semicolon or newline. Retain original relationships; reorder, rearrange or scale by nonzero constants, rather than replacing both with final solved values.',
                )
              : answer.kind === 'coordinate'
                ? t(
                    '写先 x 后 y 的有序数对，允许精确分数，如 (1/2,3/2)。必须同时满足两式。',
                    'Write the ordered pair (x,y), using exact fractions if needed, such as (1/2,3/2). It must satisfy both equations.',
                  )
                : t(
                    '写“无解”或“无穷多解”，可用 no solution / infinitely many solutions。无穷多解不代表所有数对。',
                    'Enter no solution or infinitely many solutions. Infinitely many solutions do not mean every ordered pair.',
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
          aria-label={label(mode, t('方程组反馈', 'System feedback'))}
        >
          <Text
            mode={mode}
            text={
              correct
                ? t(
                    '结果符合。仍要说明两条原关系、等价步骤与条件。',
                    'The result matches. Explain both original relationships, equivalent steps and conditions.',
                  )
                : modelSame
                  ? t(
                      '解集可以相同，但本题要两条原数量关系，不是最后解值。',
                      'The solution set matches, but this task needs the two original quantity relationships, not the final solved values.',
                    )
                  : t(
                      '再核是否同时满足两式、x/y 顺序、完整符号和所求类型。重合线不代表所有数对。',
                      'Recheck both equations, x/y order, full signs and the requested answer type. A coincident line does not represent every pair.',
                    )
            }
          />
        </p>
      )}
    </div>
  );
}
function Source({ rows, mode }: { rows: LinearSystem; mode: LanguageMode }) {
  return (
    <div
      className="math-system-source"
      role="group"
      aria-label={label(mode, t('保留的原方程组', 'Original system retained'))}
    >
      {rows.map((r, i) => (
        <p key={i} data-original-system-row={i}>
          ({i + 1}) {rowText(r)}
        </p>
      ))}
    </div>
  );
}
function Choice({
  mode,
  name,
  index,
  change,
  rows,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  index: number;
  change: (n: number) => void;
  rows: LinearSystem[];
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={label(mode, name)}
        value={index}
        onChange={(e) => change(Number(e.target.value))}
      >
        {rows.map((s, i) => (
          <option key={i} value={i}>
            {systemText(s)}
          </option>
        ))}
      </select>
    </label>
  );
}
const solutionName = t('我的方程组结论', 'My system conclusion');
function Relations({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [input, setInput] = useState('(2,5)'),
    [checked, setChecked] = useState(false),
    [shown, setShown] = useState(false),
    rows = relationSystems[index]!,
    audit = checked ? auditSystemPair(rows, input) : null;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '一条关系通常对应许多数对；方程组要求同一个 x、y 同时满足两条。不能从第一式选一个解，从第二式再选另一个拼起来。',
            'One relation usually allows many pairs. A system requires the same x,y to satisfy both; do not combine values from different solution pairs.',
          )}
        />
      </p>
      <Choice
        mode={mode}
        name={t('关系实验', 'Relationship experiment')}
        index={index}
        rows={relationSystems}
        change={(n) => {
          setIndex(n);
          setChecked(false);
          setShown(false);
          setInput('(2,5)');
        }}
      />
      <Source rows={rows} mode={mode} />
      <label>
        <Text mode={mode} text={t('候选有序数对', 'Candidate ordered pair')} />
        <input
          type="text"
          aria-label={label(mode, t('候选有序数对', 'Candidate ordered pair'))}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t('代回两条原式', 'Check in both original equations')}
        />
      </button>
      {checked &&
        (audit ? (
          <div
            role="status"
            aria-label={label(mode, t('同时检验', 'Simultaneous check'))}
          >
            {audit.rows.map((r, i) => (
              <p key={i}>
                ({i + 1}) {textR(r.left)} {r.pass ? '=' : '≠'} {textR(r.right)}{' '}
                · {r.pass ? '✓' : '×'}
              </p>
            ))}
            <Text
              mode={mode}
              text={
                audit.pass
                  ? t(
                      '同一个数对同时符合两式。',
                      'The same pair satisfies both.',
                    )
                  : t(
                      '至少一式不符，不能作为方程组的解。',
                      'At least one equation fails, so this is not a system solution.',
                    )
              }
            />
          </div>
        ) : (
          <p role="status">
            <Text
              mode={mode}
              text={t(
                '按 x、y 顺序写两个精确数。',
                'Write two exact numbers in x,y order.',
              )}
            />
          </p>
        ))}
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '列一些第一式的整数样本',
            'List sample integer pairs from the first relation',
          )}
        />
      </button>
      {shown && (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '这里只列十个整数样本，不是第一式的全部实数解；勾记表示也满足第二式。',
                'These ten integer samples are not all real solutions of the first equation. A tick also satisfies the second.',
              )}
            />
          </p>
          <div className="math-system-pairs">
            {firstRelationSamples(rows[0]).map((p) => {
              const pass = auditSystemPair(rows, coordinateText(p))!.pass;
              return (
                <span
                  key={coordinateText(p)}
                  data-relation-pair={coordinateText(p)}
                  data-both-rows={pass}
                >
                  {coordinateText(p)}
                  {pass ? ' ✓' : ''}
                </span>
              );
            })}
          </div>
        </>
      )}
      <Task
        key={index}
        mode={mode}
        name={solutionName}
        answer={answerFor(rows)}
      />
    </>
  );
}
function Substitution({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [target, setTarget] = useState<'x' | 'y'>('y'),
    [step, setStep] = useState(0),
    rows = substitutionSystems[index]!,
    trace = substitutionTrace(rows, target);
  return (
    <>
      <Choice
        mode={mode}
        name={t('代入实验', 'Substitution experiment')}
        index={index}
        rows={substitutionSystems}
        change={(n) => {
          setIndex(n);
          setStep(0);
        }}
      />
      <Source rows={rows} mode={mode} />
      <label>
        <Text
          mode={mode}
          text={t(
            '从第一式表示哪个字母',
            'Variable isolated from the first equation',
          )}
        />
        <select
          aria-label={label(
            mode,
            t(
              '从第一式表示哪个字母',
              'Variable isolated from the first equation',
            ),
          )}
          value={target}
          onChange={(e) => {
            setTarget(e.target.value as 'x' | 'y');
            setStep(0);
          }}
        >
          <option value="y">y</option>
          <option value="x">x</option>
        </select>
      </label>
      <p>
        <Text
          mode={mode}
          text={t(
            '把整个等值表达式代入第二式，乘它的系数与括号一起保留。改变方法不改变原问题，已有数对作答会保留；更换方程组才重置。',
            'Substitute the whole equal expression into the second equation, retaining its coefficient and brackets. Changing strategy preserves the original task and answer; changing systems resets them.',
          )}
        />
      </p>
      <div className="math-system-history" aria-live="polite">
        {step >= 1 && (
          <p data-substitution-step="1">
            {target} = {trace.iso.expression}
          </p>
        )}
        {step >= 2 && <p data-substitution-step="2">{trace.substituted}</p>}
        {step >= 3 && (
          <p data-substitution-step="3">
            ({textR(trace.a)}){trace.iso.other} = {textR(trace.c)}
          </p>
        )}
        {step >= 4 && (
          <p data-substitution-step="4">
            <Text
              mode={mode}
              text={
                trace.kind === 'one'
                  ? t(
                      `${trace.iso.other}=${textR(trace.otherValue!)}，代回得 ${target}=${textR(trace.targetValue!)}；仍须核两条原式。`,
                      `${trace.iso.other}=${textR(trace.otherValue!)}; substitute back for ${target}=${textR(trace.targetValue!)}. Check both original equations.`,
                    )
                  : trace.kind === 'none'
                    ? t(
                        '出现零等于非零矛盾，无解，不可除零。',
                        'Zero equals a nonzero value: no solution. Do not divide by zero.',
                      )
                    : t(
                        '得到恒等式，但原第一条关系仍需满足；沿这条线无穷多解，不是所有数对。',
                        'An identity remains, but the first relation still applies: infinitely many points on that line, not every pair.',
                      )
              }
            />
          </p>
        )}
      </div>
      <div className="math-system-actions">
        <button
          className="math-button"
          disabled={step === 4}
          onClick={() => setStep(step + 1)}
        >
          <Text
            mode={mode}
            text={t('下一步有依据的代入', 'Next justified substitution step')}
          />
        </button>
        <button
          className="math-button secondary"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          <Text mode={mode} text={t('退回一步', 'Undo one step')} />
        </button>
      </div>
      <Task
        key={index}
        mode={mode}
        name={solutionName}
        answer={answerFor(rows)}
      />
    </>
  );
}
function Elimination({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [k1, setK1] = useState(1),
    [k2, setK2] = useState(1),
    [checked, setChecked] = useState(false),
    m = eliminationSystems[index]!,
    replacement = replaceSystemRow(m.rows, 0, String(k1), String(k2));
  return (
    <>
      <Choice
        mode={mode}
        name={t('消元实验', 'Elimination experiment')}
        index={index}
        rows={eliminationSystems.map((v) => v.rows)}
        change={(n) => {
          setIndex(n);
          setK1(1);
          setK2(1);
          setChecked(false);
        }}
      />
      <Source rows={m.rows} mode={mode} />
      <p>
        <Text
          mode={mode}
          text={t(
            '保留原第二式，用 k₁×第一式+k₂×第二式替换第一式。每条的左右所有项都一起倍乘。替换第一式时 k₁ 必须非零，才能还原；不能只留合成的一条。',
            'Retain equation two and replace equation one by k₁ times equation one plus k₂ times equation two. Scale every term on both sides. Here k₁ must be nonzero for reversibility; do not discard the retained equation.',
          )}
        />
      </p>
      {[
        [t('第一式倍数 k1', 'First-row multiplier k1'), k1, setK1],
        [t('第二式倍数 k2', 'Second-row multiplier k2'), k2, setK2],
      ].map(([name, value, set], i) => (
        <label key={i}>
          <Text mode={mode} text={name as LocalizedText} />
          <input
            type="range"
            aria-label={label(mode, name as LocalizedText)}
            min={-3}
            max={3}
            value={value as number}
            onChange={(e) => {
              (set as (n: number) => void)(Number(e.target.value));
              setChecked(false);
            }}
          />
          <output>{value as number}</output>
        </label>
      ))}
      <button
        className="math-button secondary"
        onClick={() => {
          setK1(m.k1);
          setK2(m.k2);
          setChecked(false);
        }}
      >
        <Text
          mode={mode}
          text={t(
            '采用一组消 y 的倍数',
            'Use planned y-cancelling multipliers',
          )}
        />
      </button>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t('核对这一行替换', 'Check this row replacement')}
        />
      </button>
      {checked && (
        <>
          <p
            role="status"
            aria-label={label(
              mode,
              t('消元步骤反馈', 'Elimination-step feedback'),
            )}
          >
            <Text
              mode={mode}
              text={
                !replacement.valid
                  ? t(
                      'k₁=0 使原第一式不再参与，无法靠这条通用行操作保证同解；本实验要求非零 k₁。',
                      'With k₁=0, the first row no longer participates; this row operation cannot guarantee equivalence. Use nonzero k₁.',
                    )
                  : replacement.combined.b[0] !== 0n
                    ? t(
                        '变形等价，但 y 项没有消去；继续选有依据的倍数。',
                        'The transformation is equivalent, but y has not been eliminated. Choose justified multipliers.',
                      )
                    : !replacement.combined.a[0]
                      ? replacement.combined.c[0]
                        ? t(
                            '得到零等于非零的矛盾，结合保留式，原组无解。',
                            'The new row contradicts zero equals nonzero, so the retained system has no solution.',
                          )
                        : t(
                            '得到零等于零，原第二式仍限制数对；无穷多解不是所有数对。',
                            'The new row is an identity, while equation two still restricts pairs; infinitely many does not mean every pair.',
                          )
                      : t(
                          '完整倍乘并相加，消去 y；解出 x 后仍代回保留式求 y，再核两条原式。',
                          'Full scaling and addition eliminate y. Solve x, substitute into the retained equation for y, then check both originals.',
                        )
              }
            />
          </p>
          {replacement.valid && (
            <div className="math-system-history">
              {replacement.rows.map((r, i) => (
                <p key={i} data-replaced-system-row={i}>
                  ({i + 1}) {rowText(r)}
                </p>
              ))}
            </div>
          )}
        </>
      )}
      <Task
        key={index}
        mode={mode}
        name={solutionName}
        answer={answerFor(m.rows)}
      />
    </>
  );
}
const wideBounds: PlotBounds = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
  xStep: 2,
  yStep: 2,
};
function Graphs({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [wide, setWide] = useState(false),
    [shown, setShown] = useState(false),
    rows = graphSystems[index]!,
    bounds = wide ? wideBounds : basicBounds,
    result = solveSystem(rows),
    inWindow =
      result.kind === 'one' && pointInSystemWindow(result.point, bounds),
    point =
      result.kind === 'one'
        ? {
            x: Number(result.point[0][0]) / Number(result.point[0][1]),
            y: Number(result.point[1][0]) / Number(result.point[1][1]),
            label: 'S',
          }
        : null;
  return (
    <>
      <Choice
        mode={mode}
        name={t('图解实验', 'Graphical system')}
        index={index}
        rows={graphSystems}
        change={(n) => {
          setIndex(n);
          setShown(false);
        }}
      />
      <Source rows={rows} mode={mode} />
      <p>
        <Text
          mode={mode}
          text={t(
            '每条线表示该式全部实数解，交点才同时符合两式。图像读数可能只给近似，精确值要代回核验。视窗外看不到交点不等于无解。',
            'Each line represents all real solutions of its equation; an intersection satisfies both. A graphical reading may be approximate, so verify exact values algebraically. No visible intersection in a window does not establish no solution.',
          )}
        />
      </p>
      <CartesianPlot
        bounds={bounds}
        mode={mode}
        curves={rows.map((r, i) => ({
          points: systemLineSegment(r, bounds),
          name: `${i + 1}: ${rowText(r)}`,
          color: i ? '#a14532' : '#5954a3',
          dash: i ? '7 4' : undefined,
        }))}
        points={shown && inWindow && point ? [point] : []}
        caption={t(
          '① 紫色实线；② 棕色虚线。重合时虚线与实线覆盖；各轴以自身刻度读，绘制来自给定方程，不由像素判断解的类型。',
          '① purple solid; ② brown dashed. Coincident lines overlap. Read each axis scale; supplied equations define the curves, and pixels do not decide solution type.',
        )}
      />
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text
          mode={mode}
          text={t('切换观察视窗', 'Change the viewing window')}
        />
      </button>
      <Task
        key={index}
        mode={mode}
        name={solutionName}
        answer={answerFor(rows)}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '展开或收起精确代数结论',
            'Show or hide the exact algebraic result',
          )}
        />
      </button>
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('图解核验', 'Graphical verification'))}
        >
          <Text
            mode={mode}
            text={
              result.kind === 'one'
                ? t(
                    `唯一数对 ${coordinateText(result.point)}；${inWindow ? '交点在当前视窗内。' : '交点在当前视窗外，可拓宽后观察。'} 改视窗不改解。`,
                    `Unique pair ${coordinateText(result.point)}; ${inWindow ? 'inside the current window.' : 'outside the current window; expand the view.'} Changing the window does not change the solution.`,
                  )
                : result.kind === 'none'
                  ? t(
                      '两式表示平行不同直线，无共同数对。',
                      'The equations are distinct parallel lines with no shared pair.',
                    )
                  : t(
                      '两式表示同一直线，有无穷多个共同数对，但仍须满足该直线关系。',
                      'Both equations define the same line: infinitely many shared pairs, still restricted by that line.',
                    )
            }
          />
        </p>
      )}
    </>
  );
}
function Contexts({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<SystemContextKind>('tickets'),
    [shown, setShown] = useState(false),
    [input, setInput] = useState(''),
    [checked, setChecked] = useState(false),
    m = systemContext(kind),
    audit = checked ? auditSystemContext(m.rows, input, m.rule) : null;
  return (
    <>
      <label>
        <Text mode={mode} text={t('虚构情境', 'Fictional context')} />
        <select
          aria-label={label(mode, t('虚构情境', 'Fictional context'))}
          value={kind}
          onChange={(e) => {
            setKind(e.target.value as SystemContextKind);
            setShown(false);
            setInput('');
            setChecked(false);
          }}
        >
          <option value="tickets">
            {label(
              mode,
              t('七张票，总价二十九', 'Seven tickets, total twenty-nine'),
            )}
          </option>
          <option value="fractional-tickets">
            {label(mode, t('七张票，总价三十', 'Seven tickets, total thirty'))}
          </option>
          <option value="juice">
            {label(
              mode,
              t('七升混合量，总价三十', 'Seven litres, total thirty'),
            )}
          </option>
        </select>
      </label>
      <p>
        <Text
          mode={mode}
          text={
            kind === 'juice'
              ? t(
                  '虚构两种果汁，x 为每升 NZ$5 的升数，y 为每升 NZ$3 的升数；共七升、总价 NZ$30。x、y 为非负实数量，可有分数升。',
                  'For two fictional juices, x litres cost NZ$5 per litre and y litres NZ$3 per litre. Total seven litres costs NZ$30. Both amounts are nonnegative and fractional litres are allowed.',
                )
              : t(
                  `虚构社区活动，x 为成人票张数、y 为儿童票张数；每张分别 NZ$5、NZ$3，共七张、总价 NZ$${m.total}。张数须非负整数。`,
                  `At a fictional community event, x adult tickets cost NZ$5 each and y child tickets NZ$3 each. Seven tickets cost NZ$${m.total}. Both counts must be nonnegative integers.`,
                )
          }
        />
      </p>
      <Task
        key={kind}
        mode={mode}
        name={t('我保留的两条原关系', 'My original two equations')}
        answer={{ kind: 'linear-system', value: m.source }}
      />
      <button
        className="math-button secondary"
        onClick={() => setShown(!shown)}
      >
        <Text
          mode={mode}
          text={t(
            '展开或收起两条原关系',
            'Show or hide the original relationships',
          )}
        />
      </button>
      {shown && <Source rows={m.rows} mode={mode} />}
      <label>
        <Text
          mode={mode}
          text={t('待作情境核验的数对', 'Pair for the context audit')}
        />
        <input
          type="text"
          aria-label={label(
            mode,
            t('待作情境核验的数对', 'Pair for the context audit'),
          )}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      {m.total === 30 && (
        <button
          className="math-button secondary"
          onClick={() => {
            setInput('(9/2,5/2)');
            setChecked(false);
          }}
        >
          <Text
            mode={mode}
            text={t(
              '检验一个分数代数数对',
              'Try the fractional algebraic pair',
            )}
          />
        </button>
      )}
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t(
            '核两式、单位与情境范围',
            'Audit equations, units and context',
          )}
        />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('情境核验', 'Context audit'))}
        >
          <Text
            mode={mode}
            text={
              !audit
                ? t(
                    '先写 x、y 顺序的精确数对。',
                    'First enter an exact pair in x,y order.',
                  )
                : t(
                    `两式${audit.pass ? '均符合' : '有不符合'}；非负${audit.nonnegative ? '符合' : '不符'}；整数${audit.integer ? '符合' : '不符'}。${audit.accepted ? '在本情境允许。' : audit.pass ? '代数数对成立，但本情境不允许；不能四舍五入成票数。' : '不能作为原方程组的解。'} x/y 单位均为 ${m.xUnit}。`,
                    `Equations ${audit.pass ? 'both pass' : 'do not both pass'}; nonnegative ${audit.nonnegative ? 'yes' : 'no'}; integer ${audit.integer ? 'yes' : 'no'}. ${audit.accepted ? 'Allowed in this context.' : audit.pass ? 'An algebraic solution, but not allowed here; do not round ticket counts.' : 'Not a solution of the original system.'} Both x/y units are ${m.xUnit}.`,
                  )
            }
          />
        </p>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '先定义两个量、单位与条件，分别写总量与加权金额。代数有唯一数对，与现实是否允许，是两次核验；同样的代数关系可有不同情境范围。',
            'Define both quantities, units and domain, then write total quantity and weighted cost. A unique algebraic pair and context admissibility require separate audits; identical algebra can have different domains.',
          )}
        />
      </p>
    </>
  );
}
export function SystemLab({
  kind,
  mode,
}: {
  kind: SystemLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-system-lab">
      {kind === 'system-relations' ? (
        <Relations mode={mode} />
      ) : kind === 'system-substitute' ? (
        <Substitution mode={mode} />
      ) : kind === 'system-eliminate' ? (
        <Elimination mode={mode} />
      ) : kind === 'system-graph' ? (
        <Graphs mode={mode} />
      ) : (
        <Contexts mode={mode} />
      )}
    </div>
  );
}
export function SystemHookArt({
  kind,
  mode,
}: {
  kind: SystemLabKind;
  mode: LanguageMode;
}) {
  const words = {
    'system-relations': 'ONE PAIR · BOTH RELATIONS ?',
    'system-substitute': 'EQUAL EXPRESSION → REPLACE WHERE ?',
    'system-eliminate': 'COMBINE A ROW · WHAT MUST REMAIN ?',
    'system-graph': 'INTERSECTION · NONE · SAME LINE ?',
    'system-model': 'TWO QUANTITIES · TWO RELATIONSHIPS ?',
  };
  return (
    <div className="math-system-hook">
      <strong>{words[kind]}</strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '原关系 → 等价变形 → 同时满足 → 情境核验',
            'Original relations → equivalent steps → simultaneous solution → context audit',
          )}
        />
      </p>
    </div>
  );
}
