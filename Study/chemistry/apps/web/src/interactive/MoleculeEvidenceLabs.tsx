import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import {
  atomNames,
  classNames,
  entityCatalog,
  entityInventory,
  formulaBatch,
  formulaChoices,
  moleculeSamples,
  readParticleCount,
  type AtomSymbol,
  type EntityId,
  type MolecularId,
  type SampleClass,
} from './moleculeEvidence';
import './IonicReactionLabs.css';
import './MoleculeEvidenceLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];

function EntityCards({
  entities,
  mode,
}: {
  entities: EntityId[];
  mode: LanguageMode;
}) {
  return (
    <div className="chem-molecule-sample">
      {entities.map((id, i) => {
        const entity = entityCatalog[id];
        return (
          <figure key={i} className="chem-molecule-entity" data-entity={id}>
            <figcaption>
              <strong>{entity.formula}</strong>
              <Localized
                mode={mode}
                text={
                  entity.molecular
                    ? t('一个分子', 'One molecule')
                    : t('一个独立原子', 'One separate atom')
                }
              />
            </figcaption>
            <div
              className="chem-molecule-atoms"
              aria-label={entity.atoms.join(', ')}
            >
              {entity.atoms.map((atom, j) => (
                <span
                  key={j}
                  className={`chem-molecule-atom atom-${atom}`}
                  data-atom={atom}
                >
                  {atom}
                </span>
              ))}
            </div>
          </figure>
        );
      })}
    </div>
  );
}
function Key({ mode }: { mode: LanguageMode }) {
  return (
    <div className="ionic-receipt">
      <Localized
        mode={mode}
        text={t(
          '每个小框表示一个分子或一个独立原子，以框内标签为准；圆圈是原子，不是分子。颜色仅辅助区分，元素符号才说明身份。框内横排不是实际形状、键角或键级。',
          'Each small frame represents one molecule or one separate atom, as labelled. Circles are atoms, not molecules. Colours are aids; element symbols identify atoms. The horizontal layout is not a real shape, bond angle or bond order.',
        )}
      />
    </div>
  );
}
function CountInput({
  text,
  value,
  onChange,
}: {
  text: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="chem-molecule-input">
      <span>{text}</span>
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
function SampleLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [prediction, setPrediction] = useState<SampleClass | null>(null);
  const [counts, setCounts] = useState({ atoms: '', molecules: '' });
  const [checked, setChecked] = useState(false);
  const sample = moleculeSamples[index]!;
  const inventory = entityInventory(sample.entities);
  const parsed = {
    atoms: readParticleCount(counts.atoms),
    molecules: readParticleCount(counts.molecules),
  };
  const complete = parsed.atoms !== null && parsed.molecules !== null;
  const correct =
    parsed.atoms === inventory.atoms &&
    parsed.molecules === inventory.molecules;
  return (
    <div className="ionic-lab chem-molecule-lab" data-molecule-lab="sample">
      <Key mode={mode} />
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择样品图', 'Choose a sample picture')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
            setCounts({ atoms: '', molecules: '' });
            setChecked(false);
          }}
        >
          {moleculeSamples.map((s, i) => (
            <option key={s.id} value={i}>
              {label(t('样品', 'Sample'), mode)} {s.id}
            </option>
          ))}
        </select>
      </label>
      <EntityCards entities={sample.entities} mode={mode} />
      <h3>
        <Localized
          mode={mode}
          text={t('先分类，再说出依据', 'Classify first, then explain why')}
        />
      </h3>
      <div className="ionic-choices">
        {(['element', 'compound', 'mixture'] as const).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={prediction === id}
            onClick={() => setPrediction(id)}
          >
            <Localized mode={mode} text={classNames[id]} />
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div
          className="ionic-result chem-molecule-classification"
          role="status"
        >
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === inventory.classification
                  ? t('分类与样品组成一致', 'Classification matches the sample')
                  : t(
                      '再区分元素种类和物质种类',
                      'Separate element types from substance types',
                    )
              }
            />
          </strong>
          <p>
            <Localized
              mode={mode}
              text={classNames[inventory.classification]}
            />{' '}
            · <Localized mode={mode} text={t('物质种类', 'Substance types')} />:{' '}
            {inventory.substanceKinds} ·{' '}
            <Localized mode={mode} text={t('元素种类', 'Element types')} />:{' '}
            {inventory.elementKinds}
          </p>
          <Localized
            mode={mode}
            text={t(
              '这些是“种类”数，不是原子或分子的个数；请接着自己清点下面两项。先看是否有不同物质，再对纯净物判断是否含不同元素。',
              'These are type counts, not atom or molecule totals; count those independently below. Check for different substances first, then distinguish element types within a pure substance.',
            )}
          />
        </div>
      )}
      <form
        className="chem-molecule-count-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <h3>
          <Localized
            mode={mode}
            text={t(
              '自己清点，不把“几个框”当作原子数',
              'Count for yourself; frames are not atom counts',
            )}
          />
        </h3>
        <div className="chem-molecule-inputs">
          {(['atoms', 'molecules'] as const).map((key) => (
            <CountInput
              key={key}
              text={label(
                key === 'atoms'
                  ? t('原子总数', 'Total atoms')
                  : t(
                      '分子总数（独立 He 原子不计为分子）',
                      'Total molecules (separate He atoms are not molecules)',
                    ),
                mode,
              )}
              value={counts[key]}
              onChange={(value) => {
                setCounts((old) => ({ ...old, [key]: value }));
                setChecked(false);
              }}
            />
          ))}
        </div>
        <button className="ionic-check" type="submit">
          <Localized mode={mode} text={t('核对我的清点', 'Check my counts')} />
        </button>
      </form>
      {checked && (
        <div className="ionic-result chem-molecule-count-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                !complete
                  ? t(
                      '请分别填写完整的非负整数；0 可以填写',
                      'Enter a complete nonnegative whole number in each box; zero is allowed',
                    )
                  : correct
                    ? t('两项清点都对上了', 'Both counts match')
                    : t(
                        '把原子和分子分开重新数',
                        'Recount atoms separately from molecules',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p>
                <Localized mode={mode} text={t('原子总数', 'Total atoms')} />:{' '}
                {inventory.atoms} ·{' '}
                <Localized
                  mode={mode}
                  text={t('分子总数', 'Total molecules')}
                />
                : {inventory.molecules}
              </p>
              <p>
                <Localized mode={mode} text={t('元素种类', 'Element types')} />:{' '}
                {inventory.elementKinds} ·{' '}
                <Localized
                  mode={mode}
                  text={t('物质种类', 'Substance types')}
                />
                : {inventory.substanceKinds}
              </p>
              <Localized mode={mode} text={sample.explanation} />
            </>
          )}
        </div>
      )}
      <p>
        <Localized
          mode={mode}
          text={t(
            '本活动只比较指定的独立原子和分子，不用“一框一个分子”解释盐晶体、金属或所有材料。图中的共存是给定情境，不预测混合后是否会反应。',
            'This activity compares only specified separate atoms and molecules. One-frame/one-molecule reasoning does not describe salt crystals, metals or every material. Coexistence is given, without predicting whether mixing causes reaction.',
          )}
        />
      </p>
    </div>
  );
}
function FormulaLab({ mode }: { mode: LanguageMode }) {
  const [id, setId] = useState<MolecularId>('H2O');
  const [copies, setCopies] = useState(2);
  const [answers, setAnswers] = useState<Partial<Record<AtomSymbol, string>>>(
    {},
  );
  const [checked, setChecked] = useState(false);
  const batch = formulaBatch(id, copies);
  const single = entityInventory([id]);
  const symbols = Object.keys(single.byElement) as AtomSymbol[];
  const complete = symbols.every(
    (s) => readParticleCount(answers[s] ?? '') !== null,
  );
  const correct = symbols.every(
    (s) => readParticleCount(answers[s] ?? '') === batch.byElement[s],
  );
  const reset = () => {
    setAnswers({});
    setChecked(false);
  };
  return (
    <div className="ionic-lab chem-molecule-lab" data-molecule-lab="formula">
      <Key mode={mode} />
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选一种分子式', 'Choose a molecular formula')}
        />
        <select
          value={id}
          onChange={(e) => {
            setId(e.target.value as MolecularId);
            reset();
          }}
        >
          {formulaChoices.map((value) => (
            <option value={value} key={value}>
              {entityCatalog[value].formula}
            </option>
          ))}
        </select>
      </label>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '整份分子有几份？改变系数，不改下标',
            'How many whole molecules? Change the coefficient, not subscripts',
          )}
        />
        <input
          aria-label={label(t('分子份数', 'Molecule copies'), mode)}
          type="range"
          min="1"
          max="4"
          step="1"
          value={copies}
          onChange={(e) => {
            setCopies(Number(e.target.value));
            reset();
          }}
        />
      </label>
      <div className="chem-molecule-expression" aria-live="polite">
        <b data-coefficient>{copies}</b>
        <span>{entityCatalog[id].formula}</span>
        <small>
          <Localized
            mode={mode}
            text={t(
              '前面数整份，右下角数一份内的原子',
              'Front number: whole copies. Subscripts: atoms within one copy.',
            )}
          />
        </small>
      </div>
      <EntityCards entities={batch.entities} mode={mode} />
      <form
        className="chem-molecule-count-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <h3>
          <Localized
            mode={mode}
            text={t(
              '不用改分子式，填写每种原子的总数',
              'Keep the formula; enter each element’s total atoms',
            )}
          />
        </h3>
        <div className="chem-molecule-inputs">
          {symbols.map((s) => (
            <CountInput
              key={s}
              text={`${label(atomNames[s], mode)} (${s})`}
              value={answers[s] ?? ''}
              onChange={(value) => {
                setAnswers((old) => ({ ...old, [s]: value }));
                setChecked(false);
              }}
            />
          ))}
        </div>
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t('核对整份乘法', 'Check the whole-copy multiplication')}
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
                      '每种元素都需要一个非负整数答案',
                      'Each element needs a nonnegative whole-number answer',
                    )
                  : correct
                    ? t(
                        '每种原子都乘了同一个系数',
                        'Every atom type was multiplied by the same coefficient',
                      )
                    : t(
                        '系数要乘每种原子，再核对一次',
                        'The coefficient multiplies every atom type; check again',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <div className="chem-molecule-multiplication">
                {symbols.map((s) => (
                  <p key={s}>
                    {s}: {copies} × {single.byElement[s]} ={' '}
                    <b>{batch.byElement[s]}</b>
                  </p>
                ))}
              </div>
              <p>
                <Localized mode={mode} text={t('分子数', 'Molecules')} />:{' '}
                {batch.molecules} ·{' '}
                <Localized mode={mode} text={t('原子总数', 'Total atoms')} />:{' '}
                {batch.atoms}
              </p>
            </>
          )}
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '原子总账相同，就一定是同一种物质吗？',
              'Does the same atom inventory prove the same substance?',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '不一定。2H₂O 和 2H₂ + O₂ 都合计 4 个 H、2 个 O；前者是两个水分子，后者是三个分子组成的混合物。元素总数没有记录原子怎样组合。本图不演示或安排这两者之间的实际反应。',
              'No. Both 2H₂O and 2H₂ + O₂ total four H and two O atoms. The first is two water molecules; the second is a three-molecule mixture. Atom totals omit how atoms are grouped. This activity neither demonstrates nor assigns the actual reaction between them.',
            )}
          />
        </p>
      </details>
      <p>
        <Localized
          mode={mode}
          text={t(
            '这里的化学式表示指定分子的组成，不给出形状、质量或性质；也不把所有化学式都当作分子式。离子晶体的比例与括号稍后另学。',
            'These formulas specify molecular composition, not shape, mass or properties. Not every chemical formula is a molecular formula. Ionic-crystal ratios and parentheses come later.',
          )}
        />
      </p>
    </div>
  );
}
export default function MoleculeEvidenceLab({
  kind,
  mode,
}: {
  kind: 'molecule-sample-evidence-lab' | 'molecular-formula-count-lab';
  mode: LanguageMode;
}) {
  return kind === 'molecule-sample-evidence-lab' ? (
    <SampleLab mode={mode} />
  ) : (
    <FormulaLab mode={mode} />
  );
}
