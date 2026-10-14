import { useId, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';
import {
  bendGeometry,
  beachBudget,
  driftTrack,
  glacierPositions,
  readSoilOrder,
  soilLayers,
  soilPores,
  valleySection,
} from './earthSurfaceModels';

function Label({
  x,
  y,
  zh,
  en,
  mode,
  size = 17,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  zh: string;
  en: string;
  mode: LanguageMode;
  size?: number;
  anchor?: 'middle' | 'start' | 'end';
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size}>
      {words(mode, zh, en)}
      {mode === 'bilingual' && (
        <tspan x={x} dy={size + 2} fontSize={size - 2}>
          {en}
        </tspan>
      )}
    </text>
  );
}
function Figure({
  mode,
  description,
  caption,
  children,
  interactive = false,
}: {
  mode: LanguageMode;
  description: LocalizedText;
  caption: LocalizedText;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <figure className="geo-skill-figure geo-landscape-figure">
      <div
        className="geo-model-scroll"
        tabIndex={0}
        role="region"
        aria-label={words(
          mode,
          '可左右滚动的地表图示',
          'Surface diagram, scroll horizontally',
        )}
      >
        <svg
          viewBox="0 0 640 420"
          role={interactive ? 'group' : 'img'}
          aria-label={
            mode === 'bilingual'
              ? `${description.zh} / ${description.en}`
              : words(mode, description.zh, description.en)
          }
        >
          <rect width="640" height="420" rx="12" fill="#eef2e8" />
          {children}
        </svg>
      </div>
      <p className="geo-swipe-hint">
        <Text
          mode={mode}
          text={t(
            '小屏左右滑动看全图；键盘可聚焦图框后用方向键滚动。图上操作也有下方按钮替代。',
            'On small screens, swipe sideways; focus the frame and use arrow keys to scroll. Diagram actions also have buttons below.',
          )}
        />
      </p>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export function BendDiagram({
  mode,
  frame,
  high,
  assignments = {},
  onSite,
}: {
  mode: LanguageMode;
  frame: number;
  high: boolean;
  assignments?: Record<string, string>;
  onSite?: (id: string) => void;
}) {
  const g = bendGeometry(frame),
    points = g.points.map((p) => `${p.x},${p.y}`).join(' ');
  const colour: Record<string, string> = {
    erode: '#b2583b',
    deposit: '#b99d4e',
    plain: '#557664',
  };
  return (
    <Figure
      mode={mode}
      interactive={!!onSite}
      description={t(
        `曲流平面示意，帧${frame}；A和D在外弯，B和E在内弯，C在河道外的平地。${high ? '高水位覆盖部分邻近平地。' : '水位未漫出河道。'}`,
        `Meander plan, frame ${frame}: A/D outside bends, B/E inside, C on adjacent low ground. ${high ? 'High water covers some nearby ground.' : 'Water remains in-channel.'}`,
      )}
      caption={t(
        'Study原创曲流与洪泛平原示意，不按比例；帧只示意侧向迁移，没有测年或流速。外弯常受侵蚀、内弯常积沙；局部条件可以改变这种倾向。蓝色漫水范围人为设定，不是实际洪水图或安全边界。',
        'Study original, not to scale. Frames illustrate lateral migration without dated positions or velocities. Outer-bank erosion and inner-bar deposition are common tendencies, modified by local conditions. The invented inundation extent is neither an actual flood map nor a safe boundary.',
      )}
    >
      <rect x="55" y="50" width="530" height="305" rx="24" fill="#d4dfbc" />
      {high && (
        <rect
          x="70"
          y="65"
          width="500"
          height="275"
          rx="35"
          fill="#9bcbd5"
          opacity=".65"
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke="#758d62"
        strokeWidth="60"
        strokeDasharray="5 5"
      />
      <polyline points={points} fill="none" stroke="#81bccb" strokeWidth="46" />
      {[5, 91].map((index) => {
        const p = g.points[index]!,
          next = g.points[index + 1]!,
          previous = g.points[index - 1]!;
        const angle =
          (Math.atan2(next.y - previous.y, next.x - previous.x) * 180) /
          Math.PI;
        return (
          <path
            key={index}
            d="M-10 -8 L12 0 L-10 8 Z"
            transform={`translate(${p.x} ${p.y}) rotate(${angle})`}
            fill="#315f69"
          />
        );
      })}
      <Label
        mode={mode}
        x={100}
        y={385}
        zh="沿河方向 →"
        en="Downstream →"
        size={15}
        anchor="start"
      />
      <Label
        mode={mode}
        x={430}
        y={385}
        zh={high ? '高水位示意' : '普通水位示意'}
        en={high ? 'High-water example' : 'Ordinary-water example'}
        size={15}
      />
      {g.sites.map((s) => (
        <g
          key={s.id}
          role={onSite ? 'button' : undefined}
          tabIndex={onSite ? 0 : undefined}
          aria-label={words(mode, `标注 ${s.id} 点`, `Label site ${s.id}`)}
          onClick={() => onSite?.(s.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSite?.(s.id);
            }
          }}
          className={onSite ? 'geo-diagram-target' : undefined}
        >
          <circle
            cx={s.x}
            cy={s.y}
            r="28"
            fill="transparent"
            pointerEvents="all"
          />
          <circle
            cx={s.x}
            cy={s.y}
            r="24"
            fill={colour[assignments[`bend-${s.id}`] ?? ''] ?? '#fbfcf5'}
            stroke="#315f69"
            strokeWidth="2"
          />
          <text
            x={s.x}
            y={s.y + 7}
            textAnchor="middle"
            fill={assignments[`bend-${s.id}`] ? '#fff' : '#294e52'}
            fontSize="21"
            fontWeight="700"
          >
            {s.id}
          </text>
        </g>
      ))}
    </Figure>
  );
}
export function ValleySections({
  mode,
  active,
}: {
  mode: LanguageMode;
  active: 'river' | 'glacier';
}) {
  const curves = ['river', 'glacier'] as const;
  return (
    <Figure
      mode={mode}
      description={t(
        '并排谷地横剖面：河谷V形窄底，冰川谷U形宽底。坐标是原创示意，没有真实比例。',
        'Side-by-side cross sections: narrow-bottomed V river valley and broad-bottomed U glacial valley; invented coordinates, no surveyed scale.',
      )}
      caption={t(
        'Study原创横剖面对照，不是同地的前后照片，也不是所有谷地的精确外形。冰川侵蚀可拓宽谷底、使谷壁陡峭；河床下切与坡面过程常成V形。后来河流也能流经旧冰川谷；判因还要地质、划痕或沉积等证据。',
        'Study original cross sections, not a same-place photo pair or a universal valley outline. Glacial erosion can broaden floors and steepen walls; river incision plus slope processes often form V valleys. Rivers may later occupy glacial valleys; geology, scratches and deposits help test origins.',
      )}
    >
      {curves.map((kind, index) => {
        const left = 25 + index * 300,
          pts = valleySection(kind)
            .map((p) => `${left + 140 + p.x * 125},${120 + p.depth * 190}`)
            .join(' ');
        return (
          <g key={kind}>
            <rect
              x={left}
              y="50"
              width="290"
              height="300"
              rx="12"
              fill={active === kind ? '#d8e7e4' : '#fafbf5'}
              stroke={active === kind ? '#315f69' : '#d0d9c8'}
              strokeWidth="2"
            />
            <Label
              mode={mode}
              x={left + 145}
              y={77}
              zh={kind === 'river' ? '河谷：V形' : '冰川谷：U形'}
              en={kind === 'river' ? 'River valley: V' : 'Glacial valley: U'}
              size={17}
            />
            <polygon
              points={`${left + 15},340 ${pts} ${left + 265},340`}
              fill="#baa68a"
            />
            <polyline
              points={pts}
              fill="none"
              stroke="#66765b"
              strokeWidth="4"
            />
            {kind === 'river' ? (
              <path
                d={`M${left + 135} 300 Q${left + 140} 315 ${left + 148} 300`}
                stroke="#629dad"
                strokeWidth="8"
                fill="none"
              />
            ) : (
              <rect
                x={left + 87}
                y="300"
                width="107"
                height="7"
                fill="#a1ccd2"
              />
            )}
          </g>
        );
      })}
      <Label
        mode={mode}
        x={320}
        y={385}
        zh="同为横剖面；底宽、壁陡是线索"
        en="Both cross sections: floor width and wall slope are clues"
        size={15}
      />
    </Figure>
  );
}
export function IceFlow({
  mode,
  kind,
  frame,
}: {
  mode: LanguageMode;
  kind: string;
  frame: number;
}) {
  const p = glacierPositions(kind, frame),
    id = useId().replace(/:/g, '');
  const bed = (x: number) => 175 + (x - 80) * 0.32;
  return (
    <Figure
      mode={mode}
      description={t(
        `冰川纵向示意：帧${frame}，末端横坐标${p.front}，冰内标记横坐标${p.marker}；三情景中冰标记都向谷下。`,
        `Glacier longitudinal example, frame ${frame}: front x=${p.front}, ice marker x=${p.marker}; the marker moves down-valley in all three cases.`,
      )}
      caption={t(
        'Study原创：冰流方向与末端变化的比较。坐标和帧是任意示意，不是速度、年份或现实冰川预测。末端由流来的冰与消融／崩解等损失共同决定；整条冰川的质量收支还会先影响厚度，末端响应可滞后。图中把三种长期可能结果简化为同步移动。',
        'Study original: distinguish ice flow from front-position change. Coordinates/frames are arbitrary, without velocities, dates or glacier forecasts. Front delivery and ablation/calving jointly affect position; whole-glacier mass balance can change thickness first, with a delayed terminus response. Three possible longer-term outcomes are simplified as synchronous movement.',
      )}
    >
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 Z" fill="#315f69" />
        </marker>
      </defs>
      <polygon points="70,170 570,330 570,360 70,360" fill="#a59a82" />
      <path
        d={`M80 95 Q200 80 ${p.front} ${bed(p.front) - 24} L${p.front} ${bed(p.front)} L80 175 Z`}
        fill="#afd7de"
        stroke="#639dab"
        strokeWidth="3"
      />
      <line
        x1="400"
        x2="400"
        y1="180"
        y2="338"
        stroke="#7e7e66"
        strokeDasharray="6 5"
      />
      <circle cx={p.marker} cy={bed(p.marker) - 45} r="12" fill="#9d4c34" />
      <line
        x1={p.marker + 20}
        x2={p.marker + 78}
        y1={bed(p.marker) - 44}
        y2={bed(p.marker) - 25}
        stroke="#315f69"
        strokeWidth="4"
        markerEnd={`url(#${id})`}
      />
      <Label
        mode={mode}
        x={p.marker}
        y={42}
        zh="冰内标记：向谷下 →"
        en="Ice marker: down-valley →"
        size={16}
      />
      <Label
        mode={mode}
        x={p.front}
        y={370}
        zh="现在末端"
        en="Front now"
        size={16}
      />
      <Label
        mode={mode}
        x={400}
        y={155}
        zh="初始末端"
        en="Initial front"
        size={15}
      />
      <Label mode={mode} x={105} y={270} zh="高处" en="Higher" size={16} />
      <Label mode={mode} x={550} y={295} zh="低处" en="Lower" size={16} />
    </Figure>
  );
}
export function CoastalDrift({
  mode,
  direction,
  step,
}: {
  mode: LanguageMode;
  direction: 'right' | 'left';
  step: number;
}) {
  const points = driftTrack(direction, step),
    current = points[points.length - 1]!;
  const full = driftTrack(direction, 8),
    arrow = direction === 'right' ? '→' : '←';
  return (
    <Figure
      mode={mode}
      description={t(
        `沿岸搬运示意，波浪从${direction === 'right' ? '左' : '右'}侧斜向入射，步骤${step}；追踪颗粒在上冲和回流水之间移动。`,
        `Longshore transport example: waves approach obliquely from ${direction === 'right' ? 'left' : 'right'}, step ${step}; follow a particle through swash and backwash.`,
      )}
      caption={t(
        'Study原创俯视示意，不按比例。选取斜向上冲、较沿坡向海回流的一条颗粒路线，形成沿岸净位移；不是每粒沙的固定轨迹。真实沿岸流也搬沙，波浪、潮流和风暴会改变或逆转方向；图中无实际时间、速度或工程预测。',
        'Study original plan view, not to scale. One chosen particle follows oblique swash and more downslope backwash, giving net alongshore movement, not every grain’s fixed path. Longshore currents also carry sediment; waves, tides and storms may alter/reverse direction. No real times, velocities or engineering prediction.',
      )}
    >
      <rect x="35" y="45" width="570" height="125" fill="#d5dfbc" />
      <rect x="35" y="170" width="570" height="60" fill="#d8c592" />
      <rect x="35" y="230" width="570" height="130" fill="#aed2da" />
      <line
        x1="35"
        x2="605"
        y1="230"
        y2="230"
        stroke="#5a8894"
        strokeWidth="3"
      />
      <polyline
        points={full.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="#607a7b"
        strokeDasharray="6 5"
        strokeWidth="2"
      />
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="#a35b35"
        strokeWidth="4"
      />
      <circle
        cx={current.x}
        cy={current.y}
        r="12"
        fill="#a35b35"
        stroke="#fff"
        strokeWidth="3"
      />
      <text
        x={direction === 'right' ? 185 : 460}
        y="250"
        fontSize="34"
        transform={`rotate(${direction === 'right' ? -65 : -115},${direction === 'right' ? 185 : 460},250)`}
      >
        →
      </text>
      <Label
        mode={mode}
        x={320}
        y={85}
        zh={`斜向上冲 ＋ 向海回流；净移动 ${arrow}`}
        en={`Oblique swash + seaward backwash; net ${arrow}`}
        size={17}
      />
      <Label mode={mode} x={550} y={300} zh="海" en="Sea" size={17} />
      <Label
        mode={mode}
        x={320}
        y={390}
        zh="虚线是可比较路线；红点是追踪的沙粒"
        en="Dashed reference route; red dot is the tracked grain"
        size={15}
      />
    </Figure>
  );
}
export function BeachBudget({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: string;
}) {
  const b = beachBudget(kind);
  return (
    <Figure
      mode={mode}
      description={t(
        `虚构沙滩库存：原有${b.initial}，进入${b.incoming}，离开${b.outgoing}，剩${b.remaining}单位。`,
        `Invented beach stock: ${b.initial} initially + ${b.incoming} in − ${b.outgoing} out = ${b.remaining} units.`,
      )}
      caption={t(
        'Study原创一段沙滩的泥沙收支盒：每个圆是任意库存单位，不是立方米、粒数或宽度测量；此盒只比较净增减，不模拟地形、潮位和风暴。真实沙滩可季节变化，沉积存在不证明一直加宽，岩崖与沙滩也能相邻。',
        'Study original sediment-budget box for one beach segment. Dots are arbitrary stock units, not cubic metres, grain counts or measured widths. The box compares net gain/loss without terrain/tide/storm simulation. Beaches change seasonally; deposition does not prove continual widening, and cliffs may adjoin beaches.',
      )}
    >
      <rect
        x="170"
        y="115"
        width="300"
        height="180"
        rx="15"
        fill="#dcc997"
        stroke="#a19167"
        strokeWidth="3"
      />
      <Label
        mode={mode}
        x={320}
        y={45}
        zh="沙滩泥沙库存"
        en="Beach sediment stock"
        size={21}
      />
      <text x="320" y="98" textAnchor="middle" fontSize="24">
        6 + {b.incoming} − {b.outgoing} = {b.remaining}
      </text>
      {Array.from({ length: b.remaining }, (_, i) => (
        <circle
          key={i}
          cx={212 + (i % 4) * 72}
          cy={165 + Math.floor(i / 4) * 68}
          r="16"
          fill="#aa793d"
        />
      ))}
      <text x="120" y="205" fontSize="38" textAnchor="middle">
        →
      </text>
      <text x="520" y="205" fontSize="38" textAnchor="middle">
        →
      </text>
      <Label
        mode={mode}
        x={90}
        y={260}
        zh={`进入 ${b.incoming}`}
        en={`${b.incoming} in`}
        size={17}
      />
      <Label
        mode={mode}
        x={550}
        y={260}
        zh={`离开 ${b.outgoing}`}
        en={`${b.outgoing} out`}
        size={17}
      />
      <Label
        mode={mode}
        x={320}
        y={360}
        zh="侵蚀、搬运与沉积可同时发生"
        en="Erosion, transport and deposition may coexist"
        size={17}
      />
    </Figure>
  );
}
export function SoilProfile({
  mode,
  order = 'O,A,B,C,R',
  draft = false,
}: {
  mode: LanguageMode;
  order?: string;
  draft?: boolean;
}) {
  const ids = readSoilOrder(order),
    heights = [40, 70, 80, 85, 50];
  let top = 70;
  return (
    <Figure
      mode={mode}
      description={t(
        `土层${draft ? '待核对搭建' : '实例'}从上到下：${ids.join('、')}。R是坚硬基岩，不是土壤层。`,
        `${draft ? 'Draft build' : 'Example'} from top to base: ${ids.join(', ')}. R is hard bedrock, not soil.`,
      )}
      caption={t(
        'Study原创一个O–A–B–C–R实例，不代表所有土壤、统一厚度或这张苔原照片的鉴定。O层可不存在，E层可出现；C母质可以是搬来的沉积物或火山灰，未必由正下方R直接风化。颜色只是图例，土壤性质还须观察与检测。',
        'Study original O–A–B–C–R example, not all soils, standard thicknesses or an identification of the tundra photo. O can be absent and E can occur; C may be transported sediment or volcanic ash, not weathered directly from underlying R. Colours are a legend; properties require observation and testing.',
      )}
    >
      <Label
        mode={mode}
        x={320}
        y={32}
        zh={draft ? '你搭的剖面：请核对' : '一种土壤剖面实例'}
        en={
          draft ? 'Your profile: check the build' : 'One example soil profile'
        }
        size={19}
      />
      {ids.map((id, i) => {
        const l = soilLayers.find((r) => r.id === id)!,
          y = top,
          h = heights[i]!;
        top += h;
        return (
          <g key={id}>
            <rect
              x="55"
              y={y}
              width="240"
              height={h}
              fill={l.colour}
              stroke="#f8f6e9"
              strokeWidth="2"
            />
            <text
              x="80"
              y={y + h / 2 + 7}
              fontSize="25"
              fill={id === 'O' || id === 'A' ? '#fff' : '#253f36'}
            >
              {id}
            </text>
            <Label
              mode={mode}
              x={330}
              y={y + h / 2 - (mode === 'bilingual' ? 5 : -6)}
              zh={l.zh}
              en={l.en}
              size={16}
              anchor="start"
            />
          </g>
        );
      })}
    </Figure>
  );
}
export function SoilPoreDiagram({
  mode,
  water,
}: {
  mode: LanguageMode;
  water: number;
}) {
  const p = soilPores(water),
    colours = {
      mineral: '#baa788',
      organic: '#544f37',
      water: '#76b5c8',
      air: '#fffdf4',
    };
  const rows = [
    ['mineral', '矿物', 'Minerals', p.mineral],
    ['organic', '有机质', 'Organic matter', p.organic],
    ['water', '孔隙中的水', 'Water in pores', p.water],
    ['air', '孔隙中的空气', 'Air in pores', p.air],
  ] as const;
  return (
    <Figure
      mode={mode}
      description={t(
        `虚构100单位矿质土样：矿物45、有机质5、孔隙水${p.water}、孔隙空气${p.air}。`,
        `Invented 100-unit mineral sample: 45 minerals, 5 organic matter, ${p.water} pore water, ${p.air} pore air.`,
      )}
      caption={t(
        'Study原创固定孔隙的简化体积盒，45/5/50是人为选定实例，并非所有土壤的组成或最佳配方。水占孔隙增加时，图中空气减少；真实土壤还会收缩、膨胀、排水，有不同孔径、矿物和生命。这里不预测产量或把25单位水判为最优。',
        'Study original fixed-pore volume box: 45/5/50 is one invented example, not a universal composition or optimum recipe. More pore water leaves less pore air here. Real soils shrink, swell and drain, with diverse pore sizes, minerals and life. No yield prediction or claim that 25 water units is optimal.',
      )}
    >
      <Label
        mode={mode}
        x={320}
        y={40}
        zh="同一块虚构矿质土样：100体积单位"
        en="Same invented mineral-soil sample: 100 volume units"
        size={18}
      />
      {Array.from({ length: 100 }, (_, i) => {
        const k =
          i < 45
            ? 'mineral'
            : i < 50
              ? 'organic'
              : i < 50 + p.water
                ? 'water'
                : 'air';
        return (
          <rect
            key={i}
            x={45 + (i % 10) * 27}
            y={85 + Math.floor(i / 10) * 27}
            width="25"
            height="25"
            fill={colours[k]}
            stroke="#778774"
          />
        );
      })}
      {rows.map(([key, zh, en, value], i) => (
        <g key={key}>
          <rect
            x="350"
            y={105 + i * 65}
            width="24"
            height="24"
            fill={colours[key]}
            stroke="#66755d"
          />
          <Label
            mode={mode}
            x={390}
            y={119 + i * 65}
            zh={`${zh}：${value}`}
            en={`${en}: ${value}`}
            size={16}
            anchor="start"
          />
        </g>
      ))}
      <Label
        mode={mode}
        x={320}
        y={390}
        zh="有孔隙、有机质与生命；土壤不只是碎石"
        en="Pores, organic matter and life: more than broken rock"
        size={15}
      />
    </Figure>
  );
}
