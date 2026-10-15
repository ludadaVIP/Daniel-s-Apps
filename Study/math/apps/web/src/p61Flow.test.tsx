// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FractionProductLab } from './FractionProductLabs';
import { GroupedMeasure, SharedFraction } from './FractionProductVisuals';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { p61Lessons } from './content/P61';
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
const partition = () =>
  click('I wrote equal small pieces; check the partition');
const quotient = () => {
  partition();
  click('I compared piece counts; check the quotient');
};
describe('P61 accurate fraction workshops', () => {
  it('counts repeated quarter-litres, clears old results and handles zero groups without invented water', () => {
    const view = render(<FractionProductLab kind="product-repeat" mode="en" />);
    expect(view.container.querySelectorAll('[data-repeat-cell]')).toHaveLength(
      12,
    );
    expect(view.container.querySelectorAll('.product-selected')).toHaveLength(
      9,
    );
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    click('I combined the groups; check the total');
    expect(screen.getByText(/3×3\/4=9\/4=9\/4 L/)).toBeTruthy();
    slide('Number of groups', '0');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(view.container.querySelectorAll('.product-selected')).toHaveLength(
      0,
    );
    click('I combined the groups; check the total');
    expect(screen.getByText(/0×3\/4=0\/4=0 L/)).toBeTruthy();
  });
  it('preserves the original unit area through improper factors, zero overlap and four-whole products', () => {
    const view = render(<FractionProductLab kind="product-area" mode="en" />);
    expect(view.container.querySelectorAll('[data-product-cell]')).toHaveLength(
      12,
    );
    expect(view.container.querySelectorAll('[data-overlap=true]')).toHaveLength(
      6,
    );
    select('Horizontal factor denominator', '4');
    slide('Horizontal factor numerator', '5');
    select('Vertical factor denominator', '3');
    slide('Vertical factor numerator', '2');
    expect(
      view.container.querySelectorAll('.product-whole-border'),
    ).toHaveLength(2);
    expect(view.container.querySelectorAll('[data-product-cell]')).toHaveLength(
      24,
    );
    expect(view.container.querySelectorAll('[data-overlap=true]')).toHaveLength(
      10,
    );
    click('I counted the overlap; check the product');
    expect(screen.getByText(/5\/4×2\/3=10\/12=5\/6/)).toBeTruthy();
    slide('Horizontal factor numerator', '0');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(view.container.querySelectorAll('[data-overlap=true]')).toHaveLength(
      0,
    );
    slide('Horizontal factor numerator', '8');
    slide('Vertical factor numerator', '6');
    expect(
      view.container.querySelectorAll('.product-whole-border'),
    ).toHaveLength(4);
    click('I counted the overlap; check the product');
    expect(screen.getByText(/8\/4×6\/3=48\/12=4/)).toBeTruthy();
  });
  it('uses the stated measured whole and retains a fractional litre share instead of truncating it', () => {
    const view = render(<FractionProductLab kind="product-amount" mode="en" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'A total of 12 L',
    );
    click('I divided into shares; check the selected amount');
    expect(screen.getByText(/12×2\/3=8 L/)).toBeTruthy();
    slide('Total water (L)', '6');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    click('I divided into shares; check the selected amount');
    expect(screen.getByText(/6×2\/3=4 L/)).toBeTruthy();
    slide('Total water (L)', '5');
    click('I divided into shares; check the selected amount');
    expect(screen.getByText(/5×2\/3=10\/3 L/)).toBeTruthy();
    expect(view.container.querySelectorAll('[data-amount-part]')).toHaveLength(
      3,
    );
  });
  it('refines the same water into balanced labelled allocations and checks each person’s amount', () => {
    const view = render(<FractionProductLab kind="product-share" mode="en" />);
    expect(view.container.querySelectorAll('[data-share-cell]')).toHaveLength(
      4,
    );
    click('Subdivide every original part');
    expect(view.container.querySelectorAll('[data-share-cell]')).toHaveLength(
      8,
    );
    expect(view.container.querySelectorAll('.product-selected')).toHaveLength(
      6,
    );
    click('Allocate colours to the people');
    expect(view.container.querySelectorAll('[data-owner="0"]')).toHaveLength(3);
    expect(view.container.querySelectorAll('[data-owner="1"]')).toHaveLength(3);
    click('I shared it; check each person’s amount');
    expect(screen.getByText(/3\/4÷2=3\/8 L/)).toBeTruthy();
    slide('People sharing', '1');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(view.container.querySelectorAll('[data-share-cell]')).toHaveLength(
      4,
    );
  });
  it('distinguishes exact group count, complete groups and litre remainder without leaking the result first', () => {
    const view = render(
      <FractionProductLab kind="product-whole-divide" mode="en" />,
    );
    expect(view.container.querySelectorAll('[data-filled=true]')).toHaveLength(
      8,
    );
    expect(view.container.querySelectorAll('[data-group-guide]')).toHaveLength(
      3,
    );
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '8/3',
    );
    partition();
    expect(
      screen.getByText(/8 pieces available and 3 pieces per target group/),
    ).toBeTruthy();
    click('I compared piece counts; check the quotient');
    expect(
      screen.getByText(
        /8\/3=8\/3 groups; 2 complete groups, with 1\/2 L left, equal to 2\/3 of one group/,
      ),
    ).toBeTruthy();
    select('Water available', '1/1');
    select('Water per group', '3/2');
    quotient();
    expect(
      screen.getByText(/2\/3=2\/3 groups; 0 complete groups, with 1 L left/),
    ).toBeTruthy();
  });
  it('treats a zero dividend as valid and a zero divisor as undefined with no invalid diagram or reciprocal', () => {
    const view = render(
      <FractionProductLab kind="product-whole-divide" mode="en" />,
    );
    select('Water available', '0/1');
    select('Water per group', '3/2');
    expect(view.container.querySelectorAll('[data-filled=true]')).toHaveLength(
      0,
    );
    const svg = screen.getByRole('img'),
      box = svg.getAttribute('viewBox')!.split(' ').map(Number),
      guide = view.container.querySelector('[data-group-guide]')!;
    expect(
      Number(guide.getAttribute('x')) + Number(guide.getAttribute('width')),
    ).toBeLessThan(box[2]!);
    quotient();
    expect(screen.getByText(/0\/3=0 groups; 0 complete groups/)).toBeTruthy();
    select('Water per group', '0/1');
    expect(screen.getByText(/Division by zero is undefined/)).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    expect(
      screen.queryByRole('combobox', { name: 'Choose the reciprocal' }),
    ).toBeNull();
  });
  it('derives the reciprocal from equal pieces, rejects inverting the wrong number and resets old evidence', () => {
    render(<FractionProductLab kind="product-fraction-divide" mode="en" />);
    quotient();
    expect(
      screen.getByText(
        /9\/8=9\/8 groups; 1 complete group, with 1\/12 L left, equal to 1\/8/,
      ),
    ).toBeTruthy();
    select('Choose the reciprocal', '2/3');
    click('Check the reciprocal reasoning');
    expect(
      screen.getByText(/Invert the divisor, not the dividend/),
    ).toBeTruthy();
    select('Choose the reciprocal', '3/2');
    click('Check the reciprocal reasoning');
    expect(screen.getByText(/2\/3×3\/2=1/)).toBeTruthy();
    select('Water available', '5/4');
    expect(screen.queryByText(/2\/3×3\/2=1/)).toBeNull();
    expect(
      screen.queryByRole('combobox', { name: 'Choose the reciprocal' }),
    ).toBeNull();
    expect(screen.queryByText(/Exact quotient/)).toBeNull();
  });
  it('provides bilingual captions, a focusable local scroll region and labels beyond colour alone', () => {
    const view = render(
      <SharedFraction
        amount={{ n: 3, d: 4 }}
        people={2}
        stage={2}
        mode="bilingual"
      />,
    );
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
    expect(screen.getByText(/每个完整粗框/)).toBeTruthy();
    expect(screen.getByText(/Each complete thick frame/)).toBeTruthy();
    expect(
      [...view.container.querySelectorAll('svg text')].filter(
        (e) => e.textContent === '1',
      ),
    ).toHaveLength(3);
    cleanup();
    render(
      <GroupedMeasure
        amount={{ n: 3, d: 4 }}
        group={{ n: 2, d: 3 }}
        mode="en"
      />,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '9/8',
    );
  });
});
describe('P61 publication and learner records', () => {
  it('opens every planned lesson with two English examples and supports the existing bilingual explanation flow', () => {
    for (const l of p61Lessons) {
      const view = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /03 Understand/ }));
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      view.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P61-L06');
    fireEvent.click(screen.getByRole('button', { name: /03.*Understand/ }));
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('restores an exact fractional group count after rejecting litres and a rounded decimal', () => {
    const view = mount('/math/lesson/P61-L05');
    fireEvent.click(screen.getByRole('button', { name: /04 Together/ }));
    enter('8/3 L');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('2.67');
    check();
    enter('16/6 份');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/P61-L05');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('16/6 份');
  });
  it('saves a complete-group answer independently of the exact quotient and restores its question position', () => {
    const view = mount('/math/lesson/P61-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 4');
    enter('8/3');
    check();
    enter('2 groups');
    check();
    view.unmount();
    mount('/math/lesson/P61-L05');
    expect(
      screen
        .getByRole('button', { name: 'Question 4' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2 groups');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('retains parent-reviewed reasoning about reference units without prematurely completing a lesson', () => {
    const view = mount('/math/lesson/P61-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Eight quarter-litres divided by three per group gives eight thirds of a group. Two full groups leave half a litre, which is two thirds of a three-quarter-litre group. Multiplying the exact quotient by the group size restores two litres.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/P61-L05');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P61-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('records all eight unit-review answers and restores the final reasoning separately from lesson mastery', () => {
    const view = mount('/math/unit/P61/check');
    for (const [n, v] of Object.entries({
      1: '1.5 L',
      2: '2/4',
      3: '15 克',
      4: '2/12 L',
      5: '8/3 份',
      7: '5/6 groups',
    })) {
      click(`Question ${n}`);
      enter(v);
      check();
    }
    click('Question 6');
    fireEvent.click(
      screen.getByRole('button', { name: /^C Zero times any number/ }),
    );
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Taking three quarters of two litres multiplies and gives one and a half litres. Counting three-quarter-litre groups divides and gives eight thirds groups. Multiplying eight thirds by three quarters of a litre restores two litres; group count and litre amount use different units.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/P61/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P61-L06'],
    ).toBeUndefined();
  });
  it('changes the numbers and clears the previous input when a subsequent retrieval becomes due', () => {
    const view = mount('/math/lesson/P61-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('8/12');
    check();
    enter('8/3');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText('2 groups each contain 1/2 L. Find total litres.'),
    ).toBeTruthy();
    enter('1 L');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P61-L01'].round).toBe(1);
    saved.sessions['P61-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText('2 groups each contain 2/2 L. Find total litres.'),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
