import assert from 'node:assert/strict';
import test from 'node:test';
import { belongsToDirectory, buildDirectoryTree } from './directory-tree.js';

test('directory tree keeps every level, including folders without HTML', () => {
  const tree = buildDirectoryTree(
    ['Markets/Weekly/2026', 'Markets/Weekly/2025', 'Notes'],
    [{ folder: 'Markets/Weekly/2026' }, { folder: 'Markets' }],
  );
  assert.deepEqual(tree.map(({ path, count }) => [path, count]), [['Markets', 2], ['Notes', 0]]);
  assert.deepEqual(tree[0].children.map(({ path, count }) => [path, count]), [['Markets/Weekly', 1]]);
  assert.deepEqual(tree[0].children[0].children.map(({ path, count }) => [path, count]), [
    ['Markets/Weekly/2025', 0], ['Markets/Weekly/2026', 1],
  ]);
  assert.equal(belongsToDirectory('Markets', 'Markets'), true);
  assert.equal(belongsToDirectory('Markets/Weekly/2026', 'Markets'), false);
  assert.equal(belongsToDirectory('Markets-old', 'Markets'), false);
  assert.equal(belongsToDirectory('', ''), true);
});
