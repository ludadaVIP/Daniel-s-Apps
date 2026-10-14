# 地理第一版验收记录

验收日期：2026-10-13。范围：GEO-001–004；其余 92 课仅作为规划目录。

## 自动检查

- [x] 全工作区类型检查、ESLint 和生产构建通过。
- [x] 全工作区 759 项测试通过，其中地理 11 项。
- [x] 六阶段各 16 课，96 个连续编号；仅首四课发布。
- [x] 已发布课程的双语 Markdown、家长指引、纸笔替代、题目和本地素材齐全。
- [x] 素材清单包含来源、许可、照片年份；真实影像与教学示意图明确区分。
- [x] 方位旋转、过河限制、任务证据、存储解析和七天回访日期通过测试。

## 浏览器检查

在独立开发入口 `localhost:3461` 完成以下操作，测试学习记录与 Study 正式入口隔离。

- [x] GEO-001：照片放大与关闭、观察猜想、三幅图解、错误线索提示、三类地表定位、文字解释、回顾和完成记录。
- [x] 刷新后保留环节、笔记与已完成状态；首页和目录显示探索记录。
- [x] GEO-002：错误位置可重试，七洲五洋全部定位；切换太平洋居中；编号具备双语位置描述。
- [x] GEO-003：真实南岛影像、道路示意、地形示意分别回答对应问题，三个任务均能完成。
- [x] GEO-004：旋转 90° 后地理方位保持不变；直接跨河被拒绝并提供原因；经过桥南、桥、桥北到达图书馆后记录任务完成。
- [x] 中文、英文、双语切换；双语目录可用英文标题检索。
- [x] S6 显示 16 个规划条目，不能当作已发布课程进入学习。
- [x] 已完成课程的回访问题可重试，正确后记录下一次七天回访。
- [x] 手帐导出为可读 Markdown，包含四课标题、笔记、自评与家庭反馈。
- [x] 390 × 844 手机视口：菜单能打开导航并在选课后关闭；手帐与课程页面无整页横向溢出，世界地图保留内部横向查看。
- [x] 手机路线图保持 44 像素以上操作目标，并显示地点名称。
- [x] 当前验收页浏览器无错误或警告日志。
- [x] 更新生产构建后，Study 首页显示五个学科，点击地理可进入 `localhost:3456/geography`；正式入口保持首次学习状态。

## 留给家庭验收

- [ ] 孩子实际试学的时长、兴趣、独立解释与迁移能力。
- [ ] 真实触屏拖放、不同浏览器及辅助技术的完整兼容性；第一版始终提供点击与键盘替代。
- [ ] 家长对内容难度、图解有效性和后续课程优先级的反馈。

长期效果、家庭实测与全部 96 课内容未包含在本次完成声明中。

## GEO-005–008 扩展验收（2026-10-13）

当前开放8课；原首版记录保留为历史验收，不代表已开发全部96课。

- [x] 全工作区类型检查、ESLint通过；Study Hub与地理独立入口生产构建通过，767项测试通过（地理19项）。
- [x] 新增四课的双语正文、三幅图解模块、任务、两道回顾题与迁移题、术语、家长指引、纸笔替代与来源完整。
- [x] GEO-005：错误距离得到线段尺提示；键盘放大到2×，两次均核对10公里，另算16公里通路，任务完成。
- [x] GEO-006：用方向键分别标出40°S/175°E、25°N/15°E、0°/150°W，任务完成。
- [x] GEO-007：不合适的通话时刻给出两地窗口提示；UTC07:00在一月／七月分别显示奥克兰20:00／19:00、伦敦07:00／08:00，并显示檀香山前一当地日期。
- [x] GEO-008：记录0°／180°自转、六月、十二月、零倾角五项观察；半球光照反向变化，零倾角时两地昼长约12小时，太阳高度仍不同。
- [x] 新课笔记与环节刷新后保留，原GEO-001笔记与完成状态仍存在。
- [x] 两个四课组的家庭反馈互不覆盖，旧反馈仍可读取。
- [x] 导出含GEO-001–008八个课程标题、新旧笔记和两组反馈；自评使用可读双语。
- [x] 390×844英文手机图解和手帐没有整页横向溢出；经纬图在318像素容器内部显示640像素画面。
- [x] 手机坐标可用44像素的加／减按钮精确调节；滑块也支持键盘逐帧操作。
- [x] 验收页浏览器没有错误或警告日志。
- [x] `localhost:3456/geography` 已展示八课正式版本，八张课程卡和S1的8课开放／8课规划状态一致；测试学习记录未写入正式入口。

