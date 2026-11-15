// Isolated synthetic database and API only.
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Session = require('../models/sessionModel');
const base = 'http://127.0.0.1:5001/api';
async function call(path, { method = 'GET', token, cookie, body } = {}) {
  const res = await fetch(base + path, { method, headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}), ...(cookie ? { cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: res.status, data, cookie: res.headers.get('set-cookie')?.split(';')[0] };
}
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  const email = `session-${Date.now()}@recipen.test`, password = 'SyntheticPass123!';
  const user = await User.create({ name: 'Session Tester', email, password: await bcrypt.hash(password, 10), roles: ['BasicUser'] });
  try {
    const login = () => call('/auth/login', { method: 'POST', body: { email, password } });
    const a = await login(), b = await login();
    assert.equal(a.status, 200); assert.equal(b.status, 200); assert.notEqual(a.cookie, b.cookie);
    assert.deepEqual(Object.keys(jwt.decode(a.data.accessToken).UserInfo).sort(), ['sessionId', 'tokenVersion', 'userId']);
    assert.equal(a.data.user.email, email);
    assert.ok(Array.isArray(a.data.user.favorites));
    const records = await Session.find({ user: user._id }).select('+tokenHash');
    assert.equal(records.length, 2); assert.ok(records.every((record) => !a.cookie.includes(record.tokenHash) && !b.cookie.includes(record.tokenHash)));
    const rotate = await call('/auth/refresh', { cookie: a.cookie });
    assert.equal(rotate.status, 200); assert.notEqual(rotate.cookie, a.cookie);
    assert.deepEqual(Object.keys(jwt.decode(rotate.data.accessToken).UserInfo).sort(), ['sessionId', 'tokenVersion', 'userId']);
    assert.equal(rotate.data.user.userId, String(user._id));
    assert.equal((await call('/auth/refresh', { cookie: a.cookie })).status, 403);
    const rotatedB = await call('/auth/refresh', { cookie: b.cookie });
    assert.equal(rotatedB.status, 200);
    assert.equal((await call('/auth/logout', { method: 'POST', cookie: rotate.cookie, token: rotate.data.accessToken })).status, 204);
    assert.equal((await call(`/user/${user._id}`, { method: 'PUT', token: rotate.data.accessToken, body: { name: user.name, email } })).status, 403);
    assert.equal((await call(`/user/${user._id}`, { method: 'PUT', token: b.data.accessToken, body: { name: user.name, email } })).status, 201);
    const legacy = jwt.sign({ userId: String(user._id) }, 'local-test-refresh-only', { expiresIn: '2d' });
    await User.updateOne({ _id: user._id }, { $set: { refreshToken: [legacy] } });
    const migrated = await call('/auth/refresh', { cookie: `jwt=${legacy}` });
    assert.equal(migrated.status, 403);
    assert.equal((await call('/auth/refresh', { cookie: `jwt=${legacy}` })).status, 403);
    const changed = await call(`/user/${user._id}`, { method: 'PUT', token: b.data.accessToken, body: { name: user.name, email, currentPassword: password, password: 'ReplacementPass123!' } });
    assert.equal(changed.status, 201);
    assert.equal(await Session.countDocuments({ user: user._id }), 0);
    assert.equal((await call('/auth/refresh', { cookie: rotatedB.cookie })).status, 403);
    console.log('Passed: separate devices, hashed tokens, rotation, replay rejection, legacy sign-in requirement, device logout and password revocation.');
  } finally { await Session.deleteMany({ user: user._id }); await User.deleteOne({ _id: user._id }); await mongoose.disconnect(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
