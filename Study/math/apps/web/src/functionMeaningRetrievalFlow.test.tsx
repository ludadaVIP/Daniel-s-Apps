// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { functionMeaningRetrieval } from './content/functionMeaningRetrieval';
import { cartesianMeaningRetrieval } from './content/cartesianMeaningRetrieval';
import { maintenanceSets, maintenanceHref } from './content/maintenance';
vi.setConfig({ testTimeout: 60000 });
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
const sets = Object.values(functionMeaningRetrieval);
describe('J85 function meaning cards through actual routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': records two separately reviewed cards without inheriting old checked explanations',
      () => {
        const p = emptyProgress(),
          check = {
            ...newSession(),
            practiceIndex: 2,
            note: 'Engineering fixture: preserve check',
          },
          source = {
            ...newSession(),
            practiceIndex: 1,
            note: 'Engineering fixture: preserve J85 review',
          },
          other = {
            ...newSession(),
            note: 'Engineering fixture: preserve unrelated P51',
          };
        const old = {
          ...newSession(),
          practiceIndex: 5,
          answers: {
            [s.unit + '-MAINT-ORDER-RULE-Q6']: {
              input: 'Engineering fixture: old checked reasoning',
              tries: 1,
              hints: 0,
              correct: true,
              independent: true,
              checked: true,
            },
          },
        };
        const previous = {
          ...newSession(),
          answers: {
            [s.unit + '-MAINT-INEQUALITY-MEANING-Q1']: {
              input: 'Engineering fixture: prior batch checked reasoning',
              tries: 1,
              hints: 0,
              correct: true,
              independent: true,
              checked: true,
            },
          },
        };
        p.sessions[s.unit + '-CHECK'] = check;
        p.sessions['J85-CHECK'] = source;
        p.sessions[maintenanceSets.P51.id] = other;
        p.sessions[s.unit + '-MAINT-ORDER-RULE'] = old;
        p.sessions[s.unit + '-MAINT-INEQUALITY-MEANING'] = previous;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        for (const [i, q] of s.questions.entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
          expect(
            (
              screen.getByRole('textbox', {
                name: 'Your reasoning',
              }) as HTMLTextAreaElement
            ).value,
          ).toBe('');
          expect(
            screen.getByText(new RegExp('Recorded ' + i + '/2')),
          ).toBeTruthy();
          expect(
            screen
              .getByRole('link', { name: /Revisit J85 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/J85-L0' + [3, 6][i] + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: {
                value: 'Engineering reviewed reasoning: ' + q.solution.en,
              },
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
            screen.getByText(new RegExp('Recorded ' + (i + 1) + '/2')),
          ).toBeTruthy();
          expect(saved().sessions[s.unit + '-CHECK']).toEqual(check);
          expect(saved().sessions['J85-CHECK']).toEqual(source);
          expect(saved().sessions[maintenanceSets.P51.id]).toEqual(other);
          expect(saved().sessions[s.unit + '-MAINT-ORDER-RULE']).toEqual(old);
          expect(
            saved().sessions[s.unit + '-MAINT-INEQUALITY-MEANING'],
          ).toEqual(previous);
          view.unmount();
        }
        mount(maintenanceHref(s));
        expect(
          screen.getByText(/Recorded 2\/2; 1 independently completed/),
        ).toBeTruthy();
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe(
          'Engineering reviewed reasoning: ' + s.questions[1]!.solution.en,
        );
        expect(saved().sessions[s.id].practiceIndex).toBe(1);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let n = 1; n <= 6; n++)
          expect(saved().sessions['J85-L0' + n]).toBeUndefined();
        fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
        expect(saved().sessions[s.unit + '-CHECK']).toEqual(check);
      },
    );
  it('renders four bilingual original tables with blank explanations, zero reviewed progress and closed rubrics', () => {
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
        expect(screen.getByText(/Recorded 0\/2/)).toBeTruthy();
        expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        view.unmount();
      }
  });
  it('keeps old tasks and opens exact shared new cards from the four relevant source guides', () => {
    for (const [lesson, n, oldN] of [
      [1, 1, 6],
      [2, 2, 6],
      [3, 1, 7],
      [6, 2, 10],
    ] as const)
      for (const s of sets) {
        const view = mount('/math/lesson/J85-L0' + lesson);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const links = screen.getAllByRole('link');
        expect(
          links.some(
            (l) =>
              l.getAttribute('href') ===
              `/math/unit/${s.unit}/maintenance?question=${s.unit}-MAINT-ORDER-RULE-Q${oldN}`,
          ),
        ).toBe(true);
        const link = links.find(
          (l) =>
            l.getAttribute('href') ===
            maintenanceHref(s, s.questions[n - 1]!.id),
        )!;
        expect(link).toBeDefined();
        fireEvent.click(link);
        expect(screen.getByText(s.questions[n - 1]!.stem.en)).toBeTruthy();
        expect(saved().sessions['J85-L0' + lesson]).toBeUndefined();
        view.unmount();
      }
  });
  it('reuses the exact existing fractional-pair and self-created emptying cards without changing their bridges or answers', () => {
    for (const [lesson, n] of [
      [2, 2],
      [4, 2],
      [6, 3],
    ] as const)
      for (const s of Object.values(cartesianMeaningRetrieval)) {
        const q = s.questions[n - 1]!,
          view = mount('/math/lesson/J85-L0' + lesson);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const link = screen
          .getAllByRole('link')
          .find((l) => l.getAttribute('href') === maintenanceHref(s, q.id))!;
        expect(link).toBeDefined();
        fireEvent.click(link);
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getByText(/Recorded 0\/3/)).toBeTruthy();
        expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        expect(
          screen
            .getByRole('link', { name: /Revisit J75 foundation models/ })
            .getAttribute('href'),
        ).toBe('/math/lesson/' + s.bridgeByQuestion[q.id] + '?step=1');
        view.unmount();
      }
  });
});