实地试学反馈与跨浏览器完整兼容性仍需要家庭验收。扩展图均是明确标记的原创教学示意，不把理想光照数值或虚构社区距离当作实测数据；核查说明见 `metadata/fact-checks.md`。

## GEO-009–012 expansion · 2026-10-13

- [x] 12 complete bilingual lessons,84 remaining planned; S1 has12 available and4 planned. Study hub card and README match the published count. Original pilot remains intact.
- [x] Six new model checks cover contour/section intersections at50/100m intervals, same-rise ground distances, downstream-only channel connections and a closed-lake barrier, explicit climate period/units/grid/source hash, exact leap-year month weights, every required mission evidence key and compatible local sessions/third feedback group.
- [x] Full workspace773 tests passed (shared2, chemistry server1, geography25, biology57, pinyin32, physics656). Final geography25 rechecked after exact calendar-day aggregation. Workspace TypeScript and ESLint passed; standalone and hub production builds passed. Existing large Chemistry/Biology bundle warnings remain.
- [x] Browser completed all four new missions with intentional wrong choices and retry. GEO-010 recorded both plan/section and compared50/100m. GEO-011 rejected the disconnected lake, then accepted source→confluence→bend→mouth and required divide/exception reasoning. GEO-012 required all five cells plus latitude/elevation/period judgments.
- [x] GEO-012 went through prediction, mission, saved explanation, recall with a wrong-answer hint/retry, self-reflection and completion. Reload preserved its note, mission and step. Original GEO-001 completion/note, GEO-005 note, and existing first two feedback groups were still present.
- [x] Third feedback group saved independently; returning to first group retained old feedback. Exported Markdown contains exactly12 course headings and all three feedback groups.
- [x] Mobile390×844 bilingual checks: contour labels and controls, river buttons44×44px, real relief asset loaded, all three climate story panels. A newly found grid intrinsic-width overflow was corrected: document width/scrollWidth both390; climate map internally318/640 with swipe guidance. Desktop viewport restored afterwards.
- [x] New NASA imagery and visualization credits checked, exact capture/release dates distinguished. Original climate NetCDF inspected directly:1991/01/01–2020/12/31, all cells30valid years,2m air temperature in K. Script output and lessons agree on the plateau cell−7.6°C after exact calendar weighting.
- [ ] Actual family trial, independent child explanation and delayed learning effectiveness remain unverified. Browser QA records are labelled acceptance examples and are isolated on development port3461. Main Study preview port3456 retains the family's own learning state.

## S1 completion audit and S2 first batch · 2026-10-13

Current publication: GEO-001–020 (20 lessons), 76 still planned. S1 has16 available; S2 has4 available/12 planned. The Plan remains the96-lesson specification; no claim of96 completed lessons or actual family learning outcomes.

