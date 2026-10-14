import { useId, useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ActivityState } from './progress';
import { t, words } from './content';
import { Text } from './ui';
import {
  coordinateMatch,
  coordinateTargets,
  isLit,
  meetingWorks,
  skillFinished,
  skillValue,
  timeDates,
} from './skillModels';
import {
  CityClocks,
  CoordinateMap,
  DayNightDiagram,
  GridGlobe,
  LightComparison,
  MeridianBand,
  OrbitDiagram,
  quarterNames,
  RatioDiagram,
  ScaleMap,
} from './SkillVisuals';
type Props = {
  id: string;
  mode: LanguageMode;
  state: ActivityState;
  onChange: (state: ActivityState) => void;
  panel?: number;
  mission?: boolean;
};

function Range({
  mode,
  name,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = '',
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (n: number) => void;
}) {
  const inputId = useId();
  return (
    <div className="geo-skill-range">
      <label htmlFor={inputId}>
        <Text mode={mode} text={name} />
        <strong>
          {value}
          {unit}
        </strong>
      </label>
      <div className="geo-skill-slider">
        <button
          aria-label={words(mode, `减少：${name.zh}`, `Decrease: ${name.en}`)}
          disabled={value <= min}
          onClick={() =>
            onChange(Math.max(min, Number((value - step).toFixed(4))))
          }
        >
          −
        </button>
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <button
          aria-label={words(mode, `增加：${name.zh}`, `Increase: ${name.en}`)}
          disabled={value >= max}
          onClick={() =>
            onChange(Math.min(max, Number((value + step).toFixed(4))))
          }
        >
          +
        </button>
      </div>
    </div>
  );
}
export function SkillExplorer({
  id,
  mode,
  state,
  onChange,
  panel = 0,
  mission = false,
}: Props) {
  const [message, setMessage] = useState(
    t(
      '先预测，再操作，用图里的证据解释。',
      'Predict first, then use the model to gather evidence.',
    ),
  );
  const d = state.decisions;
  const distance = d['scale-input'] ?? '';
  const patch = (key: string, value: string | number) =>
    onChange({ ...state, decisions: { ...d, [key]: String(value) } });
  const status = (
    <div
      className={`geo-feedback ${skillFinished(id, d) ? 'success' : ''}`}
      role="status"
    >
      <Text
        mode={mode}
        text={
          skillFinished(id, d)
            ? t(
                '✓ 任务证据齐全。接下来用自己的话解释。',
                '✓ Evidence recorded. Explain it in your own words next.',
              )
            : message
        }
      />
    </div>
  );
  if (id === 'GEO-005') {
    const zoom = skillValue(d, 'zoom', 1, 1, 2);
    if (panel === 1 && !mission) return <RatioDiagram mode={mode} />;
    return (
      <div className="geo-skill-explorer">
        <ScaleMap mode={mode} zoom={zoom} route={panel === 2 || mission} />
        <Range
          mode={mode}
          name={t('地图放大倍率', 'Map zoom')}
          value={zoom}
          min={1}
          max={2}
          step={0.25}
          unit="×"
          onChange={(v) => patch('zoom', v)}
        />
        <p className="geo-notice">
          <Text
            mode={mode}
            text={t(
              '图上的两点会分开，线段尺的公里数也会变。请把 A–B 与线段尺比较：地点之间的实地距离有没有改变？',
              'The points spread apart and the bar’s kilometre value changes. Compare A–B with the bar: did the ground distance change?',
            )}
          />
        </p>
        {mission && (
          <>
            <div className="geo-skill-answer">
              <label>
                <span>
                  {words(
                    mode,
                    'A 到 B 的直线距离（km）',
                    'Direct distance A–B (km)',
                  )}
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  inputMode="decimal"
                  value={distance}
                  onChange={(e) => patch('scale-input', e.target.value)}
                />
              </label>
              <button
                className="geo-button secondary"
                onClick={() => {
                  if (
                    !distance.trim() ||
                    !Number.isFinite(Number(distance)) ||
                    Math.abs(Number(distance) - 10) > 0.1
                  ) {
                    setMessage(
                      t(
                        '先数 A–B 约有几条线段尺，再乘以当前尺上标的公里数。放大地图不会把学校搬远。',
                        'Count scale-bar lengths along A–B, then multiply by the bar’s current kilometre value. Zooming does not move the school.',
                      ),
                    );
                    return;
                  }
                  if (zoom !== 1 && zoom !== 2) {
                    setMessage(
                      t(
                        '估计正确。请分别把倍率设为 1× 和 2×，各记录一次距离。',
                        'Good estimate. Record once at exactly 1× and once at 2×.',
                      ),
                    );
                    return;
                  }
                  patch(zoom === 1 ? 'scale-wide' : 'scale-close', '10');
                  setMessage(
                    t(
                      '✓ 用当前线段尺得到约10公里；继续用另一个倍率核对。',
                      '✓ The current bar gives about 10 km. Check the other zoom level too.',
                    ),
                  );
                }}
              >
                {words(mode, '用线段尺核对', 'Check with the scale bar')}
              </button>
            </div>
            <p className="geo-caption">
              1× {d['scale-wide'] === '10' ? '✓' : '○'} · 2×{' '}
              {d['scale-close'] === '10' ? '✓' : '○'}
            </p>
            <p>
              <Text
                mode={mode}
                text={t(
                  '棕色通路由三段组成：3公里、10公里、3公里。请计算沿路总长；直线测量和沿路测量能回答同一个问题吗？',
                  'The brown path has three segments: 3 km, 10 km and 3 km. Add them. Do direct and path distances answer the same question?',
                )}
              />
            </p>
            <div className="geo-skill-answer">
              <label>
                <span>
                  {words(
                    mode,
                    '沿棕色通路的距离（km）',
                    'Distance along the brown path (km)',
                  )}
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  inputMode="decimal"
                  value={d['route-input'] ?? ''}
                  onChange={(e) => patch('route-input', e.target.value)}
                />
              </label>
              <button
                className="geo-button secondary"
                onClick={() => {
                  if (Number(d['route-input']) === 16) {
                    patch('scale-route', '16');
                    setMessage(
                      t(
                        '✓ 3＋10＋3＝16公里，比直线10公里长。路线受连接与障碍限制。',
                        '✓ 3 + 10 + 3 = 16 km, longer than the 10 km direct distance. Connections and obstacles constrain routes.',
                      ),
                    );
                  } else
                    setMessage(
                      t(
                        '逐段加起来，别把直线的10公里当作沿路总长。',
                        'Add each segment; the 10 km direct distance is not the entire path.',
                      ),
                    );
                }}
              >
                {words(mode, '核对沿路距离', 'Check path distance')}
              </button>
            </div>
            {status}
          </>
        )}
      </div>
    );
  }
  if (id === 'GEO-006') {
    if (!mission && panel < 2)
      return (
        <GridGlobe mode={mode} kind={panel === 0 ? 'latitude' : 'longitude'} />
      );
    const lat = skillValue(d, 'latitude', 0, -90, 90),
      lon = skillValue(d, 'longitude', 0, -180, 180);
    const target = coordinateTargets.find(
      (p) => d[`located-${p.id}`] !== `${p.lat},${p.lon}`,
    );
    return (
      <div className="geo-skill-explorer">
        {mission && (
          <div className="geo-notice">
            <Text
              mode={mode}
              text={
                target
                  ? t(
                      `请定位 ${target.zh}：${Math.abs(target.lat)}°${target.lat < 0 ? 'S' : target.lat > 0 ? 'N' : ''}，${Math.abs(target.lon)}°${target.lon < 0 ? 'W' : 'E'}。`,
                      `Locate ${target.en}: ${Math.abs(target.lat)}°${target.lat < 0 ? 'S' : target.lat > 0 ? 'N' : ''}, ${Math.abs(target.lon)}°${target.lon < 0 ? 'W' : 'E'}.`,
                    )
                  : t(
                      '三个区域都定位了。可继续移动，观察坐标如何变化。',
                      'Three regions located. Keep moving to explore how coordinates change.',
                    )
              }
            />
          </div>
        )}
        <CoordinateMap mode={mode} lat={lat} lon={lon} />
        <div className="geo-skill-controls">
          <Range
            mode={mode}
            name={t(
              '纬度：负值南纬，正值北纬',
              'Latitude: negative south, positive north',
            )}
            value={lat}
            min={-90}
            max={90}
            step={5}
            unit="°"
            onChange={(v) => patch('latitude', v)}
          />
          <Range
            mode={mode}
            name={t(
              '经度：负值西经，正值东经',
              'Longitude: negative west, positive east',
            )}
            value={lon}
            min={-180}
            max={180}
            step={5}
            unit="°"
            onChange={(v) => patch('longitude', v)}
          />
        </div>
        <p className="geo-caption">
          <Text
            mode={mode}
            text={t(
              `你的点：纬度 ${lat}°，经度 ${lon}°。先读纬度，再读经度；本课以5°步长估计区域位置。`,
              `Your point: latitude ${lat}°, longitude ${lon}°. Latitude first, longitude second. This activity uses 5° steps for regional estimates.`,
            )}
          />
        </p>
        {mission && (
          <>
            <button
              className="geo-button secondary"
              disabled={!target}
              onClick={() => {
                if (!target) return;
                if (coordinateMatch(lat, lon, target)) {
                  patch(`located-${target.id}`, `${lat},${lon}`);
                  setMessage(
                    t(
                      '✓ 两条参考线交在目标区域。这个坐标不是精确地址。',
                      '✓ The reference lines intersect in the target region. This is not an exact address.',
                    ),
                  );
                } else
                  setMessage(
                    lat !== target.lat
                      ? t(
                          '先看赤道两侧：北纬为正，南纬为负。把纬度线移到目标数字。',
                          'First use the equator: north is positive and south is negative. Move latitude to the requested number.',
                        )
                      : t(
                          '纬度正确；再核对0°经线的东、西侧。西经使用负值，东经使用正值。',
                          'Latitude matches. Check east/west of 0° longitude: west is negative, east is positive.',
                        ),
                  );
              }}
            >
              {words(mode, '标记这个位置', 'Mark this location')}
            </button>
            <div className="geo-choices">
              {coordinateTargets.map((p) => (
                <span className="geo-badge" key={p.id}>
                  {d[`located-${p.id}`] === `${p.lat},${p.lon}` ? '✓' : '○'}{' '}
                  {words(mode, p.zh, p.en)}
                </span>
              ))}
            </div>
            {status}
          </>
        )}
      </div>
    );
  }
  if (id === 'GEO-007') {
    if (!mission && panel === 0)
      return (
        <DailyExplorer
          mode={mode}
          rotation={skillValue(d, 'daily-angle', 0, 0, 360)}
          onChange={(v) => patch('daily-angle', v)}
        />
      );
    if (!mission && panel === 1) return <MeridianBand mode={mode} />;
    const date = skillValue(d, 'time-date', 0, 0, 1),
      hour = skillValue(d, 'utc-hour', 12, 0, 23);
    return (
      <div className="geo-skill-explorer">
        <div
          className="geo-choices"
          role="group"
          aria-label={words(mode, '选择对照日期', 'Choose comparison date')}
        >
          {timeDates.map((text, i) => (
            <button
              key={text}
              aria-pressed={date === i}
              onClick={() => patch('time-date', i)}
            >
              {text} {d[`meeting-${i}`] !== undefined ? '✓' : ''}
            </button>
          ))}
        </div>
        <Range
          mode={mode}
          name={t('同一时刻：UTC 小时', 'Same instant: UTC hour')}
          value={hour}
          min={0}
          max={23}
          unit=":00"
          onChange={(v) => patch('utc-hour', v)}
        />
        <CityClocks mode={mode} date={date} hour={hour} />
        <p className="geo-caption">
          <Text
            mode={mode}
            text={t(
              '明确日期的当地钟表时间，不是太阳时；使用设备的时区规则，无需联网。无法读取时区规则时使用已核查的2026年示例。',
              'Local clock time for explicit dates, not solar time; device time-zone rules work offline. A verified 2026 example is used if time-zone support is unavailable.',
            )}
          />
        </p>
        {mission && (
          <>
            <p className="geo-notice">
              <Text
                mode={mode}
                text={t(
                  '为一次虚构通话选时间：奥克兰19:00–21:00，伦敦07:00–09:00。先安排一月，再安排七月，并比较两地时差。无需真的发送邀请。',
                  'Arrange a fictional call: Auckland 19:00–21:00 and London 07:00–09:00. Try January, then July, and compare the clock gap. No invitation is sent.',
                )}
              />
            </p>
            <button
              className="geo-button secondary"
              onClick={() => {
                if (meetingWorks(date, hour)) {
                  patch(`meeting-${date}`, hour);
                  setMessage(
                    t(
                      '✓ 两地钟表都在约定窗口内。换一个日期，观察夏令时怎样改变时差。',
                      '✓ Both clocks fit the requested windows. Switch date to see how daylight saving changes the gap.',
                    ),
                  );
                } else
                  setMessage(
                    t(
                      '看两张时钟：不能只让其中一方时间合适。滑动UTC小时，留意当地日期也可能改变。',
                      'Check both clocks, not just one. Move UTC hour and notice that the local date can also change.',
                    ),
                  );
              }}
            >
              {words(mode, '记录这个通话时刻', 'Record this call time')}
            </button>
            {status}
          </>
        )}
        <details>
          <summary>
            {words(
              mode,
              '没有时区功能时的纸笔对照',
              'Paper comparison without time-zone support',
            )}
          </summary>
          <p>
            <Text
              mode={mode}
              text={t(
                '2026-01-15：奥克兰UTC+13，伦敦UTC+0，东京UTC+9，檀香山UTC−10。2026-07-15：奥克兰UTC+12，伦敦UTC+1，其余相同。相加超过24小时要进到下一日期；负值退到前一日期。',
                '15 Jan 2026: Auckland UTC+13, London UTC+0, Tokyo UTC+9, Honolulu UTC−10. On 15 Jul: Auckland UTC+12, London UTC+1, others unchanged. Carry values beyond 24 into the next date, and negative values into the previous date.',
              )}
            />
          </p>
        </details>
      </div>
    );
  }
  if (id === 'GEO-008') {
    const rotation = skillValue(d, 'daily-angle', 0, 0, 360),
      quarter = skillValue(d, 'year-quarter', 1, 0, 3),
      tilt = skillValue(d, 'axis-tilt', 23.4, 0, 23.4);
    const record = (key: string) => patch(`observed-${key}`, 'yes');
    return (
      <div className="geo-skill-explorer">
        {(panel === 0 || mission) && (
          <>
            <DailyExplorer
              mode={mode}
              rotation={rotation}
              onChange={(v) => patch('daily-angle', v)}
            />
            {mission && (
              <button
                className="geo-button secondary"
                onClick={() => {
                  if (rotation !== 0 && rotation !== 180) {
                    setMessage(
                      t(
                        '请分别到0°和180°，记录观察点在光照与背光的一侧。边界不是全天白昼或黑夜。',
                        'Use 0° and 180° to record the observer in light and darkness; the boundary is neither a full day nor a full night.',
                      ),
                    );
                    return;
                  }
                  record(isLit(rotation) ? 'day' : 'night');
                  setMessage(
                    t(
                      '✓ 同一个点随着自转进入不同光照条件；太阳没有绕观察点转一圈。',
                      '✓ Rotation carries the same point into a different lighting condition; the Sun has not circled the observer.',
                    ),
                  );
                }}
              >
                {words(mode, '记录此处的昼／夜', 'Record day/night here')}
              </button>
            )}
          </>
        )}
        {(panel > 0 || mission) && (
          <>
            <div
              className="geo-choices"
              role="group"
              aria-label={words(mode, '一年中的位置', 'Position in the year')}
            >
              {quarterNames.map((name, i) => (
                <button
                  key={i}
                  aria-pressed={quarter === i}
                  onClick={() => patch('year-quarter', i)}
                >
                  <Text mode={mode} text={name} />
                </button>
              ))}
            </div>
            <div
              className="geo-choices"
              role="group"
              aria-label={words(mode, '改变地轴倾角', 'Change axial tilt')}
            >
              {[23.4, 0].map((angle) => (
                <button
                  key={angle}
                  aria-pressed={tilt === angle}
                  onClick={() => patch('axis-tilt', angle)}
                >
                  {angle}°{' '}
                  {angle === 0
                    ? words(mode, '假如没有倾斜', 'What if: no tilt')
                    : words(mode, '地球近似倾角', 'Earth’s approximate tilt')}
                </button>
              ))}
            </div>
            {panel === 1 || mission ? (
              <OrbitDiagram mode={mode} quarter={quarter} tilt={tilt} />
            ) : null}
            <LightComparison mode={mode} quarter={quarter} tilt={tilt} />
            {mission && (
              <button
                className="geo-button secondary"
                onClick={() => {
                  const key =
                    tilt === 0
                      ? 'untilted'
                      : quarter === 1
                        ? 'june'
                        : quarter === 3
                          ? 'december'
                          : '';
                  if (!key) {
                    setMessage(
                      t(
                        '先比较六月和十二月的相反昼长，再把倾角改成0°。分点附近两地的昼长接近12小时。',
                        'Compare opposite June/December daylight first, then set tilt to 0°. Near equinoxes, daylight is close to 12 hours in both places.',
                      ),
                    );
                    return;
                  }
                  record(key);
                  setMessage(
                    tilt === 0
                      ? t(
                          '✓ 零倾角对照：一年里理想昼长保持约12小时，纬度不同仍有不同太阳高度。',
                          '✓ Zero-tilt comparison: ideal daylight stays about 12 hours through the year, while solar altitude still differs with latitude.',
                        )
                      : t(
                          '✓ 记录了相反的半球变化。用昼长和正午太阳高度解释，不把它当作气温预报。',
                          '✓ Opposite hemispheric changes recorded. Explain with daylight and noon altitude; this is not a temperature forecast.',
                        ),
                  );
                }}
              >
                {words(
                  mode,
                  '记录这组光照证据',
                  'Record this sunlight evidence',
                )}
              </button>
            )}
          </>
        )}
        {mission && (
          <>
            <div className="geo-choices">
              {[
                ['day', '白昼', 'Day'],
                ['night', '黑夜', 'Night'],
                ['june', '六月', 'June'],
                ['december', '十二月', 'December'],
                ['untilted', '零倾角', 'No tilt'],
              ].map(([key, zh, en]) => (
                <span key={key} className="geo-badge">
                  {d[`observed-${key}`] === 'yes' ? '✓' : '○'}{' '}
                  {words(mode, zh!, en!)}
                </span>
              ))}
            </div>
            {status}
          </>
        )}
      </div>
    );
  }
  return null;
}
function DailyExplorer({
  mode,
  rotation,
  onChange,
}: {
  mode: LanguageMode;
  rotation: number;
  onChange: (n: number) => void;
}) {
  return (
    <>
      <DayNightDiagram mode={mode} rotation={rotation} />
      <Range
        mode={mode}
        name={t(
          '自转角度（固定轨道位置）',
          'Rotation angle (fixed orbital position)',
        )}
        value={rotation}
        min={0}
        max={360}
        step={90}
        unit="°"
        onChange={onChange}
      />
      <p className="geo-caption">
        <Text
          mode={mode}
          text={t(
            '按方向键逐帧推进，或用滑块。一次自转约一天；本图把公转位置固定，只观察昼夜。',
            'Use arrow keys or the slider to advance frames. A solar day is about one rotation; orbital position stays fixed here to isolate day/night.',
          )}
        />
      </p>
    </>
  );
}
