// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SolidLab, SolidHookArt } from './SolidLabs';
import { h06Lessons } from './content/H06';
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
describe('H06 spatial models and durable learning evidence', () => {
  it('preserves spatial incidence under camera changes and separates ten line/plane cases', () => {
    const v = render(<SolidLab kind="solid-relations" mode="en" />);
    enter('Predict spatial relation', 'skew');
    check('Predict spatial relation');
    expect(feedback('Predict spatial relation')).toContain('matches');
    const before = [
      ...v.container.querySelectorAll('[data-space-segment]'),
    ].map((e) => [
      e.getAttribute('data-space-start'),
      e.getAttribute('data-space-end'),
    ]);
    click('Change camera');
    expect(field('Predict spatial relation')).toBe('skew');
    expect(feedback('Predict spatial relation')).toContain('matches');
    expect(
      [...v.container.querySelectorAll('[data-space-segment]')].map((e) => [
        e.getAttribute('data-space-start'),
        e.getAttribute('data-space-end'),
      ]),
    ).toEqual(before);
    for (const [kind, a] of [
      ['parallel', 'parallel'],
      ['intersecting', 'intersecting'],
      ['coincident', 'coincident'],
      ['line-contained', 'contained'],
      ['line-parallel', 'parallel'],
      ['line-intersecting', 'intersecting'],
      ['planes-intersecting', 'intersecting'],
      ['planes-parallel', 'parallel'],
      ['planes-coincident', 'coincident'],
    ]) {
      select('Relationship case', kind!);
      expect(field('Predict spatial relation')).toBe('');
      enter('Predict spatial relation', a!);
      check('Predict spatial relation');
      expect(feedback('Predict spatial relation')).toContain('matches');
    }
  });
  it('keeps structure and volume invariant under shear but resets only height-dependent work', () => {
    render(<SolidLab kind="solid-types" mode="en" />);
    enter('Predict flat face count', '8');
    enter('Predict edge count', '18');
    enter('Predict volume (cm³)', '72 cm³');
    check('Predict volume (cm³)');
    expect(feedback('Predict volume (cm³)')).toContain('matches');
    select('Top shear (cm)', '2');
    expect(field('Predict flat face count')).toBe('8');
    expect(field('Predict volume (cm³)')).toBe('72 cm³');
    select('Perpendicular height h (cm)', '3');
    expect(field('Predict flat face count')).toBe('8');
    expect(field('Predict edge count')).toBe('18');
    expect(field('Predict volume (cm³)')).toBe('');
    enter('Predict volume (cm³)', '36');
    select('Base side count n', '4');
    expect(field('Predict volume (cm³)')).toBe('36');
    expect(field('Predict flat face count')).toBe('');
    select('Solid type', 'pyramid');
    enter('Predict volume (cm³)', '12');
    check('Predict volume (cm³)');
    expect(feedback('Predict volume (cm³)')).toContain('matches');
  });
  it('treats spherical circles as guides and checks exact pi volume with cubic units', () => {
    const v = render(<SolidLab kind="solid-types" mode="en" />);
    select('Solid type', 'sphere');
    enter('Predict flat face count', '0');
    enter('Predict edge count', '0');
    check('Predict edge count');
    enter('Predict volume (cm³)', '36pi cm²');
    check('Predict volume (cm³)');
    expect(feedback('Predict volume (cm³)')).not.toContain('matches');
    enter('Predict volume (cm³)', '36pi cm³');
    check('Predict volume (cm³)');
    expect(feedback('Predict volume (cm³)')).toContain('matches');
    expect(v.container.querySelectorAll('[data-sphere-guide]')).toHaveLength(3);
    expect(v.container.querySelectorAll('[data-space-segment]')).toHaveLength(
      1,
    );
    select('Radius r (cm)', '2');
    expect(field('Predict edge count')).toBe('0');
    expect(field('Predict volume (cm³)')).toBe('');
  });
  it('shows exact hexagon and triangle sections while retaining tangent-edge and point boundaries', () => {
    const v = render(<SolidLab kind="solid-sections" mode="en" />);
    enter('Predict section vertex count', '6');
    enter('Predict section area (cm²)', '12sqrt(3)');
    check('Predict section area (cm²)');
    expect(feedback('Predict section area (cm²)')).toContain('matches');
    expect(
      v.container.querySelector('[data-solid-face="exact-section"]'),
    ).toBeTruthy();
    click('Change camera');
    expect(field('Predict section vertex count')).toBe('6');
    select('Plane parameter t', '2');
    enter('Predict section area (cm²)', '2sqrt(3)');
    check('Predict section area (cm²)');
    expect(feedback('Predict section area (cm²)')).toContain('matches');
    select('Plane parameter t', '0');
    enter('Predict section vertex count', '1');
    check('Predict section vertex count');
    expect(feedback('Predict section vertex count')).toContain('matches');
    select('Cutting plane direction', 'edge');
    enter('Predict section vertex count', '2');
    enter('Predict section area (cm²)', '0');
    check('Predict section area (cm²)');
    expect(feedback('Predict section area (cm²)')).toContain('matches');
    expect(
      v.container.querySelector('[data-solid-face="exact-section"]'),
    ).toBeNull();
    select('Cutting plane direction', 'horizontal');
    enter('Predict section vertex count', '4');
    enter('Predict section area (cm²)', '16');
    check('Predict section area (cm²)');
    expect(feedback('Predict section area (cm²)')).toContain('matches');
  });
  it('retains numbered net predictions through folding and does not assign an opposite for invalid arrangements', () => {
    const v = render(<SolidLab kind="solid-sections" mode="en" />);
    select('Study sections or nets', 'net');
    enter('Predict net validity', 'valid-net');
    enter('Predict face opposite 1 (invalid: undefined)', '3');
    check('Predict net validity');
    check('Predict face opposite 1 (invalid: undefined)');
    expect(feedback('Predict face opposite 1 (invalid: undefined)')).toContain(
      'matches',
    );
    click('Toggle net/fold audit');
    expect(field('Predict net validity')).toBe('valid-net');
    expect(
      v.container.querySelectorAll('section:not([hidden]) [data-solid-face]'),
    ).toHaveLength(6);
    click('Change camera');
    expect(field('Predict face opposite 1 (invalid: undefined)')).toBe('3');
    select('Six-square arrangement', 'rectangle');
    expect(field('Predict net validity')).toBe('');
    enter('Predict net validity', 'invalid-net');
    enter('Predict face opposite 1 (invalid: undefined)', 'undefined');
    check('Predict net validity');
    check('Predict face opposite 1 (invalid: undefined)');
    expect(feedback('Predict net validity')).toContain('matches');
    expect(feedback('Predict face opposite 1 (invalid: undefined)')).toContain(
      'matches',
    );
  });
  it('keeps section and net work independently when switching the two activities', () => {
    render(<SolidLab kind="solid-sections" mode="en" />);
    enter('Predict section vertex count', '6');
    select('Study sections or nets', 'net');
    enter('Predict net validity', 'valid-net');
    select('Study sections or nets', 'section');
    expect(field('Predict section vertex count')).toBe('6');
    select('Study sections or nets', 'net');
    expect(field('Predict net validity')).toBe('valid-net');
  });
  it('uses different perpendicular segments and angle rays while preserving independent distance tasks', () => {
    const v = render(<SolidLab kind="solid-distances" mode="en" />);
    enter('Predict base diagonal AC (cm)', '5');
    enter('Predict target distance (cm)', '13');
    enter('Predict cosine of the requested acute angle', '12/13');
    check('Predict cosine of the requested acute angle');
    expect(
      feedback('Predict cosine of the requested acute angle'),
    ).not.toContain('matches');
    enter('Predict cosine of the requested acute angle', '5/13');
    check('Predict cosine of the requested acute angle');
    expect(feedback('Predict cosine of the requested acute angle')).toContain(
      'matches',
    );
    select('Angle target', 'line');
    enter('Predict cosine of the requested acute angle', '3/13');
    check('Predict cosine of the requested acute angle');
    expect(feedback('Predict cosine of the requested acute angle')).toContain(
      'matches',
    );
    for (const [target, a] of [
      ['pointPlane', '12'],
      ['pointLine', '4sqrt(10)'],
      ['skewDistance', '4'],
    ]) {
      select('Distance target', target!);
      expect(field('Predict target distance (cm)')).toBe('');
      enter('Predict target distance (cm)', a!);
      check('Predict target distance (cm)');
      expect(feedback('Predict target distance (cm)')).toContain('matches');
    }
    select('Base edge a (cm)', '6');
    expect(field('Predict target distance (cm)')).toBe('4');
    select('Base edge a (cm)', '3');
    enter('Predict base diagonal AC (cm)', '5');
    select('Height h (cm)', '3');
    expect(field('Predict base diagonal AC (cm)')).toBe('5');
    expect(field('Predict target distance (cm)')).toBe('4');
    expect(
      v.container
        .querySelector('[data-space-segment="shortest-segment"]')
        ?.getAttribute('data-space-start'),
    ).toBe('3,0,0');
  });
  it('removes both contact patches and preserves volume under repositioning while scaling safely to three', () => {
    const v = render(<SolidLab kind="solid-composite" mode="en" />);
    enter('Predict total volume (cm³)', '60');
    enter('Predict contact area (cm²)', '6');
    enter('Predict exposed surface area (cm²)', '114');
    check('Predict exposed surface area (cm²)');
    expect(feedback('Predict exposed surface area (cm²)')).not.toContain(
      'matches',
    );
    enter('Predict exposed surface area (cm²)', '108');
    check('Predict exposed surface area (cm²)');
    expect(feedback('Predict exposed surface area (cm²)')).toContain('matches');
    select('Assembly case', 'side');
    expect(field('Predict total volume (cm³)')).toBe('60');
    expect(field('Predict contact area (cm²)')).toBe('');
    enter('Predict exposed surface area (cm²)', '112');
    check('Predict exposed surface area (cm²)');
    expect(feedback('Predict exposed surface area (cm²)')).toContain('matches');
    select('Assembly case', 'gap');
    expect(
      v.container.querySelector('[data-solid-face="buried-contact"]'),
    ).toBeNull();
    enter('Predict exposed surface area (cm²)', '120');
    check('Predict exposed surface area (cm²)');
    expect(feedback('Predict exposed surface area (cm²)')).toContain('matches');
    select('Assembly case', 'top');
    select('Scale of every length', '3');
    enter('Predict total volume (cm³)', '1620');
    enter('Predict exposed surface area (cm²)', '972');
    check('Predict exposed surface area (cm²)');
    expect(feedback('Predict exposed surface area (cm²)')).toContain('matches');
    click('Change camera');
    click('Show/hide audit');
    expect(field('Predict exposed surface area (cm²)')).toBe('972');
  });
  it('renders five complete bilingual bodies and matching concise hooks without answer inputs', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const l of h06Lessons) {
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
        <SolidHookArt
          kind={l.lab as Parameters<typeof SolidHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(w.container.querySelector('svg')).toBeTruthy();
      expect(w.container.querySelector('foreignObject')).toBeNull();
      expect(w.container.querySelector('input')).toBeNull();
      if (l.id === 'H06-L03')
        expect(w.container.querySelectorAll('[data-net-face]')).toHaveLength(6);
      if (l.id === 'H06-L04')
        expect(
          w.container
            .querySelector('[data-space-segment="AG"]')
            ?.getAttribute('data-space-end'),
        ).toBe('3,4,12');
      w.unmount();
    }
  });
  it('restores corrected guided work in every lesson without completing unworked practice', () => {
    for (const [id, a] of [
      ['H06-L01', 'skew'],
      ['H06-L02', '8'],
      ['H06-L03', '16'],
      ['H06-L04', '13'],
      ['H06-L05', '60'],
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
  it('retains boundary-section explanations for human review rather than scoring keywords', () => {
    const v = mount('/math/lesson/H06-L03');
    click(/^06 Reflect/);
    const text =
      'For z=0 the whole bottom square remains, area16. For x+y=0 with x,y nonnegative, x=y=0, leaving one vertical edge of zero area. At x+y+z=0 only the origin remains. A point or edge must not be drawn as a polygon.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H06-L03']
        .answers['H06-L03-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H06-L03');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records all eight unit answers with independent angle and scaled-material arguments, then restores them', () => {
    const v = mount('/math/unit/H06/check');
    for (const [n, a] of [
      ['1', 'skew'],
      ['2', '24'],
      ['3', 'invalid-net'],
      ['4', '13'],
      ['5', '108'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', a!);
      click(/Check answer/);
    }
    click('Question 6');
    click(/^C Folded faces must be distinct/);
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'AC=5,AG=13,GC=12. The line-plane angle uses AG and projection AC, so cosine5/13 and sine12/13. The complementary vertical angle has cosine12/13. A camera angle is not a measurement.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'With length factor10, volume is60×1000=60000 cm³=60 L, and exposed area108×100=10800 cm²=1.08 m². Sheet quotient2.16 rounds up to3 whole sheets. This assumes no interior overlap, zero thickness, no glue seam or cutting loss.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H06/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H06-L01'],
    ).toBeUndefined();
  });
  it('retrieves a space diagonal then point-plane distance without carrying the old input or success', () => {
    const v = mount('/math/lesson/H06-L04');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '13');
    click(/Check answer/);
    enter('Your answer', '12');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', 'sqrt(29)');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H06-L04'].round).toBe(1);
    saved.sessions['H06-L04'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '2');
    click(/Check answer/);
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
