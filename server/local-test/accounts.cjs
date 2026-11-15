// Synthetic-only account integration checks.
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const root = 'http://127.0.0.1:5001/api';
async function call(path, method = 'GET', body, token, cookie) {
  const res = await fetch(root + path, { method, headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}), ...(cookie ? { cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  let bodyText = await res.text(), data; try { data = JSON.parse(bodyText); } catch { data = bodyText; }
  return { status: res.status, data, cookie: res.headers.get('set-cookie')?.split(';')[0] };
}
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  const email = `account-${Date.now()}@recipen.test`;
  const pass = 'SyntheticPass123!';
  const admin = await User.findById('660000000000000000000003');
  const adminToken = jwt.sign({ UserInfo: { userId: String(admin._id), tokenVersion: admin.tokenVersion || 0 } }, 'local-test-access-only');
  try {
    assert.equal((await call('/auth/register', 'POST', { name: 'A', email: 'bad', password: 'x' })).status, 400);
    const register = () => call('/auth/register', 'POST', { name: ' Local Tester ', email: ` ${email.toUpperCase()} `, password: pass, roles: ['Admin'] });
    const statuses = (await Promise.all([register(), register()])).map(r => r.status).sort();
    assert.deepEqual(statuses, [201, 409]);
    const user = await User.findOne({ email });
    assert.deepEqual(user.roles, ['BasicUser']);
    let login = await call('/auth/login', 'POST', { email: email.toUpperCase(), password: pass });
    assert.equal(login.status, 200);
    let token = login.data.accessToken, cookie = login.cookie;
    assert.equal((await call(`/user/disable/${user._id}`, 'PUT', undefined, adminToken)).status, 204);
    assert.equal((await call(`/user/enable/${user._id}`, 'PUT', undefined, adminToken)).status, 204);
    assert.equal((await call(`/user/${user._id}`, 'PUT', { name:'Local Tester', email }, token)).status, 403);
    assert.equal((await call('/auth/refresh', 'GET', undefined, undefined, cookie)).status, 403);
    login = await call('/auth/login', 'POST', { email, password: pass });
    assert.equal(login.status, 200);
    token = login.data.accessToken; cookie = login.cookie;
    assert.equal((await call('/auth/logout', 'POST', undefined, undefined, cookie)).status, 204);
    assert.equal((await call(`/user/${user._id}`, 'PUT', { name:'Local Tester', email }, token)).status, 403);
    assert.equal((await call('/auth/refresh', 'GET', undefined, undefined, cookie)).status, 403);
    login = await call('/auth/login', 'POST', { email, password: pass });
    assert.equal(login.status, 200);
    token = login.data.accessToken;
    assert.equal((await call('/auth/logout', 'POST', undefined, token)).status, 204);
    assert.equal((await call(`/user/${user._id}`, 'PUT', { name:'Local Tester', email }, token)).status, 403);
    console.log('Passed: validation, concurrent duplicate registration, normalized login, role protection, disable/re-enable and logout revocation with and without a cookie.');
  } finally { await User.deleteMany({ email }); await mongoose.disconnect(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
