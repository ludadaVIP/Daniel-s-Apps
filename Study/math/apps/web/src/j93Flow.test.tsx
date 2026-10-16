// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ParabolaLab, ParabolaHookArt } from './ParabolaLabs';
import { ParabolaGraph } from './ParabolaVisuals';
import { j93Lessons } from './content/J93';
import { App } from './App';
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
const task = 'My parabola conclusion',
  submit = () => click(`Check: ${task}`),
  feedback = () =>
    screen.getByRole('status', { name: `${task} feedback` }).textContent;
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const check = () => click(/Check answer/);
const parent = () => {
  fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
  click('Parent confirms: reasoning makes sense');
};
describe('J93 five parabola investigations', () => {
  it('compares on common scales, preserves display changes and distinguishes a=0', () => {
    const v = render(<ParabolaLab kind="parabola-opening" mode="en" />);
    expect(v.container.querySelector('[data-parabola-reference]')).toBeTruthy();
    enter(task, 'up');
    submit();
    click('Show or hide opening audit');
    click('Change function window');
    expect(field(task)).toBe('up');
    expect(feedback()).toContain('matches');
    slide('Quadratic coefficient a', '-0.5');
    expect(field(task)).toBe('');
    enter(task, 'down');
    submit();
    expect(feedback()).toContain('matches');
    enter('Output at the same input', '-2');
    click('Check: Output at the same input');
    expect(
      screen.getByRole('status', { name: 'Output at the same input feedback' })
        .textContent,
    ).toContain('matches');
    slide('Quadratic coefficient a', '0');
    enter(task, 'not-quadratic');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide opening audit');
    expect(v.container.querySelector('[data-parabola-vertex]')).toBeNull();
  });
  it('retains vertex writing when only d or the window changes and resets actual shifts', () => {
    const v = render(<ParabolaLab kind="parabola-vertex" mode="en" />);
    enter(task, '(2,-1)');
    submit();
    click('Show or hide symmetry audit');
    expect(v.container.querySelectorAll('[data-parabola-mirror]')).toHaveLength(
      2,
    );
    slide('Illustration distance d', '2');
    click('Change function window');
    expect(field(task)).toBe('(2,-1)');
    expect(feedback()).toContain('matches');
    slide('Illustration distance d', '0');
    expect(v.container.querySelectorAll('[data-parabola-mirror]')).toHaveLength(
      1,
    );
    slide('Vertex parameter h', '-3');
    expect(field(task)).toBe('');
    enter(task, '(-3,-1)');
    submit();
    expect(feedback()).toContain('matches');
    enter('Symmetry-axis x-value', '-3');
    click('Check: Symmetry-axis x-value');
    expect(
      screen.getByRole('status', { name: 'Symmetry-axis x-value feedback' })
        .textContent,
    ).toContain('matches');
    slide('Illustration distance d', '3');
    click('Change function window');
    click('Show or hide symmetry audit');
    expect(v.container.querySelectorAll('[data-parabola-mirror]')).toHaveLength(
      1,
    );
    expect(
      v.container.querySelector('[data-parabola-mirror="Q"] text')!.textContent,
    ).toBe('Q');
  });
  it('does not claim a unique vertex at zero coefficient', () => {
    const v = render(<ParabolaLab kind="parabola-vertex" mode="en" />);
    slide('Vertex parameter a', '0');
    click('Show or hide symmetry audit');
    expect(v.container.querySelector('[data-parabola-vertex]')).toBeNull();
    expect(
      screen.queryByRole('textbox', { name: 'Symmetry-axis x-value' }),
    ).toBeNull();
    expect(v.container.textContent).toContain('not claim a unique');
    enter(task, 'not-quadratic');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('separates a correct function from the requested expression form and clears changed requests', () => {
    render(<ParabolaLab kind="parabola-forms" mode="en" />);
    enter('My exact function form', 'x²-4x+3');
    click('Check: My exact function form');
    expect(
      screen.getByRole('status', { name: 'My exact function form feedback' })
        .textContent,
    ).toContain('functions are identical');
    enter('My exact function form', '(x-2)^2-1');
    click('Check: My exact function form');
    expect(
      screen.getByRole('status', { name: 'My exact function form feedback' })
        .textContent,
    ).toContain('conclusion matches');
    click('Show or hide three-form audit');
    expect(field('My exact function form')).toBe('(x-2)^2-1');
    choose('Requested function form', 'factored');
    expect(field('My exact function form')).toBe('');
    enter('My exact function form', '2(x-1)(x-3)');
    click('Check: My exact function form');
    expect(
      screen.getByRole('status', { name: 'My exact function form feedback' })
        .textContent,
    ).not.toContain('matches');
    enter('My exact function form', '(x-3)(x-1)');
    click('Check: My exact function form');
    expect(
      screen.getByRole('status', { name: 'My exact function form feedback' })
        .textContent,
    ).toContain('conclusion matches');
  });
  it('handles absent real factors and irrational factors without falsely rejecting their mathematics', () => {
    const v = render(<ParabolaLab kind="parabola-forms" mode="en" />);
    choose('Requested function form', 'factored');
    choose('Function-form case', '3');
    expect(
      screen.queryByRole('textbox', { name: 'My exact function form' }),
    ).toBeNull();
    enter(task, '∅');
    submit();
    expect(feedback()).toContain('matches');
    expect(v.container.textContent).toContain('no real zeros');
    choose('Function-form case', '4');
    expect(field(task)).toBe('');
    enter(task, '±√2');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide three-form audit');
    expect(
      screen.getByRole('status', { name: 'Three-form audit' }).textContent,
    ).toContain('(x−√2)(x+√2)');
  });
  it('keeps horizontal targets on the original graph and distinguishes exact roots from pixel estimates', () => {
    const v = render(<ParabolaLab kind="parabola-intersections" mode="en" />);
    choose('Graph-equation case', '3');
    expect(
      v.container
        .querySelector('[data-parabola-target]')!
        .getAttribute('data-parabola-target'),
    ).toBe('2');
    enter(task, '2');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '±√2');
    submit();
    slide('Graph cursor x (illustration only)', '1.5');
    click('Change function window');
    expect(field(task)).toBe('±√2');
    expect(feedback()).toContain('matches');
    enter('Candidate intersection x', '1.41');
    click('Check original horizontal equation');
    expect(
      screen.getByRole('status', { name: 'Horizontal-equation audit' })
        .textContent,
    ).toContain('fails');
    enter('Candidate intersection x', '√2');
    click('Check original horizontal equation');
    expect(
      screen.getByRole('status', { name: 'Horizontal-equation audit' })
        .textContent,
    ).toContain('exact equality passes');
    slide('Target horizontal value q', '3');
    expect(field(task)).toBe('');
    expect(field('Candidate intersection x')).toBe('');
  });
  it('counts tangency once and retains off-window intersections without plotting at the border', () => {
    const v = render(<ParabolaLab kind="parabola-intersections" mode="en" />);
    choose('Graph-equation case', '1');
    click('Show or hide intersection audit');
    expect(
      v.container.querySelectorAll('[data-parabola-intersection]'),
    ).toHaveLength(1);
    expect(v.container.querySelector('[data-parabola-vertex]')).toBeNull();
    choose('Graph-equation case', '2');
    enter(task, '∅');
    submit();
    expect(feedback()).toContain('matches');
    choose('Graph-equation case', '4');
    click('Show or hide intersection audit');
    expect(
      v.container.querySelectorAll('[data-parabola-intersection]'),
    ).toHaveLength(0);
    enter(task, '8,10');
    submit();
    click('Change function window');
    expect(
      v.container.querySelectorAll('[data-parabola-intersection]'),
    ).toHaveLength(2);
    expect(field(task)).toBe('8,10');
  });
  it('compares constrained endpoints rather than using an excluded vertex', () => {
    const v = render(<ParabolaLab kind="parabola-maximum" mode="en" />);
    enter('My area or score function', '25-(x-5)²');
    click('Check: My area or score function');
    expect(
      screen.getByRole('status', { name: 'My area or score function feedback' })
        .textContent,
    ).toContain('matches');
    enter('Largest output', '25');
    click('Check: Largest output');
    enter(task, '5');
    submit();
    slide('Candidate x within the domain', '3');
    click('Show or hide extremum-candidate audit');
    expect(field(task)).toBe('5');
    choose('Constrained-extremum case', '1');
    expect(field(task)).toBe('');
    expect(field('Largest output')).toBe('');
    expect(field('My area or score function')).toBe('');
    enter('Largest output', '25');
    click('Check: Largest output');
    expect(
      screen.getByRole('status', { name: 'Largest output feedback' })
        .textContent,
    ).not.toContain('matches');
    enter('Largest output', '24');
    click('Check: Largest output');
    enter(task, '4');
    submit();
    click('Show or hide extremum-candidate audit');
    expect(feedback()).toContain('matches');
    expect(v.container.querySelector('[data-parabola-vertex]')).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Extremum-candidate audit' })
        .textContent,
    ).toContain('Maximum 24 cm²');
  });
  it('draws every allowed integer point without a continuous join and retains both tied optima', () => {
    const v = render(<ParabolaLab kind="parabola-maximum" mode="en" />);
    choose('Constrained-extremum case', '2');
    click('Show or hide extremum-candidate audit');
    expect(
      v.container.querySelectorAll('[data-parabola-integer]'),
    ).toHaveLength(6);
    expect(v.container.querySelector('[data-parabola-curve]')).toBeNull();
    expect(v.container.querySelector('[data-parabola-vertex]')).toBeNull();
    expect(v.container.textContent).toContain('not an allowed input');
    enter('Largest output', '7');
    click('Check: Largest output');
    enter(task, '3');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '2,3');
    submit();
    expect(feedback()).toContain('matches');
    choose('Constrained-extremum case', '3');
    enter('Largest output', '9');
    click('Check: Largest output');
    enter(task, '2');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('switches between maxima and minima, retains the same model and checks both tied minimum inputs', () => {
    render(<ParabolaLab kind="parabola-maximum" mode="en" />);
    enter('My area or score function', 'x(10-x)');
    enter('Largest output', '25');
    click('Check: Largest output');
    enter(task, '5');
    submit();
    choose('Extremum to investigate', 'minimum');
    expect(field('My area or score function')).toBe('x(10-x)');
    expect(field(task)).toBe('');
    expect(field('Smallest output')).toBe('');
    enter('Smallest output', '9');
    click('Check: Smallest output');
    enter(task, '1');
    submit();
    expect(feedback()).toContain('matches');
    choose('Constrained-extremum case', '2');
    enter('Smallest output', '1');
    click('Check: Smallest output');
    enter(task, '0');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '0,5');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide extremum-candidate audit');
    expect(
      screen.getByRole('status', { name: 'Extremum-candidate audit' })
        .textContent,
    ).toContain('Minimum 1 points');
  });
  it('places horizontal markers at their actual ordinate and never labels a clipped edge as an endpoint', () => {
    const v = render(<ParabolaGraph source="x²" mode="en" level="2" shown />),
      markers = v.container.querySelectorAll(
        '[data-parabola-intersection] circle',
      ),
      expected = 300 - ((2 + 6) / 16) * 270;
    expect(markers).toHaveLength(2);
    for (const e of markers)
      expect(Number(e.getAttribute('cy'))).toBe(expected);
    expect(v.container.querySelector('clipPath')).toBeTruthy();
    v.rerender(
      <ParabolaGraph
        source="x²"
        mode="en"
        domain={{ lower: '-10', upper: '2' }}
      />,
    );
    expect(
      [...v.container.querySelectorAll('[data-parabola-endpoint]')].map((e) =>
        e.getAttribute('data-parabola-endpoint'),
      ),
    ).toEqual(['2']);
  });
  it('renders all five hooks and every English/bilingual pair of worked examples', () => {
    for (const l of j93Lessons) {
      const v = render(
        <ParabolaHookArt
          kind={l.lab as Parameters<typeof ParabolaHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
      const w = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        w.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      w.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J93-L03');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('J93 formal answers, manual reasoning and retrieval', () => {
  it('restores retries in all five courses without completing unfinished lessons', () => {
    for (const [id, wrong, right] of [
      ['J93-L01', 'down', 'up'],
      ['J93-L02', '(-2,-1)', '(2,-1)'],
      ['J93-L03', 'x²-4x+3', '(2-x)^2-1'],
      ['J93-L04', '1', '3,1'],
      ['J93-L05', '5', '25'],
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
  it('gives a formal identity-versus-form hint and preserves the original accepted expression', () => {
    const v = mount('/math/lesson/J93-L03');
    click(/04 Together/);
    enter('Your answer', 'x²-4x+3');
    check();
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    enter('Your answer', '-1+(x-2)²');
    check();
    v.unmount();
    mount('/math/lesson/J93-L03');
    expect(field('Your answer')).toBe('-1+(x-2)²');
  });
  it('keeps factor-domain and constrained-maximum reasoning human-reviewed through refresh', () => {
    for (const [id, step, question, text] of [
      [
        'J93-L03',
        /05 Practice/,
        'Question 4',
        'No integer factor search proves the real case. x squared plus one is positive for every real input, but x squared minus two has real irrational factors.',
      ],
      [
        'J93-L05',
        /06 Reflect/,
        null,
        'The continuous vertex at time three is outside zero to two minutes. The nearest allowed input is two, giving maximum reading nine units; zero gives one.',
      ],
    ] as const) {
      const v = mount(`/math/lesson/${id}`);
      click(step);
      if (question) click(question);
      enter('Your reasoning', text);
      expect(
        screen.queryByText('✓ Reasoning reviewed by a parent.'),
      ).toBeNull();
      parent();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your reasoning')).toBe(text);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id].completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('records eight separate unit answers and two parent reviews without changing lesson mastery', () => {
    const v = mount('/math/unit/J93/check');
    for (const [n, raw] of Object.entries({
      1: 'down',
      2: '(2,-5)',
      3: '(x+1)^2-4',
      4: '±√3',
      5: '24',
    })) {
      click(`Question ${n}`);
      enter('Your answer', raw);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'The continuous maximum is 29/4 at 5/2, but two and three cards tie at seven. Both nearest integers are required.',
    );
    parent();
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'The same function x²-4x+3 has vertex form (x-2)²-1 and factors (x-1)(x-3). On zero to one its minimum zero occurs at one and maximum three at zero; the vertex is excluded.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J93/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J93-L05'],
    ).toBeUndefined();
  });
  it('advances the form retrieval request and clears the old answer and success message', () => {
    const v = mount('/math/lesson/J93-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '2x²-2x-1');
    check();
    enter('Your answer', '2x²-4x-1');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '-2x²-12x-18');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J93-L03'].round).toBe(1);
    saved.sessions['J93-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '-(x+5/2)^2+1/4');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
