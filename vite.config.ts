import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dynamicImportVars({})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // build: {
    
  //   rollupOptions: {
  //     external: [
  //       "PdfItem.vue",
  //         "/src/apps/BrowserItem.vue",
  //         "./src/apps/pdfItem/PdfItem.vue",
  //         "/src/apps/pdfItem/PdfItem.vue",
  //     ]
  // }
  // }
})
