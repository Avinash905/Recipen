// This test only connects to the dedicated synthetic database and local server.
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');
const prefix = `Pagination test ${Date.now()}`;
const base = 'http://127.0.0.1:5001/api';
async function request(path, options) { const res = await fetch(base + path, options); return { status: res.status, data: await res.json() }; }
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  let testUser;
  try {
    await Recipe.insertMany(Array.from({ length: 15 }, (_, i) => ({ title: `${prefix} ${i}` })));
    const query = encodeURIComponent(prefix);
    const first = await request(`/recipe?page=1&limit=12&search=${query}`);
    const second = await request(`/recipe?page=2&limit=12&search=${query}`);
    assert.equal(first.data.total, 15); assert.equal(first.data.items.length, 12); assert.equal(second.data.items.length, 3);
    assert.equal(new Set([...first.data.items, ...second.data.items].map((item) => item._id)).size, 15);
    assert.equal((await request('/recipe?page=1&search=%5B')).data.total, 0);
    assert.ok(Array.isArray((await request('/recipe')).data));
    const admin = await User.findById('660000000000000000000003');
    const adminToken = jwt.sign({ UserInfo: { userId: String(admin._id), tokenVersion: admin.tokenVersion || 0 } }, 'local-test-access-only');
    testUser = await User.create({ name: 'Synthetic Photo Tester', email: `photo-${Date.now()}@recipen.test`, password: 'unused', profilePicture: 'https://example.test/photo.jpg', roles: ['BasicUser'] });
    const token = jwt.sign({ UserInfo: { userId: String(testUser._id), tokenVersion: 0 } }, 'local-test-access-only');
    const options = { method: 'PUT', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ name: testUser.name, email: testUser.email, removeProfilePicture: true }) };
    assert.equal((await request(`/user/${testUser._id}`, options)).status, 201);
    assert.equal((await User.findById(testUser._id)).profilePicture, '');
    const users = await request('/user?page=1&limit=1&search=Synthetic%20Photo%20Tester', { headers: { authorization: `Bearer ${adminToken}` } });
    assert.equal(users.data.total, 1); assert.equal(users.data.items.length, 1); assert.equal(users.data.items[0].password, undefined); assert.equal(users.data.items[0].refreshToken, undefined);
    console.log('Passed: paginated search, literal search, backward-compatible catalog, user field protection and explicit photo removal.');
  } finally {
    await Recipe.deleteMany({ title: { $regex: '^' + prefix } });
    if (testUser) await User.deleteOne({ _id: testUser._id });
    await mongoose.disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
