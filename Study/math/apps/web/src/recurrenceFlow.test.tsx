// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';

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
const enter = (value: string, name = 'Your answer') =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const progress = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
const follow = (id: string) => {
  const link = screen
    .getAllByRole('link')
    .find((a) => a.getAttribute('href')?.endsWith(`?question=${id}`));
  expect(link, id).toBeDefined();
  fireEvent.click(link!);
};
const openParent = () =>
  fireEvent.click(screen.getByText('A small guide for parents'));

describe('parent-led recurrence links and exact task navigation', () => {
  it('retains an existing completion, review date, note and supported answer while selecting another task', () => {
    const saved = emptyProgress();
    const before = {
      ...newSession(),
      step: 5,
      practiceIndex: 1,
      completedAt: '2026-10-20T09:00:00.000Z',
      nextReview: '2026-10-26T09:00:00.000Z',
      parentChecked: true,
      note: 'Engineering fixture: compare units before totals.',
      answers: {
        'B05-L05-Q2': {
          input: '24',
          tries: 0,
          hints: 1,
          correct: true,
          checked: true,
          independent: false,
        },
      },
    };
    saved.sessions['B05-L05'] = before;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/lesson/B05-L05?question=B05-L05-Q3');
    expect(progress().sessions['B05-L05']).toEqual({
      ...before,
      step: 4,
      practiceIndex: 2,
    });
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
  it('opens the comparison task from the B02 parent card and restores that practice answer', () => {
    const first = mount('/math/lesson/B02-L01');
    openParent();
    expect(screen.getByText('Wholes and parts')).toBeTruthy();
    expect(screen.getByText('Differences in comparisons')).toBeTruthy();
    follow('B05-L05-Q3');
    expect(
      screen.getByText(
        'Read the chart: how many more people use Bus than Walk?',
      ),
    ).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      '/math/lesson/B05-L05',
    );
    enter('2');
    click(/Check answer/);
    expect(progress().sessions['B05-L05'].practiceIndex).toBe(2);
    expect(progress().sessions['B05-L05'].step).toBe(4);
    expect(progress().sessions['B05-L05'].answers['B05-L05-Q3'].correct).toBe(
      true,
    );
    expect(progress().sessions['B02-L01']).toBeUndefined();
    expect(progress().sessions['B05-L05'].completedAt).toBeUndefined();
    first.unmount();
    mount('/math/lesson/B05-L05');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2');
  });

  it('preserves earlier answers and allows navigation after consuming a requested question', () => {
    const first = mount('/math/lesson/B05-L05?question=B05-L05-Q2');
    enter('24');
    click(/Check answer/);
    first.unmount();
    const second = mount('/math/lesson/B05-L05?question=B05-L05-Q3');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    expect(progress().sessions['B05-L05'].answers['B05-L05-Q2'].input).toBe(
      '24',
    );
    expect(screen.getByLabelText('Current route').textContent).not.toContain(
      'question',
    );
    click('Question 4');
    expect(progress().sessions['B05-L05'].practiceIndex).toBe(3);
    second.unmount();
    mount('/math/lesson/B05-L05?question=P61-L04-G');
    expect(progress().sessions['B05-L05'].practiceIndex).toBe(3);
    expect(progress().sessions['P61-L04']).toBeUndefined();
    expect(screen.getByText(/B05-L05-Q4/)).toBeTruthy();
  });

  it('opens a later sharing guided task without pre-filling or granting source mastery', () => {
    const first = mount('/math/lesson/B02-L03');
    openParent();
    follow('P61-L04-G');
    expect(
      screen.getByText(
        'Share 3/4 L equally between two people. How many litres per person?',
      ),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    expect(progress().sessions['P61-L04'].step).toBe(3);
    enter('3/8 L');
    click(/Check answer/);
    expect(progress().sessions['P61-L04'].answers['P61-L04-G'].correct).toBe(
      true,
    );
    expect(progress().sessions['B02-L03']).toBeUndefined();
    expect(progress().sessions['P61-L04'].completedAt).toBeUndefined();
    first.unmount();
    mount('/math/lesson/P61-L04');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('3/8 L');
  });

  it('opens an exact exit task even when an old explore parameter is present, without completing the lesson', () => {
    mount('/math/lesson/B03-L01?step=1&question=B03-L01-X');
    expect(screen.getByText(/B03-L01-X/)).toBeTruthy();
    expect(progress().sessions['B03-L01'].step).toBe(5);
    expect(screen.getByLabelText('Current route').textContent).toBe(
      '/math/lesson/B03-L01',
    );
    enter('234');
    click(/Check answer/);
    expect(progress().sessions['B03-L01'].completedAt).toBeUndefined();
    expect(progress().sessions['B03-L01'].parentChecked).toBe(false);
  });

  it('opens the requested maintained explanation through the B01 card and retains a different saved task', () => {
    const first = mount('/math/unit/B03/maintenance?question=B03-MAINT-B01-Q2');
    enter('600');
    click(/Check answer/);
    first.unmount();
    mount('/math/lesson/B01-L04');
    openParent();
    follow('B03-MAINT-B01-Q4');
    expect(screen.getByText(/B03-MAINT-B01-Q4/)).toBeTruthy();
    expect(progress().sessions['B03-MAINT-B01'].practiceIndex).toBe(3);
    expect(
      progress().sessions['B03-MAINT-B01'].answers['B03-MAINT-B01-Q2'].input,
    ).toBe('600');
    expect(screen.getByLabelText('Current route').textContent).toBe(
      '/math/unit/B03/maintenance',
    );
    enter(
      'Engineering review example: compare distances 499 and 501 from the original 4499.',
      'Your reasoning',
    );
    expect(screen.getByText(/Recorded 1\/9/)).toBeTruthy();
    expect(progress().sessions['B01-L04']).toBeUndefined();
    expect(progress().sessions['B03-CHECK']).toBeUndefined();
  });

  it('selects a canonical unit-check question without opening a course session', () => {
    mount('/math/unit/B03/check?question=B03-CHECK-Q6');
    expect(screen.getByText(/B03-CHECK-Q6/)).toBeTruthy();
    expect(progress().sessions['B03-CHECK'].practiceIndex).toBe(5);
    enter('5');
    click(/Check answer/);
    expect(
      progress().sessions['B03-CHECK'].answers['B03-CHECK-Q6'].correct,
    ).toBe(true);
    expect(progress().sessions['B03-L04']).toBeUndefined();
  });

  it.each(['constructor', 'B02-L01-Q99', 'P61-L04-G'])(
    'ignores an unowned question parameter %s without creating study evidence',
    (id) => {
      mount(`/math/lesson/B02-L01?question=${id}`);
      expect(progress().sessions).toEqual({});
      expect(
        screen
          .getByRole('button', { name: /01 Wonder/ })
          .getAttribute('aria-pressed'),
      ).toBe('true');
    },
  );
});
