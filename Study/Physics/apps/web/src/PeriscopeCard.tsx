import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Icon } from './ui';
import { emptyPeriscope, periscopeState } from './periscope';
export function PeriscopeCard({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const s = periscopeState(store.progress.periscopeProject ?? emptyPeriscope());
  return (
    <Link
      to="/physics/project/periscope"
      className="phy-project-card phy-periscope-card"
    >
      <Icon name="lab" size={30} />
      <div>
        <span className="phy-eyebrow">STAGE 2 / BUILD & INVESTIGATE</span>
        <h3>
          <B
            zh="两面镜子，看看挡板后面"
            en="Two mirrors. Look past a barrier."
            mode={mode}
          />
        </h3>
        <p>
          <B
            zh="追踪两次反射，做一个潜望镜，留下自己的观察。"
            en="Trace two reflections, build a periscope and keep your own observations."
            mode={mode}
          />
        </p>
      </div>
      <span className="phy-tag">
        <B
          zh={
            s.completed ? '记录完整' : s.planned ? '计划已准备好' : '开始制作'
          }
          en={
            s.completed
              ? 'Record complete'
              : s.planned
                ? 'Plan ready'
                : 'Start building'
          }
          mode={mode}
        />
      </span>
    </Link>
  );
}
