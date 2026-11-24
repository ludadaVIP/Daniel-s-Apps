import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import {
  carriesIonicCurrent,
  conductorSamples,
  inventoryCharge,
  ions,
  precipitate,
  precipitationCases,
  validSpectatorCancellation,
  type IonId,
  type IonInventory,
} from './ionicReactions';
import './IonicReactionLabs.css';

const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];

function IonLedger({
  inventory,
  mode,
}: {
  inventory: IonInventory;
  mode: LanguageMode;
}) {
  return (
    <div className="ionic-ledger">
      {Object.entries(inventory).map(([id, amount]) => (
        <div key={id} className="ionic-species">
          <b>{ions[id as IonId].label}</b>
          <span>{amount} mmol</span>
        </div>
      ))}
      <p>
        <Localized mode={mode} text={t('净电荷账本', 'Net charge ledger')} />:{' '}
        {inventoryCharge(inventory)} mmol × e
      </p>
    </div>
  );
}

export function ConductionLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const sample = conductorSamples[index]!;
  const current = carriesIonicCurrent(sample);
  return (
    <div className="ionic-lab">
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '比较同一种盐的状态，再换成糖',
            'Compare states of one salt, then switch to sugar',
          )}
        />
        <select
          value={index}
          onChange={(event) => {
            setIndex(Number(event.target.value));
            setPrediction(null);
          }}
        >
          {conductorSamples.map((item, i) => (
            <option key={item.id} value={i}>
              {label(item.name, mode)}
            </option>
          ))}
        </select>
      </label>
      <div
        className={`ionic-particle-view ${sample.mobile ? '' : 'ionic-lattice'}`}
      >
        {Array.from({ length: 6 }, (_, i) => {
          const particle = sample.particles[i % sample.particles.length]!;
          return (
            <span
              key={i}
              className={
                particle.charge > 0
                  ? 'ionic-positive'
                  : particle.charge < 0
                    ? 'ionic-negative'
                    : 'ionic-neutral'
              }
            >
              {particle.label}
            </span>
          );
        })}
      </div>
      <p>
        <Localized
          mode={mode}
          text={t(
            '示意图省略水分子；符号显示电荷，不代表真实大小。固体中离子仍会振动。',
            'Water molecules are omitted. Symbols show charge, not actual size. Ions in a solid still vibrate.',
          )}
        />
      </p>
      <p>
        <Localized
          mode={mode}
          text={t(
            '先预测：它能明显地传递持续的离子电流吗？',
            'Predict: can it carry an appreciable sustained ionic current?',
          )}
        />
      </p>
      <div className="ionic-choices">
        {[true, false].map((choice) => (
          <button
            key={String(choice)}
            type="button"
            aria-pressed={prediction === choice}
            onClick={() => setPrediction(choice)}
          >
            <Localized
              mode={mode}
              text={choice ? t('能', 'Yes') : t('不能', 'No')}
            />
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div role="status" className="ionic-result">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === current
                  ? t('预测与模型一致', 'Your prediction matches the model')
                  : t(
                      '再检查“有电荷”和“能移动”两个条件',
                      'Check both charge and mobility',
                    )
              }
            />
          </strong>
          <p>
            <Localized mode={mode} text={sample.explanation} />
          </p>
          <p>
            <Localized
              mode={mode}
              text={t(
                '盐水中的阳离子和阴离子向相反方向移动，都能传递电流；不是电子穿过水从一个离子跳到另一个。',
                'Positive and negative ions move in opposite directions and both carry current; this is not electrons hopping through water from ion to ion.',
              )}
            />
          </p>
        </div>
      )}
      <details>
        <summary>
          <Localized mode={mode} text={t('模型边界', 'Model limits')} />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '这是虚拟比较，不是接线实验或电流大小测量。忽略水的自电离、杂质、电极反应和浓度差异；不表示所有共价物质都不能形成离子，HCl 溶于水就是反例。',
              'This is a virtual comparison, not wiring instructions or a current measurement. Water autoionisation, impurities, electrode reactions and concentration differences are omitted. Some covalent substances, such as HCl, form ions in water.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

