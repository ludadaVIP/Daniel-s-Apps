export function DensityArt({ kind }: { kind: string }) {
  if (kind === 'density-compare')
    return (
      <g>
        {[78, 200].map((x, i) => (
          <g key={x}>
            <path
              d={`M${x} 71l17-13h51l-17 13Z`}
              fill={i ? '#c2c4ce' : '#dfc4a1'}
            />
            <path
              d={`M${x + 51} 71l17-13v44l-17 13Z`}
              fill={i ? '#a3a5b2' : '#bf9c6f'}
            />
            <rect
              x={x}
              y="71"
              width="51"
              height="44"
              fill={i ? '#b1b3bf' : '#d1ae7e'}
            />
            <text
              x={x + 24}
              y="138"
              textAnchor="middle"
              fontSize="16"
              fill="#94719f"
            >
              {i ? '54 g' : '12 g'}
            </text>
          </g>
        ))}
        <text x="153" y="30" textAnchor="middle" fontSize="16" fill="#94719f">
          20 cm³ = 20 cm³
        </text>
      </g>
    );
  if (kind === 'density-block')
    return (
      <g>
        <path d="M72 69l30-21h102l-30 21Z" fill="#cdd0d8" />
        <path d="M174 69l30-21v48l-30 21Z" fill="#aaaebd" />
        <rect x="72" y="69" width="102" height="48" fill="#b9bdc9" />
        <path d="M64 125h118m-114-5v10m110-10v10" stroke="#ac92bd" />
        <text x="240" y="96" textAnchor="middle" fontSize="22" fill="#9672a3">
          m/V
        </text>
      </g>
    );
  if (kind === 'density-displacement')
    return (
      <g>
        <path
          d="M101 31v98h89V31"
          stroke="#a58db4"
          strokeWidth="3"
          fill="none"
        />
        <rect x="104" y="69" width="83" height="57" fill="#c7dfe3" />
        <path d="M104 99h83" stroke="#bda06f" strokeDasharray="4 4" />
        <path d="m132 76 19-5 18 16-7 28-29 1-12-17Z" fill="#b1a4be" />
        <circle cx="166" cy="78" r="10" stroke="#9bbbc2" fill="#fbf8fe" />
        <text x="232" y="97" textAnchor="middle" fontSize="18" fill="#9571a1">
          ΔV
        </text>
      </g>
    );
  return (
    <g>
      <path d="M52 59v77h198V59" stroke="#aa93b8" strokeWidth="3" fill="none" />
      <rect x="55" y="78" width="192" height="55" fill="#c8dfe3" />
      <rect x="85" y="58" width="34" height="40" fill="#d2b185" />
      <rect x="178" y="96" width="34" height="34" fill="#bba6ce" />
      <path d="M55 78h192" stroke="#97bec4" />
      <text x="150" y="31" textAnchor="middle" fontSize="16" fill="#94719f">
        ρ solid : ρ liquid
      </text>
    </g>
  );
}
