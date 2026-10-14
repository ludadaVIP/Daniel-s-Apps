import { useEffect, useRef, useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { t } from './model';
import { Text } from './ui';
import { FractionBars } from './FractionVisuals';
import {
  fractionOperation,
  type FractionOperation,
} from './fractionOperationModels';
import type { FractionValue } from './fractionModels';

export function FractionOperands({
  left,
  right,
  operation,
  mode,
}: {
  left: FractionValue;
  right: FractionValue;
  operation: FractionOperation;
  mode: LanguageMode;
}) {
  return (
    <div className="math-fraction-operands">
      <FractionBars
        value={left}
        mode={mode}
        label={t('已知量 A', 'Known amount A')}
      />
      <strong
        className="math-fraction-sign"
        aria-label={
          operation === '+'
            ? mode === 'en'
              ? 'add'
              : '相加'
            : mode === 'en'
              ? 'subtract'
              : '相减'
        }
      >
        {operation}
      </strong>
      <FractionBars
        value={right}
        mode={mode}
        label={t('已知量 B', 'Known amount B')}
      />
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            '两组用相同的整体标尺；这里只显示已知量，结果由你预测。',
            'Both use the same whole reference. Only known amounts are shown; predict the result.',
          )}
        />
      </p>
    </div>
  );
}

export function FractionOperationGrid({
  left,
  right,
  operation,
  denominator,
  mode,
  result = false,
}: {
  left: FractionValue;
  right: FractionValue;
  operation: FractionOperation;
  denominator: number;
  mode: LanguageMode;
  result?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  useEffect(() => {
    const element = container.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const update = () => setAvailable(Math.max(0, element.clientWidth - 26));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const model = fractionOperation(left, right, operation, denominator);
  const count = result
    ? model.wholes
    : Math.max(
        1,
        Math.ceil(Math.max(model.left.n, model.right.n) / denominator),
      );
  const wholeWidth = Math.max(160, denominator * 12, available - 16);
  const rows = result ? ['result'] : ['A', 'B'];
  const width = count * (wholeWidth + 16);
  return (
    <div
      ref={container}
      className="math-fraction-grid-scroll"
      tabIndex={0}
      role="region"
      aria-label={
        mode === 'en'
          ? 'Equal-part strips; scroll horizontally when needed'
          : '等份条；需要时可横向滚动'
      }
    >
      <div style={{ minWidth: width }}>
        {rows.map((row) => {
          const label =
            row === 'result'
              ? t(
                  operation === '+' ? '合并：A 接着 B' : '从 A 中划去 B',
                  operation === '+'
                    ? 'Join: A followed by B'
                    : 'Cross out B from A',
                )
              : t(
                  `量 ${row} · 每份 1/${denominator}`,
                  `Amount ${row} · each part 1/${denominator}`,
                );
          return (
            <div key={row} className="math-fraction-grid-row">
              <Text mode={mode} text={label} />
              <svg
                viewBox={`0 0 ${width} 76`}
                style={{ width }}
                role="img"
                aria-label={
                  mode === 'en'
                    ? `${row === 'result' ? 'Operation model' : `Known ${row}`}: ${count} equal wholes, each in ${denominator} equal parts. ${result && operation === '−' ? 'Crosses mark removed pieces.' : 'Lettered regions identify quantities.'}`
                    : `${row === 'result' ? '运算模型' : `已知 ${row}`}：${count} 个同样的整体，每个等分 ${denominator} 份。${result && operation === '−' ? '叉号表示划去的份。' : '字母区分各量。'}`
                }
              >
                {Array.from({ length: count }, (_, w) => {
                  const x = w * (wholeWidth + 16);
                  return (
                    <g key={w}>
                      <text x={x + 2} y={14}>
                        {mode === 'en' ? 'Whole' : '整体'} {w + 1}
                      </text>
                      {Array.from({ length: denominator }, (_, part) => {
                        const i = w * denominator + part;
                        const cellX = x + (part * wholeWidth) / denominator;
                        const filled =
                          row === 'A'
                            ? i < model.left.n
                            : row === 'B'
                              ? i < model.right.n
                              : operation === '+'
                                ? i < model.raw.n
                                : i < model.left.n;
                        const removed =
                          row === 'result' &&
                          operation === '−' &&
                          i >= model.raw.n &&
                          i < model.left.n;
                        const fromB =
                          row === 'B' ||
                          (row === 'result' &&
                            operation === '+' &&
                            i >= model.left.n &&
                            filled);
                        return (
                          <g key={part}>
                            <rect
                              className={`fraction-operation-cell ${filled ? (fromB ? 'from-b' : 'from-a') : ''} ${removed ? 'removed' : ''}`}
                              data-piece={i}
                              data-state={
                                removed
                                  ? 'removed'
                                  : filled
                                    ? fromB
                                      ? 'B'
                                      : 'A'
                                    : 'empty'
                              }
                              x={cellX + 1}
                              y={24}
                              width={wholeWidth / denominator - 1}
                              height={42}
                            />
                            {removed && (
                              <path
                                className="fraction-removed-cross"
                                d={`M${cellX + 3} 29L${cellX + wholeWidth / denominator - 3} 61M${cellX + 3} 61L${cellX + wholeWidth / denominator - 3} 29`}
                              />
                            )}
                          </g>
                        );
                      })}
                      {row === 'result' && operation === '+' && (
                        <>
                          {model.left.n > w * denominator && (
                            <text x={x + 6} y={51}>
                              A
                            </text>
                          )}
                          {model.right.n > 0 &&
                            model.raw.n > w * denominator &&
                            model.left.n < (w + 1) * denominator && (
                              <text
                                x={
                                  x +
                                  (Math.max(0, model.left.n - w * denominator) *
                                    wholeWidth) /
                                    denominator +
                                  6
                                }
                                y={51}
                              >
                                B
                              </text>
                            )}
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          );
        })}
      </div>
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            `每个完整整体等分 ${denominator} 份，每小格确实是 1/${denominator}；整体大小不变。宽图可横向滚动。`,
            `Every full whole has ${denominator} equal parts; each tile is exactly 1/${denominator}. The whole size stays fixed within this model. Scroll wide diagrams horizontally.`,
          )}
        />
      </p>
    </div>
  );
}
