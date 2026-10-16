// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CongruenceLab, CongruenceHookArt } from './CongruenceLabs';
import { CongruenceDiagram } from './CongruenceVisuals';
import { j86Lessons } from './content/J86';
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
const task = 'My geometry conclusion',
  submit = () => click('Check geometry conclusion'),
  feedback = () =>
    screen.getByRole('status', { name: 'Congruence feedback' }).textContent;
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
describe('J86 corresponding conditions and proof workshops', () => {
  it('keeps correspondence across rigid poses but distinguishes genuine enlargement during overlay', () => {
    const v = render(<CongruenceLab kind="congruence-meaning" mode="en" />);
    const order = 'Triangle matching the order ABC',
      verdict = 'Are these actual triangles congruent';
    enter(order, 'DEF');
    enter(verdict, 'congruent');
    slide('Second triangle rotation', '120');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Reflect second triangle' }),
    );
    click('Test or undo overlay');
    expect(field(order)).toBe('DEF');
    expect(field(verdict)).toBe('congruent');
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Enlarge the second triangle by 1.5',
      }),
    );
    expect(field(verdict)).toBe('');
    expect(field(order)).toBe('DEF');
    expect(v.container.textContent).toContain('AB=4, DE=6');
    expect(v.container.querySelectorAll('polygon')).toHaveLength(2);
  });
  it('uses SSS and included-angle SAS from the supplied givens, retaining success across display changes', () => {
    render(<CongruenceLab kind="congruence-sides" mode="en" />);
    enter(task, 'SSS');
    submit();
    expect(feedback()).toContain('matches');
    slide('Second triangle rotation', '90');
    expect(field(task)).toBe('SSS');
    expect(feedback()).toContain('matches');
    choose('Given-condition case', '1');
    expect(field(task)).toBe('');
    enter(task, 'SAS');
    submit();
    expect(feedback()).toContain('matches');
    expect(
      screen.getByRole('group', { name: 'Only supplied givens' }).textContent,
    ).toContain('AB, CA');
  });
  it('rejects general SSA and reveals two actual constructions without changing the givens or existing answer', () => {
    const v = render(<CongruenceLab kind="congruence-sides" mode="en" />);
    choose('Given-condition case', '2');
    enter(task, 'SAS');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'insufficient');
    submit();
    const before = v.container
      .querySelectorAll('polygon')[1]!
      .getAttribute('points');
    click('Show or hide a counterexample with the same givens');
    expect(
      v.container.querySelectorAll('polygon')[1]!.getAttribute('points'),
    ).not.toBe(before);
    expect(
      screen.getByRole('status', {
        name: 'Insufficient-condition counterexample',
      }).textContent,
    ).toContain('different AC');
    expect(field(task)).toBe('insufficient');
    expect(feedback()).toContain('matches');
  });
  it('accepts justified ASA/AAS conversion, rejects AAA and uses a real enlargement counterexample', () => {
    const v = render(<CongruenceLab kind="congruence-angles" mode="en" />);
    enter(task, 'AAS');
    submit();
    expect(feedback()).toContain('matches');
    choose('Given-condition case', '1');
    enter(task, 'ASA');
    submit();
    expect(feedback()).toContain('matches');
    choose('Given-condition case', '2');
    enter(task, 'ASA');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'insufficient');
    submit();
    click('Show or hide a counterexample with the same givens');
    expect(
      screen.getByRole('status', {
        name: 'Insufficient-condition counterexample',
      }).textContent,
    ).toContain('enlarged by 1.4');
    expect(v.container.querySelectorAll('[data-equal-side]')).toHaveLength(0);
    expect(v.container.querySelectorAll('[data-equal-angle]')).toHaveLength(6);
  });
  it('distinguishes angle groups by one/two/three arcs rather than marking unequal triangle angles identically', () => {
    const v = render(<CongruenceDiagram source="AAA" mode="en" />);
    const first = v.container.querySelector('[data-triangle-labels="ABC"]')!;
    for (const [name, count] of [
      ['A', 1],
      ['B', 2],
      ['C', 3],
    ] as const)
      expect(
        first
          .querySelector(`[data-equal-angle="${name}"]`)!
          .querySelectorAll('polyline'),
      ).toHaveLength(count);
    expect(
      screen
        .getByRole('region', { name: 'Congruence diagram; scroll locally' })
        .getAttribute('tabindex'),
    ).toBe('0');
  });
  it('separates constructed bisector premises from the target and preserves answers while toggling helpers', () => {
    const v = render(<CongruenceLab kind="congruence-isosceles" mode="en" />);
    expect(v.container.querySelector('[data-base-angles]')).toBeNull();
    enter(task, '65');
    submit();
    click('Construct or hide apex bisector AD');
    expect(v.container.querySelector('[data-angle-bisector]')).toBeTruthy();
    expect(v.container.textContent).toContain('Do not assume the target BD=DC');
    click('Show or hide base-angle calculation');
    expect(
      screen.getByRole('status', { name: 'Isosceles calculation' }).textContent,
    ).toContain('65°');
    expect(field(task)).toBe('65');
    expect(feedback()).toContain('matches');
    slide('Given apex angle', '100');
    expect(field(task)).toBe('');
    expect(v.container.querySelector('[data-base-angles]')).toBeNull();
    enter(task, '40');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('retains complete parallelogram givens during shear/diagonal changes and resets for counterexample conditions', () => {
    const v = render(
      <CongruenceLab kind="congruence-parallelogram" mode="en" />,
    );
    enter(task, 'sufficient');
    submit();
    slide('Change shear (retain the givens)', '-2');
    click('Show or hide diagonals');
    expect(field(task)).toBe('sufficient');
    expect(feedback()).toContain('matches');
    expect(v.container.querySelector('[data-diagonals]')).toBeTruthy();
    choose('Quadrilateral givens', '6');
    expect(field(task)).toBe('');
    enter(task, 'sufficient');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
    expect(v.container.textContent).toContain('actual counterexample');
  });
  it('requires all proof dependencies, rejects circular targets, records a justified chain and recomputes undo status', () => {
    const v = render(<CongruenceLab kind="congruence-proof" mode="en" />);
    click('Add a justified step');
    expect(
      screen.getByRole('status', { name: 'Proof step feedback' }).textContent,
    ).toContain('Missing established premises');
    expect(v.container.querySelectorAll('[data-proof-step]')).toHaveLength(0);
    choose('Proposed proof step', 'circular');
    click('Add a justified step');
    expect(
      screen.getByRole('status', { name: 'Proof step feedback' }).textContent,
    ).toContain('circular');
    for (const id of [
      'common',
      'angle-two',
      'angle-one',
      'congruence',
      'corresponding',
    ]) {
      choose('Proposed proof step', id);
      click('Add a justified step');
    }
    expect(v.container.querySelectorAll('[data-proof-step]')).toHaveLength(5);
    expect(
      screen.getByRole('status', { name: 'Proof target status' }).textContent,
    ).toContain('establishes the target');
    click('Undo final proof step');
    expect(
      screen.getByRole('status', { name: 'Proof target status' }).textContent,
    ).toContain('not yet established');
    expect(v.container.querySelectorAll('[data-proof-step]')).toHaveLength(4);
    choose('Proposed proof step', 'common');
    click('Add a justified step');
    expect(
      screen.getByRole('status', { name: 'Proof step feedback' }).textContent,
    ).toContain('already recorded');
  });
  it('starts a new proof with its own original givens and an independent SAS chain', () => {
    const v = render(<CongruenceLab kind="congruence-proof" mode="en" />);
    choose('Proposed proof step', 'common');
    click('Add a justified step');
    choose('Proof case', '1');
    expect(v.container.querySelectorAll('[data-proof-step]')).toHaveLength(0);
    expect(
      screen.getByRole('group', { name: 'Original proof givens' }).textContent,
    ).toContain('AB=AC');
    expect(
      screen.getByRole('status', { name: 'Proof target status' }).textContent,
    ).toContain('not yet');
    for (const id of ['common', 'congruence', 'corresponding']) {
      choose('Proposed proof step', id);
      click('Add a justified step');
    }
    expect(
      v.container.querySelector('[data-proof-step="congruence"]')!.textContent,
    ).toContain('SAS');
    expect(
      screen.getByRole('status', { name: 'Proof target status' }).textContent,
    ).toContain('establishes');
  });
  it('keeps six opening investigations as questions', () => {
    for (const l of j86Lessons) {
      const v = render(
        <CongruenceHookArt
          kind={l.lab as Parameters<typeof CongruenceHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J86 complete bilingual lessons and parent-reviewed reasoning', () => {
  it('renders six English bodies and both bilingual sections with two complete examples each', () => {
    for (const l of j86Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J86-L06');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores supported retries and original triangle/criterion/angle writing across five generated-answer lessons', () => {
    for (const [id, wrong, right] of [
      ['J86-L01', 'DFE', '△DEF'],
      ['J86-L02', 'SAS', 'sss'],
      ['J86-L03', 'insufficient', 'AAS'],
      ['J86-L04', '130', '65°'],
      ['J86-L05', '70', '110°'],
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
  it('accepts reversed side endpoints but does not freely reorder triangle correspondence', () => {
    const v = mount('/math/lesson/J86-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', 'DE');
    check();
    enter('Your answer', 'FD');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J86-L01');
    expect(field('Your answer')).toBe('FD');
  });
  it('keeps the guided proof in lesson six human-reviewed and restores the original chain after refresh', () => {
    const v = mount('/math/lesson/J86-L06');
    click(/04 Together/);
    enter(
      'Your reasoning',
      'From both parallel pairs obtain the two alternate-angle equalities. AC is common. ASA gives ABC congruent to CDA in that order, then AB equals CD. The target property cannot be its own reason.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    parent();
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J86-L06');
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).value,
    ).toContain('AC is common');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J86-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('requires parent review for an inverse isosceles proof instead of scoring congruence keywords', () => {
    mount('/math/lesson/J86-L04');
    click(/05 Practice/);
    click('Question 5');
    enter(
      'Your reasoning',
      'Construct the apex bisector AD. Given B=C and equal apex halves, plus shared AD, AAS gives ABD congruent to ACD. Only then conclude AB=AC; assuming it first would be circular.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    parent();
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
  });
  it('keeps an exit proof human-reviewed without completing unworked practice', () => {
    mount('/math/lesson/J86-L06');
    click(/06 Reflect/);
    enter(
      'Your reasoning',
      'A=D,C=F and AB=DE give AAS; alternatively derive the third angle and use ASA. Match ABC with DEF, then corresponding BC=EF follows. BC=EF must not be assumed first.',
    );
    parent();
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J86-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves eight independent unit-check records with two separate human-proof reviews', () => {
    const v = mount('/math/unit/J86/check');
    for (const [n, value] of Object.entries({
      1: 'DFE',
      2: 'SAS',
      3: 'ASA',
      4: '50',
      5: 'insufficient',
    })) {
      click(`Question ${n}`);
      enter('Your answer', value);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'Use given AB=AC, the constructed equal apex halves and common AD for SAS. With ABD corresponding to ACD, conclude BD=DC afterwards rather than assuming it.',
    );
    parent();
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'State givens and target. Match vertices, establish side and angle premises, invoke a valid congruence rule, then take corresponding conclusions. AAA enlargement and SSA alternatives show why counting three conditions is insufficient. Never assume the target to prove itself.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J86/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J86-L06'],
    ).toBeUndefined();
  });
  it('changes review angles without inheriting the preceding answer and successful feedback', () => {
    const v = mount('/math/lesson/J86-L04');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '20');
    check();
    enter('Your answer', '40');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '80');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J86-L04'].round).toBe(1);
    saved.sessions['J86-L04'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '79');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
