// Exercises only the local test API; creates and removes a synthetic recipe.
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:5001/api';
async function request(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(base + path, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const text = await response.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: response.status, data };
}
async function main() {
  const logins = {};
  for (const name of ['basic', 'pro', 'other', 'admin', 'disabled']) {
    const result = await request('/auth/login', { method: 'POST', body: { email: `${name}@recipen.test`, password: 'RecipenTest123!' } });
    assert.equal(result.status, name === 'disabled' ? 403 : 200, `${name} login`);
    logins[name] = result.data.accessToken;
  }
  const blogs = await request('/blog');
  assert.equal(blogs.status, 200);
  assert.deepEqual(Object.keys(blogs.data[0].author).sort(), ['_id', 'name']);
  assert.equal((await request('/user', { token: logins.basic })).status, 401);
  assert.equal((await request('/user', { token: logins.admin })).status, 200);
  const title = `Synthetic smoke test ${Date.now()}`;
  const payload = { title, image: 'https://placehold.co/600x400/png', description: 'Local test', calories: '100', cookingTime: '10', ingredients: ['tomato'], instructions: ['Cook.'] };
  assert.equal((await request('/recipe', { method: 'POST', token: logins.basic, body: payload })).status, 401);
  assert.equal((await request('/recipe', { method: 'POST', token: logins.pro, body: payload })).status, 201);
  const list = await request('/recipe');
  const recipe = list.data.find((item) => item.title === title);
  assert.ok(recipe, 'new recipe appears in catalog');
  try {
    assert.equal((await request(`/recipe/${recipe._id}`, { method: 'PUT', token: logins.other, body: payload })).status, 401);
    assert.equal((await request(`/recipe/${recipe._id}`, { method: 'PUT', token: logins.pro, body: { ...payload, description: 'Updated' } })).status, 201);
    assert.equal((await request(`/recipe/rate/${recipe._id}`, { method: 'PUT', token: logins.basic, body: { rating: 6 } })).status, 400);
    assert.equal((await request(`/recipe/rate/${recipe._id}`, { method: 'PUT', token: logins.basic, body: { rating: 4.5 } })).status, 201);
    assert.equal((await request(`/recipe/rate/${recipe._id}`, { method: 'PUT', token: logins.basic, body: { rating: 4 } })).status, 201);
    const rated = await request(`/recipe/${recipe._id}`);
    assert.equal(rated.data.ratings.length, 1);
    assert.equal(rated.data.ratings[0].rating, 4);
    assert.equal((await request(`/recipe/${recipe._id}`, { method: 'DELETE', token: logins.other })).status, 401);
  } finally {
    const cleanup = await request(`/recipe/${recipe._id}`, { method: 'DELETE', token: logins.pro });
    assert.equal(cleanup.status, 204, 'remove synthetic recipe');
  }
  assert.equal((await request(`/recipe/${recipe._id}`)).status, 404);
  console.log('Passed: synthetic sign-ins, disabled access, author projection, admin access, recipe permissions, edit, ratings and deletion.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
