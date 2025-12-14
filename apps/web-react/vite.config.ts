import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  define: { process },
  envPrefix: ['VITE_', 'CF_'],
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'reading-time': path.resolve(__dirname, './src/shims/reading-time.ts'),
      'jsdom': path.resolve(__dirname, './src/shims/jsdom.ts'),
      'postcss': path.resolve(__dirname, './src/shims/postcss.ts'),
    },
  },
  css: { devSourcemap: true },
  build: {
    rollupOptions: {
      external: ['mermaid'],
      output: {
        chunkFileNames: 'static/js/md-[name]-[hash].js',
        entryFileNames: 'static/js/md-[name]-[hash].js',
        assetFileNames: 'static/[ext]/md-[name]-[hash].[ext]',
        globals: { mermaid: 'mermaid' },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('katex')) return 'katex'
            if (id.includes('highlight.js')) return 'hljs'
            if (id.includes('codemirror')) return 'codemirror'
            if (id.includes('prettier')) return 'prettier'
            const pkg = id
              .split('node_modules/')[1]
              .split('/')[0]
              .replace('@', 'npm_')
            return `vendor_${pkg}`
          }
        },
      },
    },
  },
})
