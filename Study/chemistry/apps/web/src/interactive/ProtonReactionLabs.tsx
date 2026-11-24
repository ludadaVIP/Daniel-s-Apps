import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import {
  carbonGasLedger,
  carbonSalts,
  hydroxideStocks,
  neutralisationLedger,
  protonEvents,
  protonInventoryCharge,
  protonSpecies,
  type ProtonInventory,
  type ProtonSpeciesId,
} from './protonReactions';
import './IonicReactionLabs.css';
import './ProtonReactionLabs.css';

const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];

function Ledger({
  inventory,
  mode,
  event = false,
}: {
  inventory: ProtonInventory;
  mode: LanguageMode;
  event?: boolean;
}) {
  return (
    <div className="ionic-ledger proton-ledger">
      {Object.entries(inventory).map(([id, amount]) => (
        <div key={id} className="ionic-species">
          <b>{protonSpecies[id as ProtonSpeciesId].label}</b>
          <span>
            {amount}{' '}
            {event ? (
              <Localized mode={mode} text={t('份', 'portion(s)')} />
            ) : (
              'mmol'
            )}
          </span>
        </div>
      ))}
      <p>
        <Localized mode={mode} text={t('净电荷账本', 'Net charge ledger')} />:{' '}
        {protonInventoryCharge(inventory)} {event ? '× e' : 'mmol × e'}
      </p>
    </div>
  );
}

function ProtonTransferLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [prediction, setPrediction] = useState<ProtonSpeciesId | null>(null);
  const event = protonEvents[index]!;
  return (
    <div className="ionic-lab proton-reaction-lab" data-proton-lab="transfer">
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择一次转移事件', 'Choose one transfer event')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
          }}
        >
          {protonEvents.map((item, i) => (
            <option key={item.id} value={i}>
              {label(item.title, mode)}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Localized
          mode={mode}
          text={t(
            '先看反应前：谁能给出一个 H⁺？点击你的预测。这里的“份”只表示单次事件的粒子比例，不表示整杯组成。',
            'Before the event: who donates one H⁺? Choose your prediction. Portions show the particle ratio of one event, not the bulk composition.',
          )}
        />
      </p>
      <Ledger inventory={event.before} mode={mode} event />
      <div className="ionic-choices">
        {Object.keys(event.before).map((key) => {
          const id = key as ProtonSpeciesId;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={prediction === id}
              onClick={() => setPrediction(id)}
            >
              {protonSpecies[id].label}
            </button>
          );
        })}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === event.donor
                  ? t('找到了质子给出者', 'You found the proton donor')
                  : t(
                      '再看氢的数目：哪一方失去一个 H⁺？',
                      'Recheck hydrogen counts: which species loses one H⁺?',
                    )
              }
            />
          </strong>
          <div
            className="proton-route"
            aria-label={
              mode === 'en' ? 'Proton transfer route' : '质子转移路线'
            }
          >
            <div>
              <Localized mode={mode} text={t('给出者：酸', 'Donor: acid')} />
              <b>{protonSpecies[event.donor].label}</b>
              <span>→ {protonSpecies[event.donorProduct].label}</span>
            </div>
            <span className="proton-token">H⁺ →</span>
            <div>
              <Localized mode={mode} text={t('接受者：碱', 'Acceptor: base')} />
              <b>{protonSpecies[event.acceptor].label}</b>
              <span>→ {protonSpecies[event.acceptorProduct].label}</span>
            </div>
          </div>
          <p className="ionic-equation">{event.equation}</p>
          <Ledger inventory={event.after} mode={mode} event />
          <p>
            <Localized text={event.explanation} mode={mode} />
          </p>
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '这个图没有声称什么？',
              'What does this diagram not claim?',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '只追踪一个 H⁺ 转移和粒子组成，不计算速率、平衡比例或 pH。H⁺ 是质子转移记号，真实水中不会以孤立“裸质子”存在；图也没有表示电子转移或原子核变化。所有活动完全虚拟。',
              'This tracks one proton transfer and species composition, not rate, equilibrium fractions or pH. H⁺ denotes proton transfer; an isolated bare proton does not persist in water. The diagram is not electron transfer or a change of atomic nuclei. All activities are virtual.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

function NeutralisationLedgerLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [acid, setAcid] = useState(3);
  const [base, setBase] = useState(2);
  const [prediction, setPrediction] = useState<string | null>(null);
  const stock = hydroxideStocks[index]!;
  const result = neutralisationLedger(stock, acid, base);
  const outcomes = [
    { id: 'acid', title: t('强酸有剩余', 'Strong acid remains') },
    {
      id: 'balanced',
      title: t('反应当量恰好相抵', 'Reaction equivalents match'),
    },
    { id: 'base', title: t('强碱有剩余', 'Strong base remains') },
  ];
  return (
    <div
      className="ionic-lab proton-reaction-lab"
      data-proton-lab="neutralisation"
    >
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择已溶解的碱', 'Choose the dissolved base')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
          }}
        >
          {hydroxideStocks.map((item, i) => (
            <option key={item.id} value={i}>
              {item.formula}(aq)
            </option>
          ))}
        </select>
      </label>
      <div className="ionic-controls">
        {[
          { name: 'HCl', amount: acid, max: 6, update: setAcid },
          { name: stock.formula, amount: base, max: 3, update: setBase },
        ].map((control) => (
          <label key={control.name} className="ionic-control">
            {control.name}: {control.amount} mmol
            <input
              type="range"
              aria-label={`${control.name} mmol`}
              min="1"
              max={control.max}
              step="1"
              value={control.amount}
              onChange={(e) => {
                control.update(Number(e.target.value));
                setPrediction(null);
              }}
            />
          </label>
        ))}
      </div>
      <div className="ionic-receipt">
        <Localized
          mode={mode}
          text={t('先展开，再预测', 'Expand first, then predict')}
        />
        <strong>
          {acid} mmol H⁺ · {base} × {stock.hydroxides} = {result.hydroxideMmol}{' '}
          mmol OH⁻
        </strong>
        <span>
          <Localized
            mode={mode}
            text={t(
              'H⁺(aq) 是水合质子的简写；不表示裸质子。输入是 mmol，不是体积。',
              'H⁺(aq) abbreviates hydrated protons, not bare protons. Inputs are mmol, not volumes.',
            )}
          />
        </span>
      </div>
      <Ledger inventory={result.before} mode={mode} />
      <p>
        <Localized
          mode={mode}
          text={t(
            '反应后，哪一种判断成立？',
            'Which description will hold after reaction?',
          )}
        />
      </p>
      <div className="ionic-choices">
        {outcomes.map((outcome) => (
          <button
            type="button"
            key={outcome.id}
            aria-pressed={prediction === outcome.id}
            onClick={() => setPrediction(outcome.id)}
          >
            <Localized text={outcome.title} mode={mode} />
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === result.balance
                  ? t('比例与预测一致', 'The ratio supports your prediction')
                  : t(
                      '重新比较 H⁺ 与 OH⁻ 的 mmol 数',
                      'Compare mmol of H⁺ and OH⁻ again',
                    )
              }
            />
          </strong>
          <p className="ionic-equation">H⁺(aq) + OH⁻(aq) → H₂O(l)</p>
          <div className="proton-water">
            <Localized
              mode={mode}
              text={t(
                '本反应净生成的水',
                'Net water produced by this reaction',
              )}
            />
            <b>{result.reactedMmol} mmol H₂O</b>
          </div>
          <h3>
            <Localized
              mode={mode}
              text={t(
                '主要水相离子（不是水的总量）',
                'Major aqueous ions (not total solvent water)',
              )}
            />
          </h3>
          <Ledger inventory={result.solution} mode={mode} />
          <p>
            <Localized
              mode={mode}
              text={t(
                'H⁺ 与 OH⁻ 按 1∶1 消耗。Na⁺/Ca²⁺ 和 Cl⁻ 没有消失；即使恰好相抵，溶液仍含离子。',
                'H⁺ and OH⁻ are consumed 1:1. Na⁺/Ca²⁺ and Cl⁻ do not disappear; a matched mixture still contains ions.',
              )}
            />
          </p>
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t('模型假设与边界', 'Assumptions and limits')}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '只模拟给定的、已完全溶解并解离的 HCl、NaOH 或 Ca(OH)₂，按强酸强碱近似计量。不模拟固体碱继续溶解、弱酸弱碱平衡、pH、体积、温度或指示剂。0 忽略了水自身的微量 H₃O⁺/OH⁻；不能推出任何盐溶液都中性。全部为虚拟活动。',
              'Only the specified fully dissolved and dissociated HCl, NaOH or Ca(OH)₂ stocks are modelled using strong-acid/strong-base stoichiometry. Solid dissolution, weak equilibria, pH, volume, temperature and indicators are not simulated. A 0 omits water’s trace H₃O⁺/OH⁻; this does not make every salt solution neutral. The activity is entirely virtual.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

function CarbonateAcidLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [amount, setAmount] = useState(2);
  const [extra, setExtra] = useState(1);
  const [prediction, setPrediction] = useState<number | null>(null);
  const salt = carbonSalts[index]!;
  const result = carbonGasLedger(salt, amount, extra);
  return (
    <div className="ionic-lab proton-reaction-lab" data-proton-lab="carbonate">
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '等量含碳粒子的对照',
            'Compare equal amounts of carbon-containing ions',
          )}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
          }}
        >
          {carbonSalts.map((item, i) => (
            <option key={item.id} value={i}>
              {item.formula}(aq)
            </option>
          ))}
        </select>
      </label>
      <div className="ionic-controls">
        <label className="ionic-control">
          {salt.formula}: {amount} mmol
          <input
            type="range"
            aria-label="Carbon salt mmol"
            min="1"
            max="3"
            step="1"
            value={amount}
            onChange={(e) => {
              setAmount(Number(e.target.value));
              setPrediction(null);
            }}
          />
        </label>
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t('预留的过量 HCl', 'Extra HCl kept in excess')}
          />
          : {extra} mmol
          <input
            type="range"
            aria-label="Excess HCl mmol"
            min="1"
            max="3"
            step="1"
            value={extra}
            onChange={(e) => {
              setExtra(Number(e.target.value));
              setPrediction(null);
            }}
          />
        </label>
      </div>
      <p>
        <Localized
          mode={mode}
          text={t(
            '先预测：把投入的含碳离子全部转为 CO₂，理论上需要消耗多少 mmol H⁺？系统会在所需量之外再加入上面指定的过量酸。',
            'Predict the mmol of H⁺ consumed to convert all supplied carbon-containing ions to CO₂. The system supplies that required amount plus the extra acid specified above.',
          )}
        />
      </p>
      <div className="ionic-choices">
        {[1, 2, 3, 4, 5, 6].map((choice) => (
          <button
            key={choice}
            type="button"
            aria-pressed={prediction === choice}
            onClick={() => setPrediction(choice)}
          >
            {choice} mmol H⁺
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === result.requiredAcidMmol
                  ? t('耗酸比例正确', 'The acid requirement is correct')
                  : t(
                      '先核对每个含碳离子需要几个 H⁺',
                      'Check how many H⁺ each carbon-containing ion needs',
                    )
              }
            />
          </strong>
          <p className="ionic-equation">{salt.equation}</p>
          <div className="ionic-receipt">
            <Localized
              mode={mode}
              text={t(
                '投入酸 = 理论需要量 + 过量',
                'Acid supplied = theoretical requirement + excess',
              )}
            />
            <b>
              {result.acidMmol} = {result.requiredAcidMmol} + {extra} mmol HCl
            </b>
          </div>
          <h3>
            <Localized
              mode={mode}
              text={t(
                '反应后的主要水相离子',
                'Major aqueous ions after reaction',
              )}
            />
          </h3>
          <Ledger inventory={result.solution} mode={mode} />
          <div className="proton-gas">
            <Localized
              mode={mode}
              text={t(
                '单独记录的气体收集区',
                'Separately recorded gas collection region',
              )}
            />
            <b>
              {result.gasMmol} mmol CO₂ · {result.gasMassG.toFixed(3)} g
            </b>
          </div>
          <div className="proton-water">
            <Localized
              mode={mode}
              text={t(
                '本反应净生成的水',
                'Net water produced by this reaction',
              )}
            />
            <b>{amount} mmol H₂O</b>
          </div>
          <p>
            <Localized
              mode={mode}
              text={t(
                '改换另一种盐，保持相同的 mmol 数：酸的需要量会变，CO₂ 的理论总量却相同。若气体离开称量范围，容器读数可减少；把气体计入总系统，原子和质量仍守恒。',
                'Switch salts while keeping mmol fixed: acid requirement changes, but total theoretical CO₂ does not. A vessel reading can decrease when gas leaves its weighing boundary; including the gas restores the full conserved inventory.',
              )}
            />
          </p>
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t('为何只开放酸过量的输入？', 'Why only acid-excess inputs?')}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '本课假定足够强酸、充分反应并将生成的 CO₂ 全部计入收集区；忽略气体留溶、逆反应、水蒸气与损失，不计算气体体积或速率。酸不足时可能残留 CO₃²⁻/HCO₃⁻，不能把 min(碳酸根, H⁺÷2) 直接当成真实气体产量。气泡外观本身也不能鉴定气体。模型完全虚拟。',
              'Assume excess strong acid, complete reaction and accounting of all formed CO₂ in the collection region. Gas retained in solution, reverse reactions, water vapour and losses are omitted; gas volume and rate are not calculated. With insufficient acid, CO₃²⁻/HCO₃⁻ can remain: min(carbonate, H⁺/2) is not a reliable actual gas yield. Bubbles alone do not identify a gas. The model is entirely virtual.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

export default function ProtonReactionLab({
  kind,
  mode,
}: {
  kind:
    | 'proton-transfer-lab'
    | 'neutralisation-ledger-lab'
    | 'carbonate-acid-ledger-lab';
  mode: LanguageMode;
}) {
  if (kind === 'proton-transfer-lab') return <ProtonTransferLab mode={mode} />;
  if (kind === 'neutralisation-ledger-lab')
    return <NeutralisationLedgerLab mode={mode} />;
  return <CarbonateAcidLab mode={mode} />;
}
