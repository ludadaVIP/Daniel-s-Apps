import { useState } from 'react';
import type { LanguageMode } from '@study/shared';

function SolutionVessel({
  diluted,
  dots,
  label,
}: {
  diluted: boolean;
  dots: number;
  label: string;
}) {
  return (
    <div className="molar-vessel-card">
      <div className="molar-vessel" aria-hidden="true">
        <div className={`molar-liquid ${diluted ? 'diluted' : ''}`}>
          {Array.from({ length: dots }, (_, index) => (
            <i
              key={index}
              style={{
                left: `${12 + (index % 6) * 15}%`,
                top: `${((Math.floor(index / 6) + 0.5) / Math.ceil(dots / 6)) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
      <strong>{label}</strong>
    </div>
  );
}

export function MolarConcentrationLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [mass, setMass] = useState(18);
  const [volume, setVolume] = useState(500);
  const [prediction, setPrediction] = useState<number | null>(null);
  const moles = mass / 180;
  const litres = volume / 1000;
  const concentration = moles / litres;
  const revealed = prediction !== null;
  const predictions = en
    ? ['Halves', 'Stays the same', 'Doubles']
    : ['减半', '不变', '加倍'];

  return (
    <div className="quantitative-lab">
      <div className="quantitative-controls">
        <label>
          {en ? 'Glucose mass · M = 180 g/mol' : '葡萄糖质量 · M = 180 g/mol'}
          <select
            value={mass}
            onChange={(event) => {
              setMass(Number(event.target.value));
              setPrediction(null);
            }}
          >
            {[9, 18, 36].map((value) => (
              <option key={value} value={value}>
                {value} g
              </option>
            ))}
          </select>
        </label>
        <label>
          {en ? 'Final solution volume' : '最终溶液体积'}
          <select
            value={volume}
            onChange={(event) => {
              setVolume(Number(event.target.value));
              setPrediction(null);
            }}
          >
            {[250, 500, 1000].map((value) => (
              <option key={value} value={value}>
                {value} mL
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="quantitative-ledger">
        <div>
          <span>{en ? '1 · Grams → moles' : '1 · 克数 → mol'}</span>
          <strong>{moles.toFixed(3)} mol</strong>
          <p>n = {mass} ÷ 180</p>
        </div>
        <div>
          <span>{en ? '2 · Millilitres → litres' : '2 · mL → L'}</span>
          <strong>{litres.toFixed(3)} L</strong>
          <p>V = {volume} ÷ 1000</p>
        </div>
        <div>
          <span>{en ? '3 · Moles per litre' : '3 · 每升的 mol 数'}</span>
          <strong>{concentration.toFixed(3)} mol/L</strong>
          <p>
            c = {moles.toFixed(3)} ÷ {litres.toFixed(3)}
          </p>
        </div>
      </div>
      <p className="quantitative-prompt">
        {en
          ? `Add only water to reach ${volume * 2} mL. How will concentration change? Choose to reveal.`
          : `只加水，把整份溶液稀释至 ${volume * 2} mL。浓度怎样变？选择后立即揭晓。`}
      </p>
      <div className="quantitative-choices">
        {predictions.map((label, index) => (
          <button
            type="button"
            key={label}
            aria-pressed={prediction === index}
            onClick={() => setPrediction(index)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="reset"
          onClick={() => {
            setMass(18);
            setVolume(500);
            setPrediction(null);
          }}
        >
          {en ? 'Reset recipe' : '恢复原配方'}
        </button>
      </div>
      <div className="molar-vessel-pair">
        <SolutionVessel
          dots={(mass / 9) * 6}
          diluted={false}
          label={`${en ? 'Before' : '稀释前'} · ${volume} mL`}
        />
        {revealed ? (
          <SolutionVessel
            dots={(mass / 9) * 6}
            diluted
            label={`${en ? 'After' : '稀释后'} · ${volume * 2} mL`}
          />
        ) : (
          <div className="quantitative-waiting">
            {en ? 'Your prediction comes first' : '先留下你的预测'}
            <span>
              {en
                ? 'Same solute, more water. What changes?'
                : '溶质不变，水更多。什么变了？'}
            </span>
          </div>
        )}
      </div>
      <p className="quantitative-note">
        {en
          ? 'Purple dots represent glucose portions, not individual molecules. Each pair uses the same scale; select a new recipe to restart.'
          : '紫点代表葡萄糖的示意份数，不是逐个分子。每组前后使用相同尺度；换配方可重新预测。'}
      </p>
      {revealed && (
        <div className="quantitative-feedback" role="status">
          <strong>
            {prediction === 0
              ? en
                ? 'Correct · Explanation: '
                : '判断正确 · 解析：'
              : en
                ? 'Try the ratio again · Explanation: '
                : '再看看比值 · 解析：'}
          </strong>
          {en
            ? `Solute stays at ${moles.toFixed(3)} mol. c = ${moles.toFixed(3)} ÷ ${(litres * 2).toFixed(3)} = ${(concentration / 2).toFixed(3)} mol/L: half the original. The same dots now occupy twice the volume.`
            : `溶质仍是 ${moles.toFixed(3)} mol。c = ${moles.toFixed(3)} ÷ ${(litres * 2).toFixed(3)} = ${(concentration / 2).toFixed(3)} mol/L，是原来的一半。同样的紫点现在分散在两倍体积里。`}
        </div>
      )}
    </div>
  );
}

const titrationRecords = [
  { name: 'A', initial: 1.5, final: 14 },
  { name: 'B', initial: 2, final: 22 },
  { name: 'C', initial: 3, final: 33 },
] as const;

export function TitrationCalculationLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [recordIndex, setRecordIndex] = useState(1);
  const [answer, setAnswer] = useState<number | null>(null);
  const record = titrationRecords[recordIndex] ?? titrationRecords[1];
  const delivered = record.final - record.initial;
  const baseConcentration = 0.1;
  const sampleVolume = 0.025;
  const moles = baseConcentration * (delivered / 1000);
  const acidConcentration = moles / sampleVolume;
  const choices = [
    { value: acidConcentration / 2, kind: 'ratio' },
    { value: acidConcentration, kind: 'correct' },
    { value: acidConcentration * 1000, kind: 'units' },
  ];
  // Vary answer position between records so the calculation, not position, wins.
  const options = [
    ...choices.slice(recordIndex),
    ...choices.slice(0, recordIndex),
  ];
  const selected = answer === null ? undefined : options[answer];
  const revealed = answer !== null;

  return (
    <div className="quantitative-lab">
      <p className="quantitative-prompt">
        {en
          ? 'Ideal records: three different HCl samples, each 25.0 mL. Known NaOH: 0.100 mol/L. The recorded endpoint is assumed to be exact neutralisation.'
          : '理想记录：三份不同浓度的 HCl 样品，各取 25.0 mL。已知 NaOH：0.100 mol/L。假设记录的终点恰好是完全中和点。'}
      </p>
      <div
        className="quantitative-choices"
        aria-label={en ? 'Sample records' : '样品记录'}
      >
        {titrationRecords.map((item, index) => (
          <button
            type="button"
            key={item.name}
            aria-pressed={recordIndex === index}
            onClick={() => {
              setRecordIndex(index);
              setAnswer(null);
            }}
          >
            {en ? 'Record' : '记录'} {item.name}
          </button>
        ))}
      </div>
      <div className="titration-record">
        <div className="titration-scale" aria-hidden="true">
          <span>{record.initial.toFixed(2)}</span>
          <i />
          <span>{record.final.toFixed(2)}</span>
          <b>mL ↓</b>
        </div>
        <div>
          <p>
            {en
              ? 'Burette readings (scale increases downwards)'
              : '滴定管读数（刻度向下增大）'}
          </p>
          <strong>
            {record.initial.toFixed(2)} → {record.final.toFixed(2)} mL
          </strong>
          <p>
            {en
              ? 'Delivered volume = final − initial'
              : '送出体积 = 末读数 − 初读数'}
          </p>
          <strong>
            {delivered.toFixed(2)} mL = {(delivered / 1000).toFixed(4)} L
          </strong>
        </div>
      </div>
      <p className="quantitative-equation">
        HCl + NaOH → NaCl + H₂O <span>HCl ∶ NaOH = 1 ∶ 1</span>
      </p>
      <p className="quantitative-prompt">
        {en
          ? 'First compare the volumes: would this acid be more or less concentrated than the base? Then select its original concentration.'
          : '先比较体积：这份酸会比碱更浓还是更稀？再选择原盐酸浓度。'}
      </p>
      <div className="quantitative-choices">
        {options.map(({ value }, index) => (
          <button
            type="button"
            key={index}
            aria-pressed={answer === index}
            onClick={() => setAnswer(index)}
          >
            {value.toFixed(value < 1 ? 4 : 1)} mol/L
          </button>
        ))}
      </div>
      {revealed && (
        <>
          <div className="quantitative-feedback" role="status">
            <strong>
              {selected?.kind === 'correct'
                ? en
                  ? 'Correct · Explanation: '
                  : '判断正确 · 解析：'
                : en
                  ? 'Not quite · Explanation: '
                  : '还差一步 · 解析：'}
            </strong>
            {selected?.kind === 'units'
              ? en
                ? 'Using mL as L makes the result 1000 times too large. Convert first. '
                : '把 mL 当成 L，会把结果放大 1000 倍。先换单位。'
              : selected?.kind === 'ratio'
                ? en
                  ? 'The ratio here is 1:1: do not halve the acid moles. '
                  : '这里是 1∶1 配对，不需要把酸的 mol 数再除以 2。'
                : en
                  ? 'Use the 1:1 ratio, then return to the original acid sample volume. '
                  : '按 1∶1 换算，再回到原酸样品的体积。'}
            {en
              ? `The original HCl concentration is ${acidConcentration.toFixed(4)} mol/L.`
              : `原盐酸浓度是 ${acidConcentration.toFixed(4)} mol/L。`}
          </div>
          <div className="quantitative-ledger">
            <div>
              <span>{en ? '1 · Known base moles' : '1 · 已知碱的 mol 数'}</span>
              <strong>{moles.toFixed(5)} mol</strong>
              <p>n = 0.100 × {(delivered / 1000).toFixed(4)}</p>
            </div>
            <div>
              <span>{en ? '2 · Reaction bridge' : '2 · 反应比例的桥梁'}</span>
              <strong>{moles.toFixed(5)} mol HCl</strong>
              <p>1 mol HCl ↔ 1 mol NaOH</p>
            </div>
            <div>
              <span>
                {en ? '3 · Original acid concentration' : '3 · 原酸样品浓度'}
              </span>
              <strong>{acidConcentration.toFixed(4)} mol/L</strong>
              <p>c = {moles.toFixed(5)} ÷ 0.0250</p>
            </div>
          </div>
          <p className="quantitative-note">
            {en
              ? `Same 25.0 mL sample size: ${delivered < 25 ? 'less' : 'more'} than 25.0 mL of base means the acid is ${delivered < 25 ? 'less' : 'more'} concentrated than 0.100 mol/L. This comparison relies on the 1:1 ratio.`
              : `同样取 25.0 mL 酸：所需碱${delivered < 25 ? '少于' : '多于'} 25.0 mL，说明酸浓度${delivered < 25 ? '低于' : '高于'} 0.100 mol/L。这个比较以 1∶1 的反应比例为前提。`}
          </p>
        </>
      )}
    </div>
  );
}
