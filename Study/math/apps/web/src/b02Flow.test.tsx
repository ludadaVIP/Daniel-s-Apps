// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OperationLab } from './OperationLabs';
import { NumberDiagramView } from './NumberVisuals';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import {
  lessons,
  curriculum,
  openUnits,
  reviewQuestionFor,
  unitChecks,
} from './content';

vi.setConfig({ testTimeout: 20000 });
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const click = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
    target: { value },
  });
const check = () =>
  fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
const tokenCount = (container: HTMLElement) =>
  container.querySelectorAll('.math-op-token').length;

describe('B02 interactive quantities and learning closure', () => {
  it('holds the original total fixed when only the removed part changes', () => {
    const view = render(<OperationLab kind="operation-parts" mode="en" />);
    expect(tokenCount(view.container)).toBe(12);
    click('Take away');
    slide('Amount removed', '6');
    expect(screen.getByText('12 − 6 = 6')).toBeTruthy();
    expect(
      (
        screen.getByRole('slider', {
          name: 'Original total',
        }) as HTMLInputElement
      ).value,
    ).toBe('12');
    expect(tokenCount(view.container)).toBe(12);
    expect(view.container.querySelectorAll('.is-removed')).toHaveLength(6);
    slide('Amount removed', '12');
    expect(view.container.querySelectorAll('.is-removed')).toHaveLength(12);
    expect(screen.getByText('12 − 12 = 0')).toBeTruthy();
  });

  it('marks a comparison difference while retaining both groups and handles equality', () => {
    const view = render(<OperationLab kind="operation-parts" mode="en" />);
    click('Compare difference');
    expect(tokenCount(view.container)).toBe(12);
    expect(view.container.querySelectorAll('.is-unpaired')).toHaveLength(2);
    expect(view.container.querySelectorAll('.is-removed')).toHaveLength(0);
    expect(screen.getByText('7 − 5 = 2')).toBeTruthy();
    slide('Count A', '5');
    expect(view.container.querySelectorAll('.is-unpaired')).toHaveLength(0);
    expect(screen.getByText('5 − 5 = 0')).toBeTruthy();
    slide('Count A', '0');
    expect(screen.getByText('5 − 0 = 5')).toBeTruthy();
  });

  it('rotates the array without changing count, with zero groups represented honestly', () => {
    const view = render(<OperationLab kind="operation-array" mode="en" />);
    expect(
      view.container.querySelectorAll('.math-op-groups > div'),
    ).toHaveLength(3);
    expect(tokenCount(view.container)).toBe(12);
    click('Array');
    expect(
      view.container.querySelector<HTMLElement>('.math-op-array')!.style
        .gridTemplateColumns,
    ).toBe('repeat(4,18px)');
    click('Swap factors');
    expect(
      view.container.querySelector<HTMLElement>('.math-op-array')!.style
        .gridTemplateColumns,
    ).toBe('repeat(3,18px)');
    expect(screen.getByText('4 × 3 = 12')).toBeTruthy();
    expect(tokenCount(view.container)).toBe(12);
    slide('Group count', '0');
    expect(tokenCount(view.container)).toBe(0);
    expect(screen.getByText(/The total is zero/)).toBeTruthy();
    click('Swap factors');
    expect(
      (
        screen.getByRole('slider', {
          name: 'Amount per group',
        }) as HTMLInputElement
      ).value,
    ).toBe('0');
    expect(screen.getByText('3 × 0 = 0')).toBeTruthy();
  });

  it('changes what the divisor means while retaining all 23 counters and the outside remainder', () => {
    const view = render(<OperationLab kind="operation-division" mode="en" />);
    expect(
      screen.getByRole('img', {
        name: '24 counters; 6 groups of 4; 0 left outside',
      }),
    ).toBeTruthy();
    click('Known group size · grouping');
    expect(
      screen.getByRole('img', {
        name: '24 counters; 4 groups of 6; 0 left outside',
      }),
    ).toBeTruthy();
    click('23 ÷ 5');
    expect(screen.getByText('23 = 5 × 4 + 3')).toBeTruthy();
    expect(screen.queryByText('23 ÷ 5 = 4')).toBeNull();
    expect(tokenCount(view.container)).toBe(23);
    expect(
      view.container.querySelectorAll('.math-op-groups > div'),
    ).toHaveLength(4);
    click('Known share count · sharing');
    expect(
      screen.getByRole('img', {
        name: '23 counters; 5 groups of 4; 3 left outside',
      }),
    ).toBeTruthy();
    expect(
      view.container.querySelectorAll('.math-op-groups > div'),
    ).toHaveLength(5);
    expect(tokenCount(view.container)).toBe(23);
    expect(
      screen
        .getByRole('slider', { name: 'Recipient count' })
        .getAttribute('min'),
    ).toBe('1');
    slide('Total counters', '2');
    expect(
      screen.getByRole('img', {
        name: '2 counters; 5 groups of 0; 2 left outside',
      }),
    ).toBeTruthy();
    expect(tokenCount(view.container)).toBe(2);
  });

  it('keeps zero totals valid while never displaying an inverse division by zero', () => {
    const view = render(<OperationLab kind="operation-inverse" mode="en" />);
    slide('Group count', '0');
    slide('Amount per group', '5');
    expect(screen.getByText('0 ÷ 5 = 0')).toBeTruthy();
    expect(
      view.container.querySelector('.math-op-facts')!.textContent,
    ).not.toContain('÷ 0');
    expect(tokenCount(view.container)).toBe(0);
    slide('Amount per group', '0');
    expect(
      view.container.querySelectorAll('.math-op-facts > strong'),
    ).toHaveLength(1);
    expect(view.container.querySelector('.math-op-facts')!.textContent).toBe(
      '0 × 0 = 0',
    );
    expect(screen.getByText(/cannot uniquely recover a factor/)).toBeTruthy();
  });

  it('reveals a model only after relationship selection and resets it for a new story', () => {
    const view = render(<OperationLab kind="operation-choose" mode="en" />);
    click('Subtraction −');
    expect(screen.getByRole('status').textContent).toContain(
      'Two parts combine',
    );
    expect(view.container.querySelector('.math-number-readout')).toBeNull();
    click('Addition +');
    expect(screen.getByText('14 + 9 = 23')).toBeTruthy();
    expect(tokenCount(view.container)).toBe(23);
    click('Case 5');
    expect(view.container.querySelector('.math-number-readout')).toBeNull();
    expect(screen.getByText('Bag count: ? bags')).toBeTruthy();
    click('Division ÷');
    expect(screen.getByText('28 ÷ 4 = 7')).toBeTruthy();
    expect(
      view.container.querySelectorAll('.math-op-groups > div'),
    ).toHaveLength(7);
  });

  it('provides bilingual roles and leaves quiz results to the learner in accessible picture labels', () => {
    const view = render(
      <OperationLab kind="operation-choose" mode="bilingual" />,
    );
    expect(screen.getByText('红球部分：14 个')).toBeTruthy();
    expect(screen.getByText('Red part: 14 balls')).toBeTruthy();
    view.unmount();
    const array = render(
      <NumberDiagramView
        diagram={{ kind: 'operation-array', groups: 3, perGroup: 6 }}
        mode="en"
      />,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe(
      '3 equal groups of 6',
    );
    expect(tokenCount(array.container)).toBe(18);
    array.unmount();
    render(
      <NumberDiagramView
        diagram={{
          kind: 'operation-sharing',
          total: 20,
          divisor: 4,
          mode: 'share',
        }}
        mode="en"
      />,
    );
    expect(
      screen.getByRole('img', {
        name: /20 counters shared equally among 4 recipients/,
      }),
    ).toBeTruthy();
    expect(screen.queryByRole('img', { name: /groups of 5/ })).toBeNull();
  });

  it('preserves sixth-question reasoning and parent review across reload without auto-grading text', () => {
    const view = mount('/math/lesson/B02-L04');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Zero times many factors is zero, so zero division cannot uniquely recover five. But 0 divided by 5 is 0.',
      },
    });
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/B02-L04');
    expect(
      screen
        .getByRole('button', { name: 'Question 6' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B02-L04'].answers['B02-L04-Q6'].checked).toBe(true);
    expect(saved.sessions['B02-L04'].completedAt).toBeUndefined();
  });

  it('rejects a fractional full-box count and a mismatched unit with usable feedback', () => {
    const view = mount('/math/lesson/B02-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 4');
    enter('4.6');
    check();
    expect(screen.getByRole('status').textContent).toContain(
      'Four boxes need twenty',
    );
    enter('4');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/B02-L05');
    fireEvent.click(screen.getByRole('button', { name: /04 Together/ }));
    enter('12 m');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('NZ$12');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });

  it('restores eight unit-check answers and manual explanation while leaving lesson mastery untouched', () => {
    const view = mount('/math/unit/B02/check');
    for (const [index, answer] of Object.entries({
      1: '14',
      3: '28',
      4: '5',
      5: '6',
      6: '7',
      7: 'NZ$10',
    })) {
      click(`Question ${index}`);
      enter(answer);
      check();
    }
    click('Question 2');
    click('B 5×4');
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          '24 balls among 6 people gives 4 balls each. 24 balls at 6 per box fills 4 boxes. The quotient units differ.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/B02/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.queryByRole('alert')).toBeNull();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B02-CHECK'].answers['B02-CHECK-Q7'].input).toBe(
      'NZ$10',
    );
    expect(saved.sessions['B02-L01']).toBeUndefined();
  });

  it('queues supported division practice and changes the retrieval story after a saved review becomes due', () => {
    const view = mount('/math/lesson/B02-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 4');
    click('A little hint');
    enter('4');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText(/Share 2 indivisible counters equally among 2 people/),
    ).toBeTruthy();
    enter('1');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    expect(screen.getByText('Nothing waiting for review.')).toBeTruthy();
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['B02-L03'].round).toBe(1);
    saved.sessions['B02-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText(/Pack 7 counters 3 per box/)).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('registers the complete unit with all prior lessons, reviews and planned IDs preserved', () => {
    const unit = lessons.filter((l) => l.unit === 'B02');
    expect(unit).toHaveLength(5);
    expect(unitChecks.B02.questions).toHaveLength(8);
    expect(lessons).toHaveLength(27);
    expect(openUnits).toHaveLength(5);
    for (const l of unit) {
      expect(l.contentStatus).toBe('ready');
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
      expect(reviewQuestionFor(l.id, 1).stem).not.toEqual(
        reviewQuestionFor(l.id, 0).stem,
      );
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
    expect(
      lessons.filter((l) => ['B01', 'B04', 'P52', 'P53'].includes(l.unit!)),
    ).toHaveLength(22);
  });
});
