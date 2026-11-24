import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import { parseAtomicAnswer } from './atomicEvidence';
import {
  diatomicCandidate,
  diatomicCases,
  lewisInventory,
  lonePairPoints,
  sharingMolecules,
  valenceCount,
  type LewisModel,
} from './lewisEvidence';
import './IonicReactionLabs.css';
import './LewisEvidenceLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];
function LewisPicture({
  model,
  mode,
  representation = 'lines',
  draft = false,
}: {
  model: LewisModel;
  mode: LanguageMode;
  representation?: 'dots' | 'lines';
  draft?: boolean;
}) {
  const description = model.atoms
    .map(
      (a) =>
        `${a.symbol}: ${a.loneAngles.length} ${label(t('孤对', 'lone pairs'), mode)}`,
    )
    .join('; ');
  return (
    <figure className="chem-lewis-picture">
      <figcaption>
        {model.formula} ·{' '}
        <Localized
          mode={mode}
          text={
            draft
              ? t(
                  '待核对草图，不保证通过规则',
                  'Draft to audit; rule compliance is not guaranteed',
                )
              : t('给定 Lewis 记账图', 'Supplied Lewis accounting diagram')
          }
        />
      </figcaption>
      <svg
        viewBox="0 0 320 260"
        role="img"
        aria-label={`${model.formula}. ${description}. ${model.bonds.map((b) => `${model.atoms.find((a) => a.id === b.from)!.symbol}–${model.atoms.find((a) => a.id === b.to)!.symbol}: ${b.order} ${label(t('共享对', 'shared pairs'), mode)}`).join('; ')}`}
      >
        {model.bonds.map((b, i) => {
          const a = model.atoms.find((a) => a.id === b.from)!,
            z = model.atoms.find((a) => a.id === b.to)!;
          const length = Math.hypot(z.x - a.x, z.y - a.y),
            ux = (z.x - a.x) / length,
            uy = (z.y - a.y) / length;
          return (
            <g key={i}>
              {Array.from({ length: b.order }, (_, j) => {
                const offset = (j - (b.order - 1) / 2) * 7;
                if (representation === 'lines')
                  return (
                    <line
                      data-bond-line
                      key={j}
                      x1={a.x + 22 * ux - offset * uy}
                      y1={a.y + 22 * uy + offset * ux}
                      x2={z.x - 22 * ux - offset * uy}
                      y2={z.y - 22 * uy + offset * ux}
                      stroke="#276977"
                      strokeWidth="3"
                    />
                  );
                const cx = (a.x + z.x) / 2 + (j - (b.order - 1) / 2) * 14 * ux,
                  cy = (a.y + z.y) / 2 + (j - (b.order - 1) / 2) * 14 * uy;
                return (
                  <g key={j} data-shared-pair>
                    {[-1, 1].map((side) => (
                      <circle
                        data-shared-electron
                        key={side}
                        cx={cx + side * 4.5 * -uy}
                        cy={cy + side * 4.5 * ux}
                        r="3.7"
                        fill="#236c79"
                      />
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}
        {model.atoms.map((a) => (
          <g key={a.id}>
            <circle cx={a.x} cy={a.y} r="20" fill="#fff" stroke="#a5bcbc" />
            <text
              data-lewis-atom
              x={a.x}
              y={a.y + 8}
              textAnchor="middle"
              fill="#193f4c"
              fontSize="24"
              fontFamily="sans-serif"
            >
              {a.symbol}
            </text>
            {a.loneAngles.flatMap((angle, i) =>
              lonePairPoints(a, angle).map((p, j) => (
                <circle
                  data-lone-electron
                  key={`${i}-${j}`}
                  cx={p.x}
                  cy={p.y}
                  r="3.7"
                  fill="#3c4753"
                />
              )),
            )}
          </g>
        ))}
      </svg>
      <p>
        <Localized
          mode={mode}
          text={t(
            '原子间的一条线或一对点表示同一对共享电子；原子外侧的成对点表示孤对。位置、角度、大小和颜色均为示意，不表示实际轨道、自旋或静止粒子。',
            'One line or two dots between atoms represent the same shared pair; paired outer dots are lone pairs. Positions, angles, sizes and colours are schematic, not actual orbitals, spin or stationary particles.',
          )}
        />
      </p>
    </figure>
  );
}
function BudgetClues({
  model,
  mode,
}: {
  model: LewisModel;
  mode: LanguageMode;
}) {
  const symbols = [...new Set(model.atoms.map((a) => a.symbol))];
  return (
    <div className="ionic-receipt">
      <Localized
        mode={mode}
        text={t(
          '题设中性原子的价电子贡献（只看最外层，不是全部电子）',
          'Valence contributions from the supplied neutral atoms (outer electrons, not all electrons)',
        )}
      />
      <div className="chem-lewis-contributions">
        {symbols.map((s) => (
          <span key={s}>
            {s}: {model.atoms.filter((a) => a.symbol === s).length} ×{' '}
            {valenceCount(s)}
          </span>
        ))}
      </div>
    </div>
  );
}
function NumberField({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="chem-lewis-number">
      <span>{title}</span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function LocalRecords({
  model,
  mode,
}: {
  model: LewisModel;
  mode: LanguageMode;
}) {
  const l = lewisInventory(model);
  return (
    <ul className="chem-lewis-local">
      {l.local.map((a, i) => (
        <li key={a.id}>
          {a.symbol} ({i + 1}): {a.count} / {a.target} ·{' '}
          <Localized
            mode={mode}
            text={
              a.count === a.target
                ? t('达到本题局部目标', 'Local target met')
                : t('未达到本题局部目标', 'Local target not met')
            }
          />
        </li>
      ))}
    </ul>
  );
}
function SharedInventoryLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(2),
    [representation, setRepresentation] = useState<'dots' | 'lines'>('dots');
  const [answers, setAnswers] = useState({ total: '', shared: '', lone: '' }),
    [checked, setChecked] = useState(false);
  const model = sharingMolecules[index]!,
    l = lewisInventory(model);
  const values = {
    total: parseAtomicAnswer(answers.total),
    shared: parseAtomicAnswer(answers.shared),
    lone: parseAtomicAnswer(answers.lone),
  };
  const complete = Object.values(values).every((v) => v !== null),
    correct =
      values.total === l.valenceBudget &&
      values.shared === l.sharedElectrons &&
      values.lone === l.loneElectrons;
  return (
    <div className="ionic-lab chem-lewis-lab" data-lewis-lab="shared">
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择给定中性分子', 'Choose a supplied neutral molecule')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setAnswers({ total: '', shared: '', lone: '' });
            setChecked(false);
          }}
        >
          {sharingMolecules.map((m, i) => (
            <option key={m.formula} value={i}>
              {m.formula}
            </option>
          ))}
        </select>
      </label>
      <div className="ionic-choices">
        {[
          {
            id: 'dots' as const,
            text: t('共享对用两点', 'Two dots per shared pair'),
          },
          {
            id: 'lines' as const,
            text: t('共享对用一条线', 'One line per shared pair'),
          },
        ].map((c) => (
          <button
            type="button"
            key={c.id}
            aria-pressed={representation === c.id}
            onClick={() => setRepresentation(c.id)}
          >
            <Localized mode={mode} text={c.text} />
          </button>
        ))}
      </div>
      <BudgetClues model={model} mode={mode} />
      <LewisPicture model={model} representation={representation} mode={mode} />
      <form
        className="chem-lewis-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <h3>
          <Localized
            mode={mode}
            text={t(
              '从整份价电子库存清点，孤对电子也要算',
              'Count the whole valence inventory, including lone-pair electrons',
            )}
          />
        </h3>
        <div className="chem-lewis-number-grid">
          {(['total', 'shared', 'lone'] as const).map((key) => (
            <NumberField
              key={key}
              title={label(
                key === 'total'
                  ? t('整份价电子数', 'Whole valence-electron total')
                  : key === 'shared'
                    ? t(
                        '共享电子总数（不是对数）',
                        'Shared electrons (not pair count)',
                      )
                    : t('孤对中的电子总数', 'Electrons in lone pairs'),
                mode,
              )}
              value={answers[key]}
              onChange={(value) => {
                setAnswers((old) => ({ ...old, [key]: value }));
                setChecked(false);
              }}
            />
          ))}
        </div>
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t('核对整体与局部', 'Check whole and local counts')}
          />
        </button>
      </form>
      {checked && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                !complete
                  ? t(
                      '请填三个完整的非负整数，0 也要填写',
                      'Enter three complete nonnegative whole numbers, including zero',
                    )
                  : correct
                    ? t(
                        '三项整体清点都一致',
                        'All three whole-inventory counts match',
                      )
                    : t(
                        '先区分电子数、电子对数和局部重复清点',
                        'Separate electron counts, pair counts and overlapping local checks',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p className="chem-lewis-equation">
                <Localized
                  mode={mode}
                  text={t('整体价电子', 'Whole valence inventory')}
                />
                : {l.sharedElectrons} + {l.loneElectrons} = {l.valenceBudget}
              </p>
              <LocalRecords model={model} mode={mode} />
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '逐原子局部数相加',
                    'Sum of overlapping local counts',
                  )}
                />
                : {l.local.map((a) => a.count).join(' + ')} = {l.localSum}
              </p>
              <Localized
                mode={mode}
                text={t(
                  '共享电子在整体中只计一次，但可在相连两原子的局部检查中各计一次，所以局部之和不能当整体库存。这里 H 的局部目标为 2，所选其他原子为 8。',
                  'Shared electrons count once in the whole inventory but participate in both bonded atoms’ local checks. The sum of local counts is not the whole inventory. H’s local target here is two; the selected other atoms use eight.',
                )}
              />
              <p>
                <Localized
                  mode={mode}
                  text={t('该分子的全部电子', 'All electrons in this molecule')}
                />
                : {l.totalElectrons} = {l.valenceBudget}{' '}
                <Localized mode={mode} text={t('价电子', 'valence')} /> +{' '}
                {l.coreElectrons}{' '}
                <Localized
                  mode={mode}
                  text={t('内层电子（本图不画）', 'core electrons (not drawn)')}
                />
              </p>
            </>
          )}
        </div>
      )}
      <p>
        <Localized
          mode={mode}
          text={t(
            '换两点或一条线只换表示法，不增加电子。这个有限的中性分子模型不是所有元素的八电子规则，也不说明真实电子的固定位置。',
            'Switching dots and lines changes notation, not electron count. This restricted neutral-molecule model is not a universal octet rule or a map of fixed electron positions.',
          )}
        />
      </p>
    </div>
  );
}
function CandidateLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(1),
    [order, setOrder] = useState(1),
    [leftPairs, setLeftPairs] = useState(3),
    [rightPairs, setRightPairs] = useState(3);
  const [answers, setAnswers] = useState({ shared: '', lone: '' }),
    [budget, setBudget] = useState<boolean | null>(null),
    [local, setLocal] = useState<boolean | null>(null),
    [checked, setChecked] = useState(false);
  const model = diatomicCandidate(index, order, leftPairs, rightPairs),
    l = lewisInventory(model);
  const complete =
    parseAtomicAnswer(answers.shared) !== null &&
    parseAtomicAnswer(answers.lone) !== null &&
    budget !== null &&
    local !== null;
  const correct =
    parseAtomicAnswer(answers.shared) === l.sharedElectrons &&
    parseAtomicAnswer(answers.lone) === l.loneElectrons &&
    budget === l.budgetMatches &&
    local === l.localTargetsMatch;
  const reset = () => {
    setAnswers({ shared: '', lone: '' });
    setBudget(null);
    setLocal(null);
    setChecked(false);
  };
  return (
    <div className="ionic-lab chem-lewis-lab" data-lewis-lab="candidate">
      <div className="ionic-receipt">
        <Localized
          mode={mode}
          text={t(
            '这里调的是候选草图，不保证是真实可制备的分子。分别检查“全局价电子预算”和“每个原子的局部目标”，不能只选其中一项。',
            'These controls create a candidate drawing, not a guaranteed real or preparable molecule. Check the global valence budget and every local target separately; neither check replaces the other.',
          )}
        />
      </div>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('目标中性分子', 'Target neutral molecule')}
        />
        <select
          aria-label={label(t('目标分子', 'Target molecule'), mode)}
          value={index}
          onChange={(e) => {
            const n = Number(e.target.value);
            setIndex(n);
            setOrder(n === 2 ? 2 : 1);
            setLeftPairs(n === 0 ? 0 : n === 1 ? 3 : 2);
            setRightPairs(n === 0 ? 0 : n === 1 ? 3 : 2);
            reset();
          }}
        >
          {diatomicCases.map((d, i) => (
            <option value={i} key={d.formula}>
              {d.formula}
            </option>
          ))}
        </select>
      </label>
      <div className="chem-lewis-controls">
        {[
          {
            id: 'order',
            text: t(
              '候选共享对数（键线数）',
              'Candidate shared pairs (bond lines)',
            ),
            value: order,
            set: setOrder,
            options: [1, 2, 3],
          },
          {
            id: 'left',
            text: t('左原子的孤对数', 'Left atom’s lone pairs'),
            value: leftPairs,
            set: setLeftPairs,
            options: [0, 1, 2, 3],
          },
          {
            id: 'right',
            text: t('右原子的孤对数', 'Right atom’s lone pairs'),
            value: rightPairs,
            set: setRightPairs,
            options: [0, 1, 2, 3],
          },
        ].map((c) => (
          <label key={c.id} className="ionic-control">
            <Localized mode={mode} text={c.text} />
            <select
              value={c.value}
              onChange={(e) => {
                c.set(Number(e.target.value));
                reset();
              }}
            >
              {c.options.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <BudgetClues model={model} mode={mode} />
      <LewisPicture model={model} mode={mode} draft />
      <form
        className="chem-lewis-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <div className="chem-lewis-number-grid">
          {(['shared', 'lone'] as const).map((key) => (
            <NumberField
              key={key}
              title={label(
                key === 'shared'
                  ? t('候选共享电子总数', 'Candidate shared electrons')
                  : t('候选孤对电子总数', 'Candidate lone-pair electrons'),
                mode,
              )}
              value={answers[key]}
              onChange={(value) => {
                setAnswers((old) => ({ ...old, [key]: value }));
                setChecked(false);
              }}
            />
          ))}
        </div>
        {[
          {
            id: 'budget',
            question: t(
              '候选价电子总数符合中性分子的预算吗？',
              'Does the candidate valence total match the neutral molecule’s budget?',
            ),
            value: budget,
            set: setBudget,
          },
          {
            id: 'local',
            question: t(
              '每个原子都达到本题局部目标吗（H 为 2，O/N 为 8）？',
              'Does every atom meet its local target (H: 2; O/N: 8)?',
            ),
            value: local,
            set: setLocal,
          },
        ].map((c) => (
          <fieldset key={c.id} className="chem-lewis-question">
            <legend>
              <Localized mode={mode} text={c.question} />
            </legend>
            <div className="ionic-choices">
              {[true, false].map((v) => (
                <button
                  type="button"
                  key={String(v)}
                  aria-pressed={c.value === v}
                  onClick={() => {
                    c.set(v);
                    setChecked(false);
                  }}
                >
                  <Localized
                    mode={mode}
                    text={v ? t('是', 'Yes') : t('否', 'No')}
                  />
                </button>
              ))}
            </div>
          </fieldset>
        ))}
        <button type="submit" className="ionic-check">
          <Localized
            mode={mode}
            text={t('核对我的诊断', 'Check my diagnosis')}
          />
        </button>
      </form>
      {checked && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                !complete
                  ? t(
                      '填写两个非负整数，并完成两个判断',
                      'Enter two nonnegative whole numbers and both judgments',
                    )
                  : correct
                    ? t(
                        '你对草图的清点与判断正确',
                        'Your counts and judgments match the draft',
                      )
                    : t(
                        '把清点结果与两个独立条件分别核对',
                        'Audit the counts and the two independent conditions separately',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p className="chem-lewis-equation">
                {l.sharedElectrons} + {l.loneElectrons} = {l.picturedValence} ·{' '}
                <Localized
                  mode={mode}
                  text={t('中性价电子预算', 'Neutral valence budget')}
                />
                : {l.valenceBudget}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t('全局预算检查', 'Global budget check')}
                />
                :{' '}
                {label(
                  l.budgetMatches ? t('符合', 'Met') : t('未符合', 'Not met'),
                  mode,
                )}
              </p>
              <LocalRecords model={model} mode={mode} />
              <p className="chem-lewis-candidate-status">
                <Localized
                  mode={mode}
                  text={
                    l.passesRules
                      ? t(
                          '草图符合本课的 Lewis 记账规则；仍不是分子的完整物理模型。',
                          'The draft fits this lesson’s Lewis accounting rules; it is still not a complete physical model.',
                        )
                      : t(
                          '草图未通过本课规则。你可以正确诊断一张不合规则的图；答对判断不表示这张图已经成立。',
                          'The draft fails this lesson’s rules. You can correctly diagnose an invalid draft; correct judgments do not make the draft valid.',
                        )
                  }
                />
              </p>
              <Localized
                mode={mode}
                text={t(
                  '同一对共享电子不能复制来补预算。这里的中性 H₂、O₂、N₂ 同时满足整体预算和局部目标时，分别对应单、双、三条键线。',
                  'A shared pair cannot be copied to repair the budget. In these neutral H₂, O₂ and N₂ ledgers, meeting both checks gives one, two and three bond lines respectively.',
                )}
              />
            </>
          )}
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '这就是完整的真实电子图吗？',
              'Is this a complete picture of real electrons?',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '不是。模型只练这些中性双原子分子的入门 Lewis 规则，不处理离子、奇电子、共振或扩展八电子体系，也不模拟能量和反应。Lewis 氧气图本身不能解释真实氧气的磁性，需要更深的分子轨道模型；这里的成对点不是自旋测量。',
              'No. This practices elementary Lewis rules for these neutral diatomic molecules, excluding ions, odd-electron species, resonance and expanded-octet systems. It models neither energy nor reaction. The Lewis oxygen picture alone cannot explain oxygen’s magnetic behaviour; deeper molecular-orbital models are needed. Paired dots here are not a spin measurement.',
            )}
          />
        </p>
      </details>
    </div>
  );
}
export default function LewisEvidenceLab({
  kind,
  mode,
}: {
  kind: 'shared-electron-inventory-lab' | 'lewis-double-triple-lab';
  mode: LanguageMode;
}) {
  return kind === 'shared-electron-inventory-lab' ? (
    <SharedInventoryLab mode={mode} />
  ) : (
    <CandidateLab mode={mode} />
  );
}
