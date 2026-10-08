import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import type { ProgressStore } from './progress';
import { B, Icon } from './ui';
import { materialsState, emptyMaterials } from './materials';
export function MaterialsCard({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const state = materialsState(
    store.progress.materialsProject ?? emptyMaterials(),
  );
  return (
    <Link
      to="/physics/project/materials"
      className="phy-project-card phy-materials-card"
    >
      <Icon name="lab" size={30} />
      <div>
        <span className="phy-eyebrow">STAGE 1 / MATERIAL DETECTIVE</span>
        <h3>
          <B
            zh="神秘材料：用自己的测量寻找线索"
            en="Mystery Materials: follow your own measurements"
            mode={mode}
          />
        </h3>
        <p>
          <B
            zh="量质量、找体积、对照密度。结论不确定，也能成为一份好调查。"
            en="Measure mass, find volume and compare densities. Uncertainty can belong in a good investigation."
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
                : '打开材料档案'
          }
          en={
            state.completed
              ? 'Record complete'
              : state.planned
                ? 'Plan ready'
                : 'Open a case'
          }
          mode={mode}
        />
      </span>
    </Link>
  );
}
