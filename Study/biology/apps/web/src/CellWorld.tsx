import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
import { useFrames, Playback } from './LabPlayback';
import {
  cellParts,
  cellActivity,
  cellNames,
  cellInfo,
  cellRoutes,
  type CellKind,
  type CellPart,
} from './cellModel';
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
const green = '#708a58',
  blue = '#608b9b',
  gold = '#b59a52';
const kinds: CellKind[] = ['leaf', 'onion', 'animal'];
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
function SelectKinds({
  kind,
  choose,
  mode,
  animalOnly = false,
}: {
  kind: CellKind;
  choose: (v: CellKind) => void;
  mode: LanguageMode;
  animalOnly?: boolean;
}) {
  if (animalOnly) return null;
  return (
    <div
      className="bio-choice-row bio-cell-kinds"
      aria-label={word(mode, t('细胞类型', 'Cell type'))}
    >
      {kinds.map((v) => (
        <button key={v} aria-pressed={kind === v} onClick={() => choose(v)}>
          <Text mode={mode} text={cellNames[v]} />
        </button>
      ))}
    </div>
  );
}
export function CellCanvas({
  kind,
  selected = 'nucleus',
  angle = 0,
  mode,
  onSelect,
}: {
  kind: CellKind;
  selected?: CellPart;
  angle?: number;
  mode: LanguageMode;
  onSelect?: (part: CellPart) => void;
}) {
  const plant = kind !== 'animal';
  function part(key: CellPart, children: ReactNode) {
    return (
      <g
        key={key}
        role={onSelect ? 'button' : undefined}
        tabIndex={onSelect ? 0 : undefined}
        aria-label={word(mode, cellInfo[key].name)}
        aria-pressed={onSelect ? selected === key : undefined}
        onClick={onSelect ? () => onSelect(key) : undefined}
        onKeyDown={
          onSelect
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(key);
                }
              }
            : undefined
        }
        className={onSelect ? 'bio-cell-hotspot' : undefined}
      >
        {children}
      </g>
    );
  }
  const stroke = (p: CellPart, normal: string) =>
    selected === p ? '#355e48' : normal;
  return (
    <svg
      viewBox="0 0 420 420"
      role={onSelect ? 'group' : 'img'}
      aria-label={word(
        mode,
        t(
          '原创细胞内部示意，图和名称可选择，不按比例',
          'Original cell schematic with selectable diagram and names; not to scale',
        ),
      )}
    >
      <circle cx="210" cy="210" r="190" fill="#f2f3e8" />
      <g transform={`rotate(${angle} 210 210)`} className="bio-cell-turn">
        {plant &&
          part(
            'wall',
            <rect
              x="66"
              y="70"
              width="288"
              height="280"
              rx="30"
              fill="#d7e1c4"
              stroke={stroke('wall', green)}
              strokeWidth={selected === 'wall' ? 10 : 6}
            />,
          )}
        {part(
          'cytoplasm',
          plant ? (
            <rect
              x="78"
              y="82"
              width="264"
              height="256"
              rx="23"
              fill={selected === 'cytoplasm' ? '#dfc88e' : '#eee3c7'}
            />
          ) : (
            <path
              d="M70 195C55 108 164 62 249 82C346 83 367 156 353 223C335 320 272 348 176 335C93 340 54 261 70 195Z"
              fill={selected === 'cytoplasm' ? '#dfc88e' : '#eee3c7'}
            />
          ),
        )}
        {part(
          'membrane',
          plant ? (
            <rect
              x="78"
              y="82"
              width="264"
              height="256"
              rx="23"
              fill="none"
              stroke={stroke('membrane', gold)}
              strokeWidth={selected === 'membrane' ? 6 : 2}
            />
          ) : (
            <path
              d="M70 195C55 108 164 62 249 82C346 83 367 156 353 223C335 320 272 348 176 335C93 340 54 261 70 195Z"
              fill="none"
              stroke={stroke('membrane', gold)}
              strokeWidth={selected === 'membrane' ? 6 : 3}
            />
          ),
        )}
        {plant &&
          part(
            'vacuole',
            <rect
              x="145"
              y="132"
              width="170"
              height="167"
              rx="39"
              fill="#d2e4e7"
              stroke={stroke('vacuole', blue)}
              strokeWidth={selected === 'vacuole' ? 5 : 2}
            />,
          )}
        {part(
          'nucleus',
          <g transform={plant ? 'translate(112 185)' : 'translate(165 164)'}>
            <circle
              r={plant ? 29 : 40}
              fill="#c6b4ce"
              stroke={stroke('nucleus', '#9e85a9')}
              strokeWidth={selected === 'nucleus' ? 5 : 2}
            />
            <path
              d="M-18-8q24-20 31 0q-33 18-6 20q16-4 6-18"
              fill="none"
              stroke="#886e96"
              strokeWidth="3"
            />
          </g>,
        )}
        {part(
          'mitochondria',
          <g transform={plant ? 'translate(111 280)' : 'translate(272 232)'}>
            <ellipse
              rx="24"
              ry="14"
              transform="rotate(-25)"
              fill="#d9ba91"
              stroke={stroke('mitochondria', gold)}
              strokeWidth={selected === 'mitochondria' ? 5 : 2}
            />
            <path
              d="m-17 2 7-10 4 9 6-12 5 9 8-6"
              stroke="#aa8756"
              fill="none"
              strokeWidth="2"
            />
          </g>,
        )}
        {part(
          'ribosomes',
          <g
            fill="#886e96"
            stroke={selected === 'ribosomes' ? '#355e48' : 'none'}
            strokeWidth="2"
          >
            {(plant
              ? [
                  [108, 236],
                  [120, 253],
                  [101, 251],
                  [122, 233],
                ]
              : [
                  [259, 132],
                  [279, 151],
                  [247, 153],
                  [294, 135],
                ]
            ).map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={selected === 'ribosomes' ? 7 : 5}
              />
            ))}
          </g>,
        )}
        {kind === 'leaf' &&
          part(
            'chloroplasts',
            <g>
              {[
                [112, 107],
                [297, 107],
                [305, 317],
              ].map(([x, y], i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <ellipse
                    rx="23"
                    ry="12"
                    fill="#a9c389"
                    stroke={stroke('chloroplasts', green)}
                    strokeWidth={selected === 'chloroplasts' ? 5 : 2}
                  />
                  <path
                    d="M-12-5v10m5-10v10m5-10v10m5-10v10m5-10v10"
                    stroke={green}
                    strokeWidth="2"
                  />
                </g>
              ))}
            </g>,
          )}
      </g>
      <text x="210" y="409" textAnchor="middle" fill={green} fontSize="13">
        {word(
          mode,
          t(
            '颜色与数量为示意 · 非显微照片',
            'Illustrative colours and counts · not a micrograph',
          ),
        )}
      </text>
    </svg>
  );
}
function CellInspector({ id, mode, onExplore }: Props) {
  const [kind, setKind] = useState<CellKind>(id === 'L025' ? 'animal' : 'leaf'),
    [angle, setAngle] = useState(0);
  const parts = cellParts(kind),
    flow = useFrames(parts.length - 1, onExplore),
    selected = parts[flow.frame] ?? parts[0]!;
  const chooseKind = (v: CellKind) => {
    setKind(v);
    flow.reset();
    onExplore();
  };
  return (
    <div data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t('转过来看，工作会变吗？', 'Turn it: do the jobs change?')}
        />
      </h3>
      <SelectKinds
        kind={kind}
        choose={chooseKind}
        mode={mode}
        animalOnly={id === 'L025'}
      />
      <div className="bio-cell-window">
        <CellCanvas
          kind={kind}
          selected={selected}
          angle={angle}
          mode={mode}
          onSelect={(p) => flow.choose(parts.indexOf(p))}
        />
      </div>
      <div className="bio-choice-row">
        <button
          onClick={() => {
            setAngle((v) => (v + 90) % 360);
            onExplore();
          }}
        >
          <Text mode={mode} text={t('↻ 转90°', '↻ Turn 90°')} />
        </button>
        <button
          disabled={angle === 0}
          onClick={() => {
            setAngle(0);
            onExplore();
          }}
        >
          <Text mode={mode} text={t('恢复朝向', 'Reset orientation')} />
        </button>
        <span className="bio-caption">{angle}°</span>
      </div>
      <div
        className="bio-choice-row bio-cell-parts"
        aria-label={word(mode, t('选择细胞结构', 'Choose a cell part'))}
      >
        {parts.map((p, i) => (
          <button
            key={p}
            aria-pressed={p === selected}
            onClick={() => flow.choose(i)}
          >
            <Text mode={mode} text={cellInfo[p].name} />
          </button>
        ))}
      </div>
      <div className="bio-cell-clue" aria-live="polite">
        <strong>
          <Text mode={mode} text={cellInfo[selected].name} />
        </strong>
        <p>
          <Text mode={mode} text={cellInfo[selected].detail} />
        </p>
      </div>
      <Playback flow={flow} mode={mode} />
      <ModelNotes
        mode={mode}
        text={t(
          '导览依次强调不同结构，不是代谢发生的时间顺序。转动的是二维模型，不是活细胞或三维重建。普通光学图不能显示本图的全部细节；形状、位置和数量随细胞而异。',
          'The tour highlights structures rather than showing metabolic timing. Rotation moves a 2D model, not a living cell or 3D reconstruction. Ordinary light images do not resolve all these details; shapes, positions and counts vary.',
        )}
      />
    </div>
  );
}
function ModelNotes({
  mode,
  text,
}: {
  mode: LanguageMode;
  text: LocalizedText;
}) {
  return (
    <details className="bio-static">
      <summary>
        <Text
          mode={mode}
          text={t('文字版与模型说明', 'Text version & model notes')}
        />
      </summary>
      <p>
        <Text mode={mode} text={text} />
      </p>
    </details>
  );
}
function JobDiagram({
  mode,
  frame = 3,
}: {
  mode: LanguageMode;
  frame?: number;
}) {
  const nodes = [
    {
      x: 15,
      y: 20,
      w: 160,
      name: t('核：大部分DNA', 'Nucleus: most DNA'),
      sub: t('信息副本（RNA）', 'Information copy (RNA)'),
      colour: '#c6b4ce',
    },
    {
      x: 245,
      y: 20,
      w: 160,
      name: t('核糖体', 'Ribosomes'),
      sub: t('氨基酸 → 蛋白质', 'Amino acids → protein'),
      colour: '#dfc88e',
    },
    {
      x: 115,
      y: 150,
      w: 190,
      name: t('线粒体', 'Mitochondria'),
      sub: t('已有养分 → ATP支持', 'Existing nutrients → ATP support'),
      colour: '#d9ba91',
    },
  ];
  return (
    <svg
      viewBox="0 0 420 270"
      role="img"
      aria-label={word(
        mode,
        t(
          '核的信息副本连接核糖体，线粒体提供能量支持',
          'Nuclear information copies connect to ribosomes, supported by energy from mitochondria',
        ),
      )}
    >
      <path
        d="M177 67h63m-8-5 8 5-8 5M250 147l48-38m-12 3 12-3-3 12"
        fill="none"
        stroke={frame === 3 ? green : '#a5ad99'}
        strokeWidth="2"
        strokeDasharray={frame === 3 ? undefined : '5 5'}
      />
      {nodes.map((n, i) => (
        <g key={i}>
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height="88"
            rx="15"
            fill={n.colour}
            opacity={frame === 3 || i === frame ? 1 : 0.65}
          />
          <text
            x={n.x + n.w / 2}
            y={n.y + 36}
            textAnchor="middle"
            fill="#355e48"
            fontSize="14"
          >
            {word(mode, n.name)}
          </text>
          <text
            x={n.x + n.w / 2}
            y={n.y + 63}
            textAnchor="middle"
            fill="#355e48"
            fontSize="11"
          >
            {word(mode, n.sub)}
          </text>
        </g>
      ))}
      <text x="210" y="256" textAnchor="middle" fill={green} fontSize="12">
        {word(
          mode,
          t(
            '信息 ≠ 原料 ≠ 能量；不表示真实时序',
            'Information ≠ materials ≠ energy; not actual timing',
          ),
        )}
      </text>
    </svg>
  );
}
const jobFrames = [
  t(
    '细胞膜参与交换，内部已有糖和原料。图中假定氧、氨基酸等条件适宜。',
    'Membranes participate in exchange; sugar and materials already exist. Oxygen, amino acids and other conditions are assumed suitable.',
  ),
  t(
    '白天：只有本课叶肉模型有叶绿体，可进行光合作用；三个模型都可呼吸。',
    'Day: only this mesophyll profile has chloroplasts for photosynthesis; all three profiles can respire.',
  ),
  t(
    '夜晚：没有光，需光的制糖不进行；已有糖仍能支持细胞呼吸。不是所有活动停工。',
    'Night: without light, light-dependent sugar-making stops; existing sugar can still support respiration. Not all activity shuts down.',
  ),
  t(
    '组装线索：核的信息副本、核糖体的氨基酸组装、能量支持相互配合。白天夜晚都可能制造蛋白质。',
    'Assembly clues: nuclear information copies, ribosomal amino-acid assembly and energy support cooperate. Protein production is possible by day and night.',
  ),
];
function CellJobs({ id, mode, onExplore }: Props) {
  const [kind, setKind] = useState<CellKind>('leaf'),
    flow = useFrames(3, onExplore),
    light = flow.frame < 2,
    activity = cellActivity(kind, light);
  return (
    <div data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t('叶片夜晚，谁仍在工作？', 'Who can keep working at night?')}
        />
      </h3>
      <SelectKinds
        kind={kind}
        mode={mode}
        choose={(v) => {
          setKind(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-choice-row">
        {[t('白天线索', 'Day clues'), t('夜晚线索', 'Night clues')].map(
          (v, i) => (
            <button
              key={v.en}
              aria-pressed={light === (i === 0)}
              onClick={() => flow.choose(i === 0 ? 1 : 2)}
            >
              <Text mode={mode} text={v} />
            </button>
          ),
        )}
      </div>
      <div className="bio-cell-job-cards">
        <article className={activity.photosynthesis ? 'active' : ''}>
          <strong>
            <Text mode={mode} text={t('光合作用', 'Photosynthesis')} />
          </strong>
          <p>
            <Text
              mode={mode}
              text={
                activity.photosynthesis
                  ? t(
                      '有叶绿体与光，可制糖',
                      'Chloroplasts and light allow sugar-making',
                    )
                  : kind === 'leaf'
                    ? t(
                        '无光，不进行需光的制糖',
                        'No light: no light-dependent sugar-making',
                      )
                    : t('本模型没有叶绿体', 'No chloroplasts in this profile')
              }
            />
          </p>
        </article>
        <article className={activity.respiration ? 'active' : ''}>
          <strong>
            <Text mode={mode} text={t('细胞呼吸', 'Cellular respiration')} />
          </strong>
          <p>
            <Text
              mode={mode}
              text={t(
                '已有糖、氧与适宜条件，可转移能量',
                'Existing sugar, oxygen and suitable conditions allow energy transfer',
              )}
            />
          </p>
        </article>
        <article className={activity.proteinAssembly ? 'active' : ''}>
          <strong>
            <Text mode={mode} text={t('蛋白质组装', 'Protein assembly')} />
          </strong>
          <p>
            <Text
              mode={mode}
              text={t(
                '信息、氨基酸与能量支持齐备，可组装',
                'Information, amino acids and energy support allow assembly',
              )}
            />
          </p>
        </article>
      </div>
      <div className="bio-cell-window bio-cell-circuit">
        <JobDiagram mode={mode} frame={flow.frame} />
      </div>
      <p className="bio-frame-caption" aria-live="polite">
        <Text mode={mode} text={jobFrames[flow.frame]!} />
      </p>
      <Playback flow={flow} mode={mode} />
      <ModelNotes
        mode={mode}
        text={t(
          '这是定性条件模型，卡片表示作用可发生，不是实测。固定假定三个代表细胞活着，有氧、已有糖与氨基酸，水/CO₂等适宜。没有消耗、温度或速率计算；导览不是严格时间先后。呼吸的一些步骤在细胞质，图省略内质网与高尔基体。',
          'This qualitative model shows possible jobs rather than measurements. All three representative cells are viable, with oxygen, existing sugar, amino acids and suitable water/CO₂. No depletion, temperature or rate calculation; the tour is not strict timing. Some respiration occurs in cytoplasm; ER and Golgi are omitted.',
        )}
      />
    </div>
  );
}
const levelDetails = {
  leaf: [
    t(
      '一格叶肉细胞：叶绿体参与光合作用，同时需要交换与可用能量。',
      'One mesophyll cell: chloroplasts support photosynthesis, alongside exchange and usable energy.',
    ),
    t(
      '叶肉组织：许多相关细胞参与制糖，示意只画少量细胞，不是完整叶片。',
      'Mesophyll tissue: related cells contribute sugar-making; a few representative cells are not a whole leaf.',
    ),
    t(
      '叶片器官：叶肉制糖，表皮保护与交换，木质部/韧皮部运输。气孔属于表皮结构。',
      'Leaf organ: mesophyll makes sugars, epidermis protects and exchanges, xylem/phloem transport. Stomata are epidermal structures.',
    ),
    t(
      '植物个体：根、茎、叶相互依赖，水与糖连接不同器官；不是一个细胞变大成植物。',
      'Plant organism: roots, stems and leaves depend on one another, connected by water and sugars; not one cell enlarged into a plant.',
    ),
  ],
  intestine: [
    t(
      '吸收细胞：表面小突起增加接触面积；细胞仍需核、膜和能量支持。',
      'Absorptive cell: tiny surface projections increase contact area; it still needs nucleus, membrane and energy support.',
    ),
    t(
      '小肠上皮组织：相关细胞组成内衬，参与屏障与吸收；这不是整个小肠壁。',
      'Intestinal epithelium: related cells form a lining for barrier and absorption; not the entire intestinal wall.',
    ),
    t(
      '小肠器官：上皮吸收，肌肉推动，结缔组织与血管支持运输，神经参与协调。',
      'Intestine organ: epithelium absorbs, muscle moves contents, connective tissue and blood vessels support transport, nerves help coordinate.',
    ),
    t(
      '人体个体：消化与循环等系统合作，把吸收的材料送到需要的细胞。图省略器官系统中间层。',
      'Human organism: digestion and circulation cooperate to deliver absorbed materials to cells. The intermediate organ-system level is omitted from this diagram.',
    ),
  ],
};
function AbsorptiveCell() {
  return (
    <g>
      <path
        d="M135 100v180q75 34 150 0V100Z"
        fill="#eee3c7"
        stroke={gold}
        strokeWidth="3"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={`M${138 + i * 12} 104v-26`}
          stroke={gold}
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
      <ellipse
        cx="210"
        cy="252"
        rx="28"
        ry="22"
        fill="#c6b4ce"
        stroke="#9e85a9"
      />
      <ellipse cx="240" cy="171" rx="18" ry="10" fill="#d9ba91" stroke={gold} />
      <ellipse cx="176" cy="190" rx="18" ry="10" fill="#d9ba91" stroke={gold} />
    </g>
  );
}
function Leaf() {
  return (
    <g>
      <path
        d="M91 280Q45 100 321 69Q367 226 91 280Z"
        fill="#b4ca94"
        stroke={green}
        strokeWidth="3"
      />
      <path
        d="M67 310 305 87M142 234l-7-90m7 90 116-4M207 169l-4-59m4 59 97 2"
        stroke={green}
        fill="none"
        strokeWidth="3"
      />
    </g>
  );
}
function LevelsCanvas({
  route,
  level,
  mode,
}: {
  route: 'leaf' | 'intestine';
  level: number;
  mode: LanguageMode;
}) {
  if (level === 0 && route === 'leaf')
    return <CellCanvas kind="leaf" selected="chloroplasts" mode={mode} />;
  return (
    <svg
      viewBox="0 0 420 380"
      role="img"
      aria-label={word(mode, cellRoutes[route][level]!)}
    >
      <rect x="15" y="15" width="390" height="340" rx="25" fill="#f2f3e8" />
      {level === 0 ? (
        <AbsorptiveCell />
      ) : level === 1 ? (
        route === 'leaf' ? (
          <g>
            {[0, 1].flatMap((row) =>
              [0, 1, 2].map((col) => (
                <g
                  key={`${row}${col}`}
                  transform={`translate(${62 + col * 97} ${82 + row * 98})`}
                >
                  <rect
                    width="91"
                    height="91"
                    rx="12"
                    fill="#dbe5c8"
                    stroke={green}
                    strokeWidth="3"
                  />
                  <rect
                    x="29"
                    y="21"
                    width="49"
                    height="56"
                    rx="15"
                    fill="#d2e4e7"
                  />
                  <circle cx="17" cy="42" r="10" fill="#c6b4ce" />
                  {[
                    [16, 16],
                    [17, 70],
                    [73, 12],
                  ].map(([x, y], i) => (
                    <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill={green} />
                  ))}
                </g>
              )),
            )}
          </g>
        ) : (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i} transform={`translate(${57 + i * 61} 109)`}>
                <rect
                  width="57"
                  height="165"
                  rx="7"
                  fill="#eee3c7"
                  stroke={gold}
                  strokeWidth="2"
                />
                <ellipse cx="28" cy="132" rx="15" ry="12" fill="#c6b4ce" />
                {[0, 1, 2, 3, 4].map((j) => (
                  <path
                    key={j}
                    d={`M${6 + j * 11} 2v-22`}
                    stroke={gold}
                    strokeWidth="4"
                  />
                ))}
              </g>
            ))}
            <path d="M50 278h318" stroke="#9e85a9" strokeWidth="7" />
          </g>
        )
      ) : level === 2 ? (
        route === 'leaf' ? (
          <Leaf />
        ) : (
          <g>
            <path
              d="M95 82C329 75 340 126 124 142C52 149 58 206 279 208C370 210 344 266 139 265L117 310"
              stroke="#c9ac98"
              strokeWidth="35"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M95 82C329 75 340 126 124 142C52 149 58 206 279 208C370 210 344 266 139 265L117 310"
              stroke="#9e85a9"
              strokeWidth="3"
              fill="none"
              strokeDasharray="7 7"
            />
          </g>
        )
      ) : route === 'leaf' ? (
        <g>
          <path
            d="M210 293V76m0 104-66-31m66 67 61-30"
            stroke={green}
            strokeWidth="7"
          />
          <path
            d="M208 160q-93-89-114-38q17 68 114 38M214 222q106-105 120-52q-24 74-120 52"
            fill="#b4ca94"
            stroke={green}
            strokeWidth="2"
          />
          <path
            d="M130 291h155m-75 4-40 33m40-33 44 33m-44-33v49"
            fill="none"
            stroke={gold}
            strokeWidth="4"
          />
        </g>
      ) : (
        <g stroke={blue} fill="#dae6e7" strokeWidth="3">
          <circle cx="210" cy="69" r="31" />
          <path d="M170 112h80l35 100-22 7-25-61 8 121-15 57h-22l-7-69-8 69h-22l-15-57 9-121-25 61-22-7Z" />
          <path
            d="M182 210q79-25 29 22q-51 18 33 22"
            fill="none"
            stroke="#b48d72"
            strokeWidth="7"
          />
        </g>
      )}
      <text x="210" y="372" textAnchor="middle" fill={green} fontSize="12">
        {word(
          mode,
          t(
            '示意，不按比例；箭头不是生长或时间',
            'Schematic, not to scale; sequence is not growth or time',
          ),
        )}
      </text>
    </svg>
  );
}
function CellLevels({ id, mode, onExplore }: Props) {
  const [route, setRoute] = useState<'leaf' | 'intestine'>('leaf'),
    flow = useFrames(3, onExplore);
  return (
    <div data-resource-id={`${id}-I01`}>
      <h3>
        <Text
          mode={mode}
          text={t(
            '一格细胞，怎样联系整个生命？',
            'How does one cell connect to a whole organism?',
          )}
        />
      </h3>
      <div className="bio-choice-row">
        {[t('叶片路线', 'Leaf route'), t('小肠路线', 'Intestine route')].map(
          (v, i) => (
            <button
              key={v.en}
              aria-pressed={route === (i === 0 ? 'leaf' : 'intestine')}
              onClick={() => {
                setRoute(i === 0 ? 'leaf' : 'intestine');
                flow.reset();
                onExplore();
              }}
            >
              <Text mode={mode} text={v} />
            </button>
          ),
        )}
      </div>
      <div className="bio-cell-window">
        <LevelsCanvas route={route} level={flow.frame} mode={mode} />
      </div>
      <div className="bio-choice-row bio-cell-levels">
        {cellRoutes[route].map((v, i) => (
          <button
            key={v.en}
            aria-pressed={i === flow.frame}
            onClick={() => flow.choose(i)}
          >
            <Text mode={mode} text={v} />
          </button>
        ))}
      </div>
      <p className="bio-frame-caption" aria-live="polite">
        <Text mode={mode} text={levelDetails[route][flow.frame]!} />
      </p>
      <Playback flow={flow} mode={mode} />
      <ModelNotes
        mode={mode}
        text={t(
          '文字路线：细胞→组织→器官→个体。细胞器在细胞内，组织由相关细胞及周围物质组成，器官含不同组织。器官系统层在这里省略。组织图不是完整叶片切面或小肠壁，细胞没有依次变成整个个体。',
          'Text route: cell → tissue → organ → organism. Organelles are within cells; tissues contain related cells and associated material; organs contain different tissues. The organ-system level is omitted. Tissue images are not full leaf sections or intestinal walls; one cell does not turn into an organism.',
        )}
      />
    </div>
  );
}
export function CellExplore(props: Props) {
  return props.id === 'L028' ? (
    <CellLevels {...props} />
  ) : props.id === 'L027' ? (
    <CellJobs {...props} />
  ) : (
    <CellInspector {...props} />
  );
}
export function CellDiagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const [kind, setKind] = useState<CellKind>(id === 'L025' ? 'animal' : 'leaf'),
    [part, setPart] = useState<CellPart>('membrane'),
    [level, setLevel] = useState(0);
  const parts = cellParts(kind),
    selected = parts.includes(part) ? part : 'membrane',
    labels: CellPart[] =
      id === 'L025'
        ? ['membrane', 'cytoplasm', 'nucleus']
        : (['wall', 'membrane', 'chloroplasts'].filter((p) =>
            parts.includes(p as CellPart),
          ) as CellPart[]);
  return (
    <figure
      className="bio-diagram bio-cell-diagram"
      data-resource-id={`${id}-D01`}
    >
      <span className="bio-eyebrow">
        <Text
          mode={mode}
          text={t('结构与合作地图', 'STRUCTURE & COOPERATION MAP')}
        />
      </span>
      {id === 'L028' ? (
        <>
          <LevelsCanvas route="leaf" level={level} mode={mode} />
          <div className="bio-choice-row">
            {cellRoutes.leaf.map((v, i) => (
              <button
                key={v.en}
                aria-pressed={level === i}
                onClick={() => setLevel(i)}
              >
                <Text mode={mode} text={v} />
              </button>
            ))}
          </div>
          <figcaption>
            <Text mode={mode} text={levelDetails.leaf[level]!} />
          </figcaption>
        </>
      ) : id === 'L027' ? (
        <>
          <JobDiagram mode={mode} />
          <figcaption>
            <Text
              mode={mode}
              text={t(
                '核的信息副本指导核糖体组装，线粒体参与供应可用能量。信息、原料和能量不同；工作可同时进行。',
                'Nuclear information copies guide ribosomal assembly, supported by usable energy from mitochondria. Information, materials and energy differ; jobs can overlap.',
              )}
            />
          </figcaption>
        </>
      ) : (
        <>
          <SelectKinds
            kind={kind}
            mode={mode}
            animalOnly={id === 'L025'}
            choose={(v) => {
              setKind(v);
              setPart('membrane');
            }}
          />
          <CellCanvas
            kind={kind}
            selected={selected}
            mode={mode}
            onSelect={setPart}
          />
          <div className="bio-choice-row bio-cell-parts">
            {labels.map((p) => (
              <button
                key={p}
                aria-pressed={selected === p}
                onClick={() => setPart(p)}
              >
                <Text mode={mode} text={cellInfo[p].name} />
              </button>
            ))}
          </div>
          <figcaption aria-live="polite">
            <strong>
              <Text mode={mode} text={cellInfo[selected].name} />
            </strong>
            <p>
              <Text mode={mode} text={cellInfo[selected].detail} />
            </p>
          </figcaption>
        </>
      )}
      <small>
        <Text
          mode={mode}
          text={t(
            '原创教学示意，不是显微照片。颜色、大小、数量与位置不代表实测，不能从图独立证明功能正在进行。',
            'Original teaching schematic, not a micrograph. Colours, sizes, counts and positions are not measurements and do not independently establish ongoing function.',
          )}
        />
      </small>
    </figure>
  );
}
export function CellHookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  return id === 'L028' ? (
    <LevelsCanvas route="leaf" level={2} mode={mode} />
  ) : id === 'L027' ? (
    <JobDiagram mode={mode} />
  ) : (
    <CellCanvas kind={id === 'L025' ? 'animal' : 'leaf'} mode={mode} />
  );
}
