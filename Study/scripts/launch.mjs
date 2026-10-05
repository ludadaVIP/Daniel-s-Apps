import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const isWindows = process.platform === 'win32';
const appUrl = 'http://localhost:3456';
const apiUrl = 'http://localhost:3001/health';
const pinnedPnpm = JSON.parse(
  readFileSync(path.join(root, 'package.json'), 'utf8'),
).packageManager.split('@')[1];

function invocation(command, args) {
  if (!isWindows) return { command, args };
  // All command tokens here are fixed by this launcher, not user input.
  return {
    command: 'cmd.exe',
    args: ['/d', '/s', '/c', [command, ...args].join(' ')],
  };
}

function versionOf(command, args = []) {
  const call = invocation(command, [...args, '--version']);
  const result = spawnSync(call.command, call.args, {
    cwd: root,
    encoding: 'utf8',
    timeout: 30_000,
    env: { ...process.env, COREPACK_ENABLE_DOWNLOAD_PROMPT: '0' },
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

function packageManager() {
  if (versionOf('pnpm') === pinnedPnpm) return { command: 'pnpm', args: [] };
  if (versionOf('corepack', ['pnpm']) === pinnedPnpm) {
    return { command: 'corepack', args: ['pnpm'] };
  }
  if (versionOf('npm')) {
    return {
      command: 'npm',
      args: ['exec', '--yes', `--package=pnpm@${pinnedPnpm}`, '--', 'pnpm'],
    };
  }
  throw new Error(
    'pnpm could not be found or installed. Check that npm is available.',
  );
}

function dependenciesNeedInstall() {
  const marker = path.join(root, 'node_modules', '.modules.yaml');
  const viteBin = path.join(
    root,
    'apps',
    'hub',
    'node_modules',
    '.bin',
    isWindows ? 'vite.cmd' : 'vite',
  );
  const tsxBin = path.join(
    root,
    'chemistry',
    'apps',
    'server',
    'node_modules',
    '.bin',
    isWindows ? 'tsx.cmd' : 'tsx',
  );
  if (![marker, viteBin, tsxBin].every(existsSync)) return true;

  const installedAt = statSync(marker).mtimeMs;
  const manifests = [
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'package.json',
    'packages/shared/package.json',
    'packages/ui/package.json',
    'apps/hub/package.json',
    'chemistry/apps/web/package.json',
    'chemistry/apps/server/package.json',
  ];
  return manifests.some(
    (name) => statSync(path.join(root, name)).mtimeMs > installedAt,
  );
}

function run(command, args, options = {}) {
  const call = invocation(command, args);
  return spawn(call.command, call.args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
    ...options,
  });
}

function waitForExit(child) {
  if (child.exitCode !== null) return Promise.resolve(child.exitCode);
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) => resolve(code ?? 1));
  });
}

async function request(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return response.ok ? response : null;
  } catch {
    return null;
  }
}

async function servicesReady() {
  const [web, api] = await Promise.all([request(appUrl), request(apiUrl)]);
  if (!web || !api) return false;
  const [html, health] = await Promise.all([
    web.text(),
    api.json().catch(() => null),
  ]);
  return html.includes('Study · 科学学习') && health?.subject === 'chemistry';
}

async function openBrowser() {
  if (process.env.STUDY_SKIP_BROWSER === '1') return;
  try {
    const { default: open, apps } = await import('open');
    // Resolve the user's default browser to its executable. This avoids a
    // hidden cmd.exe `start` process that can finish without opening a tab.
    await open(appUrl, { app: { name: apps.browser } });
    console.log(`Opening browser: ${appUrl}`);
  } catch (error) {
    console.warn(`Default browser launch failed: ${error.message}`);
    try {
      await open(appUrl);
      console.log(`Opening browser: ${appUrl}`);
    } catch (fallbackError) {
      console.warn(`Browser launch failed: ${fallbackError.message}`);
      console.log(`Open this address manually: ${appUrl}`);
    }
  }
}

function stopServer(child) {
  if (!child?.pid || child.exitCode !== null) return;
  if (isWindows) {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
    });
  } else {
    child.kill('SIGTERM');
  }
}

async function main() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 20 || (major === 20 && minor < 19)) {
    throw new Error('Node.js 20.19 or newer is required.');
  }

  if (await servicesReady()) {
    console.log(`Study is already running at ${appUrl}`);
    await openBrowser();
    return;
  }

  if (dependenciesNeedInstall()) {
    const manager = packageManager();
    console.log('Installing missing or outdated dependencies...');
    const install = run(manager.command, [
      ...manager.args,
      'install',
      '--frozen-lockfile',
      '--prefer-offline',
    ]);
    const code = await waitForExit(install);
    if (code !== 0)
      throw new Error(`Dependency installation failed (exit ${code}).`);
  } else {
    console.log('Dependencies are installed.');
  }

  console.log('Starting Study...');
  const server = run('npm', ['run', 'dev']);
  let serverError;
  server.once('error', (error) => {
    serverError = error;
  });
  process.once('SIGINT', () => stopServer(server));
  process.once('SIGTERM', () => stopServer(server));
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (serverError) throw serverError;
    if (server.exitCode !== null) {
      throw new Error(`Development server stopped (exit ${server.exitCode}).`);
    }
    if (await servicesReady()) {
      console.log(`Ready: ${appUrl}`);
      await openBrowser();
      console.log(
        'Keep this window open while using the app. Press Ctrl+C to stop.',
      );
      const code = await waitForExit(server);
      if (code !== 0) process.exitCode = code;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  stopServer(server);
  throw new Error(
    'The app did not become ready within 60 seconds. Check the output above.',
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
