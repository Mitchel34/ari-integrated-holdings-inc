import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

/**
 * Seeds executive accounts from environment variables so no credentials live
 * in the repository.
 *
 *   SEED_EXECUTIVES="Mitchel Carson <mitchelcarson@ariintegratedholdings.com>, Jane Doe <jane@example.com>"
 *   SEED_PASSWORD="…"   (optional; a random password is generated and printed once when unset)
 *
 * Existing users are left untouched. Refuses to run against production.
 */

interface ExecutiveSeed {
  name: string;
  email: string;
}

function parseExecutives(raw: string | undefined): ExecutiveSeed[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.*?)\s*<([^>]+)>$/);
      if (match) {
        return { name: match[1].trim(), email: match[2].trim().toLowerCase() };
      }
      return { name: entry.split("@")[0], email: entry.toLowerCase() };
    });
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed a production database. Create executive accounts manually.");
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not set");
  }

  const executives = parseExecutives(process.env.SEED_EXECUTIVES);
  if (executives.length === 0) {
    console.log("SEED_EXECUTIVES is empty; nothing to seed.");
    return;
  }

  const password = process.env.SEED_PASSWORD || randomBytes(12).toString("base64url");
  const hashedPassword = await bcrypt.hash(password, 12);

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  for (const exec of executives) {
    const user = await prisma.user.upsert({
      where: { email: exec.email },
      update: {},
      create: {
        name: exec.name,
        email: exec.email,
        password: hashedPassword,
        role: "EXECUTIVE",
      },
    });
    console.log(`Seeded executive: ${user.name} (${user.email})`);
  }

  if (!process.env.SEED_PASSWORD) {
    console.log(`Generated seed password (shown once): ${password}`);
  }

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
