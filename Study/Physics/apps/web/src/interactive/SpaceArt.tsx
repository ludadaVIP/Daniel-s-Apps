export function SpaceArt({ kind }: { kind: string }) {
  const blue = '#88bbc8',
    gold = '#dfbb79',
    white = '#e9e6ef',
    ink = '#71809b';
  const earth = (x: number, y: number, r = 22) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={blue} />
      <path
        d={`M${x} ${y - r}A${r} ${r} 0 0 1 ${x} ${y + r}Z`}
        fill="#4d5a73"
      />
    </g>
  );
  const stars = Array.from({ length: 18 }, (_, i) => (
    <circle
      key={i}
      cx={18 + ((i * 47) % 264)}
      cy={14 + ((i * 31) % 123)}
      r={i % 5 === 0 ? 1.5 : 0.7}
      fill={white}
      opacity=".5"
    />
  ));
  return (
    <g>
      <rect x="3" y="3" width="294" height="144" rx="15" fill="#28334b" />
      {stars}
      {kind === 'space-day' ? (
        <>
          <circle cx="55" cy="75" r="18" fill={gold} />
          <path d="M83 61h30m-30 14h30m-30 14h30" stroke={gold} />
          {earth(174, 75, 41)}
          <circle cx="139" cy="54" r="5" fill={gold} />
          <path
            d="M160 23q-30 2-41 28m-2-10 2 10 9-4"
            stroke={white}
            fill="none"
          />
        </>
      ) : kind === 'space-seasons' ? (
        <>
          <ellipse cx="150" cy="75" rx="95" ry="40" fill="none" stroke={ink} />
          <circle cx="150" cy="75" r="18" fill={gold} />
          {earth(55, 75, 18)}
          {earth(245, 75, 18)}
          <path d="M46 99l18-48m172 48 18-48" stroke={white} strokeWidth="2" />
          <text x="68" y="48" fill={white} fontSize="10">
            N
          </text>
          <text x="258" y="48" fill={white} fontSize="10">
            N
          </text>
          <path d="M76 120h57m34 0h57" stroke={blue} strokeWidth="5" />
        </>
      ) : kind === 'space-moon' ? (
        <>
          {earth(95, 74)}
          <ellipse cx="95" cy="74" rx="55" ry="44" stroke={ink} fill="none" />
          <circle cx="95" cy="118" r="9" fill="#eee6ca" />
          <circle cx="219" cy="74" r="35" fill="#49516a" />
          <path d="M219 39A35 35 0 0 1 219 109Z" fill="#eee6ca" />
          <path d="M160 74h15" stroke={gold} />
        </>
      ) : kind === 'space-system' ? (
        <>
          <circle cx="32" cy="75" r="15" fill={gold} />
          {[55, 63, 70, 80, 125, 159, 207, 269].map((x, i) => (
            <g key={i}>
              <path d={`M${x} 62v27`} stroke={ink} />
              <circle
                cx={x}
                cy="75"
                r={i === 2 ? 5 : 3}
                fill={i === 2 ? blue : white}
              />
            </g>
          ))}
          <path d="M31 103h240" stroke={ink} />
          <text x="31" y="126" fill={white} fontSize="12">
            0
          </text>
          <text x="262" y="126" fill={white} fontSize="12">
            30 AU
          </text>
        </>
      ) : kind === 'space-orbit' ? (
        <>
          {earth(150, 78, 30)}
          <circle
            cx="150"
            cy="78"
            r="59"
            stroke={ink}
            fill="none"
            strokeDasharray="3 4"
          />
          <circle cx="200" cy="47" r="5" fill={white} />
          <path d="M198 50l-28 17m8-8-8 8 10-1" stroke={blue} fill="none" />
          <path d="M202 47l-23-30m2 9-2-9 9 3" stroke={gold} fill="none" />
        </>
      ) : kind === 'space-stars' ? (
        <>
          <circle cx="55" cy="74" r="23" fill={gold} />
          <path d="M84 74h62" stroke={gold} />
          <circle cx="216" cy="74" r="45" fill="none" stroke={blue} />
          <circle cx="216" cy="74" r="23" fill="none" stroke={ink} />
          <rect x="210" y="68" width="12" height="12" fill={gold} />
          <text x="202" y="136" fill={white} fontSize="12">
            L / r²
          </text>
        </>
      ) : kind === 'space-galaxies' ? (
        <>
          <ellipse cx="150" cy="76" rx="98" ry="46" fill="#36425b" />
          {Array.from({ length: 55 }, (_, i) => {
            const r = 12 + i * 1.5,
              a = i * 0.4;
            return (
              <circle
                key={i}
                cx={150 + r * Math.cos(a)}
                cy={76 + r * 0.48 * Math.sin(a)}
                r={i % 6 === 0 ? 2 : 1}
                fill={i % 6 === 0 ? gold : white}
              />
            );
          })}
          <circle cx="150" cy="76" r="7" fill={gold} />
          <circle cx="211" cy="87" r="4" fill={blue} />
          <path d="M215 89l21 22" stroke={blue} />
        </>
      ) : (
        <>
          <circle cx="45" cy="72" r="16" fill={gold} />
          <path d="M70 72h178" stroke={blue} strokeDasharray="4 5" />
          <circle cx="157" cy="72" r="5" fill={gold} />
          <path d="M254 54l20 18-20 18Z" fill={blue} />
          <path d="M261 91v23m-12 0h25" stroke={white} />
          <text x="135" y="119" fill={white} fontSize="12">
            d = c × t
          </text>
        </>
      )}
    </g>
  );
}
