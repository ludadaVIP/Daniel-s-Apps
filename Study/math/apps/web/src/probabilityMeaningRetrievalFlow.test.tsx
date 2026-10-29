// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { probabilityMeaningRetrieval } from './content/probabilityMeaningRetrieval';
import { countingStructureRetrieval } from './content/countingStructureRetrieval';
import { maintenanceHref } from './content/maintenance';
const sets = Object.values(probabilityMeaningRetrieval);
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
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
describe('J97 independent supplement routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': reviews three independent cards without inheriting old checked answers',
      () => {
        const p = emptyProgress(),
          fixture = {
            ...newSession(),
            note: 'Engineering fixture: preserve old work',
            answers: {
              [s.unit + '-MAINT-PROB-PROCESS-Q1']: {
                input: 'Engineering fixture old checked',
                tries: 1,
                hints: 0,
                correct: true,
                independent: true,
                checked: true,
              },
            },
          };
        const protectedIds = [
          s.unit + '-MAINT-PROB-PROCESS',
          'H33-MAINT-COUNTING-STRUCTURE',
          'H34-MAINT-COUNTING-STRUCTURE',
          'J96-CHECK',
          s.unit + '-CHECK',
          'J97-CHECK',
          'P51-MAINT',
        ];
        for (const key of protectedIds)
          p.sessions[key] = structuredClone(fixture);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        for (const [i, q] of s.questions.entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(
            (
              screen.getByRole('textbox', {
                name: 'Your reasoning',
              }) as HTMLTextAreaElement
            ).value,
          ).toBe('');
          expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
          expect(
            screen.getByText(new RegExp('Recorded ' + i + '/3')),
          ).toBeTruthy();
          expect(
            screen
              .getByRole('link', { name: /Revisit J97 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/' + s.bridgeByQuestion[q.id] + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: { value: 'Engineering review fixture: ' + q.solution.en },
            },
          );
          expect(saved().sessions[s.id].answers[q.id].checked).toBe(false);
          if (i === 1)
            fireEvent.click(
              screen.getByRole('button', { name: 'A little hint' }),
            );
          fireEvent.click(
            screen.getByText('Parent review · look at the reasoning'),
          );
          fireEvent.click(
            screen.getByRole('button', {
              name: 'Parent confirms: reasoning makes sense',
            }),
          );
          expect(
            screen.getByText(new RegExp('Recorded ' + (i + 1) + '/3')),
          ).toBeTruthy();
          for (const key of protectedIds)
            expect(saved().sessions[key]).toEqual(fixture);
          view.unmount();
        }
        mount(maintenanceHref(s));
        expect(
          screen.getByText(/Recorded 3\/3; 2 independently completed/),
        ).toBeTruthy();
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('Engineering review fixture: ' + s.questions[2]!.solution.en);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let n = 1; n <= 5; n++)
          expect(saved().sessions['J97-L0' + n]).toBeUndefined();
      },
    );
  it('renders all six bilingual tables with blank explanations and closed references', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const s of sets)
      for (const q of s.questions) {
        const view = mount(maintenanceHref(s, q.id));
        expect(screen.getByText(q.stem.zh)).toBeTruthy();
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getAllByRole('row')).toHaveLength(
          q.contextTable!.rows.length + 1,
        );
        for (const [i, row] of q.contextTable!.rows.entries())
          expect(screen.getAllByRole('rowheader')[i]!.textContent).toBe(
            row[0]!.en,
          );
        expect(screen.getByText(q.solution.en).closest('details')?.open).toBe(
          false,
        );
        expect(
          (
            screen.getByRole('textbox', {
              name: '我的解释',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('');
        expect(screen.getByText(/Recorded 0\/3/)).toBeTruthy();
        view.unmount();
      }
  });
  it('opens exact shared cards from source guides while retaining old arguments', () => {
    for (const [l, n, oldN] of [
      [1, 1, 3],
      [2, 1, 1],
      [3, 1, 1],
      [4, 2, 0],
      [5, 3, 2],
    ] as const)
      for (const s of sets) {
        const view = mount('/math/lesson/J97-L0' + l);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const links = screen.getAllByRole('link');
        if (oldN > 0)
          expect(
            links.some(
              (link) =>
                link.getAttribute('href') ===
                `/math/unit/${s.unit}/maintenance?question=${s.unit}-MAINT-PROB-PROCESS-Q${oldN}`,
            ),
          ).toBe(true);
        const link = links.find(
          (link) =>
            link.getAttribute('href') ===
            maintenanceHref(s, s.questions[n - 1]!.id),
        )!;
        expect(link).toBeDefined();
        fireEvent.click(link);
        expect(screen.getByText(s.questions[n - 1]!.stem.en)).toBeTruthy();
        expect(saved().sessions['J97-L0' + l]).toBeUndefined();
        view.unmount();
      }
  });
  it('opens reused conditional cards from L01 while preserving their original advanced bridges', () => {
    for (const unit of ['H33', 'H34'])
      for (const n of [4, 5]) {
        const view = mount('/math/lesson/J97-L01');
        fireEvent.click(screen.getByText('A small guide for parents'));
        const target = Object.values(countingStructureRetrieval).find(
          (s) => s.unit === unit,
        )!;
        const href = maintenanceHref(target, target.questions[n - 1]!.id);
        fireEvent.click(
          screen
            .getAllByRole('link')
            .find((l) => l.getAttribute('href') === href)!,
        );
        expect(
          screen
            .getByRole('link', { name: /Revisit .* foundation models/ })
            .getAttribute('href'),
        ).toBe(`/math/lesson/H24-L0${n + 1}?step=1`);
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('');
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        expect(saved().sessions['J97-L01']).toBeUndefined();
        view.unmount();
      }
  });
});
