// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { planeMeaningRetrieval } from './content/planeMeaningRetrieval';
import { lessonById } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
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
const Echo = () => {
  const l = useLocation();
  return <output aria-label="Current route">{l.pathname + l.search}</output>;
};
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Echo />
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
const sets = Object.values(planeMeaningRetrieval);
describe('J74 plane meaning retrieval through actual routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': reviews three cards, restores exact explanations and keeps checks and another group isolated',
      () => {
        const p = emptyProgress(),
          unit = {
            ...newSession(),
            practiceIndex: 2,
            note: 'Engineering fixture: preserve original unit check',
          },
          foundation = {
            ...newSession(),
            practiceIndex: 1,
            note: 'Preserve J74 check',
          },
          other = {
            ...newSession(),
            practiceIndex: 8,
            note: 'Preserve unrelated P51 retrieval',
          };
        p.sessions[s.unit + '-CHECK'] = unit;
        p.sessions['J74-CHECK'] = foundation;
        p.sessions[maintenanceSets.P51.id] = other;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        for (const [i, q] of s.questions.entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(screen.getByText(s.intro.en)).toBeTruthy();
          expect(screen.getByLabelText('Current route').textContent).toBe(
            maintenanceHref(s),
          );
          expect(
            screen
              .getByRole('link', { name: /Revisit J74 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/J74-L0' + [1, 2, 5][i] + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: {
                value: 'Engineering reviewed reasoning: ' + q.solution.en,
              },
            },
          );
          expect(
            screen.getByText(new RegExp('Recorded ' + i + '/3')),
          ).toBeTruthy();
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
          expect(saved().sessions[s.unit + '-CHECK']).toEqual(unit);
          expect(saved().sessions['J74-CHECK']).toEqual(foundation);
          expect(saved().sessions[maintenanceSets.P51.id]).toEqual(other);
          view.unmount();
        }
        mount(maintenanceHref(s));
        expect(
          screen.getByText(/Recorded 4\/3; 2 independently completed/),
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
          expect(saved().sessions['J74-L0' + i]).toBeUndefined();
        fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
        expect(saved().sessions[s.unit + '-CHECK']).toEqual(unit);
        expect(saved().sessions[s.id].answers[s.questions[2]!.id].checked).toBe(
          true,
        );
      },
    );
  it('renders all six bilingual original tables once, with blank unreviewed explanations and closed rubrics', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const s of sets)
      for (const q of s.questions) {
        const view = mount(maintenanceHref(s, q.id));
        expect(screen.getByText(q.stem.zh)).toBeTruthy();
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getAllByRole('row')).toHaveLength(
          q.contextTable!.rows.length + 1,
        );
        const headers = screen.getAllByRole('rowheader');
        for (const [i, r] of q.contextTable!.rows.entries()) {
          expect(r[0]!.zh).toBe(r[0]!.en);
          expect(headers[i]!.textContent).toBe(r[0]!.en);
        }
        expect(screen.getByText(q.contextTable!.caption.zh)).toBeTruthy();
        expect(screen.getByText(q.contextTable!.caption.en)).toBeTruthy();
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
  it('opens exact supplementary cards from all four source parents while keeping the old parallel task', () => {
    for (const [lesson, n] of [
      [1, 1],
      [2, 2],
      [4, 2],
      [5, 3],
    ] as const)
      for (const s of sets) {
        const view = mount('/math/lesson/J74-L0' + lesson);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const href = maintenanceHref(s, s.questions[n - 1]!.id),
          link = screen
            .getAllByRole('link')
            .find((l) => l.getAttribute('href') === href)!;
        expect(link).toBeDefined();
        fireEvent.click(link);
        expect(screen.getByText(s.questions[n - 1]!.stem.en)).toBeTruthy();
        expect(saved().sessions['J74-L0' + lesson]).toBeUndefined();
        view.unmount();
      }
    for (const unit of ['J93', 'J94']) {
      const link = recurrenceLinksFor('J74-L03')
        .flatMap((e) => e.targets)
        .find((t) => t.id === unit + '-MAINT-REASONS-Q3')!;
      const view = mount(link.href);
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: /remove parallelism AND any horizontal/,
        }),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe('');
      expect(saved().sessions['J74-L03']).toBeUndefined();
      view.unmount();
    }
  });
});
