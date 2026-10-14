import { useRef, useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import ReactMarkdown from 'react-markdown';
import { assets, t, words } from './content';
export function Text({
  text,
  mode,
}: {
  text: LocalizedText;
  mode: LanguageMode;
}) {
  return <Localized text={text} mode={mode} secondaryClassName="geo-en" />;
}
export function Markdown({
  text,
  mode,
}: {
  text: LocalizedText;
  mode: LanguageMode;
}) {
  return (
    <div className={`geo-prose ${mode === 'bilingual' ? 'geo-parallel' : ''}`}>
      {mode !== 'en' && (
        <div lang="zh">
          <ReactMarkdown>{text.zh}</ReactMarkdown>
        </div>
      )}
      {mode !== 'zh' && (
        <div lang="en">
          <ReactMarkdown>{text.en}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
export function AssetImage({
  id,
  mode,
  compact = false,
}: {
  id: string;
  mode: LanguageMode;
  compact?: boolean;
}) {
  const asset = assets.find((a) => a.id === id && a.publishable);
  const dialog = useRef<HTMLDialogElement>(null);
  const [failed, setFailed] = useState(false);
  if (!asset) return null;
  const alt = words(mode, asset.alt_zh, asset.alt_en);
  return (
    <figure className={`geo-photo ${compact ? 'compact' : ''}`}>
      {!failed ? (
        <button
          className="geo-image-button"
          onClick={() => dialog.current?.showModal()}
          aria-label={words(mode, '放大图片：', 'Enlarge image: ') + alt}
        >
          <img
            src={asset.path}
            alt={
              mode === 'bilingual' ? `${asset.alt_zh} / ${asset.alt_en}` : alt
            }
            onError={() => setFailed(true)}
          />
          <span>{words(mode, '放大 ↗', 'ENLARGE ↗')}</span>
        </button>
      ) : (
        <div className="geo-image-fallback" role="status">
          <Text
            mode={mode}
            text={t(
              '图片暂时无法载入。请参考下方文字、示意图和观察说明。',
              'Image unavailable. Continue with the text, diagrams and observation guide below.',
            )}
          />
          <p>{alt}</p>
        </div>
      )}
      <figcaption>
        <Text mode={mode} text={t(asset.title_zh, asset.title_en)} />
        <small>
          {asset.kind === 'data'
            ? words(
                mode,
                '历史数据图（再分析估计）',
                'HISTORICAL DATA GRAPHIC (REANALYSIS ESTIMATES)',
              )
            : asset.kind === 'satellite'
              ? words(mode, '真实卫星影像', 'REAL SATELLITE IMAGE')
              : asset.kind === 'photo'
                ? words(mode, '真实照片', 'REAL PHOTOGRAPH')
                : words(mode, '教学底图', 'TEACHING BASE MAP')}{' '}
          ·{' '}
          {asset.data_year ??
            words(mode, '来源未注明年份', 'Year unspecified by source')}{' '}
          · {asset.credit_text}
        </small>
      </figcaption>
      <dialog
        ref={dialog}
        className="geo-image-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          autoFocus
          className="geo-button secondary"
          onClick={() => dialog.current?.close()}
        >
          {words(mode, '关闭图片', 'Close image')} ×
        </button>
        <img src={asset.path} alt={alt} />
        <p>{alt}</p>
        <small>{asset.credit_text}</small>
      </dialog>
    </figure>
  );
}
export function downloadText(name: string, content: string) {
  downloadFile(name, content, 'text/markdown;charset=utf-8');
}
export function downloadFile(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
