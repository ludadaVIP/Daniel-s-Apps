import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import { parseAtomicAnswer } from './atomicEvidence';
import {
  electronTransferLedger,
  firstTwenty,
  ionTransferPairs,
  shellRecord,
  shellRecords,
  type ElementSymbol,
} from './periodicEvidence';
import './IonicReactionLabs.css';
import './PeriodicEvidenceLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];
const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
const charge = (n: number) =>
  n === 0 ? '' : `${Math.abs(n) === 1 ? '' : Math.abs(n)}${n > 0 ? '+' : '−'}`;
function IonLabel({ symbol, q }: { symbol: string; q: number }) {
  return (
    <span className="chem-periodic-ion">
      {symbol}
      <span>{charge(q)}</span>
    </span>
  );
}
function CountField({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="chem-periodic-input">
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
function ShellBands({
  shells,
  mode,
}: {
  shells: readonly number[];
  mode: LanguageMode;
}) {
  return (
    <div className="chem-periodic-shells">
      {shells.map((count, i) => (
        <div key={i} className="chem-periodic-shell-row">
          <span>
            {label(t('第', 'Shell'), mode)} {i + 1}
            {mode === 'zh' ? ' 层' : ''}: <b>{count}</b>
          </span>
          <div className="chem-periodic-electrons" aria-label={`${count}`}>
            {Array.from({ length: count }, (_, j) => (
              <i key={j} aria-hidden="true" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function PositionMap({
  symbol,
  mode,
}: {
  symbol: ElementSymbol;
  mode: LanguageMode;
}) {
  const groups = [1, 2, 13, 14, 15, 16, 17, 18];
  return (
    <div
      className="chem-periodic-map"
      role="region"
      tabIndex={0}
      aria-label={label(
        t(
          '前 20 号元素位置表，可横向滚动',
          'First-twenty element map; scroll horizontally',
        ),
        mode,
      )}
    >
      <table>
        <caption>
          <Localized
            mode={mode}
            text={t(
              '只列前 20 号元素；位置属于元素，不是按离子重新排表',
              'First 20 elements only; positions belong to elements, not a rearrangement by ions',
            )}
          />
        </caption>
        <thead>
          <tr>
            <th>
              <Localized mode={mode} text={t('周期 / 族', 'Period / group')} />
            </th>
            {groups.map((g) => (
              <th key={g}>{g}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((period) => (
            <tr key={period}>
              <th>{period}</th>
              {groups.map((group) => {
                const e = firstTwenty.find(
                  (e) => e.period === period && e.group === group,
                );
                return (
                  <td
                    key={group}
                    className={e?.symbol === symbol ? 'selected-element' : ''}
                  >
                    {e ? (
                      <>
                        <strong>{e.symbol}</strong>
                        <small>Z {e.z}</small>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function ShellPositionLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState({ electrons: '', period: '', group: '' });
  const [restore, setRestore] = useState<boolean | null>(null),
    [checked, setChecked] = useState(false);
  const record = shellRecord(index),
    element = record.element;
  const parsed = {
    electrons: parseAtomicAnswer(answers.electrons),
    period: parseAtomicAnswer(answers.period),
    group: parseAtomicAnswer(answers.group),
  };
  const complete =
    Object.values(parsed).every((v) => v !== null) && restore !== null;
  const correct =
    parsed.electrons === record.electrons &&
    parsed.period === element.period &&
    parsed.group === element.group &&
    restore === record.needsNeutralReference;
  return (
    <div className="ionic-lab chem-periodic-lab" data-periodic-lab="position">
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '选择指定基态粒子记录',
            'Choose a supplied ground-state particle record',
          )}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setAnswers({ electrons: '', period: '', group: '' });
            setRestore(null);
            setChecked(false);
          }}
        >
          {shellRecords.map((r, i) => (
            <option value={i} key={i}>
              {r.symbol}
              {charge(r.charge)} · Z{' '}
              {firstTwenty.find((e) => e.symbol === r.symbol)!.z}
            </option>
          ))}
        </select>
      </label>
      <div className="ionic-receipt">
        <IonLabel symbol={record.symbol} q={record.charge} />
        <p>
          Z = {element.z} · q = {signed(record.charge)}
        </p>
        <Localized
          mode={mode}
          text={t(
            '圆点只清点电子，分行表示电子层；不是圆形轨道、真实距离或电子照片。范围限前 20 号的指定基态原子与离子。',
            'Dots count electrons and rows distinguish shells, not circular paths, real distances or photographs. Scope: specified ground-state atoms and ions among the first 20 elements.',
          )}
        />
      </div>
      <ShellBands shells={record.shells} mode={mode} />
      <form
        className="chem-periodic-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <fieldset className="chem-periodic-question">
          <legend>
            <Localized
              mode={mode}
              text={t(
                '读元素位置前，是否要先还原该元素的中性排布？',
                'Before reading the element’s position, must you first restore its neutral arrangement?',
              )}
            />
          </legend>
          <div className="ionic-choices">
            {[
              {
                value: false,
                text: t(
                  '这已是中性排布，可作线索（He 另记特例）',
                  'Already neutral: use it as a clue, retaining the He exception',
                ),
              },
              {
                value: true,
                text: t(
                  '这是离子，先按 Z 还原中性排布',
                  'This is an ion: restore the neutral arrangement using Z',
                ),
              },
            ].map((c) => (
              <button
                type="button"
                key={String(c.value)}
                aria-pressed={restore === c.value}
                onClick={() => {
                  setRestore(c.value);
                  setChecked(false);
                }}
              >
                <Localized mode={mode} text={c.text} />
              </button>
            ))}
          </div>
        </fieldset>
        <div className="chem-periodic-fields">
          {(['electrons', 'period', 'group'] as const).map((key) => (
            <CountField
              key={key}
              title={label(
                key === 'electrons'
                  ? t(
                      '图中粒子的电子总数',
                      'Electrons in the pictured particle',
                    )
                  : key === 'period'
                    ? t('该元素的周期', 'The element’s period')
                    : t('该元素的族号（1–18）', 'The element’s group (1–18)'),
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
        <button type="submit" className="ionic-check">
          <Localized
            mode={mode}
            text={t(
              '核对排布与元素位置',
              'Check arrangement and element position',
            )}
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
                      '请填写三个非负整数，并选择读表方法',
                      'Enter three nonnegative whole numbers and choose a reading method',
                    )
                  : correct
                    ? t(
                        '电子清点、元素位置和读法都一致',
                        'Electron count, element position and reading method match',
                      )
                    : t(
                        '先用 Z 保留元素身份，再核对中性排布',
                        'Keep element identity with Z, then check the neutral arrangement',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p>
                <Localized
                  mode={mode}
                  text={t('图中电子数', 'Pictured electrons')}
                />
                : {record.electrons} · q = {element.z} − {record.electrons} ={' '}
                {signed(record.charge)}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '该元素的中性排布',
                    'This element’s neutral arrangement',
                  )}
                />
                : {element.shells.join(', ')} ·{' '}
                <Localized mode={mode} text={t('周期', 'Period')} />:{' '}
                {element.period} ·{' '}
                <Localized mode={mode} text={t('族', 'Group')} />:{' '}
                {element.group}
              </p>
              <ShellBands shells={element.shells} mode={mode} />
              <Localized
                mode={mode}
                text={
                  record.symbol === 'He'
                    ? t(
                        'He 的中性排布只有第一层的 2 个电子，却属于第 18 族，不是第 2 族。不能把族号机械等同于最外层电子数。',
                        'Neutral He has only two first-shell electrons but belongs to Group 18, not Group 2. Group number is not mechanically identical to outer-electron count.',
                      )
                    : record.charge !== 0
                      ? t(
                          '失、得电子没有改变 Z，元素不会搬到另一族或变成相同排布的稀有气体。某些离子的层数恰好等于原周期，也不能据此套用整套中性读法。',
                          'Losing or gaining electrons leaves Z unchanged. The element does not move groups or become a noble gas with the same arrangement. Some ion shell counts happen to match the original period; that does not validate the whole neutral-reading rule.',
                        )
                      : t(
                          '本范围的中性基态主族原子，层数可作周期线索；最外层 1、2 个对应第 1、2 族，3–8 个对应第 13–18 族，He 是已指出的特例。',
                          'For these neutral ground-state main-group atoms, shell count suggests period; one or two outer electrons correspond to Groups 1 or 2, and three to eight to Groups 13–18, with the stated He exception.',
                        )
                }
              />
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '小屏可左右滑动下表；绿色格表示该元素的位置。',
                    'On small screens, scroll the table sideways; the green cell marks this element’s position.',
                  )}
                />
              </p>
              <PositionMap symbol={record.symbol} mode={mode} />
            </>
          )}
        </div>
      )}
      <p>
        <Localized
          mode={mode}
          text={t(
            '没有预测激发态、过渡金属或任意离子的排布；“2、8、8”也不是所有电子层的通用容量上限。',
            'This does not predict excited states, transition metals or arbitrary ions; “2, 8, 8” is not a universal shell-capacity rule.',
          )}
        />
      </p>
    </div>
  );
}
function TransferBudgetLab({ mode }: { mode: LanguageMode }) {
  const [pairIndex, setPairIndex] = useState(1),
    [metalCount, setMetalCount] = useState(1),
    [nonmetalCount, setNonmetalCount] = useState(1);
  const [supply, setSupply] = useState(''),
    [demand, setDemand] = useState(''),
    [prediction, setPrediction] = useState<string | null>(null),
    [checked, setChecked] = useState(false);
  const ledger = electronTransferLedger(pairIndex, metalCount, nonmetalCount),
    pair = ledger.pair;
  const complete =
    parseAtomicAnswer(supply) !== null &&
    parseAtomicAnswer(demand) !== null &&
    prediction !== null;
  const correct =
    complete &&
    parseAtomicAnswer(supply) === ledger.supply &&
    parseAtomicAnswer(demand) === ledger.demand &&
    prediction === ledger.status;
  const reset = () => {
    setSupply('');
    setDemand('');
    setPrediction(null);
    setChecked(false);
  };
  return (
    <div className="ionic-lab chem-periodic-lab" data-periodic-lab="transfer">
      <div className="ionic-receipt">
        <Localized
          mode={mode}
          text={t(
            '从中性原子库存出发，假设末态只有下列两种指定离子。先检查所需电子能否全部对应；不匹配的候选库存不是已经形成的产物。',
            'Start with a neutral-atom inventory and hypothesise an end inventory containing only the two specified ion types. Check whether electron demands match. An unmatched candidate is not an already formed product.',
          )}
        />
      </div>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '指定离子对（电荷已给定）',
            'Specified ion pair (charges supplied)',
          )}
        />
        <select
          value={pairIndex}
          onChange={(e) => {
            setPairIndex(Number(e.target.value));
            reset();
          }}
        >
          {ionTransferPairs.map((p, i) => (
            <option key={p.id} value={i}>
              {p.metal}
              {charge(p.positive)} / {p.nonmetal}
              {charge(p.negative)}
            </option>
          ))}
        </select>
      </label>
      <div className="chem-periodic-counts">
        {[
          {
            metal: true,
            value: metalCount,
            symbol: pair.metal,
            set: setMetalCount,
          },
          {
            metal: false,
            value: nonmetalCount,
            symbol: pair.nonmetal,
            set: setNonmetalCount,
          },
        ].map((c) => (
          <label key={String(c.metal)} className="ionic-control">
            {c.symbol} · {label(t('中性原子个数', 'Neutral atom count'), mode)}:{' '}
            {c.value}
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              aria-label={label(
                c.metal
                  ? t('金属原子个数', 'Metal atom count')
                  : t('非金属原子个数', 'Nonmetal atom count'),
                mode,
              )}
              value={c.value}
              onChange={(e) => {
                c.set(Number(e.target.value));
                reset();
              }}
            />
          </label>
        ))}
      </div>
      <div className="chem-periodic-transfer-cards">
        <section>
          <IonLabel symbol={pair.metal} q={pair.positive} />
          <p>
            <Localized
              mode={mode}
              text={t(
                `每个 ${pair.metal} 要失去 ${pair.positive} 个电子；共 ${metalCount} 个中性原子。`,
                `Each ${pair.metal} must lose ${pair.positive} ${pair.positive === 1 ? 'electron' : 'electrons'}; supplied neutral atoms: ${metalCount}.`,
              )}
            />
          </p>
        </section>
        <span className="chem-periodic-route" aria-hidden="true">
          <span>e⁻</span>
          <b>→</b>
        </span>
        <section>
          <IonLabel symbol={pair.nonmetal} q={pair.negative} />
          <p>
            <Localized
              mode={mode}
              text={t(
                `每个 ${pair.nonmetal} 要得到 ${-pair.negative} 个电子；共 ${nonmetalCount} 个中性原子。`,
                `Each ${pair.nonmetal} must gain ${-pair.negative} ${pair.negative === -1 ? 'electron' : 'electrons'}; supplied neutral atoms: ${nonmetalCount}.`,
              )}
            />
          </p>
        </section>
      </div>
      <form
        className="chem-periodic-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <div className="chem-periodic-counts">
          <CountField
            title={label(
              t(
                '金属需要失去的电子总数',
                'Total electrons the metals must lose',
              ),
              mode,
            )}
            value={supply}
            onChange={(v) => {
              setSupply(v);
              setChecked(false);
            }}
          />
          <CountField
            title={label(
              t(
                '非金属需要得到的电子总数',
                'Total electrons the nonmetals must gain',
              ),
              mode,
            )}
            value={demand}
            onChange={(v) => {
              setDemand(v);
              setChecked(false);
            }}
          />
        </div>
        <fieldset className="chem-periodic-question">
          <legend>
            <Localized
              mode={mode}
              text={t(
                '没有外部电子进出，候选账本怎样？',
                'With no external electrons entering or leaving, how does the candidate ledger compare?',
              )}
            />
          </legend>
          <div className="ionic-choices">
            {[
              {
                id: 'matched',
                text: t('电子数对应，账本可对上', 'Electron counts match'),
              },
              {
                id: 'shortage',
                text: t('提供少于需要，电子不足', 'Supply is below demand'),
              },
              {
                id: 'surplus',
                text: t(
                  '提供多于需要，电子无对应去向',
                  'Supply exceeds demand',
                ),
              },
            ].map((c) => (
              <button
                type="button"
                key={c.id}
                aria-pressed={prediction === c.id}
                onClick={() => {
                  setPrediction(c.id);
                  setChecked(false);
                }}
              >
                <Localized mode={mode} text={c.text} />
              </button>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="ionic-check">
          <Localized
            mode={mode}
            text={t('核对同一批电子', 'Check the same electron inventory')}
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
                      '填写两个非负整数，并作出判断',
                      'Enter two nonnegative whole numbers and make a judgment',
                    )
                  : correct
                    ? t(
                        '乘法与电子配对判断都一致',
                        'Multiplication and electron matching agree',
                      )
                    : t(
                        '先乘每个原子的需求，再比较两端',
                        'Multiply each atom’s requirement, then compare the two sides',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p className="chem-periodic-budget">
                {metalCount} × {pair.positive} = {ledger.supply} e⁻ ·{' '}
                {nonmetalCount} × {-pair.negative} = {ledger.demand} e⁻
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '中性起始库存：质子总数 = 电子总数',
                    'Neutral starting inventory: total protons = total electrons',
                  )}
                />
                : {ledger.protons}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '假设全部变成标签中离子时的电子总数',
                    'Hypothetical electron total if all specified ions were present',
                  )}
                />
                : {ledger.desiredElectrons}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '候选离子库存的形式总电荷',
                    'Formal net charge of the candidate ion inventory',
                  )}
                />
                : {signed(ledger.candidateCharge)}
              </p>
              <Localized
                mode={mode}
                text={
                  ledger.status === 'matched'
                    ? t(
                        '同一批电子的失、得数量相等，整体电荷也能维持零。这只是必要的库存检查；还不能证明反应会发生、反应完全或已经形成晶体。',
                        'The same electron inventory has equal loss and gain, preserving zero overall charge. This necessary inventory check does not prove reaction, completion or crystal formation.',
                      )
                    : t(
                        '不能把这个非零候选电荷当作封闭系统从中性变带电的结果。若末态只计这些候选离子，又不计额外电子或其他物种，账本无法闭合；需改配比，或把遗漏粒子及其电荷完整计入。',
                        'Do not treat this nonzero candidate charge as a closed system becoming charged from neutrality. An inventory counting only these ions, without additional electrons or other species, cannot close. Revise proportions or account fully for omitted particles and charge.',
                      )
                }
              />
            </>
          )}
        </div>
      )}
      <p>
        <Localized
          mode={mode}
          text={t(
            '这里只清点给定原子与候选离子，不模拟 Cl₂ 等原材料分子、成键能、速率或产率。实际给料也可能有原料剩余；本题不判断反应能否开始。离子库存不是独立“盐分子”的图。',
            'This counts supplied atoms and candidate ions, not feed molecules such as Cl₂, bonding energies, rates or yields. Real feeds can leave reactants over; this does not decide whether a reaction begins. An ion inventory is not one discrete salt molecule.',
          )}
        />
      </p>
    </div>
  );
}
export default function PeriodicEvidenceLab({
  kind,
  mode,
}: {
  kind: 'neutral-shell-position-lab' | 'electron-transfer-budget-lab';
  mode: LanguageMode;
}) {
  return kind === 'neutral-shell-position-lab' ? (
    <ShellPositionLab mode={mode} />
  ) : (
    <TransferBudgetLab mode={mode} />
  );
}