- [x] GEO-013–016 existing work audited and documentation brought into sync. Browser completed three land-use cases plus inference limits, seven NZ locations plus island comparison, all four photo cases with two clues/uncertainty/revealed-source checks, and the S1 atlas process checklist.
- [x] GEO-016 HTML download inspected: standalone vector geometry, twelve labels, three actual authored acceptance findings, all three long evidence paragraphs and selected GEO-005 source citations; no scripts/iframes. Reload preserved long paragraphs and S1 evidence selections. The editor now excludes S2 source options that the S1 draft reader would otherwise reset.
- [x] GEO-017 four layer placements, mistaken mantle answer with explanatory feedback, retry, evidence choice and successful task status verified. Reload retained placements and completed mission status. Visual QA corrected the inner-core leader endpoint so it lies inside the inner-core circle.
- [x] GEO-018 range moved using keyboard Home, near-fit recorded, fossil evidence chosen; divergence/convergence/transform frame4 observations and matching arrows all required before success.
- [x] GEO-019 observed locked/deformed/slipped/wave frames, selected underground focus and vertically projected epicentre, interpreted catalogue limits, and selected official indoor protective action. Completed browser mission. Optional table provides every121 record with UTC time, longitude/latitude, magnitude type and depth.
- [x] GEO-020 all three cases completed with their setting, melting condition and surface-arrival observation; hotspot exception required. Historic Ruapehu imagery/source/capture date verified, with no current-alert claims.
- [x] GEO-017–020 English390×844 mission pages had document clientWidth=scrollWidth=390. Illustrations retain internal318/600 horizontal scroll; explicit swipe guidance, focusable scroll regions, arrow-key scrolling and button alternatives added. Temporary viewport restored and language returned to bilingual.
- [x] Original v1 local records and fifth feedback group validated by tests; no change to the storage key or clearing of prior sessions. Browser acceptance records use127.0.0.1:3461 and clearly labelled example atlas text, separate from the family's localhost:3456 storage.
- [x] Workspace TypeScript, ESLint and786 tests passed (geography38, shared2, chemistry server1, biology57, pinyin32, physics656). Geography standalone and Study Hub production builds passed. Final changed packages rechecked after accessibility/count changes. Vite still reports large geography/chemistry/biology chunks; builds succeed. No runtime data calls or remote tile service introduced.
- [x] USGS catalogue rebuild script ran successfully on downloaded original bytes:121 unique earthquake events, correct time/magnitude/location domains, inclusive API end boundary excluded, original-response SHA256 recorded. NASA/USGS reuse and source distinctions recorded in the asset manifest and fact-checks.
- [x] Hub lesson count and geography stage labels derive from curriculum publication status, preventing a stale hardcoded count when another batch opens.
- [ ] Actual child/family trial, spoken explanation quality, touch-device/cross-browser full coverage and delayed retention remain pending.

Next content batch: GEO-021–024 (mountain building, rock cycle, weathering/erosion, river journeys). Reuse the model family; add checked real cases and keep model/observation distinctions. Continue in four-lesson batches and update publication, factual/asset records and QA together.

## GEO-021–024 landscape processes · 2026-10-14

Current publication: GEO-001–024 (24 complete bilingual lessons), 72 still planned. S1 has16 available; S2 has8 available/8 planned. Earlier batch totals above are historical records.

