import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config();

const PORT = process.env.PORT || 3005;
const isProduction = process.env.NODE_ENV === "production";

async function ensureDatabase() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.log("No DATABASE_URL set. Starting in-memory MongoDB replica set...");
    const { MongoMemoryReplSet } = await import("mongodb-memory-server");
    const replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, dbName: "college-management" },
    });
    const uri = replSet.getUri("college-management");
    process.env.DATABASE_URL = uri;
    console.log("In-memory MongoDB ready:", uri);
  }

  if (!isProduction) {
    // Push schema at startup only outside production.
    // In production, the schema is pushed as part of the deploy.
    console.log("Pushing database schema...");
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: "inherit",
    });
    console.log("Schema pushed successfully!");
  }
}

async function connectPrisma(prisma: any) {
  while (true) {
    try {
      await prisma.$connect();
      console.log("Prisma connected to MongoDB!");
      return;
    } catch (err: any) {
      console.error("Prisma connection failed, retrying in 15s:", err?.message);
      await new Promise((resolve) => setTimeout(resolve, 15000));
    }
  }
}

async function startServer() {
  await ensureDatabase();

  const { default: app } = await import("./app");
  const { default: prisma } = await import("./prisma-config");

  // Listen immediately so the API (incl. /health) is always up,
  // even while the database connection is being (re)established.
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });

  connectPrisma(prisma);
}

startServer();