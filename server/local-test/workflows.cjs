// Local synthetic workflow checks. Never points at a deployed service.
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const base = 'http://127.0.0.1:5001/api';
const ids = { basic: '660000000000000000000001', pro: '660000000000000000000002', other: '660000000000000000000004', admin: '660000000000000000000003' };
const versions = {};
const token = (name) => jwt.sign({ UserInfo: { userId: ids[name], tokenVersion: versions[name] || 0, roles: [name === 'admin' ? 'Admin' : name === 'basic' ? 'BasicUser' : 'ProUser'] } }, 'local-test-access-only', { expiresIn: '5m' });
async function call(path, method = 'GET', who, body) {
  const r = await fetch(base + path, { method, headers: { ...(who ? { Authorization: `Bearer ${token(who)}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const raw = await r.text(); let data; try { data = JSON.parse(raw); } catch { data = raw; } return { status: r.status, data };
}
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  for (const [name, id] of Object.entries(ids)) { const user = await User.findById(id); versions[name] = user.tokenVersion || 0; }
  const title = `Synthetic workflow ${Date.now()}`;
  const body = { title, image: 'https://placehold.co/600x400/png', description: 'Local synthetic blog' };
  let blogId;
  try {
    assert.equal((await call('/blog', 'POST', 'basic', body)).status, 401);
    assert.equal((await call('/blog', 'POST', 'pro', body)).status, 201);
    blogId = (await call('/blog')).data.find((blog) => blog.title === title)._id;
    assert.equal((await call(`/blog/${blogId}`, 'PUT', 'other', body)).status, 401);
    assert.equal((await call(`/blog/${blogId}`, 'PUT', 'pro', { ...body, description: 'Edited' })).status, 201);
    assert.equal((await call(`/blog/comment/${blogId}`, 'PUT', 'basic', { comment: 'Local test comment' })).status, 201);
    const comment = (await call(`/blog/${blogId}`)).data.comments[0];
    assert.equal((await call(`/blog/comment/${blogId}/${comment._id}`, 'DELETE', 'other')).status, 403);
    assert.equal((await call(`/blog/comment/${blogId}/${comment._id}`, 'DELETE', 'basic')).status, 200);
    assert.equal((await call(`/blog/${blogId}`, 'DELETE', 'other')).status, 401);
    assert.equal((await call(`/blog/${blogId}`, 'DELETE', 'admin')).status, 204);
    blogId = null;
    assert.equal((await call(`/user/disable/${ids.other}`, 'PUT', 'admin')).status, 204);
    assert.equal((await call('/blog', 'POST', 'other', body)).status, 403);
    console.log('Passed: blog creation, editing, ownership, comments, admin deletion and disabled-session enforcement.');
  } finally {
    if (blogId) await call(`/blog/${blogId}`, 'DELETE', 'admin');
    await User.updateOne({ _id: ids.other }, { $set: { isDisabled: false } });
    await mongoose.disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
