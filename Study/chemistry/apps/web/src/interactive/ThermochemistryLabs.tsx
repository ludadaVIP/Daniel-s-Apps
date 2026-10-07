import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import {
  calorimetryLedger,
  calorimetryRecords,
  combineHessSteps,
  equationText,
  hessFactors,
  hessSteps,
  hessTargetMatches,
  type HessFactor,
  type SpeciesInventory,
} from './thermochemistry';
import './ThermochemistryLabs.css';

const signed = (value: number, digits = 0) =>
  `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(digits)}`;

export function CalorimetryLedgerLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [recordIndex, setRecordIndex] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const record = calorimetryRecords[recordIndex]!;
  const data = calorimetryLedger(record);
  const names = en
    ? ['A · Small, insulated', 'B · Twice the batch', 'C · Modelled heat loss']
    : ['A · 小份、理想保温', 'B · 两倍份量', 'C · 设定有散热'];
  const choices = en
    ? ['Same heat as A', 'Twice A’s heat', 'Less heat than A']
    : ['与 A 热量相同', '热量是 A 的两倍', '比 A 热量小'];
  return (
    <div className="quantitative-lab thermo-lab">
      <div className="quantitative-choices">
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-pressed={recordIndex === i}
            onClick={() => {
              setRecordIndex(i);
              setPrediction(null);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="quantitative-note">
        {en
          ? 'Authored virtual records. Both solutions are 1.00 mol/L. Read the model; do not mix chemicals at home.'
          : '教学用虚拟记录。两种溶液均为 1.00 mol/L；这里只读模型，不在家混合化学试剂。'}
      </p>
      <div
        className="thermo-cup-record"
        role="img"
        aria-label={
          en
            ? `${record.volumeEachMl} mL each of HCl and NaOH; total solution ${data.massG} g. Temperature ${record.initialC} to ${record.finalC} °C.`
            : `盐酸和氢氧化钠溶液各 ${record.volumeEachMl} mL；总溶液 ${data.massG} g。温度由 ${record.initialC} 升至 ${record.finalC} 摄氏度。`
        }
      >
        <div className="thermo-cup" aria-hidden="true">
          <span>HCl + NaOH</span>
          <span>
            {en ? 'Each' : '各'} {record.volumeEachMl} mL
          </span>
          <strong>{data.massG} g</strong>
          <span>{en ? 'Total solution' : '两份溶液的总质量'}</span>
        </div>
        <div className="thermo-temperature">
          <span>{en ? 'Before → after' : '开始 → 结束'}</span>
          <strong>
            {record.initialC.toFixed(1)} → {record.finalC.toFixed(1)} °C
          </strong>
          <span>ΔT = {data.deltaT.toFixed(1)} °C</span>
        </div>
      </div>
      <p className="thermo-equation">HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)</p>
      <p>
        {en
          ? 'Predict the heat gained by the solution, compared with record A (100 g, ΔT = 6.8 °C).'
          : '先预测：与 A（100 g、升温 6.8 °C）相比，这份溶液吸收的热量是多少？'}
      </p>
      <div className="quantitative-choices">
        {choices.map((choice, i) => (
          <button
            type="button"
            key={choice}
            aria-pressed={prediction === i}
            onClick={() => setPrediction(i)}
          >
            {choice}
          </button>
        ))}
      </div>
      {prediction !== null && (
        <>
          <div className="quantitative-feedback" role="status">
            <strong>
              {prediction === recordIndex
                ? en
                  ? 'Correct. '
                  : '判断正确。'
                : en
                  ? 'Try the mass × temperature-rise check. '
                  : '再用“质量 × 升温”核对。'}
            </strong>
            {en ? 'Explanation: ' : '解析：'}
            {recordIndex === 0
              ? en
                ? 'This is A itself: 100 g warmed by 6.8 °C.'
                : '这就是基准 A：100 g 溶液升温 6.8 °C。'
              : recordIndex === 1
                ? en
                  ? 'B warms twice the mass by the same 6.8 °C, so q doubles. Its reacted amount also doubles; heat per mole stays the same.'
                  : 'B 的升温仍是 6.8 °C，但质量翻倍，因此 q 翻倍。反应的物质的量也翻倍，每摩尔的焓变估计不变。'
                : en
                  ? 'C has A’s mass but a smaller temperature rise, so the solution gains less heat. This record explicitly models loss to the outside; it does not redefine the reaction’s enthalpy.'
                  : 'C 与 A 质量相同，但升温更小，溶液吸收的热量更少。本记录明确设定向外散热，不能把漏记的热量当作反应本身焓变改变。'}
          </div>
          <div className="quantitative-ledger thermo-ledger">
            <div>
              <span>{en ? '1 · Solution gains heat' : '① 溶液吸热'}</span>
              <strong>q = {signed(data.solutionJ, 1)} J</strong>
              <small>
                {data.massG} × 4.18 × {data.deltaT.toFixed(1)}
              </small>
            </div>
            <div>
              <span>{en ? '2 · Reaction estimate' : '② 反应热估计'}</span>
              <strong>{signed(data.apparentReactionKj, 3)} kJ</strong>
              <small>{en ? 'qreaction ≈ −qsolution' : 'q反应 ≈ −q溶液'}</small>
            </div>
            <div>
              <span>{en ? '3 · Per mole reacted' : '③ 每摩尔反应'}</span>
              <strong>{signed(data.apparentMolarKj, 1)} kJ/mol</strong>
              <small>÷ {data.reactedMol.toFixed(3)} mol</small>
            </div>
          </div>
          {record.heatLoss && (
            <p className="quantitative-note">
              {en
                ? 'C’s −46.8 kJ/mol is an uncorrected apparent estimate. The full ledger is qreaction + qsolution + qcup + qoutside = 0. A real low reading alone does not identify its cause.'
                : 'C 的 −46.8 kJ/mol 只是未校正的表观估计。完整账本是 q反应 + q溶液 + q杯子 + q外界 = 0；真实实验仅有偏低读数，还不能唯一确定原因。'}
            </p>
          )}
        </>
      )}
      <details>
        <summary>
          {en
            ? 'What assumptions make this ledger work?'
            : '这本账用了哪些近似？'}
        </summary>
        <p>
          {en
            ? 'Use both solution volumes, density 1.00 g/mL and c = 4.18 J/(g °C); assume additive volumes. With both concentrations 1.00 mol/L and a 1:1 equation, n = volume of either solution in litres. A/B neglect cup heating and outside heat transfer. At constant pressure, with only pressure–volume work, qreaction estimates ΔH for the amount reacting. C deliberately violates the no-loss assumption.'
            : '两份溶液体积都计入；近似密度 1.00 g/mL、比热容 c = 4.18 J/(g °C)，体积可相加。双方均为 1.00 mol/L，方程式比例 1∶1，所以 n 等于任一份溶液的升数。A/B 忽略杯子吸热和向外传热；恒压且只有体积功时，q反应可估计这一份反应的 ΔH。C 故意不满足无散热条件。'}
        </p>
      </details>
    </div>
  );
}

