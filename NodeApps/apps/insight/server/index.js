import { createApp } from './app.js';

try {
  const portFlag = process.argv.indexOf('--port');
  const cliPort = portFlag >= 0 ? process.argv[portFlag + 1] : undefined;
  const port = Number(cliPort || process.env.PORT || 5757);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT 必须为 1–65535 之间的整数');
  const app = createApp();
  const server = app.listen(port, '127.0.0.1', () => console.log(`InsightMatrix: http://127.0.0.1:${port}`));
  server.on('error', (error) => { console.error('服务启动失败:', error.message); app.locals.close(); process.exitCode = 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => { app.locals.close(); process.exit(0); }));
} catch (error) {
  console.error('InsightMatrix 启动失败:', error.message);
  process.exitCode = 1;
}
