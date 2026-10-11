import type { GravitationKind } from './gravitationModels';
export function GravitationArt({ kind }: { kind: GravitationKind }) {
  const formula = {
    pair: 'F₁ = −F₂',
    inverse: 'F = Gm₁m₂/r²',
    field: 'g = F/m',
    g: 'r = R + h',
    orbit: 'E · L · ellipse',
    satellite: 'Torbit = Trotation',
    escape: 'K + U ≥ 0',
    weightless: 'N = 0 · Fg ≠ 0',
  }[kind];
  return (
    <g>
      <text x="35" y="30" fill="#6c5b7c" fontSize="17">
        {formula}
      </text>
      {kind === 'weightless' ? (
        <>
          <rect
            x="105"
            y="50"
            width="90"
            height="85"
            rx="12"
            fill="none"
            stroke="#b9b1c1"
            strokeWidth="2"
          />
          <circle cx="150" cy="78" r="9" fill="#d9bc85" />
          <path
            d="M150 89v24m-14 13l14-13 14 13M210 70v40m-5-8l5 8 5-8"
            fill="none"
            stroke="#9b80b0"
            strokeWidth="3"
          />
        </>
      ) : (
        <>
          <ellipse
            cx="135"
            cy="95"
            rx={kind === 'orbit' ? 65 : 45}
            ry="35"
            fill="none"
            stroke="#b9b1c1"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <circle cx="135" cy="95" r="16" fill="#ae99bf" />
          <circle cx="200" cy="95" r="8" fill="#d9bc85" />
          <path
            d={
              kind === 'escape'
                ? 'M208 95H255m-8-5l8 5-8 5'
                : 'M190 95H165m8-5l-8 5 8 5'
            }
            fill="none"
            stroke="#9b80b0"
            strokeWidth="3"
          />
          {kind === 'pair' && (
            <path
              d="M150 95H176m-8-5l8 5-8 5"
              fill="none"
              stroke="#cfa866"
              strokeWidth="3"
            />
          )}
        </>
      )}
    </g>
  );
}
