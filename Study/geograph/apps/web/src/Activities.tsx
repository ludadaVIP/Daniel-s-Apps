import { climateLessonIds, climateFinished } from './climateModels';
import { ClimateExplorer } from './ClimateActivities';
import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { assets, t, words } from './content';
import type { ActivityState } from './progress';
import { Text, AssetImage } from './ui';
import { ConceptDiagram, NZMap, RouteMap, WorldMap } from './visuals';
import { routeFinished, routeMove, worldTargets, worldClues } from './models';
import { skillFinished } from './skillModels';
import { SkillExplorer } from './SkillActivities';
import { TerrainExplorer } from './TerrainActivities';
import { terrainFinished, terrainLessonIds } from './terrainModels';
import { placeFinished, placeLessonIds } from './placeModels';
import { PlaceExplorer } from './PlaceActivities';
import { atlasFinished } from './atlasModel';
import { geologyFinished, geologyLessonIds } from './geologyModels';
import { GeologyExplorer } from './GeologyActivities';
import { landscapeFinished, landscapeLessonIds } from './landscapeModels';
import { LandscapeExplorer } from './LandscapeActivities';
import {
  earthSurfaceFinished,
  earthSurfaceLessonIds,
} from './earthSurfaceModels';
import { EarthSurfaceExplorer } from './EarthSurfaceActivities';
import { waterEarthLessonIds, waterEarthFinished } from './waterEarthModels';
import { WaterEarthExplorer } from './WaterEarthActivities';
import { weatherLessonIds, weatherFinished } from './weatherModels';
import { WeatherExplorer } from './WeatherActivities';
import { reportFinished } from './landformReport';

