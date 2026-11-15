// Synthetic fixtures only. This script refuses every database except the local test database.
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const Blog = require('../models/blogModel');
const uri = 'mongodb://127.0.0.1:27028/recipen_synthetic_test';

async function main() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
  const password = await bcrypt.hash('RecipenTest123!', 10);
  const users = [
    ['660000000000000000000001', 'Basic Tester', 'basic@recipen.test', ['BasicUser']],
    ['660000000000000000000002', 'Pro Tester', 'pro@recipen.test', ['ProUser']],
    ['660000000000000000000003', 'Admin Tester', 'admin@recipen.test', ['Admin']],
    ['660000000000000000000004', 'Other Pro Tester', 'other@recipen.test', ['ProUser']],
    ['660000000000000000000005', 'Disabled Tester', 'disabled@recipen.test', ['BasicUser']],
  ];
  for (const [_id, name, email, roles] of users) {
    await User.updateOne({ _id }, { $setOnInsert: { name, email, password, roles, isDisabled: email.startsWith('disabled@') } }, { upsert: true });
  }
  const author = users[1][0];
  await Recipe.updateOne({ _id: '660000000000000000000101' }, { $setOnInsert: {
    title: 'Test tomato pasta', author, description: 'A synthetic recipe for local testing.',
    image: 'https://placehold.co/600x400/png', calories: '350', cookingTime: '25',
    ingredients: ['200 g pasta', '2 tomatoes'], instructions: ['Cook the pasta.', 'Add the tomatoes.'],
  } }, { upsert: true });
  await Blog.updateOne({ _id: '660000000000000000000201' }, { $setOnInsert: {
    title: 'Test cooking story', author, description: 'Synthetic blog content for local testing.', image: 'https://placehold.co/600x400/png',
  } }, { upsert: true });
  // Extra examples exercise card grids and varied text lengths without touching existing data.
  const recipes = [
    ['102', 'Lemon and herb rice', 'A bright, simple bowl for a quick lunch.', 20],
    ['103', 'Roasted vegetable and chickpea bowls', 'Warm vegetables, chickpeas and a tangy dressing make a filling meal.', 45],
    ['104', 'Ginger noodle soup', 'A comforting broth with noodles and vegetables.', 30],
    ['105', 'Apple cinnamon oats', 'A warming breakfast with fruit and cinnamon.', 15],
    ['106', 'Crispy potato and green bean salad', 'A hearty salad with a mustard dressing and plenty of fresh herbs.', 50],
  ];
  for (const [suffix, title, description, cookingTime] of recipes) {
    await Recipe.updateOne({ _id: `660000000000000000000${suffix}` }, { $setOnInsert: {
      title, author, description, image: 'https://placehold.co/600x400/png', calories: '350', cookingTime: String(cookingTime),
      ingredients: ['1 cup prepared ingredients', 'Seasoning to taste'], instructions: ['Prepare the ingredients.', 'Cook and serve.'],
    } }, { upsert: true });
  }
  const stories = [
    ['202', 'A calmer way to plan weekday meals', 'A few simple ideas for making everyday cooking feel easier.'],
    ['203', 'What I learned from cooking with herbs', 'A synthetic story about adding freshness and flavor to a meal.'],
    ['204', 'Cooking together on a rainy afternoon', 'A short kitchen story for checking the local story layout.'],
  ];
  for (const [suffix, title, description] of stories) {
    await Blog.updateOne({ _id: `660000000000000000000${suffix}` }, { $setOnInsert: {
      title, author, description, image: 'https://placehold.co/600x400/png',
    } }, { upsert: true });
  }
  console.log('Synthetic test fixtures are ready. Existing fixtures were not reset.');
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
