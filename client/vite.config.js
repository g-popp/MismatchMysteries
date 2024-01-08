import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import { defineConfig } from 'vite';

import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            plugins: [nodeModulesPolyfillPlugin()]
        }
    },
    plugins: [react()],
    build: {
        rollupOptions: {
            plugins: [nodePolyfills()]
        }
    }
});
