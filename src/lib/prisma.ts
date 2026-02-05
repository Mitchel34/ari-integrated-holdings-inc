import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  // During build time or if DATABASE_URL is not set, return a mock client
  // This allows the build to complete without a database connection
  if (!connectionString) {
    console.warn("DATABASE_URL not set - database operations will fail");
    return new Proxy({} as PrismaClient, {
      get: (_target, prop) => {
        if (prop === "then" || prop === "catch") return undefined;
        return new Proxy(() => {}, {
          get: () => () => Promise.reject(new Error("Database not configured")),
          apply: () => Promise.reject(new Error("Database not configured")),
        });
      },
    });
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
