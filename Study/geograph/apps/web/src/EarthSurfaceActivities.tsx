import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, words } from './content';
import { AssetImage, Text } from './ui';
import type { ActivityState } from './progress';
import { modelFrame } from './geologyModels';
import {
  beachCases,
  bendGeometry,
  earthSurfaceFinished,
  glacierCases,
  moveSoilLayer,
  readSoilOrder,
  soilLayers,
  type SurfaceLabel,
} from './earthSurfaceModels';
import {
  BeachBudget,
  BendDiagram,
  CoastalDrift,
  IceFlow,
  SoilPoreDiagram,
  SoilProfile,
  ValleySections,
} from './EarthSurfaceVisuals';

export function EarthSurfaceExplorer({
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
  const d = state.decisions,
    patch = (changes: Record<string, string>) =>
      onChange({ ...state, decisions: { ...d, ...changes } });
  const [selected, setSelected] = useState<SurfaceLabel | ''>('');
  const [message, setMessage] = useState(
    t(
      '先操作、比较，再把变化连接到过程。',
      'Act, compare, then connect change with process.',
    ),
  );
  const optionRows = (rows: [string, string, string][]) =>
    rows.map(([key, zh, en]) => ({ id: key, text: t(zh, en) }));
  const choice = (
    key: string,
    prompt: LocalizedText,
    correct: string,
    rows: [string, string, string][],
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
        {optionRows(rows).map((o) => (
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
  const frames = (
    prefix: string,
    value: number,
    max: number,
    update: (n: number) => void,
    label: LocalizedText,
    stops = [0, max],
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
        {stops.map((n) => (
          <button key={n} aria-pressed={value === n} onClick={() => update(n)}>
            {prefix === 'pore-seen'
              ? words(mode, `水量 ${n}`, `Water ${n}`)
              : words(mode, `帧 ${n}`, `Frame ${n}`)}{' '}
            {d[`${prefix}-${n}`] === 'yes' ? '✓' : ''}
          </button>
        ))}
      </div>
    </div>
  );
  const status = mission && (
    <p
      role="status"
      className={`geo-feedback ${earthSurfaceFinished(id, d) ? 'success' : ''}`}
    >
      <Text
        mode={mode}
        text={
          earthSurfaceFinished(id, d)
            ? t(
                '✓ 任务证据齐全。用自己的话解释一条因果关系和一个局限。',
                '✓ Mission evidence complete. Explain one causal link and one limit in your own words.',
              )
            : message
        }
      />
    </p>
  );
  if (id === 'GEO-025') {
    if (mystery) return <AssetImage id="river-meander" mode={mode} />;
    const frame = modelFrame(d['bend-frame'], 4),
      high = d['flood-level'] === 'high';
    const labelSite = (site: string) => {
      if (!selected) {
        setMessage(
          t(
            '先选“侵蚀”“沉积”或“洪泛平原”，再点地图上的字母。',
            'Choose erosion, deposition or floodplain, then click a letter on the map.',
          ),
        );
        return;
      }
      patch({ [`bend-${site}`]: selected });
      const target = bendGeometry(frame).sites.find((s) => s.id === site)!;
      setMessage(
        selected === target.correct
          ? t(
              '✓ 看相对弯道位置：外侧常侵蚀、内侧常沉积；C是邻近低平地面。',
              '✓ Use relative bend position: outer banks commonly erode, inner bars deposit; C is adjacent low ground.',
            )
          : t(
              '从河道中心看内外弯：向弯曲凸出的外侧找侵蚀，向弯道内部找沉积；不是总按图的左或右。',
              'Use the bend itself, not page left/right: the outer convex bank tends to erode; the inside tends to deposit.',
            ),
      );
    };
    const model = (
      <>
        {mission && (
          <div
            className="geo-choices"
            role="group"
            aria-label={words(mode, '选择标注工具', 'Choose a label tool')}
          >
            {optionRows([
              ['erode', '侵蚀侧', 'Erosion side'],
              ['deposit', '沉积侧', 'Deposition side'],
              ['plain', '洪泛平原', 'Floodplain'],
            ]).map((o) => (
              <button
                key={o.id}
                aria-pressed={selected === o.id}
                onClick={() => setSelected(o.id as SurfaceLabel)}
              >
                <Text mode={mode} text={o.text} />
              </button>
            ))}
          </div>
        )}
        <BendDiagram
          mode={mode}
          frame={frame}
          high={high}
          assignments={mission ? d : {}}
          onSite={mission ? labelSite : undefined}
        />
        {frames(
          'bend-seen',
          frame,
          4,
          (n) => patch({ 'bend-frame': String(n), [`bend-seen-${n}`]: 'yes' }),
          t(
            '侧向迁移示意帧（不是年份）',
            'Lateral migration frame (not years)',
          ),
          [0, 2, 4],
        )}
        {mission && (
          <div
            className="geo-choices"
            role="group"
            aria-label={words(
              mode,
              '地图标注按钮替代',
              'Map label button alternatives',
            )}
          >
            {bendGeometry(frame).sites.map((s) => (
              <button key={s.id} onClick={() => labelSite(s.id)}>
                {words(mode, `标注 ${s.id} 点`, `Label site ${s.id}`)}{' '}
                {d[`bend-${s.id}`] === s.correct ? '✓' : ''}
              </button>
            ))}
          </div>
        )}
        {mission && (
          <p className="geo-feedback" role="status">
            <Text mode={mode} text={message} />
          </p>
        )}
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '比较河流水位', 'Compare river levels')}
        >
          {['normal', 'high'].map((k) => (
            <button
              key={k}
              aria-pressed={d['flood-level'] === k}
              onClick={() =>
                patch({ 'flood-level': k, [`flood-seen-${k}`]: 'yes' })
              }
            >
              <Text
                mode={mode}
                text={
                  k === 'normal'
                    ? t('普通水位', 'Ordinary water')
                    : t('高水位', 'High water')
                }
              />{' '}
              {d[`flood-seen-${k}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
        </div>
      </>
    );
    if (!mission)
      return panel === 0 ? (
        <>
          <AssetImage id="river-meander" mode={mode} />
          {model}
        </>
      ) : (
        model
      );
    return (
      <div className="geo-landscape-activity">
        {model}
        {choice(
          'bend-change',
          t(
            '两帧间最直接看见什么变化？',
            'What change is directly visible between frames?',
          ),
          'lateral',
          [
            [
              'lateral',
              '河道向两侧迁移，内外弯角色相对而定',
              'Lateral channel migration; roles depend on the bend',
            ],
            ['disappear', '侵蚀的物质凭空消失', 'Eroded material vanishes'],
          ],
          t(
            '图中弯道变大、两侧位置改变；真实速度和来源要另取证。',
            'Bends grow and banks shift here; actual rates and sources need separate evidence.',
          ),
          t(
            '比较A与D的方向，它们不是图上同一侧。',
            'Compare A and D: they are not on the same page side.',
          ),
        )}
        {choice(
          'flood-limit',
          t(
            '普通水位时C干燥，能证明什么？',
            'C is dry at ordinary water: what can we conclude?',
          ),
          'possible',
          [
            [
              'possible',
              '此刻未淹没，但较高水位时可能漫水',
              'Dry now, but may inundate at higher water',
            ],
            ['safe', 'C永远不会淹水', 'C can never flood'],
          ],
          t(
            '洪泛平原是可能受洪水影响的地面；示意不是实际风险图。',
            'A floodplain can inundate; this schematic is not an actual risk map.',
          ),
          t(
            '再点高水位，区分“现在”和“可能”。',
            'Try high water; distinguish “now” from “possible”.',
          ),
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-026') {
    if (mystery) return <AssetImage id="glacier-pedersen" mode={mode} />;
    const active = d['valley-view'] === 'glacier' ? 'glacier' : 'river';
    const c =
        glacierCases.find((r) => r.id === d['ice-case']) ?? glacierCases[0],
      frame = modelFrame(d['ice-frame'], 4);
    const sections = (
      <>
        <ValleySections mode={mode} active={active} />
        <div
          className="geo-choices"
          role="group"
          aria-label={words(
            mode,
            '比较谷地横剖面',
            'Compare valley cross sections',
          )}
        >
          {(['river', 'glacier'] as const).map((k) => (
            <button
              key={k}
              aria-pressed={active === k}
              onClick={() =>
                patch({ 'valley-view': k, [`valley-seen-${k}`]: 'yes' })
              }
            >
              <Text
                mode={mode}
                text={
                  k === 'river'
                    ? t('聚焦河谷', 'Focus river valley')
                    : t('聚焦冰川谷', 'Focus glacial valley')
                }
              />{' '}
              {d[`valley-seen-${k}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
        </div>
      </>
    );
    const flow = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '冰川末端情景', 'Glacier front scenarios')}
        >
          {glacierCases.map((k) => (
            <button
              key={k.id}
              aria-pressed={c.id === k.id}
              onClick={() =>
                patch({
                  'ice-case': k.id,
                  'ice-frame': '0',
                  [`ice-seen-${k.id}-0`]: 'yes',
                })
              }
            >
              <Text mode={mode} text={t(k.zh, k.en)} />
            </button>
          ))}
        </div>
        <IceFlow mode={mode} kind={c.id} frame={frame} />
        {frames(
          `ice-seen-${c.id}`,
          frame,
          4,
          (n) =>
            patch({ 'ice-frame': String(n), [`ice-seen-${c.id}-${n}`]: 'yes' }),
          t('追踪冰内红点与末端', 'Track the red ice marker and front'),
          [0, 2, 4],
        )}
      </>
    );
    if (!mission)
      return panel === 0 ? (
        <>
          <AssetImage id="glacier-pedersen" mode={mode} />
          <AssetImage id="glacier-u-valley" mode={mode} />
        </>
      ) : panel === 1 ? (
        sections
      ) : (
        flow
      );
    return (
      <div className="geo-landscape-activity">
        {sections}
        {(['river', 'glacier'] as const).map((k) =>
          choice(
            `valley-${k}`,
            k === 'river'
              ? t(
                  '本例河谷的横剖面？',
                  'Cross section of this river-valley example?',
                )
              : t(
                  '本例冰川谷的横剖面？',
                  'Cross section of this glacial-valley example?',
                ),
            k === 'river' ? 'V' : 'U',
            [
              ['V', 'V形：底部较窄', 'V: narrow floor'],
              ['U', 'U形：底部较宽、壁较陡', 'U: broad floor, steep walls'],
            ],
            t(
              '比较底宽与谷壁，字母只是概括，不是每个谷地的模板。',
              'Compare floor width and walls; letters summarise, not dictate every valley.',
            ),
            t(
              '看两张横剖面的底部，不要把俯视的弯道当横剖面。',
              'Inspect cross-section floors; a plan-view bend is a different view.',
            ),
          ),
        )}
        {flow}
        {glacierCases.map((k) =>
          choice(
            `ice-front-${k.id}`,
            t(
              `情景“${k.zh}”：末端会怎样？`,
              `Scenario “${k.en}”: what happens to the front?`,
            ),
            k.id,
            [
              ['advance', '推进', 'Advance'],
              ['balance', '近似不变', 'Approximately stationary'],
              ['retreat', '退缩', 'Retreat'],
            ],
            t(
              '比较末端与虚线；图的末端变化并不等于冰内颗粒方向。',
              'Compare the front with the dashed initial line; front change differs from ice motion.',
            ),
            t(
              '先打开该情景，查看起点和帧4，分开看末端与红点。',
              'Open that scenario, inspect start/frame4, and track front and red dot separately.',
            ),
          ),
        )}
        {choice(
          'ice-motion',
          t(
            '退缩情景中红点的运动？',
            'In the retreat scenario, how does the red marker move?',
          ),
          'down',
          [
            [
              'down',
              '仍向谷下；末端因损失而后退',
              'Still down-valley; losses shift the front back',
            ],
            ['up', '随末端向山上流', 'Flows uphill with the retreating front'],
          ],
          t(
            '冰的形变、滑动让它向下流；末端位置取决于补给与损失。',
            'Deformation/sliding moves ice down-valley; delivery/loss controls the front.',
          ),
          t(
            '看红点箭头，而不是只看冰川边缘。',
            'Follow the red-dot arrow, not just the ice edge.',
          ),
        )}
        {choice(
          'ice-work',
          t('冰川怎样参与拓宽谷地？', 'How can a glacier broaden a valley?'),
          'abrasion',
          [
            [
              'abrasion',
              '运动的冰与夹带岩石磨蚀、拔蚀谷底和谷壁',
              'Moving ice/debris abrades and plucks bed and walls',
            ],
            [
              'melt',
              '只需冰静止融化，整个岩谷便自动变U形',
              'Stationary melting alone makes the whole rock valley U-shaped',
            ],
          ],
          t(
            '流动与夹带碎屑能磨蚀，冰也能拔走裂隙岩块；侵蚀不只是融水。',
            'Flow/debris abrades; ice can pluck jointed rock. Erosion is not just meltwater.',
          ),
          t(
            '区分冰的消融与岩石被磨走、拔走。',
            'Distinguish ice melting from rock abrasion/plucking.',
          ),
        )}
        {choice(
          'valley-limit',
          t(
            'U形谷里现在有河流，说明什么？',
            'A river now occupies a U valley. What follows?',
          ),
          'history',
          [
            [
              'history',
              '现在河流可占据旧冰川谷，仍须核对形成历史',
              'A river may occupy an old glacial valley; check history',
            ],
            [
              'river',
              '现在有河就证明从未有冰川',
              'A current river proves glaciers were never present',
            ],
          ],
          t(
            '现在的水体不等于过去的雕刻者；谷形是线索，还要多种证据。',
            'Present water does not identify past carving; valley shape is one of several clues.',
          ),
          t(
            '看看没有现存冰川的Avalanche Lake谷地照片。',
            'Look at the photographed Avalanche Lake valley without an active valley glacier.',
          ),
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-027') {
    if (mystery) return <AssetImage id="coast-stacks" mode={mode} />;
    const direction = d['drift-direction'] === 'left' ? 'left' : 'right',
      step = modelFrame(d['drift-step'], 8);
    const budgetCase =
      beachCases.find((c) => c.id === d['beach-case']) ?? beachCases[0];
    const transport = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '改变波浪入射方向', 'Change wave approach')}
        >
          {(['right', 'left'] as const).map((k) => (
            <button
              key={k}
              aria-pressed={direction === k}
              onClick={() =>
                patch({
                  'drift-direction': k,
                  'drift-step': '0',
                  [`drift-seen-${k}-0`]: 'yes',
                })
              }
            >
              <Text
                mode={mode}
                text={
                  k === 'right'
                    ? t('从左侧斜向来浪', 'Waves oblique from left')
                    : t('从右侧斜向来浪', 'Waves oblique from right')
                }
              />
            </button>
          ))}
        </div>
        <CoastalDrift mode={mode} direction={direction} step={step} />
        {frames(
          `drift-seen-${direction}`,
          step,
          8,
          (n) =>
            patch({
              'drift-step': String(n),
              [`drift-seen-${direction}-${n}`]: 'yes',
            }),
          t(
            '追踪一次沙粒路线（不是时钟）',
            'Track one grain route (not a clock)',
          ),
          [0, 2, 4, 6, 8],
        )}
      </>
    );
    const budgets = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '沙滩泥沙收支', 'Beach sediment budgets')}
        >
          {beachCases.map((c) => (
            <button
              key={c.id}
              aria-pressed={budgetCase.id === c.id}
              onClick={() =>
                patch({ 'beach-case': c.id, [`beach-seen-${c.id}`]: 'yes' })
              }
            >
              <Text mode={mode} text={t(c.zh, c.en)} />{' '}
              {d[`beach-seen-${c.id}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
        </div>
        <BeachBudget mode={mode} kind={budgetCase.id} />
      </>
    );
    const gallery = (
      <div className="geo-rock-gallery">
        {['coast-bluff', 'coast-beach', 'coast-stacks'].map((asset) => (
          <AssetImage key={asset} id={asset} mode={mode} />
        ))}
      </div>
    );
    if (!mission)
      return panel === 0 ? gallery : panel === 1 ? transport : budgets;
    return (
      <div className="geo-landscape-activity">
        {gallery}
        {choice(
          'coast-cliff',
          t(
            '波浪侵蚀岸坡照片更直接提示？',
            'What does the wave-cut scarp most directly suggest?',
          ),
          'erode',
          [
            [
              'erode',
              '侵蚀与坡体移动能使陡岸改变',
              'Erosion and slope movement reshape a steep bank',
            ],
            [
              'deposit',
              '新沙粒堆成了全部陡岸',
              'New sand built the entire steep bank',
            ],
          ],
          t(
            '波浪可带走物质，岸坡也受风化和重力作用；照片没有年速率。',
            'Waves remove material; weathering and gravity affect slopes too. No annual rate is shown.',
          ),
          t(
            '看裸露岸坡、层次和水边界，别把侵蚀遗留形态当新堆积。',
            'Inspect the exposed slope/layers; erosional remnants are not new deposits.',
          ),
        )}
        {choice(
          'coast-beach',
          t('沙滩材料积累属于？', 'Accumulation of beach material is…'),
          'deposit',
          [
            [
              'deposit',
              '沉积，但也可能有同时搬走的沙',
              'Deposition, alongside possible sand removal',
            ],
            ['none', '只有侵蚀，没有任何沉积', 'Erosion only; no deposition'],
          ],
          t(
            '沉积是材料留下；判断整段净变化还要比较进入与离开。',
            'Deposition leaves material; net change needs inputs and outputs.',
          ),
          t(
            '想想库存盒：有沙进入并不代表总库存必增加。',
            'In the stock box, incoming sand alone does not ensure a net gain.',
          ),
        )}
        {choice(
          'coast-stack',
          t(
            '孤立海蚀柱更合理的解释？',
            'A more plausible explanation of an isolated sea stack?',
          ),
          'remnant',
          [
            [
              'remnant',
              '周围岩体被侵蚀后留下的岩石遗体',
              'A rock remnant after surrounding material eroded',
            ],
            [
              'sand',
              '每根都是今天新堆起的沙丘',
              'Each is a new sand dune formed today',
            ],
          ],
          t(
            '耐蚀差异与裂隙可留下岩柱；海蚀拱塌顶也可能成柱，但非每柱必经过同一顺序。',
            'Resistance/joints can leave stacks; an arch may collapse into a stack, but no single sequence is compulsory.',
          ),
          t(
            '观察柱状岩体，区别坚硬岩石遗留与松沙堆积。',
            'Distinguish a rock remnant from a loose-sand deposit.',
          ),
        )}
        {transport}
        {(['right', 'left'] as const).map((k) =>
          choice(
            `drift-net-${k}`,
            k === 'right'
              ? t(
                  '左侧斜来浪：本例净搬运？',
                  'Oblique waves from left: net transport here?',
                )
              : t(
                  '右侧斜来浪：本例净搬运？',
                  'Oblique waves from right: net transport here?',
                ),
            k,
            [
              ['right', '沿岸向右 →', 'Alongshore right →'],
              ['left', '沿岸向左 ←', 'Alongshore left ←'],
            ],
            t(
              '比较起点与终点的沿岸位置；往返中也有净位移。',
              'Compare alongshore start/end; back-and-forth motion can give net displacement.',
            ),
            t(
              '改变来浪方向后重看帧0与8。',
              'Change wave approach and compare frames 0/8.',
            ),
          ),
        )}
        {budgets}
        {beachCases.map((c) =>
          choice(
            `beach-${c.id}`,
            t(`原有6，${c.zh}：净结果？`, `Initially 6, ${c.en}: net result?`),
            c.id,
            [
              ['gain', '库存增加', 'Stock increases'],
              ['stable', '库存相当', 'Stock unchanged'],
              ['loss', '库存减少', 'Stock decreases'],
            ],
            t(
              '库存＝原有＋进入−离开。每单位是示意，不等于真实宽度或体积。',
              'Stock = initial + in − out. Units are illustrative, not measured width/volume.',
            ),
            t(
              '同时核对进入和离开；不是只看一条箭头。',
              'Check both in and out, not just one arrow.',
            ),
          ),
        )}
        {choice(
          'coast-limit',
          t(
            '一张宽沙滩照片能确认它一直加宽吗？',
            'Can one wide-beach photo prove continual widening?',
          ),
          'budget',
          [
            [
              'budget',
              '不能，还需同范围时序、潮位和泥沙收支',
              'No: need matched dates, tide and sediment budget',
            ],
            ['wide', '能，沙滩宽就永远增长', 'Yes: a wide beach always grows'],
          ],
          t(
            '单张状态没有告诉变化方向；季节、潮位和事件都重要。',
            'One state does not reveal a trend; seasons, tides and events matter.',
          ),
          t('试试“进入1，离开3”的库存盒。', 'Try the “1 in, 3 out” stock box.'),
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-028') {
    if (mystery) return <AssetImage id="soil-tundra" mode={mode} />;
    const order = readSoilOrder(d['soil-order']),
      water = modelFrame(d['pore-water'], 50);
    const profile = (
      <SoilProfile
        mode={mode}
        order={mission ? order.join(',') : undefined}
        draft={mission && d['soil-checked'] !== 'yes'}
      />
    );
    const pores = (
      <>
        <SoilPoreDiagram mode={mode} water={water} />
        {frames(
          'pore-seen',
          water,
          50,
          (n) => patch({ 'pore-water': String(n), [`pore-seen-${n}`]: 'yes' }),
          t(
            '向固定孔隙加水（示意体积单位）',
            'Add water to fixed pores (illustrative volume units)',
          ),
          [0, 25, 50],
        )}
      </>
    );
    if (!mission)
      return panel === 0 ? (
        <>
          <AssetImage id="soil-tundra" mode={mode} />
          {profile}
        </>
      ) : panel === 1 ? (
        pores
      ) : (
        <>
          <AssetImage id="canterbury-fields" mode={mode} />
          <p>
            <Text
              mode={mode}
              text={t(
                '田地影像显示植被与土地利用，不能测出有机质、养分或土壤健康。土壤形成还受母质、气候、生物、地形和时间共同影响；生命可分解残体、循环养分、形成孔隙。',
                'The field image shows vegetation/land use, not measured organic matter, nutrients or soil health. Parent material, climate, organisms, relief and time jointly form soils; life decomposes residues, cycles nutrients and forms pores.',
              )}
            />
          </p>
        </>
      );
    return (
      <div className="geo-landscape-activity">
        <p>
          <Text
            mode={mode}
            text={t(
              '搭建指定的一个O–A–B–C–R实例；不是给苔原照片定层，也不是所有土壤必须这样。',
              'Build this specified O–A–B–C–R example, without identifying the tundra photo or prescribing all soils.',
            )}
          />
        </p>
        {profile}
        <ol className="geo-river-sort">
          {order.map((layer, i) => {
            const l = soilLayers.find((k) => k.id === layer)!;
            return (
              <li key={layer}>
                <strong>
                  {layer} · <Text mode={mode} text={t(l.zh, l.en)} />
                </strong>
                <div className="geo-choices">
                  <button
                    disabled={i === 0}
                    aria-label={words(
                      mode,
                      `${layer}层向上移动`,
                      `Move ${layer} layer up`,
                    )}
                    onClick={() =>
                      patch({
                        'soil-order': moveSoilLayer(order, layer, -1).join(','),
                        'soil-checked': 'no',
                      })
                    }
                  >
                    ↑ {words(mode, '向上', 'Up')}
                  </button>
                  <button
                    disabled={i === 4}
                    aria-label={words(
                      mode,
                      `${layer}层向下移动`,
                      `Move ${layer} layer down`,
                    )}
                    onClick={() =>
                      patch({
                        'soil-order': moveSoilLayer(order, layer, 1).join(','),
                        'soil-checked': 'no',
                      })
                    }
                  >
                    ↓ {words(mode, '向下', 'Down')}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
        <button
          className="geo-button secondary"
          onClick={() => {
            const correct = order.join(',') === 'O,A,B,C,R';
            patch({
              'soil-order': order.join(','),
              'soil-checked': correct ? 'yes' : 'no',
            });
            setMessage(
              correct
                ? t(
                    '✓ 本例层次核对完成；R不是土壤，C母质不一定来自其下基岩。',
                    '✓ Example checked. R is not soil; C need not originate from underlying bedrock.',
                  )
                : t(
                    '从有机残体O到表层矿质土A、下层土B、较少改变母质C，最后是非土壤的R。用上下按钮重搭。',
                    'Use the example: organic O → mineral topsoil A → subsoil B → less-altered C → non-soil R. Rebuild with up/down buttons.',
                  ),
            );
          }}
        >
          {words(mode, '核对我的土层模型', 'Check my soil-layer model')}
        </button>
        {d['soil-checked'] !== undefined && (
          <p
            className={`geo-feedback ${d['soil-checked'] === 'yes' ? 'success' : ''}`}
            role="status"
          >
            <Text
              mode={mode}
              text={
                d['soil-checked'] === 'yes'
                  ? t(
                      '✓ 本例层次核对完成；R不是土壤，C母质不一定来自其下基岩。',
                      '✓ Example checked. R is not soil; C need not originate from underlying bedrock.',
                    )
                  : t(
                      '本例需要O→A→B→C→R。用上下按钮重搭，再核对；不同真实土壤未必有这套层序。',
                      'This example requires O→A→B→C→R. Rebuild with up/down buttons, then check; real soils need not share this sequence.',
                    )
              }
            />
          </p>
        )}
        {pores}
        {['mineral', 'organic', 'water', 'air'].map((k, i) =>
          choice(
            `soil-component-${k}`,
            [
              t(
                '图例中浅棕45单位是什么？',
                'What are the tan 45 legend units?',
              ),
              t('深色5单位是什么？', 'What are the dark 5 legend units?'),
              t('蓝色孔隙部分是什么？', 'What is the blue pore portion?'),
              t('白色孔隙部分是什么？', 'What is the white pore portion?'),
            ][i]!,
            k,
            [
              ['mineral', '矿物颗粒', 'Mineral particles'],
              ['organic', '有机质', 'Organic matter'],
              ['water', '水', 'Water'],
              ['air', '空气', 'Air'],
            ],
            t(
              '这是固定孔隙矿质土样的图例；比例是人为选定，真实土样要检测。',
              'Read this fixed-pore sample’s legend; proportions are invented and real samples need testing.',
            ),
            t(
              '对照颜色与名称；孔隙不是新的石粒。',
              'Match colour and name; pores are not extra mineral grains.',
            ),
          ),
        )}
        {choice(
          'soil-air',
          t(
            '本盒水从0增加到50，空气怎样？',
            'In this box water rises from 0 to 50: air…',
          ),
          'less',
          [
            [
              'less',
              '减少到0；水占据了同一孔隙',
              'Falls to 0 as water fills the same pores',
            ],
            [
              'same',
              '仍保持50，体积凭空增加',
              'Stays 50 with extra volume from nowhere',
            ],
          ],
          t(
            '同一固定孔隙里水与空气共享空间；现实排水、结构和根系状态还需另看。',
            'Water/air share fixed pore space here; real drainage, structure and roots need further evidence.',
          ),
          t(
            '比较三个水量按钮与白色格子数。',
            'Compare the three water settings and white squares.',
          ),
        )}
        {choice(
          'soil-parent',
          t(
            'C母质只能来自其正下方R吗？',
            'Must C originate only from the R directly below?',
          ),
          'transported',
          [
            [
              'transported',
              '不一定，也可能是河流沉积、风吹物或火山灰',
              'No: river sediment, wind deposits or ash are possible',
            ],
            [
              'below',
              '一定，土壤不能在搬来的材料上形成',
              'Yes: soil cannot form on transported material',
            ],
          ],
          t(
            '成土母质有原地也有搬来；字母C表达较少受成土作用改变，并不保证出处。',
            'Parent material may be local or transported; C denotes less soil-altered material, not a guaranteed origin.',
          ),
          t(
            '回想河流沉积与新西兰火山灰。',
            'Recall river deposits and New Zealand volcanic ash.',
          ),
        )}
        {choice(
          'soil-plant',
          t(
            '没有土壤，植物有没有可能生长？',
            'Can plants ever grow without soil?',
          ),
          'supplied',
          [
            [
              'supplied',
              '水培可人为提供水、养分、氧与支撑；自然土壤有多重作用',
              'Hydroponics supplies water, nutrients, oxygen/support; natural soil has many roles',
            ],
            [
              'never',
              '任何植物都绝不可能无土生长',
              'No plant can ever grow without soil',
            ],
          ],
          t(
            '土壤是自然生长的重要环境；水培的例外仍需满足根与植物需求。',
            'Soil is a major natural growth medium; hydroponics still must meet plant/root needs.',
          ),
          t(
            '区分“不用土”与“不需要水、养分和根系氧气”。',
            'Distinguish “no soil” from “no water, nutrients or root oxygen”.',
          ),
        )}
        {choice(
          'soil-photo',
          t(
            '深色土层能单独证明健康与肥力吗？',
            'Does a dark layer alone prove soil health/fertility?',
          ),
          'tests',
          [
            [
              'tests',
              '不能，需结构、养分、pH和生命等多项证据',
              'No: need structure, nutrients, pH and biological evidence',
            ],
            [
              'colour',
              '能，只看颜色便能给农场下结论',
              'Yes: colour alone settles a farm assessment',
            ],
          ],
          t(
            '颜色是线索；真实健康与适用性要比较多项性质，不能套用示意配方。',
            'Colour is a clue; health/suitability uses multiple properties, not a schematic recipe.',
          ),
          t(
            '照片没显示养分检测或土层中的全部孔隙。',
            'The photo does not supply nutrient tests or every pore.',
          ),
        )}
        {status}
      </div>
    );
  }
  return null;
}
