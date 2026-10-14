import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ActivityState } from './progress';
import { t, words } from './content';
import { Text, AssetImage } from './ui';
import {
  ClimateChart,
  AtmosphereLayers,
  RadiationModel,
  WindModel,
  CloudModel,
} from './WeatherVisuals';
import {
  weather,
  layers,
  scaleCases,
  weatherFinished,
  weatherEvidence,
  windCase,
  cloudParcel,
} from './weatherModels';

type Choice = [string, string, string];
export function WeatherExplorer({
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
  const buttons = (
    label: LocalizedText,
    options: Choice[],
    active: string,
    select: (v: string) => void,
  ) => (
    <div
      className="geo-choices"
      role="group"
      aria-label={words(mode, label.zh, label.en)}
    >
      {options.map(([v, zh, en]) => (
        <button key={v} aria-pressed={active === v} onClick={() => select(v)}>
          <Text mode={mode} text={t(zh, en)} />
        </button>
      ))}
    </div>
  );
  const choice = (
    key: string,
    prompt: LocalizedText,
    correct: string,
    options: Choice[],
    why: LocalizedText,
    hint: LocalizedText,
  ) => (
    <section key={key} className="geo-terrain-question">
      <h4>
        <Text mode={mode} text={prompt} />
      </h4>
      {buttons(prompt, options, d[key] ?? '', (v) => patch({ [key]: v }))}
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
  const evidenceLabels: Record<string, [string, string]> = {
    'day-0': ['查看1月11日', 'Inspect 11 January'],
    'day-1': ['查看1月15日', 'Inspect 15 January'],
    'climate-nz': ['查看南岛长期图', 'Inspect South Island climatology'],
    'climate-europe': ['查看欧洲长期图', 'Inspect European climatology'],
    'energy-clear': ['比较红外透明例', 'Compare IR-transparent case'],
    'energy-absorb': ['比较吸收再发射例', 'Compare absorbing/emitting case'],
    'wind-0': ['比较0 hPa', 'Compare 0 hPa'],
    'wind-4': ['比较4 hPa', 'Compare 4 hPa'],
    'wind-12': ['比较12 hPa', 'Compare 12 hPa'],
    'wind-forward-north': [
      '高压在左／北半球',
      'High left / Northern Hemisphere',
    ],
    'wind-forward-south': [
      '高压在左／南半球',
      'High left / Southern Hemisphere',
    ],
    'wind-reverse-north': [
      '高压在右／北半球',
      'High right / Northern Hemisphere',
    ],
    'parcel-wet-low': ['较湿气块0 km', 'Moister parcel at 0 km'],
    'parcel-dry-low': ['较干气块0 km', 'Drier parcel at 0 km'],
    'parcel-wet-one': ['较湿气块1 km', 'Moister parcel at 1 km'],
    'parcel-dry-one': ['较干气块1 km', 'Drier parcel at 1 km'],
    'parcel-wet-cloud': ['较湿气块超过云底', 'Moister parcel above cloud base'],
    'parcel-dry-cloud': ['较干气块超过云底', 'Drier parcel above cloud base'],
    'parcel-small': ['有云时仍是小滴', 'Cloud with tiny drops'],
    'parcel-grow': ['有云且假设粒子增长', 'Cloud with assumed particle growth'],
  };
  const status = mission && (
    <>
      <ul className="geo-weather-checklist">
        {weatherEvidence[id]!.map((k) => (
          <li key={k}>
            {d[k] === 'yes' ? '✓' : '○'}{' '}
            <Text mode={mode} text={t(...evidenceLabels[k]!)} />
          </li>
        ))}
      </ul>
      <p
        role="status"
        className={`geo-feedback ${weatherFinished(id, d) ? 'success' : ''}`}
      >
        <Text
          mode={mode}
          text={
            weatherFinished(id, d)
              ? t(
                  '✓ 任务证据齐全。用自己的话解释比较结果与一条局限。',
                  '✓ Mission evidence complete. Explain the comparison and one limit in your own words.',
                )
              : t(
                  '还有比较或推理未记录。操作图示，再查看选择题提示。',
                  'Some comparisons/reasoning remain. Explore the model, then check question hints.',
                )
          }
        />
      </p>
    </>
  );
  if (mystery)
    return (
      <AssetImage
        mode={mode}
        id={
          id === 'GEO-034'
            ? 'iss-atmosphere'
            : id === 'GEO-033'
              ? 'weather-rain-2020-01-11'
              : 'south-island-modis'
        }
      />
    );
  if (id === 'GEO-033') {
    const day = d['weather-day'] === '1' ? 1 : 0,
      point = d['weather-point'] === 'europe' ? 'europe' : 'nz',
      p = weather.points[0]!,
      daily = p.days[day]!;
    const days = (
      <>
        <h4>
          {words(
            mode,
            '一日地图：同一网格、两个日期',
            'Daily maps: same cell, two dates',
          )}
        </h4>
        {buttons(
          t('选择历史天气日', 'Select historical weather day'),
          [
            ['0', '2020-01-11 UTC', '2020-01-11 UTC'],
            ['1', '2020-01-15 UTC', '2020-01-15 UTC'],
          ],
          String(day),
          (v) => patch({ 'weather-day': v, [`day-${v}`]: 'yes' }),
        )}
        <AssetImage id={`weather-rain-${daily.date}`} mode={mode} />
        <p>
          <Text
            mode={mode}
            text={t(
              `红点${Math.abs(p.lat)}°S, ${p.lon}°E。${daily.date} UTC：降水${daily.rain.toFixed(2)} mm/day，平均气温${daily.temperature.toFixed(1)}°C。0.00表示四舍五入后的网格估计，不证明任何屋顶完全无雨。`,
              `Red point ${Math.abs(p.lat)}°S, ${p.lon}°E. ${daily.date} UTC: precipitation ${daily.rain.toFixed(2)} mm/day, mean temperature ${daily.temperature.toFixed(1)}°C. Rounded 0.00 does not prove every roof was dry.`,
            )}
          />
        </p>
        <p>
          {words(
            mode,
            '这是特意选出的两个对照日，不能代表2020年所有天气。',
            'These two selected comparison days do not represent all weather in 2020.',
          )}
        </p>
      </>
    );
    const climate = (
      <>
        <h4>
          {words(
            mode,
            '长期图：每个月汇总30年',
            'Long-term charts: each month combines 30 years',
          )}
        </h4>
        {buttons(
          t('选择长期气候网格', 'Select climatology cell'),
          weather.points.map((p) => [p.id, p.zh, p.en]),
          point,
          (v) => patch({ 'weather-point': v, [`climate-${v}`]: 'yes' }),
        )}
        <ClimateChart mode={mode} pointId={point} />
        <table className="geo-data-table geo-weather-table">
          <caption>
            {words(
              mode,
              '1991–2020月平均气温，°C',
              '1991–2020 monthly mean temperature, °C',
            )}
          </caption>
          <thead>
            <tr>
              <th>{words(mode, '网格', 'Cell')}</th>
              <th>{words(mode, '一月', 'January')}</th>
              <th>{words(mode, '七月', 'July')}</th>
            </tr>
          </thead>
          <tbody>
            {weather.points.map((p) => (
              <tr key={p.id}>
                <th>{words(mode, p.zh, p.en)}</th>
                <td>{p.temperature[0]}</td>
                <td>{p.temperature[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
    return (
      <div className="geo-skill-explorer">
        {(mission || panel === 0) && days}
        {(mission || panel === 1) && climate}
        {(mission || panel === 2) && (
          <>
            <h4>
              {words(
                mode,
                '按问题需要的时间尺度分类',
                'Classify by the time scale needed',
              )}
            </h4>
            {scaleCases.map((c) =>
              choice(
                `scale-${c.id}`,
                t(c.zh, c.en),
                c.answer,
                [
                  ['weather', '天气／短期状态', 'Weather / short-term state'],
                  [
                    'climate',
                    '气候／长期统计',
                    'Climate / long-term statistics',
                  ],
                  [
                    'change',
                    '气候变化／跨年份趋势',
                    'Climate change / trend across years',
                  ],
                ],
                t(
                  '✓ 分类取决于资料时间与问题；30年的月平均图不保留逐年趋势。',
                  '✓ Match the evidence period to the question; a 30-year monthly climatology does not retain yearly trends.',
                ),
                t(
                  '找“一天／三天”“30年平均”或“随年份变化”的线索。',
                  'Find “one/three days”, “30-year means”, or “changes across years”.',
                ),
              ),
            )}
          </>
        )}
        {mission && (
          <>
            {choice(
              'day-claim',
              t(
                '南岛某天有雨，能证明这里是多雨气候吗？',
                'Can rain on one South Island day prove a wet climate?',
              ),
              'limited',
              [
                [
                  'limited',
                  '不能；需要长期且有代表性的资料',
                  'No: need representative long-term evidence',
                ],
                ['yes', '能；一个雨天就够', 'Yes: one rainy day is enough'],
              ],
              t(
                '✓ 一天只支持当天网格情况；比较气候还需长期统计和参照。',
                '✓ One day supports that grid-day only; climate comparison needs long-term statistics and a reference.',
              ),
              t(
                '一次天气事件能告诉你许多年内雨有多常见吗？',
                'Can one event reveal how common rain is over many years?',
              ),
            )}
            {choice(
              'mean-claim',
              t(
                '一月平均每日降水2.06 mm意味着每天都下2.06 mm吗？',
                'Does January mean daily rain of 2.06 mm imply 2.06 mm every day?',
              ),
              'not-every',
              [
                [
                  'not-every',
                  '不；干湿日被汇总，平均掩盖差异',
                  'No: wet/dry days are combined; means hide variation',
                ],
                ['every', '是；每天都相同', 'Yes: every day is identical'],
              ],
              t(
                '✓ 平均不等于每个成员，也没有直接给出雨天个数。',
                '✓ A mean is not every member and does not directly give a rainy-day count.',
              ),
              t(
                '对照两天估计值和长期一月均值。',
                'Compare both daily estimates with the long-term January mean.',
              ),
            )}
            {choice(
              'season-claim',
              t(
                '南岛与欧洲网格一月／七月温度模式有何不同？',
                'How do January/July temperature patterns differ between these cells?',
              ),
              'opposite',
              [
                [
                  'opposite',
                  '南岛一月更暖；欧洲七月更暖',
                  'South Island warmer in January; Europe in July',
                ],
                ['same', '两地七月都更暖', 'Both warmer in July'],
              ],
              t(
                '✓ 南北半球季节大致相反；只对这两个网格下结论。',
                '✓ Northern/southern seasons broadly oppose; this comparison concerns these two cells.',
              ),
              t(
                '读表中一月和七月数值，不套用当地季节记忆。',
                'Read both months in the table; do not assume your local seasons apply everywhere.',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-034') {
    const absorbing = d['energy-mode'] === 'absorb',
      selected = d['layer-active'] ?? 'troposphere';
    const layerView = (
      <>
        {buttons(
          t('浏览大气层', 'Explore atmospheric layers'),
          layers.map((l) => [l.id, l.zh, l.en]),
          selected,
          (v) => patch({ 'layer-active': v }),
        )}
        <AtmosphereLayers mode={mode} selected={selected} />
      </>
    );
    const energy = (
      <>
        {buttons(
          t('比较红外辐射条件', 'Compare infrared conditions'),
          [
            ['clear', '红外透明', 'IR transparent'],
            ['absorb', '单层吸收／再发射', 'One absorbing/emitting layer'],
          ],
          absorbing ? 'absorb' : 'clear',
          (v) => patch({ 'energy-mode': v, [`energy-${v}`]: 'yes' }),
        )}
        <RadiationModel mode={mode} absorbing={absorbing} />
      </>
    );
    return (
      <div className="geo-skill-explorer">
        {(mission || panel === 0) && layerView}
        {(mission || panel === 1) && energy}
        {!mission && panel === 2 && (
          <AssetImage mode={mode} id="iss-atmosphere" />
        )}
        {mission && (
          <>
            {[
              [
                'weather',
                '多数天气出现在哪一层？',
                'Where does most weather occur?',
                'troposphere',
              ],
              [
                'ozone',
                '吸收大量太阳紫外线的臭氧层主要在哪？',
                'Which layer contains the main UV-absorbing ozone layer?',
                'stratosphere',
              ],
              [
                'meteor',
                '许多流星在哪层发光烧蚀？',
                'Where do many meteors glow and ablate?',
                'mesosphere',
              ],
              [
                'iss',
                '国际空间站约400 km属于哪层？',
                'Which layer contains the ISS at roughly 400 km?',
                'thermosphere',
              ],
              [
                'edge',
                '哪层逐渐过渡到太空？',
                'Which layer gradually transitions into space?',
                'exosphere',
              ],
            ].map(([k, zh, en, a]) =>
              choice(
                `layer-${k}`,
                t(zh!, en!),
                a!,
                layers.map((l) => [l.id, l.zh, l.en]),
                t(
                  '✓ 与约略高度和作用一致；真实层界会变化。',
                  '✓ Matches the approximate height and role; actual boundaries vary.',
                ),
                t(
                  '看图中的现象说明，不按图块厚度猜高度。',
                  'Read the phenomenon clues; band thickness is not height.',
                ),
              ),
            )}
            {choice(
              'energy-claim',
              t(
                '吸收地面红外后，模型大气做了什么？',
                'What does the model atmosphere do after absorbing surface IR?',
              ),
              'emit',
              [
                [
                  'emit',
                  '向上和向下发射；整体能量仍守恒',
                  'Emits upward/downward; total energy is conserved',
                ],
                [
                  'make',
                  '凭空创造7份新能量',
                  'Creates seven energy units from nothing',
                ],
                [
                  'lid',
                  '永远封住所有能量不让离开',
                  'Permanently blocks all outgoing energy',
                ],
              ],
              t(
                '✓ 吸收与发射都要追踪。两例太空都输出7，地面收支不同。',
                '✓ Track both absorption and emission. Both cases emit 7 to space; surface budgets differ.',
              ),
              t(
                '把太阳输入、向下辐射、地面输出与太空输出分别相加。',
                'Separately add solar input, downward emission, surface output and space output.',
              ),
            )}
            {choice(
              'height-claim',
              t(
                '图中12 km对流层顶能套用所有地点吗？',
                'Does the drawn 12 km tropopause apply everywhere?',
              ),
              'variable',
              [
                [
                  'variable',
                  '不能；约略示例，层界随条件变化',
                  'No: an approximate example; boundaries vary',
                ],
                [
                  'fixed',
                  '能；五层像固定厚度的硬壳',
                  'Yes: five rigid shells of fixed thickness',
                ],
              ],
              t(
                '✓ 新西兰与热带等地区的层界会不同；照片也不是标尺。',
                '✓ Boundaries differ between New Zealand, tropics and other conditions; a photo is not a ruler.',
              ),
              t(
                '查看图注中的6–20 km和“不按比例”。',
                'Check the 6–20 km range and “not to scale” caption.',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  if (id === 'GEO-035') {
    const reverse = d['wind-reverse'] === 'yes',
      hemisphere = ['north', 'south'].includes(d['wind-hemisphere'] ?? '')
        ? d['wind-hemisphere']!
        : 'none',
      difference = Number(d['wind-delta'] ?? 4);
    const change = (r: boolean, h: string, n: number) =>
      patch({
        'wind-reverse': r ? 'yes' : 'no',
        'wind-hemisphere': h,
        'wind-delta': String(n),
        [`wind-${n}`]: 'yes',
        ...(n > 0 ? { [`wind-${r ? 'reverse' : 'forward'}-${h}`]: 'yes' } : {}),
      });
    const a = windCase(reverse, hemisphere, difference);
    return (
      <div className="geo-skill-explorer">
        {buttons(
          t('同距离压力差', 'Pressure difference at fixed distance'),
          [
            ['0', '0 hPa', '0 hPa'],
            ['4', '4 hPa', '4 hPa'],
            ['12', '12 hPa', '12 hPa'],
          ],
          String(a.delta),
          (v) => change(reverse, hemisphere, Number(v)),
        )}
        {buttons(
          t('运动与自转规则', 'Motion and rotation rule'),
          [
            ['none', '仅气压梯度力', 'Pressure-gradient force alone'],
            ['north', '北半球／欧洲', 'Northern Hemisphere / Europe'],
            ['south', '南半球／新西兰', 'Southern Hemisphere / New Zealand'],
          ],
          hemisphere,
          (v) => change(reverse, v, a.delta),
        )}
        {buttons(
          t('交换高低压的位置', 'Swap high/low locations'),
          [
            ['no', '较高压在左', 'Higher pressure on left'],
            ['yes', '较高压在右', 'Higher pressure on right'],
          ],
          reverse ? 'yes' : 'no',
          (v) => change(v === 'yes', hemisphere, a.delta),
        )}
        <WindModel
          mode={mode}
          reverse={reverse}
          hemisphere={hemisphere}
          difference={a.delta}
        />
        {mission && (
          <>
            <p>
              {words(
                mode,
                '比较0、4、12 hPa；分别看高压在左时北／南半球、以及高压在右时北半球。',
                'Compare 0, 4 and 12 hPa; inspect high-left north/south cases and high-right north case.',
              )}
            </p>
            {choice(
              'wind-force',
              t(
                '红直箭头是哪一种方向？',
                'What direction does the straight red arrow represent?',
              ),
              'high-low',
              [
                [
                  'high-low',
                  '气压梯度力：高压指向低压',
                  'Pressure-gradient force: high toward low',
                ],
                ['low-high', '低压指向高压', 'Low toward high'],
              ],
              t(
                '✓ 这是力的方向，不保证真实风也沿直线走。',
                '✓ This is force direction, not a guarantee of straight real wind.',
              ),
              t(
                '比较两端hPa数字；别把蓝曲线当红箭头。',
                'Compare the hPa values; distinguish blue motion from red force.',
              ),
            )}
            {choice(
              'wind-gradient',
              t(
                '同距离4改为12 hPa，气压梯度如何变化？',
                'At fixed distance, how does the gradient change from 4 to 12 hPa?',
              ),
              'stronger',
              [
                [
                  'stronger',
                  '更强，其他相同时加速作用更强',
                  'Stronger; stronger acceleration with other conditions equal',
                ],
                ['weaker', '更弱', 'Weaker'],
              ],
              t(
                '✓ 压力差／距离更大。不能据此精确换算风速。',
                '✓ Pressure difference per distance increases; it gives no exact wind speed.',
              ),
              t(
                '距离没变，比较数字差及2 hPa等压线疏密。',
                'Distance is fixed; compare differences and 2 hPa isobar spacing.',
              ),
            )}
            {['north', 'south'].map((h) =>
              choice(
                `wind-${h}`,
                t(
                  `${h === 'north' ? '北' : '南'}半球沿运动方向看会向哪侧偏？`,
                  `Relative to motion, which way does ${h === 'north' ? 'Northern' : 'Southern'} Hemisphere motion deflect?`,
                ),
                h === 'north' ? 'right' : 'left',
                [
                  ['right', '右', 'Right'],
                  ['left', '左', 'Left'],
                ],
                t(
                  '✓ 右／左相对于运动方向，不是地图上永远东／西。',
                  '✓ Right/left are relative to motion, not always map east/west.',
                ),
                t(
                  '把自己转向蓝线前进方向，再判断左右。',
                  'Face the direction of motion, then judge left/right.',
                ),
              ),
            )}
            {choice(
              'wind-name',
              t(
                '从西边吹向东边的风叫什么？',
                'What is wind blowing from west toward east called?',
              ),
              'west',
              [
                [
                  'west',
                  '西风；按来自方向命名',
                  'West wind; named for where it comes from',
                ],
                [
                  'east',
                  '东风；按去向命名',
                  'East wind; named for destination',
                ],
              ],
              t(
                '✓ 风名说的是来向。箭头可画去向，先读图例。',
                '✓ Wind names give origin; arrows may show destination, so read the legend.',
              ),
              t(
                '“来自”与“吹向”是相反的方向。',
                '“From” and “toward” are opposite directions.',
              ),
            )}
            {choice(
              'wind-limit',
              t(
                '同压时本模型无加速，说明现实一定无风吗？',
                'Does no acceleration at equal pressure in this model prove no real wind?',
              ),
              'other',
              [
                [
                  'other',
                  '不；已有运动与其他力也要考虑',
                  'No: existing motion and other forces matter',
                ],
                [
                  'always',
                  '是；同压时空气立刻停住',
                  'Yes: equal pressure instantly stops air',
                ],
              ],
              t(
                '✓ 本例初始静止；没有某种加速不等于没有运动。',
                '✓ This example starts at rest; absence of one acceleration is not absence of motion.',
              ),
              t(
                '看图注的初始条件与省略因素。',
                'Check the initial condition and omitted factors in the caption.',
              ),
            )}
          </>
        )}
        {status}
      </div>
    );
  }
  const wet = d['parcel-kind'] !== 'dry',
    height = Number(d['parcel-height'] ?? 0),
    grow = d['parcel-growth'] === 'large',
    a = cloudParcel(wet, height, grow);
  const change = (w: boolean, z: number, g: boolean) => {
    const c = cloudParcel(w, z, g);
    patch({
      'parcel-kind': w ? 'wet' : 'dry',
      'parcel-height': String(c.height),
      'parcel-growth': g ? 'large' : 'small',
      ...(c.height === 1 ? { [`parcel-${w ? 'wet' : 'dry'}-one`]: 'yes' } : {}),
      ...(c.height === 0 ? { [`parcel-${w ? 'wet' : 'dry'}-low`]: 'yes' } : {}),
      ...(c.cloud
        ? {
            [`parcel-${w ? 'wet' : 'dry'}-cloud`]: 'yes',
            [`parcel-${g ? 'grow' : 'small'}`]: 'yes',
          }
        : {}),
    });
  };
  return (
    <div className="geo-skill-explorer">
      {!mission && panel === 0 && (
        <AssetImage mode={mode} id="south-island-modis" />
      )}
      {buttons(
        t(
          '相同初温，比较水汽条件',
          'Same initial temperature, different moisture',
        ),
        [
          ['wet', '较湿／露点16°C', 'Moister / dew point 16°C'],
          ['dry', '较干／露点6°C', 'Drier / dew point 6°C'],
        ],
        wet ? 'wet' : 'dry',
        (v) => change(v === 'wet', a.height, grow),
      )}
      <CloudModel mode={mode} wet={wet} height={a.height} grow={grow} />
      <label className="geo-writing">
        {words(
          mode,
          '强制抬升高度（km；不是时间）',
          'Imposed lift height (km; not time)',
        )}
        <input
          type="range"
          min="0"
          max="2"
          step="0.25"
          value={a.height}
          onChange={(e) => change(wet, Number(e.target.value), grow)}
        />
      </label>
      {buttons(
        t('设定抬升高度', 'Set lift height'),
        [
          ['0', '0 km', '0 km'],
          ['1', '1 km', '1 km'],
          ['2', '2 km', '2 km'],
        ],
        String(a.height),
        (v) => change(wet, Number(v), grow),
      )}
      {buttons(
        t('比较云粒子增长条件', 'Compare cloud particle growth'),
        [
          ['small', '仍是小云滴', 'Still tiny cloud drops'],
          ['large', '假设粒子已增长', 'Assume particles have grown'],
        ],
        grow ? 'large' : 'small',
        (v) => change(wet, a.height, v === 'large'),
      )}
      {mission && (
        <>
          <p>
            {words(
              mode,
              '两种气块都从0 km升到2 km，中途比较1 km；在有云时比较小滴与增长条件。',
              'Lift both parcels from 0 to 2 km, comparing 1 km along the way; compare tiny and grown particles when cloudy.',
            )}
          </p>
          {choice(
            'cloud-cause',
            t(
              '抬升的未饱和气块为什么冷却？',
              'Why does a lifted unsaturated parcel cool?',
            ),
            'expand',
            [
              [
                'expand',
                '外界压力较低，气块膨胀冷却',
                'Lower surrounding pressure allows expansion and cooling',
              ],
              ['sun', '因为更靠近太阳', 'Because it is closer to the Sun'],
              ['empty', '因为云吸走所有空气', 'Because clouds remove all air'],
            ],
            t(
              '✓ 这里是膨胀引起的绝热冷却，不要求先有云。',
              '✓ Adiabatic cooling follows expansion; it does not require an existing cloud.',
            ),
            t(
              '比较高处外界压力和气块大小。',
              'Compare surrounding pressure aloft and parcel size.',
            ),
          )}
          {choice(
            'cloud-visible',
            t(
              '普通白云主要是什么让我们看见它？',
              'What mainly makes ordinary white clouds visible?',
            ),
            'drops',
            [
              [
                'drops',
                '小液滴／冰晶散射光',
                'Small droplets/ice scatter light',
              ],
              ['gas', '水汽气体本身有白色', 'Vapour gas itself is white'],
            ],
            t(
              '✓ 气体水汽不可见，凝结形成的液滴才参与成云。',
              '✓ Vapour is invisible; condensed droplets help make clouds.',
            ),
            t(
              '回想水循环中蒸发与凝结的状态变化。',
              'Recall the state changes of evaporation and condensation.',
            ),
          )}
          {choice(
            'cloud-rain',
            t('有云就一定会下雨吗？', 'Does every cloud produce rain?'),
            'growth',
            [
              [
                'growth',
                '不；还需粒子增长等条件',
                'No: particles must grow and other conditions matter',
              ],
              [
                'all',
                '是；云出现就全部落下',
                'Yes: the whole cloud immediately falls',
              ],
            ],
            t(
              '✓ 液滴很小，可随气流悬浮；雨滴增长也不保证到地面。',
              '✓ Tiny drops can stay aloft with air motion; grown rain may evaporate before reaching ground.',
            ),
            t(
              '有云时切换“小云滴”与“已增长”，观察差别。',
              'While cloudy, compare tiny drops with assumed particle growth.',
            ),
          )}
          {choice(
            'cloud-dry',
            t(
              '同为20°C，较干气块的估计云底怎样？',
              'At the same 20°C, how does the drier parcel’s estimated cloud base compare?',
            ),
            'higher',
            [
              [
                'higher',
                '更高；需更多抬升与冷却',
                'Higher; needs greater lift and cooling',
              ],
              ['never', '永远不能成云', 'It can never form a cloud'],
              ['lower', '更低', 'Lower'],
            ],
            t(
              '✓ 两例估计云底约0.51/1.79 km；较干不等于永远不成云。',
              '✓ Estimated bases are about 0.51/1.79 km; drier does not mean cloud is impossible.',
            ),
            t(
              '比较两条云底线；把较干气块升至2 km。',
              'Compare both cloud-base lines; lift the drier parcel to 2 km.',
            ),
          )}
          {choice(
            'cloud-limit',
            t(
              '滑块能预报你家明天几点下雨吗？',
              'Can the slider forecast when it will rain at your home tomorrow?',
            ),
            'imposed',
            [
              [
                'imposed',
                '不能；抬升与增长是假设，未解真实天气',
                'No: lift/growth are assumed, not solved real weather',
              ],
              ['forecast', '能；1 km就代表一小时', 'Yes: 1 km means one hour'],
            ],
            t(
              '✓ 高度不是时间。新西兰和世界各地都要有实际天气资料。',
              '✓ Height is not time; both New Zealand and elsewhere need real weather evidence.',
            ),
            t(
              '查看横向条件、纵轴单位和模型省略因素。',
              'Read condition controls, height units and omitted processes.',
            ),
          )}
        </>
      )}
      {status}
    </div>
  );
}
