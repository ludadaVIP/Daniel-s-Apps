import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';

export const defaultRemarkPlugins = [remarkGfm, remarkBreaks, remarkMath];
export const defaultRehypePlugins = [rehypeRaw, rehypeSanitize, rehypeKatex];
