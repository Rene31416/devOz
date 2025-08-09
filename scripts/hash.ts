import argon2 from "argon2";

async function main() {
  const plainPassword = process.argv[2];

  if (!plainPassword) {
    console.error("❌ Please provide a password to hash");
    console.error("Example: ts-node hash-password.ts MySecret123!");
    process.exit(1);
  }

  try {
    const hash = await argon2.hash(plainPassword, {
      type: argon2.argon2id,
    });
    console.log("✅ Password hash generated:");
    console.log(hash);
  } catch (err) {
    console.error("❌ Error hashing password:", err);
    process.exit(1);
  }
}

main();


//npx ts-node hash-password.ts MySuperSecurePassword!
