import type { TrajectoryKind } from './trajectoryModels';
export function TrajectoryArt({ kind }: { kind: TrajectoryKind }) {
  const color = '#f2ce83';
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.5">
      {kind === 'fall' || kind === 'projectile' ? (
        <>
          <path d="M45 38V117H268" />
          <path
            d={kind === 'fall' ? 'M110 38V112' : 'M45 38Q167 38 246 114'}
            stroke={color}
          />
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              cx={kind === 'fall' ? 110 : 45 + i * 65}
              cy={38 + i * i * 8}
              r="5"
              fill={color}
            />
          ))}
          <text x="164" y="38" fill="currentColor" stroke="none">
            {kind === 'fall' ? '½gt²' : 'x / y'}
          </text>
        </>
      ) : kind === 'equations' ? (
        <>
          <rect x="38" y="35" width="221" height="84" rx="10" />
          <text x="67" y="65" fill="currentColor" stroke="none">
            u · v · a · t · s
          </text>
          <text x="77" y="98" fill="currentColor" stroke="none">
            v = u + at
          </text>
        </>
      ) : (
        <>
          <path d="M40 116V30M40 116H268" />
          <path
            d={
              kind === 'position'
                ? 'M45 108Q149 -4 250 108'
                : kind === 'acceleration'
                  ? 'M45 48H114V78H183V108H253'
                  : 'M45 104L250 45'
            }
            stroke={color}
          />
          {kind === 'velocity' && (
            <path
              d="M45 48L250 108M45 48V78H148Z M148 78H250V108Z"
              stroke={color}
              fill={color}
              fillOpacity=".2"
            />
          )}
          {kind === 'uniform' && (
            <path d="M45 104Q191 111 250 45" strokeDasharray="6 5" />
          )}
          <text x="146" y="139" fill="currentColor" stroke="none">
            {kind === 'position'
              ? 'x–t'
              : kind === 'acceleration'
                ? 'a–t'
                : 'v–t'}
          </text>
        </>
      )}
    </g>
  );
}
