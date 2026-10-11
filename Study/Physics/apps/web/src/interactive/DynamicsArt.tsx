import type { DynamicsKind } from './dynamicsModels';
export function DynamicsArt({ kind }: { kind: DynamicsKind }) {
  if (kind === 'elevator')
    return (
      <>
        <path d="M90 40v130m140-130v130" stroke="#a7bab3" strokeWidth="3" />
        <rect x="115" y="70" width="90" height="75" rx="10" fill="#b39dca" />
        <circle cx="160" cy="91" r="8" fill="#f5d997" />
        <path d="M160 100v28m-13 0h26" stroke="#f5d997" strokeWidth="5" />
        <text x="160" y="185" textAnchor="middle">
          N=m(g+a)
        </text>
      </>
    );
  if (kind === 'drag' || kind === 'terminal')
    return (
      <>
        <circle cx="160" cy="106" r="21" fill="#efd28e" />
        <path
          d="M120 75v62m-9-11 9 11 9-11M200 137V75m-9 11 9-11 9 11"
          stroke="#b39dca"
          strokeWidth="5"
          fill="none"
        />
        <text x="160" y="185" textAnchor="middle">
          {kind === 'terminal' ? 'D=W · v≠0' : 'D=kv²'}
        </text>
      </>
    );
  if (kind === 'rockets')
    return (
      <>
        <path d="M120 110l65-35 45 35-45 35z" fill="#b39dca" />
        <path
          d="M108 92l-40 18 40 18"
          stroke="#efd28e"
          strokeWidth="5"
          fill="none"
        />
        <text x="160" y="185" textAnchor="middle">
          T=qve
        </text>
      </>
    );
  return (
    <>
      <path d="M55 142h210" stroke="#9fb3ac" strokeWidth="4" />
      <rect x="120" y="100" width="70" height="37" rx="8" fill="#efd28e" />
      {kind === 'cars' && (
        <>
          <circle cx="136" cy="139" r="9" fill="#b39dca" />
          <circle cx="174" cy="139" r="9" fill="#b39dca" />
        </>
      )}
      <path
        d="M200 110h45m-10-9 10 9-10 9M110 125H70m10-9-10 9 10 9"
        fill="none"
        stroke="#b39dca"
        strokeWidth="5"
      />
      <text x="160" y="185" textAnchor="middle">
        {kind === 'cars' ? 'Road → tyre' : '|fs|≤μsN'}
      </text>
    </>
  );
}
