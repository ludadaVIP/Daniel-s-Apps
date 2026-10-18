// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CircleGeometryLab, CircleGeometryHookArt } from './CircleGeometryLabs';
import {
  CircleProofView,
  ChordLineView,
  SectorGeometryView,
  InscribedView,
} from './CircleGeometryVisuals';
import { j95Lessons } from './content/J95';
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
const task = 'My circle-geometry conclusion',
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
describe('J95 circle investigations and explicit premises', () => {
  it('classifies the infinite line, keeps display changes and resets actual centre distance', () => {
    const v = render(<CircleGeometryLab kind="cyclic-elements" mode="en" />);
    enter(task, 'secant');
    submit();
    enter('Exact chord AB length', '8');
    click('Check: Exact chord AB length');
    click('Rotate the entire diagram only');
    click('Change display zoom only');
    expect(field(task)).toBe('secant');
    expect(field('Exact chord AB length')).toBe('8');
    expect(feedback()).toContain('matches');
    slide('Perpendicular line-to-centre distance', '5');
    expect(field(task)).toBe('');
    enter(task, 'tangent');
    submit();
    expect(feedback()).toContain('matches');
    expect(
      v.container.querySelectorAll('[data-cyclic-point="T=M"]'),
    ).toHaveLength(1);
    expect(v.container.querySelector('[data-cyclic-point="T"]')).toBeNull();
    expect(v.container.querySelector('svg')!.textContent).not.toContain('null');
    slide('Perpendicular line-to-centre distance', '6');
    enter(task, 'disjoint');
    submit();
    expect(feedback()).toContain('matches');
    expect(
      screen.queryByRole('textbox', { name: 'Exact chord AB length' }),
    ).toBeNull();
  });
  it('handles a diameter with zero perpendicular distance without a degenerate right-angle mark', () => {
    const v = render(<ChordLineView mode="en" distance={0} shown />);
    expect(v.container.querySelector('[data-cyclic-right]')).toBeNull();
    expect(v.container.textContent).toContain('AB = 10 cm');
  });
  it('uses equal-radii base angles and removes triangle reasoning at a straight sweep', () => {
    const v = render(<CircleGeometryLab kind="cyclic-elements" mode="en" />);
    choose('Circle-elements case', 'central');
    enter(task, '30');
    submit();
    expect(feedback()).toContain('matches');
    slide('Minor central angle θ', '30');
    click('Show or hide premise audit');
    expect(v.container.querySelectorAll('[data-cyclic-angle]')).toHaveLength(1);
    expect(
      v.container.querySelector('[data-cyclic-angle] text')!.textContent,
    ).toBe('75°');
    slide('Minor central angle θ', '180');
    expect(field(task)).toBe('');
    expect(v.container.querySelector('[data-cyclic-angle]')).toBeNull();
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide premise audit');
    expect(
      screen.getByRole('status', { name: 'Circle-geometry premise audit' })
        .textContent,
    ).toContain('collinear');
  });
  it('switches intercepted arcs when the vertex moves across the chord and preserves viewing changes', () => {
    const v = render(<CircleGeometryLab kind="cyclic-inscribed" mode="en" />);
    enter(task, '40');
    submit();
    click('Rotate the entire diagram only');
    click('Change display zoom only');
    expect(field(task)).toBe('40');
    choose('Arc containing vertex P', 'selected');
    expect(field(task)).toBe('');
    enter(task, '40');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '140');
    submit();
    expect(feedback()).toContain('matches');
    expect(
      v.container.querySelector('[data-cyclic-intercepted]')!.getAttribute('d'),
    ).toContain('0 1 0');
    slide('Selected counterclockwise sweep', '180');
    enter(task, '90');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('requires contact premises for lengths and angles and removes false right-angle marks', () => {
    const v = render(<CircleGeometryLab kind="cyclic-tangents" mode="en" />);
    for (const [i, a] of [
      ['0', '4'],
      ['1', '12'],
      ['2', 'sqrt(24)'],
    ]) {
      choose('Tangent case', i!);
      enter(task, a!);
      submit();
      expect(feedback()).toContain('matches');
      expect(v.container.querySelectorAll('[data-cyclic-right]')).toHaveLength(
        2,
      );
    }
    choose('Tangent case', '3');
    enter(task, '80');
    submit();
    expect(feedback()).toContain('matches');
    slide('Minor central angle between contacts', '140');
    expect(field(task)).toBe('');
    enter(task, '40');
    submit();
    expect(feedback()).toContain('matches');
    choose('Tangent case', '4');
    expect(v.container.querySelectorAll('[data-cyclic-right]')).toHaveLength(0);
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('checks exact pi quantities, major sweeps and changed requested dimensions', () => {
    const v = render(<CircleGeometryLab kind="cyclic-sector" mode="en" />);
    enter(task, '2π cm');
    submit();
    expect(feedback()).toContain('matches');
    click('Rotate the entire diagram only');
    click('Change display zoom only');
    expect(field(task)).toBe('2π cm');
    choose('Requested sector quantity', 'area');
    expect(field(task)).toBe('');
    enter(task, '6π cm');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '6π cm²');
    submit();
    expect(feedback()).toContain('matches');
    slide('Selected sector sweep', '300');
    enter(task, '30π');
    submit();
    expect(feedback()).toContain('matches');
    expect(
      v.container.querySelector('[data-cyclic-sector]')!.getAttribute('d'),
    ).toContain('0 1 0');
    click('Show or hide premise audit');
    expect(
      screen.getByRole('status', { name: 'Circle-geometry premise audit' })
        .textContent,
    ).toContain('2r=12');
  });
  it('rejects early conclusions, builds dependency order and keeps proof sketches through view transforms', () => {
    render(<CircleGeometryLab kind="cyclic-proof" mode="en" />);
    choose('Circle proof case', '1');
    click('Substitute nine and twenty-five and take positive length fifteen');
    expect(
      screen.getByRole('status', { name: 'Proof-dependency feedback' })
        .textContent,
    ).toContain('lacks');
    expect(
      screen.getByRole('list', { name: 'Established proof steps' }).children,
    ).toHaveLength(0);
    for (const name of [
      'Angle ABC subtending the diameter is 90°',
      'Use common A and right angles: ADB∼ABC by AA',
      'AD/AB=AB/AC, hence AB²=AD·AC',
      'Substitute nine and twenty-five and take positive length fifteen',
    ])
      click(name);
    expect(
      screen.getByRole('list', { name: 'Established proof steps' }).children,
    ).toHaveLength(4);
    enter(task, '15');
    submit();
    fireEvent.change(screen.getByRole('textbox', { name: 'My proof sketch' }), {
      target: {
        value:
          'Diameter gives B right, altitude gives D right; AA then the whole-side proportion gives AB squared 225.',
      },
    });
    click('Rotate the entire diagram only');
    expect(field(task)).toBe('15');
    expect(
      (
        screen.getByRole('textbox', {
          name: 'My proof sketch',
        }) as HTMLTextAreaElement
      ).value,
    ).toContain('AA');
    click('Undo the last proof step');
    expect(
      screen.getByRole('list', { name: 'Established proof steps' }).children,
    ).toHaveLength(3);
  });
  it('does not invent concyclicity to enable an opposite-angle theorem', () => {
    render(<CircleGeometryLab kind="cyclic-proof" mode="en" />);
    choose('Circle proof case', '2');
    click('Opposite angles of a cyclic quadrilateral sum to 180°');
    expect(
      screen.getByRole('status', { name: 'Proof-dependency feedback' })
        .textContent,
    ).toContain('lacks');
    expect(
      screen.getByRole('list', { name: 'Established proof steps' }).children,
    ).toHaveLength(0);
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('draws actual concyclic and nonconcyclic points and preserves diameter point identities', () => {
    const v = render(<CircleProofView mode="en" index={0} />);
    const points = [
      ...v.container.querySelectorAll('[data-cyclic-point] circle'),
    ].map((e) => ({
      x: Number(e.getAttribute('cx')),
      y: Number(e.getAttribute('cy')),
    }));
    for (const p of points)
      expect(Math.hypot(p.x - 340, p.y - 220)).toBeCloseTo(125);
    v.rerender(<CircleProofView mode="en" index={2} />);
    const c = v.container.querySelector('[data-cyclic-point="C"] circle')!;
    expect(
      Math.hypot(
        Number(c.getAttribute('cx')) - 340,
        Number(c.getAttribute('cy')) - 220,
      ),
    ).not.toBeCloseTo(125);
    v.rerender(<CircleProofView mode="en" index={1} shown />);
    expect(
      [...v.container.querySelectorAll('[data-cyclic-point]')].map((e) =>
        e.getAttribute('data-cyclic-point'),
      ),
    ).toEqual(['A', 'B', 'C', 'D']);
    expect(v.container.querySelectorAll('[data-cyclic-right]')).toHaveLength(2);
  });
  it('uses visible SVG-native bilingual text and correctly closes full-circle and major sectors', () => {
    const v = render(<InscribedView mode="bilingual" sweep={80} />);
    expect(v.container.querySelector('svg span')).toBeNull();
    expect(v.container.querySelectorAll('text tspan')).toHaveLength(4);
    expect(
      v.container.querySelectorAll('text tspan')[1]!.textContent,
    ).toContain('Selected counterclockwise');
    v.rerender(<SectorGeometryView mode="en" radius={6} sweep={360} />);
    expect(
      v.container
        .querySelector('[data-cyclic-sector]')!
        .getAttribute('d')!
        .match(/A/g),
    ).toHaveLength(2);
    v.rerender(<SectorGeometryView mode="en" radius={6} sweep={300} />);
    expect(
      v.container.querySelector('[data-cyclic-sector]')!.getAttribute('d'),
    ).toMatch(/^M340 220L/);
  });
  it('renders five hooks and two worked examples per language', () => {
    for (const l of j95Lessons) {
      const v = render(
        <CircleGeometryHookArt
          kind={l.lab as Parameters<typeof CircleGeometryHookArt>[0]['kind']}
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
    const v = mount('/math/lesson/J95-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('J95 formal learning, exact answers and parent reasoning', () => {
  it('restores wrong-then-right answers in all five lessons without awarding whole-course completion', () => {
    for (const [id, wrong, right] of [
      ['J95-L01', 'tangent', 'secant'],
      ['J95-L02', '80', '40'],
      ['J95-L03', '5', '4'],
      ['J95-L04', '6π', '2π cm'],
      ['J95-L05', '70', '110'],
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
  it('keeps a diameter-altitude proof human-reviewed through refresh', () => {
    const v = mount('/math/lesson/J95-L05');
    click(/06 Reflect/);
    const text =
      'The diameter gives angle ABC ninety. The altitude gives ADB ninety, sharing A gives AA in order ADB to ABC. AD/AB=AB/AC, so AB squared is 9 times 25 and positive length is 15 cm.';
    enter('Your reasoning', text);
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    parent();
    v.unmount();
    mount('/math/lesson/J95-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J95-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves eight unit answers including two separate human reviews without changing course mastery', () => {
    const v = mount('/math/unit/J95/check');
    for (const [n, a] of Object.entries({
      1: 'tangent',
      2: '140',
      3: '√24',
      4: '6π cm²',
      5: '15',
    })) {
      click(`Question ${n}`);
      enter('Your answer', a);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'Perpendicularity must be at the radius endpoint on the circle. Else a perpendicular through the centre is a secant.',
    );
    parent();
    click('Question 7');
    click('B (12+2π) cm');
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Diameter and on-circle B give a right angle, the perpendicular foot gives another and A is shared. ADB is similar to ABC; AD/AB=AB/AC, so AB squared 225 and length 15 cm.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J95/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J95-L05'],
    ).toBeUndefined();
  });
  it('changes exact tangent retrieval quantities and clears the previous response', () => {
    const v = mount('/math/lesson/J95-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '13');
    check();
    enter('Your answer', '12');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '√7');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J95-L03'].round).toBe(1);
    saved.sessions['J95-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '3');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
