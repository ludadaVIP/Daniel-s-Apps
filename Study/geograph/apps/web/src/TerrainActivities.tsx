import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ActivityState } from './progress';
import { t, words } from './content';
import { AssetImage, Text } from './ui';
import {
  ClimateMap,
  climatePointNames,
  ContourDiagram,
  LandformCards,
  landforms,
  ReliefMap,
  RiverDiagram,
} from './TerrainVisuals';
import {
  flowPath,
  riverNext,
  riverNodes,
  terrainFinished,
} from './terrainModels';
import climate from '../../../content/climate-data.json';
type Props = {
  id: string;
  mode: LanguageMode;
  state: ActivityState;
  onChange: (s: ActivityState) => void;
  panel?: number;
  mission?: boolean;
};
export function TerrainExplorer({
  id,
  mode,
  state,
  onChange,
  panel = 0,
  mission = false,
}: Props) {
  const d = state.decisions;
  const [message, setMessage] = useState(
    t(
      '操作图像，比较证据，可以随时重试。',
      'Explore the diagrams, compare evidence and retry freely.',
    ),
  );
  const patch = (key: string, value: string) =>
    onChange({ ...state, decisions: { ...d, [key]: value } });
  const status = (
    <div
      className={`geo-feedback ${terrainFinished(id, d) ? 'success' : ''}`}
      role="status"
    >
      <Text
        mode={mode}
        text={
          terrainFinished(id, d)
            ? t(
                '✓ 任务证据齐全。请用自己的话解释这张图。',
                '✓ Mission evidence complete. Explain the diagram in your own words.',
              )
            : message
        }
      />
    </div>
  );
  function choose(
    key: string,
    correct: string,
    options: { id: string; text: LocalizedText }[],
    prompt: LocalizedText,
    hint: LocalizedText,
    explanation: LocalizedText,
  ) {
    return (
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
                if (o.id === correct) {
                  patch(key, o.id);
                  setMessage(explanation);
                } else setMessage(hint);
              }}
            >
              {d[key] === o.id ? '✓ ' : ''}
              <Text mode={mode} text={o.text} />
            </button>
          ))}
        </div>
      </section>
    );
  }
  if (id === 'GEO-009') {
    if (!mission && panel === 1)
      return <AssetImage id="tibet-relief" mode={mode} compact />;
    if (!mission && panel === 2)
      return (
        <>
          <AssetImage id="tarim-basin" mode={mode} compact />
          <AssetImage id="south-island-modis" mode={mode} compact />
        </>
      );
    return (
      <div className="geo-skill-explorer">
        <ReliefMap mode={mode} />
        <LandformCards mode={mode} reveal={!mission} />
        {mission ? (
          <>
            {landforms.map((p, i) =>
              choose(
                `landform-${p.id}`,
                p.id,
                landforms.map((o) => ({ id: o.id, text: t(o.zh, o.en) })),
                t(
                  `剖面${String.fromCharCode(65 + i)}配哪种地形？`,
                  `Which landform fits section ${String.fromCharCode(65 + i)}?`,
                ),
                p.clue,
                t(`✓ ${p.zh}：${p.clue.zh}`, `✓ ${p.en}: ${p.clue.en}`),
              ),
            )}
            {choose(
              'relief-evidence',
              'shape',
              [
                {
                  id: 'colour',
                  text: t(
                    '棕色一定就是山，绿色一定是平原',
                    'Brown always means mountains; green always means plains',
                  ),
                },
                {
                  id: 'shape',
                  text: t(
                    '结合图例、峰谷形状和周围的相对高度',
                    'Combine the legend, peaks/valleys and surrounding heights',
                  ),
                },
              ],
              t(
                '换到真实照片，哪种证据更可靠？',
                'Which evidence is more reliable in real imagery?',
              ),
              t(
                '卫星照片中颜色可能来自植被、岩石、云和光线；先检查图的类型。',
                'Photo colours can reflect vegetation, rocks, clouds and light; check the image type first.',
              ),
              t(
                '✓ 高低关系与形状能帮助判断；单凭颜色不能测出海拔。',
                '✓ Relative heights and shape help; colour alone cannot measure elevation.',
              ),
            )}
            {status}
          </>
        ) : null}
      </div>
    );
  }
  if (id === 'GEO-010') {
    const view = d['contour-view'] === 'section' ? 'section' : 'map',
      interval = d['contour-interval'] === '50' ? 50 : 100,
      selected = ['100', '200', '300'].includes(d['contour-selected'] ?? '')
        ? Number(d['contour-selected'])
        : 200;
    return (
      <div className="geo-skill-explorer">
        <div
          className="geo-choices"
          role="group"
          aria-label={words(
            mode,
            '同一座山的视图',
            'Views of the same mountain',
          )}
        >
          {[
            ['map', '俯视等高线', 'Contour plan'],
            ['section', '东西剖面', 'West–east section'],
          ].map(([v, zh, en]) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => patch('contour-view', v!)}
            >
              {words(mode, zh!, en!)}
            </button>
          ))}
        </div>
        {(panel === 1 || mission) && (
          <div
            className="geo-choices"
            role="group"
            aria-label={words(mode, '等高距', 'Contour interval')}
          >
            {[100, 50].map((n) => (
              <button
                key={n}
                aria-pressed={interval === n}
                onClick={() => patch('contour-interval', String(n))}
              >
                {n} m
              </button>
            ))}
          </div>
        )}
        <ContourDiagram
          mode={mode}
          view={view}
          interval={interval}
          selected={selected}
        />
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '高亮同一高度', 'Highlight a height')}
        >
          {[100, 200, 300].map((n) => (
            <button
              key={n}
              aria-pressed={selected === n}
              onClick={() => patch('contour-selected', String(n))}
            >
              {n} m
            </button>
          ))}
        </div>
        {mission ? (
          <>
            <button
              className="geo-button secondary"
              onClick={() => {
                patch(`contour-${view}`, 'seen');
                setMessage(
                  t(
                    '✓ 已记录当前视图。切换另一视图，核对同一高度对应的位置。',
                    '✓ View recorded. Switch views to compare positions at the same height.',
                  ),
                );
              }}
            >
              {words(mode, '记录当前视图', 'Record current view')} ·{' '}
              {d[`contour-${view}`] === 'seen' ? '✓' : '○'}
            </button>
            <p className="geo-caption">
              {words(mode, '俯视', 'Plan')}{' '}
              {d['contour-map'] === 'seen' ? '✓' : '○'} ·{' '}
              {words(mode, '剖面', 'Section')}{' '}
              {d['contour-section'] === 'seen' ? '✓' : '○'}
            </p>
            {choose(
              'contour-height',
              '200',
              [
                { id: '100', text: t('100米', '100 m') },
                { id: '200', text: t('200米', '200 m') },
                { id: '300', text: t('300米', '300 m') },
              ],
              t(
                '一条线标着200米，线上另一点是什么高度？',
                'A line is labelled 200 m. How high is another point on that same line?',
              ),
              t(
                '同一条等高线连接同一海拔的点，不要把间隔数当作海拔。',
                'A contour joins points of equal elevation; do not confuse interval count with elevation.',
              ),
              t(
                '✓ 同一条线上的点都表示200米。两条线之间的高度仍需估计。',
                '✓ Points on that line indicate 200 m. Heights between contours still require estimation.',
              ),
            )}
            {(['steep', 'gentle'] as const).map((kind) =>
              choose(
                `contour-${kind}`,
                kind === 'steep' ? 'east' : 'west',
                [
                  { id: 'west', text: t('西坡 W', 'West slope W') },
                  { id: 'east', text: t('东坡 E', 'East slope E') },
                ],
                kind === 'steep'
                  ? t(
                      '同样升高100米，哪边更陡？',
                      'Which side is steeper for the same 100 m rise?',
                    )
                  : t(
                      '哪边坡度更缓，水平距离更长？',
                      'Which side is gentler with a longer horizontal run?',
                    ),
                t(
                  '比较同一等高距与比例尺：西侧425米、东侧175米达到相同升高。',
                  'Use the same interval and scale: west needs 425 m, east 175 m, for the same rise.',
                ),
                t(
                  '✓ 陡坡用更短水平距离达到相同升高。改变等高距会改线数，不会改变山坡。',
                  '✓ A steeper slope gains the same height over a shorter run. Changing the contour interval changes line count, not the hill.',
                ),
              ),
            )}
            {status}
          </>
        ) : (
          <p className="geo-notice">
            <Text
              mode={mode}
              text={
                panel === 1
                  ? t(
                      '把等高距从100米改成50米：线更多，地形没变。比较不同地图之前，要同时检查比例尺和等高距。',
                      'Switch interval from 100 to 50 m: more lines, same terrain. Check both scale and interval before comparing different maps.',
                    )
                  : t(
                      '切换俯视与剖面，选择一个高度，追踪等高线与剖面交点。地图不是登山安全路线图。',
                      'Switch plan/section and select a height to trace corresponding positions. This is not a hiking safety map.',
                    )
              }
            />
          </p>
        )}
      </div>
    );
  }
  if (id === 'GEO-011') {
    if (!mission && panel === 1)
      return <AssetImage id="mississippi-network" mode={mode} compact />;
    const saved = d['river-path']?.split(',') ?? ['source'];
    const valid =
      saved.length > 0 &&
      saved[0] === 'source' &&
      saved.every((p, i) => i === 0 || riverNext(saved[i - 1]!, p));
    const path = valid ? saved : ['source'];
    const next = (to: string) => {
      const from = path.at(-1)!;
      if (riverNext(from, to)) {
        patch('river-path', [...path, to].join(','));
        setMessage(
          t(
            '✓ 沿相连河道流到更低海拔。继续追踪到河口。',
            '✓ Followed a connected channel to lower elevation. Continue to the mouth.',
          ),
        );
      } else
        setMessage(
          to === 'lake'
            ? t(
                '内流湖隔在另一侧山脊后，没有这条河流的连接。高度低并不表示一定能越岭流过去。',
                'The closed lake lies across another ridge with no connected channel. Lower elevation alone does not allow water to cross a divide.',
              )
            : t(
                '先看连通河道，再比较海拔。选择当前点的下游相邻点，水不会因为屏幕下方而流过去。',
                'Find a connected channel, then compare height. Choose the next downstream neighbour; screen-down does not determine flow.',
              ),
        );
    };
    return (
      <div className="geo-skill-explorer">
        <RiverDiagram
          mode={mode}
          path={mission ? path : flowPath}
          onPick={mission ? next : undefined}
        />
        <div className="geo-choices">
          {riverNodes.map((p) => (
            <button key={p.id} disabled={!mission} onClick={() => next(p.id)}>
              {words(mode, p.zh, p.en)} · {p.height} m
            </button>
          ))}
        </div>
        {mission ? (
          <>
            <button
              className="geo-button secondary"
              onClick={() => patch('river-path', 'source')}
            >
              {words(mode, '从源头重新追踪', 'Trace again from source')}
            </button>
            {choose(
              'river-divide',
              'ridge',
              [
                { id: 'river', text: t('蓝色河道中心', 'The blue channel') },
                {
                  id: 'ridge',
                  text: t(
                    '分开两侧流向的山脊',
                    'The ridge separating drainage directions',
                  ),
                },
              ],
              t('分水岭在哪里？', 'Where is the drainage divide?'),
              t(
                '流域包含向共同出口汇水的土地；分水岭通常在两侧流向分开的较高地带。',
                'A catchment includes land draining to a shared outlet; a divide is usually higher ground separating drainage directions.',
              ),
              t(
                '✓ 山脊隔开两侧汇水。流域是陆地面积，不只是河道线。',
                '✓ The ridge separates drainage. A catchment is land area, not just a channel line.',
              ),
            )}
            {choose(
              'river-exception',
              'closed',
              [
                {
                  id: 'all',
                  text: t(
                    '每一滴雨一定马上流入海洋',
                    'Every raindrop immediately reaches the sea',
                  ),
                },
                {
                  id: 'closed',
                  text: t(
                    '内流盆地可流向无出海通道的湖，水也会蒸发或渗入地下',
                    'Closed basins can feed lakes without surface outlets; water also evaporates or infiltrates',
                  ),
                },
              ],
              t(
                '东侧内流湖告诉我们什么？',
                'What does the eastern closed lake tell us?',
              ),
              t(
                '沿图找一条从这个湖穿过山脊到海的通道：本图没有。',
                'Look for a channel from this lake across the ridge to the sea: this map has none.',
              ),
              t(
                '✓ 很多河流通向海洋，但并非每一条河、每一滴雨都有这样的地表通路。',
                '✓ Many rivers reach the sea, but not every river or raindrop has that surface route.',
              ),
            )}
            {status}
          </>
        ) : panel === 2 ? (
          <p className="geo-notice">
            <Text
              mode={mode}
              text={t(
                '真实反例：美国Harney盆地的河流流向内流湖，湖没有地表出海出口。示意图右侧展示这种连接限制；未模拟地下水、蒸发和暴雨溢流。',
                'Real counterexample: rivers in the US Harney Basin feed lakes with no surface outlet to the sea. The right side illustrates this connection limit; groundwater, evaporation and storm overflow are not simulated.',
              )}
            />
          </p>
        ) : null}
      </div>
    );
  }
  if (id === 'GEO-012') {
    const selected = climate.points.some((p) => p.id === d['climate-point'])
      ? d['climate-point']!
      : 'tropical';
    const p = climate.points.find((p) => p.id === selected)!;
    return (
      <div className="geo-skill-explorer">
        {panel === 1 && !mission ? (
          <SunlightFootprint mode={mode} />
        ) : (
          <ClimateMap mode={mode} selected={selected} />
        )}
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '比较温度网格', 'Compare temperature cells')}
        >
          {climate.points.map((point) => (
            <button
              key={point.id}
              aria-pressed={selected === point.id}
              onClick={() =>
                onChange({
                  ...state,
                  decisions: {
                    ...d,
                    'climate-point': point.id,
                    [`climate-seen-${point.id}`]: 'yes',
                  },
                })
              }
            >
              {d[`climate-seen-${point.id}`] === 'yes' ? '✓ ' : ''}
              {words(mode, point.zh, climatePointNames[point.id]!)}
            </button>
          ))}
        </div>
        <div className="geo-climate-reading">
          <strong>
            {words(mode, p.zh, climatePointNames[p.id]!)} · {p.celsius}°C
          </strong>
          <p>
            {p.lat}°N · {p.lon < 0 ? Math.abs(p.lon) + '°W' : p.lon + '°E'} ·
            1991–2020
          </p>
          <Text
            mode={mode}
            text={t(
              '读的是一个粗网格的多年空气温度均值，不是此处每年的温度，也不是今天的读数。',
              'This is a coarse cell’s long-term mean air temperature, not its value every year or a reading today.',
            )}
          />
        </div>
        {(panel === 2 || mission) && (
          <div className="geo-light-comparison">
            {climate.points.slice(3).map((point) => (
              <article key={point.id}>
                <h4>{words(mode, point.zh, climatePointNames[point.id]!)}</h4>
                <strong>{point.celsius}°C</strong>
                <p>
                  {point.lat}°N ·{' '}
                  {words(
                    mode,
                    point.terrain === 'high' ? '高海拔地区' : '低地',
                    point.terrain === 'high' ? 'High terrain' : 'Low terrain',
                  )}
                </p>
              </article>
            ))}
          </div>
        )}
        {mission ? (
          <>
            {choose(
              'climate-trend',
              'latitude',
              [
                {
                  id: 'latitude',
                  text: t(
                    '这些点支持由低纬向高纬通常变冷的趋势',
                    'These samples support a generally cooler trend towards high latitudes',
                  ),
                },
                {
                  id: 'always',
                  text: t(
                    '纬度相同就一定温度相同',
                    'Same latitude always means the same temperature',
                  ),
                },
              ],
              t(
                '先比较热带、温带和格陵兰三个网格。哪种结论合适？',
                'Compare the tropical, temperate and Greenland cells. Which conclusion fits?',
              ),
              t(
                '先读数值与纬度；少数样点支持趋势，却不能证明所有地方完全一样。',
                'Read values and latitude; a few samples support a trend, not a rule without exceptions.',
              ),
              t(
                '✓ 多年光照与纬度帮助解释大趋势，地点还受海拔、海洋、环流等影响。',
                '✓ Sunlight and latitude help explain the broad trend; elevation, oceans and circulation also matter.',
              ),
            )}
            {choose(
              'climate-exception',
              'height',
              [
                {
                  id: 'height',
                  text: t(
                    '纬度接近仍有温差，高海拔是重要线索',
                    'Similar latitude can have different temperatures; high elevation is an important clue',
                  ),
                },
                {
                  id: 'colour',
                  text: t(
                    '因为地图给它涂了蓝色',
                    'Because the map painted it blue',
                  ),
                },
              ],
              t(
                '两处都约31.4°N，为什么高原较冷？',
                'Both comparison cells are near 31.4°N. Why is the plateau colder?',
              ),
              t(
                '颜色只是显示数据。比较地形，不能把低纬度等同于低海拔。',
                'Colour displays the data. Compare terrain: low latitude is not low elevation.',
              ),
              t(
                '✓ 海拔提供重要解释，但这对粗网格不能单独证明温差全部由海拔造成。',
                '✓ Elevation is an important explanation, but this coarse pair cannot prove that elevation causes the entire difference.',
              ),
            )}
            {choose(
              'climate-period',
              'climate',
              [
                {
                  id: 'today',
                  text: t(
                    '今天下午肯定就是这个温度',
                    'This must be today’s afternoon temperature',
                  ),
                },
                {
                  id: 'climate',
                  text: t(
                    '这是多年平均，不能据此预测今天',
                    'This is a long-term average, not a forecast for today',
                  ),
                },
              ],
              t(
                '地图上的1991–2020说明什么？',
                'What does 1991–2020 on the map tell us?',
              ),
              t(
                '先读统计时段，再读温度。几十年平均和今天的变化回答不同问题。',
                'Read the averaging period before the temperature. Decades of averages and today’s conditions answer different questions.',
              ),
              t(
                '✓ 多年均值用来比较气候背景；今天穿什么仍需看当天的天气。',
                '✓ Long-term means compare climate backgrounds; clothing today requires today’s weather.',
              ),
            )}
            {status}
          </>
        ) : null}
      </div>
    );
  }
  return null;
}
function SunlightFootprint({ mode }: { mode: LanguageMode }) {
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 640 240"
        role="img"
        aria-label={words(
          mode,
          '相同宽度的光束，高角度集中在较短地面，低角度摊到较长地面',
          'Equal-width beams: a high angle concentrates energy over less ground; a low angle spreads it over more ground',
        )}
      >
        <rect width="640" height="240" rx="12" fill="#f1efdf" />
        <path d="M40 190H600" stroke="#738068" strokeWidth="4" />
        <path d="M125 40V185M165 40V185" stroke="#dab056" strokeWidth="6" />
        <path
          d="M335 65L550 189M355 30L630 189"
          stroke="#dab056"
          strokeWidth="6"
        />
        <path d="M125 194H165M550 194H630" stroke="#315f69" strokeWidth="8" />
        <text x="50" y="225" fontSize="19">
          {words(mode, '高角度：更集中', 'High angle: concentrated')}
        </text>
        <text x="342" y="225" fontSize="19">
          {words(mode, '低角度：更分散', 'Low angle: spread out')}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '几何示意：等宽平行光束分别以90°和30°照向平面；低角度铺开的长度是两倍。仅隔离照射角度，未加入云、昼长、地表反照率和大气，不是温度计算器。',
            'Geometry: equal-width parallel beams strike a plane at 90° or 30°; the lower angle spans twice the ground length. This isolates incidence angle, omitting clouds, day length, albedo and atmosphere. It is not a temperature calculator.',
          )}
        />
      </figcaption>
    </figure>
  );
}
