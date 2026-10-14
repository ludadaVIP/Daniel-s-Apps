// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DecimalLab } from './DecimalLabs';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { curriculum, lessons, reviewQuestionFor, unitChecks } from './content';
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
const slider = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
describe('P52 interactive learning and integration', () => {
  it('changes one decimal digit while retaining unit-labelled zoom scales', () => {
    render(<DecimalLab kind="decimal-place" mode="en" />);
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Thousandths digit' }),
      { target: { value: '7' } },
    );
    expect(screen.getByText('2.307')).toBeTruthy();
    expect(screen.getByText('2.000 + 0.300 + 0.007 = 2.307')).toBeTruthy();
    const windows = screen.getAllByRole('img');
    expect(windows).toHaveLength(3);
    expect(windows[0]!.getAttribute('aria-label')).toContain(
      'each cell is 0.100; shaded amount 0.307',
    );
    expect(windows[1]!.getAttribute('aria-label')).toContain(
      '0.300 to 0.400; each cell is 0.010; shaded amount 0.007',
    );
    expect(windows[2]!.getAttribute('aria-label')).toContain(
      'each cell is 0.001; shaded amount 0.007',
    );
  });
  it('uses aligned digits and exact coordinates, then rounds separately across 9s', () => {
    render(<DecimalLab kind="decimal-compare" mode="en" />);
    expect(screen.getByText('0.805 > 0.800')).toBeTruthy();
    expect(
      screen.getByText(/first differing place is thousandths/),
    ).toBeTruthy();
    const circles = screen.getByRole('img').querySelectorAll('circle');
    expect(Number(circles[0]!.getAttribute('cx'))).toBeCloseTo(
      40 + (805 / 3000) * 560,
    );
    fireEvent.click(screen.getByRole('button', { name: '0.500 / 0.450' }));
    expect(screen.getByText('0.500 > 0.450')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '1.995 / 2.000' }));
    fireEvent.click(screen.getByRole('button', { name: 'Nearest hundredth' }));
    expect(screen.getByText('1.995 ≈ 2.00')).toBeTruthy();
    expect(screen.getByText('1.995 < 2.000')).toBeTruthy();
  });
  it('shows real carry and successive borrow steps, hiding them after an operand change', () => {
    const view = render(<DecimalLab kind="decimal-add" mode="en" />);
    expect(screen.getByText('2.750 + 0.680 = 3.430')).toBeTruthy();
    fireEvent.click(
      screen.getByRole('button', { name: 'I predicted; show column steps' }),
    );
    expect(screen.getByText(/Hundredths: 5\+8\+0/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '1.003 − 0.508' }));
    expect(
      view.container.querySelector('.math-decimal-column-steps'),
    ).toBeNull();
    expect(screen.getByText('1.003 − 0.508 = 0.495')).toBeTruthy();
    fireEvent.click(
      screen.getByRole('button', { name: 'I predicted; show column steps' }),
    );
    expect(
      screen.getAllByText(/Borrow one larger unit from the left/),
    ).toHaveLength(3);
    expect(
      view.container.querySelector('.math-decimal-column-steps')!.textContent,
    ).not.toMatch(/=-\d/);
    slider('Second amount', '500');
    expect(
      view.container.querySelector('.math-decimal-column-steps'),
    ).toBeNull();
    expect(screen.getByText('1.003 − 0.500 = 0.503')).toBeTruthy();
  });
  it('models zero groups as zero and changes group lengths proportionally', () => {
    const view = render(<DecimalLab kind="decimal-multiply" mode="en" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'total 1.300',
    );
    slider('Amount per group', '600');
    expect(
      view.container.querySelector<HTMLElement>('.math-decimal-group-track i')!
        .style.width,
    ).toBe('30%');
    expect(screen.getByText('0.600 × 4 = 2.400')).toBeTruthy();
    slider('Group count', '0');
    expect(screen.getByText('0.600 × 0 = 0.000')).toBeTruthy();
    expect(
      view.container.querySelectorAll('.math-decimal-group-track'),
    ).toHaveLength(0);
  });
  it('labels rounded thirds as approximate and preserves the exact share', () => {
    render(<DecimalLab kind="decimal-divide" mode="en" />);
    expect(screen.getByText('1.500 ÷ 4 = 0.375')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '1.000 ÷ 3' }));
    expect(screen.getByText('1.000 ÷ 3 ≈ 0.333')).toBeTruthy();
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'exactly 1/3 litre',
    );
    expect(
      screen.getByText(/rounded displays gives 0.999 litres/),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '2.000 ÷ 3' }));
    expect(screen.getByText('2.000 ÷ 3 ≈ 0.667')).toBeTruthy();
    expect(
      screen.getByText(/rounded displays gives 2.001 litres/),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('slider', { name: 'Equal-share count' })
        .getAttribute('min'),
    ).toBe('1');
  });
  it('reports a positive shortfall and keeps estimated totals separate', () => {
    render(<DecimalLab kind="decimal-application" mode="en" />);
    expect(screen.getByText('≈ NZ$3.90')).toBeTruthy();
    expect(screen.getByText('NZ$1.25 × 3 = NZ$3.75')).toBeTruthy();
    slider('Unit price (NZD)', '400');
    slider('Item count', '4');
    expect(screen.getByText(/Shortfall NZ\$11.00/)).toBeTruthy();
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'shortfall NZ$11.00',
    );
  });
  it('retains the sixth practice explanation and parent review across a reload', () => {
    const view = mount('/math/lesson/P52-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Question 6' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          '0.333 times 3 is 0.999, so the exact share is 1/3, not the three-digit display.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Parent confirms: reasoning makes sense',
      }),
    );
    view.unmount();
    mount('/math/lesson/P52-L05');
    expect(
      screen
        .getByRole('button', { name: 'Question 6' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it('records and restores all eight unit-review answers without claiming lesson mastery', () => {
    const view = mount('/math/unit/P52/check');
    ['.502', '.66', '3', '2.758', '.6', '0.450 litres', 'NZ$4.60'].forEach(
      (answer, i) => {
        fireEvent.click(
          screen.getByRole('button', { name: `Question ${i + 1}` }),
        );
        fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
          target: { value: answer },
        });
        fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Question 8' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Four quarters make exactly one. Three rounded thirds make 0.999, so keep the approximate sign.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Parent confirms: reasoning makes sense',
      }),
    );
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/P52/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.queryByRole('alert')).toBeNull();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(Object.keys(saved.sessions['P52-CHECK'].answers)).toHaveLength(8);
    expect(saved.sessions['P52-L01']).toBeUndefined();
  });
  it('registers all six lessons, individual retrieval generators and the unit review coherently', () => {
    const p52 = lessons.filter((l) => l.unit === 'P52');
    expect(p52).toHaveLength(6);
    expect(unitChecks.P52.questions).toHaveLength(8);
    for (const l of p52) {
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
      expect(reviewQuestionFor(l.id, 1).answer).not.toEqual(
        reviewQuestionFor(l.id, 0).answer,
      );
    }
    const available = curriculum
      .flatMap((s) =>
        s.units.flatMap((u) =>
          u.lessons.filter((l) => l.available).map((l) => l.id),
        ),
      )
      .sort();
    expect(available).toEqual(lessons.map((l) => l.id).sort());
  });
  it('queues supported decimal work and restores a new retrieval variant after its next due date', () => {
    const view = mount('/math/lesson/P52-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Question 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'A little hint' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
      target: { value: '1.650' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText('2.306 − 0.580 = ?')).toBeTruthy();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
      target: { value: '1.726' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    expect(screen.getByText('Nothing waiting for review.')).toBeTruthy();
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P52-L03'].round).toBe(1);
    saved.sessions['P52-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText('2.316 + 0.580 = ?')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
