import type { LanguageMode } from '@study/shared';
import { useEffect, useRef } from 'react';
import { t } from './model';
import { Text } from './ui';
import {
  temperatureReading,
  signedAxisPosition,
  signedLabel,
  signedWhole,
} from './signedModels';
export function SignedFrame({
  children,
  mode,
  caption,
  focus,
}: {
  children: React.ReactNode;
  mode: LanguageMode;
  caption: ReturnType<typeof t>;
  focus?: { min: number; max: number; point: number };
}) {
  const region = useRef<HTMLDivElement>(null);
  const previousWidth = useRef(0);
  const focusMin = focus?.min,
    focusMax = focus?.max,
    focusPoint = focus?.point;
  useEffect(() => {
    const element = region.current;
    if (
      !element ||
      focusMin === undefined ||
      focusMax === undefined ||
      focusPoint === undefined
    )
      return;
    const align = () => {
      if (!element.clientWidth) return;
      const fits = focusMax - focusMin <= element.clientWidth - 48;
      let next = element.scrollLeft;
      if (previousWidth.current !== element.clientWidth) {
        const center = fits ? (focusMin + focusMax) / 2 : focusPoint;
        next = center + 12 - element.clientWidth / 2;
      } else {
        // Keep the axis still while a unit move remains visible; pan only at an edge.
        const low = (fits ? focusMin : focusPoint) + 12,
          high = (fits ? focusMax : focusPoint) + 12;
        if (low < next + 24) next = low - 24;
        if (high > next + element.clientWidth - 24)
          next = high - element.clientWidth + 24;
      }
      previousWidth.current = element.clientWidth;
      element.scrollLeft = Math.max(
        0,
        Math.min(element.scrollWidth - element.clientWidth, next),
      );
    };
    align();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (previousWidth.current !== element.clientWidth) align();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [focusMin, focusMax, focusPoint]);
  return (
    <figure className="math-signed-figure">
      <div
        ref={region}
        className="math-signed-scroll"
        tabIndex={0}
        role="region"
        aria-label={
          mode === 'en'
            ? 'Signed-number model; scroll within the figure'
            : '有符号数模型；在图内滚动'
        }
      >
        {children}
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export function Thermometer({
  value = -4,
  interval = 5,
  mode,
}: {
  value?: number;
  interval?: number;
  mode: LanguageMode;
}) {
  const m = temperatureReading(value);
  if (![1, 5].includes(interval))
    throw new RangeError('Choose a supported label interval');
  return (
    <SignedFrame
      mode={mode}
      caption={t(
        '假想摄氏刻度，每小格 1°C，零上与零下使用同样大小的间隔。显示窗底端 −15°C 不是最低温；零度也不表示没有温度。',
        'A fictional Celsius scale with equal 1°C intervals above and below zero. The displayed bottom at −15°C is not the lowest possible temperature; zero does not mean an absence of temperature.',
      )}
    >
      <svg
        viewBox="0 0 300 450"
        style={{ minWidth: 300, height: 450 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Indicator ${m.steps} one-degree intervals ${m.side === 'below' ? 'below zero' : m.side === 'above' ? 'above zero' : 'from zero; at zero'}`
            : `指示线在零${m.side === 'below' ? '下' : m.side === 'above' ? '上' : '处'}，相隔 ${m.steps} 个一度小格`
        }
      >
        <rect
          x="94"
          y="40"
          width="30"
          height="360"
          rx="12"
          className="signed-tube"
        />
        <rect
          data-temperature-column
          x="100"
          y={m.y}
          width="18"
          height={m.bottomY - m.y}
          className="signed-temperature"
        />
        {Array.from({ length: 31 }, (_, i) => i - 15).map((n) => (
          <g key={n}>
            <line
              x1="130"
              x2={n % 5 === 0 ? 154 : 144}
              y1={40 + (15 - n) * 12}
              y2={40 + (15 - n) * 12}
              className={n === 0 ? 'signed-zero' : 'signed-tick'}
            />
            {(n % interval === 0 || n === 0) && (
              <text x="162" y={45 + (15 - n) * 12}>
                {signedLabel(n)}°C
              </text>
            )}
          </g>
        ))}
        <line
          data-temperature-indicator
          x1="72"
          x2="131"
          y1={m.y}
          y2={m.y}
          className="signed-indicator"
        />
        <text x="17" y={m.y + 5}>
          P
        </text>
        <text x="94" y="426">
          °C
        </text>
      </svg>
    </SignedFrame>
  );
}
type Point = { value: number; label: string };
type Segment = { from: number; to: number; arrow?: boolean };
export function SignedAxis({
  points,
  segments = [],
  min = -12,
  max = 12,
  interval = 2,
  mode,
}: {
  points: Point[];
  segments?: Segment[];
  min?: number;
  max?: number;
  interval?: number;
  mode: LanguageMode;
}) {
  const base = signedAxisPosition(0, min, max),
    position = (v: number) => signedAxisPosition(v, min, max).x;
  if (![1, 2, 4].includes(interval))
    throw new RangeError('Choose an integer label interval');
  const grouped = new Map<number, string[]>();
  const coordinates = points.map((p) => position(p.value));
  points.forEach((p) => {
    signedWhole(p.value, min, max);
    grouped.set(p.value, [...(grouped.get(p.value) ?? []), p.label]);
  });
  segments.forEach((s) => {
    position(s.from);
    position(s.to);
  });
  return (
    <SignedFrame
      mode={mode}
      focus={{
        min: Math.min(base.zeroX, ...coordinates),
        max: Math.max(base.zeroX, ...coordinates),
        point: coordinates[coordinates.length - 1] ?? base.zeroX,
      }}
      caption={t(
        '从左向右数值增大，零的两边每一格同样大。带字母的点表示位置；线段表示已展示的移动或到零距离。重合点合并标签，不把零长度画成一步。',
        'Values increase from left to right with equal unit intervals on both sides of zero. Lettered points mark positions; segments show revealed movement or distance to zero. Coincident points share a label; a zero-length segment is not a step.',
      )}
    >
      <svg
        viewBox={`0 0 ${base.width} 225`}
        style={{ minWidth: base.width, height: 225 }}
        role="img"
        aria-label={
          mode === 'en'
            ? `Integer axis ${min} to ${max}; ${points.map((p) => `${p.label} at ${signedLabel(p.value)}`).join('; ')}`
            : `整数数轴 ${signedLabel(min)} 到 ${signedLabel(max)}；${points.map((p) => `${p.label} 在 ${signedLabel(p.value)}`).join('；')}`
        }
      >
        <line
          x1="24"
          y1="135"
          x2={base.width - 24}
          y2="135"
          className="signed-axis"
        />
        <polygon
          points={`${base.width - 18},135 ${base.width - 28},130 ${base.width - 28},140`}
          className="signed-arrow"
        />
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
          <g key={n}>
            <line
              x1={position(n)}
              x2={position(n)}
              y1={n === 0 ? 123 : 130}
              y2={n === 0 ? 147 : 142}
              className={n === 0 ? 'signed-zero' : 'signed-tick'}
            />
            {(n % interval === 0 || n === min || n === max) && (
              <text x={position(n)} y="166" textAnchor="middle">
                {signedLabel(n)}
              </text>
            )}
          </g>
        ))}
        {segments.map((s, i) => {
          const x1 = position(s.from),
            x2 = position(s.to),
            y = 56 + i * 22,
            right = x2 > x1;
          return (
            <g key={i} data-signed-segment data-from={s.from} data-to={s.to}>
              <line x1={x1} y1={y} x2={x2} y2={y} className="signed-motion" />
              {x1 === x2 ? (
                <circle cx={x1} cy={y} r="3" className="signed-point" />
              ) : s.arrow === false ? (
                <>
                  <line
                    x1={x1}
                    x2={x1}
                    y1={y - 5}
                    y2={y + 5}
                    className="signed-motion"
                  />
                  <line
                    x1={x2}
                    x2={x2}
                    y1={y - 5}
                    y2={y + 5}
                    className="signed-motion"
                  />
                </>
              ) : (
                <polygon
                  points={`${x2},${y} ${x2 + (right ? -9 : 9)},${y - 5} ${x2 + (right ? -9 : 9)},${y + 5}`}
                  className="signed-arrow"
                />
              )}
            </g>
          );
        })}
        {[...grouped].map(([value, labels]) => (
          <g key={value} data-signed-point={value}>
            <circle
              cx={position(value)}
              cy="135"
              r="6"
              className="signed-point"
            />
            <text x={position(value)} y="111" textAnchor="middle">
              {labels.join('=')}
            </text>
          </g>
        ))}
        <text x="28" y="207">
          {mode === 'en' ? 'One small interval = 1' : '每小格 = 1'}
        </text>
      </svg>
    </SignedFrame>
  );
}
