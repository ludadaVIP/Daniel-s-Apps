// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { lessonById } from './content';
import { problemSolvingRecurrence } from './content/problemSolvingRecurrence';
import { recurrenceLinksFor } from './recurrenceTargets';
import { STORAGE_KEY } from './progress';
import { representationRetrieval } from './content/representationRetrieval';
import { emptyProgress, newSession } from './model';
import { maintenanceHref } from './content/maintenance';
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
describe('representation retrieval routes', () => {
  it('opens all eight reused canonical reasoning tasks from source evidence without granting mastery', async () => {
    for (const e of problemSolvingRecurrence)
      for (const link of recurrenceLinksFor(e.sourceLesson)
        .flatMap((g) => g.targets)
        .filter((t) => !t.id.includes('MAINT'))) {
        const lesson = lessonById(link.id.split('-').slice(0, 2).join('-'))!,
          q = [lesson.guided, ...lesson.questions, lesson.exit].find(
            (q) => q.id === link.id,
          )!;
        const view = mount(link.href);
        expect(screen.getByRole('heading', { name: q.stem.en })).toBeTruthy();
        expect(saved().sessions[lesson.id]?.completedAt).toBeUndefined();
        expect(saved().sessions[e.sourceLesson]).toBeUndefined();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
  });
  for (const s of Object.values(representationRetrieval))
    it(`${s.unit}: opens one argument, requires explicit review and restores its own session`, async () => {
      const p = emptyProgress(),
        original = {
          ...newSession(),
          practiceIndex: 2,
          note: 'Engineering fixture: preserve original check',
        };
      p.sessions[`${s.unit}-CHECK`] = original;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      for (const [i, q] of s.questions.entries()) {
        const view = mount(maintenanceHref(s, q.id));
        expect(screen.getByRole('heading', { name: q.stem.en })).toBeTruthy();
        expect(screen.getByText(s.intro.en)).toBeTruthy();
        expect(
          screen
            .getByRole('link', { name: /Revisit .* foundation models/ })
            .getAttribute('href'),
        ).toBe(`/math/lesson/${s.bridgeByQuestion[q.id]}?step=1`);
        fireEvent.change(
          screen.getByRole('textbox', { name: 'Your reasoning' }),
          { target: { value: `Engineering review example: ${q.solution.en}` } },
        );
        expect(screen.getByText(new RegExp(`Recorded ${i}/1`))).toBeTruthy();
        if (i === 0) click('A little hint');
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        click('Parent confirms: reasoning makes sense');
        expect(
          screen.getByText(new RegExp(`Recorded ${i + 1}/1`)),
        ).toBeTruthy();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      mount(maintenanceHref(s));
      expect(
        screen.getByText(/Recorded 1\/1; 0 independently completed/),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(`Engineering review example: ${s.questions[0]!.solution.en}`);
      expect(saved().sessions[`${s.unit}-CHECK`]).toEqual(original);
      for (const id of Object.values(s.bridgeByQuestion))
        expect(saved().sessions[id]).toBeUndefined();
      expect(saved().sessions[s.id].completedAt).toBeUndefined();
      fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
      expect(
        screen
          .getAllByRole('link')
          .some((link) => link.getAttribute('href') === maintenanceHref(s)),
      ).toBe(true);
      expect(saved().sessions[`${s.unit}-CHECK`]).toEqual(original);
    });
});
