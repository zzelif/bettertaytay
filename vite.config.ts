import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type ProxyOptions } from 'vite';

const proxyConfig: Record<string, ProxyOptions> = {
  '/api': {
    target: 'http://localhost:8788',
    changeOrigin: true,
    rewrite: (path: string) => path,
    configure: proxy => {
      // Handle proxy errors (ECONNREFUSED, ECONNRESET, etc.)
      proxy.on(
        'error',
        (
          _err: Error,
          _req: unknown,
          res: {
            headersSent: boolean;
            writeHead: (code: number, headers: Record<string, string>) => void;
            end: (data: string) => void;
          }
        ) => {
          if (!res.headersSent) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({ error: 'API unavailable', offline: true })
            );
          }
        }
      );
      // Handle proxy request errors (connection failures)
      proxy.on(
        'proxyReq',
        (proxyReq: { on: (event: string, handler: () => void) => void }) => {
          proxyReq.on('error', () => {
            // Error will be caught by the main error handler above
          });
        }
      );
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('node_modules')) {
            if (
              normalizedId.includes('/node_modules/react/') ||
              normalizedId.includes('/node_modules/react-dom/') ||
              normalizedId.includes('/node_modules/scheduler/')
            ) {
              return 'vendor-react';
            }
            if (
              normalizedId.includes('/node_modules/react-router-dom/') ||
              normalizedId.includes('/node_modules/react-router/') ||
              normalizedId.includes('/node_modules/nuqs/')
            ) {
              return 'vendor-router';
            }
            if (normalizedId.includes('leaflet')) {
              return 'vendor-leaflet';
            }
            if (normalizedId.includes('/node_modules/recharts/')) {
              return 'vendor-recharts';
            }
            if (
              normalizedId.includes('/node_modules/i18next/') ||
              normalizedId.includes('/node_modules/react-i18next/')
            ) {
              return 'vendor-i18n';
            }
            return 'vendor-core';
          }
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  server: {
    proxy: proxyConfig,
  },
  preview: {
    proxy: proxyConfig,
  },
});
