import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DATABASE_URL;
console.log("PRISMA INIT WITH URL:", dbUrl);
const prisma = new PrismaClient({
  datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
});
export default prisma;
