import { describe, expect, it } from 'vitest';
import { parseLessonSection } from './content';

describe('bilingual manuscript line endings', () => {
  it('keeps Chinese and English teaching text intact after Windows or Unix edits without leaking the next section', () => {
    const manuscript =
      '## Hook / 谜题\n\n### 中文\n\n面团为什么会鼓起？\n\n### English\n\nWhy does dough rise?\n\n## Predict / 先猜\n\n### 中文\n下一环节\n\n### English\nNext stage\n';
    const expected = { zh: '面团为什么会鼓起？', en: 'Why does dough rise?' };
    for (const newline of ['\n', '\r\n', '\r'])
      expect(
        parseLessonSection(manuscript.replaceAll('\n', newline), 'Hook'),
      ).toEqual(expected);
    expect(parseLessonSection(manuscript, 'Explain')).toEqual({
      zh: '',
      en: '',
    });
  });
});
