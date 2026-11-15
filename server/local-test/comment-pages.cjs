// Only the synthetic database and local API are used.
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const Blog = require('../models/blogModel');
const base = 'http://127.0.0.1:5001/api';

async function get(path) {
  const response = await fetch(base + path);
  const text = await response.text();
  return { status: response.status, data: text ? JSON.parse(text) : null };
}

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  const user = await User.create({ name: 'Comment page tester', email: `comment-pages-${Date.now()}@recipen.test`, password: 'unused' });
  const comments = Array.from({ length: 23 }, (_, index) => ({ user: user._id, comment: `Synthetic comment ${index + 1}` }));
  let recipe, blog;
  try {
    recipe = await Recipe.create({ title: 'Synthetic comment recipe', author: user._id, comments });
    blog = await Blog.create({ title: 'Synthetic comment story', author: user._id, comments });
    for (const [kind, item] of [['recipe', recipe], ['blog', blog]]) {
      const first = await get(`/${kind}/${item._id}/comments?page=1&limit=10`);
      const third = await get(`/${kind}/${item._id}/comments?page=3&limit=10`);
      assert.equal(first.status, 200); assert.equal(first.data.total, 23); assert.equal(first.data.items.length, 10);
      assert.equal(first.data.items[0].user.name, user.name);
      assert.equal(third.data.items.length, 3); assert.equal(third.data.items[0].comment, 'Synthetic comment 21');
      assert.equal((await get(`/${kind}/${item._id}/comments?page=4&limit=10`)).data.items.length, 0);
      assert.equal((await get(`/${kind}/${item._id}?includeComments=false`)).data.comments, undefined);
      assert.equal((await get(`/${kind}/${item._id}`)).data.comments.length, 23);
      assert.equal((await get(`/${kind}/invalid`)).status, 404);
      assert.equal((await get(`/${kind}/660000000000000000000999`)).status, 404);
      assert.equal((await get(`/${kind}/invalid/comments`)).status, 400);
      assert.equal((await get(`/${kind}/660000000000000000000999/comments`)).status, 404);
    }
    console.log('Passed: recipe and story comment pages, user fields, empty/error handling and legacy detail responses.');
  } finally {
    if (recipe) await Recipe.deleteOne({ _id: recipe._id });
    if (blog) await Blog.deleteOne({ _id: blog._id });
    await User.deleteOne({ _id: user._id });
    await mongoose.disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
