import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { createEcosystemHandler } from './server/ecosystem.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'BOT_');
  const handler = createEcosystemHandler({ backendUrl: env.BOT_API_URL, serviceToken: env.BOT_SERVICE_TOKEN });
  return {
    plugins: [react(), tailwindcss(),
      { name: 'bot-service-bridge', configureServer(server) { server.middlewares.use(handler); }, configurePreviewServer(server) { server.middlewares.use(handler); } },
      VitePWA({ injectRegister: false, registerType: 'prompt', manifest: false,
        includeAssets: ['panda-icon-192.png', 'panda-icon-512.png'],
        workbox: { globPatterns: ['**/*.{html,js,css,svg,png,webp,woff,woff2}'], globIgnores: ['**/panda-writing-sprites.png'], maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
          cleanupOutdatedCaches: true, navigateFallback: '/index.html', navigateFallbackDenylist: [/^\/api\//, /^\/admin/],
          runtimeCaching: [{ urlPattern: ({ request, url }) => request.method === 'GET' && url.origin === self.location.origin && ['script', 'style', 'image', 'font'].includes(request.destination), handler: 'StaleWhileRevalidate', options: { cacheName: 'hsk-static-assets', expiration: { maxEntries: 150, maxAgeSeconds: 30 * 86400 } } }]
        }
      })
    ],
    server: { host: '127.0.0.1', port: 5174 }
  };
});
