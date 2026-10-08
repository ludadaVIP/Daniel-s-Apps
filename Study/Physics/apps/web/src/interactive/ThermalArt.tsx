export function ThermalArt({ kind }: { kind: string }) {
  if (kind === 'thermal-particles')
    return (
      <g>
        {[45, 160].map((x, index) => (
          <g key={x}>
            <rect
              x={x}
              y="35"
              width="90"
              height="87"
              rx="10"
              fill="#ede5f2"
              stroke="#b7a0ca"
            />
            {Array.from({ length: index ? 8 : 4 }, (_, i) => (
              <circle
                key={i}
                cx={x + 18 + (i % 4) * 18}
                cy={57 + Math.floor(i / 4) * 35}
                r="5"
                fill="#b395c5"
              />
            ))}
            <text
              x={x + 45}
              y="108"
              textAnchor="middle"
              fill="#a78a65"
              fontSize="16"
            >
              20°C
            </text>
          </g>
        ))}
      </g>
    );
  if (kind === 'thermal-heating')
    return (
      <g>
        <path
          d="M50 42v78h78V42m48 0v78h78V42"
          stroke="#b8a1c9"
          fill="none"
          strokeWidth="2"
        />
        <path d="M53 82h72v35H53m126-59h72v59h-72" fill="#bcd4d9" />
        <path
          d="M78 137v-16m-5 5 5-5 5 5m123 11v-16m-5 5 5-5 5 5"
          stroke="#c6a270"
          fill="none"
          strokeWidth="3"
        />
        <text x="150" y="31" textAnchor="middle" fill="#a58abb" fontSize="17">
          same Q
        </text>
        <text x="88" y="68" textAnchor="middle" fill="#a58abb" fontSize="18">
          +2°C
        </text>
        <text x="215" y="51" textAnchor="middle" fill="#a58abb" fontSize="18">
          +1°C
        </text>
      </g>
    );
  if (kind === 'thermal-paths')
    return (
      <g>
        <rect x="32" y="57" width="80" height="37" rx="7" fill="#d6c4e0" />
        <path
          d="M42 108h60m-8-6 8 6-8 6"
          stroke="#c5a16f"
          fill="none"
          strokeWidth="2"
        />
        <path
          d="M135 40v68h57V40m-42 63V58h27v40m-4-7 4 7 4-7"
          stroke="#a0bdb7"
          fill="none"
          strokeWidth="2"
        />
        <circle cx="219" cy="66" r="13" fill="#d8bb90" />
        <circle cx="269" cy="92" r="13" fill="#c3aed2" />
        <path
          d="M233 68l24 12m-8-1 8 1-4-7"
          stroke="#c5a16f"
          fill="none"
          strokeWidth="2"
        />
      </g>
    );
  if (kind === 'thermal-cups')
    return (
      <g>
        <path d="M44 30v98h216" stroke="#b7a0ca" strokeWidth="2" fill="none" />
        <path
          d="M44 40Q100 111 254 118"
          stroke="#c5a16f"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M44 40Q134 69 254 83"
          stroke="#a48aba"
          strokeWidth="3"
          fill="none"
        />
        <path d="M44 118h216" stroke="#96b5a7" strokeDasharray="5 5" />
        <text x="236" y="146" fill="#a58abb" fontSize="15">
          t
        </text>
        <text x="24" y="35" fill="#a58abb" fontSize="15">
          T
        </text>
      </g>
    );
  return (
    <g>
      <rect x="55" y="95" width="185" height="30" rx="7" fill="#bcd4d9" />
      <path
        d="M88 91V45m-6 7 6-7 6 7m79-7v45m-6-7 6 7 6-7"
        stroke="#b398c5"
        fill="none"
        strokeWidth="3"
      />
      <circle cx="88" cy="28" r="7" fill="#d8c7e1" />
      <path d="M216 51h40v39h-40" fill="#eee4d0" />
      <text x="232" y="74" textAnchor="middle" fontSize="14" fill="#aa8b60">
        20°
      </text>
      <text x="148" y="147" textAnchor="middle" fill="#a58abb" fontSize="15">
        energy → vapour
      </text>
    </g>
  );
}
