// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { IntegerLab } from './IntegerLabs';
import { FactorArray } from './IntegerVisuals';
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
const select = (value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name: 'First rule' }), {
    target: { value },
  });
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
describe('P51 model workshop', () => {
  it('reveals equivalent mixed-operation steps progressively and clears old results after a quantity change', () => {
    render(<IntegerLab kind="integer-mixed" mode="en" />);
    expect(screen.queryByText(/Final value/)).toBeNull();
    next();
    expect(screen.getByText('36 × 25 = 900')).toBeTruthy();
    next();
    expect(screen.getByText('480 ÷ 6 = 80')).toBeTruthy();
    next();
    next();
    expect(screen.getByText(/Final value 2020/)).toBeTruthy();
    slide('Leading added quantity', '0');
    expect(
      screen
        .getByRole('button', { name: '1200 + 36 × 25 − 480 ÷ 6' })
        .getAttribute('aria-pressed'),
    ).toBe('false');
    expect(screen.queryByText(/Final value 2020/)).toBeNull();
    for (let i = 0; i < 4; i++) next();
    expect(screen.getByText(/Final value 820/)).toBeTruthy();
    click('3600 ÷ 9 × 4 + 275');
    next();
    expect(screen.getByText('3600 ÷ 9 = 400')).toBeTruthy();
    next();
    next();
    expect(screen.getByText(/Final value 1875/)).toBeTruthy();
  });
  it('checks the applicable rule and keeps multiplication/division at one level rather than inventing brackets', () => {
    render(<IntegerLab kind="integer-order" mode="en" />);
    select('same-level');
    click('Check the order rule');
    expect(
      screen.queryByRole('button', {
        name: 'I predicted; reveal the next step',
      }),
    ).toBeNull();
    expect(screen.getByText(/Recheck the structure/)).toBeTruthy();
    select('multiply-divide');
    click('Check the order rule');
    next();
    expect(screen.getByText('36 ÷ 6 = 6')).toBeTruthy();
    next();
    expect(screen.getByText(/Final value 30/)).toBeTruthy();
    click('24 ÷ 6 × 2');
    select('same-level');
    click('Check the order rule');
    next();
    expect(screen.getByText('24 ÷ 6 = 4')).toBeTruthy();
    next();
    expect(screen.getByText(/Final value 8/)).toBeTruthy();
  });
  it('visibly processes a right-side bracket before an independent outside product', () => {
    const view = render(<IntegerLab kind="integer-order" mode="en" />);
    click('2 × 3 + ( 4 + 5 )');
    select('brackets');
    click('Check the order rule');
    next();
    expect(
      view.container.querySelector('.math-integer-steps li strong')!
        .textContent,
    ).toBe('4 + 5 = 9');
    expect(
      view.container.querySelector('.math-integer-expression')!.textContent,
    ).toBe('2 × 3 + 9');
    next();
    next();
    expect(screen.getByText(/Final value 15/)).toBeTruthy();
  });
  it('preserves counter count under row-column exchange and deduplicates the square factor', () => {
    const view = render(<IntegerLab kind="integer-factors" mode="en" />);
    expect(view.container.querySelectorAll('.integer-counter')).toHaveLength(
      24,
    );
    click('Swap rows and columns');
    expect(view.container.querySelectorAll('.integer-counter')).toHaveLength(
      24,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      '6 equal rows, 4 per row',
    );
    slide('Positive integer to explore', '36');
    expect(view.container.querySelectorAll('.integer-counter')).toHaveLength(
      36,
    );
    click('I listed factor pairs; check the full list');
    expect(
      screen.getByText(/Positive factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36/),
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Also show the zero multiple 0' }),
    );
    expect(
      view.container.querySelector('.math-integer-chips')!.textContent,
    ).toMatch(/^036/);
    slide('Positive integer to explore', '1');
    expect(view.container.querySelectorAll('.integer-counter')).toHaveLength(1);
    expect(screen.queryByText(/Positive factors of 36:/)).toBeNull();
  });
  it('keeps trial remainders and uses nontrivial factors and definition boundaries for classification', () => {
    const view = render(<IntegerLab kind="integer-prime" mode="en" />);
    click('49');
    click('I predicted the remainder; check trial division');
    expect(
      screen.getByText(/one failed trial does not prove primality/),
    ).toBeTruthy();
    expect(view.container.querySelectorAll('.integer-counter')).toHaveLength(
      48,
    );
    expect(
      view.container.querySelectorAll('.math-integer-leftover i'),
    ).toHaveLength(1);
    slide('Trial divisor', '7');
    click('I predicted the remainder; check trial division');
    expect(screen.getByText(/A nontrivial factor proves/)).toBeTruthy();
    expect(view.container.querySelectorAll('.integer-counter')).toHaveLength(
      49,
    );
    expect(
      view.container.querySelectorAll('.math-integer-leftover i'),
    ).toHaveLength(0);
    click('Check all positive factors and classification');
    expect(screen.getByText(/49: composite/)).toBeTruthy();
    click('0');
    click('Check all positive factors and classification');
    expect(screen.getByText(/0: neither prime nor composite/)).toBeTruthy();
    expect(screen.queryByRole('slider', { name: 'Trial divisor' })).toBeNull();
    click('1');
    click('Check all positive factors and classification');
    expect(screen.getByText(/1: neither prime nor composite/)).toBeTruthy();
    click('2');
    click('I predicted the remainder; check trial division');
    expect(screen.getByText(/The divisor is the number itself/)).toBeTruthy();
    click('Check all positive factors and classification');
    expect(screen.getByText(/2: prime/)).toBeTruthy();
  });
  it('distinguishes a valid common factor from the greatest and handles coprime and equal inputs', () => {
    render(<IntegerLab kind="integer-common" mode="en" />);
    click('Check whether the candidate divides both');
    expect(screen.getByText(/This is a common factor; compare/)).toBeTruthy();
    expect(screen.queryByText(/greatest 6/)).toBeNull();
    click('Check the greatest common factor');
    expect(screen.getByText(/greatest 6\. Use 6 bags/)).toBeTruthy();
    slide('Candidate bag count', '5');
    click('Check whether the candidate divides both');
    expect(screen.getByText(/not a common factor/)).toBeTruthy();
    slide('First positive integer a', '8');
    slide('Second positive integer b', '9');
    click('Check the greatest common factor');
    expect(screen.getByText(/greatest 1\. Use 1 bag/)).toBeTruthy();
    click('Common multiples · next coincidence');
    slide('First positive integer a', '6');
    slide('Second positive integer b', '6');
    click('Expand to the first positive common value');
    expect(screen.getByText(/First positive common value 6:/)).toBeTruthy();
  });
  it('does not conclude absence from a finite window and expands every earlier positive multiple through the first common value', () => {
    const view = render(<IntegerLab kind="integer-common" mode="en" />);
    click('Common multiples · next coincidence');
    slide('First positive integer a', '11');
    slide('Second positive integer b', '12');
    click('Highlight common values in this window');
    expect(
      screen.getByText(/That does not mean common multiples do not exist/),
    ).toBeTruthy();
    expect(view.container.querySelectorAll('.is-common')).toHaveLength(0);
    click('Expand to the first positive common value');
    expect(screen.getByText(/First positive common value 132:/)).toBeTruthy();
    expect(
      screen.queryByRole('button', {
        name: 'Highlight common values in this window',
      }),
    ).toBeNull();
    expect(
      screen.queryByText(/That does not mean common multiples do not exist/),
    ).toBeNull();
    expect(
      view.container.querySelectorAll('.math-integer-lists > div > div > span'),
    ).toHaveLength(23);
    expect(
      [...view.container.querySelectorAll('.is-common')].map(
        (e) => e.textContent,
      ),
    ).toEqual(['132 ·', '132 ·']);
  });
  it('has bilingual controls and unit explanations while a question array hides the derived column label', () => {
    const view = render(<IntegerLab kind="integer-factors" mode="bilingual" />);
    expect(screen.getByText('Positive integer to explore')).toBeTruthy();
    expect(screen.getByRole('slider', { name: '要研究的正整数' })).toBeTruthy();
    expect(screen.getByText(/每格是计数单位/)).toBeTruthy();
    expect(screen.getByText(/Each tile is a count unit/)).toBeTruthy();
    view.unmount();
    const array = render(<FactorArray n={21} rows={3} mode="en" hideColumns />);
    expect(array.container.querySelectorAll('.integer-counter')).toHaveLength(
      21,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '7',
    );
    expect(screen.getByText(/3 rows · \? per row · 21 in total/)).toBeTruthy();
  });
});
describe('P51 learner records and published integration', () => {
  it('restores a supported duration answer after rejecting a length suffix', () => {
    const view = mount('/math/lesson/P51-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('24 m');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('24 minutes');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/P51-L05');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('24 minutes');
  });
  it('restores sixth-question reasoning and parent review without grading its words or completing the lesson', () => {
    const view = mount('/math/lesson/P51-L02');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Division and multiplication share a level. Without brackets, divide twenty-four by six for four, then multiply by two for eight. Grouping six times two changes the divisor to twelve and the result to two.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/P51-L02');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      screen
        .getByRole('button', { name: 'Question 6' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P51-L02']
        .completedAt,
    ).toBeUndefined();
  });
  it('records all eight review items and restores their units while preserving lesson mastery', () => {
    const view = mount('/math/unit/P51/check');
    for (const [index, value] of Object.entries({
      1: '2040',
      2: '30',
      3: '8 cards',
      4: '3',
      6: '8 bags',
      7: '30 min',
    })) {
      click(`Question ${index}`);
      enter(value);
      check();
    }
    click('Question 5');
    click('C 2');
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Two is a shared factor but not the greatest. The common positive factors are one, two, three and six. Six bags each contain three red and four blue, restoring eighteen and twenty-four.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/P51/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['P51-CHECK'].answers['P51-CHECK-Q7'].input).toBe(
      '30 min',
    );
    expect(saved.sessions['P51-L01']).toBeUndefined();
  });
  it('retrieves new numbers and changed grouping after a saved order review becomes due', () => {
    const view = mount('/math/lesson/P51-L02');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('10');
    check();
    enter('18');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText('Calculate 20+2×2.')).toBeTruthy();
    enter('24');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P51-L02'].round).toBe(1);
    saved.sessions['P51-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText('Calculate (21+3)×2.')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
  it('publishes the five planned lessons and eight unit items while preserving all prior 42 lessons', () => {
    const unit = lessons.filter((l) => l.unit === 'P51');
    expect(unit).toHaveLength(5);
    expect(unitChecks.P51.questions).toHaveLength(8);
    unit.forEach((l) => {
      expect(l.contentStatus).toBe('ready');
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
      expect(reviewQuestionFor(l.id, 1).stem).not.toEqual(
        reviewQuestionFor(l.id, 0).stem,
      );
    });
    expect(
      lessons.filter((l) =>
        ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'P52', 'P53'].includes(
          l.unit!,
        ),
      ),
    ).toHaveLength(42);
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
