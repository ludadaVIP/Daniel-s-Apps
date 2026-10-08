export function ForceArt({ kind }: { kind: string }) {
  if (kind === 'force-effects')
    return (
      <g>
        <rect x="60" y="70" width="32" height="60" rx="4" fill="#dac8e5" />
        <path
          d="m92 98 10-15 12 30 12-30 12 30 12-30 12 30 12-30 12 15"
          fill="none"
          stroke="#9670aa"
          strokeWidth="4"
        />
        <path
          d="M220 98h38m-8-6 8 6-8 6"
          fill="none"
          stroke="#b89969"
          strokeWidth="3"
        />
        <circle cx="205" cy="100" r="12" fill="#c9ac82" />
      </g>
    );
  if (kind === 'force-balance')
    return (
      <g>
        <rect x="125" y="72" width="50" height="30" rx="5" fill="#bca6d0" />
        <circle cx="136" cy="112" r="9" fill="#92749f" />
        <circle cx="164" cy="112" r="9" fill="#92749f" />
        <path
          d="M120 87H60m8-7-8 7 8 7M180 87h60m-8-7 8 7-8 7"
          fill="none"
          stroke="#b59464"
          strokeWidth="4"
        />
        <text x="150" y="53" textAnchor="middle" fontSize="18" fill="#9e80af">
          ΣF = 0
        </text>
      </g>
    );
  if (kind === 'grip-friction')
    return (
      <g>
        <path
          d="M48 120h205m-200 8 10-8m12 8 10-8m12 8 10-8m12 8 10-8m12 8 10-8m12 8 10-8m12 8 10-8m12 8 10-8m12 8 10-8"
          stroke="#b6a0c5"
        />
        <rect x="120" y="72" width="55" height="45" rx="5" fill="#d0b487" />
        <path
          d="M185 82h52m-8-6 8 6-8 6M110 103H70m8-6-8 6 8 6"
          fill="none"
          stroke="#9f80b3"
          strokeWidth="3"
        />
      </g>
    );
  return (
    <g>
      <path d="M60 70h68l-8 6H52Z" fill="#bda8d2" />
      <circle cx="213" cy="108" r="12" fill="#cbb083" />
      <path
        d="M88 48v-20m-5 6 5-6 5 6M212 68v-10m-4 6 4-6 4 6M91 88v24m-5-6 5 6 5-6M213 122v14"
        stroke="#9e80b0"
        strokeWidth="2"
        fill="none"
      />
      <path d="M60 132h180" stroke="#c4b0d3" strokeDasharray="5 5" />
    </g>
  );
}
