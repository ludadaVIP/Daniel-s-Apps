import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Icon } from './ui';
import { emptyLifting, liftingState } from './lifting';
export function LiftingCard({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const s = liftingState(store.progress.liftingProject ?? emptyLifting());
  return (
    <Link
      to="/physics/project/lifting"
      className="phy-project-card phy-lifting-card"
    >
      <Icon name="lab" size={30} />
      <div>
        <span className="phy-eyebrow">STAGE 3 / DESIGN & TEST</span>
        <h3>
          <B
            zh="轻轻一按，把小载荷抬起来"
            en="A gentler push. A lifted load."
            mode={mode}
          />
        </h3>
        <p>
          <B
            zh="比较杠杆方案，用尺子和硬币检验，留下自己的设计报告。"
            en="Compare lever designs, test with a ruler and coins, and keep your own design report."
            mode={mode}
          />
        </p>
      </div>
      <span className="phy-tag">
        <B
          zh={
            s.completed ? '记录完整' : s.planned ? '计划已准备好' : '开始设计'
          }
          en={
            s.completed
              ? 'Record complete'
              : s.planned
                ? 'Plan ready'
                : 'Start designing'
          }
          mode={mode}
        />
      </span>
    </Link>
  );
}
