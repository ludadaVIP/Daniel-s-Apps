import { lazy, Suspense, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
const groups = {
  transportPhysiology: {
    Diagram: lazy(() =>
      import('./TransportPhysiologyWorld').then((m) => ({
        default: m.TransportPhysiologyDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./TransportPhysiologyWorld').then((m) => ({
        default: m.TransportPhysiologyHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./TransportPhysiologyWorld').then((m) => ({
        default: m.TransportPhysiologyExplore,
      })),
    ),
  },
  plantInformation: {
    Diagram: lazy(() =>
      import('./PlantInformationWorld').then((m) => ({
        default: m.PlantInformationDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./PlantInformationWorld').then((m) => ({
        default: m.PlantInformationHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./PlantInformationWorld').then((m) => ({
        default: m.PlantInformationExplore,
      })),
    ),
  },
  immunityEvidence: {
    Diagram: lazy(() =>
      import('./ImmunityEvidenceWorld').then((m) => ({
        default: m.ImmunityEvidenceDiagram,
      })),
    ),
    Hook: lazy(() =>
      import('./ImmunityEvidenceWorld').then((m) => ({
        default: m.ImmunityEvidenceHookArt,
      })),
    ),
    Explore: lazy(() =>
      import('./ImmunityEvidenceWorld').then((m) => ({
        default: m.ImmunityEvidenceExplore,
      })),
    ),
  },
};
export function isS5Lesson(id: string) {
  return (
    id.length === 4 &&
    /^L\d{3}$/.test(id) &&
    Number(id.slice(1)) >= 97 &&
    Number(id.slice(1)) <= 120
  );
}
function visuals(id: string) {
  if (!isS5Lesson(id)) throw new Error(`Unregistered S05 visual: ${id}`);
  const number = Number(id.slice(1));
  return number <= 104
    ? groups.transportPhysiology
    : number <= 112
      ? groups.plantInformation
      : groups.immunityEvidence;
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
export function S5Diagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const Component = visuals(id).Diagram;
  return (
    <Loading mode={mode}>
      <Component key={id} id={id} mode={mode} />
    </Loading>
  );
}
export function S5HookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  const Component = visuals(id).Hook;
  return (
    <Loading mode={mode}>
      <Component key={id} id={id} mode={mode} />
    </Loading>
  );
}
export function S5Explore({
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
