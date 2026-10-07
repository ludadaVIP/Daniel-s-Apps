import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import {
  compositionSamples,
  empiricalFromMasses,
  hydrateLedger,
  hydrateRecords,
  molecularFromEmpirical,
} from './composition';
import './CompositionLabs.css';

export function EmpiricalFormulaLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [sampleIndex, setSampleIndex] = useState(0);
  const [ruler, setRuler] = useState<'mass' | 'moles'>('mass');
  const [prediction, setPrediction] = useState<number | null>(null);
  const sample = compositionSamples[sampleIndex]!;
  const empirical = empiricalFromMasses(sample.elements)!;
  const molecular =
    sample.molarMass === null
      ? null
      : molecularFromEmpirical(sample.elements, empirical, sample.molarMass);
  const values = sample.elements.map((element, i) =>
    ruler === 'mass' ? element.massG : empirical.moles[i]!,
  );
  const maximum = Math.max(...values);
  const names = en
    ? ['A · C, H and O', 'B · Another C/H/O sample', 'C · Iron oxide']
    : ['A · 碳、氢、氧样品', 'B · 另一份碳氢氧样品', 'C · 铁的氧化物'];
  return (
    <div className="quantitative-lab composition-lab">
      <div className="quantitative-choices">
        {names.map((name, i) => (
          <button
            type="button"
            key={name}
            aria-pressed={sampleIndex === i}
            onClick={() => {
              setSampleIndex(i);
              setPrediction(null);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="quantitative-note">
        {en
          ? 'Authored pure-sample records, with rounded atomic masses. These are element masses within a compound—not ingredients to mix.'
          : '教学用纯物质组成记录，原子量取近似值。下列是化合物内部各元素的质量，不是让你把这些原料混在一起。'}
      </p>
      <div className="quantitative-choices">
        <button
          type="button"
          aria-pressed={ruler === 'mass'}
          onClick={() => setRuler('mass')}
        >
          {en ? 'View grams' : '用克数看'}
        </button>
        <button
          type="button"
          aria-pressed={ruler === 'moles'}
          onClick={() => setRuler('moles')}
        >
          {en ? 'View moles' : '换成摩尔看'}
        </button>
      </div>
      <div
        className="composition-bars"
        role="img"
        aria-label={sample.elements
          .map(
            (e, i) =>
              `${e.symbol}: ${values[i]!.toFixed(3)} ${ruler === 'mass' ? 'g' : 'mol'}`,
          )
          .join('; ')}
      >
        <strong>
          {ruler === 'mass'
            ? en
              ? 'Mass is not atom count'
              : '质量不等于原子个数'
            : en
              ? 'Moles compare atom counts'
              : '摩尔数对应原子数量比例'}
        </strong>
        {sample.elements.map((e, i) => (
          <div className="composition-bar-row" key={e.symbol}>
            <b>{e.symbol}</b>
            <div className="composition-bar-track" aria-hidden="true">
              <span style={{ width: `${(values[i]! / maximum) * 100}%` }} />
            </div>
            <span>
              {values[i]!.toFixed(ruler === 'mass' ? 1 : 3)}{' '}
              {ruler === 'mass' ? 'g' : 'mol'}
            </span>
          </div>
        ))}
        <span>
          {en
            ? 'Bar lengths use one shared scale within the selected view. Switching units changes the scale, not the sample.'
            : '同一视图的条长使用共同标尺；换单位会换标尺，不会改变样品。'}
        </span>
      </div>
      <p>
        {en
          ? 'Choose the simplest whole-number atom ratio: which empirical formula fits?'
          : '选最简单的整数原子比例：这份样品的最简式是哪一个？'}
      </p>
      <div className="quantitative-choices">
        {sample.choices.map((choice, i) => (
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
              {prediction === sample.correct
                ? en
                  ? 'Correct. '
                  : '判断正确。'
                : en
                  ? 'Check the atom ratio again. '
                  : '再检查原子比例。'}
            </strong>
            {en ? 'Explanation: ' : '解析：'}
            {en
              ? `Divide each mass by its own molar mass, then divide every mole amount by the smallest. The ratio ${empirical.normalised.map((n) => n.toFixed(2)).join(' : ')} ${empirical.multiplier === 1 ? 'is already whole-number' : `needs every term multiplied by ${empirical.multiplier}`}, giving ${empirical.formula}. Mass numbers are not subscripts.`
              : `各元素质量先除以各自的摩尔质量，再一起除以最小摩尔数。比例为 ${empirical.normalised.map((n) => n.toFixed(2)).join('∶')}，${empirical.multiplier === 1 ? '已经是整数比' : `全部乘 ${empirical.multiplier} 才成为整数比`}，得到 ${empirical.formula}。质量数字不能直接抄成下标。`}
          </div>
          <div className="composition-mole-cards">
            {sample.elements.map((e, i) => (
              <div key={e.symbol}>
                <strong>{e.symbol}</strong>
                <span>
                  {e.massG} g ÷ {e.atomicMass} g/mol
                </span>
                <b>= {empirical.moles[i]!.toFixed(3)} mol</b>
                <span>
                  {en ? 'Divide by smallest →' : '除以最小值 →'}{' '}
                  {empirical.normalised[i]!.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          {molecular && (
            <details>
              <summary>
                {en
                  ? 'Extra clue: independently measured molar mass'
                  : '再给一条独立证据：测得的摩尔质量'}
              </summary>
              <p>
                {en
                  ? `Empirical mass basis: ${empirical.formulaMass} g/mol. Independent molecular molar mass: ${sample.molarMass} g/mol. The multiplier is ${sample.molarMass} ÷ ${empirical.formulaMass} = ${molecular.multiplier}. Multiply every subscript: ${molecular.formula}. This still does not uniquely identify the substance or its structure.`
                  : `最简式的质量基准为 ${empirical.formulaMass} g/mol，独立测得分子摩尔质量 ${sample.molarMass} g/mol。倍数 = ${sample.molarMass}÷${empirical.formulaMass} = ${molecular.multiplier}，所有下标一起倍乘，得到分子式 ${molecular.formula}。它仍不能唯一确定物质身份或连接结构。`}
              </p>
            </details>
          )}
          {sample.molarMass === null && (
            <p className="quantitative-note">
              {en
                ? 'Iron oxide is an ionic solid. Fe₂O₃ describes the ion/atom ratio in its extended structure; do not invent a discrete Fe₂O₃ molecule or apply a molecular-mass multiplier.'
                : '铁的氧化物是离子固体。Fe₂O₃ 表示其延伸结构中的组成比例，不要虚构独立的 Fe₂O₃ 小分子，也不套用分子摩尔质量倍数。'}
            </p>
          )}
        </>
      )}
      <p className="quantitative-note">
        {en
          ? 'For mass percentages, imagine a 100 g sample first. Small measurement rounding is allowed; a ratio far from small whole numbers needs investigation, not forced rounding.'
          : '如果给的是质量百分数，可先假设取 100 g 样品。小测量误差可近似处理；若远离小整数比，应检查数据，不能强行四舍五入。'}
      </p>
    </div>
  );
}

export function HydrateEvidenceLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [recordIndex, setRecordIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const record = hydrateRecords[recordIndex]!;
  const data = hydrateLedger(record, stage);
  const showRatio = data.ready && prediction !== null;
  const hydrateNumber = showRatio ? Math.round(data.ratio!) : 'x';
  const correct = data.knownSolidLoss ? 2 : data.ready ? 0 : 1;
  const names = en
    ? ['A · Intact CuSO₄ record', 'B · Incident record', 'C · Try MgSO₄']
    : ['A · 完整硫酸铜记录', 'B · 有现场异常的记录', 'C · 换成硫酸镁'];
  const choices = en
    ? [
        'Enough evidence to calculate x',
        'Need another reading',
        'Known loss invalidates this calculation',
      ]
    : ['证据足够，可计算 x', '还需要重复记录', '有已知损失，不能可靠求 x'];
  return (
    <div className="quantitative-lab composition-lab">
      <div className="quantitative-choices">
        {names.map((name, i) => (
          <button
            type="button"
            key={name}
            aria-pressed={recordIndex === i}
            onClick={() => {
              setRecordIndex(i);
              setStage(0);
              setPrediction(null);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="quantitative-note">
        {en
          ? 'Authored virtual cooled-weighing records, not a heating procedure. Copper salts are not for home experiments.'
          : '教学用虚拟冷却后称量记录，不是加热操作教程；不要在家使用铜盐做实验。'}
      </p>
      <div
        className="composition-hydrate"
        role="img"
        aria-label={
          en
            ? `Composition ratio sketch: ${record.salt} to water is one to ${hydrateNumber}. This is not a molecular or coordination structure.`
            : `组成比例示意：${record.salt} 与水为一比 ${hydrateNumber}。这不是分子或配位结构图。`
        }
      >
        <strong>
          {record.salt} · {hydrateNumber}H₂O
        </strong>
        <span>
          {en
            ? 'Water belongs to the crystal’s composition—not a surface puddle.'
            : '水属于晶体的组成，不是表面的一滩水。'}
        </span>
        <span>
          {en
            ? 'Ratio sketch only; an ionic crystal is not a collection of isolated little molecules.'
            : '只表示组成比例；离子晶体不是许多独立小分子的集合。'}
        </span>
      </div>
      <div className="composition-reading">
        <span>{en ? 'Empty container (tare)' : '空容器（皮重）'}</span>
        <strong>{record.tareG.toFixed(2)} g</strong>
      </div>
      <ol className="composition-readings">
        {record.totalsG.map((total, i) => (
          <li key={i} aria-current={stage === i ? 'step' : undefined}>
            <span>
              {i === 0
                ? en
                  ? 'Before water removal'
                  : '脱水前'
                : en
                  ? `Cooled reading ${i}`
                  : `冷却后第 ${i} 次称量`}
            </span>
            <strong>{i <= stage ? `${total.toFixed(2)} g` : '—'}</strong>
          </li>
        ))}
      </ol>
      <div className="quantitative-choices">
        <button
          type="button"
          disabled={stage === 3}
          onClick={() => {
            setStage((value) => value + 1);
            setPrediction(null);
          }}
        >
          {en ? 'Read next recorded weighing' : '读取下一次称量记录'}
        </button>
        <button
          type="button"
          onClick={() => {
            setStage(0);
            setPrediction(null);
          }}
        >
          {en ? 'Restart this record' : '重读这组记录'}
        </button>
      </div>
      {data.knownSolidLoss && (
        <p className="composition-incident">
          {en
            ? 'Incident note: some solid was spilled before reading 2. The missing mass is not all water.'
            : '现场记录：第 2 次称量前有固体洒失。减少的质量不全是水。'}
        </p>
      )}
      <div className="composition-mass-ledger">
        <div>
          <span>
            {en ? 'Initial sample, excluding container' : '原样品，不含容器'}
          </span>
          <strong>{data.initialSampleG.toFixed(2)} g</strong>
          <small>
            {record.totalsG[0]!.toFixed(2)} − {record.tareG.toFixed(2)}
          </small>
        </div>
        <div>
          <span>
            {en ? 'Current sample, excluding container' : '当前样品，不含容器'}
          </span>
          <strong>{data.remainingSampleG.toFixed(2)} g</strong>
          <small>
            {record.totalsG[stage]!.toFixed(2)} − {record.tareG.toFixed(2)}
          </small>
        </div>
        <div>
          <span>{en ? 'Mass decrease so far' : '目前减少的质量'}</span>
          <strong>{data.lostG.toFixed(2)} g</strong>
          <small>
            {en ? 'Not automatically all water' : '不能自动全算作水'}
          </small>
        </div>
      </div>
      <p>
        {en
          ? `Can these records now support a value of x in ${record.salt}·xH₂O?`
          : `目前这些记录，能可靠确定 ${record.salt}·xH₂O 中的 x 吗？`}
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
        <div className="quantitative-feedback" role="status">
          <strong>
            {prediction === correct
              ? en
                ? 'Good evidence judgement. '
                : '证据判断正确。'
              : en
                ? 'Recheck the evidence. '
                : '再核对证据。'}
          </strong>
          {en ? 'Explanation: ' : '解析：'}
          {data.knownSolidLoss
            ? en
              ? 'Even equal final readings cannot repair a spilled sample. Lost solid would be wrongly counted as water, and the remaining salt amount is also wrong; do not force the ratio to an integer.'
              : '最后两次读数相同，也不能补回洒失的样品。丢失的固体会被误算成水，剩余盐的摩尔数也受影响，不能硬把比值凑成整数。'
            : !data.ready
              ? stage === 0
                ? en
                  ? 'Only the initial reading is visible: neither residue mass nor constant mass has been established. Read the next cooled weighing first.'
                  : '当前只有脱水前读数：还不知道残留质量，更没有恒重证据。先读取下一次冷却后称量。'
                : en
                  ? 'A lower reading does not show that dehydration is complete. Read the next cooled weighing and look for repeated constant mass, alongside evidence of no spillage or decomposition.'
                  : '读数下降不能证明脱水完成。继续看冷却后的重复称量，检查是否恒重，同时确认没有飞溅、分解等其他损失。'
              : en
                ? `The last two readings are both ${record.totalsG[stage]!.toFixed(2)} g. This intact record stipulates anhydrous ${record.salt} without decomposition or solid loss. Water: ${data.lostG.toFixed(2)}÷18 = ${data.waterMol!.toFixed(3)} mol. Salt: ${data.remainingSampleG.toFixed(2)}÷${record.saltMolarMass} = ${data.saltMol!.toFixed(4)} mol. Water/salt = ${Math.round(data.ratio!)}, giving ${record.salt}·${Math.round(data.ratio!)}H₂O.`
                : `最后两次读数均为 ${record.totalsG[stage]!.toFixed(2)} g；完整记录还给定残留为无水 ${record.salt}，未分解、未洒失。水：${data.lostG.toFixed(2)}÷18 = ${data.waterMol!.toFixed(3)} mol；盐：${data.remainingSampleG.toFixed(2)}÷${record.saltMolarMass} = ${data.saltMol!.toFixed(4)} mol。水∶盐 = ${Math.round(data.ratio!)}∶1，得到 ${record.salt}·${Math.round(data.ratio!)}H₂O。`}
        </div>
      )}
      {data.ready && prediction !== null && (
        <div className="composition-result">
          <strong>
            n(H₂O) / n({record.salt}) = {data.ratio!.toFixed(2)}
          </strong>
          <span>
            {en
              ? `The ${hydrateNumber} is a water-to-salt mole ratio, not grams of water per gram of salt.`
              : `${hydrateNumber} 表示水与盐的摩尔组成比例，不是每克盐配 ${hydrateNumber} g 水。`}
          </span>
        </div>
      )}
      <details>
        <summary>
          {en
            ? 'Does constant mass alone prove everything?'
            : '恒重能单独证明所有条件吗？'}
        </summary>
        <p>
          {en
            ? `No. Assume a pure starting hydrate, complete water removal, the named anhydrous salt as residue, and no other loss. Constant cooled readings support an endpoint but do not prove its identity. Here M(${record.salt}) = ${record.saltMolarMass} g/mol and M(H₂O) = 18 g/mol, using rounded atomic masses.`
            : `不能。还假设原样品纯、水已移出、残留是指定无水盐，且无其他损失。冷却后恒重支持到达终点，却不能单独证明终点身份。本组采用近似原子量，M(${record.salt}) = ${record.saltMolarMass} g/mol，M(H₂O) = 18 g/mol。`}
        </p>
      </details>
    </div>
  );
}
