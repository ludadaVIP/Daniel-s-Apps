// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { maintenanceSets, maintenanceHref } from './content/maintenance';
import { recurrenceLinksFor } from './recurrenceTargets';

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
const secondary = maintenanceSets.H36_VECTOR;

describe('multiple retrieval groups within one unit', () => {
  it('discovers both groups, switches without merging records and restores an exact secondary task after its query is consumed', () => {
    const p = emptyProgress(),
      primary = maintenanceSets.H36;
    p.sessions[primary.id] = {
      ...newSession(),
      practiceIndex: 2,
      note: 'Preserve earlier circle work',
    };
    p.sessions['H36-CHECK'] = {
      ...newSession(),
      practiceIndex: 1,
      note: 'Preserve original unit review',
    };
    const primaryBefore = p.sessions[primary.id],
      checkBefore = p.sessions['H36-CHECK'];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    const view = mount('/math/unit/H36/check');
    expect(
      screen.getByRole('link', { name: /Open 6 cross-unit retrieval tasks/ }),
    ).toBeTruthy();
    const link = screen.getByRole('link', {
      name: `${secondary.title.en} (${secondary.questions.length})`,
    });
    expect(link.getAttribute('href')).toBe(maintenanceHref(secondary));
    fireEvent.click(link);
    expect(screen.getByText(secondary.questions[0]!.stem.en)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Question 3' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value: 'Engineering fixture: scalar direction and zero-source cases',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Parent confirms: reasoning makes sense',
      }),
    );
    expect(saved().sessions[primary.id]).toEqual(primaryBefore);
    expect(saved().sessions['H36-CHECK']).toEqual(checkBefore);
    const route = screen.getByLabelText('Current route').textContent!;
    expect(new URL(route, 'http://localhost').searchParams.get('set')).toBe(
      secondary.id,
    );
    view.unmount();
    const restored = mount(route);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).value,
    ).toContain('Engineering fixture: scalar direction');
    expect(screen.getByText(/Recorded 1\/4; 1 independently/)).toBeTruthy();
    fireEvent.click(
      screen.getByRole('link', {
        name: `${primary.title.en} (${primary.questions.length})`,
      }),
    );
    expect(screen.getByText(primary.questions[2]!.stem.en)).toBeTruthy();
    expect(
      saved().sessions[secondary.id].answers[secondary.questions[2]!.id]
        .checked,
    ).toBe(true);
    restored.unmount();
    const q = secondary.questions[3]!;
    mount(`/math/unit/H36/maintenance?question=${q.id}`);
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      maintenanceHref(secondary),
    );
  });
  it('opens the exact secondary evidence from the source lesson links with an explicit group', () => {
    const target = recurrenceLinksFor('H05-L01')
      .flatMap((g) => g.targets)
      .find((q) => q.id === secondary.questions[0]!.id)!;
    const url = new URL(target.href, 'http://localhost');
    expect(url.searchParams.get('set')).toBe(secondary.id);
    mount(url.pathname + url.search);
    expect(screen.getByText(secondary.questions[0]!.stem.en)).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      maintenanceHref(secondary),
    );
    expect(saved().sessions['H05-L01']).toBeUndefined();
  });
  it.each([
    maintenanceSets.H23_VECTOR.id,
    'constructor',
    '__proto__',
    'unknown',
  ])(
    'does not select a foreign or unknown group %s or create an answer record',
    (id) => {
      mount(
        `/math/unit/H36/maintenance?set=${id}&question=${secondary.questions[0]!.id}`,
      );
      expect(
        screen.getByText(
          'Cross-unit retrieval for this unit is being prepared.',
        ),
      ).toBeTruthy();
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(Object.keys(saved().sessions)).toHaveLength(0);
    },
  );
  it('keeps an explicit valid group when its question belongs to another group', () => {
    mount(
      `${maintenanceHref(secondary)}&question=${maintenanceSets.H36.questions[5]!.id}`,
    );
    expect(screen.getByText(secondary.questions[0]!.stem.en)).toBeTruthy();
    expect(saved().sessions[maintenanceSets.H36.id]).toBeUndefined();
    expect(screen.getByText(/Recorded 0\/4/)).toBeTruthy();
  });
});
