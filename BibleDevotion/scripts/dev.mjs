import net from 'node:net';
import { spawn } from 'node:child_process';

const preferredApiPort = Number(process.env.BIBLE_DEVOTION_API_PORT) || 3000;

function portIsAvailable(port) {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.once('error', (error) => error.code === 'EADDRINUSE' ? resolve(false) : reject(error));
    probe.listen({ host: '127.0.0.1', port }, () => probe.close(() => resolve(true)));
  });
}

async function findApiPort(startPort) {
  for (let port = startPort; port < startPort + 100; port += 1) {
    if (await portIsAvailable(port)) return port;
  }
  throw new Error(`在 ${startPort}–${startPort + 99} 中找不到可用的本地 API 端口。`);
}

async function waitForApi(port, server) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error('Bible Devotion API 未能启动。');
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return;
    } catch {
      // The server is still reconciling the note index or binding its port.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error('等待 Bible Devotion API 超时。');
}

let api;
let vite;
let shuttingDown = false;

function stop(child) {
  if (child && child.exitCode === null) child.kill();
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  stop(vite);
  stop(api);
  process.exitCode = code;
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());

try {
  const apiPort = await findApiPort(preferredApiPort);
  if (apiPort !== preferredApiPort) console.log(`端口 ${preferredApiPort} 已被占用；本次开发使用 API 端口 ${apiPort}。`);
  else console.log(`本次开发使用 API 端口 ${apiPort}。`);

  const environment = { ...process.env, PORT: String(apiPort), BIBLE_DEVOTION_API_PORT: String(apiPort) };
  api = spawn(process.execPath, ['--watch', 'server/index.js'], { stdio: 'inherit', env: environment });
  await waitForApi(apiPort, api);

  // Start Vite with the current Node executable rather than spawning npm.
  // On Windows that avoids the .cmd-shell hand-off which can fail with EINVAL
  // when a launcher starts this process.
  vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit', env: environment });
  vite.on('exit', (code) => shutdown(code ?? 1));
  api.on('exit', (code) => {
    if (!shuttingDown && code !== 0) shutdown(code ?? 1);
  });
} catch (error) {
  console.error(`无法启动 Bible Devotion：${error.message}`);
  shutdown(1);
}
