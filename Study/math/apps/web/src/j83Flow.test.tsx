// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SystemLab, SystemHookArt } from './SystemLabs';
import { App } from './App';
import { j83Lessons } from './content/J83';
import { STORAGE_KEY } from './progress';
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const choose = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const verify = (name: string) =>
  fireEvent.click(
    within(screen.getByRole('group', { name })).getByRole('button', {
      name: 'Check my result',
    }),
  );
const feedback = (name: string) =>
  within(screen.getByRole('group', { name })).getByRole('status', {
    name: 'System feedback',
  }).textContent;
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const check = () => click(/Check answer/);
const name = 'My system conclusion';
describe('J83 simultaneous-relation and method workshops', () => {
  it('checks the same pair in both originals and labels finite samples without calling them the whole real set', () => {
    const v = render(<SystemLab kind="system-relations" mode="en" />);
    click('Check in both original equations');
    expect(
      screen.getByRole('status', { name: 'Simultaneous check' }).textContent,
    ).toContain('9 ≠ 11');
    enter('Candidate ordered pair', '(4,3)');
    click('Check in both original equations');
    expect(
      screen.getByRole('status', { name: 'Simultaneous check' }).textContent,
    ).toContain('same pair satisfies both');
    click('List sample integer pairs from the first relation');
    expect(v.container.querySelectorAll('[data-relation-pair]')).toHaveLength(
      10,
    );
    expect(
      v.container.querySelectorAll('[data-both-rows="true"]'),
    ).toHaveLength(1);
    enter(name, '(4,3)');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Relationship experiment', '1');
    expect(field(name)).toBe('');
    expect(v.container.querySelectorAll('[data-relation-pair]')).toHaveLength(
      0,
    );
    expect(
      screen.queryByRole('status', { name: 'Simultaneous check' }),
    ).toBeNull();
  });
  it('reveals whole-expression substitution step by step and preserves the task when only strategy changes', () => {
    const v = render(<SystemLab kind="system-substitute" mode="en" />);
    expect(
      v.container.querySelectorAll('[data-substitution-step]'),
    ).toHaveLength(0);
    click('Next justified substitution step');
    click('Next justified substitution step');
    expect(
      v.container.querySelector('[data-substitution-step="2"]')!.textContent,
    ).toContain('(−x + 7)');
    click('Next justified substitution step');
    expect(
      v.container.querySelector('[data-substitution-step="3"]')!.textContent,
    ).toContain('(1)x = 4');
    click('Next justified substitution step');
    expect(
      v.container.querySelector('[data-substitution-step="4"]')!.textContent,
    ).toContain('x=4');
    enter(name, '(4,3)');
    verify(name);
    choose('Variable isolated from the first equation', 'x');
    expect(field(name)).toBe('(4,3)');
    expect(feedback(name)).toContain('matches');
    expect(
      v.container.querySelectorAll('[data-substitution-step]'),
    ).toHaveLength(0);
    click('Next justified substitution step');
    click('Undo one step');
    expect(
      v.container.querySelectorAll('[data-substitution-step]'),
    ).toHaveLength(0);
  });
  it('handles exact fractional pairs, a retained identity and a contradiction without dividing by zero', () => {
    const v = render(<SystemLab kind="system-substitute" mode="en" />);
    choose('Substitution experiment', '1');
    enter(name, '(0.33,0.33)');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, '(1/3,1/3)');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Substitution experiment', '2');
    expect(field(name)).toBe('');
    for (let i = 0; i < 4; i++) click('Next justified substitution step');
    expect(
      v.container.querySelector('[data-substitution-step="4"]')!.textContent,
    ).toContain('first relation still applies');
    enter(name, 'all pairs');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, 'infinite');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Substitution experiment', '3');
    for (let i = 0; i < 4; i++) click('Next justified substitution step');
    expect(
      v.container.querySelector('[data-substitution-step="4"]')!.textContent,
    ).toContain('Do not divide by zero');
    enter(name, 'none');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('retains an original equation during elimination, rejects zero replacement and distinguishes unfinished strategy', () => {
    const v = render(<SystemLab kind="system-eliminate" mode="en" />);
    click('Check this row replacement');
    expect(
      v.container.querySelectorAll('[data-original-system-row]'),
    ).toHaveLength(2);
    expect(
      v.container.querySelectorAll('[data-replaced-system-row]'),
    ).toHaveLength(2);
    expect(
      v.container.querySelector('[data-replaced-system-row="0"]')!.textContent,
    ).toContain('3x = 12');
    expect(
      v.container.querySelector('[data-replaced-system-row="1"]')!.textContent,
    ).toContain('x - y = 1');
    enter(name, '(4,3)');
    verify(name);
    slide('First-row multiplier k1', '0');
    click('Check this row replacement');
    expect(
      screen.getByRole('status', { name: 'Elimination-step feedback' })
        .textContent,
    ).toContain('cannot guarantee equivalence');
    expect(
      v.container.querySelectorAll('[data-replaced-system-row]'),
    ).toHaveLength(0);
    expect(field(name)).toBe('(4,3)');
    slide('First-row multiplier k1', '1');
    slide('Second-row multiplier k2', '-1');
    click('Check this row replacement');
    expect(
      screen.getByRole('status', { name: 'Elimination-step feedback' })
        .textContent,
    ).toContain('equivalent, but y has not been eliminated');
    expect(
      v.container.querySelectorAll('[data-replaced-system-row]'),
    ).toHaveLength(2);
  });
  it('uses complete planned multipliers and retains the second relation in dependent and inconsistent cases', () => {
    const v = render(<SystemLab kind="system-eliminate" mode="en" />);
    choose('Elimination experiment', '1');
    click('Use planned y-cancelling multipliers');
    click('Check this row replacement');
    expect(
      v.container.querySelector('[data-replaced-system-row="0"]')!.textContent,
    ).toContain('13x = 26');
    enter(name, '(2,3)');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Elimination experiment', '2');
    expect(field(name)).toBe('');
    click('Use planned y-cancelling multipliers');
    click('Check this row replacement');
    expect(
      screen.getByRole('status', { name: 'Elimination-step feedback' })
        .textContent,
    ).toContain('still restricts pairs');
    enter(name, 'infinite');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Elimination experiment', '3');
    click('Use planned y-cancelling multipliers');
    click('Check this row replacement');
    expect(
      v.container.querySelector('[data-replaced-system-row="0"]')!.textContent,
    ).toContain('0 = -1');
    enter(name, 'none');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('preserves an exact off-window solution when changing only the view and plots it only inside', () => {
    const v = render(<SystemLab kind="system-graph" mode="en" />);
    choose('Graphical system', '4');
    enter(name, '(7,5)');
    verify(name);
    click('Show or hide the exact algebraic result');
    expect(
      screen.getByRole('status', { name: 'Graphical verification' })
        .textContent,
    ).toContain('outside the current window');
    expect(v.container.querySelectorAll('[data-plot-label="S"]')).toHaveLength(
      0,
    );
    const before = v.container
      .querySelector('[data-curve]')!
      .getAttribute('points');
    click('Change the viewing window');
    expect(field(name)).toBe('(7,5)');
    expect(feedback(name)).toContain('matches');
    expect(
      screen.getByRole('status', { name: 'Graphical verification' })
        .textContent,
    ).toContain('inside the current window');
    expect(
      v.container
        .querySelector('[data-plot-label="S"]')!
        .getAttribute('data-coordinate'),
    ).toBe('7,5');
    expect(
      v.container.querySelector('[data-curve]')!.getAttribute('points'),
    ).not.toBe(before);
  });
  it('draws coincident lines as solid and dashed rather than claiming every point is a solution', () => {
    const v = render(<SystemLab kind="system-graph" mode="en" />);
    choose('Graphical system', '1');
    enter(name, 'none');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Graphical system', '2');
    expect(field(name)).toBe('');
    const curves = [...v.container.querySelectorAll('[data-curve]')];
    expect(curves).toHaveLength(2);
    expect(curves[0]!.getAttribute('points')).toBe(
      curves[1]!.getAttribute('points'),
    );
    expect(curves[1]!.getAttribute('stroke-dasharray')).toBe('7 4');
    enter(name, 'all pairs');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, 'infinitely many solutions');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('supports vertical lines and verifies fractional graph intersections exactly', () => {
    const v = render(<SystemLab kind="system-graph" mode="en" />);
    choose('Graphical system', '3');
    const points = v.container
      .querySelector('[data-curve]')!
      .getAttribute('points')!
      .split(' ');
    expect(points[0]!.split(',')[0]).toBe(points[1]!.split(',')[0]);
    enter(name, '(2,3)');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Graphical system', '5');
    enter(name, '(1/2,1/2)');
    verify(name);
    expect(feedback(name)).toContain('matches');
    click('Show or hide the exact algebraic result');
    expect(
      v.container
        .querySelector('[data-plot-label="S"]')!
        .getAttribute('data-coordinate'),
    ).toBe('0.5,0.5');
  });
  it('requires both original quantity relationships instead of the final solved values in a model', () => {
    const v = render(<SystemLab kind="system-model" mode="en" />);
    const model = 'My original two equations';
    expect(
      v.container.querySelectorAll('[data-original-system-row]'),
    ).toHaveLength(0);
    enter(model, 'x=4;y=3');
    verify(model);
    expect(feedback(model)).toContain('original quantity relationships');
    enter(model, '3y+5x=29;2x+2y=14');
    verify(model);
    expect(feedback(model)).toContain('matches');
    click('Show or hide the original relationships');
    expect(
      v.container.querySelectorAll('[data-original-system-row]'),
    ).toHaveLength(2);
    enter('Pair for the context audit', '(4,3)');
    click('Audit equations, units and context');
    expect(
      screen.getByRole('status', { name: 'Context audit' }).textContent,
    ).toContain('Allowed in this context');
  });
  it('separates an algebraic fractional ticket solution from an allowed fractional litre solution', () => {
    render(<SystemLab kind="system-model" mode="en" />);
    choose('Fictional context', 'fractional-tickets');
    click('Try the fractional algebraic pair');
    click('Audit equations, units and context');
    expect(
      screen.getByRole('status', { name: 'Context audit' }).textContent,
    ).toContain('Equations both pass');
    expect(
      screen.getByRole('status', { name: 'Context audit' }).textContent,
    ).toContain('not allowed here');
    choose('Fictional context', 'juice');
    expect(field('Pair for the context audit')).toBe('');
    expect(screen.queryByRole('status', { name: 'Context audit' })).toBeNull();
    click('Try the fractional algebraic pair');
    click('Audit equations, units and context');
    expect(
      screen.getByRole('status', { name: 'Context audit' }).textContent,
    ).toContain('Allowed in this context');
    expect(
      screen.getByRole('status', { name: 'Context audit' }).textContent,
    ).toContain('units are L');
  });
  it('keeps the five opening investigations as questions', () => {
    for (const l of j83Lessons) {
      const v = render(
        <SystemHookArt
          kind={l.lab as Parameters<typeof SystemHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J83 complete lesson and persistence flows', () => {
  it('renders all five English bodies and both bilingual sections with two complete examples each', () => {
    for (const l of j83Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J83-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores supported retries for all five lessons without completing unfinished practice', () => {
    for (const [id, wrong, right] of [
      ['J83-L01', '(2,5)', '(4,3)'],
      ['J83-L02', '(3,4)', '(4,3)'],
      ['J83-L03', '(4,1)', '(4,3)'],
      ['J83-L04', '(2,3)', '(3,2)'],
      ['J83-L05', 'x=4;y=3', 'x+y=7;5x+3y=29'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/04 Together/);
      enter('Your answer', wrong!);
      check();
      enter('Your answer', right!);
      check();
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(right);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('distinguishes a matching solved pair from a requested original model and restores scaled/reordered equations', () => {
    const v = mount('/math/lesson/J83-L01');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', 'x=5;y=3');
    check();
    expect(
      screen.getByText(
        '↳ The solution set matches; retain both original quantity relationships.',
      ),
    ).toBeTruthy();
    enter('Your answer', '3x-3y=6;2x+2y=16');
    check();
    v.unmount();
    mount('/math/lesson/J83-L01');
    expect(field('Your answer')).toBe('3x-3y=6;2x+2y=16');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('rejects truncated fractions and restores the entered exact coordinate representation', () => {
    const v = mount('/math/lesson/J83-L02');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '(0.33,0.33)');
    check();
    enter('Your answer', '（2/6，1/3）');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J83-L02');
    expect(field('Your answer')).toBe('（2/6，1/3）');
  });
  it('requires infinitely many solutions rather than all pairs for coincident-line formal tasks', () => {
    const v = mount('/math/lesson/J83-L04');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', 'all pairs');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', 'infinitely many solutions');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J83-L04');
    expect(field('Your answer')).toBe('infinitely many solutions');
  });
  it('keeps method and context explanations human-reviewed without completing unworked lessons', () => {
    mount('/math/lesson/J83-L05');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Both original equations use the same quantities and matching units. The unique algebraic pair is 9/2,5/2. It satisfies both relationships but fails the integer ticket domain; continuous litres allow it. Rounding changes the cost. A model must retain total quantity and weighted cost, not merely final solved values.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J83-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves eight independent unit-check records across pairs, model, classes and parent reasoning', () => {
    const v = mount('/math/unit/J83/check');
    for (const [n, input] of Object.entries({
      1: '(5,4)',
      2: 'x+y=6;4x+2y=18',
      3: '(3,1)',
      4: 'none',
      5: 'infinite',
      6: '(3/2,7/2)',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Use the same pair in both originals. Substitute whole expressions or retain one row during reversible elimination. Intersections, distinct parallels and coincident lines give different shared sets. An unseen intersection may lie outside a window. Check units and the count or continuous domain separately; a unique algebraic pair can fail the context.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J83/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J83-L05'],
    ).toBeUndefined();
  });
  it('changes exact retrieval pairs and clears preceding input and success evidence', () => {
    const v = mount('/math/lesson/J83-L02');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '(1,0)');
    check();
    enter('Your answer', '(1/3,1/3)');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '(-3,7)');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J83-L02'].round).toBe(1);
    saved.sessions['J83-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '(-1,3)');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
