import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderToReadableStream } from 'react-dom/server.browser';
import { describe, expect, it } from 'vitest';
import type { LanguageMode } from '@study/shared';
import {
  MolecularEnergyDiagram,
  MolecularEnergyExplore,
  MolecularEnergyHookArt,
} from './MolecularEnergyWorld';
import {
  SignalingEvolutionDiagram,
  SignalingEvolutionExplore,
  SignalingEvolutionHookArt,
} from './SignalingEvolutionWorld';
import {
  BiotechnologyResearchDiagram,
  BiotechnologyResearchExplore,
  BiotechnologyResearchHookArt,
} from './BiotechnologyResearchWorld';
import { molecularEnergyLessons } from './content/molecularEnergy';
import { signalingEvolutionLessons } from './content/signalingEvolution';
import { biotechnologyResearchLessons } from './content/biotechnologyResearch';
import { lessons, section } from './content';
import { units, unitForLesson } from './units';
import { Diagram, Explore } from './Explore';
import { isS6Lesson, S6HookArt } from './s6Visuals';
import curriculum from '../../../curriculum/index.json';
import {
  STORAGE_KEY,
  decodeProgress,
  emptyProgress,
  stageOutcome,
  leafStageOutcome,
  ecoStageOutcome,
  storyStageOutcome,
  evidenceStageOutcome,
  graduationStageOutcome,
  withMission,
} from './progress';
import { emptyProject } from './project';
import { emptyLeafProject } from './leafProject';
import { emptyEcoProject } from './ecoProject';
import { emptyStoryProject } from './storyProject';
import { emptyEvidenceProject } from './evidenceProject';

