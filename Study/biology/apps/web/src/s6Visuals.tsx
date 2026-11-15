import { lazy, Suspense, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
const groups = {
  molecularEnergy: {
    Diagram: lazy(() =>
      import('./MolecularEnergyWorld').then((m) => ({
        default: m.MolecularEnergyDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./MolecularEnergyWorld').then((m) => ({
        default: m.MolecularEnergyHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./MolecularEnergyWorld').then((m) => ({
        default: m.MolecularEnergyExplore,
      })),
    ),
  },
  signalingEvolution: {
    Diagram: lazy(() =>
      import('./SignalingEvolutionWorld').then((m) => ({
        default: m.SignalingEvolutionDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./SignalingEvolutionWorld').then((m) => ({
        default: m.SignalingEvolutionHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./SignalingEvolutionWorld').then((m) => ({
        default: m.SignalingEvolutionExplore,
      })),
    ),
  },
  biotechnologyResearch: {
    Diagram: lazy(() =>
      import('./BiotechnologyResearchWorld').then((m) => ({
        default: m.BiotechnologyResearchDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./BiotechnologyResearchWorld').then((m) => ({
        default: m.BiotechnologyResearchHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./BiotechnologyResearchWorld').then((m) => ({
        default: m.BiotechnologyResearchExplore,
      })),
    ),
  },
};
export function isS6Lesson(id: string) {
  return (
    id.length === 4 &&
    /^L\d{3}$/.test(id) &&
    Number(id.slice(1)) >= 121 &&
    Number(id.slice(1)) <= 144
  );
}
function visuals(id: string) {
  if (!isS6Lesson(id)) throw new Error(`Unregistered S06 visual: ${id}`);
  const number = Number(id.slice(1));
  return number <= 128
    ? groups.molecularEnergy
    : number <= 136
      ? groups.signalingEvolution
      : groups.biotechnologyResearch;
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
export function S6Diagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const Component = visuals(id).Diagram;
  return (
    <Loading mode={mode}>
      <Component key={id} id={id} mode={mode} />
    </Loading>
  );
}
export function S6HookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  const Component = visuals(id).Hook;
  return (
    <Loading mode={mode}>
      <Component key={id} id={id} mode={mode} />
    </Loading>
  );
}
export function S6Explore({
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
