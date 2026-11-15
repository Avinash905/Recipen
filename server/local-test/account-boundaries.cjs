// Uses only the dedicated synthetic database and local test API.
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Session = require('../models/sessionModel');
const base = process.env.RECIPEN_TEST_API || 'http://127.0.0.1:5001/api';

async function request(path, { method = 'GET', token, cookie, body } = {}) {
  const response = await fetch(base + path, { method, headers: { ...(token && { authorization: `Bearer ${token}` }), ...(cookie && { cookie }), ...(body && { 'content-type': 'application/json' }) }, ...(body && { body: JSON.stringify(body) }) });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: response.status, data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  const password = 'SyntheticPass123!';
  const email = `boundary-${Date.now()}@recipen.test`;
  const user = await User.create({ name: 'Boundary Tester', email, password: await bcrypt.hash(password, 10), roles: ['BasicUser'] });
  try {
    const login = await request('/auth/login', { method: 'POST', body: { email, password } });
    assert.equal(login.status, 200);
    const update = (nextEmail, currentPassword) => request(`/user/${user._id}`, { method: 'PUT', token: login.data.accessToken, body: { name: user.name, email: nextEmail, currentPassword } });
    const changedEmail = `new-${email}`;
    assert.equal((await update(email)).status, 201);
    assert.equal((await update(changedEmail)).status, 400);
    assert.equal((await update(changedEmail, 'incorrect')).status, 400);
    assert.equal((await User.findById(user._id)).email, email);
    assert.equal((await update(changedEmail, password)).status, 201);
    assert.equal((await User.findById(user._id)).email, changedEmail);
    const legacy = jwt.sign({ UserInfo: { userId: String(user._id), tokenVersion: 0 } }, 'local-test-access-only', { expiresIn: '5m' });
    assert.equal((await request('/auth/logout', { method: 'POST', token: legacy, cookie: login.cookie })).status, 204);
    assert.equal((await request(`/user/${user._id}`, { method: 'PUT', token: legacy, body: { name: user.name, email: changedEmail } })).status, 403);
    assert.equal((await request('/auth/refresh', { cookie: login.cookie })).status, 403);
    console.log('Passed: email changes require the current password; unchanged profiles work; legacy access and modern session are revoked together.');
  } finally {
    await Session.deleteMany({ user: user._id });
    await User.deleteOne({ _id: user._id });
    await mongoose.disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
