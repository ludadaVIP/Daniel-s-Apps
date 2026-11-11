import { lazy, Suspense, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
const groups = {
  divisionEnzyme: {
    Diagram: lazy(() =>
      import('./DivisionEnzymeWorld').then((m) => ({
        default: m.DivisionEnzymeDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./DivisionEnzymeWorld').then((m) => ({
        default: m.DivisionEnzymeHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./DivisionEnzymeWorld').then((m) => ({
        default: m.DivisionEnzymeExplore,
      })),
    ),
  },
  energyGene: {
    Diagram: lazy(() =>
      import('./EnergyGeneWorld').then((m) => ({
        default: m.EnergyGeneDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./EnergyGeneWorld').then((m) => ({
        default: m.EnergyGeneHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./EnergyGeneWorld').then((m) => ({
        default: m.EnergyGeneExplore,
      })),
    ),
  },
  evolutionCycle: {
    Diagram: lazy(() =>
      import('./EvolutionCycleWorld').then((m) => ({
        default: m.EvolutionCycleDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./EvolutionCycleWorld').then((m) => ({
        default: m.EvolutionCycleHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./EvolutionCycleWorld').then((m) => ({
        default: m.EvolutionCycleExplore,
      })),
    ),
  },
};
export function isS4Lesson(id: string) {
  return (
    id.length === 4 &&
    /^L\d{3}$/.test(id) &&
    Number(id.slice(1)) >= 73 &&
    Number(id.slice(1)) <= 96
  );
}
function visuals(id: string) {
  if (!isS4Lesson(id)) throw new Error(`Unregistered S04 visual: ${id}`);
  const number = Number(id.slice(1));
  return number <= 80
    ? groups.divisionEnzyme
    : number <= 88
      ? groups.energyGene
      : groups.evolutionCycle;
}
function Loading({
  mode,
  children,
}: {
  mode: LanguageMode;
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <p role="status">
          <Text mode={mode} text={t('正在展开图解…', 'Opening the diagram…')} />
        </p>
      }
    >
      {children}
    </Suspense>
  );
}
export function S4Diagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const Component = visuals(id).Diagram;
  return (
    <Loading mode={mode}>
      <Component key={id} id={id} mode={mode} />
    </Loading>
  );
}
export function S4HookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  const Component = visuals(id).Hook;
  return (
    <Loading mode={mode}>
      <Component key={id} id={id} mode={mode} />
    </Loading>
  );
}
export function S4Explore({
  id,
  mode,
  onExplore,
}: {
  id: string;
  mode: LanguageMode;
  onExplore: () => void;
}) {
  const Component = visuals(id).Explore;
  return (
    <Loading mode={mode}>
      <Component key={id} id={id} mode={mode} onExplore={onExplore} />
    </Loading>
  );
}
