// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { linearMeaningRetrieval } from './content/linearMeaningRetrieval';
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
const sets = Object.values(linearMeaningRetrieval);
describe('J73 linear meaning retrieval through actual routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': reviews four cards, restores exact explanations and keeps checks and another group isolated',
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
            note: 'Preserve J73 check',
          },
          other = {
            ...newSession(),
            practiceIndex: 8,
            note: 'Preserve unrelated P51 retrieval',
          };
        p.sessions[s.unit + '-CHECK'] = unit;
        p.sessions['J73-CHECK'] = foundation;
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
              .getByRole('link', { name: /Revisit J73 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/J73-L0' + [1, 2, 3, 5][i] + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: {
                value: 'Engineering reviewed reasoning: ' + q.solution.en,
              },
            },
          );
          expect(
            screen.getByText(new RegExp('Recorded ' + i + '/4')),
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
            screen.getByText(new RegExp('Recorded ' + (i + 1) + '/4')),
          ).toBeTruthy();
          expect(saved().sessions[s.unit + '-CHECK']).toEqual(unit);
          expect(saved().sessions['J73-CHECK']).toEqual(foundation);
          expect(saved().sessions[maintenanceSets.P51.id]).toEqual(other);
          view.unmount();
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
        ).toBe(
          'Engineering reviewed reasoning: ' + s.questions[3]!.solution.en,
        );
        expect(saved().sessions[s.id].practiceIndex).toBe(3);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let i = 1; i <= 5; i++)
          expect(saved().sessions['J73-L0' + i]).toBeUndefined();
        fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
        expect(saved().sessions[s.unit + '-CHECK']).toEqual(unit);
        expect(saved().sessions[s.id].answers[s.questions[3]!.id].checked).toBe(
          true,
        );
      },
    );
  it('renders all eight bilingual original tables once, with blank unreviewed explanations and closed rubrics', () => {
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
        expect(screen.getByText(/Recorded 0\/4/)).toBeTruthy();
        expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        view.unmount();
      }
  });
  it('opens shared cards from five source parents and retains both existing denominator targets for L04', () => {
    for (let i = 1; i <= 6; i++) {
      const source = 'J73-L0' + i,
        n = [1, 2, 3, 0, 4, 4][i - 1]!;
      const links = n
        ? sets.map((s) => maintenanceHref(s, s.questions[n - 1]!.id))
        : recurrenceLinksFor(source)
            .flatMap((e) => e.targets)
            .map((t) => t.href);
      expect(links).toHaveLength(2);
      for (const href of links) {
        const view = mount('/math/lesson/' + source);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const link = screen
          .getAllByRole('link')
          .find((l) => l.getAttribute('href') === href)!;
        expect(link).toBeDefined();
        fireEvent.click(link);
        expect(
          screen.getByRole('textbox', { name: 'Your reasoning' }),
        ).toBeTruthy();
        expect(saved().sessions[source]).toBeUndefined();
        view.unmount();
      }
    }
  });
  it('restores an owned exact question and rejects a foreign maintenance group', () => {
    const s = linearMeaningRetrieval.J83_LINEAR_MEANING,
      q = s.questions[2]!;
    const view = mount(
      '/math/unit/J83/maintenance?set=' + s.id + '&question=' + q.id,
    );
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      maintenanceHref(s),
    );
    view.unmount();
    const restored = mount(maintenanceHref(s));
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    restored.unmount();
    mount(
      '/math/unit/J83/maintenance?set=B06-MAINT-OPERATIONS&question=' + q.id,
    );
    expect(
      screen.getByText('Cross-unit retrieval for this unit is being prepared.'),
    ).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(saved().sessions['B06-MAINT-OPERATIONS']).toBeUndefined();
  });
  it('renders the repaired exact J85 target with three independent original conditions and no source mastery', () => {
    localStorage.setItem('study-language', 'bilingual');
    const q = lessonById('J85-L06')!.questions[5]!;
    const link = recurrenceLinksFor('J73-L06')
      .flatMap((e) => e.targets)
      .find((t) => t.id === q.id)!;
    const view = mount(link.href);
    expect(screen.getByText(q.stem.zh)).toBeTruthy();
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    expect(screen.getAllByRole('row')).toHaveLength(4);
    for (const row of q.contextTable!.rows)
      for (const cell of row) {
        expect(screen.getByText(cell.zh)).toBeTruthy();
        expect(screen.getByText(cell.en)).toBeTruthy();
      }
    expect(
      (screen.getByRole('textbox', { name: '我的解释' }) as HTMLTextAreaElement)
        .value,
    ).toBe('');
    expect(screen.getByText(q.solution.en).closest('details')?.open).toBe(
      false,
    );
    expect(saved().sessions['J85-L06'].answers[q.id]).toBeUndefined();
    expect(saved().sessions['J73-L06']).toBeUndefined();
    view.unmount();
  });
  it('dispatches all six source hooks and bounded linear controls with empty learner answers', () => {
    const controls = [
      ['combobox', 'Choose original equation'],
      ['combobox', 'Operation'],
      ['combobox', 'Equation case'],
      ['combobox', 'Equation case'],
      ['combobox', 'Fictional context'],
      ['combobox', 'Audit context'],
    ] as const;
    for (let i = 1; i <= 6; i++) {
      const hook = mount('/math/lesson/J73-L0' + i);
      expect(hook.container.querySelector('.math-linear-hook')).not.toBeNull();
      hook.unmount();
      const view = mount('/math/lesson/J73-L0' + i + '?step=1');
      expect(view.container.querySelector('.math-linear-lab')).not.toBeNull();
      expect(
        screen.getByRole(controls[i - 1]![0], { name: controls[i - 1]![1] }),
      ).toBeTruthy();
      for (const input of view.container.querySelectorAll<HTMLInputElement>(
        '.math-linear-task input, .math-linear-candidate input',
      ))
        expect(input.value).toBe('');
      expect(saved().sessions['J73-L0' + i].completedAt).toBeUndefined();
      view.unmount();
    }
  });
});
