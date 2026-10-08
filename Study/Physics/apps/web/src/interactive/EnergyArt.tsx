export function EnergyArt({ kind }: { kind: string }) {
  if (kind === 'energy-lamp')
    return (
      <g>
        <rect x="47" y="55" width="44" height="58" rx="6" fill="#ceb082" />
        <path
          d="M63 43h12v12M69 68v20m-10-10h20"
          stroke="#ae8e60"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M92 82h86m-9-6 9 6-9 6"
          fill="none"
          stroke="#b4a0c3"
          strokeWidth="2"
        />
        <circle cx="214" cy="70" r="26" fill="#f0d9a6" />
        <path
          d="M202 92h24v14h-24m5-14V71l7 6 7-6v21"
          fill="none"
          stroke="#bba2c9"
          strokeWidth="3"
        />
        <path
          d="M213 31V17m35 35 13-7m-14 42 13 7"
          stroke="#cfad79"
          strokeWidth="3"
        />
        <rect x="53" y="129" width="67" height="7" rx="3" fill="#a991bc" />
        <rect x="132" y="129" width="107" height="7" rx="3" fill="#9dbbad" />
      </g>
    );
  if (kind === 'energy-kinetic')
    return (
      <g>
        {[65, 198].map((x, i) => (
          <g key={x}>
            <path
              d={'M' + (x - 36) + ' 115h83'}
              stroke="#ccbdda"
              strokeWidth="2"
            />
            <rect
              x={x - 27}
              y="74"
              width="54"
              height="25"
              rx="5"
              fill="#c4afd4"
            />
            <circle cx={x - 16} cy="106" r="7" fill="#a68abd" />
            <circle cx={x + 16} cy="106" r="7" fill="#a68abd" />
            <path
              d={'M' + (x - 25) + ' 49h' + (i ? 76 : 38) + 'm-8-5 8 5-8 5'}
              stroke="#c5a373"
              strokeWidth="3"
              fill="none"
            />
            <rect
              x={x - 28}
              y="132"
              width={i ? 92 : 23}
              height="7"
              rx="3"
              fill="#c5a373"
            />
          </g>
        ))}
        <text x="139" y="87" fill="#a68abd" textAnchor="middle" fontSize="16">
          v²
        </text>
      </g>
    );
  if (kind === 'energy-height')
    return (
      <g>
        <path
          d="M49 127h211M55 41v86M60 90h160M60 51h160"
          stroke="#c2b0cf"
          strokeWidth="2"
        />
        <rect x="85" y="76" width="49" height="13" rx="2" fill="#ad93c2" />
        <rect x="154" y="37" width="49" height="13" rx="2" fill="#c1acd2" />
        <path
          d="M230 48v74m-5-8 5 8 5-8"
          fill="none"
          stroke="#c2a16f"
          strokeWidth="3"
        />
        <path d="M49 104h211" stroke="#c2a16f" strokeDasharray="4 4" />
        <text x="150" y="147" fill="#a68abd" textAnchor="middle" fontSize="14">
          Δh
        </text>
      </g>
    );
  if (kind === 'energy-spring')
    return (
      <g>
        <path
          d="M43 51v55m0-28h19l10-9 10 18 10-18 10 18 10-18 10 18 10-18 10 18 10-9h19"
          fill="none"
          stroke="#aa8dbe"
          strokeWidth="3"
        />
        <rect x="174" y="60" width="56" height="34" rx="6" fill="#c7b2d5" />
        <circle cx="186" cy="101" r="8" fill="#ac8fc1" />
        <circle cx="218" cy="101" r="8" fill="#ac8fc1" />
        <path
          d="M174 37h-62m9-5-9 5 9 5"
          stroke="#c4a172"
          strokeWidth="3"
          fill="none"
        />
        <rect x="57" y="128" width="81" height="8" rx="3" fill="#ac8fc1" />
        <rect x="151" y="128" width="81" height="8" rx="3" fill="#c4a172" />
      </g>
    );
  return (
    <g>
      <path
        d="M40 44Q150 207 260 44"
        stroke="#bfacd0"
        strokeWidth="3"
        fill="none"
      />
      <circle
        cx={kind === 'energy-track' ? 150 : 230}
        cy={kind === 'energy-track' ? 126 : 83}
        r="10"
        fill="#dac49e"
        stroke="#bd9964"
        strokeWidth="2"
      />
      {kind === 'energy-dissipation' && (
        <path
          d="M100 112l8 5m13 6 8 3m15 2h10m17-4 8-3"
          stroke="#95b5a5"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
      <rect x="48" y="14" width="66" height="7" rx="3" fill="#a58abc" />
      <rect x="125" y="14" width="66" height="7" rx="3" fill="#c6a575" />
      {kind === 'energy-dissipation' && (
        <rect x="201" y="14" width="44" height="7" rx="3" fill="#95b5a5" />
      )}
    </g>
  );
}
