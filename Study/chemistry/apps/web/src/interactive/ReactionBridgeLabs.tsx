import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import { parseAtomicAnswer } from './atomicEvidence';
import {
  bridgeMolecules,
  changeEvidenceCards,
  changeEvidenceState,
  moleculeEquationCases,
  moleculeEquationLedger,
  type ChangeVerdict,
  type EvidenceBasis,
} from './reactionBridge';
import './IonicReactionLabs.css';
import './ReactionBridgeLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];
const verdictLabels: Record<ChangeVerdict, LocalizedText> = {
  physical: t('支持物理变化', 'Supports physical change'),
  chemical: t('支持化学变化', 'Supports chemical change'),
  insufficient: t('证据不足', 'Insufficient evidence'),
};
const basisLabels: Record<EvidenceBasis, LocalizedText> = {
  appearance: t('只要有这种外观就足够', 'This appearance alone is enough'),
  same: t(
    '给定完整身份清单保持不变',
    'The supplied complete identity list stays unchanged',
  ),
  new: t(
    '题设身份记录确认形成新物质',
    'The supplied identities confirm a new substance',
  ),
  missing: t(
    '仍缺少前后物质身份的对照',
    'Before/after substance identities are still missing',
  ),
};
function EvidenceLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [expanded, setExpanded] = useState(false);
  const [verdict, setVerdict] = useState<ChangeVerdict | null>(null),
    [basis, setBasis] = useState<EvidenceBasis | null>(null),
    [checked, setChecked] = useState(false);
  const l = changeEvidenceState(index, expanded),
    complete = verdict !== null && basis !== null;
  const correct = verdict === l.verdict && basis === l.basis;
  const reset = () => {
    setVerdict(null);
    setBasis(null);
    setChecked(false);
  };
  return (
    <div className="ionic-lab chem-rbridge-lab" data-change-evidence-lab>
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '这些是项目编写的教学记录，不是真实实验数据或现场鉴定。先按当前证据判断，再打开补充记录；不需要接触材料。',
            'These are authored teaching records, not measured experiments or live identification. Judge the current evidence, then open the added record; no materials are needed.',
          )}
        />
      </p>
      <label className="ionic-control">
        <Localized mode={mode} text={t('选择记录卡', 'Choose a record card')} />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setExpanded(false);
            reset();
          }}
        >
          {changeEvidenceCards.map((c, i) => (
            <option key={c.id} value={i}>
              {label(c.title, mode)}
            </option>
          ))}
        </select>
      </label>
      <div
        className="ionic-choices"
        aria-label={label(t('当前证据范围', 'Current evidence scope'), mode)}
      >
        {[false, true].map((v) => (
          <button
            type="button"
            aria-pressed={expanded === v}
            key={String(v)}
            onClick={() => {
              setExpanded(v);
              reset();
            }}
          >
            <Localized
              mode={mode}
              text={
                v
                  ? t('加入补充身份记录', 'Add identity/context record')
                  : t('只看现象', 'Appearance only')
              }
            />
          </button>
        ))}
      </div>
      <section className="chem-rbridge-record" data-evidence-card>
        <h4>
          <Localized
            mode={mode}
            text={t('当前现象记录', 'Current observation')}
          />
        </h4>
        <p>
          <Localized mode={mode} text={l.card.observation} />
        </p>
        {expanded && (
          <div className="chem-rbridge-added">
            <strong>
              <Localized mode={mode} text={t('补充记录', 'Added record')} />
            </strong>
            <p>
              <Localized mode={mode} text={l.card.identity} />
            </p>
          </div>
        )}
      </section>
      <form
        className="chem-rbridge-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <fieldset className="chem-rbridge-question">
          <legend>
            <Localized
              mode={mode}
              text={t(
                '按当前记录，能支持哪种判断？',
                'Which judgment does the current record support?',
              )}
            />
          </legend>
          <div className="ionic-choices">
            {(Object.keys(verdictLabels) as ChangeVerdict[]).map((v) => (
              <button
                type="button"
                key={v}
                aria-pressed={verdict === v}
                onClick={() => {
                  setVerdict(v);
                  setChecked(false);
                }}
              >
                <Localized mode={mode} text={verdictLabels[v]} />
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="chem-rbridge-question">
          <legend>
            <Localized
              mode={mode}
              text={t('哪条是这次判断的依据？', 'What supports that judgment?')}
            />
          </legend>
          <div className="ionic-choices chem-rbridge-reasons">
            {(Object.keys(basisLabels) as EvidenceBasis[]).map((v) => (
              <button
                type="button"
                key={v}
                aria-pressed={basis === v}
                onClick={() => {
                  setBasis(v);
                  setChecked(false);
                }}
              >
                <Localized mode={mode} text={basisLabels[v]} />
              </button>
            ))}
          </div>
        </fieldset>
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t('核对判断与证据', 'Check judgment and evidence')}
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
                      '先选择判断和依据',
                      'Choose a judgment and a reason first',
                    )
                  : correct
                    ? t(
                        '判断与依据都对应当前证据',
                        'Both judgment and reason match the current evidence',
                      )
                    : t(
                        '把外观与物质身份分开再判断',
                        'Separate appearance from substance identity and try again',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p>
                <Localized mode={mode} text={verdictLabels[l.verdict]} /> ·{' '}
                <Localized mode={mode} text={basisLabels[l.basis]} />
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={
                    expanded
                      ? l.card.explanation
                      : t(
                          '当前只有现象，尚无前后物质身份对照，不能确定是否形成新物质。可以打开补充记录再判断；暂不能确定不等于已经证明没有反应。',
                          'Only appearance is available, without a before/after identity comparison. Whether new substances formed is not established. Add the record and reconsider; uncertainty does not prove no reaction.',
                        )
                  }
                />
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
function BooleanQuestion({
  mode,
  title,
  value,
  onChange,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <fieldset className="chem-rbridge-question">
      <legend>
        <Localized mode={mode} text={title} />
      </legend>
      <div className="ionic-choices">
        {[true, false].map((v) => (
          <button
            type="button"
            key={String(v)}
            aria-pressed={value === v}
            onClick={() => onChange(v)}
          >
            <Localized mode={mode} text={v ? t('是', 'Yes') : t('否', 'No')} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function AtomLedgerLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [coefficients, setCoefficients] = useState([1, 1, 2]);
  const [answers, setAnswers] = useState<Record<string, string>>({}),
    [atomsMatch, setAtomsMatch] = useState<boolean | null>(null),
    [moleculesMatch, setMoleculesMatch] = useState<boolean | null>(null),
    [checked, setChecked] = useState(false);
  const l = moleculeEquationLedger(index, coefficients);
  const fields = l.elements.flatMap((e) =>
    (['left', 'right'] as const).map((side) => ({
      key: `${side}-${e}`,
      element: e,
      side,
      expected: l[side][e] ?? 0,
    })),
  );
  const complete =
    fields.every((f) => parseAtomicAnswer(answers[f.key] ?? '') !== null) &&
    atomsMatch !== null &&
    moleculesMatch !== null;
  const correct =
    complete &&
    fields.every(
      (f) => parseAtomicAnswer(answers[f.key] ?? '') === f.expected,
    ) &&
    atomsMatch === l.atomsMatch &&
    moleculesMatch === l.moleculesMatch;
  const reset = () => {
    setAnswers({});
    setAtomsMatch(null);
    setMoleculesMatch(null);
    setChecked(false);
  };
  const equationPart = (side: 'left' | 'right') =>
    l.scenario.terms
      .flatMap((term, i) =>
        term.side === side
          ? [
              `${coefficients[i] === 1 ? '' : coefficients[i]}${bridgeMolecules[term.molecule].formula}`,
            ]
          : [],
      )
      .join(' + ');
  return (
    <div className="ionic-lab chem-rbridge-lab" data-molecule-conservation-lab>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择指定反应的候选式', 'Choose a specified reaction ledger')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setCoefficients([1, 1, 1]);
            reset();
          }}
        >
          {moleculeEquationCases.map((c, i) => (
            <option key={i} value={i}>
              {c.terms
                .filter((t) => t.side === 'left')
                .map((t) => bridgeMolecules[t.molecule].formula)
                .join(' + ')}{' '}
              →{' '}
              {c.terms
                .filter((t) => t.side === 'right')
                .map((t) => bridgeMolecules[t.molecule].formula)
                .join(' + ')}
            </option>
          ))}
        </select>
      </label>
      <div className="chem-rbridge-controls">
        {l.scenario.terms.map((term, i) => (
          <label className="ionic-control" key={term.molecule}>
            {bridgeMolecules[term.molecule].formula} ·{' '}
            <Localized
              mode={mode}
              text={t('候选系数', 'candidate coefficient')}
            />
            <select
              value={coefficients[i]}
              onChange={(e) => {
                setCoefficients((c) =>
                  c.map((n, j) => (j === i ? Number(e.target.value) : n)),
                );
                reset();
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <figure className="chem-rbridge-picture">
        <figcaption>
          <Localized
            mode={mode}
            text={t(
              '待核对候选：箭头不保证原子账本成立',
              'Candidate to audit: an arrow does not guarantee atom balance',
            )}
          />
        </figcaption>
        <p className="chem-rbridge-equation" data-candidate-equation>
          {equationPart('left')} → {equationPart('right')}
        </p>
        <div className="chem-rbridge-sides">
          {(['left', 'right'] as const).map((side) => (
            <section key={side} data-equation-side={side}>
              <h4>
                <Localized
                  mode={mode}
                  text={
                    side === 'left'
                      ? t(
                          '左侧候选分子清单',
                          'Left candidate molecule inventory',
                        )
                      : t(
                          '右侧候选分子清单',
                          'Right candidate molecule inventory',
                        )
                  }
                />
              </h4>
              {l.scenario.terms.map((term, i) => {
                if (term.side !== side) return null;
                const molecule = bridgeMolecules[term.molecule];
                return (
                  <div className="chem-rbridge-term" key={i}>
                    <strong>
                      {molecule.formula} × {coefficients[i]}
                    </strong>
                    <div className="chem-rbridge-molecule-grid">
                      {Array.from({ length: coefficients[i]! }, (_, j) => (
                        <div
                          className="chem-rbridge-molecule"
                          data-molecule-card
                          data-molecule-id={term.molecule}
                          key={j}
                        >
                          <span>{molecule.formula}</span>
                          <div>
                            {Object.entries(molecule.atoms).flatMap(([e, n]) =>
                              Array.from({ length: n }, (_, a) => (
                                <span
                                  data-counted-atom={e}
                                  className={`chem-rbridge-atom chem-rbridge-${e}`}
                                  key={`${e}-${a}`}
                                >
                                  {e}
                                </span>
                              )),
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
        <p>
          <Localized
            mode={mode}
            text={t(
              '每个小框代表一个指定分子；圆点只清点框内原子，不画真实形状、键或轨道。左右是候选库存，不是逐步反应动画；没有追踪每个原子的运动。',
              'Each small box represents one specified molecule. Dots count atoms, not actual shapes, bonds or orbitals. The two sides are candidate inventories, not a reaction animation or tracked atom trajectories.',
            )}
          />
        </p>
      </figure>
      <form
        className="chem-rbridge-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <div className="chem-rbridge-number-grid">
          {fields.map((f) => (
            <label className="chem-rbridge-field" key={f.key}>
              {f.element} ·{' '}
              {label(
                f.side === 'left'
                  ? t('左侧原子总数', 'left atom total')
                  : t('右侧原子总数', 'right atom total'),
                mode,
              )}
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={answers[f.key] ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setAnswers((a) => ({ ...a, [f.key]: value }));
                  setChecked(false);
                }}
              />
            </label>
          ))}
        </div>
        <BooleanQuestion
          mode={mode}
          title={t(
            '这张候选的每种原子数都分别对应吗？',
            'Does this candidate match the count of every element separately?',
          )}
          value={atomsMatch}
          onChange={(v) => {
            setAtomsMatch(v);
            setChecked(false);
          }}
        />
        <BooleanQuestion
          mode={mode}
          title={t(
            '这张候选两边的分子总个数相等吗？',
            'Does this candidate have equal total molecule counts on both sides?',
          )}
          value={moleculesMatch}
          onChange={(v) => {
            setMoleculesMatch(v);
            setChecked(false);
          }}
        />
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t('核对原子与分子两种数法', 'Check atom and molecule counts')}
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
                      '先填写全部非负整数，再完成两个判断',
                      'Enter all non-negative integers and both judgments first',
                    )
                  : correct
                    ? t(
                        '原子总数与两个判断都正确',
                        'Your atom totals and both judgments are correct',
                      )
                    : t(
                        '逐种原子重数，再区分分子个数',
                        'Recount each element, then distinguish molecule totals',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <ul className="chem-rbridge-totals">
                {l.elements.map((e) => (
                  <li key={e}>
                    {e}: {l.left[e] ?? 0} {l.left[e] === l.right[e] ? '=' : '≠'}{' '}
                    {l.right[e] ?? 0}
                  </li>
                ))}
              </ul>
              <p>
                <Localized
                  mode={mode}
                  text={t('左右分子总个数', 'Left/right molecule totals')}
                />
                : {l.leftMolecules} / {l.rightMolecules}
              </p>
              <p className="chem-rbridge-status" data-atom-ledger-status>
                <Localized
                  mode={mode}
                  text={
                    l.atomsMatch
                      ? t(
                          '每种原子数对应，原子账本闭合。分子总个数无需相同；闭合也不证明反应已经发生或完全。',
                          'Every element matches: the atom ledger closes. Molecule totals need not match; closure does not prove a reaction occurred or went to completion.',
                        )
                      : t(
                          '原子账本未闭合。即使你正确诊断了错误候选，也不表示候选已配平；分子总个数相等不能补救原子不对应。',
                          'The atom ledger does not close. Correctly diagnosing a bad candidate does not balance it; equal molecule totals cannot repair mismatched atoms.',
                        )
                  }
                />
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '配平要求每种元素的原子各自守恒，不要求分子总个数守恒。这里只核对指定变化的组成，不更改分子式；成倍配平也未必已是最简系数。',
                    'Balance requires each element’s atoms to be conserved, not total molecule count. This audits a specified composition without changing molecular formulas; a scaled balanced set may not have the smallest coefficients.',
                  )}
                />
              </p>
            </>
          )}
        </div>
      )}
      <p className="ionic-note">
        <Localized mode={mode} text={l.scenario.scope} />
      </p>
    </div>
  );
}
export default function ReactionBridgeLab({
  kind,
  mode,
}: {
  kind: 'change-evidence-record-lab' | 'atom-molecule-conservation-lab';
  mode: LanguageMode;
}) {
  return kind === 'change-evidence-record-lab' ? (
    <EvidenceLab mode={mode} />
  ) : (
    <AtomLedgerLab mode={mode} />
  );
}
