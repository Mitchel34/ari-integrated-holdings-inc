import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

interface ExecutiveSeed {
  name: string;
  email: string;
  password: string;
}

const EXECUTIVES: ExecutiveSeed[] = [
  {
    name: "Mitchel Carson",
    email: "Mitchel.carson@gmail.com",
    password: "default123",
  },
  {
    name: "Judy Carson",
    email: "Judy.carson@ecalwest.com",
    password: "default123",
  },
  {
    name: "Curtis Carson",
    email: "Curtis.carson@ecalwest.com",
    password: "default123",
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  for (const exec of EXECUTIVES) {
    const hashedPassword = await bcrypt.hash(exec.password, 12);

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

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
