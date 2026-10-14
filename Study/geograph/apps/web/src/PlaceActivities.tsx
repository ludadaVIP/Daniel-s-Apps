import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ActivityState } from './progress';
import { assets, t, words } from './content';
import { AssetImage, Text } from './ui';
import {
  detectiveFinished,
  detectiveScenes,
  landUseScenes,
  nzFeatures,
  placeFinished,
} from './placeModels';
import { NZOverview } from './PlaceVisuals';
import { AtlasEditor } from './AtlasEditor';
import { AtlasPreview } from './PlaceVisuals';
import { newAtlas } from './atlasModel';
import { ScaleMap } from './SkillVisuals';
type Props = {
  id: string;
  mode: LanguageMode;
  state: ActivityState;
  onChange: (a: ActivityState) => void;
  panel?: number;
  mission?: boolean;
};
export function PlaceExplorer({
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
      '先描述你看见的，再作推测。可以重试。',
      'Describe what you observe before inferring. Retries are welcome.',
    ),
  );
  const [selected, setSelected] = useState('');
  const patch = (key: string, value: string) =>
    onChange({ ...state, decisions: { ...d, [key]: value } });
  const status = (
    <div
      className={`geo-feedback ${placeFinished(id, d) ? 'success' : ''}`}
      role="status"
    >
      <Text
        mode={mode}
        text={
          placeFinished(id, d)
            ? t(
                '✓ 任务证据齐全。说明一条仍不能确定的事。',
                '✓ Mission evidence complete. Explain one thing that remains uncertain.',
              )
            : message
        }
      />
    </div>
  );
  const choose = (
    key: string,
    correct: string,
    options: { id: string; text: LocalizedText }[],
    prompt: LocalizedText,
    hint: LocalizedText,
    explanation: LocalizedText,
  ) => (
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
  if (id === 'GEO-013') {
    const scene = mission
      ? (landUseScenes.find((p) => p.id === d['landuse-scene']) ??
        landUseScenes[0])
      : (landUseScenes[panel] ?? landUseScenes[0]);
    return (
      <div className="geo-skill-explorer">
        {mission && (
          <div
            className="geo-choices"
            role="group"
            aria-label={words(
              mode,
              '比较土地利用影像',
              'Compare land-use images',
            )}
          >
            {landUseScenes.map((p) => (
              <button
                key={p.id}
                aria-pressed={scene.id === p.id}
                onClick={() => patch('landuse-scene', p.id)}
              >
                {d[`landuse-${p.id}`] === p.expected ? '✓ ' : ''}
                {words(mode, p.zh, p.en)}
              </button>
            ))}
          </div>
        )}
        <AssetImage key={scene.asset} id={scene.asset} mode={mode} compact />
        <p className="geo-notice">
          <Text mode={mode} text={t(scene.clueZh, scene.clueEn)} />
        </p>
        {mission ? (
          <>
            {choose(
              `landuse-${scene.id}`,
              scene.expected,
              [
                {
                  id: 'built',
                  text: t(
                    '密集建成区，含街道和城市绿地',
                    'Dense built-up area with streets and urban green spaces',
                  ),
                },
                {
                  id: 'mixed',
                  text: t(
                    '建成区与剩余农田混合的城市边缘',
                    'Urban edge mixing built-up land and remaining fields',
                  ),
                },
                {
                  id: 'agriculture',
                  text: t(
                    '以规则农田为主，夹有河道与林带',
                    'Mostly regular farmland with river channels and forest belts',
                  ),
                },
              ],
              t(
                '哪种描述最符合这幅案例的土地利用线索？',
                'Which description best fits this case’s land-use clues?',
              ),
              t(
                scene.clueZh + ' 看形状、连接与图注，不只看绿不绿。',
                scene.clueEn +
                  ' Use shapes, connections and captions, not green alone.',
              ),
              t(
                '✓ 描述与案例相符。土地覆盖告诉我们外观，具体用途仍须地面资料核对。',
                '✓ The description fits this case. Land cover describes appearance; detailed use still needs ground information.',
              ),
            )}
            {choose(
              'landuse-limit',
              'limited',
              [
                {
                  id: 'limited',
                  text: t(
                    '可提出用途假设，不能据此确定居民职业、收入或今天交通',
                    'We can propose uses, not determine residents’ jobs, income or traffic today',
                  ),
                },
                {
                  id: 'all',
                  text: t(
                    '照片能证明每个人如何生活',
                    'The image proves how every person lives',
                  ),
                },
              ],
              t(
                '从高空照片可以得出多大程度的结论？',
                'How far can an overhead image support a conclusion?',
              ),
              t(
                '一栋楼能有许多用途；影像日期也不是今天。人们的生活需要更多证据。',
                'A building can have many uses; the capture date is not today. Lives require more evidence.',
              ),
              t(
                '✓ 区别看得见的覆盖与推测的用途，避免给人群贴标签。',
                '✓ Separate visible cover from inferred use, avoiding unsupported labels about people.',
              ),
            )}
            {status}
          </>
        ) : null}
      </div>
    );
  }
  if (id === 'GEO-014') {
    if (!mission && panel === 1)
      return <AssetImage id="nz-relief" mode={mode} compact />;
    if (!mission && panel === 2)
      return (
        <>
          <AssetImage id="north-island-iss" mode={mode} compact />
          <AssetImage id="south-island-modis" mode={mode} compact />
        </>
      );
    return (
      <div className="geo-skill-explorer">
        <NZOverview mode={mode} reveal={!mission} selected={selected} />
        {mission ? (
          <>
            <p>
              <Text
                mode={mode}
                text={t(
                  '先选地名，再选择A–G位置。地图点代表大致地区；下方文字线索可以帮助定位，不需要精确地理坐标。',
                  'Choose a feature, then an A–G location. Points represent approximate regions; the written clues help locate them without exact coordinates.',
                )}
              />
            </p>
            <div
              className="geo-choices"
              role="group"
              aria-label={words(
                mode,
                '选择新西兰地名',
                'Choose a New Zealand feature',
              )}
            >
              {[...nzFeatures]
                .sort((a, b) => a.en.localeCompare(b.en))
                .map((p) => (
                  <button
                    key={p.id}
                    aria-pressed={selected === p.id}
                    onClick={() => setSelected(p.id)}
                  >
                    {d[`nz-${p.id}`] === p.id ? '✓ ' : ''}
                    <Text mode={mode} text={t(p.zh, p.en)} />
                  </button>
                ))}
            </div>
            <div className="geo-nz-location-buttons">
              {nzFeatures.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (!selected) {
                      setMessage(
                        t(
                          '先选一个地名，再用位置线索核对。',
                          'Choose a feature first, then compare location clues.',
                        ),
                      );
                      return;
                    }
                    if (selected === p.id) {
                      patch(`nz-${p.id}`, p.id);
                      setSelected('');
                      setMessage(
                        t(
                          '✓ 地图与位置线索相符；点只代表附近区域。',
                          '✓ Map and location clues agree; the point represents a surrounding region.',
                        ),
                      );
                    } else
                      setMessage(
                        t(
                          `${p.letter}：${p.clueZh}`,
                          `${p.letter}: ${p.clueEn}`,
                        ),
                      );
                  }}
                >
                  {p.letter} ·{' '}
                  {d[`nz-${p.id}`] === p.id
                    ? '✓'
                    : words(mode, '位置', 'Location')}
                </button>
              ))}
            </div>
            <details>
              <summary>
                {words(mode, 'A–G文字位置线索', 'Written A–G location clues')}
              </summary>
              <ol>
                {nzFeatures.map((p) => (
                  <li key={p.id}>
                    {p.letter} ·{' '}
                    <Text mode={mode} text={t(p.clueZh, p.clueEn)} />
                  </li>
                ))}
              </ol>
            </details>
            {choose(
              'nz-comparison',
              'varied',
              [
                {
                  id: 'flat',
                  text: t(
                    '北岛全平，南岛只有山',
                    'North Island is all flat and South Island only mountainous',
                  ),
                },
                {
                  id: 'varied',
                  text: t(
                    '北岛有火山、山地与低地；南岛有长山脉，也有东部平原',
                    'North Island has volcanoes, ranges and lowlands; South Island has a long range and eastern plains',
                  ),
                },
              ],
              t(
                '结合真实地形图，哪种比较更可靠？',
                'Which comparison is better supported by the real elevation map?',
              ),
              t(
                '两个岛内部都多样。看北岛中央火山和南岛东侧平地，不把岛名当作单一地形。',
                'Both islands contain varied terrain. Look for central North Island volcanoes and eastern South Island plains.',
              ),
              t(
                '✓ 用位置与例子描述差异，避免“全都”的判断。',
                '✓ Describe differences with locations and examples rather than “all”.',
              ),
            )}
            {status}
          </>
        ) : null}
      </div>
    );
  }
  if (id === 'GEO-015') {
    const scene =
      detectiveScenes.find((p) => p.id === d['detective-scene']) ??
      detectiveScenes[0];
    if (!mission && panel === 1)
      return (
        <div className="geo-detective-profiles">
          {detectiveScenes.map((p) => (
            <article key={p.id}>
              <h4>
                <Text mode={mode} text={t(p.placeZh, p.placeEn)} />
              </h4>
              <p>
                <Text mode={mode} text={t(p.profileZh, p.profileEn)} />
              </p>
            </article>
          ))}
        </div>
      );
    return (
      <div className="geo-skill-explorer">
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '四张侦探影像', 'Four detective images')}
        >
          {detectiveScenes.map((p, i) => (
            <button
              key={p.id}
              aria-pressed={scene.id === p.id}
              onClick={() => patch('detective-scene', p.id)}
            >
              {detectiveFinished(p.id, d) ? '✓ ' : ''}
              {words(mode, '照片', 'Image')} {i + 1}
            </button>
          ))}
        </div>
        <MysteryImage
          key={scene.asset}
          mode={mode}
          asset={scene.asset}
          clue={t(scene.observedZh, scene.observedEn)}
          date={scene.date}
        />
        <p className="geo-notice">
          <Text
            mode={mode}
            text={t(
              '本任务在四个候选案例中比较证据，不宣称照片能唯一确定地点。气候背景来自资料卡，不能由一次拍摄独自证明。可展开来源核查，允许先看再练。',
              'Compare four candidate cases; a photo does not uniquely establish a location. Climate background comes from reference cards, not a single capture. Sources can be opened for checking; looking first and retrying is welcome.',
            )}
          />
        </p>
        {mission ? (
          <>
            {choose(
              `guess-${scene.id}`,
              scene.id,
              detectiveScenes.map((p) => ({
                id: p.id,
                text: t(p.placeZh, p.placeEn),
              })),
              t(
                '在这四个候选中，哪一个最相符？',
                'Which of these four candidates fits best?',
              ),
              t(
                '先观察地形、海岸与人造形状，再读候选资料卡。单一颜色不够。',
                'Inspect landforms, coast and constructed shapes, then candidate profiles. One colour is insufficient.',
              ),
              t(
                '✓ 在给定候选中相符。补上两条独立线索，说明依据。',
                '✓ Fits among the given candidates. Add two distinct clues to explain why.',
              ),
            )}
            <h4>{words(mode, '两条有效线索', 'Two supported clues')}</h4>
            <div className="geo-choices">
              {scene.options.map(([key, zh, en]) => (
                <button
                  key={key}
                  aria-pressed={d[`evidence-${scene.id}-${key}`] === 'yes'}
                  onClick={() => {
                    if (scene.evidence.some((k) => k === key)) {
                      patch(
                        `evidence-${scene.id}-${key}`,
                        d[`evidence-${scene.id}-${key}`] === 'yes' ? '' : 'yes',
                      );
                      setMessage(
                        t(
                          '✓ 这条线索在图中可观察。再用另一类线索交叉核对。',
                          '✓ This clue is observable. Cross-check with another kind of evidence.',
                        ),
                      );
                    } else
                      setMessage(
                        t(
                          '这超出了照片支持的结论。区别看见的形状与推测的季节、收入或全年气候。',
                          'This exceeds the image’s evidence. Separate observed shapes from inferred seasons, income or year-round climate.',
                        ),
                      );
                  }}
                >
                  {d[`evidence-${scene.id}-${key}`] === 'yes' ? '✓ ' : ''}
                  <Text mode={mode} text={t(zh, en)} />
                </button>
              ))}
            </div>
            {choose(
              `confidence-${scene.id}`,
              'likely',
              [
                {
                  id: 'certain',
                  text: t(
                    '只凭照片，我已唯一确定地点',
                    'The photograph alone uniquely proves the location',
                  ),
                },
                {
                  id: 'likely',
                  text: t(
                    '在候选中较吻合，还需来源核查',
                    'A better fit among these candidates; source checking still needed',
                  ),
                },
              ],
              t('你对猜测有多确定？', 'How certain is your inference?'),
              t(
                '许多地区都有沙丘、街区、雪或农田。相符并不等于全世界只有这里。',
                'Many regions have dunes, blocks, snow or fields. A match is not globally unique proof.',
              ),
              t(
                '✓ 留下不确定性是推理的一部分。下一步读来源、日期与视角。',
                '✓ Uncertainty belongs in reasoning. Next check source, date and viewpoint.',
              ),
            )}
            <button
              className="geo-button secondary"
              onClick={() => {
                if (
                  d[`guess-${scene.id}`] !== scene.id ||
                  !scene.evidence.every(
                    (k) => d[`evidence-${scene.id}-${k}`] === 'yes',
                  ) ||
                  d[`confidence-${scene.id}`] !== 'likely' ||
                  d[`revealed-${scene.id}`] !== 'yes'
                ) {
                  setMessage(
                    t(
                      '先留下候选、两条线索和不确定性判断，再展开来源读取位置与日期，记录核查过程。',
                      'Record a candidate, two clues and uncertainty, then reveal the source to read location/date before logging the check.',
                    ),
                  );
                  return;
                }
                patch(`checked-${scene.id}`, 'source');
                setMessage(
                  t(
                    `✓ 来源确认：${scene.placeZh}，拍摄日期${scene.date}。位置是由资料核查确认的，不是单凭颜色。`,
                    `✓ Source confirms ${scene.placeEn}, captured ${scene.date}. Metadata confirms location; colour alone did not.`,
                  ),
                );
              }}
            >
              {words(mode, '记录来源核查', 'Record source check')}
            </button>
            {status}
          </>
        ) : null}
        <details
          key={scene.id}
          open={!mission && panel === 2}
          onToggle={(e) => {
            if (e.currentTarget.open && d[`revealed-${scene.id}`] !== 'yes')
              patch(`revealed-${scene.id}`, 'yes');
          }}
        >
          <summary>
            {words(
              mode,
              '揭示影像来源、日期与位置',
              'Reveal image source, date and location',
            )}
          </summary>
          <AssetImage id={scene.asset} mode={mode} compact />
          <p>
            <Text
              mode={mode}
              text={t(
                `核查位置：${scene.placeZh}；${scene.profileZh}`,
                `Checked location: ${scene.placeEn}; ${scene.profileEn}`,
              )}
            />
          </p>
        </details>
      </div>
    );
  }
  if (id === 'GEO-016' && !mission && panel === 1)
    return (
      <div className="geo-skill-explorer">
        <div className="geo-light-comparison">
          <ScaleMap mode={mode} zoom={1} />
          <ScaleMap mode={mode} zoom={2} />
        </div>
        <p className="geo-notice">
          <Text
            mode={mode}
            text={t(
              '示例证据卡：我把地图放大到2×，线段尺同步改变，得到的实地距离仍为10公里。发现：缩放改变画面，不改变地点之间距离。局限：这只是虚构教学地区，不是我家的导航路线。示例不会写入你的作品。',
              'Example evidence card: I zoomed to 2× and the graphic bar changed; ground distance remained 10 km. Discovery: zoom changes the view, not the places. Limit: this is a fictional teaching region, not my home route. The example is not added to your work.',
            )}
          />
        </p>
      </div>
    );
  if (id === 'GEO-016' && !mission && panel === 2) {
    const draft = state.atlas ?? newAtlas();
    return (
      <div className="geo-skill-explorer">
        <AtlasPreview mode={mode} draft={draft} />
        <div className="geo-detective-profiles">
          {draft.findings.map((f, i) => (
            <article key={i}>
              <h4>
                {words(mode, '发现', 'Discovery')} {i + 1}
              </h4>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    f.zh || '中文口头介绍或待补充',
                    f.en || 'English oral introduction or pending',
                  )}
                />
              </p>
              <p>
                {words(mode, '证据', 'Evidence')}:{' '}
                {f.evidence || words(mode, '待补充', 'Pending')}
              </p>
              <small>{f.lessonId}</small>
            </article>
          ))}
        </div>
      </div>
    );
  }
  if (id === 'GEO-016')
    return (
      <AtlasEditor
        mode={mode}
        state={state}
        onChange={onChange}
        editable={mission}
      />
    );
  return null;
}
function MysteryImage({
  mode,
  asset,
  clue,
  date,
}: {
  mode: LanguageMode;
  asset: string;
  clue: LocalizedText;
  date: string;
}) {
  const [failed, setFailed] = useState(false),
    a = assets.find((p) => p.id === asset)!;
  return (
    <figure className="geo-skill-figure">
      {!failed ? (
        <img
          className="geo-mystery-image"
          src={a.path}
          alt={
            mode === 'bilingual'
              ? `${clue.zh} / ${clue.en}`
              : words(mode, clue.zh, clue.en)
          }
          onError={() => setFailed(true)}
        />
      ) : (
        <p className="geo-notice">
          {words(
            mode,
            '影像暂不可用，可使用下面的文字线索。',
            'Image unavailable; use the written clues below.',
          )}
        </p>
      )}
      <figcaption>
        <Text mode={mode} text={clue} />
        <p>
          {date} · {a.credit_text}
        </p>
      </figcaption>
    </figure>
  );
}
