import type { LanguageMode, LocalizedText } from '@study/shared';
import { B, Icon, Text } from './ui';
export function ProjectReport({
  mode,
  report,
  hasData,
  fileName,
  downloadLabel,
  reportLabel,
}: {
  mode: LanguageMode;
  report: string;
  hasData: boolean;
  fileName: string;
  downloadLabel: LocalizedText;
  reportLabel: LocalizedText;
}) {
  return (
    <>
      <a
        className="phy-button"
        role="link"
        aria-disabled={!hasData}
        href={
          hasData
            ? `data:text/markdown;charset=utf-8,${encodeURIComponent(report)}`
            : undefined
        }
        download={fileName}
        onClick={(e) => {
          if (!hasData) e.preventDefault();
        }}
      >
        <Text value={downloadLabel} mode={mode} />
        <Icon name="arrow" />
      </a>
      <details className="phy-walking-report">
        <summary>
          <B zh="查看双语报告内容" en="Preview bilingual report" mode={mode} />
        </summary>
        <textarea
          readOnly
          rows={10}
          aria-label={mode === 'en' ? reportLabel.en : reportLabel.zh}
          value={report}
        />
      </details>
    </>
  );
}
