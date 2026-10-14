import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { t, type Lesson } from './model';
import { Fraction, Strip, Text } from './ui';
export function HeroArt() {
  return (
    <div className="math-hero-art" aria-hidden="true">
      <div className="math-art-orbit" />
      <div className="math-art-tag">SAME WHOLE. NEW PERSPECTIVE.</div>
      <div className="math-art-card a">
        <Fraction n={1} d={2} />
        <div className="math-art-circle" />
      </div>
      <div className="math-art-card b">
        <Fraction n={2} d={4} />
        <Strip n={2} d={4} />
        <div className="math-art-equation">1/2 = 2/4</div>
      </div>
      <span className="math-art-plus">+</span>
      <span className="math-art-dot" />
      <span className="math-art-footer">
        FIG. 01 — THE BEAUTY OF EQUAL PARTS
      </span>
    </div>
  );
}
export function Lab({
  kind,
  mode,
}: {
  kind: Lesson['lab'];
  mode: LanguageMode;
}) {
  const [d, setD] = useState(4),
    [n, setN] = useState(1),
    [hundred, setHundred] = useState(35),
    [coins, setCoins] = useState<number[]>([]);
  const setParts = (value: number) => {
    setD(value);
    setN((v) => Math.min(v, value));
  };
  const total = coins.reduce((sum, c) => sum + c, 0);
  return (
    <section className="math-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '动手数学 · 先猜，再试',
              'HANDS-ON MATHS · PREDICT, THEN TRY',
            )}
          />
        </span>
        <span className="math-live">
          <Text mode={mode} text={t('实时模型', 'LIVE MODEL')} />
        </span>
      </div>
      {['parts', 'fractions', 'line'].includes(kind) && (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                kind === 'line'
                  ? '如果把份数翻倍，原来的位置会在哪里？先猜一猜，再动滑块。'
                  : kind === 'fractions'
                    ? '同一个整体，分成更多份，每一份会变大还是变小？先猜一猜。'
                    : '点选巧克力方格。改变等份数，看看分子、分母各表示什么。',
                kind === 'line'
                  ? 'If you double the number of parts, where will the same position be? Predict, then move the slider.'
                  : kind === 'fractions'
                    ? 'With the same whole and more equal parts, does each piece become larger or smaller? Predict first.'
                    : 'Select pieces of chocolate. Change the equal parts and see what the numerator and denominator mean.',
              )}
            />
          </p>
          <div className="math-lab-equation">
            <Fraction n={n} d={d} />
            <span>{(n * 1000) % d === 0 ? '=' : '≈'}</span>
            <span>{Number((n / d).toFixed(3))}</span>
            <small>
              <Text
                mode={mode}
                text={t(
                  '小数显示至三位；分数是精确值',
                  'Decimal shown to 3 places; fraction is exact',
                )}
              />
            </small>
          </div>
          {kind === 'line' ? (
            <svg viewBox="0 0 640 120" role="img" aria-label={`${n}/${d}`}>
              <path d="M30 50H610" stroke="#b9b5cc" strokeWidth="3" />
              {Array.from({ length: d + 1 }, (_, i) => (
                <g key={i}>
                  <path
                    d={`M${30 + (i / d) * 580} 42v16`}
                    stroke="#625b92"
                    strokeWidth="2"
                  />
                  <text
                    x={30 + (i / d) * 580}
                    y="85"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#625b92"
                  >
                    {i === 0 ? '0' : i === d ? '1' : `${i}/${d}`}
                  </text>
                </g>
              ))}
              <path
                d={`M30 50H${30 + (n / d) * 580}`}
                stroke="#6057ab"
                strokeWidth="5"
              />
              <circle cx={30 + (n / d) * 580} cy="50" r="9" fill="#6057ab" />
            </svg>
          ) : (
            <Strip n={n} d={d} onChange={setN} />
          )}
          <div className="math-lab-controls">
            <label>
              <Text
                mode={mode}
                text={t('整体等份数', 'Equal parts in the whole')}
              />
              <input
                aria-label={mode === 'en' ? 'Equal parts' : '整体等份数'}
                type="range"
                min="2"
                max="12"
                value={d}
                onChange={(e) => setParts(Number(e.target.value))}
              />
              <output>{d}</output>
            </label>
            <label>
              <Text
                mode={mode}
                text={t(
                  kind === 'line' ? '向右走几格' : '选中几份',
                  kind === 'line' ? 'Intervals from 0' : 'Selected parts',
                )}
              />
              <input
                aria-label={mode === 'en' ? 'Selected parts' : '选中几份'}
                type="range"
                min="0"
                max={d}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
              />
              <output>{n}</output>
            </label>
          </div>
          {kind === 'fractions' && (
            <div className="math-strip-comparison">
              <div>
                <Fraction n={1} d={2} />
                <Strip n={1} d={2} />
              </div>
              <div>
                <Fraction n={1} d={d} />
                <Strip n={1} d={d} />
              </div>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    '两条一样长：整体相同，才能比较每份大小。',
                    'Both strips have the same length: compare pieces of the same whole.',
                  )}
                />
              </p>
            </div>
          )}
        </>
      )}
      {kind === 'decimal' && (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '移动滑块，观察一行的 10 格怎样对应十分之一。',
                'Move the slider. See how a row of 10 squares equals one tenth.',
              )}
            />
          </p>
          <div className="math-decimal-model">
            <div
              className="math-hundred"
              role="img"
              aria-label={`${hundred}/100`}
            >
              {Array.from({ length: 100 }, (_, i) => (
                <span key={i} className={i < hundred ? 'filled' : ''} />
              ))}
            </div>
            <div>
              <div className="math-lab-equation">
                <Fraction n={hundred} d={100} />
                <span>=</span>
                <strong>{(hundred / 100).toFixed(2)}</strong>
              </div>
              <p>
                <Text
                  mode={mode}
                  text={t(
                    `${Math.floor(hundred / 10)} 个十分之一 + ${hundred % 10} 个百分之一`,
                    `${Math.floor(hundred / 10)} tenths + ${hundred % 10} hundredths`,
                  )}
                />
              </p>
              <label>
                <Text mode={mode} text={t('涂色方格', 'Shaded squares')} />
                <input
                  aria-label={mode === 'en' ? 'Shaded squares' : '涂色方格'}
                  type="range"
                  min="0"
                  max="99"
                  value={hundred}
                  onChange={(e) => setHundred(Number(e.target.value))}
                />
                <output>{hundred}</output>
              </label>
              <div className="math-row">
                <button
                  className="math-button secondary"
                  onClick={() => setHundred(50)}
                >
                  0.50
                </button>
                <button
                  className="math-button secondary"
                  onClick={() => setHundred(45)}
                >
                  0.45
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {kind === 'money' && (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '试着凑出 NZ$2.50。点击真实面额的钱币，看看元与分怎样对应。',
                'Try to build NZ$2.50. Select real coin denominations and connect dollars with cents.',
              )}
            />
          </p>
          <div className="math-lab-equation">
            <strong>NZ${(total / 100).toFixed(2)}</strong>
            <span>=</span>
            <span>{total}</span>
            <small>
              <Text mode={mode} text={t('分', 'cents')} />
            </small>
          </div>
          <div className="math-coins">
            {[10, 20, 50, 100, 200].map((c) => (
              <button
                key={c}
                onClick={() => setCoins((v) => (v.length < 50 ? [...v, c] : v))}
                disabled={coins.length >= 50}
              >
                {c >= 100 ? `$${c / 100}` : `${c}c`}
                <small>+</small>
              </button>
            ))}
          </div>
          <div className="math-coin-tray">
            {coins.length ? (
              coins.map((c, i) => (
                <button
                  key={i}
                  aria-label={`${mode === 'en' ? 'Remove' : '移除'} ${c}c`}
                  onClick={() => setCoins((v) => v.filter((_, j) => j !== i))}
                >
                  {c >= 100 ? `$${c / 100}` : `${c}c`} ×
                </button>
              ))
            ) : (
              <Text
                mode={mode}
                text={t(
                  '钱币会放在这里，点一下可移除。',
                  'Your coins appear here. Select a coin to remove it.',
                )}
              />
            )}
          </div>
          <button
            className="math-button secondary"
            onClick={() => setCoins([])}
          >
            <Text mode={mode} text={t('重新摆一次', 'Start again')} />
          </button>
        </>
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '停一下：你改变了什么？什么保持不变？把发现说出来。',
            'Pause: what changed? What stayed the same? Explain your discovery.',
          )}
        />
      </div>
    </section>
  );
}
