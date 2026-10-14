// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { lessons } from './content';
import { Lab } from './Labs';
import { emptyProgress, newSession } from './model';
vi.setConfig({ testTimeout: 20000 });
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    fn(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe('Math Explorer learning experience', () => {
  it('starts a lesson, preserves a supported answer across navigation and reload, and queues review', () => {
    const view = mount('/math/lesson/B04-L01');
    fireEvent.click(screen.getByRole('button', { name: /Together/ }));
    const input = screen.getByRole('textbox', { name: 'Your answer' });
    fireEvent.change(input, { target: { value: '2/8' } });
    fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
    expect(screen.getByRole('status').textContent).toContain('Nearly there');
    fireEvent.click(screen.getByRole('button', { name: /A little hint/ }));
    fireEvent.change(input, { target: { value: '6/16' } });
    fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
    expect(screen.getByRole('status').textContent).toContain('with support');
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(data.sessions['B04-L01'].answers['L01-G'].independent).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    fireEvent.click(screen.getByRole('button', { name: /A little hint/ }));
    fireEvent.click(screen.getByRole('button', { name: /B Equal parts/ }));
    fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
    view.unmount();
    mount('/math/lesson/B04-L01');
    expect(
      screen
        .getByRole('button', { name: /B Equal parts/ })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.getByRole('status').textContent).toContain('with support');
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText(/15 equal pieces/)).toBeTruthy();
  });
  it('supports diagnostic skip and unsure without exposing answers mid-group', () => {
    mount('/math/check');
    fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }));
    expect(screen.getByText('D01-2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'I’m not sure' }));
    expect(screen.getByText('D01-3')).toBeTruthy();
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(p.diagnostic['D01-1'].result).toBe('skipped');
    expect(p.diagnostic['D01-2'].result).toBe('help');
    expect(screen.queryByText('408 − 100 − 79 = 229.')).toBeNull();
  });
  it('distinguishes an exact decimal from a rounded fraction display', () => {
    render(<Lab kind="line" mode="en" />);
    expect(screen.getByText('=')).toBeTruthy();
    fireEvent.change(screen.getByRole('slider', { name: 'Equal parts' }), {
      target: { value: '3' },
    });
    expect(screen.getByText('≈')).toBeTruthy();
    expect(screen.getByText('0.333')).toBeTruthy();
    fireEvent.change(screen.getByRole('slider', { name: 'Equal parts' }), {
      target: { value: '8' },
    });
    expect(screen.getByText('=')).toBeTruthy();
    expect(screen.getByText('0.125')).toBeTruthy();
  });
  it('retains the current practice question after a reload', () => {
    const view = mount('/math/lesson/B04-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Question 2' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
      target: { value: '2/6' },
    });
    view.unmount();
    mount('/math/lesson/B04-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2/6');
    expect(
      screen
        .getByRole('button', { name: 'Question 2' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('lets a parent review reasoning and keeps understanding visible when review is due', () => {
    const p = emptyProgress(),
      l = lessons[0]!,
      s = newSession();
    s.completedAt = new Date().toISOString();
    s.nextReview = new Date(Date.now() - 1000).toISOString();
    s.explanation = 'The whole has twelve equal pieces.';
    for (const q of [...l.questions, l.exit])
      s.answers[q.id] = {
        input: 'answer',
        tries: 1,
        hints: 0,
        correct: true,
        independent: true,
        checked: true,
      };
    p.sessions[l.id] = s;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    mount('/math/parent');
    expect(screen.getByRole('heading', { name: '0' })).toBeTruthy();
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'I reviewed the learner’s explanation and it makes sense.',
      }),
    );
    expect(screen.getByRole('heading', { name: '1' })).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[l.id]
        .parentChecked,
    ).toBe(true);
  });
  it('starts a due review with new numbers and without the previous correct answer', () => {
    const p = emptyProgress(),
      l = lessons[0]!,
      s = newSession();
    s.nextReview = new Date(Date.now() - 1000).toISOString();
    p.sessions[l.id] = s;
    p.reviews[l.id] = {
      input: '2/5',
      tries: 1,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      round: 1,
      correct: true,
      independent: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    mount('/math/review');
    expect(screen.getByText(/18 equal pieces/)).toBeTruthy();
    const input = screen.getByRole('textbox', { name: 'Your answer' });
    expect((input as HTMLInputElement).value).toBe('');
    fireEvent.change(input, { target: { value: '7/18' } });
    fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    expect(screen.getByText('Nothing waiting for review.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).reviews[l.id].round,
    ).toBe(2);
  });
  it('does not overwrite an unreadable saved record', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid');
    mount('/math');
    expect(screen.getByRole('alert').textContent).toContain('earlier records');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{invalid');
  });
  it('opens the review model link at the exploration step', () => {
    mount('/math/lesson/B04-L04?step=1');
    expect(screen.getByRole('slider', { name: 'Shaded squares' })).toBeTruthy();
  });
});
