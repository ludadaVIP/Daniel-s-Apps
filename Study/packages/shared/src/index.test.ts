import { describe, expect, it } from 'vitest';
import { pickText } from './index';

describe('pickText', () => {
  const text = { en: 'Matter', zh: '物质' };

  it('selects English in English mode', () => {
    expect(pickText(text, 'en')).toBe('Matter');
  });

  it('uses Chinese as the primary text in Chinese and bilingual modes', () => {
    expect(pickText(text, 'zh')).toBe('物质');
    expect(pickText(text, 'bilingual')).toBe('物质');
  });
});
