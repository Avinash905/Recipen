// Uses only the dedicated local synthetic database and server.
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const Blog = require('../models/blogModel');
const root = 'http://127.0.0.1:5001/api';
async function request(path, method, token, body) {
  const response = await fetch(root + path, { method, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body || {}) });
  const text = await response.text();
  return { status: response.status, data: text ? JSON.parse(text) : null };
}
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  const user = await User.create({ name: 'Synthetic Saved Tester', email: `saved-${Date.now()}@recipen.test`, password: 'unused', roles: ['ProUser'] });
  const token = jwt.sign({ UserInfo: { userId: String(user._id), tokenVersion: 0 } }, 'local-test-access-only');
  let recipe, blog;
  try {
    recipe = await Recipe.create({ title: 'Synthetic save test', author: user._id });
    blog = await Blog.create({ title: 'Synthetic comment test', author: user._id });
    const recipeInput = { title: ' ', image: 'https://example.test/picture.jpg', description: 'Synthetic', calories: '100', cookingTime: '10', ingredients: ['flour'], instructions: ['mix'] };
    assert.equal((await request('/recipe', 'POST', token, recipeInput)).status, 422);
    assert.equal((await request('/recipe', 'POST', token, { ...recipeInput, title: 'Valid title', ingredients: ['  '] })).status, 422);
    assert.equal((await request('/blog', 'POST', token, { title: ' ', image: 'https://example.test/picture.jpg', description: 'Synthetic' })).status, 422);
    assert.equal((await request('/blog', 'POST', token, { title: 'Valid title', image: 'https://example.test/picture.jpg', description: 'x'.repeat(50001) })).status, 422);
    const selected = await User.findById(user._id);
    assert.equal(selected.password, undefined);
    assert.equal(selected.refreshToken, undefined);
    const ratings = await Promise.all([request(`/recipe/rate/${recipe._id}`, 'PUT', token, { rating: 3 }), request(`/recipe/rate/${recipe._id}`, 'PUT', token, { rating: 4 })]);
    assert.deepEqual(ratings.map((result) => result.status), [201, 201]);
    assert.equal((await Recipe.findById(recipe._id)).ratings.length, 1);
    const favorite = `/recipe/favorite/${recipe._id}`;
    const firstSave = await request(favorite, 'PUT', token, { saved: true });
    const secondSave = await request(favorite, 'PUT', token, { saved: true });
    assert.equal(firstSave.status, 201); assert.equal(secondSave.status, 201);
    assert.ok(secondSave.data.user.accountDataRevision > firstSave.data.user.accountDataRevision);
    assert.equal(jwt.decode(firstSave.data.accessToken).UserInfo.favorites, undefined);
    assert.equal((await User.findById(user._id)).favorites.length, 1);
    assert.equal((await request(favorite, 'PUT', token, { saved: false })).status, 201);
    assert.equal((await request(favorite, 'PUT', token, { saved: false })).status, 201);
    assert.equal((await User.findById(user._id)).favorites.length, 0);
    assert.equal((await request(favorite, 'PUT', token, { saved: true })).status, 201);
    for (const path of [`/recipe/comment/${recipe._id}`, `/blog/comment/${blog._id}`]) {
      assert.equal((await request(path, 'PUT', token, { comment: '  ' })).status, 400);
      assert.equal((await request(path, 'PUT', token, { comment: 'a'.repeat(2001) })).status, 400);
      assert.equal((await request(path, 'PUT', token, { comment: '  Synthetic comment  ' })).status, 201);
    }
    assert.equal((await Recipe.findById(recipe._id)).comments[0].comment, 'Synthetic comment');
    assert.equal((await Blog.findById(blog._id)).comments[0].comment, 'Synthetic comment');
    assert.equal((await request(`/recipe/${recipe._id}`, 'DELETE', token)).status, 204);
    assert.equal((await User.findById(user._id)).favorites.length, 0);
    assert.equal((await request(favorite, 'PUT', token, { saved: true })).status, 404);
    console.log('Passed: idempotent saves, concurrent ratings, cleanup, validation and default credential projection.');
  } finally {
    if (recipe) await Recipe.deleteOne({ _id: recipe._id });
    if (blog) await Blog.deleteOne({ _id: blog._id });
    await User.deleteOne({ _id: user._id });
    await mongoose.disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
