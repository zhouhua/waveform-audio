/// <reference types="vitest" />
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { peerDependencies } from './package.json';

export default defineConfig({
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    minify: 'terser',
    rollupOptions: {
      external: ['react/jsx-runtime', ...Object.keys(peerDependencies)],
      output: {
        assetFileNames: 'index.[ext]',
        manualChunks: {
          'radix-ui': [
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-icons',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
          ],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
  },
  plugins: [
    react(),
    dts({
      include: ['src'],
      rollupTypes: true,
    }),
    visualizer({
      brotliSize: true,
      emitFile: true,
      filename: 'stats.html',
      gzipSize: true,
      open: true,
    }),
  ],
});
