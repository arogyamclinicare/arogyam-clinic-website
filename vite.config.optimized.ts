import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic'
    })
  ],
  
  // Performance optimizations
  build: {
    // Target modern browsers for better performance
    target: 'es2015',
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log'], // Remove specific functions
      },
      mangle: {
        safari10: true, // Fix Safari 10 issues
      },
    },
    
    // Optimize chunks
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for external dependencies
          vendor: ['react', 'react-dom'],
          
          // UI library chunk
          ui: ['@radix-ui/react-accordion', 'lucide-react'],
          
          // Utilities chunk
          utils: ['class-variance-authority', 'clsx', 'tailwind-merge'],
        },
        
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name!)) {
            return `images/[name]-[hash][extname]`;
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name!)) {
            return `fonts/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        },
        
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Source maps for debugging
    sourcemap: false, // Disable in production for smaller builds
  },
  
  // Development server optimizations
  server: {
    // Enable hot module replacement
    hmr: true,
    // Host configuration
    host: true,
    // Port configuration
    port: 3000,
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
    ],
    exclude: [
      // Exclude large dependencies that don't need pre-bundling
    ],
  },
  
  // Asset handling
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp'],
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@components': resolve(__dirname, './components'),
      '@styles': resolve(__dirname, './styles'),
      '@utils': resolve(__dirname, './components/utils'),
    },
  },
  
  // CSS optimizations
  css: {
    // PostCSS configuration
    postcss: {
      plugins: [
        // Add autoprefixer and other PostCSS plugins
      ],
    },
    
    // CSS code splitting
    codeSplit: true,
    
    // CSS modules configuration
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },
});
