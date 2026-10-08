import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Icon } from './ui';
import { emptyPower, powerState } from './power';
export function PowerCard({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const state = powerState(store.progress.powerProject ?? emptyPower());
  return (
    <Link
      to="/physics/project/power"
      className="phy-project-card phy-power-card"
    >
      <Icon name="lab" size={30} />
      <div>
        <span className="phy-eyebrow">STAGE 2 / YOUR OWN EVIDENCE</span>
        <h3>
          <B
            zh="上楼功率：把公式变成自己的记录"
            en="Stair power: make the equation your own record"
            mode={mode}
          />
        </h3>
        <p>
          <B
            zh="量竖直高度，保留每次时间，寻找功与功率的生活证据。"
            en="Measure vertical rise, retain every time and find everyday evidence for work and power."
            mode={mode}
          />
        </p>
      </div>
      <span className="phy-tag">
        <B
          zh={
            state.completed
              ? '记录完整'
              : state.planned
                ? '计划已准备好'
                : '开始调查'
          }
          en={
            state.completed
              ? 'Record complete'
              : state.planned
                ? 'Plan ready'
                : 'Start investigating'
          }
          mode={mode}
        />
      </span>
    </Link>
  );
}
