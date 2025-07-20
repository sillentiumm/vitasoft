import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: '/vitasoft/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      '/api-auth': {
        target: 'http://91.220.155.234:8080/FrontTestingService-auth/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-auth/, ''),
      },
      '/api': {
        target: 'http://91.220.155.234:8080/FrontTestingService-back/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
