// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /api to the third-party service
      '/api': {
        target: 'https://orders.eshipz.com/api', // The third-party API URL
        changeOrigin: true,  // Changes the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/api/, ''),  // Remove /api prefix from the request URL
      }
    }
  }
});
