import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import {
  ethanoicAcidHydronium,
  phFromHydronium,
  strongAcidHydronium,
} from './acidMath';
import './AcidConcentrationLabs.css';

function IonConcentration({ value }: { value: number }) {
  const [mantissa, power] = value.toExponential(2).split('e');
  return (
    <span className="acid-ion-number">
      {mantissa} × 10<sup>{Number(power)}</sup> mol/L
    </span>
  );
}

export function PhDilutionLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [initialPh, setInitialPh] = useState(2);
  const [factor, setFactor] = useState(10);
  const [answer, setAnswer] = useState<string | null>(null);
  const initialConcentration = 10 ** -initialPh;
  const finalConcentration = initialConcentration / factor;
  const initialHydronium = strongAcidHydronium(initialConcentration);
  const finalHydronium = strongAcidHydronium(finalConcentration);
  const before = phFromHydronium(initialHydronium);
  const after = phFromHydronium(finalHydronium);
  const largeDilution = factor === 1000000;
  const correctText = after.toFixed(largeDilution ? 4 : 2);
  const choices = [
    { kind: 'more-acid', text: (initialPh - Math.log10(factor)).toFixed(2) },
    { kind: 'correct', text: correctText },
    {
      kind: 'wrong-scale',
      text: (largeDilution ? initialPh + 6 : initialPh * factor).toFixed(2),
    },
  ];
  const options = [
    ...choices.slice(initialPh - 2),
    ...choices.slice(0, initialPh - 2),
  ];
  const revealed = answer !== null;

  return (
    <div className="quantitative-lab">
      <p className="quantitative-prompt">
        {en
          ? 'Virtual dilute HCl + pure water · 25 °C · no other solutes or CO₂. Ideal concentration model, not a home experiment.'
          : '虚拟稀盐酸 + 纯水 · 25 °C · 无其他溶质或 CO₂。理想浓度模型，不是家庭实验。'}
      </p>
      <div className="quantitative-controls">
        <label>
          {en ? 'Original HCl recipe concentration' : '原盐酸的配制浓度'}
          <select
            value={initialPh}
            onChange={(event) => {
              setInitialPh(Number(event.target.value));
              setAnswer(null);
            }}
          >
            {[2, 3, 4].map((ph) => (
              <option key={ph} value={ph}>
                {(10 ** -ph).toFixed(ph)} mol/L · pH ≈ {ph}
              </option>
            ))}
          </select>
        </label>
        <label>
          {en ? 'Final volume ÷ original volume' : '最终体积 ÷ 原体积'}
          <select
            value={factor}
            onChange={(event) => {
              setFactor(Number(event.target.value));
              setAnswer(null);
            }}
          >
            <option value={10}>{en ? '10 times' : '10 倍'}</option>
            <option value={100}>{en ? '100 times' : '100 倍'}</option>
            <option value={1000000}>
              {en ? '1,000,000 times (virtual)' : '100 万倍（虚拟）'}
            </option>
          </select>
        </label>
      </div>
      <p className="quantitative-prompt">
        {en
          ? 'Solute moles stay fixed. Predict the final pH; select to reveal immediately.'
          : '溶质的 mol 数不变。预测最终 pH，选择后立即揭晓。'}
      </p>
      <div className="quantitative-choices">
        {options.map((choice) => (
          <button
            type="button"
            key={choice.kind}
            aria-pressed={answer === choice.kind}
            onClick={() => setAnswer(choice.kind)}
          >
            pH ≈ {choice.text}
          </button>
        ))}
      </div>
      <div className="acid-ph-ruler" aria-hidden="true">
        <div className="acid-ph-track" />
        {Array.from({ length: 8 }, (_, ph) => (
          <span
            className="acid-ph-tick"
            key={ph}
            style={{ left: `${(ph / 7) * 100}%` }}
          >
            {ph}
          </span>
        ))}
        <i
          className="acid-ph-marker before"
          style={{ left: `${(before / 7) * 100}%` }}
        />
        {revealed && (
          <i
            className="acid-ph-marker after"
            style={{ left: `${(after / 7) * 100}%` }}
          />
        )}
      </div>
      <div className="acid-reading-pair">
        <div>
          <span className="acid-before-label">
            {en ? 'Original solution' : '原液'}
          </span>
          <strong>pH ≈ {before.toFixed(2)}</strong>
          <span>[H₃O⁺]</span>
          <IonConcentration value={initialHydronium} />
        </div>
        <div>
          <span className="acid-after-label">
            {en ? 'After dilution' : '稀释后'}
          </span>
          {revealed ? (
            <>
              <strong>pH ≈ {correctText}</strong>
              <span>[H₃O⁺]</span>
              <IonConcentration value={finalHydronium} />
            </>
          ) : (
            <strong>{en ? 'Predict first' : '先预测'}</strong>
          )}
        </div>
      </div>
      {revealed && (
        <div className="quantitative-feedback" role="status">
          <strong>
            {answer === 'correct'
              ? en
                ? 'Correct · Explanation: '
                : '判断正确 · 解析：'
              : en
                ? 'Not quite · Explanation: '
                : '再想一步 · 解析：'}
          </strong>
          {largeDilution
            ? en
              ? `The added-acid concentration is now ${finalConcentration.toExponential(1)} mol/L. Water contributes ions too, so pH approaches 7 from below, rather than becoming ${initialPh + 6}.`
              : `来自所加酸的配制浓度现在仅为 ${finalConcentration.toExponential(1)} mol/L。水本身也贡献离子，所以 pH 从酸性一侧接近 7，而不是变成 ${initialPh + 6}。`
            : en
              ? `Volume becomes ${factor} times as large, so acid concentration becomes 1/${factor}. Away from neutrality, that is about ${Math.log10(factor)} tenfold steps: pH ≈ ${correctText}.`
              : `体积变为 ${factor} 倍，酸的配制浓度变为 1/${factor}。远离中性时，这相当于约 ${Math.log10(factor)} 个十倍台阶：pH ≈ ${correctText}。`}
        </div>
      )}
      <p className="quantitative-note">
        {en
          ? 'This ruler shows only the model’s acidic range, 0–7. Pure-water dilution does not change HCl into a weak acid or a base.'
          : '标尺只展示本模型的酸性区间 0–7。纯水稀释不会把 HCl 变成弱酸或碱。'}
      </p>
      <details className="acid-model-details">
        <summary>
          {en
            ? 'Advanced: how the model includes water'
            : '高中拓展：模型怎样把水算进去'}
        </summary>
        <p>
          {en
            ? 'At 25 °C, [H₃O⁺][OH⁻] = 10⁻¹⁴. For fully ionised HCl, [H₃O⁺] − [OH⁻] = c. Solving both gives [H₃O⁺] = (c + √(c² + 4 × 10⁻¹⁴))/2. The introductory pH approximation is −log₁₀[H₃O⁺], with concentration in mol/L.'
            : '25 °C 时，[H₃O⁺][OH⁻] = 10⁻¹⁴。完全电离的 HCl 满足 [H₃O⁺] − [OH⁻] = c。联立得到 [H₃O⁺] = (c + √(c² + 4 × 10⁻¹⁴))/2。本课采用 pH ≈ −log₁₀[H₃O⁺] 的入门近似，浓度单位为 mol/L。'}
        </p>
      </details>
    </div>
  );
}

