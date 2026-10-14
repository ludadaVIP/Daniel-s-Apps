import { useId } from 'react';
import type { LanguageMode } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';
import { contourAt, riverEdges, riverNodes } from './terrainModels';
import climate from '../../../content/climate-data.json';
import mapData from '../../../content/map-data.json';
const label = (m: LanguageMode, zh: string, en: string) =>
  m === 'bilingual' ? `${zh} / ${en}` : words(m, zh, en);
export const landforms = [
  {
    id: 'mountain',
    zh: '山地',
    en: 'Mountains',
    profile: 'M15 155L50 100L76 125L113 38L140 87L173 55L207 155Z',
    clue: t(
      '峰谷起伏明显，局部高差大。',
      'Peaks and valleys create large local height differences.',
    ),
  },
  {
    id: 'plain',
    zh: '平原',
    en: 'Plain',
    profile: 'M15 155L15 132L65 130L110 133L160 129L207 131V155Z',
    clue: t(
      '宽广地面起伏小；平坦描述形状，不等于零海拔。',
      'Broad land has little local relief; flat describes shape, not zero elevation.',
    ),
  },
  {
    id: 'basin',
    zh: '盆地',
    en: 'Basin',
    profile: 'M15 155V64L49 102L80 129L143 129L177 99L207 64V155Z',
    clue: t(
      '四周较高，中部相对低；底部可能也在海平面以上。',
      'Higher surroundings enclose a relatively lower centre, which may still be above sea level.',
    ),
  },
];
export function LandformCards({
  mode,
  reveal = false,
}: {
  mode: LanguageMode;
  reveal?: boolean;
}) {
  return (
    <div className="geo-landform-grid">
      {landforms.map((p, i) => (
        <figure key={p.id} className="geo-skill-figure">
          <svg
            viewBox="0 0 222 185"
            role="img"
            aria-label={label(
              mode,
              `剖面${String.fromCharCode(65 + i)}：${p.clue.zh}`,
              `Section ${String.fromCharCode(65 + i)}: ${p.clue.en}`,
            )}
          >
            <rect width="222" height="185" rx="12" fill="#edf1e6" />
            <path
              d={p.profile}
              fill="#acb98d"
              stroke="#526d53"
              strokeWidth="3"
            />
            <path d="M15 155H207" stroke="#79908e" strokeDasharray="5 4" />
            <text x="18" y="26" fontSize="22" fill="#315f69">
              {String.fromCharCode(65 + i)}
            </text>
          </svg>
          <figcaption>
            {reveal ? (
              <strong>
                <Text mode={mode} text={t(p.zh, p.en)} />
              </strong>
            ) : null}
            <Text mode={mode} text={p.clue} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
export function ReliefMap({ mode }: { mode: LanguageMode }) {
  const gradient = useId();
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 640 330"
        role="img"
        aria-label={label(
          mode,
          '虚构阴影地形图：西侧山峰，东侧平原，中部盆地。色阶表示相对高低，阴影强调坡面。',
          'Fictional shaded relief: western peaks, eastern plain and central basin. Colour indicates relative height; shading highlights slopes.',
        )}
      >
        <defs>
          <linearGradient id={gradient}>
            <stop stopColor="#e9e3c7" />
            <stop offset=".5" stopColor="#7b8a70" />
            <stop offset="1" stopColor="#d9cfac" />
          </linearGradient>
        </defs>
        <rect width="640" height="330" rx="12" fill="#bdca9e" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${35 + i * 40} 300L${150 + i * 20} 35L${250 + i * 45} 300Z`}
            fill={`url(#${gradient})`}
            stroke="#64775d"
            strokeWidth="2"
          />
        ))}
        <ellipse cx="376" cy="185" rx="105" ry="110" fill="#9d9e78" />
        <ellipse cx="376" cy="185" rx="76" ry="80" fill="#d8dba4" />
        <ellipse cx="376" cy="185" rx="50" ry="52" fill="#b5c899" />
        <path
          d="M478 0Q505 140 640 160"
          stroke="#9aa97d"
          fill="none"
          strokeWidth="20"
        />
        <text x="102" y="290" fontSize="24">
          A
        </text>
        <text x="559" y="250" fontSize="24">
          B
        </text>
        <text x="367" y="195" fontSize="24">
          C
        </text>
        <text x="600" y="38" fontSize="20">
          ↑N
        </text>
        <text x="26" y="318" fontSize="16">
          {label(mode, '低 → 高（相对色阶）', 'Low → high (relative colours)')}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            'Study阴影教学图，非真实地区。阴影方向模拟左上方光源；颜色不是植被照片，也没有实测高度。',
            'Study teaching relief, not a real region. Shading assumes light from the upper left; colours are not photographed vegetation or measured heights.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function ContourDiagram({
  mode,
  view,
  interval = 100,
  selected = 200,
}: {
  mode: LanguageMode;
  view: string;
  interval?: number;
  selected?: number;
}) {
  const heights = Array.from(
    { length: Math.round(400 / interval) - 1 },
    (_, i) => (i + 1) * interval,
  );
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 640 350"
        role="img"
        aria-label={label(
          mode,
          `${view === 'section' ? '东西剖面' : '俯视等高线图'}：峰顶400米，西坡缓、东坡陡，等高距${interval}米，选中${selected}米。`,
          `${view === 'section' ? 'West–east section' : 'Contour plan'}: summit 400 m, gentle west and steep east, interval ${interval} m, selected ${selected} m.`,
        )}
      >
        <rect width="640" height="350" rx="12" fill="#f1f0e5" />
        {view === 'section' ? (
          <>
            <path
              d="M80 290L420 50L560 290Z"
              fill="#b8c89c"
              stroke="#546f55"
              strokeWidth="3"
            />
            {heights.map((h) => {
              const c = contourAt(h),
                y = 290 - h * 0.6;
              return (
                <g key={h}>
                  <path
                    d={`M80 ${y}H560`}
                    stroke={h === selected ? '#315f69' : '#a5ac93'}
                    strokeWidth={h === selected ? 3 : 1}
                    strokeDasharray="4 4"
                  />
                  <circle cx={c.left} cy={y} r="4" fill="#735841" />
                  <circle cx={c.right} cy={y} r="4" fill="#735841" />
                  <text x="35" y={y + 5} fontSize="17">
                    {h}
                  </text>
                </g>
              );
            })}
            <path d="M80 290H560" stroke="#65716a" />
            <text x="427" y="40" fontSize="19">
              400 m
            </text>
            <text x="130" y="326" fontSize="18">
              ↑100 m / →425 m
            </text>
            <text x="452" y="326" fontSize="18">
              175 m
            </text>
          </>
        ) : (
          <>
            {heights.map((h) => {
              const c = contourAt(h);
              return (
                <g key={h}>
                  <ellipse
                    cx={c.cx}
                    cy="175"
                    rx={c.rx}
                    ry={c.ry}
                    fill="none"
                    stroke={h === selected ? '#315f69' : '#947451'}
                    strokeWidth={h === selected ? 4 : 2}
                  />
                  <text
                    x={c.cx - 16}
                    y={175 - c.ry + 20}
                    fontSize="18"
                    fill="#624b35"
                  >
                    {h}
                  </text>
                </g>
              );
            })}
            <path d="M80 175H560" stroke="#738b8c" strokeDasharray="5 5" />
            <circle cx="420" cy="175" r="5" fill="#315f69" />
            <text x="425" y="192" fontSize="18">
              400 m
            </text>
            <path
              d="M80 306H180M80 300V312M180 300V312"
              stroke="#315f69"
              strokeWidth="3"
            />
            <text x="112" y="332" fontSize="18">
              500 m
            </text>
            <text x="592" y="43" fontSize="19">
              ↑N
            </text>
          </>
        )}
        <text x="78" y="25" fontSize="19">
          {label(mode, '西 W', 'W')}
        </text>
        <text x="542" y="25" fontSize="19">
          {label(mode, '东 E', 'E')}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            `同一座虚构斜锥山；等高距${interval}米。100米升高对应西侧水平425米、东侧175米；两图横向比例一致，剖面纵轴夸大以便阅读。`,
            `The same fictional oblique cone, interval ${interval} m. A 100 m rise spans 425 m west or 175 m east. Horizontal scales agree; the section exaggerates vertical height for readability.`,
          )}
        />
      </figcaption>
    </figure>
  );
}
export function RiverDiagram({
  mode,
  path,
  onPick,
}: {
  mode: LanguageMode;
  path: string[];
  onPick?: (id: string) => void;
}) {
  return (
    <figure className="geo-skill-figure">
      <div className="geo-river-map">
        <svg
          viewBox="0 0 640 360"
          role="img"
          aria-label={label(
            mode,
            '虚构河流：400米源头到150米汇合处，再经50米弯道到0米河口，整体向东北流；东侧山脊隔开内流湖。',
            'Fictional river: 400 m source to 150 m confluence, 50 m bend and 0 m mouth, flowing northeast. An eastern ridge separates a closed lake.',
          )}
        >
          <rect width="640" height="360" rx="12" fill="#e9edd8" />
          <path d="M380 0H640V116L520 120L455 65Z" fill="#bddbe2" />
          <path
            d="M510 25Q500 150 480 210Q450 280 450 340"
            fill="none"
            stroke="#8d876b"
            strokeWidth="15"
          />
          <path
            d="M510 25Q500 150 480 210Q450 280 450 340"
            fill="none"
            stroke="#ede6c5"
            strokeWidth="3"
            strokeDasharray="6 5"
          />
          {riverEdges.map(([a, b]) => {
            const from = riverNodes.find((p) => p.id === a)!,
              to = riverNodes.find((p) => p.id === b)!;
            return (
              <path
                key={a}
                d={`M${from.x} ${from.y}Q${from.x + 30} ${to.y + 25} ${to.x} ${to.y}`}
                fill="none"
                stroke={
                  path.includes(a) && path.includes(b) ? '#285b78' : '#79a9bd'
                }
                strokeWidth="7"
              />
            );
          })}
          <ellipse
            cx="540"
            cy="262"
            rx="79"
            ry="84"
            fill="none"
            stroke="#b9ac82"
            strokeWidth="10"
          />
          <ellipse cx="540" cy="280" rx="42" ry="22" fill="#79a9bd" />
          <path d="M573 205L545 258" stroke="#79a9bd" strokeWidth="4" />
          <text x="580" y="38" fontSize="20">
            ↑N
          </text>
          <text x="395" y="335" fontSize="17">
            {label(mode, '分水岭', 'Divide')}
          </text>
        </svg>
        {riverNodes.map((p) => (
          <button
            type="button"
            disabled={!onPick}
            key={p.id}
            className={`geo-river-node ${path.includes(p.id) ? 'done' : ''}`}
            style={{
              left: `${(p.x / 640) * 100}%`,
              top: `${(p.y / 360) * 100}%`,
            }}
            onClick={() => onPick?.(p.id)}
            aria-label={label(
              mode,
              `${p.zh} ${p.height}米`,
              `${p.en} ${p.height} m`,
            )}
          >
            {path.includes(p.id) ? '✓' : p.height}
          </button>
        ))}
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '虚构高程与河网，北向上；不是河流速度模拟。源头400 m → 汇合处150 m → 弯道50 m → 河口0 m。东侧内流湖100 m，被山脊隔开，没有地表出海通道。',
            'Fictional heights and channels, north up; no flow-speed simulation. Source 400 m → confluence 150 m → bend 50 m → mouth 0 m. The eastern closed lake at 100 m has no surface outlet across its ridge.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export const climatePointNames: Record<string, string> = {
  tropical: 'Tropical lowland',
  temperate: 'Temperate lowland',
  polar: 'High-latitude Greenland',
  plateau: 'Tibetan Plateau',
  lowland: 'Similar-latitude lowland',
};
export function ClimateMap({
  mode,
  selected,
}: {
  mode: LanguageMode;
  selected: string;
}) {
  const p = climate.points.find((p) => p.id === selected) ?? climate.points[0]!;
  return (
    <figure className="geo-skill-figure">
      <div className="geo-world-scroll">
        <svg
          viewBox="0 0 900 450"
          role="img"
          aria-label={label(
            mode,
            '1991–2020年近地面空气温度年平均，热带多暖，极地较冷，青藏高原为较冷例外；蓝低红高。',
            '1991–2020 annual mean near-surface air temperature: generally warmer tropics and colder poles, with a cold Tibetan Plateau exception; blue cold, red warm.',
          )}
        >
          <image
            href="/geography/maps/climate-1991-2020.svg"
            width="900"
            height="450"
          />
          <path
            d={mapData.world}
            fill="none"
            stroke="#334d58"
            strokeWidth=".7"
          />
          {[0, 30, 60, -30, -60].map((lat) => (
            <g key={lat}>
              <path
                d={`M0 ${(90 - lat) * 2.5}H900`}
                stroke="#ffffff"
                opacity=".75"
                strokeDasharray="4 5"
              />
              <text x="4" y={(90 - lat) * 2.5 - 4} fontSize="16" fill="#163745">
                {Math.abs(lat)}°{lat > 0 ? 'N' : lat < 0 ? 'S' : ''}
              </text>
            </g>
          ))}
          <circle
            cx={(p.lon + 180) * 2.5}
            cy={(90 - p.lat) * 2.5}
            r="9"
            fill="none"
            stroke="white"
            strokeWidth="4"
          />
          <circle
            cx={(p.lon + 180) * 2.5}
            cy={(90 - p.lat) * 2.5}
            r="6"
            fill="#254b50"
          />
        </svg>
      </div>
      <div
        className="geo-climate-legend"
        aria-label={words(mode, '摄氏度色阶', 'Celsius colour scale')}
      >
        {['<−20', '−20…−10', '−10…0', '0…10', '10…20', '20…30', '≥30'].map(
          (v, i) => (
            <span
              key={v}
              style={{
                borderTopColor: [
                  '#345b91',
                  '#6f9fbc',
                  '#bbd4d4',
                  '#eadba5',
                  '#d9aa72',
                  '#b96450',
                  '#873e42',
                ][i],
              }}
            >
              {v}°C
            </span>
          ),
        )}
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            'NOAA PSL · NCEP/NCAR再分析1，1991–2020。12个月长期均值按日数加权成年均，K转°C；模型地表上方2米空气温度，原始约1.9°网格。Study重绘，非逐站实测、地表皮肤温度或今天预报。窄屏地图可横向滑动。',
            'NOAA PSL · NCEP/NCAR Reanalysis 1, 1991–2020. Monthly long-term means weighted by days; K converted to °C. Air 2 m above the model surface, original ~1.9° grid. Study rendering, not individual station readings, surface skin temperature or today’s forecast. Swipe the map on narrow screens.',
          )}
        />
      </figcaption>
    </figure>
  );
}
