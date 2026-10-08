export function PressureArt({ kind }: { kind: string }) {
  const ink = '#a68ab7',
    blue = '#88b6c6',
    gold = '#c59a63';
  return (
    <g
      fill="none"
      stroke={ink}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === 'pressure-contact' ? (
        <>
          <rect x="105" y="38" width="90" height="92" rx="15" fill="#eee5f3" />
          <path d="M126 40V22h48v18M119 58v55M181 58v55" strokeWidth="8" />
          <rect x="128" y="74" width="44" height="30" rx="6" stroke={gold} />
          <path
            d="M62 45v42m-7-7 7 7 7-7M237 45v42m-7-7 7 7 7-7"
            stroke={gold}
          />
        </>
      ) : kind === 'pressure-shoes' ? (
        <>
          <ellipse cx="100" cy="78" rx="13" ry="35" fill="#eee5f3" />
          <ellipse
            cx="204"
            cy="78"
            rx="43"
            ry="57"
            fill="#e4f0ec"
            stroke={blue}
          />
          <path
            d="M172 53h64M165 73h78M168 94h72M182 37v83M204 25v106M225 35v88"
            stroke={blue}
            strokeWidth="1"
          />
          <ellipse cx="204" cy="78" rx="13" ry="35" fill="#eee5f3" />
        </>
      ) : kind === 'pressure-liquid' ? (
        <>
          <path d="M94 20v113h112V20" />
          <path d="M96 53h108v78H96Z" stroke={blue} fill="#e3f1f7" />
          <path d="M220 53v53m-5-47 5-6 5 6m-5 41-5 6h10" stroke={gold} />
          <circle cx="151" cy="106" r="6" fill={gold} />
          <path d="M130 106h15m12 0h16" stroke={gold} />
        </>
      ) : kind === 'pressure-air' ? (
        <>
          <path d="M130 40h109v70H130" fill="#eee5f3" />
          <path d="M130 34v82M85 75h45" strokeWidth="6" />
          <path
            d="M37 75h65m-9-8 9 8-9 8M224 75h-65m9-8-9 8 9 8"
            stroke={gold}
          />
          {[165, 190, 210].map((x) => (
            <circle key={x} cx={x} cy="54" r="2" fill={ink} />
          ))}
        </>
      ) : kind === 'pressure-straw' ? (
        <>
          <path d="M99 51l8 79h87l8-79" />
          <path d="M104 84h93l-5 44h-83Z" fill="#e3f1f7" stroke={blue} />
          <path d="M157 112V25h32" strokeWidth="10" stroke="#e4d5ed" />
          <path d="M157 111V61" stroke={blue} strokeWidth="5" />
          <path d="M218 100V66m-7 8 7-8 7 8" stroke={gold} />
        </>
      ) : (
        <>
          <rect x="110" y="54" width="119" height="50" rx="5" fill="#eee5f3" />
          <path d="M229 78h31M143 50v58M143 79H71M71 58v40" strokeWidth="5" />
          <path d="M166 55v13M189 55v13M213 55v13" strokeWidth="2" />
          {[164, 185, 211].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={82 + (i % 2) * 10}
              r="3"
              fill={gold}
              stroke={gold}
            />
          ))}
        </>
      )}
    </g>
  );
}
