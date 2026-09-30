export const READER_FONTS = [
  { id: "system", label: "系统中文（默认）", family: '"Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Noto Sans SC", sans-serif' },
  { id: "yahei", label: "微软雅黑", family: '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif' },
  { id: "pingfang", label: "苹方", family: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif' },
  { id: "kaiti", label: "楷体", family: 'KaiTi, "Kaiti SC", "STKaiti", "Noto Serif CJK SC", serif' },
  { id: "songti", label: "宋体", family: '"Songti SC", SimSun, "Noto Serif CJK SC", serif' },
  { id: "arial", label: "Arial", family: 'Arial, "Microsoft YaHei", "PingFang SC", sans-serif' },
  { id: "times", label: "Times New Roman", family: '"Times New Roman", "Songti SC", SimSun, serif' },
  { id: "calibri", label: "Calibri", family: 'Calibri, "Microsoft YaHei", "PingFang SC", sans-serif' },
];

export function readerFontFamily(id) {
  return READER_FONTS.find((font) => font.id === id)?.family || READER_FONTS[0].family;
}

export function readReaderFont(storageKey) {
  const saved = window.localStorage.getItem(storageKey);
  return READER_FONTS.some((font) => font.id === saved) ? saved : "system";
}

export default function ReaderFontSelect({ value, onChange, className }) {
  return <label className={className}>
    <span>字体</span>
    <select aria-label="阅读字体" value={value} onChange={(event) => onChange(event.target.value)}>
      {READER_FONTS.map((font) => <option key={font.id} value={font.id}>{font.label}</option>)}
    </select>
  </label>;
}
