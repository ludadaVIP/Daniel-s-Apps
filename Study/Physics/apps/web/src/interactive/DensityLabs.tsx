import { useState, type ReactNode } from 'react';
import { B } from '../ui';
import {
  LabOptions as Options,
  LabMetric as Metric,
  useComparisons,
  type LabProps as Props,
} from './LabControls';
import { useAnimation } from './useSimulation';
import {
  densitySample,
  regularDensity,
  irregularDensity,
  densityFloat,
  type DensitySample,
  type ImmersionCase,
} from './densityModels';
function Shell({
  mode,
  title,
  note,
  children,
}: Props & {
  title: [string, string];
  note: [string, string];
  children: ReactNode;
}) {
  return (
    <div className="phy-lab phy-forces-lab phy-density-lab">
      <div className="phy-lab-toolbar">
        <span className="phy-lab-label">DENSITY / MATERIAL DETECTIVE</span>
        <B zh={title[0]} en={title[1]} mode={mode} />
      </div>
      {children}
      <p className="phy-model-note">
        <B zh={note[0]} en={note[1]} mode={mode} />
      </p>
    </div>
  );
}
function Progress({
  mode,
  count,
  total,
  zh,
  en,
}: Props & { count: number; total: number; zh: string; en: string }) {
  return (
    <p className="phy-force-record" role="status">
      <B
        zh={`已比较 ${count}/${total}：${zh}`}
        en={`Compared ${count}/${total}: ${en}`}
        mode={mode}
      />
    </p>
  );
}
function Block({
  long,
  color = '#babcc8',
  dimensions = false,
}: {
  long: boolean;
  color?: string;
  dimensions?: boolean;
}) {
  const w = long ? 220 : 110,
    x = 340 - w / 2;
  return (
    <g>
      <path d={`M${x} 106l34-26h${w}l-34 26Z`} fill={color} opacity=".65" />
      <path d={`M${x + w} 106l34-26v80l-34 26Z`} fill={color} opacity=".85" />
      <rect x={x} y="106" width={w} height="80" fill={color} />
      <path
        d={`M${x} 106h${w}v80H${x}Z`}
        fill="none"
        stroke="#9d88ad"
        strokeWidth="1"
      />
      {dimensions ? (
        <>
          <path
            d={`M${x} 204v9m0-4h${w}m0-5v9M${x - 18} 106h-9m4 0v80m-4 0h9`}
            stroke="#b09abb"
            fill="none"
          />
          <text
            x="340"
            y="240"
            textAnchor="middle"
            fill="#826192"
            fontSize="18"
          >
            {long ? 10 : 5} cm
          </text>
          <text
            x={x - 36}
            y="150"
            textAnchor="end"
            fill="#826192"
            fontSize="18"
          >
            2 cm
          </text>
          <text x={x + w + 48} y="166" fill="#826192" fontSize="18">
            2 cm
          </text>
        </>
      ) : (
        <text x="340" y="233" textAnchor="middle" fill="#826192" fontSize="20">
          V = {long ? 40 : 20} cm³
        </text>
      )}
    </g>
  );
}
const sampleNames: [string, string][] = [
  ['木头模型', 'Wood model'],
  ['铝模型', 'Aluminium model'],
  ['钢模型', 'Steel model'],
];
const sampleIds: DensitySample[] = ['wood', 'aluminium', 'steel'];
export function DensityCompareLab({ mode, onExplore }: Props) {
  const [material, setMaterial] = useState(0),
    [long, setLong] = useState(0),
    [records, setRecords] = useState<
      { sample: number; volume: number; mass: number; density: number }[]
    >([]);
  const state = densitySample(sampleIds[material]!, long ? 40 : 20),
    cases = useComparisons(['0-0', '1-0', '1-1'], onExplore);
  return (
    <Shell
      mode={mode}
      title={[
        '同体积比较材料；同材料比较大小',
        'Match volumes, then resize one material',
      ]}
      note={[
        '规定的均匀实心样品：木头0.6、铝2.7、钢7.8 g/cm³，质量m=ρV，体积20或40 cm³。图中加倍长度、其余两边相同，体积翻倍。颜色与物性为教学样品，不代表所有实际材料；不模拟空洞、吸水、温度变化或仪器误差。',
        'Prescribed uniform solid samples: wood 0.6, aluminium 2.7, steel 7.8 g/cm³; m=ρV, with 20/40 cm³. Doubling length with the other edges unchanged doubles volume. Colours and properties represent teaching samples, not every actual material. Cavities, absorption, temperature changes and instrument errors are omitted.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['教学样品', 'Teaching sample']}
          values={sampleNames.map(([zh, en], id) => ({ id, zh, en }))}
          value={material}
          set={setMaterial}
        />
        <Options
          mode={mode}
          name={['体积', 'Volume']}
          values={[
            { id: 0, zh: '20 cm³', en: '20 cm³' },
            { id: 1, zh: '40 cm³', en: '40 cm³' },
          ]}
          value={long}
          set={setLong}
        />
      </div>
      <svg
        viewBox="80 0 520 290"
        className="phy-simulation phy-density-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Solid sample volume and model mass'
            : '实心样品体积与规定质量'
        }
      >
        <text x="340" y="39" textAnchor="middle" fontSize="22" fill="#826192">
          m = {state.mass.toFixed(1)} g
        </text>
        <Block long={Boolean(long)} color={state.color} />
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          onClick={() => {
            cases.record(`${material}-${long}`);
            setRecords((old) =>
              [
                ...old.filter(
                  (r) => r.sample !== material || r.volume !== state.volume,
                ),
                { sample: material, ...state },
              ].slice(-6),
            );
          }}
        >
          <B zh="记录这块样品" en="Record this sample" mode={mode} />
        </button>
      </div>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['质量', 'Mass']}>
          {state.mass.toFixed(1)} g
        </Metric>
        <Metric mode={mode} title={['体积', 'Volume']}>
          {state.volume} cm³
        </Metric>
        <Metric mode={mode} title={['每cm³的质量', 'Mass per cm³']}>
          {state.density.toFixed(1)} g/cm³
        </Metric>
      </div>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="教学样品对照：记录体积再比较质量"
                en="Teaching sample comparisons: retain volume alongside mass"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {(
                  [
                    ['样品', 'Sample'],
                    ['体积', 'Volume'],
                    ['质量', 'Mass'],
                    ['密度', 'Density'],
                  ] as const
                ).map(([zh, en]) => (
                  <th scope="col" key={en}>
                    <B zh={zh} en={en} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={`${r.sample}-${r.volume}`}>
                  <th scope="row">
                    <B
                      zh={sampleNames[r.sample]![0]}
                      en={sampleNames[r.sample]![1]}
                      mode={mode}
                    />
                  </th>
                  <td>{r.volume} cm³</td>
                  <td>{r.mass.toFixed(1)} g</td>
                  <td>{r.density.toFixed(1)} g/cm³</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Progress
        mode={mode}
        count={cases.count}
        total={3}
        zh="20 cm³木头、20 cm³铝、40 cm³铝。"
        en="20 cm³ wood, 20 cm³ aluminium, 40 cm³ aluminium."
      />
    </Shell>
  );
}
export function DensityBlockLab({ mode, onExplore }: Props) {
  const [long, setLong] = useState(0),
    [si, setSI] = useState(0),
    [records, setRecords] = useState<{ long: number; si: number }[]>([]),
    state = regularDensity(Boolean(long), Boolean(si)),
    cases = useComparisons(['0-0', '1-0', 'si'], onExplore);
  const massText = state.mass.toFixed(si ? 3 : 1),
    volumeText = state.volume.toFixed(si ? 6 : 0),
    rhoText = state.density.toFixed(si ? 0 : 1);
  return (
    <Shell
      mode={mode}
      title={['先量m与V，再比较m/V', 'Measure m and V, then compare m/V']}
      note={[
        '规则均匀铝样品模型，ρ规定为2.7 g/cm³，m由体积计算，不是儿童实测数据。长方体尺寸为5/10×2×2 cm；体积由三边相乘。SI视图转换g→kg与cm³→m³再求比值，1 g/cm³=1000 kg/m³。图像不代表真实尺的精度，不模拟温度、空洞或误差。',
        'Prescribed uniform aluminium sample at 2.7 g/cm³; model mass is calculated from volume, not a learner’s measurement. Dimensions are 5/10×2×2 cm; multiply the edges. SI view converts both g→kg and cm³→m³ before taking the ratio; 1 g/cm³=1000 kg/m³. The drawing does not claim ruler precision; temperature, cavities and errors are omitted.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['同材料样品', 'Same-material sample']}
          values={[
            { id: 0, zh: '短块5 cm', en: 'Short: 5 cm' },
            { id: 1, zh: '长块10 cm', en: 'Long: 10 cm' },
          ]}
          value={long}
          set={setLong}
        />
        <Options
          mode={mode}
          name={['计算单位', 'Calculation units']}
          values={[
            { id: 0, zh: 'g与cm³', en: 'g & cm³' },
            { id: 1, zh: 'kg与m³', en: 'kg & m³' },
          ]}
          value={si}
          set={setSI}
        />
      </div>
      <svg
        viewBox="80 0 520 290"
        className="phy-simulation phy-density-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Rectangular block edges and original model mass'
            : '长方体三边与原始模型质量'
        }
      >
        <text x="340" y="37" textAnchor="middle" fill="#826192" fontSize="22">
          m = {state.massG.toFixed(1)} g
        </text>
        <Block long={Boolean(long)} dimensions />
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          onClick={() => {
            cases.record(si ? 'si' : `${long}-0`);
            setRecords((old) => [
              ...old.filter((r) => r.long !== long || r.si !== si),
              { long, si },
            ]);
          }}
        >
          <B zh="记录计算对照" en="Record calculation" mode={mode} />
        </button>
      </div>
      <div className="phy-skill-readouts">
        <Metric
          mode={mode}
          title={['质量m（计算单位）', 'Mass m (calculation units)']}
        >
          {massText} {state.massUnit}
        </Metric>
        <Metric
          mode={mode}
          title={['体积V（计算单位）', 'Volume V (calculation units)']}
        >
          {volumeText} {state.volumeUnit}
        </Metric>
        <Metric mode={mode} title={['密度ρ', 'Density ρ']}>
          {rhoText} {state.densityUnit}
        </Metric>
      </div>
      <p className="phy-density-equation">
        ρ = {massText} {state.massUnit} ÷ {volumeText} {state.volumeUnit} ={' '}
        {rhoText} {state.densityUnit}
      </p>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="同材料、不同大小或单位，保留各次计算"
                en="Same material: retain calculations across sizes and units"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {(
                  [
                    ['原始长边', 'Original length'],
                    ['质量', 'Mass'],
                    ['体积', 'Volume'],
                    ['密度', 'Density'],
                  ] as const
                ).map(([zh, en]) => (
                  <th scope="col" key={en}>
                    <B zh={zh} en={en} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const m = regularDensity(Boolean(r.long), Boolean(r.si));
                return (
                  <tr key={`${r.long}-${r.si}`}>
                    <th scope="row">{r.long ? 10 : 5} cm</th>
                    <td>
                      {m.mass.toFixed(r.si ? 3 : 1)} {m.massUnit}
                    </td>
                    <td>
                      {m.volume.toFixed(r.si ? 6 : 0)} {m.volumeUnit}
                    </td>
                    <td>
                      {m.density.toFixed(r.si ? 0 : 1)} {m.densityUnit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Progress
        mode={mode}
        count={cases.count}
        total={3}
        zh="短块和长块的g/cm³，再记录一次SI换算。"
        en="short and long in g/cm³, then an SI-unit comparison."
      />
    </Shell>
  );
}
const immersionIds: ImmersionCase[] = ['partial', 'full', 'bubble'];
const immersionNames: [string, string][] = [
  ['部分浸没', 'Partly immersed'],
  ['全浸没无气泡', 'Full, no bubble'],
  ['全浸没带气泡', 'Full, with bubble'],
];
export function DensityDisplacementLab({ mode, onExplore }: Props) {
  const [condition, setCondition] = useState(0),
    [records, setRecords] = useState<number[]>([]),
    state = irregularDensity(immersionIds[condition]!),
    cases = useComparisons(['0', '1', '2'], onExplore),
    surface = 285 - state.after * 2.4,
    objectTop = condition === 0 ? 142 : 174;
  return (
    <Shell
      mode={mode}
      title={[
        '水位差，是不是整个物体的体积？',
        'Does displacement represent the whole object?',
      ]}
      note={[
        '规定样品干燥质量54 g、完整体积20 cm³，初水位40 mL。部分浸没排开12 mL；完全浸没排开20 mL；气泡情况另含4 mL附着空气体积。细线、溶解、吸水、溅水与量筒误差忽略。轮廓仅示意，不按三维体积几何绘制。图中表观密度只是m/水位差，只有满足完整浸没无气泡条件才代表本样品。',
        'Prescribed specimen: dry mass 54 g, full volume 20 cm³, initial water 40 mL. Partial immersion displaces 12 mL; full immersion 20 mL; an attached bubble adds 4 mL. Thread volume, dissolution, absorption, splashes and instrument error are omitted. Silhouette is schematic, not a 3D volume construction. Apparent density is mass/displacement and represents this specimen only for full bubble-free immersion.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['浸没条件', 'Immersion condition']}
          values={immersionNames.map(([zh, en], id) => ({ id, zh, en }))}
          value={condition}
          set={setCondition}
        />
      </div>
      <svg
        viewBox="80 0 520 325"
        className="phy-simulation phy-density-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Immersion condition changes cylinder displacement'
            : '浸没条件改变量筒排水读数'
        }
      >
        <path
          d="M238 47v238h204V47"
          stroke="#b29bc2"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="241"
          y={surface}
          width="198"
          height={282 - surface}
          fill="#c9dfe2"
          opacity=".72"
        />
        {[0, 20, 40, 60, 80].map((v) => (
          <g key={v}>
            <path d={`M238 ${285 - v * 2.4}h18`} stroke="#a0bcc1" />
            <text
              x="223"
              y={291 - v * 2.4}
              textAnchor="end"
              fill="#7f9399"
              fontSize="16"
            >
              {v} mL
            </text>
          </g>
        ))}
        <path
          d="M241 189h198"
          stroke="#bc9a6c"
          strokeDasharray="6 5"
          strokeWidth="2"
        />
        <path d={`M330 42V${objectTop}`} stroke="#a692b4" />
        <path
          d={`M300 ${objectTop + 5}l30-5 32 16 2 24-14 22-37 5-25-20 2-26Z`}
          fill="#b0a7bd"
          stroke="#9789a3"
        />
        {condition === 2 && (
          <circle
            cx="363"
            cy="171"
            r="17"
            fill="#faf7fd"
            opacity=".85"
            stroke="#a3c2c9"
            strokeWidth="2"
          />
        )}
        <path d={`M442 ${surface}h29`} stroke="#91b8bf" strokeWidth="2" />
        <text x="481" y={surface + 6} fill="#78959b" fontSize="18">
          {state.after} mL
        </text>
        <text x="340" y="315" textAnchor="middle" fill="#926f9d" fontSize="18">
          m = 54 g
        </text>
      </svg>
      <p className="phy-force-legend">
        <B
          zh="金色虚线：初始40 mL；右侧标记：末水位。"
          en="Gold dashed line: initial 40 mL; right marker: final reading."
          mode={mode}
        />
      </p>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          onClick={() => {
            cases.record(String(condition));
            setRecords((old) => [...new Set([...old, condition])]);
          }}
        >
          <B
            zh="记录这次条件与读数"
            en="Record condition and readings"
            mode={mode}
          />
        </button>
      </div>
      <div className="phy-skill-readouts">
        <Metric mode={mode} title={['质量保持相同', 'Same mass']}>
          {state.mass} g
        </Metric>
        <Metric mode={mode} title={['末读数−初读数', 'Final − initial']}>
          {state.apparentVolume} mL
        </Metric>
        <Metric
          mode={mode}
          title={['表观密度估算', 'Apparent density estimate']}
        >
          {state.apparentDensity.toFixed(2)} g/cm³
        </Metric>
      </div>
      <p className={`phy-density-condition ${state.valid ? 'valid' : ''}`}>
        <B
          zh={
            state.valid
              ? '这次条件满足：水位差可作完整物体体积20 cm³。'
              : condition === 0
                ? '尚未全部浸没：12 mL只代表浸入部分，不能用来除完整质量。'
                : '附着气泡也排水：24 mL多算了气泡，估算密度偏低。'
          }
          en={
            state.valid
              ? 'Valid condition: displacement represents the full 20 cm³ specimen.'
              : condition === 0
                ? 'Partly immersed: 12 mL describes only the immersed portion, not the whole mass’s volume.'
                : 'Attached air also displaces water: 24 mL overcounts volume and makes density too low.'
          }
          mode={mode}
        />
      </p>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="保留不合条件的读数，说明原因"
                en="Keep invalid-condition readings and explain why"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {(
                  [
                    ['条件', 'Condition'],
                    ['水位差', 'Change'],
                    ['表观估算', 'Estimate'],
                  ] as const
                ).map(([zh, en]) => (
                  <th scope="col" key={en}>
                    <B zh={zh} en={en} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((id) => {
                const r = irregularDensity(immersionIds[id]!);
                return (
                  <tr key={id}>
                    <th scope="row">
                      <B
                        zh={immersionNames[id]![0]}
                        en={immersionNames[id]![1]}
                        mode={mode}
                      />
                      <span className="phy-density-validity">
                        <B
                          zh={r.valid ? '可用于完整物体' : '条件未满足'}
                          en={
                            r.valid
                              ? 'Usable for whole object'
                              : 'Condition not met'
                          }
                          mode={mode}
                        />
                      </span>
                    </th>
                    <td>{r.apparentVolume} mL</td>
                    <td>{r.apparentDensity.toFixed(2)} g/cm³</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Progress
        mode={mode}
        count={cases.count}
        total={3}
        zh="部分浸没、全浸没无气泡、全浸没带气泡。"
        en="partial immersion, full without bubble, full with bubble."
      />
    </Shell>
  );
}
const floatDensities = [0.6, 1, 1.02];
const outcome = (rho: number, salt: boolean): [string, string] => {
  const state = densityFloat(rho, salt);
  return state.floats
    ? ['漂浮 · 部分浸入', 'Floating · partial immersion']
    : state.neutral
      ? ['悬浮 · 完全浸没', 'Neutral · fully immersed']
      : ['沉到底', 'Sunk to the bottom'];
};
export function DensityFloatLab({ mode, onExplore }: Props) {
  const [density, setDensity] = useState(0.6),
    [salt, setSalt] = useState(0),
    [records, setRecords] = useState<{ density: number; salt: number }[]>([]),
    state = densityFloat(density, Boolean(salt)),
    cases = useComparisons(['0.6-0', '1-0', '1.02-0', '1.02-1'], onExplore);
  const animation = useAnimation(1, () => {
    cases.record(`${density}-${salt}`);
    setRecords((old) => [
      ...old.filter((r) => r.density !== density || r.salt !== salt),
      { density, salt },
    ]);
  });
  const settled = state.floats
      ? 140 - 60 * (1 - state.submergedFraction)
      : state.neutral
        ? 180
        : 230,
    y = 72 + (settled - 72) * animation.time;
  return (
    <Shell
      mode={mode}
      title={['物体与液体一起比较', 'Compare the solid with its liquid']}
      note={[
        '静态浮沉模型复用排水平衡：样品均匀实心、V=20 cm³，不溶解、不吸水；淡水ρ=1.00、盐水ρ=1.05 g/cm³。忽略表面张力；密度相等时完全浸没可悬浮，图中深度仅示意，并不唯一。1秒动画只过渡到最终状态，不计算液体中的运动速度；沉到底后支持力未计算。木头/塑料仅指规定样品，并非所有材料。',
        'Static displacement-balance model: uniform solid, V=20 cm³, no dissolution or absorption. Fresh water 1.00, salt water 1.05 g/cm³; surface tension omitted. Equal density permits neutral suspension; shown depth is illustrative, not unique. The 1-second animation transitions to the final state without predicting fluid motion speed; bottom support is omitted. Wood/plastic labels are prescribed samples, not all materials.',
      ]}
    >
      <div className="phy-lab-controls">
        <Options
          mode={mode}
          name={['实心样品密度', 'Solid sample density']}
          values={floatDensities.map((id) => ({
            id,
            zh: `${id.toFixed(2)} g/cm³`,
            en: `${id.toFixed(2)} g/cm³`,
          }))}
          value={density}
          disabled={animation.running}
          set={(n) => {
            setDensity(n);
            animation.reset();
          }}
        />
        <Options
          mode={mode}
          name={['液体模型', 'Liquid model']}
          values={[
            { id: 0, zh: '淡水1.00', en: 'Fresh 1.00' },
            { id: 1, zh: '盐水1.05', en: 'Salt 1.05' },
          ]}
          value={salt}
          disabled={animation.running}
          set={(n) => {
            setSalt(n);
            animation.reset();
          }}
        />
      </div>
      <svg
        viewBox="80 0 520 340"
        className="phy-simulation phy-density-svg"
        role="img"
        aria-label={
          mode === 'en'
            ? 'A solid’s density compared with fresh or salt water'
            : '实心样品密度与淡水或盐水的对照'
        }
      >
        <path
          d="M190 116v174h300V116"
          stroke="#b39dc3"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="193"
          y="140"
          width="294"
          height="147"
          fill={salt ? '#bdd8de' : '#cfe1e4'}
          opacity=".85"
        />
        <path d="M193 140h294" stroke="#9ec3c9" strokeWidth="2" />
        <rect
          x="310"
          y={y}
          width="60"
          height="60"
          rx="3"
          fill={density === 0.6 ? '#d2b181' : '#bca8ce'}
        />
        <path d={`M310 ${y + 18}h60m-60 24h60`} stroke="#9b819d" opacity=".3" />
        <text x="340" y="35" textAnchor="middle" fill="#8b669b" fontSize="18">
          ρ{mode === 'en' ? ' solid' : '物'} = {density.toFixed(2)} g/cm³
        </text>
        <text x="340" y="326" textAnchor="middle" fill="#7d9ba1" fontSize="18">
          ρ{mode === 'en' ? ' liquid' : '液'} = {state.fluidDensity.toFixed(2)}{' '}
          g/cm³
        </text>
      </svg>
      <div className="phy-lab-controls">
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={animation.start}
        >
          <B
            zh={animation.running ? '观察状态…' : '放入模型液体'}
            en={animation.running ? 'Observing…' : 'Place in model liquid'}
            mode={mode}
          />
        </button>
      </div>
      <div className="phy-skill-readouts">
        <Metric
          mode={mode}
          title={['样品质量不因换液体改变', 'Mass unchanged by liquid choice']}
        >
          {state.mass.toFixed(1)} g
        </Metric>
        <Metric mode={mode} title={['样品体积', 'Sample volume']}>
          {state.volume} cm³
        </Metric>
        <Metric mode={mode} title={['最终状态', 'Final state']}>
          {animation.time === 1 ? (
            <B
              zh={outcome(density, Boolean(salt))[0]}
              en={outcome(density, Boolean(salt))[1]}
              mode={mode}
            />
          ) : (
            <B zh="等待完整放入" en="Complete the placement" mode={mode} />
          )}
        </Metric>
      </div>
      {animation.time === 1 && (
        <p className="phy-density-condition valid">
          <B
            zh={`浸入比例 ${(state.submergedFraction * 100).toFixed(1)}%；排开液体质量 ${state.displacedWaterMass.toFixed(2)} g。${state.floats || state.neutral ? '与样品质量相等，可平衡重力。' : '小于样品质量，单靠浮力不足以支撑。'}`}
            en={`Submerged fraction ${(state.submergedFraction * 100).toFixed(1)}%; displaced liquid mass ${state.displacedWaterMass.toFixed(2)} g. ${state.floats || state.neutral ? 'Matches sample mass, allowing balance.' : 'Less than sample mass; buoyancy alone is insufficient.'}`}
            mode={mode}
          />
        </p>
      )}
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B
                zh="记录物体密度和液体密度，再解释结果"
                en="Retain both densities before interpreting the outcome"
                mode={mode}
              />
            </caption>
            <thead>
              <tr>
                {(
                  [
                    ['物体密度', 'Solid density'],
                    ['液体密度', 'Liquid density'],
                    ['结果', 'Outcome'],
                  ] as const
                ).map(([zh, en]) => (
                  <th scope="col" key={en}>
                    <B zh={zh} en={en} mode={mode} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={`${r.density}-${r.salt}`}>
                  <th scope="row">{r.density.toFixed(2)} g/cm³</th>
                  <td>{r.salt ? '1.05' : '1.00'} g/cm³</td>
                  <td>
                    <B
                      zh={outcome(r.density, Boolean(r.salt))[0]}
                      en={outcome(r.density, Boolean(r.salt))[1]}
                      mode={mode}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Progress
        mode={mode}
        count={cases.count}
        total={4}
        zh="淡水中三种密度，再把1.02样品换到盐水。"
        en="three densities in fresh water, then the same 1.02 sample in salt water."
      />
    </Shell>
  );
}
