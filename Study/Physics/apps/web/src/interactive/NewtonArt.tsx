import type { NewtonKind } from './newtonModels';
export function NewtonArt({ kind }: { kind: NewtonKind }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.5">
      {kind === 'pairs' ? (
        <>
          <rect x="52" y="76" width="39" height="25" rx="5" fill="#f2ce83" />
          <rect x="205" y="76" width="39" height="25" rx="5" fill="#bb9fcc" />
          <path d="M91 87H205M87 52H42l8 -6m-8 6l8 6M206 52H251l-8 -6m8 6l-8 6M28 116H272" />
          <text x="98" y="44" fill="currentColor" stroke="none">
            F / −F
          </text>
        </>
      ) : kind === 'diagram' ? (
        <>
          <circle cx="150" cy="76" r="10" fill="#b3d0c6" />
          <path d="M150 66V28l-6 8m6 -8l6 8M150 86v38l-6 -8m6 8l6 -8M160 76h70l-8 -6m8 6l-8 6" />
          <text x="173" y="39" fill="currentColor" stroke="none">
            N
          </text>
          <text x="173" y="122" fill="currentColor" stroke="none">
            W
          </text>
        </>
      ) : (
        <>
          <path d="M30 114H270" />
          <rect x="128" y="80" width="43" height="26" rx="5" fill="#f2ce83" />
          <path d="M175 59h65l-8 -6m8 6l-8 6" />
          {kind === 'net' && <path d="M125 59H60l8 -6m-8 6l8 6" />}
          <text x="95" y="39" fill="currentColor" stroke="none">
            {kind === 'inertia'
              ? 'ΣF = 0'
              : kind === 'mass'
                ? 'a ∝ 1/m'
                : 'ΣF = ma'}
          </text>
        </>
      )}
    </g>
  );
}
