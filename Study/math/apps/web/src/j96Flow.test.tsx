// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TrigLab, TrigHookArt } from './TrigLabs';
import {
  HeightView,
  SlopeView,
  TrigGraph,
  TrigTriangleView,
} from './TrigVisuals';
import { j96Lessons } from './content/J96';
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
const task = 'My trigonometry conclusion',
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
describe('J96 ratios, reference angles and calculator models', () => {
  it('preserves same-angle ratios across scaling and rigid poses but resets a changed reference', () => {
    const v = render(<TrigLab kind="trig-sine" mode="en" />);
    enter(task, '3/5');
    submit();
    enter('Opposite side letters', 'BC');
    enter('Hypotenuse letters', 'AB');
    slide('Uniform scale for every side', '3');
    click('Rotate the diagram only');
    click('Reflect the diagram only');
    click('Change display zoom only');
    expect(field(task)).toBe('3/5');
    expect(field('Opposite side letters')).toBe('BC');
    expect(feedback()).toContain('matches');
    expect(
      [...v.container.querySelectorAll('[data-trig-point]')].map((e) =>
        e.getAttribute('data-trig-point'),
      ),
    ).toEqual(['A', 'B', 'C']);
    choose('Reference acute angle', 'B');
    expect(field(task)).toBe('');
    enter(task, '4/5');
    submit();
    enter('Opposite side letters', 'AC');
    click('Check: Opposite side letters');
    expect(feedback()).toContain('matches');
    expect(
      screen.getByRole('status', { name: 'Opposite side letters feedback' })
        .textContent,
    ).toContain('matches');
  });
  it('does not invent a right angle or lengths when the premise is absent', () => {
    const v = render(<TrigLab kind="trig-sine" mode="en" />);
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Right-angle premise supplied' }),
    );
    expect(v.container.querySelector('[data-trig-right]')).toBeNull();
    expect(v.container.querySelectorAll('[data-trig-side] text')).toHaveLength(
      0,
    );
    expect(
      screen.queryByRole('textbox', { name: 'Hypotenuse letters' }),
    ).toBeNull();
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('uses cosine and tangent with the stated reference and recovers an unknown denominator', () => {
    const v = render(<TrigLab kind="trig-cos-tan" mode="en" />);
    enter(task, '4/5');
    submit();
    expect(feedback()).toContain('matches');
    choose('Requested ratio function', 'tan');
    expect(field(task)).toBe('');
    enter(task, '3/4');
    submit();
    expect(feedback()).toContain('matches');
    choose('Reference acute angle', 'B');
    enter(task, '4/3');
    submit();
    expect(feedback()).toContain('matches');
    choose('Cosine-tangent use', 'cos-side');
    enter(task, '8 cm');
    submit();
    expect(feedback()).toContain('matches');
    expect(v.container.querySelector('[data-trig-side="BC"] text')).toBeNull();
    choose('Cosine-tangent use', 'tan-side');
    enter(task, '4.5');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '8');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('requires the prescribed decimal places and clips off-window tangent without a false plateau', () => {
    const v = render(<TrigLab kind="trig-variation" mode="en" />);
    slide('Acute θ in degrees', '45');
    choose('Trig function to inspect', 'tan');
    enter(task, '1');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '1.0000');
    submit();
    expect(feedback()).toContain('matches');
    click('Change triangle display zoom only');
    expect(field(task)).toBe('1.0000');
    slide('Acute θ in degrees', '85');
    expect(field(task)).toBe('');
    enter(task, '11.4301');
    submit();
    expect(feedback()).toContain('matches');
    expect(v.container.querySelector('[data-trig-sample]')).toBeNull();
    expect(
      v.container
        .querySelector('[data-trig-curve="tan"]')!
        .getAttribute('points')!
        .split(' ')
        .some((p) => Number(p.split(',')[1]) < 80),
    ).toBe(true);
    expect(v.container.querySelector('clipPath')).toBeTruthy();
    expect(v.container.textContent).toContain('outside the plotted window');
  });
  it('treats tan90 as undefined and a degenerate triangle, then clears the boundary answer', () => {
    const v = render(<TrigLab kind="trig-variation" mode="en" />);
    click('Inspect tangent at 90 degrees');
    expect(v.container.querySelector('[data-trig-right]')).toBeNull();
    expect(v.container.querySelector('[data-trig-sample]')).toBeNull();
    expect(v.container.textContent).toContain('tan90° is undefined');
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
    click('Return to the acute domain');
    expect(field(task)).toBe('');
    expect(v.container.querySelector('[data-trig-right]')).toBeTruthy();
  });
  it('preserves a degree prediction through DEG/RAD display changes and rejects invalid sine data', () => {
    const v = render(<TrigLab kind="trig-inverse" mode="en" />);
    enter(task, '36.9°');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide ratio audit');
    choose('Calculator display unit', 'RAD');
    expect(field(task)).toBe('36.9°');
    expect(
      screen.getByRole('status', { name: 'Inverse calculator display' })
        .textContent,
    ).toContain('0.6435 rad');
    enter(task, '0.6°');
    submit();
    expect(feedback()).not.toContain('matches');
    choose('Inverse-trig case', '5');
    expect(field(task)).toBe('');
    expect(v.container.querySelector('svg')).toBeNull();
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('distinguishes horizontal distance, sight distance and instrument height', () => {
    render(<TrigLab kind="trig-height" mode="en" />);
    enter(task, '13.5 m');
    submit();
    expect(feedback()).toContain('matches');
    click('Change scenario display zoom only');
    expect(field(task)).toBe('13.5 m');
    choose('Height-and-slope case', '1');
    expect(field(task)).toBe('');
    enter(task, '7.3');
    submit();
    expect(feedback()).toContain('matches');
    choose('Height-and-slope case', '2');
    enter(task, '6.5 m');
    submit();
    expect(feedback()).toContain('matches');
    slide('Instrument height above ground', '2');
    expect(field(task)).toBe('');
    enter(task, '7.0 m');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('keeps percentage grade separate from degrees and permits grades above 100%', () => {
    render(<TrigLab kind="trig-height" mode="en" />);
    choose('Height-and-slope case', '3');
    enter(task, '60.0%');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '75.0%');
    submit();
    expect(feedback()).toContain('matches');
    enter('Slope angle in degrees', '36.9°');
    click('Check: Slope angle in degrees');
    expect(
      screen.getByRole('status', { name: 'Slope angle in degrees feedback' })
        .textContent,
    ).toContain('matches');
    slide('Vertical rise', '2');
    slide('Horizontal run', '1');
    enter(task, '200.0%');
    submit();
    expect(feedback()).toContain('matches');
    enter('Slope angle in degrees', '63.4°');
    click('Check: Slope angle in degrees');
    expect(
      screen.getByRole('status', { name: 'Slope angle in degrees feedback' })
        .textContent,
    ).toContain('matches');
  });
  it('shows two base levels preserving observations and retains the insufficient-evidence judgement', () => {
    const v = render(<TrigLab kind="trig-height" mode="en" />);
    choose('Height-and-slope case', '4');
    enter(task, 'insufficient');
    submit();
    const top = v.container
        .querySelector('[data-trig-tree]')!
        .getAttribute('y2'),
      base = v.container.querySelector('[data-trig-tree]')!.getAttribute('y1');
    click('Show another possible base level only');
    expect(field(task)).toBe('insufficient');
    expect(feedback()).toContain('matches');
    expect(
      v.container.querySelector('[data-trig-tree]')!.getAttribute('y2'),
    ).toBe(top);
    expect(
      v.container.querySelector('[data-trig-tree]')!.getAttribute('y1'),
    ).not.toBe(base);
    click('Show or hide ratio audit');
    expect(
      screen.getByRole('status', { name: 'Trigonometry audit' }).textContent,
    ).toContain('13.5 or 11.5');
  });
  it('renders bilingual labels as native SVG text and excludes boundary markers from the acute graph', () => {
    const v = render(
      <HeightView
        mode="bilingual"
        distance={10}
        degrees={30}
        eye={1.5}
        distanceKind="sight"
      />,
    );
    expect(v.container.querySelector('svg span')).toBeNull();
    expect(v.container.textContent).toContain('视线距离');
    expect(v.container.textContent).toContain('sight');
    v.rerender(<SlopeView mode="bilingual" rise={5} run={1} />);
    expect(v.container.querySelector('svg span')).toBeNull();
    expect(v.container.textContent).toContain('水平距');
    expect(v.container.textContent).toContain(
      'Inclined length is not horizontal run',
    );
    v.rerender(<TrigGraph mode="en" degrees={90} active="tan" />);
    expect(v.container.querySelector('[data-trig-sample]')).toBeNull();
    expect(v.container.textContent).toContain('undefined');
    v.rerender(<TrigTriangleView mode="en" scale="3" rotation={90} mirror />);
    expect(v.container.querySelector('[data-trig-reference="A"]')).toBeTruthy();
  });
  it('renders five hooks and two worked examples per language', () => {
    for (const l of j96Lessons) {
      const v = render(
        <TrigHookArt
          kind={l.lab as Parameters<typeof TrigHookArt>[0]['kind']}
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
    const v = mount('/math/lesson/J96-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('J96 formal exact values, decimal precision and parent reasoning', () => {
  it('restores wrong-then-right answers in all five courses without awarding whole-course completion', () => {
    for (const [id, wrong, right] of [
      ['J96-L01', '4/5', '3/5'],
      ['J96-L02', '3/4', '4/5'],
      ['J96-L03', '1', '1.0000'],
      ['J96-L04', '0.6', '36.9°'],
      ['J96-L05', '12.0', '13.5 m'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/04 Together/);
      enter('Your answer', wrong!);
      check();
      if (id === 'J96-L03')
        expect(
          screen.getByText('↳ The value matches; finish the requested form.'),
        ).toBeTruthy();
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
  it('keeps a different-base counterexample human-reviewed through refresh', () => {
    const v = mount('/math/lesson/J96-L05');
    click(/06 Reflect/);
    const text =
      'The top stays 13.5 m above observer ground. A base at zero gives height 13.5 and a base two metres higher gives 11.5, preserving the elevation angle and horizontal distance. The missing base relationship prevents a unique answer.';
    enter('Your reasoning', text);
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    parent();
    v.unmount();
    mount('/math/lesson/J96-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J96-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('records eight answers with two separate parent reviews and preserves them independently of lessons', () => {
    const v = mount('/math/unit/J96/check');
    for (const [n, a] of Object.entries({
      1: '3/5',
      2: '3/4',
      3: '√3',
      4: '36.9°',
      5: '13.5 m',
    })) {
      click(`Question ${n}`);
      enter('Your answer', a);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'Rise three divided by horizontal run four gives 75%, inverse tangent gives 36.9 degrees and inclined length is five metres. Grade is not angle or length; zero run gives no finite grade.',
    );
    parent();
    click('Question 7');
    click('B 10sin30°');
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'The same angle and horizontal distance give a top 13.5 m above observer ground. A base at zero gives 13.5 m height and a base at two gives 11.5 m, so the base-level relationship is necessary.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J96/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J96-L05'],
    ).toBeUndefined();
  });
  it('advances an exact sine retrieval and clears the preceding answer and success state', () => {
    const v = mount('/math/lesson/J96-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', 'BC');
    check();
    enter('Your answer', 'AC');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '3/5');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J96-L01'].round).toBe(1);
    saved.sessions['J96-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '5/13');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
