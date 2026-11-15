// Isolated limiter check with no production accounts or database.
const assert = require('node:assert/strict');
const express = require('express');
const { accountLoginLimit } = require('../middleware/loginLimit');

async function main() {
  const app = express();
  app.use(express.json());
  app.post('/login', accountLoginLimit, (req, res) => res.status(req.body.password === 'valid' ? 200 : 401).json({ message: 'Result' }));
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const url = `http://127.0.0.1:${server.address().port}/login`;
    const attempt = (email, password = 'invalid') => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
    for (let i = 0; i < 10; i++) assert.equal((await attempt(i % 2 ? ' TEST@EXAMPLE.TEST ' : 'test@example.test')).status, 401);
    const blocked = await attempt('test@example.test');
    assert.equal(blocked.status, 429); assert.ok(blocked.headers.get('retry-after'));
    assert.equal((await attempt('other@example.test', 'valid')).status, 200);
    for (let i = 0; i < 12; i++) assert.equal((await attempt('invalid')).status, 401);
    console.log('Passed: normalized account limit, retry header, independent account and invalid-input handling.');
  } finally { await new Promise((resolve) => server.close(resolve)); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
