import type { AcousticKind } from './acousticModels';
export function AcousticArt({ kind }: { kind: AcousticKind }) {
  const label = {
    propagation: 'local motion → travelling sound',
    pitch: 'f ↑ · T ↓ · λ ↓',
    level: 'p ×2 · I ×4 · +6 dB',
    resonance: 'drive rhythm → response',
    columns: 'open: p′=0 · closed: u=0',
    doppler: 'source f ≠ received f',
    echo: 'round trip: Δt=2d/c',
    imaging: 'depth · detail · attenuation',
  }[kind];
  return (
    <g>
      <text x="22" y="30" fontSize="15" fill="#6c5b7c">
        {label}
      </text>
      {kind === 'doppler' ? (
        <>
          {[20, 35, 50].map((radius, i) => (
            <circle
              key={radius}
              cx={125 - 10 * i}
              cy="95"
              r={radius}
              fill="none"
              stroke="#8ba9b1"
              strokeWidth="2"
            />
          ))}
          <circle cx="130" cy="95" r="5" fill="#d9bc85" />
          <circle cx="230" cy="95" r="5" fill="#ae99bf" />
        </>
      ) : kind === 'echo' || kind === 'imaging' ? (
        <>
          <rect x="35" y="70" width="20" height="50" rx="4" fill="#8ba9b1" />
          <path d="M55 95H250" stroke="#b9b1c1" strokeDasharray="4 4" />
          {(kind === 'echo' ? [230] : [205, 225]).map((x) => (
            <path
              key={x}
              d={'M' + x + ' 55V130'}
              stroke="#ae99bf"
              strokeWidth="4"
            />
          ))}
          <path d="M75 75H180M75 115H180" stroke="#d9bc85" strokeWidth="2" />
        </>
      ) : kind === 'columns' ? (
        <>
          <path
            d="M45 65H255M45 125H255M45 65V125"
            stroke="#ae99bf"
            strokeWidth="3"
            fill="none"
          />
          {Array.from({ length: 13 }, (_, i) => (
            <circle key={i} cx={50 + 16 * i} cy="95" r="3" fill="#8ba9b1" />
          ))}
          <circle cx="255" cy="95" r="7" fill="none" stroke="#d9bc85" />
        </>
      ) : kind === 'propagation' ? (
        <>
          {Array.from({ length: 17 }, (_, i) => (
            <circle
              key={i}
              cx={30 + i * 14}
              cy="95"
              r="4"
              fill={i > 6 && i < 10 ? '#ae99bf' : '#8ba9b1'}
            />
          ))}
          <path
            d="M110 60H190L183 54M190 60L183 66"
            stroke="#d9bc85"
            fill="none"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path d="M30 95H270" stroke="#b9b1c1" strokeDasharray="4 4" />
          <path
            d={Array.from(
              { length: 121 },
              (_, i) =>
                (i ? 'L' : 'M') +
                (30 + 2 * i) +
                ' ' +
                (95 -
                  25 *
                    Math.sin(((kind === 'pitch' ? 6 : 4) * Math.PI * i) / 120)),
            ).join(' ')}
            stroke="#ae99bf"
            strokeWidth="3"
            fill="none"
          />
          {kind === 'resonance' && (
            <rect x="230" y="65" width="30" height="60" rx="4" fill="#d9bc85" />
          )}
        </>
      )}
    </g>
  );
}
