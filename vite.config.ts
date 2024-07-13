import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // build: {
  //   target: 'esnext',
  //   rollupOptions: {
  //     plugins: [
  //       dynamicImportVars()
  //     ],
  //   },
  // }
})
