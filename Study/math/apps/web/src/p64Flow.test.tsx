// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SignedLab } from './SignedLabs';
import { SignedAxis } from './SignedVisuals';
import { App } from './App';
import { p64Lessons } from './content/P64';
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
const click = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name }));
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
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
const moveAcross = () => {
  click('First move to zero');
  click('Complete the remaining move');
  click('Check endpoint, change and distance');
};
describe('P64 signed workshops and zero boundaries', () => {
  it('keeps zero and the active point visible locally, preserves manual panning until the point or viewport changes', () => {
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
      get() {
        return width;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        return 683;
      },
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
      const v = render(
          <SignedAxis points={[{ value: 0, label: 'P' }]} mode="en" />,
        ),
        region = screen.getByRole('region');
      const visible = (value: string) => {
        const circle = v.container.querySelector(
          `[data-signed-point="${value}"] circle`,
        )!;
        const x = Number(circle.getAttribute('cx')) - region.scrollLeft + 12;
        expect(x).toBeGreaterThanOrEqual(24);
        expect(x).toBeLessThanOrEqual(width - 24);
      };
      expect(region.scrollLeft).toBeGreaterThan(0);
      visible('0');
      const initialScroll = region.scrollLeft;
      v.rerender(<SignedAxis points={[{ value: -1, label: 'P' }]} mode="en" />);
      visible('-1');
      expect(region.scrollLeft).toBe(initialScroll);
      region.scrollLeft = 100;
      v.rerender(
        <SignedAxis
          points={[{ value: -1, label: 'P' }]}
          interval={4}
          mode="en"
        />,
      );
      expect(region.scrollLeft).toBe(100);
      v.rerender(
        <SignedAxis
          points={[
            { value: 0, label: 'O' },
            { value: -5, label: 'P' },
          ]}
          mode="en"
        />,
      );
      visible('0');
      visible('-5');
      width = 140;
      resize();
      visible('-5');
      v.unmount();
    } finally {
      if (client)
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', client);
      else Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
      if (scroll)
        Object.defineProperty(HTMLElement.prototype, 'scrollWidth', scroll);
      else Reflect.deleteProperty(HTMLElement.prototype, 'scrollWidth');
    }
  });
  it('preserves the thermometer indicator while changing labels and crosses zero one degree at a time', () => {
    const v = render(<SignedLab kind="signed-temperature" mode="en" />);
    const y = () =>
      v.container
        .querySelector('[data-temperature-indicator]')!
        .getAttribute('y1');
    expect(y()).toBe('268');
    click('I found zero; check the signed reading');
    expect(screen.getByText(/reading is −4°C/)).toBeTruthy();
    select('Numeric label interval', '1');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    expect(y()).toBe('268');
    slide('Fictional temperature (°C)', '-1');
    click('One degree warmer');
    expect(y()).toBe('220');
    click('I found zero; check the signed reading');
    expect(
      screen.getByText(/Zero is neither positive nor negative/),
    ).toBeTruthy();
    click('One degree warmer');
    click('I found zero; check the signed reading');
    expect(screen.getByText(/reading is \+1°C/)).toBeTruthy();
  });
  it('moves in unit intervals, preserves position under sparse labels and stops at the local boundary without wrapping', () => {
    const v = render(<SignedLab kind="signed-line" mode="en" />);
    click('I located the point; check the target');
    expect(screen.getByText(/does not match/)).toBeTruthy();
    for (let i = 0; i < 5; i++) click('One step left');
    click('I located the point; check the target');
    expect(screen.getByText(/Target reached: P represents −5/)).toBeTruthy();
    select('Axis label interval', '4');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    expect(
      v.container.querySelector('[data-signed-point="-5"]'),
    ).not.toBeNull();
    select('Movement target', 'left-12');
    for (let i = 0; i < 12; i++) click('One step left');
    expect(
      (
        screen.getByRole('button', {
          name: 'One step left',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      v.container.querySelector('[data-signed-point="-12"]'),
    ).not.toBeNull();
    select('Movement target', 'zero');
    click('I located the point; check the target');
    expect(screen.getByText(/Target reached: P represents 0/)).toBeTruthy();
  });
  it('rejects the negative-digit comparison trap and merges equal points after clearing old choices', () => {
    const v = render(<SignedLab kind="signed-compare" mode="en" />);
    select('Choose A ? B', '>');
    click('I compared positions; check the order');
    expect(screen.getByText(/does not match the axis order/)).toBeTruthy();
    select('Choose A ? B', '<');
    click('I compared positions; check the order');
    expect(screen.getByText(/−8 < −3.*A is left of B/)).toBeTruthy();
    slide('Integer at B', '-8');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    expect(
      (
        screen.getByRole('combobox', {
          name: 'Choose A ? B',
        }) as HTMLSelectElement
      ).value,
    ).toBe('');
    expect(v.container.querySelectorAll('[data-signed-point]')).toHaveLength(1);
    expect(screen.getByText('A=B')).toBeTruthy();
    select('Choose A ? B', '=');
    click('I compared positions; check the order');
    expect(screen.getByText(/points coincide/)).toBeTruthy();
  });
  it('walks to zero before using the remaining steps and separates endpoint, signed change and travelled distance', () => {
    const v = render(<SignedLab kind="signed-move" mode="en" />);
    expect(v.container.querySelectorAll('[data-signed-segment]')).toHaveLength(
      0,
    );
    click('First move to zero');
    expect(screen.getByText(/3 steps right to zero; 2 remain/)).toBeTruthy();
    expect(v.container.querySelector('[data-signed-point="0"]')).not.toBeNull();
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    click('Complete the remaining move');
    expect(v.container.querySelectorAll('[data-signed-segment]')).toHaveLength(
      2,
    );
    expect(v.container.querySelector('[data-signed-point="2"]')).not.toBeNull();
    click('Check endpoint, change and distance');
    expect(
      screen.getByText(/Endpoint \+2, signed change \+5, distance 5 units/),
    ).toBeTruthy();
    v.rerender(<SignedLab kind="signed-move" mode="bilingual" />);
    expect(screen.getByText(/distance 5 units; move right/)).toBeTruthy();
    expect(screen.getByText(/走过 5 格；向右/)).toBeTruthy();
  });
  it('undoes a negative change by moving right and adds a negative term left without retaining an old result', () => {
    const v = render(<SignedLab kind="signed-move" mode="en" />);
    select('Operation', '−');
    slide('Integer to add or subtract', '-5');
    moveAcross();
    expect(screen.getByText(/−3 − \(−5\) = 2/)).toBeTruthy();
    slide('Starting integer', '-4');
    select('Operation', '+');
    slide('Integer to add or subtract', '-3');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    click('Complete the move');
    click('Check endpoint, change and distance');
    expect(
      screen.getByText(/Endpoint −7, signed change −3, distance 3 units/),
    ).toBeTruthy();
  });
  it('distinguishes reaching zero, no movement and a result beyond the initial axis without fabricated steps or clipping', () => {
    const v = render(<SignedLab kind="signed-move" mode="en" />);
    slide('Starting integer', '-5');
    click('Complete the move');
    click('Check endpoint, change and distance');
    expect(screen.getByText(/reaches zero without crossing/)).toBeTruthy();
    slide('Integer to add or subtract', '0');
    click('Check the unchanged position');
    expect(
      v.container.querySelectorAll('[data-signed-segment] polygon'),
    ).toHaveLength(0);
    click('Check endpoint, change and distance');
    expect(
      screen.getByText(/distance 0 units.*does not create a step/),
    ).toBeTruthy();
    slide('Starting integer', '-10');
    select('Operation', '−');
    slide('Integer to add or subtract', '8');
    click('Complete the move');
    click('Check endpoint, change and distance');
    expect(
      screen.getByText(/Endpoint −18, signed change −8, distance 8 units/),
    ).toBeTruthy();
    const point = v.container.querySelector(
      '[data-signed-point="-18"] circle',
    )!;
    expect(point.getAttribute('cx')).toBe('44');
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'axis -18 to 12',
    );
  });
  it('distinguishes absolute value from opposite, combines the zero point and exposes bilingual focusable figures', () => {
    const v = render(<SignedLab kind="signed-absolute" mode="en" />);
    click('Show or hide the opposite point');
    expect(v.container.querySelectorAll('[data-signed-point]')).toHaveLength(2);
    click('I measured distance to zero; check absolute value');
    expect(screen.getByText(/\|−6\| = 6.*opposite is \+6/)).toBeTruthy();
    slide('Integer at P', '6');
    expect(v.container.querySelector('[data-signed-point="-6"]')).toBeNull();
    click('I measured distance to zero; check absolute value');
    expect(screen.getByText(/\|6\| = 6.*opposite is −6/)).toBeTruthy();
    slide('Integer at P', '0');
    click('Show or hide the opposite point');
    expect(v.container.querySelectorAll('[data-signed-point]')).toHaveLength(1);
    expect(screen.getByText('P=Q')).toBeTruthy();
    click('I measured distance to zero; check absolute value');
    expect(
      screen.getByText(/absolute value need not be positive/),
    ).toBeTruthy();
    v.rerender(<SignedLab kind="signed-absolute" mode="bilingual" />);
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
    expect(screen.getByText(/从左向右数值增大/)).toBeTruthy();
    expect(screen.getByText(/Values increase from left to right/)).toBeTruthy();
  });
});
describe('P64 bilingual learning and saved evidence', () => {
  it('opens all five lessons with two English examples and preserves both language versions', () => {
    for (const l of p64Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /03 Understand/ }));
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P64-L05');
    fireEvent.click(screen.getByRole('button', { name: /03.*Understand/ }));
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('rejects a missing minus or wrong unit and restores a full-width signed Celsius answer', () => {
    const v = mount('/math/lesson/P64-L01');
    fireEvent.click(screen.getByRole('button', { name: /04 Together/ }));
    enter('4');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('-4 m');
    check();
    enter('－4℃');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/P64-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('－4℃');
  });
  it('records the larger negative number without discarding its sign and restores its practice position', () => {
    const v = mount('/math/lesson/P64-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('4');
    check();
    enter('−4');
    check();
    v.unmount();
    mount('/math/lesson/P64-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('−4');
    expect(
      screen
        .getByRole('button', { name: 'Question 2' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('accepts an exact negative fraction for an integer result without accepting an expression instead of the requested endpoint', () => {
    const v = mount('/math/lesson/P64-L04');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('4-7');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('-6/2');
    check();
    v.unmount();
    mount('/math/lesson/P64-L04');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('-6/2');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('keeps parent reasoning review separate from mastery of an unfinished absolute-value lesson', () => {
    const v = mount('/math/lesson/P64-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'The positions negative six and positive six are different but both are six intervals from zero. The opposite of positive six is negative six, while its absolute value is six. Zero is zero intervals from itself, so absolute value is nonnegative rather than always positive.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    v.unmount();
    mount('/math/lesson/P64-L05');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P64-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('records all eight unit-check items independently and restores reasoning without changing lesson completion', () => {
    const v = mount('/math/unit/P64/check');
    for (const [n, text] of Object.entries({
      1: '−6℃',
      2: '-7',
      3: '−2',
      4: '+4',
      5: '-10/2',
      7: '9',
    })) {
      click(`Question ${n}`);
      enter(text);
      check();
    }
    click('Question 6');
    fireEvent.click(screen.getByRole('button', { name: /^B \|−6\|=6/ }));
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Start at negative four degrees, rise four to zero and three more to positive three. The signed increase is plus seven and separation is seven, while absolute value of negative four is only four to zero. Negative four is left of three, so it is smaller.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/P64/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P64-L05'],
    ).toBeUndefined();
  });
  it('changes a signed temperature retrieval after saving and clears its preceding input when due again', () => {
    const v = mount('/math/lesson/P64-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('-3');
    check();
    enter('3');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText(
        'A fictional indicator is 12 one-degree intervals below zero. What is its Celsius reading?',
      ),
    ).toBeTruthy();
    enter('−12℃');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P64-L01'].round).toBe(1);
    saved.sessions['P64-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText(
        'A fictional indicator is 11 one-degree intervals below zero. What is its Celsius reading?',
      ),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
