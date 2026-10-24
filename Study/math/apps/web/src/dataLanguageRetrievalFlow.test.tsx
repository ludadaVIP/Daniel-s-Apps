// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { dataLanguageRetrieval } from './content/dataLanguageRetrieval';
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
describe('data language retrieval routes', () => {
  it('shows every raw record and all four stacked plot observations in both languages without recording completion', async () => {
    for (const s of Object.values(dataLanguageRetrieval))
      for (const lang of ['en', 'bilingual']) {
        localStorage.clear();
        localStorage.setItem('study-language', lang);
        const q = s.questions[0]!,
          view = mount(`/math/unit/${s.unit}/maintenance?question=${q.id}`);
        expect(
          screen.getByRole('table', {
            name:
              lang === 'en'
                ? 'Given fictional raw colour records;one occasion'
                : /给定虚构原始颜色记录/,
          }),
        ).toBeTruthy();
        expect(screen.getAllByRole('row')).toHaveLength(7);
        expect(
          screen.getAllByRole('rowheader').map((h) => h.textContent),
        ).toEqual(['r1', 'r2', 'r3', 'r4', 'r5', 'r6']);
        expect(screen.getByText('Missing')).toBeTruthy();
        expect(
          screen.getByText('Confirmed same-ID/occasion copy'),
        ).toBeTruthy();
        expect(screen.getByText(/Recorded 0\/4/)).toBeTruthy();
        view.unmount();
        const plotView = mount(
            `/math/unit/${s.unit}/maintenance?question=${s.questions[1]!.id}`,
          ),
          plot = screen.getByRole('img');
        expect(plot.querySelectorAll('circle[data-record-id]')).toHaveLength(4);
        expect(
          screen.getByText(
            'Each dot is one record, with duplicates stacked individually.',
          ),
        ).toBeTruthy();
        expect(screen.queryByText(/both plots share/)).toBeNull();
        expect(screen.getByText(/Recorded 0\/4/)).toBeTruthy();
        plotView.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
  });
  for (const s of Object.values(dataLanguageRetrieval))
    it(`${s.unit}: opens all four arguments, requires explicit review and restores its own session`, async () => {
      const p = emptyProgress(),
        original = {
          ...newSession(),
          practiceIndex: 2,
          note: 'Engineering fixture: preserve original check',
        };
      p.sessions[`${s.unit}-CHECK`] = original;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      for (const [i, q] of s.questions.entries()) {
        const view = mount(`/math/unit/${s.unit}/maintenance?question=${q.id}`);
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
        expect(screen.getByText(new RegExp(`Recorded ${i}/4`))).toBeTruthy();
        if (i === 2) click('A little hint');
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        click('Parent confirms: reasoning makes sense');
        expect(
          screen.getByText(new RegExp(`Recorded ${i + 1}/4`)),
        ).toBeTruthy();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      mount(maintenanceHref(s));
      expect(
        screen.getByText(/Recorded 4\/4; 3 independently completed/),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(`Engineering review example: ${s.questions[3]!.solution.en}`);
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
