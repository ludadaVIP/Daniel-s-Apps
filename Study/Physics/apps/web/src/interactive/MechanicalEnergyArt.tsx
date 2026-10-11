import type { MechanicalEnergyKind } from './mechanicalEnergyModels';
export function MechanicalEnergyArt({ kind }: { kind: MechanicalEnergyKind }) {
  const formula = {
    angle: 'W = Fs cosθ',
    braking: 'Wnet = ΔK',
    height: 'ΔU = mgΔh',
    spring: 'U = ½kx²',
    conservation: 'K + U + Q = E',
    power: 'P = W/t · η',
  }[kind];
  return (
    <g>
      <text x="45" y="35" fill="#6c5b7c" fontSize="18">
        {formula}
      </text>
      {kind === 'height' || kind === 'conservation' || kind === 'power' ? (
        <>
          <path
            d="M35 125L255 65V125Z"
            fill="#ddd8c3"
            stroke="#b0a4bb"
            strokeWidth="2"
          />
          <rect
            x="144"
            y="77"
            width="35"
            height="22"
            rx="5"
            transform="rotate(-15 162 90)"
            fill="#a894bc"
          />
          <path d="M215 75V115" stroke="#9b80b0" strokeWidth="3" />
        </>
      ) : (
        <>
          <path d="M30 122H270" stroke="#b9b1c1" strokeWidth="2" />
          <rect x="120" y="83" width="55" height="30" rx="6" fill="#d9bc85" />
          <circle cx="132" cy="116" r="6" fill="#71647d" />
          <circle cx="163" cy="116" r="6" fill="#71647d" />
          {kind === 'spring' ? (
            <path
              d="M40 80v38m0-20h10l7-10 7 20 7-20 7 20 7-20 7 20 7-10h18"
              stroke="#9b80b0"
              strokeWidth="3"
              fill="none"
            />
          ) : (
            <path
              d={
                kind === 'angle'
                  ? 'M150 80l70-28m-14 0l14 0-9 11'
                  : 'M115 97H60m11-6l-11 6 11 6'
              }
              stroke="#9b80b0"
              strokeWidth="3"
              fill="none"
            />
          )}
        </>
      )}
    </g>
  );
}
