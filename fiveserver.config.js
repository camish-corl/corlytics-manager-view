module.exports = {
  // Root directory to serve files from
  root: './',
  
  // Port to run the server on
  port: 3000,
  
  // Host to bind to
  host: 'localhost',
  
  // Open browser automatically
  open: true,
  
  // Enable live reload
  live: true,
  
  // Files to watch for changes
  watch: [
    'src/**/*',
    'index.html',
    '*.css',
    '*.js',
    '*.ts',
    '*.tsx'
  ],
  
  // Files to ignore
  ignore: [
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    '*.log',
    '.DS_Store'
  ],
  
  // Custom middleware
  middleware: [
    // Add any custom middleware here if needed
  ],
  
  // HTTPS configuration (optional)
  // https: {
  //   key: './path/to/key.pem',
  //   cert: './path/to/cert.pem'
  // },
  
  // Proxy configuration (optional)
  // proxy: {
  //   '/api': 'http://localhost:8080'
  // },
  
  // Custom headers
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },
  
  // Logging options
  logLevel: 'info',
  
  // Directory listing (set to false for production-like behavior)
  directory: false,
  
  // Index file
  index: 'index.html'
}; 