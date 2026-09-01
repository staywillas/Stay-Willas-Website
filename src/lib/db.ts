import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Prevent duplicate connections in development hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables!");
  }

  // Create the PostgreSQL pool adapter for Prisma 7's new driver system
  const pool = new Pool({
    connectionString,
    max: 1, // Single connection per worker ensures total parallel workers stay under Supabase's 15 session limit
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true
  });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter });
};

// Initialize Prisma client lazily only when first queried
const getPrisma = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
};

// Export a JS Proxy that forwards all operations to the lazily-loaded client.
// This prevents Next.js compile-time dynamic imports from crashing the build.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma();
    return Reflect.get(client, prop, receiver);
  }
});
