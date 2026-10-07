import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B, Text } from '../ui';
import { t } from '../content/schema';
import { useAnimation } from './useSimulation';
import {
  floatMaterials,
  floatingState,
  boatState,
  bounceParameters,
  bounceHeight,
  echoState,
  echoPosition,
} from './mysteryModels';
type Props = { mode: LanguageMode; onExplore?: () => void };
function Title({
  name,
  zh,
  en,
  mode,
}: {
  name: string;
  zh: string;
  en: string;
  mode: LanguageMode;
}) {
  return (
    <div className="phy-lab-toolbar">
      <span className="phy-lab-label">{name}</span>
      <B zh={zh} en={en} mode={mode} />
    </div>
  );
}
function Note({
  zh,
  en,
  mode,
}: {
  zh: string;
  en: string;
  mode: LanguageMode;
}) {
  return (
    <p className="phy-model-note">
      <B zh={zh} en={en} mode={mode} />
    </p>
  );
}
function Reading({
  zh,
  en,
  value,
  mode,
}: {
  zh: string;
  en: string;
  value: string;
  mode: LanguageMode;
}) {
  return (
    <div>
      <B zh={zh} en={en} mode={mode} />
      <strong>{value}</strong>
    </div>
  );
}
const materials = [
  { id: 'ice', name: t('冰块', 'Ice') },
  { id: 'wood', name: t('木块', 'Wood') },
  { id: 'rock', name: t('石块', 'Rock') },
  { id: 'plastic', name: t('塑料样块', 'Plastic sample') },
] as const;
export function FloatingLab({ mode, onExplore }: Props) {
  const [material, setMaterial] = useState<keyof typeof floatMaterials>('ice');
  const [salt, setSalt] = useState(false);
  const [done, setDone] = useState(false);
  const [records, setRecords] = useState<string[]>([]);
  const waterDensity = salt ? 1.025 : 1;
  const model = floatingState(floatMaterials[material].density, waterDensity);
  const animation = useAnimation(1.2, () => {
    setDone(true);
    const next = [...new Set([...records, `${material}:${salt}`])];
    setRecords(next);
    if (
      [false, true].some(
        (water) =>
          next.includes(`ice:${water}`) && next.includes(`rock:${water}`),
      )
    )
      onExplore?.();
  });
  const target = model.floats ? 105 - 72 * (1 - model.submergedFraction) : 238;
  const fraction = Math.min(1, animation.time / 1.2);
  const y = 16 + (target - 16) * (1 - (1 - fraction) ** 3);
  const reset = () => {
    animation.reset();
    setDone(false);
  };
  return (
    <div className="phy-lab">
      <Title
        name="12 / BENEATH THE SURFACE"
        zh="同样体积，不同质量"
        en="Same volume, different mass"
        mode={mode}
      />
      <div className="phy-mystery-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Material' : '材料'}
        >
          {materials.map((item) => (
            <button
              key={item.id}
              className={material === item.id ? 'selected' : ''}
              aria-pressed={material === item.id}
              disabled={animation.running}
              onClick={() => {
                setMaterial(item.id);
                reset();
              }}
            >
              <Text value={item.name} mode={mode} />
            </button>
          ))}
        </div>
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Water' : '水'}
        >
          {[false, true].map((v) => (
            <button
              key={String(v)}
              className={salt === v ? 'selected' : ''}
              aria-pressed={salt === v}
              disabled={animation.running}
              onClick={() => {
                setSalt(v);
                reset();
              }}
            >
              <B
                zh={v ? '海水' : '淡水'}
                en={v ? 'Seawater' : 'Fresh water'}
                mode={mode}
              />
            </button>
          ))}
        </div>
      </div>
      <svg
        viewBox="0 0 600 340"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Object settling in a water tank'
            : '物体在水槽中释放后的示意'
        }
      >
        <rect x="40" y="105" width="520" height="205" fill="#dbeef1" rx="8" />
        <path
          d="M40 85v225h520V85"
          fill="none"
          stroke="#a6b7c0"
          strokeWidth="3"
        />
        <rect
          x="190"
          y={y}
          width="72"
          height="72"
          rx="5"
          fill={floatMaterials[material].color}
          stroke="#8ba5b2"
          strokeWidth="2"
        />
        <path
          d={`M199 ${y + 10}h54M200 ${y + 13}v47`}
          stroke="white"
          opacity=".6"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M40 105h520"
          stroke="#7aafbf"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <text x="345" y="85" fontSize="16" fill="#7695a4">
          100 cm³
        </text>
        <text x="345" y="126" fontSize="16" fill="#7695a4">
          {model.mass.toFixed(1)} g
        </text>
        {done && model.floats && (
          <path
            d={`M282 ${target}h15v${72 * (1 - model.submergedFraction)}h-15`}
            fill="none"
            stroke="#b18c60"
            strokeWidth="2"
          />
        )}
      </svg>
      <div className="phy-lab-controls">
        <B
          zh="释放冰与石块，比较同一种水里的结果。"
          en="Release ice and rock in the same water to compare."
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setDone(false);
            animation.start();
          }}
        >
          <B
            zh={animation.running ? '观察中…' : '放入水槽'}
            en={animation.running ? 'Watching…' : 'Release into water'}
            mode={mode}
          />
        </button>
      </div>
      {done && (
        <>
          <div className="phy-mystery-readings">
            <Reading
              zh="物体质量"
              en="Object mass"
              value={`${model.mass.toFixed(1)} g`}
              mode={mode}
            />
            <Reading
              zh="排开水的质量"
              en="Displaced water mass"
              value={`${model.displacedWaterMass.toFixed(1)} g`}
              mode={mode}
            />
            <Reading
              zh="在水下的体积"
              en="Submerged volume"
              value={`${(model.submergedFraction * 100).toFixed(1)}%`}
              mode={mode}
            />
          </div>
          <p className="phy-lab-result" role="status">
            <B
              zh={
                model.floats
                  ? '漂浮平衡：排开水的质量与物体质量相等。'
                  : '下沉到槽底：完全浸没时，水的浮力仍不足以平衡重力；槽底也会提供支持。'
              }
              en={
                model.floats
                  ? 'Floating balance: displaced water mass equals object mass.'
                  : 'Sinks to the floor: buoyancy alone is insufficient even when fully submerged; the floor also provides support.'
              }
              mode={mode}
            />
          </p>
        </>
      )}
      <Note
        zh="静态体积模型，100 cm³ 样块；淡水密度 1.000、海水 1.025 g/cm³。数值为教学近似，不代表所有温度或所有塑料。忽略融化、表面张力与水流；移动只是示意，速度不是计算结果。"
        en="Static volume model with 100 cm³ samples. Fresh water: 1.000; seawater: 1.025 g/cm³. Teaching approximations, not all temperatures or plastics. Melting, surface tension and currents are omitted; settling motion is illustrative, not a calculated speed."
        mode={mode}
      />
    </div>
  );
}
export function BoatLab({ mode, onExplore }: Props) {
  const [shape, setShape] = useState<'lump' | 'bowl'>('lump');
  const [cargo, setCargo] = useState(0);
  const [done, setDone] = useState(false);
  const [records, setRecords] = useState<string[]>([]);
  const model = boatState(shape, cargo);
  const animation = useAnimation(1.3, () => {
    setDone(true);
    const next = [...new Set([...records, `${shape}:${cargo}`])];
    setRecords(next);
    if (
      next.includes('lump:0') &&
      next.includes('bowl:0') &&
      next.includes('bowl:150') &&
      next.some(
        (r) =>
          r.startsWith('bowl:') &&
          boatState('bowl', Number(r.split(':')[1])).flooded,
      )
    )
      onExplore?.();
  });
  const h = shape === 'bowl' ? 100 : 60;
  const target =
    model.status === 'sinking'
      ? 310 - h
      : 130 - h * (1 - model.submergedFraction);
  const f = Math.min(1, animation.time / 1.3),
    y = 20 + (target - 20) * (1 - (1 - f) ** 3);
  const reset = () => {
    animation.reset();
    setDone(false);
  };
  return (
    <div className="phy-lab">
      <Title
        name="13 / SAME CLAY, NEW SHAPE"
        zh="100 g 泥一直没变"
        en="Always the same 100 g of clay"
        mode={mode}
      />
      <div className="phy-mystery-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Clay shape' : '泥的形状'}
        >
          {(['lump', 'bowl'] as const).map((v) => (
            <button
              key={v}
              className={shape === v ? 'selected' : ''}
              aria-pressed={shape === v}
              disabled={animation.running}
              onClick={() => {
                setShape(v);
                setCargo(0);
                reset();
              }}
            >
              <B
                zh={v === 'lump' ? '实心团' : '空心船'}
                en={v === 'lump' ? 'Solid lump' : 'Hollow boat'}
                mode={mode}
              />
            </button>
          ))}
        </div>
        <B
          zh="先比形状，再加货物。"
          en="Compare shapes, then add cargo."
          mode={mode}
        />
      </div>
      <svg
        viewBox="0 0 600 350"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'Clay boat and cargo in a fresh-water tank'
            : '淡水槽里的泥船与货物'
        }
      >
        <rect x="40" y="130" width="520" height="180" rx="7" fill="#dbeef1" />
        <path
          d="M40 100v210h520V100"
          fill="none"
          stroke="#a6b7c0"
          strokeWidth="3"
        />
        <g transform={`translate(260 ${y})`}>
          {shape === 'lump' ? (
            <rect x="-30" width="60" height="60" rx="14" fill="#c89d8c" />
          ) : (
            <>
              <rect
                x="-67"
                y="0"
                width="134"
                height="88"
                fill={model.flooded && y >= 130 ? '#95c7d5' : '#fffaf3'}
              />
              <path
                d="M-80 0v70q0 30 30 30h100q30 0 30-30V0H68v70q0 18-18 18H-50q-18 0-18-18V0Z"
                fill="#c89d8c"
              />
              {cargo > 0 && (
                <>
                  <rect
                    x="-25"
                    y="51"
                    width="50"
                    height="36"
                    rx="4"
                    fill="#9b91ad"
                  />
                  <text
                    x="0"
                    y="74"
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                  >
                    {cargo} g
                  </text>
                </>
              )}
            </>
          )}
        </g>
        <path
          d="M40 130h520"
          stroke="#7aafbf"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <text x="422" y="93" textAnchor="middle" fontSize="17" fill="#9b8192">
          {model.mass} g
        </text>
      </svg>
      <div className="phy-slider-row">
        <label>
          <B zh="钢质货物" en="Steel cargo" mode={mode} />
          <input
            type="range"
            min="0"
            max="250"
            step="50"
            value={cargo}
            disabled={shape === 'lump' || animation.running}
            onChange={(e) => {
              setCargo(Number(e.target.value));
              reset();
            }}
          />
          <strong>{cargo} g</strong>
        </label>
      </div>
      <div className="phy-lab-controls">
        <B
          zh={`完成对比 ${['lump:0', 'bowl:0', 'bowl:150', 'bowl:250'].filter((r) => records.includes(r)).length}/4：实心团、空船、载荷 150 g、载荷 250 g。`}
          en={`Compared ${['lump:0', 'bowl:0', 'bowl:150', 'bowl:250'].filter((r) => records.includes(r)).length}/4: solid lump, empty boat, 150 g cargo, 250 g cargo.`}
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setDone(false);
            animation.start();
          }}
        >
          <B
            zh={animation.running ? '观察中…' : '释放这个设计'}
            en={animation.running ? 'Watching…' : 'Release this design'}
            mode={mode}
          />
        </button>
      </div>
      {done && (
        <>
          <div className="phy-mystery-readings">
            <Reading
              zh="泥 + 货物"
              en="Clay + cargo"
              value={`${model.mass} g`}
              mode={mode}
            />
            <Reading
              zh={
                shape === 'bowl'
                  ? '干船舱到船舷的排水上限'
                  : '泥团完全浸没的排水量'
              }
              en={
                shape === 'bowl'
                  ? 'Dry-hull capacity at rim'
                  : 'Fully submerged lump displacement'
              }
              value={`${model.dryWaterCapacity} g`}
              mode={mode}
            />
            <Reading
              zh="当前排开水的质量"
              en="Current displaced water mass"
              value={`${model.displacedWaterMass.toFixed(1)} g`}
              mode={mode}
            />
          </div>
          <p className="phy-lab-result" role="status">
            <B
              zh={
                model.status === 'floating'
                  ? '浮起来了：仍有船舷余量。增加货物，船会浸得更深。'
                  : model.status === 'at-rim'
                    ? '刚好到船舷：理想临界状态，没有浪或倾斜的余量。'
                    : model.flooded
                      ? '超过干船舱能力，水越过船舷。进水后空舱不再排开水，船下沉到槽底。'
                      : '实心团下沉：相同质量，能排开的水太少。'
              }
              en={
                model.status === 'floating'
                  ? 'Floating with rim clearance. More cargo makes it sit deeper.'
                  : model.status === 'at-rim'
                    ? 'Exactly at the rim: an ideal limit with no margin for waves or tilt.'
                    : model.flooded
                      ? 'Beyond dry-hull capacity, water crosses the rim. Flooded space no longer excludes water, and the boat sinks to the floor.'
                      : 'The solid lump sinks: the same mass displaces too little water.'
              }
              mode={mode}
            />
          </p>
        </>
      )}
      <Note
        zh="淡水模型，泥质量 100 g、材料体积 50 cm³；空船到船舷可排开 300 cm³ 水。钢质货物密度设为 8 g/cm³。进水后只计算固体材料排水；到槽底后还有支持力。忽略浪、倾斜与表面张力，移动速度仅示意。"
        en="Fresh-water model: clay mass 100 g, material volume 50 cm³; dry hull excludes up to 300 cm³ at its rim. Steel cargo density is set to 8 g/cm³. After flooding, only solid materials displace water; the tank floor provides support at rest. Waves, tilting and surface tension are omitted; motion speed is illustrative."
        mode={mode}
      />
    </div>
  );
}
const balls = {
  rubber: { e: 0.8, name: t('橡胶球', 'Rubber ball'), color: '#b099c6' },
  clay: { e: 0.05, name: t('泥团', 'Clay lump'), color: '#c89d8c' },
} as const;
export function BounceLab({ mode, onExplore }: Props) {
  const [ball, setBall] = useState<keyof typeof balls>('rubber');
  const [height, setHeight] = useState(1);
  const [done, setDone] = useState(false);
  const [records, setRecords] = useState<
    { ball: keyof typeof balls; height: number; peak: number }[]
  >([]);
  const p = bounceParameters(height, balls[ball].e);
  const animation = useAnimation(p.duration / 0.7, () => {
    setDone(true);
    const next = [
      ...records.slice(-5),
      { ball, height, peak: p.reboundHeight },
    ];
    setRecords(next);
    if (
      next.some(
        (r) =>
          r.ball === 'rubber' &&
          next.some((c) => c.ball === 'clay' && c.height === r.height),
      )
    )
      onExplore?.();
  });
  const physicalTime = animation.time * 0.7;
  const y = 335 - bounceHeight(height, balls[ball].e, physicalTime) * 145;
  const reset = () => {
    animation.reset();
    setDone(false);
  };
  return (
    <div className="phy-lab">
      <Title
        name="14 / WHERE DID THE ENERGY GO?"
        zh="同高释放，比较回弹"
        en="Same release height, different rebound"
        mode={mode}
      />
      <div className="phy-mystery-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Ball material' : '球的材料'}
        >
          {(Object.keys(balls) as (keyof typeof balls)[]).map((v) => (
            <button
              key={v}
              disabled={animation.running}
              aria-pressed={ball === v}
              className={ball === v ? 'selected' : ''}
              onClick={() => {
                setBall(v);
                reset();
              }}
            >
              <Text value={balls[v].name} mode={mode} />
            </button>
          ))}
        </div>
        <B zh="只播放第一次回弹" en="First rebound only" mode={mode} />
      </div>
      <svg
        viewBox="0 0 600 375"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'A ball falling and rebounding once'
            : '球下落与第一次回弹示意'
        }
      >
        <path d="M80 35v300h440" stroke="#d1c1dc" fill="none" />
        {[0, 0.5, 1, 1.5, 2].map((v) => (
          <g key={v}>
            <path d={`M75 ${335 - v * 145}h12`} stroke="#ab95ba" />
            <text
              x="62"
              y={340 - v * 145}
              textAnchor="end"
              fontSize="13"
              fill="#9780a8"
            >
              {v} m
            </text>
          </g>
        ))}
        <path
          d={`M85 ${335 - height * 145}h210`}
          stroke="#b8a5c8"
          strokeDasharray="5 5"
        />
        <circle cx="190" cy={y} r="15" fill={balls[ball].color} />
        {physicalTime >= p.fallTime && (
          <>
            <path
              d={`M220 ${335 - p.reboundHeight * 145}h245`}
              stroke="#c6a572"
              strokeDasharray="5 5"
            />
            <text
              x="353"
              y={326 - p.reboundHeight * 145}
              textAnchor="middle"
              fontSize="16"
              fill="#b28e58"
            >
              {p.reboundHeight.toFixed(3)} m
            </text>
          </>
        )}
        <path d="M80 350h440" stroke="#a998b6" strokeWidth="3" />
        <text x="430" y="80" textAnchor="middle" fontSize="22" fill="#9f86b3">
          {(p.retainedFraction * 100).toFixed(2)}%
        </text>
        <rect x="365" y="100" width="130" height="15" rx="5" fill="#e9dfea" />
        <rect
          x="365"
          y="100"
          width={130 * p.retainedFraction}
          height="15"
          rx="5"
          fill="#b5a1c9"
        />
      </svg>
      <div className="phy-slider-row">
        <label>
          <B zh="释放高度" en="Release height" mode={mode} />
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.5"
            value={height}
            disabled={animation.running}
            onChange={(e) => {
              setHeight(Number(e.target.value));
              reset();
            }}
          />
          <strong>{height.toFixed(1)} m</strong>
        </label>
      </div>
      <div className="phy-lab-controls">
        <B
          zh="百分比 = 碰撞后保留的机械能比例"
          en="Percentage = mechanical energy retained after impact"
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setDone(false);
            animation.start();
          }}
        >
          <B
            zh={animation.running ? '回弹中…' : '松手释放'}
            en={animation.running ? 'Bouncing…' : 'Release from rest'}
            mode={mode}
          />
        </button>
      </div>
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B zh="第一次回弹记录" en="First-rebound records" mode={mode} />
            </caption>
            <thead>
              <tr>
                <th>
                  <B zh="材料" en="Material" mode={mode} />
                </th>
                <th>
                  <B zh="释放（m）" en="Release (m)" mode={mode} />
                </th>
                <th>
                  <B zh="回弹最高（m）" en="Rebound peak (m)" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <th scope="row">
                    <Text value={balls[r.ball].name} mode={mode} />
                  </th>
                  <td>{r.height.toFixed(1)}</td>
                  <td>{r.peak.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {done && (
        <p className="phy-lab-result" role="status">
          <B
            zh="第一次回弹结束。机械能没有全部回到球的上升运动，其余转到内能、声音、形变等。"
            en="The first rebound is complete. Some mechanical energy returns to upward motion; the rest transfers into internal energy, sound, deformation and other forms."
            mode={mode}
          />
        </p>
      )}
      <Note
        zh="理想竖直运动，g = 9.8 m/s²，无空气阻力；碰撞瞬时改变速度。橡胶球回弹高度比 64%，泥团 0.25%，为模型设定，不代表所有真实球。以 0.7 倍速度播放，到第一次回弹落地时结束；图中不模拟接触形变。"
        en="Ideal vertical motion, g = 9.8 m/s², no air drag. Impact changes velocity instantly. Rebound-height ratios: rubber 64%, clay 0.25%; preset model values, not all real objects. Playback at 0.7× speed stops after the first rebound lands. Contact deformation is not simulated."
        mode={mode}
      />
    </div>
  );
}
export function EchoLab({ mode, onExplore }: Props) {
  const [distance, setDistance] = useState(5);
  const [done, setDone] = useState(false);
  const [records, setRecords] = useState<{ distance: number; delay: number }[]>(
    [],
  );
  const model = echoState(distance);
  const animation = useAnimation(model.delay / 0.1, () => {
    setDone(true);
    const next = [...records.slice(-5), { distance, delay: model.delay }];
    setRecords(next);
    if (
      next.some((r) => r.distance === 5) &&
      next.some((r) => r.distance >= 20)
    )
      onExplore?.();
  });
  const time = animation.time * 0.1;
  const x = 105 + (echoPosition(distance, time) / distance) * 375;
  return (
    <div className="phy-lab">
      <Title
        name="15 / THERE AND BACK"
        zh="343 m/s · 约 20°C 干燥空气"
        en="343 m/s · Dry air near 20°C"
        mode={mode}
      />
      <div className="phy-mystery-controls">
        <div
          className="phy-segment"
          role="group"
          aria-label={mode === 'en' ? 'Wall distance' : '墙距'}
        >
          {[5, 20, 50, 100].map((v) => (
            <button
              key={v}
              className={v === distance ? 'selected' : ''}
              aria-pressed={v === distance}
              disabled={animation.running}
              onClick={() => {
                setDistance(v);
                setDone(false);
                animation.reset();
              }}
            >
              {v} m
            </button>
          ))}
        </div>
        <B zh="改变墙距" en="Change wall distance" mode={mode} />
      </div>
      <svg
        viewBox="0 0 600 240"
        className="phy-simulation"
        role="img"
        aria-label={
          mode === 'en'
            ? 'A sound pulse traveling to a wall and back'
            : '声脉冲到墙后反射返回的示意'
        }
      >
        <path
          d="M105 85h375m-12-7 12 7-12 7M480 150H105m12-7-12 7 12 7"
          fill="none"
          stroke="#b6a0c8"
          strokeWidth="2"
        />
        <rect x="480" y="52" width="20" height="126" rx="3" fill="#c4b7ce" />
        <path d="M68 92h18l22-17v76l-22-17H68Z" fill="#a28bb9" />
        {(animation.running || done) && (
          <circle
            cx={x}
            cy={time < model.delay / 2 ? 85 : 150}
            r="10"
            fill="#cba775"
          />
        )}
        <text x="295" y="63" fontSize="17" textAnchor="middle" fill="#9e83b2">
          {distance} m →
        </text>
        <text x="295" y="177" fontSize="17" textAnchor="middle" fill="#9e83b2">
          ← {distance} m
        </text>
        <text x="295" y="221" fontSize="25" textAnchor="middle" fill="#9e83b2">
          {Math.min(time, model.delay).toFixed(3)} s
        </text>
      </svg>
      <div className="phy-lab-controls">
        <B
          zh="秒表显示声音往返的模型时间"
          en="Timer shows model time for the return journey"
          mode={mode}
        />
        <button
          className="phy-button"
          disabled={animation.running}
          onClick={() => {
            setDone(false);
            animation.start();
          }}
        >
          <B
            zh={animation.running ? '传播中…' : '发出声脉冲'}
            en={animation.running ? 'Traveling…' : 'Send sound pulse'}
            mode={mode}
          />
        </button>
      </div>
      {done && (
        <>
          <div className="phy-mystery-readings">
            <Reading
              zh="墙距"
              en="Wall distance"
              value={`${distance} m`}
              mode={mode}
            />
            <Reading
              zh="往返路程"
              en="Return path"
              value={`${model.roundTrip} m`}
              mode={mode}
            />
            <Reading
              zh="返回时间"
              en="Return delay"
              value={`${model.delay.toFixed(3)} s`}
              mode={mode}
            />
          </div>
          <p className="phy-lab-result" role="status">
            <B
              zh={
                model.likelySeparate
                  ? '间隔较长：在合适的环境里，更容易辨认独立的第二声。'
                  : '间隔很短：返回声可能与原声混在一起，未必听成第二声。'
              }
              en={
                model.likelySeparate
                  ? 'A longer delay makes a separate second sound easier to identify under suitable conditions.'
                  : 'The short delay may merge the reflection with the original sound rather than create a separate second sound.'
              }
              mode={mode}
            />
          </p>
        </>
      )}
      {records.length > 0 && (
        <div className="phy-data-table-wrap">
          <table className="phy-data-table">
            <caption>
              <B zh="每次往返的比较" en="Compare return journeys" mode={mode} />
            </caption>
            <thead>
              <tr>
                <th>
                  <B zh="墙距（m）" en="Wall (m)" mode={mode} />
                </th>
                <th>
                  <B zh="总路程（m）" en="Full path (m)" mode={mode} />
                </th>
                <th>
                  <B zh="时间（s）" en="Time (s)" mode={mode} />
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td>{r.distance}</td>
                  <td>{2 * r.distance}</td>
                  <td>{r.delay.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Note
        zh="单一反射的直线路径，343 m/s 是近 20°C 干燥空气的近似。动画以 0.1 倍速度播放，不发出实际声音；标记是传播示意，不是空气颗粒。轨道总宽度固定用于比较，数字才给出真实距离。0.1 s 只是区分回声的教学估计。"
        en="One straight reflected path. 343 m/s approximates dry air near 20°C. Animation at 0.1× speed produces no actual sound; the marker is propagation, not an air particle. Track width stays fixed for comparison; numbers give physical distance. The 0.1 s echo distinction is only a teaching estimate."
        mode={mode}
      />
    </div>
  );
}
