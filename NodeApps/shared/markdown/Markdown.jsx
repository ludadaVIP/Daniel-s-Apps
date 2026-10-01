import ReactMarkdown from 'react-markdown';
import { defaultRehypePlugins, defaultRemarkPlugins } from './options.js';
import { prepareMarkdown } from './prepare.js';

function ScrollableTable({ node: _node, ...props }) {
  return <div style={{ maxWidth: '100%', overflowX: 'auto' }}><table {...props} /></div>;
}

// App-specific links, headings and optional extensions remain configurable.
export default function Markdown({ children, components, remarkPlugins: extraRemarkPlugins, rehypePlugins = defaultRehypePlugins, ...props }) {
  return <ReactMarkdown
    {...props}
    remarkPlugins={extraRemarkPlugins ? [...defaultRemarkPlugins, ...extraRemarkPlugins] : defaultRemarkPlugins}
    rehypePlugins={rehypePlugins}
    components={{ table: ScrollableTable, ...components }}
  >{prepareMarkdown(children)}</ReactMarkdown>;
}
