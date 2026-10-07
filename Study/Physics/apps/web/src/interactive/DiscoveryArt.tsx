export function DiscoveryArt({ kind }: { kind: string }) {
  if (kind === 'mirror')
    return (
      <>
        <path d="M150 25v105" stroke="#b4a0c5" strokeWidth="5" />
        <rect x="70" y="69" width="14" height="48" rx="3" fill="#a4beb0" />
        <rect x="70" y="69" width="5" height="17" fill="#cfaa7a" />
        <rect
          x="216"
          y="69"
          width="14"
          height="48"
          rx="3"
          fill="#a4beb0"
          opacity=".6"
        />
        <rect
          x="225"
          y="69"
          width="5"
          height="17"
          fill="#cfaa7a"
          opacity=".6"
        />
        <path
          d="m77 92 73-38-111-20"
          fill="none"
          stroke="#c5a06e"
          strokeWidth="2"
        />
        <path
          d="m150 54 73 38"
          fill="none"
          stroke="#bca8cf"
          strokeDasharray="4 5"
        />
        <circle cx="39" cy="34" r="6" fill="#bba1d0" />
      </>
    );
  if (kind === 'static')
    return (
      <>
        <ellipse cx="108" cy="67" rx="32" ry="40" fill="#bba1d0" />
        <path d="M108 107q-10 15 2 22" fill="none" stroke="#baa7c9" />
        <rect x="190" y="28" width="48" height="97" rx="5" fill="#e1d6e9" />
        <text x="108" y="74" textAnchor="middle" fill="#816196" fontSize="23">
          −
        </text>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <text x="203" y={49 + i * 30} textAnchor="middle" fill="#bd9b72">
              +
            </text>
            <text x="225" y={49 + i * 30} textAnchor="middle" fill="#a080b6">
              −
            </text>
          </g>
        ))}
        <path
          d="M148 67h27m-7-5 7 5-7 5"
          stroke="#c7a271"
          fill="none"
          strokeWidth="2"
        />
      </>
    );
  if (kind === 'seatbelt')
    return (
      <>
        <rect x="57" y="50" width="185" height="63" rx="9" fill="#d3c5df" />
        <rect x="75" y="58" width="116" height="40" rx="4" fill="#f7f3fb" />
        <circle cx="124" cy="67" r="9" fill="#c8a270" />
        <path d="M118 78h13v19h-13Z" fill="#ac92c3" />
        <path d="m117 79 16 14" stroke="#826195" strokeWidth="3" />
        <circle cx="89" cy="120" r="12" fill="#9e85b2" />
        <circle cx="210" cy="120" r="12" fill="#9e85b2" />
        <path d="M200 70h23m-8-5 8 5-8 5" fill="none" stroke="#cba779" />
      </>
    );
  return (
    <>
      <rect
        x="53"
        y="42"
        width="194"
        height="79"
        rx="6"
        fill="#f8f4fb"
        stroke="#cab8d6"
      />
      <path d="M53 69h194M116 42v79M182 42v79M53 95h194" stroke="#c7b4d5" />
      <text x="84" y="87" fontSize="15" fill="#a183b6">
        2
      </text>
      <text x="145" y="87" fontSize="15" fill="#a183b6">
        3
      </text>
      <text x="208" y="87" fontSize="15" fill="#a183b6">
        2
      </text>
      <circle cx="84" cy="107" r="6" fill="#b89eca" />
      <circle cx="145" cy="107" r="6" fill="#d1af7e" />
      <circle cx="208" cy="107" r="6" fill="#d1af7e" />
    </>
  );
}
