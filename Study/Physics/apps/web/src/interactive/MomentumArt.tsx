import type { MomentumKind } from './momentumModels';
export function MomentumArt({ kind }: { kind: MomentumKind }) {
  if (kind === 'impulse' || kind === 'restraints')
    return (
      <g>
        <path d="M45 35V115H255" stroke="#6e617e" strokeWidth="2" fill="none" />
        <path
          d={
            kind === 'impulse'
              ? 'M50 110L125 45L200 110Z'
              : 'M50 110V60H210V110Z'
          }
          fill="#e5c895"
          stroke="#9b80b0"
          strokeWidth="3"
        />
        <text x="170" y="38" fill="#6c5b7c" fontSize="16">
          J = Δp
        </text>
        <text x="215" y="135" fill="#6c5b7c" fontSize="15">
          t
        </text>
      </g>
    );
  return (
    <g>
      <path d="M25 116H275" stroke="#b9b1c1" strokeWidth="2" />
      <rect x="45" y="75" width="60" height="32" rx="8" fill="#d9bc85" />
      <rect x="195" y="75" width="60" height="32" rx="8" fill="#ae99bf" />
      {[57, 93, 207, 243].map((x) => (
        <circle key={x} cx={x} cy="110" r="6" fill="#71647d" />
      ))}
      <path
        d={
          kind === 'separation'
            ? 'M125 90H113m0 0l9-6m-9 6l9 6M175 90h12m0 0l-9-6m9 6l-9 6'
            : 'M116 90h58m-10-6l10 6l-10 6'
        }
        fill="none"
        stroke="#8f7b9f"
        strokeWidth="3"
      />
      <text x="48" y="48" fill="#6c5b7c" fontSize="18">
        {kind === 'quantity'
          ? 'p = mv'
          : kind === 'collisions'
            ? 'Σp same · K ?'
            : 'Σpafter − Σpbefore = Jext'}
      </text>
    </g>
  );
}
