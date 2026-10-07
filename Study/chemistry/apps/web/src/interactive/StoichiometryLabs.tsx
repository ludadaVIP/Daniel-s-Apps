import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { limeYield, waterRecipe } from './stoichiometry';
import './StoichiometryLabs.css';

function Portions({
  amount,
  kind,
}: {
  amount: number;
  kind: 'hydrogen' | 'oxygen' | 'water';
}) {
  return (
    <span className={`recipe-portions ${kind}`} aria-hidden="true">
      {Array.from({ length: amount * 2 }, (_, i) => (
        <i key={i}>
          {kind === 'water' ? '💧' : kind === 'hydrogen' ? 'H₂' : 'O₂'}
        </i>
      ))}
    </span>
  );
}

export function LimitingReactantLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [hydrogen, setHydrogen] = useState(4);
  const [oxygen, setOxygen] = useState(1);
  const [prediction, setPrediction] = useState<string | null>(null);
  const r = waterRecipe(hydrogen, oxygen);
  const choices = [
    { id: 'hydrogen', label: en ? 'H₂ runs out first' : 'H₂ 先用完' },
    { id: 'oxygen', label: en ? 'O₂ runs out first' : 'O₂ 先用完' },
    { id: 'both', label: en ? 'Both used up together' : '恰好一起用完' },
  ];
  return (
    <div className="quantitative-lab">
      <p className="recipe-equation">2H₂ + O₂ → 2H₂O</p>
      <div className="quantitative-controls">
        {(['hydrogen', 'oxygen'] as const).map((kind) => (
          <label key={kind}>
            {kind === 'hydrogen'
              ? en
                ? 'Initial H₂ amount'
                : '起始 H₂ 的量'
              : en
                ? 'Initial O₂ amount'
                : '起始 O₂ 的量'}
            <select
              aria-label={kind === 'hydrogen' ? 'H₂ mol' : 'O₂ mol'}
              value={kind === 'hydrogen' ? hydrogen : oxygen}
              onChange={(event) => {
                (kind === 'hydrogen' ? setHydrogen : setOxygen)(
                  Number(event.target.value),
                );
                setPrediction(null);
              }}
            >
              {[1, 2, 4, 6].map((n) => (
                <option key={n} value={n}>
                  {n} mol
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="recipe-stock">
        <div>
          <strong>H₂ · {hydrogen} mol</strong>
          <Portions amount={hydrogen} kind="hydrogen" />
        </div>
        <div>
          <strong>O₂ · {oxygen} mol</strong>
          <Portions amount={oxygen} kind="oxygen" />
        </div>
      </div>
      <p className="quantitative-note">
        {en
          ? 'Each symbol represents 0.5 mol, not one molecule. The equation needs 2 mol H₂ for every 1 mol O₂.'
          : '每个图标代表 0.5 mol，不是一个分子。配方每用 1 mol O₂，就需要 2 mol H₂。'}
      </p>
      <p className="quantitative-prompt">
        {en
          ? 'Assume complete reaction. Which stock runs out first? Choose to reveal.'
          : '假设反应完全进行：谁先用完？选一个，立即检查。'}
      </p>
      <div className="quantitative-choices">
        {choices.map((c) => (
          <button
            type="button"
            key={c.id}
            aria-pressed={prediction === c.id}
            onClick={() => setPrediction(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="recipe-result" aria-live="polite">
          <p className="quantitative-feedback">
            <b>{en ? 'Explanation: ' : '解析：'}</b>
            {prediction === r.limiting
              ? en
                ? 'Correct. '
                : '判断正确。'
              : en
                ? 'Try comparing complete recipe batches. '
                : '再比较能配成几份完整配方。'}
            {en
              ? `H₂ supports ${hydrogen / 2} recipe batches; O₂ supports ${oxygen}. ${r.limiting === 'both' ? 'They match exactly.' : `${r.limiting === 'hydrogen' ? 'H₂' : 'O₂'} supports fewer, so it limits the reaction.`}`
              : `H₂ 能支持 ${hydrogen / 2} 份配方，O₂ 能支持 ${oxygen} 份。${r.limiting === 'both' ? '两者恰好相等。' : `${r.limiting === 'hydrogen' ? 'H₂' : 'O₂'} 能支持的份数更少，所以限制反应。`}`}
          </p>
          <div className="recipe-stock">
            <div>
              <strong>
                {en ? 'Water formed' : '生成的水'} · {r.water} mol
              </strong>
              <Portions amount={r.water} kind="water" />
            </div>
            <div>
              <strong>{en ? 'Leftovers' : '剩余反应物'}</strong>
              <p>
                H₂: {r.remainingHydrogen} mol · O₂: {r.remainingOxygen} mol
              </p>
              <Portions amount={r.remainingHydrogen} kind="hydrogen" />
              <Portions amount={r.remainingOxygen} kind="oxygen" />
            </div>
          </div>
          <div className="quantitative-ledger">
            <div>
              <span>{en ? '1 · Find the bottleneck' : '1 · 找配方瓶颈'}</span>
              <strong>{r.batches}</strong>
              <p>
                min({hydrogen} ÷ 2, {oxygen} ÷ 1)
              </p>
            </div>
            <div>
              <span>{en ? '2 · Product amount' : '2 · 生成物的量'}</span>
              <strong>{r.water} mol</strong>
              <p>{r.batches} × 2 mol H₂O</p>
            </div>
            <div>
              <span>{en ? '3 · Product mass' : '3 · 生成物质量'}</span>
              <strong>{r.waterMass} g</strong>
              <p>{r.water} mol × 18 g/mol</p>
            </div>
          </div>
          <p className="quantitative-note">
            {en ? 'Mass check, including leftovers' : '质量检查，别漏掉剩余物'}
            ：{r.initialMass} g = {r.waterMass} g H₂O + {r.remainingMass} g{' '}
            {en ? 'leftover reactants' : '剩余反应物'}。
          </p>
        </div>
      )}
      <p className="quantitative-note">
        {en
          ? 'Virtual model only: rounded M(H₂)=2, M(O₂)=32, M(H₂O)=18 g/mol; complete conversion with no side reactions. Do not mix or ignite these gases.'
          : '仅限虚拟模型：取 M(H₂)=2、M(O₂)=32、M(H₂O)=18 g/mol；假设完全反应、没有副反应。不要实际混合或点燃这些气体。'}
      </p>
    </div>
  );
}

const yieldRecords = [
  {
    pure: 4.48,
    impurity: 0,
    zh: 'A · 纯 CaO · 4.48 g',
    en: 'A · Pure CaO · 4.48 g',
  },
  {
    pure: 5.04,
    impurity: 0,
    zh: 'B · 纯 CaO · 5.04 g',
    en: 'B · Pure CaO · 5.04 g',
  },
  {
    pure: 4.48,
    impurity: 1.4,
    zh: 'C · 混合样品 · 5.88 g',
    en: 'C · Mixed · 5.88 g total',
  },
];

export function PercentYieldLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [record, setRecord] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const data = yieldRecords[record]!;
  const r = limeYield(10, data.pure, data.impurity);
  return (
    <div className="quantitative-lab">
      <p className="recipe-equation">CaCO₃ → CaO + CO₂</p>
      <p className="quantitative-note">
        {en
          ? 'Start with 10.00 g pure CaCO₃. Heating is required; this is a virtual factory record, not a home experiment. Rounded molar masses: 100 → 56 + 44 g/mol.'
          : '投入 10.00 g 纯 CaCO₃。反应需要加热；这是虚拟工厂记录，不是家庭实验。取整摩尔质量：100 → 56 + 44 g/mol。'}
      </p>
      <div className="quantitative-ledger">
        <div>
          <span>{en ? '1 · Feed amount' : '1 · 原料的 mol 数'}</span>
          <strong>0.100 mol</strong>
          <p>10.00 g ÷ 100 g/mol</p>
        </div>
        <div>
          <span>{en ? '2 · Recipe ratio' : '2 · 方程式配方比例'}</span>
          <strong>1 : 1</strong>
          <p>CaCO₃ : CaO</p>
        </div>
        <div>
          <span>{en ? '3 · Theoretical CaO' : '3 · CaO 的理论产量'}</span>
          <strong>5.60 g</strong>
          <p>0.100 mol × 56 g/mol</p>
        </div>
      </div>
      <div className="quantitative-controls yield-controls">
        <label>
          {en ? 'Collection record' : '选择收集记录'}
          <select
            aria-label={en ? 'Collection record' : '收集记录'}
            value={record}
            onChange={(event) => {
              setRecord(Number(event.target.value));
              setPrediction(null);
            }}
          >
            {yieldRecords.map((d, i) => (
              <option key={i} value={i}>
                {en ? d.en : d.zh}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="quantitative-prompt">
        {data.impurity
          ? en
            ? 'Analysis identifies 4.48 g CaO and 1.40 g inert sand in sample C. What is the yield of CaO itself?'
            : '分析显示 C 样品中有 4.48 g CaO 和 1.40 g 惰性沙粒。CaO 本身的产率是多少？'
          : en
            ? 'What percentage of the theoretical CaO was collected?'
            : '收集到的 CaO 是理论产量的百分之几？'}
      </p>
      <div className="quantitative-choices">
        {[80, 90, 105].map((p) => (
          <button
            type="button"
            key={p}
            aria-pressed={prediction === p}
            onClick={() => setPrediction(p)}
          >
            {p}%
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="recipe-result" aria-live="polite">
          <p className="quantitative-feedback">
            <b>{en ? 'Explanation: ' : '解析：'}</b>
            {Math.abs(prediction - r.actualPercent) < 0.01
              ? en
                ? 'Correct. '
                : '判断正确。'
              : en
                ? 'Use only the target product mass. '
                : '分子要用目标产物的质量。'}
            {data.pure.toFixed(2)} ÷ 5.60 × 100% = {r.actualPercent.toFixed(0)}
            {en ? '%.' : '%。'}
            {data.impurity > 0 &&
              (en
                ? ' Sand adds sample mass, not CaO yield.'
                : ' 沙粒增加样品质量，并没有增加 CaO 产量。')}
          </p>
          <div className="yield-bars">
            <div>
              <strong>{en ? 'Theoretical CaO' : '理论 CaO'} · 5.60 g</strong>
              <div className="yield-track">
                <i
                  className="yield-theory"
                  style={{ width: `${(5.6 / 6) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <strong>
                {en ? 'Collected sample' : '收集的样品'} ·{' '}
                {r.sampleMass.toFixed(2)} g
              </strong>
              <div className="yield-track">
                <i
                  className="yield-pure"
                  style={{ width: `${(data.pure / 6) * 100}%` }}
                />
                <i
                  className="yield-impurity"
                  style={{ width: `${(data.impurity / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <p className="quantitative-note">
            {en
              ? 'Blue = pure CaO; hatched grey = inert impurity. Both bars use the same mass scale.'
              : '蓝色＝纯 CaO；灰色斜纹＝惰性杂质。两条使用相同质量刻度。'}
          </p>
          {data.impurity > 0 && (
            <p className="quantitative-feedback">
              {en
                ? 'Using the whole sample gives an apparent '
                : '若误用整个样品，会得到表观产率 '}
              {r.apparentPercent.toFixed(0)}%
              {en
                ? ', not a valid pure-product yield. Check purity, drying, weighing and the assumed reaction before claiming more than 100%.'
                : '，这不是有效的纯产物产率。超过 100% 应先检查纯度、干燥、称量和所用反应，不能宣称突破了理论上限。'}
            </p>
          )}
          <details className="yield-details">
            <summary>
              {en ? 'Where is the missing mass?' : '少收集的质量去哪儿了？'}
            </summary>
            <p>
              {en
                ? `Ideal complete decomposition gives 5.60 g CaO + 4.40 g CO₂ = 10.00 g. The ${(5.6 - data.pure).toFixed(2)} g CaO shortfall in the collection does not mean mass vanished: product could remain in equipment. An incomplete reaction could instead leave CaCO₃. Yield alone cannot identify the cause; collect more evidence.`
                : `理想完全分解：5.60 g CaO + 4.40 g CO₂ = 10.00 g。少收集 ${(5.6 - data.pure).toFixed(2)} g CaO 不代表质量消失：产物可能留在设备里；反应不完全则可能留下 CaCO₃。仅凭产率不能判断是哪种原因，还要找证据。`}
            </p>
          </details>
        </div>
      )}
      <p className="quantitative-note">
        {en
          ? 'Authored teaching records, not measured factory data. Actual yield counts collected, dry, pure target product. CaO is caustic; do not make or handle it at home.'
          : '以上为编写的教学记录，并非工厂实测数据。实际产量按收集到的干燥、纯净目标产物计。CaO 有腐蚀性，不要在家制取或接触。'}
      </p>
    </div>
  );
}
