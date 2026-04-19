require('dotenv').config();
const compression = require("compression");
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "..", "frontend", "dist");
const isProduction = process.env.NODE_ENV === 'production';

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

if (process.env.COMPRESSION !== 'false') {
  app.use(compression({
    threshold: 1024,
    level: 6
  }));
}

if (!isProduction) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

app.use(express.static(publicDir, {
  maxAge: isProduction ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.wasm') {
      res.setHeader('Content-Type', 'application/wasm');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    }
  }
}));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  const indexPath = path.join(publicDir, "index.html");
  
  if (!fs.existsSync(indexPath)) {
    return res.status(404).format({
      html: () => {
        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Build Artifacts Not Found</title>
              <style>
                body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; }
                .error { color: #d73a49; }
                .solution { background: #f1f8ff; padding: 15px; border-radius: 6px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <h1 class="error">🚫 Build Artifacts Not Found</h1>
              <p>The file <code>${path.relative(process.cwd(), indexPath)}</code> is missing.</p>
              
              <div class="solution">
                <h3>🔧 Solution:</h3>
                <p>Run the following command to build the frontend:</p>
                <pre><code>make build-all</code></pre>
              </div>
              
              <p><strong>Current directory:</strong> ${process.cwd()}</p>
              <p><strong>Looking for:</strong> ${indexPath}</p>
            </body>
          </html>
        `);
      },
      json: () => {
        res.json({ 
          error: 'Build artifacts not found', 
          message: 'Run "make build-all" to build the frontend',
          path: indexPath 
        });
      },
      default: () => {
        res.type('text').send('Build artifacts not found. Run "make build-all" to build the frontend.');
      }
    });
  }
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).format({
    html: () => res.send('<h1>Internal Server Error</h1>'),
    json: () => res.json({ error: 'Internal Server Error' }),
    default: () => res.type('text').send('Internal Server Error')
  });
});

app.use((req, res) => {
  res.status(404).format({
    html: () => res.send('<h1>Not Found</h1>'),
    json: () => res.json({ error: 'Not Found' }),
    default: () => res.type('text').send('Not Found')
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Snake Game Server running on port ${port}`);
  console.log(`📁 Serving files from: ${publicDir}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Open: http://localhost:${port}`);
  
  if (isProduction) {
    console.log('✅ Production mode with compression and caching enabled');
  } else {
    console.log('🛠️  Development mode with verbose logging');
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
