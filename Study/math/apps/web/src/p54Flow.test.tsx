// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FractionOperationLab } from './FractionOperationLabs';
import {
  FractionOperands,
  FractionOperationGrid,
} from './FractionOperationVisuals';
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
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const first = () => click('I predicted; show equal-size pieces');
const result = () => click('I counted; show joining or removal');
const simplify = () => click('Check simplest form and whole count');
const common = (d: string) => {
  select('Candidate common denominator', d);
  click('Check equal-piece size');
};
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
describe('P54 workshop', () => {
  it('hides derived results, joins actual equal-size cells and clears old stages after known-quantity changes', () => {
    const view = render(
      <FractionOperationLab kind="fraction-add-like" mode="en" />,
    );
    expect(screen.queryByText(/so the result is/)).toBeNull();
    first();
    expect(screen.queryByText(/so the result is/)).toBeNull();
    result();
    const rows = view.container.querySelectorAll('.math-fraction-grid-row');
    expect(rows).toHaveLength(3);
    const joined = rows[2]!;
    expect(joined.querySelectorAll('[data-state="A"]')).toHaveLength(3);
    expect(joined.querySelectorAll('[data-state="B"]')).toHaveLength(2);
    expect(joined.querySelectorAll('.fraction-operation-cell')).toHaveLength(8);
    expect(screen.getByText(/so the result is 5\/8/)).toBeTruthy();
    simplify();
    expect(screen.getByText(/Simplest representation 5\/8/)).toBeTruthy();
    slide('Numerator of A', '5');
    slide('Numerator of B', '7');
    expect(screen.queryByText(/so the result is 5\/8/)).toBeNull();
    first();
    result();
    simplify();
    expect(
      screen.getByText(/Simplest representation 3\/2; also 1 1\/2/),
    ).toBeTruthy();
    const final = view.container.querySelectorAll(
      '.math-fraction-grid-row',
    )[2]!;
    expect(final.querySelectorAll('.fraction-operation-cell')).toHaveLength(16);
    expect(final.querySelectorAll('[data-state="A"]')).toHaveLength(5);
    expect(final.querySelectorAll('[data-state="B"]')).toHaveLength(7);
  });
  it('crosses out removal rather than resizing tiles, allows zero and explicitly refuses negative material differences', () => {
    const view = render(
      <FractionOperationLab kind="fraction-subtract-like" mode="en" />,
    );
    first();
    result();
    simplify();
    expect(screen.getByText(/Simplest representation 1\/2/)).toBeTruthy();
    const final = view.container.querySelectorAll(
      '.math-fraction-grid-row',
    )[2]!;
    expect(final.querySelectorAll('[data-state="removed"]')).toHaveLength(3);
    expect(final.querySelectorAll('[data-state="A"]')).toHaveLength(4);
    slide('Numerator of B', '7');
    first();
    result();
    simplify();
    expect(
      screen.getByText(/Simplest representation 0; A zero difference is valid/),
    ).toBeTruthy();
    slide('Numerator of B', '8');
    expect(
      screen.getByText(/removed amount exceeds what is available/),
    ).toBeTruthy();
    expect(
      screen.queryByRole('button', {
        name: 'I predicted; show equal-size pieces',
      }),
    ).toBeNull();
    expect(
      (
        screen.getByRole('slider', {
          name: 'Numerator of B',
        }) as HTMLInputElement
      ).value,
    ).toBe('8');
  });
  it('checks both denominators, supports a nonleast valid common denominator and preserves amounts', () => {
    const view = render(
      <FractionOperationLab kind="fraction-add-unlike" mode="en" />,
    );
    expect(
      screen.queryByRole('button', {
        name: 'I predicted; show equal-size pieces',
      }),
    ).toBeNull();
    common('3');
    expect(screen.getByText(/3 does not work/)).toBeTruthy();
    expect(
      screen.queryByRole('button', {
        name: 'I predicted; show equal-size pieces',
      }),
    ).toBeNull();
    common('24');
    expect(screen.getByText(/24 works/)).toBeTruthy();
    first();
    const known = view.container.querySelectorAll('.math-fraction-grid-row');
    expect(known).toHaveLength(2);
    expect(known[0]!.querySelectorAll('[data-state="A"]')).toHaveLength(16);
    expect(known[1]!.querySelectorAll('[data-state="B"]')).toHaveLength(6);
    result();
    expect(screen.getByText(/so the result is 22\/24/)).toBeTruthy();
    simplify();
    expect(screen.getByText(/Simplest representation 11\/12/)).toBeTruthy();
    common('12');
    expect(screen.queryByText(/so the result is 22\/24/)).toBeNull();
  });
  it('retains real high-denominator partitions and a common whole width instead of substituting approximate tiles', () => {
    const view = render(
      <FractionOperationGrid
        left={{ n: 1, d: 11 }}
        right={{ n: 1, d: 12 }}
        operation="+"
        denominator={132}
        mode="en"
        result
      />,
    );
    expect(
      view.container.querySelectorAll('.fraction-operation-cell'),
    ).toHaveLength(132);
    expect(view.container.querySelectorAll('[data-state="A"]')).toHaveLength(
      12,
    );
    expect(view.container.querySelectorAll('[data-state="B"]')).toHaveLength(
      11,
    );
    const widths = [...view.container.querySelectorAll('rect')].map((e) =>
      e.getAttribute('width'),
    );
    expect(new Set(widths).size).toBe(1);
    expect(Number(widths[0])).toBe(11);
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
    view.unmount();
    const bars = render(
      <FractionOperands
        left={{ n: 3, d: 4 }}
        right={{ n: 1, d: 6 }}
        operation="−"
        mode="en"
      />,
    );
    expect(bars.container.querySelector('.math-fraction-op-result')).toBeNull();
    expect(screen.queryByText('7/12')).toBeNull();
  });
  it('subtracts unlike pieces with correct order and handles different representations of equal amounts', () => {
    const view = render(
      <FractionOperationLab kind="fraction-subtract-unlike" mode="en" />,
    );
    common('12');
    first();
    result();
    simplify();
    expect(screen.getByText(/Simplest representation 7\/12/)).toBeTruthy();
    const final = view.container.querySelectorAll(
      '.math-fraction-grid-row',
    )[2]!;
    expect(final.querySelectorAll('[data-state="removed"]')).toHaveLength(2);
    expect(final.querySelectorAll('[data-state="A"]')).toHaveLength(7);
    slide('Denominator of A', '3');
    slide('Numerator of A', '2');
    slide('Numerator of B', '4');
    common('6');
    first();
    result();
    simplify();
    expect(screen.getByText(/Simplest representation 0/)).toBeTruthy();
  });
  it('requires a sound story relationship, reveals only known operands first and changes units without stale results', () => {
    render(<FractionOperationLab kind="fraction-story" mode="en" />);
    expect(screen.queryByText('Known amount A')).toBeNull();
    select('Story operation', '−');
    click('Check the story relationship');
    expect(screen.getByText(/Recheck the unknown/)).toBeTruthy();
    expect(screen.queryByText('Known amount A')).toBeNull();
    select('Story operation', '+');
    click('Check the story relationship');
    common('12');
    first();
    result();
    simplify();
    expect(screen.getByText(/Simplest representation 17\/12 L/)).toBeTruthy();
    expect(screen.queryByText(/Final remainder: 17\/12 L/)).toBeNull();
    click('I predicted; check the second-step remainder');
    expect(
      screen.getByText(/Final remainder: 17\/12 L−6\/12 L=11\/12 L/),
    ).toBeTruthy();
    click('Cut a piece from a ribbon');
    expect(screen.queryByText(/Simplest representation 17\/12/)).toBeNull();
    select('Story operation', '−');
    click('Check the story relationship');
    common('12');
    first();
    result();
    simplify();
    expect(screen.getByText(/Simplest representation 7\/12 m/)).toBeTruthy();
    click('Use exactly the water available');
    select('Story operation', '−');
    click('Check the story relationship');
    common('6');
    first();
    result();
    simplify();
    expect(screen.getByText(/Simplest representation 0 L/)).toBeTruthy();
  });
  it('requires a fresh second-step prediction after changing the common denominator', () => {
    render(<FractionOperationLab kind="fraction-story" mode="en" />);
    select('Story operation', '+');
    click('Check the story relationship');
    common('12');
    first();
    result();
    simplify();
    click('I predicted; check the second-step remainder');
    expect(screen.getByText(/Final remainder: 17\/12 L/)).toBeTruthy();
    common('24');
    expect(screen.queryByText(/Final remainder: 17\/12 L/)).toBeNull();
    first();
    result();
    simplify();
    expect(screen.queryByText(/Final remainder: 17\/12 L/)).toBeNull();
    expect(
      screen.getByRole('button', {
        name: 'I predicted; check the second-step remainder',
      }),
    ).toBeTruthy();
    click('I predicted; check the second-step remainder');
    expect(
      screen.getByText(/Final remainder: 17\/12 L−6\/12 L=11\/12 L/),
    ).toBeTruthy();
  });
  it('provides bilingual labels and keyboard range bounds without leaking a computed answer in image descriptions', () => {
    render(
      <FractionOperationLab kind="fraction-add-unlike" mode="bilingual" />,
    );
    expect(screen.getByRole('slider', { name: 'A 的分母' })).toBeTruthy();
    expect(screen.getByText('Denominator of A')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: '共同分母候选' })).toBeTruthy();
    expect(
      screen
        .getAllByRole('img')
        .every((img) => !img.getAttribute('aria-label')!.includes('11/12')),
    ).toBe(true);
  });
});
describe('P54 saved learner records and publication', () => {
  it('explains equivalent-but-unfinished form and restores a supported simplest answer with its unit', () => {
    const view = mount('/math/lesson/P54-L02');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('4/6');
    check();
    expect(
      screen.getByText(/The value matches; finish the requested form/),
    ).toBeTruthy();
    enter('2/3');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/P54-L02');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2/3');
    expect(
      screen
        .getByRole('button', { name: 'Question 2' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('rejects length for a litre answer and restores the correct bilingual unit input', () => {
    const view = mount('/math/lesson/P54-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('11/12 m');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('11/12 升');
    check();
    view.unmount();
    mount('/math/lesson/P54-L05');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('11/12 升');
  });
  it('retains parent-reviewed reasoning and does not grade words or prematurely award mastery', () => {
    const view = mount('/math/lesson/P54-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'The two halves use different cakes as wholes. We need equal-size reference cakes or actual masses before joining. Matching denominators alone cannot justify one small cake.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/P54-L01');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P54-L01']
        .completedAt,
    ).toBeUndefined();
  });
  it('records all eight unit items and restores the two-step unit answer separately from lesson mastery', () => {
    const view = mount('/math/unit/P54/check');
    for (const [index, value] of Object.entries({
      1: '7/10',
      2: '2/3',
      3: '5/6',
      4: '13/24 m',
      6: '4/3 L',
      7: '5/12 L',
    })) {
      click(`Question ${index}`);
      enter(value);
      check();
    }
    click('Question 5');
    click('B 24');
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'The pizza wholes differ in size. Compare measured area or mass using one unit after obtaining the sizes, then combine. Without sizes, a definite count of small pizzas is not justified.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/P54/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['P54-CHECK'].answers['P54-CHECK-Q7'].input).toBe(
      '5/12 L',
    );
    expect(saved.sessions['P54-L01']).toBeUndefined();
  });
  it('retrieves changed fraction quantities and clears old input on a later due review', () => {
    const view = mount('/math/lesson/P54-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('2/5');
    check();
    enter('5/6');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText(/Calculate 1\/2\+1\/3/)).toBeTruthy();
    enter('5/6');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P54-L03'].round).toBe(1);
    saved.sessions['P54-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText(/Calculate 1\/3\+1\/4/)).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
  it('publishes all five planned lessons with unit and retrieval routes, retaining the earlier 47 lessons', () => {
    const unit = lessons.filter((l) => l.unit === 'P54');
    expect(unit).toHaveLength(5);
    expect(unitChecks.P54.questions).toHaveLength(8);
    const priorUnits = [
      'B01',
      'B02',
      'B03',
      'B04',
      'B05',
      'B06',
      'P51',
      'P52',
      'P53',
    ];
    const expectedIds = priorUnits.flatMap((unit) =>
      Array.from(
        { length: ['P52', 'P53'].includes(unit) ? 6 : 5 },
        (_, i) => `${unit}-L${String(i + 1).padStart(2, '0')}`,
      ),
    );
    expect(
      lessons
        .filter((l) => priorUnits.includes(l.unit ?? ''))
        .map((l) => l.id)
        .sort(),
    ).toEqual(expectedIds.sort());
    for (const l of unit) {
      expect(l.contentStatus).toBe('ready');
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    }
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
