import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@openmrs/esm-framework/src/internal': resolve(__dirname, '__mocks__/openmrs-esm-framework-internal.ts'),
      '@openmrs/esm-framework': resolve(__dirname, '__mocks__/openmrs-esm-framework.tsx'),
      'workbox-window': resolve(__dirname, 'node_modules/workbox-window/build/workbox-window.prod.mjs'),
    },
  },
  plugins: [
    {
      name: 'scss-identity',
      enforce: 'pre',
      resolveId(id) {
        if (/\.scss(\?.*)?$/.test(id)) {
          return '\0scss-identity:' + id.replace(/\.scss(\?.*)?$/, '');
        }
      },
      load(id) {
        if (id.startsWith('\0scss-identity:')) {
          return `export default new Proxy({}, { get: (_, k) => typeof k === 'string' ? k : undefined });`;
        }
      },
    },
    {
      name: 'asset-file',
      enforce: 'pre',
      resolveId(id) {
        if (/\.(svg|png)(\?.*)?$/.test(id)) {
          return '\0asset-file:' + id;
        }
      },
      load(id) {
        if (id.startsWith('\0asset-file:')) {
          return `export default '/assets/mock-asset';`;
        }
      },
    },
  ],
  test: {
    environment: 'happy-dom',
    mockReset: true,
    globals: true,
    setupFiles: ['./setup-tests.ts'],
    alias: {
      '@openmrs/esm-framework/src/internal': resolve(__dirname, '__mocks__/openmrs-esm-framework-internal.ts'),
      '@openmrs/esm-framework': resolve(__dirname, '__mocks__/openmrs-esm-framework.tsx'),
      'workbox-window': resolve(__dirname, 'node_modules/workbox-window/build/workbox-window.prod.mjs'),
    },
  },
});
