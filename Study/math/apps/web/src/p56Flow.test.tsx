// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { GeometryLab } from './GeometryLabs';
import { SurfaceNet, AreaRearrangement } from './GeometryVisuals';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { p56Lessons } from './content/P56';
vi.setConfig({ testTimeout: 20000 });
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
const click = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name }));
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const tick = (name: string) =>
  fireEvent.click(screen.getByRole('checkbox', { name }));
const next = () => click('I predicted; reveal the next step');
const enter = (value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
    target: { value },
  });
const check = () =>
  fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );

describe('P56 geometry workshops', () => {
  it('separates the whole from a zoomed subunit and resets the checked factor when dimension changes', () => {
    const view = render(<GeometryLab kind="geo-units" mode="en" />);
    expect(
      view.container.querySelectorAll('[data-conversion-cell]'),
    ).toHaveLength(10);
    click('I predicted; check the first-level count');
    expect(screen.getByText(/1 m=10 dm/)).toBeTruthy();
    select('Quantity dimension', '3');
    expect(screen.queryByText(/1 m=10 dm/)).toBeNull();
    expect(view.container.querySelectorAll('[data-layer-cube]')).toHaveLength(
      100,
    );
    click('I predicted; check the first-level count');
    expect(screen.getByText(/1 m³=1000 dm³/)).toBeTruthy();
    click('Refine one more level; check centimetre units');
    expect(screen.getByText(/Now zoom into just one 1 dm³/)).toBeTruthy();
    expect(screen.getByText(/1 m³=1000000 cm³/)).toBeTruthy();
    slide('Layer to inspect', '10');
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'Layer 10 of 10',
    );
    select('Large unit', 'dm');
    expect(screen.queryByText(/1 m³=1000000/)).toBeNull();
  });
  it('rotates the rectangle without losing squares and links both square edges', () => {
    const view = render(<GeometryLab kind="geo-rectangle" mode="en" />);
    expect(view.container.querySelectorAll('[data-area-cell]')).toHaveLength(
      24,
    );
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    click('I counted; check the area');
    expect(screen.getByText(/Area 6×4=24 cm²/)).toBeTruthy();
    click('Rotate; swap the edges');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(view.container.querySelectorAll('[data-area-cell]')).toHaveLength(
      24,
    );
    tick('Link edges as a square');
    slide('Horizontal edge (cm)', '5');
    expect(view.container.querySelectorAll('[data-area-cell]')).toHaveLength(
      25,
    );
    expect(
      screen.queryByRole('slider', { name: 'Vertical edge (cm)' }),
    ).toBeNull();
    click('I counted; check the area');
    expect(screen.getByText(/Area 5×5=25 cm²/)).toBeTruthy();
  });
  it('shows all construction stages for an exterior altitude, preserves fractional area and clears old results', () => {
    const view = render(<GeometryLab kind="geo-triangle" mode="en" />);
    slide('Base (cm)', '5');
    slide('Perpendicular height (cm)', '3');
    slide('Apex horizontal position (cm)', '-1');
    expect(view.container.querySelector('.geometry-extension')).toBeTruthy();
    next();
    expect(view.container.querySelectorAll('[data-piece]')).toHaveLength(2);
    next();
    expect(view.container.querySelector('[data-piece="cut"]')).toBeTruthy();
    next();
    expect(view.container.querySelector('[data-piece="moved"]')).toBeTruthy();
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    next();
    expect(screen.getByText(/one area is 5×3÷2=7.5 cm²/)).toBeTruthy();
    slide('Apex horizontal position (cm)', '10');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    next();
    expect(
      view.container.querySelector('[data-piece="reflected"]'),
    ).toBeTruthy();
    for (let i = 0; i < 4; i++) next();
    expect(screen.getByText(/one area is 5×3÷2=7.5 cm²/)).toBeTruthy();
  });
  it('handles zero shear and the equal-base boundary without bogus cuts or lost areas', () => {
    const view = render(
      <GeometryLab kind="geo-parallel-trapezoid" mode="en" />,
    );
    slide('Top-edge horizontal shear (cm)', '0');
    next();
    expect(screen.getByText(/give 6×4=24 cm²/)).toBeTruthy();
    expect(view.container.querySelector('[data-piece="cut"]')).toBeNull();
    click('Trapezoid');
    slide('Top base (cm)', '6');
    expect(
      screen.getByText(/Equal parallel bases make this a parallelogram/),
    ).toBeTruthy();
    next();
    next();
    expect(screen.getByText(/one area is \(6\+6\)×4÷2=24 cm²/)).toBeTruthy();
    slide('Top-edge horizontal shear (cm)', '-2');
    for (let i = 0; i < 4; i++) next();
    expect(screen.getByText(/one area is \(6\+6\)×4÷2=24 cm²/)).toBeTruthy();
  });
  it('counts hidden cubes through full layers and safely resets a selected layer when height shrinks', () => {
    const view = render(<GeometryLab kind="geo-volume" mode="en" />);
    expect(view.container.querySelectorAll('[data-unit-cube]')).toHaveLength(
      24,
    );
    click('Inspect layers');
    expect(view.container.querySelectorAll('[data-layer-cube]')).toHaveLength(
      12,
    );
    tick('Show position maps of all layers');
    expect(view.container.querySelectorAll('[data-layer-cube]')).toHaveLength(
      24,
    );
    tick('Show position maps of all layers');
    slide('Layer to inspect', '2');
    slide('Height (cm)', '1');
    expect(
      (
        screen.getByRole('slider', {
          name: 'Layer to inspect',
        }) as HTMLInputElement
      ).value,
    ).toBe('1');
    tick('Link all edges as a cube');
    slide('Length (cm)', '3');
    tick('Show position maps of all layers');
    expect(view.container.querySelectorAll('[data-layer-cube]')).toHaveLength(
      27,
    );
    click('I counted layers; check the volume');
    expect(screen.getByText(/3×3×3=27 cm³/)).toBeTruthy();
  });
  it('counts five or six net faces, resets face selection when the lid vanishes and distinguishes sheet bounds', () => {
    const view = render(<GeometryLab kind="geo-surface" mode="en" />);
    expect(view.container.querySelectorAll('[data-face-cell]')).toHaveLength(
      52,
    );
    click('E · Top');
    click('Check this face');
    expect(screen.getByText('This face: 4×3=12 cm².')).toBeTruthy();
    tick('Show this net’s bounding-sheet frame');
    expect(screen.getByText(/14×8=112 cm²/)).toBeTruthy();
    expect(
      view.container
        .querySelector('[data-sheet-bounds]')!
        .getAttribute('width'),
    ).toBe('308');
    tick('Include a lid and its top face');
    expect(screen.queryByText('This face: 4×3=12 cm².')).toBeNull();
    expect(screen.queryByRole('button', { name: 'E · Top' })).toBeNull();
    expect(view.container.querySelectorAll('[data-net-face]')).toHaveLength(5);
    expect(view.container.querySelectorAll('[data-face-cell]')).toHaveLength(
      40,
    );
    expect(screen.getByText(/14×5=70 cm²/)).toBeTruthy();
    click('I summed the faces; check surface area');
    expect(screen.getByText(/=40 cm².*Remove only the top/)).toBeTruthy();
    slide('Height (cm)', '3');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
  });
  it('provides bilingual captions, stable face labels and focusable local diagram scrolling', () => {
    render(<SurfaceNet w={4} d={3} h={2} lid mode="bilingual" />);
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
    expect(screen.getByText(/可折成长方体/)).toBeTruthy();
    expect(screen.getByText(/A foldable rectangular-prism net/)).toBeTruthy();
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '52',
    );
    cleanup();
    render(
      <AreaRearrangement shape="triangle" b={5} h={3} apex={-1} mode="en" />,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '7.5',
    );
  });
});

