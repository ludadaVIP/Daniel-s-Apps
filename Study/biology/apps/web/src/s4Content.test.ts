import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderToReadableStream } from 'react-dom/server.browser';
import { describe, expect, it, vi } from 'vitest';
import type { LanguageMode } from '@study/shared';
import {
  DivisionEnzymeDiagram,
  DivisionEnzymeExplore,
  DivisionEnzymeHookArt,
} from './DivisionEnzymeWorld';
import {
  EnergyGeneDiagram,
  EnergyGeneExplore,
  EnergyGeneHookArt,
} from './EnergyGeneWorld';
import {
  EvolutionCycleDiagram,
  EvolutionCycleExplore,
  EvolutionCycleHookArt,
} from './EvolutionCycleWorld';
import { divisionEnzymeLessons } from './content/divisionEnzymes';
import { energyGeneLessons } from './content/energyGenes';
import { evolutionCycleLessons } from './content/evolutionCycles';
import { lessons, section } from './content';
import { units, unitForLesson } from './units';
import { Diagram, Explore } from './Explore';
import { isS4Lesson, S4HookArt } from './s4Visuals';
import {
  STORAGE_KEY,
  decodeProgress,
  emptyProgress,
  stageOutcome,
  leafStageOutcome,
  ecoStageOutcome,
  withMission,
  withProject,
  withLeafProject,
  withEcoProject,
} from './progress';
import { emptyProject } from './project';
import { emptyLeafProject } from './leafProject';
import { emptyEcoProject } from './ecoProject';

type Asset = { id: string; component: string; staticAlternative?: string };
type Manifest = {
  unit: string;
  diagrams?: Asset[];
  interactives?: Asset[];
  assets?: Asset[] | string;
  models: Record<
    string,
    | string
    | {
        assumptions: string | string[];
        limits?: string;
        scientificLimits?: string;
      }
  >;
};
const manuscripts = import.meta.glob('../../../curriculum/s04/u*/l*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const manifests = import.meta.glob('../../../curriculum/s04/u*/media.json', {
  import: 'default',
  eager: true,
}) as Record<string, Manifest>;
const families = [
  {
    lessons: divisionEnzymeLessons,
    prefix: 'DivisionEnzyme',
    diagram: DivisionEnzymeDiagram,
    explore: DivisionEnzymeExplore,
    hook: DivisionEnzymeHookArt,
  },
  {
    lessons: energyGeneLessons,
    prefix: 'EnergyGene',
    diagram: EnergyGeneDiagram,
    explore: EnergyGeneExplore,
    hook: EnergyGeneHookArt,
  },
  {
    lessons: evolutionCycleLessons,
    prefix: 'EvolutionCycle',
    diagram: EvolutionCycleDiagram,
    explore: EvolutionCycleExplore,
    hook: EvolutionCycleHookArt,
  },
];
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const idAt = (n: number) => `L${String(n).padStart(3, '0')}`;
const modes = ['zh', 'en', 'bilingual'] as const;
const render = (
  component: ComponentType<Props>,
  id: string,
  mode: LanguageMode,
) =>
  renderToStaticMarkup(
    createElement(component, { id, mode, onExplore: () => {} }),
  );