- [x] Four lessons include bilingual stories, predictions, three diagram panels, required hands-on evidence, explanations, recall/transfer questions, terms, parent guidance, paper alternatives and verified sources.
- [x] GEO-021 browser mission compared compression frames0/4, located the Southern Alps, corrected a pure-slip answer, identified crustal thickening and observed all three uplift/removal budgets before matching rise/stability/lowering. Reload retained mission status. The constant-area block and arbitrary height budget are explicitly teaching analogies, without measured crust geometry or forecasts.
- [x] GEO-022 labelled all five network edges, tried an invalid cooling operation without changing the rock state, traversed all five valid processes and directly metamorphosed igneous rock. Solid-state metamorphism and the limits of photo identification were required. Arrow endpoints and bilingual node labels inspected visually; omitted chemical/biological sedimentary paths are stated.
- [x] GEO-023 operated breakup→transport→deposition in sequence, tracked eight retained particle symbols, matched process names and reviewed0/50/100% reveals of the same NASA Padma series. Endpoint labels show only the visible year;50% is a reveal, not an interpolated date. Position-change evidence and chemical weathering were required, with no unsupported causal/rate claims.
- [x] GEO-024 intentionally submitted a wrong order, received a height-based hint and reordered the fictional300→100→0 profile. All three river-condition cases, speed uncertainty and the different-place photo limit were required. Full prediction→mission→explanation→recall/transfer→reflection→completion flow verified; a wrong recall answer could be retried. Reload and the homepage retained completed status and the clearly labelled acceptance note.
- [x] Seven model tests check compression conservation/clamps, three budgets, valid/invalid rock transitions, eight-particle continuity, sorting repair/bounds, every required mission evidence key and v1-record/sixth-feedback compatibility. No storage-key change or family-record clearing.
- [x] Workspace TypeScript and ESLint passed;793 tests passed (geography45, shared2, chemistry server1, biology57, pinyin32, physics656). Final geography and Hub production builds passed after visual refinements; new source files passed final ESLint. Vite still reports large geography/chemistry/biology chunks.
- [x] English390×844 mission pages for all four new lessons had document clientWidth=scrollWidth=390. Final bilingual rock-network check also had390/390, with a318px viewport scrolling its520px diagram internally; normal599px page shows the complete527px diagram. Button/keyboard alternatives remain. Temporary viewport reset after verification.
- [x] Eight new real images inspected and attributed; capture dates distinguished from publication dates. Padma images share a720×480 extent with verified1988-01-02 and2018-01-20 captures. NPS/USGS source-published display renditions keep all eight new images near2MB total. Manifest contains55 unique cleared assets; original diagrams are identified as teaching models.
- [x] Main Study homepage at localhost:3456 visibly shows24 complete courses, all four new cards and S2's8 available/8 planned status. Browser acceptance records were confined to127.0.0.1:3461; the family's formal entry retains its own progress. No error/warning logs on the final tested lesson page.
- [ ] Real family trials, independent explanation quality, delayed retention and full touch/cross-browser/assistive-technology coverage remain pending.

Next content batch: GEO-025–028 (meanders/floodplains, glaciers, coasts and soil). Continue source-checked four-lesson batches with explicit observation/model boundaries and synchronized publication, asset and QA records.

## GEO-025–028 surface processes · 2026-10-14

Current publication: GEO-001–028 (28 complete bilingual lessons), 68 still planned. S1 has16 available; S2 has12 available/4 planned. Earlier totals remain historical batch records.

- [x] Four complete bilingual lessons retain seven steps, three story panels, prediction, required manipulation/observations, learner explanation, three recall/transfer questions, terms, parent guidance, paper alternatives, checked source links and per-lesson asset references.
- [x] GEO-025: tried a map site without a tool and an incorrect deposition label on outer A; received relevant guidance, then labelled A/D erosion, B/E deposition and C floodplain. B accepted keyboard Enter; other map sites and button alternatives were exercised. Frames0/4, ordinary/high water and lateral-change/dry-ground limits required. Reload retained completed mission and assignments. Opposite curvature prevents a page-left/right shortcut; final flow arrows stay on the channel and follow local tangents.
- [x] GEO-026: focused both V/U sections, matched their floors, observed frames0/4 for advance/stationary/retreat and matched all three fronts. Deliberately chose uphill ice motion, then retried down-valley and completed abrasion/history reasoning. The red ice marker still moves down-valley when the front retreats. Bilingual final sections visually inspected; right panel was inset to retain its complete border.
- [x] GEO-027: matched scarp, beach and rock-remnant stack; observed both approach directions at0/8, inferred opposite net transport, opened all three sediment budgets and matched gain/balance/loss. A wrong single-photo growth claim gave a budget hint and could be retried. Mission complete. English reversed drift and bilingual6+1−3=4 budget visually inspected; symbolic stock is explicitly distinct from measured beach width.
- [x] GEO-028: default wrong layer order failed with a rebuilding hint; up/down controls produced O–A–B–C–R, then explicit checking succeeded. Water0/25/50, all four constituents, air loss, transported parent material, hydroponic plant requirements and photo-colour limits required. Completed prediction→mission→clearly labelled acceptance explanation→all recall/transfer questions→self-reflection→record. Wrong universal-profile recall gave a hint and retry. Reload preserved choices, checked profile, note and step; homepage shows GEO-028 as explored.
- [x] Nine model tests check opposite bend roles, comparable V/U extents, three-front/down-valley ice motion, reversible swash/backwash routes, sediment conservation, fixed shared pore volume/clamps, layer-order repair/bounds, every mandatory mission evidence key and old-v1/seventh-feedback compatibility. No storage-key change or record clearing.
- [x] Workspace TypeScript and ESLint passed; final visual file lint and geography/Hub builds passed after layout refinements. Test results total802 passed: geography54, shared2, chemistry server1, biology57, pinyin32, physics656. Initial concurrent workspace run timed out in two Physics domain sweeps at5000ms; targeted44 tests then passed, and the complete Physics656 suite passed with `--maxWorkers=4`. No physics source/test-timeout changes were made. Vite still reports large geography/chemistry/biology chunks; builds succeed.
- [x] All four English mission pages tested at390×844: viewport/document width both390, model containers318px with520px internal scroll. Curved-map interactive groups measured45.5×45.5px after enlarging their transparent hit areas; separate button and keyboard controls remain available. Bilingual soil profile/pore grid and V/U/budget models inspected at the normal599px viewport. Temporary viewport override reset.
- [x] Six new NPS real photos visually inspected, source credit/licence checked and publisher rendition URLs retained; seven original model assets labelled2026 teaching diagrams. Total68 unique publishable assets all exist locally and every lesson reference resolves. No external runtime data request introduced. Soil photo catalogue creation date is distinguished from independently verified capture time, with the selected public NPS record and SHA256 archived.
- [x] Formal `localhost:3456/geography` visibly shows28 complete courses, all four new cards and S2's12 available/4 planned status. Study root still links five subjects. Acceptance notes and learning actions remained on isolated127.0.0.1:3461; formal entry retains its own initial learning state.
- [ ] Actual family trial, independent child explanation, delayed retention and complete touch-device/cross-browser/assistive-technology coverage remain pending.

