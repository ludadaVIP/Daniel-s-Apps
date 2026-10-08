export function SoundArt({ kind }: { kind: string }) {
  if (kind === 'sound-source')
    return (
      <g>
        <rect x="52" y="45" width="42" height="65" rx="8" fill="#e5daed" />
        <path d="M98 42v71m9-61v51" stroke="#ad92bf" strokeWidth="3" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${130 + i * 28} ${61 - i * 9}q18 ${14 + i * 9} 0 ${28 + i * 18}`}
            stroke="#b9a2c8"
            fill="none"
            strokeWidth="2"
          />
        ))}
        <text x="70" y="132" fill="#997ea9">
          ↔
        </text>
      </g>
    );
  if (kind === 'sound-medium')
    return (
      <g>
        <path d="M40 75h220" stroke="#d8cbdf" strokeDasharray="3 4" />
        {Array.from({ length: 16 }, (_, i) => (
          <circle
            key={i}
            cx={42 + i * 14 + Math.sin(i * 0.8) * 6}
            cy="75"
            r={i === 7 ? 6 : 3}
            fill={i === 7 ? '#c6a26d' : '#af95c1'}
          />
        ))}
        <path
          d="M120 108h40m-35-5-5 5 5 5m30-10 5 5-5 5"
          stroke="#c6a26d"
          fill="none"
        />
      </g>
    );
  if (kind === 'sound-ranging')
    return (
      <g>
        <rect x="43" y="54" width="23" height="43" rx="5" fill="#b29cc0" />
        <path d="M245 38v78" stroke="#c6a26d" strokeWidth="4" />
        <path
          d="M78 62h145m-7-6 7 6-7 6M223 91H78m7-6-7 6 7 6"
          stroke="#b29cc0"
          fill="none"
          strokeWidth="2"
        />
        <text x="140" y="128" fill="#9c84ad">
          2d = ct
        </text>
      </g>
    );
  return (
    <g>
      {[0, 1].map((row) => (
        <g key={row}>
          <path d={`M35 ${50 + row * 55}h230`} stroke="#dfd4e5" />
          <polyline
            points={Array.from(
              { length: 100 },
              (_, i) =>
                `${35 + i * 2.3},${50 + row * 55 - Math.sin((i / 99) * Math.PI * (kind === 'sound-pitch' ? (row ? 12 : 6) : 8)) * (kind === 'sound-amplitude' ? (row ? 20 : 9) : 15)}`,
            ).join(' ')}
            stroke={row ? '#c6a26d' : '#aa90bb'}
            fill="none"
            strokeWidth="2"
          />
        </g>
      ))}
    </g>
  );
}
