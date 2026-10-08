export function GravityArt({ kind }: { kind: string }) {
  if (kind === 'mass-weight')
    return (
      <g>
        <path
          d="M60 113h58l-29-71Zm-15-65 92 0"
          fill="#d8c9e3"
          stroke="#9e7ab2"
          strokeWidth="3"
        />
        <path
          d="M44 48v49m91-49v49M30 98h29m62 0h28"
          stroke="#b99fcb"
          strokeWidth="2"
        />
        <rect x="32" y="72" width="25" height="25" rx="5" fill="#bca4cf" />
        <rect x="122" y="79" width="25" height="18" rx="3" fill="#d3b58c" />
        <path
          d="M210 24v14l-8 9 16 9-16 9 16 9-8 9v13"
          fill="none"
          stroke="#a182b4"
          strokeWidth="3"
        />
        <rect x="192" y="98" width="36" height="25" rx="5" fill="#bca4cf" />
        <text x="206" y="145" textAnchor="middle" fontSize="15" fill="#9e7ab2">
          N
        </text>
      </g>
    );
  if (kind === 'moon-weight')
    return (
      <g>
        <circle cx="86" cy="101" r="35" fill="#aac7bc" />
        <path d="m57 86 25-14 24 19-9 23-25-5Z" fill="#8bad9e" />
        <circle cx="220" cy="102" r="32" fill="#cec0d9" />
        <circle cx="210" cy="92" r="9" fill="#b4a2c2" />
        <circle cx="229" cy="116" r="7" fill="#b4a2c2" />
        {[86, 220].map((x) => (
          <g key={x}>
            <path
              d={`M${x - 7} 43v-6c0-7 14-7 14 0v6`}
              stroke="#9976ad"
              fill="none"
              strokeWidth="2"
            />
            <rect
              x={x - 13}
              y="41"
              width="26"
              height="27"
              rx="5"
              fill="#b69bc8"
            />
          </g>
        ))}
        <path
          d="M125 57h55m-8-6 8 6-8 6"
          stroke="#b89a70"
          fill="none"
          strokeWidth="2"
        />
        <text x="153" y="38" textAnchor="middle" fontSize="16" fill="#9976ad">
          m = m
        </text>
      </g>
    );
  return (
    <g>
      <path
        d="M60 129h190M60 27h190"
        stroke="#cab7d7"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      {[106, 209].map((x, i) => (
        <g key={x}>
          {[32, 46, 72].map((y) => (
            <circle key={y} cx={x} cy={y} r="8" fill="#cdbfd8" opacity=".5" />
          ))}
          <circle cx={x} cy="110" r="14" fill={i ? '#d0b084' : '#af93c3'} />
        </g>
      ))}
      <text x="155" y="21" textAnchor="middle" fontSize="16" fill="#9976ad">
        NO AIR
      </text>
    </g>
  );
}
