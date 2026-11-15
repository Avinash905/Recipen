// Read-only audit of the fixed local synthetic database.
const mongoose = require('mongoose');
const User = require('../models/userModel');
const { normalizeEmail, validEmail } = require('../utils/accountValidation');
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27028/recipen_synthetic_test', { autoIndex: false });
  const users = await User.find({}, { email: 1 }).lean();
  const seen = new Map(); let invalid = 0, needsNormalization = 0;
  for (const user of users) {
    const email = normalizeEmail(user.email);
    if (!validEmail(email)) invalid++;
    if (email !== user.email) needsNormalization++;
    seen.set(email, (seen.get(email) || 0) + 1);
  }
  const duplicateGroups = [...seen.values()].filter(n => n > 1).length;
  console.log(`Audited ${users.length} local accounts: ${invalid} invalid emails, ${needsNormalization} need normalization, ${duplicateGroups} duplicate groups.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
