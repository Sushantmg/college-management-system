import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3005;

async function startServer() {
  const url = process.env.DATABASE_URL;

  // If using Atlas or no local MongoDB, spin up in-memory MongoDB
  if (!url || url.startsWith("mongodb+srv")) {
    console.log("🔄 Starting in-memory MongoDB...");
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri("college-management");
    process.env.DATABASE_URL = uri;
    console.log("🟢 In-memory MongoDB ready:", uri);
  }

  // Import app lazily so prisma-config.ts picks up the correct DATABASE_URL
  const { default: app } = await import("./app");
  const { default: prisma } = await import("./prisma-config");

  try {
    await prisma.$connect();
    console.log("🟢 Prisma connected to MongoDB!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("🔴 Failed to connect to the database:", err);
    process.exit(1);
  }
}

startServer();
