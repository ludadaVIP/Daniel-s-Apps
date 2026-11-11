import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderToReadableStream } from 'react-dom/server.browser';
import { describe, expect, it } from 'vitest';
import type { LanguageMode } from '@study/shared';
import { ConnectionDiagram, ConnectionExplore } from './ConnectionWorld';
import { RegulationDiagram, RegulationExplore } from './RegulationWorld';
import { PopulationDiagram, PopulationExplore } from './PopulationWorld';
import { connectionLessons } from './content/connections';
import { regulationLessons } from './content/regulation';
import { populationLessons } from './content/populations';
import { Diagram, Explore } from './Explore';
import {
  STORAGE_KEY,
  decodeProgress,
  emptyProgress,
  leafStageOutcome,
  stageOutcome,
  withLeafProject,
  withMission,
  withProject,
} from './progress';
import { emptyProject } from './project';
import { emptyLeafProject } from './leafProject';
import { isS3Lesson } from './s3Visuals';

const manuscripts = import.meta.glob('../../../curriculum/s03/u*/l*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const manifests = import.meta.glob('../../../curriculum/s03/u*/media.json', {
  import: 'default',
  eager: true,
}) as Record<string, Manifest>;
type Asset = { id: string; component: string };
type Manifest = {
  unit: string;
  diagrams?: Asset[];
  interactives?: Asset[];
  assets?: Asset[] | string;
  models: Record<string, string>;
};
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const families = [
  {
    lessons: connectionLessons,
    prefix: 'Connection',
    diagram: ConnectionDiagram,
    explore: ConnectionExplore,
  },
  {
    lessons: regulationLessons,
    prefix: 'Regulation',
    diagram: RegulationDiagram,
    explore: RegulationExplore,
  },
  {
    lessons: populationLessons,
    prefix: 'Population',
    diagram: PopulationDiagram,
    explore: PopulationExplore,
  },
];
const idAt = (n: number) => `L${String(n).padStart(3, '0')}`;
const render = (
  component: ComponentType<Props>,
  id: string,
  mode: LanguageMode,
) =>
  renderToStaticMarkup(
    createElement(component, { id, mode, onExplore: () => {} }),
  );