export function AcidStrengthLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [strongConcentration, setStrongConcentration] = useState(0.01);
  const [weakConcentration, setWeakConcentration] = useState(0.01);
  const [answer, setAnswer] = useState<string | null>(null);
  const strongH = strongAcidHydronium(strongConcentration);
  const weakH = ethanoicAcidHydronium(weakConcentration);
  const weakPercent = (weakH / weakConcentration) * 100;
  const winner = strongH > weakH ? 'strong' : 'weak';
  const revealed = answer !== null;
  const samples = [
    {
      id: 'strong',
      title: en ? 'HCl · strong acid' : 'HCl · 强酸',
      c: strongConcentration,
      h: strongH,
      fraction: 100,
      presets: [0.0001, 0.01, 0.1],
      change: setStrongConcentration,
    },
    {
      id: 'weak',
      title: en ? 'CH₃COOH · weak acid' : 'CH₃COOH · 弱酸',
      c: weakConcentration,
      h: weakH,
      fraction: weakPercent,
      presets: [0.001, 0.01, 0.1],
      change: setWeakConcentration,
    },
  ];

  function chooseRecipe(strong: number, weak: number) {
    setStrongConcentration(strong);
    setWeakConcentration(weak);
    setAnswer(null);
  }

  return (
    <div className="quantitative-lab">
      <p className="quantitative-prompt">
        {en
          ? 'Two pure-acid solution models at 25 °C. “Recipe concentration” means acid added per litre, including any acid that remains un-ionised.'
          : '25 °C 的两份纯酸溶液模型。“配制浓度”是每升加入的酸份数，包括尚未电离的酸。'}
      </p>
      <div className="quantitative-choices">
        <button type="button" onClick={() => chooseRecipe(0.01, 0.01)}>
          {en ? 'Match concentrations' : '同浓度比较'}
        </button>
        <button type="button" onClick={() => chooseRecipe(0.0001, 0.1)}>
          {en ? 'Dilute strong vs concentrated weak' : '稀强酸 vs 浓弱酸'}
        </button>
      </div>
      <div className="acid-comparison">
        {samples.map((sample) => (
          <div className="acid-sample-card" key={sample.id}>
            <h3>{sample.title}</h3>
            <label>
              {en ? 'Recipe concentration' : '配制浓度'}
              <select
                aria-label={
                  en
                    ? `${sample.id === 'strong' ? 'HCl' : 'Ethanoic acid'} recipe concentration`
                    : `${sample.id === 'strong' ? '盐酸' : '乙酸'}配制浓度`
                }
                value={sample.c}
                onChange={(event) => {
                  sample.change(Number(event.target.value));
                  setAnswer(null);
                }}
              >
                {sample.presets.map((c) => (
                  <option key={c} value={c}>
                    {c.toFixed(c < 0.001 ? 4 : 3)} mol/L
                  </option>
                ))}
              </select>
            </label>
            <p>
              {sample.id === 'strong'
                ? en
                  ? 'Almost all HCl transfers a proton to water.'
                  : 'HCl 几乎都把质子转移给水。'
                : en
                  ? 'Only part of the acid transfers a proton; both directions continue at equilibrium.'
                  : '只有部分酸转移质子；到平衡时双向过程仍继续。'}
            </p>
            {revealed && (
              <div className="acid-sample-results">
                <span>
                  {en ? 'Ionised fraction (approx.)' : '电离比例（约）'} ·{' '}
                  {sample.fraction.toFixed(2)}%
                </span>
                <div className="acid-fraction-track" aria-hidden="true">
                  <i style={{ width: `${sample.fraction}%` }} />
                </div>
                <span>[H₃O⁺]</span>
                <IonConcentration value={sample.h} />
                <strong>pH ≈ {phFromHydronium(sample.h).toFixed(2)}</strong>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="quantitative-prompt">
        {en
          ? 'Which sample has LOWER pH? Choose to compare both ion concentration and ionised fraction.'
          : '哪一杯 pH 更低？选择后比较离子浓度与电离比例。'}
      </p>
      <div className="quantitative-choices">
        <button
          type="button"
          aria-pressed={answer === 'weak'}
          onClick={() => setAnswer('weak')}
        >
          {en ? 'Ethanoic-acid sample' : '乙酸那杯'}
        </button>
        <button
          type="button"
          aria-pressed={answer === 'same'}
          onClick={() => setAnswer('same')}
        >
          {en ? 'Same pH' : 'pH 相同'}
        </button>
        <button
          type="button"
          aria-pressed={answer === 'strong'}
          onClick={() => setAnswer('strong')}
        >
          {en ? 'HCl sample' : '盐酸那杯'}
        </button>
      </div>
      {revealed && (
        <div className="quantitative-feedback" role="status">
          <strong>
            {answer === winner
              ? en
                ? 'Correct · Explanation: '
                : '判断正确 · 解析：'
              : en
                ? 'Look at both labels · Explanation: '
                : '同时看两个标签 · 解析：'}
          </strong>
          {winner === 'strong'
            ? en
              ? 'This HCl sample has greater hydronium concentration, so lower pH. Acid strength and recipe concentration both matter.'
              : '这份盐酸的 H₃O⁺ 浓度更高，所以 pH 更低。判断时要同时看酸的性质和配制浓度。'
            : en
              ? 'This ethanoic-acid sample has greater hydronium concentration, so lower pH, despite being a weak acid. Lower pH does not relabel it as a strong acid.'
              : '这份乙酸虽然是弱酸，H₃O⁺ 浓度却更高，所以 pH 更低。pH 更低没有把乙酸改成强酸。'}
        </div>
      )}
      <p className="quantitative-note">
        {en
          ? 'Bar lengths show the ionised percentage, not hydronium concentration. Diluting ethanoic acid can raise its ionised percentage while lowering [H₃O⁺]. These model values do not predict a real vinegar or cleaner.'
          : '条形长度表示电离百分比，不是 H₃O⁺ 浓度。乙酸稀释时，电离百分比可能升高，而 [H₃O⁺] 下降。模型数值不能直接预测真实食醋或清洁剂。'}
      </p>
      <details className="acid-model-details">
        <summary>
          {en
            ? 'Advanced: where the weak-acid numbers come from'
            : '高中拓展：弱酸数值从哪里来'}
        </summary>
        <p>
          {en
            ? 'For pure ethanoic acid, use Ka = 1.8 × 10⁻⁵ and Ka = x²/(c − x), where x ≈ [H₃O⁺]. Solve the positive root instead of assigning a fixed percentage. This approximation ignores water’s negligible contribution only within the supported 0.001–0.100 mol/L range; it does not support arbitrarily dilute weak acids.'
            : '纯乙酸取 Ka = 1.8 × 10⁻⁵，满足 Ka = x²/(c − x)，其中 x ≈ [H₃O⁺]。模型求正根，而非指定固定百分比。只在本模型 0.001–0.100 mol/L 范围内忽略水的微小贡献，不支持随意外推到极稀弱酸。'}
        </p>
      </details>
    </div>
  );
}
