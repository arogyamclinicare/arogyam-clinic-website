import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

// Serve static files from dist directory with proper MIME types
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
    }
    if (filePath.endsWith('.css')) {
      res.set('Content-Type', 'text/css; charset=utf-8');
    }
    if (filePath.endsWith('.html')) {
      res.set('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Your LATEST optimized website is running at:`);
  console.log(`🚀 http://localhost:${port}/`);
  console.log(`📱 Network: http://192.168.1.2:${port}/`);
  console.log(`\n🎯 This is your PRODUCTION-READY version for client demo!`);
});
