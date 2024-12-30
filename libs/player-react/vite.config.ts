/// <reference types="vitest" />
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
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
    rollupOptions: {
      external: ['react/jsx-runtime', ...Object.keys(peerDependencies)],
      output: {
        assetFileNames: 'index.[ext]',
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
  ],
});