type Asset = {
  id: string;
  component: string;
  model?: { assumptions: unknown; limits?: unknown };
};
type Manifest = {
  unit: string;
  assets?: Asset[];
  diagrams?: Asset[];
  interactives?: Asset[];
  models?:
    | { lesson: string; assumptions: unknown; limits: unknown }[]
    | Record<
        string,
        { assumptions: unknown; limits?: unknown; scientificLimits?: unknown }
      >;
};
const manuscripts = import.meta.glob('../../../curriculum/s06/u*/l*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const manifests = import.meta.glob('../../../curriculum/s06/u*/media.json', {
  import: 'default',
  eager: true,
}) as Record<string, Manifest>;
const families = [
  {
    lessons: molecularEnergyLessons,
    prefix: 'MolecularEnergy',
    diagram: MolecularEnergyDiagram,
    explore: MolecularEnergyExplore,
    hook: MolecularEnergyHookArt,
  },
  {
    lessons: signalingEvolutionLessons,
    prefix: 'SignalingEvolution',
    diagram: SignalingEvolutionDiagram,
    explore: SignalingEvolutionExplore,
    hook: SignalingEvolutionHookArt,
  },
  {
    lessons: biotechnologyResearchLessons,
    prefix: 'BiotechnologyResearch',
    diagram: BiotechnologyResearchDiagram,
    explore: BiotechnologyResearchExplore,
    hook: BiotechnologyResearchHookArt,
  },
];
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const modes = ['zh', 'en', 'bilingual'] as const;
const normalize = (html: string) =>
  html
    .replace(/_R_[^"\s<>]*/g, 'react-id')
    .replace(/<!--\$-->|<!--\/\$-->|<!-- -->/g, '');
const direct = (
  component: ComponentType<Props>,
  id: string,
  mode: LanguageMode,
) =>
  normalize(
    renderToStaticMarkup(
      createElement(component, { id, mode, onExplore: () => {} }),
    ),
  );
async function route(
  component: ComponentType<Props>,
  id: string,
  mode: LanguageMode,
) {
  const stream = await renderToReadableStream(
    createElement(component, { id, mode, onExplore: () => {} }),
  );
  await stream.allReady;
  return normalize(await new Response(stream).text());
}
function checkTranslations(value: unknown) {
  if (!value || typeof value !== 'object') return;
  if ('zh' in value || 'en' in value) {
    const text = value as { zh: string; en: string };
    expect(typeof text.zh).toBe('string');
    expect(typeof text.en).toBe('string');
    expect(text.zh.trim().length).toBeGreaterThan(0);
    expect(text.en.trim().length).toBeGreaterThan(0);
  }
  for (const child of Object.values(value)) checkTranslations(child);
}
describe('S06 curriculum and actual async route contract', () => {
  it('registers all 144 available pilot lessons, 36 missions and six project stages without creating L145', () => {
    expect(lessons).toHaveLength(144);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(144);
    expect(units).toHaveLength(36);
    expect(curriculum).toHaveLength(6);
    expect(
      curriculum.flatMap((s) => s.units).flatMap((u) => u.lessons),
    ).toHaveLength(144);
    expect(
      curriculum
        .flatMap((s) => s.units)
        .flatMap((u) => u.lessons)
        .every((l) => l.status === 'available'),
    ).toBe(true);
    expect(Object.keys(manuscripts)).toHaveLength(24);
    expect(Object.keys(manifests)).toHaveLength(6);
    const s6 = families.flatMap((f) => f.lessons);
    expect(s6.map((l) => l.id)).toEqual(
      Array.from({ length: 24 }, (_, i) => `L${121 + i}`),
    );
    expect(
      units.filter((u) => u.stage === 'S06').flatMap((u) => u.lessonIds),
    ).toEqual(s6.map((l) => l.id));
    for (const f of families)
      for (const lesson of f.lessons) {
        const n = Number(lesson.id.slice(1)),
          unit = unitForLesson(lesson.id);
        expect(unit.id).toBe(`U${Math.floor((n - 1) / 4) + 1}`);
        expect(unit.lessonIds).toHaveLength(4);
        checkTranslations(lesson);
        checkTranslations(unit);
        const raw = Object.entries(manuscripts)
          .find(([path]) => path.endsWith(`/${lesson.id.toLowerCase()}.md`))![1]
          .replace(/\r\n/g, '\n');
        const front = raw
          .split('---')[1]!
          .split('\n')
          .map((line) =>
            line
              .replace(/: '([^']*)'$/, ': $1')
              .replace(/: "([^"]*)"$/, ': $1'),
          );
        for (const field of [
          `id: ${lesson.id}`,
          'stage: S06',
          `unit: ${unit.id}`,
          'status: pilot',
          `title_zh: ${lesson.title.zh}`,
          `title_en: ${lesson.title.en}`,
          `prerequisites: [L${n - 1}]`,
          `next: ${n === 144 ? 'S06-P01' : `L${n + 1}`}`,
        ])
          expect(front, `${lesson.id}: ${field}`).toContain(field);
        const manifest = Object.values(manifests).find(
          (m) => m.unit === unit.id,
        )!;
        const assets = [
          ...(manifest.assets ?? []),
          ...(manifest.diagrams ?? []),
          ...(manifest.interactives ?? []),
        ];
        const diagramAssets = assets.filter((a) => a.id === `${lesson.id}-D01`);
        const exploreAssets = assets.filter((a) => a.id === `${lesson.id}-I01`);
        expect(diagramAssets.length).toBeGreaterThan(0);
        expect(exploreAssets.length).toBeGreaterThan(0);
        for (const asset of diagramAssets)
          expect(asset.component.split('#').at(-1)).toBe(`${f.prefix}Diagram`);
        for (const asset of exploreAssets)
          expect(asset.component.split('#').at(-1)).toBe(`${f.prefix}Explore`);
        const model = Array.isArray(manifest.models)
          ? manifest.models.find((m) => m.lesson === lesson.id)
          : (manifest.models?.[lesson.id] ??
            diagramAssets.find((a) => a.model)?.model);
        expect(model, lesson.id).toBeDefined();
        expect(JSON.stringify(model!.assumptions).length).toBeGreaterThan(30);
      }
    expect(lessons.find((l) => l.id === 'L145')).toBeUndefined();
  });
  it('loads all eleven substantial teaching sections in both languages and every lesson has real checks', () => {
    for (const family of families)
      for (const lesson of family.lessons) {
        expect(lesson.questions.length).toBeGreaterThanOrEqual(4);
        expect(new Set(lesson.questions.map((q) => q.id)).size).toBe(
          lesson.questions.length,
        );
        for (const q of lesson.questions) {
          expect(q.id.startsWith(`${lesson.id}-`)).toBe(true);
          expect(q.correct).toBeGreaterThanOrEqual(0);
          expect(q.correct).toBeLessThan(q.options.length);
        }
        for (const name of [
          'Hook',
          'Predict',
          'See',
          'Explore',
          'Explain',
          'Misconception',
          'Depth',
          'Apply',
          'Vocabulary',
          'Check',
          'Mission',
        ]) {
          const text = section(lesson.id, name);
          for (const mode of ['zh', 'en'] as const)
            expect(
              text[mode].length,
              `${lesson.id}/${name}/${mode}`,
            ).toBeGreaterThan(20);
        }
      }
  });
  it('resolves actual lazy public Diagram/Explore/Hook routes in all three modes to the right component, rejecting malformed IDs', async () => {
    for (const id of [
      'L120',
      'L145',
      'L21',
      'xL121',
      'L121oops',
      'L121\n',
      'L121.0',
    ])
      expect(isS6Lesson(id)).toBe(false);
    for (const family of families)
      for (const lesson of family.lessons) {
        expect(isS6Lesson(lesson.id)).toBe(true);
        for (const mode of modes)
          for (const [publicComponent, expected] of [
            [Diagram, family.diagram],
            [Explore, family.explore],
            [S6HookArt, family.hook],
          ] as const) {
            const html = await route(publicComponent, lesson.id, mode);
            expect(html, `${lesson.id}/${mode}/${expected.name}`).toBe(
              direct(expected, lesson.id, mode),
            );
            expect(html).toContain('<svg');
            expect(html).toMatch(/<title\b[^>]*>[^<]+<\/title>/);
            expect(html).not.toMatch(
              />undefined<|NaN|Choose a lesson|请选择课程/,
            );
            if (publicComponent === Explore)
              expect(html).toMatch(/<(button|input|select)\b/);
          }
      }
  });
  it('round-trips legacy S01–S05 deep records and keeps their independent counts unchanged by 24 S06 lessons', () => {
    expect(STORAGE_KEY).toBe('study-biology-v1');
    let old = emptyProgress();
    old.projects = {
      S01: emptyProject(),
      S02: emptyLeafProject(),
      S03: emptyEcoProject(),
      S04: emptyStoryProject(),
      S05: emptyEvidenceProject(),
    };
    for (const n of [1, 25, 49, 73, 97]) {
      const id = `L${String(n).padStart(3, '0')}`,
        q = lessons.find((l) => l.id === id)!.questions[0]!;
      old.sessions[id] = {
        step: 3,
        note: `Old ${id}`,
        explored: true,
        completedAt: 10,
      };
      old.answers[q.id] = { choice: q.correct, first: q.correct, at: 10 };
    }
    for (const id of ['U01', 'U07', 'U13', 'U19', 'U25'])
      old = withMission(old, id, {
        object: id,
        evidence: 'old evidence',
        reasoning: 'old reasoning',
        savedAt: 10,
      });
    old = decodeProgress(JSON.stringify(old));
    let newer = decodeProgress(JSON.stringify(old));
    for (let n = 121; n <= 144; n++)
      newer.sessions[`L${n}`] = { step: 3, note: 'S06', completedAt: 20 };
    for (let n = 31; n <= 36; n++)
      newer = withMission(newer, `U${n}`, {
        object: 'S06',
        evidence: 'evidence',
        reasoning: 'reasoning',
        savedAt: 20,
      });
    newer = decodeProgress(JSON.stringify(newer));
    expect(newer.projects).toEqual(old.projects);
    expect(newer.answers).toEqual(old.answers);
    expect(newer.mission).toEqual(old.mission);
    for (const [id, value] of Object.entries(old.sessions))
      expect(newer.sessions[id]).toEqual(value);
    for (const [id, value] of Object.entries(old.missions))
      expect(newer.missions[id]).toEqual(value);
    for (const fn of [
      stageOutcome,
      leafStageOutcome,
      ecoStageOutcome,
      storyStageOutcome,
      evidenceStageOutcome,
    ])
      expect(fn(newer)).toEqual(fn(old));
    expect(graduationStageOutcome(newer)).toEqual({
      lessons: 24,
      missions: 6,
      complete: false,
    });
  });
});
