import { useId, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';
import world from '../../../content/map-data.json';
import nz from '../../../content/nz-overview-data.json';
import { nzPoint } from './placeModels';
import { worldPoint } from './models';
import {
  waterNodes,
  waterEdges,
  readWaterRoute,
  rainBudget,
  currentCases,
  heatParcel,
  nzSegments,
  alpsCoords,
  nzQuakes,
  quakeDepthBand,
  ocean,
} from './waterEarthModels';
export function EarthFigure({
  mode,
  description,
  caption,
  children,
  viewBox = '0 0 900 580',
}: {
  mode: LanguageMode;
  description: LocalizedText;
  caption: LocalizedText;
  children: ReactNode;
  viewBox?: string;
}) {
  return (
    <figure className="geo-skill-figure geo-landscape-figure geo-water-figure">
      <div
        className="geo-model-scroll"
        tabIndex={0}
        role="region"
        aria-label={words(
          mode,
          '可左右滚动的水与地球图示',
          'Water and Earth diagram, scroll horizontally',
        )}
      >
        <svg
          viewBox={viewBox}
          role="img"
          aria-label={
            mode === 'bilingual'
              ? `${description.zh} / ${description.en}`
              : words(mode, description.zh, description.en)
          }
        >
          {children}
        </svg>
      </div>
      <p className="geo-swipe-hint">
        <Text
          mode={mode}
          text={t(
            '小屏可左右滑动；聚焦图框用方向键滚动。所有操作另有按钮。',
            'On small screens swipe sideways, or focus the frame and use arrow keys. Controls also have buttons.',
          )}
        />
      </p>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
function Label({
  mode,
  x,
  y,
  zh,
  en,
  size = 19,
  anchor = 'middle',
}: {
  mode: LanguageMode;
  x: number;
  y: number;
  zh: string;
  en: string;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill="#294e52">
      {words(mode, zh, en)}
      {mode === 'bilingual' && (
        <tspan x={x} dy={size + 2} fontSize={size - 2}>
          {en}
        </tspan>
      )}
    </text>
  );
}
export function WaterNetwork({
  mode,
  route,
}: {
  mode: LanguageMode;
  route: string[];
}) {
  const r = readWaterRoute(route),
    current = r.at(-1),
    marker = useId().replace(/:/g, '');
  return (
    <EarthFigure
      mode={mode}
      description={t(
        '水在地表、土壤、植物、地下水、海洋、气体水汽和云之间有多条通路；选中位置有红色边框。',
        'Water has alternative paths through surface, soil, plants, groundwater, ocean, gas vapour and cloud; red outline marks the current location.',
      )}
      caption={t(
        'Study原创储存与通量网络。箭头是选择的可能通路，不是完整系统、固定顺序、流量或时间。地下水在孔隙与裂隙中，不是普遍存在的地下大河；云是液滴／冰晶，水汽气体看不见。冰雪、湖泊、输送与人类用水等另有路径。',
        'Study original storage/flux network. Arrows are selected possibilities, not a complete system, compulsory order, quantity or clock. Groundwater occupies pores/cracks, not a universal underground river. Cloud droplets/ice differ from invisible vapour. Ice, lakes, atmospheric transport and human uses add routes.',
      )}
    >
      <rect width="900" height="580" rx="12" fill="#eef2e8" />
      <defs>
        <marker
          id={marker}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill="#557e89" />
        </marker>
      </defs>
      {waterEdges.map((e) => {
        const a = waterNodes.find((n) => n.id === e.from)!,
          b = waterNodes.find((n) => n.id === e.to)!,
          dx = b.x - a.x,
          dy = b.y - a.y,
          len = Math.hypot(dx, dy),
          seen = r.some((n, i) => n === e.from && r[i + 1] === e.to);
        return (
          <path
            key={e.id}
            d={`M${a.x + (dx * 72) / len} ${a.y + (dy * 48) / len}L${b.x - (dx * 76) / len} ${b.y - (dy * 52) / len}`}
            fill="none"
            stroke={seen ? '#b96450' : '#557e89'}
            strokeWidth={seen ? 5 : 2}
            opacity={seen ? 1 : 0.5}
            markerEnd={`url(#${marker})`}
          />
        );
      })}
      {waterNodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x - 73}
            y={n.y - 36}
            width="146"
            height="78"
            rx="14"
            fill={
              n.id === 'vapour'
                ? '#fafbf5'
                : n.id === 'cloud'
                  ? '#fff'
                  : '#dcebed'
            }
            stroke={current === n.id ? '#b96450' : '#315f69'}
            strokeWidth={current === n.id ? 5 : 1.5}
          />
          <Label
            mode={mode}
            x={n.x}
            y={n.y - 4}
            zh={n.zh}
            en={n.en}
            size={17}
          />
        </g>
      ))}
      <Label
        mode={mode}
        x={450}
        y={545}
        zh="储存地点＋可能通路；不是一条固定圆圈"
        en="Stores + possible transfers, not one compulsory circle"
        size={17}
      />
    </EarthFigure>
  );
}
export function RainPartition({
  mode,
  sealed,
}: {
  mode: LanguageMode;
  sealed: boolean;
}) {
  const b = rainBudget(sealed);
  return (
    <EarthFigure
      viewBox="0 0 900 340"
      mode={mode}
      description={t(
        `虚构10份降雨，径流${b.runoff}、下渗${b.infiltration}、暂留${b.retained}。`,
        `Invented ten rain parcels: ${b.runoff} runoff, ${b.infiltration} infiltrated, ${b.retained} retained.`,
      )}
      caption={t(
        '原创同一场虚构雨的两种地面分配，10份始终守恒；铺面例径流较多不是所有实际地点的固定比例。雨强、土壤、坡度、植被与工程也会改变结果。暂留的水以后也可能蒸发或流走；此图不作洪水预测。',
        'Original partitions for one invented event conserve ten parcels. More runoff in this paved example is not a universal fraction. Rain intensity, soil, slopes, vegetation and drainage also matter. Retained water may later evaporate or move. No flood prediction.',
      )}
    >
      <rect width="900" height="340" rx="12" fill="#eef2e8" />
      <Label
        mode={mode}
        x={450}
        y={40}
        zh={sealed ? '铺面较多的示例' : '可下渗地面的示例'}
        en={sealed ? 'More paving example' : 'Permeable-ground example'}
      />
      {[
        ['径流', 'Runoff', b.runoff, '#4e709f'],
        ['下渗', 'Infiltration', b.infiltration, '#78947c'],
        ['暂留', 'Retained', b.retained, '#d9aa72'],
      ].map(([zh, en, num, colour], i) => (
        <g key={i}>
          <rect
            x={30 + i * 290}
            y="95"
            width="270"
            height="135"
            rx="10"
            fill="#fafbf5"
            stroke="#7f9381"
          />
          {Array.from({ length: Number(num) }, (_, k) => (
            <circle
              key={k}
              cx={60 + i * 290 + (k % 4) * 55}
              cy={130 + Math.floor(k / 4) * 55}
              r="15"
              fill={String(colour)}
            />
          ))}
          <Label
            mode={mode}
            x={165 + i * 290}
            y={265}
            zh={`${zh}: ${num}`}
            en={`${en}: ${num}`}
          />
        </g>
      ))}
    </EarthFigure>
  );
}
export function CurrentMap({
  mode,
  active,
}: {
  mode: LanguageMode;
  active: string;
}) {
  const marker = useId().replace(/:/g, '');
  return (
    <EarthFigure
      viewBox="0 0 900 560"
      mode={mode}
      description={t(
        '世界底图上的湾流及其延伸、加那利流和南极绕极流三例，箭头分别向高纬、低纬、东方。',
        'Three selected currents on a world base: Gulf Stream/extension, Canary and Antarctic Circumpolar; arrows towards higher latitude, lower latitude and east.',
      )}
      caption={t(
        'Natural Earth v5.1.2公开域底图；Study依据NOAA资料绘三条概略通路，不是全部洋流、实时边界、流速或航线。红色W表示相对较暖，蓝色C相对较凉；两者均能高于0°C。ACC以E标向东，不在此作单一冷热比较。世界等距圆柱投影使面积和形状失真。',
        'Natural Earth v5.1.2 public-domain base; three Study schematic routes informed by NOAA, not all currents, live boundaries, speeds or navigation. Red W=relatively warm, blue C=relatively cool; both may be above 0°C. ACC E=east, without one warm/cool comparison here. Equirectangular projection distorts area/shape.',
      )}
    >
      <rect width="900" height="560" rx="12" fill="#fafbf5" />
      <rect width="900" height="450" fill="#dcebed" />
      <path d={world.world} fill="#cbd4b1" stroke="#7f9381" strokeWidth=".8" />
      <path d="M0 225H900" stroke="#78949a" strokeDasharray="5 6" />
      <defs>
        <marker
          id={marker}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10Z" fill="#315f69" />
        </marker>
      </defs>
      {currentCases.map((c) => (
        <g key={c.id} opacity={active === c.id ? 1 : 0.42}>
          <polyline
            points={c.points
              .map(([lon, lat]) => {
                const p = worldPoint(lon, lat, 0);
                return `${p.x},${p.y}`;
              })
              .join(' ')}
            stroke={
              c.kind === 'warm'
                ? '#b96450'
                : c.kind === 'cool'
                  ? '#4e709f'
                  : '#315f69'
            }
            strokeWidth={active === c.id ? 7 : 4}
            fill="none"
            markerEnd={`url(#${marker})`}
          />
          <text
            x={
              c.id === 'gulf'
                ? worldPoint(-62, 40, 0).x
                : c.id === 'canary'
                  ? worldPoint(-23, 30, 0).x
                  : 500
            }
            y={c.id === 'gulf' ? 105 : c.id === 'canary' ? 180 : 395}
            fontSize="23"
            fontWeight="700"
            fill="#294e52"
          >
            {c.kind === 'warm' ? 'W' : c.kind === 'cool' ? 'C' : 'E'}
          </text>
        </g>
      ))}
      <path
        d="M870 68V25M863 35L870 25L877 35"
        fill="none"
        stroke="#315f69"
        strokeWidth="2"
      />
      <text x="865" y="20">
        N
      </text>
      <Label
        mode={mode}
        x={450}
        y={486}
        zh="W 较暖 → 高纬；C 较凉 → 低纬；E 向东"
        en="W warmer → higher lat; C cooler → lower lat; E east"
        size={17}
      />
      <Label
        mode={mode}
        x={450}
        y={535}
        zh="概略位置与方向，不是流速"
        en="Approximate locations/directions, not speed"
        size={15}
      />
    </EarthFigure>
  );
}
export function OceanTemperature({
  mode,
  month,
  selected,
}: {
  mode: LanguageMode;
  month: 'jan' | 'jul';
  selected: string;
}) {
  return (
    <EarthFigure
      viewBox="0 0 900 680"
      mode={mode}
      description={t(
        `北大西洋1991–2020${month === 'jan' ? '一月' : '七月'}平均海表温度，°C；A、B同为34.5°N，灰色是陆地。`,
        `North Atlantic ${month === 'jan' ? 'January' : 'July'} 1991–2020 mean sea surface temperature, °C; A/B at 34.5°N; grey is land.`,
      )}
      caption={t(
        'NOAA OI SST V2，经NOAA PSL提供；Study按原1°格子绘制，陆海掩膜另核对。是1991–2020指定月份多年平均，不是同日照片、今天海温、2米气温或流速。两个同纬样点也未控制所有条件；温度色带本身不能证明流向。',
        'NOAA OI SST V2 via NOAA PSL; Study renders original 1° cells with checked land/sea mask. Long-term means for selected months in1991–2020, not same-day photographs, current SST, 2m air or velocity. Two same-latitude cells do not control all conditions; colours alone cannot prove flow direction.',
      )}
    >
      <rect width="900" height="680" rx="12" fill="#fafbf5" />
      <Label
        mode={mode}
        x={450}
        y={28}
        zh={`1991–2020 ${month === 'jan' ? '一月' : '七月'}海表温度（°C）`}
        en={`1991–2020 ${month === 'jan' ? 'January' : 'July'} SST (°C)`}
        size={20}
      />
      <image
        href={`/geography/maps/sst-${month}-1991-2020.svg`}
        x="70"
        y="80"
        width="735"
        height="455"
      />
      {[0, 20, 40, 60].map((lat) => (
        <g key={lat}>
          <path
            d={`M70 ${80 + (65 - lat) * 7}H805`}
            stroke="#fff"
            strokeOpacity=".5"
          />
          <text x="60" y={85 + (65 - lat) * 7} textAnchor="end" fontSize="16">
            {lat}°N
          </text>
        </g>
      ))}
      {[-80, -40, 0, 20].map((lon) => (
        <text
          key={lon}
          x={70 + (lon + 85) * 7}
          y="559"
          textAnchor="middle"
          fontSize="16"
        >
          {Math.abs(lon)}°{lon < 0 ? 'W' : lon > 0 ? 'E' : ''}
        </text>
      ))}
      {ocean.points.map((p) => (
        <g key={p.id}>
          <circle
            cx={70 + (p.lon + 85) * 7}
            cy={80 + (65 - p.lat) * 7}
            r="18"
            stroke="#fff"
            strokeWidth="3"
            fill={selected === p.id ? '#b96450' : '#315f69'}
          />
          <text
            x={70 + (p.lon + 85) * 7}
            y={86 + (65 - p.lat) * 7}
            textAnchor="middle"
            fontWeight="700"
            fill="#fff"
            fontSize="20"
          >
            {p.id}
          </text>
        </g>
      ))}
      {ocean.colours.map((c, i) => (
        <g key={c}>
          <rect x={75 + i * 107} y="590" width="95" height="20" fill={c} />
          <text x={122 + i * 107} y="632" textAnchor="middle" fontSize="16">
            {['<5', '5–<10', '10–<15', '15–<20', '20–<25', '25–<30', '≥30'][i]}
          </text>
        </g>
      ))}
      <Label
        mode={mode}
        x={450}
        y={662}
        zh="图例：°C；灰色陆地；A/B同纬不同位置"
        en="Legend °C; grey land; A/B same latitude, different sites"
        size={14}
      />
    </EarthFigure>
  );
}
export function HeatTransport({
  mode,
  frame,
  kind,
}: {
  mode: LanguageMode;
  frame: number;
  kind: 'warm' | 'cool';
}) {
  const p = heatParcel(frame, kind);
  return (
    <EarthFigure
      viewBox="0 0 900 340"
      mode={mode}
      description={t(
        `概念热输送对照：${kind === 'warm' ? '较暖' : '较凉'}来水标记向右移动，帧${frame}。`,
        `Conceptual heat transport: ${kind === 'warm' ? 'warmer' : 'cooler'} incoming-water marker moves right at frame ${frame}.`,
      )}
      caption={t(
        '原创同一虚构海岸的来水对照；其余条件暂设相同，较暖/较凉来水改变海气交换的可能性，未计算气温或降雨。洋流传热，还受风、旋转、密度、潮汐和盆地形状影响；真实陆地气候不能只归因洋流。',
        'Original comparison at one fictional coast, other conditions held conceptually equal. Warmer/cooler incoming water changes possible air–sea heat exchange without calculating air temperature/rain. Winds, rotation, density, tides and basin shape affect currents. Real land climate has multiple causes.',
      )}
    >
      <rect width="900" height="340" rx="12" fill="#eef2e8" />
      <rect x="40" y="110" width="550" height="125" rx="15" fill="#dcebed" />
      <path d="M600 260V110L770 70L860 260Z" fill="#cbd4b1" />
      <path
        d="M130 170H530M514 157L530 170L514 183"
        stroke="#315f69"
        strokeWidth="4"
        fill="none"
      />
      <circle cx={p.x} cy="170" r="25" fill={p.colour} />
      <text x={p.x} y="178" textAnchor="middle" fill="#fff" fontSize="23">
        {kind === 'warm' ? 'W' : 'C'}
      </text>
      <Label
        mode={mode}
        x={450}
        y={40}
        zh={
          kind === 'warm'
            ? '较暖来水，可能向较凉空气释热'
            : '较凉来水，改变空气与水的温差'
        }
        en={
          kind === 'warm'
            ? 'Warmer water can release heat to cooler air'
            : 'Cooler water changes the air–sea temperature contrast'
        }
        size={18}
      />
      <Label
        mode={mode}
        x={725}
        y={302}
        zh="同一虚构海岸"
        en="Same fictional coast"
        size={17}
      />
    </EarthFigure>
  );
}
const pathOf = (coords: readonly (readonly number[])[]) =>
  coords
    .map(([lon, lat], i) => {
      const p = nzPoint(lon!, lat!);
      return `${i ? 'L' : 'M'}${p.x},${p.y}`;
    })
    .join(' ');
