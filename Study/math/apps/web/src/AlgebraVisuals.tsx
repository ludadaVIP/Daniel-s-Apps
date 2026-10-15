import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import {
  affineText,
  evaluateAffine,
  sameR,
  textR,
  type AlgebraEquation,
  type Rational,
} from './algebraModels';
export function AlgebraGroups({
  n,
  inside,
  mode,
}: {
  n: number;
  inside: boolean;
  mode: LanguageMode;
}) {
  if (!Number.isInteger(n) || n < 0 || n > 10)
    throw new RangeError('Display zero to ten counters per row');
  return (
    <figure className="math-algebra-figure">
      <div
        className="math-algebra-scroll"
        tabIndex={0}
        role="region"
        aria-label={
          mode === 'en'
            ? 'Three labelled groups; scroll within the model'
            : '三个有标签分组；可在图内滚动'
        }
      >
        <svg
          viewBox="0 0 460 240"
          role="img"
          aria-label={
            mode === 'en'
              ? `Three groups of ${n}${inside ? ' plus two each' : ', then two extras'}`
              : `三组各 ${n}${inside ? ' 加二' : '，另有两个'}`
          }
        >
          {[0, 1, 2].map((row) => (
            <g key={row} data-algebra-row={row}>
              <rect
                x="12"
                y={12 + row * 62}
                width="360"
                height="54"
                rx="9"
                className="algebra-group"
              />
              <text x="22" y={45 + row * 62}>
                {row + 1}
              </text>
              {Array.from({ length: n }, (_, i) => (
                <circle
                  key={i}
                  data-variable-counter
                  cx={58 + i * 24}
                  cy={39 + row * 62}
                  r="8"
                  className="algebra-variable"
                />
              ))}
              {inside &&
                [0, 1].map((i) => (
                  <g key={i} data-fixed-counter>
                    <rect
                      x={306 + i * 24}
                      y={31 + row * 62}
                      width="16"
                      height="16"
                      className="algebra-fixed"
                    />
                    <text x={310 + i * 24} y={44 + row * 62}>
                      +
                    </text>
                  </g>
                ))}
              <text x="382" y={45 + row * 62}>
                {inside ? 'n + 2' : 'n'}
              </text>
            </g>
          ))}
          {!inside &&
            [0, 1].map((i) => (
              <g key={i} data-fixed-counter>
                <rect
                  x={198 + i * 24}
                  y="208"
                  width="16"
                  height="16"
                  className="algebra-fixed"
                />
                <text x={202 + i * 24} y="221">
                  +
                </text>
              </g>
            ))}
        </svg>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '圆点表示每组随 n 改变的个数，带 + 的方块表示固定额外量。空行保留组框，n=0 不消去固定量。',
            'Circles show the changing n per group; squares marked + show fixed extras. Empty rows retain their group boxes: n=0 does not remove fixed extras.',
          )}
        />
      </figcaption>
    </figure>
  );
}
export function AlgebraBoard({
  equation,
  candidate,
  mode,
}: {
  equation: AlgebraEquation;
  candidate: Rational | null;
  mode: LanguageMode;
}) {
  const left = candidate ? evaluateAffine(equation.left, candidate) : null,
    right = candidate ? evaluateAffine(equation.right, candidate) : null;
  return (
    <figure className="math-algebra-figure">
      <div
        className="math-algebra-board"
        role="group"
        aria-label={
          mode === 'en' ? 'Equality relationship board' : '等量关系板'
        }
      >
        <div>
          <span>
            <Text mode={mode} text={t('左边', 'Left side')} />
          </span>
          <strong>{affineText(equation.left)}</strong>
          {left && <output data-algebra-left>{textR(left)}</output>}
        </div>
        <b>{left && right ? (sameR(left, right) ? '=' : '≠') : '='}</b>
        <div>
          <span>
            <Text mode={mode} text={t('右边', 'Right side')} />
          </span>
          <strong>{affineText(equation.right)}</strong>
          {right && <output data-algebra-right>{textR(right)}</output>}
        </div>
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '关系板把括号等值展开为“系数 × x 加固定量”，如 3(x+2)=3x+6；原方程始终另行保留。这里借用天平的“两边同做”思想，不把负数解释成负质量。代入一个数检验当前等式，不能据此证明所有变形等价。',
            'The board expands brackets equivalently into a coefficient times x plus a fixed term, for example 3(x+2)=3x+6; the original equation remains separately displayed. It uses the balance idea of equal actions without treating negatives as negative mass. One substituted value checks the current equality, not equivalence of every transformation.',
          )}
        />
      </figcaption>
    </figure>
  );
}
