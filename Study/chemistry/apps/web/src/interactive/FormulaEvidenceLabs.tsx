import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import { parseAtomicAnswer } from './atomicEvidence';
import {
  binaryFormulaLedger,
  binaryFormulaPairs,
  formulaUnit,
  groupedFormulaLedger,
  groupedFormulaPairs,
  parseSignedCount,
} from './formulaEvidence';
import './IonicReactionLabs.css';
import './FormulaEvidenceLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];
const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
function NumberField({
  title,
  value,
  onChange,
  signedInput = false,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  signedInput?: boolean;
}) {
  return (
    <label className="chem-formula-field">
      <span>{title}</span>
      <input
        type="text"
        inputMode={signedInput ? 'text' : 'numeric'}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Judgment({
  title,
  value,
  onChange,
  mode,
}: {
  title: LocalizedText;
  value: boolean | null;
  onChange: (value: boolean) => void;
  mode: LanguageMode;
}) {
  return (
    <fieldset className="chem-formula-judgment">
      <legend>
        <Localized text={title} mode={mode} />
      </legend>
      <div className="ionic-choices">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
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
function RatioLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(2),
    [cations, setCations] = useState(4),
    [anions, setAnions] = useState(4);
  const [answer, setAnswer] = useState(''),
    [neutral, setNeutral] = useState<boolean | null>(null),
    [simplest, setSimplest] = useState<boolean | null>(null),
    [checked, setChecked] = useState(false);
  const l = binaryFormulaLedger(index, cations, anions);
  const parsed = parseSignedCount(answer),
    complete = parsed !== null && neutral !== null && simplest !== null;
  const correct =
    complete &&
    parsed === l.net &&
    neutral === l.neutral &&
    simplest === l.simplest;
  const reset = () => {
    setAnswer('');
    setNeutral(null);
    setSimplest(null);
    setChecked(false);
  };
  return (
    <div className="ionic-lab chem-formula-lab" data-formula-ratio-lab>
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '这是指定离子的候选数量清单，不是一个盐分子或晶格图，也没有在演示反应。电荷以基本电荷 e 为单位；图块只表示计数。',
            'This is a candidate count of specified ions, not a salt molecule, lattice or reaction. Charges are in elementary-charge units e; tiles only count ions.',
          )}
        />
      </p>
      <div className="chem-formula-controls">
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t('选择题设离子对', 'Choose the specified ion pair')}
          />
          <select
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              setCations(1);
              setAnions(1);
              reset();
            }}
          >
            {binaryFormulaPairs.map((p, i) => {
              const u = formulaUnit(p);
              return (
                <option value={i} key={i}>
                  {u.cation.label} / {u.anion.label}
                </option>
              );
            })}
          </select>
        </label>
        <label className="ionic-control">
          <Localized mode={mode} text={t('阳离子个数', 'Cation count')} />
          <select
            value={cations}
            onChange={(e) => {
              setCations(Number(e.target.value));
              reset();
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="ionic-control">
          <Localized mode={mode} text={t('阴离子个数', 'Anion count')} />
          <select
            value={anions}
            onChange={(e) => {
              setAnions(Number(e.target.value));
              reset();
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <figure className="chem-formula-inventory">
        <figcaption>
          <Localized
            mode={mode}
            text={t(
              '先数离子，再算带符号的总电荷',
              'Count ions, then total their signed charges',
            )}
          />
        </figcaption>
        <div className="chem-formula-ion-columns">
          {[
            [l.cation, cations],
            [l.anion, anions],
          ].map(([ion, count], column) => {
            const species = ion as typeof l.cation,
              number = count as number;
            return (
              <div key={column}>
                <strong>
                  {species.label} × {number}
                </strong>
                <div className="chem-formula-tiles">
                  {Array.from({ length: number }, (_, i) => (
                    <span data-inventory-ion key={i}>
                      {species.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p>
          <Localized
            mode={mode}
            text={t(
              '右上角表示每个离子的电荷；图块个数表示这批有几个。不要把电荷数字当作离子个数。',
              'Superscripts give each ion’s charge; tile counts give how many ions are in this batch. A charge number is not an ion count.',
            )}
          />
        </p>
      </figure>
      <form
        className="chem-formula-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <NumberField
          title={label(
            t(
              '候选总电荷 / e（保留正负号，归零填 0）',
              'Candidate net charge / e (keep the sign; enter 0 for zero)',
            ),
            mode,
          )}
          value={answer}
          signedInput
          onChange={(v) => {
            setAnswer(v);
            setChecked(false);
          }}
        />
        <Judgment
          mode={mode}
          title={t(
            '这批指定离子的总电荷是 0 吗？',
            'Does this specified ion batch have zero net charge?',
          )}
          value={neutral}
          onChange={(v) => {
            setNeutral(v);
            setChecked(false);
          }}
        />
        <Judgment
          mode={mode}
          title={t(
            '这两个离子个数已经是最简整数比吗？',
            'Are these two ion counts already in the simplest whole-number ratio?',
          )}
          value={simplest}
          onChange={(v) => {
            setSimplest(v);
            setChecked(false);
          }}
        />
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t('核对电荷与配比', 'Check charge and ratio')}
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
                      '先填带符号整数，再完成两个判断',
                      'Enter a signed integer and both judgments first',
                    )
                  : correct
                    ? t(
                        '你的清点与两个判断正确',
                        'Your count and both judgments are correct',
                      )
                    : t(
                        '再分别检查电荷和最简比',
                        'Recheck charge and simplest ratio separately',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p className="chem-formula-equation">
                {cations} × ({signed(l.cation.charge)}) + {anions} × (
                {signed(l.anion.charge)}) = {signed(l.net)}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t('两种离子个数同时除以', 'Divide both ion counts by')}
                />{' '}
                {l.common}: {cations}:{anions} → {l.reducedCations}:
                {l.reducedAnions}
              </p>
              <p className="chem-formula-status" data-formula-validity>
                <Localized
                  mode={mode}
                  text={
                    l.neutral
                      ? l.simplest
                        ? t(
                            '既电中性，离子个数比也已最简。',
                            'Both neutral and already in the simplest ion ratio.',
                          )
                        : t(
                            '这批电中性，但个数比还能约简；整批个数不能直接当作最简下标。',
                            'This batch is neutral, but its counts still reduce; batch counts are not the simplest subscripts.',
                          )
                      : t(
                          '这份候选未电中性。即使个数比最简，也不能作为题设中性化合物的配比。',
                          'This candidate is not neutral. Even a simplest ratio cannot represent the specified neutral compound if its charge fails.',
                        )
                  }
                />
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '题设离子对应的最简化学式',
                    'Simplest formula for the specified ions',
                  )}
                />
                : <strong>{l.formula}</strong> · {l.cations}:{l.anions}
              </p>
              {l.neutral && (
                <p>
                  <Localized
                    mode={mode}
                    text={t(
                      '这批相当于多少个化学式单位？',
                      'How many formula units does this batch represent?',
                    )}
                  />{' '}
                  {l.formulaUnits} ·{' '}
                  <Localized
                    mode={mode}
                    text={t(
                      '这是组成计数单位，不是独立小分子的边界。',
                      'This is a composition-counting unit, not a discrete molecular boundary.',
                    )}
                  />
                </p>
              )}
            </>
          )}
        </div>
      )}
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '两项检查只核对给定离子的组成。它们不证明反应发生、生成物结构或剩余物。这里约简的是离子个数比：不能把分子式 H₂O₂ 改成 HO，也不能拆改多原子离子内部组成。',
            'These checks audit composition for given ions; they do not establish a reaction, structure or leftovers. Reduce ion counts here, not molecular H₂O₂ to HO or the internal composition of a polyatomic ion.',
          )}
        />
      </p>
    </div>
  );
}
function GroupLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(2),
    [coefficient, setCoefficient] = useState(2);
  const [answers, setAnswers] = useState<Record<string, string>>({}),
    [checked, setChecked] = useState(false);
  const l = groupedFormulaLedger(index, coefficient);
  const expected = {
    cations: l.totalCations,
    anions: l.totalAnions,
    ...l.atoms,
  };
  const complete = Object.keys(expected).every(
    (k) => parseAtomicAnswer(answers[k] ?? '') !== null,
  );
  const correct =
    complete &&
    Object.entries(expected).every(
      ([k, n]) => parseAtomicAnswer(answers[k] ?? '') === n,
    );
  const titles = {
    cations: t(
      '阳离子总个数（不是原子总数）',
      'Total cations (not total atoms)',
    ),
    anions: t('阴离子总个数（不是原子总数）', 'Total anions (not total atoms)'),
  };
  const reset = () => {
    setAnswers({});
    setChecked(false);
  };
  return (
    <div className="ionic-lab chem-formula-lab" data-formula-group-lab>
      <div className="chem-formula-controls chem-formula-two-controls">
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t('选择给定化学式', 'Choose the supplied formula')}
          />
          <select
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              reset();
            }}
          >
            {groupedFormulaPairs.map((p, i) => (
              <option key={i} value={i}>
                {formulaUnit(p).formula}
              </option>
            ))}
          </select>
        </label>
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t(
              '前方系数：化学式单位数',
              'Leading coefficient: formula-unit count',
            )}
          />
          <select
            value={coefficient}
            onChange={(e) => {
              setCoefficient(Number(e.target.value));
              reset();
            }}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <figure className="chem-formula-inventory">
        <figcaption>
          <Localized
            mode={mode}
            text={t(
              '三层清点：整份 × 离子个数 × 离子内部组成',
              'Three counting levels: whole units × ions per unit × atoms within an ion',
            )}
          />
        </figcaption>
        <p className="chem-formula-expression" data-group-expression>
          {coefficient > 1 ? coefficient : ''}
          {l.formula}
        </p>
        <div className="chem-formula-batch">
          <strong>
            <Localized
              mode={mode}
              text={t(
                '下方一份组成清单，整份重复',
                'Repeat the whole composition list below',
              )}
            />{' '}
            × {coefficient}
          </strong>
          <div className="chem-formula-ion-columns">
            {[
              [l.cation, l.cations],
              [l.anion, l.anions],
            ].map(([ion, count], i) => {
              const species = ion as typeof l.cation,
                perUnit = count as number;
              return (
                <section className="chem-formula-group" key={i} data-ion-group>
                  <h4>{species.label}</h4>
                  <p>
                    <Localized
                      mode={mode}
                      text={t(
                        '每化学式单位的离子个数',
                        'Ions per formula unit',
                      )}
                    />
                    : <strong>{perUnit}</strong>
                  </p>
                  <div className="chem-formula-atom-chips">
                    {Object.entries(species.atoms).map(([symbol, n]) => (
                      <span key={symbol}>
                        {symbol} × {n}
                      </span>
                    ))}
                  </div>
                  <small>
                    <Localized
                      mode={mode}
                      text={t(
                        '上方是一个该离子内部的原子组成；电荷属于整个离子。',
                        'The chips give atom composition inside one such ion; its charge belongs to the whole ion.',
                      )}
                    />
                  </small>
                </section>
              );
            })}
          </div>
        </div>
        <p>
          <Localized
            mode={mode}
            text={t(
              '这是计数层级图，不是晶格、分子形状、反应或溶解动画。展开清单不表示化学键被拆开；化学式单位也不是一个独立的盐分子。',
              'This is a counting map, not a lattice, molecular shape, reaction or dissolution. Expanding a list does not break bonds; a formula unit is not a discrete salt molecule.',
            )}
          />
        </p>
      </figure>
      <form
        className="chem-formula-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <div className="chem-formula-number-grid">
          {Object.keys(expected).map((k) => (
            <NumberField
              key={k}
              title={
                k === 'cations' || k === 'anions'
                  ? label(titles[k], mode)
                  : `${k} · ${label(t('原子总数', 'total atoms'), mode)}`
              }
              value={answers[k] ?? ''}
              onChange={(v) => {
                setAnswers((a) => ({ ...a, [k]: v }));
                setChecked(false);
              }}
            />
          ))}
        </div>
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t('核对三层清单', 'Check all three counting levels')}
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
                      '先填写每一项非负整数，空白不代表零',
                      'Enter every non-negative integer; blank does not mean zero',
                    )
                  : correct
                    ? t(
                        '离子个数与原子总数都正确',
                        'Both ion counts and atom totals are correct',
                      )
                    : t(
                        '沿三层逐项核对；同元素还要合并',
                        'Audit the three levels; combine contributions of the same element',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <ul className="chem-formula-records">
                <li>
                  {l.cation.label}: {coefficient} × {l.cations} ={' '}
                  {l.totalCations}
                </li>
                <li>
                  {l.anion.label}: {coefficient} × {l.anions} = {l.totalAnions}
                </li>
                {Object.entries(l.atoms).map(([e, n]) => (
                  <li data-atom-total key={e}>
                    {e}: {l.contributions[e]!.join(' + ')} ={' '}
                    <strong>{n}</strong>
                  </li>
                ))}
              </ul>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '整体电荷核对（单位 e）',
                    'Whole-charge check (units e)',
                  )}
                />
                : {l.totalCations} × ({signed(l.cation.charge)}) +{' '}
                {l.totalAnions} × ({signed(l.anion.charge)}) = {l.net}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '系数乘整份；括号外下标乘整组；离子内部下标保持不变。相同元素的贡献相加，不合并不同离子的身份。',
                    'The coefficient multiplies the whole; an outside subscript multiplies its whole group; internal subscripts stay fixed. Add contributions of the same element without merging distinct ion identities.',
                  )}
                />
              </p>
            </>
          )}
        </div>
      )}
      <details className="ionic-note">
        <summary>
          <Localized
            mode={mode}
            text={t(
              '所有原子下标都能一起约分吗？',
              'Can all atom subscripts be reduced together?',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '不能。Li₂O₂ 的离子个数比是 2 Li⁺ : 1 O₂²⁻，已经最简。O₂²⁻ 是整组过氧根，内部的 2 不能约掉。NH₄NO₃ 的两个 N 来自不同离子，统计原子时要相加；数阴离子时仍只有一组 NO₃⁻。',
              'No. Li₂O₂ has the already simplest ion ratio 2 Li⁺ : 1 O₂²⁻. The internal 2 belongs to peroxide and must stay. The two N atoms in NH₄NO₃ come from different ions and add in an atom total, while there is still only one nitrate ion per unit.',
            )}
          />
        </p>
      </details>
    </div>
  );
}
export default function FormulaEvidenceLab({
  kind,
  mode,
}: {
  kind: 'ionic-ratio-batch-lab' | 'polyatomic-three-level-lab';
  mode: LanguageMode;
}) {
  return kind === 'ionic-ratio-batch-lab' ? (
    <RatioLab mode={mode} />
  ) : (
    <GroupLab mode={mode} />
  );
}