const normalize = (html: string) =>
  html.replace(/_R_[^"\s<>]*/g, 'react-id').replace(/<!--[\s\S]*?-->/g, '');
const renderRoute = async (component: ComponentType<Props>, id: string) => {
  const stream = await renderToReadableStream(
    createElement(component, { id, mode: 'bilingual', onExplore: () => {} }),
  );
  await stream.allReady;
  return normalize(await new Response(stream).text());
};

describe('S03 manuscript and media integrity', () => {
  it('links all 24 manuscript IDs, prerequisite/next edges and media references to their implementation', () => {
    expect(Object.keys(manuscripts)).toHaveLength(24);
    expect(Object.keys(manifests)).toHaveLength(6);
    expect(families.flatMap((f) => f.lessons.map((l) => l.id))).toEqual(
      Array.from({ length: 24 }, (_, i) => idAt(i + 49)),
    );
    for (const family of families)
      for (const lesson of family.lessons) {
        const number = Number(lesson.id.slice(1));
        const unit = `U${Math.floor((number - 1) / 4) + 1}`;
        const matches = Object.entries(manuscripts).filter(([path]) =>
          path.endsWith(`/${lesson.id.toLowerCase()}.md`),
        );
        expect(matches, lesson.id).toHaveLength(1);
        const raw = matches[0]![1].replace(/\r\n/g, '\n');
        const front = raw.split('---')[1]!;
        for (const field of [
          `id: ${lesson.id}`,
          'stage: S03',
          `unit: ${unit}`,
          'status: pilot',
          `title_zh: ${lesson.title.zh}`,
          `title_en: ${lesson.title.en}`,
          `prerequisites: [${idAt(number - 1)}]`,
          `next: ${idAt(number + 1)}`,
          `diagram: ${lesson.id}-D01`,
          `interactive: ${lesson.id}-I01`,
        ])
          expect(front.split('\n'), `${lesson.id}: ${field}`).toContain(field);
        const manifest = Object.values(manifests).find((m) => m.unit === unit)!;
        expect(manifest, unit).toBeDefined();
        const assets = [
          ...(manifest.diagrams ?? []),
          ...(manifest.interactives ?? []),
          ...(Array.isArray(manifest.assets) ? manifest.assets : []),
        ];
        for (const [suffix, component] of [
          ['D01', 'Diagram'],
          ['I01', 'Explore'],
        ]) {
          expect(
            assets.filter((a) => a.id === `${lesson.id}-${suffix}`),
          ).toEqual([
            expect.objectContaining({
              component: `${family.prefix}${component}`,
            }),
          ]);
        }
        expect(manifest.models[lesson.id]?.trim().length).toBeGreaterThan(40);
      }
  });

  it('renders every declared diagram and interactive in all language modes with readable static alternatives', () => {
    for (const family of families) {
      const geometries = new Set<string>();
      for (const lesson of family.lessons)
        for (const mode of ['zh', 'en', 'bilingual'] as const) {
          const diagram = render(family.diagram, lesson.id, mode);
          const interactive = render(family.explore, lesson.id, mode);
          expect(diagram, `${lesson.id} ${mode}`).toContain('<svg');
          expect(diagram).toMatch(/<title>[^<]+<\/title>/);
          expect(diagram).toContain('<figcaption');
          expect(interactive).toContain('<details');
          expect(interactive).toContain('<summary');
          expect(interactive).toContain('<button');
          expect(`${diagram}${interactive}`).not.toMatch(
            /Choose a lesson\.|请选择课程。|undefined|NaN/,
          );
          if (mode === 'bilingual') {
            expect(diagram).toContain('bio-en');
            expect(interactive).toContain('bio-en');
          }
          if (mode === 'en') {
            // Removing all labels also prevents a renamed generic SVG from passing.
            geometries.add(
              normalize(
                diagram
                  .match(/<svg[\s\S]*?<\/svg>/)![0]
                  .replace(/<(title|text)\b[\s\S]*?<\/\1>/g, '')
                  .replace(/aria-label="[^"]*"/g, ''),
              ),
            );
          }
        }
      expect(
        geometries.size,
        `${family.prefix} distinct concept diagrams`,
      ).toBe(8);
    }
  });

  it('dispatches published S03 lesson routes to the exact declared media components', async () => {
    for (const id of ['L048', 'L073', 'L49', 'L049oops', 'xL049', 'L049.0'])
      expect(isS3Lesson(id)).toBe(false);
    for (const family of families)
      for (const lesson of family.lessons) {
        expect(isS3Lesson(lesson.id)).toBe(true);
        expect(await renderRoute(Diagram, lesson.id)).toBe(
          normalize(render(family.diagram, lesson.id, 'bilingual')),
        );
        expect(await renderRoute(Explore, lesson.id)).toBe(
          normalize(render(family.explore, lesson.id, 'bilingual')),
        );
      }
  });

  it('retains older stage storage and keeps S03 records out of S01/S02 counts', () => {
    expect(STORAGE_KEY).toBe('study-biology-v1');
    const field = {
      ...emptyProject(),
      zh: '旧田野笔记',
      en: 'Earlier field notes',
    };
    const leaf = {
      ...emptyLeafProject(),
      zh: '旧叶片笔记',
      en: 'Earlier leaf notes',
    };
    let old = withLeafProject(withProject(emptyProgress(), 'S01', field), leaf);
    old = withMission(old, 'U01', {
      object: '种子',
      evidence: '萌发',
      reasoning: '生长',
      savedAt: 10,
    });
    old = withMission(old, 'U07', {
      object: '叶肉',
      evidence: '叶绿体',
      reasoning: '光合作用',
      savedAt: 20,
    });
    old.sessions.L001 = { step: 3, note: '旧一阶段', completedAt: 10 };
    old.sessions.L025 = { step: 3, note: '旧二阶段', completedAt: 20 };
    let extended = decodeProgress(JSON.stringify(old));
    for (let n = 49; n <= 72; n++)
      extended.sessions[idAt(n)] = {
        step: 3,
        note: `S03 ${n}`,
        completedAt: 30,
      };
    for (let n = 13; n <= 18; n++)
      extended = withMission(extended, `U${n}`, {
        object: `S03 ${n}`,
        evidence: '模型记录 / Model record',
        reasoning: '证据与条件 / Evidence and conditions',
        savedAt: 30,
      });
    const restored = decodeProgress(JSON.stringify(extended));
    expect(restored.projects.S01).toEqual(field);
    expect(restored.projects.S02).toEqual(leaf);
    expect(restored.sessions.L001).toEqual(old.sessions.L001);
    expect(restored.sessions.L025).toEqual(old.sessions.L025);
    expect(restored.mission).toEqual(old.mission);
    expect(restored.missions.U07).toEqual(old.missions.U07);
    expect(
      Object.keys(restored.sessions).filter((id) => Number(id.slice(1)) >= 49),
    ).toHaveLength(24);
    expect(
      Object.keys(restored.missions).filter((id) => Number(id.slice(1)) >= 13),
    ).toHaveLength(6);
    expect(stageOutcome(restored)).toEqual(stageOutcome(old));
    expect(leafStageOutcome(restored)).toEqual(leafStageOutcome(old));
  });
});
