// Fallback entrypoint
try {
  require('./dist/index.js');
} catch (err) {
  console.error('Failed to load compiled server from dist/index.js:', err);
  process.exit(1);
}
