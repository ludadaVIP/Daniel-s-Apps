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
import { PlaneLab, PlaneHookArt } from './PlaneLabs';
import {
  ObjectView,
  AngleView,
  ParallelView,
  TriangleView,
} from './PlaneVisuals';
import { App } from './App';
import { j74Lessons } from './content/J74';
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
const verify = (name: string) =>
  fireEvent.click(
    within(screen.getByRole('group', { name })).getByRole('button', {
      name: 'Check my result',
    }),
  );
const feedback = (name: string) =>
  within(screen.getByRole('group', { name })).getByRole('status', {
    name: 'Geometry feedback',
  }).textContent;
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
const check = () => click(/Check answer/);
describe('J74 geometry construction and conditions', () => {
  it('draws extension arrows and endpoint marks rather than making screen edges finite endpoints', () => {
    for (const [kind, start, end] of [
      ['line', true, true],
      ['ray', false, true],
      ['segment', false, false],
    ] as const) {
      const v = render(<ObjectView kind={kind} mode="en" />),
        line = v.container.querySelector('line')!;
      expect(!!line.getAttribute('marker-start')).toBe(start);
      expect(!!line.getAttribute('marker-end')).toBe(end);
      expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
        `Object: ${kind}`,
      );
      v.unmount();
    }
  });
  it('keeps an angle answer while arm length and whole orientation change, then resets for a new turn', () => {
    const v = render(<PlaneLab kind="plane-objects" mode="en" />);
    enter('How many endpoints?', '1');
    verify('How many endpoints?');
    expect(feedback('How many endpoints?')).toContain('matches');
    choose('Object to inspect', 'line');
    expect(field('How many endpoints?')).toBe('');
    enter('How many endpoints?', '0');
    verify('How many endpoints?');
    expect(feedback('How many endpoints?')).toContain('matches');
    enter('Measure of ∠AOB', '45°');
    verify('Measure of ∠AOB');
    slide('Drawn arm length', '70');
    slide('Whole-figure rotation (°)', '30');
    expect(field('Measure of ∠AOB')).toBe('45°');
    expect(feedback('Measure of ∠AOB')).toContain('matches');
    expect(
      v.container
        .querySelector('[data-angle-sweep]')!
        .getAttribute('data-angle-sweep'),
    ).toBe('45');
    slide('Specified turn (°)', '70');
    expect(field('Measure of ∠AOB')).toBe('');
  });
  it('geometrically rotates rays without changing their dot-product angle', () => {
    for (const [length, rotation] of [
      [60, -70],
      [125, 40],
    ]) {
      const v = render(
          <AngleView
            angle={65}
            rotation={rotation!}
            length={length!}
            mode="en"
          />,
        ),
        rays = Array.from(v.container.querySelectorAll('[data-ray]')).map(
          (e) => [
            Number(e.getAttribute('x2')) - 220,
            Number(e.getAttribute('y2')) - 160,
          ],
        );
      const a = rays[0]!,
        b = rays[1]!,
        angle =
          (Math.acos(
            (a[0]! * b[0]! + a[1]! * b[1]!) /
              (Math.hypot(...a) * Math.hypot(...b)),
          ) *
            180) /
          Math.PI;
      expect(angle).toBeCloseTo(65, 9);
      v.unmount();
    }
  });
  it('checks opposite and adjacent supplementary results and preserves answers under a common rotation', () => {
    render(<PlaneLab kind="plane-intersect" mode="en" />);
    enter('Vertically opposite C (°)', '122');
    verify('Vertically opposite C (°)');
    expect(feedback('Vertically opposite C (°)')).toContain('Recheck');
    enter('Vertically opposite C (°)', '58');
    verify('Vertically opposite C (°)');
    enter('Adjacent supplementary B (°)', '122');
    verify('Adjacent supplementary B (°)');
    expect(feedback('Adjacent supplementary B (°)')).toContain('matches');
    slide('Rotate both lines (°)', '35');
    expect(field('Adjacent supplementary B (°)')).toBe('122');
    slide('Given angle A (°)', '90');
    expect(field('Vertically opposite C (°)')).toBe('');
    enter('Adjacent supplementary B (°)', '90');
    verify('Adjacent supplementary B (°)');
    expect(feedback('Adjacent supplementary B (°)')).toContain('matches');
  });
  it('renders parallel chevrons only with the premise and varies the lower direction without inventing givens', () => {
    const v = render(<ParallelView top={65} bottom={65} parallel mode="en" />);
    expect(v.container.querySelectorAll('[data-parallel-mark]')).toHaveLength(
      2,
    );
    v.rerender(
      <ParallelView top={65} bottom={45} parallel={false} mode="en" />,
    );
    expect(v.container.querySelectorAll('[data-parallel-mark]')).toHaveLength(
      0,
    );
    expect(
      v.container
        .querySelectorAll('[data-line-tilt]')[1]!
        .getAttribute('data-line-tilt'),
    ).toBe('20');
    expect(
      v.container
        .querySelector('[data-angle-name="E"]')!
        .getAttribute('data-angle-sweep'),
    ).toBe('45');
    expect(v.container.textContent).not.toContain('E = 45');
  });
  it('distinguishes a determined corresponding angle from insufficient premises even when the picture happens to be parallel', () => {
    render(<PlaneLab kind="plane-parallel" mode="en" />);
    enter('E determined by the givens alone', '65');
    verify('E determined by the givens alone');
    expect(feedback('E determined by the givens alone')).toContain('matches');
    choose('Parallel condition in the givens', 'no');
    expect(field('E determined by the givens alone')).toBe('');
    enter('E determined by the givens alone', '65');
    verify('E determined by the givens alone');
    expect(feedback('E determined by the givens alone')).toContain('Recheck');
    enter('E determined by the givens alone', 'undetermined');
    verify('E determined by the givens alone');
    choose('Change the unmeasured lower line', '2');
    expect(feedback('E determined by the givens alone')).toContain('matches');
  });
  it('constructs a real triangle, reveals a parallel through its vertex and keeps the third angle a prediction', () => {
    const v = render(<PlaneLab kind="plane-sum" mode="en" />);
    enter('Third interior C (°)', '65');
    verify('Third interior C (°)');
    expect(feedback('Third interior C (°)')).toContain('matches');
    click('Draw a parallel through C and compare angle copies');
    const line = v.container.querySelector('[data-proof-parallel]')!;
    expect(line.getAttribute('y1')).toBe(line.getAttribute('y2'));
    const sweeps = Array.from(
      v.container.querySelectorAll('[data-angle-sweep]'),
    ).map((e) => Number(e.getAttribute('data-angle-sweep')));
    expect(sweeps).toEqual([48, 65, 67]);
    expect(sweeps.reduce((s, n) => s + n, 0)).toBe(180);
    slide('Interior A (°)', '120');
    expect(field('Third interior C (°)')).toBe('');
    expect(
      (
        screen.getByRole('slider', {
          name: 'Interior B (°)',
        }) as HTMLInputElement
      ).value,
    ).toBe('40');
    expect(v.container.querySelector('[data-proof-parallel]')).toBeNull();
    enter('Third interior C (°)', '20');
    verify('Third interior C (°)');
    expect(feedback('Third interior C (°)')).toContain('matches');
  });
  it('preserves interior angles after fitting acute and obtuse triangle vertices to the SVG view', () => {
    for (const [a, b] of [
      [48, 67],
      [110, 30],
      [20, 140],
    ]) {
      const v = render(<TriangleView a={a!} b={b!} mode="en" />),
        p = v.container
          .querySelector('[data-triangle-points]')!
          .getAttribute('points')!
          .split(' ')
          .map((s) => s.split(',').map(Number)),
        [A, B, C] = p;
      const angle = (o: number[], v: number[], w: number[]) =>
        (Math.acos(
          ((v[0]! - o[0]!) * (w[0]! - o[0]!) +
            (v[1]! - o[1]!) * (w[1]! - o[1]!)) /
            (Math.hypot(v[0]! - o[0]!, v[1]! - o[1]!) *
              Math.hypot(w[0]! - o[0]!, w[1]! - o[1]!)),
        ) *
          180) /
        Math.PI;
      expect(angle(A!, B!, C!)).toBeCloseTo(a!, 8);
      expect(angle(B!, A!, C!)).toBeCloseTo(b!, 8);
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
  it('rejects degenerate side lengths without drawing a false triangle and then accepts inclusive classifications', () => {
    const v = render(<PlaneLab kind="plane-classify" mode="en" />);
    slide('Side a (cm)', '2');
    slide('Side b (cm)', '3');
    slide('Side c (cm)', '5');
    expect(v.container.querySelector('[data-triangle-points]')).toBeNull();
    expect(v.container.querySelectorAll('[data-rod-length]')).toHaveLength(3);
    enter('My classification (or impossible)', 'scalene');
    verify('My classification (or impossible)');
    expect(feedback('My classification (or impossible)')).toContain('Recheck');
    enter('My classification (or impossible)', 'impossible');
    verify('My classification (or impossible)');
    expect(feedback('My classification (or impossible)')).toContain('matches');
    slide('Side a (cm)', '5');
    slide('Side b (cm)', '5');
    enter('My classification (or impossible)', 'equilateral');
    verify('My classification (or impossible)');
    expect(feedback('My classification (or impossible)')).toContain('matches');
    expect(screen.getByText(/equilateral is a special case/)).toBeTruthy();
    expect(v.container.querySelectorAll('[data-side-label]')).toHaveLength(3);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'supplied sides 5, 5, 5 cm',
    );
    expect(v.container.textContent).not.toContain('C stays a question');
  });
  it('switches classification axes, computes the third angle and tests acute, right and obtuse without using side names', () => {
    render(<PlaneLab kind="plane-classify" mode="en" />);
    choose('Classification basis', 'angle');
    enter('My classification (or impossible)', 'acute');
    verify('My classification (or impossible)');
    expect(feedback('My classification (or impossible)')).toContain('matches');
    slide('Interior A (°)', '45');
    slide('Interior B (°)', '45');
    enter('My classification (or impossible)', 'right');
    verify('My classification (or impossible)');
    expect(feedback('My classification (or impossible)')).toContain('matches');
    slide('Interior A (°)', '30');
    slide('Interior B (°)', '40');
    enter('My classification (or impossible)', 'obtuse');
    verify('My classification (or impossible)');
    expect(feedback('My classification (or impossible)')).toContain('matches');
  });
  it('checks direct usable reasons while keeping written proof review separate and revoking stale review', () => {
    render(<PlaneLab kind="plane-reasons" mode="en" />);
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'It looks equal or parallel' }),
    );
    click('Check usable reasons');
    expect(
      screen.getByRole('status', { name: 'Reason feedback' }).textContent,
    ).toContain('Check missing');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'It looks equal or parallel' }),
    );
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Opposite rays form a straight angle; adjacent sum 180°',
      }),
    );
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Subtract the same quantity from equal quantities',
      }),
    );
    click('Check usable reasons');
    expect(
      screen.getByRole('status', { name: 'Reason feedback' }).textContent,
    ).toContain('parent must still review');
    expect(
      (
        screen.getByRole('button', {
          name: 'Parent confirms the reasoning chain',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    enter(
      'My givens–reason–conclusion chain',
      'A+B=180 and B+C=180 by opposite rays, so subtract the same B to get A=C.',
    );
    click('Parent confirms the reasoning chain');
    expect(
      screen.getByText('This workshop reasoning was reviewed by a parent.'),
    ).toBeTruthy();
    enter('My givens–reason–conclusion chain', 'Changed argument');
    expect(
      screen.queryByText('This workshop reasoning was reviewed by a parent.'),
    ).toBeNull();
    click('Parent confirms the reasoning chain');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'It looks equal or parallel' }),
    );
    expect(
      screen.queryByText('This workshop reasoning was reviewed by a parent.'),
    ).toBeNull();
    choose('Reasoning case', '2');
    expect(field('My givens–reason–conclusion chain')).toBe('');
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Insufficient givens: the conclusion cannot be determined',
      }),
    );
    click('Check usable reasons');
    expect(
      screen.getByRole('status', { name: 'Reason feedback' }).textContent,
    ).toContain('fit this argument');
  });
  it('keeps all six hooks as questions without revealing solved angle values', () => {
    for (const l of j74Lessons) {
      const v = render(
        <PlaneHookArt
          kind={l.lab as Parameters<typeof PlaneHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J74 formal content and saved reasoning', () => {
  it('renders six complete English lessons and both languages with two examples each', () => {
    for (const l of j74Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J74-L06');
    click(/03/);
    expect(
      v.container.querySelectorAll('.math-prose section[lang="zh"] h3'),
    ).toHaveLength(2);
    expect(
      v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
    ).toHaveLength(2);
  });
  it('restores exact numeric and classification answers after retries without completing unfinished lessons', () => {
    for (const [id, wrong, right] of [
      ['J74-L01', '2', '1'],
      ['J74-L02', '138', '42°'],
      ['J74-L03', '115', '65'],
      ['J74-L04', '115', '65'],
      ['J74-L05', 'acute', 'right'],
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
  it('retains an insufficient-conditions classification and a strict-boundary impossibility after refresh', () => {
    const v = mount('/math/lesson/J74-L03');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '65');
    check();
    enter('Your answer', '无法确定');
    check();
    v.unmount();
    const w = mount('/math/lesson/J74-L03');
    expect(field('Your answer')).toBe('无法确定');
    w.unmount();
    const x = mount('/math/lesson/J74-L05');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', 'scalene');
    check();
    enter('Your answer', 'impossible');
    check();
    x.unmount();
    mount('/math/lesson/J74-L05');
    expect(field('Your answer')).toBe('impossible');
  });
  it('requires parent review for the guided proof and restores the actual written chain', () => {
    const v = mount('/math/lesson/J74-L06');
    click(/04 Together/);
    const text =
      'Opposite rays give A+B=180° and B+C=180°. Their totals are equal, so subtracting the same B gives A=C. Appearance and a bare theorem name do not supply this derivation.';
    enter('Your reasoning', text);
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J74-L06');
    expect(field('Your reasoning')).toBe(text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J74-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('keeps proof-focused practice and exit responses manual rather than scoring keywords or numerical conclusions', () => {
    mount('/math/lesson/J74-L06');
    click(/05 Practice/);
    click('Question 3');
    enter('Your reasoning', 'F=118 because it looks like that.');
    expect(screen.queryByRole('button', { name: /Check answer/ })).toBeNull();
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    click(/06 Reflect/);
    expect(
      screen.getByRole('textbox', { name: 'Your reasoning' }),
    ).toBeTruthy();
  });
  it('saves eight unit-check records independently, with reasoning reviewed as reasoning', () => {
    const v = mount('/math/unit/J74/check');
    for (const [n, input] of Object.entries({
      1: 'ray',
      2: '58',
      3: 'undetermined',
      4: '75',
      5: 'obtuse',
      6: '6 cm',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 7');
    click(/^A Given ℓ∥m/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Given parallel lines and a corresponding pair, the two angles are equal; without parallelism the inference is unsupported. In a triangle, construct a parallel through the opposite vertex; alternate interior angles and a straight angle give the interior sum. Each link uses a premise rather than appearance.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J74/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J74-L06'],
    ).toBeUndefined();
  });
  it('changes retrieval from missing parallel premises to a given-parallel computation without retaining old answers', () => {
    const v = mount('/math/lesson/J74-L03');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '65');
    check();
    enter('Your answer', 'undetermined');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText(/Only upper A=20°/)).toBeTruthy();
    enter('Your answer', 'undetermined');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J74-L03'].round).toBe(1);
    saved.sessions['J74-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText(/Given ℓ∥m and corresponding A=21°/)).toBeTruthy();
    expect(field('Your answer')).toBe('');
    enter('Your answer', '21');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