Next content batch: GEO-029–032 (water-cycle alternatives, ocean-current/climate comparisons, integrated NZ plate-boundary evidence and the Landscape Detective stage report). Maintain verified real observations, explicit model limits, bilingual evidence and synchronized publication/asset/QA records.

## GEO-029–032 · water, ocean and S2 landscape report · 2026-10-14

Current publication: GEO-001–032 (32 complete bilingual lessons),64 still planned. S1 and S2 each have16 available; S3–S6 remain planned. Earlier totals above are historical batch records.

- [x] Every new lesson has eight complete bilingual Markdown blocks, seven steps, three story panels, outcomes/terms, a prediction, authored explanation, three recall/transfer questions, parent prompts/paper alternative and source citations. The original96-ID Plan is preserved.
- [x] GEO-029 browser acceptance: attempted condensation from surface rainwater and received a connection hint; completed the river/ocean/cloud, soil/plant/cloud and soil/groundwater/river paths. Matched five processes, compared permeable/paved partitions and explained cloud state, energy/gravity and conditional proportions. Mission complete; reload retained all three discoveries, current route and reasoning. Keyboard scrolling and button alternatives checked. Diagram is a branching selected network, not a compulsory timed loop.
- [x] GEO-030: inspected all three currents, selected both months/A/B to read20.3/17.9°C in January and26.4/21.4°C in July, and observed both conceptual incoming-water cases at frames0/4. All current meanings, variable, drivers and multi-factor climate reasoning required; mission complete. Bilingual July SST colours, grey land mask, equal-latitude markers, units/period and heat-model limits visually inspected. Fixed inherited600px table minimum with a three-column table that fits the viewport.
- [x] GEO-031: toggled boundary/range/quake layers on, inspected all three segments and matched Hikurangi Pacific-under/Alpine oblique/Puysegur Australian-under. Combined evidence, historical-selection limitations and coexisting long-term/event timescales required; mission complete. Geographic coast/line/mountain/190-point placement and depth shape legend visually inspected. Source event table is separately expandable and scrollable; diagrams do not forecast hazard.
- [x] GEO-032: created clearly labelled acceptance text with bilingual title, three own process descriptions, two observation/inference/limit entries referencing GEO-021/031 and written Chinese/English explanation. Four checks completed. Switching to custom case reset map/process/evidence checks while preserving draft writing; up/down reorder reset process check. Rechecked and reloaded, retaining the writing/choices and complete checklist. Oral checkboxes remained unchecked. Downloaded the actual standalone HTML and inspected its title, embedded map/process SVG, all own writing and eight original source links. Export has no scripts or runtime remote imagery.
- [x] GEO-032 whole-lesson completion: recorded a prediction, wrote a separate acceptance summary, tried an incorrect evidence recall response and saw a helpful retry hint, completed all three recall questions, self-reflected and recorded exploration. Reload/homepage displays GEO-032 explored. These are acceptance examples, not evidence of actual child learning.
- [x] Source-data transformation verified against raw NOAA NetCDF and matching land mask; four values and30 valid years checked. Rebuilding from exact source files reproduced the derived local data. GeoNet191 raw records yielded190 earthquake-type records; original IDs, UTC, source precision, type/depth/status, exact query, SHA256, DOI and CC BY3.0 NZ/sponsor acknowledgement retained.78 unique publishable assets exist locally and all lesson references resolve. Scientific/licence notes recorded in metadata/fact-checks.md.
- [x] Final English missions for all four lessons checked in actual390×844 embedded browser course viewports: document clientWidth=scrollWidth=390; each model scroll container318px with680px internal illustration. Direct browser viewport override initially did not change the existing tab layout, so explicit iframe dimensions provided real390px media-query/layout verification. Default599px inspection and normal browser views also used; overflow repair rechecked. Temporary viewport override reset and harness/export preview tab closed.
- [x] Local v1 storage keeps S1 atlas and S2 report independent, long writing/route evidence survives repair/reload, and the eighth four-course feedback block is supported. Tests check invalid route jumps, conservation, data dimensions/mask/time/selection, each mandatory mission record, report completeness, HTML/SVG escaping, invalid URLs, empty draft honesty and preservation of previous notes.
- [x] Workspace TypeScript and ESLint passed.811 tests passed: geography63, shared2, chemistry server1, biology57, pinyin32, physics656. Physics ran with maxWorkers4 to avoid unnecessary parallel load; no other-subject source/test changes. Final geography and Study Hub builds passed after responsive-table and source-label refinements. Vite continues to report large geography/chemistry/biology chunks; builds succeed.
- [x] Formal localhost:3456/geography visibly shows32 complete courses, four new cards and S2's16 available/0 planned. Formal entry still shows0/32 explored; all acceptance learning actions used127.0.0.1:3461. Saved final homepage preview with all four new cards. No account, upload, location collection or external runtime data API introduced.

