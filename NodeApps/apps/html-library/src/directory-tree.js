export function buildDirectoryTree(paths, items) {
  const roots = [];
  const byPath = new Map();

  for (const path of paths) {
    let parent = null;
    let currentPath = '';
    for (const name of path.split('/')) {
      currentPath = currentPath ? `${currentPath}/${name}` : name;
      let node = byPath.get(currentPath);
      if (!node) {
        node = { name, path: currentPath, count: 0, children: [] };
        (parent ? parent.children : roots).push(node);
        byPath.set(currentPath, node);
      }
      parent = node;
    }
  }

  for (const item of items) {
    if (!item.folder) continue;
    let currentPath = '';
    for (const name of item.folder.split('/')) {
      currentPath = currentPath ? `${currentPath}/${name}` : name;
      const node = byPath.get(currentPath);
      if (node) node.count += 1;
    }
  }

  const sortNodes = (nodes) => {
    nodes.sort((left, right) => left.name.localeCompare(right.name, 'zh-Hans-CN'));
    for (const node of nodes) sortNodes(node.children);
  };
  sortNodes(roots);
  return roots;
}

export function belongsToDirectory(folder, directory) {
  return folder === directory;
}