// Only generated useId values and React's Suspense/text boundary markers differ.
// Preserve actual elements, text, styles and attributes so fallbacks cannot pass.
const normalize = (html: string) =>
  html
    .replace(/_R_[^"\s<>]*/g, 'react-id')
    .replace(/<!--\$-->|<!--\/\$-->|<!-- -->/g, '');
async function renderRoute(
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
function checkTranslations(value: unknown, path: string) {
  if (!value || typeof value !== 'object') return;
  if ('zh' in value || 'en' in value) {
    const localized = value as { zh: unknown; en: unknown };
    for (const language of ['zh', 'en'] as const) {
      expect(typeof localized[language], `${path}.${language}`).toBe('string');
      expect(
        (localized[language] as string).trim(),
        `${path}.${language}`,
      ).not.toBe('');
    }
  }
  for (const [key, child] of Object.entries(value))
    checkTranslations(child, `${path}.${key}`);
}

describe('S04 cross-file curriculum integrity', () => {
  it('publishes exactly six four-lesson units, matching manuscript titles, sequence and declared media', () => {
    expect(Object.keys(manuscripts)).toHaveLength(24);
    expect(Object.keys(manifests)).toHaveLength(6);
    const published = families.flatMap((f) => f.lessons);
    expect(published.map((l) => l.id)).toEqual(
      Array.from({ length: 24 }, (_, i) => idAt(i + 73)),
    );
    const stageUnits = units.filter((u) => u.stage === 'S04');
    expect(stageUnits.map((u) => u.id)).toEqual([
      'U19',
      'U20',
      'U21',
      'U22',
      'U23',
      'U24',
    ]);
    expect(stageUnits.flatMap((u) => u.lessonIds)).toEqual(
      published.map((l) => l.id),
    );
    for (const unit of stageUnits) {
      expect(unit.lessonIds).toHaveLength(4);
      checkTranslations(unit, unit.id);
    }
    for (const family of families)
      for (const lesson of family.lessons) {
        const number = Number(lesson.id.slice(1));
        const unit = `U${Math.floor((number - 1) / 4) + 1}`;
        expect(
          lessons.filter((l) => l.id === lesson.id),
          lesson.id,
        ).toEqual([lesson]);
        expect(unitForLesson(lesson.id)?.id).toBe(unit);
        const matches = Object.entries(manuscripts).filter(([path]) =>
          path.endsWith(`/${lesson.id.toLowerCase()}.md`),
        );
        expect(matches, lesson.id).toHaveLength(1);
        const front = matches[0]![1]
          .replace(/\r\n/g, '\n')
          .split('---')[1]!
          .split('\n');
        for (const field of [
          `id: ${lesson.id}`,
          'stage: S04',
          `unit: ${unit}`,
          'status: pilot',
          `title_zh: ${lesson.title.zh}`,
          `title_en: ${lesson.title.en}`,
          `prerequisites: [${idAt(number - 1)}]`,
          `next: ${idAt(number + 1)}`,
          `diagram: ${lesson.id}-D01`,
          `interactive: ${lesson.id}-I01`,
        ])
          expect(front, `${lesson.id}: ${field}`).toContain(field);
        const manifest = Object.values(manifests).find((m) => m.unit === unit)!;
        expect(manifest, unit).toBeDefined();
        const assets = [
          ...(manifest.diagrams ?? []),
          ...(manifest.interactives ?? []),
          ...(Array.isArray(manifest.assets) ? manifest.assets : []),
        ];
        expect(assets.filter((a) => a.id === `${lesson.id}-D01`)).toEqual([
          expect.objectContaining({ component: `${family.prefix}Diagram` }),
        ]);
        const interactives = assets.filter((a) => a.id === `${lesson.id}-I01`);
        expect(interactives).toEqual([
          expect.objectContaining({ component: `${family.prefix}Explore` }),
        ]);
        const model = manifest.models[lesson.id];
        const assumptions =
          typeof model === 'string'
            ? model
            : Array.isArray(model?.assumptions)
              ? model.assumptions.join(' ')
              : model?.assumptions;
        expect(assumptions?.trim().length).toBeGreaterThan(60);
        if (typeof model === 'object')
          expect(
            (model.limits ?? model.scientificLimits)?.trim().length,
          ).toBeGreaterThan(30);
      }
    for (const manifest of Object.values(manifests)) {
      const assets = [
        ...(manifest.diagrams ?? []),
        ...(manifest.interactives ?? []),
        ...(Array.isArray(manifest.assets) ? manifest.assets : []),
      ];
      expect(assets.filter((a) => a.id.endsWith('-D01'))).toHaveLength(4);
      expect(assets.filter((a) => a.id.endsWith('-I01'))).toHaveLength(4);
      expect(Object.keys(manifest.models).sort()).toEqual(
        stageUnits.find((u) => u.id === manifest.unit)!.lessonIds,
      );
    }
  });

  it('loads substantial bilingual teaching sections and complete localized lesson data without generic predictions', () => {
    const predictions = new Set<string>();
    for (const family of families)
      for (const lesson of family.lessons) {
        checkTranslations(lesson, lesson.id);
        expect(lesson.prediction.length, lesson.id).toBeGreaterThanOrEqual(2);
        predictions.add(JSON.stringify(lesson.prediction));
        expect(lesson.questions.length, lesson.id).toBeGreaterThanOrEqual(4);
        expect(new Set(lesson.questions.map((q) => q.id)).size).toBe(
          lesson.questions.length,
        );
        for (const question of lesson.questions) {
          expect(question.id.startsWith(`${lesson.id}-`)).toBe(true);
          expect(question.correct).toBeGreaterThanOrEqual(0);
          expect(question.correct).toBeLessThan(question.options.length);
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
          for (const language of ['zh', 'en'] as const)
            expect(
              text[language].trim().length,
              `${lesson.id} ${name} ${language}`,
            ).toBeGreaterThan(20);
        }
      }
    expect(predictions.size).toBe(24);
  });

  it('renders all diagrams and interactives in three modes with valid accessible SVGs and distinct non-text geometry', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      for (const family of families) {
        const geometries = new Set<string>();
        for (const lesson of family.lessons)
          for (const mode of modes) {
            const diagram = render(family.diagram, lesson.id, mode);
            const interactive = render(family.explore, lesson.id, mode);
            for (const html of [diagram, interactive]) {
              expect(html, `${lesson.id} ${mode}`).toContain('<svg');
              expect(html, `${lesson.id} ${mode}`).toMatch(
                /<title>[^<]+<\/title>/,
              );
              expect(html).toMatch(/role="img"/);
              expect(html).not.toMatch(
                /Choose a lesson\.|请选择课程。|undefined|NaN|\[object Object\]/,
              );
            }
            expect(interactive).toMatch(/<(button|input|select)\b/);
            if (mode === 'bilingual') expect(interactive).toContain('bio-en');
            if (mode === 'en')
              geometries.add(
                normalize(
                  diagram
                    .match(/<svg[\s\S]*?<\/svg>/)![0]
                    .replace(/<(title|text)\b[\s\S]*?<\/\1>/g, '')
                    .replace(/aria-label="[^"]*"/g, ''),
                ),
              );
            if (family.prefix === 'EvolutionCycle') {
              expect(diagram).toContain('tabindex="0"');
              expect(diagram).toContain('overflow-x:auto');
              expect(diagram).toContain('min-width:520px');
              expect(interactive).toContain('<details');
            }
          }
        expect(
          geometries.size,
          `${family.prefix} distinct diagrams without labels`,
        ).toBe(8);
      }
      expect(errors.mock.calls, 'React server-render warnings').toEqual([]);
    } finally {
      errors.mockRestore();
    }
  });

  it('resolves actual lazy public visual routes to the declared components in every mode', async () => {
    for (const id of [
      'L072',
      'L097',
      'L73',
      'L073oops',
      'xL073',
      'L073.0',
      'L073\n',
    ])
      expect(isS4Lesson(id), id).toBe(false);
    for (const family of families)
      for (const lesson of family.lessons) {
        expect(isS4Lesson(lesson.id)).toBe(true);
        for (const mode of modes)
          for (const [route, direct] of [
            [Diagram, family.diagram],
            [Explore, family.explore],
            [S4HookArt, family.hook],
          ] as const)
            expect(
              await renderRoute(route, lesson.id, mode),
              `${lesson.id} ${mode} ${direct.name}`,
            ).toBe(normalize(render(direct, lesson.id, mode)));
      }
  });

  it('round-trips S04 lessons and six missions without resetting version-one records or altering older stage counts', () => {
    expect(STORAGE_KEY).toBe('study-biology-v1');
    let old = withEcoProject(
      withLeafProject(
        withProject(emptyProgress(), 'S01', {
          ...emptyProject(),
          zh: '旧田野记录',
          en: 'Earlier field record',
        }),
        { ...emptyLeafProject(), zh: '旧叶片记录', en: 'Earlier leaf record' },
      ),
      {
        ...emptyEcoProject(),
        zh: '旧生态记录',
        en: 'Earlier ecology record',
      },
    );
    for (const n of [1, 25, 49]) {
      const id = idAt(n),
        q = lessons.find((l) => l.id === id)!.questions[0]!;
      old.sessions[id] = {
        step: 3,
        note: `Previous ${id}`,
        explored: true,
        completedAt: 10,
      };
      old.answers[q.id] = { choice: q.correct, first: q.correct, at: 10 };
    }
    for (const id of ['U01', 'U07', 'U13'])
      old = withMission(old, id, {
        object: `Previous ${id}`,
        evidence: 'Earlier evidence',
        reasoning: 'Earlier reasoning',
        savedAt: 10,
      });
    old = decodeProgress(JSON.stringify(old));
    let extended = decodeProgress(JSON.stringify(old));
    for (let n = 73; n <= 96; n++)
      extended.sessions[idAt(n)] = {
        step: 3,
        note: `S04 ${n}`,
        completedAt: 20,
      };
    for (let n = 19; n <= 24; n++)
      extended = withMission(extended, `U${n}`, {
        object: `S04 ${n}`,
        evidence: 'Conditional model comparison',
        reasoning: 'Evidence, mechanism and limits',
        savedAt: 20,
      });
    const restored = decodeProgress(JSON.stringify(extended));
    expect(restored.projects).toEqual(old.projects);
    for (const [id, session] of Object.entries(old.sessions))
      expect(restored.sessions[id]).toEqual(session);
    expect(restored.answers).toEqual(old.answers);
    expect(restored.mission).toEqual(old.mission);
    for (const [id, mission] of Object.entries(old.missions))
      expect(restored.missions[id]).toEqual(mission);
    expect(
      Object.keys(restored.sessions).filter((id) => Number(id.slice(1)) >= 73),
    ).toHaveLength(24);
    expect(
      Object.keys(restored.missions).filter((id) => Number(id.slice(1)) >= 19),
    ).toHaveLength(6);
    for (const outcome of [stageOutcome, leafStageOutcome, ecoStageOutcome])
      expect(outcome(restored)).toEqual(outcome(old));
  });
});
