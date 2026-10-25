import { describe, it, expect } from 'vitest';
import dispatcher from './Labs.tsx?raw';
import { lessons } from './content';
import type { Lesson } from './model';
const modules = import.meta.glob('./*Labs.tsx', { eager: true });
describe('actual lesson-model dispatch contracts', () => {
  it('gives every formal lesson one matching imported family or an explicitly supported legacy model, without interception', () => {
    const guards: { name: string; test: (kind: Lesson['lab']) => boolean }[] =
      [];
    for (const match of dispatcher.matchAll(
      /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g,
    )) {
      const names = match[1]!
        .split(',')
        .map((s) => s.trim())
        .filter((s) => /^is\w*Lab$/.test(s));
      if (!names.length) continue;
      const module = modules[match[2] + '.tsx'] as
        Record<string, unknown> | undefined;
      expect(module, match[2]).toBeDefined();
      for (const name of names) {
        const test = module![name];
        expect(typeof test, name).toBe('function');
        guards.push({ name, test: test as (kind: Lesson['lab']) => boolean });
      }
    }
    expect(guards.length).toBeGreaterThan(0);
    const legacy = new Set(['parts', 'fractions', 'line', 'decimal', 'money']);
    for (const lesson of lessons) {
      const matches = guards.filter((g) => g.test(lesson.lab));
      expect(
        matches.map((g) => g.name),
        `${lesson.id}: ${lesson.lab}`,
      ).toHaveLength(legacy.has(lesson.lab) ? 0 : 1);
    }
  });
});
