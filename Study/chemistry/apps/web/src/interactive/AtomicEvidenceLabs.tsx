import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import {
  atomicPairs,
  compareAtomicRecords,
  isotopeKits,
  isotopeMean,
  parseAtomicAnswer,
  particleLedger,
  type AtomicRecord,
  type MassMode,
} from './atomicEvidence';
import './IonicReactionLabs.css';
import './AtomicEvidenceLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];
const signed = (n: number) => (n === 0 ? '0' : n > 0 ? `+${n}` : `−${-n}`);
const chargeLabel = (n: number) =>
  n === 0 ? '' : `${Math.abs(n) === 1 ? '' : Math.abs(n)}${n > 0 ? '+' : '−'}`;
function Nuclide({
  record,
  mode,
}: {
  record: AtomicRecord;
  mode: LanguageMode;
}) {
  return (
    <div
      className="chem-atomic-symbol"
      aria-label={`${record.symbol}, A ${record.a}, Z ${record.z}, q ${signed(record.charge)}`}
    >
      <span className="chem-atomic-nuclear-label">
        <span>{record.a}</span>
        <span>{record.z}</span>
      </span>
      <b>{record.symbol}</b>
      <sup>{chargeLabel(record.charge)}</sup>
      <small>
        <Localized
          mode={mode}
          text={t(
            '左上 A：质量数 · 左下 Z：原子序数',
            'Upper left A: mass number · lower left Z: atomic number',
          )}
        />
        <br />q = {signed(record.charge)}
      </small>
    </div>
  );
}
function Ledger({
  record,
  mode,
}: {
  record: AtomicRecord;
  mode: LanguageMode;
}) {
  const l = particleLedger(record);
  return (
    <div className="chem-atomic-ledger">
      <p>
        <Localized
          mode={mode}
          text={t(
            '个数条：同一 0–20 标尺，不是实际位置或粒子大小',
            'Count bars: one 0–20 scale, not real positions or particle sizes',
          )}
        />
      </p>
      {[
        {
          id: 'p',
          value: l.protons,
          title: t('核内质子 p', 'Nuclear protons p'),
        },
        {
          id: 'n',
          value: l.neutrons,
          title: t('核内中子 n', 'Nuclear neutrons n'),
        },
        {
          id: 'e',
          value: l.electrons,
          title: t('核外电子 e', 'Outside electrons e'),
        },
      ].map((row) => (
        <div key={row.id} className="chem-atomic-bar-row">
          <span>
            <Localized mode={mode} text={row.title} /> : <b>{row.value}</b>
          </span>
          <div className="chem-atomic-track">
            <i
              className={`particle-${row.id}`}
              style={{ width: `${(row.value / 20) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
function NumberField({
  title,
  value,
  decimal = false,
  onChange,
}: {
  title: string;
  value: string;
  decimal?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="chem-atomic-number">
      <span>{title}</span>
      <input
        type="text"
        inputMode={decimal ? 'decimal' : 'numeric'}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function AtomicIdentityLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({ p: '', n: '', e: '' });
  const [isotopes, setIsotopes] = useState<boolean | null>(null);
  const [ion, setIon] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const pair = atomicPairs[index]!;
  const l = particleLedger(pair.second),
    comparison = compareAtomicRecords(pair.first, pair.second);
  const values = {
    p: parseAtomicAnswer(answers.p),
    n: parseAtomicAnswer(answers.n),
    e: parseAtomicAnswer(answers.e),
  };
  const complete =
    Object.values(values).every((n) => n !== null) &&
    isotopes !== null &&
    ion !== null;
  const countsCorrect =
    values.p === l.protons &&
    values.n === l.neutrons &&
    values.e === l.electrons;
  const allCorrect =
    countsCorrect &&
    isotopes === comparison.differentIsotopes &&
    ion === comparison.secondIsIon;
  return (
    <div className="ionic-lab chem-atomic-lab" data-atomic-lab="identity">
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择两份粒子记录', 'Choose a pair of particle records')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setAnswers({ p: '', n: '', e: '' });
            setIsotopes(null);
            setIon(null);
            setChecked(false);
          }}
        >
          {atomicPairs.map((p, i) => (
            <option key={p.id} value={i}>
              {label(t('记录组', 'Record pair'), mode)} {p.id}
            </option>
          ))}
        </select>
      </label>
      <div className="chem-atomic-records">
        <section>
          <h3>
            <Localized
              mode={mode}
              text={t('记录 A：已给出的清点', 'Record A: supplied inventory')}
            />
          </h3>
          <Nuclide record={pair.first} mode={mode} />
          <Ledger record={pair.first} mode={mode} />
        </section>
        <section>
          <h3>
            <Localized
              mode={mode}
              text={t(
                '记录 B：由记号还原',
                'Record B: reconstruct from the symbol',
              )}
            />
          </h3>
          <Nuclide record={pair.second} mode={mode} />
          <p>
            <Localized
              mode={mode}
              text={t(
                'p = Z；n = A − Z；q = p − e。q 有正负号；中子不带电。',
                'p = Z; n = A − Z; q = p − e. Keep q’s sign; neutrons are uncharged.',
              )}
            />
          </p>
        </section>
      </div>
      <form
        className="chem-atomic-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <h3>
          <Localized
            mode={mode}
            text={t(
              '先填写 B 的三个个数，再分别判断',
              'Enter B’s three counts, then make two separate judgments',
            )}
          />
        </h3>
        <div className="chem-atomic-number-grid">
          {(['p', 'n', 'e'] as const).map((key) => (
            <NumberField
              key={key}
              title={label(
                key === 'p'
                  ? t('B 的质子数 p', 'B proton count p')
                  : key === 'n'
                    ? t('B 的中子数 n', 'B neutron count n')
                    : t('B 的电子数 e', 'B electron count e'),
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
            id: 'isotopes',
            question: t(
              'A 与 B 是否为同元素的不同同位素记录？',
              'Do A and B represent different isotopes of the same element?',
            ),
            value: isotopes,
            set: setIsotopes,
          },
          {
            id: 'ion',
            question: t('B 是否是离子？', 'Is B an ion?'),
            value: ion,
            set: setIon,
          },
        ].map((row) => (
          <fieldset className="chem-atomic-judgment" key={row.id}>
            <legend>
              <Localized mode={mode} text={row.question} />
            </legend>
            <div className="ionic-choices">
              {[true, false].map((v) => (
                <button
                  type="button"
                  key={String(v)}
                  aria-pressed={row.value === v}
                  onClick={() => {
                    row.set(v);
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
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t('核对两个账本', 'Check both ledgers')}
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
                      '三个数填非负整数，两个判断都要作答',
                      'Enter three nonnegative whole numbers and answer both judgments',
                    )
                  : allCorrect
                    ? t(
                        '三个数和两个判断都对上了',
                        'All three counts and both judgments match',
                      )
                    : t(
                        '把核内账本与电荷账本分开核对',
                        'Check the nuclear ledger separately from the charge ledger',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p className="chem-atomic-answer">
                p = {l.protons} · n = {l.neutrons} · e = {l.electrons}
              </p>
              <p>
                A = {l.protons} + {l.neutrons} = {l.massNumber} · q ={' '}
                {l.protons} − {l.electrons} = {signed(l.charge)}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t('不同同位素', 'Different isotopes')}
                />
                :{' '}
                {label(
                  comparison.differentIsotopes ? t('是', 'Yes') : t('否', 'No'),
                  mode,
                )}{' '}
                · <Localized mode={mode} text={t('B 是离子', 'B is an ion')} />:{' '}
                {label(l.isIon ? t('是', 'Yes') : t('否', 'No'), mode)}
              </p>
              <Localized mode={mode} text={pair.explanation} />
              <Ledger record={pair.second} mode={mode} />
            </>
          )}
        </div>
      )}
      <p>
        <Localized
          mode={mode}
          text={t(
            '这是给定记录的比较，不是原子核转变或制备操作。电子数与中子数属于两个独立判断，不能把“同位素”和“离子”当作必须二选一。',
            'These are supplied records, not nuclear transformations or preparation instructions. Electron and neutron counts support separate judgments; isotope identity and ion status are not mutually exclusive.',
          )}
        />
      </p>
    </div>
  );
}
function IsotopeMeanLab({ mode }: { mode: LanguageMode }) {
  const [kitIndex, setKitIndex] = useState(0),
    [lightCount, setLightCount] = useState(15);
  const [massMode, setMassMode] = useState<MassMode>('mass-number');
  const [answer, setAnswer] = useState(''),
    [nearer, setNearer] = useState<string | null>(null),
    [checked, setChecked] = useState(false);
  const kit = isotopeKits[kitIndex]!,
    result = isotopeMean(kitIndex, lightCount, massMode);
  const parsed = parseAtomicAnswer(answer, true),
    complete = parsed !== null && nearer !== null;
  const correct =
    complete &&
    Math.abs(parsed - result.roundedMean) < 1e-9 &&
    nearer === result.nearer;
  const reset = () => {
    setAnswer('');
    setNearer(null);
    setChecked(false);
  };
  const digits = massMode === 'mass-number' ? 0 : 3;
  return (
    <div className="ionic-lab chem-atomic-lab" data-atomic-lab="mean">
      <div className="ionic-receipt">
        <Localized
          mode={mode}
          text={t(
            '20 张配比卡，每张代表题设样品的 5%；不是实测自然丰度，也不是显微照片。这里求相对质量的加权平均，没有 g 或 u 单位。',
            'Twenty composition cards each represent 5% of this given sample. They are not measured natural abundances or microscope images. We calculate a relative-mass weighted mean, with no g or u unit.',
          )}
        />
      </div>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '换一组同位素作迁移练习',
            'Choose an isotope pair for transfer practice',
          )}
        />
        <select
          aria-label={label(t('同位素样品', 'Isotope sample'), mode)}
          value={kitIndex}
          onChange={(e) => {
            setKitIndex(Number(e.target.value));
            reset();
          }}
        >
          {isotopeKits.map((k, i) => (
            <option key={k.id} value={i}>
              {label(k.name, mode)}
            </option>
          ))}
        </select>
      </label>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '选择本次计算的质量数据',
            'Choose this calculation’s mass data',
          )}
        />
        <select
          aria-label={label(t('质量数据', 'Mass data'), mode)}
          value={massMode}
          onChange={(e) => {
            setMassMode(e.target.value as MassMode);
            reset();
          }}
        >
          <option value="mass-number">
            {label(
              t(
                '入门近似：用质量数近似相对同位素质量',
                'Intro approximation: mass numbers stand in for relative isotope masses',
              ),
              mode,
            )}
          </option>
          <option value="relative">
            {label(
              t(
                '用给定的三位小数相对同位素质量',
                'Use supplied relative isotope masses rounded to three decimals',
              ),
              mode,
            )}
          </option>
        </select>
      </label>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '较轻同位素占几张卡？',
            'How many cards represent the lighter isotope?',
          )}
        />{' '}
        {lightCount}/20
        <input
          aria-label={label(t('较轻同位素卡数', 'Lighter-isotope cards'), mode)}
          type="range"
          min="0"
          max="20"
          step="1"
          value={lightCount}
          onChange={(e) => {
            setLightCount(Number(e.target.value));
            reset();
          }}
        />
      </label>
      <div
        className="chem-isotope-tokens"
        aria-label={`${kit.id}-${kit.lightA}: ${lightCount}; ${kit.id}-${kit.heavyA}: ${20 - lightCount}`}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className={i < lightCount ? 'isotope-light' : 'isotope-heavy'}
          >
            {i < lightCount ? kit.lightA : kit.heavyA}
          </span>
        ))}
      </div>
      <div className="chem-isotope-composition">
        <p>
          {kit.id}-{kit.lightA}: {result.lightCount}/20 ={' '}
          {result.lightCount * 5}%<br />
          <Localized mode={mode} text={t('本次使用质量', 'Mass used')} />:{' '}
          {result.lightMass.toFixed(digits)}
        </p>
        <p>
          {kit.id}-{kit.heavyA}: {result.heavyCount}/20 ={' '}
          {result.heavyCount * 5}%<br />
          <Localized mode={mode} text={t('本次使用质量', 'Mass used')} />:{' '}
          {result.heavyMass.toFixed(digits)}
        </p>
      </div>
      <form
        className="chem-atomic-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <fieldset className="chem-atomic-judgment">
          <legend>
            <Localized
              mode={mode}
              text={t(
                '平均值应更接近哪边？',
                'Which side should the mean be nearer?',
              )}
            />
          </legend>
          <div className="ionic-choices">
            {[
              { id: 'light', text: t('较轻端', 'Lighter end') },
              { id: 'middle', text: t('正中间', 'Exactly halfway') },
              { id: 'heavy', text: t('较重端', 'Heavier end') },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={nearer === c.id}
                onClick={() => {
                  setNearer(c.id);
                  setChecked(false);
                }}
              >
                <Localized mode={mode} text={c.text} />
              </button>
            ))}
          </div>
        </fieldset>
        <NumberField
          decimal
          title={label(
            t(
              '按给定质量计算平均值，保留两位小数',
              'Calculate from the supplied masses; round to two decimal places',
            ),
            mode,
          )}
          value={answer}
          onChange={(value) => {
            setAnswer(value);
            setChecked(false);
          }}
        />
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t('核对配比与平均', 'Check composition and mean')}
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
                      '先判断方向，并填写完整的非负数字',
                      'Choose a side and enter a complete nonnegative number',
                    )
                  : correct
                    ? t(
                        '方向与加权计算都对上了',
                        'Both direction and weighted calculation match',
                      )
                    : t(
                        '先检查权重，再检查除以总份数',
                        'Check the weights, then divide by the total shares',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p className="chem-isotope-calculation">
                ({result.lightCount} × {result.lightMass.toFixed(digits)} +{' '}
                {result.heavyCount} × {result.heavyMass.toFixed(digits)}) / 20 ={' '}
                {result.mean.toFixed(5)}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '按本题要求保留两位',
                    'Rounded to two places for this task',
                  )}
                />
                :{' '}
                <b className="chem-isotope-mean">
                  {result.roundedMean.toFixed(2)}
                </b>
              </p>
              <div className="chem-isotope-axis">
                <span>{result.lightMass.toFixed(digits)}</span>
                <span>{result.heavyMass.toFixed(digits)}</span>
              </div>
              <div className="chem-isotope-mean-track">
                <i style={{ left: `${result.heavyFraction * 100}%` }} />
              </div>
              <Localized
                mode={mode}
                text={t(
                  '平均值向数量更多的那种同位素靠近；两种各一半才正好在中间。只有一种时就等于该端，不会超出两端。',
                  'The mean lies nearer the more abundant isotope; equal shares put it halfway. With only one isotope it equals that endpoint and never lies outside the two endpoints.',
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
              '这就是周期表上的精确数值吗？',
              'Is this an exact periodic-table value?',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '不是。配比由本题设定；质量数不是精确的相对同位素质量，三位小数数据也已舍入。真实样品的同位素比例可能不同，标准原子量还可能用区间表示。相对原子质量无单位；不能把小数当作半个中子或一粒原子的克数。',
              'No. Composition is authored; mass numbers are not exact relative isotope masses, and the three-decimal data are rounded too. Real samples can differ in isotopic composition, and standard atomic weights may be intervals. Relative atomic mass has no unit; decimals are neither fractional neutrons nor grams per atom.',
            )}
          />
        </p>
      </details>
    </div>
  );
}
export default function AtomicEvidenceLab({
  kind,
  mode,
}: {
  kind: 'isotope-ion-ledger-lab' | 'isotope-weighted-mean-lab';
  mode: LanguageMode;
}) {
  return kind === 'isotope-ion-ledger-lab' ? (
    <AtomicIdentityLab mode={mode} />
  ) : (
    <IsotopeMeanLab mode={mode} />
  );
}
