import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
      JWT_SECRET: "test-secret",
      CORS_ORIGIN: "http://localhost:5173,http://localhost:4000",
      DATABASE_URL: "mongodb://127.0.0.1:27017/college-management-test",
    },
  },
});
