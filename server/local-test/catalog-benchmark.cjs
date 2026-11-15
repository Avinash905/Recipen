// Small, reproducible local benchmark. Never points at a non-synthetic database.
const mongoose = require('mongoose');
const { performance } = require('node:perf_hooks');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const root = 'http://127.0.0.1:5001/api/recipe/catalog';
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test');
  const marker = `Local performance ${Date.now()}`;
  const user = await User.create({ name: marker, email: `benchmark-${Date.now()}@recipen.test`, password: 'unused' });
  try {
    await Recipe.insertMany(Array.from({ length: 1200 }, (_, i) => ({ title: `${marker} ${i}`, description: 'Synthetic recipe for a local performance benchmark.', author: user._id, ingredients: ['tomato', 'flour'], cookingTime: String((i % 90) + 1) })));
    for (const [label, query] of [['first page', '?page=1&limit=12'], ['title search', `?page=1&limit=12&q=${encodeURIComponent(marker)}`]]) {
      const timings = [];
      for (let i = 0; i < 8; i++) {
        const start = performance.now();
        const response = await fetch(root + query);
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        if (data.items.length !== 12) throw new Error(`Unexpected item count: ${data.items.length}`);
        if (i) timings.push(performance.now() - start);
      }
      timings.sort((a, b) => a - b);
      console.log(`${label}: ${timings[3].toFixed(1)} ms median; ${timings[6].toFixed(1)} ms slowest of 7 warm requests`);
    }
    const concurrentTimings = [];
    await Promise.all(Array.from({ length: 10 }, async () => {
      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        const response = await fetch(root + '?page=1&limit=12');
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        if (data.items.length !== 12) throw new Error(`Unexpected item count: ${data.items.length}`);
        concurrentTimings.push(performance.now() - start);
      }
    }));
    concurrentTimings.sort((a, b) => a - b);
    console.log(`first page, 10 concurrent clients: ${concurrentTimings[49].toFixed(1)} ms median; ${concurrentTimings[94].toFixed(1)} ms 95th percentile over 100 local requests`);
  } finally { await Recipe.deleteMany({ author: user._id }); await User.deleteOne({ _id: user._id }); await mongoose.disconnect(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
