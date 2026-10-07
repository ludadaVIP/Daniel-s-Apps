import { useState } from 'react';
import type { LanguageMode } from '@study/shared';

type Stage = 'raw' | 'filtered' | 'evaporated' | 'distilled';

export function SeparationRecoveryLab({ mode }: { mode: LanguageMode }) {
  const en = mode === 'en';
  const [stage, setStage] = useState<Stage>('raw');
  const [sandSeparated, setSandSeparated] = useState(false);
  const finished = stage === 'evaporated' || stage === 'distilled';
  const success = sandSeparated && stage === 'distilled';
  const sourceMass = finished
    ? sandSeparated
      ? 10
      : 15
    : sandSeparated
      ? 110
      : 115;
  const sandMass = sandSeparated ? 5 : 0;
  const waterMass = stage === 'distilled' ? 100 : 0;
  const airMass = stage === 'evaporated' ? 100 : 0;
  const sourceName = finished
    ? sandSeparated
      ? en
        ? 'Salt residue'
        : '盐残留物'
      : en
        ? 'Sand + salt residue'
        : '沙与盐混合残留物'
    : sandSeparated
      ? en
        ? 'Clear salt solution'
        : '清澈的盐水'
      : en
        ? 'Sand + salt solution'
        : '沙与盐水混合物';
  const feedback =
    stage === 'raw'
      ? en
        ? 'Goal: recover sand, salt and water separately. Which property will you use first?'
        : '目标：把沙、盐、水分别回收。你先利用哪一种性质差异？'
      : stage === 'filtered'
        ? en
          ? 'Sand is collected; dissolved salt passes through with water. Now choose how to keep both salt and water.'
          : '沙已收集；溶解的盐随水通过滤纸。下一步怎样同时保留盐和水？'
        : success
          ? en
            ? 'Recovered all three: sand 5 g + salt 10 g + water 100 g = 115 g.'
            : '三样分别回收成功：沙 5 g + 盐 10 g + 水 100 g = 115 g。'
          : stage === 'evaporated'
            ? en
              ? 'Water has entered the air instead of a collector. Mass is conserved, but the recovery goal is not met. Reset and compare another route.'
              : '水进入了空气，没有进入收集杯。质量仍守恒，但回收目标未完成。重置后比较另一条路线。'
            : en
              ? 'Water is collected, but sand and salt remain mixed. Reset and try separating the insoluble sand first.'
              : '水已收集，但沙和盐仍混在原容器中。重置后试试先分出不溶的沙。';

  return (
    <div className="separation-recovery-lab">
      <div className="recovery-particles">
        <p>
          {sourceName} · {sourceMass} g
        </p>
        <div
          className={`recovery-vessel ${finished ? 'is-dry' : ''}`}
          aria-hidden="true"
        >
          {!finished &&
            Array.from({ length: 8 }, (_, index) => (
              <i
                className="recovery-water"
                key={`water-${index}`}
                style={{
                  left: `${10 + ((index * 23) % 77)}%`,
                  top: `${15 + ((index * 31) % 65)}%`,
                }}
              >
                H₂O
              </i>
            ))}
          {Array.from({ length: 4 }, (_, index) => (
            <i
              className="recovery-salt"
              key={`salt-${index}`}
              style={{
                left: `${17 + index * 18}%`,
                top: finished ? '76%' : `${29 + ((index * 23) % 42)}%`,
              }}
            >
              {finished
                ? en
                  ? 'salt'
                  : '盐'
                : index % 2 === 0
                  ? 'Na⁺'
                  : 'Cl⁻'}
            </i>
          ))}
          {!sandSeparated &&
            Array.from({ length: 3 }, (_, index) => (
              <i
                className="recovery-sand"
                key={`sand-${index}`}
                style={{ left: `${22 + index * 23}%`, top: '87%' }}
              >
                ▲
              </i>
            ))}
        </div>
        <small>
          {en
            ? 'Particle sketch; symbols are not proportional to mass.'
            : '粒子示意：符号数量不代表质量比例。'}
        </small>
      </div>
      <div className="recovery-console">
        <p>{en ? 'Choose a separation route' : '选择你的分离路线'}</p>
        <div className="recovery-controls">
          <button
            type="button"
            disabled={stage !== 'raw'}
            onClick={() => {
              setSandSeparated(true);
              setStage('filtered');
            }}
          >
            {en ? 'Filter' : '过滤'}
          </button>
          <button
            type="button"
            disabled={finished}
            onClick={() => setStage('evaporated')}
          >
            {en ? 'Evaporate without collecting' : '蒸发，不收集水'}
          </button>
          <button
            type="button"
            disabled={finished}
            onClick={() => setStage('distilled')}
          >
            {en ? 'Distil and collect water' : '蒸馏，收集水'}
          </button>
          <button
            className="reset"
            type="button"
            onClick={() => {
              setStage('raw');
              setSandSeparated(false);
            }}
          >
            {en ? 'Reset mixture' : '重置混合物'}
          </button>
        </div>
        <div
          className={`recovery-feedback ${success ? 'success' : ''}`}
          role="status"
        >
          {feedback}
        </div>
      </div>
      <div
        className="recovery-ledger"
        aria-label={en ? 'Mass ledger' : '质量去向账本'}
      >
        <div>
          <span>{en ? 'Original vessel' : '原容器'}</span>
          <strong>{sourceMass} g</strong>
          <small>{sourceName}</small>
        </div>
        <div>
          <span>{en ? 'Collected sand' : '收集的沙'}</span>
          <strong>{sandMass} g</strong>
        </div>
        <div>
          <span>{en ? 'Collected water' : '收集的水'}</span>
          <strong>{waterMass} g</strong>
        </div>
        <div>
          <span>{en ? 'Water in the air' : '进入空气的水'}</span>
          <strong>{airMass} g</strong>
        </div>
        <p>
          {en
            ? 'Ideal total (no transfer losses)'
            : '理想总质量（忽略转移损失）'}
          ：{sourceMass} + {sandMass} + {waterMass} + {airMass} ={' '}
          {sourceMass + sandMass + waterMass + airMass} g
        </p>
      </div>
    </div>
  );
}
