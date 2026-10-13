import { useEffect, useId, useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { t } from './content';
import { Text } from './ui';
import { seedModel, virusCopies, type Water } from './models';
import { MicroDiagram, MicroExplore } from './MicroWorld';
import { PlantDiagram, PlantExplore } from './PlantWorld';
import { BodyDiagram, BodyExplore } from './BodyWorld';
import { EcoDiagram, EcoExplore } from './EcoWorld';
import { InquiryDiagram, InquiryExplore } from './InquiryWorld';
import { CellDiagram, CellExplore } from './CellWorld';
import { ExchangeDiagram, ExchangeExplore } from './ExchangeWorld';
import { EnergyDiagram, EnergyExplore } from './EnergyWorld';
import { SystemsDiagram, SystemsExplore } from './SystemsWorld';
import { VascularDiagram, VascularExplore } from './VascularWorld';
import { DiversityDiagram, DiversityExplore } from './DiversityWorld';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const label = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : mode === 'zh' ? zh : `${zh} · ${en}`;
export function Sprout({
  step = 3,
  bend = 0,
}: {
  step?: number;
  bend?: number;
}) {
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label="Seed germination / 种子萌发示意"
    >
      <defs>
        <linearGradient id={gradientId} x2="1" y2="1">
          <stop stopColor="#98c767" />
          <stop offset="1" stopColor="#27634a" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="257" rx="126" ry="13" fill="#163e3020" />
      <path
        d="M80 239Q205 225 340 239"
        stroke="#c7bba0"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 6"
      />
      {step > 0 && (
        <path
          d={`M210 229Q${205 - step * 5} 251 ${200 - step * 6} ${248 + step * 9}`}
          stroke="#f2ddba"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
      )}
      <ellipse
        cx="210"
        cy="226"
        rx="26"
        ry="17"
        fill="#ab7550"
        transform="rotate(-18 210 226)"
      />
      <path
        d="M196 223q12-9 25-4"
        stroke="#e7ba81"
        strokeWidth="2"
        fill="none"
      />
      {step >= 2 && (
        <>
          <path
            d={`M213 216Q${218 + bend * 12} 180 ${210 + bend * 26} ${195 - step * 24}`}
            stroke="#4e8651"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${211 + bend * 18} ${197 - step * 18}q-70-64-78-15q9 42 78 15Z`}
            fill={`url(#${gradientId})`}
          />
          <path
            d={`M${214 + bend * 20} ${195 - step * 18}q66-72 80-22q-1 39-80 22Z`}
            fill={`url(#${gradientId})`}
          />
          <path
            d={`M${211 + bend * 18} ${197 - step * 18}l-59-26m62 23 59-34`}
            stroke="#e2efc0"
            strokeWidth="1.8"
            fill="none"
          />
        </>
      )}
      <circle
        cx="210"
        cy="226"
        r="43"
        stroke="#b8cbb3"
        strokeWidth="1"
        strokeDasharray="3 7"
        fill="none"
      />
    </svg>
  );
}
export function Diagram({ id, mode }: { id: string; mode: LanguageMode }) {
  if (['L045', 'L046', 'L047', 'L048'].includes(id))
    return <DiversityDiagram id={id} mode={mode} />;
  if (['L041', 'L042', 'L043', 'L044'].includes(id))
    return <VascularDiagram id={id} mode={mode} />;
  if (['L037', 'L038', 'L039', 'L040'].includes(id))
    return <SystemsDiagram id={id} mode={mode} />;
  if (['L033', 'L034', 'L035', 'L036'].includes(id))
    return <EnergyDiagram id={id} mode={mode} />;
  if (['L029', 'L030', 'L031', 'L032'].includes(id))
    return <ExchangeDiagram id={id} mode={mode} />;
  if (['L025', 'L026', 'L027', 'L028'].includes(id))
    return <CellDiagram id={id} mode={mode} />;
  if (['L021', 'L022', 'L023', 'L024'].includes(id))
    return <InquiryDiagram id={id} mode={mode} />;
  if (['L017', 'L018', 'L019', 'L020'].includes(id))
    return <EcoDiagram id={id} mode={mode} />;
  if (['L013', 'L014', 'L015', 'L016'].includes(id))
    return <BodyDiagram id={id} mode={mode} />;
  if (['L009', 'L010', 'L011', 'L012'].includes(id))
    return <PlantDiagram id={id} mode={mode} />;
  return ['L005', 'L006', 'L007', 'L008'].includes(id) ? (
    <MicroDiagram id={id} mode={mode} />
  ) : (
    <LifeDiagram id={id} mode={mode} />
  );
}
function LifeDiagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const parts =
    id === 'L003'
      ? [
          t('种皮：保护内部的胚。', 'Seed coat: protects the embryo.'),
          t('胚：可以发育成新植物。', 'Embryo: can develop into a new plant.'),
          t(
            '子叶：豆种中储存养分的结构。',
            'Cotyledons: store nutrients in bean seeds.',
          ),
        ]
      : id === 'L004'
        ? [
            t(
              '细菌：细胞膜内有细胞质与DNA，没有细胞核。',
              'Bacterium: membrane, cytoplasm and DNA, without a nucleus.',
            ),
            t('病毒衣壳：由蛋白质构成。', 'Viral capsid: made of protein.'),
            t(
              '遗传物质：此处的曲线代表DNA或RNA，不是细胞核。',
              'Genetic material: the line represents DNA or RNA, not a nucleus.',
            ),
          ]
        : id === 'L002'
          ? [
              t(
                '叶片：利用光、水和二氧化碳制造糖。',
                'Leaves: use light, water and carbon dioxide to make sugars.',
              ),
              t(
                '根：吸收水分与矿质养分。',
                'Roots: absorb water and mineral nutrients.',
              ),
              t(
                '全株活细胞：通过细胞呼吸释放可用能量。',
                'Living cells throughout the plant: release usable energy by cellular respiration.',
              ),
            ]
          : [
              t(
                '细胞膜：分隔细胞内部与外部环境。',
                'Cell membrane: separates the inside from the outside.',
              ),
              t(
                '细胞质：许多细胞活动发生的地方。',
                'Cytoplasm: where many cellular activities occur.',
              ),
              t(
                '细胞核：储存大部分DNA；并非所有细胞都有核。',
                'Nucleus: contains most DNA; not all cells have one.',
              ),
            ];
  const [part, setPart] = useState(0);
  return (
    <figure className="bio-diagram">
      <span className="bio-eyebrow">
        {label(mode, '看图找线索', 'LOOK FOR CLUES')}
      </span>
      {id === 'L002' ? (
        <Sprout />
      ) : (
        <svg
          viewBox="0 0 420 270"
          role="img"
          aria-label={label(
            mode,
            id === 'L003'
              ? '豆种剖面：种皮包裹子叶和胚'
              : id === 'L004'
                ? '左：细菌细胞；右：病毒衣壳与遗传物质'
                : '动物细胞：细胞膜、细胞质与细胞核',
            id === 'L003'
              ? 'Bean seed cutaway: coat enclosing cotyledons and embryo'
              : id === 'L004'
                ? 'Left: bacterial cell; right: viral capsid and genetic material'
                : 'Animal cell: membrane, cytoplasm and nucleus',
          )}
        >
          {id === 'L003' ? (
            <>
              <path
                d="M246 47C368 53 350 229 225 237C88 253 67 120 151 69C191 44 207 112 246 47Z"
                fill={part === 0 ? '#a77750' : '#b99169'}
                stroke="#795939"
                strokeWidth={part === 0 ? 7 : 3}
              />
              <path
                d="M243 65C339 61 334 214 228 219C115 235 95 128 162 89C194 62 213 141 243 65Z"
                fill={part === 2 ? '#efd591' : '#f1e3b9'}
              />
              <path
                d="M234 106q-28 43-4 81q-38-12-45 18m40-35q-41-56-53-32m59 12q41-44 48-22"
                fill="none"
                stroke={part === 1 ? '#2b7652' : '#6d925b'}
                strokeWidth={part === 1 ? 12 : 8}
                strokeLinecap="round"
              />
            </>
          ) : id === 'L004' ? (
            <>
              <rect
                x="29"
                y="69"
                width="166"
                height="130"
                rx="64"
                fill="#d4e3c0"
                stroke="#527659"
                strokeWidth={part === 0 ? 6 : 3}
              />
              <path
                d="M63 122q15-38 28 12t29-9t31 20"
                fill="none"
                stroke="#86659a"
                strokeWidth="5"
              />
              <circle cx="79" cy="165" r="5" fill="#71885a" />
              <circle cx="140" cy="97" r="5" fill="#71885a" />
              <path
                d="M195 147q39 20 22 41t26 36"
                stroke="#527659"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M304 67 373 105 373 180 304 219 241 180 241 105Z"
                fill="#e3cbd5"
                stroke="#9f6476"
                strokeWidth={part === 1 ? 6 : 3}
              />
              <path
                d="m252 113 52 36 60-36m-112 60 52-24 58 28m-58-98v124"
                fill="none"
                stroke="#c396a6"
                strokeWidth="2"
              />
              <path
                d="M281 117q44 9 9 31t39 26"
                fill="none"
                stroke={part === 2 ? '#6d4468' : '#9b7698'}
                strokeWidth={part === 2 ? 7 : 4}
              />
            </>
          ) : (
            <>
              <path
                d="M350 135C365 224 195 252 95 194C13 146 84 56 178 48C277 35 345 59 350 135Z"
                fill="#e1ecd7"
                stroke="#507657"
                strokeWidth={part === 0 ? 7 : 3}
              />
              <path
                d="M111 110q-30 32 9 48m156-57q36 19 15 50"
                fill="none"
                stroke="#a4ba8c"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <ellipse
                cx="217"
                cy="141"
                rx="43"
                ry="37"
                fill={part === 2 ? '#a080b5' : '#b8a3c7'}
                stroke="#7f6592"
                strokeWidth="3"
              />
              <path
                d="m193 140 16-12 13 22 17-17"
                fill="none"
                stroke="#f1e8f8"
                strokeWidth="3"
              />
              {[110, 147, 290, 318].map((x, i) => (
                <circle
                  key={x}
                  cx={x}
                  cy={105 + i * 23}
                  r={part === 1 ? 7 : 4}
                  fill="#9db38e"
                />
              ))}
            </>
          )}
        </svg>
      )}
      <div className="bio-hotspots">
        {parts.map((p, i) => (
          <button
            key={p.en}
            aria-label={label(
              mode,
              `查看结构 ${i + 1}：${p.zh}`,
              `Inspect part ${i + 1}: ${p.en}`,
            )}
            aria-controls={`${id}-caption`}
            aria-pressed={part === i}
            onClick={() => setPart(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <figcaption id={`${id}-caption`} aria-live="polite">
        <Text mode={mode} text={parts[part]!} />
      </figcaption>
      <small>
        {label(
          mode,
          '原创科学示意 · 非按比例绘制',
          'Original schematic · Not to scale',
        )}
      </small>
    </figure>
  );
}
const evidence = [
  {
    icon: '🐈',
    name: t('猫', 'Cat'),
    verdict: t('有生命', 'Living'),
    detail: t(
      '由细胞构成，获取能量，生长并回应环境。',
      'Made of cells, obtains energy, grows and responds.',
    ),
  },
  {
    icon: '🔥',
    name: t('火焰', 'Flame'),
    verdict: t('非生物', 'Non-living'),
    detail: t(
      '会蔓延并使用能量，却没有细胞结构与生物式遗传系统。',
      'Spreads and uses energy, but lacks cells and a biological heredity system.',
    ),
  },
  {
    icon: '🌱',
    name: t('活的干种子', 'Viable dry seed'),
    verdict: t('有生命', 'Living'),
    detail: t(
      '胚由细胞构成。虽然不移动，在适宜条件下能萌发。',
      'The embryo has cells. It can germinate under suitable conditions without moving around.',
    ),
  },
  {
    icon: '🪨',
    name: t('石头', 'Rock'),
    verdict: t('非生物', 'Non-living'),
    detail: t(
      '没有细胞和自身的生物代谢活动。',
      'Has no cells or biological metabolism of its own.',
    ),
  },
  {
    icon: '🤖',
    name: t('机器人', 'Robot'),
    verdict: t('非生物', 'Non-living'),
    detail: t(
      '能通过机械装置移动，但不是由活细胞构成。',
      'Moves using machinery but is not made of living cells.',
    ),
  },
  {
    icon: '🪴',
    name: t('植物', 'Plant'),
    verdict: t('有生命', 'Living'),
    detail: t(
      '有细胞，利用能量，生长并对刺激作出反应。',
      'Has cells, uses energy, grows and responds to stimuli.',
    ),
  },
];
export function Explore(props: Props) {
  if (['L045', 'L046', 'L047', 'L048'].includes(props.id))
    return <DiversityExplore {...props} />;
  if (['L041', 'L042', 'L043', 'L044'].includes(props.id))
    return <VascularExplore {...props} />;
  if (['L037', 'L038', 'L039', 'L040'].includes(props.id))
    return <SystemsExplore {...props} />;
  if (['L033', 'L034', 'L035', 'L036'].includes(props.id))
    return <EnergyExplore {...props} />;
  if (['L029', 'L030', 'L031', 'L032'].includes(props.id))
    return <ExchangeExplore {...props} />;
  if (['L025', 'L026', 'L027', 'L028'].includes(props.id))
    return <CellExplore {...props} />;
  if (['L021', 'L022', 'L023', 'L024'].includes(props.id))
    return <InquiryExplore {...props} />;
  if (['L017', 'L018', 'L019', 'L020'].includes(props.id))
    return <EcoExplore {...props} />;
  if (['L013', 'L014', 'L015', 'L016'].includes(props.id))
    return <BodyExplore {...props} />;
  if (['L009', 'L010', 'L011', 'L012'].includes(props.id))
    return <PlantExplore {...props} />;
  return ['L005', 'L006', 'L007', 'L008'].includes(props.id) ? (
    <MicroExplore {...props} />
  ) : (
    <LifeExplore {...props} />
  );
}
function LifeExplore({ id, mode, onExplore }: Props) {
  const [object, setObject] = useState(0);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [water, setWater] = useState<Water>('moist');
  const [temperature, setTemperature] = useState(20);
  const [oxygen, setOxygen] = useState(true);
  const [host, setHost] = useState(true);
  const [light, setLight] = useState(-1);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setFrame((v) => {
          if (v >= 3) {
            setPlaying(false);
            return v;
          }
          return v + 1;
        }),
      1200,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const seed = seedModel(water, temperature, oxygen);
  const seedText = {
    dry: t(
      '缺少水分：未见萌发。不表示种子一定死亡。',
      'No water: no visible germination. This does not establish death.',
    ),
    oxygen: t(
      '氧气供应不足：模型中未见萌发。',
      'Limited oxygen: no visible germination in this model.',
    ),
    temperature: t(
      '温度不在模型适宜范围内：未见萌发。',
      'Temperature outside the model range: no visible germination.',
    ),
    ready: t(
      '条件适宜：先吸水，根伸出，再出现新芽。',
      'Suitable conditions: water uptake, root emergence, then shoot development.',
    ),
  };
  function reset() {
    setFrame(0);
    setPlaying(false);
  }
  const states =
    id === 'L004'
      ? [
          t('病毒与细胞', 'Virus and cell'),
          t('与合适宿主接触', 'Contact with suitable host'),
          t('利用宿主的细胞系统', 'Use of host-cell systems'),
          t('产生并释放新副本', 'Production and release'),
        ]
      : id === 'L002'
        ? [
            t('观察光的方向', 'Observe light direction'),
            t('新茎开始生长', 'New shoot grows'),
            t(
              '两侧生长不同，逐渐弯曲',
              'Unequal growth gradually bends the shoot',
            ),
            t('新茎向光生长', 'Shoot grows towards light'),
          ]
        : [
            t('种子', 'Seed'),
            t('吸水、根开始伸出', 'Water uptake and root emergence'),
            t('芽向上生长', 'Shoot grows upwards'),
            t('幼叶展开', 'Young leaves open'),
          ];
  return (
    <div className="bio-lab">
      <div className="bio-lab-top">
        <span className="bio-eyebrow">
          {label(mode, '你的微型实验室', 'YOUR MINI LAB')}
        </span>
        <span className="bio-model-tag">
          {label(mode, '教学模型', 'MODEL')}
        </span>
      </div>
      <h3>
        <Text
          mode={mode}
          text={
            id === 'L001'
              ? t(
                  '不要只看表面。找找证据。',
                  'Look beyond appearances. Find evidence.',
                )
              : id === 'L002'
                ? t('把光源移到另一边，会怎样？', 'What if the light moves?')
                : id === 'L003'
                  ? t(
                      '帮这颗种子找到萌发条件。',
                      'Find conditions for this seed to germinate.',
                    )
                  : t(
                      '加入合适宿主，会发生什么？',
                      'What changes with a suitable host?',
                    )
          }
        />
      </h3>
      {id === 'L001' ? (
        <>
          <div className="bio-objects">
            {evidence.map((e, i) => (
              <button
                key={e.name.en}
                onClick={() => {
                  setObject(i);
                  onExplore();
                }}
                aria-pressed={object === i}
              >
                <span aria-hidden="true">{e.icon}</span>
                <Text mode={mode} text={e.name} />
              </button>
            ))}
          </div>
          <div className="bio-evidence" aria-live="polite">
            <strong>
              <Text mode={mode} text={evidence[object]!.verdict} />
            </strong>
            <p>
              <Text mode={mode} text={evidence[object]!.detail} />
            </p>
          </div>
          <details className="bio-seed-demo">
            <summary>
              {label(
                mode,
                '种子生长 · 展开动画演示',
                'Seed growth · Show animation',
              )}
            </summary>
            <div className="bio-animation bio-seed-sequence">
              <Sprout step={frame} />
            </div>
            <div className="bio-playback">
              <button
                onClick={() => {
                  if (frame === 3) setFrame(0);
                  setPlaying(!playing);
                  onExplore();
                }}
              >
                {label(
                  mode,
                  playing ? 'Ⅱ 暂停' : '▷ 看种子生长',
                  playing ? 'Ⅱ Pause' : '▷ Watch a seed grow',
                )}
              </button>
              <button
                disabled={frame === 3 || playing}
                onClick={() => {
                  setFrame((v) => v + 1);
                  onExplore();
                }}
              >
                {label(mode, '下一步', 'Next step')}
              </button>
              <button
                onClick={() => {
                  reset();
                  onExplore();
                }}
              >
                {label(mode, '↺ 重播', '↺ Replay')}
              </button>
              <span>{frame + 1} / 4</span>
            </div>
            <p className="bio-caption">
              <Text
                mode={mode}
                text={t(
                  '有活力的种子：由细胞构成，在适宜条件下萌发、生长。模型压缩了真实时间；这些证据比“有没有移动”更有用。',
                  'A viable seed has cells and can germinate and grow under suitable conditions. Time is compressed; this is more useful than asking whether it moves.',
                )}
              />
            </p>
          </details>
        </>
      ) : (
        <>
          <div className="bio-controls">
            {id === 'L002' && (
              <div className="bio-choice-row">
                {[-1, 1].map((v) => (
                  <button
                    key={v}
                    aria-pressed={light === v}
                    onClick={() => {
                      setLight(v);
                      reset();
                      onExplore();
                    }}
                  >
                    {label(
                      mode,
                      v === -1 ? '光在左边' : '光在右边',
                      v === -1 ? 'Light on left' : 'Light on right',
                    )}
                  </button>
                ))}
              </div>
            )}
            {id === 'L003' && (
              <>
                <div className="bio-choice-row">
                  {(['dry', 'moist', 'submerged'] as const).map((v, i) => (
                    <button
                      key={v}
                      aria-pressed={water === v}
                      onClick={() => {
                        setWater(v);
                        reset();
                        onExplore();
                      }}
                    >
                      {label(
                        mode,
                        ['干燥', '湿润', '浸没'][i]!,
                        ['Dry', 'Moist', 'Submerged'][i]!,
                      )}
                    </button>
                  ))}
                </div>
                <label className="bio-range">
                  {label(mode, '温度', 'Temperature')}{' '}
                  <strong>{temperature}°C</strong>
                  <input
                    aria-label={label(mode, '温度', 'Temperature')}
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={temperature}
                    onChange={(e) => {
                      setTemperature(Number(e.target.value));
                      reset();
                      onExplore();
                    }}
                  />
                </label>
                <label className="bio-checkbox">
                  <input
                    type="checkbox"
                    checked={oxygen}
                    onChange={(e) => {
                      setOxygen(e.target.checked);
                      reset();
                      onExplore();
                    }}
                  />
                  {label(mode, '空气供应充足', 'Air supply available')}
                </label>
              </>
            )}
            {id === 'L004' && (
              <div className="bio-choice-row">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    aria-pressed={host === v}
                    onClick={() => {
                      setHost(v);
                      reset();
                      onExplore();
                    }}
                  >
                    {label(
                      mode,
                      v ? '有合适宿主' : '无合适宿主',
                      v ? 'Suitable host' : 'No suitable host',
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="bio-animation">
            {id === 'L004' ? (
              <svg
                viewBox="0 0 420 280"
                role="img"
                aria-label={label(
                  mode,
                  '病毒复制过程示意',
                  'Virus replication schematic',
                )}
              >
                <rect
                  x="75"
                  y="48"
                  width="270"
                  height="184"
                  rx="70"
                  fill={host ? '#d9e6c9' : '#ede8dd'}
                  stroke={host ? '#6e8b60' : '#c4beae'}
                  strokeWidth="3"
                  strokeDasharray={host ? '' : '5 5'}
                />
                {Array.from({ length: virusCopies(host, frame) }, (_, i) => (
                  <g
                    key={i}
                    transform={`translate(${frame === 0 ? 45 : host && frame === 3 ? 310 + (i % 2) * 75 : 170 + (i % 2) * 85} ${110 + Math.floor(i / 2) * 65})`}
                  >
                    <path
                      d="m0-20 19 10v20L0 20l-19-10v-20Z"
                      fill="#be91ac"
                      stroke="#875b7a"
                      strokeWidth="2"
                    />
                    <path
                      d="m-7-8 13 7-12 8"
                      stroke="#faf1f6"
                      fill="none"
                      strokeWidth="2"
                    />
                  </g>
                ))}
                {host && frame > 0 && (
                  <path
                    d="M230 84q-50 30-9 69"
                    fill="none"
                    stroke="#b1c29f"
                    strokeWidth="4"
                  />
                )}
              </svg>
            ) : (
              <>
                <Sprout
                  step={id === 'L003' && !seed.grows ? 0 : frame}
                  bend={id === 'L002' ? (light * frame) / 3 : 0}
                />
                {id === 'L002' && (
                  <span className={`bio-sun ${light === 1 ? 'right' : ''}`}>
                    ☀
                  </span>
                )}
              </>
            )}
          </div>
          <div className="bio-playback">
            <button
              onClick={() => {
                if (frame === 3) setFrame(0);
                setPlaying(!playing);
                onExplore();
              }}
            >
              {label(
                mode,
                playing ? 'Ⅱ 暂停' : '▷ 播放',
                playing ? 'Ⅱ Pause' : '▷ Play',
              )}
            </button>
            <button
              disabled={frame === 3 || playing}
              onClick={() => {
                setFrame((v) => v + 1);
                onExplore();
              }}
            >
              {label(mode, '下一步', 'Next step')}
            </button>
            <button
              onClick={() => {
                reset();
                onExplore();
              }}
            >
              {label(mode, '↺ 重播', '↺ Replay')}
            </button>
            <span>{frame + 1} / 4</span>
          </div>
          <p className="bio-caption" aria-live="polite">
            <Text
              mode={mode}
              text={
                id === 'L003'
                  ? seedText[seed.reason]
                  : id === 'L004' && !host
                    ? t(
                        '没有合适宿主，病毒不能独立复制。',
                        'Without a suitable host, a virus cannot replicate independently.',
                      )
                    : states[frame]!
              }
            />
          </p>
        </>
      )}
      <details className="bio-static">
        <summary>
          {label(mode, '文字版与模型说明', 'Text version & model notes')}
        </summary>
        <p>
          <Text
            mode={mode}
            text={
              id === 'L001'
                ? t(
                    '比较细胞、能量利用、生长与反应等证据，不凭单一特征判断。图中使用图标代表物体。',
                    'Compare cells, energy use, growth and responses, not one feature. Icons represent objects.',
                  )
                : id === 'L003'
                  ? t(
                      '活的豆种，休眠已解除。模型把15–30°C设为适宜范围；干燥、浸没或缺氧时不展示萌发。现实条件因物种而异，阶段时间并非预测，未萌发不代表死亡。',
                      'Viable bean seeds with dormancy broken. The model uses 15–30°C as a suitable range. Dry, submerged or oxygen-limited seeds show no germination. Real conditions vary; timing is not predictive and no germination does not establish death.',
                    )
                  : id === 'L002'
                    ? t(
                        '一些新茎的两侧生长速度不同，向光弯曲。动画压缩几天过程，不代表所有植物。光、水、二氧化碳参与制造糖；植物细胞昼夜都可进行细胞呼吸。',
                        'Some young shoots bend towards light due to unequal growth. Days are compressed; this does not represent every plant. Light, water and carbon dioxide support sugar production. Plant cells can respire day and night.',
                      )
                    : t(
                        '无合适宿主：不能自行复制。有合适宿主：接触 → 利用宿主系统 → 产生与释放副本。此处只画4个副本，不表示真实产量。细节因病毒而异；病毒与细胞非按比例绘制。',
                        'No suitable host: no independent replication. Suitable host: contact → use host systems → production and release. Four copies are illustrative, not a real yield. Details vary; virus and cell are not to scale.',
                      )
            }
          />
        </p>
      </details>
    </div>
  );
}
