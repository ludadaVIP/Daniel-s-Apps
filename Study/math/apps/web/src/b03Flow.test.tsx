// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CalculationLab } from './CalculationLabs';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
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
describe('B03 visible quantities and persisted learning', () => {
  it('reveals carry columns progressively and retains the final carry into a new place', () => {
    const view = render(
      <CalculationLab kind="calculation-regroup" mode="en" />,
    );
    expect(view.container.querySelector('.math-number-readout')).toBeNull();
    click('I calculated; show next column');
    expect(view.container.querySelectorAll('.math-calc-steps li')).toHaveLength(
      1,
    );
    expect(screen.getByText(/8 \+ 7 \+ 0 = 15/)).toBeTruthy();
    click('I calculated; show next column');
    click('I calculated; show next column');
    expect(screen.getByText('268 + 157 = 425')).toBeTruthy();
    click('999 + 1');
    expect(view.container.querySelector('.math-number-readout')).toBeNull();
    for (let i = 0; i < 3; i++) click('I calculated; show next column');
    expect(screen.getByText('999 + 1 = 1000')).toBeTruthy();
    expect(screen.getByText(/Write the final 1 larger unit/)).toBeTruthy();
  });
  it('renders quantity-preserving exchanges across zero places rather than flipping subtraction digits', () => {
    const view = render(
      <CalculationLab kind="calculation-regroup" mode="en" />,
    );
    click('408 − 179');
    click('I calculated; show next column');
    expect(
      [
        ...view.container.querySelectorAll(
          '.math-calc-table tbody tr:first-child td',
        ),
      ].map((e) => e.textContent),
    ).toEqual(['3', '9', '18']);
    click('I calculated; show next column');
    click('I calculated; show next column');
    expect(screen.getByText('408 − 179 = 229')).toBeTruthy();
    click('1000 − 1');
    click('I calculated; show next column');
    expect(
      [
        ...view.container.querySelectorAll(
          '.math-calc-table tbody tr:first-child td',
        ),
      ].map((e) => e.textContent),
    ).toEqual(['0', '9', '9', '10']);
    for (let i = 0; i < 3; i++) click('I calculated; show next column');
    expect(screen.getByText('1000 − 1 = 999')).toBeTruthy();
  });
  it('moves the split without changing dot count and resets the revealed answer when inputs change', () => {
    const view = render(<CalculationLab kind="calculation-split" mode="en" />);
    expect(view.container.querySelectorAll('circle')).toHaveLength(48);
    click('I calculated both parts; check');
    expect(screen.getByText('30 + 18 = 48')).toBeTruthy();
    slide('Left part per row', '4');
    expect(view.container.querySelectorAll('circle')).toHaveLength(48);
    expect(screen.queryByText('30 + 18 = 48')).toBeNull();
    click('I calculated both parts; check');
    expect(screen.getByText('24 + 24 = 48')).toBeTruthy();
    slide('Objects per row', '2');
    expect(
      (
        screen.getByRole('slider', {
          name: 'Left part per row',
        }) as HTMLInputElement
      ).value,
    ).toBe('2');
    expect(view.container.querySelectorAll('circle')).toHaveLength(12);
    slide('Row count', '0');
    expect(view.container.querySelectorAll('circle')).toHaveLength(0);
  });
  it('uses a common length scale for all area regions and gives zero-width regions no visible area', () => {
    const view = render(<CalculationLab kind="calculation-area" mode="en" />);
    const rects = [...view.container.querySelectorAll('rect')];
    expect(rects).toHaveLength(4);
    for (const rect of rects)
      expect(
        Number(rect.getAttribute('width')) /
          Number(rect.getAttribute('data-unit-width')),
      ).toBeCloseTo(
        Number(rect.getAttribute('height')) /
          Number(rect.getAttribute('data-unit-height')),
      );
    expect(view.container.querySelector('.math-calc-partials')).toBeNull();
    click('I calculated four regions; show areas');
    expect(screen.getByText('200 + 30 + 80 + 12 = 322')).toBeTruthy();
    slide('Width in units', '20');
    expect(view.container.querySelectorAll('rect')).toHaveLength(2);
    expect(view.container.querySelector('.math-calc-partials')).toBeNull();
    click('I calculated four regions; show areas');
    expect(screen.getByText('200 + 0 + 80 + 0 = 280')).toBeTruthy();
  });
  it('names the units in long division, preserves an internal zero and retains the final remainder', () => {
    const view = render(
      <CalculationLab kind="calculation-division" mode="en" />,
    );
    for (let i = 0; i < 3; i++) click('I calculated; reveal next place');
    expect(screen.getByText('936 = 12 × 78 + 0')).toBeTruthy();
    expect(
      screen.getAllByText(
        /Exchange the previous 9 larger units for 90 current units/,
      ),
    ).toHaveLength(2);
    click('1005 ÷ 5');
    for (let i = 0; i < 4; i++) click('I calculated; reveal next place');
    expect(screen.getByText('1005 = 5 × 201 + 0')).toBeTruthy();
    click('235 ÷ 6');
    for (let i = 0; i < 3; i++) click('I calculated; reveal next place');
    expect(screen.getByText('235 = 6 × 39 + 1')).toBeTruthy();
    expect(view.container.textContent).not.toContain('235 ÷ 6 = 39');
    expect(
      screen.getByText(/exact numerical quotient also includes remainder/),
    ).toBeTruthy();
  });
  it('does not claim an inside estimate candidate is correct before exact verification', () => {
    const view = render(
      <CalculationLab kind="calculation-estimate" mode="en" />,
    );
    click('438');
    click('Inspect estimate and bounds first');
    expect(screen.getByRole('status').textContent).toContain(
      'do not mark it correct yet',
    );
    expect(screen.queryByText('23 × 19 = 437')).toBeNull();
    click('I calculated exactly; check');
    expect(screen.getByText(/close is not equal/)).toBeTruthy();
    click('43');
    expect(view.container.querySelector('[role="status"]')).toBeNull();
    click('Inspect estimate and bounds first');
    expect(screen.getByRole('status').textContent).toContain(
      'outside the reliable bounds',
    );
  });
  it('keeps both languages in place labels and product explanations', () => {
    render(<CalculationLab kind="calculation-area" mode="bilingual" />);
    expect(screen.getByText('宽的单位数')).toBeTruthy();
    expect(screen.getByText('Width in units')).toBeTruthy();
    click('我已算四块，展开面积 I calculated four regions; show areas');
    expect(screen.getAllByText('面积单位')).toHaveLength(4);
    expect(screen.getAllByText('square units')).toHaveLength(4);
  });
  it('restores the sixth practice explanation and parent confirmation without completing a whole lesson', () => {
    const view = mount('/math/lesson/B03-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Rounding gives an estimate of 700, while the exact sum is 701. Use approximately equal, then check 701 minus 403 equals 298.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/B03-L05');
    expect(
      screen
        .getByRole('button', { name: 'Question 6' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B03-L05'].completedAt).toBeUndefined();
  });
  it('restores the eight-item unit check while keeping its records separate from lesson mastery', () => {
    const view = mount('/math/unit/B03/check');
    for (const [index, value] of Object.entries({
      1: '701',
      2: '234',
      4: '372',
      5: '102',
      6: '5',
      7: '600',
    })) {
      click(`Question ${index}`);
      enter(value);
      check();
    }
    click('Question 3');
    click('B 6×5+6×3');
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          '437 and 438 both fit the interval. Exact work gives 23 times 20 minus 23 equals 437, so 438 is not correct.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/B03/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.queryByRole('alert')).toBeNull();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B03-CHECK'].answers['B03-CHECK-Q6'].input).toBe('5');
    expect(saved.sessions['B03-L01']).toBeUndefined();
  });
  it('retrieves a new regrouping story after supported practice and a saved review', () => {
    const view = mount('/math/lesson/B03-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('371');
    check();
    enter('229');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText('Find 208+157.')).toBeTruthy();
    enter('365');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    expect(screen.getByText('Nothing waiting for review.')).toBeTruthy();
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['B03-L01'].round).toBe(1);
    saved.sessions['B03-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText('Find 1010−14.')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
  it('publishes all five planned lessons with review variants and preserves the prior 27 lessons', () => {
    const unit = lessons.filter((l) => l.unit === 'B03');
    expect(unit).toHaveLength(5);
    expect(unitChecks.B03.questions).toHaveLength(8);
    unit.forEach((l) => {
      expect(l.contentStatus).toBe('ready');
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
      expect(reviewQuestionFor(l.id, 1).stem).not.toEqual(
        reviewQuestionFor(l.id, 0).stem,
      );
    });
    expect(
      lessons.filter((l) =>
        ['B01', 'B02', 'B04', 'P52', 'P53'].includes(l.unit!),
      ),
    ).toHaveLength(27);
    const planned = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(planned).toHaveLength(358);
    expect(
      planned
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
  });
});
