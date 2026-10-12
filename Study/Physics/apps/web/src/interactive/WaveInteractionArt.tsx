import type { InteractionKind } from './waveInteractionModels';
export function WaveInteractionArt({ kind }: { kind: InteractionKind }) {
  const label = {
    reflection: 'boundary → return',
    refraction: 'one f · two λ',
    diffraction: 'compare a / λ',
    interference: 'u = u₁ + u₂',
    standing: 'L = nλ / 2',
  }[kind];
  return (
    <g>
      <text x="28" y="30" fontSize="17" fill="#6c5b7c">
        {label}
      </text>
      {kind === 'refraction' ? (
        <>
          <path
            d="M40 85H260M150 45V130"
            fill="none"
            stroke="#b9b1c1"
            strokeDasharray="4 4"
          />
          <path
            d="M110 50L150 85L170 125"
            stroke="#ae99bf"
            strokeWidth="3"
            fill="none"
          />
        </>
      ) : kind === 'diffraction' ? (
        <>
          <path d="M70 50V78M70 98V132" stroke="#ae99bf" strokeWidth="5" />
          <path
            d="M80 88L230 50M80 88H240M80 88L230 130"
            fill="none"
            stroke="#b9b1c1"
          />
          <path
            d="M190 55Q220 88 190 122"
            fill="none"
            stroke="#d9bc85"
            strokeWidth="3"
          />
        </>
      ) : (
        <>
          <path d="M30 95H270" stroke="#b9b1c1" strokeDasharray="4 4" />
          <path
            d={Array.from({ length: 121 }, (_, i) => {
              const z = i / 120;
              const u =
                kind === 'standing'
                  ? Math.sin(2 * Math.PI * z)
                  : kind === 'reflection'
                    ? Math.exp(-(((z - 0.4) / 0.09) ** 2)) -
                      Math.exp(-(((z - 0.8) / 0.09) ** 2))
                    : Math.exp(-(((z - 0.35) / 0.09) ** 2)) +
                      Math.exp(-(((z - 0.65) / 0.09) ** 2));
              return (i ? 'L' : 'M') + (30 + 240 * z) + ' ' + (95 - 28 * u);
            }).join(' ')}
            fill="none"
            stroke="#ae99bf"
            strokeWidth="3"
          />
          {kind === 'standing' ? (
            [30, 150, 270].map((x) => (
              <circle key={x} cx={x} cy="95" r="4" fill="#d9bc85" />
            ))
          ) : kind === 'reflection' ? (
            <path d="M270 55V130" stroke="#d9bc85" strokeWidth="4" />
          ) : null}
        </>
      )}
    </g>
  );
}
