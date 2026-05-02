const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const outDir = path.join(__dirname, 'out');

// Serve static assets (JS, CSS, images, etc.) — disable directory redirect
app.use(express.static(outDir, { redirect: false }));

// Handle clean URLs — try appending .html, then index.html for directory-like paths
app.get('*splat', (req, res) => {
  const cleanPath = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
  const htmlPath = path.join(outDir, cleanPath + '.html');
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  const indexPath = path.join(outDir, cleanPath, 'index.html');
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
