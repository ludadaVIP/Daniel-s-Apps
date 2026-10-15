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
import { CartesianLab, CartesianHookArt } from './CartesianLabs';
import { CartesianPlot } from './CartesianVisuals';
import { App } from './App';
import { j75Lessons } from './content/J75';
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
    name: 'Coordinate feedback',
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
describe('J75 scaled coordinate workshops', () => {
  it('preserves a coordinate answer while changing only the viewing range and distinguishes axes from quadrants', () => {
    const v = render(<CartesianLab kind="cart-plane" mode="en" />);
    const point = () => v.container.querySelector('[data-plot-label="P"]')!;
    const old = point().querySelector('circle')!.getAttribute('cx');
    enter('My reading of P', '(3,-2)');
    verify('My reading of P');
    click('Change only the horizontal viewing range');
    expect(field('My reading of P')).toBe('(3,-2)');
    expect(feedback('My reading of P')).toContain('matches');
    expect(point().getAttribute('data-coordinate')).toBe('3,-2');
    expect(point().querySelector('circle')!.getAttribute('cx')).not.toBe(old);
    slide('Horizontal coordinate x', '0');
    expect(field('My reading of P')).toBe('');
    expect(screen.getByText('On the y-axis; not in a quadrant')).toBeTruthy();
    slide('Vertical coordinate y', '0');
    expect(screen.getByText('Origin; not in any quadrant')).toBeTruthy();
  });
  it('uses each labelled tick value when mapping points with different horizontal and vertical intervals', () => {
    const v = render(
      <CartesianPlot
        mode="en"
        bounds={{ xMin: -8, xMax: 8, yMin: -4, yMax: 4, xStep: 2, yStep: 1 }}
        points={[{ x: -6, y: 2, label: 'A' }]}
      />,
    );
    const p = v.container.querySelector('[data-plot-label="A"] circle')!;
    expect(Number(p.getAttribute('cx'))).toBe(114);
    expect(Number(p.getAttribute('cy'))).toBe(100);
    expect(v.container.querySelectorAll('[data-x-tick]')).toHaveLength(9);
    expect(v.container.querySelectorAll('[data-y-tick]')).toHaveLength(9);
  });
  it('checks a constructed plot position, resets a new task and supports keyboard half-unit moves', () => {
    const v = render(<CartesianLab kind="cart-plot" mode="en" />);
    click('Plot at (3, -2)');
    click('Check plotted position');
    expect(
      screen.getByRole('status', { name: 'Plotting feedback' }).textContent,
    ).toContain('Recheck');
    click('Plot at (-2, 3)');
    click('Check plotted position');
    expect(
      screen.getByRole('status', { name: 'Plotting feedback' }).textContent,
    ).toContain('matches');
    choose('Plotting task', '1');
    expect(
      v.container
        .querySelector('[data-candidate-coordinate]')!
        .getAttribute('data-candidate-coordinate'),
    ).toBe('0,0');
    expect(
      screen.queryByRole('status', { name: 'Plotting feedback' }),
    ).toBeNull();
    const board = screen.getByRole('group', {
      name: 'Plotting board: arrow keys move the candidate',
    });
    vi.mocked(Element.prototype.scrollIntoView).mockClear();
    for (let i = 0; i < 3; i++) fireEvent.keyDown(board, { key: 'ArrowRight' });
    fireEvent.keyDown(board, { key: 'ArrowDown' });
    expect(
      v.container
        .querySelector('[data-candidate-coordinate]')!
        .getAttribute('data-candidate-coordinate'),
    ).toBe('1.5,-0.5');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });
    click('Check plotted position');
    expect(
      screen.getByRole('status', { name: 'Plotting feedback' }).textContent,
    ).toContain('matches');
    enter('The ordered pair at that point', '（3/2，−1/2）');
    verify('The ordered pair at that point');
    expect(feedback('The ordered pair at that point')).toContain('matches');
  });
  it('clamps keyboard movement to the plotting window and correctly places an axis point', () => {
    const v = render(<CartesianLab kind="cart-plot" mode="en" />);
    choose('Plotting task', '2');
    const board = screen.getByRole('group', {
      name: 'Plotting board: arrow keys move the candidate',
    });
    for (let i = 0; i < 3; i++) fireEvent.keyDown(board, { key: 'ArrowDown' });
    click('Check plotted position');
    expect(
      screen.getByRole('status', { name: 'Plotting feedback' }).textContent,
    ).toContain('matches');
    for (let i = 0; i < 20; i++) fireEvent.keyDown(board, { key: 'ArrowLeft' });
    expect(
      v.container
        .querySelector('[data-candidate-coordinate]')!
        .getAttribute('data-candidate-coordinate'),
    ).toBe('-5,-3');
  });
  it('generates same-row points and connects only a supplied continuous rule, not integer count inputs', () => {
    const v = render(<CartesianLab kind="cart-table" mode="en" />);
    expect(within(screen.getByRole('table')).getByText('?')).toBeTruthy();
    enter('Last-row y', '7');
    verify('Last-row y');
    expect(feedback('Last-row y')).toContain('matches');
    click('Show or hide the graph');
    expect(v.container.querySelectorAll('[data-coordinate]')).toHaveLength(4);
    expect(v.container.querySelector('[data-coordinate="2,5"]')).toBeTruthy();
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(1);
    choose('Input type', 'count');
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(0);
    expect(field('Last-row y')).toBe('');
    click('Show or hide the graph');
    expect(v.container.querySelectorAll('[data-coordinate]')).toHaveLength(4);
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(0);
    expect(screen.getByText(/Integer counts are discrete points/)).toBeTruthy();
    slide('Supplied change per unit k', '-1');
    expect(v.container.querySelectorAll('[data-coordinate]')).toHaveLength(0);
    enter('Last-row y', '-2');
    verify('Last-row y');
    expect(feedback('Last-row y')).toContain('matches');
  });
  it('requires a general affine expression, including a zero-rate constant, rather than one output', () => {
    render(<CartesianLab kind="cart-linear" mode="en" />);
    const name = 'General expression after y= (omit the equal sign)';
    enter(name, '7');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, '2(x+1.5)');
    verify(name);
    expect(feedback(name)).toContain('matches');
    slide('Change per unit k', '0');
    expect(field(name)).toBe('');
    enter(name, '3');
    verify(name);
    expect(feedback(name)).toContain('matches');
    slide('Initial value b', '0');
    enter(name, '0');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('reveals a counterexample after two matching samples and plots only the two explicitly supplied models', () => {
    const v = render(<CartesianLab kind="cart-linear" mode="en" />);
    choose('Relationship investigation', 'trap');
    expect(v.container.querySelectorAll('[data-coordinate]')).toHaveLength(2);
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(0);
    click('Test x=2');
    expect(screen.getByRole('status').textContent).toContain(
      'line gives 2 and the square gives 4',
    );
    expect(v.container.querySelector('[data-coordinate="2,2"]')).toBeTruthy();
    expect(v.container.querySelector('[data-coordinate="2,4"]')).toBeTruthy();
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(2);
  });
  it('stops the water graph at empty and distinguishes an invalid prediction from an equation having no solution', () => {
    const v = render(<CartesianLab kind="cart-context" mode="en" />);
    enter('Context output for this input', '8 L');
    verify('Context output for this input');
    expect(feedback('Context output for this input')).toContain('matches');
    slide('Input to inspect', '6');
    enter('Context output for this input', '0');
    verify('Context output for this input');
    expect(feedback('Context output for this input')).toContain('matches');
    const points = v.container
      .querySelector('[data-curve="water"]')!
      .getAttribute('points')!;
    expect(points).toContain('364,310');
    slide('Input to inspect', '7');
    expect(
      screen.queryByRole('textbox', { name: 'Context output for this input' }),
    ).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Model domain' }).textContent,
    ).toContain('extension gives -2');
    expect(
      screen.getByRole('status', { name: 'Model domain' }).textContent,
    ).toContain('differs from an equation');
    expect(
      v.container.querySelector('[data-curve="water"]')!.getAttribute('points'),
    ).toBe(points);
  });
  it('keeps card counts discrete with one fixed fee and switches units and domain for negative Celsius', () => {
    const v = render(<CartesianLab kind="cart-context" mode="en" />);
    choose('Fictional model', 'cards');
    expect(v.container.querySelectorAll('[data-coordinate]')).toHaveLength(7);
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(0);
    slide('Input to inspect', '2.5');
    expect(screen.getByRole('status', { name: 'Model domain' })).toBeTruthy();
    slide('Input to inspect', '0');
    enter('Context output for this input', '5 NZD');
    verify('Context output for this input');
    expect(feedback('Context output for this input')).toContain('matches');
    choose('Fictional model', 'temperature');
    expect(field('Context output for this input')).toBe('');
    enter('Context output for this input', '-1°C');
    verify('Context output for this input');
    expect(feedback('Context output for this input')).toContain('matches');
    expect(v.container.textContent).toContain('t (h)');
    expect(v.container.textContent).toContain('T (°C)');
  });
  it('keeps every opening as a question without a solved answer', () => {
    for (const l of j75Lessons) {
      const v = render(
        <CartesianHookArt
          kind={l.lab as Parameters<typeof CartesianHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J75 complete lesson and record flows', () => {
  it('renders all five English bodies with two complete examples and both languages in bilingual mode', () => {
    for (const l of j75Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J75-L05');
    click(/03/);
    expect(
      v.container.querySelectorAll('.math-prose section[lang="zh"] h3'),
    ).toHaveLength(2);
    expect(
      v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
    ).toHaveLength(2);
  });
  it('restores ordered coordinates and exact scalar outputs after retries, without completing unfinished lessons', () => {
    for (const [id, wrong, right] of [
      ['J75-L01', '(-2,3)', '(3,-2)'],
      ['J75-L02', '(3,-2)', '(-2,3)'],
      ['J75-L03', '(5,2)', '(2,5)'],
      ['J75-L04', '20', '14'],
      ['J75-L05', '17', '7 L'],
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
  it('accepts equivalent fractional coordinate pairs and restores their actual entered representation', () => {
    const v = mount('/math/lesson/J75-L02');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '(-0.5,1.5)');
    check();
    enter('Your answer', '（6/4，−2/4）');
    check();
    v.unmount();
    mount('/math/lesson/J75-L02');
    expect(field('Your answer')).toBe('（6/4，−2/4）');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('rejects a coincidentally correct assigned output as a general rule and stores a completed affine expression', () => {
    const v = mount('/math/lesson/J75-L04');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '3');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '2(x-1/2)');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J75-L04');
    expect(field('Your answer')).toBe('2(x-1/2)');
  });
  it('requires parent review of model assumptions without scoring keywords or completing unworked practice', () => {
    mount('/math/lesson/J75-L05');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Water drains at two litres per minute only until empty at six minutes. Card inputs are integer counts with one fixed fee, not half cards. Celsius can begin negative. Read units and scales; a screen angle does not determine a rate. A supplied model has a domain, unlike a rule proved from a few observations.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J75-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves eight independent unit-review records across coordinate, expression, number and human reasoning tasks', () => {
    const v = mount('/math/unit/J75/check');
    for (const [n, input] of Object.entries({
      1: '(-4,2)',
      2: '(0.5,-1.5)',
      3: '-1',
      4: '4-2x',
      5: '7 L',
      6: '6',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 7');
    click(/^A A continuous relationship/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Each row gives (input,output) on labelled axes. A supplied continuous model permits a line only within its domain, while counts remain integer points. Rate has output per input units and intercept means the zero-input output. y=x and x² agree at zero and one but differ at two; those samples alone do not establish a universal rule.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J75/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J75-L05'],
    ).toBeUndefined();
  });
  it('changes coordinate retrieval values and clears preceding input and success evidence', () => {
    const v = mount('/math/lesson/J75-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '4');
    check();
    enter('Your answer', '-4');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText(/horizontal coordinate -4 and vertical coordinate -4/),
    ).toBeTruthy();
    enter('Your answer', '(-4,-4)');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J75-L01'].round).toBe(1);
    saved.sessions['J75-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText(/horizontal coordinate -3 and vertical coordinate -4/),
    ).toBeTruthy();
    expect(field('Your answer')).toBe('');
    enter('Your answer', '(-3,-4)');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
