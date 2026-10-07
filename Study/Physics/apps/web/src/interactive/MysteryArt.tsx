export function MysteryArt({ kind }: { kind: string }) {
  if (kind === 'floating')
    return (
      <>
        <path d="M40 64h220v67H40Z" fill="#d7e9ed" />
        <path d="m117 45 27-15 26 31 23 52-22 15-42-11-23-36Z" fill="#a9cbd6" />
        <path d="m117 45 27-15 26 31-28-8Z" fill="#eef7f8" />
        <path
          d="M40 64h220"
          stroke="#86aebe"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <path
          d="m159 81 11 28-22 10"
          fill="none"
          stroke="#e9f4f6"
          strokeWidth="2"
        />
      </>
    );
  if (kind === 'boats')
    return (
      <>
        <path d="M35 111h230v23H35Z" fill="#d7e9ed" />
        <path
          d="M80 60v24q0 28 30 28h78q30 0 30-28V60h-10v24q0 18-20 18h-78q-20 0-20-18V60Z"
          fill="#cba492"
        />
        <rect x="130" y="76" width="37" height="25" rx="3" fill="#a498b6" />
        <path
          d="M150 29v34m-7-7 7 7 7-7"
          fill="none"
          stroke="#a789b9"
          strokeWidth="2"
        />
        <path d="M35 111h230" stroke="#86aebe" strokeWidth="2" />
      </>
    );
  if (kind === 'bounce')
    return (
      <>
        <path d="M40 125h220" stroke="#b4a2c3" strokeWidth="3" />
        <path
          d="M80 40v66q5 25 22 10 18-31 47-35 29-3 47 35"
          fill="none"
          stroke="#bba6ca"
          strokeDasharray="4 5"
          strokeWidth="2"
        />
        <circle cx="80" cy="36" r="13" fill="#d1c1df" />
        <circle cx="149" cy="79" r="15" fill="#a78dbc" />
        <path d="M47 36h180M112 80h97" stroke="#cba878" strokeDasharray="3 5" />
        <text x="225" y="76" fontSize="13" fill="#b28c5b" textAnchor="middle">
          64%
        </text>
      </>
    );
  return (
    <>
      <path d="M60 56h18l20-15v65l-20-15H60Z" fill="#ae98c4" />
      <rect x="227" y="37" width="15" height="83" rx="3" fill="#cbbcd5" />
      <path
        d="M105 58h117m-9-7 9 7-9 7M222 96H105m9-7-9 7 9 7"
        fill="none"
        stroke="#a78abb"
        strokeWidth="2"
      />
      <circle cx="178" cy="58" r="7" fill="#d2ac7b" />
      <text x="160" y="132" textAnchor="middle" fontSize="13" fill="#ac8fbf">
        2 × distance
      </text>
    </>
  );
}
