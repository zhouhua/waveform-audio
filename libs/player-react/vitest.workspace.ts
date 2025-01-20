/// <reference types="vitest" />
/// <reference types="@vitest/browser/providers/playwright" />

import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      coverage: {
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.d.ts',
          'vite.config.ts',
        ],
        provider: 'v8',
        reporter: ['default', 'text', 'json', 'html'],
      },
      environment: 'jsdom',
      globals: true,
      include: ['src/test/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      name: 'unit',
      root: '.',
      setupFiles: ['./src/test/unit/setup.ts'],
    },
  },
  {
    test: {
      browser: {
        enabled: true,
        headless: true,
        instances: [{
          browser: 'chromium',
          context: {},
          launch: {
            chromiumSnadbox: true,
            ignoreDefaultArgs: ['--mute-audio'],
          },
        }],
        name: 'chromium',
        provider: 'playwright',
        setupFiles: ['./src/test/browser/setup.ts'],
      },
      coverage: {
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.d.ts',
          'vite.config.ts',
        ],
        provider: 'v8',
        reporter: ['default', 'text', 'json', 'html'],
      },
      globals: true,
      include: ['src/test/browser/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      name: 'browser',
      root: '.',
    },
  },
]);
