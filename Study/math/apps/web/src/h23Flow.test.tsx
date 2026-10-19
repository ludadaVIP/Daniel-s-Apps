// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SpaceVectorLab, SpaceVectorHookArt } from './SpaceVectorLabs';
import { SolidScene } from './SolidVisuals';
import { h23Lessons } from './content/H23';
import { App } from './App';
import { t } from './model';
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
describe('H23 spatial models, camera invariants and independent learning records', () => {
  it('preserves displacement and length under shared translation while changing midpoint coordinates', () => {
    const v = render(<SpaceVectorLab kind="spatial-coordinates" mode="en" />),
      u = 'Predict the three components of AB',
      m = 'Predict midpoint M coordinates',
      len = 'Predict exact length AB';
    enter(u, '(3,4,-4)');
    check(u);
    enter(m, '(5/2,0,1)');
    check(m);
    enter(len, 'sqrt(41)');
    check(len);
    select('Translate both points', '1');
    expect(field(u)).toBe('(3,4,-4)');
    expect(field(len)).toBe('sqrt(41)');
    expect(field(m)).toBe('');
    enter(m, '(9/2,-1,2)');
    check(m);
    click('Show/hide audit');
    const arrow = v.container.querySelector('[data-space-segment="AB"]');
    expect(arrow?.getAttribute('data-space-start')).toBe('3,-3,4');
    expect(arrow?.getAttribute('data-space-end')).toBe('6,1,0');
    expect(arrow?.getAttribute('marker-end')).toContain('spatial-arrow');
    click('Change camera');
    expect(field(u)).toBe('(3,4,-4)');
    expect(feedback(m)).toContain('matches');
  });
  it('applies all three component operations and keeps unused v from clearing a scalar result', () => {
    const v = render(<SpaceVectorLab kind="spatial-operations" mode="en" />),
      w = 'Predict result vector w';
    enter(w, '(3,1,2)');
    check(w);
    expect(feedback(w)).toContain('matches');
    select('Linear operation', 'subtract');
    expect(field(w)).toBe('');
    enter(w, '(-1,3,-4)');
    check(w);
    select('Linear operation', 'combine');
    enter(w, '(0,5,-5)');
    check(w);
    expect(feedback(w)).toContain('matches');
    select('Linear operation', 'scale');
    select('Scalar k', '-2');
    enter(w, '(-2,-4,2)');
    check(w);
    select('Vector v', '2');
    expect(field(w)).toBe('(-2,-4,2)');
    select('Scalar k', '0');
    enter(w, '(0,0,0)');
    check(w);
    click('Show/hide audit');
    expect(
      v.container
        .querySelector('[data-space-segment="ku"]')
        ?.getAttribute('marker-end'),
    ).toBeNull();
    expect(feedback(w)).toContain('matches');
  });
  it('separates zero dot product from angle existence and preserves independent unchanged evidence', () => {
    render(<SpaceVectorLab kind="spatial-dot" mode="en" />);
    const dot = 'Predict dot product u·v',
      cos = 'Predict cosθ or undefined',
      type = 'Predict angle type';
    enter(dot, '0');
    check(dot);
    enter(cos, '0');
    check(cos);
    enter(type, 'right');
    check(type);
    select('Vector u', '2');
    expect(field(dot)).toBe('0');
    expect(field(cos)).toBe('');
    enter(cos, '0');
    check(cos);
    expect(feedback(cos)).not.toContain('matches');
    enter(cos, 'undefined');
    check(cos);
    enter(type, 'undefined');
    check(type);
    expect(feedback(type)).toContain('matches');
    select('Vector u', '0');
    select('Angle vector v', '2');
    enter(cos, '-1');
    check(cos);
    enter(type, 'straight');
    check(type);
    expect(feedback(cos)).toContain('matches');
    select('Angle vector v', '3');
    enter(cos, 'sqrt(6)/6');
    check(cos);
    click('Change camera');
    expect(field(cos)).toBe('sqrt(6)/6');
  });
  it('distinguishes containment, strict parallelism, unique intersection and perpendicular line-plane directions', () => {
    const v = render(<SpaceVectorLab kind="spatial-relations" mode="en" />),
      kind = 'Predict positional relation';
    enter(kind, 'parallel');
    check(kind);
    select('Spatial configuration', '1');
    enter(kind, 'contained');
    check(kind);
    expect(feedback(kind)).toContain('matches');
    select('Spatial configuration', '2');
    enter(kind, 'intersecting');
    check(kind);
    click('Show/hide audit');
    expect(
      v.container.querySelector('[data-space-coordinate="1,0,0"]'),
    ).toBeTruthy();
    select('Spatial configuration', '3');
    enter(kind, 'intersecting');
    check(kind);
    click('Show/hide audit');
    expect(screen.getByText(/u is parallel to n/)).toBeTruthy();
    click('Change camera');
    expect(feedback(kind)).toContain('matches');
  });
  it('keeps skew directions from implying intersection and draws both actual plane patches', () => {
    const v = render(<SpaceVectorLab kind="spatial-relations" mode="en" />),
      kind = 'Predict positional relation';
    select('Relation objects', 'line-line');
    enter(kind, 'skew');
    check(kind);
    enter('Predict u·v', '0');
    check('Predict u·v');
    expect(feedback(kind)).toContain('matches');
    select('Spatial configuration', '1');
    enter(kind, 'intersecting');
    check(kind);
    select('Relation objects', 'plane-plane');
    expect(v.container.querySelectorAll('[data-solid-face]')).toHaveLength(2);
    enter(kind, 'parallel');
    check(kind);
    select('Spatial configuration', '1');
    enter(kind, 'coincident');
    check(kind);
    select('Spatial configuration', '2');
    enter(kind, 'intersecting');
    check(kind);
    expect(feedback(kind)).toContain('matches');
  });
  it('constructs distinct feet for plane and line and preserves geometry under nonzero scaling', () => {
    const v = render(<SpaceVectorLab kind="spatial-distance" mode="en" />),
      foot = 'Predict spatial foot H',
      distance = 'Predict exact spatial distance';
    enter(foot, '(1,0,1)');
    check(foot);
    enter(distance, '6');
    check(distance);
    select('Nonzero direction or equation scale', '-2');
    expect(field(foot)).toBe('(1,0,1)');
    expect(field(distance)).toBe('6');
    click('Show/hide audit');
    expect(
      v.container
        .querySelector('[data-space-segment="PH"]')
        ?.getAttribute('data-space-end'),
    ).toBe('1,0,1');
    expect(
      screen.getByRole('region', { name: 'Spatial distance audit' })
        .textContent,
    ).toContain('n·H−d0');
    click('Change camera');
    expect(field(distance)).toBe('6');
    select('Distance object', 'line');
    expect(field(foot)).toBe('');
    enter(foot, '(4,3,1)');
    check(foot);
    enter(distance, '3sqrt(2)');
    check(distance);
    expect(feedback(distance)).toContain('matches');
    select('Spatial point P', '1');
    enter(foot, '(2,1,1)');
    check(foot);
    enter(distance, '0');
    check(distance);
    expect(feedback(distance)).toContain('matches');
  });
  it('renders five distinct hooks and both authored languages with valid arrow colours and semantic projection warnings', () => {
    for (const l of h23Lessons) {
      const v = render(
        <SpaceVectorHookArt
          kind={l.lab as Parameters<typeof SpaceVectorHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(
        screen.getByRole('img', { name: /Orthographic spatial model/ }),
      ).toBeTruthy();
      for (const node of v.container.querySelectorAll('[stroke],[fill]'))
        for (const attr of ['stroke', 'fill']) {
          const s = node.getAttribute(attr);
          if (s?.startsWith('#'))
            expect(s).toMatch(/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i);
        }
      v.unmount();
      const w = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(screen.getByRole('heading', { name: /Example 1:/ })).toBeTruthy();
      expect(screen.getByRole('heading', { name: /Example 2:/ })).toBeTruthy();
      click('中文');
      expect(screen.getByRole('heading', { name: /例1/ })).toBeTruthy();
      w.unmount();
      localStorage.setItem('study-language', 'en');
    }
  });
  it('restores five corrected guided answers without completing unfinished independent practice', () => {
    for (const [id, value] of [
      ['H23-L01', '(3,4,-4)'],
      ['H23-L02', '(3,1,2)'],
      ['H23-L03', '0'],
      ['H23-L04', 'parallel'],
      ['H23-L05', '6'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '999');
      click(/Check answer/);
      enter('Your answer', value!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(value);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('keeps the zero-vector counterexample human-reviewed and preserves the original explanation', () => {
    const v = mount('/math/lesson/H23-L03');
    click(/^06 Reflect/);
    const text =
      'Zero vector u and v=(1,2,3) have dot zero but no defined angle because the denominator vanishes. For both vectors nonzero, dot zero gives a right angle. Vectors (1,2,-1),(2,-1,0) give a valid nonzero example with dot 2-2+0=0.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H23-L03']
        .answers['H23-L03-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H23-L03');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('stores all eight unit answers and two human reviews independently from individual lesson mastery', () => {
    const v = mount('/math/unit/H23/check');
    for (const [n, value] of [
      ['1', '(3,4,-4)'],
      ['2', '(3,1,2)'],
      ['3', '0'],
      ['4', 'parallel'],
      ['5', '6'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', value!);
      click(/Check answer/);
    }
    click('Question 6');
    click('C Test A: the line may be contained or strictly parallel');
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'A zero vector has dot zero but no angle. Require both vectors nonzero; then dot zero means cosine zero, a right angle. For (1,2,-1),(2,-1,0), dot is zero and both norms are nonzero.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'For P=(3,4,5), plane foot (1,0,1) gives normal residual (2,4,4) and distance 6. Line foot (4,3,1) gives residual (-1,1,4), dot zero with (1,1,0), and distance 3sqrt(2). Scale both plane normal and RHS by -2 without changing the plane; scale the line direction by -2 and its parameter changes from 3 to -3/2, with the same foot and distance.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H23/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H23-L01'],
    ).toBeUndefined();
  });
  it('changes due triple retrievals without inheriting the previous answer or success', () => {
    const v = mount('/math/lesson/H23-L02');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '(0,0,0)');
    click(/Check answer/);
    enter('Your answer', '(-1,3,-4)');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '(-1,-2,3)');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H23-L02'].round).toBe(1);
    saved.sessions['H23-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '(-1,-2,3)');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '(-2,0,-1)');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('keeps existing H06 solid segments as ordinary segments unless arrows are explicitly requested', () => {
    const v = render(
      <SolidScene
        mode="en"
        points={[
          { name: 'A', point: [0, 0, 0] },
          { name: 'B', point: [1, 0, 0] },
        ]}
        segments={[{ name: 'AB', a: [0, 0, 0], b: [1, 0, 0] }]}
        caption={t('测试', 'Test')}
      />,
    );
    expect(
      v.container
        .querySelector('[data-space-segment="AB"]')
        ?.getAttribute('marker-end'),
    ).toBeNull();
    expect(
      v.container
        .querySelector('[data-space-segment="AB"]')
        ?.getAttribute('data-space-arrow'),
    ).toBeNull();
  });
});
