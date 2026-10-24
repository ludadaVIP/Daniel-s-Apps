// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { distributionRecurrenceRetrieval } from './content/distributionRecurrenceRetrieval';
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
describe('distribution recurrence retrieval routes', () => {
  it('renders complete ID/law/left-tail tables once per bilingual cell and both labelled normal curves without completing work', () => {
    for (const set of Object.values(distributionRecurrenceRetrieval)) {
      localStorage.clear();
      localStorage.setItem('study-language', 'bilingual');
      for (const index of [0, 1, 2, 5]) {
        const q = set.questions[index]!,
          table = q.contextTable!;
        const view = mount(maintenanceHref(set, q.id));
        expect(screen.getAllByRole('row')).toHaveLength(table.rows.length + 1);
        expect(
          screen.getAllByRole('rowheader').map((e) => e.textContent),
        ).toEqual(table.rows.map((r) => r[0]!.en));
        expect(screen.getByText(/Recorded 0\/6/)).toBeTruthy();
        view.unmount();
      }
      const q = set.questions[4]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Normal plot needed');
      const view = mount(maintenanceHref(set, q.id));
      expect(screen.getByRole('img').querySelectorAll('polyline')).toHaveLength(
        2,
      );
      expect(screen.getByText(d.caption!.en)).toBeTruthy();
      expect(screen.getByText(/Recorded 0\/6/)).toBeTruthy();
      view.unmount();
    }
  });
  for (const s of Object.values(distributionRecurrenceRetrieval))
    it(`${s.unit}: opens all six arguments, requires explicit review and restores its own session`, async () => {
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
        expect(screen.getByText(new RegExp(`Recorded ${i}/6`))).toBeTruthy();
        if (i === 2) click('A little hint');
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        click('Parent confirms: reasoning makes sense');
        expect(
          screen.getByText(new RegExp(`Recorded ${i + 1}/6`)),
        ).toBeTruthy();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      mount(maintenanceHref(s));
      expect(
        screen.getByText(/Recorded 6\/6; 5 independently completed/),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(`Engineering review example: ${s.questions[5]!.solution.en}`);
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