export function HessRouteLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [first, setFirst] = useState<HessFactor>(1);
  const [second, setSecond] = useState<HessFactor>(-1);
  const [target, setTarget] = useState<HessFactor>(1);
  const [checked, setChecked] = useState(false);
  const result = combineHessSteps(first, second);
  const matches = hessTargetMatches(result.inventory, target);
  const targetInventory = [-target, -target, 0, target] as SpeciesInventory;
  const targetNames = en
    ? ['Forward ×1', 'Reverse ×1', 'Forward ×2']
    : ['正向一份', '反向一份', '正向两份'];
  const targets = [1, -1, 2] as const;
  const factorName = (factor: HessFactor) =>
    `${factor > 0 ? (en ? 'Forward' : '正向') : en ? 'Reverse' : '反向'} ×${Math.abs(factor)}`;
  return (
    <div className="quantitative-lab thermo-lab">
      <p className="quantitative-note">
        {en
          ? 'Equation puzzle only—not a procedure for making carbon monoxide. Rounded standard-state data at 25 °C; C is graphite.'
          : '只做方程式拼图，不是制备一氧化碳的实验。数据为 25 °C 标准态的取整值；C 指石墨。'}
      </p>
      <div
        className="thermo-route-reference"
        role="img"
        aria-label={
          en
            ? 'Reference route for one mole: C and O₂ at relative enthalpy zero; CO and half O₂ at minus 111 kJ; CO₂ at minus 394 kJ. Step changes minus 111 and minus 283 add to minus 394 kJ.'
            : '一摩尔参考路线：碳和氧气相对焓为零，一氧化碳和半摩尔氧气为负111千焦，二氧化碳为负394千焦；两步焓变负111与负283相加为负394千焦。'
        }
      >
        <span>
          {en
            ? 'Reference · one mole, same endpoints · not to scale'
            : '参考图 · 一摩尔，相同起终点 · 不按比例绘制'}
        </span>
        <div>
          <strong>C(s) + O₂(g)</strong>
          <b>0 kJ</b>
        </div>
        <p>↓ ΔH₁ = −111 kJ</p>
        <div>
          <strong>CO(g) + ½O₂(g)</strong>
          <b>−111 kJ</b>
        </div>
        <p>↓ ΔH₂ = −283 kJ</p>
        <div>
          <strong>CO₂(g)</strong>
          <b>−394 kJ</b>
        </div>
        <span>
          {en
            ? 'Direct endpoint difference: −394 kJ. The diagram is an enthalpy ledger, not an activation-energy curve or proof of a mechanism.'
            : '直接看端点：−394 kJ。这是焓的账本，不是活化能曲线，也不是反应机理的证明。'}
        </span>
      </div>
      <div className="quantitative-choices">
        {targets.map((value, i) => (
          <button
            type="button"
            key={value}
            aria-pressed={target === value}
            onClick={() => {
              setTarget(value);
              setChecked(false);
            }}
          >
            {targetNames[i]}
          </button>
        ))}
      </div>
      <p className="thermo-equation">
        <strong>{en ? 'Target: ' : '目标：'}</strong>
        {equationText(targetInventory)}
      </p>
      <div className="quantitative-controls">
        {[first, second].map((factor, i) => (
          <label key={i}>
            {en
              ? `Step ${i + 1}: direction and amount`
              : `第 ${i + 1} 步：方向与份数`}
            <select
              aria-label={
                en
                  ? `Step ${i + 1} equation multiplier`
                  : `第 ${i + 1} 步方程式倍数`
              }
              value={factor}
              onChange={(e) => {
                const value = Number(e.target.value) as HessFactor;
                if (i === 0) setFirst(value);
                else setSecond(value);
                setChecked(false);
              }}
            >
              {hessFactors.map((f) => (
                <option value={f} key={f}>
                  {factorName(f)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="thermo-equation-stack">
        {[first, second].map((factor, i) => (
          <div key={i}>
            <span>
              {equationText(
                hessSteps[i]!.inventory.map(
                  (n) => n * factor,
                ) as unknown as SpeciesInventory,
              )}
            </span>
            <strong>
              ΔH° = {signed(hessSteps[i]!.enthalpyKj * factor)} kJ
            </strong>
          </div>
        ))}
        <div className="thermo-sum">
          <span>
            {en ? 'After adding and cancelling: ' : '相加、消去之后：'}
            {equationText(result.inventory)}
          </span>
          <strong>ΔH° = {signed(result.enthalpyKj)} kJ</strong>
        </div>
      </div>
      <p>
        {en
          ? `${result.cancelledCo} mol CO cancels; net CO coefficient is ${result.inventory[2]}. Only equal amounts on opposite sides cancel.`
          : `CO 抵消 ${result.cancelledCo} mol；净系数为 ${result.inventory[2]}。只有两边相等的份量才能抵消，不能把同侧的 CO 删掉。`}
      </p>
      <div className="quantitative-choices">
        <button type="button" onClick={() => setChecked(true)}>
          {en ? 'Check my equation route' : '检查我的方程式路线'}
        </button>
      </div>
      {checked && (
        <div className="quantitative-feedback" role="status">
          <strong>
            {matches
              ? en
                ? 'Route matches. '
                : '路线匹配。'
              : en
                ? 'The target is not matched yet. '
                : '还没有拼出目标。'}
          </strong>
          {en ? 'Explanation: ' : '解析：'}
          {matches
            ? en
              ? `Both steps have the required direction and amount. CO disappears from the net equation; the total change is ${signed(result.enthalpyKj)} kJ for the equation as written.`
              : `两步的方向和份数都与目标匹配，CO 不留在总方程式中。总焓变为 ${signed(result.enthalpyKj)} kJ，对应当前所写的整条方程式。`
            : en
              ? `For this target, set both steps to ${factorName(target)}. Reversal changes each heat sign; doubling changes every coefficient and heat value. Compare all species, not just the total heat.`
              : `这个目标需要两步都设为“${factorName(target)}”。反向时每步焓变变号；翻倍时所有系数和焓变都翻倍。要核对所有物质，不能只看热量数字。`}
        </div>
      )}
      <details>
        <summary>
          {en
            ? 'Why does a different route not change ΔH?'
            : '为什么换路线不改变 ΔH？'}
        </summary>
        <p>
          {en
            ? 'Enthalpy is a state function. Match substances, quantities, phases, temperature and pressure at both endpoints. A catalyst changes the barrier and rate, not this endpoint difference. The hypothetical steps used for calculation need not be the actual reaction mechanism.'
            : '焓是状态函数。必须匹配两端的物质、份量、物态、温度和压强。催化剂改变能垒与速率，不改变这一端点差。计算所用的假想步骤，也不必是反应真实发生的机理。'}
        </p>
      </details>
    </div>
  );
}
