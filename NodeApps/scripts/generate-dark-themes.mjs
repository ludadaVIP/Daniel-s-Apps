import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import postcss from 'postcss';

// Keep the original light palettes intact. Dark rules are generated from the
// actual color declarations so new panels and controls get a usable dark base.
const root = resolve(import.meta.dirname, '..');
const apps = [
  'BeliefQandA', 'bible', 'bible-parallel', 'html-library', 'industry',
  'insight', 'InvestMaster', 'investment', 'notebook', 'Philosophy',
  'recall-verses', 'WorldQandA',
];
const colorPattern = /#[\da-f]{3,8}\b|rgba?\(\s*[\d.]+(?:\s*,\s*|\s+)[\d.]+(?:\s*,\s*|\s+)[\d.]+(?:\s*[,/]\s*[\d.]+)?\s*\)|\b(?:white|black)\b/gi;

function parseColor(value) {
  if (value === 'white') return [255, 255, 255, 1];
  if (value === 'black') return [0, 0, 0, 1];
  if (value[0] === '#') {
    const hex = value.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      const channels = [...hex].map((digit) => parseInt(digit + digit, 16));
      return [channels[0], channels[1], channels[2], channels[3] === undefined ? 1 : channels[3] / 255];
    }
    if (hex.length === 6 || hex.length === 8) {
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1];
    }
    return null;
  }
  const channels = value.match(/[\d.]+/g)?.map(Number);
  return channels?.length >= 3 ? [channels[0], channels[1], channels[2], channels[3] ?? 1] : null;
}

function toHsl([red, green, blue]) {
  const [r, g, b] = [red, green, blue].map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  if (delta) {
    switch (max) {
      case r: hue = ((g - b) / delta) % 6; break;
      case g: hue = (b - r) / delta + 2; break;
      default: hue = (r - g) / delta + 4;
    }
  }
  return [((hue * 60) + 360) % 360, saturation, lightness];
}

function toHex(hue, saturation, lightness, alpha) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = lightness - chroma / 2;
  const sector = Math.floor(hue / 60);
  const channels = [[chroma, x, 0], [x, chroma, 0], [0, chroma, x], [0, x, chroma], [x, 0, chroma], [chroma, 0, x]][sector] || [0, 0, 0];
  const hex = channels.map((channel) => Math.round((channel + m) * 255).toString(16).padStart(2, '0')).join('');
  return `#${hex}${alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, '0') : ''}`;
}

function roleOf(property) {
  if (/shadow/i.test(property)) return 'shadow';
  if (/border|outline|column-rule|text-decoration/i.test(property)) return 'border';
  if (/background|^fill$|gradient/i.test(property)) return 'background';
  if (/^--/.test(property)) {
    if (/ink|text|muted|faint|foreground|midnight|slate/i.test(property)) return 'text';
    if (/line|rule|border/i.test(property)) return 'border';
    if (/accent|brand|gold|green|red|amber|blue|violet|rose|deep|forest/i.test(property)) return 'accent';
    return 'background';
  }
  return 'text';
}

function darken(value, role) {
  return value.replace(colorPattern, (match) => {
    const rgba = parseColor(match.toLowerCase());
    if (!rgba) return match;
    const [hue, saturation, lightness] = toHsl(rgba);
    let next = lightness;
    let nextSaturation = saturation;
    if (role === 'background') {
      if (lightness > .67) next = .11 + (1 - lightness) * .28;
      else if (lightness > .4 && saturation < .3) next = .22;
      else if (lightness > .4) next = Math.max(.24, Math.min(.38, lightness * .68));
      else if (lightness < .07) next = .095;
      else next = Math.max(.13, lightness);
      nextSaturation = Math.min(saturation, lightness > .67 ? .18 : .48);
    } else if (role === 'text') {
      if (lightness < .65) next = Math.max(.73, .86 - lightness * .2);
      nextSaturation = Math.min(saturation, .55);
    } else if (role === 'border') {
      next = lightness > .58 ? .29 : Math.max(.28, Math.min(.52, lightness));
      nextSaturation = Math.min(saturation, .42);
    } else if (role === 'accent') {
      if (lightness < .55) next = Math.max(.58, lightness + .15);
      nextSaturation = Math.min(saturation, .68);
    } else if (role === 'shadow') {
      return match;
    }
    return toHex(hue, nextSaturation, next, rgba[3]);
  });
}

function splitSelectors(selector) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < selector.length; index += 1) {
    if (selector[index] === '(' || selector[index] === '[') depth += 1;
    else if (selector[index] === ')' || selector[index] === ']') depth -= 1;
    else if (selector[index] === ',' && depth === 0) {
      parts.push(selector.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(selector.slice(start).trim());
  return parts;
}

function prefixSelector(selector) {
  return splitSelectors(selector).map((part) => {
    const trimmed = part.trim();
    return trimmed.startsWith(':root')
      ? trimmed.replace(':root', ':root[data-theme="dark"]')
      : `:root[data-theme="dark"] ${trimmed}`;
  }).join(', ');
}

async function generate(app) {
  const sourcePath = resolve(root, 'apps', app, 'src', 'styles.css');
  let source = await readFile(sourcePath, 'utf8');
  if (app === 'WorldQandA') {
    source = `${await readFile(resolve(root, 'apps/BeliefQandA/src/styles.css'), 'utf8')}\n${source.replace(/^@import[^;]+;\s*/, '')}`;
  }
  const sheet = postcss.parse(source, { from: sourcePath });
  // A selector cannot reliably reach :root from inside a CSS @scope block.
  // Expand scoped selectors before adding the document theme qualifier.
  sheet.walkAtRules('scope', (scopeRule) => {
    const scope = scopeRule.params.match(/^\(\s*([^)]*)\s*\)/)?.[1]?.trim();
    if (!scope) return;
    scopeRule.walkRules((rule) => {
      rule.selector = splitSelectors(rule.selector).map((part) => {
        const selector = part.trim();
        return selector.includes(':scope') ? selector.replaceAll(':scope', scope) : `${scope} ${selector}`;
      }).join(', ');
    });
    scopeRule.replaceWith(...scopeRule.nodes);
  });
  sheet.walkAtRules((rule) => {
    if (/^(?:import|theme|keyframes|font-face)$/i.test(rule.name) || (rule.name === 'media' && /print/i.test(rule.params))) rule.remove();
  });
  sheet.walkRules((rule) => {
    rule.selector = prefixSelector(rule.selector);
    rule.walkDecls((declaration) => {
      if (!colorPattern.test(declaration.value)) { declaration.remove(); colorPattern.lastIndex = 0; return; }
      colorPattern.lastIndex = 0;
      if (/^(?:content|animation|transition|font|src|filter)$/i.test(declaration.prop)) { declaration.remove(); return; }
      const next = darken(declaration.value, roleOf(declaration.prop));
      if (next === declaration.value) declaration.remove();
      else declaration.value = next;
    });
    if (!rule.nodes?.length) rule.remove();
  });
  sheet.walkAtRules((rule) => { if (!rule.nodes?.length) rule.remove(); });
  const output = `/* Generated by scripts/generate-dark-themes.mjs; edit the source palette or generator. */\n${sheet.toString()}\n`;
  await writeFile(resolve(root, 'apps', app, 'src', 'dark.generated.css'), output);
  console.log(`${app}: ${output.length} bytes`);
}

await Promise.all(apps.map(generate));
