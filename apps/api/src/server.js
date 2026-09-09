// Automatic entrypoint wrapper for Render
// Supports start command: 'node src/server.js' or 'npm run start'
const path = require('path');
const distPath = path.join(__dirname, '..', 'dist', 'index.js');

try {
  require(distPath);
} catch (err) {
  console.error('Failed to load compiled server from dist/index.js:', err);
  process.exit(1);
}
