// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { chanceMeaningRetrieval } from './content/chanceMeaningRetrieval';
import { maintenanceSets, maintenanceHref } from './content/maintenance';
import { lessonById } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
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
const sets = Object.values(chanceMeaningRetrieval);
describe('P67 chance meaning retrieval through actual routes', () => {
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
            note: 'Preserve P67 check',
          },
          other = {
            ...newSession(),
            practiceIndex: 8,
            note: 'Preserve unrelated P51 retrieval',
          };
        p.sessions[s.unit + '-CHECK'] = unit;
        p.sessions['P67-CHECK'] = foundation;
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
              .getByRole('link', { name: /Revisit P67 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/P67-L0' + [1, 2, 4, 5][i] + '?step=1');
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
          expect(saved().sessions['P67-CHECK']).toEqual(foundation);
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
          expect(saved().sessions['P67-L0' + i]).toBeUndefined();
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
  it('opens each exact task from all five source parent cards without granting source mastery', () => {
    for (let i = 1; i <= 5; i++)
      for (const s of sets) {
        const source = 'P67-L0' + i,
          view = mount('/math/lesson/' + source);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const q = s.questions[[0, 1, 3, 2, 3][i - 1]!]!,
          link = screen
            .getAllByRole('link')
            .find((l) => l.getAttribute('href') === maintenanceHref(s, q.id))!;
        expect(link).toBeDefined();
        fireEvent.click(link);
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(saved().sessions[source]).toBeUndefined();
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        view.unmount();
      }
  });
  it('consumes an owned exact question, retains an explicit valid set, restores the primary route and rejects another unit’s group', () => {
    const s = chanceMeaningRetrieval.J93_CHANCE_MEANING,
      q = s.questions[2]!;
    const view = mount(
      '/math/unit/J93/maintenance?set=' + s.id + '&question=' + q.id,
    );
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      '/math/unit/J93/maintenance?set=' + s.id,
    );
    view.unmount();
    const restored = mount(maintenanceHref(s));
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    restored.unmount();
    mount(
      '/math/unit/J93/maintenance?set=B06-MAINT-OPERATIONS&question=' + q.id,
    );
    expect(
      screen.getByText('Cross-unit retrieval for this unit is being prepared.'),
    ).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(saved().sessions['B06-MAINT-OPERATIONS']).toBeUndefined();
  });
  it('renders repaired later questions with their original data when entered directly from recurrence links', () => {
    for (const [source, lesson, id, given] of [
      ['P67-L02', 'J76-L03', 'J76-L03-Q6', '4,5,6,7,8'],
      ['P67-L04', 'J97-L02', 'J97-L02-Q6', 'three red and two blue'],
      ['P67-L03', 'J97-L03', 'J97-L03-Q6', 'R1,R2,R3,B1,B2'],
    ] as const) {
      const link = recurrenceLinksFor(source)
        .flatMap((g) => g.targets)
        .find((q) => q.id === id)!;
      const q = lessonById(lesson)!.questions.find((q) => q.id === id)!;
      expect(q.stem.en).toContain(given);
      const view = mount(link.href);
      expect(screen.getByText(q.stem.en)).toBeTruthy();
      expect(saved().sessions[lesson].answers[id]).toBeUndefined();
      expect(saved().sessions[source]).toBeUndefined();
      view.unmount();
    }
  });
  it('opens all five source hooks and their own chance controls through the shared dispatcher', () => {
    const controls = [
      ['combobox', 'Observation set'],
      ['slider', 'Last wait (minutes)'],
      ['combobox', 'Spinner structure'],
      ['slider', 'A token count'],
      ['combobox', 'Spinner structure'],
    ] as const;
    for (let i = 1; i <= 5; i++) {
      const hook = mount('/math/lesson/P67-L0' + i);
      expect(hook.container.querySelector('.math-chance-hook')).not.toBeNull();
      hook.unmount();
      const view = mount('/math/lesson/P67-L0' + i + '?step=1');
      expect(view.container.querySelector('.math-chance-lab')).not.toBeNull();
      expect(
        screen.getByRole(controls[i - 1]![0], { name: controls[i - 1]![1] }),
      ).toBeTruthy();
      view.unmount();
    }
  });
});
