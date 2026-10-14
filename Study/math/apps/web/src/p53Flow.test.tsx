// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FractionLab } from './FractionLabs';
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
const check = () =>
  fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
const shadedWidths = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll('.math-fraction-wholes .fraction-shading'),
  ).map((e) => Number(e.getAttribute('width')));
describe('P53 interactive representations and learning closure', () => {
  it('shows both languages for model legends in bilingual mode', () => {
    const view = render(
      <FractionLab kind="fraction-equivalent" mode="bilingual" />,
    );
    expect(screen.getByText('原来单位')).toBeTruthy();
    expect(screen.getByText('Original units')).toBeTruthy();
    expect(screen.getByText('细分单位')).toBeTruthy();
    expect(screen.getByText('Finer units')).toBeTruthy();
    view.unmount();
    render(<FractionLab kind="fraction-simplify" mode="bilingual" />);
    expect(screen.getByText('Original groups')).toBeTruthy();
    expect(screen.getByText('Current groups')).toBeTruthy();
  });
  it('keeps the length scale fixed while distinguishing the same unit fraction of different wholes', () => {
    const view = render(<FractionLab kind="fraction-whole" mode="en" />);
    const track = screen.getByRole('img', {
      name: /Fixed track represents eighteen metres/,
    });
    expect(track.getAttribute('aria-label')).toContain('whole 12 metres');
    slider('Whole length (metres)', '6');
    expect(track.getAttribute('aria-label')).toContain('whole 6 metres');
    expect(track.getAttribute('aria-label')).toContain('3/2 metres');
    expect(screen.getByLabelText('1/4')).toBeTruthy();
    expect(screen.getByLabelText('3/2')).toBeTruthy();
    expect(
      parseFloat(
        view.container.querySelector<HTMLElement>(
          '.math-fraction-length-track > div',
        )!.style.width,
      ),
    ).toBeCloseTo(100 / 3, 3);
  });
  it('renders exact whole strips and includes equality at the improper boundary', () => {
    const view = render(<FractionLab kind="fraction-kind" mode="en" />);
    expect(shadedWidths(view.container)).toEqual([600, 450]);
    fireEvent.click(screen.getByRole('button', { name: '4/4' }));
    expect(
      screen.getByText(/improper fraction. Here it equals exactly one/),
    ).toBeTruthy();
    expect(shadedWidths(view.container)).toEqual([600]);
    slider('Total part count (numerator)', '0');
    expect(screen.getByText(/Zero: no shading/)).toBeTruthy();
    expect(shadedWidths(view.container)).toEqual([0]);
  });
  it('shows mixed conversion as complete wholes plus a proper remainder, including integral results', () => {
    render(<FractionLab kind="fraction-mixed" mode="en" />);
    expect(screen.getByText(/11=2×4\+3/)).toBeTruthy();
    expect(screen.getByLabelText('3/4')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '8/4' }));
    expect(
      screen.getByText(/There is no remainder; write an integer/),
    ).toBeTruthy();
    expect(screen.queryByLabelText('0/4')).toBeNull();
    expect(screen.getByText('2 × 4 + 0 = 8')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '3/4' }));
    expect(
      screen.getByText(/Below one whole: keep a proper fraction/),
    ).toBeTruthy();
  });
  it('refines both counts while preserving exact shaded endpoints and overlay cuts', () => {
    const view = render(<FractionLab kind="fraction-equivalent" mode="en" />);
    expect(shadedWidths(view.container)).toEqual([400, 400]);
    slider('Refinement factor', '4');
    expect(screen.getAllByLabelText('8/12').length).toBeGreaterThan(0);
    expect(shadedWidths(view.container)).toEqual([400, 400]);
    fireEvent.click(
      screen.getByRole('button', { name: 'I predicted; overlay the strips' }),
    );
    const overlay = view.container.querySelector('.math-fraction-overlay')!;
    expect(overlay.querySelectorAll('.fraction-fine-line')).toHaveLength(11);
    expect(
      overlay.querySelector('.fraction-shading')!.getAttribute('width'),
    ).toBe('400');
    slider('Refinement factor', '3');
    expect(view.container.querySelector('.math-fraction-overlay')).toBeNull();
  });
  it('permits successive common-factor grouping while retaining the original amount', () => {
    const view = render(<FractionLab kind="fraction-simplify" mode="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Divide both by 2' }));
    expect(screen.getByText(/Common factors 3 remain/)).toBeTruthy();
    expect(shadedWidths(view.container)).toEqual([400, 400]);
    expect(screen.getByText('(12 ÷ 2) / (18 ÷ 2) = 6/9')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Divide both by 3' }));
    expect(
      screen.getByText(/Simplest form: numerator and denominator/),
    ).toBeTruthy();
    expect(shadedWidths(view.container)).toEqual([400, 400]);
    expect(screen.queryByRole('button', { name: /Divide both/ })).toBeNull();
  });
  it('reveals a common unit before exact comparison and handles equivalent fractions', () => {
    const view = render(<FractionLab kind="fraction-compare" mode="en" />);
    expect(view.container.querySelector('.math-fraction-common')).toBeNull();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'I predicted; show common denominator',
      }),
    );
    expect(screen.getByText(/least common denominator is 12/)).toBeTruthy();
    expect(shadedWidths(view.container)).toEqual([450, 400, 450, 400]);
    fireEvent.click(screen.getByRole('button', { name: '2/3 · 4/6' }));
    expect(view.container.querySelector('.math-fraction-common')).toBeNull();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'I predicted; show common denominator',
      }),
    );
    expect(
      view.container.querySelector(
        '.math-fraction-common .math-fraction-readout',
      )!.textContent,
    ).toContain('=');
    expect(shadedWidths(view.container)).toEqual([400, 400, 400, 400]);
  });
  it('distinguishes equivalent quantity from an unfinished simplest-form task without marking quantity wrong', () => {
    mount('/math/lesson/P53-L05');
    fireEvent.click(screen.getByRole('button', { name: /04 Together/ }));
    expect(
      screen.getByText(
        'Use a simplest fraction; an integer result can use an integer',
      ),
    ).toBeTruthy();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
      target: { value: '6/9' },
    });
    check();
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
      target: { value: '2/3' },
    });
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('restores the seventh practice answer and requested representation feedback after reload', () => {
    const view = mount('/math/lesson/P53-L04');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Question 7' }));
    fireEvent.click(screen.getByRole('button', { name: 'C Equal amounts' }));
    check();
    view.unmount();
    mount('/math/lesson/P53-L04');
    expect(
      screen
        .getByRole('button', { name: 'Question 7' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it('records all eight review items and restores mixed-number and parent-reviewed reasoning', () => {
    const view = mount('/math/unit/P53/check');
    const answers: Record<number, string> = {
      1: '1/7',
      3: '2 2/8',
      4: '11/5',
      5: '12',
      6: '3/4',
      7: '21/30',
    };
    for (const [index, answer] of Object.entries(answers)) {
      fireEvent.click(
        screen.getByRole('button', { name: `Question ${index}` }),
      );
      fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
        target: { value: answer },
      });
      check();
    }
    fireEvent.click(screen.getByRole('button', { name: 'Question 2' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'B Improper, above one' }),
    );
    check();
    fireEvent.click(screen.getByRole('button', { name: 'Question 8' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'The wholes differ: half of 50 g is 25 g, but one third of 80 g is 26 2/3 g. Compare actual masses, not just fraction labels.',
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
    mount('/math/unit/P53/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.queryByRole('alert')).toBeNull();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['P53-CHECK'].answers['P53-CHECK-Q3'].input).toBe(
      '2 2/8',
    );
    expect(saved.sessions['P53-L01']).toBeUndefined();
  });
  it('publishes six planned lessons and review variants coherently without removing earlier content', () => {
    const p53 = lessons.filter((l) => l.unit === 'P53');
    expect(p53).toHaveLength(6);
    expect(unitChecks.P53.questions).toHaveLength(8);
    expect(lessons.filter((l) => l.unit === 'B01')).toHaveLength(5);
    expect(lessons.filter((l) => l.unit === 'B04')).toHaveLength(5);
    expect(lessons.filter((l) => l.unit === 'P52')).toHaveLength(6);
    p53.forEach((l) => {
      expect(l.contentStatus).toBe('ready');
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
      expect(reviewQuestionFor(l.id, 1).answer).not.toEqual(
        reviewQuestionFor(l.id, 0).answer,
      );
    });
    expect(
      curriculum
        .flatMap((s) =>
          s.units.flatMap((u) =>
            u.lessons.filter((l) => l.available).map((l) => l.id),
          ),
        )
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
  });
});
