#!/usr/bin/env tsx
import * as bcrypt from 'bcrypt';

const password = process.argv[2];

if (!password) {
  console.error('❌ Please provide a password to hash.');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('\n✅ Hashed password:');
  console.log(hash);
});


// npx tsx scripts/hash.ts yourPassword