import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    watch: {}, // <-- ESSENCIAL pro modo watch funcionar com `vite build`
    outDir: 'js/dist',
    sourcemap: true,
    minify: false, // pode deixar true se quiser minificação
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'ImageReplacer',
      formats: ['iife'],
      fileName: () => 'assets/main.js'
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
    extensions: ['.js', '.jsx', '.json']
  }
})
