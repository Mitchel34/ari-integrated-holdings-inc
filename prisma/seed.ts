import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const hashedPassword = await bcrypt.hash("MountaineerMC25!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "mitchel.carson@gmail.com" },
    update: {},
    create: {
      name: "Mitchel Carson",
      email: "mitchel.carson@gmail.com",
      password: hashedPassword,
      role: "EXECUTIVE",
    },
  });

  console.log("Created admin user:", admin);

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
