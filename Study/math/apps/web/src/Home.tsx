import { Link } from 'react-router-dom';
import { lessons, lessonById, openUnits, unitChecks } from './content';
import { reviewQueue } from './progress';
import { HeroArt } from './Labs';
import { t } from './model';
import { Text } from './ui';
import { status, statuses, type Props } from './pageSupport';
const fractionArt: Record<string, string> = {
  'concept-mapping': 'DOMAIN · EXACTLY ONE OUTPUT · RANGE',
  'concept-representations': 'RULE ↔ TABLE ↔ POINT ↔ GRAPH',
  'concept-properties': 'EVERY ORDERED PAIR · SYMMETRIC DOMAIN',
  'concept-transformations': 'TRACK THE SAME POINT · INNER FACTOR',
  'concept-inverse': 'REVERSE THE MAPPING · UNIQUE PREIMAGE',
  'concept-piecewise': 'BRANCH · BOUNDARY · COMPLETE DOMAIN',
  'logic-elements': 'ELEMENT ∈ SET · SET ⊆ SET',
  'logic-operations': 'AND ∩ · INCLUSIVE OR ∪ · UNIVERSE',
  'logic-statements': 'DOMAIN · QUANTIFIER · COUNTEREXAMPLE',
  'logic-conditions': 'P ⇒ Q · Q ⇒ P · TRUTH SETS',
  'logic-absolute': 'DISTANCE · ENDPOINTS · TWO RAYS',
  'integration-geometry': 'STRUCTURE ↔ EXPRESSION · DIMENSIONS',
  'integration-graph': 'AXES · DOMAIN · GIVEN RULE',
  'integration-strategy': 'DEPENDENCIES · METHOD · TARGET',
  'integration-audit': 'COUNTEREXAMPLE · EVIDENCE · CHECK',
  'integration-ramp': 'EXACT LENGTH · AREA · EVERY CONSTRAINT',
  'probability-independent': 'INTERSECTION · PRODUCT · INDEPENDENCE',
  'probability-tree': 'FIRST × CONDITIONAL · DISJOINT PATHS',
  'probability-without': 'NUMBERED TOKENS · ORDER · REMOVAL',
  'probability-bias': 'POPULATION · FRAME · RESPONSE',
  'probability-simulation': 'THEORY · RECORDS · FINITE VARIATION',
  'trig-sine': 'REFERENCE ANGLE · OPPOSITE / HYPOTENUSE',
  'trig-cos-tan': 'ADJACENT LEG · RATIO DIRECTION',
  'trig-variation': 'ACUTE DOMAIN · CHANGE · UNDEFINED',
  'trig-inverse': 'INVERSE · DEG / RAD · PRECISION',
  'trig-height': 'HORIZONTAL / SIGHT · BASE LEVEL · GRADE',
  'cyclic-elements': 'CHORD · CONTACT · CENTRAL ANGLE',
  'cyclic-inscribed': 'INTERCEPTED ARC · VERTEX SIDE',
  'cyclic-tangents': 'CONTACT RADIUS · EXTERNAL POINT',
  'cyclic-sector': 'TURN FRACTION · EXACT π · UNITS',
  'cyclic-proof': 'PREMISES · DEPENDENCIES · SIMILARITY',
  'similarity-meaning': 'CORRESPONDENCE · ONE SCALE · ORIENTATION',
  'similarity-tests': 'AA · SAS · SSS · SUFFICIENT EVIDENCE',
  'similarity-sides': 'WHOLE SIDES · SCALE DIRECTION',
  'similarity-area': 'LENGTH k · AREA k²',
  'similarity-applications': 'MAP · IMAGE · MODEL PREMISES',
  'parabola-opening': 'SIGN · COMMON SCALES · a ≠ 0',
  'parabola-vertex': 'SHIFT · AXIS · EQUAL DISTANCES',
  'parabola-forms': 'SAME FUNCTION · DIFFERENT FORMS',
  'parabola-intersections': 'CURVE · HORIZONTAL TARGET · EXACT ROOTS',
  'parabola-maximum': 'DOMAIN · CANDIDATES · ATTAINMENT',
  'quadratic-meaning': 'ORIGINAL EQUATION · COMPLETE ROOTS',
  'quadratic-factor': 'ZERO PRODUCT · NO LOST ROOT',
  'quadratic-complete': 'HALF COEFFICIENT · MISSING CORNER',
  'quadratic-formula': 'DERIVE · CHECK a ≠ 0',
  'quadratic-discriminant': 'TWO · REPEATED · NONE',
  'quadratic-apply': 'MODEL · SOLVE · CHECK DOMAIN',
  'radical-meaning': 'TWO ROOTS · ONE PRINCIPAL ROOT',
  'radical-real': 'RATIONAL · IRRATIONAL · REAL LINE',
  'radical-simplify': 'SQUARE FACTOR · EXACT FORM',
  'radical-operations': 'DOMAIN · LIKE TERMS · CONJUGATE',
  'radical-estimate': 'SQUARED BOUNDS · ROUNDING MIDPOINT',
  'research-quartiles': 'ORDER · HALVES · BOX',
  'research-spread': 'CENTRE · RANGE · IQR',
  'research-scatter': 'ONE RECORD · ONE PAIR',
  'research-cause': 'ASSOCIATION · EVIDENCE · SCOPE',
  'research-investigate': 'PROBLEM → PLAN → DATA → ANALYSIS → CONCLUSION',
  'pyth-translate': 'SHIFT · MIRROR · REFERENCE',
  'pyth-rotate': 'CENTRE · DIRECTION · ANGLE',
  'pyth-proof': 'SAME FOUR PIECES · SAME AREA',
  'pyth-apply': 'RIGHT ANGLE · EXACT LENGTH',
  'pyth-converse': 'VALID TRIANGLE → LONGEST SIDE',
  'congruence-meaning': 'SAME SHAPE · SAME SIZE',
  'congruence-sides': 'SSS · INCLUDED ANGLE',
  'congruence-angles': 'TWO ANGLES · ONE SIDE',
  'congruence-isosceles': 'EQUAL SIDES → EQUAL ANGLES',
  'congruence-parallelogram': 'PROPERTIES · COMPLETE TESTS',
  'congruence-proof': 'GIVENS → REASONS → TARGET',
  'function-form': 'INPUT · OUTPUT · PARAMETERS',
  'function-slope': 'Δy / Δx · UNITS',
  'function-intercept': 'x = 0 → (0,b)',
  'function-points': 'TWO POINTS · CHECK BOTH',
  'function-compare': 'RATE ≠ RATIO',
  'function-context': 'UNITS · DOMAIN · ASSUMPTIONS',
  'inequality-meaning': 'ALL VALUES · OPEN OR FILLED',
  'inequality-step': 'BOTH SIDES · REVERSIBLE',
  'inequality-reverse': 'NEGATIVE → REFLECT ORDER',
  'inequality-linear': 'JUSTIFY EACH STEP',
  'inequality-intersection': 'AND → SHARED VALUES',
  'system-relations': 'ONE PAIR · BOTH EQUATIONS',
  'system-substitute': 'WHOLE EXPRESSION → SUBSTITUTE',
  'system-eliminate': 'REPLACE ONE · RETAIN ONE',
  'system-graph': 'LINES → COMMON PAIRS',
  'system-model': 'QUANTITIES · UNITS · DOMAIN',
  'factor-common': 'EVERY TERM → SHARED FACTOR',
  'factor-difference': 'SQUARE DIFFERENCE → CONJUGATES',
  'factor-square': 'ENDS AND MIDDLE',
  'factor-quadratic': 'PRODUCT · SUM · FACTORS',
  'factor-check': 'EXPAND → COMPARE → FINISH',
  'identity-monomial': 'COEFFICIENTS × LETTER FACTORS',
  'identity-distribute': 'ONE × EVERY TERM',
  'identity-binomial': 'ALL PAIRS → COLLECT',
  'identity-square': 'TWO CROSS TERMS',
  'identity-difference': 'OPPOSITE CROSS TERMS',
  'infer-sample': 'FRAME · SAMPLE · POPULATION',
  'infer-distribution': 'CENTRE · SPREAD · SHAPE',
  'infer-outlier': 'RECORD → CHECK → REPORT',
  'infer-space': 'ORDERED · COMPLETE · DISTINCT',
  'infer-tree': 'FIRST × CONDITIONAL',
  'cart-plane': '(x, y) · AXES · ORIGIN',
  'cart-plot': 'ORDER · SIGN · SCALE',
  'cart-table': 'ROW → POINT → MODEL',
  'cart-linear': 'y = kx+b · Δy / Δx',
  'cart-context': 'INPUT · OUTPUT · DOMAIN',
  'plane-objects': 'POINT · LINE · RAY · ANGLE',
  'plane-intersect': 'STRAIGHT → OPPOSITE',
  'plane-parallel': 'GIVENS → ANGLE PAIRS',
  'plane-sum': 'A + B + C = 180°',
  'plane-classify': 'SIDES · ANGLES · EXISTENCE',
  'plane-reasons': 'GIVEN → REASON → CLAIM',
  'linear-check': 'ORIGINAL · BOTH SIDES',
  'linear-balance': 'SAME OPERATION · NONZERO',
  'linear-brackets': '2(x−3) = x+1',
  'linear-fractions': 'WHOLE SIDES × LCM',
  'linear-model': 'UNKNOWN · RELATION · DOMAIN',
  'linear-context': 'EQUALITY → DOMAIN',
  'poly-substitute': 'x² + 2x − 3 · x=−2',
  'poly-like': '3x² + 4x² = 7x²',
  'poly-distribute': 'k(a+b) = ka+kb',
  'poly-sum': 'A−B = A+(−B)',
  'poly-story': 'VARIABLE · UNIT · RELATION',
  'rational-sign': 'a + (−a) = 0',
  'rational-distance': '|b−a| ≥ 0',
  'rational-add': '−3/4 + 1/2 = −1/4',
  'rational-subtract': 'a − b = a + (−b)',
  'rational-scale': '(−) × (−) → (+)',
  'rational-mixed': '−2² ≠ (−2)²',
  'applied-travel': 'd = v × t · ALL TIME?',
  'applied-work': 'WORK = RATE × TIME',
  'applied-budget': 'DISCOUNT · RESERVE · LIMIT',
  'applied-chart': 'DATA → PLAN → CHECK',
  'applied-trip': 'TIME + MONEY · TWO LIMITS',
  'chance-order': 'ORDER · MIDDLE · FREQUENCY',
  'chance-summary': 'MEAN · MEDIAN · MODE',
  'chance-equal': 'IMPOSSIBLE ↔ CERTAIN',
  'chance-event': 'P = FAVOURABLE / TOTAL',
  'chance-frequency': 'THEORY ≠ ONE BATCH',
  'circle-parts': 'O · r · d=2r',
  'circle-pi': 'C ÷ d ≈ 3.14',
  'circle-circumference': 'C = πd = 2πr',
  'circle-area': 'A = πr²',
  'circle-cylinder': '2πrh · πr²h',
  'signed-temperature': '−4°C · 0°C · +4°C',
  'algebra-letter': 'n + n = 2n',
  'algebra-nth': '3n + 2 · STAGE n',
  'algebra-expression': '3(n + 2) = 3n + 6',
  'algebra-balance': '2x = 10 ↔ x = 5',
  'algebra-brackets': '3(x + 2) = 15',
  'signed-line': '← −2 · −1 · 0 · 1 · 2 →',
  'signed-compare': '−8 < −3',
  'signed-move': '−3 + 5 → 2',
  'signed-absolute': '|−6| = |6| = 6',
  'ratio-compare': 'A : B ≠ A : TOTAL',
  'ratio-simplify': '6 : 9 ↔ 2 : 3',
  'ratio-share': '25 L → 2 + 3 PARTS',
  'ratio-table': '2 : 3 → 4 : 6',
  'ratio-map': '1 : 50,000',
  'ratio-graph': 'y = kx · (0, 0)',
  'percent-hundred': '25 / 100 ↔ 25%',
  'percent-decimal': '0.375 ↔ 37.5%',
  'percent-fraction': '3/8 ↔ 37.5%',
  'percent-amount': '80 L × 35%',
  'percent-whole': '30% ↔ 18 L',
  'percent-change': '100% → 80% → 96%',
  'product-repeat': '3 × 3/4',
  'product-area': '2/3 × 3/4',
  'product-amount': '12 L × 2/3',
  'product-share': '3/4 ÷ 2',
  'product-whole-divide': '2 ÷ 3/4',
  'product-fraction-divide': '3/4 ÷ 2/3',
  'data-frequency': 'RECORD → COUNT',
  'data-mean': 'TOTAL ÷ COUNT',
  'data-line': 'TIME → CHANGE',
  'data-chart': '40 · 44 · SCALE',
  'data-recipe': 'g · mL · NZ$',
  'geo-units': 'cm · cm² · cm³',
  'geo-rectangle': '6 × 4 cm²',
  'geo-triangle': 'b × h ÷ 2',
  'geo-parallel-trapezoid': '(a+b)h ÷ 2',
  'geo-volume': '4 × 3 × 2',
  'geo-surface': '6 faces · cm²',
  'equation-box': '□ + 7 = 19',
  'equation-balance': '8 + 4 = □ + 5',
  'equation-pattern': '3n + 1',
  'equation-one-step': '4x = 5',
  'equation-story': 'x · NZ$ · m',
  'fraction-add-like': '3/8 + 2/8',
  'fraction-subtract-like': '7/8 − 3/8',
  'fraction-add-unlike': '2/3 + 1/4',
  'fraction-subtract-unlike': '3/4 − 1/6',
  'fraction-story': 'L · m · NZ$',
  'fraction-whole': '1/8 · 1/6',
  'fraction-kind': '7/4 > 1',
  'fraction-mixed': '2 ¾ = 11/4',
  'fraction-equivalent': '2/3 = 4/6',
  'fraction-simplify': '12/18 → 2/3',
  'fraction-compare': '3/4 > 2/3',
};
const operationArt: Record<string, string> = {
  'operation-parts': '8 + 5 = 13',
  'operation-array': '3 × 4 = 12',
  'operation-division': '24 ÷ 6 = 4',
  'operation-inverse': '12 ÷ 3 ↔ 3 × 4',
  'operation-choose': '+ − × ÷ ?',
};
const calculationArt: Record<string, string> = {
  'calculation-regroup': '10 × 1 ↔ 1 × 10',
  'calculation-split': '6 × (5 + 3)',
  'calculation-area': '23 × 14',
  'calculation-division': '936 ÷ 12',
  'calculation-estimate': '23 × 19 ≈ 400',
};
const measurementArt: Record<string, string> = {
  'measurement-length': '7 cm = 70 mm',
  'measurement-perimeter': '8 + 5 + 8 + 5',
  'measurement-area': '24 cm²',
  'measurement-angle': '45° · 90° · 120°',
  'measurement-bars': '0 · 2 · 4 · 6 …',
};
const problemArt: Record<string, string> = {
  'problem-information': '18 = 7 + ?',
  'problem-represent': '9 + ? = 24',
  'problem-two-step': '4 × 6 − 5',
  'problem-relevance': 'NZ$30 − 4×5',
  'problem-explain': '17 + 3 = 20',
};
const integerArt: Record<string, string> = {
  'integer-mixed': '1200 + 36×25',
  'integer-order': '(24 + 36) ÷ 6',
  'integer-factors': '4 × 6 = 24',
  'integer-prime': '49 = 7 × 7',
  'integer-common': 'GCF 6 · LCM 72',
};
function LessonCards({ mode, store, unitId }: Props & { unitId: string }) {
  return (
    <div className="math-lesson-grid">
      {lessons
        .filter((l) => l.unit === unitId)
        .map((l, i) => (
          <Link
            to={`/math/lesson/${l.id}`}
            className="math-lesson-card"
            key={l.id}
          >
            <div className="math-row">
              <span className="math-lesson-number">0{i + 1}</span>
              <span className={`math-status ${status(l.id, store)}`}>
                <Text mode={mode} text={statuses[status(l.id, store)]} />
              </span>
            </div>
            <div className={`math-mini-art art-${l.lab}`} aria-hidden="true">
              {fractionArt[l.lab] ? (
                <span>{fractionArt[l.lab]}</span>
              ) : operationArt[l.lab] ? (
                <span>{operationArt[l.lab]}</span>
              ) : calculationArt[l.lab] ? (
                <span>{calculationArt[l.lab]}</span>
              ) : measurementArt[l.lab] ? (
                <span>{measurementArt[l.lab]}</span>
              ) : problemArt[l.lab] ? (
                <span>{problemArt[l.lab]}</span>
              ) : integerArt[l.lab] ? (
                <span>{integerArt[l.lab]}</span>
              ) : l.lab === 'decimal-place' ? (
                <span>0.307</span>
              ) : l.lab === 'decimal-compare' ? (
                <span>0.805 &gt; 0.8</span>
              ) : l.lab === 'decimal-add' ? (
                <span>1.2 + 0.45</span>
              ) : l.lab === 'decimal-multiply' ? (
                <span>0.325 × 4</span>
              ) : l.lab === 'decimal-divide' ? (
                <span>1.5 ÷ 4</span>
              ) : l.lab === 'decimal-application' ? (
                <span>NZ$1.25 × 3</span>
              ) : l.lab === 'number-reader' ? (
                <span>10,005</span>
              ) : l.lab === 'place-value' ? (
                <span>6 × 1,000</span>
              ) : l.lab === 'whole-line' ? (
                <span>500 ─ ● ─ 600</span>
              ) : l.lab === 'rounding' ? (
                <span>3,465 ≈ 3,500</span>
              ) : l.lab === 'regroup' ? (
                <span>100 = 10 × 10</span>
              ) : l.lab === 'parts' ? (
                <span>▰ ▰ ▰ ▱</span>
              ) : l.lab === 'fractions' ? (
                <span>
                  ½ <i>=</i> ²⁄₄
                </span>
              ) : l.lab === 'line' ? (
                <span>0 ─ ● ─ 1</span>
              ) : l.lab === 'decimal' ? (
                <span>
                  .01 <i>→</i> .10
                </span>
              ) : (
                <span>
                  $ <i>2.50</i>
                </span>
              )}
            </div>
            <span className="math-eyebrow">{l.id}</span>
            <h3>
              <Text mode={mode} text={l.title} />
            </h3>
            <div className="math-card-footer">
              <span>
                <Text
                  mode={mode}
                  text={t(`约 ${l.minutes} 分钟`, `${l.minutes} min`)}
                />
              </span>
              <span>↗</span>
            </div>
          </Link>
        ))}
    </div>
  );
}
export function Home({ mode, store }: Props) {
  const done = lessons.filter(
    (l) => store.progress.sessions[l.id]?.completedAt,
  ).length;
  const next =
    lessonById(store.progress.preferredLesson) ??
    lessonById(
      store.progress.lastLesson &&
        !store.progress.sessions[store.progress.lastLesson]?.completedAt
        ? store.progress.lastLesson
        : undefined,
    ) ??
    lessons.find((l) => !store.progress.sessions[l.id]?.completedAt) ??
    lessons[0]!;
  const due = reviewQueue(store.progress).length;
  return (
    <>
      <div className="math-row math-topline">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t('你的数学探索空间', 'YOUR SPACE TO MAKE SENSE OF MATHS')}
          />
        </span>
        <span className="math-badge">
          <Text
            mode={mode}
            text={t(
              `${openUnits.length} 个单元 · ${lessons.length} 节微课`,
              `${openUnits.length} UNITS · ${lessons.length} MICRO-LESSONS`,
            )}
          />
        </span>
      </div>
      <section className="math-hero">
        <div className="math-hero-copy">
          <span className="math-eyebrow">MATH EXPLORER LAB / 01</span>
          <h1>
            <Text
              mode={mode}
              text={t('先看见，再算懂。', 'See it. Make sense of it.')}
            />
          </h1>
          <p>
            <Text
              mode={mode}
              text={t(
                '把抽象的数字，变成可以触摸的发现。从一块巧克力开始，找到数学里的“为什么”。',
                'Turn abstract numbers into discoveries you can explore. Start with a chocolate bar. Find the “why” in maths.',
              )}
            />
          </p>
          <div className="math-hero-actions">
            <Link className="math-button" to={`/math/lesson/${next.id}`}>
              <Text
                mode={mode}
                text={t(
                  store.progress.sessions[next.id]
                    ? '继续我的探索'
                    : '开始探索',
                  store.progress.sessions[next.id]
                    ? 'Continue exploring'
                    : 'Start exploring',
                )}
              />
              <span>↗</span>
            </Link>
            <div className="math-hero-meta">
              <Text
                mode={mode}
                text={t(
                  '每次约 12–20 分钟 · 按自己的节奏',
                  'ABOUT 12–20 MIN · AT YOUR OWN PACE',
                )}
              />
            </div>
          </div>
        </div>
        <HeroArt />
      </section>
      <div className="math-overview">
        <div>
          <span className="math-overview-icon">◷</span>
          <div>
            <strong>
              {done} / {lessons.length}
            </strong>
            <Text
              mode={mode}
              text={t('已留下学习记录', 'lessons with reflections')}
            />
          </div>
        </div>
        <div>
          <span className="math-overview-icon">↻</span>
          <div>
            <strong>{due}</strong>
            <Text
              mode={mode}
              text={t('等待重温的发现', 'discoveries to revisit')}
            />
          </div>
        </div>
        <div>
          <span className="math-overview-icon">∞</span>
          <div>
            <strong>
              <Text mode={mode} text={t('没有倒计时', 'No countdown')} />
            </strong>
            <Text
              mode={mode}
              text={t('理解比速度更重要', 'Understanding before speed')}
            />
          </div>
        </div>
      </div>
      <Link className="math-diagnostic-banner" to="/math/check">
        <span className="math-diagnostic-icon">⌕</span>
        <div>
          <h3>
            <Text
              mode={mode}
              text={t(
                '从哪里开始？一起找找看。',
                'Where to begin? Let’s find out.',
              )}
            />
          </h3>
          <p>
            <Text
              mode={mode}
              text={t(
                '4 个小题组，发现已经会的和可以再探索的。不计时，可以跳过。',
                'Four small question groups to find what you know and what to explore. No timer. Skip any question.',
              )}
            />
          </p>
        </div>
        <span className="math-banner-action">
          <Text
            mode={mode}
            text={t('了解我的起点', 'Find my starting point')}
          />{' '}
          →
        </span>
      </Link>
      {openUnits.map((unit) => (
        <section key={unit.id} id={unit.id}>
          <div className="math-section-heading">
            <div>
              <span className="math-eyebrow">
                {unit.id} / {unit.title.en.toUpperCase()}
              </span>
              <h2>
                <Text
                  mode={mode}
                  text={
                    unit.id === 'B01'
                      ? t(
                          '把数看清楚，才能算得稳。',
                          'See numbers clearly. Build solid understanding.',
                        )
                      : unit.id === 'B04'
                        ? t(
                            '从一个整体，走进分数与小数。',
                            'One whole. A world of fractions and decimals.',
                          )
                        : unit.id === 'P52'
                          ? t(
                              '看清小单位，算懂小数。',
                              'Small units. Clear decimal thinking.',
                            )
                          : unit.id === 'P53'
                            ? t(
                                '同一整体，不同分法。',
                                'Same whole. Different ways to count.',
                              )
                            : unit.title
                  }
                />
              </h2>
            </div>
            <div className="math-unit-heading-links">
              {unit.id in unitChecks && (
                <Link to={`/math/unit/${unit.id}/check`}>
                  <Text mode={mode} text={t('单元小回顾', 'Unit review')} /> ↗
                </Link>
              )}
              <Link to={`/math/path?stage=${unit.stage}`}>
                <Text
                  mode={mode}
                  text={t('完整学习路线', 'Full learning path')}
                />{' '}
                ↗
              </Link>
            </div>
          </div>
          <LessonCards mode={mode} store={store} unitId={unit.id} />
        </section>
      ))}
      <div className="math-bottom-note">
        <span>✦</span>
        <Text
          mode={mode}
          text={t(
            '可以跳过已会的内容，也可以随时回头。每一课，都是一次小发现。',
            'Skip what you already know. Come back whenever you need. Every lesson is a small discovery.',
          )}
        />
      </div>
    </>
  );
}
