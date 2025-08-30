import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  const isProduction = command === 'build' && mode === 'production'
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
    server: {
      port: 3000,
      open: true,
      host: 'localhost',
      strictPort: true,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.ngrok.io',
        '.ngrok-free.app',
        '.loca.lt',
        '.serveo.net'
      ],
      hmr: {
        port: 3000,
        host: 'localhost',
        protocol: 'ws',
        overlay: false, // Disable error overlay to prevent glitches
      },
    },
    preview: {
      port: 4173,
      host: true,
      open: true,
      strictPort: false,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: isProduction ? false : true, // Enable sourcemaps in development
      assetsDir: 'assets',
      emptyOutDir: true,
      // Production optimizations
      target: isProduction ? 'es2015' : 'esnext',
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: true,
        format: {
          comments: false,
        },
      } : undefined,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react'],
            'supabase-vendor': ['@supabase/supabase-js'],
            'validation-vendor': ['zod'],
            'auth-vendor': ['bcryptjs'],
            // Form handling
            'form-vendor': ['react-hook-form', '@hookform/resolvers'],
            // UI components
            'radix-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-accordion',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip'
            ],
            // Utilities
            'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority'],
            // Charts and data
            'charts-vendor': ['recharts'],
            // Carousel
            'carousel-vendor': ['embla-carousel-react'],
          },
          // Optimize chunk naming
          chunkFileNames: isProduction ? 'assets/[name]-[hash:8].js' : 'assets/[name].js',
          entryFileNames: isProduction ? 'assets/[name]-[hash:8].js' : 'assets/[name].js',
          assetFileNames: isProduction ? 'assets/[name]-[hash:8].[ext]' : 'assets/[name].[ext]',
        },
      },
      // Optimize chunk size warnings
      chunkSizeWarningLimit: isProduction ? 500 : 1000,
      // Minify CSS
      cssMinify: isProduction,
      // Enable esbuild optimizations
      esbuild: isProduction ? {
        drop: ['console', 'debugger'], // Remove console logs in production
        pure: ['console.log', 'console.info', 'console.debug'], // Mark as pure for tree shaking
      } : undefined,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', '@supabase/supabase-js'],
      exclude: isProduction ? ['@vite/client', '@vite/env'] : [],
    },
    // Environment-specific variables
    define: {
      __DEV__: !isProduction,
      __PROD__: isProduction,
      __VERSION__: JSON.stringify(env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    // CSS optimization
    css: {
      devSourcemap: !isProduction,
    },
  }
})

