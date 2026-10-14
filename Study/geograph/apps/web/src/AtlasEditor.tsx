import type { LanguageMode } from '@study/shared';
import type { ActivityState } from './progress';
import { lessons, t, words } from './content';
import { downloadFile, Text } from './ui';
import { worldTargets } from './models';
import {
  atlasChecklist,
  atlasHtml,
  atlasMarkdown,
  atlasRegions,
  atlasSvg,
  newAtlas,
  type AtlasDraft,
  type AtlasSource,
} from './atlasModel';
import { AtlasPreview } from './PlaceVisuals';
export const atlasSources = (): AtlasSource[] =>
  lessons
    .filter((l) => l.stage === 'S1' && l.id !== 'GEO-016')
    .map((l) => ({
      id: l.id,
      titleZh: l.title.zh,
      titleEn: l.title.en,
      sources: l.sources,
    }));
export function AtlasDownloads({
  draft,
  mode,
}: {
  draft: AtlasDraft;
  mode: LanguageMode;
}) {
  return (
    <div className="geo-choices">
      <button
        className="geo-button"
        onClick={() =>
          downloadFile(
            'my-explorer-atlas.html',
            atlasHtml(draft, atlasSources()),
            'text/html;charset=utf-8',
          )
        }
      >
        {words(mode, '导出地图集报告', 'Export atlas report')} ↓
      </button>
      <button
        className="geo-button secondary"
        onClick={() =>
          downloadFile(
            'my-explorer-atlas.svg',
            atlasSvg(draft),
            'image/svg+xml;charset=utf-8',
          )
        }
      >
        {words(mode, '导出矢量地图', 'Export SVG map')} ↓
      </button>
      <button
        className="geo-button secondary"
        onClick={() =>
          downloadFile(
            'my-explorer-atlas.md',
            atlasMarkdown(draft, atlasSources()),
            'text/markdown;charset=utf-8',
          )
        }
      >
        {words(mode, '导出文字稿', 'Export notes')} ↓
      </button>
    </div>
  );
}
export function AtlasEditor({
  mode,
  state,
  onChange,
  editable = false,
}: {
  mode: LanguageMode;
  state: ActivityState;
  onChange: (a: ActivityState) => void;
  editable?: boolean;
}) {
  const draft = state.atlas ?? newAtlas();
  const update = (patch: Partial<AtlasDraft>) =>
    onChange({ ...state, atlas: { ...draft, ...patch } });
  const checks = atlasChecklist(draft);
  return (
    <div className="geo-skill-explorer">
      <AtlasPreview mode={mode} draft={draft} />
      {editable ? (
        <>
          <p className="geo-notice">
            <Text
              mode={mode}
              text={t(
                '草稿自动保存在本机。可拆成两次完成：先做地图，再写三条发现并向家人双语介绍。无需上传、精确家庭地址或GPS。作品可以随时修改与导出；核对清单记录过程，不自动评判解释质量。',
                'Drafts save locally. Split into two sessions: build the map, then add three discoveries and introduce it bilingually to family. No upload, precise address or GPS. Edit/export at any time; the checklist records process, not automatic grading of your explanations.',
              )}
            />
          </p>
          <div className="geo-atlas-fields">
            <label>
              {words(mode, '中文地图标题', 'Chinese atlas title')}
              <input
                value={draft.titleZh}
                maxLength={100}
                onChange={(e) => update({ titleZh: e.target.value })}
              />
            </label>
            <label>
              {words(mode, '英文地图标题', 'English atlas title')}
              <input
                value={draft.titleEn}
                maxLength={100}
                onChange={(e) => update({ titleEn: e.target.value })}
              />
            </label>
          </div>
          <h3>{words(mode, '① 我的世界底图', '① My world base')}</h3>
          <div
            className="geo-choices"
            role="group"
            aria-label={words(mode, '地图中心', 'Map centre')}
          >
            {[0, 180].map((c) => (
              <button
                key={c}
                aria-pressed={draft.centre === c}
                onClick={() => update({ centre: c as 0 | 180 })}
              >
                {c === 180
                  ? words(mode, '太平洋居中', 'Pacific centred')
                  : words(mode, '大西洋视角', 'Atlantic view')}
              </button>
            ))}
          </div>
          <div
            className="geo-choices"
            role="group"
            aria-label={words(mode, '陆地配色', 'Land colour')}
          >
            {[
              ['sage', '鼠尾草绿', 'Sage'],
              ['sand', '沙色', 'Sand'],
            ].map(([id, zh, en]) => (
              <button
                key={id}
                aria-pressed={draft.palette === id}
                onClick={() =>
                  update({
                    palette: id as 'sage' | 'sand',
                    legendChecked: false,
                  })
                }
              >
                {words(mode, zh!, en!)}
              </button>
            ))}
          </div>
          <p>
            <Text
              mode={mode}
              text={t(
                '逐个加入洲洋标签，核对每个位置。可再次点击移除；标签不是国界。',
                'Add each continent/ocean label and check its position. Click again to remove it; labels are not political borders.',
              )}
            />
          </p>
          <div
            className="geo-choices"
            role="group"
            aria-label={words(
              mode,
              '地图洲洋标签',
              'Atlas continent and ocean labels',
            )}
          >
            {[...worldTargets]
              .sort((a, b) => a.name.en.localeCompare(b.name.en))
              .map((p) => (
                <button
                  key={p.id}
                  aria-pressed={draft.labels.includes(p.id)}
                  onClick={() =>
                    update({
                      labels: draft.labels.includes(p.id)
                        ? draft.labels.filter((k) => k !== p.id)
                        : [...draft.labels, p.id],
                    })
                  }
                >
                  {draft.labels.includes(p.id) ? '✓ ' : ''}
                  <Text mode={mode} text={p.name} />
                </button>
              ))}
          </div>
          <h3>
            {words(
              mode,
              '② 我所在或介绍的大致区域',
              '② A coarse region I live in or introduce',
            )}
          </h3>
          <label className="geo-writing">
            {words(
              mode,
              '选择区域，非精确位置',
              'Choose a region, not a precise location',
            )}
            <select
              value={draft.region}
              onChange={(e) =>
                update({ region: e.target.value, locationChecked: false })
              }
            >
              {atlasRegions.map((p) => (
                <option key={p.id} value={p.id}>
                  {words(mode, p.zh, p.en)}
                </option>
              ))}
            </select>
          </label>
          <label className="geo-check">
            <input
              type="checkbox"
              checked={draft.locationChecked}
              onChange={(e) => update({ locationChecked: e.target.checked })}
            />
            <Text
              mode={mode}
              text={t(
                '我看过区域标记，能用半球与大洋说明它的大致位置。',
                'I checked the region marker and can describe it using hemisphere and ocean.',
              )}
            />
          </label>
          <label className="geo-check">
            <input
              type="checkbox"
              checked={draft.legendChecked}
              onChange={(e) => update({ legendChecked: e.target.checked })}
            />
            <Text
              mode={mode}
              text={t(
                '我核对了陆地／海洋／区域标记的图例，也找到北箭头和赤道。',
                'I checked the land/ocean/region legend and found the north arrow and equator.',
              )}
            />
          </label>
          <h3>{words(mode, '③ 三条“我发现了”', '③ Three discoveries')}</h3>
          <p>
            <Text
              mode={mode}
              text={t(
                '每条写下一个发现与一条图像或操作证据。可先用熟悉的语言记录；另一语言可由你口头介绍并让家长记录，不强迫长篇翻译。',
                'Record a discovery and one diagram/interaction clue for each. Write first in your comfortable language; introduce the other aloud with a parent recording it, without requiring long translations.',
              )}
            />
          </p>
          {draft.findings.map((f, i) => (
            <fieldset className="geo-atlas-finding" key={i}>
              <legend>
                {words(mode, '发现', 'Discovery')} {i + 1}
              </legend>
              <div className="geo-atlas-fields">
                {(['zh', 'en'] as const).map((lang) => (
                  <label key={lang}>
                    {lang === 'zh'
                      ? words(
                          mode,
                          '中文发现（也可口述）',
                          'Chinese discovery (or spoken)',
                        )
                      : words(
                          mode,
                          '英文发现（也可口述）',
                          'English discovery (or spoken)',
                        )}
                    <textarea
                      rows={3}
                      maxLength={700}
                      value={f[lang]}
                      onChange={(e) =>
                        update({
                          findings: draft.findings.map((entry, j) =>
                            j === i
                              ? { ...entry, [lang]: e.target.value }
                              : entry,
                          ),
                        })
                      }
                    />
                  </label>
                ))}
              </div>
              <label className="geo-writing">
                {words(
                  mode,
                  '我的证据：看见或操作了什么？',
                  'My evidence: what did I observe or change?',
                )}
                <textarea
                  rows={2}
                  maxLength={700}
                  value={f.evidence}
                  onChange={(e) =>
                    update({
                      findings: draft.findings.map((entry, j) =>
                        j === i
                          ? { ...entry, evidence: e.target.value }
                          : entry,
                      ),
                    })
                  }
                />
              </label>
              <label className="geo-writing">
                {words(
                  mode,
                  '证据来自哪一课？',
                  'Which lesson provides this evidence?',
                )}
                <select
                  value={f.lessonId}
                  onChange={(e) =>
                    update({
                      findings: draft.findings.map((entry, j) =>
                        j === i
                          ? { ...entry, lessonId: e.target.value }
                          : entry,
                      ),
                    })
                  }
                >
                  {lessons
                    .filter((l) => l.stage === 'S1' && l.id !== 'GEO-016')
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.id} · {words(mode, l.title.zh, l.title.en)}
                      </option>
                    ))}
                </select>
              </label>
            </fieldset>
          ))}
          <h3>
            {words(
              mode,
              '④ 指着图，双语介绍',
              '④ Point to the map and introduce it bilingually',
            )}
          </h3>
          {(['spokenZh', 'spokenEn'] as const).map((key) => (
            <label className="geo-check" key={key}>
              <input
                type="checkbox"
                checked={draft[key]}
                onChange={(e) => update({ [key]: e.target.checked })}
              />
              <Text
                mode={mode}
                text={
                  key === 'spokenZh'
                    ? t(
                        '我用中文指认至少一洲一洋，并解释一条发现。',
                        'I named at least one continent and ocean in Chinese and explained a discovery.',
                      )
                    : t(
                        '我用英文指认至少一洲一洋，并解释一条发现；可以用短句。',
                        'I named at least one continent and ocean in English and explained a discovery; short sentences are enough.',
                      )
                }
              />
            </label>
          ))}
          <div className="geo-atlas-checklist" role="status">
            {Object.entries(checks).map(([key, done]) => (
              <p key={key}>
                {done ? '✓' : '○'}{' '}
                <Text
                  mode={mode}
                  text={
                    {
                      labels: t(
                        '七洲五洋标签',
                        'Seven-continent/five-ocean labels',
                      ),
                      location: t('大致区域已核对', 'Coarse region checked'),
                      legend: t('图例与方向已核对', 'Legend/direction checked'),
                      findings: t(
                        '三条发现与证据',
                        'Three discoveries with evidence',
                      ),
                      introduction: t(
                        '中文与英文口头介绍',
                        'Chinese and English oral introduction',
                      ),
                    }[key]!
                  }
                />
              </p>
            ))}
          </div>
          <AtlasDownloads mode={mode} draft={draft} />
          <p className="geo-caption">
            <Text
              mode={mode}
              text={t(
                'HTML报告可离线打开并用浏览器打印；SVG为独立矢量地图。导出草稿也会保留已写内容，文件不会自动上传。',
                'Open the HTML report offline and print from a browser; SVG is a standalone vector map. Draft exports retain your work and are not uploaded.',
              )}
            />
          </p>
        </>
      ) : null}
    </div>
  );
}
