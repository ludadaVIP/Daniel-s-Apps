// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StudyShell, type StudyDirectoryItem } from '@study/ui';

const directory: StudyDirectoryItem[] = [
  {
    id: 'stage',
    title: '阶段一',
    href: '/app/path?stage=1',
    children: [
      {
        id: 'unit',
        title: '单元一',
        children: [
          { id: 'one', title: '摩擦与运动', href: '/app/lesson/one' },
          { id: 'two', title: '观察与证据', href: '/app/lesson/two' },
        ],
      },
    ],
  },
  { id: 'later', title: '规划课程', badge: '规划中' },
];
function fixture(activePath = '/app') {
  return (
    <StudyShell
      brand={
        <a href="/app">
          <div>
            <strong>学习应用</strong>
          </div>
        </a>
      }
      navigation={
        <a href="/app" aria-label="探索首页">
          <span className="study-nav-label">探索首页</span>
        </a>
      }
      home={<a href="/">Study</a>}
      label="学习导航"
      title="课程学习"
      subject="Study"
      directory={directory}
      activePath={activePath}
      renderLink={(href, content, className, active) => (
        <a
          href={href}
          onClick={(event) => event.preventDefault()}
          className={className}
          aria-current={active ? 'page' : undefined}
        >
          {content}
        </a>
      )}
    >
      <main>当前学习内容</main>
    </StudyShell>
  );
}
beforeEach(() => localStorage.clear());
afterEach(cleanup);
describe('shared Study sidebar', () => {
  it('starts expanded, can fold, and remembers the preference on the next mount', () => {
    const view = render(fixture());
    expect(
      view.container
        .querySelector('.study-shell')
        ?.getAttribute('data-collapsed'),
    ).toBe('false');
    fireEvent.click(screen.getAllByRole('button', { name: '折叠左栏' })[0]!);
    expect(localStorage.getItem('study-sidebar-collapsed')).toBe('true');
    view.unmount();
    const next = render(fixture());
    expect(
      next.container
        .querySelector('.study-shell')
        ?.getAttribute('data-collapsed'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '展开左栏' }));
    expect(
      next.container
        .querySelector('.study-shell')
        ?.getAttribute('data-collapsed'),
    ).toBe('false');
  });
  it('opens the ancestors of the active lesson and marks the correct lesson', () => {
    render(fixture('/app/lesson/two'));
    expect(
      screen
        .getByRole('button', { name: '收起 阶段一' })
        .getAttribute('aria-expanded'),
    ).toBe('true');
    expect(
      screen
        .getByRole('link', { name: '观察与证据' })
        .getAttribute('aria-current'),
    ).toBe('page');
    expect(
      screen
        .getByRole('link', { name: '摩擦与运动' })
        .getAttribute('aria-current'),
    ).toBe(null);
    expect(
      screen
        .getByRole('button', { name: '规划课程 规划中' })
        .hasAttribute('disabled'),
    ).toBe(true);
  });
  it('filters lessons while retaining the stage and unit hierarchy', () => {
    render(fixture());
    fireEvent.change(screen.getByRole('searchbox', { name: '查找课程' }), {
      target: { value: '摩擦' },
    });
    expect(screen.getByRole('link', { name: '阶段一' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '单元一' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '摩擦与运动' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: '观察与证据' })).toBe(null);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: '不存在的课程' },
    });
    expect(screen.getByRole('status').textContent).toContain('没有找到');
  });
  it('closes the mobile drawer with Escape and after following a lesson', () => {
    const view = render(fixture('/app/lesson/one'));
    fireEvent.click(screen.getByRole('button', { name: '打开课程导航' }));
    expect(
      view.container
        .querySelector('.study-shell')
        ?.getAttribute('data-mobile-open'),
    ).toBe('true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(
      view.container
        .querySelector('.study-shell')
        ?.getAttribute('data-mobile-open'),
    ).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: '打开课程导航' }));
    fireEvent.click(screen.getByRole('link', { name: '摩擦与运动' }));
    expect(
      view.container
        .querySelector('.study-shell')
        ?.getAttribute('data-mobile-open'),
    ).toBe('false');
  });
});
