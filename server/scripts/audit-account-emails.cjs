// Read-only pre-deployment audit. Set MONGODB_URI in the environment.
const mongoose = require('mongoose');
const { normalizeEmail, validEmail } = require('../utils/accountValidation');
async function main() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI before running the audit.');
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: false });
  const users = await mongoose.connection.collection('users').find({}, { projection: { email: 1 } }).toArray();
  const counts = new Map(); let invalid = 0, nonCanonical = 0;
  for (const user of users) {
    const normalized = normalizeEmail(user.email);
    if (!validEmail(normalized)) invalid++;
    if (normalized !== user.email) nonCanonical++;
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }
  const duplicates = [...counts.values()].filter(count => count > 1).length;
  console.log(`Accounts checked: ${users.length}. Invalid emails: ${invalid}. Non-normalized emails: ${nonCanonical}. Duplicate groups after normalization: ${duplicates}.`);
  if (invalid || nonCanonical || duplicates) process.exitCode = 2;
}
main().catch(error => { console.error('Email audit failed:', error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
