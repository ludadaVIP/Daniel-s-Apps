import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ConnectionExplore } from './ConnectionWorld';

it('offers evidence manipulation rather than inert playback for the static microbe comparison', () => {
  const render = (id: string) =>
    renderToStaticMarkup(
      createElement(ConnectionExplore, { id, mode: 'en', onExplore: () => {} }),
    );
  const comparison = render('L049');
  expect(comparison).toContain('Compare labelled samples');
  expect(comparison).toContain('structural evidence');
  expect(comparison).toContain('no timed playback');
  expect(comparison).not.toContain('class="bio-playback"');
  expect(render('L050')).toContain('class="bio-playback"');
});
