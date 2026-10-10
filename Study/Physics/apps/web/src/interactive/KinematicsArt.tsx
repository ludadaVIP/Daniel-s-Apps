import type { KinematicsKind } from './kinematicsModels';
export function KinematicsArt({ kind }: { kind: KinematicsKind }) {
  const color = '#f2ce83';
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.5">
      {kind === 'position' ? (
        <>
          <path d="M28 102H270M78 92v20M172 92v20M235 92v20" />
          <circle cx="235" cy="77" r="12" fill={color} />
          <path d="M78 55h155m-10 -7l10 7 -10 7M172 124h-55m10 -7l-10 7 10 7" />
          <text x="72" y="82" fill="currentColor" stroke="none">
            O₁
          </text>
          <text x="161" y="82" fill="currentColor" stroke="none">
            O₂
          </text>
        </>
      ) : kind === 'journey' ? (
        <>
          <path d="M34 90H264M58 67H241l-10 -7m10 7l-10 7M241 111H58l10 -7m-10 7l10 7" />
          <circle cx="58" cy="90" r="10" fill={color} />
          <text x="118" y="48" fill="currentColor" stroke="none">
            Δx = 0
          </text>
        </>
      ) : kind === 'velocity' ? (
        <>
          <path d="M30 84H270M53 54H98l-8 -6m8 6l-8 6M246 54H201l8 -6m-8 6l8 6" />
          {[53, 150, 246].map((x) => (
            <circle key={x} cx={x} cy="84" r="10" fill={color} />
          ))}
          <text x="135" y="57" fill="currentColor" stroke="none">
            v=0
          </text>
          <text x="43" y="116" fill="currentColor" stroke="none">
            +2
          </text>
          <text x="233" y="116" fill="currentColor" stroke="none">
            −2
          </text>
        </>
      ) : kind === 'average' ? (
        <>
          <path d="M45 116V33M45 116H260M45 105Q146 -4 247 105" />
          <path d="M45 105H247" stroke={color} />
          <circle cx="146" cy="52" r="5" fill={color} />
          <text x="130" y="134" fill="currentColor" stroke="none">
            0→8 s
          </text>
        </>
      ) : (
        <>
          <path d="M45 116V33M45 116H260M57 100L243 44M57 44L243 100" />
          <path d="M120 81H204V55" stroke={color} />
          <text x="129" y="102" fill="currentColor" stroke="none">
            Δt
          </text>
          <text x="213" y="80" fill="currentColor" stroke="none">
            Δv
          </text>
          {kind === 'rate' && (
            <text x="93" y="137" fill="currentColor" stroke="none">
              a = Δv / Δt
            </text>
          )}
        </>
      )}
    </g>
  );
}
