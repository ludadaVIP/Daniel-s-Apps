import { lazy, Suspense, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
const groups = {
  connection: {
    Diagram: lazy(() =>
      import('./ConnectionWorld').then((m) => ({
        default: m.ConnectionDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./ConnectionWorld').then((m) => ({
        default: m.ConnectionHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./ConnectionWorld').then((m) => ({
        default: m.ConnectionExplore,
      })),
    ),
  },
  regulation: {
    Diagram: lazy(() =>
      import('./RegulationWorld').then((m) => ({
        default: m.RegulationDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./RegulationWorld').then((m) => ({
        default: m.RegulationHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./RegulationWorld').then((m) => ({
        default: m.RegulationExplore,
      })),
    ),
  },
  population: {
    Diagram: lazy(() =>
      import('./PopulationWorld').then((m) => ({
        default: m.PopulationDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./PopulationWorld').then((m) => ({
        default: m.PopulationHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./PopulationWorld').then((m) => ({
        default: m.PopulationExplore,
      })),
    ),
  },
};
export function isS3Lesson(id: string) {
  return (
    /^L\d{3}$/.test(id) &&
    Number(id.slice(1)) >= 49 &&
    Number(id.slice(1)) <= 72
  );
}
function visuals(id: string) {
  if (!isS3Lesson(id)) throw new Error(`Unregistered S03 visual: ${id}`);
  const number = Number(id.slice(1));
  return number <= 56
    ? groups.connection
    : number <= 64
      ? groups.regulation
      : groups.population;
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
export function S3Diagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const Component = visuals(id).Diagram;
  return (
    <Loading mode={mode}>
      <Component id={id} mode={mode} />
    </Loading>
  );
}
export function S3HookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  const Component = visuals(id).Hook;
  return (
    <Loading mode={mode}>
      <Component id={id} mode={mode} />
    </Loading>
  );
}
export function S3Explore({
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
      <Component id={id} mode={mode} onExplore={onExplore} />
    </Loading>
  );
}
