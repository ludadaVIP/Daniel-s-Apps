// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { signedMeaningRetrieval } from './content/signedMeaningRetrieval';
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
const sets = Object.values(signedMeaningRetrieval);
describe('P64 signed-number meaning retrieval through actual routes', () => {
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
            note: 'Preserve P64 check',
          },
          other = {
            ...newSession(),
            practiceIndex: 8,
            note: 'Preserve unrelated P51 retrieval',
          };
        p.sessions[s.unit + '-CHECK'] = unit;
        p.sessions['P64-CHECK'] = foundation;
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
              .getByRole('link', { name: /Revisit P64 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/P64-L0' + (i + 1) + '?step=1');
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
          expect(saved().sessions['P64-CHECK']).toEqual(foundation);
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
          expect(saved().sessions['P64-L0' + i]).toBeUndefined();
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
        const source = 'P64-L0' + i,
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
    const s = signedMeaningRetrieval.P67_SIGNED_MEANING,
      q = s.questions[2]!;
    const view = mount(
      '/math/unit/P67/maintenance?set=' + s.id + '&question=' + q.id,
    );
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      '/math/unit/P67/maintenance?set=' + s.id,
    );
    view.unmount();
    const restored = mount(maintenanceHref(s));
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    restored.unmount();
    mount(
      '/math/unit/P67/maintenance?set=B06-MAINT-OPERATIONS&question=' + q.id,
    );
    expect(
      screen.getByText('Cross-unit retrieval for this unit is being prepared.'),
    ).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(saved().sessions['B06-MAINT-OPERATIONS']).toBeUndefined();
  });
  it('opens all five source hooks and their own signed-number controls through the shared dispatcher', () => {
    const controls = [
      ['slider', 'Fictional temperature (°C)'],
      ['combobox', 'Movement target'],
      ['slider', 'Integer at A'],
      ['slider', 'Starting integer'],
      ['slider', 'Integer at P'],
    ] as const;
    for (let i = 1; i <= 5; i++) {
      const hook = mount('/math/lesson/P64-L0' + i);
      expect(
        hook.container.querySelector('.math-signed-figure'),
      ).not.toBeNull();
      hook.unmount();
      const view = mount('/math/lesson/P64-L0' + i + '?step=1');
      expect(view.container.querySelector('.math-signed-lab')).not.toBeNull();
      expect(
        screen.getByRole(controls[i - 1]![0], { name: controls[i - 1]![1] }),
      ).toBeTruthy();
      view.unmount();
    }
  });
});
