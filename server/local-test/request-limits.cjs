// Runs against the dedicated synthetic API and database only.
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const base = 'http://127.0.0.1:5001/api';

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  try {
    const users = await User.find({ _id: { $in: ['660000000000000000000001', '660000000000000000000004'] } });
    assert.equal(users.length, 2);
    const token = (user) => jwt.sign({ UserInfo: { userId: String(user._id), tokenVersion: user.tokenVersion || 0 } }, 'local-test-access-only', { expiresIn: '5m' });
    const invalidUpdate = (user) => fetch(`${base}/user/${user._id}`, { method: 'PUT', headers: { 'content-type': 'application/json', authorization: `Bearer ${token(user)}` }, body: JSON.stringify({ name: '', email: 'invalid' }) });
    for (let i = 0; i < 120; i++) assert.equal((await invalidUpdate(users[0])).status, 400);
    const blockedWrite = await invalidUpdate(users[0]);
    assert.equal(blockedWrite.status, 429);
    assert.ok(blockedWrite.headers.get('retry-after'));
    assert.equal((await invalidUpdate(users[1])).status, 400);
    const invalidRegistration = () => fetch(`${base}/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: '', email: 'invalid', password: '' }) });
    for (let i = 0; i < 30; i++) assert.equal((await invalidRegistration()).status, 400);
    const blockedRegistration = await invalidRegistration();
    assert.equal(blockedRegistration.status, 429);
    assert.ok(blockedRegistration.headers.get('retry-after'));
    console.log('Passed: registration and per-account write limits, retry headers, and independent account limits.');
  } finally { await mongoose.disconnect(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
