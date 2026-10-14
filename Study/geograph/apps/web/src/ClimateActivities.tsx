import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ActivityState } from './progress';
import { t, words } from './content';
import { Text, AssetImage } from './ui';
import {
  RainStationMap,
  ReliefModel,
  LatitudeMap,
  SolarModel,
  MonsoonMap,
  MonsoonChart,
  DesertMap,
} from './ClimateVisuals';
import {
  climateData,
  climatePoints,
  climateFinished,
  climateEvidence,
  rainStations,
  boundedStep,
  reliefParcel,
  solarGeometry,
  monsoonContrast,
  desertCases,
} from './climateModels';

type Option = [string, string, string];
export function ClimateExplorer({
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
      onChange({ ...state, decisions: { ...d, ...v } });
  const choices = (
    prompt: LocalizedText,
    options: Option[],
    value: string,
    choose: (v: string) => void,
  ) => (
    <div
      className="geo-choices"
      role="group"
      aria-label={words(mode, prompt.zh, prompt.en)}
    >
      {options.map(([v, zh, en]) => (
        <button key={v} aria-pressed={value === v} onClick={() => choose(v)}>
          <Text mode={mode} text={t(zh, en)} />
        </button>
      ))}
    </div>
  );
  const question = (
    key: string,
    prompt: LocalizedText,
    answer: string,
    options: Option[],
    why: LocalizedText,
    hint: LocalizedText,
  ) => (
    <section className="geo-terrain-question" key={key}>
      <h4>
        <Text mode={mode} text={prompt} />
      </h4>
      {choices(prompt, options, d[key] ?? '', (v) => patch({ [key]: v }))}
      {d[key] && (
        <p
          role="status"
          className={`geo-feedback ${d[key] === answer ? 'success' : ''}`}
        >
          <Text mode={mode} text={d[key] === answer ? why : hint} />
        </p>
      )}
    </section>
  );
  const labels: Record<string, [string, string]> = {
    'station-west': ['读取西侧长期统计', 'Read western long-term statistic'],
    'station-east': ['读取东侧长期统计', 'Read eastern long-term statistic'],
    'relief-west-rise': [
      '西风／湿气块／2 km山顶',
      'West wind / moist parcel / 2 km crest',
    ],
    'relief-west-lee': [
      '西风／湿气块／下降末帧',
      'West wind / moist parcel / end of descent',
    ],
    'relief-east-rise': [
      '东风／湿气块／2 km山顶',
      'East wind / moist parcel / 2 km crest',
    ],
    'relief-east-lee': [
      '东风／湿气块／下降末帧',
      'East wind / moist parcel / end of descent',
    ],
    'relief-low-dry': ['较干气块／1 km山顶', 'Drier parcel / 1 km crest'],
    'relief-high-dry': ['较干气块／2 km山顶', 'Drier parcel / 2 km crest'],
    'relief-flat': ['去掉山峰／到中央位置', 'Remove ridge / reach centre'],
    'climate-bands': ['查看纬度热量带', 'Inspect latitude heat belts'],
    'climate-temperature': [
      '查看长期气温图',
      'Inspect long-term temperature map',
    ],
    'solar-0-0': ['分点／0°', 'Equinox / 0°'],
    'solar-75-0': ['分点／75°N', 'Equinox / 75°N'],
    'solar-75-1': ['六月／75°N', 'June / 75°N'],
    'solar-75-3': ['十二月／75°N', 'December / 75°N'],
    'solar-nz-1': ['六月／43°S', 'June / 43°S'],
    'solar-nz-3': ['十二月／43°S', 'December / 43°S'],
    'monsoon-warm': ['较暖陆地', 'Warmer land'],
    'monsoon-cool': ['较凉陆地', 'Cooler land'],
    'monsoon-equal': ['相同温度比较级', 'Equal contrast level'],
    'monsoon-west-chart': ['读取印度西岸附近雨图', 'Read west India rainfall'],
    'monsoon-east-chart': [
      '读取印度东南海岸附近雨图',
      'Read SE India vicinity rainfall',
    ],
    'desert-sahara': ['查看撒哈拉样点', 'Inspect Sahara cell'],
    'desert-gobi': ['查看戈壁样点', 'Inspect Gobi cell'],
    'desert-atacama': ['查看阿塔卡马样点', 'Inspect Atacama cell'],
    'desert-antarctica': [
      '查看南极内陆样点',
      'Inspect Antarctic interior cell',
    ],
    'desert-rain-map': [
      '查看长期降水图',
      'Inspect long-term precipitation map',
    ],
    'desert-temp-map': ['查看长期气温图', 'Inspect long-term temperature map'],
    'desert-photo-hot': ['查看撒哈拉照片', 'Inspect Sahara photograph'],
    'desert-photo-cold': ['查看戈壁冬季影像', 'Inspect Gobi winter image'],
  };
  const status = mission && (
    <>
      <ul className="geo-weather-checklist">
        {climateEvidence[id]!.map((k) => (
          <li key={k}>
            {d[k] === 'yes' ? '✓' : '○'}{' '}
            <Text mode={mode} text={t(...labels[k]!)} />
          </li>
        ))}
      </ul>
      <p
        role="status"
        className={`geo-feedback ${climateFinished(id, d) ? 'success' : ''}`}
      >
        <Text
          mode={mode}
          text={
            climateFinished(id, d)
              ? t(
                  '✓ 任务证据齐全。解释一个原因、一个条件和一个资料局限。',
                  '✓ Mission evidence complete. Explain a cause, a condition and an evidence limit.',
                )
              : t(
                  '还有比较或推理未完成；清单记录已看过的条件，可随时重试。',
                  'Some comparisons/reasoning remain; the checklist records explored conditions. Retry anytime.',
                )
          }
        />
      </p>
    </>
  );
  if (mystery)
    return id === 'GEO-038' ? (
      <LatitudeMap mode={mode} temperature selected="tropical" />
    ) : id === 'GEO-039' ? (
      <MonsoonChart mode={mode} pointId="india-west" />
    ) : (
      <AssetImage
        mode={mode}
        id={id === 'GEO-040' ? 'gobi-snow' : 'south-island-modis'}
      />
    );
  if (id === 'GEO-037') {
    const wet = d['relief-moisture'] !== 'dry',
      west = d['relief-wind'] !== 'east',
      peak = boundedStep(d['relief-peak'], 2, 2),
      frame = boundedStep(d['relief-frame'], 4),
      a = reliefParcel(wet, peak, frame, west),
      station = d['rain-station'] ?? '';
    const change = (w: boolean, h: number, f: number, dir: boolean) => {
      const m = reliefParcel(w, h, f, dir);
      patch({
        'relief-moisture': w ? 'wet' : 'dry',
        'relief-wind': dir ? 'west' : 'east',
        'relief-peak': String(m.ridge),
        'relief-frame': String(m.frame),
        ...(m.frame === 2 && m.ridge === 2 && w
          ? { [`relief-${dir ? 'west' : 'east'}-rise`]: 'yes' }
          : {}),
        ...(m.frame === 4 && m.ridge === 2 && w
          ? { [`relief-${dir ? 'west' : 'east'}-lee`]: 'yes' }
          : {}),
        ...(m.frame === 2 && !w && m.ridge > 0
          ? { [`relief-${m.ridge === 1 ? 'low' : 'high'}-dry`]: 'yes' }
          : {}),
        ...(m.frame === 2 && m.ridge === 0 ? { 'relief-flat': 'yes' } : {}),
      });
    };
    const stations = (
      <>
        <RainStationMap
          mode={mode}
          selected={station}
          onPick={(v) => patch({ 'rain-station': v, [`station-${v}`]: 'yes' })}
        />
        {choices(
          t('读取两机场年降水常年值', 'Read airport annual rainfall normals'),
          rainStations.map((s) => [
            s.id,
            `${s.zh}：${s.annual} mm/year`,
            `${s.en}: ${s.annual} mm/year`,
          ]),
          station,
          (v) => patch({ 'rain-station': v, [`station-${v}`]: 'yes' }),
        )}
        {station && (
          <p className="geo-feedback" role="status">
            {words(
              mode,
              '此点是1981–2010年常年值；不是一次降雨或今天预报。',
              'This is a 1981–2010 normal, not one storm or today’s forecast.',
            )}
          </p>
        )}
      </>
    );
    const model = (
      <>
        {choices(
          t('风来自哪里', 'Where does airflow come from?'),
          [
            ['west', '来自西侧', 'From west'],
            ['east', '来自东侧', 'From east'],
          ],
          west ? 'west' : 'east',
          (v) => change(wet, peak, frame, v === 'west'),
        )}
        {choices(
          t('改变虚构山峰高度', 'Change invented ridge height'),
          [
            ['0', '去掉山峰／0 km', 'No ridge / 0 km'],
            ['1', '1 km山峰', '1 km ridge'],
            ['2', '2 km山峰', '2 km ridge'],
          ],
          String(peak),
          (v) => change(wet, Number(v), frame, west),
        )}
        {choices(
          t('比较入流水汽条件', 'Compare incoming moisture'),
          [
            ['wet', '较湿／露点16°C', 'Moister / dew point 16°C'],
            ['dry', '较干／露点6°C', 'Drier / dew point 6°C'],
          ],
          wet ? 'wet' : 'dry',
          (v) => change(v === 'wet', peak, frame, west),
        )}
        <ReliefModel
          mode={mode}
          wet={wet}
          peak={peak}
          frame={frame}
          west={west}
        />
        <label className="geo-writing">
          {words(
            mode,
            '跨山示意帧（不是时间）',
            'Mountain-crossing frame (not time)',
          )}
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={frame}
            onChange={(e) => change(wet, peak, Number(e.target.value), west)}
          />
        </label>
        {choices(
          t('选择跨山位置', 'Select position in crossing'),
          [
            ['0', '帧0／入流', 'Frame 0 / incoming'],
            ['1', '帧1／爬坡', 'Frame 1 / ascent'],
            ['2', '帧2／山顶', 'Frame 2 / crest'],
            ['3', '帧3／下降', 'Frame 3 / descent'],
            ['4', '帧4／离开', 'Frame 4 / leaving'],
          ],
          String(frame),
          (v) => change(wet, peak, Number(v), west),
        )}
        <p>
          {words(
            mode,
            `当前迎风侧${a.windward === 'west' ? '西' : '东'}；云底约${a.base.toFixed(2)} km。`,
            `Current windward side:${a.windward}; estimated cloud base ${a.base.toFixed(2)} km.`,
          )}
        </p>
      </>
    );
    return (
      <div className="geo-skill-explorer">
        {(mission || panel === 0) && stations}
        {(mission || panel > 0) && model}
        {mission && (
          <>
            {question(
              'rain-westside',
              t(
                '来自西侧的气流，哪侧是迎风坡？',
                'For airflow from west, which slope is windward?',
              ),
              'west',
              [
                ['west', '西侧', 'West'],
                ['east', '东侧', 'East'],
              ],
              t(
                '✓ 迎风坡面向来流；初始湿西风先在西侧抬升。',
                '✓ Windward faces incoming flow; moist westerlies first rise on the west.',
              ),
              t(
                '先找风的来向，再找它先爬哪一侧。',
                'Find the source direction, then the first rising slope.',
              ),
            )}
            {question(
              'rain-eastside',
              t(
                '改为来自东侧，迎风坡在哪里？',
                'With flow from east, where is windward?',
              ),
              'east',
              [
                ['west', '永远是西侧', 'Always west'],
                ['east', '现在是东侧', 'Now east'],
              ],
              t(
                '✓ 风向改变，迎风／背风会互换；西侧不是永久多雨的标签。',
                '✓ Windward/lee swap with wind direction; west is not a permanent wet label.',
              ),
              t(
                '反转蓝箭头，查看哪侧先抬升。',
                'Reverse the arrow and find the ascending side.',
              ),
            )}
            {question(
              'rain-cooling',
              t(
                '气块遇山上升为什么冷却？',
                'Why does air cool while rising over a ridge?',
              ),
              'expand',
              [
                [
                  'expand',
                  '压力降低，气块膨胀',
                  'Lower pressure allows expansion',
                ],
                [
                  'closer',
                  '更接近太阳所以变冷',
                  'Closer to the Sun makes it colder',
                ],
              ],
              t(
                '✓ 与GEO036同一绝热冷却通路；山不是冰箱。',
                '✓ Same adiabatic pathway as GEO036; mountains are not refrigerators.',
              ),
              t(
                '回看气块在更高位置的外界压力条件。',
                'Recall surrounding pressure at greater height.',
              ),
            )}
            {question(
              'rain-lee',
              t(
                '此理想化例背风侧为什么相对较干？',
                'Why is the lee relatively drier in this idealised example?',
              ),
              'removed-warming',
              [
                [
                  'removed-warming',
                  '部分水已降出，下降增温使相对湿度降低',
                  'Water was precipitated; descent warms and lowers relative humidity',
                ],
                [
                  'vanish',
                  '山让所有水凭空消失',
                  'The mountain makes all water vanish',
                ],
              ],
              t(
                '✓ 水通过降水移走；压缩增温影响相对湿度。现实可能有溢流雨等。',
                '✓ Precipitation removes water; compression warming affects relative humidity. Real spillover rain and other effects can occur.',
              ),
              t(
                '区分水量去向与温度变化，两者不是同一个过程。',
                'Distinguish water removal from temperature change.',
              ),
            )}
            {question(
              'rain-conditions',
              t(
                '有山就必定迎风下大雨、背风完全无雨吗？',
                'Does any mountain guarantee heavy windward rain and a completely dry lee?',
              ),
              'conditional',
              [
                [
                  'conditional',
                  '不；要看水汽、抬升、增长和天气系统',
                  'No: moisture, lift, growth and weather systems matter',
                ],
                ['always', '是；任何山都一样', 'Yes: every ridge is identical'],
              ],
              t(
                '✓ 比较较干1/2 km和无山例；任务条件不是全世界定律。',
                '✓ Compare drier 1/2 km and no-ridge cases; task settings are not universal laws.',
              ),
              t(
                '较干气块在1 km到云底了吗？',
                'Has the drier parcel reached its cloud base at 1 km?',
              ),
            )}
            {question(
              'rain-period',
              t(
                '2452与594 mm/year是什么尺度？',
                'What scale do 2452/594 mm/year represent?',
              ),
              'climate',
              [
                [
                  'climate',
                  '1981–2010年气候常年值',
                  '1981–2010 climate normals',
                ],
                ['today', '今天每小时雨量', 'Today’s hourly rain'],
              ],
              t(
                '✓ 长期差异与过程模型一起支持解释，不能据此预报明天。',
                '✓ Long-term contrast and a process model support explanation, not tomorrow’s forecast.',
              ),
              t('看地图统计周期和year单位。', 'Read the period and year unit.'),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-038') {
    const temperature = d['climate-view'] !== 'bands',
      point = d['climate-point'] ?? 'tropical',
      lat = d['solar-lat'] === 'nz' ? -43 : boundedStep(d['solar-lat'], 75, 0),
      quarter = [0, 1, 3].includes(Number(d['solar-quarter']))
        ? Number(d['solar-quarter'])
        : 0;
    const selectSolar = (la: number, q: number) => {
      const g = solarGeometry(la, q),
        key = la === -43 ? 'nz' : String(la);
      patch({
        'solar-lat': key,
        'solar-quarter': String(g.quarter),
        [`solar-${key}-${g.quarter}`]: 'yes',
      });
    };
    const maps = (
      <>
        {choices(
          t(
            '比较纬度带与真实气温',
            'Compare latitude belts and real temperature',
          ),
          [
            ['bands', '纬度热量带', 'Latitude heat belts'],
            ['temperature', '1991–2020气温', '1991–2020 temperature'],
          ],
          temperature ? 'temperature' : 'bands',
          (v) => patch({ 'climate-view': v, [`climate-${v}`]: 'yes' }),
        )}
        <LatitudeMap mode={mode} temperature={temperature} selected={point} />
        {choices(
          t('选择气候样点', 'Select climate cell'),
          climatePoints.map((p) => [
            p.id,
            `${p.zh}：${Math.abs(p.lat)}°${p.lat < 0 ? 'S' : 'N'}`,
            `${p.en}: ${Math.abs(p.lat)}°${p.lat < 0 ? 'S' : 'N'}`,
          ]),
          point,
          (v) => patch({ 'climate-point': v }),
        )}
        <p>
          {words(
            mode,
            `${climatePoints.find((p) => p.id === point)!.zh}：年平均${climatePoints.find((p) => p.id === point)!.celsius}°C；是该模型网格，不是整片地区。`,
            `${climatePoints.find((p) => p.id === point)!.en}: annual mean ${climatePoints.find((p) => p.id === point)!.celsius}°C; this model cell, not the whole region.`,
          )}
        </p>
      </>
    );
    const solar = (
      <>
        {choices(
          t('比较光照纬度', 'Compare solar latitude'),
          [
            ['0', '0°／赤道', '0° / equator'],
            ['45', '45°N', '45°N'],
            ['75', '75°N', '75°N'],
            ['nz', '43°S／新西兰纬度示例', '43°S / NZ latitude example'],
          ],
          lat === -43 ? 'nz' : String(lat),
          (v) => selectSolar(v === 'nz' ? -43 : Number(v), quarter),
        )}
        {choices(
          t('比较太阳位置', 'Compare solar position'),
          [
            ['0', '三月分点', 'March equinox'],
            ['1', '六月至日', 'June solstice'],
            ['3', '十二月至日', 'December solstice'],
          ],
          String(quarter),
          (v) => selectSolar(lat, Number(v)),
        )}
        <SolarModel mode={mode} latitude={lat} quarter={quarter} />
      </>
    );
    return (
      <div className="geo-skill-explorer">
        {(mission || panel < 2) && maps}
        {(mission || panel === 2) && solar}
        {mission && (
          <>
            {climatePoints.map((p) =>
              question(
                `belt-${p.id}`,
                t(
                  `${p.zh}按本图纬度线属于哪一热量带？`,
                  `Which latitude heat belt contains the ${p.en}?`,
                ),
                Math.abs(p.lat) <= 23.4
                  ? 'tropical'
                  : Math.abs(p.lat) >= 66.6
                    ? 'polar'
                    : 'temperate',
                [
                  [
                    'tropical',
                    '回归线之间的热带',
                    'Tropical belt between tropics',
                  ],
                  [
                    'temperate',
                    '回归线与极圈之间的温带',
                    'Temperate belt between tropic and polar circle',
                  ],
                  [
                    'polar',
                    '极圈以内的高纬度带',
                    'High-latitude belt poleward of polar circle',
                  ],
                ],
                t(
                  '✓ 这是纬度位置分类，不是完整实际气候诊断。',
                  '✓ This classifies latitude position, not complete actual climate.',
                ),
                t(
                  '比较绝对纬度与23.4°／66.6°，别只看气温颜色。',
                  'Compare absolute latitude with 23.4°/66.6°, beyond temperature colour.',
                ),
              ),
            )}
            {question(
              'climate-season',
              t(
                '同纬度六月和十二月光照为何不同？',
                'Why does light differ in June/December at the same latitude?',
              ),
              'tilt',
              [
                [
                  'tilt',
                  '地轴倾角与公转改变日照角度和白昼',
                  'Tilt and orbit change solar angle/daylight',
                ],
                [
                  'distance',
                  '南北半球轮流离太阳很远',
                  'The hemispheres take turns very far from the Sun',
                ],
              ],
              t(
                '✓ 北极昼／夜与南半球相反季节来自同一几何关系。',
                '✓ Polar day/night and opposite southern seasons follow the same geometry.',
              ),
              t(
                '同一43°S或75°N，只切换太阳位置。',
                'Hold 43°S or 75°N fixed and switch solar position.',
              ),
            )}
            {question(
              'climate-height',
              t(
                '31.428°N两格温度−7.6／15.3°C差很大，纬度能解释全部吗？',
                'Two 31.428°N cells differ −7.6/15.3°C. Can latitude explain everything?',
              ),
              'elevation',
              [
                [
                  'elevation',
                  '不能；高原海拔等条件要加入',
                  'No: include plateau elevation and other conditions',
                ],
                [
                  'latitude',
                  '能；纬度相同就应该同温',
                  'Yes: same latitude means same temperature',
                ],
              ],
              t(
                '✓ 高原与低地比较说明纬度不是唯一因素；也未控制所有变量。',
                '✓ Plateau/lowland contrast shows latitude is not the only influence; not all variables are controlled.',
              ),
              t(
                '读地点与地形线索，再看数值。',
                'Read location/terrain clues and the values.',
              ),
            )}
            {question(
              'climate-ocean',
              t(
                '洋流为何可能修正同纬度沿岸气候？',
                'How can currents modify coastal climate at the same latitude?',
              ),
              'transport',
              [
                [
                  'transport',
                  '输送热量，海气交换与风共同影响',
                  'Heat transport, air–sea exchange and winds contribute',
                ],
                [
                  'latitude',
                  '洋流把地点搬到另一纬度',
                  'Currents move the place to another latitude',
                ],
              ],
              t(
                '✓ 回访GEO030：温度颜色不是速度，效应取决于环境与季节。',
                '✓ Recall GEO030: temperature colour is not speed; effects depend on setting/season.',
              ),
              t(
                '同一岸边，来水较暖或较凉，发生了什么交换？',
                'At one coast, compare warmer/cooler incoming water and exchange.',
              ),
            )}
            {question(
              'climate-belt-limit',
              t(
                '纬度带足够判断所有气候类型吗？',
                'Are latitude belts enough to diagnose every climate type?',
              ),
              'multiple',
              [
                [
                  'multiple',
                  '不；还需温度、降水、季节、地形与海洋等',
                  'No: also need temperature, rain, seasons, terrain/ocean etc.',
                ],
                [
                  'only',
                  '足够；画三条颜色带就完成所有分类',
                  'Yes: three colours complete every classification',
                ],
              ],
              t(
                '✓ 热量带是起点；实际气候分类如Köppen需不同统计规则。',
                '✓ Heat belts are a starting point; classifications such as Köppen use different statistical rules.',
              ),
              t(
                '看同纬高原例、降水信息是否在纬度图中。',
                'Consider the same-latitude plateau and missing rainfall information.',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-039') {
    const raw = Number(d['monsoon-contrast'] ?? 2),
      a = monsoonContrast(raw),
      point =
        d['monsoon-chart'] === 'india-southeast'
          ? 'india-southeast'
          : 'india-west';
    const change = (value: number) => {
      const m = monsoonContrast(value);
      patch({
        'monsoon-contrast': String(m.contrast),
        [`monsoon-${m.phase === 'equal' ? 'equal' : m.phase}`]: 'yes',
      });
    };
    const model = (
      <>
        <MonsoonMap mode={mode} contrast={a.contrast} />
        <label className="geo-writing">
          {words(
            mode,
            '陆地减海洋冷热比较级（−2凉陆；0相同；+2暖陆；非°C）',
            'Land minus ocean contrast (−2 cooler land; 0 equal; +2 warmer land; not °C)',
          )}
          <input
            type="range"
            min="-2"
            max="2"
            step="1"
            value={a.contrast}
            onChange={(e) => change(Number(e.target.value))}
          />
        </label>
        {choices(
          t('设定陆海冷热对比', 'Set land–ocean contrast'),
          [
            ['2', '较暖陆地／夏季概略', 'Warmer land / summer tendency'],
            [
              '0',
              '冷热相同／仅此驱动为零',
              'Equal contrast / this driver zero',
            ],
            ['-2', '较凉陆地／凉季概略', 'Cooler land / cool-season tendency'],
          ],
          String(a.contrast),
          (v) => change(Number(v)),
        )}
      </>
    );
    const charts = (
      <>
        {choices(
          t('比较印度附近季节雨图', 'Compare India-vicinity seasonal rainfall'),
          [
            ['india-west', '印度西岸附近', 'West India vicinity'],
            ['india-southeast', '印度东南海岸附近', 'SE India coast vicinity'],
          ],
          point,
          (v) =>
            patch({
              'monsoon-chart': v,
              [`monsoon-${v === 'india-west' ? 'west' : 'east'}-chart`]: 'yes',
            }),
        )}
        <MonsoonChart mode={mode} pointId={point} />
      </>
    );
    return (
      <div className="geo-skill-explorer">
        {(mission || panel < 2) && model}
        {(mission || panel === 2) && charts}
        {mission && (
          <>
            {question(
              'monsoon-warm-force',
              t(
                '较暖陆地的图中，低层气压梯度力主要趋向哪里？',
                'In the warmer-land example, where does the surface pressure-gradient force tend?',
              ),
              'sea-land',
              [
                ['sea-land', '海 → 陆', 'Sea → land'],
                ['land-sea', '陆 → 海', 'Land → sea'],
              ],
              t(
                '✓ 此例海侧H、陆侧L；真实风还受自转和其他力影响。',
                '✓ This case has ocean H/land L; real winds also depend on rotation/other forces.',
              ),
              t(
                '先找H/L；这里问力的趋向，不是精确风轨迹。',
                'Find H/L; the question concerns force tendency, not an exact wind path.',
              ),
            )}
            {question(
              'monsoon-cool-force',
              t(
                '较凉陆地后，这个低层趋向怎样变？',
                'With cooler land, how does this surface tendency change?',
              ),
              'land-sea',
              [
                ['sea-land', '仍只海 → 陆', 'Only sea → land'],
                ['land-sea', '陆 → 海', 'Land → sea'],
              ],
              t(
                '✓ 陆海冷热对比反转，概略季节流向反转；不是每天都这样。',
                '✓ Reversing contrast reverses the broad seasonal tendency; not every day follows it.',
              ),
              t('将滑块移到−2，比较H/L。', 'Move to −2 and compare H/L.'),
            )}
            {question(
              'monsoon-scale',
              t(
                '季风与每天海陆风主要在什么尺度上不同？',
                'What main scale difference separates monsoon from daily land/sea breeze?',
              ),
              'season',
              [
                [
                  'season',
                  '区域性季节变化，比昼夜海风更复杂',
                  'Regional seasonal change, more complex than daily breezes',
                ],
                ['day', '季风每晚都反转一次', 'Monsoon reverses every night'],
              ],
              t(
                '✓ 季风是季节性环流；不能把一个下午的海风直接当季风。',
                '✓ Monsoon is seasonal circulation; one afternoon sea breeze does not establish it.',
              ),
              t(
                '比较月份和一天内小时；查看地图的区域范围。',
                'Compare months with hours and the regional map extent.',
              ),
            )}
            {question(
              'monsoon-rain',
              t(
                '风向海到陆是否足以保证降雨？',
                'Does sea-to-land flow alone guarantee rain?',
              ),
              'moisture-lift',
              [
                [
                  'moisture-lift',
                  '不；水汽供应、抬升冷却等条件也要满足',
                  'No: moisture supply, lifting/cooling and other conditions matter',
                ],
                [
                  'wind-only',
                  '足够；风一转向就到处降大雨',
                  'Yes: reversal brings heavy rain everywhere',
                ],
              ],
              t(
                '✓ 风向与雨量不是同一变量；结合GEO036/037的条件。',
                '✓ Wind direction and rain amount differ; apply GEO036/037 conditions.',
              ),
              t(
                '较干气块遇山时，是否每个高度都有云？',
                'Does a drier parcel form cloud at every height over a ridge?',
              ),
            )}
            {question(
              'monsoon-exception',
              t(
                '东南附近格子10–12月仍较湿，如何避免“凉季全亚洲无雨”？',
                'The SE-vicinity cell is wet in 10–12. How avoid “no cool-season rain across Asia”?',
              ),
              'sea-path',
              [
                [
                  'sea-path',
                  '流向经过海面可获水汽，区域路径与天气系统不同',
                  'Ocean paths can gain moisture; regional pathways/weather differ',
                ],
                [
                  'none',
                  '忽略东南资料，只记全亚洲一样',
                  'Ignore SE evidence; all Asia is identical',
                ],
              ],
              t(
                '✓ IMD资料确认泰米尔纳德有东北季风雨期；近海格子不是城区气象站。',
                '✓ IMD documents Tamil Nadu’s northeast monsoon rains; the near-coast cell is not a city station.',
              ),
              t(
                '比较两地月雨图，再追踪孟加拉湾附近路径。',
                'Compare both rain charts and the Bay of Bengal pathway.',
              ),
            )}
            {question(
              'monsoon-limit',
              t(
                '这个陆海滑块能预报雨季开始的具体日期吗？',
                'Can this land/ocean slider forecast the exact onset date?',
              ),
              'complex',
              [
                [
                  'complex',
                  '不能；只展示机制之一，未解真实系统',
                  'No: one mechanism is illustrated, not the real system solved',
                ],
                ['date', '能；+2总是6月1日', 'Yes: +2 always means 1 June'],
              ],
              t(
                '✓ 年份与地区有差异；长时均值和概念图都不是当年预报。',
                '✓ Years/regions differ; climatology and a conceptual diagram are not a current-year forecast.',
              ),
              t(
                '看看滑块是否有年份或真实时间轴。',
                'Does the slider have a year or actual time axis?',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  const selected = d['desert-selected'] ?? 'sahara',
    temperature = d['desert-map'] === 'temperature',
    photo = d['desert-photo'] === 'cold' ? 'cold' : 'hot',
    c = desertCases.find((c) => c.id === selected) ?? desertCases[0]!,
    p = climateData.points.find((p) => p.id === c.id)!;
  const photos = (
    <>
      {choices(
        t('比较冷热沙漠的真实影像', 'Compare actual hot/cold desert imagery'),
        [
          ['hot', '撒哈拉沙丘／2012', 'Sahara dunes / 2012'],
          ['cold', '戈壁冬雪／2025', 'Gobi winter snow / 2025'],
        ],
        photo,
        (v) => patch({ 'desert-photo': v, [`desert-photo-${v}`]: 'yes' }),
      )}
      <AssetImage
        mode={mode}
        id={photo === 'hot' ? 'sahara-dunes' : 'gobi-snow'}
      />
      <p>
        {words(
          mode,
          '照片显示地表的一刻；颜色、沙丘或一次雪不能单独证明长期温度与干燥程度。',
          'Images show a moment; colour, dunes or one snowfall cannot alone establish long-term temperature/aridity.',
        )}
      </p>
    </>
  );
  const maps = (
    <>
      {choices(
        t(
          '比较降水与温度证据',
          'Compare precipitation and temperature evidence',
        ),
        [
          [
            'rain',
            'GPCP年降水／mm/year',
            'GPCP annual precipitation / mm/year',
          ],
          ['temperature', 'NCEP年气温／°C', 'NCEP annual air temperature / °C'],
        ],
        temperature ? 'temperature' : 'rain',
        (v) =>
          patch({
            'desert-map': v,
            [`desert-${v === 'rain' ? 'rain' : 'temp'}-map`]: 'yes',
          }),
      )}
      {choices(
        t('选择全球少雨案例', 'Select a global low-precipitation case'),
        desertCases.map((c) => [c.id, c.zh, c.en]),
        selected,
        (v) => patch({ 'desert-selected': v, [`desert-${v}`]: 'yes' }),
      )}
      <DesertMap mode={mode} temperature={temperature} selected={selected} />
      <p>
        <Text mode={mode} text={t(c.clueZh, c.clueEn)} />
      </p>
      <table className="geo-data-table geo-weather-table">
        <caption>
          {words(
            mode,
            '不同网格、相同1991–2020基准；仅样点估计',
            'Different grids, same 1991–2020 baseline; selected-cell estimates only',
          )}
        </caption>
        <tbody>
          <tr>
            <th>{words(mode, '年降水', 'Annual precipitation')}</th>
            <td>{p.annualRain} mm/year</td>
          </tr>
          <tr>
            <th>
              {words(
                mode,
                '温度网格一月／七月',
                'Temperature cell January/July',
              )}
            </th>
            <td>
              {p.monthlyTemperature[0]} / {p.monthlyTemperature[6]}°C
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
  return (
    <div className="geo-skill-explorer">
      {(mission || panel === 0) && photos}
      {(mission || panel > 0) && maps}
      {mission && (
        <>
          {desertCases.map((c) =>
            question(
              `desert-cause-${c.id}`,
              t(
                `${c.zh}的少雨机制之一是什么？`,
                `Which is one dryness mechanism for ${c.en}?`,
              ),
              c.cause,
              [
                [
                  'subsidence',
                  '副热带下沉较不利成云',
                  'Subtropical subsidence suppresses clouds',
                ],
                [
                  'interior',
                  '大陆内部与山地屏障影响水汽',
                  'Interior location/mountains limit moisture',
                ],
                [
                  'coast',
                  '冷海流、下沉与山地共同影响',
                  'Cold current, subsidence and mountains',
                ],
                [
                  'polar',
                  '极冷与内陆水汽供应少',
                  'Extreme cold and limited interior moisture',
                ],
              ],
              t(
                '✓ 机制可共同作用；这不是每个格子唯一成因的证明。',
                '✓ Mechanisms can combine; this does not prove a unique cause for every cell.',
              ),
              t(
                '回看对应案例说明，不把“少雨”都解释成离赤道远。',
                'Revisit that case’s clue; low rain has more than one explanation.',
              ),
            ),
          )}
          {question(
            'desert-common',
            t(
              '这些沙漠最值得先比较的共同特征是？',
              'What shared feature should you first compare across these deserts?',
            ),
            'dry',
            [
              [
                'dry',
                '长期干燥，水分供应有限',
                'Long-term dryness and limited water supply',
              ],
              ['hot', '全年都炎热', 'Hot all year'],
              ['sand', '必须全铺沙丘', 'Must be entirely dunes'],
            ],
            t(
              '✓ 气温与地表材料可以不同；干燥还应结合蒸散需求。',
              '✓ Temperature/surface materials differ; dryness also involves evaporative demand.',
            ),
            t(
              '对照戈壁一月温度与撒哈拉，再看年降水。',
              'Compare January temperatures in Gobi/Sahara, then annual precipitation.',
            ),
          )}
          {question(
            'desert-cold',
            t(
              '有冬雪或大量古老冰，仍可能是沙漠吗？',
              'Can winter snow or abundant old ice coexist with desert conditions?',
            ),
            'possible',
            [
              [
                'possible',
                '可以；一次降水和长期冰储量不是年水分输入',
                'Yes: one event and stored ice differ from annual water input',
              ],
              [
                'never',
                '不可能；白色地表一定雨水多',
                'Impossible: white ground means lots of rain',
              ],
            ],
            t(
              '✓ 南极内陆年降水可少；海岸情况与内陆不同。',
              '✓ Antarctic interior can receive little annual precipitation; coasts differ.',
            ),
            t(
              '区分每年新落下的水与多年累积的储存。',
              'Distinguish new annual precipitation from accumulated storage.',
            ),
          )}
          {question(
            'desert-map-limit',
            t(
              '年降水小于250 mm的所有格子都能直接标成沙漠吗？',
              'Can every cell below 250 mm/year be directly classified as desert?',
            ),
            'not-classification',
            [
              [
                'not-classification',
                '不能；这不是完整分类，也包含海洋格子',
                'No: not a complete classification; ocean cells included',
              ],
              [
                'all',
                '能；一个阈值决定所有气候',
                'Yes: one threshold decides every climate',
              ],
            ],
            t(
              '✓ 本图是降水参考。完整干旱判断需温度、季节、蒸散和地点等。',
              '✓ This is a precipitation reference; fuller aridity diagnosis needs temperature, seasons, evaporative demand and setting.',
            ),
            t(
              '看看海面也有颜色；图是否给出蒸散？',
              'Notice coloured ocean cells; is evaporative demand provided?',
            ),
          )}
          {question(
            'desert-nz',
            t(
              '基督城比格雷茅斯少雨，就证明坎特伯雷是沙漠吗？',
              'Does Christchurch being drier than Greymouth prove Canterbury is a desert?',
            ),
            'not-same',
            [
              [
                'not-same',
                '不能；相对较干不等于沙漠，要更多长期条件',
                'No: relatively drier is not desert; need broader long-term evidence',
              ],
              [
                'yes',
                '能；只要比别处干就叫沙漠',
                'Yes: any drier place is a desert',
              ],
            ],
            t(
              '✓ GEO037的594/2452只是两站对照。不要把比较结论扩大成整个地区分类。',
              '✓ GEO037’s 594/2452 compares two stations; do not expand it into a region-wide classification.',
            ),
            t(
              '“较干”相对谁？有完整干旱分类证据吗？',
              'Drier relative to what? Is complete classification evidence present?',
            ),
          )}
        </>
      )}
      {status}
    </div>
  );
}
