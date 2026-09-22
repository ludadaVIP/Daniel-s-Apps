import rootConfig from '../vite.config.js';

const proxy = Object.fromEntries(
  Object.keys(rootConfig.server.proxy).map((prefix) => [prefix, 'http://127.0.0.1:5989']),
);

export default {
  ...rootConfig,
  server: {
    ...rootConfig.server,
    port: 5988,
    strictPort: true,
    proxy,
  },
};
