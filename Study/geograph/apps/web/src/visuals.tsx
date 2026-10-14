import { useId } from 'react';
import type { LanguageMode } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';
import mapData from '../../../content/map-data.json';
import {
  rotatePoint,
  routePoints,
  worldPoint,
  worldTargets,
  worldClues,
} from './models';

export function WorldMap({
  mode,
  centre = 0,
  reveal = false,
  matches = {},
  onPick,
}: {
  mode: LanguageMode;
  centre?: number;
  reveal?: boolean;
  matches?: Record<string, string>;
  onPick?: (id: string, label?: string) => void;
}) {
  const clip = useId().replaceAll(':', '');
  return (
    <figure className="geo-map-figure">
      <div className="geo-map-scroll">
        <div className="geo-world">
          <svg
            viewBox="0 0 900 450"
            role="img"
            aria-label={words(
              mode,
              '世界陆海地图：等距圆柱投影，蓝色海洋，绿色陆地；赤道为虚线。编号标出洲洋代表位置。',
              'Equirectangular world map: blue ocean, green land; dashed equator; numbered continent and ocean locations.',
            )}
          >
            <defs>
              <clipPath id={clip}>
                <rect width="900" height="450" rx="12" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clip})`}>
              <rect width="900" height="450" fill="#dcebed" />
              {[-900, 0, 900].map((offset) => (
                <path
                  key={offset}
                  d={mapData.world}
                  transform={`translate(${offset - centre * 2.5} 0)`}
                  fill="#cbd4b1"
                  stroke="#7f9381"
                  strokeWidth=".7"
                />
              ))}
              {[75, 150, 225, 300, 375].map((y) => (
                <path
                  key={y}
                  d={`M0 ${y}H900`}
                  stroke="#afc6c6"
                  strokeDasharray={y === 225 ? '6 4' : '2 5'}
                  strokeWidth={y === 225 ? 1.5 : 1}
                />
              ))}
              {[150, 300, 450, 600, 750].map((x) => (
                <path
                  key={x}
                  d={`M${x} 0V450`}
                  stroke="#b5cccc"
                  strokeDasharray="2 5"
                />
              ))}
              <text x="10" y="219" fontSize="13" fill="#59757b">
                {words(mode, '赤道 0°', 'Equator 0°')}
              </text>
              <text x="878" y="22" fontSize="14" fill="#315f69">
                N ↑
              </text>
            </g>
          </svg>
          {worldTargets.map((target, i) => {
            const p = worldPoint(target.lon, target.lat, centre),
              done = matches[target.id] === target.id;
            return (
              <button
                key={target.id}
                className={`geo-map-pin ${target.kind} ${done ? 'done' : ''}`}
                style={{ left: `${p.x / 9}%`, top: `${p.y / 4.5}%` }}
                aria-label={
                  reveal
                    ? words(mode, target.name.zh, target.name.en)
                    : `${words(mode, '地图位置', 'Map position')} ${i + 1}. ${words(mode, worldClues[target.id]!.zh, worldClues[target.id]!.en)}${done ? ' ✓' : ''}`
                }
                disabled={!onPick}
                onClick={() => onPick?.(target.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onPick?.(target.id, e.dataTransfer.getData('text/plain'));
                }}
              >
                <span>
                  {reveal
                    ? words(mode, target.name.zh, target.name.en)
                    : done
                      ? '✓'
                      : i + 1}
                </span>
              </button>
            );
          })}
          {(() => {
            const p = worldPoint(173, -41, centre);
            return (
              <span
                className="geo-nz-pin"
                style={{ left: `${p.x / 9}%`, top: `${p.y / 4.5}%` }}
              >
                ● <span>{words(mode, '新西兰', 'NZ')}</span>
              </span>
            );
          })()}
        </div>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '蓝色：海洋 · 绿色：陆地。等距圆柱投影，位置网格为参考；不保面积，不显示国界或洲界。洲洋编号代表位置，不表示完整边界。',
            'Blue: ocean · Green: land. Equirectangular projection; reference grid. Areas are distorted; no country or continent boundaries. Markers represent locations, not region boundaries.',
          )}
        />
        <small>
          Made with Natural Earth v5.1.2 ·{' '}
          {words(
            mode,
            '1:110m 简化底图；无实测距离尺',
            '1:110m generalised base; no measured distance scale',
          )}
        </small>
      </figcaption>
    </figure>
  );
}
const towns = [
  ['Christchurch', '基督城', 172.64, -43.53],
  ['Dunedin', '但尼丁', 170.5, -45.87],
  ['Queenstown', '皇后镇', 168.66, -45.03],
  ['Greymouth', '格雷茅斯', 171.21, -42.45],
  ['Nelson', '尼尔森', 173.28, -41.28],
] as const;
const nzPoint = (lon: number, lat: number) => ({
  x: (lon - 165) * 42,
  y: (-39 - lat) * 58,
});
export function NZMap({
  mode,
  layer,
}: {
  mode: LanguageMode;
  layer: 'roads' | 'terrain';
}) {
  const clip = useId().replaceAll(':', '');
  const mountains = [
    [172.6, -41.9],
    [171.5, -42.6],
    [170.5, -43.3],
    [169.5, -44],
    [168.5, -44.8],
    [167.5, -45.7],
  ].map(([x, y]) => nzPoint(x!, y!));
  return (
    <figure className="geo-map-figure">
      <svg
        className="geo-nz-map"
        viewBox="0 0 470 540"
        role="img"
        aria-label={words(
          mode,
          layer === 'roads'
            ? '新西兰南岛主要城镇和连接通道教学示意图；连线不是真实道路路线'
            : '新西兰南岛山地和平原教学示意图；山地区域简化，无实测高程',
          layer === 'roads'
            ? 'South Island towns and schematic connections, not actual road routes'
            : 'South Island schematic mountains and plains, without measured elevations',
        )}
      >
        <defs>
          <clipPath id={clip}>
            <path d={mapData.nz} />
          </clipPath>
        </defs>
        <rect width="470" height="540" rx="14" fill="#e0eced" />
        <path d={mapData.nz} fill="#d1dabd" stroke="#879987" strokeWidth="1" />
        {layer === 'terrain' && (
          <g clipPath={`url(#${clip})`}>
            <path
              d={`M${mountains.map((p) => `${p.x},${p.y}`).join('L')}`}
              stroke="#b8a077"
              strokeWidth="50"
              strokeLinecap="round"
            />
            <path
              d={`M${mountains.map((p) => `${p.x},${p.y}`).join('L')}`}
              stroke="#8d775e"
              strokeWidth="12"
              strokeDasharray="5 5"
            />
          </g>
        )}
        {layer === 'roads' && (
          <g fill="none" stroke="#b1814d" strokeWidth="4">
            <path
              d={`M${towns
                .map(([, , lon, lat]) => {
                  const p = nzPoint(lon, lat);
                  return `${p.x},${p.y}`;
                })
                .join('L')}`}
            />
            <path d="M270 287L285 185L348 132" />
          </g>
        )}
        {towns.map(([en, zh, lon, lat]) => {
          const p = nzPoint(lon, lat);
          return (
            <g key={en}>
              <circle cx={p.x} cy={p.y} r="5" fill="#315f69" />
              <text x={p.x + 9} y={p.y + 5} fontSize="13" fill="#244b52">
                {words(mode, zh, en)}
              </text>
            </g>
          );
        })}
        <text x="400" y="45" fill="#315f69" fontSize="18">
          N ↑
        </text>
        <text x="18" y="505" fill="#6d8489" fontSize="15">
          {words(mode, '塔斯曼海', 'Tasman Sea')}
        </text>
        <text x="350" y="430" fill="#6d8489" fontSize="15">
          {words(mode, '太平洋', 'Pacific')}
        </text>
      </svg>
      <figcaption>
        <Text
          mode={mode}
          text={
            layer === 'roads'
              ? t(
                  '图例：● 城镇；棕线：简化连接通道，不表示实际公路路线。',
                  'Legend: ● town; brown line: simplified connection, not an actual road alignment.',
                )
              : t(
                  '图例：棕色带：简化山地；浅绿：其他陆地，包括东侧平原。不表示植被或实测海拔。',
                  'Legend: brown band: simplified mountain region; pale green: other land including eastern plains, not measured vegetation or elevation.',
                )
          }
        />
        <small>
          {words(
            mode,
            '教学示意图 · 北向上 · 海岸：Natural Earth v5.1.2 · 无实测距离尺，不供导航',
            'Teaching schematic · north-up · Coast: Natural Earth v5.1.2 · no measured distance scale; not for navigation',
          )}
        </small>
      </figcaption>
    </figure>
  );
}
export function RouteMap({
  mode,
  rotation = 0,
  route = ['school'],
  onPick,
}: {
  mode: LanguageMode;
  rotation?: number;
  route?: string[];
  onPick?: (id: string) => void;
}) {
  const routeLine = route
    .map((id) => routePoints.find((p) => p.id === id))
    .filter((p): p is (typeof routePoints)[number] => !!p)
    .map((p) => `${p.x},${p.y}`)
    .join(' ');
  return (
    <figure className="geo-map-figure">
      <div className="geo-route">
        <svg
          viewBox="0 0 500 500"
          role="img"
          aria-label={words(
            mode,
            '虚构社区：图书馆在学校北面，河流横在两者之间，桥在学校东面；浅棕线为通道',
            'Fictional community: library north of school, river between them, bridge east of school; pale brown lines are paths',
          )}
        >
          <rect width="500" height="500" rx="15" fill="#eef0e2" />
          <g transform={`rotate(${rotation} 250 250)`}>
            {[100, 200, 300, 400].map((x) => (
              <path
                key={x}
                d={`M${x} 20V480M20 ${x}H480`}
                stroke="#dce1cd"
                strokeDasharray="3 5"
              />
            ))}
            <path
              d="M0 245Q150 220 250 250T500 255"
              stroke="#b5d6df"
              strokeWidth="40"
              fill="none"
            />
            <path
              d="M100 450V350H300V150H100"
              stroke="#c7b494"
              strokeWidth="13"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M287 223V278M313 223V278"
              stroke="#697f80"
              strokeWidth="4"
            />
            <polyline
              points={routeLine}
              fill="none"
              stroke="#315f69"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M400 115V50m-10 16 10-16 10 16"
              fill="none"
              stroke="#315f69"
              strokeWidth="4"
            />
            <text x="395" y="38" fill="#315f69" fontSize="21">
              N
            </text>
          </g>
        </svg>
        {routePoints.map((p) => {
          const r = rotatePoint(p.x, p.y, rotation);
          return (
            <button
              key={p.id}
              className={`geo-route-stop ${route.at(-1) === p.id ? 'current' : ''}`}
              style={{ left: `${r.x / 5}%`, top: `${r.y / 5}%` }}
              onClick={() => onPick?.(p.id)}
              disabled={!onPick}
              aria-label={words(mode, p.zh, p.en)}
            >
              <span>
                {p.id === 'school'
                  ? 'S'
                  : p.id === 'library'
                    ? 'L'
                    : p.id === 'bridge'
                      ? '↔'
                      : '●'}
              </span>
              <small>{words(mode, p.zh, p.en)}</small>
            </button>
          );
        })}
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '虚构社区示意图 · N 表示真北 · S 学校／L 图书馆 · 蓝带：河流；浅棕线：通道；深青线：你走过的路线。无实测比例。',
            'Fictional community · N: true north · S: school / L: library · Blue: river; pale brown: paths; teal: your route. No measured scale.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function ConceptDiagram({
  kind,
  mode,
}: {
  kind: 'surface' | 'section' | 'oceans' | 'legend' | 'north';
  mode: LanguageMode;
}) {
  const label = (z: string, e: string) => words(mode, z, e);
  return (
    <figure className="geo-concept">
      <svg
        viewBox="0 0 440 230"
        role="img"
        aria-label={label(
          kind === 'surface'
            ? '100格模型：71格海洋、29格陆地'
            : kind === 'section'
              ? '地表剖面：陆地、海洋和云，厚度不按比例'
              : kind === 'oceans'
                ? '五大洋是相连的海洋区域，名称不代表围墙'
                : kind === 'legend'
                  ? '同一种地图颜色可以编码不同信息，读图例后判断'
                  : '真北与磁北示意图，两支箭头的差别不表示当地磁偏角',
          kind === 'surface'
            ? '100-square model: 71 ocean, 29 land'
            : kind === 'section'
              ? 'Surface section: land, ocean and cloud; thickness not to scale'
              : kind === 'oceans'
                ? 'Five named regions of one connected ocean'
                : kind === 'legend'
                  ? 'Map colours can encode different information; read the legend'
                  : 'True and magnetic north schematic; angle is not a local measurement',
        )}
      >
        {kind === 'surface' ? (
          <>
            {Array.from({ length: 100 }, (_, i) => (
              <rect
                key={i}
                x={22 + (i % 10) * 18}
                y={22 + Math.floor(i / 10) * 18}
                width="14"
                height="14"
                rx="2"
                fill={i < 71 ? '#6b9cae' : '#c4ca9e'}
              />
            ))}
            <text x="235" y="83" fontSize="28" fill="#315f69">
              71 / 100
            </text>
            <text x="235" y="110" fontSize="16" fill="#617a80">
              {label('海洋表面积', 'Ocean surface')}
            </text>
            <text x="235" y="153" fontSize="25" fill="#707d43">
              29 / 100
            </text>
            <text x="235" y="180" fontSize="16" fill="#617a80">
              {label('陆地表面积', 'Land surface')}
            </text>
          </>
        ) : kind === 'section' ? (
          <>
            <rect
              x="20"
              y="125"
              width="400"
              height="75"
              rx="10"
              fill="#d0be9c"
            />
            <path
              d="M20 125L85 70L150 125H420V162H170L110 130Z"
              fill="#8c9e74"
            />
            <path d="M150 125H420V162H170Z" fill="#89b8cc" />
            <path
              d="M230 66Q230 42 255 46Q275 19 299 49Q331 42 332 68Z"
              fill="#fff"
              stroke="#a8c3c8"
            />
            <text x="46" y="53" fill="#61754e" fontSize="17">
              {label('陆地', 'Land')}
            </text>
            <text x="320" y="116" fill="#315f69" fontSize="17">
              {label('海洋', 'Ocean')}
            </text>
            <text x="255" y="94" fill="#617a80" fontSize="16">
              {label('云', 'Cloud')}
            </text>
          </>
        ) : kind === 'oceans' ? (
          <>
            <rect
              x="20"
              y="20"
              width="400"
              height="185"
              rx="45"
              fill="#d6e7ec"
            />
            {[
              ['太平洋', 'Pacific', 100, 82],
              ['大西洋', 'Atlantic', 320, 82],
              ['印度洋', 'Indian', 210, 128],
              ['北冰洋', 'Arctic', 210, 46],
              ['南大洋', 'Southern', 210, 180],
            ].map(([z, e, x, y]) => (
              <text
                key={z}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="18"
                fill="#315f69"
              >
                {label(z as string, e as string)}
              </text>
            ))}
            <path
              d="M80 110Q210 230 360 110"
              stroke="#70a1b3"
              strokeWidth="4"
              fill="none"
              strokeDasharray="6 5"
            />
          </>
        ) : kind === 'legend' ? (
          <>
            {[
              [35, '#95ac75', '植被／森林', 'Vegetation / forest'],
              [99, '#95ac75', '人口密度', 'Population density'],
              [163, '#b7956c', '教学山地区域', 'Schematic mountains'],
            ].map(([y, c, z, e]) => (
              <g key={y}>
                <rect
                  x="35"
                  y={y}
                  width="40"
                  height="35"
                  rx="5"
                  fill={c as string}
                />
                <text x="95" y={Number(y) + 25} fill="#315f69" fontSize="18">
                  {label(z as string, e as string)}
                </text>
              </g>
            ))}
          </>
        ) : (
          <>
            <circle cx="150" cy="126" r="73" fill="#e5ebe2" stroke="#b4c2b5" />
            <path
              d="M150 184V38m-10 15 10-15 10 15"
              stroke="#315f69"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M150 184L188 62m-13 10 13-10 5 17"
              stroke="#b1814d"
              strokeWidth="4"
              fill="none"
            />
            <text x="112" y="26" fontSize="16" fill="#315f69">
              {label('真北', 'True N')}
            </text>
            <text x="200" y="65" fontSize="16" fill="#a27a46">
              {label('磁北', 'Magnetic N')}
            </text>
            <text x="245" y="136" fontSize="15" fill="#617a80">
              {label('差异随地点', 'Varies with place')}
            </text>
            <text x="245" y="163" fontSize="15" fill="#617a80">
              {label('和时间变化', 'and time')}
            </text>
          </>
        )}
      </svg>
      <figcaption>
        {label(
          '教学示意图；不按真实形状、厚度或角度比例绘制。',
          'Teaching schematic; shapes, thicknesses and angles are not to scale.',
        )}
      </figcaption>
    </figure>
  );
}
