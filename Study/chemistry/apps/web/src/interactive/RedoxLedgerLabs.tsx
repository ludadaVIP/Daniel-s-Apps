import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import {
  displacementCharge,
  displacementLedger,
  displacementMetals,
  displacementSpecies,
  electronPairs,
  halfReactionAudit,
  oxidationCases,
  oxidationLedger,
  type DisplacementInventory,
  type DisplacementSpeciesId,
} from './redoxLedgers';
import './IonicReactionLabs.css';
import './RedoxLedgerLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const signed = (value: number) =>
  value > 0 ? `+${value}` : String(value).replace('-', '−');

function OxidationNumberLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const sample = oxidationCases[index]!;
  const result = oxidationLedger(sample);
  return (
    <div
      className="ionic-lab redox-ledger-lab"
      data-redox-lab="oxidation-number"
    >
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '选择物种；比较 HCl/Cl⁻、NH₃/NH₄⁺',
            'Choose a species; compare HCl/Cl⁻ and NH₃/NH₄⁺',
          )}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
          }}
        >
          {oxidationCases.map((item, i) => (
            <option key={item.id} value={i}>
              {item.formula}
            </option>
          ))}
        </select>
      </label>
      <div className="ionic-receipt">
        <b>{sample.formula}</b>
        <span>
          <Localized
            mode={mode}
            text={t('物种整体电荷数', 'Overall species charge number')}
          />
          : {signed(sample.charge)}
        </span>
      </div>
      <div className="redox-ledger-contributions">
        {sample.terms.map((term) => (
          <div key={term.element}>
            <b>{term.element}</b>
            <span>
              {term.count} ×{' '}
              {term.value === null ? 'x' : `(${signed(term.value)})`}
            </span>
            <strong>
              ={' '}
              {term.value === null
                ? `${term.count}x`
                : signed(term.count * term.value)}
            </strong>
          </div>
        ))}
      </div>
      <p>
        <Localized
          mode={mode}
          text={t(
            '所有原子的氧化数贡献之和 = 整个物种的电荷数。求未知元素每个原子的氧化数。',
            'The oxidation-number contributions of all atoms sum to the overall species charge. Find the unknown element’s value per atom.',
          )}
        />
      </p>
      <p className="ionic-equation">
        {result.count}x + ({signed(result.knownContribution)}) ={' '}
        {signed(sample.charge)}
      </p>
      <div className="ionic-choices">
        {[-3, -2, -1, 0, 1, 2, 3, 4].map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={prediction === value}
            onClick={() => setPrediction(value)}
          >
            {signed(value)}
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === result.value
                  ? t(
                      '每原子的数值与总账一致',
                      'The per-atom value fits the total ledger',
                    )
                  : t(
                      '再核对原子个数与整体电荷',
                      'Recheck atom counts and the overall charge',
                    )
              }
            />
          </strong>
          <p>
            {result.unknown}: x = ({signed(sample.charge)} − (
            {signed(result.knownContribution)})) ÷ {result.count} ={' '}
            {signed(result.value)}
          </p>
          <p>
            <Localized text={sample.clue} mode={mode} />
          </p>
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '这是形式记账，不是原子实际电荷测量',
              'Formal bookkeeping, not a measurement of atomic charge',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '氧化数按电子分配约定计算。单原子离子可与电荷数相同；共价分子中的氧化数不等于每个原子的实测净电荷。本活动给出各例的已知值，不让“氧通常 −2”冒充无例外规则。',
              'Oxidation numbers follow an electron-assignment convention. They equal charge numbers for monatomic ions but are not measured net atomic charges in covalent molecules. Each case supplies its known assignments; oxygen’s usual −2 is not an exception-free rule.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

function ElectronBalanceLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [oxidation, setOxidation] = useState(1);
  const [reduction, setReduction] = useState(1);
  const [checked, setChecked] = useState(false);
  const pair = electronPairs[index]!;
  const result = halfReactionAudit(pair, oxidation, reduction);
  return (
    <div
      className="ionic-lab redox-ledger-lab"
      data-redox-lab="electron-balance"
    >
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择半反应配对', 'Choose half-reactions to combine')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setOxidation(1);
            setReduction(1);
            setChecked(false);
          }}
        >
          {electronPairs.map((item, i) => (
            <option key={item.id} value={i}>
              {item.donor} / {item.acceptorIon}
            </option>
          ))}
        </select>
      </label>
      <div className="redox-ledger-halves">
        <div>
          <strong>
            <Localized
              mode={mode}
              text={t('氧化：失去电子', 'Oxidation: lose electrons')}
            />
          </strong>
          <p>
            {pair.donor} → {pair.donorIon} + {pair.loss}e⁻
          </p>
          <Localized
            mode={mode}
            text={t(
              '给出电子的物种是还原剂',
              'The electron donor is the reducing agent',
            )}
          />
        </div>
        <div>
          <strong>
            <Localized
              mode={mode}
              text={t('还原：得到电子', 'Reduction: gain electrons')}
            />
          </strong>
          <p>
            {pair.acceptorIon} + {pair.gain}e⁻ → {pair.acceptor}
          </p>
          <Localized
            mode={mode}
            text={t(
              '接受电子的物种是氧化剂',
              'The electron acceptor is the oxidising agent',
            )}
          />
        </div>
      </div>
      <div className="ionic-controls">
        {[
          {
            id: 'oxidation',
            amount: oxidation,
            update: setOxidation,
            title: t('氧化半反应乘几倍？', 'Oxidation multiplier'),
          },
          {
            id: 'reduction',
            amount: reduction,
            update: setReduction,
            title: t('还原半反应乘几倍？', 'Reduction multiplier'),
          },
        ].map((control) => (
          <label key={control.id} className="ionic-control">
            <Localized mode={mode} text={control.title} />
            <select
              aria-label={control.id}
              value={control.amount}
              onChange={(e) => {
                control.update(Number(e.target.value));
                setChecked(false);
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="redox-ledger-electrons">
        <div>
          <Localized mode={mode} text={t('给出', 'Given')} />
          <b>
            {oxidation} × {pair.loss} = {result.lost}e⁻
          </b>
        </div>
        <span aria-hidden="true">{result.balanced ? '=' : '≠'}</span>
        <div>
          <Localized mode={mode} text={t('接受', 'Accepted')} />
          <b>
            {reduction} × {pair.gain} = {result.gained}e⁻
          </b>
        </div>
      </div>
      <button
        type="button"
        className="ionic-check"
        onClick={() => setChecked(true)}
      >
        <Localized
          mode={mode}
          text={t('检查电子账本', 'Check the electron ledger')}
        />
      </button>
      {checked && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                !result.balanced
                  ? t(
                      '电子未配平：给出与接受必须相等',
                      'Electrons are unbalanced: given and accepted must match',
                    )
                  : result.simplest
                    ? t(
                        '电子相抵，且是最简整数比',
                        'Electrons cancel in the simplest whole-number ratio',
                      )
                    : t(
                        '电子已配平，但还能约成更小的整数比',
                        'Electrons balance, but the whole-number ratio can be reduced',
                      )
              }
            />
          </strong>
          {result.equation && (
            <p className="ionic-equation">{result.equation}</p>
          )}
          <p>
            <Localized
              mode={mode}
              text={t(
                '倍数乘整个半反应，不能只乘电子或改物种下标。电子在加和后消去，不会在完整反应里凭空剩下一堆。',
                'Multiply the entire half-reaction, not just electrons, and do not alter species subscripts. Electrons cancel on addition; they do not accumulate as an extra product of the complete reaction.',
              )}
            />
          </p>
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '配平不能单独证明反应会发生',
              'Balancing alone does not establish that a reaction occurs',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '本活动练习给定半反应的组成与电荷配平，不模拟反应方向、速率、电势或产率。铝的表面氧化膜等因素可能影响实际观察。半反应是记账拆分，不表示自由电子能在水溶液中堆积。活动完全虚拟。',
              'This activity balances the specified compositions and charges, not direction, rate, potential or yield. Factors such as aluminium’s surface oxide can affect observations. Half-reactions are a bookkeeping split, not an accumulation of free electrons in water. The activity is entirely virtual.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

function DisplacementInventory({
  inventory,
  mode,
}: {
  inventory: DisplacementInventory;
  mode: LanguageMode;
}) {
  return (
    <div className="ionic-ledger">
      {Object.entries(inventory).map(([id, amount]) => (
        <div key={id} className="ionic-species">
          <b>{displacementSpecies[id as DisplacementSpeciesId].label}</b>
          <span>{amount} mmol</span>
        </div>
      ))}
      <p>
        <Localized mode={mode} text={t('净电荷账本', 'Net charge ledger')} />:{' '}
        {displacementCharge(inventory)} mmol × e
      </p>
    </div>
  );
}

function DisplacementAmountLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [metalAmount, setMetalAmount] = useState(2);
  const [copperAmount, setCopperAmount] = useState(3);
  const [prediction, setPrediction] = useState<number | null>(null);
  const metal = displacementMetals[index]!;
  const result = displacementLedger(metal, metalAmount, copperAmount);
  return (
    <div className="ionic-lab redox-ledger-lab" data-redox-lab="displacement">
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '选择给定的理想置换案例',
            'Choose the specified ideal displacement case',
          )}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
          }}
        >
          {displacementMetals.map((item, i) => (
            <option key={item.id} value={i}>
              {item.formula}(s) / Cu(NO₃)₂(aq)
            </option>
          ))}
        </select>
      </label>
      <div className="ionic-controls">
        {[
          {
            title: `${metal.formula}(s)`,
            amount: metalAmount,
            update: setMetalAmount,
          },
          { title: 'Cu²⁺(aq)', amount: copperAmount, update: setCopperAmount },
        ].map((control) => (
          <label key={control.title} className="ionic-control">
            {control.title}: {control.amount} mmol
            <input
              type="range"
              aria-label={control.title}
              min="1"
              max="6"
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
      <p>
        <Localized
          mode={mode}
          text={t('反应前的全部库存', 'The full initial inventory')}
        />
      </p>
      <DisplacementInventory inventory={result.before} mode={mode} />
      <p>
        <Localized
          mode={mode}
          text={t(
            '先预测：理想情况下最多得到多少 mmol 铜单质？',
            'Predict the maximum mmol of elemental copper in this ideal case.',
          )}
        />
      </p>
      <div className="ionic-choices">
        {[1, 2, 3, 4, 5, 6].map((amount) => (
          <button
            type="button"
            key={amount}
            aria-pressed={prediction === amount}
            onClick={() => setPrediction(amount)}
          >
            {amount} mmol Cu
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === result.extent
                  ? t(
                      '限制量与预测一致',
                      'The limiting amount supports your prediction',
                    )
                  : t(
                      '先检查失电子与得电子的配方比例',
                      'Recheck the electron-loss and electron-gain ratio',
                    )
              }
            />
          </strong>
          <p className="ionic-equation">
            {metal.formula}(s) + Cu²⁺(aq) →{' '}
            {displacementSpecies[metal.ion].label} + Cu(s)
          </p>
          <div className="redox-ledger-transfer">
            <Localized
              mode={mode}
              text={t(
                '内部传递的电子量（不作为独立剩余物）',
                'Electrons transferred internally (not a separate leftover species)',
              )}
            />
            <b>
              {result.extent} × 2 = {result.electronMmol} mmol e⁻
            </b>
          </div>
          <h3>
            <Localized
              mode={mode}
              text={t(
                '固相：剩余金属与新生成铜分开记',
                'Solids: record leftover metal separately from new copper',
              )}
            />
          </h3>
          <DisplacementInventory inventory={result.solids} mode={mode} />
          <p>
            <Localized
              mode={mode}
              text={t(
                '其中新生成铜的理论质量',
                'Theoretical mass of newly formed copper',
              )}
            />
            : {result.copperMassG.toFixed(4)} g
          </p>
          <h3>
            <Localized
              mode={mode}
              text={t('水相：保留旁观离子', 'Solution: keep spectator ions')}
            />
          </h3>
          <DisplacementInventory inventory={result.solution} mode={mode} />
          <p>
            <Localized
              mode={mode}
              text={t(
                '这里两种金属每份都给出 2e⁻，每份 Cu²⁺ 接受 2e⁻，所以反应比为 1∶1。若换成其他半反应，必须重新由电子数求比例。',
                'Both metals here lose 2e⁻ per unit and each Cu²⁺ accepts 2e⁻, giving a 1:1 ratio. Other half-reactions require a new electron-based ratio.',
              )}
            />
          </p>
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '理论产量与真实观察的区别',
              'Theoretical yield versus real observations',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '假定给定金属与 Cu²⁺ 的置换充分进行，忽略表面膜、杂质、与水/酸的副反应、平衡和收集损失，不计算颜色、速率或电压。硝酸根在这个指定模型中是旁观离子。铜摩尔质量近似 63.5 g/mol。无论固体是否全部回收，理论库存仍按元素与电荷逐项核查；完全虚拟，不提供家庭金属盐实验操作。',
              'Assume complete progress of the specified metal/Cu²⁺ displacement, omitting surface films, impurities, side reactions with water/acids, equilibria and collection losses. Colour, rate and voltage are not calculated. Nitrate is a spectator in this specified model. Copper molar mass is approximately 63.5 g/mol. Audit theoretical element and charge inventories separately from solid recovery. This is entirely virtual, with no home metal-salt experiment procedure.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

export default function RedoxLedgerLab({
  kind,
  mode,
}: {
  kind:
    | 'oxidation-number-ledger-lab'
    | 'electron-balance-ledger-lab'
    | 'displacement-amount-ledger-lab';
  mode: LanguageMode;
}) {
  if (kind === 'oxidation-number-ledger-lab')
    return <OxidationNumberLab mode={mode} />;
  if (kind === 'electron-balance-ledger-lab')
    return <ElectronBalanceLab mode={mode} />;
  return <DisplacementAmountLab mode={mode} />;
}
