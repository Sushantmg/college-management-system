import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config();

const PORT = process.env.PORT || 3005;

async function startServer() {
  const url = process.env.DATABASE_URL;

  if (!url || url.startsWith("mongodb+srv")) {
    console.log("Starting in-memory MongoDB replica set...");
    const { MongoMemoryReplSet } = await import("mongodb-memory-server");
    const replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, dbName: "college-management" },
    });
    const uri = replSet.getUri("college-management");
    process.env.DATABASE_URL = uri;
    console.log("In-memory MongoDB ready:", uri);
  }

  const { default: app } = await import("./app");
  const { default: prisma } = await import("./prisma-config");

  try {
    await prisma.$connect();
    console.log("Prisma connected to MongoDB!");

    console.log("Pushing database schema...");
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: "inherit",
    });
    console.log("Schema pushed successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
    process.exit(1);
  }
}

startServer();
