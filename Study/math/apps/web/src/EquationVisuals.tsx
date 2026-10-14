import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import {
  equationText,
  balanceValues,
  patternPieces,
  type EarlyEquation,
  type BalanceState,
  type GrowingPattern,
} from './equationModels';
export function EquationBoard({
  equation,
  mode,
  symbol = 'x',
}: {
  equation: EarlyEquation;
  mode: LanguageMode;
  symbol?: 'x' | '□';
}) {
  return (
    <figure className="math-equation-board">
      <div
        role="img"
        aria-label={
          mode === 'en'
            ? `Known equation: ${equationText(equation, symbol)}. ${symbol} is unknown; find a value that makes both sides equal.`
            : `已知关系：${equationText(equation, symbol)}。${symbol} 表示未知量，找使两边相等的数。`
        }
      >
        <span>{equationText(equation, symbol)}</span>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '等号连接两边的值；这里没有给出未知量的答案。',
            'The equal sign relates the two values; the unknown answer is not provided here.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function AlgebraBalance({
  state,
  mode,
  candidate,
  checked = false,
}: {
  state: BalanceState;
  mode: LanguageMode;
  candidate: number;
  checked?: boolean;
}) {
  const v = balanceValues(state, candidate),
    tilt =
      !checked || v.relation === 'equal'
        ? 0
        : v.relation === 'left-more'
          ? 18
          : -18;
  const describe = (side: typeof state.left) =>
    mode === 'en'
      ? `${side.boxes} identical box${side.boxes === 1 ? '' : 'es'} and ${side.known} unit counter${side.known === 1 ? '' : 's'}`
      : `${side.boxes} 个相同未知方框与 ${side.known} 个单位点`;
  return (
    <figure className="math-algebra-balance">
      <div
        className="math-algebra-scroll"
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Algebra balance; scroll to see both pans if needed'
            : '代数天平；需要时滚动查看两盘'
        }
      >
        <svg
          viewBox="0 0 640 260"
          role="img"
          aria-label={`${mode === 'en' ? 'Left' : '左边'}: ${describe(state.left)}; ${mode === 'en' ? 'right' : '右边'}: ${describe(state.right)}. ${checked ? (mode === 'en' ? `Candidate ${candidate}; values ${v.left} and ${v.right}.` : `候选值 ${candidate}；两边值为 ${v.left} 和 ${v.right}。`) : mode === 'en' ? 'Symbolic sides; no trial comparison yet.' : '符号两边；尚未核对试代。'}`}
        >
          <path
            d={`M152 ${174 + tilt}L320 174L488 ${174 - tilt}`}
            className="equation-beam"
          />
          <path d="M320 174l-32 64h64Z" className="equation-pivot" />
          <path d="M267 239h106" className="equation-beam" />
          {[state.left, state.right].map((side, i) => {
            const x = i === 0 ? 38 : 366,
              shift = i === 0 ? tilt : -tilt;
            return (
              <g key={i} transform={`translate(${x} ${shift})`}>
                <text x="112" y="17" textAnchor="middle">
                  {mode === 'en'
                    ? i === 0
                      ? 'LEFT'
                      : 'RIGHT'
                    : i === 0
                      ? '左边'
                      : '右边'}
                </text>
                {Array.from({ length: side.boxes }, (_, k) => (
                  <g key={`box${k}`}>
                    <rect
                      className="equation-unknown-box"
                      x={k * 28}
                      y="29"
                      width="24"
                      height="25"
                    />
                    <text x={k * 28 + 12} y="47" textAnchor="middle">
                      □
                    </text>
                  </g>
                ))}
                {Array.from({ length: side.known }, (_, k) => (
                  <circle
                    className="equation-unit-counter"
                    key={`unit${k}`}
                    cx={8 + (k % 10) * 22}
                    cy={70 + Math.floor(k / 10) * 13}
                    r="4"
                  />
                ))}
                <path className="equation-pan" d="M-8 152H232M114 152v22" />
                <text x="112" y="210" textAnchor="middle">
                  {side.boxes}□ + {side.known}
                  {checked ? ` = ${i === 0 ? v.left : v.right}` : ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="math-equation-side-readout">
        {[state.left, state.right].map((side, i) => (
          <div key={i}>
            <small>
              <Text
                mode={mode}
                text={i === 0 ? t('左边', 'Left') : t('右边', 'Right')}
              />
            </small>
            <strong>
              {side.boxes ? `${side.boxes}□ + ${side.known}` : side.known}
            </strong>
          </div>
        ))}
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '每个点是 1 个计数单位；本题所有方框代表同一个未知数。天平是等量关系示意，未试代前的水平线不证明两边已相等。',
            'Each dot is one count unit; every box in this equation represents the same unknown. This is an algebraic illustration. A level beam before checking a trial is not proof of equality.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function GrowingPatternView({
  pattern,
  n,
  mode,
  reveal = false,
}: {
  pattern: GrowingPattern;
  n: number;
  mode: LanguageMode;
  reveal?: boolean;
}) {
  const p = patternPieces(pattern, n),
    width = Math.max(280, n * 40 + 64);
  return (
    <figure className="math-growing-pattern">
      <div
        role="region"
        tabIndex={0}
        aria-label={
          mode === 'en'
            ? 'Constructed pattern; scroll horizontally if needed'
            : '构造规律图；需要时可横向滚动'
        }
      >
        <svg
          viewBox={`0 0 ${width} 132`}
          style={{ minWidth: width }}
          role="img"
          aria-label={
            mode === 'en'
              ? `${n} ${pattern === 'squares' ? 'joined squares; neighbours share exactly one edge. Count distinct sticks.' : 'columns with two counters each, plus one extra counter. Count all dots.'}${reveal ? ` Total ${p.count}.` : ''}`
              : `${n}${pattern === 'squares' ? ' 个共边正方形，相邻恰好共一条边；数不重复的小棒。' : ' 列，每列两个计数点，另加一个点；数所有点。'}${reveal ? ` 共 ${p.count}。` : ''}`
          }
        >
          {pattern === 'squares'
            ? p.segments.map((s, i) => (
                <line
                  className="equation-pattern-stick"
                  data-stick={i}
                  key={i}
                  x1={24 + s.x1 * 40}
                  x2={24 + s.x2 * 40}
                  y1={30 + s.y1 * 40}
                  y2={30 + s.y2 * 40}
                />
              ))
            : p.counters.map((c, i) => (
                <circle
                  className={`equation-pattern-counter ${c.extra ? 'extra' : ''}`}
                  data-counter={i}
                  key={i}
                  cx={24 + c.column * 40}
                  cy={38 + c.row * 48}
                  r="12"
                />
              ))}
          <text x="24" y="123">
            n = {n}
            {reveal ? ` · ${p.count}` : ''}
          </text>
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={
            pattern === 'squares'
              ? t(
                  '每段画出的小棒计一根；相邻共边只画、只计一次。',
                  'Count each drawn stick once; a shared edge is drawn and counted only once.',
                )
              : t(
                  '每列两个相同的点，另有一个额外点；额外点也计一个。',
                  'Every column has two equal counters, plus one extra counter; count the extra once.',
                )
          }
        />
      </figcaption>
    </figure>
  );
}
