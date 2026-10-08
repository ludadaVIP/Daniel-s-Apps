import { MeasurementArt } from './interactive/MeasurementArt';
import { MysteryArt } from './interactive/MysteryArt';
import { DiscoveryArt } from './interactive/DiscoveryArt';
import { MotionArt } from './interactive/MotionArt';
import { ForceArt } from './interactive/ForceArt';
import { GravityArt } from './interactive/GravityArt';
import { EnergyArt } from './interactive/EnergyArt';
import { WorkArt } from './interactive/WorkArt';
import { PhaseArt } from './interactive/PhaseArt';
import { ThermalArt } from './interactive/ThermalArt';
import { DensityArt } from './interactive/DensityArt';
import { MeasurementSkillsArt } from './interactive/MeasurementSkillsArt';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import { t } from './content/schema';
export function Text({
  value,
  mode,
  className = '',
}: {
  value: LocalizedText;
  mode: LanguageMode;
  className?: string;
}) {
  return (
    <Localized
      text={value}
      mode={mode}
      className={className}
      secondaryClassName="phy-en"
    />
  );
}
export function B({
  zh,
  en,
  mode,
}: {
  zh: string;
  en: string;
  mode: LanguageMode;
}) {
  return <Text value={t(zh, en)} mode={mode} />;
}
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    home: 'm3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9',
    path: 'M5 4h14v16H5zM8 8h8M8 12h5M8 16h8',
    lab: 'M9 3h6M10 3v7L4 20h16l-6-10V3M7 15h10',
    book: 'M4 3h16v18H4zM8 3v18M11 8h6M11 12h6',
    review: 'M4 10a8 8 0 1 1 1 8M4 4v6h6M12 7v5l3 2',
    arrow: 'M5 12h14m-5-5 5 5-5 5',
    check: 'm5 12 4 4L19 6',
    sparkle: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
    clock: 'M12 8v5l3 2',
    globe: 'M3 12h18M12 3c-6 6-6 12 0 18 6-6 6-12 0-18',
    close: 'm6 6 12 12M6 18 18 6',
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'clock' || name === 'globe' ? (
        <circle cx="12" cy="12" r="9" />
      ) : null}
      <path d={paths[name] ?? paths.sparkle} />
    </svg>
  );
}
export function LessonArt({
  kind,
  small = false,
}: {
  kind: string;
  small?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 300 150"
      className={`phy-lesson-art ${small ? 'small' : ''}`}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`dots-${kind}`}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r=".8" fill="currentColor" opacity=".13" />
        </pattern>
      </defs>
      <rect width="300" height="150" fill={`url(#dots-${kind})`} />
      {kind.startsWith('phase-') ? (
        <PhaseArt kind={kind} />
      ) : kind.startsWith('thermal-') ? (
        <ThermalArt kind={kind} />
      ) : kind.startsWith('work-') ? (
        <WorkArt kind={kind} />
      ) : kind.startsWith('energy-') ? (
        <EnergyArt kind={kind} />
      ) : [
          'density-compare',
          'density-block',
          'density-displacement',
          'density-float',
        ].includes(kind) ? (
        <DensityArt kind={kind} />
      ) : ['mass-weight', 'moon-weight', 'gravity-fall'].includes(kind) ? (
        <GravityArt kind={kind} />
      ) : [
          'force-effects',
          'force-balance',
          'grip-friction',
          'paper-drag',
        ].includes(kind) ? (
        <ForceArt kind={kind} />
      ) : ['reference', 'journey', 'average', 'motion-graph'].includes(kind) ? (
        <MotionArt kind={kind} />
      ) : ['volume', 'accuracy', 'repeats', 'paper'].includes(kind) ? (
        <MeasurementSkillsArt kind={kind} />
      ) : ['mirror', 'static', 'seatbelt', 'fair-test'].includes(kind) ? (
        <DiscoveryArt kind={kind} />
      ) : ['floating', 'boats', 'bounce', 'echo'].includes(kind) ? (
        <MysteryArt kind={kind} />
      ) : [
          'quantities',
          'units',
          'time',
          'mass',
          'temperature',
          'data',
          'graph',
        ].includes(kind) ? (
        <MeasurementArt kind={kind} />
      ) : kind === 'friction' ? (
        <>
          <path d="M25 113h250" stroke="currentColor" opacity=".3" />
          <path
            d="M40 91h60m-10-8 10 8-10 8"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="151" cy="88" r="27" fill="#b8aedf" />
          <path d="m146 64 17 7 5 17-15 12-18-9 1-18Z" fill="#7867ab" />
          <path d="m118 83 10 3m42 21 5-9" stroke="#7867ab" strokeWidth="3" />
          <path
            d="M193 90h47"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
        </>
      ) : kind === 'variables' ? (
        <>
          <path
            d="M70 111h162M88 34v76m22-76v76M178 34v76m22-76v76"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M82 34h34m56 0h34" stroke="currentColor" strokeWidth="4" />
          <path d="M89 79h20v31H89z" fill="#b2a4d4" />
          <path d="M179 56h20v54h-20z" fill="#e2ad71" />
          <circle cx="148" cy="56" r="20" fill="#fff" />
          <path d="M140 56h16m-8-8v16" stroke="currentColor" strokeWidth="2" />
        </>
      ) : kind === 'observation' ? (
        <>
          <circle cx="145" cy="68" r="34" fill="#e3bb92" />
          <circle cx="145" cy="68" r="17" fill="#f7efe4" />
          <path
            d="m171 94 24 24M90 57h14m-6-7v14M205 39v19m-9-9h18"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      ) : kind === 'length' ? (
        <>
          <rect x="51" y="74" width="195" height="33" rx="4" fill="#e8c888" />
          {Array.from({ length: 20 }, (_, i) => (
            <path
              key={i}
              d={`M${59 + i * 9} 74v${i % 5 === 0 ? 20 : 11}`}
              stroke="#87683b"
            />
          ))}
          <path d="m87 57 104-20 6 13-104 20-14-4Z" fill="#8878b5" />
        </>
      ) : (
        <>
          <path d="M25 118h250" stroke="currentColor" opacity=".3" />
          <path d="M52 63h40m-52 18h48" stroke="currentColor" strokeWidth="3" />
          <rect x="100" y="56" width="80" height="40" rx="12" fill="#90b7af" />
          <circle cx="118" cy="99" r="12" fill="#426e65" />
          <circle cx="164" cy="99" r="12" fill="#426e65" />
          <path
            d="M222 36v79m0-76h29v22h-29"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M223 39h14v11h-14m14 11h14V50h-14" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
