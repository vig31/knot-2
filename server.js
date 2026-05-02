const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const outDir = path.resolve(__dirname, 'out');

// Security headers for every response
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  next();
});

/** Returns true only if `target` resolves to a path inside `base`. */
function isSafeSubpath(base, target) {
  const resolved = path.resolve(target);
  return resolved === base || resolved.startsWith(base + path.sep);
}

// Serve static assets (JS, CSS, images, etc.) — disable directory redirect
app.use(express.static(outDir, { redirect: false }));

// Handle clean URLs — try appending .html, then index.html for directory-like paths
app.get('*splat', (req, res) => {
  const cleanPath = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
  const htmlPath = path.join(outDir, cleanPath + '.html');
  if (!isSafeSubpath(outDir, htmlPath)) {
    return res.status(403).send('Forbidden');
  }
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  const indexPath = path.join(outDir, cleanPath, 'index.html');
  if (!isSafeSubpath(outDir, indexPath)) {
    return res.status(403).send('Forbidden');
  }
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  const fallback404 = path.join(outDir, '404.html');
  if (fs.existsSync(fallback404)) {
    return res.status(404).sendFile(fallback404);
  }
  res.status(404).send('Not found');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
