import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import {
  TrianglePairView,
  IsoscelesView,
  QuadrilateralView,
} from './CongruenceVisuals';
import { Text } from './ui';
import {
  sssTriangle,
  angleTriangle,
  ssaAlternatives,
  availableCongruenceRules,
  sideCriteriaCases,
  angleCriteriaCases,
  isoscelesModel,
  parallelogramTests,
  proofScenarios,
  proofState,
  tryProofCard,
  type ProofScenario,
} from './congruenceModels';
export type CongruenceLabKind = Extract<Lesson['lab'], `congruence-${string}`>;
export const isCongruenceLab = (
  kind: Lesson['lab'],
): kind is CongruenceLabKind => kind.startsWith('congruence-');
const label = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Task({
  mode,
  answer,
  name = t('我的几何结论', 'My geometry conclusion'),
}: {
  mode: LanguageMode;
  answer: AnswerSpec;
  name?: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div
      className="math-congruence-task"
      role="group"
      aria-label={label(mode, name)}
    >
      <label>
        <Text mode={mode} text={name} />
        <input
          type="text"
          aria-label={label(mode, name)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <p>
        <Text
          mode={mode}
          text={
            answer.kind === 'congruence-rule'
              ? t(
                  '用已知条件选择 SSS、SAS、ASA、AAS 或“条件不足”；能用多个时任一成立判据均可。名称正确还需说明对应与依据。',
                  'Use the givens to enter SSS, SAS, ASA, AAS or insufficient. If several criteria apply, any valid one is accepted. Explain correspondence and reasons too.',
                )
              : answer.kind === 'proof-verdict'
                ? t(
                    '填“全等/不全等”或“充分/条件不足”，按当前问题区分实际图形与给定条件的充分性。',
                    'Enter congruent/not congruent or sufficient/insufficient as requested. Distinguish actual shapes from whether givens establish a conclusion.',
                  )
                : answer.kind === 'geometry-code'
                  ? t(
                      '只写题目要求的顶点/边/三角形字母。边端点可反写，三角形对应顺序不可乱换。',
                      'Enter only the requested vertex, side or triangle letters. Side endpoints may reverse; triangle correspondence order matters.',
                    )
                  : t(
                      '只写所求数值，先核已知条件与角/边的身份。',
                      'Enter only the requested number, checking the given angles and sides first.',
                    )
          }
        />
      </p>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text
          mode={mode}
          text={t('核对几何结论', 'Check geometry conclusion')}
        />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t('全等反馈', 'Congruence feedback'))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(value, answer)
                ? t(
                    '结论符合；再给对应顺序、条件和理由。',
                    'The conclusion matches; explain correspondence, conditions and reasons.',
                  )
                : t(
                    '再核对应字母、夹角/夹边位置及已知是否充分；图像外观和待证结论不能补成已知。',
                    'Recheck correspondence, included angles/sides and sufficient givens. Appearance and the target conclusion cannot supply missing premises.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function PoseControls({
  mode,
  angle,
  change,
  mirror,
  setMirror,
}: {
  mode: LanguageMode;
  angle: number;
  change: (v: number) => void;
  mirror: boolean;
  setMirror: (v: boolean) => void;
}) {
  return (
    <div className="math-congruence-controls">
      <label>
        <Text
          mode={mode}
          text={t('第二图旋转角', 'Second triangle rotation')}
        />
        <input
          type="range"
          min="0"
          max="150"
          step="15"
          aria-label={label(
            mode,
            t('第二图旋转角', 'Second triangle rotation'),
          )}
          value={angle}
          onChange={(e) => change(Number(e.target.value))}
        />
        <output>{angle}°</output>
      </label>
      <label>
        <input
          type="checkbox"
          checked={mirror}
          onChange={(e) => setMirror(e.target.checked)}
        />
        <Text mode={mode} text={t('反射第二图', 'Reflect second triangle')} />
      </label>
    </div>
  );
}
function Meaning({ mode }: { mode: LanguageMode }) {
  const [angle, setAngle] = useState(45),
    [mirror, setMirror] = useState(true),
    [scale, setScale] = useState(false),
    [overlay, setOverlay] = useState(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '顶点身份固定 A↔D、B↔E、C↔F，原边长 4、5、3。旋转、反射及平移不改长度；放大改变长度。先预测，再检验重合。',
            'Vertex identities stay A↔D,B↔E,C↔F, with original lengths 4,5,3. Rotation, reflection and translation preserve lengths; enlargement changes them. Predict before overlaying.',
          )}
        />
      </p>
      <PoseControls
        mode={mode}
        angle={angle}
        change={setAngle}
        mirror={mirror}
        setMirror={setMirror}
      />
      <label>
        <input
          type="checkbox"
          checked={scale}
          onChange={(e) => setScale(e.target.checked)}
        />
        <Text
          mode={mode}
          text={t('第二图放大至 1.5 倍', 'Enlarge the second triangle by 1.5')}
        />
      </label>
      <button className="math-button" onClick={() => setOverlay(!overlay)}>
        <Text mode={mode} text={t('检验或取消重合', 'Test or undo overlay')} />
      </button>
      <TrianglePairView
        mode={mode}
        angle={angle}
        mirror={mirror}
        scale={scale ? 1.5 : 1}
        overlay={overlay}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            `AB=4，DE=${scale ? 6 : 4}。重合检验撤销位置/方向变化，但不偷偷缩放。`,
            `AB=4, DE=${scale ? 6 : 4}. Overlay undoes placement/orientation changes without silently resizing.`,
          )}
        />
      </p>
      <Task
        mode={mode}
        answer={{ kind: 'geometry-code', value: 'DEF' }}
        name={t('按 ABC 顺序的对应三角形', 'Triangle matching the order ABC')}
      />
      <Task
        key={String(scale)}
        mode={mode}
        answer={{
          kind: 'proof-verdict',
          value: scale ? 'not-congruent' : 'congruent',
        }}
        name={t(
          '这两个实际三角形是否全等',
          'Are these actual triangles congruent',
        )}
      />
    </>
  );
}
function Criteria({ angles, mode }: { angles: boolean; mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [pose, setPose] = useState(30),
    [mirror, setMirror] = useState(true),
    [counter, setCounter] = useState(false),
    cases = angles ? angleCriteriaCases : sideCriteriaCases,
    f = cases[index]!,
    rules = availableCongruenceRules(f),
    ssa = !angles && index === 2,
    aaa = angles && index === 2,
    points = angles
      ? angleTriangle(50, 60, 6)
      : ssa
        ? ssaAlternatives()[0]!
        : sssTriangle(4, 5, 3)!,
    other = ssa && counter ? ssaAlternatives()[1] : undefined;
  return (
    <>
      <label>
        <Text mode={mode} text={t('给定条件组合', 'Given-condition case')} />
        <select
          aria-label={label(mode, t('给定条件组合', 'Given-condition case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setCounter(false);
          }}
        >
          {cases.map((_, i) => (
            <option key={i} value={i}>
              {label(
                mode,
                angles
                  ? [
                      t('两角及夹边', 'Two angles and included side'),
                      t('两角及非夹边', 'Two angles and non-included side'),
                      t('只有三角', 'Only three angles'),
                    ][i]!
                  : [
                      t('对应三边', 'Three corresponding sides'),
                      t('两边及夹角', 'Two sides and included angle'),
                      t('两边及非夹角', 'Two sides and non-included angle'),
                      t('只有两边', 'Only two sides'),
                    ][i]!,
              )}
            </option>
          ))}
        </select>
      </label>
      <div
        className="math-congruence-givens"
        role="group"
        aria-label={label(mode, t('仅有的已知条件', 'Only supplied givens'))}
      >
        <p>A↔D; B↔E; C↔F</p>
        <p>
          <Text
            mode={mode}
            text={t('相等的对应边：', 'Equal corresponding sides: ')}
          />
          {f.sides.join(', ') || '—'}
        </p>
        <p>
          <Text
            mode={mode}
            text={t('相等的对应角：', 'Equal corresponding angles: ')}
          />
          {f.angles.join(', ') || '—'}
        </p>
        <p>
          <Text
            mode={mode}
            text={
              angles
                ? t(
                    '角 A=50°、B=60°、C=70°；只把上面列出的相等项当已知，第三角可用内角和推导。',
                    'A=50°,B=60°,C=70° in the source; only listed equalities are supplied, with the third equality derivable from the angle sum.',
                  )
                : ssa
                  ? t(
                      'SSA 反例数据 AB=6、BC=4、∠A=30°，不是夹角。未给直角特殊条件。',
                      'SSA counterexample data AB=6,BC=4,∠A=30°, a non-included angle. No right-angle exception is given.',
                    )
                  : t(
                      '第一图构造边长 AB=4、BC=5、CA=3。两图只将列出的关系当已知，不从外观多拿角或边。',
                      'The source has AB=4,BC=5,CA=3. Use only the listed corresponding equalities, not extra sides or angles inferred from appearance.',
                    )
            }
          />
        </p>
      </div>
      <TrianglePairView
        mode={mode}
        points={points}
        other={other}
        facts={f}
        angle={pose}
        mirror={mirror}
        scale={aaa && counter ? 1.4 : 1}
      />
      <PoseControls
        mode={mode}
        angle={pose}
        change={setPose}
        mirror={mirror}
        setMirror={setMirror}
      />
      {(ssa || aaa) && (
        <>
          <button className="math-button" onClick={() => setCounter(!counter)}>
            <Text
              mode={mode}
              text={t(
                '显示或隐藏条件相同的反例',
                'Show or hide a counterexample with the same givens',
              )}
            />
          </button>
          {counter && (
            <p
              role="status"
              aria-label={label(
                mode,
                t('不足条件反例', 'Insufficient-condition counterexample'),
              )}
            >
              <Text
                mode={mode}
                text={
                  ssa
                    ? t(
                        '两个 C 位置都满足给定两边与非夹角，但 AC 不同；SSA 不能保证全等。',
                        'Two C positions satisfy the same two sides and non-included angle but have different AC; SSA does not guarantee congruence.',
                      )
                    : t(
                        '第二图边长放大 1.4 倍，三角仍相同但大小不同；AAA 不能保证全等。',
                        'The second triangle has sides enlarged by 1.4; all angles remain equal but sizes differ. AAA does not guarantee congruence.',
                      )
                }
              />
            </p>
          )}
        </>
      )}
      <Task
        key={`${angles}:${index}`}
        mode={mode}
        answer={{
          kind: 'congruence-rule',
          value: rules[0]!,
          alternatives: rules.slice(1),
        }}
      />
    </>
  );
}
function Isosceles({ mode }: { mode: LanguageMode }) {
  const [apex, setApex] = useState(50),
    [helper, setHelper] = useState(false),
    [shown, setShown] = useState(false),
    m = isoscelesModel(apex);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '已知非退化 △ABC 中 AB=AC，A 是顶角。先求每个底角，再查看辅助线的证明依据。',
            'Given a nondegenerate ABC with AB=AC and apex A, first find each base angle, then inspect a justified auxiliary construction.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('已知顶角', 'Given apex angle')} />
        <input
          type="range"
          aria-label={label(mode, t('已知顶角', 'Given apex angle'))}
          min="20"
          max="140"
          step="10"
          value={apex}
          onChange={(e) => {
            setApex(Number(e.target.value));
            setShown(false);
          }}
        />
        <output>{apex}°</output>
      </label>
      <IsoscelesView apex={apex} mode={mode} helper={helper} reveal={shown} />
      <div className="math-congruence-actions">
        <button className="math-button" onClick={() => setHelper(!helper)}>
          <Text
            mode={mode}
            text={t(
              '作或隐藏顶角平分线 AD',
              'Construct or hide apex bisector AD',
            )}
          />
        </button>
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t(
              '显示或隐藏底角核算',
              'Show or hide base-angle calculation',
            )}
          />
        </button>
      </div>
      {helper && (
        <p>
          <Text
            mode={mode}
            text={t(
              '新增的是构造条件 ∠BAD=∠CAD，D 在 BC 上；AB=AC 已知、AD=AD 公共边，用 SAS。不能先把待证 BD=DC 当已知。',
              'The construction supplies ∠BAD=∠CAD with D on BC. AB=AC is given and AD=AD is common, giving SAS. Do not assume the target BD=DC first.',
            )}
          />
        </p>
      )}
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('等腰核算', 'Isosceles calculation'))}
        >
          (180°−{apex}°)/2={m.base}°
        </p>
      )}
      <Task
        key={apex}
        mode={mode}
        answer={{ kind: 'number', value: String(m.base), unit: '°' }}
      />
    </>
  );
}
const paraGivens: LocalizedText[] = [
  t('AB∥CD 且 BC∥AD（定义）', 'AB∥CD and BC∥AD (definition)'),
  t('AB=CD 且 BC=AD', 'AB=CD and BC=AD'),
  t('AB∥CD 且 AB=CD（同一对边）', 'AB∥CD and AB=CD (the same opposite pair)'),
  t(
    'AO=OC 且 BO=OD，对角线在内部 O 相交',
    'AO=OC and BO=OD; diagonals meet internally at O',
  ),
  t('只有 AB∥CD', 'Only AB∥CD'),
  t('只有 AB=CD', 'Only AB=CD'),
  t('AB∥CD 且 AD=BC（不同对边）', 'AB∥CD and AD=BC (different opposite pairs)'),
];
function Parallelogram({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shear, setShear] = useState(1),
    [diagonal, setDiagonal] = useState(false),
    c = parallelogramTests[index]!;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '按顺序命名的简单四边形 ABCD：问列出的条件是否足以保证平行四边形，不是问画得像不像。',
            'For a simple quadrilateral ABCD in vertex order, decide whether the listed conditions guarantee a parallelogram, rather than judging appearance.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('四边形已知条件', 'Quadrilateral givens')} />
        <select
          aria-label={label(mode, t('四边形已知条件', 'Quadrilateral givens'))}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          {paraGivens.map((g, i) => (
            <option key={i} value={i}>
              {label(mode, g)}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text mode={mode} text={paraGivens[index]!} />
      </p>
      <QuadrilateralView
        mode={mode}
        shear={shear}
        counter={c.sufficient ? undefined : c.id}
        diagonal={diagonal || c.id === 'bisect'}
      />
      {c.sufficient && (
        <label>
          <Text
            mode={mode}
            text={t(
              '改变斜移量（保持原条件）',
              'Change shear (retain the givens)',
            )}
          />
          <input
            type="range"
            min="-2"
            max="2"
            step="1"
            aria-label={label(
              mode,
              t('改变斜移量（保持原条件）', 'Change shear (retain the givens)'),
            )}
            value={shear}
            onChange={(e) => setShear(Number(e.target.value))}
          />
        </label>
      )}
      <button className="math-button" onClick={() => setDiagonal(!diagonal)}>
        <Text
          mode={mode}
          text={t('显示或隐藏对角线', 'Show or hide diagonals')}
        />
      </button>
      <p>
        <Text
          mode={mode}
          text={
            c.sufficient
              ? t(
                  '从定义出发可用对角线构造全等，得到对边相等、对角相等、对角线互相平分；反向判定须完整条件。',
                  'From the definition, diagonals support congruence proofs of equal opposite sides/angles and mutual bisection. Converse tests require complete premises.',
                )
              : t(
                  '此图是满足列出条件但不是平行四边形的实际反例；不能把另一组条件从外观补进去。',
                  'This is an actual counterexample satisfying the listed conditions without being a parallelogram; do not add missing facts from appearance.',
                )
          }
        />
      </p>
      <Task
        key={index}
        mode={mode}
        answer={{
          kind: 'proof-verdict',
          value: c.sufficient ? 'sufficient' : 'insufficient',
        }}
      />
    </>
  );
}
const cardReason: Record<string, LocalizedText> = {
  'angle-one': t('由 AB∥CD 得内错角相等', 'Alternate angles from AB∥CD'),
  'angle-two': t('由 BC∥AD 得内错角相等', 'Alternate angles from BC∥AD'),
  common: t('同一条公共边与自身相等', 'The common side equals itself'),
  congruence: t(
    '用已有对应条件判全等',
    'Use established corresponding facts for congruence',
  ),
  corresponding: t(
    '全等后才取对应边相等',
    'Use corresponding sides after congruence',
  ),
  circular: t('直接引用本题待证结论', 'Invoke this problem’s unproved target'),
};
function ProofExperiment({
  s,
  mode,
}: {
  s: ProofScenario;
  mode: LanguageMode;
}) {
  const [history, setHistory] = useState<string[]>([]),
    [selected, setSelected] = useState('congruence'),
    [attempt, setAttempt] = useState<ReturnType<typeof tryProofCard> | null>(
      null,
    ),
    facts = proofState(s, history);
  return (
    <>
      <div
        role="group"
        aria-label={label(mode, t('证明原始已知', 'Original proof givens'))}
      >
        <p>
          <Text mode={mode} text={t('已知：', 'Given: ')} />
          {s.givens.join('; ')}
        </p>
        <p>
          <Text mode={mode} text={t('待证：', 'Target: ')} />
          {s.goal}
        </p>
      </div>
      {s.id === 'parallel' ? (
        <QuadrilateralView mode={mode} diagonal />
      ) : (
        <IsoscelesView apex={50} mode={mode} helper />
      )}
      <label>
        <Text mode={mode} text={t('待检查的推理步骤', 'Proposed proof step')} />
        <select
          aria-label={label(mode, t('待检查的推理步骤', 'Proposed proof step'))}
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            setAttempt(null);
          }}
        >
          {s.cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.gives} — {label(mode, cardReason[c.id]!)}
            </option>
          ))}
        </select>
      </label>
      <div className="math-congruence-actions">
        <button
          className="math-button"
          onClick={() => {
            const r = tryProofCard(s, history, selected);
            setAttempt(r);
            if (r.valid) setHistory(r.history);
          }}
        >
          <Text
            mode={mode}
            text={t('加入有依据的一步', 'Add a justified step')}
          />
        </button>
        <button
          className="math-button"
          disabled={!history.length}
          onClick={() => {
            setHistory(history.slice(0, -1));
            setAttempt(null);
          }}
        >
          <Text mode={mode} text={t('撤回证明末步', 'Undo final proof step')} />
        </button>
      </div>
      {attempt && (
        <p
          role="status"
          aria-label={label(mode, t('证明步骤反馈', 'Proof step feedback'))}
        >
          <Text
            mode={mode}
            text={
              attempt.reason === 'justified'
                ? t(
                    '本步依赖已具备，加入记录。',
                    'Its premises are established; the step is recorded.',
                  )
                : attempt.reason === 'circular'
                  ? t(
                      '这是循环论证：不能把本题待证结论拿来证明自己。',
                      'This is circular: the target cannot be used to prove itself.',
                    )
                  : attempt.reason === 'duplicate'
                    ? t('这一步已在记录中。', 'This step is already recorded.')
                    : t('依赖尚未建立：', 'Missing established premises: ')
            }
          />
          {attempt.reason === 'missing' && attempt.missing.join('; ')}
        </p>
      )}
      <ol>
        {history.map((id, i) => (
          <li key={i} data-proof-step={id}>
            {s.cards.find((c) => c.id === id)!.gives} —{' '}
            <Text
              mode={mode}
              text={
                id === 'congruence'
                  ? s.id === 'parallel'
                    ? t(
                        'ASA：两对应角与夹边',
                        'ASA: two corresponding angles and included side',
                      )
                    : t(
                        'SAS：两对应边与夹角',
                        'SAS: two corresponding sides and included angle',
                      )
                  : cardReason[id]!
              }
            />
          </li>
        ))}
      </ol>
      <p
        role="status"
        aria-label={label(mode, t('证明目标状态', 'Proof target status'))}
      >
        <Text
          mode={mode}
          text={
            facts.has(s.goal)
              ? t(
                  '目标已由当前记录推出；还要口头解释对应与每步理由。',
                  'The current chain establishes the target; explain correspondence and each reason aloud.',
                )
              : t(
                  '目标尚未由当前记录推出。',
                  'The current chain has not yet established the target.',
                )
          }
        />
      </p>
      <p>
        <Text
          mode={mode}
          text={t(
            '这里只核这些有限推理卡的依赖，不自动理解自由书写的证明；自由解释仍由家长检查。',
            'This checks dependencies of these finite proof cards, not arbitrary written proofs. A parent still reviews free explanations.',
          )}
        />
      </p>
    </>
  );
}
function Proof({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  return (
    <>
      <label>
        <Text mode={mode} text={t('证明案例', 'Proof case')} />
        <select
          aria-label={label(mode, t('证明案例', 'Proof case'))}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          <option value="0">
            {label(
              mode,
              t(
                '从两组平行证对边相等',
                'Equal opposite sides from two parallel pairs',
              ),
            )}
          </option>
          <option value="1">
            {label(
              mode,
              t('从角平分线证两段相等', 'Equal segments from an apex bisector'),
            )}
          </option>
        </select>
      </label>
      <ProofExperiment key={index} s={proofScenarios[index]!} mode={mode} />
    </>
  );
}
export function CongruenceLab({
  kind,
  mode,
}: {
  kind: CongruenceLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-congruence-lab">
      {kind === 'congruence-meaning' ? (
        <Meaning mode={mode} />
      ) : kind === 'congruence-sides' ? (
        <Criteria angles={false} mode={mode} />
      ) : kind === 'congruence-angles' ? (
        <Criteria angles mode={mode} />
      ) : kind === 'congruence-isosceles' ? (
        <Isosceles mode={mode} />
      ) : kind === 'congruence-parallelogram' ? (
        <Parallelogram mode={mode} />
      ) : (
        <Proof mode={mode} />
      )}
    </section>
  );
}
export function CongruenceHookArt({
  kind,
  mode,
}: {
  kind: CongruenceLabKind;
  mode: LanguageMode;
}) {
  const text: Record<CongruenceLabKind, LocalizedText> = {
    'congruence-meaning': t(
      '把三角形翻转后，边长真的改变了吗？',
      'Does reflecting a triangle really change its side lengths?',
    ),
    'congruence-sides': t(
      '两边和一个角，总能把三角形钉死吗？',
      'Do two sides and any one angle always fix a triangle?',
    ),
    'congruence-angles': t(
      '三个角都相同，大小也一定相同吗？',
      'Do three equal angles force equal size?',
    ),
    'congruence-isosceles': t(
      '顶角五十度，两底角为何各六十五而不是各一百三十？',
      'With apex fifty degrees, why is each base angle sixty-five rather than 130?',
    ),
    'congruence-parallelogram': t(
      '只有一组对边平行，能保证另一组也平行吗？',
      'Does one parallel opposite pair guarantee the other pair is parallel?',
    ),
    'congruence-proof': t(
      '把待证结论先当已知，能算完成证明吗？',
      'Can assuming the target itself count as proving it?',
    ),
  };
  return (
    <p className="math-congruence-hook">
      <Text mode={mode} text={text[kind]} />
    </p>
  );
}
