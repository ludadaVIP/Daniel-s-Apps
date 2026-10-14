import type { ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';
import {
  boundaryOffsets,
  earthLayers,
  faultFrames,
  volcanoCases,
  type BoundaryType,
} from './geologyModels';
import mapData from '../../../content/map-data.json';
import earthquakeData from '../../../content/earthquake-data.json';
import { worldPoint } from './models';
function Figure({
  mode,
  zh,
  en,
  children,
  caption,
}: {
  mode: LanguageMode;
  zh: string;
  en: string;
  children: ReactNode;
  caption: { zh: string; en: string };
}) {
  return (
    <figure className="geo-skill-figure">
      <div
        className="geo-model-scroll"
        tabIndex={0}
        role="region"
        aria-label={words(
          mode,
          '可左右滚动的地理图示',
          'Geography diagram, scroll horizontally',
        )}
      >
        <svg
          viewBox="0 0 640 390"
          role="img"
          aria-label={
            mode === 'bilingual' ? `${zh} / ${en}` : words(mode, zh, en)
          }
        >
          {children}
        </svg>
      </div>
      <p className="geo-model-swipe">
        {words(
          mode,
          '窄屏可左右滑动图示；键盘聚焦图示后使用方向键。',
          'Swipe diagrams sideways on narrow screens; focus and use arrow keys with a keyboard.',
        )}
      </p>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export function EarthSection({
  mode,
  panel = 0,
  reveal = true,
}: {
  mode: LanguageMode;
  panel?: number;
  reveal?: boolean;
}) {
  if (panel === 2)
    return (
      <Figure
        mode={mode}
        zh="P波能通过固体与液体，S波不能通过液体的证据示意"
        en="Evidence model: P waves cross solids and liquids; S waves do not cross liquids"
        caption={t(
          '证据示意，不画真实波路。实际波会折射与转换；科学家比较许多仪器记录，并结合岩石、重力和实验推断内部结构。',
          'Evidence schematic, not real wave paths. Real waves refract and convert; many instrument records, rocks, gravity and experiments constrain the interior.',
        )}
      >
        <rect x="30" y="55" width="580" height="235" rx="20" fill="#f0e9d8" />
        <rect x="260" y="55" width="190" height="235" fill="#ddbf83" />
        <text x="45" y="35">
          {words(mode, '固态岩石', 'Solid rock')}
        </text>
        <text x="272" y="35">
          {words(mode, '液体层', 'Liquid layer')}
        </text>
        <path d="M55 125 H580" stroke="#315f69" strokeWidth="7" />
        <text x="50" y="105">
          P →
        </text>
        <path
          d="M55 225 H260"
          stroke="#8d5e45"
          strokeWidth="7"
          strokeDasharray="12 5"
        />
        <text x="50" y="205">
          S →
        </text>
        <text x="285" y="228">
          {words(mode, 'S不能穿过液体', 'S cannot cross liquid')}
        </text>
        <text x="40" y="330">
          {words(
            mode,
            '推断结构 ≠ 拍到了地核',
            'Inferring structure ≠ photographing the core',
          )}
        </text>
      </Figure>
    );
  if (panel === 1)
    return (
      <Figure
        mode={mode}
        zh="板块包括地壳和最上部坚硬地幔；下方岩石可缓慢变形"
        en="A plate includes crust and rigid uppermost mantle; rock below can deform slowly"
        caption={t(
          '局部剖面，厚度夸大。岩石圈是按力学性质划分的层，包括地壳与最上部地幔；它与地壳、地幔这种成分分层不一一对应。',
          'Local section with exaggerated thickness. The lithosphere is a mechanical layer including crust and uppermost mantle, distinct from compositional layering.',
        )}
      >
        <rect x="65" y="80" width="510" height="40" fill="#8d8266" />
        <rect x="65" y="120" width="510" height="85" fill="#b68c61" />
        <rect x="65" y="205" width="510" height="120" fill="#d5b486" />
        <text x="85" y="107">
          {words(mode, '地壳 · 固态', 'Crust · solid')}
        </text>
        <text x="85" y="164">
          {words(mode, '最上部坚硬地幔', 'Rigid uppermost mantle')}
        </text>
        <text x="85" y="267">
          {words(
            mode,
            '下方地幔：主要固态，缓慢变形',
            'Mantle below: mostly solid, slow deformation',
          )}
        </text>
        <path
          d="M590 80 H605 V205 H590"
          fill="none"
          stroke="#315f69"
          strokeWidth="4"
        />
        <text x="85" y="50">
          {words(
            mode,
            '地壳 + 最上部地幔 = 板块的一部分',
            'Crust + uppermost mantle = plate material',
          )}
        </text>
      </Figure>
    );
  return (
    <Figure
      mode={mode}
      zh={
        reveal
          ? '地球剖面模型从外到内为地壳、地幔、液态外核、固态内核'
          : '地球剖面有四个不同颜色的同心层，A在外表层，B在厚外层，C在内圈，D在中心'
      }
      en={
        reveal
          ? 'Earth model: crust, mantle, liquid outer core, solid inner core'
          : 'Four concentric layers: A at the outer skin, B in a thick outer shell, C in an inner ring, D at the centre'
      }
      caption={
        reveal
          ? t(
              '教学剖面，地壳厚度夸大，颜色不代表真实外观。A–D从表面到中心；地核并非岩浆库，地幔主要为固态。',
              'Teaching section: crust exaggerated, colours do not show real appearance. A–D run from surface to centre; the core is not a magma reservoir and the mantle is mostly solid.',
            )
          : t(
              '教学剖面，外表薄层厚度夸大，颜色用于区分，不代表真实外观。A–D由表面到中心；观察后猜想各层可能的材料与状态。',
              'Teaching cutaway: the thin outer skin is exaggerated and colours distinguish layers rather than real appearance. A–D run from surface to centre; observe and predict materials/states.',
            )
      }
    >
      {[earthLayers[0], earthLayers[1], earthLayers[2], earthLayers[3]].map(
        (p, i) => (
          <circle
            key={p.id}
            cx="200"
            cy="195"
            r={[162, 150, 87, 38][i]}
            fill={p.colour}
          />
        ),
      )}
      {earthLayers.map((p, i) => (
        <g key={p.id}>
          <path
            d={`M${[360, 320, 276, 225][i]} ${[180, 205, 223, 205][i]} L390 ${70 + i * 82}`}
            fill="none"
            stroke="#304f4c"
          />
          <text x="400" y={70 + i * 82}>
            {String.fromCharCode(65 + i)} ·{' '}
            {reveal ? words(mode, p.zh, p.en) : '?'}
          </text>
          {reveal && (
            <text x="400" y={94 + i * 82} fontSize="16">
              {words(
                mode,
                i === 1 ? '主要为固态' : p.stateZh,
                i === 1 ? 'Mostly solid' : p.stateEn,
              )}
            </text>
          )}
        </g>
      ))}
    </Figure>
  );
}
export function DriftPuzzle({
  mode,
  gap,
}: {
  mode: LanguageMode;
  gap: number;
}) {
  const shift = gap * 1.4;
  return (
    <Figure
      mode={mode}
      zh="南美洲与非洲的概略轮廓拼合，三角化石线索可随间距比较"
      en="Schematic South America/Africa fit with matching triangle fossil clues"
      caption={t(
        '原创概略拼图：轮廓、线索位置与滑动不是古地图、采样位置或定量漂移路线。对应同类型、相近地质年龄化石是另一类证据；现代海岸不是完美拼图。此处只演示盘古大陆的一部分关系。',
        'Original conceptual puzzle: outlines, clue positions and movement are not a palaeomap, sampling sites or measured drift. Corresponding fossils of similar geological age offer another evidence type. Modern coasts do not fit perfectly; this shows only part of Pangaea’s relationships.',
      )}
    >
      <rect x="20" y="15" width="600" height="345" rx="18" fill="#e1ecec" />
      <g transform={`translate(${-shift / 2} 0)`}>
        <path
          d="M170 55 L280 70 L300 110 L280 140 L290 180 L255 230 L240 280 L210 320 L192 260 L175 210 L140 165 L135 95Z"
          fill="#9cbaaa"
          stroke="#315f69"
          strokeWidth="2"
        />
        <text x="170" y="40">
          {words(mode, '南美洲', 'South America')}
        </text>
        <path d="M258 143 l-12 20 h24Z" fill="#8d5e45" />
        <path d="M250 218 l-12 20 h24Z" fill="#8d5e45" />
      </g>
      <g transform={`translate(${shift / 2} 0)`}>
        <path
          d="M300 70 L405 55 L470 90 L480 155 L430 180 L405 265 L370 290 L340 230 L330 180 L315 140 L328 110Z"
          fill="#c5b391"
          stroke="#315f69"
          strokeWidth="2"
        />
        <text x="365" y="40">
          {words(mode, '非洲', 'Africa')}
        </text>
        <path d="M345 143 l-12 20 h24Z" fill="#8d5e45" />
        <path d="M355 218 l-12 20 h24Z" fill="#8d5e45" />
      </g>
      <text x="35" y="345" fontSize="17">
        {words(
          mode,
          '▲ 相应化石线索（示意） · 间距',
          '▲ Corresponding fossil clues (schematic) · gap',
        )}{' '}
        {gap}
      </text>
    </Figure>
  );
}
export function BoundaryDiagram({
  mode,
  type,
  frame,
}: {
  mode: LanguageMode;
  type: BoundaryType;
  frame: number;
}) {
  const p = boundaryOffsets(type, frame);
  return (
    <Figure
      mode={mode}
      zh="两个板块的相对运动，分离、汇聚或沿边界错动"
      en="Two plates move apart, together or past each other along a boundary"
      caption={t(
        '从上方看的原创运动模型；箭头表示相对运动。相同帧号不表示相同时间或速度，汇聚图不模拟板块挤入彼此，实际可俯冲或碰撞。',
        'Original plan-view motion model; arrows show relative movement. Frame numbers have no time/speed meaning. The convergence view does not simulate interpenetration: real plates can subduct or collide.',
      )}
    >
      <rect x="25" y="25" width="590" height="330" rx="20" fill="#f0ece1" />
      <path
        d="M320 50 V335"
        stroke="#5f7d75"
        strokeDasharray="6 5"
        strokeWidth="3"
      />
      <g transform={`translate(${p.leftX} ${p.leftY})`}>
        <rect x="130" y="110" width="130" height="170" rx="10" fill="#9cbaaa" />
        <text x="145" y="158">
          A
        </text>
        <text x="180" y="225" fontSize="48">
          {type === 'transform' ? '↑' : type === 'divergent' ? '←' : '→'}
        </text>
      </g>
      <g transform={`translate(${p.rightX} ${p.rightY})`}>
        <rect x="380" y="110" width="130" height="170" rx="10" fill="#c5b391" />
        <text x="395" y="158">
          B
        </text>
        <text x="425" y="225" fontSize="48">
          {type === 'transform' ? '↓' : type === 'divergent' ? '→' : '←'}
        </text>
      </g>
      <text x="35" y="380">
        {words(mode, '观察帧', 'Observation frame')} {frame} / 4 ·{' '}
        {words(mode, '非时间刻度', 'No time scale')}
      </text>
    </Figure>
  );
}
export function FaultDiagram({
  mode,
  frame = 0,
  locations = false,
}: {
  mode: LanguageMode;
  frame?: number;
  locations?: boolean;
}) {
  const bend = frame < 3 ? frame * 14 : 0,
    slip = frame >= 3 ? 32 : 0;
  return (
    <Figure
      mode={mode}
      zh={
        locations
          ? '倾斜断层地下A为震源，正上方B为震中，C在地表断层交点'
          : '断层从锁住到形变、突然滑动与波传播的过程模型'
      }
      en={
        locations
          ? 'A is the underground focus, B the epicentre vertically above it, C the surface fault intersection'
          : 'Model fault from locking through deformation, sudden slip and wave propagation'
      }
      caption={t(
        '原创剖面，无深度、应力或时间比例；课堂帧号不是地震倒计时。震中位于震源正上方，不一定在断层地表交点或破坏最重的地方。',
        'Original section without depth, stress or time scale; frames are not an earthquake countdown. The epicentre lies vertically above the focus, not necessarily at a fault’s surface intersection or the worst damage.',
      )}
    >
      <rect x="35" y="85" width="570" height="260" fill="#e0d3b9" />
      <path d="M35 85 H605" stroke="#526c62" strokeWidth="4" />
      <path d="M210 85 L430 345" stroke="#315f69" strokeWidth="5" />
      {[125, 175, 225].map((y) => (
        <g key={y}>
          <path
            d={`M50 ${y} Q175 ${y} ${210 + ((y - 85) * 220) / 260} ${y + bend}`}
            fill="none"
            stroke="#8d8266"
            strokeWidth="3"
          />
          <path
            d={`M${210 + ((y - 85) * 220) / 260} ${y + bend + slip} Q480 ${y + slip} 590 ${y + slip}`}
            fill="none"
            stroke="#8d8266"
            strokeWidth="3"
          />
        </g>
      ))}
      {(frame >= 3 || locations) && (
        <circle cx="320" cy="215" r="9" fill="#a25338" />
      )}
      {frame === 4 &&
        [30, 65, 100].map((r) => (
          <circle
            key={r}
            cx="320"
            cy="215"
            r={r}
            fill="none"
            stroke="#a25338"
            strokeWidth="2"
            strokeDasharray="8 5"
          />
        ))}
      {locations ? (
        <>
          <path d="M320 215 V85" stroke="#315f69" strokeDasharray="5 5" />
          <text x="336" y="220">
            A
          </text>
          <circle cx="320" cy="85" r="8" fill="#315f69" />
          <text x="328" y="65">
            B
          </text>
          <circle cx="210" cy="85" r="8" fill="#8d8266" />
          <text x="190" y="65">
            C
          </text>
        </>
      ) : (
        <text x="40" y="50">
          {words(mode, faultFrames[frame]![0], faultFrames[frame]![1])}
        </text>
      )}
    </Figure>
  );
}
export function EvidenceWorldMap({
  mode,
  volcanoes = false,
}: {
  mode: LanguageMode;
  volcanoes?: boolean;
}) {
  const mapAlt = volcanoes
    ? t(
        '世界底图上的三个火山环境案例位置',
        'Three volcanic-setting case locations on a world base',
      )
    : t(
        '2020年USGS全球震级至少6的地震震中分布，点不表示灾害大小',
        'USGS 2020 global earthquakes of magnitude at least 6; dots do not encode damage',
      );
  return (
    <figure className="geo-skill-figure">
      <div
        className="geo-model-scroll"
        tabIndex={0}
        role="region"
        aria-label={words(
          mode,
          '可左右滚动的地理图示',
          'Geography diagram, scroll horizontally',
        )}
      >
        <svg
          viewBox="0 0 900 450"
          role="img"
          aria-label={
            mode === 'bilingual'
              ? `${mapAlt.zh} / ${mapAlt.en}`
              : words(mode, mapAlt.zh, mapAlt.en)
          }
        >
          <rect width="900" height="450" fill="#e3eeee" />
          <path
            d={mapData.world}
            fill="#a9bdb0"
            stroke="#edf1e6"
            strokeWidth="0.7"
          />
          <path d="M0 225 H900" stroke="#728f87" strokeDasharray="5 5" />
          {volcanoes
            ? volcanoCases.map((p, i) => {
                const q = worldPoint(p.lon, p.lat, 0);
                return (
                  <g key={p.id}>
                    <path
                      d={`M${q.x} ${q.y - 11} l-11 20 h22Z`}
                      fill="#8d5e45"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <text x={q.x + 15} y={q.y + 5} fontSize="24" fill="#273f39">
                      {i + 1}
                    </text>
                  </g>
                );
              })
            : earthquakeData.events.map((p) => {
                const q = worldPoint(p.lon, p.lat, 0);
                return (
                  <circle
                    key={p.id}
                    cx={q.x}
                    cy={q.y}
                    r="4"
                    fill="#954d36"
                    stroke="#fff"
                    strokeWidth="0.8"
                  />
                );
              })}
          <text x="15" y="30" fontSize="20">
            N ↑ ·{' '}
            {volcanoes
              ? '1 Ruapehu · 2 Mid-Atlantic Ridge · 3 Hawaiʻi'
              : `2020 · M ≥ 6 · ${earthquakeData.events.length} events`}
          </text>
        </svg>
      </div>
      <p className="geo-model-swipe">
        {words(
          mode,
          '窄屏可左右滑动图示；键盘聚焦图示后使用方向键。',
          'Swipe diagrams sideways on narrow screens; focus and use arrow keys with a keyboard.',
        )}
      </p>
      <figcaption>
        <Text
          mode={mode}
          text={
            volcanoes
              ? t(
                  'Natural Earth v5.1.2矩形底图；▲为附近案例位置，标记不画火山带或板块边界。中脊点代表一段，不是特定火山测站。图号与下方案例对应，没有统一全球距离尺。',
                  'Natural Earth v5.1.2 rectangular base; triangles mark approximate cases, not belts or boundaries. The ridge point represents a segment, not a monitoring station. Numbers match the cases below; no uniform global distance scale.',
                )
              : t(
                  `USGS目录2020年UTC起震时间、首选震级≥6，共${earthquakeData.events.length}条；${earthquakeData.retrievedOn}下载。圆点表示震中，大小相同，不编码震级、深度或后果。只选一年大震，不是全部地震、长期风险或预报。底图Natural Earth v5.1.2；矩形投影失真，无统一距离尺。`,
                  `USGS preferred magnitudes ≥6, origin times in calendar 2020 UTC: ${earthquakeData.events.length} events, retrieved ${earthquakeData.retrievedOn}. Equal-sized circles mark epicentres, not magnitude, depth or consequences. One year of larger events is not all earthquakes, long-term risk or a forecast. Natural Earth v5.1.2; rectangular projection distorts area/distance.`,
                )
          }
        />
      </figcaption>
      {!volcanoes && (
        <details>
          <summary>
            {words(
              mode,
              '图上数据的文字替代（可选调查）',
              'Map records as text (optional investigation)',
            )}
          </summary>
          <p>
            <Text
              mode={mode}
              text={t(
                '地图许多点分布于太平洋周边，但这里只筛选2020年大震。下表保留全部121条记录，可用键盘阅读时间与坐标，不能据此判断个人风险或下一次时间。',
                'Many dots lie around the Pacific, but this is only a selection of larger 2020 events. All 121 records below provide keyboard-readable times/coordinates, not personal risk or a next-event prediction.',
              )}
            />
          </p>
          <div
            className="geo-model-scroll"
            tabIndex={0}
            role="region"
            aria-label={words(
              mode,
              '可左右滚动的地震记录表',
              'Earthquake records, scroll horizontally',
            )}
          >
            <table className="geo-data-table">
              <caption>USGS · 2020 UTC · M ≥ 6</caption>
              <thead>
                <tr>
                  {[
                    t('UTC起震时间', 'Origin time (UTC)'),
                    t('经度°', 'Longitude°'),
                    t('纬度°', 'Latitude°'),
                    t('震级/类型', 'Magnitude/type'),
                    t('深度km', 'Depth km'),
                  ].map((h) => (
                    <th scope="col" key={h.en}>
                      <Text mode={mode} text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {earthquakeData.events.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {new Date(p.time)
                        .toISOString()
                        .slice(0, 19)
                        .replace('T', ' ')}
                    </td>
                    <td>{p.lon.toFixed(2)}</td>
                    <td>{p.lat.toFixed(2)}</td>
                    <td>
                      {p.magnitude} / {p.magnitudeType}
                    </td>
                    <td>{p.depthKm.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </figure>
  );
}
export function VolcanoSection({
  mode,
  setting,
  frame,
}: {
  mode: LanguageMode;
  setting: string;
  frame: number;
}) {
  const info = volcanoCases.find((p) => p.setting === setting)!;
  return (
    <Figure
      mode={mode}
      zh="火山成因剖面：地下局部产生岩浆，岩浆上升，地表熔岩或火山灰累积"
      en="Volcanic-setting section: partial melting, rising magma and surface accumulation"
      caption={t(
        '原创成因模型：尺寸和过程帧无比例。岩浆库简化成一个椭圆；真实系统可有多个储存区与裂隙，岩浆未必喷出。热点柱是常用假说示意，不保证每个热点都源自地核边界。',
        'Original process model without size/time scale. One ellipse simplifies magma storage; real systems have multiple reservoirs and cracks, and magma may never erupt. The hotspot column depicts a common hypothesis, not proof that every hotspot starts at the core boundary.',
      )}
    >
      <rect x="35" y="150" width="570" height="200" fill="#d5b486" />
      {setting === 'subduction' ? (
        <>
          <path
            d="M35 165 H220 L440 330 L415 350 L210 205 H35Z"
            fill="#738f88"
          />
          <path d="M245 150 H605 V198 H312Z" fill="#9cbaaa" />
          <text x="40" y="140">
            →
          </text>
          <text x="540" y="140">
            ←
          </text>
          <path
            d="M342 278 Q330 243 370 235"
            fill="none"
            stroke="#487b98"
            strokeWidth="4"
            strokeDasharray="6 4"
          />
          <text x="390" y="288" fontSize="17">
            {words(mode, '流体 ↑', 'Fluids ↑')}
          </text>
        </>
      ) : setting === 'rift' ? (
        <>
          <rect x="35" y="150" width="250" height="45" fill="#9cbaaa" />
          <rect x="350" y="150" width="255" height="45" fill="#9cbaaa" />
          <text x="135" y="130" fontSize="36">
            ←
          </text>
          <text x="465" y="130" fontSize="36">
            →
          </text>
          <text x="60" y="310" fontSize="18">
            {words(mode, '上升 → 压力降低', 'Upwelling → pressure falls')}
          </text>
        </>
      ) : (
        <>
          <rect x="35" y="150" width="570" height="45" fill="#9cbaaa" />
          <path d="M335 345 V250" stroke="#bb7646" strokeWidth="35" />
          <path
            d="M90 150 L125 120 L160 150 M190 150 L225 106 L260 150"
            fill="#9cbaaa"
            stroke="#738f88"
          />
          <text x="60" y="60" fontSize="20">
            ←{' '}
            {words(
              mode,
              '板块移动，留下旧火山',
              'Plate moves, older volcanoes remain',
            )}
          </text>
        </>
      )}
      <ellipse
        cx={setting === 'subduction' ? 385 : 335}
        cy="240"
        rx="28"
        ry="16"
        fill="#b86742"
      />
      <text x="420" y="244" fontSize="17">
        {words(mode, '局部岩浆', 'Local magma')}
      </text>
      {frame >= 1 && (
        <path
          d={
            setting === 'subduction'
              ? 'M385 240 Q410 185 390 145'
              : 'M335 240 V150'
          }
          stroke="#ad5738"
          strokeWidth="9"
          fill="none"
        />
      )}
      {frame >= 2 && (
        <path
          d={
            setting === 'subduction'
              ? 'M343 150 L390 90 L437 150Z'
              : 'M288 150 L335 90 L382 150Z'
          }
          fill="#b58f6b"
          stroke="#ad5738"
          strokeWidth="4"
        />
      )}
      <text x="45" y="375" fontSize="17">
        {words(
          mode,
          info.detailZh.slice(
            0,
            info.detailZh.indexOf('；') > 0 ? info.detailZh.indexOf('；') : 28,
          ),
          setting === 'subduction'
            ? 'Fluids help partial melting'
            : setting === 'rift'
              ? 'Reduced pressure helps melting'
              : 'Hotspot magma source',
        )}
      </text>
    </Figure>
  );
}
