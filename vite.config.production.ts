/**
 * Production HTTPS and Environment Configuration
 * Healthcare-grade security configuration
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

const isProduction = process.env.NODE_ENV === 'production';

// HTTPS Configuration for local development and production
const httpsConfig = () => {
  if (isProduction) {
    // Production HTTPS - should be configured at server/load balancer level
    return undefined;
  }
  
  // Development HTTPS configuration
  try {
    return {
      key: fs.readFileSync('./certs/localhost-key.pem'),
      cert: fs.readFileSync('./certs/localhost.pem'),
    };
  } catch {
    // HTTPS certificates not found - will run on HTTP
    return undefined;
  }
};

export default defineConfig({
  plugins: [
    react({
      // Production optimizations
      babel: {
        plugins: isProduction ? [
          ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
        ] : []
      }
    })
  ],
  
  // Development server configuration
  server: {
    port: 3000,
    https: httpsConfig(),
    host: true, // Allow external connections
    strictPort: true,
    cors: {
      origin: isProduction ? process.env.VITE_CORS_ORIGIN : true,
      credentials: true
    },
    headers: {
      // Security headers
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      ...(isProduction && {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Content-Security-Policy': generateCSP()
      })
    }
  },
  
  // Build configuration
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: !isProduction, // No source maps in production
    minify: isProduction ? 'terser' : false,
    
    // Production optimizations
    terserOptions: isProduction ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      mangle: {
        safari10: true,
      },
    } : undefined,
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-dialog'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          
          // Feature chunks
          'auth': ['./lib/secure-auth.ts'],
          'pdf-generation': ['./lib/pdf-generator.ts'],
        },
        
        // Asset naming for cache busting
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          return `assets/js/${name}-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb inline limit
    chunkSizeWarningLimit: 1000, // 1MB chunk warning
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@components': resolve(__dirname, 'components'),
      '@lib': resolve(__dirname, 'lib'),
      '@types': resolve(__dirname, 'types'),
      '@styles': resolve(__dirname, 'styles'),
    },
  },
  
  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
  },
  
  // Production optimizations
  ...(isProduction && {
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none',
    },
  }),
});

/**
 * Generate Content Security Policy
 */
function generateCSP(): string {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://maps.google.com https://maps.googleapis.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];
  
  if (!isProduction) {
    // Allow hot reload in development
    csp.push("connect-src 'self' ws://localhost:3000 http://localhost:3000");
  }
  
  return csp.join('; ');
}