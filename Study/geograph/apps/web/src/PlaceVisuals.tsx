import type { LanguageMode } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';
import nz from '../../../content/nz-overview-data.json';
import { nzFeatures, nzPoint } from './placeModels';
import { atlasSvg, type AtlasDraft } from './atlasModel';
export function NZOverview({
  mode,
  reveal = false,
  selected = '',
}: {
  mode: LanguageMode;
  reveal?: boolean;
  selected?: string;
}) {
  const points = (coords: number[][]) =>
    coords
      .map(([lon, lat], i) => {
        const p = nzPoint(lon!, lat!);
        return `${i ? 'L' : 'M'}${p.x},${p.y}`;
      })
      .join('');
  return (
    <figure className="geo-skill-figure">
      <svg
        className="geo-nz-overview"
        viewBox="0 0 640 740"
        role="img"
        aria-label={words(
          mode,
          '北向上的新西兰主岛教学图，A至G代表城市、山脉、火山与河段；山河为概略示意。',
          'North-up teaching map of New Zealand’s main islands; A–G locate cities, a range, volcano and river regions. Mountain and river overlays are approximate.',
        )}
      >
        <rect width="640" height="740" rx="12" fill="#dcebed" />
        <path d={nz.coast} fill="#cbd4b1" stroke="#7f9381" strokeWidth="1.5" />
        <path
          d={points([
            [172, -42.2],
            [171, -42.8],
            [170.5, -43.3],
            [169.5, -44.7],
          ])}
          fill="none"
          stroke="#9a7f5d"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={points([
            [176.08, -38.68],
            [176.04, -38.39],
            [175.28, -37.78],
            [174.72, -37.39],
          ])}
          fill="none"
          stroke="#4f849e"
          strokeWidth="5"
        />
        <path
          d={points([
            [169.14, -44.69],
            [169.2, -45.05],
            [169.39, -45.25],
            [169.74, -46.23],
            [169.76, -46.37],
          ])}
          fill="none"
          stroke="#4f849e"
          strokeWidth="5"
        />
        <text x="65" y="158" fontSize="19" fill="#496d7b">
          Tasman Sea
        </text>
        <text x="403" y="570" fontSize="19" fill="#496d7b">
          Pacific Ocean
        </text>
        <text x="400" y="135" fontSize="20">
          {words(mode, '北岛', 'North Island')}
        </text>
        <text x="72" y="512" fontSize="20">
          {words(mode, '南岛', 'South Island')}
        </text>
        {nzFeatures.map((p) => {
          const q = nzPoint(p.lon, p.lat);
          return (
            <g key={p.id}>
              <circle
                cx={q.x}
                cy={q.y}
                r={selected === p.id ? 10 : 5}
                fill={
                  p.kind === 'river'
                    ? '#4f849e'
                    : p.kind === 'city'
                      ? '#315f69'
                      : '#9a7f5d'
                }
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x={q.x + (p.id === 'alps' ? -25 : 12)}
                y={q.y + 6}
                fontSize="21"
                fill="#244951"
                fontWeight="700"
              >
                {p.letter}
              </text>
            </g>
          );
        })}
        <path
          d="M555 100V42M546 55L555 42L564 55"
          stroke="#315f69"
          fill="none"
          strokeWidth="3"
        />
        <text x="548" y="30" fontSize="20">
          N
        </text>
        <path
          d="M55 663H136M55 657V669M136 657V669"
          stroke="#315f69"
          strokeWidth="3"
        />
        <text x="55" y="691" fontSize="17">
          ≈200 km @41°S
        </text>
        <text x="45" y="724" fontSize="16">
          {words(
            mode,
            '教学示意：主岛范围，非导航图',
            'Teaching overview: main islands, not navigation',
          )}
        </text>
      </svg>
      <div
        className="geo-choices"
        aria-label={words(
          mode,
          '新西兰教学地图图例',
          'New Zealand teaching map legend',
        )}
      >
        {[
          ['#315f69', '城市', 'City'],
          ['#9a7f5d', '山地／火山', 'Range / volcano'],
          ['#4f849e', '河流', 'River'],
        ].map(([color, zh, en]) => (
          <span
            className="geo-badge"
            key={color}
            style={{ borderLeft: `12px solid ${color}` }}
          >
            <Text mode={mode} text={t(zh!, en!)} />
          </span>
        ))}
      </div>
      {reveal && (
        <ol className="geo-location-list">
          {nzFeatures.map((p) => (
            <li key={p.id}>
              {p.letter} · <Text mode={mode} text={t(p.zh, p.en)} />
            </li>
          ))}
        </ol>
      )}
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '海岸来自Natural Earth v5.1.2；局地等距圆柱近似，以41°S校正东西比例。约200公里线段尺只用于这一地区。山脉、河流为概略线，A–G点表示附近区域，未展示全部离岛。真实高程另见NASA图，不把本图绿色当海拔。',
            'Coast: Natural Earth v5.1.2; local equirectangular approximation using 41°S for east–west scale. The approximate 200 km bar applies only here. Ranges/rivers are schematic and A–G are regional points; not all offshore islands appear. NASA’s separate elevation map provides real relief; green here does not encode height.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function AtlasPreview({
  mode,
  draft,
}: {
  mode: LanguageMode;
  draft: AtlasDraft;
}) {
  return (
    <figure className="geo-skill-figure">
      <div
        className="geo-atlas-scroll"
        dangerouslySetInnerHTML={{ __html: atlasSvg(draft) }}
      />
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '你的地图预览。洲洋采用本课常用七洲、五洋约定，标注点不画完整区域边界。标记只选大致地区；北向上，赤道为虚线。世界矩形投影改变形状与面积，没有统一全球距离尺。',
            'Your atlas preview uses this course’s seven-continent/five-ocean convention; label points do not draw complete regional borders. The marker selects only a coarse region. North is up and the equator dashed. The rectangular projection distorts shape/area and supplies no uniform global distance ruler.',
          )}
        />
      </figcaption>
    </figure>
  );
}
