import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Icon } from './ui';
import { walkingState, emptyWalking } from './walking';
export function WalkingCard({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const state = walkingState(store.progress.walkingProject ?? emptyWalking());
  return (
    <Link
      to="/physics/project/walking"
      className="phy-project-card phy-walking-card"
    >
      <Icon name="path" size={30} />
      <div>
        <span className="phy-eyebrow">STAGE 1 / FIELD PROJECT</span>
        <h3>
          <B
            zh="步行研究：用自己的数据发现规律"
            en="Walking investigation: discover with your own data"
            mode={mode}
          />
        </h3>
        <p>
          <B
            zh="5、10、20米，三次测量，再让一趟行程变成图像。"
            en="5, 10 and 20 metres, three readings each; turn one journey into a graph."
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
                : '开始步行研究'
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
