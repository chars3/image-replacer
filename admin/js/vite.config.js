import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  build: {
    watch: {},
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'ImageReplacer',
      formats: ['iife'],
      fileName: () => 'assets/main.js',
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  // ✅ Adiciona isso:
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'], // padrão de arquivos de teste
  },
});
