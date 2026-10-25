// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { ProblemLab } from './ProblemLabs';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { wordProblemMeaningRetrieval } from './content/wordProblemMeaningRetrieval';
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
const sets = Object.values(wordProblemMeaningRetrieval);
describe('B06 process retrieval through actual routes and zero-group-size workshop', () => {
  for (const s of sets)
    it(
      s.unit +
        ': reviews five cards, restores exact explanations and keeps checks and another group isolated',
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
            note: 'Preserve B06 check',
          },
          other = {
            ...newSession(),
            practiceIndex: 8,
            note: 'Preserve unrelated P51 retrieval',
          };
        p.sessions[s.unit + '-CHECK'] = unit;
        p.sessions['B06-CHECK'] = foundation;
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
              .getByRole('link', { name: /Revisit B06 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/B06-L0' + (i + 1) + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: {
                value: 'Engineering reviewed reasoning: ' + q.solution.en,
              },
            },
          );
          expect(
            screen.getByText(new RegExp('Recorded ' + i + '/5')),
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
            screen.getByText(new RegExp('Recorded ' + (i + 1) + '/5')),
          ).toBeTruthy();
          expect(saved().sessions[s.unit + '-CHECK']).toEqual(unit);
          expect(saved().sessions['B06-CHECK']).toEqual(foundation);
          expect(saved().sessions[maintenanceSets.P51.id]).toEqual(other);
          view.unmount();
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
        ).toBe(
          'Engineering reviewed reasoning: ' + s.questions[4]!.solution.en,
        );
        expect(saved().sessions[s.id].practiceIndex).toBe(4);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let i = 1; i <= 5; i++)
          expect(saved().sessions['B06-L0' + i]).toBeUndefined();
        fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
        expect(saved().sessions[s.unit + '-CHECK']).toEqual(unit);
        expect(saved().sessions[s.id].answers[s.questions[4]!.id].checked).toBe(
          true,
        );
      },
    );
  it('renders all ten bilingual original tables once, with blank unreviewed explanations and closed rubrics', () => {
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
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        view.unmount();
      }
  });
  it('opens each exact task from all five source parent cards without granting source mastery', () => {
    for (let i = 1; i <= 5; i++)
      for (const s of sets) {
        const source = 'B06-L0' + i,
          view = mount('/math/lesson/' + source);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const q = s.questions[i - 1]!,
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
    const s = wordProblemMeaningRetrieval.P57,
      q = s.questions[2]!;
    const view = mount(
      '/math/unit/P57/maintenance?set=' + s.id + '&question=' + q.id,
    );
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      '/math/unit/P57/maintenance?set=' + s.id,
    );
    view.unmount();
    const restored = mount(maintenanceHref(s));
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    restored.unmount();
    mount(
      '/math/unit/P57/maintenance?set=B06-MAINT-OPERATIONS&question=' + q.id,
    );
    expect(
      screen.getByText('Cross-unit retrieval for this unit is being prepared.'),
    ).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(saved().sessions['B06-MAINT-OPERATIONS']).toBeUndefined();
  });
  it('allows zero cards in every existing group, retains zero geometry, and clears numerical checks when group count changes', () => {
    const view = render(<ProblemLab kind="word-problem-represent" mode="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Equal groups' }));
    const each = screen.getByRole('slider', { name: 'Cards per group' });
    expect(each.getAttribute('min')).toBe('0');
    expect(
      screen.getByRole('slider', { name: 'Group count' }).getAttribute('min'),
    ).toBe('1');
    fireEvent.change(each, { target: { value: '0' } });
    expect(view.container.querySelectorAll('.problem-group')).toHaveLength(3);
    expect(
      Array.from(view.container.querySelectorAll('.problem-group')).every(
        (e) => e.getAttribute('width') === '0',
      ),
    ).toBe(true);
    expect(
      view.container.querySelector('svg')!.getAttribute('aria-label'),
    ).toContain('3 equal groups of 0; total ?');
    expect(screen.queryByText('3×0=0')).toBeNull();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'I made an expression; check the relationship',
      }),
    );
    expect(
      view.container.querySelector('p[role="status"]')!.textContent,
    ).toContain('3×0=0');
    fireEvent.change(screen.getByRole('slider', { name: 'Group count' }), {
      target: { value: '5' },
    });
    expect(view.container.querySelector('p[role="status"]')).toBeNull();
    expect(view.container.querySelectorAll('.problem-group')).toHaveLength(5);
    expect(
      Array.from(view.container.querySelectorAll('.problem-group')).every(
        (e) => e.getAttribute('width') === '0',
      ),
    ).toBe(true);
    fireEvent.change(each, { target: { value: '2' } });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'I made an expression; check the relationship',
      }),
    );
    expect(
      view.container.querySelector('p[role="status"]')!.textContent,
    ).toContain('5×2=10');
    expect(
      Array.from(view.container.querySelectorAll('.problem-group')).every(
        (e) => Number(e.getAttribute('width')) > 0,
      ),
    ).toBe(true);
  });
  it('routes every B06 hook and workshop to foundation bars while H28 retains its own representation model', () => {
    const controls = [
      'Role of card 1',
      'Quantity to find',
      'First operation',
      'Buy 4 notebooks',
      'Explanation check',
    ];
    for (let i = 1; i <= 5; i++) {
      const hook = mount('/math/lesson/B06-L0' + i);
      expect(
        hook.container.querySelector('.math-number-hook .math-problem-bars'),
      ).not.toBeNull();
      hook.unmount();
      const explore = mount('/math/lesson/B06-L0' + i + '?step=1');
      const lab = explore.container.querySelector('.math-problem-lab');
      expect(lab).not.toBeNull();
      expect(lab!.textContent).toContain(
        'READ → REPRESENT → CALCULATE → CHECK',
      );
      if (i === 4)
        expect(
          screen.getByRole('button', { name: controls[i - 1] }),
        ).toBeTruthy();
      else
        expect(
          screen.getByRole('combobox', { name: controls[i - 1] }),
        ).toBeTruthy();
      expect(
        screen.queryByRole('combobox', { name: 'Horizontal variable' }),
      ).toBeNull();
      explore.unmount();
    }
    const senior = mount('/math/lesson/H28-L02?step=1');
    expect(senior.container.querySelector('.math-problem-lab')).toBeNull();
    expect(
      screen.getByRole('combobox', { name: 'Horizontal variable' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('textbox', {
        name: 'Predict complete equal-cost attendance set',
      }),
    ).toBeTruthy();
  });
});