export function PrecipitationLab({
  mode,
  quantitative = false,
}: {
  mode: LanguageMode;
  quantitative?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(2);
  const [right, setRight] = useState(3);
  const [prediction, setPrediction] = useState<string | null>(null);
  const reaction = precipitationCases[index]!;
  const result = precipitate(reaction, left, right);
  const answer = quantitative
    ? String(result.solidMmol)
    : reaction.solid
      ? 'solid'
      : 'none';
  const shown = prediction !== null;
  const reset = () => setPrediction(null);
  return (
    <div className="ionic-lab">
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('虚拟混合案例', 'Virtual mixing case')}
        />
        <select
          value={index}
          onChange={(event) => {
            setIndex(Number(event.target.value));
            reset();
          }}
        >
          {precipitationCases.slice(0, quantitative ? 2 : 3).map((item, i) => (
            <option key={item.id} value={i}>
              {label(item.title, mode)}
            </option>
          ))}
        </select>
      </label>
      {quantitative && (
        <div className="ionic-controls">
          {[
            { formula: reaction.left, value: left, update: setLeft },
            { formula: reaction.right, value: right, update: setRight },
          ].map((control) => (
            <label key={control.formula} className="ionic-control">
              {control.formula}: {control.value} mmol
              <input
                aria-label={`${control.formula} mmol`}
                type="range"
                min="1"
                max="6"
                step="1"
                value={control.value}
                onChange={(event) => {
                  control.update(Number(event.target.value));
                  reset();
                }}
              />
            </label>
          ))}
        </div>
      )}
      <div className="ionic-receipt">
        <Localized mode={mode} text={t('混合前的投入', 'Before mixing')} />
        <strong>
          {left} mmol {reaction.left}(aq) + {right} mmol {reaction.right}(aq)
        </strong>
        <span>
          <Localized
            mode={mode}
            text={t(
              '每份溶液 100 mL，模型假设体积可相加。',
              'Each solution is 100 mL; the model assumes additive volumes.',
            )}
          />
        </span>
      </div>
      <IonLedger inventory={result.before} mode={mode} />
      <p>
        <Localized
          mode={mode}
          text={
            quantitative
              ? t(
                  '先算一算：最多形成多少 mmol 沉淀？',
                  'Predict: how many mmol of solid can form at most?',
                )
              : t(
                  '先预测：这些离子混合后会形成固体吗？',
                  'Predict: will these ions form a solid when mixed?',
                )
          }
        />
      </p>
      <div className="ionic-choices">
        {(quantitative
          ? ['1', '2', '3', '4', '5', '6']
          : ['solid', 'none']
        ).map((choice) => (
          <button
            key={choice}
            type="button"
            aria-pressed={prediction === choice}
            onClick={() => setPrediction(choice)}
          >
            {quantitative ? (
              `${choice} mmol`
            ) : (
              <Localized
                mode={mode}
                text={
                  choice === 'solid'
                    ? t('会形成沉淀', 'Precipitate')
                    : t('不形成沉淀', 'No precipitate')
                }
              />
            )}
          </button>
        ))}
      </div>
      {shown && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === answer
                  ? t('预测与模型一致', 'Your prediction matches the model')
                  : t('用离子账本重新核对', 'Recheck the ion ledger')
              }
            />
          </strong>
          <p>
            <Localized mode={mode} text={reaction.observation} />
          </p>
          <div className="ionic-solid">
            <b>{reaction.solid ?? '—'}</b>
            <span>
              {result.solidMmol} mmol
              {quantitative && ` · ${result.massG.toFixed(4)} g`}
            </span>
            <Localized
              mode={mode}
              text={t(
                '固相：用整体组成表示晶格，不是一个个小分子',
                'Solid phase: lattice composition, not separate little molecules',
              )}
            />
          </div>
          <h3>
            <Localized
              mode={mode}
              text={t(
                '反应后的水溶液（与固体分开记录）',
                'Solution after reaction (separate from the solid)',
              )}
            />
          </h3>
          <IonLedger inventory={result.after} mode={mode} />
          <p>
            {reaction.net ?? (
              <Localized
                mode={mode}
                text={t(
                  '所有离子保持溶解；本案例没有净沉淀反应。',
                  'All ions stay dissolved; this case has no net precipitation reaction.',
                )}
              />
            )}
          </p>
          {reaction.solid && (
            <p>
              <Localized
                mode={mode}
                text={t(
                  '方程式系数给出消耗比，本案例为 1∶1。用尽的反应离子在水相账本中记为 0；旁观离子仍然存在。',
                  'Equation coefficients give the consumption ratio, here 1:1. A used-up reacting ion is recorded as 0 in the solution ledger; spectator ions remain.',
                )}
              />
            </p>
          )}
          {quantitative && (
            <p>
              <Localized
                mode={mode}
                text={t(
                  '过滤只拦住沉淀，不会除掉溶解的剩余离子。即使两种反应离子恰好用尽，滤液仍含旁观离子，仍可能导电。',
                  'Filtration traps precipitate, not dissolved leftover ions. Even when both reacting ions are used up together, the filtrate still contains spectator ions and can conduct.',
                )}
              />
            </p>
          )}
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '已给出的溶解性证据与模型边界',
              'Given solubility evidence and model limits',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '在本课条件下，AgCl、CaCO₃ 难溶；所用钠盐、钾盐和硝酸盐可溶。1–6 mmol 加入各 100 mL 的输入远高于这些沉淀的溶解限度。采用完全沉淀近似，忽略微量溶解、酸碱平衡、络合与损失；不是所有浓度下都能沉淀。白色外观本身不能唯一鉴定物质。',
              'Here AgCl and CaCO₃ are sparingly soluble; the sodium, potassium and nitrate salts used are soluble. Inputs of 1–6 mmol in 100 mL each are well above the precipitation limits. This complete-precipitation approximation omits trace dissolution, acid–base equilibria, complexation and losses. Precipitation is not guaranteed at every concentration; a white appearance alone cannot identify a substance.',
            )}
          />
        </p>
        <p>
          <Localized
            mode={mode}
            text={t(
              '本活动完全虚拟，不提供家庭混合试剂的操作。0 表示模型中忽略的微量，不宣称真实溶液中绝对没有该离子。',
              'This activity is entirely virtual, with no home reagent-mixing procedure. A 0 omits trace amounts; it does not assert that absolutely no such ion remains in real solution.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

export function NetIonicLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [removed, setRemoved] = useState<IonId[]>([]);
  const [checked, setChecked] = useState(false);
  const reaction = precipitationCases[index]!;
  const result = precipitate(reaction, 1, 1);
  const correct = validSpectatorCancellation(reaction, removed);
  return (
    <div className="ionic-lab">
      <label className="ionic-control">
        <Localized mode={mode} text={t('选择反应', 'Choose a reaction')} />
        <select
          value={index}
          onChange={(event) => {
            setIndex(Number(event.target.value));
            setRemoved([]);
            setChecked(false);
          }}
        >
          {precipitationCases.slice(0, 2).map((item, i) => (
            <option key={item.id} value={i}>
              {label(item.title, mode)}
            </option>
          ))}
        </select>
      </label>
      <p className="ionic-equation">{reaction.equation}</p>
      <p>
        <Localized
          mode={mode}
          text={t(
            '下面按 1 mmol 反应进度展开。只勾选能从两边同时消去的同种水溶液离子；比较种类、状态与数量。',
            'Expand a 1 mmol reaction below. Select only identical aqueous ions cancellable from both sides; compare identity, state and amount.',
          )}
        />
      </p>
      <div className="ionic-cancellation">
        {Object.entries(result.before).map(([key, amount]) => {
          const id = key as IonId;
          return (
            <label
              key={id}
              className={removed.includes(id) ? 'ionic-crossed' : ''}
            >
              <input
                type="checkbox"
                checked={removed.includes(id)}
                onChange={() => {
                  setRemoved((old) =>
                    old.includes(id)
                      ? old.filter((ion) => ion !== id)
                      : [...old, id],
                  );
                  setChecked(false);
                }}
              />
              <b>{ions[id].label}(aq)</b>
              <span>
                <Localized mode={mode} text={t('左', 'Left')} />: {amount} mmol
                →{' '}
                <Localized
                  mode={mode}
                  text={t('右（水相）', 'Right (aqueous)')}
                />
                : {result.after[id] ?? 0} mmol
              </span>
            </label>
          );
        })}
      </div>
      <div className="ionic-solid">
        {reaction.solid}(s) · 1 mmol{' '}
        <Localized
          mode={mode}
          text={t(
            '仅在右侧形成；不能拆成水溶液离子来消去',
            'Forms only on the right; do not split it into aqueous ions for cancellation',
          )}
        />
      </div>
      <button
        className="ionic-check"
        type="button"
        onClick={() => setChecked(true)}
      >
        <Localized
          mode={mode}
          text={t('检查我的消去', 'Check my cancellation')}
        />
      </button>
      {checked && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                correct
                  ? t(
                      '保留了真正发生变化的粒子',
                      'You kept the species that actually change',
                    )
                  : t(
                      '还需调整：只消去两边数量相同、状态相同的离子',
                      'Adjust your selection: cancel only matching amounts and states on both sides',
                    )
              }
            />
          </strong>
          {correct && <p className="ionic-equation">{reaction.net}</p>}
          <p>
            <Localized
              mode={mode}
              text={t(
                '旁观离子只是从简写方程式中省略，仍留在烧杯里。沉淀不能拆成 (aq) 离子；最后还要核对每种元素和总电荷都守恒。',
                'Spectator ions are omitted from the shortened equation, not removed from the beaker. Do not split the solid into (aq) ions. Finally check every element and total charge.',
              )}
            />
          </p>
        </div>
      )}
    </div>
  );
}
