// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CircularLab, CircularHookArt } from './CircularLabs';
import { WavePlot } from './CircularVisuals';
import { h04Lessons } from './content/H04';
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
const slide = (value: string) =>
  fireEvent.change(screen.getByRole('slider', { name: 'Directed angle' }), {
    target: { value },
  });
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const check = (name: string) => click(`Check: ${name}`);
const feedback = (name: string) =>
  screen.getByRole('status', { name: `${name} feedback` }).textContent;
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
describe('H04 accessible experiments, complete sets and persisted evidence', () => {
  it('preserves angle conversion across radius changes but recomputes nonnegative travelled arc length', () => {
    const v = render(<CircularLab kind="circular-radians" mode="en" />);
    enter('Predict radians (use pi)', '5pi/6');
    check('Predict radians (use pi)');
    expect(feedback('Predict radians (use pi)')).toContain('matches');
    enter('Predict travelled arc length (cm, use pi)', '5pi/3 cm');
    check('Predict travelled arc length (cm, use pi)');
    expect(feedback('Predict travelled arc length (cm, use pi)')).toContain(
      'matches',
    );
    const r = Number(v.container.querySelector('circle')?.getAttribute('r'));
    const origin = Number(
      v.container.querySelector('circle')?.getAttribute('cx'),
    );
    expect(
      Number(
        v.container
          .querySelector('polyline')
          ?.getAttribute('points')
          ?.split(' ')[0]
          ?.split(',')[0],
      ),
    ).toBe(origin + r);
    select('Radius in cm', '3');
    expect(field('Predict radians (use pi)')).toBe('5pi/6');
    expect(field('Predict travelled arc length (cm, use pi)')).toBe('');
    expect(Number(v.container.querySelector('circle')?.getAttribute('r'))).toBe(
      r * 1.5,
    );
    select('Angle in degrees', '-450');
    enter('Predict radians (use pi)', '-pi/2');
    check('Predict radians (use pi)');
    expect(feedback('Predict radians (use pi)')).not.toContain('matches');
    click('Reveal derivation');
    expect(screen.getByText('θ=-5pi/2 rad.')).toBeTruthy();
    enter('Predict radians (use pi)', '-5pi/2');
    check('Predict radians (use pi)');
    expect(feedback('Predict radians (use pi)')).toContain('matches');
    enter('Predict travelled arc length (cm, use pi)', '15pi/2');
    check('Predict travelled arc length (cm, use pi)');
    expect(feedback('Predict travelled arc length (cm, use pi)')).toContain(
      'matches',
    );
  });
  it('uses signed unit coordinates and gives undefined rather than a huge finite tangent value', () => {
    render(<CircularLab kind="circular-unit" mode="en" />);
    enter('Predict cosθ', '-1/2');
    check('Predict cosθ');
    expect(feedback('Predict cosθ')).toContain('matches');
    slide('6');
    expect(field('Predict cosθ')).toBe('');
    enter('Predict tanθ', '0');
    check('Predict tanθ');
    expect(feedback('Predict tanθ')).not.toContain('matches');
    enter('Predict tanθ', 'undefined');
    check('Predict tanθ');
    expect(feedback('Predict tanθ')).toContain('matches');
    slide('15');
    enter('Predict sinθ', '-sqrt(2)/2');
    check('Predict sinθ');
    expect(feedback('Predict sinθ')).toContain('matches');
    click('Show/hide exact comparison');
    expect(field('Predict sinθ')).toBe('-sqrt(2)/2');
  });
  it('links the same radian input to circle and graph and retains prediction across view changes', () => {
    const v = render(<CircularLab kind="circular-graphs" mode="en" />);
    enter('Predict sinθ', '1');
    check('Predict sinθ');
    expect(feedback('Predict sinθ')).toContain('matches');
    expect(
      v.container
        .querySelector('[data-circular-query]')
        ?.getAttribute('data-circular-query'),
    ).toBe('0.5');
    expect(v.container.querySelectorAll('[data-circular-curve]')).toHaveLength(
      2,
    );
    click('Change vertical window');
    click('Show/hide exact comparison');
    expect(field('Predict sinθ')).toBe('1');
    select('Read function', 'cos');
    enter('Predict cosθ', '0');
    check('Predict cosθ');
    expect(feedback('Predict cosθ')).toContain('matches');
  });
  it('separates amplitude, period and point dependencies and handles reflection and the constant case', () => {
    render(<CircularLab kind="circular-transform" mode="en" />);
    enter('Predict amplitude', '2');
    enter('Predict least positive period (constant: undefined)', 'pi');
    enter('Predict current output', '1');
    select('Midline D', '2');
    expect(field('Predict amplitude')).toBe('2');
    expect(field('Predict least positive period (constant: undefined)')).toBe(
      'pi',
    );
    expect(field('Predict current output')).toBe('');
    select('External scale A', '0');
    enter('Predict least positive period (constant: undefined)', 'undefined');
    check('Predict least positive period (constant: undefined)');
    expect(
      feedback('Predict least positive period (constant: undefined)'),
    ).toContain('matches');
    select('External scale A', '-2');
    select('Midline D', '1');
    select('Stated h (coefficient of pi)', '0');
    select('Inner scale B', '-2');
    enter('Predict current output', '3');
    check('Predict current output');
    expect(feedback('Predict current output')).toContain('matches');
    enter('Predict least positive period (constant: undefined)', 'pi');
    select('Query x (coefficient of pi)', '1/2');
    expect(field('Predict least positive period (constant: undefined)')).toBe(
      'pi',
    );
    click('Change vertical window');
    expect(field('Predict least positive period (constant: undefined)')).toBe(
      'pi',
    );
  });
  it('requires the requested identity form and keeps the quadrant sign question independent', () => {
    render(<CircularLab kind="circular-identities" mode="en" />);
    enter('Predict equivalent form', '1-s^2');
    check('Predict equivalent form');
    expect(feedback('Predict equivalent form')).not.toContain('matches');
    enter('Predict equivalent form', 'c^2');
    check('Predict equivalent form');
    expect(feedback('Predict equivalent form')).toContain('matches');
    enter('Predict signed cosθ', '-4/5');
    check('Predict signed cosθ');
    expect(feedback('Predict signed cosθ')).toContain('matches');
    select('Given sinθ=3/5, choose quadrant', 'I');
    expect(field('Predict equivalent form')).toBe('c^2');
    expect(field('Predict signed cosθ')).toBe('');
    enter('Predict signed cosθ', '4/5');
    check('Predict signed cosθ');
    expect(feedback('Predict signed cosθ')).toContain('matches');
    click('Show/hide proof and conditions');
    expect(screen.getByText(/Dividing by cos²θ/)).toBeTruthy();
    expect(field('Predict equivalent form')).toBe('c^2');
  });
  it('rejects a principal-value-only answer and retains complete roots across diagram changes', () => {
    const v = render(<CircularLab kind="circular-equations" mode="en" />),
      name = 'Predict all angles (e.g. {pi/6,5pi/6})';
    enter(name, '{pi/6}');
    check(name);
    expect(feedback(name)).not.toContain('matches');
    enter(name, '{5pi/6,pi/6}');
    check(name);
    expect(feedback(name)).toContain('matches');
    click('Show/hide intersection audit');
    expect(v.container.querySelectorAll('[data-circular-root]')).toHaveLength(
      2,
    );
    click('Change vertical window');
    expect(field(name)).toBe('{5pi/6,pi/6}');
    select('Inner multiplier', '2');
    expect(field(name)).toBe('');
    enter(name, '{pi/12,5pi/12,13pi/12,17pi/12}');
    check(name);
    expect(feedback(name)).toContain('matches');
    click('Show/hide intersection audit');
    expect(v.container.querySelectorAll('[data-circular-root]')).toHaveLength(
      4,
    );
  });
  it('changes endpoint ownership exactly and accepts an empty set only for an impossible target', () => {
    const v = render(<CircularLab kind="circular-equations" mode="en" />),
      name = 'Predict all angles (e.g. {pi/6,5pi/6})';
    select('Target value', '0');
    enter(name, '{0,pi}');
    check(name);
    expect(feedback(name)).toContain('matches');
    select('Original solution interval', 'closed');
    enter(name, '{0,pi,2pi}');
    check(name);
    expect(feedback(name)).toContain('matches');
    select('Original solution interval', 'open-left');
    enter(name, '{pi,2pi}');
    check(name);
    expect(feedback(name)).toContain('matches');
    click('Show/hide intersection audit');
    expect(
      v.container
        .querySelector('[data-circular-end="0"]')
        ?.getAttribute('data-closed'),
    ).toBe('false');
    expect(
      v.container
        .querySelector('[data-circular-end="2"]')
        ?.getAttribute('data-closed'),
    ).toBe('true');
    select('Target value', '2');
    enter(name, '∅');
    check(name);
    expect(feedback(name)).toContain('matches');
    click('Show/hide intersection audit');
    expect(v.container.querySelectorAll('[data-circular-root]')).toHaveLength(
      0,
    );
  });
  it('breaks tangent curves at both poles and never paints a zero-denominator endpoint', () => {
    const v = render(<CircularLab kind="circular-equations" mode="en" />),
      name = 'Predict all angles (e.g. {pi/6,5pi/6})';
    select('Equation function', 'tan');
    enter(name, '{pi/4,5pi/4}');
    check(name);
    expect(feedback(name)).toContain('matches');
    click('Show/hide intersection audit');
    const path =
      v.container
        .querySelector('[data-circular-curve="tan"]')
        ?.getAttribute('d') ?? '';
    expect(path.match(/M/g) ?? []).toHaveLength(3);
    expect(path).not.toMatch(/NaN|Infinity/);
    expect(v.container.querySelector('foreignObject')).toBeNull();
    v.unmount();
    const p = render(
      <WavePlot
        mode="en"
        family="tan"
        domain={{ low: 0.5, high: 1.5, lowClosed: true, highClosed: true }}
      />,
    );
    expect(p.container.querySelectorAll('[data-circular-end]')).toHaveLength(0);
  });
  it('reports an off-window query without flattening it or changing its value', () => {
    const v = render(
      <WavePlot mode="en" family="sin" a={3} d={2} query={0.5} />,
    );
    expect(screen.getByRole('status').textContent).toContain(
      'outside the vertical window',
    );
    expect(v.container.querySelector('[data-circular-query]')).toBeNull();
    v.rerender(
      <WavePlot mode="en" family="sin" a={3} d={2} query={0.5} wide />,
    );
    expect(screen.queryByRole('status')).toBeNull();
    expect(v.container.querySelector('[data-circular-query]')).toBeTruthy();
  });
  it('renders six real bilingual bodies and native SVG hooks with no foreignObject', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const l of h04Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 .*Understand/);
      for (const lang of ['zh', 'en'])
        expect(
          v.container.querySelectorAll(
            `.math-prose section[lang="${lang}"] h3`,
          ),
        ).toHaveLength(2);
      v.unmount();
      const w = render(
        <CircularHookArt
          kind={l.lab as Parameters<typeof CircularHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(w.container.querySelector('svg')).toBeTruthy();
      expect(w.container.querySelector('foreignObject')).toBeNull();
      w.unmount();
    }
  });
  it('saves and restores exact corrected answers across all six lessons without completing unfinished practice', () => {
    for (const [id, a] of [
      ['H04-L01', '5pi/6'],
      ['H04-L02', '-1/2'],
      ['H04-L03', '-1'],
      ['H04-L04', '2'],
      ['H04-L05', 's^2'],
      ['H04-L06', '{pi/6,5pi/6}'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '999');
      click(/Check answer/);
      enter('Your answer', a!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(a);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('leaves domain explanations ungraded until reviewed and preserves their original writing', () => {
    const v = mount('/math/lesson/H04-L05');
    click(/^06 Reflect/);
    const text =
      'At θ=π cosine is −1 while the principal root is one. The correct identity gives |cosθ|, and the quadrant determines its sign. Squaring alone cannot recover it.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H04-L05']
        .answers['H04-L05-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H04-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records eight independent unit answers including two reviewed arguments and restores the final item', () => {
    const v = mount('/math/unit/H04/check');
    for (const [n, a] of [
      ['1', '-5pi/2'],
      ['2', '-sqrt(2)/2'],
      ['3', '{0,pi,2pi}'],
      ['4', 'pi'],
      ['5', '1'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', a!);
      click(/Check answer/);
    }
    click('Question 6');
    click(/^C There is no least positive period/);
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'The numerator is sin²θ, but the original denominator excludes sinθ=0, or θ=kπ. The quotient is one only on that domain; θ=0 is 0/0 and cannot be added back.',
    );
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Let u=x−π/4 in [−π/4,7π/4). The two periodic branches of sin u=1/2 give x=5π/12 and 13π/12 in the original interval. Both substitute to two; all other repetitions are excluded.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H04/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H04-L01'],
    ).toBeUndefined();
  });
  it('generates the next radian retrieval without carrying old input or success forward', () => {
    const v = mount('/math/lesson/H04-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '-135°');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '-2pi/3');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H04-L01'].round).toBe(1);
    saved.sessions['H04-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '-7pi/12');
    click(/Check answer/);
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
