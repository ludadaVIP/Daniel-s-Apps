import {
  leafRouteIds,
  leafRoutes,
  routeTags,
  type LeafDraft,
  type LeafRoute,
} from './leafProject';
const esc = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]!,
  );
const colors = {
  water: '#568998',
  carbon: '#806946',
  light: '#b38c39',
  sugar: '#ae706a',
};
const points: Record<LeafRoute, readonly (readonly [number, number])[]> = {
  water: [
    [76, 360],
    [147, 360],
    [196, 321],
    [196, 224],
    [248, 181],
  ],
  carbon: [
    [351, 125],
    [327, 153],
    [304, 187],
    [278, 181],
    [262, 175],
  ],
  light: [
    [97, 117],
    [137, 131],
    [179, 147],
    [221, 159],
    [250, 171],
  ],
  sugar: [
    [257, 185],
    [238, 210],
    [223, 243],
    [223, 301],
    [215, 350],
  ],
};
function wrap(text: string, columns = 42): string[] {
  const rows: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    let width = 0;
    for (const c of Array.from(paragraph)) {
      const w = /[\u2e80-\uffff]/.test(c) ? 2 : 1;
      if (width + w > columns) {
        const space = line.lastIndexOf(' ');
        if (space > line.length / 2) {
          rows.push(line.slice(0, space));
          line = line.slice(space + 1);
          width = Array.from(line).reduce(
            (total, char) => total + (/[\u2e80-\uffff]/.test(char) ? 2 : 1),
            0,
          );
        } else {
          rows.push(line);
          line = '';
          width = 0;
        }
      }
      line += c;
      width += w;
    }
    rows.push(line);
  }
  return rows;
}
/** All authored labels and user writing are escaped before inclusion in downloadable XML. */
export function leafDiagramSvg(
  draft: LeafDraft,
  focus?: LeafRoute,
  frame = 4,
  includeWriting = false,
): string {
  const light = (id: LeafRoute) => (focus && focus !== id ? '.28' : '1');
  const arrow = (
    id: LeafRoute,
    path: string,
    to: readonly [number, number],
    angle: number,
    dashed = false,
  ) =>
    `<g opacity="${light(id)}"><path d="${path}" fill="none" stroke="${colors[id]}" stroke-width="3.5" ${dashed ? 'stroke-dasharray="6 5"' : ''}/><path d="M0 0 L-10 -5 L-10 5 Z" fill="${colors[id]}" transform="translate(${to[0]} ${to[1]}) rotate(${angle})"/></g>`;
  const label = (id: LeafRoute, x: number, y: number, w = 155) => {
    const name = leafRoutes[id].short,
      tag = routeTags[draft.routes[id].tag];
    return `<g><rect x="${x}" y="${y}" width="${w}" height="80" rx="12" fill="#fffdf7" stroke="${colors[id]}" stroke-width="${focus === id ? 2.5 : 1}"/><text x="${x + 12}" y="${y + 20}" font-size="17" font-weight="600">${esc(name.zh)}</text><text x="${x + 12}" y="${y + 38}" font-size="13">${esc(name.en)}</text><text x="${x + 12}" y="${y + 56}" font-size="12" fill="${colors[id]}">${esc(tag.zh)}</text><text x="${x + 12}" y="${y + 71}" font-size="11" fill="${colors[id]}">${draft.routes[id].tag === 'both' ? 'Matter + chemical energy' : esc(tag.en)}</text></g>`;
  };
  let writing = '';
  let y = 495;
  if (includeWriting) {
    const blocks = [
      ...leafRouteIds.map((id) => ({
        heading: `${leafRoutes[id].name.zh} / ${leafRoutes[id].short.en}`,
        text: draft.routes[id].note,
      })),
      { heading: '中文总结 / Chinese summary', text: draft.zh },
      { heading: '英文总结 / English summary', text: draft.en },
    ];
    for (const block of blocks) {
      writing += `<text x="25" y="${y}" font-size="15" font-weight="600">${esc(block.heading)}</text>`;
      y += 24;
      for (const row of wrap(block.text)) {
        writing += `<text x="25" y="${y}" font-size="14">${esc(row)}</text>`;
        y += 22;
      }
      y += 20;
    }
    writing += `<text x="25" y="${y}" font-size="11">原创教学图 / Original teaching diagram · Study Biology</text>`;
    y += 25;
  }
  const shift = includeWriting ? 58 : 0;
  const height = (includeWriting ? y : 470) + shift;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 ${height}" role="img" aria-labelledby="leaf-title leaf-desc" data-resource-id="S02-P01-D01"><title id="leaf-title">一片叶子的旅程 / A leaf’s journey</title><desc id="leaf-desc">Four bilingual routes: water through root and xylem, carbon dioxide through stomata, light energy into a leaf, and sugar from a mature leaf to a growing root. Current labels are the learner’s choices, not automatic scientific verification. Diagram is schematic, not to scale.</desc><rect x="8" y="8" width="404" height="${height - 16}" rx="22" fill="#f1f3e8"/>${includeWriting ? '<text x="210" y="29" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" fill="#354832">一片叶子的旅程</text><text x="210" y="49" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" fill="#354832">A leaf’s journey</text>' : ''}<g transform="translate(0 ${shift})" font-family="system-ui, sans-serif" fill="#354832">
 <path d="M12 344 H408 V387 H12 Z" fill="#e0d8bb"/>
 <path d="M210 347 V216 Q231 196 265 170 M210 280 L171 249" fill="none" stroke="#819566" stroke-width="13"/>
 <path d="M211 212 Q219 125 318 139 Q302 224 211 212 Z" fill="#aec48e" stroke="#71875b" stroke-width="2"/>
 <path d="M216 207 L291 155 M245 187 L251 158 M260 178 L289 184" stroke="#829966" fill="none" stroke-width="2"/>
 <path d="M210 347 L181 378 M210 347 L239 378 M210 357 V381 M190 370 L162 378 M232 370 L259 379" fill="none" stroke="#8f8663" stroke-width="4"/>
 <path d="M210 282 Q176 215 130 236 Q154 291 210 282 Z" fill="#c0ce9f" stroke="#829966"/>
 <g fill="#6f8d5c" stroke="#edf2df">${[0, 1, 2].map((i) => `<ellipse cx="${250 + i * 14}" cy="${170 - i * 3}" rx="6" ry="10" transform="rotate(32 ${250 + i * 14} ${170 - i * 3})"/>`).join('')}</g>
 <path d="M299 179 Q304 188 299 196 M309 179 Q304 188 309 196" fill="none" stroke="#4d6b45" stroke-width="3"/>
 ${arrow('water', 'M76 360 L196 360 L196 221 L248 181', [248, 181], -38)}
 ${arrow('carbon', 'M351 125 L304 187 L262 175', [262, 175], -164)}
 ${arrow('light', 'M97 117 L250 171', [250, 171], 20, true)}
 ${arrow('sugar', 'M257 185 L223 229 L223 326 L215 350', [215, 350], 109)}
 <g opacity="${light('water')}"><path d="M302 200 Q334 217 362 239" stroke="#568998" stroke-width="2" stroke-dasharray="4 4" fill="none"/><path d="M362 239 L352 237 L357 230 Z" fill="#568998"/></g>
 ${focus ? `<circle cx="${points[focus][frame]![0]}" cy="${points[focus][frame]![1]}" r="7" fill="${colors[focus]}" stroke="#fffdf7" stroke-width="2"/>` : ''}
 ${label('light', 20, 28)}${label('carbon', 255, 28, 145)}${label('water', 20, 273)}${label('sugar', 250, 273, 150)}
 <text x="267" y="226" text-anchor="middle" font-size="12">叶肉 / Mesophyll</text>
 <text x="350" y="185" text-anchor="middle" font-size="10">气孔 / Stomata</text>
 <text x="345" y="258" text-anchor="middle" font-size="11">水蒸气 / Vapour</text>
 <text x="210" y="407" text-anchor="middle" font-size="13">叶与根也进行细胞呼吸</text><text x="210" y="426" text-anchor="middle" font-size="12">Leaves and roots also respire</text>
 <text x="210" y="452" text-anchor="middle" font-size="10">成熟叶→生长根示例 · 非比例 / Leaf→root example · not to scale</text>
 ${writing}</g></svg>`;
}
