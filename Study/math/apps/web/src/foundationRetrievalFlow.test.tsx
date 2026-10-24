// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { foundationRetrieval } from './content/foundationRetrieval';
import { numberTheoryRetrieval } from './content/numberTheoryRetrieval';

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
const RouteEcho = () => {
  const l = useLocation();
  return <output aria-label="Current route">{l.pathname + l.search}</output>;
};
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
      <RouteEcho />
    </MemoryRouter>,
  );
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const progress = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);

describe('new foundation maintenance sessions', () => {
  for (const s of [
    ...Object.values(foundationRetrieval),
    ...Object.values(numberTheoryRetrieval),
  ]) {
    it(`${s.unit}: opens every exact task, requires explicit review and restores without modifying unit or source work`, async () => {
      const prior = emptyProgress();
      const original = {
        ...newSession(),
        note: 'Engineering fixture: preserved original review',
        practiceIndex: 1,
      };
      const source = {
        ...newSession(),
        note: 'Engineering fixture: preserved source',
        nextReview: '2026-11-01T00:00:00.000Z',
      };
      prior.sessions[`${s.unit}-CHECK`] = original;
      prior.sessions[s.bridge] = source;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prior));
      for (const [i, q] of s.questions.entries()) {
        const view = mount(`/math/unit/${s.unit}/maintenance?question=${q.id}`);
        expect(screen.getByLabelText('Current route').textContent).toBe(
          `/math/unit/${s.unit}/maintenance`,
        );
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getByText(s.intro.en)).toBeTruthy();
        expect(
          screen.getByText(new RegExp(`Recorded ${i}/${s.questions.length}`)),
        ).toBeTruthy();
        expect(
          screen
            .getByRole('link', { name: /Revisit .* foundation models/ })
            .getAttribute('href'),
        ).toBe(
          `/math/lesson/${(s.bridgeByQuestion as Record<string, string>)[q.id]}?step=1`,
        );
        fireEvent.change(
          screen.getByRole('textbox', { name: 'Your reasoning' }),
          { target: { value: `Engineering review example: ${q.solution.en}` } },
        );
        expect(
          screen.getByText(new RegExp(`Recorded ${i}/${s.questions.length}`)),
        ).toBeTruthy();
        if (i === 0) click('A little hint');
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        click('Parent confirms: reasoning makes sense');
        expect(
          screen.getByText(
            new RegExp(`Recorded ${i + 1}/${s.questions.length}`),
          ),
        ).toBeTruthy();
        expect(progress().sessions[s.id].answers[q.id].independent).toBe(
          i !== 0,
        );
        view.unmount();
        // Separate visits must yield to the event loop, as real navigation does.
        // Otherwise long synchronous batches starve the test worker RPC channel.
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      const view = mount(`/math/unit/${s.unit}/maintenance`);
      expect(
        screen.getByText(
          new RegExp(`Recorded ${s.questions.length}/${s.questions.length}`),
        ),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(`Engineering review example: ${s.questions.at(-1)!.solution.en}`);
      expect(progress().sessions[`${s.unit}-CHECK`]).toEqual(original);
      expect(progress().sessions[s.bridge]).toEqual(source);
      expect(progress().sessions[s.id].completedAt).toBeUndefined();
      fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
      expect(
        screen.getByRole('link', {
          name: new RegExp(
            `Open ${s.questions.length} cross-unit retrieval tasks`,
          ),
        }),
      ).toBeTruthy();
      expect(progress().sessions[`${s.unit}-CHECK`]).toEqual(original);
      view.unmount();
    });
  }
  it('follows the B03 long-division parent link to the exact P52 task and uses its correct bridge', () => {
    mount('/math/lesson/B03-L04');
    fireEvent.click(screen.getByText('A small guide for parents'));
    const link = screen
      .getAllByRole('link')
      .find(
        (a) =>
          a.getAttribute('href') ===
          '/math/unit/P52/maintenance?question=P52-MAINT-FOUNDATION-Q4',
      );
    expect(link).toBeDefined();
    fireEvent.click(link!);
    expect(
      screen.getByText(foundationRetrieval.P52.questions[3]!.stem.en),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: /Revisit B03 foundation models/ })
        .getAttribute('href'),
    ).toBe('/math/lesson/B03-L04?step=1');
    expect(progress().sessions['B03-L04']).toBeUndefined();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      '/math/unit/P52/maintenance',
    );
  });
  it('ignores a foreign question in another maintenance set without copying or recording its answer', () => {
    mount('/math/unit/P53/maintenance?question=P51-MAINT-FOUNDATION-Q9');
    expect(
      screen.getByText(numberTheoryRetrieval.P53.questions[0]!.stem.en),
    ).toBeTruthy();
    expect(Object.keys(progress().sessions)).toHaveLength(0);
  });
});
