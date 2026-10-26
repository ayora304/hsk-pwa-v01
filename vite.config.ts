import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { createHandwritingHandler } from './server/handwriting.mjs';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'OPENAI_');
  const handler = createHandwritingHandler({ apiKey: env.OPENAI_API_KEY, model: env.OPENAI_MODEL || 'gpt-4.1-mini' });
  return {
  plugins: [
    react(),
    tailwindcss(),
    { name: 'handwriting-api', configureServer(server) { server.middlewares.use(handler); }, configurePreviewServer(server) { server.middlewares.use(handler); } },
  ],
  server: {
    host: true,
    port: 5173
  }
  };
});
