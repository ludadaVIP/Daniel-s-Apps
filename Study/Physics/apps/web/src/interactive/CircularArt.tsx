import type { CircularKind } from './circularModels';
export function CircularArt({ kind }: { kind: CircularKind }) {
  const formula = {
    path: 'T = 2πr/v',
    tangent: 'v ⟂ r',
    acceleration: 'a = v²/r',
    force: 'ΣFr = mv²/r',
    turning: 'Fneed ≤ Favailable',
    orbit: 'Fg = mv²/r',
    loop: 'K + U · N ≥ 0',
  }[kind];
  return (
    <g>
      <text x="40" y="30" fill="#6c5b7c" fontSize="17">
        {formula}
      </text>
      <circle
        cx="130"
        cy="95"
        r="40"
        fill="none"
        stroke="#b9b1c1"
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      {kind === 'orbit' ? (
        <circle cx="130" cy="95" r="16" fill="#ae99bf" />
      ) : (
        <circle cx="130" cy="95" r="3" fill="#ae99bf" />
      )}
      <circle cx="170" cy="95" r="8" fill="#d9bc85" />
      <path
        d={
          kind === 'tangent'
            ? 'M170 95V45m-5 9l5-9 5 9'
            : 'M170 95H143m8-5l-8 5 8 5'
        }
        stroke="#9b80b0"
        strokeWidth="3"
        fill="none"
      />
      {kind === 'loop' && (
        <path
          d="M190 70q30 15 45 50"
          stroke="#cfa866"
          strokeWidth="3"
          fill="none"
        />
      )}
    </g>
  );
}
