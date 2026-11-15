const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const Blog = require('../models/blogModel');
const root = 'http://127.0.0.1:5001/api';
async function call(path, token) { const res = await fetch(root + path, { headers: token ? { authorization: `Bearer ${token}` } : {} }); const text = await res.text(); let data; try { data = JSON.parse(text); } catch { data = text; } return { status: res.status, data }; }
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  const marker = `Catalog Test ${Date.now()}`;
  const user = await User.create({ name: `Author ${marker}`, email: `catalog-${Date.now()}@recipen.test`, password: 'unused', roles: ['ProUser'] });
  const token = jwt.sign({ UserInfo: { userId: String(user._id), tokenVersion: 0 } }, 'local-test-access-only');
  try {
    const rows = await Recipe.insertMany(Array.from({ length: 15 }, (_, i) => ({ title: `${marker} ${String(i).padStart(2, '0')}`, description: 'Synthetic', ingredients: ['cardamom'], cookingTime: String(i + 1), author: user._id })));
    await Recipe.updateOne({ _id: rows[0]._id }, { $set: { ratings: [{ user: user._id, rating: 3 }, { user: '660000000000000000000001', rating: 5 }] } });
    await Blog.create({ title: `${marker} story`, description: 'Synthetic', author: user._id });
    await User.updateOne({ _id: user._id }, { $set: { favorites: rows.slice(0, 3).map((item) => item._id) } });
    const search = encodeURIComponent(marker);
    const first = await call(`/recipe/catalog?page=1&limit=12&q=${search}`), second = await call(`/recipe/catalog?page=2&limit=12&q=${search}`);
    assert.equal(first.data.total, 15); assert.equal(first.data.items.length, 12); assert.equal(second.data.items.length, 3);
    assert.equal(new Set([...first.data.items, ...second.data.items].map((item) => item._id)).size, 15);
    assert.equal((await call(`/recipe/catalog?page=1&q=${encodeURIComponent(`Author ${marker}`)}`)).data.total, 15);
    assert.equal((await call('/recipe/catalog/mine?page=1&q=cardamom', token)).data.total, 15);
    assert.equal(first.data.items[0].comments, undefined);
    assert.equal(first.data.items[0].author.password, undefined);
    const compact = await call(`/recipe/catalog?page=1&q=${encodeURIComponent(`${marker} 00`)}&ratingSummary=true`);
    assert.equal(compact.data.items[0].ratingCount, 2); assert.equal(compact.data.items[0].ratingAverage, 4); assert.equal(compact.data.items[0].ratings, undefined);
    const legacy = await call(`/recipe/catalog?page=1&q=${encodeURIComponent(`${marker} 00`)}`);
    assert.equal(legacy.data.items[0].ratings.length, 2);
    assert.equal((await call('/recipe/catalog/mine?page=1', token)).data.total, 15);
    assert.equal((await call('/recipe/catalog/saved?page=1', token)).data.total, 3);
    assert.equal((await call('/blog/catalog/mine?page=1', token)).data.total, 1);
    assert.equal((await call(`/recipe/catalog?page=1&q=${search}&maxTime=5`)).data.total, 5);
    const sorted = await call(`/recipe/catalog?page=1&q=${search}&sort=time`);
    assert.deepEqual(sorted.data.items.slice(0, 3).map((item) => item.cookingTime), ['1', '2', '3']);
    assert.equal((await call('/recipe/catalog/saved?page=1')).status, 401);
    assert.equal((await call('/recipe/catalog?q=%5B')).data.total, 0);
    console.log('Passed: paginated public, saved and author catalogs; search, filtering, sorting and access control.');
  } finally { await Recipe.deleteMany({ author: user._id }); await Blog.deleteMany({ author: user._id }); await User.deleteOne({ _id: user._id }); await mongoose.disconnect(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