Next planned batch: GEO-033–036 (weather versus climate, atmosphere, wind/pressure, clouds/rain). Continue sequential source-checked batches, with weather dates and climatology periods clearly distinguished.

## GEO-033–036 weather foundations · 2026-10-14

Current publication: GEO-001–036 (36 complete bilingual lessons),60 still planned. S1/S2 each16 available; S3 has4 available/12 planned. Earlier totals remain historical batch records.

- [x] Four complete lessons retain seven steps, three editable bilingual story panels, prediction, required comparison/manipulation, learner explanation, three recall/transfer questions, terms, parent guidance, paper alternatives, checked sources and cleared assets. Source/assumption/forecast boundaries are explicit. Manifest86 unique cleared assets; newly added NASA ISS photograph inspected locally.
- [x] GEO-033: inspected both2020-01-11/15 UTC daily graphics and both South Island/European climatology cells; deliberately classified a daily estimate as climate, received a time-scale hint, retried and completed four classification cards plus daily/mean/season reasoning. Reload retained selections and completed mission. Temperature and precipitation axes separated; top-axis/header spacing corrected after visual inspection. Mean rate is mm/day liquid-water equivalent, not monthly total, rain frequency or station observation.
- [x] GEO-034: matched weather/ozone/meteor/ISS/outer transition to five layers, compared both IR conditions and answered re-emission/variable-boundary questions. Mission complete. English diagrams inspected; no text extended beyond the900-unit viewbox. Single-layer budgets conserve separately at surface, atmosphere and system; energy units are not °C.
- [x] GEO-035: compared0/4/12 hPa, northern/southern high-left and northern high-right cases; answered force, gradient, handedness, wind-from and equal-pressure limits. Mission complete. North-up reversal correctly switches map bend while retaining right relative to motion. Red force and blue motion arrows visually distinct; same-pressure case draws no arbitrary contour. No trajectory or speed forecast.
- [x] GEO-036: both parcels at0/1/2 km, tiny/grown conditions while cloudy. Growth selected at0 km still showed no cloud/no rain; drier1 km lacked cloud, drier2 km formed cloud. Deliberately chose “drier never forms cloud”, received cloud-base hint, retried and completed mission. Full prediction→three story panels→own acceptance-labelled explanation→recall/transfer→self-reflection→completion flow verified; wrong recall retried. Reload preserved reflection; homepage card explicitly showed GEO-036 “Can explain”.
- [x] English and bilingual390px iframe viewport checks on all four mission pages: body clientWidth=scrollWidth=390; model region318px, internal SVG720px. First mobile pass found a600px table minimum causing636px document overflow; weather-specific fixed-layout table repaired and all four rechecked. Direct page keyboard ArrowRight moved model scrollLeft0→40. Iframe keyboard/action automation is limited by backend focus handling; main-page controls were used for interaction verification.
- [x] Six model tests cover source/grid/month/date provenance, hemisphere seasonal contrast, three energy boundaries, reversed handedness and zero gradient, saturation/growth/LCL continuity/clamps, each required mission observation/reasoning key with retries, ninth feedback block and earlier v1-record preservation. No storage-key change or family-record clearing.
- [x] All nine workspace TypeScript checks and root ESLint passed.817 tests passed: geography69, shared2, chemistry server1, biology57, pinyin32, physics656. Geography and Hub production builds passed; pre-existing large-chunk warnings remain. Final accepted page showed no error/warning logs. Native pnpm shim attempted a dependency-manager reinstall; checks used existing local binaries/npm scripts without reinstalling dependencies.
- [x] Main Study entry at localhost:3456 showed36 complete courses and S1/S2/S3. S3 publication is4 available/12 planned. Browser learning acceptance confined to127.0.0.1:3461; formal family entry inspected read-only.
- [ ] Real family trials, independent explanation quality, delayed recall and complete touch/cross-browser/assistive-technology coverage remain pending.

