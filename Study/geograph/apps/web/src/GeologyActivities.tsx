import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, words } from './content';
import { AssetImage, Text } from './ui';
import type { ActivityState } from './progress';
import {
  boundaryTypes,
  earthLayers,
  faultFrames,
  geologyFinished,
  modelFrame,
  volcanoCases,
  volcanoSettings,
} from './geologyModels';
import {
  BoundaryDiagram,
  DriftPuzzle,
  EarthSection,
  EvidenceWorldMap,
  FaultDiagram,
  VolcanoSection,
} from './GeologyVisuals';
export function GeologyExplorer({
  id,
  mode,
  state,
  onChange,
  panel = 0,
  mission = false,
  mystery = false,
}: {
  id: string;
  mode: LanguageMode;
  state: ActivityState;
  onChange: (a: ActivityState) => void;
  panel?: number;
  mission?: boolean;
  mystery?: boolean;
}) {
  const d = state.decisions;
  const [message, setMessage] = useState(
    t(
      '先观察模型怎样变化，再说明原因。',
      'Observe how the model changes, then explain why.',
    ),
  );
  const [selected, setSelected] = useState('');
  const patch = (changes: Record<string, string>) =>
    onChange({ ...state, decisions: { ...d, ...changes } });
  const choice = (
    key: string,
    prompt: LocalizedText,
    correct: string,
    options: { id: string; text: LocalizedText }[],
    explanation: LocalizedText,
    hint: LocalizedText,
  ) => (
    <section className="geo-terrain-question" key={key}>
      <h4>
        <Text mode={mode} text={prompt} />
      </h4>
      <div className="geo-choices">
        {options.map((o) => (
          <button
            key={o.id}
            aria-pressed={d[key] === o.id}
            onClick={() => {
              patch({ [key]: o.id });
              setMessage(o.id === correct ? explanation : hint);
            }}
          >
            <Text mode={mode} text={o.text} />
          </button>
        ))}
      </div>
    </section>
  );
  const status = (
    <div
      className={`geo-feedback ${geologyFinished(id, d) ? 'success' : ''}`}
      role="status"
    >
      <Text
        mode={mode}
        text={
          geologyFinished(id, d)
            ? t(
                '✓ 任务证据齐全。再用一句话说出模型的局限。',
                '✓ Mission evidence complete. State one model limitation in your own words.',
              )
            : message
        }
      />
    </div>
  );
  const frameButtons = (
    key: string,
    max: number,
    observe: (n: number) => Record<string, string>,
    labels?: readonly (readonly [string, string])[],
  ) => (
    <div
      className="geo-choices"
      role="group"
      aria-label={words(mode, '模型观察帧', 'Model observation frames')}
    >
      {Array.from({ length: max + 1 }, (_, n) => (
        <button
          key={n}
          aria-pressed={modelFrame(d[key], max) === n}
          onClick={() => patch({ [key]: String(n), ...observe(n) })}
        >
          {labels
            ? words(mode, ...labels[n]!)
            : `${words(mode, '帧', 'Frame')} ${n}`}
        </button>
      ))}
    </div>
  );
  if (id === 'GEO-017')
    return (
      <div className="geo-skill-explorer">
        <EarthSection
          mode={mode}
          panel={mission ? 0 : panel}
          reveal={!mission && !mystery}
        />
        {mission && (
          <>
            <p>
              <Text
                mode={mode}
                text={t(
                  '选择一个层名，再把它放到A–D。顺序从表面到中心；图中地壳被夸大。',
                  'Choose a layer, then place it at A–D from surface to centre. The crust is exaggerated.',
                )}
              />
            </p>
            <div
              className="geo-choices"
              role="group"
              aria-label={words(mode, '选择地球层名', 'Choose an Earth layer')}
            >
              {[...earthLayers].reverse().map((p) => (
                <button
                  key={p.id}
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(p.id)}
                >
                  {d[`inside-${p.id}`] === p.id ? '✓ ' : ''}
                  <Text mode={mode} text={t(p.zh, p.en)} />
                </button>
              ))}
            </div>
            <div className="geo-choices">
              {earthLayers.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (!selected) {
                      setMessage(
                        t('先选择一个层名。', 'Choose a layer first.'),
                      );
                      return;
                    }
                    patch({ [`inside-${p.id}`]: selected });
                    setMessage(
                      selected === p.id
                        ? t(
                            `✓ ${p.zh}：${p.stateZh}。`,
                            `✓ ${p.en}: ${p.stateEn}.`,
                          )
                        : t(
                            `这个位置是从外向内第${i + 1}层。比较岩石外层与金属核心。`,
                            `This is layer ${i + 1} from outside. Compare rocky outer layers with the metallic core.`,
                          ),
                    );
                    setSelected('');
                  }}
                >
                  {String.fromCharCode(65 + i)} ·{' '}
                  {d[`inside-${p.id}`]
                    ? words(
                        mode,
                        earthLayers.find((x) => x.id === d[`inside-${p.id}`])
                          ?.zh ?? '?',
                        earthLayers.find((x) => x.id === d[`inside-${p.id}`])
                          ?.en ?? '?',
                      )
                    : '?'}
                </button>
              ))}
            </div>
            {choice(
              'inside-state',
              t(
                '地幔能缓慢流动，说明什么？',
                'What does slow mantle flow mean?',
              ),
              'solid',
              [
                {
                  id: 'liquid',
                  text: t(
                    '地幔全是液态岩浆',
                    'The entire mantle is liquid magma',
                  ),
                },
                {
                  id: 'solid',
                  text: t(
                    '主要固态岩石在长时间可变形',
                    'Mostly solid rock can deform over long times',
                  ),
                },
              ],
              t(
                '✓ “固态”与“永远不变形”不同，要一起考虑时间尺度。',
                '✓ Solid does not mean never deforming; time scale matters.',
              ),
              t(
                '短时间坚硬的岩石，在高温高压与漫长时间下仍可变形。',
                'Rock rigid over short times can deform under heat, pressure and long times.',
              ),
            )}
            <EarthSection mode={mode} panel={2} />
            {choice(
              'inside-evidence',
              t(
                '什么证据支持内部结构模型？',
                'What supports the interior model?',
              ),
              'waves',
              [
                {
                  id: 'photo',
                  text: t(
                    '宇航员拍到地核照片',
                    'Astronaut photographs of the core',
                  ),
                },
                {
                  id: 'waves',
                  text: t(
                    '许多地震波记录，加上岩石与实验',
                    'Many seismic-wave records plus rocks and experiments',
                  ),
                },
              ],
              t(
                '✓ 不能直接看见，不等于没有证据。多种证据一起限制解释。',
                '✓ Indirect evidence can be strong when independent observations constrain explanations.',
              ),
              t(
                '太空照片拍到的是表面与云；剖面是根据证据构建的模型。',
                'Space photographs show surface/clouds; a cutaway is an evidence-based model.',
              ),
            )}
            {status}
          </>
        )}
      </div>
    );
  if (id === 'GEO-018') {
    const boundary =
        boundaryTypes.find((p) => p.id === d['boundary-view']) ??
        boundaryTypes[0],
      frame = modelFrame(d['boundary-frame'], 4),
      gap = modelFrame(d['puzzle-gap'] ?? '80', 100);
    return (
      <div className="geo-skill-explorer">
        {!mission && panel === 0 ? (
          <AssetImage id="usgs-plates" mode={mode} compact />
        ) : null}
        {(mission || panel === 1) && (
          <>
            <DriftPuzzle mode={mode} gap={gap} />
            <label className="geo-writing">
              {words(
                mode,
                '改变两块大陆的间距（不是时间）',
                'Change the gap between fragments (not time)',
              )}
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={gap}
                onChange={(e) => patch({ 'puzzle-gap': e.target.value })}
              />
            </label>
            <div className="geo-choices">
              <button
                onClick={() =>
                  patch({ 'puzzle-gap': String(Math.max(0, gap - 5)) })
                }
              >
                {words(mode, '靠近一步 −5', 'Closer −5')}
              </button>
              <button
                onClick={() =>
                  patch({ 'puzzle-gap': String(Math.min(100, gap + 5)) })
                }
              >
                {words(mode, '拉开一步 +5', 'Apart +5')}
              </button>
              {mission && (
                <button
                  onClick={() => {
                    if (gap > 10)
                      setMessage(
                        t(
                          '再靠近一些，比较边缘和两组化石线索。轮廓相似只是起点。',
                          'Move closer to compare edges and two fossil clues. Similar shapes are only a starting point.',
                        ),
                      );
                    else {
                      patch({ 'puzzle-fit': 'checked' });
                      setMessage(
                        t(
                          '✓ 已比较靠近的碎片。说明为什么化石线索比只看轮廓更有帮助。',
                          '✓ Compared nearby fragments. Explain why fossil clues add to shape evidence.',
                        ),
                      );
                    }
                  }}
                >
                  {words(mode, '记录拼合观察', 'Record fit observation')}
                </button>
              )}
            </div>
            {mission &&
              choice(
                'puzzle-evidence',
                t('哪条证据能补充外形相似？', 'What adds to similar shapes?'),
                'fossils',
                [
                  {
                    id: 'green',
                    text: t('今天两地都绿色', 'Both places look green today'),
                  },
                  {
                    id: 'fossils',
                    text: t(
                      '相应岩层有同类型、相近年龄的化石',
                      'Corresponding rocks hold matching fossils of similar age',
                    ),
                  },
                ],
                t(
                  '✓ 相应化石与岩层可交叉核查，仍需考虑古海岸与重建局限。',
                  '✓ Fossils and rocks cross-check the idea, with ancient-coast and reconstruction limits.',
                ),
                t(
                  '颜色会受季节和影像处理影响，不能证明古代相连。',
                  'Colour changes with season/image processing and cannot establish an ancient connection.',
                ),
              )}
          </>
        )}
        {(mission || panel === 2) && (
          <>
            <div
              className="geo-choices"
              role="group"
              aria-label={words(mode, '边界模型', 'Boundary models')}
            >
              {boundaryTypes.map((p) => (
                <button
                  key={p.id}
                  aria-pressed={boundary.id === p.id}
                  onClick={() =>
                    patch({ 'boundary-view': p.id, 'boundary-frame': '0' })
                  }
                >
                  <Text mode={mode} text={t(p.zh, p.en)} />
                </button>
              ))}
            </div>
            <BoundaryDiagram mode={mode} type={boundary.id} frame={frame} />
            {frameButtons('boundary-frame', 4, (n) =>
              n === 4 ? { [`boundary-seen-${boundary.id}`]: 'yes' } : {},
            )}
            {mission &&
              choice(
                `boundary-${boundary.id}`,
                t(
                  '哪种箭头关系与刚才的变化相符？',
                  'Which relative motion matches the change?',
                ),
                boundary.id,
                boundaryTypes.map((p) => ({
                  id: p.id,
                  text: t(p.motionZh, p.motionEn),
                })),
                t(
                  '✓ 用相对运动定义边界；两个板块都可以运动。',
                  '✓ Boundaries describe relative motion; both plates can move.',
                ),
                t(
                  '从帧0到帧4比较距离和滑动方向，不只看名称。',
                  'Compare distance and direction between frames 0 and 4.',
                ),
              )}
          </>
        )}
        {mission && (
          <>
            <details>
              <summary>
                {words(
                  mode,
                  '核对真实全球板块图',
                  'Check the real global plate map',
                )}
              </summary>
              <AssetImage id="usgs-plates" mode={mode} compact />
            </details>
            {choice(
              'plate-size',
              t(
                '板块与大陆有什么关系？',
                'How do plates relate to continents?',
              ),
              'both',
              [
                {
                  id: 'same',
                  text: t(
                    '每一块板块就是一个大陆',
                    'Each plate is exactly one continent',
                  ),
                },
                {
                  id: 'both',
                  text: t(
                    '一块板块可包括大陆和海底岩石圈',
                    'A plate can include continental and oceanic lithosphere',
                  ),
                },
              ],
              t(
                '✓ 全球图中的边界也延伸到海底；大陆会随所在板块移动。',
                '✓ Boundaries extend through oceans; continents travel with their plates.',
              ),
              t(
                '找一条海洋中的板块边界：陆地轮廓并不是板块边缘。',
                'Find an oceanic boundary: a coastline is not a plate edge.',
              ),
            )}
            {status}
          </>
        )}
      </div>
    );
  }
  if (id === 'GEO-019') {
    const frame = modelFrame(d['fault-frame'], 4);
    return (
      <div className="geo-skill-explorer">
        {(mission || panel === 0) && <EvidenceWorldMap mode={mode} />}
        {(mission || panel === 1) && (
          <>
            <FaultDiagram mode={mode} frame={frame} />
            {frameButtons(
              'fault-frame',
              4,
              (n) => ({ [`fault-seen-${n}`]: 'yes' }),
              faultFrames,
            )}
          </>
        )}
        {(mission || panel === 2) && <FaultDiagram mode={mode} locations />}
        {mission && (
          <>
            {choice(
              'quake-focus',
              t(
                '哪个点是震源（开始破裂的位置）？',
                'Which point is the focus where rupture starts?',
              ),
              'underground',
              [
                {
                  id: 'underground',
                  text: t('A：地下断层上', 'A: underground on the fault'),
                },
                {
                  id: 'surface',
                  text: t('C：断层地表交点', 'C: surface fault intersection'),
                },
              ],
              t(
                '✓ A是地下起点；地震破裂之后可沿断层扩展。',
                '✓ A is the underground starting point; rupture may spread along the fault.',
              ),
              t(
                '找地下的红点，区别起点与地表的断层痕迹。',
                'Find the underground red dot, distinct from the surface trace.',
              ),
            )}
            {choice(
              'quake-epicentre',
              t('哪个点是震中？', 'Which point is the epicentre?'),
              'above',
              [
                {
                  id: 'trace',
                  text: t('C：地表断层交点', 'C: surface fault intersection'),
                },
                {
                  id: 'above',
                  text: t(
                    'B：震源正上方地表',
                    'B: surface directly above the focus',
                  ),
                },
              ],
              t(
                '✓ 竖直虚线把A投到B；震中不是“整场地震都在这里”。',
                '✓ The vertical dashed line projects A to B; an earthquake is not confined to this point.',
              ),
              t(
                '沿竖直虚线找地表位置，不沿斜断层线。',
                'Follow the vertical dashed line to the surface, not the inclined fault.',
              ),
            )}
            <details>
              <summary>
                {words(
                  mode,
                  '与全球板块图比较',
                  'Compare with global plate map',
                )}
              </summary>
              <AssetImage id="usgs-plates" mode={mode} compact />
            </details>
            {choice(
              'quake-pattern',
              t('分布图能支持什么结论？', 'What can the distribution support?'),
              'limited',
              [
                {
                  id: 'predict',
                  text: t(
                    '没有圆点的地方不会地震，也能预测下一次日期',
                    'No-dot places never quake; the next date is predictable',
                  ),
                },
                {
                  id: 'limited',
                  text: t(
                    '可比较大震分布与边界；这一年样本不足以预测',
                    'Compare larger events and boundaries; this sample cannot predict',
                  ),
                },
              ],
              t(
                '✓ 一年、震级筛选和目录修订都限制解释；内陆也可地震。',
                '✓ One year, magnitude selection and catalogue revisions limit inference; intraplate earthquakes occur too.',
              ),
              t(
                '读图注：小震与其他年份被排除，空白不是零风险。',
                'Read the caption: smaller events and other years are excluded; blank does not mean no risk.',
              ),
            )}
            {choice(
              'quake-safety',
              t(
                '新西兰室内摇晃时，普通站立者先做什么？',
                'For a person standing indoors in New Zealand, what comes first during shaking?',
              ),
              'cover',
              [
                {
                  id: 'run',
                  text: t(
                    '立即冲到外面或站门框',
                    'Run outdoors or stand in a doorway',
                  ),
                },
                {
                  id: 'cover',
                  text: t(
                    '趴下、掩护、抓牢，保护头颈',
                    'Drop, Cover and Hold; protect head and neck',
                  ),
                },
              ],
              t(
                '✓ 按民防指引练习；靠海时，摇晃结束后还要考虑长或强震的海啸撤离指引。',
                '✓ Practise official guidance; near the coast, after shaking also follow Long or Strong, Get Gone tsunami guidance.',
              ),
              t(
                '奔跑会暴露在坠物中，普通住宅门框并不更安全。参照本课民防来源。',
                'Running exposes you to falling objects; ordinary home doorways are not safer. Check the Civil Defence source.',
              ),
            )}
            {status}
          </>
        )}
      </div>
    );
  }
  const scene =
      volcanoCases.find((p) => p.id === d['volcano-view']) ??
      volcanoCases[!mission && panel === 2 ? 2 : 0],
    frame = modelFrame(d['volcano-frame'], 2);
  return (
    <div className="geo-skill-explorer">
      {!mission && panel === 0 ? (
        <AssetImage id="ruapehu-iss" mode={mode} compact />
      ) : (
        <>
          <EvidenceWorldMap mode={mode} volcanoes />
          <div
            className="geo-choices"
            role="group"
            aria-label={words(mode, '火山环境案例', 'Volcanic setting cases')}
          >
            {volcanoCases.map((p, i) => (
              <button
                key={p.id}
                aria-pressed={scene.id === p.id}
                onClick={() =>
                  patch({ 'volcano-view': p.id, 'volcano-frame': '0' })
                }
              >
                {i + 1} · <Text mode={mode} text={t(p.zh, p.en)} />
              </button>
            ))}
          </div>
          <VolcanoSection mode={mode} setting={scene.setting} frame={frame} />
          {frameButtons(
            'volcano-frame',
            2,
            (n) => (n === 2 ? { [`volcano-seen-${scene.id}`]: 'yes' } : {}),
            [
              ['局部熔融', 'Partial melting'],
              ['岩浆上升', 'Magma rises'],
              ['到达地表并累积', 'Reaches surface and accumulates'],
            ],
          )}
          <p className="geo-notice">
            <Text mode={mode} text={t(scene.detailZh, scene.detailEn)} />
          </p>
          {mission && (
            <>
              {choice(
                `volcano-${scene.id}`,
                t(
                  '这处案例属于哪种构造环境？',
                  'Which setting fits this case?',
                ),
                scene.setting,
                volcanoSettings.map((p) => ({ id: p.id, text: t(p.zh, p.en) })),
                t(
                  '✓ 把位置、板块关系与剖面联系起来。',
                  '✓ Link location and plate relationship to the section.',
                ),
                t(
                  '观察板块是否拉开、向下俯冲，还是在内部热点上方移动。',
                  'Look for separation, a sinking slab or motion over an intraplate hotspot.',
                ),
              )}
              {choice(
                `magma-${scene.id}`,
                t(
                  '这里形成岩浆的关键线索是哪条？',
                  'Which clue explains magma generation here?',
                ),
                scene.cause,
                [
                  {
                    id: 'water',
                    text: t(
                      '俯冲板块释放流体，促进上方地幔局部熔融',
                      'Slab fluids help partial melting above it',
                    ),
                  },
                  {
                    id: 'pressure',
                    text: t(
                      '热地幔上升，压力降低',
                      'Hot mantle rises and pressure decreases',
                    ),
                  },
                  {
                    id: 'hot',
                    text: t(
                      '热点区域较热的上涌地幔物质',
                      'Hotter upwelling mantle at a hotspot',
                    ),
                  },
                ],
                t(
                  '✓ 不同环境有不同条件，不需要把整个地幔熔化。',
                  '✓ Different settings provide different conditions; the entire mantle need not melt.',
                ),
                t(scene.detailZh, scene.detailEn),
              )}
            </>
          )}
        </>
      )}
      {mission && (
        <>
          {choice(
            'volcano-limit',
            t(
              '没有板块边界的地方会有火山吗？',
              'Can volcanoes occur away from boundaries?',
            ),
            'some',
            [
              { id: 'never', text: t('绝不会', 'Never') },
              {
                id: 'some',
                text: t(
                  '会，例如夏威夷；边界也不是处处有火山',
                  'Yes, for example Hawaiʻi; not every boundary has volcanoes',
                ),
              },
            ],
            t(
              '✓ 热点是重要反例；地图位置并不能判断今天是否会喷发。',
              '✓ Hotspots are an important exception; map position cannot say whether an eruption will occur today.',
            ),
            t(
              '比较案例3与板块图。也别把大陆碰撞带都当成火山带。',
              'Compare case 3 with the plate map; continental collisions are not all volcanic belts.',
            ),
          )}
          {status}
        </>
      )}
    </div>
  );
}
