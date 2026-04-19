import { defineConfig, loadEnv } from 'vite';
import wasm from 'vite-plugin-wasm';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');

  return {
    base: env.VITE_BASE_URL || '/',
    plugins: [
      wasm()
    ],

    publicDir: 'public',
    server: {
      port: parseInt(env.DEV_SERVER_PORT || '8000'),
      open: true,
      fs: {
        allow: ['..']
      }
    },
    optimizeDeps: {
      exclude: ['snake_game']
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      reportCompressedSize: false
    }
  };
});
