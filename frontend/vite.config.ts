import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait()
  ],
  define: {
    'process.env.CELL_SIZE': JSON.stringify(process.env.CELL_SIZE || '10'),
    'process.env.WORLD_WIDTH': JSON.stringify(process.env.WORLD_WIDTH || '64'),
    'process.env.BASE_FPS': JSON.stringify(process.env.BASE_FPS || '3'),
    'process.env.BASE_CELL_SIZE': JSON.stringify(process.env.BASE_CELL_SIZE || '20'),
  },
  server: {
    port: parseInt(process.env.DEV_SERVER_PORT || '8000'),
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