export function activityFinished(id: string, a: ActivityState) {
  if (climateLessonIds.includes(id)) return climateFinished(id, a.decisions);
  if (weatherLessonIds.includes(id)) return weatherFinished(id, a.decisions);
  if (id === 'GEO-032')
    return !!a.landformReport && reportFinished(a.landformReport);
  if (waterEarthLessonIds.includes(id))
    return waterEarthFinished(id, a.decisions);
  if (earthSurfaceLessonIds.includes(id))
    return earthSurfaceFinished(id, a.decisions);
  if (landscapeLessonIds.includes(id))
    return landscapeFinished(id, a.decisions);
  if (geologyLessonIds.includes(id)) return geologyFinished(id, a.decisions);
  if (id === 'GEO-016') return !!a.atlas && atlasFinished(a.atlas);
  if (placeLessonIds.includes(id)) return placeFinished(id, a.decisions);
  if (terrainLessonIds.includes(id)) return terrainFinished(id, a.decisions);
  if (id === 'GEO-001')
    return ['land', 'ocean', 'cloud'].every((k) => a.found.includes(k));
  if (id === 'GEO-002')
    return worldTargets.every((p) => a.matches[p.id] === p.id);
  if (id === 'GEO-003')
    return (
      a.decisions.appearance === 'satellite' &&
      a.decisions.connections === 'roads' &&
      a.decisions.landforms === 'terrain'
    );
  if (id !== 'GEO-004') return skillFinished(id, a.decisions);
  return (
    a.decisions.direction === 'N' &&
    a.decisions.rotated === 'yes' &&
    routeFinished(a.route)
  );
}
const layers = [
  ['satellite', '真实影像', 'Real imagery'],
  ['roads', '道路示意', 'Road schematic'],
  ['terrain', '地形示意', 'Terrain schematic'],
] as const;
export function RotationControls({
  mode,
  value,
  onChange,
}: {
  mode: LanguageMode;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="geo-choices"
      role="group"
      aria-label={words(mode, '旋转地图', 'Rotate map')}
    >
      {[0, 90, 180, 270].map((v) => (
        <button key={v} aria-pressed={value === v} onClick={() => onChange(v)}>
          {v}° {v === 0 ? words(mode, '北向上', 'N up') : ''}
        </button>
      ))}
    </div>
  );
}
export function Activity({
  id,
  mode,
  state,
  onChange,
}: {
  id: string;
  mode: LanguageMode;
  state: ActivityState;
  onChange: (a: ActivityState) => void;
}) {
  const [message, setMessage] = useState(
    t(
      '先观察再操作，可以随时重试。',
      'Look first, then try. Retries are welcome.',
    ),
  );
  const [selected, setSelected] = useState('');
  const complete = activityFinished(id, state);
  const update = (patch: Partial<ActivityState>) =>
    onChange({ ...state, ...patch });
  const status = (
    <div className={`geo-feedback ${complete ? 'success' : ''}`} role="status">
      <Text
        mode={mode}
        text={
          complete
            ? t(
                '✓ 任务完成。再用自己的话说出一条证据。',
                '✓ Mission complete. Now explain one piece of evidence in your own words.',
              )
            : message
        }
      />
    </div>
  );
  if (climateLessonIds.includes(id))
    return (
      <ClimateExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (weatherLessonIds.includes(id))
    return (
      <WeatherExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (waterEarthLessonIds.includes(id))
    return (
      <WaterEarthExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (earthSurfaceLessonIds.includes(id))
    return (
      <EarthSurfaceExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (landscapeLessonIds.includes(id))
    return (
      <LandscapeExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (geologyLessonIds.includes(id))
    return (
      <GeologyExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (placeLessonIds.includes(id))
    return (
      <PlaceExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (terrainLessonIds.includes(id))
    return (
      <TerrainExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (['GEO-005', 'GEO-006', 'GEO-007', 'GEO-008'].includes(id))
    return (
      <SkillExplorer
        id={id}
        mode={mode}
        state={state}
        onChange={onChange}
        mission
      />
    );
  if (id === 'GEO-001') {
    const spots = [
      {
        id: 'land',
        letter: 'A',
        x: 38,
        y: 22,
        name: t('陆地', 'land'),
        clue: t(
          '棕绿相连的大片区域，有清楚的海岸边缘。',
          'A connected brown-green region with a visible coastal edge.',
        ),
      },
      {
        id: 'ocean',
        letter: 'B',
        x: 76,
        y: 49,
        name: t('海洋', 'ocean'),
        clue: t(
          '非洲东侧深蓝的宽广区域，不是天空中的一层蓝。',
          'A broad dark-blue region east of Africa, not a blue layer in the sky.',
        ),
      },
      {
        id: 'cloud',
        letter: 'C',
        x: 43,
        y: 60,
        name: t('云', 'cloud'),
        clue: t(
          '卷曲的白带延伸到海洋上空，遮住了部分地表。',
          'A swirling white band stretches over ocean and hides some of the surface.',
        ),
      },
    ];
    const target = spots.find((p) => !state.found.includes(p.id));
    return (
      <div className="geo-activity">
        <h3>
          <Text
            mode={mode}
            text={
              target
                ? t(`请找出：${target.name.zh}`, `Find: ${target.name.en}`)
                : t('三条地球线索都找到了', 'All three clues found')
            }
          />
        </h3>
        <div className="geo-earth-hotspots">
          <img
            src={assets.find((a) => a.id === 'apollo17-earth')!.path}
            alt={words(
              mode,
              '真实地球照片；A 位于非洲棕色陆地，B 位于东侧深蓝海洋，C 位于南半球白色云带。',
              'Real Earth photo: A on brown Africa, B on dark-blue ocean to the east, C on a white southern cloud band.',
            )}
            onError={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          />
          {spots.map((spot) => (
            <button
              key={spot.id}
              className={`geo-hotspot ${state.found.includes(spot.id) ? 'done' : ''}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={words(mode, '线索点 ', 'Clue ') + spot.letter}
              onClick={() => {
                if (!target) return;
                if (spot.id === target.id) {
                  update({ found: [...state.found, spot.id] });
                  setMessage(spot.clue);
                } else
                  setMessage(
                    t(
                      '再看形状和位置：' + spot.clue.zh,
                      'Look again at shape and location: ' + spot.clue.en,
                    ),
                  );
              }}
            >
              {state.found.includes(spot.id) ? '✓' : spot.letter}
            </button>
          ))}
        </div>
        {status}
        <details>
          <summary>
            {words(
              mode,
              '文字线索／图片不可用时',
              'Text clues / image alternative',
            )}
          </summary>
          {spots.map((p) => (
            <p key={p.id}>
              {p.letter} · <Text mode={mode} text={p.clue} />
            </p>
          ))}
        </details>
        <ConceptDiagram kind="surface" mode={mode} />
      </div>
    );
  }
  if (id === 'GEO-002') {
    function place(target: string, label = selected) {
      if (!worldTargets.some((p) => p.id === label)) {
        setMessage(
          t(
            '先选一个地名标签，再点编号位置。',
            'Choose a label before clicking a numbered position.',
          ),
        );
        return;
      }
      if (target !== label) {
        setMessage(
          t(
            '位置还不匹配。这个编号的线索：' + worldClues[target]!.zh,
            'The location does not match yet. This numbered position’s clue: ' +
              worldClues[target]!.en,
          ),
        );
        return;
      }
      update({ matches: { ...state.matches, [target]: label } });
      setSelected('');
      setMessage(
        t(
          '✓ 位置匹配。地名帮助我们描述区域，不改变陆海形状。',
          '✓ Location matched. A name helps describe a region without changing its physical shape.',
        ),
      );
    }
    return (
      <div className="geo-activity">
        <div className="geo-row">
          <h3>{words(mode, '给世界放上地名', 'Give the world its names')}</h3>
          <span className="geo-muted">
            {worldTargets.filter((p) => state.matches[p.id] === p.id).length} /
            12
          </span>
        </div>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '选择地图中心', 'Choose map centre')}
        >
          {[0, 180].map((c) => (
            <button
              key={c}
              aria-pressed={state.centre === c}
              onClick={() => update({ centre: c })}
            >
              {c === 0
                ? words(mode, '大西洋视角', 'Atlantic view')
                : words(mode, '太平洋居中', 'Pacific centred')}
            </button>
          ))}
        </div>
        <div
          className="geo-label-tray"
          role="group"
          aria-label={words(mode, '洲洋标签', 'Continent and ocean labels')}
        >
          {[...worldTargets]
            .sort((a, b) => a.name.en.localeCompare(b.name.en))
            .map((p) => (
              <button
                key={p.id}
                draggable={state.matches[p.id] !== p.id}
                onDragStart={(e) => {
                  setSelected(p.id);
                  e.dataTransfer.setData('text/plain', p.id);
                }}
                disabled={state.matches[p.id] === p.id}
                aria-pressed={selected === p.id}
                onClick={() => setSelected(p.id)}
              >
                {state.matches[p.id] === p.id ? '✓ ' : ''}
                <Text mode={mode} text={p.name} />
              </button>
            ))}
        </div>
        <WorldMap
          mode={mode}
          centre={state.centre}
          matches={state.matches}
          onPick={place}
        />
        {status}
        <details>
          <summary>
            {words(
              mode,
              '位置线索与键盘操作',
              'Location clues and keyboard access',
            )}
          </summary>
          <p>
            <Text
              mode={mode}
              text={t(
                '用 Tab 选中标签，按 Enter；再用 Tab 到编号位置，按 Enter。岛屿不会显示为洲的完整边界。太平洋居中后，新西兰在地图中部靠南。',
                'Tab to a label and press Enter, then Tab to a numbered location and press Enter. Island regions are not shown with complete continent borders. With the Pacific centred, New Zealand appears near the middle, south of the equator.',
              )}
            />
          </p>
          <ol>
            {worldTargets.map((p, i) => (
              <li key={p.id}>
                {i + 1} · <Text mode={mode} text={worldClues[p.id]!} />
              </li>
            ))}
          </ol>
        </details>
        <button
          className="geo-button secondary"
          onClick={() => {
            update({ matches: {} });
            setSelected('');
            setMessage(
              t(
                '标签已清空，可以重新定位。',
                'Labels cleared; place them again.',
              ),
            );
          }}
        >
          {words(mode, '重新放置标签', 'Reset labels')}
        </button>
      </div>
    );
  }
  if (id === 'GEO-003') {
    const tasks = [
      {
        id: 'appearance',
        expected: 'satellite',
        prompt: t(
          '① 拍摄时地表是什么样？',
          '① What did the surface look like at capture time?',
        ),
      },
      {
        id: 'connections',
        expected: 'roads',
        prompt: t(
          '② 主要城镇大致怎样连接？',
          '② How are major towns approximately connected?',
        ),
      },
      {
        id: 'landforms',
        expected: 'terrain',
        prompt: t(
          '③ 山地与东侧平原在哪里？',
          '③ Where are the mountains and eastern plains?',
        ),
      },
    ];
    return (
      <div className="geo-activity">
        <h3>
          {words(
            mode,
            '同一区域，三种信息',
            'One region, three kinds of information',
          )}
        </h3>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '选择图层', 'Choose a view')}
        >
          {layers.map(([layer, zh, en]) => (
            <button
              key={layer}
              aria-pressed={state.layer === layer}
              onClick={() => update({ layer })}
            >
              {words(mode, zh, en)}
            </button>
          ))}
        </div>
        <div className="geo-layer-workbench">
          <div>
            {state.layer === 'satellite' ? (
              <AssetImage id="south-island-modis" mode={mode} compact />
            ) : (
              <NZMap mode={mode} layer={state.layer} />
            )}
          </div>
          <div className="geo-layer-tasks">
            <p className="geo-notice">
              <Text
                mode={mode}
                text={t(
                  '影像为 2007 年观测。道路与地形是同一区域的简化教学图，视角与范围不同，不逐像素重合，不用于导航。',
                  'Imagery records 2007. Road and terrain views are simplified teaching maps of the same region with different perspectives and extents; no pixel-level alignment or navigation use.',
                )}
              />
            </p>
            {tasks.map((task) => (
              <article key={task.id}>
                <h4>
                  <Text mode={mode} text={task.prompt} />
                </h4>
                <button
                  className="geo-button secondary"
                  onClick={() => {
                    if (state.layer === task.expected) {
                      update({
                        decisions: {
                          ...state.decisions,
                          [task.id]: state.layer,
                        },
                      });
                      setMessage(
                        t(
                          '✓ 所选视图能突出这个问题需要的信息。',
                          '✓ This view highlights information useful for the question.',
                        ),
                      );
                    } else
                      setMessage(
                        t(
                          '这张图有线索，但没有突出所需信息。观察影像外观、连接线与山地图例，再选视图。',
                          'This view has clues, but does not highlight the information needed. Compare surface appearance, connection lines and the mountain legend.',
                        ),
                      );
                  }}
                >
                  {state.decisions[task.id] === task.expected ? '✓ ' : ''}
                  {words(mode, '使用当前视图回答', 'Use this view')}
                </button>
              </article>
            ))}
          </div>
        </div>
        {status}
      </div>
    );
  }
  return (
    <div className="geo-activity">
      <h3>
        {words(
          mode,
          '转动地图，找到过河路线',
          'Rotate the map. Find a bridge route.',
        )}
      </h3>
      <RotationControls
        mode={mode}
        value={state.rotation}
        onChange={(rotation) =>
          update({
            rotation,
            decisions: {
              ...state.decisions,
              rotated: rotation !== 0 ? 'yes' : (state.decisions.rotated ?? ''),
            },
          })
        }
      />
      <div className="geo-route-workbench">
        <RouteMap
          mode={mode}
          rotation={state.rotation}
          route={state.route}
          onPick={(to) => {
            const result = routeMove(state.route, to);
            if (result.valid) {
              update({ route: result.route });
              setMessage(
                t(
                  '沿通道前进。到桥北后，向西去图书馆。',
                  'Follow the paths. From the north bank, travel west to the library.',
                ),
              );
            } else
              setMessage(
                result.reason === 'river'
                  ? t(
                      '河流挡住了直线路线。先向东去桥南，再经过桥。',
                      'The river blocks a direct route. Go east to the south bank, then cross the bridge.',
                    )
                  : t(
                      '先选与你当前位置相邻、由通道连接的地点。',
                      'Choose a neighbouring stop connected to your current position by a path.',
                    ),
              );
          }}
        />
        <div>
          <p>
            <Text
              mode={mode}
              text={t(
                '图书馆在学校的哪个方位？看北箭头，别只看屏幕。',
                'In which direction is the library from the school? Use the north arrow, not just the screen.',
              )}
            />
          </p>
          <div className="geo-choices">
            {[
              ['N', '北', 'North'],
              ['E', '东', 'East'],
              ['S', '南', 'South'],
              ['W', '西', 'West'],
            ].map(([v, zh, en]) => (
              <button
                key={v}
                aria-pressed={state.decisions.direction === v}
                onClick={() => {
                  if (v === 'N') {
                    update({
                      decisions: { ...state.decisions, direction: v! },
                    });
                    setMessage(
                      t(
                        '✓ 图书馆在学校北面；旋转只改变屏幕朝向。',
                        '✓ The library is north of the school; rotation changes screen orientation.',
                      ),
                    );
                  } else
                    setMessage(
                      t(
                        '先沿北箭头看：学校到图书馆的相对位置不会因旋转而改变。',
                        'Follow the north arrow; rotation does not change the library’s location relative to the school.',
                      ),
                    );
                }}
              >
                {words(mode, zh!, en!)}
              </button>
            ))}
          </div>
          <ol className="geo-route-list">
            {state.route.map((id, i) => (
              <li key={i}>
                {words(
                  mode,
                  id === 'school'
                    ? '学校'
                    : id === 'south'
                      ? '桥南'
                      : id === 'bridge'
                        ? '桥'
                        : id === 'north'
                          ? '桥北'
                          : id === 'library'
                            ? '图书馆'
                            : '公园',
                  id,
                )}
              </li>
            ))}
          </ol>
          <button
            className="geo-button secondary"
            onClick={() => update({ route: ['school'] })}
          >
            {words(mode, '重新走路线', 'Restart route')}
          </button>
          <p className="geo-caption">
            <Text
              mode={mode}
              text={t(
                '先旋转至少一次。路线：学校 → 桥南 → 桥 → 桥北 → 图书馆。这个模型仅用来练习，不读取真实位置。',
                'Rotate at least once. Route: school → south bank → bridge → north bank → library. This practice model uses no real location.',
              )}
            />
          </p>
        </div>
      </div>
      {status}
    </div>
  );
}
