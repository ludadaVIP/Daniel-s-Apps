import { useId } from 'react';
import type { LanguageMode } from '@study/shared';
import mapData from '../../../content/map-data.json';
import { t, words } from './content';
import { Text } from './ui';
import { cities, cityTime, scaleModel, seasonLight } from './skillModels';
const label = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'bilingual' ? `${zh} / ${en}` : words(mode, zh, en);

export function ScaleMap({
  mode,
  zoom = 1,
  route = false,
}: {
  mode: LanguageMode;
  zoom?: number;
  route?: boolean;
}) {
  const model = scaleModel(zoom);
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 640 340"
        role="img"
        aria-label={label(
          mode,
          `虚构地图：学校A到图书馆B直线10公里，折线路线16公里；当前线段尺100画面单位代表${model.barKm.toFixed(2)}公里`,
          `Fictional map: A to B is 10 km straight, 16 km by the path; the fixed graphic bar represents ${model.barKm.toFixed(2)} km`,
        )}
      >
        <rect width="640" height="340" rx="14" fill="#edf0e3" />
        <g transform={`translate(320 170) scale(${zoom}) translate(-320 -170)`}>
          <path
            d="M0 85Q150 30 330 90T640 70"
            fill="none"
            stroke="#b7d8de"
            strokeWidth="30"
          />
          <path d="M170 140h65v-30h80v30h145v130H170Z" fill="#dde4cc" />
          <path
            d="M220 170v60h200v-60"
            fill="none"
            stroke="#b6966f"
            strokeWidth={route ? 7 : 5}
          />
          <path
            d="M220 170H420"
            stroke="#315f69"
            strokeWidth="3"
            strokeDasharray="5 4"
          />
          <circle cx="220" cy="170" r="7" fill="#315f69" />
          <circle cx="420" cy="170" r="7" fill="#315f69" />
        </g>
        {[
          ['A', 320 - 100 * zoom],
          ['B', 320 + 100 * zoom],
        ].map(([text, x]) => (
          <g key={text}>
            <rect
              x={Number(x) - 17}
              y="129"
              width="34"
              height="30"
              rx="5"
              fill="#fffef5"
            />
            <text
              x={x}
              y="151"
              textAnchor="middle"
              fill="#315f69"
              fontSize="21"
            >
              {text}
            </text>
          </g>
        ))}
        <text x="24" y="28" fontSize="18" fill="#315f69">
          N ↑
        </text>
        <path
          d="M42 285H142M42 278v14M92 278v14M142 278v14"
          stroke="#315f69"
          strokeWidth="3"
        />
        <text x="42" y="312" fontSize="17" fill="#315f69">
          0
        </text>
        <text x="142" y="312" fontSize="17" fill="#315f69" textAnchor="middle">
          {model.barKm.toFixed(2)} km
        </text>
        <text x="625" y="314" textAnchor="end" fontSize="17" fill="#647d79">
          {words(mode, '放大倍率', 'Zoom')} ×{zoom.toFixed(2)}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            'Study 虚构平面地图 · A 学校／B 图书馆 · 青色虚线：直线；棕色折线：通路；蓝色：河流。线段尺随视图更新，屏幕厘米不等于印刷厘米。',
            'Study fictional local map · A school / B library · Teal dashes: direct distance; brown: path; blue: river. The scale bar updates with the view; screen centimetres are not printed centimetres.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function RatioDiagram({ mode }: { mode: LanguageMode }) {
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 540 270"
        role="img"
        aria-label={label(
          mode,
          '印刷比例尺1比100万：地图1厘米对应实地10公里；2厘米对应20公里。屏幕示意不供实际尺量。',
          'Printed scale 1:1,000,000: 1 cm represents 10 km; 2 cm represents 20 km. This on-screen drawing is not a physical ruler.',
        )}
      >
        <rect width="540" height="270" rx="14" fill="#eef1e8" />
        <text x="270" y="42" textAnchor="middle" fontSize="23" fill="#315f69">
          1 : 1,000,000
        </text>
        <rect
          x="75"
          y="72"
          width="390"
          height="48"
          fill="#eee3bd"
          stroke="#b39b64"
        />
        {Array.from({ length: 21 }, (_, i) => (
          <path
            key={i}
            d={`M${75 + i * 19.5} 72v${i % 10 === 0 ? 32 : i % 5 === 0 ? 23 : 12}`}
            stroke="#8d7845"
          />
        ))}
        <text x="75" y="147" fontSize="20" fill="#315f69">
          0
        </text>
        <text x="270" y="147" fontSize="20" fill="#315f69">
          1 cm
        </text>
        <text x="455" y="147" textAnchor="end" fontSize="20" fill="#315f69">
          2 cm
        </text>
        <path
          d="M80 180h380m-380-8v16m380-16v16"
          stroke="#315f69"
          strokeWidth="3"
        />
        <text x="270" y="220" textAnchor="middle" fontSize="25" fill="#315f69">
          2 cm × 10 km/cm = 20 km
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '印刷纸图的计算示意 · 先统一单位：100万厘米＝10公里。此图未按屏幕的真实厘米制作。',
            'Printed-map calculation schematic · Convert units first: 1,000,000 cm = 10 km. This drawing is not calibrated to physical screen centimetres.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function CoordinateMap({
  mode,
  lat = 0,
  lon = 0,
}: {
  mode: LanguageMode;
  lat?: number;
  lon?: number;
}) {
  const x = (lon + 180) * 2.5,
    y = (90 - lat) * 2.5;
  return (
    <figure className="geo-map-figure">
      <div
        className="geo-world-scroll"
        tabIndex={0}
        aria-label={words(
          mode,
          '经纬网地图，可横向查看',
          'Coordinate map, scroll horizontally',
        )}
      >
        <svg
          className="geo-coordinate-map"
          viewBox="0 0 900 450"
          role="img"
          aria-label={label(
            mode,
            `等距圆柱地图：点位于纬度${lat}度、经度${lon}度。赤道水平，本初子午线竖直。`,
            `Equirectangular map: point at latitude ${lat}°, longitude ${lon}°. Equator horizontal, prime meridian vertical.`,
          )}
        >
          <rect width="900" height="450" fill="#dcebed" />
          <path
            d={mapData.world}
            fill="#cbd4b1"
            stroke="#879b7b"
            strokeWidth="0.6"
          />
          {[-60, -30, 0, 30, 60].map((latitude) => (
            <g key={latitude}>
              <path
                d={`M0 ${(90 - latitude) * 2.5}H900`}
                stroke={latitude === 0 ? '#b1814d' : '#9fb9b5'}
                strokeWidth={latitude === 0 ? 2 : 1}
                strokeDasharray="5 4"
              />
              <text
                x="10"
                y={(90 - latitude) * 2.5 - 7}
                fontSize="17"
                fill="#315f69"
              >
                {Math.abs(latitude)}°
                {latitude > 0 ? 'N' : latitude < 0 ? 'S' : ''}
              </text>
            </g>
          ))}
          {[-150, -90, -30, 0, 30, 90, 150].map((longitude) => (
            <g key={longitude}>
              <path
                d={`M${(longitude + 180) * 2.5} 0V450`}
                stroke={longitude === 0 ? '#b1814d' : '#9fb9b5'}
                strokeWidth={longitude === 0 ? 2 : 1}
                strokeDasharray="5 4"
              />
              <text
                x={(longitude + 180) * 2.5}
                y="25"
                textAnchor="middle"
                fontSize="17"
                fill="#315f69"
              >
                {Math.abs(longitude)}°
                {longitude > 0 ? 'E' : longitude < 0 ? 'W' : ''}
              </text>
            </g>
          ))}
          <path d={`M0 ${y}H900M${x} 0V450`} stroke="#315f69" strokeWidth="2" />
          <circle
            cx={x}
            cy={y}
            r="10"
            fill="#fffdf2"
            stroke="#315f69"
            strokeWidth="4"
          />
          <text
            x={Math.min(780, Math.max(20, x + 18))}
            y={y > 400 ? y - 20 : y + 30}
            fontSize="19"
            fill="#244b52"
          >
            {Math.abs(lat)}°{lat > 0 ? 'N' : lat < 0 ? 'S' : ''},{' '}
            {Math.abs(lon)}°{lon > 0 ? 'E' : lon < 0 ? 'W' : ''}
          </text>
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            'Natural Earth v5.1.2 · 等距圆柱投影，面积和距离会失真，无国界。棕色虚线：赤道／0°经线；青色交线：你的点。经纬线是假想参考线，不是地表道路。窄屏可在图内左右滑动查看。',
            'Natural Earth v5.1.2 · Equirectangular projection distorts area and distance; no borders. Brown dashes: equator / 0° meridian; teal crosshair: your point. Grid lines are references, not roads on Earth. On narrow screens, swipe inside the map to see the whole view.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function GridGlobe({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: 'latitude' | 'longitude';
}) {
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 480 310"
        role="img"
        aria-label={label(
          mode,
          kind === 'latitude'
            ? '正视球体：赤道0度，两侧纬度向南北极增加；纬线环绕东西方向。'
            : '正视球体：经线连南北极，在两极会聚；测量本初子午线以东或以西的角度。',
          kind === 'latitude'
            ? 'Front-view sphere: equator at zero; latitude increases towards the poles. Parallels circle east-west.'
            : 'Front-view sphere: meridians join and converge at the poles; longitude measures east or west of the prime meridian.',
        )}
      >
        <rect width="480" height="310" rx="14" fill="#eef2e9" />
        <circle
          cx="190"
          cy="150"
          r="115"
          fill="#dcebed"
          stroke="#86a7a8"
          strokeWidth="2"
        />
        {[0, 30, 60, -30, -60].map((angle) => {
          const a = (angle * Math.PI) / 180,
            half = 115 * Math.cos(a),
            y = 150 - 115 * Math.sin(a);
          return (
            <path
              key={angle}
              d={`M${190 - half} ${y}H${190 + half}`}
              stroke={
                kind === 'latitude' && angle === 30
                  ? '#315f69'
                  : angle === 0
                    ? '#b1814d'
                    : '#9fb8b9'
              }
              strokeWidth={angle === 30 && kind === 'latitude' ? 4 : 2}
            />
          );
        })}
        {[-60, -30, 0, 30, 60].map((angle) => {
          const points = Array.from({ length: 37 }, (_, i) => {
            const lat = ((-90 + i * 5) * Math.PI) / 180;
            return `${190 + 115 * Math.sin((angle * Math.PI) / 180) * Math.cos(lat)},${150 - 115 * Math.sin(lat)}`;
          }).join(' ');
          return (
            <polyline
              key={angle}
              points={points}
              fill="none"
              stroke={
                kind === 'longitude' && angle === 30
                  ? '#315f69'
                  : angle === 0
                    ? '#b1814d'
                    : '#9fb8b9'
              }
              strokeWidth={angle === 30 && kind === 'longitude' ? 4 : 2}
            />
          );
        })}
        <text x="181" y="25" fontSize="19" fill="#315f69">
          N
        </text>
        <text x="181" y="291" fontSize="19" fill="#315f69">
          S
        </text>
        <text x="324" y="105" fontSize="21" fill="#315f69">
          {kind === 'latitude' ? '30°N' : '30°E'}
        </text>
        <text x="324" y="155" fontSize="18" fill="#b1814d">
          {kind === 'latitude'
            ? words(mode, '赤道 0°', 'Equator 0°')
            : words(mode, '经线 0°', 'Meridian 0°')}
        </text>
        <text x="324" y="205" fontSize="18" fill="#647d79">
          {kind === 'latitude'
            ? words(mode, '南北位置', 'N–S position')
            : words(mode, '东西位置', 'E–W position')}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            'Study 球体经纬网正视示意 · 只画可见半球的参考线。球面经线会聚，展开的矩形图不能保持所有几何关系。',
            'Study front-view globe schematic · Reference lines on the visible hemisphere. Meridians converge on a sphere; a rectangular map cannot preserve every geometric relationship.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function DayNightDiagram({
  mode,
  rotation = 0,
}: {
  mode: LanguageMode;
  rotation?: number;
}) {
  const id = useId().replaceAll(':', '');
  const angle = (rotation * Math.PI) / 180;
  const x = 270 - 92 * Math.cos(angle),
    y = 145 + 92 * Math.sin(angle);
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 520 300"
        role="img"
        aria-label={label(
          mode,
          `从北极上方看地球自转的理想模型：太阳光从左侧照来，左半球白昼，右半球黑夜；观察点转过${rotation}度。`,
          `Ideal rotation model viewed above the North Pole: sunlight from the left; left half lit, right half dark; observer rotated ${rotation} degrees.`,
        )}
      >
        <defs>
          <clipPath id={`daily-${id}`}>
            <circle cx="270" cy="145" r="105" />
          </clipPath>
        </defs>
        <rect width="520" height="300" rx="14" fill="#eef2e9" />
        <circle cx="46" cy="145" r="30" fill="#e8c878" />
        {[108, 145, 182].map((y) => (
          <path
            key={y}
            d={`M85 ${y}h65m-10-5 10 5-10 5`}
            stroke="#cfad5a"
            strokeWidth="3"
            fill="none"
          />
        ))}
        <circle cx="270" cy="145" r="105" fill="#9fcbd4" />
        <rect
          x="270"
          y="40"
          width="105"
          height="210"
          fill="#304d62"
          clipPath={`url(#daily-${id})`}
        />
        <path
          d="M215 41Q170 35 161 85m-4-12 4 12 12-4"
          stroke="#315f69"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx={x}
          cy={y}
          r="10"
          fill="#fffdf2"
          stroke="#b1814d"
          strokeWidth="4"
        />
        <text x="220" y="152" textAnchor="middle" fill="#315f69" fontSize="18">
          {words(mode, '昼', 'DAY')}
        </text>
        <text x="320" y="152" textAnchor="middle" fill="#fffdf2" fontSize="18">
          {words(mode, '夜', 'NIGHT')}
        </text>
        <text x="270" y="279" fill="#315f69" textAnchor="middle" fontSize="19">
          {rotation}° / {words(mode, '逆时针自转', 'Counterclockwise rotation')}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            'Study 理想赤道剖面 · 北极上方视角，地球自转使点进入／离开阳光。白昼黑夜以明暗和文字共同表示；不用于预测某城市日出日落。',
            'Study ideal equatorial section · Viewed above the North Pole, rotation carries the point into and out of sunlight. Labels and shading indicate day/night; this is not a city sunrise forecast.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function MeridianBand({ mode }: { mode: LanguageMode }) {
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 540 235"
        role="img"
        aria-label={label(
          mode,
          '理想经度模型：360度除以24小时，平均15度对应1小时；实际时区不是整齐直条。',
          'Ideal longitude model: 360 degrees divided by 24 hours gives 15 degrees per hour. Civil time zones are not straight strips.',
        )}
      >
        <rect width="540" height="235" rx="14" fill="#eef2e9" />
        {[-30, -15, 0, 15, 30].map((v, i) => (
          <g key={v}>
            <rect
              x={42 + i * 90}
              y="60"
              width="90"
              height="90"
              fill={i % 2 ? '#d3e5dd' : '#e4ecdf'}
            />
            <text
              x={87 + i * 90}
              y="94"
              textAnchor="middle"
              fontSize="18"
              fill="#315f69"
            >
              {Math.abs(v)}°{v < 0 ? 'W' : v > 0 ? 'E' : ''}
            </text>
            <text
              x={87 + i * 90}
              y="132"
              textAnchor="middle"
              fontSize="20"
              fill="#315f69"
            >
              {12 + v / 15}:00
            </text>
          </g>
        ))}
        <text x="270" y="35" textAnchor="middle" fontSize="20" fill="#315f69">
          360° ÷ 24 h = 15° / h
        </text>
        <text x="270" y="191" textAnchor="middle" fontSize="17" fill="#647d79">
          {words(
            mode,
            '经度与平均太阳时示意，非官方时区图',
            'Longitude / mean solar-time model, not civil time zones',
          )}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '向东的平均太阳时较早进入下一小时；国家和地区另行规定钟表时区，可能使用半小时偏移和夏令时。经度不足以确定实际当地时间。',
            'Places to the east reach the next solar hour earlier. Civil time is set by jurisdictions, sometimes with half-hour offsets or daylight saving. Longitude alone does not determine local clock time.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function CityClocks({
  mode,
  date = 0,
  hour = 7,
}: {
  mode: LanguageMode;
  date?: number;
  hour?: number;
}) {
  return (
    <div className="geo-city-clocks">
      {cities.map((city) => {
        const local = cityTime(date, hour, city);
        return (
          <article key={city.id}>
            <span className="geo-eyebrow">{words(mode, city.zh, city.en)}</span>
            <strong>{String(local.hour).padStart(2, '0')}:00</strong>
            <span>{local.date}</span>
            <small>
              UTC{local.offset >= 0 ? '+' : ''}
              {local.offset}
            </small>
            {local.fallback && (
              <small>{words(mode, '固定日期示例', 'Fixed-date example')}</small>
            )}
          </article>
        );
      })}
    </div>
  );
}
export const quarterNames = [
  t('三月分点附近', 'March equinox'),
  t('六月至点附近', 'June solstice'),
  t('九月分点附近', 'September equinox'),
  t('十二月至点附近', 'December solstice'),
];
export function OrbitDiagram({
  mode,
  quarter = 1,
  tilt = 23.4,
}: {
  mode: LanguageMode;
  quarter?: number;
  tilt?: number;
}) {
  const a = (tilt * Math.PI) / 180,
    dx = 52 * Math.sin(a),
    dy = 52 * Math.cos(a);
  return (
    <figure className="geo-skill-figure">
      <svg
        viewBox="0 0 600 330"
        role="img"
        aria-label={label(
          mode,
          `轨道透视示意，左右为六月和十二月；两侧地轴指向一致，倾角${tilt}度。${tilt === 0 ? '零倾角对照中，两半球不再交替更朝向太阳。' : '六月北半球更朝向太阳，十二月南半球更朝向太阳。'}轨道、地球和太阳大小不按比例。`,
          `Orbit perspective schematic: June left, December right; axes point the same way with ${tilt} degree tilt. ${tilt === 0 ? 'At zero tilt the hemispheres no longer alternate facing the Sun more.' : 'North faces the Sun more in June and south in December.'} Sizes and distances not to scale.`,
        )}
      >
        <rect width="600" height="330" rx="14" fill="#eef2e9" />
        <ellipse
          cx="300"
          cy="164"
          rx="200"
          ry="78"
          fill="none"
          stroke="#b5c7b9"
          strokeDasharray="6 5"
        />
        <circle cx="300" cy="164" r="34" fill="#e8c878" />
        {[120, 480].map((x, i) => (
          <g key={x}>
            <circle
              cx={x}
              cy="164"
              r="44"
              fill="#a4cdd6"
              stroke={
                (i === 0 && quarter === 1) || (i === 1 && quarter === 3)
                  ? '#315f69'
                  : '#a4b8ac'
              }
              strokeWidth="4"
            />
            <path
              d={
                i === 0
                  ? `M${x} 120a44 44 0 0 0 0 88Z`
                  : `M${x} 120a44 44 0 0 1 0 88Z`
              }
              fill="#3c5d6b"
            />
            <path
              d={`M${x - dx} ${164 + dy}L${x + dx} ${164 - dy}`}
              stroke="#fffdf2"
              strokeWidth="5"
            />
            <text x={x + dx - 6} y={153 - dy} fontSize="18" fill="#315f69">
              N
            </text>
            <text x={x - dx - 6} y={187 + dy} fontSize="18" fill="#315f69">
              S
            </text>
            <text
              x={x}
              y="279"
              textAnchor="middle"
              fontSize="21"
              fill="#315f69"
            >
              {i === 0
                ? words(mode, '六月', 'JUNE')
                : words(mode, '十二月', 'DECEMBER')}
            </text>
          </g>
        ))}
        <circle
          cx="300"
          cy="242"
          r="12"
          fill={quarter === 0 ? '#315f69' : '#b8cbbd'}
        />
        <circle
          cx="300"
          cy="86"
          r="12"
          fill={quarter === 2 ? '#315f69' : '#b8cbbd'}
        />
        <path
          d="M250 164h-70m10-5-10 5 10 5M350 164h70m-10-5 10 5-10 5"
          stroke="#c5a552"
          strokeWidth="3"
          fill="none"
        />
        <text x="300" y="40" textAnchor="middle" fontSize="19" fill="#315f69">
          {words(
            mode,
            '地轴在一年中近似保持同一指向',
            'Axis direction stays almost fixed through the year',
          )}
        </text>
        <text x="300" y="311" textAnchor="middle" fontSize="17" fill="#647d79">
          {tilt}° ·{' '}
          {words(
            mode,
            '地轴相对轨道面垂线',
            'Axis from perpendicular to orbital plane',
          )}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            'Study 轨道透视示意 · 分点位置用圆点表示；左右至点给出地轴与光照的侧视关系。圆形轨道用于隔离倾斜的影响，不表示真实轨道完全是圆，也不按距离／大小比例绘制。',
            'Study orbit perspective schematic · Dots mark equinox positions; solstice side views show the axis relative to sunlight. A circular orbit isolates tilt, without claiming the real orbit is exactly circular; distances and sizes are not to scale.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function LightComparison({
  mode,
  quarter = 1,
  tilt = 23.4,
}: {
  mode: LanguageMode;
  quarter?: number;
  tilt?: number;
}) {
  return (
    <div className="geo-light-comparison">
      {[
        { zh: '奥克兰附近 · 37°S', en: 'Near Auckland · 37°S', lat: -37 },
        { zh: '伦敦附近 · 51.5°N', en: 'Near London · 51.5°N', lat: 51.5 },
      ].map((p) => {
        const light = seasonLight(p.lat, quarter, tilt);
        return (
          <article key={p.lat}>
            <h4>
              <Text mode={mode} text={t(p.zh, p.en)} />
            </h4>
            <svg
              className="geo-solar-altitude"
              viewBox="0 0 210 140"
              role="img"
              aria-label={label(
                mode,
                `正午太阳与地平线的角度${light.noonHeight.toFixed(1)}度`,
                `Noon Sun ${light.noonHeight.toFixed(1)} degrees above the horizon`,
              )}
            >
              <path d="M15 112H195" stroke="#8b9876" strokeWidth="3" />
              <path
                d={`M70 112L${70 + 85 * Math.cos((light.noonHeight * Math.PI) / 180)} ${112 - 85 * Math.sin((light.noonHeight * Math.PI) / 180)}`}
                stroke="#c3a353"
                strokeWidth="3"
              />
              <path
                d={`M105 112A35 35 0 0 0 ${70 + 35 * Math.cos((light.noonHeight * Math.PI) / 180)} ${112 - 35 * Math.sin((light.noonHeight * Math.PI) / 180)}`}
                stroke="#315f69"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx={70 + 85 * Math.cos((light.noonHeight * Math.PI) / 180)}
                cy={112 - 85 * Math.sin((light.noonHeight * Math.PI) / 180)}
                r="10"
                fill="#e8c878"
              />
              <text x="15" y="133" fill="#657d81" fontSize="13">
                {words(mode, '地平线', 'Horizon')}
              </text>
              <text
                x="202"
                y="20"
                textAnchor="end"
                fill="#315f69"
                fontSize="17"
              >
                {light.noonHeight.toFixed(1)}°
              </text>
            </svg>
            <div
              className="geo-day-bar"
              role="img"
              aria-label={label(
                mode,
                `理想白昼约${light.daylight.toFixed(1)}小时，黑夜约${(24 - light.daylight).toFixed(1)}小时`,
                `Ideal daylight ${light.daylight.toFixed(1)} hours, night ${(24 - light.daylight).toFixed(1)} hours`,
              )}
            >
              <span style={{ width: `${(light.daylight / 24) * 100}%` }} />
            </div>
            <p>
              <Text
                mode={mode}
                text={t(
                  `昼 ${light.daylight.toFixed(1)} h ／夜 ${(24 - light.daylight).toFixed(1)} h`,
                  `Day ${light.daylight.toFixed(1)} h / night ${(24 - light.daylight).toFixed(1)} h`,
                )}
              />
            </p>
            <p className="geo-caption">
              <Text
                mode={mode}
                text={t(
                  `太阳正午高度约 ${light.noonHeight.toFixed(1)}°`,
                  `Solar-noon altitude about ${light.noonHeight.toFixed(1)}°`,
                )}
              />
            </p>
          </article>
        );
      })}
      <p className="geo-caption">
        <Text
          mode={mode}
          text={t(
            '球形地球的理想几何结果 · 忽略大气折射、太阳盘面、地形与天气，不是实测日出日落或气温预测。零倾角对照保持纬度不变。',
            'Ideal spherical-Earth geometry · No refraction, solar-disc width, terrain or weather. Not measured sunrise/sunset or a temperature forecast. Latitude stays fixed in the zero-tilt comparison.',
          )}
        />
      </p>
    </div>
  );
}
