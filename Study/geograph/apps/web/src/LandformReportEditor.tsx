import type { LanguageMode } from '@study/shared';
import type { ActivityState } from './progress';
import { lessons, t, words } from './content';
import { AssetImage, Text, downloadFile } from './ui';
import {
  landscapeCases,
  reportProcesses,
  newLandformReport,
  reportChecklist,
  reportHtml,
  reportMarkdown,
  reportMapSvg,
  reportProcessSvg,
  type LandformReport,
  type ReportSource,
} from './landformReport';
export const reportSources = (): ReportSource[] =>
  lessons
    .filter((l) => l.stage === 'S2' && l.id !== 'GEO-032')
    .map((l) => ({
      id: l.id,
      titleZh: l.title.zh,
      titleEn: l.title.en,
      sources: l.sources,
    }));
export function LandformReportPreview({
  draft,
  mode,
  panel = 0,
}: {
  draft: LandformReport;
  mode: LanguageMode;
  panel?: number;
}) {
  const place =
    landscapeCases.find((c) => c.id === draft.caseId) ?? landscapeCases[0];
  return (
    <div className="geo-skill-explorer">
      {panel === 0 && (
        <>
          <AssetImage id={place.asset} mode={mode} />
          <p className="geo-caption">
            <Text
              mode={mode}
              text={
                draft.caseId === 'custom'
                  ? t(
                      '地球照片只帮助定位全球；不是你所选地貌的现场照。可引用公开资料，不需要上传。',
                      'The Earth photo helps locate the world, not your custom landform. Cite public sources; no upload needed.',
                    )
                  : t(
                      '真实案例照片/影像与图注见上方；下方圆点只表示介绍区域。',
                      'Real case photo/imagery and caption above; the dot below locates an approximate chosen region.',
                    )
              }
            />
          </p>
        </>
      )}
      {(panel === 0 || panel === 2) && (
        <figure className="geo-skill-figure geo-report-figure">
          <div
            className="geo-model-scroll"
            tabIndex={0}
            role="region"
            aria-label={words(
              mode,
              '地貌报告位置地图',
              'Landscape report location map',
            )}
            dangerouslySetInnerHTML={{ __html: reportMapSvg(draft) }}
          />
          <figcaption>
            <Text
              mode={mode}
              text={t(
                '可左右滚动：北向上、等距圆柱投影，图中点是大致介绍区域。精度仅0.1°；不用于导航。Natural Earth v5.1.2公开域底图，Study绘图。',
                'Scroll horizontally: north-up equirectangular projection; a coarse region marker at0.1° precision, not navigation. Natural Earth v5.1.2 public-domain base; Study rendering.',
              )}
            />
          </figcaption>
        </figure>
      )}
      {(panel === 1 || panel === 2) && (
        <>
          <figure className="geo-skill-figure geo-report-figure">
            <div
              className="geo-model-scroll"
              tabIndex={0}
              role="region"
              aria-label={words(
                mode,
                '地貌报告分步过程图',
                'Landscape report process diagram',
              )}
              dangerouslySetInnerHTML={{ __html: reportProcessSvg(draft) }}
            />
            <figcaption>
              <Text
                mode={mode}
                text={t(
                  '这些是你选择的解释步骤，不等于已证实的历史先后；几个过程可同时发生。三个图标为概念示意，不绘真实尺寸或速度。',
                  'These are selected explanation steps, not established chronology; processes can overlap. Three icons are conceptual, without real dimensions/speeds.',
                )}
              />
            </figcaption>
          </figure>
          <ol>
            {draft.steps.map((s, i) => (
              <li key={i}>
                <Text
                  mode={mode}
                  text={{
                    zh: s.zh || '此步中文说明尚未填写',
                    en: s.en || 'English description not yet written',
                  }}
                />
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
export function LandformReportEditor({
  mode,
  state,
  onChange,
}: {
  mode: LanguageMode;
  state: ActivityState;
  onChange: (a: ActivityState) => void;
}) {
  const d = state.landformReport ?? newLandformReport(),
    update = (patch: Partial<LandformReport>) =>
      onChange({ ...state, landformReport: { ...d, ...patch } }),
    checks = reportChecklist(d),
    courses = reportSources();
  const field = (
    labelZh: string,
    labelEn: string,
    value: string,
    onValue: (s: string) => void,
    max = 1500,
  ) => (
    <label className="geo-writing">
      {words(mode, labelZh, labelEn)}
      <textarea
        rows={3}
        maxLength={max}
        value={value}
        onChange={(e) => onValue(e.target.value)}
      />
    </label>
  );
  const tick = (
    labelZh: string,
    labelEn: string,
    value: boolean,
    onValue: (b: boolean) => void,
  ) => (
    <label className="geo-check">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onValue(e.target.checked)}
      />
      <Text mode={mode} text={t(labelZh, labelEn)} />
    </label>
  );
  return (
    <div className="geo-skill-explorer">
      <p className="geo-notice">
        <Text
          mode={mode}
          text={t(
            '作品自动保存到本机，可分两次完成。先选地点和过程，再用两条可追溯证据与双语讲解支持解释。清单记录你做过哪些步骤，不给自己的文字自动打分。可随时导出草稿。',
            'The report saves locally and can take two sessions. Choose a place/process, then support it with two traceable evidence items and bilingual explanation. Checks record actions, without grading your writing. Export drafts at any time.',
          )}
        />
      </p>
      <h3>
        {words(mode, '① 选择与定位地貌', '① Choose and locate a landform')}
      </h3>
      <label className="geo-writing">
        {words(mode, '地貌案例', 'Landform case')}
        <select
          value={d.caseId}
          onChange={(e) => {
            const c = landscapeCases.find((c) => c.id === e.target.value)!;
            update({
              caseId: c.id,
              lat: c.lat,
              lon: c.lon,
              mapChecked: false,
              stepsChecked: false,
              evidenceChecked: false,
            });
          }}
        >
          {landscapeCases.map((c) => (
            <option key={c.id} value={c.id}>
              {words(mode, c.zh, c.en)}
            </option>
          ))}
        </select>
      </label>
      <div className="geo-atlas-fields">
        {field(
          '中文报告标题',
          'Chinese report title',
          d.titleZh,
          (v) => update({ titleZh: v }),
          100,
        )}
        {field(
          '英文报告标题',
          'English report title',
          d.titleEn,
          (v) => update({ titleEn: v }),
          100,
        )}
      </div>
      {d.caseId === 'custom' && (
        <>
          <div className="geo-atlas-fields">
            {field(
              '中文地点名称',
              'Chinese place name',
              d.placeZh,
              (v) => update({ placeZh: v, mapChecked: false }),
              100,
            )}
            {field(
              '英文地点名称',
              'English place name',
              d.placeEn,
              (v) => update({ placeEn: v, mapChecked: false }),
              100,
            )}
          </div>
          <p>
            <Text
              mode={mode}
              text={t(
                '从公开地图读大致区域，南纬为负、北纬为正；只输入地区位置，不需家庭或个人位置。',
                'Read a coarse region from a public map; south negative/north positive. Use a landform region, without personal/home locations.',
              )}
            />
          </p>
          <div className="geo-atlas-fields">
            <label>
              {words(mode, '纬度（−80到80）', 'Latitude (−80 to80)')}
              <input
                type="number"
                min="-80"
                max="80"
                step="0.1"
                value={d.lat}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v) && v >= -80 && v <= 80)
                    update({ lat: Math.round(v * 10) / 10, mapChecked: false });
                }}
              />
            </label>
            <label>
              {words(mode, '经度（−180到180）', 'Longitude (−180 to180)')}
              <input
                type="number"
                min="-180"
                max="180"
                step="0.1"
                value={d.lon}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v) && v >= -180 && v <= 180)
                    update({ lon: Math.round(v * 10) / 10, mapChecked: false });
                }}
              />
            </label>
          </div>
        </>
      )}
      <LandformReportPreview draft={d} mode={mode} panel={0} />
      {tick(
        '我已核对位置、北箭头与图例，并知道投影失真和圆点精度',
        'I checked location, north and legend, including projection/marker limits',
        d.mapChecked,
        (v) => update({ mapChecked: v }),
      )}
      <h3>
        {words(
          mode,
          '② 做我的形成过程分步图',
          '② Build my process explanation diagram',
        )}
      </h3>
      <p>
        <Text
          mode={mode}
          text={t(
            '给每步选一个过程并写自己的说明；可重排。说明它如何与这处地貌有关，哪些过程同时发生，而不是照抄通用图标。',
            'Choose a process for each step and write how it relates to this landform. Reorder if useful; explain overlap instead of treating generic icons as evidence.',
          )}
        />
      </p>
      <LandformReportPreview draft={d} mode={mode} panel={1} />
      {d.steps.map((s, i) => (
        <section className="geo-question" key={i}>
          <h4>{words(mode, `过程步骤 ${i + 1}`, `Process step ${i + 1}`)}</h4>
          <label className="geo-writing">
            {words(mode, `第${i + 1}步过程`, `Step ${i + 1} process`)}
            <select
              value={s.process}
              onChange={(e) =>
                update({
                  steps: d.steps.map((v, j) =>
                    j === i ? { ...v, process: e.target.value } : v,
                  ),
                  stepsChecked: false,
                })
              }
            >
              {reportProcesses.map((p) => (
                <option key={p.id} value={p.id}>
                  {words(mode, p.zh, p.en)}
                </option>
              ))}
            </select>
          </label>
          <div className="geo-atlas-fields">
            {field(
              `第${i + 1}步中文说明`,
              `Step ${i + 1} Chinese description`,
              s.zh,
              (v) =>
                update({
                  steps: d.steps.map((a, j) => (j === i ? { ...a, zh: v } : a)),
                  stepsChecked: false,
                }),
              700,
            )}
            {field(
              `第${i + 1}步英文说明`,
              `Step ${i + 1} English description`,
              s.en,
              (v) =>
                update({
                  steps: d.steps.map((a, j) => (j === i ? { ...a, en: v } : a)),
                  stepsChecked: false,
                }),
              700,
            )}
          </div>
          <div className="geo-choices">
            {[-1, 1].map((delta) => (
              <button
                key={delta}
                disabled={i + delta < 0 || i + delta >= 3}
                onClick={() => {
                  const steps = [...d.steps];
                  [steps[i], steps[i + delta]] = [steps[i + delta]!, steps[i]!];
                  update({ steps, stepsChecked: false });
                }}
              >
                {words(
                  mode,
                  delta < 0 ? '↑ 上移' : '↓ 下移',
                  delta < 0 ? '↑ Up' : '↓ Down',
                )}
              </button>
            ))}
          </div>
        </section>
      ))}
      {tick(
        '我已检查三个步骤的因果联系、时间尺度与可能同时发生的过程',
        'I checked causal links, time scale and possible overlapping processes',
        d.stepsChecked,
        (v) => update({ stepsChecked: v }),
      )}
      <h3>
        {words(
          mode,
          '③ 两条证据：看见、解释、局限',
          '③ Two evidence items: observe, infer, limit',
        )}
      </h3>
      {d.evidence.map((e, i) => (
        <section className="geo-question" key={i}>
          <h4>{words(mode, `证据 ${i + 1}`, `Evidence ${i + 1}`)}</h4>
          <label className="geo-writing">
            {words(
              mode,
              `证据${i + 1}资料入口`,
              `Evidence ${i + 1} source entry`,
            )}
            <select
              value={e.lessonId}
              onChange={(event) =>
                update({
                  evidence: d.evidence.map((v, j) =>
                    j === i ? { ...v, lessonId: event.target.value } : v,
                  ),
                  evidenceChecked: false,
                })
              }
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} · {words(mode, c.titleZh, c.titleEn)}
                </option>
              ))}
              <option value="custom">
                {words(mode, '我查的公开资料', 'A public source I found')}
              </option>
            </select>
          </label>
          {e.lessonId === 'custom' ? (
            <>
              {field(
                `证据${i + 1}来源名称与年份`,
                `Evidence ${i + 1} source title/year`,
                e.sourceTitle,
                (v) =>
                  update({
                    evidence: d.evidence.map((a, j) =>
                      j === i ? { ...a, sourceTitle: v } : a,
                    ),
                    evidenceChecked: false,
                  }),
                150,
              )}
              <label className="geo-writing">
                {words(
                  mode,
                  `证据${i + 1}资料网址`,
                  `Evidence ${i + 1} source URL`,
                )}
                <input
                  type="url"
                  maxLength={1000}
                  value={e.url}
                  onChange={(event) =>
                    update({
                      evidence: d.evidence.map((v, j) =>
                        j === i ? { ...v, url: event.target.value } : v,
                      ),
                      evidenceChecked: false,
                    })
                  }
                />
              </label>
            </>
          ) : (
            <details>
              <summary>
                {words(
                  mode,
                  '展开本课来源核对地点与年份',
                  'Open course sources to check place/year',
                )}
              </summary>
              {courses
                .find((c) => c.id === e.lessonId)
                ?.sources.map((s) => (
                  <p key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title}
                    </a>
                  </p>
                ))}
            </details>
          )}
          {field(
            `证据${i + 1}：直接观察到什么（含地点／时段）？`,
            `Evidence ${i + 1}: observed fact, place/period?`,
            e.observation,
            (v) =>
              update({
                evidence: d.evidence.map((a, j) =>
                  j === i ? { ...a, observation: v } : a,
                ),
                evidenceChecked: false,
              }),
          )}
          {field(
            `证据${i + 1}：如何支持我的形成解释？`,
            `Evidence ${i + 1}: how does it support my explanation?`,
            e.inference,
            (v) =>
              update({
                evidence: d.evidence.map((a, j) =>
                  j === i ? { ...a, inference: v } : a,
                ),
                evidenceChecked: false,
              }),
          )}
          {field(
            `证据${i + 1}：不能由它单独断定什么？`,
            `Evidence ${i + 1}: what cannot it establish alone?`,
            e.limit,
            (v) =>
              update({
                evidence: d.evidence.map((a, j) =>
                  j === i ? { ...a, limit: v } : a,
                ),
                evidenceChecked: false,
              }),
          )}
        </section>
      ))}
      {tick(
        '我核对两条资料与本地点相关，分清观察／推论，注明时段与局限',
        'I checked both sources relate to this place, separating observation/inference and stating period/limits',
        d.evidenceChecked,
        (v) => update({ evidenceChecked: v }),
      )}
      <h3>
        {words(mode, '④ 中英讲给别人听', '④ Explain in Chinese and English')}
      </h3>
      {field(
        '中文讲解：在哪里、怎样形成、证据与局限',
        'Chinese explanation: where, processes, evidence and limits',
        d.explanationZh,
        (v) => update({ explanationZh: v }),
      )}
      {field(
        '英文讲解：在哪里、怎样形成、证据与局限',
        'English explanation: where, processes, evidence and limits',
        d.explanationEn,
        (v) => update({ explanationEn: v }),
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '可以写稿，或分别口头讲完再勾选；程序不录音，也不判断讲解是否正确。',
            'Write a script or tick each language after explaining aloud. The app records no audio and does not judge correctness.',
          )}
        />
      </p>
      {tick(
        '我已用中文口头讲解',
        'I explained aloud in Chinese',
        d.spokenZh,
        (v) => update({ spokenZh: v }),
      )}
      {tick(
        '我已用英文口头讲解',
        'I explained aloud in English',
        d.spokenEn,
        (v) => update({ spokenEn: v }),
      )}
      <div className="geo-feedback" role="status">
        <ul>
          {Object.entries(checks).map(([key, done]) => (
            <li key={key}>
              {done ? '✓' : '○'}{' '}
              {words(
                mode,
                {
                  map: '位置图核对',
                  process: '三步过程与自己的说明',
                  evidence: '两条证据、推论与局限',
                  bilingual: '双语书面或口头讲解',
                }[key]!,
                {
                  map: 'Location map checked',
                  process: 'Three process steps and own descriptions',
                  evidence: 'Two observations, inferences and limits',
                  bilingual: 'Written/oral explanation in both languages',
                }[key]!,
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="geo-choices">
        <button
          className="geo-button"
          onClick={() =>
            downloadFile(
              'my-landscape-report.html',
              reportHtml(d, courses),
              'text/html;charset=utf-8',
            )
          }
        >
          {words(mode, '导出完整地貌报告', 'Export landscape report')} ↓
        </button>
        <button
          className="geo-button secondary"
          onClick={() =>
            downloadFile(
              'my-landscape-report.md',
              reportMarkdown(d, courses),
              'text/markdown;charset=utf-8',
            )
          }
        >
          {words(mode, '导出文字稿', 'Export notes')} ↓
        </button>
        <button
          className="geo-button secondary"
          onClick={() =>
            downloadFile(
              'my-landscape-map.svg',
              reportMapSvg(d),
              'image/svg+xml;charset=utf-8',
            )
          }
        >
          {words(mode, '导出位置图', 'Export location map')} ↓
        </button>
        <button
          className="geo-button secondary"
          onClick={() =>
            downloadFile(
              'my-landscape-process.svg',
              reportProcessSvg(d),
              'image/svg+xml;charset=utf-8',
            )
          }
        >
          {words(mode, '导出过程图', 'Export process diagram')} ↓
        </button>
      </div>
    </div>
  );
}
