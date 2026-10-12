import type { OpticsKind } from './opticsModels';
export function OpticsArt({ kind }: { kind: OpticsKind }) {
  const label = {
    reflection: 'mirror turns φ · ray turns 2φ',
    mirror: 'real rays · virtual image',
    refraction: 'direction measured from normal',
    snell: 'n₁ sin i = n₂ sin r',
    index: 'n ↑ · v ↓ · λ ↓',
    critical: 'below · grazing · above',
    fibre: 'core + escaped = 1',
  }[kind];
  return (
    <g>
      <text x="22" y="30" fontSize="15" fill="#6c5b7c">
        {label}
      </text>
      {kind === 'mirror' ? (
        <>
          <path d="M150 50V140" stroke="#ae99bf" strokeWidth="4" />
          <path
            d="M85 115V75L80 82M85 75L90 82"
            stroke="#d9bc85"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M215 115V75L210 82M215 75L220 82"
            stroke="#ae99bf"
            strokeDasharray="4 4"
            fill="none"
          />
          <path d="M85 75L150 100L65 125" stroke="#8ba9b1" fill="none" />
          <path
            d="M150 100L215 75"
            stroke="#ae99bf"
            strokeDasharray="5 4"
            fill="none"
          />
        </>
      ) : kind === 'fibre' ? (
        <>
          <rect
            x="30"
            y="65"
            width="240"
            height="60"
            fill="#8ba9b1"
            opacity=".12"
          />
          <path d="M30 65H270M30 125H270" stroke="#ae99bf" strokeWidth="2" />
          <path
            d="M35 95L95 65L215 125L270 97"
            stroke="#d9bc85"
            strokeWidth="3"
            fill="none"
          />
        </>
      ) : kind === 'index' ? (
        <>
          <rect
            x="110"
            y="60"
            width="85"
            height="75"
            fill="#ae99bf"
            opacity=".25"
          />
          <path d="M30 95H270" stroke="#d9bc85" strokeWidth="3" />
          <path d="M235 90L245 95L235 100" stroke="#d9bc85" fill="none" />
        </>
      ) : (
        <>
          <path
            d="M40 100H260M150 50V140"
            stroke="#b9b1c1"
            strokeDasharray="4 4"
          />
          <path
            d={
              kind === 'reflection' || kind === 'critical'
                ? 'M75 55L150 100L225 55'
                : 'M75 55L150 100L175 135'
            }
            stroke="#d9bc85"
            strokeWidth="3"
            fill="none"
          />
          {kind === 'critical' && (
            <path d="M150 100H245" stroke="#ae99bf" strokeDasharray="4 4" />
          )}
        </>
      )}
    </g>
  );
}
