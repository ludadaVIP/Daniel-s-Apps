import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ActivityState } from './progress';
import { t, words } from './content';
import { Text, AssetImage } from './ui';
import {
  WaterNetwork,
  RainPartition,
  CurrentMap,
  OceanTemperature,
  HeatTransport,
  NZBoundaryMap,
} from './WaterEarthVisuals';
import {
  waterNodes,
  waterEdges,
  waterJourneys,
  readWaterRoute,
  waterMove,
  currentCases,
  nzSegments,
  nzQuakes,
  ocean,
  waterEarthFinished,
} from './waterEarthModels';
import { modelFrame } from './geologyModels';
import {
  LandformReportEditor,
  LandformReportPreview,
} from './LandformReportEditor';
import { newLandformReport } from './landformReport';
export function WaterEarthExplorer({
  id,
  mode,
  state,
  onChange,
  mission = false,
  mystery = false,
  panel = 0,
}: {
  id: string;
  mode: LanguageMode;
  state: ActivityState;
  onChange: (a: ActivityState) => void;
  mission?: boolean;
  mystery?: boolean;
  panel?: number;
}) {
  const d = state.decisions,
    patch = (v: Record<string, string>) =>
      onChange({ ...state, decisions: { ...d, ...v } }),
    [message, setMessage] = useState<LocalizedText>(
      t(
        '观察、操作，再用证据解释。',
        'Observe, act, then explain using evidence.',
      ),
    );
  const photo = (key: string) => <AssetImage id={key} mode={mode} />;
  const choice = (
    key: string,
    prompt: LocalizedText,
    correct: string,
    options: [string, string, string][],
    why: LocalizedText,
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
        {options.map(([value, zh, en]) => (
          <button
            key={value}
            aria-pressed={d[key] === value}
            onClick={() => patch({ [key]: value })}
          >
            <Text mode={mode} text={t(zh, en)} />
          </button>
        ))}
      </div>
      {d[key] && (
        <p
          role="status"
          className={`geo-feedback ${d[key] === correct ? 'success' : ''}`}
        >
          <Text mode={mode} text={d[key] === correct ? why : hint} />
        </p>
      )}
    </section>
  );
  const status = mission && id !== 'GEO-032' && (
    <p
      role="status"
      className={`geo-feedback ${waterEarthFinished(id, d) ? 'success' : ''}`}
    >
      <Text
        mode={mode}
        text={
          waterEarthFinished(id, d)
            ? t(
                '✓ 任务证据齐全。说出一条因果关系与一条证据局限。',
                '✓ Mission evidence complete. Explain a causal link and an evidence limit.',
              )
            : t(
                '还有观察或推理未记录，可回看图示再试。',
                'Some observations/reasoning remain; revisit diagrams and retry.',
              )
        }
      />
    </p>
  );
  if (id === 'GEO-032') {
    if (mission)
      return (
        <LandformReportEditor mode={mode} state={state} onChange={onChange} />
      );
    return (
      <LandformReportPreview
        mode={mode}
        draft={state.landformReport ?? newLandformReport()}
        panel={mystery ? 0 : panel}
      />
    );
  }
  if (mystery)
    return photo(
      id === 'GEO-029'
        ? 'south-island-modis'
        : id === 'GEO-031'
          ? 'nz-relief'
          : 'sst-january',
    );
  if (id === 'GEO-029') {
    const route = readWaterRoute(state.route),
      current = route.at(-1)!,
      sealed = d['rain-ground'] === 'sealed';
    const controls = (
      <>
        <p>
          <Text
            mode={mode}
            text={t(
              `当前：${waterNodes.find((n) => n.id === current)!.zh}。选择一个过程，检验它能否从这里发生。`,
              `Now: ${waterNodes.find((n) => n.id === current)!.en}. Choose a process and test whether it can start here.`,
            )}
          />
        </p>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(
            mode,
            '移动这滴水的过程',
            'Processes moving this water',
          )}
        >
          {waterEdges.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                const result = waterMove(route, e.id);
                if (!result.valid) {
                  setMessage(
                    t(
                      '此过程不能从当前位置直接开始。看箭头起点，再选，或重启另一条路线。',
                      'This process cannot start directly at your current store. Check arrow origins, retry, or restart another route.',
                    ),
                  );
                  return;
                }
                onChange({
                  ...state,
                  route: result.route,
                  decisions: {
                    ...d,
                    ...Object.fromEntries(
                      result.completed.map((j) => [`water-path-${j}`, 'yes']),
                    ),
                  },
                });
                setMessage(
                  t(
                    `✓ ${e.zh}：${waterNodes.find((n) => n.id === e.from)!.zh} → ${waterNodes.find((n) => n.id === e.to)!.zh}。不是每滴水都必经这里。`,
                    `✓ ${e.en}: ${waterNodes.find((n) => n.id === e.from)!.en} → ${waterNodes.find((n) => n.id === e.to)!.en}. Not every water parcel follows this route.`,
                  ),
                );
              }}
            >
              <Text mode={mode} text={t(e.zh, e.en)} />
            </button>
          ))}
        </div>
        <p className="geo-feedback" role="status">
          <Text mode={mode} text={message} />
        </p>
        <ol className="geo-route-list">
          {route.map((key, i) => (
            <li key={i}>
              <Text
                mode={mode}
                text={t(
                  waterNodes.find((n) => n.id === key)!.zh,
                  waterNodes.find((n) => n.id === key)!.en,
                )}
              />
            </li>
          ))}
        </ol>
        <button
          className="geo-button secondary"
          onClick={() => {
            onChange({ ...state, route: ['surface'] });
            setMessage(
              t(
                '回到一滴地表雨水；已探索的路线标记保留。',
                'Restart at surface rainwater; earlier journey checks remain.',
              ),
            );
          }}
        >
          {words(mode, '从地表雨水重走', 'Restart at surface rainwater')}
        </button>
        <ul>
          {waterJourneys.map((j) => (
            <li key={j.id}>
              {d[`water-path-${j.id}`] === 'yes' ? '✓' : '○'}{' '}
              <Text mode={mode} text={t(j.zh, j.en)} />
            </li>
          ))}
        </ul>
      </>
    );
    const ground = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '比较地表条件', 'Compare ground conditions')}
        >
          {[
            ['open', '可下渗地面', 'Permeable ground'],
            ['sealed', '铺面较多', 'More paving'],
          ].map(([key, zh, en]) => (
            <button
              key={key}
              aria-pressed={d['rain-ground'] === key}
              onClick={() =>
                patch({ 'rain-ground': key!, [`rain-seen-${key}`]: 'yes' })
              }
            >
              <Text mode={mode} text={t(zh!, en!)} />
              {d[`rain-seen-${key}`] === 'yes' ? ' ✓' : ''}
            </button>
          ))}
        </div>
        <RainPartition mode={mode} sealed={sealed} />
      </>
    );
    return (
      <div className="geo-skill-explorer">
        {(mission || panel < 2) && (
          <>
            <WaterNetwork mode={mode} route={route} />
            {controls}
          </>
        )}
        {(mission || panel === 2) && ground}
        {mission && (
          <>
            {[
              ['runoff', '沿地表进入河流', 'Surface water entering a river'],
              ['infiltrate', '地表水进入土壤', 'Surface water entering soil'],
              [
                'evaporate',
                '液态海水成为气体水汽',
                'Liquid ocean water becomes vapour gas',
              ],
              [
                'condense',
                '水汽变成云中小液滴',
                'Vapour forms tiny liquid cloud drops',
              ],
              ['rain', '云中水落向地表', 'Cloud water falls to the surface'],
            ].map(([key, zh, en]) =>
              choice(
                `water-name-${key}`,
                t(zh!, en!),
                key!,
                [
                  ['runoff', '径流', 'Runoff'],
                  ['infiltrate', '下渗', 'Infiltration'],
                  ['evaporate', '蒸发', 'Evaporation'],
                  ['condense', '凝结', 'Condensation'],
                  ['rain', '降水', 'Precipitation'],
                ],
                t(
                  '✓ 状态变化或移动路径与过程名称一致。',
                  '✓ The state change/transfer matches this process.',
                ),
                t(
                  '看是从哪里到哪里，以及是否变成气体或液滴。',
                  'Compare source/destination and whether water becomes gas or drops.',
                ),
              ),
            )}
            {choice(
              'cloud-state',
              t(
                '普通白云直接可见的主要水是什么？',
                'What water makes an ordinary white cloud visible?',
              ),
              'drops',
              [
                [
                  'drops',
                  '小液滴／冰晶；气体水汽看不见',
                  'Tiny drops/ice crystals; vapour gas is invisible',
                ],
                [
                  'gas',
                  '只是一整块可见水汽气体',
                  'Only one visible mass of vapour gas',
                ],
              ],
              t(
                '✓ 云里的凝结液滴／冰晶散射光，水汽与云不同。',
                '✓ Cloud drops/ice scatter light; vapour differs from cloud.',
              ),
              t(
                '凝结箭头的起点和终点是同一状态吗？',
                'Do the condensation arrow endpoints show the same state?',
              ),
            )}
            {choice(
              'water-driver',
              t('是什么使这些通路持续运作？', 'What drives these pathways?'),
              'energy-gravity',
              [
                [
                  'energy-gravity',
                  '能量促蒸发；重力影响落水与地表流',
                  'Energy enables evaporation; gravity affects falling/surface flow',
                ],
                [
                  'circle',
                  '水自己记住一条必须走的圆圈',
                  'Water remembers a compulsory circle',
                ],
              ],
              t(
                '✓ 能量和重力作用不同；地下水还取决于水头与介质。',
                '✓ Energy and gravity act differently; groundwater also depends on hydraulic head/materials.',
              ),
              t(
                '蒸发与向低处流需要同一种直接原因吗？',
                'Do evaporation and downhill flow have the same direct cause?',
              ),
            )}
            {choice(
              'rain-claim',
              t(
                '铺面例的7份径流能套用所有地点吗？',
                'Can seven runoff parcels describe every paved place?',
              ),
              'conditional',
              [
                [
                  'conditional',
                  '不能；只是同一虚构雨的对照，现实条件不同',
                  'No: an invented-event comparison; real conditions vary',
                ],
                [
                  'universal',
                  '能；任何雨都精确分7/2/1',
                  'Yes: every rainfall splits exactly7/2/1',
                ],
              ],
              t(
                '✓ 图中输入守恒，但比例与时间都没有实测依据。',
                '✓ Input is conserved here, but fractions/time are unmeasured.',
              ),
              t(
                '检查标题“示例”，想想雨强、排水与土壤是否都相同。',
                'Read “example”; are rainfall intensity, drainage and soils identical?',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-030') {
    const active =
        currentCases.find((c) => c.id === d['current-active']) ??
        currentCases[0],
      month = d['sst-month'] === 'jul' ? 'jul' : 'jan',
      selected = d['sst-point'] ?? '',
      heatKind = d['heat-kind'] === 'cool' ? 'cool' : 'warm',
      frame = modelFrame(d['heat-frame'], 4),
      selectHeat = (kind: string) =>
        patch({
          'heat-kind': kind,
          'heat-frame': '0',
          [`heat-${kind}-0`]: 'yes',
        }),
      setFrame = (n: number) =>
        patch({ 'heat-frame': String(n), [`heat-${heatKind}-${n}`]: 'yes' });
    const currents = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '洋流案例', 'Current cases')}
        >
          {currentCases.map((c) => (
            <button
              key={c.id}
              aria-pressed={active.id === c.id}
              onClick={() =>
                patch({
                  'current-active': c.id,
                  [`current-seen-${c.id}`]: 'yes',
                })
              }
            >
              <Text mode={mode} text={t(c.zh, c.en)} />
              {d[`current-seen-${c.id}`] === 'yes' ? ' ✓' : ''}
            </button>
          ))}
        </div>
        <CurrentMap mode={mode} active={active.id} />
        <p>
          <Text mode={mode} text={t(active.clueZh, active.clueEn)} />
        </p>
      </>
    );
    const sst = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '多年平均海温月份', 'SST climatology month')}
        >
          {[
            ['jan', '一月', 'January'],
            ['jul', '七月', 'July'],
          ].map(([key, zh, en]) => (
            <button
              key={key}
              aria-pressed={month === key}
              onClick={() => patch({ 'sst-month': key!, 'sst-point': '' })}
            >
              <Text mode={mode} text={t(zh!, en!)} />
            </button>
          ))}
        </div>
        <OceanTemperature mode={mode} month={month} selected={selected} />
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '读取同纬样点', 'Read same-latitude cells')}
        >
          {ocean.points.map((p) => (
            <button
              key={p.id}
              aria-pressed={selected === p.id}
              onClick={() =>
                patch({ 'sst-point': p.id, [`sst-${month}-${p.id}`]: 'yes' })
              }
            >
              {p.id} · 34.5°N, {Math.abs(p.lon)}°W{' '}
              {d[`sst-${month}-${p.id}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
        </div>
        {selected && (
          <p className="geo-feedback" role="status">
            {selected}: {ocean.points.find((p) => p.id === selected)![month]}°C
            ·{' '}
            {words(
              mode,
              '1991–2020选定月份海表温度平均',
              '1991–2020 selected-month mean sea surface temperature',
            )}
          </p>
        )}
        <table className="geo-data-table geo-sst-table">
          <caption>
            {words(mode, '同纬格子对照，°C', 'Same-latitude cells, °C')}
          </caption>
          <thead>
            <tr>
              <th>{words(mode, '样点', 'Cell')}</th>
              <th>{words(mode, '一月', 'Jan')}</th>
              <th>{words(mode, '七月', 'Jul')}</th>
            </tr>
          </thead>
          <tbody>
            {ocean.points.map((p) => (
              <tr key={p.id}>
                <th>{p.id}</th>
                <td>{p.jan}</td>
                <td>{p.jul}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
    const heat = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(
            mode,
            '同一海岸来水对照',
            'Incoming water at the same coast',
          )}
        >
          {[
            ['warm', '较暖来水', 'Warmer incoming water'],
            ['cool', '较凉来水', 'Cooler incoming water'],
          ].map(([key, zh, en]) => (
            <button
              key={key}
              aria-pressed={heatKind === key}
              onClick={() => selectHeat(key!)}
            >
              <Text mode={mode} text={t(zh!, en!)} />
            </button>
          ))}
        </div>
        <HeatTransport mode={mode} frame={frame} kind={heatKind} />
        <label className="geo-writing">
          {words(
            mode,
            '热输送示意帧（非速度/时刻）',
            'Heat-transfer frame (no speed/time)',
          )}
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={frame}
            onChange={(e) => setFrame(Number(e.target.value))}
          />
        </label>
        <div className="geo-choices">
          {[0, 2, 4].map((n) => (
            <button key={n} onClick={() => setFrame(n)}>
              {words(mode, `帧 ${n}`, `Frame ${n}`)}{' '}
              {d[`heat-${heatKind}-${n}`] === 'yes' ? '✓' : ''}
            </button>
          ))}
        </div>
      </>
    );
    return (
      <div className="geo-skill-explorer">
        {(mission || panel === 0) && currents}
        {(mission || panel === 1) && sst}
        {(mission || panel === 2) && heat}
        {mission && (
          <>
            {currentCases.map((c) =>
              choice(
                `current-kind-${c.id}`,
                t(
                  `${c.zh}这条概略通路表示什么？`,
                  `What does the ${c.en} schematic show?`,
                ),
                c.kind,
                [
                  [
                    'warm',
                    '相对暖水向较高纬',
                    'Relatively warm water towards higher latitudes',
                  ],
                  [
                    'cool',
                    '相对凉水向较低纬',
                    'Relatively cool water towards lower latitudes',
                  ],
                  ['east', '环南极总体向东', 'Broadly east around Antarctica'],
                ],
                t(
                  '✓ 位置、方向与相对温度要一起读。',
                  '✓ Read location, direction and relative temperature together.',
                ),
                t(
                  '找地图W/C/E标记和案例线索；颜色不是绝对冷热。',
                  'Find W/C/E and the case clue; colour is not absolute hot/cold.',
                ),
              ),
            )}
            {choice(
              'sst-compare',
              t(
                '同纬A/B哪一个在这两个月平均都较暖？',
                'Which same-latitude cell is warmer in both months?',
              ),
              'A',
              [
                ['A', 'A：20.3/26.4°C', 'A:20.3/26.4°C'],
                ['B', 'B：17.9/21.4°C', 'B:17.9/21.4°C'],
              ],
              t(
                '✓ 两个月A都较暖；差异不证明所有原因已被单独控制。',
                '✓ A is warmer in both; the comparison does not isolate every cause.',
              ),
              t(
                '分别比较一月和七月，别混合两个月。',
                'Compare January separately from July.',
              ),
            )}
            {choice(
              'sst-variable',
              t(
                '这张颜色图实际表示什么？',
                'What does this colour map actually show?',
              ),
              'surface',
              [
                [
                  'surface',
                  '1991–2020选定月份平均海表温度',
                  '1991–2020 selected-month mean SST',
                ],
                [
                  'speed',
                  '今天洋流速度或陆地气温',
                  'Today’s current speed or land air temperature',
                ],
              ],
              t(
                '✓ 数据是海表温度；箭头通路是另绘的概略解释。',
                '✓ The data are SST; current routes are separate schematic explanations.',
              ),
              t(
                '读图名、单位°C与时段，不用色带推导流速。',
                'Read the title,°C units and period; colour does not yield speed.',
              ),
            )}
            {choice(
              'current-driver',
              t(
                '海水流动的驱动与约束？',
                'Drivers and controls of ocean motion?',
              ),
              'multiple',
              [
                [
                  'multiple',
                  '风、密度差、潮汐；旋转和盆地形状影响路径',
                  'Wind, density differences, tides; rotation/basins shape paths',
                ],
                [
                  'sun-only',
                  '只有海水冷热，风与盐度都无关',
                  'Only temperature; wind/salinity have no role',
                ],
              ],
              t(
                '✓ 同盐度时较冷海水通常更密；同温度时较咸通常更密，不能忽略其他条件。',
                '✓ Colder seawater is usually denser at equal salinity; saltier denser at equal temperature. Other conditions matter.',
              ),
              t(
                '风能向表层传动量，温度和盐度一起影响密度。',
                'Wind transfers momentum; temperature and salinity affect density together.',
              ),
            )}
            {choice(
              'climate-limit',
              t(
                '某沿海城市较温和，仅靠洋流图可解释完吗？',
                'Does one current map fully explain a mild coastal city?',
              ),
              'multiple',
              [
                [
                  'multiple',
                  '洋流传热，但还要风、纬度、地形及多年气候资料',
                  'Currents transport heat; also need winds, latitude, terrain and climate records',
                ],
                [
                  'only',
                  '洋流唯一决定，海温直接等于城市气温',
                  'Currents alone decide; SST equals city air temperature',
                ],
              ],
              t(
                '✓ 海气交换联系海洋与气候，不是海温直接替代气温。',
                '✓ Air–sea exchange links ocean/climate; SST does not replace air temperature.',
              ),
              t(
                '想想同样海水旁，风是否从海吹向陆地？',
                'Beside the same water, does wind always blow towards land?',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-031') {
    const layers = (d['nz-visible'] ?? '')
        .split(',')
        .filter((l) => ['boundary', 'relief', 'quakes'].includes(l)),
      active = nzSegments.find((s) => s.id === d['nz-active']) ?? nzSegments[0];
    const map = (
      <>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(
            mode,
            '叠加新西兰证据图层',
            'Overlay NZ evidence layers',
          )}
        >
          {[
            ['boundary', '边界概略线', 'Approximate boundary'],
            ['relief', '南阿尔卑斯山脉带', 'Southern Alps range'],
            ['quakes', '2020地震样本', '2020 quake sample'],
          ].map(([key, zh, en]) => (
            <button
              key={key}
              aria-pressed={layers.includes(key!)}
              onClick={() => {
                const enabled = !layers.includes(key!);
                patch({
                  'nz-visible': (enabled
                    ? [...layers, key!]
                    : layers.filter((l) => l !== key)
                  ).join(','),
                  ...(enabled ? { [`nz-layer-${key}`]: 'yes' } : {}),
                });
              }}
            >
              <Text mode={mode} text={t(zh!, en!)} />
              {d[`nz-layer-${key}`] === 'yes' ? ' ✓' : ''}
            </button>
          ))}
        </div>
        <NZBoundaryMap mode={mode} layers={layers} active={active.id} />
        <div
          className="geo-choices"
          role="group"
          aria-label={words(
            mode,
            '板块边界三个区域',
            'Three plate-boundary regions',
          )}
        >
          {nzSegments.map((s, i) => (
            <button
              key={s.id}
              aria-pressed={active.id === s.id}
              onClick={() =>
                patch({ 'nz-active': s.id, [`nz-seen-${s.id}`]: 'yes' })
              }
            >
              {i + 1} · <Text mode={mode} text={t(s.zh, s.en)} />
              {d[`nz-seen-${s.id}`] === 'yes' ? ' ✓' : ''}
            </button>
          ))}
        </div>
      </>
    );
    return (
      <div className="geo-skill-explorer">
        {panel === 1 && !mission && photo('nz-relief')}
        {map}
        {(mission || panel === 2) && (
          <details>
            <summary>
              {words(
                mode,
                `查看${nzQuakes.count}条历史记录与筛选说明`,
                `Read ${nzQuakes.count} historical records and selection`,
              )}
            </summary>
            <p>
              <Text
                mode={mode}
                text={t(
                  '2020 UTC；目录震级≥4；164–180°E、33–48°S；只含所选earthquake类型。震级类型不同，深度估计有误差；这不是检测完整性或危险性评估。',
                  '2020 UTC; catalogue magnitude≥4;164–180°E,33–48°S; selected earthquake type only. Magnitude types vary and depth estimates have uncertainty. Not a completeness/hazard assessment.',
                )}
              />
            </p>
            <p>{nzQuakes.acknowledgement}</p>
            <div className="geo-table-scroll" tabIndex={0}>
              <table className="geo-data-table">
                <caption>GeoNet · {nzQuakes.period}</caption>
                <thead>
                  <tr>
                    <th>ID / UTC</th>
                    <th>{words(mode, '震级／类型', 'Magnitude/type')}</th>
                    <th>{words(mode, '深度km', 'Depth km')}</th>
                    <th>{words(mode, '经纬度°', 'Lon/lat°')}</th>
                  </tr>
                </thead>
                <tbody>
                  {nzQuakes.records.map((q) => (
                    <tr key={q.id}>
                      <td>
                        {q.id}
                        <br />
                        {q.time}
                      </td>
                      <td>
                        {q.magnitude.toFixed(1)} / {q.magnitudeType}
                      </td>
                      <td>{q.depthKm.toFixed(0)}</td>
                      <td>
                        {q.lon.toFixed(2)}, {q.lat.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
        {mission && (
          <>
            {nzSegments.map((s) =>
              choice(
                `nz-motion-${s.id}`,
                t(
                  `${s.zh}主要构造关系？`,
                  `Main tectonic relation in ${s.en}?`,
                ),
                s.motion,
                [
                  [
                    'pacific-under',
                    '太平洋板块向澳大利亚板块下俯冲',
                    'Pacific descends beneath Australian',
                  ],
                  [
                    'oblique',
                    '沿断层错动与挤压／抬升并存',
                    'Along-fault slip plus compression/uplift',
                  ],
                  [
                    'australian-under',
                    '澳大利亚板块向太平洋板块下俯冲',
                    'Australian descends beneath Pacific',
                  ],
                ],
                t(
                  '✓ 同一国家不同边界段的关系不同；过渡地带更复杂。',
                  '✓ Boundary segments differ; transitions are more complex.',
                ),
                t(
                  '东北与西南的俯冲关系相反；中段还含错动。',
                  'NE and SW reverse which plate descends; the central section also slips.',
                ),
              ),
            )}
            {choice(
              'nz-evidence',
              t(
                '山脉、边界与地震分布，怎样联系最有依据？',
                'How best connect ranges, boundary and quakes?',
              ),
              'combined',
              [
                [
                  'combined',
                  '板块运动使岩石变形；地震位置结合断层、地形及其他资料',
                  'Motion deforms rock; compare quakes with faults, relief and other records',
                ],
                [
                  'exact',
                  '所有地震都在一条线，每个点都形成山峰',
                  'All quakes lie on one line and each dot creates a peak',
                ],
              ],
              t(
                '✓ 变形跨一片区域，地震可在不同深度和分支断层上发生。',
                '✓ Deformation spans a region; quakes can occur at different depths and on branching faults.',
              ),
              t(
                '打开三个图层，看点是否真的恰好沿一条线。',
                'Overlay three layers: do all dots sit exactly on one line?',
              ),
            )}
            {choice(
              'nz-quakes-limit',
              t(
                '本图少点的地区，能据此称“未来安全”吗？',
                'Can a sparse part of this sample be called safe in future?',
              ),
              'sample',
              [
                [
                  'sample',
                  '不能；一年、阈值、区域与检测条件都有限',
                  'No: one year, threshold, region and detection limits',
                ],
                [
                  'safe',
                  '能；没点便不会有地震',
                  'Yes: no dot means no earthquake',
                ],
              ],
              t(
                '✓ 历史样本不是未来预报，活动断层也可长期少有大震。',
                '✓ Historical samples are not forecasts; active faults may be quiet for long intervals.',
              ),
              t(
                '图上选了哪个年份和震级？这些筛选会省掉什么？',
                'Which year/magnitude were selected, and what do those filters omit?',
              ),
            )}
            {choice(
              'nz-mountain-time',
              t(
                '慢慢抬升与突发地震矛盾吗？',
                'Do gradual uplift and sudden earthquakes conflict?',
              ),
              'both',
              [
                [
                  'both',
                  '长期变形可积累，断层也会突发滑动；侵蚀同时移去材料',
                  'Long-term deformation accumulates; faults can slip suddenly while erosion removes material',
                ],
                [
                  'no',
                  '山只在一次地震里完整形成，此后不变',
                  'An entire range forms in one quake, then never changes',
                ],
              ],
              t(
                '✓ 地质长期过程与短时事件能并存；山高还受侵蚀等作用。',
                '✓ Long-term processes and short events coexist; erosion also affects relief.',
              ),
              t(
                '把过程持续的时间与一次事件的时间分开。',
                'Separate the timescale of a process from one event.',
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
