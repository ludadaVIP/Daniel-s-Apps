// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CircleLab } from './CircleLabs';
import { RollingCircle } from './CircleVisuals';
import { App } from './App';
import { p66Lessons } from './content/P66';
import { STORAGE_KEY } from './progress';
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
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const feedback = () =>
  screen.getByRole('status', { name: 'Workshop feedback' }).textContent;
const check = () => click(/Check answer/);
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('P66 circle and cylinder workshops', () => {
  it('keeps the rolling circle inside a narrow local viewport while allowing manual inspection between moves', () => {
    const client = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'clientWidth',
      ),
      scroll = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'scrollWidth',
      );
    let width = 246,
      resize = () => {};
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => width,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 500,
    });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    try {
      const v = render(<RollingCircle r={2} progress={0} mode="en" />),
        region = screen.getByRole('region');
      expect(region.scrollLeft).toBe(0);
      const visible = () => {
        const circle = v.container.querySelector('svg circle')!,
          x = Number(circle.getAttribute('cx')),
          r = Number(circle.getAttribute('r'));
        expect(x - r + 12 - region.scrollLeft).toBeGreaterThanOrEqual(
          12 - 1e-8,
        );
        expect(x + r + 12 - region.scrollLeft).toBeLessThanOrEqual(
          width - 12 + 1e-8,
        );
      };
      v.rerender(<RollingCircle r={2} progress={1} mode="en" />);
      visible();
      expect(region.scrollLeft).toBeGreaterThan(0);
      region.scrollLeft = 40;
      v.rerender(<RollingCircle r={2} progress={1} mode="bilingual" />);
      expect(region.scrollLeft).toBe(40);
      v.rerender(<RollingCircle r={2} progress={0.9} mode="en" />);
      visible();
      width = 140;
      resize();
      visible();
      v.unmount();
    } finally {
      if (client)
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', client);
      if (scroll)
        Object.defineProperty(HTMLElement.prototype, 'scrollWidth', scroll);
    }
  });
  it('classifies a chord by the centre, retains radius under rotation and merges coincident labels', () => {
    const v = render(<CircleLab kind="circle-parts" mode="en" />);
    click('Check segments using the centre');
    expect(feedback()).toContain('Check the endpoints');
    select('Classify CD', 'chord');
    click('Check segments using the centre');
    expect(feedback()).toContain('Correct.');
    slide('Chord offset (percent of radius)', '0');
    expect(screen.getByText('A=D')).toBeTruthy();
    expect(screen.getByText('B=C')).toBeTruthy();
    select('Classify CD', 'diameter');
    slide('Rotation (degrees)', '90');
    click('Check segments using the centre');
    expect(feedback()).toContain('both chord and diameter');
    const radius = v.container.querySelector('[data-circle-radius]')!;
    expect(Number(radius.getAttribute('x2'))).toBeCloseTo(180);
    expect(Number(radius.getAttribute('y2'))).toBeCloseTo(241);
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
  });
  it('labels simulated precision and preserves a user quotient instead of forcing pi', () => {
    render(<CircleLab kind="circle-pi" mode="en" />);
    expect(screen.getByRole('table').textContent).toContain(
      'not observed measurements',
    );
    expect(screen.getByRole('table').textContent).toContain('12.6');
    select('Simulated reading precision (cm)', '1');
    expect(screen.getByRole('table').textContent).toContain('3.2500');
    enter('Recorded circumference (cm)', '20');
    click('Record and calculate my quotient');
    expect(feedback()).toContain('5.0000');
    expect(
      screen.getByRole('list', { name: 'My reading records' }).textContent,
    ).toContain('C=20 cm');
    enter('Recorded diameter (cm)', '0');
    click('Record and calculate my quotient');
    expect(feedback()).toContain('division by zero');
    expect(
      screen.getByRole('list', { name: 'My reading records' }).children,
    ).toHaveLength(1);
  });
  it('rolls one full circumference using the same scale as the diameter without clipping the starting circle', () => {
    const v = render(<CircleLab kind="circle-pi" mode="en" />),
      travel = v.container.querySelector('[data-roll-travel]')!,
      diameter = v.container.querySelector('[data-roll-diameter]')!,
      mark = v.container.querySelector('[data-roll-mark]')!,
      circle = v.container.querySelector('svg circle')!;
    const start = Number(mark.getAttribute('cx')),
      R = Number(circle.getAttribute('r'));
    expect(start - R).toBeGreaterThanOrEqual(0);
    slide('One-turn progress (%)', '20');
    // Rolling right carries the original bottom mark to the left of the centre.
    expect(Number(mark.getAttribute('cx'))).toBeLessThan(
      Number(circle.getAttribute('cx')),
    );
    expect(Number(mark.getAttribute('cy'))).toBeGreaterThan(
      Number(circle.getAttribute('cy')),
    );
    slide('One-turn progress (%)', '100');
    expect(Number(mark.getAttribute('cy'))).toBeCloseTo(
      Number(travel.getAttribute('y2')),
      10,
    );
    const distance =
        Number(travel.getAttribute('x2')) - Number(travel.getAttribute('x1')),
      d =
        Number(diameter.getAttribute('x2')) -
        Number(diameter.getAttribute('x1'));
    expect(distance / d).toBeCloseTo(Math.PI, 12);
    slide('Rolling radius (cm)', '3');
    expect(Number(travel.getAttribute('x2'))).toBe(
      Number(travel.getAttribute('x1')),
    );
  });
  it('switches given radius to diameter without changing the circle and separates exact from approximate circumference', () => {
    const v = render(<CircleLab kind="circle-circumference" mode="en" />);
    const r = v.container.querySelector('svg circle')!.getAttribute('r');
    select('Role of the given length', 'd');
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('6');
    expect(v.container.querySelector('svg circle')!.getAttribute('r')).toBe(r);
    click('Check exact circumference and approximate calculation');
    expect(feedback()).toContain('6π cm');
    expect(feedback()).toContain('18.84');
    slide('Given length (cm)', '8');
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
    click('Check exact circumference and approximate calculation');
    expect(feedback()).toContain('8π cm');
    expect(feedback()).toContain('25.12');
  });
  it('retains the same curved sectors across rearrangement and finer division instead of substituting a rectangle', () => {
    const v = render(<CircleLab kind="circle-area" mode="en" />);
    const ids = () =>
      Array.from(v.container.querySelectorAll('[data-circle-sector]')).map(
        (p) => p.getAttribute('data-circle-sector'),
      );
    const original = ids(),
      path = v.container
        .querySelector('[data-circle-sector]')!
        .getAttribute('d');
    click('Rearrange the original sectors');
    expect(ids()).toEqual(original);
    expect(
      v.container.querySelector('[data-circle-sector]')!.getAttribute('d'),
    ).not.toBe(path);
    for (const p of v.container.querySelectorAll('[data-circle-sector]'))
      expect(p.getAttribute('d')).toContain(' A 66 66 ');
    expect(v.container.querySelectorAll('svg rect')).toHaveLength(0);
    click('Explain using area conservation and the limiting shape');
    expect(feedback()).toContain('area 9π cm²');
    expect(feedback()).toContain('not discarded sectors');
    select('Equal-sector count', '64');
    expect(ids()).toHaveLength(64);
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
    click('Explain using area conservation and the limiting shape');
    expect(feedback()).toContain('same 64 pieces');
    expect(feedback()).toContain('area 9π cm²');
  });
  it('uses one scale in the cylinder net and changes end areas while retaining volume', () => {
    const v = render(<CircleLab kind="circle-cylinder" mode="en" />),
      side = v.container.querySelector('[data-cylinder-side]')!,
      end = v.container.querySelector('[data-cylinder-end]')!,
      width = Number(side.getAttribute('width')),
      radius = Number(end.getAttribute('r'));
    expect(width / (2 * radius)).toBeCloseTo(Math.PI, 12);
    expect(Number(side.getAttribute('height')) / radius).toBe(5 / 2);
    expect(v.container.querySelectorAll('[data-cylinder-end]')).toHaveLength(2);
    click('Check side area, end faces and volume separately');
    expect(feedback()).toContain('face area 28π cm²');
    expect(feedback()).toContain('20π cm³');
    select('Required circular end faces', '1');
    expect(v.container.querySelectorAll('[data-cylinder-end]')).toHaveLength(1);
    expect(Number(side.getAttribute('width'))).toBe(width);
    click('Check side area, end faces and volume separately');
    expect(feedback()).toContain('face area 24π cm²');
    expect(feedback()).toContain('20π cm³');
    select('Required circular end faces', '0');
    click('Check side area, end faces and volume separately');
    expect(v.container.querySelectorAll('[data-cylinder-end]')).toHaveLength(0);
    expect(feedback()).toContain('not a liquid-holding container');
    v.rerender(<CircleLab kind="circle-cylinder" mode="bilingual" />);
    expect(screen.getByText(/完整理想圆柱的体积/)).toBeTruthy();
    expect(screen.getByText(/The full ideal cylinder volume/)).toBeTruthy();
  });
});
describe('P66 bilingual lessons and saved answers', () => {
  it('opens five planned lessons with two examples per language and prediction hooks', () => {
    for (const l of p66Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      expect(
        document.querySelector('.math-circle-hook')!.textContent,
      ).toContain('?');
      click(/03 Understand/);
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P66-L04');
    click(/03.*Understand/);
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('rejects rounded or pi-free exact circumference answers and restores an equivalent pi form', () => {
    const v = mount('/math/lesson/P66-L03');
    click(/04 Together/);
    enter('Your answer', '31.4');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '10');
    check();
    enter('Your answer', '20pi/2 cm');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/P66-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('20pi/2 cm');
  });
  it('rejects length units for exact area and restores a fractional pi coefficient with square units', () => {
    const v = mount('/math/lesson/P66-L04');
    click(/04 Together/);
    enter('Your answer', '9π cm');
    check();
    enter('Your answer', '18π/2 cm²');
    check();
    v.unmount();
    mount('/math/lesson/P66-L04');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('18π/2 cm²');
  });
  it('uses the specified 3.14 convention and restores the practice item independently', () => {
    const v = mount('/math/lesson/P66-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '8pi');
    check();
    enter('Your answer', '25.12 cm');
    check();
    v.unmount();
    mount('/math/lesson/P66-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('25.12 cm');
    expect(
      screen
        .getByRole('button', { name: 'Question 2' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('records parent evidence without declaring an unfinished spatial lesson mastered', () => {
    mount('/math/lesson/P66-L05');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Side area 20pi cm2 measures material, while volume 20pi cm3 measures internal space. Removing a lid saves 4pi cm2 but unchanged internal radius and height leave full volume unchanged.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P66-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves all eight unit-check answers with pi, dimensions, choice and manual reasoning', () => {
    const v = mount('/math/unit/P66/check');
    for (const [n, input] of Object.entries({
      1: '8 cm',
      2: '3.15',
      3: '12pi/2 cm',
      4: '25π cm²',
      5: '36pi cm³',
      7: '33π平方厘米',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 6');
    click(/^B The same sectors preserve area/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'The original sectors keep their arcs and area during rigid movement. For r=2 and h=5, side area is 20pi cm2, closed face area 28pi cm2, open-top area 24pi cm2 and unchanged internal volume 20pi cm3. Retained pi is exact; using 3.14 is approximate.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/P66/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P66-L05'],
    ).toBeUndefined();
  });
  it('retrieves a new exact pi value and clears the previous saved input on the next due round', () => {
    const v = mount('/math/lesson/P66-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '50.24');
    check();
    enter('Your answer', '25.12');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText('Radius 1 cm: find exact circumference in terms of π.'),
    ).toBeTruthy();
    enter('Your answer', '4π/2');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P66-L03'].round).toBe(1);
    saved.sessions['P66-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText('Radius 2 cm: find exact circumference in terms of π.'),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
