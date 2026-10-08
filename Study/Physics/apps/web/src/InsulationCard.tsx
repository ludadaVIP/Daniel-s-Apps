import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Icon } from './ui';
import { emptyInsulation, insulationState } from './insulation';
export function InsulationCard({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const s = insulationState(
    store.progress.insulationProject ?? emptyInsulation(),
  );
  return (
    <Link
      to="/physics/project/insulation"
      className="phy-project-card phy-insulation-card"
    >
      <Icon name="lab" size={30} />
      <div>
        <span className="phy-eyebrow">STAGE 2 / YOUR OWN EVIDENCE</span>
        <h3>
          <B
            zh="两杯温水，留下自己的温度曲线"
            en="Two warm cups. Your own temperature curves."
            mode={mode}
          />
        </h3>
        <p>
          <B
            zh="一次公平的保温调查：量温度、保留读数、用证据解释。"
            en="A fair insulation investigation: measure, retain readings and explain with evidence."
            mode={mode}
          />
        </p>
      </div>
      <span className="phy-tag">
        <B
          zh={
            s.completed ? '记录完整' : s.planned ? '计划已准备好' : '开始调查'
          }
          en={
            s.completed
              ? 'Record complete'
              : s.planned
                ? 'Plan ready'
                : 'Start investigating'
          }
          mode={mode}
        />
      </span>
    </Link>
  );
}
