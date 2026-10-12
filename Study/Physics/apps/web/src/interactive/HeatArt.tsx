import type { HeatKind } from './heatModels';
export function HeatArt({ kind }: { kind: HeatKind }) {
  const label = {
    particles: 'still air · moving particles',
    internal: 'same mean · different total',
    temperature: 'temperature → heat flow',
    capacity: 'Q = mcΔT',
    phase: 'warm → melt → warm',
    latent: 'Q = ±mL',
  }[kind];
  return (
    <g>
      <text x="22" y="30" fontSize="14" fill="#6c5b7c">
        {label}
      </text>
      {kind === 'particles' || kind === 'internal' ? (
        <>
          <rect
            x="55"
            y="50"
            width="190"
            height="95"
            fill="none"
            stroke="#8ba9b1"
          />
          {Array.from({ length: kind === 'internal' ? 24 : 12 }, (_, i) => (
            <circle
              key={i}
              cx={70 + ((i * 43) % 160)}
              cy={65 + ((i * 29) % 65)}
              r="3"
              fill={i % 2 ? '#ae99bf' : '#d9bc85'}
            />
          ))}
        </>
      ) : kind === 'phase' ? (
        <path
          d="M35 130L85 95H205L265 55"
          fill="none"
          stroke="#ae99bf"
          strokeWidth="3"
        />
      ) : (
        <>
          <rect
            x="45"
            y="65"
            width="85"
            height="70"
            fill="#8ba9b1"
            fillOpacity=".25"
          />
          <rect
            x="170"
            y="65"
            width="85"
            height="70"
            fill="#ae99bf"
            fillOpacity=".3"
          />
          <path
            d="M135 100H165l-7-6m7 6l-7 6"
            stroke="#d9bc85"
            fill="none"
            strokeWidth="2"
          />
        </>
      )}
    </g>
  );
}
