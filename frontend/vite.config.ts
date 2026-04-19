import { defineConfig, loadEnv } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');

  return {
    plugins: [
      wasm(),
      topLevelAwait()
    ],
    define: {
      'import.meta.env.VITE_CELL_SIZE': JSON.stringify(env.CELL_SIZE || '20'),
      'import.meta.env.VITE_WORLD_WIDTH': JSON.stringify(env.WORLD_WIDTH || '32'),
    },
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
