import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

export const defaultRemarkPlugins = [remarkGfm, remarkBreaks];
export const defaultRehypePlugins = [rehypeRaw, rehypeSanitize];
