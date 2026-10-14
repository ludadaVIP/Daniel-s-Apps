import { useId } from 'react';
import type { LanguageMode } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';
import { WeatherFigure } from './WeatherVisuals';
import world from '../../../content/map-data.json';
import nz from '../../../content/nz-overview-data.json';
import { nzPoint } from './placeModels';
import { worldPoint } from './models';
import { alpsCoords } from './waterEarthModels';
import {
  rainStations,
  reliefParcel,
  solarGeometry,
  solarBeam,
  monsoonContrast,
  climateData,
  climatePoints,
  desertCases,
} from './climateModels';

export function RainStationMap({
  mode,
  selected,
  onPick,
}: {
  mode: LanguageMode;
  selected: string;
  onPick?: (id: string) => void;
}) {
  return (
    <>
      <WeatherFigure
        interactive={!!onPick}
        mode={mode}
        viewBox="0 0 900 620"
        description={t(
          '新西兰两机场1981–2010年降水常年值，格雷茅斯2452、基督城594 mm/year；城市参照点，非插值雨图',
          'NZ airport 1981–2010 annual rainfall normals: Greymouth 2452, Christchurch 594 mm/year; city reference points, not an interpolated rainfall map',
        )}
        caption={t(
          '两条年常年值引用NIWA2018《新西兰气候与天气》表6（印刷页18）；单位mm/year。海岸底图Natural Earth v5.1.2，点为大致城市位置，不是机场站精确坐标。山带与西风箭头概略；两个站的差异不能单独证明全部成因，也不代表每天或全岛。',
          'Two factual annual normals cited from NIWA 2018 The Climate and Weather of New Zealand, Table 6 (printed page 18), mm/year. Natural Earth v5.1.2 coast; dots are coarse city references, not exact station coordinates. Mountain band/westerly arrow approximate. Two stations alone do not establish all causes or represent every day/the whole island.',
        )}
      >
        <rect width="900" height="620" fill="#f1f5ed" />
        <g transform="translate(30 -30) scale(.76)">
          <path d={nz.coast} fill="#ced8bb" stroke="#52716b" strokeWidth="2" />
        </g>
        <path
          d={alpsCoords
            .map(([lo, la], i) => {
              const p = nzPoint(lo!, la!);
              return `${i ? 'L' : 'M'}${30 + p.x * 0.76} ${-30 + p.y * 0.76}`;
            })
            .join('')}
          stroke="#9e9279"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <text x="500" y="34" fontSize="23">
          1981–2010 · mm/year
        </text>
        <text x="665" y="75">
          N ↑
        </text>
        <path
          d="M75 300H178L162 290M178 300L162 310"
          fill="none"
          stroke="#557e89"
          strokeWidth="5"
        />
        <text x="52" y="280">
          {words(mode, '常见西风', 'Typical westerlies')}
        </text>
        {rainStations.map((s) => {
          const p = nzPoint(s.lon, s.lat),
            x = 30 + p.x * 0.76,
            y = -30 + p.y * 0.76;
          return (
            <g
              key={s.id}
              role={onPick ? 'button' : undefined}
              tabIndex={onPick ? 0 : undefined}
              aria-label={words(
                mode,
                `${s.zh}：${s.annual} mm/year`,
                `${s.en}: ${s.annual} mm/year`,
              )}
              onClick={() => onPick?.(s.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPick?.(s.id);
                }
              }}
              className={onPick ? 'geo-diagram-target' : ''}
            >
              <circle
                cx={x}
                cy={y}
                r="12"
                fill={selected === s.id ? '#b96450' : '#557e89'}
                stroke="white"
                strokeWidth="3"
              />
              <path
                d={`M${x + 15} ${y}H500V${s.id === 'west' ? 175 : 390}`}
                fill="none"
                stroke="#829b91"
                strokeWidth="2"
              />
              <text x="525" y={s.id === 'west' ? 150 : 365} fontSize="24">
                {words(mode, s.zh, s.en)}
              </text>
              <text x="525" y={s.id === 'west' ? 183 : 398} fontSize="26">
                {s.annual} mm/year
              </text>
              <text x="525" y={s.id === 'west' ? 215 : 430}>
                {s.id === 'west'
                  ? words(mode, '西侧', 'West side')
                  : words(mode, '东侧', 'East side')}
              </text>
            </g>
          );
        })}
        <path
          d="M55 505H209M55 499v12M209 499v12"
          stroke="#52716b"
          strokeWidth="2"
        />
        <text x="55" y="535" fontSize="15">
          {words(mode, '约500 km（41°S参照）', '~500 km (41°S reference)')}
        </text>
        <text x="55" y="563">
          {words(
            mode,
            '南阿尔卑斯山脉概略位置；并非两站之间真实直线剖面。',
            'Approximate Southern Alps; not a surveyed transect between these stations.',
          )}
        </text>
        <text x="55" y="595">
          {words(
            mode,
            '选择热点或下方按钮，比较长期统计与机制。',
            'Select a hotspot or button to compare long-term statistics and mechanism.',
          )}
        </text>
      </WeatherFigure>
    </>
  );
}
export function ReliefModel({
  mode,
  wet,
  peak,
  frame,
  west,
}: {
  mode: LanguageMode;
  wet: boolean;
  peak: number;
  frame: number;
  west: boolean;
}) {
  const a = reliefParcel(wet, peak, frame, west),
    id = useId(),
    y = 430 - a.height * 140;
  return (
    <WeatherFigure
      mode={mode}
      description={t(
        `虚构山峰${a.ridge} km，${west ? '西' : '东'}风，帧${a.frame}，气块${a.height.toFixed(1)} km/${a.temperature.toFixed(1)}°C，${a.cloud ? '到达成云条件' : '无云示意'}`,
        `Invented ridge ${a.ridge} km, ${west ? 'west' : 'east'} wind, frame ${a.frame}, parcel ${a.height.toFixed(1)} km/${a.temperature.toFixed(1)}°C; ${a.cloud ? 'cloud condition reached' : 'no cloud shown'}`,
      )}
      caption={t(
        '同一虚构山峰、外加抬升，无距离或真实地形比例。初温20°C、露点16/6°C，沿用GEO036云底近似与9.8/6°C每km率。理想化假设：凝结水已增长并在山顶前全部降出，背风侧无云且按9.8°C/km压缩增温；不计算实际降水量、效率或速度。帧不是小时。',
        'Same invented ridge with imposed lift, no distance or real terrain scale. Initial 20°C, dew points 16/6°C; GEO036 cloud-base approximation and 9.8/6°C/km lapse rates. Idealisation: condensate has grown and all fallen out by the crest; cloud-free lee descent warms 9.8°C/km. No real rainfall amount, efficiency or speed is computed; frames are not hours.',
      )}
    >
      <defs>
        <marker
          id={id}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#557e89" />
        </marker>
      </defs>
      <text x="55" y="34" fontSize="24">
        {words(
          mode,
          '反转风向，哪一面要先爬坡？',
          'Reverse airflow: which side rises first?',
        )}
      </text>
      <path
        d={`M90 450H130L450 ${450 - a.ridge * 140}L770 450H810V485H90Z`}
        fill="#b7c5a2"
        stroke="#708773"
        strokeWidth="3"
      />
      {[0, 1, 2].map((z) => (
        <g key={z}>
          <text x="8" y={455 - z * 140}>
            {z} km
          </text>
          <line
            x1="70"
            x2="820"
            y1={450 - z * 140}
            y2={450 - z * 140}
            stroke="#829b91"
            strokeDasharray="3 7"
            opacity=".4"
          />
        </g>
      ))}
      <path
        d={
          west
            ? `M120 430L450 ${430 - a.ridge * 140}L780 430`
            : `M780 430L450 ${430 - a.ridge * 140}L120 430`
        }
        fill="none"
        stroke="#557e89"
        strokeWidth="4"
        markerEnd={`url(#${id})`}
      />
      <ellipse
        cx={a.x}
        cy={y}
        rx="47"
        ry="28"
        fill={a.cloud ? '#d1e3e7' : '#f3e6be'}
        stroke="#557e89"
        strokeWidth="3"
      />
      {a.cloud &&
        [0, 1, 2].map((n) => (
          <g key={n}>
            <circle cx={a.x - 20 + n * 20} cy={y} r="4" fill="#557e89" />
            <path
              d={`M${a.x - 20 + n * 20} ${y + 33}v25`}
              stroke="#557e89"
              strokeWidth="2"
            />
          </g>
        ))}
      <text x="90" y=" ninety" />
      <text x="90" y="85">
        {words(mode, '西 W', 'W')}
      </text>
      <text x="770" y="85">
        {words(mode, '东 E', 'E')}
      </text>
      <text x="280" y="79">
        {words(
          mode,
          `当前${a.temperature.toFixed(1)}°C；云底约${a.base.toFixed(2)} km`,
          `Now ${a.temperature.toFixed(1)}°C; estimated cloud base ${a.base.toFixed(2)} km`,
        )}
      </text>
      <text x="55" y="523">
        {a.descending
          ? words(
              mode,
              '下降压缩增温，相对湿度降低；此理想化例假设云水已降出。',
              'Descent warms by compression; relative humidity falls; condensate assumed removed.',
            )
          : words(
              mode,
              '上升膨胀冷却；只有到饱和且增长等条件满足，才可能降水。',
              'Ascent expands/cools; precipitation also needs saturation, growth and other conditions.',
            )}
      </text>
      <text x="55" y="558">
        {words(
          mode,
          `迎风侧：${a.windward === 'west' ? '西' : '东'}；背风侧：${a.lee === 'east' ? '东' : '西'}；不是永久的东西标签。`,
          `Windward:${a.windward}; leeward:${a.lee}; these are not permanent east/west labels.`,
        )}
      </text>
    </WeatherFigure>
  );
}
export function LatitudeMap({
  mode,
  temperature,
  selected,
}: {
  mode: LanguageMode;
  temperature: boolean;
  selected: string;
}) {
  const point =
    climatePoints.find((p) => p.id === selected) ?? climatePoints[0]!;
  return (
    <>
      <WeatherFigure
        mode={mode}
        viewBox="0 0 900 480"
        description={t(
          temperature
            ? '1991–2020全球年平均2 m气温与五个样点'
            : '按23.4°回归线和66.6°极圈画的热量纬度带；不是完整气候分类',
          temperature
            ? '1991–2020 global annual mean 2 m air temperature with five cells'
            : 'Astronomical latitude belts using 23.4° tropics and 66.6° polar circles; not a full climate classification',
        )}
        caption={t(
          temperature
            ? 'NOAA PSL / NCEP–NCAR R1，1991–2020，模型地表上2 m、°C、按天数加权年平均；原网格无插值，非当前天气。高原与低地同纬比较并未控制全部条件。'
            : '原创纬度分带＋Natural Earth v5.1.2海岸。矩形等经纬投影不保面积，边界为选定23.4°倾角的近似；实际气候还需温度、降水、季节、地形与海洋等证据。',
          temperature
            ? 'NOAA PSL / NCEP–NCAR R1, 1991–2020, 2 m above model surface, °C, day-weighted annual mean. Original grid, no interpolation; not current weather. Same-latitude plateau/lowland comparison does not control every factor.'
            : 'Original latitude belts with Natural Earth v5.1.2 coast. Equirectangular projection is not equal-area; boundaries approximate the chosen 23.4° tilt. Actual climates also need temperature, precipitation, seasons, terrain and ocean evidence.',
        )}
      >
        {temperature ? (
          <image
            href="/geography/maps/climate-1991-2020.svg"
            width="900"
            height="450"
          />
        ) : (
          <>
            {[
              [90, 66.6, '#b8d1de'],
              [66.6, 23.4, '#d1dfc6'],
              [23.4, -23.4, '#ead8b0'],
              [-23.4, -66.6, '#d1dfc6'],
              [-66.6, -90, '#b8d1de'],
            ].map(([top, bottom, color], i) => (
              <rect
                key={i}
                x="0"
                y={(90 - Number(top)) * 2.5}
                width="900"
                height={(Number(top) - Number(bottom)) * 2.5}
                fill={String(color)}
              />
            ))}
          </>
        )}
        <path d={world.world} fill="none" stroke="#52716b" strokeWidth=".8" />
        {[66.6, 23.4, 0, -23.4, -66.6].map((la) => (
          <g key={la}>
            <path
              d={`M0 ${(90 - la) * 2.5}H900`}
              stroke="white"
              strokeDasharray="5 5"
            />
            <text x="7" y={(90 - la) * 2.5 - 7} fontSize="16">
              {Math.abs(la)}°{la > 0 ? 'N' : la < 0 ? 'S' : ''}
            </text>
          </g>
        ))}
        {climatePoints.map((p) => {
          const xy = worldPoint(p.lon, p.lat);
          return (
            <g key={p.id}>
              <circle
                cx={xy.x}
                cy={xy.y}
                r={p.id === selected ? 11 : 6}
                fill={p.id === selected ? '#b96450' : '#315f69'}
                stroke="white"
                strokeWidth="2"
              />
            </g>
          );
        })}
        <text x="560" y="465" fontSize="16">
          N ↑ · {words(mode, '样点：', 'Cell: ')}
          {words(mode, point.zh, point.en)}{' '}
          {temperature ? `${point.celsius}°C` : ''}
        </text>
      </WeatherFigure>
      <div
        className="geo-climate-legend"
        aria-label={words(mode, '图例', 'Legend')}
      >
        {(temperature
          ? ['<−20', '−20…−10', '−10…0', '0…10', '10…20', '20…30', '≥30']
          : [
              words(mode, '热带', 'Tropical belt'),
              words(mode, '中纬度温带', 'Temperate belts'),
              words(mode, '高纬度极地带', 'Polar belts'),
            ]
        ).map((v, i) => (
          <span
            key={v}
            style={{
              borderTopColor: (temperature
                ? [
                    '#345b91',
                    '#6f9fbc',
                    '#bbd4d4',
                    '#eadba5',
                    '#d9aa72',
                    '#b96450',
                    '#873e42',
                  ]
                : ['#ead8b0', '#d1dfc6', '#b8d1de'])[i],
            }}
          >
            {v}
            {temperature ? '°C' : ''}
          </span>
        ))}
      </div>
    </>
  );
}
export function SolarModel({
  mode,
  latitude,
  quarter,
}: {
  mode: LanguageMode;
  latitude: number;
  quarter: number;
}) {
  const a = solarGeometry(latitude, quarter),
    beam = solarBeam(latitude, quarter);
  return (
    <WeatherFigure
      mode={mode}
      description={t(
        `纬度${a.latitude}°，太阳赤纬${a.declination.toFixed(1)}°，正午太阳高度${a.noonHeight.toFixed(1)}°，白昼${a.daylight.toFixed(1)} h`,
        `Latitude ${a.latitude}°, declination ${a.declination.toFixed(1)}°, noon altitude ${a.noonHeight.toFixed(1)}°, daylight ${a.daylight.toFixed(1)} h`,
      )}
      caption={t(
        '23.4°倾角的球形几何模型，三月分点／六月至日／十二月至日。忽略折射、地形、天气、太阳圆面与地日距离变化；光束与地面面积为相对单位。正午入射强弱不是日总量或温度预报；极昼也不等于全年温暖。',
        'Spherical geometry with 23.4° tilt: March equinox/June solstice/December solstice. Refraction, terrain, weather, solar-disc width and Earth–Sun distance variation omitted; beam/ground area in relative units. Noon incidence is not daily total or temperature forecast; polar day does not mean year-round warmth.',
      )}
    >
      <text x="55" y="35" fontSize="24">
        {words(
          mode,
          '同样光束，改变入射角',
          'Same beam, change incidence angle',
        )}
      </text>
      <text x="55" y="85">
        {Math.abs(a.latitude)}°{a.latitude < 0 ? 'S' : 'N'} ·{' '}
        {words(mode, '正午高度', 'Noon altitude')} {a.noonHeight.toFixed(1)}°
      </text>
      <path d="M80 370H820" stroke="#6b8972" strokeWidth="12" />
      {a.relativeNoon > 0 ? (
        <>
          <polygon
            points={beam!.points.map((p) => p.join(',')).join(' ')}
            fill="#e8cb75"
            stroke="#c6a44d"
            strokeWidth="1"
          />
          <rect
            x={450 - Math.min(280, 25 * a.beamFootprint!)}
            y="377"
            width={Math.min(560, 50 * a.beamFootprint!)}
            height="15"
            fill="#c6a44d"
          />
          <text x="100" y="428">
            {words(mode, '同光束投影地面宽度：', 'Relative ground footprint: ')}
            {a.beamFootprint!.toFixed(2)} ×
          </text>
        </>
      ) : (
        <text x="175" y="260">
          {words(
            mode,
            '正午太阳在地平线下，无直接日照',
            'Noon Sun below horizon; no direct sunlight',
          )}
        </text>
      )}
      <text x="55" y="479">
        {words(mode, '相对正午入射：', 'Relative noon incidence: ')}
        {a.relativeNoon.toFixed(2)} · {words(mode, '白昼：', 'Daylight: ')}
        {a.daylight.toFixed(1)} h / 24 h
      </text>
      <text x="55" y="531">
        {words(
          mode,
          '光照几何只是气候的一个原因，还要查看地形、海洋与空气运动。',
          'Solar geometry is one climate influence; check terrain, oceans and air motion too.',
        )}
      </text>
    </WeatherFigure>
  );
}
export function MonsoonMap({
  mode,
  contrast,
}: {
  mode: LanguageMode;
  contrast: number;
}) {
  const a = monsoonContrast(contrast),
    clip = useId(),
    marker = useId(),
    pt = (lo: number, la: number): [number, number] => [
      50 + (lo - 40) * 9,
      70 + (50 - la) * 7,
    ];
  return (
    <WeatherFigure
      mode={mode}
      viewBox="0 0 900 610"
      description={t(
        `南亚概略季风图，陆海差${a.contrast}比较级，陆地气压${a.landPressure}，海洋${a.oceanPressure}`,
        `Conceptual South Asian monsoon map, contrast ${a.contrast} symbolic levels, land pressure ${a.landPressure}, ocean ${a.oceanPressure}`,
      )}
      caption={t(
        'Natural Earth v5.1.2真实海岸底图；箭头、高低压和热量条件为概念叠层，没有年份、流速或气压数值。陆海冷热差是季风机制之一，还受热带辐合带季节移动、地形、自转与天气系统影响；不是每天海风的简单放大，也不保证整片亚洲同时降雨。',
        'Natural Earth v5.1.2 coast; arrows, H/L and heat conditions are conceptual overlays without year, speed or measured pressure. Land–ocean contrast is one mechanism alongside seasonal convergence-zone shifts, terrain, rotation and weather systems. Not merely enlarged daily sea breeze, nor simultaneous rain across Asia.',
      )}
    >
      <defs>
        <clipPath id={clip}>
          <rect x="50" y="70" width="720" height="420" />
        </clipPath>
        <marker
          id={marker}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#557e89" />
        </marker>
      </defs>
      <text x="55" y="33" fontSize="24">
        {words(
          mode,
          '陆海对比与季节风向',
          'Land–ocean contrast and seasonal flow',
        )}
      </text>
      <g clipPath={`url(#${clip})`}>
        <rect x="50" y="70" width="720" height="420" fill="#d4e4e8" />
        <path
          d={world.world}
          transform="matrix(3.6 0 0 2.8 -1930 -210)"
          fill={
            a.phase === 'warm'
              ? '#e5c6a0'
              : a.phase === 'cool'
                ? '#c9d9ce'
                : '#d9dbcd'
          }
          stroke="#52716b"
          strokeWidth=".5"
        />
        {a.phase !== 'equal' &&
          (a.phase === 'warm'
            ? ['M230 385Q320 340 374 250', 'M482 385Q500 315 464 240']
            : ['M410 195Q365 310 275 385', 'M518 220Q470 330 414 350']
          ).map((p, i) => (
            <path
              key={i}
              d={p}
              fill="none"
              stroke="#557e89"
              strokeWidth={3 + a.magnitude * 2}
              markerEnd={`url(#${marker})`}
            />
          ))}
        <text x="405" y="167" fontSize="38">
          {a.landPressure}
        </text>
        <text x="350" y="456" fontSize="38">
          {a.oceanPressure}
        </text>
        <text x="200" y="326" fontSize="17">
          {words(mode, '阿拉伯海', 'Arabian Sea')}
        </text>
        <text x="476" y="383" fontSize="17">
          {words(mode, '孟加拉湾', 'Bay of Bengal')}
        </text>
        <text x="360" y="225" fontSize="18">
          {words(mode, '印度', 'India')}
        </text>
      </g>
      {[50, 70, 90, 110].map((lo) => (
        <text key={lo} x={pt(lo, 0)[0]} y="515" fontSize="16">
          {lo}°E
        </text>
      ))}
      {[40, 20, 0].map((la) => (
        <text key={la} x="3" y={pt(40, la)[1] + 5} fontSize="15">
          {la}°N
        </text>
      ))}
      <text x="810" y="85">
        N ↑
      </text>
      <text x="55" y="553">
        {a.phase === 'warm'
          ? words(
              mode,
              '暖陆倾向低压：海 → 陆，水汽与抬升条件可促雨。',
              'Warmer land tends toward low pressure: sea → land; moisture/lift can favour rain.',
            )
          : a.phase === 'cool'
            ? words(
                mode,
                '凉陆倾向高压：陆 → 海；经过海面也可能再获水汽。',
                'Cooler land tends toward high pressure: land → sea; ocean paths can gain moisture.',
              )
            : words(
                mode,
                '这一个冷热差驱动为零；不表示现实一定无风。',
                'This contrast driver is zero; real wind need not cease.',
              )}
      </text>
      <text x="55" y="592">
        {words(
          mode,
          '比较级−2…+2不是°C或hPa；箭头只是广泛流向。',
          'Contrast levels −2…+2 are not °C/h Pa; arrows show broad tendencies only.',
        )}
      </text>
    </WeatherFigure>
  );
}
export function MonsoonChart({
  mode,
  pointId,
}: {
  mode: LanguageMode;
  pointId: string;
}) {
  const p =
    climateData.points.find((p) => p.id === pointId) ?? climateData.points[0]!;
  return (
    <WeatherFigure
      mode={mode}
      viewBox="0 0 900 480"
      description={t(
        `${p.zh}1991–2020月平均降水总量，mm/month`,
        `${p.en} 1991–2020 mean monthly precipitation amount, mm/month`,
      )}
      caption={t(
        `GPCP V2.3卫星／雨量计融合估计，2.5°网格中心${p.rainGrid.lat}°N/${p.rainGrid.lon}°E。月均每日率乘1991–2020平均月天数；不是气象站或实时值。东南格子包含海岸附近海面，不能直接当作钦奈城区记录。`,
        `GPCP V2.3 satellite-gauge estimates, 2.5° cell centre ${p.rainGrid.lat}°N/${p.rainGrid.lon}°E. Mean daily rate × mean month length across 1991–2020. Not a station/real-time record. SE cell includes near-coast ocean and is not a Chennai city record.`,
      )}
    >
      <text x="55" y="35" fontSize="24">
        {words(mode, p.zh, p.en)} · 1991–2020
      </text>
      <text x="55" y="70">
        mm/month ·{' '}
        {words(mode, '月总量的长期平均', 'Long-term means of monthly amounts')}
      </text>
      {[0, 100, 200, 300, 400, 500].map((v) => (
        <g key={v}>
          <line
            x1="80"
            x2="815"
            y1={370 - v * 0.5}
            y2={370 - v * 0.5}
            stroke="#d1dfd7"
          />
          <text x="30" y={377 - v * 0.5}>
            {v}
          </text>
        </g>
      ))}
      {p.monthlyRain.map((v, i) => (
        <g key={i}>
          <rect
            x={100 + i * 60}
            y={370 - v * 0.5}
            width="35"
            height={v * 0.5}
            fill={i >= 5 && i <= 8 ? '#557e89' : i >= 9 ? '#b96450' : '#9eb5aa'}
          />
          <text
            x={118 + i * 60}
            y={360 - v * 0.5}
            textAnchor="middle"
            fontSize="16"
          >
            {v.toFixed(0)}
          </text>
          <text x={118 + i * 60} y="402" textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
      <text x="55" y="448">
        {words(
          mode,
          '蓝柱6–9月；褐柱10–12月；颜色标月份，不单独证明季风原因。',
          'Blue 6–9; brown 10–12; colours mark months, not proof of monsoon causation.',
        )}
      </text>
    </WeatherFigure>
  );
}
export function DesertMap({
  mode,
  temperature,
  selected,
}: {
  mode: LanguageMode;
  temperature: boolean;
  selected: string;
}) {
  const p =
      climateData.points.find((p) => p.id === selected) ??
      climateData.points.find((p) => p.id === 'sahara')!,
    point = temperature ? p.temperatureGrid : p.rainGrid,
    xy = worldPoint(point.lon, point.lat);
  return (
    <>
      <WeatherFigure
        mode={mode}
        viewBox="0 0 900 480"
        description={t(
          temperature
            ? '1991–2020年平均2 m气温，四个沙漠附近样点'
            : '1991–2020 GPCP年平均降水参考图，非沙漠分类',
          temperature
            ? '1991–2020 annual mean 2 m air temperature, four desert-vicinity cells'
            : '1991–2020 GPCP mean annual precipitation reference, not a desert classification',
        )}
        caption={t(
          temperature
            ? 'NCEP/NCAR R1的2 m模型气温，按天数加权，°C。温度与降水来自不同原始网格，切换后样点位置略变；不能把它们当同一气象站。'
            : 'GPCP V2.3，1991–2020，mm/year液态水当量；原2.5°网格，月均每日率乘平均月天数后求和。低降水不单独构成完整干旱分类，仍要看蒸散需求、季节等；海洋上低降水也不称陆地沙漠。',
          temperature
            ? 'NCEP/NCAR R1 model 2 m temperature, day-weighted, °C. Temperature and precipitation have different original grids, so markers shift slightly on switching; they are not one weather station.'
            : 'GPCP V2.3, 1991–2020, mm/year liquid-water equivalent. Original 2.5° grid; sum monthly mean daily rate × mean month days. Low precipitation alone is not a full aridity classification; consider evaporative demand, seasons etc. Low-rain ocean cells are not land deserts.',
        )}
      >
        <image
          href={
            temperature
              ? '/geography/maps/climate-1991-2020.svg'
              : '/geography/maps/precipitation-1991-2020.svg'
          }
          width="900"
          height="450"
        />
        <path d={world.world} fill="none" stroke="#52716b" strokeWidth=".8" />
        {[60, 30, 0, -30, -60].map((la) => (
          <g key={la}>
            <path
              d={`M0 ${(90 - la) * 2.5}H900`}
              stroke="white"
              strokeDasharray="4 5"
            />
            <text x="7" y={(90 - la) * 2.5 - 7} fontSize="16">
              {Math.abs(la)}°{la > 0 ? 'N' : la < 0 ? 'S' : ''}
            </text>
          </g>
        ))}
        {desertCases.map((c) => {
          const p = climateData.points.find((p) => p.id === c.id)!,
            g = temperature ? p.temperatureGrid : p.rainGrid,
            pos = worldPoint(g.lon, g.lat);
          return (
            <g key={c.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="7"
                fill="#315f69"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={Math.min(765, pos.x + 12)}
                y={pos.y - 12}
                fontSize="16"
                stroke="white"
                strokeWidth="3"
                paintOrder="stroke"
              >
                {words(mode, c.zh, c.en)}
              </text>
            </g>
          );
        })}
        <circle
          cx={xy.x}
          cy={xy.y}
          r="13"
          fill="none"
          stroke="#b96450"
          strokeWidth="4"
        />
        <text x="55" y="468" fontSize="17">
          1991–2020 · {temperature ? '°C' : 'mm/year'} · N ↑
        </text>
      </WeatherFigure>
      <div
        className="geo-climate-legend"
        aria-label={words(mode, '图例', 'Legend')}
      >
        {(temperature
          ? ['<−20', '−20…−10', '−10…0', '0…10', '10…20', '20…30', '≥30']
          : ['<250', '250–<500', '500–<1000', '1000–<2000', '≥2000']
        ).map((v, i) => (
          <span
            key={v}
            style={{
              borderTopColor: (temperature
                ? [
                    '#345b91',
                    '#6f9fbc',
                    '#bbd4d4',
                    '#eadba5',
                    '#d9aa72',
                    '#b96450',
                    '#873e42',
                  ]
                : ['#cfb88b', '#e8d7b2', '#d6e0d0', '#9bbcbc', '#547f90'])[i],
            }}
          >
            {v} {temperature ? '°C' : 'mm/year'}
          </span>
        ))}
      </div>
      <p>
        <Text
          mode={mode}
          text={t(
            `${p.zh}：此${temperature ? '温度' : '降水'}网格中心${Math.abs(point.lat)}°${point.lat < 0 ? 'S' : 'N'}/${Math.abs(point.lon)}°${point.lon < 0 ? 'W' : 'E'}；${temperature ? p.annualTemperature + '°C' : p.annualRain + ' mm/year'}，只对该格子作描述。`,
            `${p.en}: this ${temperature ? 'temperature' : 'precipitation'} cell centre ${Math.abs(point.lat)}°${point.lat < 0 ? 'S' : 'N'}/${Math.abs(point.lon)}°${point.lon < 0 ? 'W' : 'E'}; ${temperature ? p.annualTemperature + '°C' : p.annualRain + ' mm/year'}, describing this cell only.`,
          )}
        />
      </p>
    </>
  );
}
