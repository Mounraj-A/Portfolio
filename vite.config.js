import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  build: {
    // Strip all console.* and debugger statements from production bundle
    // so no internal logs, state, or Firebase config details leak in DevTools
    minify: 'esbuild',
    target: 'es2020',
    esbuildOptions: {
      // Drop console logs and debugger statements in production
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      // Remove legal comments to reduce fingerprinting
      legalComments: 'none',
    },
    rollupOptions: {
      output: {
        // Randomize chunk names — makes source mapping harder
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Code-split large bundles
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
    // Increase chunk size warning limit (the 914 kB chunk warning)
    chunkSizeWarningLimit: 1000,
    // Do not expose source maps in production (hides your source code)
    sourcemap: false,
  },

  // Prevent sensitive env vars from being accidentally exposed
  // Only VITE_ prefixed variables are exposed to the client (Vite default)
  // Ensure no NON-VITE_ vars are referenced in client code
  envPrefix: 'VITE_',
}))
