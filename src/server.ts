import dotenv from "dotenv";
import app from "./app";
import prisma from "./prisma-config";

dotenv.config();

const PORT = process.env.PORT || 3005;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("🟢 Prisma connected to MongoDB Atlas!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("🔴 Failed to connect to the database:", err);
    process.exit(1);
  }
}

startServer();