Next content batch: GEO-037–040 (windward/leeward rain, climate zones, monsoons, hot/cold deserts). Continue four-lesson publication with original-data provenance and observation/model boundaries.

## GEO-037–040 climate processes · 2026-10-14

Current publication: GEO-001–040,40 complete bilingual lessons/56 planned. S1/S2 each16 available; S3 has8 available/8 planned. Earlier totals are historical batch records.

- [x] Four complete bilingual lessons preserve seven steps, three story panels, required comparison/manipulation plus reasoning, own explanation, three recall/transfer questions, terms, parent prompts/paper alternatives, source links and per-lesson cleared assets. Original96-ID roadmap preserved;96 unique cleared assets resolve locally.
- [x] GEO-037 browser mission: selected both station normals, activated the map hotspot with keyboard Enter, reversed west/east flow and inspected moist2km crest/descent cases. Compared dry1/2km and no-ridge centre. Deliberate wrong windward response gave a direction hint; retry completed all required interpretation/evidence. Reload retained completion. Final map title moved clear of northern coast. NIWA1981–2010 factual annual values2452/594 mm/year cited without copying report maps/photos; city dots/mountain band are approximate. Ideal complete crest rain-out is explicitly assumed, not a calculated rainfall forecast.
- [x] GEO-038: compared latitude belts/temperature, classified all five cells, observed equatorial/high-latitude equinox, northern polar summer/winter and opposite43°S seasons, then explained elevation/ocean/season/belt limits. Mission complete. Initial thick arrowhead visually flared the beam incorrectly; replaced with true parallel-sided50-unit perpendicular beam and50/sin-altitude footprint. Independent geometric test verifies width, angle and footprint for every lesson latitude/season preset. Final English43°S December diagram visually inspected, including all numeric displays. Astronomical heat belts are explicitly distinct from complete climate classifications.
- [x] GEO-039: keyboard Home/End/ArrowLeft changed symbolic contrast−2/+2/0 and visibly reversed H/L or removed this driver. Compared western and SE India-vicinity monthly rainfall; deliberate wrong cool-season direction received a contrast hint and could be retried. All six interpretation answers/five observations required; mission complete and reload retained it. IMD northeast-monsoon rain prevents the “cool season means no rain throughout Asia” shortcut. Near-coast GPCP cell includes ocean, not a Chennai station. Slider has no °C/hPa/date forecast interpretation.
- [x] GEO-040: compared both actual NASA images, both gridded data layers and all four Sahara/Gobi/Atacama/Antarctic-interior cases. Deliberately chose universally hot deserts, then retried using January/July evidence; completed four mechanism matches and four evidence-limit answers. Full mystery→prediction→three story panels→mission→acceptance-labelled written explanation→three recall/transfer questions→reflection→record flow exercised. Wrong cold-desert recall gave a useful hint/retry. Reload preserved completion/reflection and homepage card displayed “Can explain”. Snowy image, old ice stock, annual precipitation flow,250mm reference and relatively drier NZ station are not expanded into unsupported classifications.
- [x] All four English and bilingual course missions checked in actual390×844 iframe viewports: body clientWidth=scrollWidth=390; model containers318px with720px internal drawings. Responsive page layout and final bilingual desert header visually inspected. Browser viewport override did not resize the backend's existing/new full-page tab, so explicit iframe dimensions supplied actual media-query/layout verification. Override reset; temporary tabs closed and QA server stopped. Interactions verified on ordinary main pages; full touch/assistive-technology compatibility is not inferred from iframe checks.
- [x] Exact local GPCP V2.3 source12×72×144,2.5°,mm/day and NCEP2m temperature12×94×192,degK checked for1991–2020/all30valid years and finite/unmasked data. Month weights include8leap years; amount=mean daily rate×mean calendar month length, annual sum before rounding. Original grids/nearest centres remain distinct. Offline rebuild reproduced JSON metadata/sample values and exact precipitation SVG. GPCP Monthly CDR unrestricted public-use agreement and recommended citation/DOI checked; NASA publisher renditions visually inspected with acquisition/publication distinctions, all credits recorded.
- [x] Seven new model tests cover data/period/calendar/grid provenance and seasonal counterexamples, reversible mountain travel/LCL/dry descent, astronomical belt boundaries, solar day/angle/area including polar night and actual drawn parallel-beam geometry, symbolic monsoon reversal/zero/clamps, every mandatory mission key/retry and unchanged v1 history/tenth-feedback support. No family record clearing or storage-key migration.
- [x] All nine workspace TypeScript checks and root ESLint passed.824 tests passed: geography76,shared2,chemistry server1,biology57,pinyin32,physics656 (maxWorkers4). Geography/Study Hub builds passed after final copy/visual refinements; existing large-chunk warnings persist. Existing local binaries/npm scripts used without dependency reinstalls. Final accepted lesson page had no error/warning logs.
- [x] Formal localhost:3456 geography homepage visibly showed40 lessons, all four new cards and S3's8 open/8 planned status. Formal entry retained0/40 explored; all browser learning actions/acceptance writing used127.0.0.1:3461. Saved preview shows all four new course rows; no account, upload, location collection or live data API introduced.
- [ ] Actual family trials, independent explanation quality, delayed retention and complete touch/cross-browser/assistive-technology coverage remain pending.

Next planned batch: GEO-041–044 (rainforest diversity, biomes, polar/alpine adaptations, storms/extreme weather). Continue source-checked four-lesson batches, preserving mechanism-first explanations, regional counterexamples and explicit data/model limits.