export function NZBoundaryMap({
  mode,
  layers,
  active,
}: {
  mode: LanguageMode;
  layers: string[];
  active: string;
}) {
  return (
    <EarthFigure
      viewBox="0 0 640 840"
      mode={mode}
      description={t(
        `新西兰概略边界、山脉叠图与2020年GeoNet筛选震中，共${nzQuakes.count}个；点的形状/颜色表示深度类别，不是危险范围。`,
        `NZ approximate boundary/range overlays and ${nzQuakes.count} selected 2020 GeoNet epicentres; symbol shape/colour encodes depth, not hazard extent.`,
      )}
      caption={t(
        'Natural Earth v5.1.2主岛海岸；Study依GNS解释画边界/山脉概略线，复杂过渡区未画成单条精确断层。GeoNet2020 UTC、164–180°E/33–48°S、目录震级≥4且事件类型earthquake，190条，2026-10-14提取；原响应另有1条outside of network interest已排除。图不代表全部地震、未来风险、所有活动断层或震源连线；少点区不能推断安全。',
        'Natural Earth v5.1.2 main-island coast; Study approximate boundary/range lines informed by GNS, not a precise single fault across complex transitions. GeoNet2020 UTC,164–180°E/33–48°S,catalogue magnitude≥4,event type earthquake:190 records retrieved2026-10-14; one “outside of network interest” record excluded. Not all seismicity, future risk, all active faults or links between hypocentres. Few dots do not establish safety.',
      )}
    >
      <rect width="640" height="840" rx="12" fill="#fafbf5" />
      <Label
        mode={mode}
        x={320}
        y={26}
        zh="新西兰：关系来自多层证据"
        en="New Zealand: compare evidence layers"
        size={18}
      />
      <g transform="translate(45,65)">
        <rect width="544" height="675" fill="#dcebed" />
        {[-35, -40, -45].map((lat) => (
          <g key={lat}>
            <path d={`M0 ${nzPoint(164, lat).y}H544`} stroke="#fff" />
            <text
              x="-5"
              y={nzPoint(164, lat).y + 5}
              textAnchor="end"
              fontSize="15"
            >
              {Math.abs(lat)}°S
            </text>
          </g>
        ))}
        <path d={nz.coast} fill="#cbd4b1" stroke="#7f9381" strokeWidth="1" />
        {layers.includes('relief') && (
          <path
            d={pathOf(alpsCoords)}
            fill="none"
            stroke="#9a7f5d"
            strokeWidth="14"
            strokeLinecap="round"
          />
        )}
        {layers.includes('boundary') &&
          nzSegments.map((s) => (
            <path
              key={s.id}
              d={pathOf(s.coords)}
              fill="none"
              stroke={active === s.id ? '#b96450' : '#315f69'}
              strokeWidth={active === s.id ? 6 : 3}
              strokeDasharray="8 5"
            />
          ))}
        {layers.includes('quakes') &&
          nzQuakes.records.map((q) => {
            const p = nzPoint(q.lon, q.lat),
              band = quakeDepthBand(q.depthKm),
              fill =
                band === 'shallow'
                  ? '#b96450'
                  : band === 'middle'
                    ? '#83648a'
                    : '#315f69';
            return band === 'deep' ? (
              <path
                key={q.id}
                d={`M${p.x} ${p.y - 4}l4 4-4 4-4-4Z`}
                fill={fill}
                stroke="#fff"
                strokeWidth=".4"
              />
            ) : band === 'middle' ? (
              <rect
                key={q.id}
                x={p.x - 3}
                y={p.y - 3}
                width="6"
                height="6"
                fill={fill}
                stroke="#fff"
                strokeWidth=".4"
              />
            ) : (
              <circle
                key={q.id}
                cx={p.x}
                cy={p.y}
                r="3"
                fill={fill}
                stroke="#fff"
                strokeWidth=".4"
              />
            );
          })}
        {nzSegments.map((s, i) => {
          const [lo, la] = s.coords[Math.floor(s.coords.length / 2)]!,
            p = nzPoint(lo!, la!);
          return (
            <g key={s.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r="15"
                fill="#fafbf5"
                stroke="#315f69"
                strokeWidth="2"
              />
              <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="19">
                {i + 1}
              </text>
            </g>
          );
        })}
        <path
          d="M510 60V15M502 25L510 15L518 25"
          stroke="#315f69"
          strokeWidth="2"
          fill="none"
        />
        <text x="505" y="10">
          N
        </text>
      </g>
      <Label
        mode={mode}
        x={320}
        y={770}
        zh="● <40km；■ 40–<100km；◆ ≥100km深"
        en="Depth: ● <40km; ■ 40–<100km; ◆ ≥100km"
        size={16}
      />
      <Label
        mode={mode}
        x={320}
        y={817}
        zh="虚线：概略边界；棕带：山脉；不是实测线宽"
        en="Dashed boundary; brown range; widths unmeasured"
        size={14}
      />
    </EarthFigure>
  );
}
