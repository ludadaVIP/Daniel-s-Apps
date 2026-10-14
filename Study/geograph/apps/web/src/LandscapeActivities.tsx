import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, words } from './content';
import { AssetImage, Text } from './ui';
import type { ActivityState } from './progress';
import { modelFrame } from './geologyModels';
import { NZOverview } from './PlaceVisuals';
import {
  erosionCases,
  landscapeFinished,
  moveRiverCard,
  readRiverOrder,
  readRock,
  riverCards,
  riverSettings,
  rockEdges,
  rockProcesses,
  rockStates,
  rockStep,
  surfaceProcesses,
  type RockProcess,
} from './landscapeModels';
import {
  MountainBudget,
  MountainSection,
  ObliqueMotion,
  PadmaComparison,
  RiverSetting,
  RockNetwork,
  SurfaceParticles,
} from './LandscapeVisuals';

export function LandscapeExplorer({
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
  const [selected, setSelected] = useState<RockProcess | ''>('');
  const [message, setMessage] = useState(
    t(
      '先动手比较，再解释证据。',
      'Compare through action, then explain your evidence.',
    ),
  );
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
      <div
        className="geo-choices"
        role="group"
        aria-label={words(mode, prompt.zh, prompt.en)}
      >
        {options.map((o) => (
          <button
            key={o.id}
            aria-pressed={d[key] === o.id}
            onClick={() => patch({ [key]: o.id })}
          >
            <Text mode={mode} text={o.text} />
          </button>
        ))}
      </div>
      {d[key] && (
        <p
          className={`geo-feedback ${d[key] === correct ? 'success' : ''}`}
          role="status"
        >
          <Text mode={mode} text={d[key] === correct ? explanation : hint} />
        </p>
      )}
    </section>
  );
  const options = (rows: [string, string, string][]) =>
    rows.map(([key, zh, en]) => ({ id: key, text: t(zh, en) }));
  const status = mission && (
    <div
      className={`geo-feedback ${landscapeFinished(id, d) ? 'success' : ''}`}
      role="status"
    >
      <Text
        mode={mode}
        text={
          landscapeFinished(id, d)
            ? t(
                '✓ 任务证据齐全。现在用自己的话连接条件、过程与结果。',
                '✓ Mission evidence complete. Connect conditions, processes and outcomes in your own words.',
              )
            : message
        }
      />
    </div>
  );
  const frames = (
    key: string,
    max: number,
    value: number,
    update: (v: number) => void,
    label: LocalizedText,
  ) => (
    <div className="geo-model-controls">
      <label>
        <Text mode={mode} text={label} />
        <input
          type="range"
          min="0"
          max={max}
          step="1"
          value={value}
          onChange={(e) => update(Number(e.target.value))}
        />
      </label>
      <div
        className="geo-choices"
        role="group"
        aria-label={words(mode, label.zh, label.en)}
      >
        {Array.from({ length: max + 1 }, (_, n) => (
          <button
            key={`${key}-${n}`}
            aria-pressed={value === n}
            onClick={() => update(n)}
          >
            {words(mode, `帧 ${n}`, `Frame ${n}`)}{' '}
            {d[`${key}-seen-${n}`] === 'yes' ? '✓' : ''}
          </button>
        ))}
      </div>
    </div>
  );

  if (id === 'GEO-021') {
    if (mystery) return <AssetImage id="south-island-modis" mode={mode} />;
    const frame = modelFrame(d['mountain-frame'], 4),
      budgetFrame = modelFrame(d['budget-frame'], 4);
    const current =
      erosionCases.find((c) => c.id === d['budget-case']) ?? erosionCases[0];
    const compression = (
      <>
        <MountainSection mode={mode} frame={frame} />
        {frames(
          'mountain',
          4,
          frame,
          (v) =>
            patch({
              'mountain-frame': String(v),
              [`mountain-seen-${v}`]: 'yes',
            }),
          t('挤压过程帧', 'Compression frame'),
        )}
      </>
    );
    const budget = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '移除情景', 'Removal case')}
        >
          {erosionCases.map((c) => (
            <button
              key={c.id}
              aria-pressed={current.id === c.id}
              onClick={() =>
                patch({ 'budget-case': c.id, 'budget-frame': '0' })
              }
            >
              <Text mode={mode} text={t(c.zh, c.en)} />{' '}
              {d[`budget-seen-${c.id}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
        </div>
        <MountainBudget
          mode={mode}
          removal={current.removal}
          frame={budgetFrame}
        />
        {frames(
          'budget',
          4,
          budgetFrame,
          (v) =>
            patch({
              'budget-frame': String(v),
              ...(v === 4 ? { [`budget-seen-${current.id}`]: 'yes' } : {}),
            }),
          t('高度收支帧', 'Surface budget frame'),
        )}
        {mission &&
          erosionCases.map((c) =>
            choice(
              `budget-${c.id}`,
              t(
                `${c.zh}：相同抬升下，山顶怎样变？`,
                `${c.en}: with the same uplift, how does the summit change?`,
              ),
              c.id,
              options([
                ['grow', '增高', 'Rises'],
                ['steady', '大致不变', 'Stays similar'],
                ['lower', '降低', 'Lowers'],
              ]),
              t(
                '比较每段+3与移除量，再看初值虚线；上升的岩石不等于同样上升的地表。',
                'Compare +3 with removal against the initial dashed outline; rising rock does not imply identical surface rise.',
              ),
              t(
                '看初值10与帧4，并比较抬升和移除谁更大。',
                'Compare initial 10 with frame 4 and which process is larger.',
              ),
            ),
          )}
      </>
    );
    return (
      <div className="geo-landscape-explorer">
        {(mission || panel === 0) && (
          <>
            <AssetImage id="nz-relief" mode={mode} compact />
            <NZOverview mode={mode} reveal selected="alps" />
            {mission &&
              choice(
                'mountain-map',
                t(
                  '南岛哪条山脉是本课对象？',
                  'Which South Island range is this case?',
                ),
                'alps',
                options([
                  ['alps', '南阿尔卑斯山脉', 'Southern Alps'],
                  ['taupo', '陶波火山区', 'Taupō volcanic area'],
                ]),
                t(
                  '南阿尔卑斯山沿南岛延伸；北岛火山区是另一个环境。',
                  'The Southern Alps extend along South Island; the North Island volcanic area is a different setting.',
                ),
                t(
                  '核对岛屿，再读高程图的图例。',
                  'Check the island and relief legend.',
                ),
              )}
          </>
        )}
        {(mission || panel === 1) && (
          <>
            {compression}
            <ObliqueMotion mode={mode} />
            {mission && (
              <>
                {choice(
                  'mountain-motion',
                  t(
                    '阿尔卑斯断层的运动包含什么？',
                    'What motion occurs at the Alpine Fault?',
                  ),
                  'oblique',
                  options([
                    [
                      'oblique',
                      '沿边界错动，也有挤压',
                      'Along-boundary slip plus compression',
                    ],
                    ['only', '只有纯粹平移', 'Pure sideways slip only'],
                  ]),
                  t(
                    '相对运动的两个分量，可使岩石变形、增厚与抬升。',
                    'Both components of relative motion can deform, thicken and uplift rocks.',
                  ),
                  t(
                    '上方视角箭头既沿边界，也朝向边界。',
                    'Plan-view arrows have both along-boundary and towards-boundary components.',
                  ),
                )}
                {choice(
                  'mountain-material',
                  t(
                    '不加熔岩，材料为什么能变厚？',
                    'Without adding lava, why can material thicken?',
                  ),
                  'thicken',
                  options([
                    [
                      'thicken',
                      '缩短、褶皱或断裂变形',
                      'Shortening, folding or faulting',
                    ],
                    [
                      'create',
                      '挤压凭空制造新岩石',
                      'Compression creates rock from nothing',
                    ],
                  ]),
                  t(
                    '挤压重新分配已有材料；类比矩形保持截面积不变。',
                    'Compression redistributes existing material; our rectangular analogy preserves its area.',
                  ),
                  t(
                    '比较矩形的宽与厚；材料没有凭空增加。',
                    'Compare width and thickness; material has not appeared from nowhere.',
                  ),
                )}
              </>
            )}
          </>
        )}
        {(mission || panel === 2) && budget}
        {status}
      </div>
    );
  }
  if (id === 'GEO-022') {
    if (mystery) return <AssetImage id="rock-metamorphic" mode={mode} />;
    const current = readRock(d['rock-current']);
    const assign = (edge: string, process: string) => {
      if (!rockProcesses.some((p) => p.id === process)) return;
      patch({ [`rock-edge-${edge}`]: process });
      setMessage(
        t(
          '箭头代表一个过程。若不合适，比较起点和终点状态，再放一次。',
          'An arrow represents a process. If it does not fit, compare its start/end states and place it again.',
        ),
      );
    };
    const travel = (p: RockProcess) => {
      const next = rockStep(current, p);
      if (!next) {
        setMessage(
          t(
            '这一步不适用于当前状态。冷却要从岩浆出发；压实胶结要先有松散沉积物；松散颗粒需先成岩再按本模型变质。',
            'This step does not apply to the current state. Cooling starts with magma; compaction/cementation needs loose sediment; in this model sediment is lithified before metamorphism.',
          ),
        );
        return;
      }
      patch({
        'rock-current': next,
        [`rock-used-${p}`]: 'yes',
        ...(current === 'igneous' && p === 'heat'
          ? { 'rock-shortcut': 'yes' }
          : {}),
      });
      setMessage(
        p === 'heat'
          ? t(
              '固态矿物重新组织；这一步没有熔化。你可以从火成岩直接到变质岩。',
              'Solid minerals reorganise without melting. Igneous rock can become metamorphic directly.',
            )
          : t(
              '跟踪的是物质经历的过程；不是同一块完整石头一直保持形状。',
              'We follow material through processes; one intact stone does not keep its shape throughout.',
            ),
      );
    };
    const network = (
      <>
        <RockNetwork mode={mode} current={current} reveal={!mission} />
        {mission && (
          <>
            <p>
              <Text
                mode={mode}
                text={t(
                  '先选一张过程卡，再点A–E箭头放置；也可拖放。',
                  'Select a process card, then click A–E to place it; dragging also works.',
                )}
              />
            </p>
            <div
              className="geo-choices"
              role="group"
              aria-label={words(mode, '过程卡', 'Process cards')}
            >
              {rockProcesses.map((p) => (
                <button
                  key={p.id}
                  draggable
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(p.id)}
                  onDragStart={(e) =>
                    e.dataTransfer.setData('text/plain', p.id)
                  }
                >
                  <Text mode={mode} text={t(p.zh, p.en)} />
                </button>
              ))}
            </div>
            <div className="geo-rock-edges">
              {rockEdges.map((edge) => {
                const from = rockStates.find((s) => s.id === edge.from)!,
                  to = rockStates.find((s) => s.id === edge.to)!,
                  assigned = rockProcesses.find(
                    (p) => p.id === d[`rock-edge-${edge.id}`],
                  );
                return (
                  <div key={edge.id}>
                    <button
                      className="geo-button secondary"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        assign(edge.id, e.dataTransfer.getData('text/plain'));
                      }}
                      onClick={() => {
                        if (selected) assign(edge.id, selected);
                        else
                          setMessage(
                            t(
                              '先选一张过程卡。',
                              'Select a process card first.',
                            ),
                          );
                      }}
                    >
                      <strong>{edge.id}</strong> ·{' '}
                      <Text
                        mode={mode}
                        text={t(
                          `${from.zh} → ${to.zh}`,
                          `${from.en} → ${to.en}`,
                        )}
                      />
                      {assigned && (
                        <Text mode={mode} text={t(assigned.zh, assigned.en)} />
                      )}
                    </button>
                    {assigned && (
                      <p role="status">
                        <Text
                          mode={mode}
                          text={
                            assigned.id === edge.process
                              ? t(
                                  '✓ 过程与前后状态相符。',
                                  '✓ Process fits both states.',
                                )
                              : t(
                                  '比较前后：是变碎、固态改变，还是变成熔体？',
                                  'Compare the states: breakup, solid change, or melt?',
                                )
                          }
                        />
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        <h4>
          <Text
            mode={mode}
            text={t(
              '物质旅行：试一条捷径，再走其他过程',
              'Material journey: try a shortcut and the other processes',
            )}
          />
        </h4>
        <p>
          <Text
            mode={mode}
            text={t(
              `当前：${rockStates.find((s) => s.id === current)!.zh}`,
              `Current: ${rockStates.find((s) => s.id === current)!.en}`,
            )}
          />
        </p>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '旅行操作', 'Journey actions')}
        >
          {rockProcesses.map((p) => (
            <button key={p.id} onClick={() => travel(p.id)}>
              <Text mode={mode} text={t(p.zh, p.en)} />{' '}
              {d[`rock-used-${p.id}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
          <button onClick={() => patch({ 'rock-current': 'igneous' })}>
            <Text
              mode={mode}
              text={t('回到火成岩起点', 'Return to igneous start')}
            />
          </button>
        </div>
        <p role="status">
          <Text mode={mode} text={message} />
        </p>
        <p>
          <Text
            mode={mode}
            text={t(
              `火成岩直接变质：${d['rock-shortcut'] === 'yes' ? '已观察' : '待观察'}`,
              `Direct igneous → metamorphic: ${d['rock-shortcut'] === 'yes' ? 'observed' : 'to explore'}`,
            )}
          />
        </p>
      </>
    );
    return (
      <div className="geo-landscape-explorer">
        {(mission || panel === 0) && (
          <div className="geo-rock-gallery">
            {['rock-granite', 'rock-sandstone', 'rock-metamorphic'].map(
              (asset) => (
                <AssetImage key={asset} id={asset} mode={mode} compact />
              ),
            )}
          </div>
        )}
        {(mission || panel > 0) && network}
        {mission && (
          <>
            {choice(
              'rock-solid',
              t(
                '变质过程与熔融的区别是什么？',
                'How does metamorphism differ from melting?',
              ),
              'solid',
              options([
                [
                  'solid',
                  '变质主要是固态改变',
                  'Metamorphism is solid-state change',
                ],
                [
                  'liquid',
                  '变质必先全部熔化',
                  'Metamorphism requires total melting',
                ],
              ]),
              t(
                '一旦有部分熔融，那一部分成为岩浆；剩下的岩石仍可能变质。',
                'A melted portion becomes magma, while remaining solid rock may still undergo metamorphism.',
              ),
              t(
                '重新观察热压卡和熔融卡，它们是不同箭头。',
                'Compare heat/pressure and melting cards: different arrows.',
              ),
            )}
            {choice(
              'rock-photo-limit',
              t(
                '能只靠颜色给所有岩石分类吗？',
                'Can colour alone classify every rock?',
              ),
              'origin',
              options([
                [
                  'origin',
                  '要结合结构、矿物与形成证据',
                  'Use texture, minerals and evidence of formation',
                ],
                ['colour', '同色一定同类型', 'Same colour means same type'],
              ]),
              t(
                '三类按形成方式分；照片线索支持调查，不能保证陌生石头的定名。',
                'The groups describe origins; photo clues guide investigation but cannot guarantee identification of an unknown rock.',
              ),
              t(
                '沉积层与变质条带可相像，颜色也不是独有标记。',
                'Sedimentary layers and metamorphic bands may look similar; colour is not unique.',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-023') {
    const frame = modelFrame(d['particle-frame'], 3),
      compare = modelFrame(d['compare-value'], 100);
    const revealCompare = (v: number) =>
      patch({
        'compare-value': String(v),
        ...([0, 50, 100].includes(v) ? { [`compare-seen-${v}`]: 'yes' } : {}),
      });
    const comparison = (
      <>
        <PadmaComparison mode={mode} value={compare} />
        <label>
          <Text
            mode={mode}
            text={t(
              '1988图显示比例（不是时间）',
              '1988 image reveal (not time)',
            )}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={compare}
            onChange={(e) => revealCompare(Number(e.target.value))}
          />
        </label>
        <div className="geo-choices">
          {[0, 50, 100].map((v) => (
            <button
              key={v}
              aria-pressed={compare === v}
              onClick={() => revealCompare(v)}
            >
              {words(
                mode,
                v === 0 ? '只看2018' : v === 100 ? '只看1988' : '左右对比',
                v === 0
                  ? '2018 only'
                  : v === 100
                    ? '1988 only'
                    : 'Side-by-side',
              )}{' '}
              {d[`compare-seen-${v}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
        </div>
      </>
    );
    if (mystery) return comparison;
    const particles = (
      <>
        <SurfaceParticles mode={mode} frame={frame} />
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '颗粒过程操作', 'Particle process actions')}
        >
          {surfaceProcesses.map((p, i) => (
            <button
              key={p.id}
              disabled={frame !== i}
              onClick={() =>
                patch({
                  'particle-frame': String(i + 1),
                  [`particle-seen-${i + 1}`]: 'yes',
                })
              }
            >
              <Text mode={mode} text={t(p.zh, p.en)} />{' '}
              {d[`particle-seen-${i + 1}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
          <button onClick={() => patch({ 'particle-frame': '0' })}>
            <Text
              mode={mode}
              text={t('重看岩块起点', 'Revisit bedrock start')}
            />
          </button>
        </div>
      </>
    );
    return (
      <div className="geo-landscape-explorer">
        {(mission || panel === 0) && (
          <>
            <AssetImage id="weathered-wall" mode={mode} compact />
            <p>
              <Text
                mode={mode}
                text={t(
                  '裂隙与植物可观察；这张照片没有证明所有裂隙都是植物或冰造成。',
                  'Cracks and plants are visible; the photograph does not establish that every crack was caused by roots or ice.',
                )}
              />
            </p>
          </>
        )}
        {(mission || panel === 1) && particles}
        {(mission || panel === 2) && comparison}
        {mission && (
          <>
            {surfaceProcesses.map((p, i) =>
              choice(
                `surface-${i + 1}`,
                t(
                  `第${i + 1}步：图中哪一过程？`,
                  `Step ${i + 1}: which process is shown?`,
                ),
                p.id,
                surfaceProcesses.map((s) => ({
                  id: s.id,
                  text: t(s.zh, s.en),
                })),
                t(
                  '看位置与形态：原地变碎→物质搬走→停下累积；真实景观中它们可以重叠。',
                  'Use location and form: breakup in place → movement → accumulation. Real landscapes may show them together.',
                ),
                t(
                  '先重看三个颗粒操作，再比较是否移动了位置。',
                  'Replay the three actions, noting whether particles change location.',
                ),
              ),
            )}
            {choice(
              'change-evidence',
              t(
                '帕德玛两张影像直接支持什么？',
                'What do the two Padma images directly support?',
              ),
              'bank',
              options([
                [
                  'bank',
                  '可见河岸与河道位置改变',
                  'Visible bank/channel positions changed',
                ],
                [
                  'freeze',
                  '证明每次变化都是冻融风化',
                  'Prove every change was freeze–thaw weathering',
                ],
              ]),
              t(
                '同范围前后位置提供变化证据；过程归因仍需流量、地质和时序等资料。',
                'Matched extents show positional change; causes require discharge, geology and a longer record.',
              ),
              t(
                '从影像能观察位置；地下、冰冻频次和全部原因没有被直接测出。',
                'Images show positions, not underground conditions, freezing frequency or all causes.',
              ),
            )}
            {choice(
              'weather-chemical',
              t(
                '雨水使某些矿物溶解或改变，属于什么？',
                'Water dissolves or alters some minerals: what is this?',
              ),
              'alter',
              options([
                [
                  'alter',
                  '化学风化；溶解物也可随后搬走',
                  'Chemical weathering; solutes may later be transported',
                ],
                [
                  'only',
                  '只要没有碎石就没有风化',
                  'No fragments means no weathering',
                ],
              ]),
              t(
                '风化既有物理破碎也有矿物化学改变；搬运可包含溶解物。',
                'Weathering includes physical breakup and chemical alteration; transport can include solutes.',
              ),
              t(
                '颗粒图仅画一种物理过程，不涵盖化学改变。',
                'The particle diagram shows one physical sequence, not all chemical changes.',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-024') {
    if (mystery) return <AssetImage id="river-meander" mode={mode} />;
    const order = readRiverOrder(d['river-order']);
    const current =
      riverSettings.find((s) => s.id === d['river-setting']) ??
      riverSettings[Math.min(panel, 2)]!;
    const settings = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '河道条件', 'Channel conditions')}
        >
          {riverSettings.map((s) => (
            <button
              key={s.id}
              aria-pressed={s.id === current.id}
              onClick={() =>
                patch({ 'river-setting': s.id, [`river-seen-${s.id}`]: 'yes' })
              }
            >
              <Text mode={mode} text={t(s.zh, s.en)} />{' '}
              {d[`river-seen-${s.id}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
        </div>
        <RiverSetting mode={mode} setting={current.id} />
        {mission &&
          riverSettings.map((s) =>
            choice(
              `river-outcome-${s.id}`,
              t(
                `${s.zh}：可能突出哪种形态／过程？`,
                `${s.en}: which form/process may be prominent?`,
              ),
              s.outcome,
              options([
                ['incision', '向下侵蚀、窄谷', 'Incision / narrow valley'],
                [
                  'meander',
                  '单一河道发展弯曲',
                  'Single channel develops bends',
                ],
                [
                  'braided',
                  '分叉重汇、砂砾洲',
                  'Split/rejoin channels, gravel bars',
                ],
              ]),
              t(
                '这是条件支持的可能结果；不是仅凭坡度给真实河流定型。',
                'These conditions support a possible result; slope alone does not classify a real river.',
              ),
              t(
                '把坡度、河岸和沉积物供应一起比较。',
                'Compare slope, banks and sediment supply together.',
              ),
            ),
          )}
      </>
    );
    return (
      <div className="geo-landscape-explorer">
        {mission ? (
          <>
            <p className="geo-notice">
              <Text
                mode={mode}
                text={t(
                  '为一条虚构河流排序：A→B→C的相连河道高程是300→100→0任意单位，水沿降低的方向流。照片来自三个不同地点，只作形态参照；坎特伯雷图不是C点河口的照片。',
                  'Order a fictional connected river: A→B→C elevations are 300→100→0 arbitrary units; water follows the fall. Photos from three different places illustrate forms. Canterbury is not a photograph of outlet C.',
                )}
              />
            </p>
            <ol className="geo-river-sort">
              {order.map((key, i) => {
                const card = riverCards.find((c) => c.id === key)!;
                return (
                  <li key={key}>
                    <h4>
                      {i + 1}. <Text mode={mode} text={t(card.zh, card.en)} />
                    </h4>
                    <AssetImage id={card.asset} mode={mode} compact />
                    <div className="geo-choices">
                      <button
                        disabled={i === 0}
                        onClick={() =>
                          patch({
                            'river-order': moveRiverCard(order, key, -1).join(
                              ',',
                            ),
                            'river-order-checked': '',
                          })
                        }
                      >
                        <Text
                          mode={mode}
                          text={t('向源头移动 ↑', 'Move towards source ↑')}
                        />
                      </button>
                      <button
                        disabled={i === 2}
                        onClick={() =>
                          patch({
                            'river-order': moveRiverCard(order, key, 1).join(
                              ',',
                            ),
                            'river-order-checked': '',
                          })
                        }
                      >
                        <Text
                          mode={mode}
                          text={t('向出口移动 ↓', 'Move towards outlet ↓')}
                        />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
            <button
              className="geo-button secondary"
              onClick={() => {
                const right = order.join(',') === 'gorge,meander,plain';
                patch({
                  'river-order': order.join(','),
                  'river-order-checked': right ? 'yes' : '',
                });
                setMessage(
                  right
                    ? t(
                        '✓ 这条虚构河道按相连高程降低排列。接着检验条件和反例。',
                        '✓ This fictional connected channel follows falling elevation. Now test conditions and exceptions.',
                      )
                    : t(
                        '核对A、B、C相连点的高程，不要按照片颜色排序。',
                        'Use the connected elevations A, B and C rather than photo colour.',
                      ),
                );
              }}
            >
              <Text
                mode={mode}
                text={t('核对这条虚构旅程', 'Check this fictional journey')}
              />
            </button>
            <p role="status">
              <Text mode={mode} text={message} />
            </p>
          </>
        ) : (
          <AssetImage
            id={
              panel === 0
                ? 'river-gorge'
                : panel === 1
                  ? 'river-meander'
                  : 'canterbury-fields'
            }
            mode={mode}
            compact
          />
        )}
        {settings}
        {mission && (
          <>
            {choice(
              'river-speed',
              t(
                '向下游一定越来越慢吗？',
                'Must water become slower downstream?',
              ),
              'depends',
              options([
                [
                  'depends',
                  '不一定；流量、坡度与河道形状共同影响',
                  'Not necessarily: discharge, slope and channel shape matter',
                ],
                [
                  'always',
                  '一定，离源头远就慢',
                  'Always; distance from source sets speed',
                ],
              ]),
              t(
                '较缓坡不等于一定较慢；下游汇入水量多，河道也可能更深、更高效。',
                'Gentler slope does not guarantee lower velocity; added discharge and a deeper, more efficient channel may offset it.',
              ),
              t(
                '本模型画形态，没有测量流速，不能用图定速度。',
                'Our forms contain no measured velocities; they cannot establish speed.',
              ),
            )}
            {choice(
              'river-photo-limit',
              t(
                '三张照片能证明同一河流的标准三段吗？',
                'Do these three photos prove one river’s standard three reaches?',
              ),
              'different',
              options([
                [
                  'different',
                  '不能，地点不同；峡谷与曲流都可在不同河段出现',
                  'No: different places; gorges and bends can occur in various reaches',
                ],
                [
                  'same',
                  '可以，每条河必按三张照片改变',
                  'Yes: every river must follow these photos',
                ],
              ]),
              t(
                '新河峡谷并非源头照片；阿拉斯加曲流周围也有山，坎特伯雷平原可见辫状河道。',
                'New River Gorge is not a headwater photograph; Alaska’s bends sit among mountains, and Canterbury’s plain includes braided channels.',
              ),
              t(
                '读每张来源与地名，再看周围地形。',
                'Read the source/place names and surrounding relief.',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  return null;
}
