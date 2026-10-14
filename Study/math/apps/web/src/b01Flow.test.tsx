// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NumberLab } from './NumberLabs';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { lessons, openUnits } from './content';
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
describe('B01 learning and model flows', () => {
  it('lets a learner predict a number name before revealing it, then changes a place exactly', () => {
    render(<NumberLab kind="number-reader" mode="en" />);
    expect(screen.queryByText('ten thousand and five')).toBeNull();
    fireEvent.click(
      screen.getByRole('button', { name: 'I tried reading; show the names' }),
    );
    expect(screen.getByText('ten thousand and five')).toBeTruthy();
    fireEvent.change(screen.getByRole('combobox', { name: 'Hundreds digit' }), {
      target: { value: '3' },
    });
    expect(screen.getByText('10,305')).toBeTruthy();
    expect(screen.queryByText('ten thousand and five')).toBeNull();
    fireEvent.click(
      screen.getByRole('button', { name: 'I tried reading; show the names' }),
    );
    expect(
      screen.getByText('ten thousand three hundred and five'),
    ).toBeTruthy();
  });
  it('changes a digit contribution without moving the other places', () => {
    render(<NumberLab kind="place-value" mode="en" />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Hundreds digit' }), {
      target: { value: '5' },
    });
    expect(screen.getByText('62,507')).toBeTruthy();
    expect(screen.getByText('60,000 + 2,000 + 500 + 7 = 62,507')).toBeTruthy();
  });
  it('zooms the same number using exact axis coordinates', () => {
    render(<NumberLab kind="whole-line" mode="en" />);
    fireEvent.click(screen.getByRole('button', { name: '500–520' }));
    const image = screen.getByRole('img', {
      name: /Number line from 500 to 520/,
    });
    expect(image.querySelector('circle')!.getAttribute('cx')).toBe('377');
    expect(
      (
        screen.getByRole('slider', {
          name: 'Number to locate',
        }) as HTMLInputElement
      ).value,
    ).toBe('512');
    expect(screen.getByText(/to the left of 516/)).toBeTruthy();
  });
  it('renders exactly the same number of unit squares after both regrouping directions', () => {
    const view = render(<NumberLab kind="regroup" mode="en" />);
    expect(view.container.querySelectorAll('.math-base-block i').length).toBe(
      243,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'One hundred → ten tens' }),
    );
    expect(screen.getByText('1 × 100 + 14 × 10 + 3 = 243')).toBeTruthy();
    expect(view.container.querySelectorAll('.math-base-block i').length).toBe(
      243,
    );
    expect(
      view.container.querySelectorAll('.math-base-block.tens').length,
    ).toBe(14);
    fireEvent.click(
      screen.getByRole('button', { name: 'Ten tens → one hundred' }),
    );
    expect(
      view.container.querySelectorAll('.math-base-block.hundreds').length,
    ).toBe(2);
    expect(view.container.querySelectorAll('.math-base-block i').length).toBe(
      243,
    );
  });
  it('shows ties, carrying and the direct-rounding counterexample correctly', () => {
    render(<NumberLab kind="rounding" mode="en" />);
    fireEvent.change(screen.getByRole('slider', { name: 'Exact value' }), {
      target: { value: '9995' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Nearest ten' }));
    expect(screen.getByText('9,995 ≈ 10,000')).toBeTruthy();
    expect(
      screen
        .getByRole('img', { name: /Number line from 9990 to 10000/ })
        .querySelector('circle')!
        .getAttribute('cx'),
    ).toBe('320');
    fireEvent.click(screen.getByRole('button', { name: 'Nearest thousand' }));
    fireEvent.change(screen.getByRole('slider', { name: 'Exact value' }), {
      target: { value: '4499' },
    });
    expect(screen.getByText('4,499 ≈ 4,000')).toBeTruthy();
  });
  it('preserves the sixth practice question and a parent-reviewed explanation across reload', () => {
    const view = mount('/math/lesson/B01-L02');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Question 6' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: { value: 'The 2 means 200 because it is in hundreds, not tens.' },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Parent confirms: reasoning makes sense',
      }),
    );
    view.unmount();
    mount('/math/lesson/B01-L02');
    expect(
      screen
        .getByRole('button', { name: 'Question 6' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B01-L02'].answers['B01-L02-Q6'].independent).toBe(
      true,
    );
  });
  it('completes and restores all seven unit review questions without altering lesson mastery', () => {
    const view = mount('/math/unit/B01/check');
    const answers = ['90,320', '800', '6,090', '450', '8,500', '336'];
    answers.forEach((answer, i) => {
      fireEvent.click(
        screen.getByRole('button', { name: `Question ${i + 1}` }),
      );
      fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
        target: { value: answer },
      });
      fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
    });
    fireEvent.click(screen.getByRole('button', { name: 'Question 7' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'One has 5 ones and the other 5 tens. Both have 7 thousands, but their values differ by 45.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Parent confirms: reasoning makes sense',
      }),
    );
    expect(
      screen.getByText(/Recorded 7\/7; 7 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/B01/check');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(
      screen
        .getByRole('button', { name: 'Question 7' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B01-L01']).toBeUndefined();
    expect(Object.keys(saved.sessions['B01-CHECK'].answers)).toHaveLength(7);
  });
  it('lists all open units and every published learner lesson card', () => {
    const view = mount('/math');
    expect(view.container.querySelectorAll('.math-lesson-card')).toHaveLength(
      lessons.length,
    );
    expect(
      screen.getByText(
        `${openUnits.length} UNITS · ${lessons.length} MICRO-LESSONS`,
      ),
    ).toBeTruthy();
    expect(
      screen.getAllByRole('link', { name: /Unit review/ }).length,
    ).toBeGreaterThan(0);
  });
});
