import { useId } from 'react';
import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { DataFigure } from './DataModellingVisuals';
import { fenceAudit, motionAudit } from './optimisationModels';
import { asNumber } from './calculusModels';
import { rational, textR } from './algebraModels';
const word = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
export function FenceFigure({
  mode,
  m,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof fenceAudit>;
}) {
  const xmax = m.length / 2,
    ymax = (m.length * m.length) / 8,
    px = (x: number) => 60 + (x / xmax) * 540,
    py = (y: number) => 330 - (y / ymax) * 260,
    curve = (lo: number, hi: number) =>
      Array.from({ length: 121 }, (_, i) => {
        const x = lo + ((hi - lo) * i) / 120;
        return `${px(x)},${py(x * (m.length - 2 * x))}`;
      }).join(' '),
    best = m.best[0],
    x = best ? asNumber(best) : 0,
    y = m.length - 2 * x,
    scale = 500 / m.length;
  return (
    <>
      <DataFigure
        mode={mode}
        name={t('围栏约束与面积图', 'Fence constraint and area plot')}
        caption={t(
          '横轴深度米，纵轴面积平方米。实线为连续可行部分，虚线仅作域外比较；整数模式只允许实心离散点。橙点与x标签保留全部最优解。正边长排除0和L/2；深度上限在正边长内可包含。',
          'Depth in metres is horizontal, area in square metres vertical. Solid curves show the continuous feasible part; dashed portions are outside it. Integer mode permits only discrete dots. Orange points and x labels retain every optimum. Positive sides exclude0 and L/2, while a cap inside that range is included.',
        )}
      >
        <svg
          viewBox="0 0 640 400"
          width="640"
          role="img"
          aria-label={word(
            mode,
            '面积与约束的真实坐标',
            'Exact area and constraint coordinates',
          )}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((q) => (
            <g key={q}>
              <line
                x1="60"
                x2="600"
                y1={py(ymax * q)}
                y2={py(ymax * q)}
                stroke="#d5e1e8"
              />
              <text x="48" y={py(ymax * q) + 4} textAnchor="end" fontSize="12">
                {Number((ymax * q).toFixed(2))}
              </text>
              <text x={px(xmax * q)} y="352" textAnchor="middle" fontSize="13">
                {xmax * q}
              </text>
            </g>
          ))}
          <line x1="60" x2="600" y1="330" y2="330" stroke="#34576a" />
          <line x1="60" x2="60" y1="70" y2="330" stroke="#34576a" />
          <polyline
            points={curve(0, xmax)}
            fill="none"
            stroke="#999"
            strokeDasharray="5 5"
          />
          {m.upper > 0 && !m.integer && (
            <polyline
              points={curve(0, m.upper)}
              fill="none"
              stroke="#5c4e9c"
              strokeWidth="3"
            />
          )}
          {m.integer &&
            m.candidates.map((c) => (
              <circle
                key={textR(c.x)}
                data-fence-candidate={textR(c.x)}
                data-area={textR(c.area)}
                cx={px(asNumber(c.x))}
                cy={py(asNumber(c.area))}
                r="4"
                fill="#426d9a"
              />
            ))}
          <line
            x1={px(m.upper)}
            x2={px(m.upper)}
            y1="70"
            y2="330"
            stroke="#a75a25"
            strokeDasharray="4 4"
          />
          {m.best.map((xr) => (
            <g key={textR(xr)}>
              <circle
                key={textR(xr)}
                data-fence-best={textR(xr)}
                data-area={textR(m.area(xr))}
                cx={px(asNumber(xr))}
                cy={py(asNumber(m.area(xr)))}
                r="7"
                fill="#db782d"
                stroke="#6e3610"
              />
              <text
                x={px(asNumber(xr))}
                y={py(asNumber(m.area(xr))) - 12}
                textAnchor="middle"
                fontSize="12"
              >
                x={textR(xr)}
              </text>
            </g>
          ))}
          <circle cx={px(0)} cy={py(0)} r="4" fill="white" stroke="#555" />
          <circle cx={px(xmax)} cy={py(0)} r="4" fill="white" stroke="#555" />
          <text x="20" y="26" fontSize="16">
            {word(mode, '面积 / 平方米', 'Area / m²')}
          </text>
          <text x="340" y="384" textAnchor="middle">
            {word(mode, '深度x / 米', 'Depth x / m')}
          </text>
        </svg>
      </DataFigure>
      <DataFigure
        mode={mode}
        name={t('最优围栏尺寸图', 'Optimal fence dimensions')}
        caption={t(
          '同一长度比例：两条竖边均为深度x，下边为y，上边是直墙，不计围栏。并列时画第一组，完整尺寸在核验表中保留。',
          'One length scale: both vertical sides are depth x; the bottom is width y. The wall at the top uses no fence. For ties the first is drawn and all dimensions remain in the audit.',
        )}
      >
        <svg
          viewBox="0 0 640 320"
          width="640"
          role="img"
          aria-label={word(
            mode,
            '两深一宽的三边围栏',
            'Three-sided fence with two depths and one width',
          )}
        >
          {best ? (
            <>
              <line
                x1="50"
                x2="590"
                y1="60"
                y2="60"
                stroke="#60666a"
                strokeWidth="10"
              />
              <path
                d={`M ${70 + scale * y} 60 V ${60 + scale * x} H 70 V 60`}
                fill="#e5efda"
                stroke="#4e7437"
                strokeWidth="4"
              />
              <text
                x={70 + (scale * y) / 2}
                y={90 + scale * x}
                textAnchor="middle"
              >
                y={Number(y.toFixed(3))} m
              </text>
              <text x={90 + scale * y} y={65 + (scale * x) / 2}>
                x={textR(best)} m
              </text>
              <text x="70" y="285">
                2x+y={m.length} m; A={textR(m.max!)} m²
              </text>
            </>
          ) : (
            <text x="320" y="160" textAnchor="middle">
              {word(
                mode,
                '无正边长可行矩形',
                'No feasible positive-sided rectangle',
              )}
            </text>
          )}
        </svg>
      </DataFigure>
    </>
  );
}
export function MotionFigure({
  mode,
  m,
  view,
}: {
  mode: LanguageMode;
  m: ReturnType<typeof motionAudit>;
  view: 'position' | 'velocity' | 'acceleration';
}) {
  const id = useId().replace(/:/g, ''),
    f = m[view],
    px = (x: number) => 60 + (540 * x) / m.end,
    py = (y: number) => 330 - ((y + 28) / 56) * 270,
    unit = view === 'position' ? 'm' : view === 'velocity' ? 'm/s' : 'm/s²',
    points = Array.from({ length: 241 }, (_, i) => {
      const t = (m.end * i) / 240;
      const exact = rational(BigInt(Math.round(t * 10000)), 10000n);
      return `${px(t)},${py(asNumber(f(exact)))}`;
    }).join(' '),
    v = f(m.t);
  return (
    <DataFigure
      mode={mode}
      name={t('运动时间图', 'Motion against time')}
      caption={t(
        '时间轴为秒。每次只画一种量，纵轴单位随位置、速度、加速度切换。橙点为所选时刻；图用于看变化，转向与路程由导数符号及精确分段表核验。',
        'Time is in seconds. Plot one quantity at a time; vertical units change with position, velocity or acceleration. The orange point marks the selected instant. Derivative signs and the exact segment table justify reversals and distance.',
      )}
    >
      <svg
        viewBox="0 0 640 400"
        width="640"
        role="img"
        aria-label={word(
          mode,
          '位置或导数量的时间坐标',
          'Time coordinates for position or its derivatives',
        )}
      >
        <defs>
          <clipPath id={id}>
            <rect x="60" y="60" width="540" height="270" />
          </clipPath>
        </defs>
        {[-24, -12, 0, 12, 24].map((y) => (
          <g key={y}>
            <line
              x1="60"
              x2="600"
              y1={py(y)}
              y2={py(y)}
              stroke={y === 0 ? '#536b75' : '#d8e2e8'}
            />
            <text x="48" y={py(y) + 4} textAnchor="end" fontSize="13">
              {y}
            </text>
          </g>
        ))}
        {Array.from({ length: m.end + 1 }, (_, t) => (
          <g key={t}>
            <text x={px(t)} y="351" textAnchor="middle" fontSize="14">
              {t}
            </text>
          </g>
        ))}
        <line x1="60" x2="60" y1="60" y2="330" stroke="#536b75" />
        <polyline
          data-motion-view={view}
          points={points}
          fill="none"
          stroke="#5c4e9c"
          strokeWidth="3"
          clipPath={`url(#${id})`}
        />
        <line
          x1={px(asNumber(m.t))}
          x2={px(asNumber(m.t))}
          y1="60"
          y2="330"
          stroke="#c07937"
          strokeDasharray="5 5"
        />
        <circle
          data-motion-time={textR(m.t)}
          data-motion-value={textR(v)}
          cx={px(asNumber(m.t))}
          cy={py(asNumber(v))}
          r="6"
          fill="#d77428"
        />
        <text x="20" y="26">
          {word(
            mode,
            view === 'position'
              ? '位置'
              : view === 'velocity'
                ? '速度'
                : '加速度',
            view,
          )}{' '}
          / {unit}
        </text>
        <text x="330" y="384" textAnchor="middle">
          {word(mode, '时间t / 秒', 'Time t / seconds')}
        </text>
      </svg>
    </DataFigure>
  );
}
