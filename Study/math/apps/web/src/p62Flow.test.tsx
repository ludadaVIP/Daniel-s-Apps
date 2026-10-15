// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PercentLab } from './PercentLabs';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { p62Lessons } from './content/P62';
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
const recover = () => {
  click('I found 1%; check one percent');
  click('I recovered 100%; check the whole');
};
describe('P62 proportion and changing-reference workshops', () => {
  it('separates actual cards from standardized hundredths and resets feedback when the whole changes', () => {
    const view = render(<PercentLab kind="percent-hundred" mode="en" />);
    expect(view.container.querySelectorAll('[data-source-card]')).toHaveLength(
      40,
    );
    expect(view.container.querySelectorAll('.marked')).toHaveLength(10);
    expect(view.container.querySelectorAll('[data-fill="1"]')).toHaveLength(25);
    click('I compared the proportions; check per hundred');
    expect(screen.getByText(/10\/40=1\/4.*25%/)).toBeTruthy();
    select('Actual card total', '80');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(view.container.querySelectorAll('[data-source-card]')).toHaveLength(
      80,
    );
    expect(view.container.querySelectorAll('.marked')).toHaveLength(10);
    expect(view.container.querySelectorAll('[data-fill="1"]')).toHaveLength(12);
    expect(view.container.querySelectorAll('[data-fill="0.5"]')).toHaveLength(
      1,
    );
    click('I compared the proportions; check per hundred');
    expect(screen.getByText(/12.5%.*10 cards/)).toBeTruthy();
  });
  it('preserves partial-cell area for a single source card rather than rounding to one percent', () => {
    const view = render(<PercentLab kind="percent-hundred" mode="en" />);
    select('Actual card total', '80');
    slide('Marked cards', '1');
    expect(view.container.querySelectorAll('[data-fill="1"]')).toHaveLength(1);
    expect(view.container.querySelectorAll('[data-fill="0.25"]')).toHaveLength(
      1,
    );
    click('I compared the proportions; check per hundred');
    expect(screen.getByText(/1.25%.*1 card/)).toBeTruthy();
    slide('Marked cards', '0');
    expect(view.container.querySelectorAll('[data-fill]')).toHaveLength(0);
  });
  it('converts thousandths exactly, preserves two original wholes above one and treats zero as numerically equal to zero percent', () => {
    const view = render(<PercentLab kind="percent-decimal" mode="en" />);
    expect(screen.getByText('0.375 = ?%')).toBeTruthy();
    click('I converted it; check the same number');
    expect(screen.getByText(/0.375=375\/1000=37.5\/100=37.5%/)).toBeTruthy();
    click('1.25');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(view.container.querySelectorAll('.percent-whole')).toHaveLength(2);
    click('I converted it; check the same number');
    expect(screen.getByText(/=125%/)).toBeTruthy();
    slide('Thousandths', '0');
    click('I converted it; check the same number');
    expect(screen.getByText(/Both 0 and 0% represent zero/)).toBeTruthy();
  });
  it('keeps recurring percentages exact, displays approximation separately and clears stale results', () => {
    const view = render(<PercentLab kind="percent-fraction" mode="en" />);
    select('Denominator', '3');
    slide('Numerator', '1');
    expect(view.container.querySelectorAll('[data-fill="1"]')).toHaveLength(33);
    expect(
      Number(
        view.container
          .querySelector('[data-percent-cell="33"] [data-fill]')!
          .getAttribute('data-fill'),
      ),
    ).toBeCloseTo(1 / 3, 12);
    click('I kept the value; check the percentage');
    expect(screen.getByText(/1\/3=33 1\/3%.*≈33.3%/)).toBeTruthy();
    slide('Numerator', '6');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(view.container.querySelectorAll('[data-fill="1"]')).toHaveLength(
      200,
    );
  });
  it('aligns actual litres with the stated whole without revealing a computed answer, including zero and 150 percent', () => {
    const view = render(<PercentLab kind="percent-amount" mode="en" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      '100% corresponds to 80 L',
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '28 L',
    );
    click('I found the share; check the amount');
    expect(screen.getByText(/80×35\/100=28 L/)).toBeTruthy();
    slide('Reference whole (L)', '5');
    slide('Requested percentage', '30');
    click('I found the share; check the amount');
    expect(screen.getByText(/5×30\/100=3\/2 L/)).toBeTruthy();
    slide('Requested percentage', '150');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      '150%',
    );
    slide('Reference whole (L)', '0');
    click('I found the share; check the amount');
    expect(screen.getByText(/0×150\/100=0 L/)).toBeTruthy();
  });
  it('recovers one percent before the whole and keeps a noninteger inverse result exact', () => {
    const view = render(<PercentLab kind="percent-whole" mode="en" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      '100% corresponds to ? L',
    );
    click('I found 1%; check one percent');
    expect(screen.getByText(/1% corresponds to 18÷30=3\/5 L/)).toBeTruthy();
    click('I recovered 100%; check the whole');
    expect(screen.getByText(/whole is 18÷\(30\/100\)=60 L/)).toBeTruthy();
    slide('Known part (L)', '7');
    slide('Known percentage', '40');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    recover();
    expect(screen.getByText(/whole is 7÷\(40\/100\)=35\/2 L/)).toBeTruthy();
  });
  it('distinguishes contradictory zero-rate conditions, undetermined wholes and a zero whole without dividing by zero', () => {
    render(<PercentLab kind="percent-whole" mode="en" />);
    slide('Known percentage', '0');
    expect(screen.getByText(/conditions conflict/)).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    slide('Known part (L)', '0');
    expect(screen.getByText(/no unique positive whole/)).toBeTruthy();
    slide('Known percentage', '30');
    expect(screen.getByText(/equation gives only a zero whole/)).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    slide('Known part (L)', '18');
    expect(screen.getByRole('img')).toBeTruthy();
  });
  it('separates savings and price, applies the second change to the new base and resets on direction change', () => {
    const view = render(<PercentLab kind="percent-change" mode="en" />);
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    click('I separated change and price; check');
    expect(
      screen.getByText(/20% of NZ\$80.00 is NZ\$16.00.*NZ\$64.00/),
    ).toBeTruthy();
    click('Use the new base; reverse the same rate');
    expect(
      screen.getByText(/Step 2 uses NZ\$64.00 as 100%.*NZ\$12.80.*NZ\$76.80/),
    ).toBeTruthy();
    select('Change direction', 'increase');
    expect(view.container.querySelector('p[role=status]')).toBeNull();
    expect(screen.queryByText(/Step 2 uses/)).toBeNull();
    click('I separated change and price; check');
    expect(screen.getByText(/NZ\$96.00/)).toBeTruthy();
  });
  it('handles zero and one-hundred-percent price boundaries with explicit zero-base reasoning', () => {
    render(<PercentLab kind="percent-change" mode="en" />);
    slide('Change rate (%)', '0');
    click('I separated change and price; check');
    click('Use the new base; reverse the same rate');
    expect(screen.getByText('A zero rate changes neither price.')).toBeTruthy();
    slide('Change rate (%)', '100');
    click('I separated change and price; check');
    click('Use the new base; reverse the same rate');
    expect(
      screen.getByText(/Relative growth with zero as denominator is undefined/),
    ).toBeTruthy();
    expect(
      screen.getByText(/Step 2 uses NZ\$0.00.*giving NZ\$0.00/),
    ).toBeTruthy();
  });
});
describe('P62 bilingual learning and saved evidence', () => {
  it('opens all six lessons with two English examples, and both language versions in bilingual mode', () => {
    for (const l of p62Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /03 Understand/ }));
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P62-L06');
    fireEvent.click(screen.getByRole('button', { name: /03.*Understand/ }));
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('rejects an approximate or missing-symbol answer, accepts an exact mixed percentage and restores it with its position', () => {
    const v = mount('/math/lesson/P62-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    expect(screen.getByText(/Use a percentage including %/)).toBeTruthy();
    enter('33.3%');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('1/3');
    check();
    expect(
      screen.getByText(/The value matches; finish the requested form/),
    ).toBeTruthy();
    enter('33 1/3%');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/P62-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('33 1/3%');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('checks requested decimal form and measured units without confusing rates with quantities', () => {
    const v = mount('/math/lesson/P62-L02');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 5');
    enter('37.5%');
    check();
    expect(
      screen.getByText(/The value matches; finish the requested form/),
    ).toBeTruthy();
    enter('.375');
    check();
    v.unmount();
    mount('/math/lesson/P62-L04');
    fireEvent.click(screen.getByRole('button', { name: /04 Together/ }));
    enter('28%');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('28 升');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('retains parent reasoning review without marking an otherwise unfinished lesson complete', () => {
    const v = mount('/math/lesson/P62-L06');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Eighty is the first base, giving sixty-four. Sixty-four is the second base, giving seventy-six eighty. The rates are equal but the money changes differ. A rise from twenty to thirty percent is ten percentage points and fifty percent relative growth.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    v.unmount();
    mount('/math/lesson/P62-L06');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P62-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('records all eight unit-check answers independently, including recurring percentages and manual reasoning', () => {
    const v = mount('/math/unit/P62/check');
    for (const [n, value] of Object.entries({
      1: '6.3%',
      2: '87.5%',
      3: '24 克',
      4: '120/2 L',
      5: 'NZ$51',
      7: '16 2/3%',
    })) {
      click(`Question ${n}`);
      enter(value);
      check();
    }
    click('Question 6');
    fireEvent.click(
      screen.getByRole('button', {
        name: /^B Up ten percentage points; relative increase 50%/,
      }),
    );
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Multiply eighty litres by twenty percent to get sixteen litres; divide the known sixteen litres by twenty percent to recover eighty. Price changes use eighty dollars first and sixty-four dollars second, so the final price is seventy-six eighty.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/P62/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P62-L06'],
    ).toBeUndefined();
  });
  it('uses new retrieval numbers after a saved review and clears the previous percent answer', () => {
    const v = mount('/math/lesson/P62-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('6%');
    check();
    enter('30%');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText('Marked cards: 1 out of 20. What percentage is marked?'),
    ).toBeTruthy();
    enter('5%');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P62-L01'].round).toBe(1);
    saved.sessions['P62-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText('Marked cards: 2 out of 20. What percentage is marked?'),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
