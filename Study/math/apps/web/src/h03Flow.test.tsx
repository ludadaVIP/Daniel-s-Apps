// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ExponentialLab, ExponentialHookArt } from './ExponentialLabs';
import { h03Lessons } from './content/H03';
import { App } from './App';
import { STORAGE_KEY } from './progress';
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
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const parent = () => {
  fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
  click('Parent confirms: reasoning makes sense');
};
describe('H03 prediction workbenches and persisted learning evidence', () => {
  it('withholds a wrong power answer until requested, keeps display changes and resets mathematical changes', () => {
    render(<ExponentialLab kind="exp-integers" mode="en" />);
    enter('Predict (2)^(-3)', '-8');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('reciprocate');
    expect(screen.queryByText(/The result is 1\/8/)).toBeNull();
    click('Reveal derivation');
    expect(screen.getByText(/The result is 1\/8/)).toBeTruthy();
    enter('Predict (2)^(-3)', '1/8');
    click('Check prediction');
    click('Show/hide power table');
    expect(field('Predict (2)^(-3)')).toBe('1/8');
    expect(screen.getByRole('table').textContent).toContain('1/8');
    select('Exponent', '-2');
    expect(field('Predict (2)^(-2)')).toBe('');
  });
  it('checks principal rational roots and the exact irrational contrast', () => {
    render(<ExponentialLab kind="exp-rational" mode="en" />);
    enter('Predict (16)^(3/4)', '8');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
    select('Base', '1/16');
    select('Exponent', '-3/4');
    enter('Predict (1/16)^(-3/4)', '8');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
    click('Show/hide root steps');
    expect(screen.getByRole('table').textContent).toContain('1/2');
    expect(screen.getByRole('table').textContent).toContain('1/8');
    select('Base', '2');
    expect(field('Predict (2)^(1/2)')).toBe('');
    enter('Predict (2)^(1/2)', '1.414');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('Predict (2)^(1/2)', 'sqrt(2)');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
  });
  it('distinguishes half-step exclusion from exact continuous values and clips unjoined points', () => {
    const v = render(<ExponentialLab kind="exp-growth" mode="en" />);
    select('Query input', '0.5');
    enter('Predict output (use outside-domain if excluded)', 'outside-domain');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
    click('Show/hide graph and table');
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      0,
    );
    select('Time domain', 'continuous');
    expect(field('Predict output (use outside-domain if excluded)')).toBe('');
    enter('Predict output (use outside-domain if excluded)', '3sqrt(2)');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      1,
    );
    click('Change window');
    expect(field('Predict output (use outside-domain if excluded)')).toBe(
      '3sqrt(2)',
    );
    select('Step multiplier', '1/2');
    enter('Predict output (use outside-domain if excluded)', '3sqrt(2)/2');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
  });
  it('reverses point roles, accepts small bases, and rejects absent or nonunique inverse exponents', () => {
    const v = render(<ExponentialLab kind="exp-log" mode="en" />);
    enter('Predict logarithm', '3');
    click('Check prediction');
    click('Show/hide inverse graph');
    expect(
      v.container
        .querySelector('[data-function-point="P"]')
        ?.getAttribute('data-coordinate'),
    ).toBe('3,8');
    expect(
      v.container
        .querySelector('[data-function-point="Q"]')
        ?.getAttribute('data-coordinate'),
    ).toBe('8,3');
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      3,
    );
    click('Change window');
    expect(field('Predict logarithm')).toBe('3');
    select('Log base', '1/2');
    enter('Predict logarithm', '-3');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
    select('Argument', '0');
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain('positive');
    select('Argument', '1');
    select('Log base', '1');
    expect(screen.getByRole('status').textContent).toContain('infinitely many');
    expect(v.container.textContent).not.toMatch(/NaN|Infinity/);
  });
  it('uses product versus quotient structure and exposes an actual counterexample to a sum law', () => {
    render(<ExponentialLab kind="exp-laws" mode="en" />);
    enter('Predict exact logarithm', '4');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
    select('Argument operation', 'sum');
    expect(field('Predict exact logarithm')).toBe('');
    enter('Predict exact logarithm', '4');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('Predict exact logarithm', '3');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
    click('Show/hide structure comparison');
    expect(field('Predict exact logarithm')).toBe('3');
    select('Exponent q', '1');
    enter('Predict logarithm (3 decimal places)', '2.585');
    click('Check prediction');
    expect(screen.getByRole('status').textContent).toContain('matches');
  });
  it('separately audits continuous and first-whole thresholds, including exact boundaries and day zero', () => {
    render(<ExponentialLab kind="exp-model" mode="en" />);
    enter('Continuous crossing (nearest 0.1 day)', '2.8');
    enter('First whole day', '3');
    click('Show/hide adjacent checks');
    expect(screen.getByRole('table').textContent).toContain('40');
    expect(field('Continuous crossing (nearest 0.1 day)')).toBe('2.8');
    expect(field('First whole day')).toBe('3');
    select('Target quantity', '40');
    expect(field('First whole day')).toBe('');
    enter('First whole day', '3');
    select('Target quantity', '5');
    enter('First whole day', '0');
    select('Paper model', 'decay');
    expect(field('First whole day')).toBe('');
    enter('Continuous crossing (nearest 0.1 day)', '2.9');
    enter('First whole day', '3');
    const buttons = screen.getAllByRole('button', { name: 'Check prediction' });
    buttons.forEach((b) => fireEvent.click(b));
    expect(
      screen
        .getAllByRole('status')
        .every((s) => s.textContent?.includes('matches')),
    ).toBe(true);
  });
  it('renders two examples in each language through every lesson route', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const l of h03Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 .*Understand/);
      for (const lang of ['zh', 'en'])
        expect(
          v.container.querySelectorAll(
            `.math-prose section[lang="${lang}"] h3`,
          ),
        ).toHaveLength(2);
      v.unmount();
      const art = render(
        <ExponentialHookArt
          mode="bilingual"
          kind={l.lab as Parameters<typeof ExponentialHookArt>[0]['kind']}
        />,
      );
      expect(art.container.querySelector('table')).toBeTruthy();
      art.unmount();
    }
  });
  it('restores corrected guided work for every lesson without marking incomplete lessons mastered', () => {
    for (const [id, right] of [
      ['H03-L01', '1/8'],
      ['H03-L02', '9'],
      ['H03-L03', '48'],
      ['H03-L04', '-3'],
      ['H03-L05', '5'],
      ['H03-L06', '3'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '999');
      click(/Check answer/);
      enter('Your answer', right!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const restored = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(right);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      restored.unmount();
    }
  });
  it('requires parent review for domain-sensitive exits and persists the original argument', () => {
    const v = mount('/math/lesson/H03-L05');
    click(/^06 Reflect/);
    const text =
      'Require x>1 from both original arguments. Combining gives x²=9, but only 3 survives. Substitute log₂2+log₂4=3; −3 violates the original domain.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H03-L05']
        .answers['H03-L05-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H03-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('completes eight unit questions with manual arguments and retains an independent check record', () => {
    const v = mount('/math/unit/H03/check');
    for (const [n, a] of [
      ['1', '1/64'],
      ['2', '8'],
      ['3', '64'],
      ['4', '3/2'],
      ['7', '3'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', a!);
      click(/Check answer/);
    }
    click('Question 5');
    enter(
      'Your reasoning',
      'Original domain x>1. Combining gives x²=9. Only 3 satisfies the original arguments, and log₂2+log₂4=3 verifies it.',
    );
    parent();
    click('Question 6');
    click(/^B log₂\(x²\)=2log₂\|x\|/);
    click(/Check answer/);
    click('Question 8');
    enter(
      'Your reasoning',
      'Day two is 20>11 and day three is 10≤11. Constant halving implies monotone decay; time is whole days. These are fictional assumptions, not a proven permanent real law.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H03/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H03-L01'],
    ).toBeUndefined();
  });
});
