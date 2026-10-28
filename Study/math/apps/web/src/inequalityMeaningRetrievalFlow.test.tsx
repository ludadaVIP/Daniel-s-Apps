// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { inequalityMeaningRetrieval } from './content/inequalityMeaningRetrieval';
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
const sets = Object.values(inequalityMeaningRetrieval);
describe('J84 inequality meaning cards through real routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': saves, explicitly reviews and restores explanations without inheriting old checked evidence',
      () => {
        const p = emptyProgress(),
          check = {
            ...newSession(),
            practiceIndex: 2,
            note: 'Engineering fixture: preserve unit check',
          },
          source = {
            ...newSession(),
            practiceIndex: 1,
            note: 'Engineering fixture: preserve source review',
          },
          other = {
            ...newSession(),
            note: 'Engineering fixture: preserve P51',
          };
        const old = {
          ...newSession(),
          practiceIndex: 5,
          answers: {
            [s.unit + '-MAINT-ORDER-RULE-Q1']: {
              input: 'Engineering fixture: old reviewed reasoning',
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
            'J95-MAINT-SYSTEM-MEANING-Q1': {
              input: 'Engineering fixture: previous batch reviewed reasoning',
              tries: 1,
              hints: 0,
              correct: true,
              independent: true,
              checked: true,
            },
          },
        };
        p.sessions[s.unit + '-CHECK'] = check;
        p.sessions['J84-CHECK'] = source;
        p.sessions[maintenanceSets.P51.id] = other;
        p.sessions[s.unit + '-MAINT-ORDER-RULE'] = old;
        p.sessions['J95-MAINT-SYSTEM-MEANING'] = previous;
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
            screen.getByText(new RegExp('Recorded ' + i + '/3')),
          ).toBeTruthy();
          expect(
            screen
              .getByRole('link', { name: /Revisit J84 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/J84-L0' + [3, 4, 5][i] + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: {
                value: 'Engineering reviewed reasoning: ' + q.solution.en,
              },
            },
          );
          expect(saved().sessions[s.id].answers[q.id].checked).toBe(false);
          if (i === 2)
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
          expect(saved().sessions[s.unit + '-CHECK']).toEqual(check);
          expect(saved().sessions['J84-CHECK']).toEqual(source);
          expect(saved().sessions[maintenanceSets.P51.id]).toEqual(other);
          expect(saved().sessions[s.unit + '-MAINT-ORDER-RULE']).toEqual(old);
          expect(saved().sessions['J95-MAINT-SYSTEM-MEANING']).toEqual(
            previous,
          );
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
        ).toBe(
          'Engineering reviewed reasoning: ' + s.questions[2]!.solution.en,
        );
        expect(saved().sessions[s.id].practiceIndex).toBe(2);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let i = 1; i <= 5; i++)
          expect(saved().sessions['J84-L0' + i]).toBeUndefined();
        fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
        expect(saved().sessions[s.unit + '-CHECK']).toEqual(check);
      },
    );
  it('renders six bilingual original tables with blank inputs, unreviewed progress and closed rubrics', () => {
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
        expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        view.unmount();
      }
  });
  it('keeps each original link and opens the exact shared card from all five source parent guides', () => {
    for (const [lesson, n] of [
      [1, 3],
      [2, 1],
      [3, 1],
      [4, 2],
      [5, 3],
    ] as const)
      for (const s of sets) {
        const view = mount('/math/lesson/J84-L0' + lesson);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const links = screen.getAllByRole('link');
        expect(
          links.some(
            (l) =>
              l.getAttribute('href') ===
              `/math/unit/${s.unit}/maintenance?question=${s.unit}-MAINT-ORDER-RULE-Q${lesson}`,
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
        expect(saved().sessions['J84-L0' + lesson]).toBeUndefined();
        view.unmount();
      }
  });
});
