import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import {
  canAdvanceGalvanic,
  copperPlating,
  galvanicInventory,
} from './electrochemistry';
import './ElectrochemistryLabs.css';

function Electrode({
  name,
  sign,
  amount,
  label,
  copper,
}: {
  name: string;
  sign: string;
  amount: number;
  label: string;
  copper?: boolean;
}) {
  return (
    <div className="electrode-card">
      <strong>
        {name} <span className="electrode-sign">{sign}</span>
      </strong>
      <div className="electrode-vessel" aria-hidden="true">
        <i
          className={copper ? 'copper-strip' : 'zinc-strip'}
          style={{ height: `${24 + amount * 9}%` }}
        />
      </div>
      <p>{label}</p>
    </div>
  );
}

export function SaltBridgeLedgerLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [steps, setSteps] = useState(0);
  const [wire, setWire] = useState(true);
  const [bridge, setBridge] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const r = galvanicInventory(steps);
  const running = canAdvanceGalvanic(steps, wire, bridge);
  return (
    <div className="quantitative-lab">
      <p className="electro-equation">Zn + Cu²⁺ → Zn²⁺ + Cu</p>
      <div className="quantitative-choices electro-switches">
        <button
          type="button"
          aria-pressed={wire}
          onClick={() => setWire(!wire)}
        >
          {en
            ? `Wire: ${wire ? 'connected' : 'open'}`
            : `导线：${wire ? '接通' : '断开'}`}
        </button>
        <button
          type="button"
          aria-pressed={bridge}
          onClick={() => setBridge(!bridge)}
        >
          {en
            ? `Salt bridge: ${bridge ? 'connected' : 'removed'}`
            : `盐桥：${bridge ? '连接' : '移走'}`}
        </button>
      </div>
      <div className={`electro-route ${running ? 'route-active' : ''}`}>
        <strong>
          {en ? 'External wire · electron route' : '外部导线 · 电子路线'}
        </strong>
        <span>
          Zn <i aria-hidden="true">➜</i> e⁻ <i aria-hidden="true">➜</i> Cu
        </span>
        <p>
          {en
            ? 'Conventional current is opposite to electron flow.'
            : '传统电流方向与电子流相反。'}
        </p>
      </div>
      <div className="electrode-pair">
        <Electrode
          name={en ? 'Zn · anode' : 'Zn · 阳极'}
          sign="−"
          amount={r.zincMetal}
          label={
            en
              ? `Solid Zn: ${r.zincMetal} portions`
              : `固体 Zn：${r.zincMetal} 份`
          }
        />
        <Electrode
          name={en ? 'Cu · cathode' : 'Cu · 阴极'}
          sign="+"
          amount={r.copperMetal}
          label={
            en
              ? `Solid Cu: ${r.copperMetal} portions`
              : `固体 Cu：${r.copperMetal} 份`
          }
          copper
        />
      </div>
      <div className="electro-half-reactions">
        <p>
          <b>{en ? 'Oxidation' : '氧化'}</b> · Zn → Zn²⁺ + 2e⁻
        </p>
        <p>
          <b>{en ? 'Reduction' : '还原'}</b> · Cu²⁺ + 2e⁻ → Cu
        </p>
      </div>
      <p className="quantitative-prompt">
        {en
          ? 'One reaction portion adds +2 charge to the Zn solution and removes +2 from the Cu solution before ion compensation. Where should the salt-bridge ions go?'
          : '一份反应让锌侧溶液增加 +2 电荷，铜侧少了 +2 电荷。还没补偿时，盐桥中的离子应该往哪边去？'}
      </p>
      <div className="quantitative-choices">
        {(en
          ? [
              'NO₃⁻ → Zn; K⁺ → Cu',
              'K⁺ → Zn; NO₃⁻ → Cu',
              'Electrons cross the salt bridge',
            ]
          : [
              'NO₃⁻ → 锌侧；K⁺ → 铜侧',
              'K⁺ → 锌侧；NO₃⁻ → 铜侧',
              '让电子穿过盐桥',
            ]
        ).map((label, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={prediction === i}
            onClick={() => setPrediction(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {prediction !== null && (
        <p className="quantitative-feedback" aria-live="polite">
          <b>{en ? 'Explanation: ' : '解析：'}</b>
          {prediction === 0
            ? en
              ? 'Correct. '
              : '判断正确。'
            : en
              ? 'Check the sign of the charge change. '
              : '先检查两边电荷变化的正负号。'}
          {en
            ? 'Two NO₃⁻ portions compensate +2 on the Zn side; two K⁺ portions replace the +2 lost on the Cu side. Ions carry charge inside; electrons use the wire.'
            : '锌侧用两份 NO₃⁻ 抵消新增 +2；铜侧用两份 K⁺ 补回失去的 +2。内部由离子传递电荷，电子走导线。'}
        </p>
      )}
      <div className="quantitative-choices">
        <button
          type="button"
          disabled={!running || prediction === null}
          onClick={() => setSteps((old) => old + 1)}
        >
          {en ? 'Advance one reaction portion' : '推进一份反应'}
        </button>
        <button
          type="button"
          className="reset"
          onClick={() => {
            setSteps(0);
            setWire(true);
            setBridge(true);
            setPrediction(null);
          }}
        >
          {en ? 'Reset the ledger' : '重置账本'}
        </button>
      </div>
      <p className="electro-status" aria-live="polite">
        {steps === 4
          ? en
            ? 'Model stock limit reached: no Zn metal or Cu²⁺ remains.'
            : '达到模型库存上限：固体 Zn 和 Cu²⁺ 都已用完。'
          : !wire
            ? en
              ? 'No sustained reaction: the external electron path is open.'
              : '不能持续反应：外部电子路径断开。'
            : !bridge
              ? en
                ? 'No sustained reaction: the internal ion path is missing.'
                : '不能持续反应：内部离子路径缺失。'
              : prediction === null
                ? en
                  ? 'Make a prediction, then advance the bookkeeping model.'
                  : '先预测，再推进这个守恒账本模型。'
                : en
                  ? `Reaction portions completed: ${steps} · Electron portions transferred: ${r.electronTransfers}.`
                  : `已完成 ${steps} 份反应 · 累计转移 ${r.electronTransfers} 份电子。`}
      </p>
      <div className="electro-ledgers">
        <div>
          <strong>{en ? 'Zn-side solution' : '锌侧溶液'}</strong>
          <p>
            Zn²⁺: {r.zincIons} · NO₃⁻: {r.leftNitrate}
          </p>
          <b>
            {en ? 'Net charge' : '净电荷'}: 2 × {r.zincIons} − {r.leftNitrate} =
            0
          </b>
        </div>
        <div>
          <strong>{en ? 'Cu-side solution' : '铜侧溶液'}</strong>
          <p>
            Cu²⁺: {r.copperIons} · K⁺: {r.rightPotassium} · NO₃⁻:{' '}
            {r.rightNitrate}
          </p>
          <b>
            {en ? 'Net charge' : '净电荷'}: 2 × {r.copperIons} +{' '}
            {r.rightPotassium} − {r.rightNitrate} = 0
          </b>
        </div>
        <div>
          <strong>{en ? 'Salt-bridge reservoir' : '盐桥储备'}</strong>
          <p>
            K⁺: {r.bridgePotassium} · NO₃⁻: {r.bridgeNitrate}
          </p>
          <b>
            {en ? 'Net charge' : '净电荷'}: {r.bridgePotassium} −{' '}
            {r.bridgeNitrate} = 0
          </b>
        </div>
      </div>
      <p className="quantitative-note">
        {en
          ? 'Each number counts equal-size particle portions, not mol or real voltage. Each completed step includes compensating ion transfer. This discrete model ignores transients, diffusion and equilibrium limits; arrows show routes, not speeds. No electrons are stored in the solution. Virtual only—do not build or open a cell.'
          : '数字表示同样大小的粒子组份数，不是 mol 或真实电压。每个完整步骤已包含离子补偿；离散模型忽略瞬态、扩散和平衡限制，箭头只指路线、不表示速度。溶液里没有储存这些电子。仅限虚拟操作，不制作或拆开电池。'}
      </p>
    </div>
  );
}

export function CopperPlatingLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [powered, setPowered] = useState(true);
  const [current, setCurrent] = useState(1);
  const [seconds, setSeconds] = useState(600);
  const [prediction, setPrediction] = useState<number | null>(null);
  const r = copperPlating(current, seconds, powered);
  return (
    <div className="quantitative-lab">
      <p className="quantitative-note">
        {en
          ? 'Plan a virtual copper coating in CuSO₄ solution with a copper anode and a copper object as cathode. Both start at 1.000 g. The picture predicts the end of the chosen interval, not a live experiment.'
          : '规划一次虚拟镀铜：CuSO₄ 溶液、铜阳极和作为阴极的铜制物件。两块铜起始都是 1.000 g。图中预测所选时间结束后的状态，不是正在进行的真实实验。'}
      </p>
      <div className="quantitative-controls">
        <label>
          {en ? 'Constant current' : '恒定电流'}
          <select
            aria-label={en ? 'Constant current' : '恒定电流'}
            value={current}
            onChange={(e) => {
              setCurrent(Number(e.target.value));
              setPrediction(null);
            }}
          >
            {[1, 2].map((i) => (
              <option key={i} value={i}>
                {i} A
              </option>
            ))}
          </select>
        </label>
        <label>
          {en ? 'Planned time' : '计划通电时间'}
          <select
            aria-label={en ? 'Planned time' : '计划通电时间'}
            value={seconds}
            onChange={(e) => {
              setSeconds(Number(e.target.value));
              setPrediction(null);
            }}
          >
            {[300, 600, 1200].map((t) => (
              <option key={t} value={t}>
                {t} s · {t / 60} min
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="quantitative-choices">
        <button
          type="button"
          aria-pressed={powered}
          onClick={() => {
            setPowered(!powered);
            setPrediction(null);
          }}
        >
          {en
            ? `Power plan: ${powered ? 'on' : 'off'}`
            : `电源方案：${powered ? '开启' : '关闭'}`}
        </button>
      </div>
      <div className={`electro-route ${powered ? 'route-active' : ''}`}>
        <strong>
          {powered
            ? en
              ? 'External power supplies energy'
              : '外部电源提供能量'
            : en
              ? 'Power off · no energy input'
              : '电源关闭 · 没有电能输入'}
        </strong>
        <div className="plating-routes">
          <span>{en ? 'Anode' : '阳极'} → e⁻ → (+)</span>
          <b>{en ? 'Power supply' : '电源'}</b>
          <span>(−) → e⁻ → {en ? 'Cathode' : '阴极'}</span>
        </div>
        <p>
          {powered
            ? en
              ? 'Two wire segments—not electrons swimming through the solution.'
              : '这是两段导线路径，不是电子游过溶液。'
            : en
              ? 'Arrows show wiring only. With power off there is no sustained electron flow.'
              : '箭头只说明接线路径；关闭电源时没有持续电子流。'}
        </p>
      </div>
      <div className="electro-half-reactions">
        <p>
          <b>{en ? 'Anode (+) · oxidation' : '阳极（+）· 氧化'}</b>
          <br />
          Cu → Cu²⁺ + 2e⁻
        </p>
        <p>
          <b>{en ? 'Cathode (−) · reduction' : '阴极（−）· 还原'}</b>
          <br />
          Cu²⁺ + 2e⁻ → Cu
        </p>
      </div>
      <p className="quantitative-prompt">
        {en
          ? 'If power is supplied, where does the copper coating grow?'
          : '如果按开启电源的方案运行，铜镀层在哪边长出来？'}
      </p>
      <div className="quantitative-choices">
        {(en
          ? ['Anode (+)', 'Cathode (−)', 'On both equally']
          : ['阳极（+）', '阴极（−）', '两边同样增厚']
        ).map((label, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={prediction === i}
            onClick={() => setPrediction(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="plating-result" aria-live="polite">
          <p className="quantitative-feedback">
            <b>{en ? 'Explanation: ' : '解析：'}</b>
            {prediction === 1
              ? en
                ? 'Correct. '
                : '判断正确。'
              : en
                ? 'Find the half-reaction that makes Cu(s). '
                : '找出生成 Cu(s) 的半反应。'}
            {en
              ? 'When powered, the negative cathode receives electrons: Cu²⁺ becomes Cu and coats the object. The positive copper anode loses copper. With power off, this ideal model transfers no copper.'
              : '电源开启时，负极相连的阴极得到电子，Cu²⁺ 变成 Cu，覆盖物件；正极相连的铜阳极失去铜。电源关闭时，这个理想模型不转移铜。'}
          </p>
          <div className="electrode-pair">
            <Electrode
              name={
                en
                  ? `Cu anode · ${powered ? 'loses mass' : 'unchanged'}`
                  : `铜阳极 · ${powered ? '质量减少' : '质量不变'}`
              }
              sign="+"
              amount={(1 - r.mass) * 3}
              label={`${(1 - r.mass).toFixed(3)} g`}
              copper
            />
            <Electrode
              name={
                en
                  ? `Cu cathode · ${powered ? 'gains mass' : 'unchanged'}`
                  : `铜阴极 · ${powered ? '质量增加' : '质量不变'}`
              }
              sign="−"
              amount={(1 + r.mass) * 3}
              label={`${(1 + r.mass).toFixed(3)} g`}
              copper
            />
          </div>
          <p className="quantitative-note">
            {en ? 'Predicted copper transfer' : '预测转移的铜'}:{' '}
            <b>{r.mass.toFixed(3)} g</b> ·{' '}
            {en ? 'Total electrode mass stays' : '两电极总质量仍是'} 2.000 g.{' '}
            {en
              ? 'Equal amounts of Cu²⁺ are formed and consumed; its total amount stays constant in this ideal model. Strip sizes are schematic, not measured coating thickness.'
              : '生成和消耗的 Cu²⁺ 数量相同，模型中溶液的 Cu²⁺ 总量不变。铜条大小仅示意，不代表测量的镀层厚度。'}
          </p>
          <details className="electro-details">
            <summary>
              {en
                ? 'Extension · how current and time set the mass'
                : '进阶 · 电流与时间怎样决定质量'}
            </summary>
            <p>
              {en
                ? 'Current is charge per second: 1 A = 1 C/s. F ≈ 96485 C/mol is the charge carried by one mole of electrons. Each Cu²⁺ needs two electrons.'
                : '电流是每秒通过的电荷：1 A = 1 C/s。F ≈ 96485 C/mol 表示一摩尔电子所带电荷的大小；每个 Cu²⁺ 需要两个电子。'}
            </p>
            <div className="quantitative-ledger">
              <div>
                <span>{en ? '1 · Charge passed' : '1 · 通过的电荷'}</span>
                <strong>{r.charge} C</strong>
                <p>Q = {powered ? `${current} A × ${seconds} s` : '0'}</p>
              </div>
              <div>
                <span>{en ? '2 · Copper amount' : '2 · 铜的 mol 数'}</span>
                <strong>{r.copperMoles.toFixed(5)} mol</strong>
                <p>n(Cu) = Q ÷ (2F)</p>
              </div>
              <div>
                <span>{en ? '3 · Copper mass' : '3 · 铜的质量'}</span>
                <strong>{r.mass.toFixed(3)} g</strong>
                <p>m = n × 63.5 g/mol</p>
              </div>
            </div>
            <p>
              {en
                ? 'At 1 A for 600 s: Q=600 C, n(Cu)≈0.00311 mol, m≈0.197 g. Doubling either current or time doubles this ideal result—not necessarily real coating quality.'
                : '1 A 通电 600 s：Q=600 C，n(Cu)≈0.00311 mol，m≈0.197 g。单独把电流或时间加倍，理想质量加倍；实际镀层质量不一定更好。'}
            </p>
          </details>
        </div>
      )}
      <p className="quantitative-note">
        {en
          ? 'Assumptions: constant current, enough Cu²⁺, a dissolving copper anode, and 100% of current used for these half-reactions. Real baths can have side reactions and losses. Virtual only: no chemicals, mains electricity, dismantled batteries or home electroplating.'
          : '假设恒定电流、Cu²⁺ 充足、铜阳极可溶解，且 100% 电流用于这对半反应。真实镀液可能有副反应和损失。仅限虚拟操作：不用化学试剂、市电、拆开的电池，也不在家电镀。'}
      </p>
    </div>
  );
}
