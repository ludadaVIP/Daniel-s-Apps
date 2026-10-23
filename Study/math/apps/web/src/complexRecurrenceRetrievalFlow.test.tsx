// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { complexRecurrenceRetrieval } from './content/complexRecurrenceRetrieval';
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
describe('complex retrieval routes', () => {
  it('renders only the two given points and original displacement in English and bilingual mode', async () => {
    for (const set of Object.values(complexRecurrenceRetrieval))
      for (const mode of ['en', 'bilingual']) {
        localStorage.clear();
        localStorage.setItem('study-language', mode);
        const q = set.questions[4]!,
          d = q.diagram!;
        if (d.kind !== 'cartesian') throw Error('Expected coordinate givens');
        const view = mount(maintenanceHref(set, q.id)),
          plot = screen.getByRole('img');
        expect(plot.querySelectorAll('circle')).toHaveLength(2);
        expect(plot.querySelectorAll('polyline')).toHaveLength(1);
        expect(screen.getByText(d.caption!.en)).toBeTruthy();
        if (mode === 'bilingual')
          expect(screen.getByText(d.caption!.zh)).toBeTruthy();
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        expect(saved().sessions['H21-L05']).toBeUndefined();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
  });
  for (const s of Object.values(complexRecurrenceRetrieval))
    it(`${s.unit}: opens all five arguments, requires explicit review and restores its own session`, async () => {
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
        expect(screen.getByText(q.stem.en)).toBeTruthy();
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
        expect(screen.getByText(new RegExp(`Recorded ${i}/5`))).toBeTruthy();
        if (i === 2) click('A little hint');
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        click('Parent confirms: reasoning makes sense');
        expect(
          screen.getByText(new RegExp(`Recorded ${i + 1}/5`)),
        ).toBeTruthy();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      mount(maintenanceHref(s));
      expect(
        screen.getByText(/Recorded 5\/5; 4 independently completed/),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(`Engineering review example: ${s.questions[4]!.solution.en}`);
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
