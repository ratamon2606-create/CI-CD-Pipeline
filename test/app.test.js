const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createServer } = require('../app');

async function withServer(callback) {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  try {
    const address = server.address();
    await callback(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close(error =>
        error ? reject(error) : resolve()
      );
    });
  }
}

test('GET /health returns JSON and HTTP 200', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });
});

test('GET / serves homepage', async () => {
  await withServer(async base => {
    const response = await fetch(base);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /CI\/CD Pipeline/);
  });
});

test('unknown route returns HTTP 404', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/missing`);
    assert.equal(response.status, 404);
  });
});
