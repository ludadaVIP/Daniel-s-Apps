import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';

function storedLanguage(): LanguageMode {
  try {
    const stored = window.localStorage.getItem('study-language');
    return stored === 'zh' || stored === 'en' || stored === 'bilingual'
      ? stored
      : 'bilingual';
  } catch {
    return 'bilingual';
  }
}

export function useLanguageMode() {
  const [mode, setMode] = useState<LanguageMode>(storedLanguage);

  useEffect(() => {
    document.documentElement.lang = mode === 'en' ? 'en' : 'zh';
    try {
      window.localStorage.setItem('study-language', mode);
    } catch {
      // Continue without persistence when storage is unavailable.
    }
  }, [mode]);

  return [mode, setMode] as const;
}

export function LanguageSwitcher({
  mode,
  onChange,
  className,
}: {
  mode: LanguageMode;
  onChange: (mode: LanguageMode) => void;
  className?: string;
}) {
  return (
    <div className={className} role="group" aria-label="Language / 语言">
      {(
        [
          ['zh', '中文'],
          ['en', 'EN'],
          ['bilingual', '双语'],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={mode === value ? 'selected' : ''}
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type LocalizedProps = {
  text: LocalizedText;
  mode: LanguageMode;
  className?: string;
  secondaryClassName?: string;
};

export function Localized({
  text,
  mode,
  className,
  secondaryClassName,
}: LocalizedProps) {
  if (mode === 'en') return <span className={className}>{text.en}</span>;
  if (mode === 'zh') return <span className={className}>{text.zh}</span>;

  return (
    <span className={className}>
      <span>{text.zh}</span>
      <span
        className={
          secondaryClassName ?? 'block text-[0.78em] font-normal opacity-70'
        }
      >
        {text.en}
      </span>
    </span>
  );
}

export type StudyDirectoryItem = {
  id: string;
  title: string;
  href?: string;
  badge?: string;
  children?: StudyDirectoryItem[];
};

export function StudyIcon({
  name,
  size = 20,
}: {
  name:
    | 'menu'
    | 'close'
    | 'collapse'
    | 'expand'
    | 'home'
    | 'path'
    | 'lab'
    | 'review'
    | 'notebook'
    | 'keyboard'
    | 'report'
    | 'back'
    | 'chevron';
  size?: number;
}) {
  const paths = {
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'm6 6 12 12M18 6 6 18',
    collapse: 'M9 4v16M4 4h16v16H4V4Zm8 5-3 3 3 3',
    expand: 'M9 4v16M4 4h16v16H4V4Zm4 5 3 3-3 3',
    home: 'm3 10 9-7 9 7v11h-6v-7H9v7H3V10Z',
    path: 'M7 3h12v18H5V5h2m2 3h6m-6 4h6m-6 4h4',
    lab: 'M9 3h6m-5 0v7l-6 9q-1 2 2 2h12q3 0 2-2l-6-9V3M7 15h10',
    review: 'M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v5l3 2',
    notebook:
      'M12 6C8 3 4 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-4-1-7 0-10 2Zm0 0v15',
    keyboard:
      'M3 5h18v14H3V5Zm4 4h.01M11 9h.01M15 9h.01M7 12h.01M11 12h.01M15 12h.01M7 16h10',
    report: 'M4 20V10m8 10V4m8 16v-7',
    back: 'M20 12H4m6-6-6 6 6 6',
    chevron: 'm9 5 7 7-7 7',
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function matchesDirectory(href: string | undefined, activePath: string) {
  if (!href) return false;
  const target = new URL(href, 'https://study.local');
  const current = new URL(activePath, 'https://study.local');
  return (
    target.pathname === current.pathname &&
    [...target.searchParams].every(
      ([key, value]) => current.searchParams.get(key) === value,
    )
  );
}

function activeFolders(
  items: StudyDirectoryItem[],
  activePath: string,
): string[] {
  return items.flatMap((item) => {
    const childIds = activeFolders(item.children ?? [], activePath);
    const isDescendant = (nodes: StudyDirectoryItem[]): boolean =>
      nodes.some(
        (node) =>
          matchesDirectory(node.href, activePath) ||
          isDescendant(node.children ?? []),
      );
    return item.children?.length &&
      (matchesDirectory(item.href, activePath) || isDescendant(item.children))
      ? [item.id, ...childIds]
      : childIds;
  });
}

function searchDirectory(
  items: StudyDirectoryItem[],
  query: string,
): StudyDirectoryItem[] {
  return items.flatMap((item) => {
    if (item.title.toLocaleLowerCase().includes(query)) return [item];
    const children = searchDirectory(item.children ?? [], query);
    return children.length ? [{ ...item, children }] : [];
  });
}

/** One navigation frame for all subjects; the content tree stays subject-owned. */
export function StudyShell({
  brand,
  navigation,
  controls,
  home,
  label,
  title,
  subject,
  directory,
  activePath,
  renderLink,
  children,
  mode = 'zh',
}: {
  brand: ReactNode;
  navigation: ReactNode;
  controls?: ReactNode;
  home: ReactNode;
  label: string;
  title: string;
  subject: string;
  directory: StudyDirectoryItem[];
  activePath: string;
  renderLink: (
    href: string,
    content: ReactNode,
    className: string,
    active: boolean,
  ) => ReactNode;
  children: ReactNode;
  mode?: LanguageMode;
}) {
  const sidebarId = useId();
  const mobileButton = useRef<HTMLButtonElement>(null);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('study-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeKey = JSON.stringify(activeFolders(directory, activePath));
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(JSON.parse(activeKey) as string[]),
  );
  const [directoryOpen, setDirectoryOpen] = useState(true);
  useEffect(() => {
    const ids = JSON.parse(activeKey) as string[];
    setExpanded((old) => new Set([...old, ...ids]));
    if (ids.length) setDirectoryOpen(true);
  }, [activeKey]);
  useEffect(() => {
    try {
      localStorage.setItem('study-sidebar-collapsed', String(collapsed));
    } catch {
      /* The sidebar remains usable without storage. */
    }
  }, [collapsed]);
  useEffect(() => {
    if (!mobileOpen) return;
    const opener = mobileButton.current;
    const focusable = () =>
      Array.from(
        document
          .getElementById(sidebarId)
          ?.querySelectorAll<HTMLElement>(
            'a[href], button:not(:disabled), input',
          ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => focusable()[0]?.focus());
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', close);
      opener?.focus();
    };
  }, [mobileOpen, sidebarId]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const links = document
        .getElementById(sidebarId)
        ?.querySelectorAll('.study-directory-link[aria-current="page"]');
      const current = links?.[links.length - 1];
      if (current?.getClientRects().length)
        current.scrollIntoView({ block: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeKey, collapsed, sidebarId]);
  const word = (zh: string, en: string) => (mode === 'en' ? en : zh);
  const toggleFolder = (id: string) =>
    setExpanded((old) => {
      const next = new Set(old);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const matchingHrefs: string[] = [];
  function collectMatches(items: StudyDirectoryItem[]) {
    for (const item of items) {
      if (item.href && matchesDirectory(item.href, activePath))
        matchingHrefs.push(item.href);
      collectMatches(item.children ?? []);
    }
  }
  collectMatches(directory);
  const selectedHref = matchingHrefs.sort(
    (a, b) =>
      [...new URL(b, 'https://study.local').searchParams].length -
      [...new URL(a, 'https://study.local').searchParams].length,
  )[0];
  function entries(items: StudyDirectoryItem[], depth = 0): ReactNode {
    return (
      <ul className="study-directory-list">
        {items.map((item) => {
          const isFolder = !!item.children?.length;
          const open = query.trim() !== '' || expanded.has(item.id);
          const active = item.href !== undefined && item.href === selectedHref;
          const branch = (JSON.parse(activeKey) as string[]).includes(item.id);
          const content = (
            <>
              <span className="study-directory-title">{item.title}</span>
              {item.badge && (
                <small className="study-directory-badge">{item.badge}</small>
              )}
            </>
          );
          return (
            <li
              key={item.id}
              className={branch ? 'study-directory-branch' : ''}
            >
              <div
                className={`study-directory-row ${active ? 'is-active' : ''}`}
                style={{ '--tree-depth': depth } as CSSProperties}
              >
                {isFolder ? (
                  <button
                    type="button"
                    className="study-directory-expander"
                    onClick={() => toggleFolder(item.id)}
                    aria-expanded={open}
                    aria-label={`${word(open ? '收起' : '展开', open ? 'Collapse' : 'Expand')} ${item.title}`}
                  >
                    <StudyIcon name="chevron" size={13} />
                  </button>
                ) : (
                  <span className="study-directory-dot" aria-hidden="true" />
                )}
                {item.href ? (
                  renderLink(item.href, content, 'study-directory-link', active)
                ) : (
                  <button
                    type="button"
                    className="study-directory-link"
                    onClick={() => isFolder && toggleFolder(item.id)}
                    disabled={!isFolder}
                  >
                    {content}
                  </button>
                )}
              </div>
              {isFolder && open && entries(item.children!, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <div
      className="study-shell"
      data-collapsed={collapsed}
      data-mobile-open={mobileOpen}
    >
      <aside
        className="study-sidebar"
        id={sidebarId}
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen || undefined}
        aria-label={label}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) {
            setMobileOpen(false);
            setQuery('');
          }
        }}
      >
        <div className="study-sidebar-brand">{brand}</div>
        <div className="study-sidebar-scroll">
          <p className="study-sidebar-section-label">
            {word('学习空间', 'YOUR WORKSPACE')}
          </p>
          <nav className="study-sidebar-primary" aria-label={label}>
            {navigation}
          </nav>
          <section className="study-sidebar-directory">
            <button
              type="button"
              className="study-directory-heading"
              onClick={() => setDirectoryOpen(!directoryOpen)}
              aria-expanded={directoryOpen}
            >
              <span>{word('课程目录', 'CURRICULUM')}</span>
              <StudyIcon name="chevron" size={14} />
            </button>
            {directoryOpen && (
              <>
                <label className="study-directory-search">
                  <span aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    aria-label={word('查找课程', 'Find a lesson')}
                    placeholder={word('查找课程…', 'Find a lesson…')}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <nav aria-label={word('分层课程目录', 'Curriculum directory')}>
                  {entries(
                    query.trim()
                      ? searchDirectory(
                          directory,
                          query.trim().toLocaleLowerCase(),
                        )
                      : directory,
                  )}
                </nav>
                {query.trim() &&
                  searchDirectory(directory, query.trim().toLocaleLowerCase())
                    .length === 0 && (
                    <p className="study-directory-empty" role="status">
                      {word(
                        '没有找到，试试别的关键词。',
                        'No match. Try another keyword.',
                      )}
                    </p>
                  )}
              </>
            )}
          </section>
        </div>
        <div className="study-sidebar-footer">
          {home}
          <button
            type="button"
            className="study-sidebar-collapse"
            aria-expanded={!collapsed}
            aria-controls={sidebarId}
            onClick={() => setCollapsed(!collapsed)}
            title={word(
              collapsed ? '展开左栏' : '折叠左栏',
              collapsed ? 'Expand sidebar' : 'Collapse sidebar',
            )}
          >
            <StudyIcon name={collapsed ? 'expand' : 'collapse'} size={18} />
            <span>{word('折叠左栏', 'Collapse sidebar')}</span>
          </button>
        </div>
      </aside>
      {mobileOpen && (
        <button
          type="button"
          className="study-sidebar-backdrop"
          aria-label={word('关闭导航', 'Close navigation')}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="study-shell-body">
        <header className="study-workspace-header">
          <button
            type="button"
            className="study-desktop-toggle study-shell-toggle"
            aria-expanded={!collapsed}
            aria-controls={sidebarId}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={word(
              collapsed ? '展开左栏' : '折叠左栏',
              collapsed ? 'Expand sidebar' : 'Collapse sidebar',
            )}
            title={word(
              collapsed ? '展开左栏' : '折叠左栏',
              collapsed ? 'Expand sidebar' : 'Collapse sidebar',
            )}
          >
            <StudyIcon name={collapsed ? 'expand' : 'collapse'} />
          </button>
          <button
            type="button"
            className="study-mobile-toggle study-shell-toggle"
            ref={mobileButton}
            aria-expanded={mobileOpen}
            aria-controls={sidebarId}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={word('打开课程导航', 'Open course navigation')}
          >
            <StudyIcon name={mobileOpen ? 'close' : 'menu'} />
          </button>
          <div className="study-workspace-location">
            <span>{subject}</span>
            <i>/</i>
            <strong>{title}</strong>
          </div>
          <div className="study-workspace-tools">{controls}</div>
        </header>
        {children}
      </div>
    </div>
  );
}

export function QuestionNavigator({
  index,
  count,
  onChange,
  mode,
}: {
  index: number;
  count: number;
  onChange: (index: number) => void;
  mode: LanguageMode;
}) {
  return (
    <div
      className="study-question-navigation"
      role="group"
      aria-label={mode === 'en' ? 'Practice questions' : '练习题目'}
    >
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onChange(index - 1)}
      >
        {mode === 'en' ? '← Previous' : '← 上一题'}
      </button>
      <div>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            aria-pressed={index === i}
            aria-label={mode === 'en' ? `Question ${i + 1}` : `第 ${i + 1} 题`}
            onClick={() => onChange(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={index === count - 1}
        onClick={() => onChange(index + 1)}
      >
        {mode === 'en' ? 'Next →' : '下一题 →'}
      </button>
    </div>
  );
}
