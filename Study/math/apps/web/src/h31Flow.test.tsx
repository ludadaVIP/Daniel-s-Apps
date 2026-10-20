// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OptimisationLab, OptimisationHookArt } from './OptimisationLabs';
import { h31Lessons } from './content/H31';
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
const check = (name: string) => click(`Check: ${name}`);
const matched = (name: string) =>
  expect(
    screen.getByRole('status', { name: `${name} feedback` }).textContent,
  ).toContain('matches');
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
describe('H31 investigations and preserved mathematical evidence', () => {
  it('preserves an unchanged point slope while updating the derivative task and toggling a tangent', () => {
    render(<OptimisationLab kind="optimisation-review" mode="en" />);
    const d = 'Predict derivative function',
      s = 'Predict slope at zero';
    enter(d, 'exp(x)+9x^2-2');
    check(d);
    matched(d);
    enter(s, '-1');
    check(s);
    matched(s);
    click('Show/hide tangent at zero');
    expect(field(d)).toBe('exp(x)+9x^2-2');
    select('Function', 'negative');
    expect(field(d)).toBe('');
    expect(field(s)).toBe('-1');
    enter(d, '-exp(-x)');
    check(d);
    matched(d);
    select('Function', 'base');
    enter(d, '2^x*ln(2)');
    check(d);
    matched(d);
    enter(s, 'ln(2)');
    check(s);
    matched(s);
    click('Show/hide audit');
    expect(screen.getByText(/slope at zero ln/)).toBeTruthy();
  });
  it('applies radian inner factors, cosine signs and undefined tangent points without changing unchanged slopes', () => {
    const v = render(<OptimisationLab kind="optimisation-trig" mode="en" />),
      d = 'Predict derivative function',
      s = 'Predict selected slope (or undefined)';
    enter(d, 'cos(2x)+cos(2*x)');
    check(d);
    matched(d);
    enter(s, '2');
    check(s);
    matched(s);
    select('Input x (multiples of π/2)', '1');
    expect(field(d)).toBe('cos(2x)+cos(2*x)');
    expect(field(s)).toBe('');
    enter(s, '-2');
    check(s);
    matched(s);
    select('Trig function', 'tan');
    select('Inner coefficient k', '1');
    enter(s, 'undefined');
    check(s);
    matched(s);
    expect(v.container.querySelectorAll('polyline').length).toBeGreaterThan(1);
    select('Inner coefficient k', '2');
    enter(s, '2');
    check(s);
    matched(s);
  });
  it('checks curve membership before regular slopes and distinguishes vertical and singular inputs', () => {
    render(<OptimisationLab kind="optimisation-implicit" mode="en" />);
    const n = 'Predict slope or point status';
    enter(n, '-0.75');
    check(n);
    matched(n);
    select('Point to audit', '5,0');
    expect(field(n)).toBe('');
    enter(n, 'vertical');
    check(n);
    matched(n);
    select('Implicit curve', 'cross');
    select('Point to audit', '0,0');
    enter(n, 'singular');
    check(n);
    matched(n);
    select('Implicit curve', 'circle');
    select('Point to audit', '3,3');
    enter(n, 'off-curve');
    check(n);
    matched(n);
    click('Show/hide audit');
    expect(screen.getByText('off-curve')).toBeTruthy();
  });
  it('retains all global ties and treats open endpoint bounds differently from attained extrema', () => {
    render(<OptimisationLab kind="optimisation-extrema" mode="en" />);
    const n = 'Predict minimum value (or not-attained)',
      p = 'Predict all maximum locations (or not-attained)';
    enter(n, '-2');
    check(n);
    matched(n);
    enter(p, '{2,-1}');
    check(p);
    matched(p);
    select('Extrema function', 'square');
    select('Input interval', 'open');
    enter(n, 'not-attained');
    enter(p, 'not-attained');
    check(n);
    check(p);
    matched(n);
    matched(p);
    select('Input interval', 'half');
    expect(field(n)).toBe('');
    expect(field(p)).toBe('not-attained');
    enter(n, '0');
    check(n);
    matched(n);
    select('Extrema function', 'corner');
    select('Input interval', 'closed');
    expect(field(n)).toBe('0');
    click('Show/hide audit');
    expect(screen.getByText('Nondifferentiable')).toBeTruthy();
  });
  it('rejects infeasible stationary points, retains both integer optima and separates an empty domain', () => {
    const v = render(<OptimisationLab kind="optimisation-fence" mode="en" />),
      x = 'Predict all optimal depths (or empty-domain)',
      a = 'Predict maximum area (or empty-domain)';
    enter(x, '{4}');
    enter(a, '64');
    check(x);
    check(a);
    matched(x);
    matched(a);
    click('Show/hide audit');
    expect(
      v.container
        .querySelector('[data-fence-best="4"]')
        ?.getAttribute('data-area'),
    ).toBe('64');
    select('Total fence L', '22');
    select('Depth cap c', '9');
    select('Length domain', 'integer');
    enter(x, '{6,5}');
    enter(a, '60');
    check(x);
    check(a);
    matched(x);
    matched(a);
    expect(v.container.querySelectorAll('[data-fence-best]')).toHaveLength(2);
    expect(v.container.querySelectorAll('[data-fence-candidate]')).toHaveLength(
      9,
    );
    select('Depth cap c', '0');
    enter(x, 'empty-domain');
    enter(a, 'empty-domain');
    check(x);
    check(a);
    matched(x);
    matched(a);
    expect(v.container.querySelectorAll('[data-fence-best]')).toHaveLength(0);
  });
  it('preserves changes under origin translation and view switching while differentiating signed velocity from speed', () => {
    const v = render(<OptimisationLab kind="optimisation-motion" mode="en" />),
      vel = 'Predict selected signed velocity',
      speed = 'Predict selected speed',
      dist = 'Predict total distance over0–4 s',
      state = 'Predict speed-change code';
    for (const [name, answer] of [
      [vel, '-3'],
      [speed, '3'],
      [dist, '12'],
      [state, 'neither'],
    ]) {
      enter(name!, answer!);
      check(name!);
      matched(name!);
    }
    select('Position shift d (m)', '10');
    select('Plotted quantity', 'velocity');
    expect(field(vel)).toBe('-3');
    expect(field(dist)).toBe('12');
    expect(
      v.container
        .querySelector('[data-motion-time="2"]')
        ?.getAttribute('data-motion-value'),
    ).toBe('-3');
    select('Position scale c', '-1');
    expect(field(vel)).toBe('');
    expect(field(speed)).toBe('3');
    expect(field(dist)).toBe('12');
    enter(vel, '3');
    check(vel);
    matched(vel);
    select('Selected time (s)', '1');
    enter(state, 'instant-rest');
    check(state);
    matched(state);
    expect(field(dist)).toBe('12');
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Distance segment audit' }),
    ).toBeTruthy();
  });
  it('renders six meaningful hooks and both examples on every actual reading route', () => {
    for (const l of h31Lessons) {
      const art = render(
        <OptimisationHookArt
          kind={l.lab as Parameters<typeof OptimisationHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores six supported guided answers without completing unfinished lessons', () => {
    for (const [id, answer] of [
      ['H31-L01', 'exp(x)+9x^2-2'],
      ['H31-L02', '3*(cos(2x)+cos(2*x))'],
      ['H31-L03', '-0.75'],
      ['H31-L04', '{2,-1}'],
      ['H31-L05', '4'],
      ['H31-L06', '12'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '999');
      click(/Check answer/);
      enter('Your answer', answer!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(answer);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('requires human review of the fence argument and restores original writing after refresh', () => {
    const v = mount('/math/lesson/H31-L05');
    click(/^06 Reflect/);
    const text =
      'Engineering review example: Fence two depths and one width,2x+y=24; positive sides and cap four give0<x≤4. Area24x−2x² has positive derivative throughout, so x4,y16,area64 wins; stationary six is infeasible. With L22 and integer sides,5 and6 both yield area60 by equal squared distance from5.5. Keep both, report units and no joining losses. A cap zero is an empty domain, not a feasible zero-area optimum.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H31-L05']
        .answers['H31-L05-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H31-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records eight unit items with separate fence and motion arguments independently of lesson mastery', () => {
    const v = mount('/math/unit/H31/check');
    ['exp(x)+9x^2-2', '6cos(2x)', '-3/4', '{2,-1}', '4', '12'].forEach(
      (answer, i) => {
        click(`Question ${i + 1}`);
        enter('Your answer', answer);
        click(/Check answer/);
      },
    );
    click('Question 7');
    enter(
      'Your reasoning',
      'Engineering review example: Use2x+y=L with positive sides and x≤c. For L24,c4, the feasible domain0<x≤4 lies left of stationary six, so area grows to64 at x4,y16. At L22 whole metres, five and six tie at area60; the completed square proves farther feasible integers do worse. An empty cap domain has no feasible rectangle. State metres, square metres and the no-loss assumption.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Engineering review example: v=3(t−1)(t−3),a=6t−12. Velocity changes sign at one and three, with positions0,4,0,4. Distance twelve differs from displacement four, giving average speed three and average velocity one. At two, v−3,a0 does not mean constant speed on an interval. Nonzero v,a signs determine speeding versus slowing. Shifting position ten leaves derivatives and travel unchanged.',
    );
    expect(screen.getByText(/Recorded 7\/8/)).toBeTruthy();
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H31/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H31-L01'],
    ).toBeUndefined();
  });
  it('changes a due derivative retrieval without inheriting its old expression or success', () => {
    const v = mount('/math/lesson/H31-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '10exp(2x)');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '3x^2+2exp(2x)');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H31-L01'].round).toBe(1);
    saved.sessions['H31-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '3x^2+2exp(2x)');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '6x^2+2exp(2x)');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
