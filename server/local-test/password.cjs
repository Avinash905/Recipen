// Local-only test with a disposable synthetic account.
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const base = 'http://127.0.0.1:5001/api';
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  const email = `password-test-${Date.now()}@recipen.test`;
  const user = await User.create({ name: 'Disposable Password Tester', email, password: await bcrypt.hash('TestOriginal123!', 10) });
  const call = (path, options = {}) => fetch(base + path, options);
  try {
    let login = await call('/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'TestOriginal123!' }) });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    const oldToken = (await login.json()).accessToken;
    const update = (password, currentPassword) => call(`/user/${user._id}`, { method: 'PUT', headers: { 'content-type': 'application/json', authorization: `Bearer ${oldToken}` }, body: JSON.stringify({ name: user.name, email, password, currentPassword }) });
    assert.equal((await update('TestReplacement123!', 'wrong')).status, 400);
    assert.equal((await update('short', 'TestOriginal123!')).status, 400);
    let result = await update('TestReplacement123!', 'TestOriginal123!');
    assert.equal(result.status, 201);
    assert.equal((await result.json()).accessToken, undefined);
    assert.equal((await call(`/user/${user._id}`, { method: 'PUT', headers: { 'content-type': 'application/json', authorization: `Bearer ${oldToken}` }, body: JSON.stringify({ name: user.name, email }) })).status, 403);
    assert.equal((await call('/auth/refresh', { headers: { cookie } })).status, 403);
    assert.equal((await call('/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'TestOriginal123!' }) })).status, 401);
    assert.equal((await call('/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'TestReplacement123!' }) })).status, 200);
    console.log('Passed: current-password check, password rules, old session revocation and new sign-in.');
  } finally { await User.deleteOne({ _id: user._id }); await mongoose.disconnect(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
