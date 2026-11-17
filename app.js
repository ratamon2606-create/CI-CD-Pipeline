const http = require('node:http');

function createServer() {
  return http.createServer((req, res) => {
    if (req.method !== 'GET') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }

    if (req.url === '/health') {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      return res.end(JSON.stringify({ status: 'ok' }));
    }

    if (req.url === '/') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      return res.end('CI/CD Pipeline by GitHub Actions');
    }

    res.writeHead(404);
    return res.end('Not Found');
  });
}

if (require.main === module) {
  createServer().listen(3000, '0.0.0.0', () => {
    console.log('Server listening on port 3000');
  });
}

module.exports = { createServer };
