import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import {
  averageGasRate,
  changedRateVariables,
  disturbedEquilibrium,
  equilibrate,
  equilibriumFlows,
  initialEquilibrium,
  rateTimes,
  rateTrials,
  type EquilibriumChange,
  type EquilibriumState,
  type RateTrial,
  type RateVariable,
} from './reactionEvidence';
import './ReactionEvidenceLabs.css';

const comparisonPairs = [
  { a: 0, b: 1, label: 'A + B' },
  { a: 0, b: 3, label: 'A + D' },
  { a: 2, b: 3, label: 'C + D' },
  { a: 0, b: 2, label: 'A + C' },
] as const;
const rateIntervals = [
  [0, 20],
  [10, 30],
  [30, 60],
] as const;

function GasCurve({
  first,
  second,
  en,
}: {
  first: RateTrial;
  second: RateTrial;
  en: boolean;
}) {
  const points = (trial: RateTrial) =>
    trial.gas
      .map(
        (gas, index) =>
          `${(rateTimes[index]! / 90) * 360},${180 - (gas / 40) * 180}`,
      )
      .join(' ');
  return (
    <div className="evidence-gas-graph">
      <p>{en ? 'Cumulative CO₂ volume (mL)' : '累计 CO₂ 体积（mL）'}</p>
      <div className="evidence-graph-frame">
        <div className="evidence-y-ticks" aria-hidden="true">
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
        <svg
          viewBox="0 0 360 180"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[0, 90, 180].map((y) => (
            <line
              key={`h-${y}`}
              x1="0"
              x2="360"
              y1={y}
              y2={y}
              className="evidence-grid-line"
            />
          ))}
          {[0, 120, 240, 360].map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              x2={x}
              y1="0"
              y2="180"
              className="evidence-grid-line"
            />
          ))}
          <polyline points={points(first)} className="evidence-curve first" />
          <polyline points={points(second)} className="evidence-curve second" />
        </svg>
        <div className="evidence-x-ticks" aria-hidden="true">
          <span>0</span>
          <span>30</span>
          <span>60</span>
          <span>90</span>
        </div>
      </div>
      <p className="evidence-time-label">{en ? 'Time (s)' : '时间（s）'}</p>
      <div className="evidence-curve-legend">
        <span className="first">
          {first.id} · {en ? 'solid line' : '实线'}
        </span>
        <span className="second">
          {second.id} · {en ? 'dashed line' : '虚线'}
        </span>
      </div>
      <p className="quantitative-note">
        {en
          ? 'Authored teaching data joined by lines; not real measurements or an exact reaction curve. Open the records below for the numerical evidence.'
          : '自编教学数据，线段连接记录点；不是真实测量或精确反应曲线。下方可展开数字记录。'}
      </p>
      <details className="evidence-details">
        <summary>{en ? 'View numerical records' : '查看数字记录'}</summary>
        <table className="evidence-trials">
          <thead>
            <tr>
              <th scope="col">{en ? 'Time (s)' : '时间 s'}</th>
              <th scope="col">{first.id} (mL)</th>
              <th scope="col">{second.id} (mL)</th>
            </tr>
          </thead>
          <tbody>
            {rateTimes.map((time, index) => (
              <tr key={time}>
                <th scope="row">{time}</th>
                <td>{first.gas[index]}</td>
                <td>{second.gas[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export function RateEvidenceLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [target, setTarget] = useState<RateVariable>('concentration');
  const [pairIndex, setPairIndex] = useState<number | null>(null);
  const [intervalIndex, setIntervalIndex] = useState(0);
  const labels = {
    concentration: en ? 'Acid concentration' : '酸浓度',
    temperature: en ? 'Temperature' : '温度',
    surface: en ? 'Surface area' : '表面积',
  };
  const pair = pairIndex === null ? undefined : comparisonPairs[pairIndex];
  const first = pair ? rateTrials[pair.a] : undefined;
  const second = pair ? rateTrials[pair.b] : undefined;
  const changed = first && second ? changedRateVariables(first, second) : [];
  const fair = changed.length === 1 && changed[0] === target;
  const [start, end] = rateIntervals[intervalIndex] ?? rateIntervals[0];

  return (
    <div className="quantitative-lab">
      <p className="quantitative-prompt">
        {en
          ? 'Virtual CaCO₃ + excess HCl. Equal solid mass and liquid volume; same stirring and collection method. Gas volumes are compared at a common temperature and pressure. Teaching records, not a home experiment.'
          : '虚拟 CaCO₃ + 足量 HCl。固体质量、液体体积、搅拌与收集方法相同；气体体积按共同温度和压强比较。教学记录，不是家庭实验。'}
      </p>
      <table className="evidence-trials">
        <thead>
          <tr>
            <th scope="col">{en ? 'Trial' : '组'}</th>
            <th scope="col">
              {en ? 'Acid' : '酸浓度'}
              <span>mol/L</span>
            </th>
            <th scope="col">
              {en ? 'Temp.' : '温度'}
              <span>°C</span>
            </th>
            <th scope="col">{en ? 'Solid' : '固体'}</th>
          </tr>
        </thead>
        <tbody>
          {rateTrials.map((trial) => (
            <tr key={trial.id}>
              <th scope="row">{trial.id}</th>
              <td>{trial.concentration.toFixed(1)}</td>
              <td>{trial.temperature}</td>
              <td>
                {trial.powdered
                  ? en
                    ? 'Powder'
                    : '粉末'
                  : en
                    ? 'Chips'
                    : '碎块'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="quantitative-controls">
        <label>
          {en ? 'Which variable are you studying?' : '你要研究哪个变量？'}
          <select
            value={target}
            onChange={(event) => {
              setTarget(event.target.value as RateVariable);
              setPairIndex(null);
            }}
          >
            {(Object.keys(labels) as RateVariable[]).map((key) => (
              <option key={key} value={key}>
                {labels[key]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {en ? 'Average-rate interval' : '平均速率的时间段'}
          <select
            value={intervalIndex}
            onChange={(event) => setIntervalIndex(Number(event.target.value))}
          >
            {rateIntervals.map(([a, b], index) => (
              <option key={a} value={index}>
                {a}–{b} s
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="quantitative-prompt">
        {en
          ? 'Choose a pair that isolates your chosen variable.'
          : '选择能单独研究这个变量的对照组。'}
      </p>
      <div className="quantitative-choices">
        {comparisonPairs.map((item, index) => (
          <button
            type="button"
            key={item.label}
            aria-pressed={pairIndex === index}
            onClick={() => setPairIndex(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {first && second ? (
        <>
          <div className="quantitative-feedback" role="status">
            <strong>
              {fair
                ? en
                  ? 'Fair comparison · Explanation: '
                  : '公平比较 · 解析：'
                : en
                  ? 'Not for this question · Explanation: '
                  : '这组不能单独回答 · 解析：'}
            </strong>
            {en
              ? `Changed: ${changed.map((key) => labels[key]).join(' + ')}. ${changed.length > 1 ? 'Two variables changed, so the faster curve cannot isolate either cause.' : fair ? 'Other listed conditions match, so this pair tests the chosen variable.' : 'Only one variable changed, but it is not the one you selected.'}`
              : `改变了：${changed.map((key) => labels[key]).join(' + ')}。${changed.length > 1 ? '两项一起变了，曲线再快也无法分清各自贡献。' : fair ? '其他列出的条件相同，这组能比较你选的变量。' : '虽然只改变一项，但不是你要研究的那一项。'}`}
          </div>
          <GasCurve first={first} second={second} en={en} />
          <div className="evidence-rate-readouts">
            {[first, second].map((trial) => (
              <div key={trial.id}>
                <span>
                  {trial.id} · {start}–{end} s
                </span>
                <strong>
                  {averageGasRate(trial, start, end).toFixed(2)} mL/s
                </strong>
                <p>
                  ({trial.gas[rateTimes.findIndex((t) => t === end)]} −{' '}
                  {trial.gas[rateTimes.findIndex((t) => t === start)]}) ÷ ({end}{' '}
                  − {start})
                </p>
              </div>
            ))}
          </div>
          <p className="quantitative-note">
            {en
              ? 'Both records end at 40 mL. Rate and final yield answer different questions; these numbers alone do not prove how every real reaction behaves.'
              : '两组最终都到 40 mL。速率与最终产量回答不同问题；这些示意数值不能证明所有真实反应都如此。'}
          </p>
        </>
      ) : (
        <p className="evidence-waiting">
          {en
            ? 'Choose controls first; the curves will appear here.'
            : '先选对照组，这里再显示曲线。'}
        </p>
      )}
    </div>
  );
}

function EquilibriumSnapshot({
  state,
  title,
  en,
}: {
  state: EquilibriumState;
  title: string;
  en: boolean;
}) {
  const flows = equilibriumFlows(state);
  return (
    <div className="shift-snapshot">
      <h3>{title}</h3>
      <p>
        {en ? 'Relative volume' : '相对体积'} · {state.volume}
      </p>
      <div className="shift-species">
        <span>
          A₂ ≈ <strong>{state.dimer.toFixed(2)}</strong>
        </span>
        <span>
          A ≈ <strong>{state.monomer.toFixed(2)}</strong>
        </span>
      </div>
      <p>
        {en ? 'A-atom inventory' : 'A 原子账本'} ·{' '}
        {(2 * state.dimer + state.monomer).toFixed(2)}
      </p>
      <p>
        {en ? 'Forward / reverse rates' : '正向 / 逆向速率'}
        <br />
        <b>
          {flows.forward.toFixed(2)} → / {flows.reverse.toFixed(2)} ←
        </b>
      </p>
    </div>
  );
}

export function EquilibriumShiftLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [change, setChange] = useState<EquilibriumChange>('compress');
  const [answer, setAnswer] = useState<string | null>(null);
  const immediate = disturbedEquilibrium(change);
  const final = equilibrate(immediate);
  const winner =
    Math.abs(final.monomer - immediate.monomer) < 1e-9
      ? 'same'
      : final.monomer > immediate.monomer
        ? 'increase'
        : 'decrease';
  const revealed = answer !== null;
  const labels = {
    compress: en ? 'Halve volume · constant T' : '体积减半 · 恒温',
    warm: en ? 'Warm · fixed volume' : '升温 · 体积不变',
    catalyst: en ? 'Add ideal catalyst' : '加入理想催化剂',
    'add-a': en ? 'Add 2 portions A, then close' : '加入 2 份 A，再密闭',
  };
  const feedback = {
    compress: en
      ? 'Amounts do not change at the compression instant. The reverse flow then exceeds the forward flow, so some A pairs into A₂. At the new equilibrium, flows match again. A amount falls, but its concentration rises because volume halved.'
      : '压缩瞬间份数没变。随后逆向速率大于正向，一部分 A 配成 A₂。新平衡两边速率重新相等。A 份数减少，但体积减半使它的浓度仍比原来高。',
    warm: en
      ? 'The forward direction is endothermic in this fictional model. Heating favours more A; both flows speed up, then match at a new composition.'
      : '这个虚构模型的正向吸热。升温有利于形成更多 A；两个方向都加快，最终在新的组成处速率相等。',
    catalyst: en
      ? 'Both model rate constants triple. The ratio is unchanged, so composition stays fixed while both nonzero flows triple. The system has not stopped.'
      : '模型的两个速率常数都变为 3 倍，比值没变，所以组成不变，两个非零转化速率都变为 3 倍。体系没有停止。',
    'add-a': en
      ? 'The added A makes reverse conversion faster initially. Some A pairs into A₂, but the addition is not completely undone: final A is above the original 2, and the inventory remains 8.'
      : '新增 A 让逆向转化一开始更快。一部分 A 配成 A₂，但新增影响没有完全取消：最终 A 仍多于原来的 2 份，原子账本仍是 8。',
  };
  const finalFlow = equilibriumFlows(final);

  return (
    <div className="quantitative-lab">
      <p className="quantitative-equation">
        A₂(g) ⇌ 2A(g){' '}
        <span>{en ? 'Forward direction absorbs heat' : '正向吸热'}</span>
      </p>
      <p className="quantitative-note">
        {en
          ? 'A is fictional. Quantities, volumes and event rates are relative teaching units, not real gas measurements. Each choice starts from the same original equilibrium.'
          : 'A 是虚构粒子。份数、体积与转化速率均为教学相对单位，不是真实气体测量。每次选择都从同一个原平衡开始。'}
      </p>
      <label className="evidence-change-label">
        {en ? 'Choose one disturbance' : '选择一种扰动'}
        <select
          value={change}
          onChange={(event) => {
            setChange(event.target.value as EquilibriumChange);
            setAnswer(null);
          }}
        >
          {(Object.keys(labels) as EquilibriumChange[]).map((key) => (
            <option key={key} value={key}>
              {labels[key]}
            </option>
          ))}
        </select>
      </label>
      <p className="quantitative-prompt">
        {en
          ? 'From the disturbed instant to re-equilibrium, how will the AMOUNT of A change? Choose to reveal.'
          : '从“扰动刚发生”到“重新平衡”，A 的份数怎样变？选择后立即揭晓。'}
      </p>
      <div className="quantitative-choices">
        {[
          { id: 'increase', label: en ? 'Increases' : '增加' },
          { id: 'same', label: en ? 'Stays the same' : '不变' },
          { id: 'decrease', label: en ? 'Decreases' : '减少' },
        ].map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={answer === item.id}
            onClick={() => setAnswer(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="shift-timeline">
        <EquilibriumSnapshot
          state={initialEquilibrium}
          title={en ? '1 · Original equilibrium' : '1 · 原来的平衡'}
          en={en}
        />
        <EquilibriumSnapshot
          state={immediate}
          title={en ? '2 · Disturbed instant' : '2 · 扰动刚发生'}
          en={en}
        />
        {revealed ? (
          <EquilibriumSnapshot
            state={final}
            title={en ? '3 · New equilibrium' : '3 · 重新达到平衡'}
            en={en}
          />
        ) : (
          <div className="evidence-waiting">
            {en
              ? 'Your prediction comes before stage 3'
              : '先作预测，再看第 3 段'}
          </div>
        )}
      </div>
      {revealed && (
        <>
          <div className="quantitative-feedback" role="status">
            <strong>
              {answer === winner
                ? en
                  ? 'Correct · Explanation: '
                  : '判断正确 · 解析：'
                : en
                  ? 'Separate the stages · Explanation: '
                  : '分开看三段过程 · 解析：'}
            </strong>
            {feedback[change]}
          </div>
          <div
            className="shift-moving"
            aria-hidden="true"
            style={{ animationDuration: `${6 / finalFlow.forward}s` }}
          >
            <span>A₂</span>
            <i className="forward">→</i>
            <i className="reverse">←</i>
            <span>2A</span>
          </div>
          <p className="quantitative-note">
            {en
              ? 'Moving arrows show both directions continuing, not individual particles. Amounts are relative bulk quantities, not half-molecules. Displayed amounts are rounded; the atomic inventory uses unrounded values.'
              : '移动箭头表示双向过程仍在继续，不是逐粒子模拟。份数是相对物质的量，不是“半个分子”。显示份数经过四舍五入，原子账本用未舍入数值计算。'}
          </p>
        </>
      )}
      <details className="evidence-details">
        <summary>
          {en ? 'Advanced: inspect the model rules' : '高中拓展：查看模型规则'}
        </summary>
        <p>
          {en
            ? 'Forward events = kf × amount(A₂); reverse events = kr × amount(A)² / volume. Original kf = 2, kr = 1; heating uses 8 and 2; catalyst multiplies both by 3. Solve equal flows together with the atomic inventory to obtain the final amounts. These are selected teaching constants, not empirical constants for a real gas.'
            : '正向事件速率 = kf × A₂ 份数；逆向事件速率 = kr × A 份数² / 体积。原模型 kf = 2、kr = 1；升温设为 8 与 2；催化剂让两者同乘 3。把速率相等与原子账本联立，得到最终份数。这些是指定的教学常数，不是真实气体的经验常数。'}
        </p>
      </details>
    </div>
  );
}
