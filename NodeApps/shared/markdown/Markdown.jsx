import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { defaultRehypePlugins, defaultRemarkPlugins } from './options.js';
import { prepareMarkdown } from './prepare.js';
import { DEFAULT_PREFERENCES, FONT_OPTIONS, PREFERENCE_EVENT, PREFERENCE_KEY, readPreferences, writePreferences } from './preferences.js';
import 'katex/dist/katex.min.css';
import './reader.css';

function ScrollableTable({ node: _node, ...props }) {
  return <div style={{ maxWidth: '100%', overflowX: 'auto' }}><table {...props} /></div>;
}

function useMarkdownPreferences() {
  const [preferences, setPreferences] = useState(readPreferences);
  useEffect(() => {
    const onPreferenceChange = (event) => setPreferences(event.detail ?? readPreferences());
    const onStorageChange = (event) => { if (event.key === null || event.key === PREFERENCE_KEY) setPreferences(readPreferences()); };
    window.addEventListener(PREFERENCE_EVENT, onPreferenceChange);
    window.addEventListener('storage', onStorageChange);
    return () => { window.removeEventListener(PREFERENCE_EVENT, onPreferenceChange); window.removeEventListener('storage', onStorageChange); };
  }, []);
  return [preferences, (next) => setPreferences(writePreferences(next))];
}

export function MarkdownReadingControls({ compact = false }) {
  const [preferences, onChange] = useMarkdownPreferences();
  return <div className={`nodeapps-markdown-controls${compact ? ' is-compact' : ''}`} role="group" aria-label="Markdown 阅读设置">
    <span>阅读设置</span>
    <button type="button" aria-label="缩小 Markdown 字号" disabled={preferences.size <= 80} onClick={() => onChange({ ...preferences, size: preferences.size - 10 })}>A−</button>
    <output aria-label="当前 Markdown 字号">{preferences.size}%</output>
    <button type="button" aria-label="放大 Markdown 字号" disabled={preferences.size >= 160} onClick={() => onChange({ ...preferences, size: preferences.size + 10 })}>A+</button>
    <select aria-label="Markdown 阅读字体" value={preferences.font} onChange={(event) => onChange({ ...preferences, font: event.target.value })}>
      {FONT_OPTIONS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
    </select>
    <button type="button" aria-label="重置阅读设置" title="重置阅读设置" onClick={() => onChange(DEFAULT_PREFERENCES)}>{compact ? '↺' : '重置'}</button>
  </div>;
}

// App-specific links, headings and optional extensions remain configurable.
export default function Markdown({ children, components, remarkPlugins: extraRemarkPlugins, rehypePlugins: extraRehypePlugins, readingControls = false, readingAppearance = readingControls, ...props }) {
  const [preferences] = useMarkdownPreferences();
  const markdown = <ReactMarkdown
    {...props}
    remarkPlugins={extraRemarkPlugins ? [...defaultRemarkPlugins, ...extraRemarkPlugins] : defaultRemarkPlugins}
    rehypePlugins={extraRehypePlugins ? [...defaultRehypePlugins, ...extraRehypePlugins] : defaultRehypePlugins}
    components={{ table: ScrollableTable, ...components }}
  >{prepareMarkdown(children)}</ReactMarkdown>;
  if (!readingAppearance) return markdown;
  const family = FONT_OPTIONS.find((option) => option.id === preferences.font)?.family;
  return <div className="nodeapps-markdown-reader">
    {readingControls && <MarkdownReadingControls />}
    <div className="nodeapps-markdown-content" style={{ fontFamily: family ?? 'inherit', fontSize: `${preferences.size / 100}em` }}>{markdown}</div>
  </div>;
}