describe('P56 lesson and learning records', () => {
  it('mounts every planned lesson and displays its English examples through the existing lesson flow', () => {
    for (const l of p56Lessons) {
      const view = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /03 Understand/ }));
      expect(screen.getAllByText(/Example [12]/)).toHaveLength(2);
      view.unmount();
    }
  });
  it('restores a fractional area and question position after correcting a wrong dimension', () => {
    const view = mount('/math/lesson/P56-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('7.5 cm³');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('15/2 平方厘米');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/P56-L03');
    expect(
      screen
        .getByRole('button', { name: 'Question 2' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('15/2 平方厘米');
  });
  it('retains reviewed explanations while preventing an unpractised lesson from becoming mastered', () => {
    const view = mount('/math/lesson/P56-L06');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'The fifty-two square centimetres count panels. This net spans fourteen by eight, including cutting gaps. Other layouts and seams need separate dimensions.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/P56-L06');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P56-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('records and restores all eight review questions separately from lesson mastery', () => {
    const view = mount('/math/unit/P56/check');
    for (const [n, value] of Object.entries({
      1: '400 cm²',
      2: '40 平方厘米',
      3: '35/2',
      4: '30',
      6: '30 立方厘米',
      7: '47',
    })) {
      click(`Question ${n}`);
      enter(value);
      check();
    }
    click('Question 5');
    fireEvent.click(screen.getByRole('button', { name: /^C 1000000/ }));
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Panels count square units; occupied space counts cubic units. Capacity needs internal measurements. Sheet dimensions, cutting layout and seam allowance are additional information.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/P56/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P56-L01'],
    ).toBeUndefined();
  });
  it('changes the unit conversion retrieval and clears the previous answer when a new round is due', () => {
    const view = mount('/math/lesson/P56-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('120');
    check();
    enter('12000');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText('Convert 0.25 m to cm.')).toBeTruthy();
    enter('25 cm');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P56-L01'].round).toBe(1);
    saved.sessions['P56-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText('Convert 0.25 cm to m.')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
