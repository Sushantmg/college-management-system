import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import app from "./app";

const API = request(app);
const ALLOWED_ORIGIN = "http://localhost:5173";

describe("health & root", () => {
  it("GET / reports API status and version", async () => {
    const res = await API.get("/");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.message).toBe("College Management System API");
    expect(res.body.version).toBe("2.0.0");
    expect(res.body.timestamp).toEqual(expect.any(String));
  });

  it("GET /health reports the service is healthy", async () => {
    const res = await API.get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
    expect(res.body.uptime).toEqual(expect.any(Number));
  });
});

describe("error handling", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await API.get("/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Route not found" });
  });

  it("returns 400 for malformed JSON bodies", async () => {
    const res = await API.post("/auth/login")
      .set("Content-Type", "application/json")
      .send('{"email": "invalid"');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid request body" });
  });

  it("returns 400 with details when validation fails", async () => {
    const res = await API.post("/auth/register")
      .send({ email: "not-an-email", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(Array.isArray(res.body.details)).toBe(true);
  });
});

describe("security headers & CORS", () => {
  it("sets helmet security headers", async () => {
    const res = await API.get("/health");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-dns-prefetch-control"]).toBeDefined();
  });

  it("does not cache API responses", async () => {
    const res = await API.get("/auth/me");

    expect(res.headers["cache-control"]).toBe("no-store");
  });

  it("allows requests from a configured origin", async () => {
    const res = await API.get("/health").set("Origin", ALLOWED_ORIGIN);

    expect(res.headers["access-control-allow-origin"]).toBe(ALLOWED_ORIGIN);
  });

  it("does not allow requests from an unknown origin", async () => {
    const res = await API.get("/health").set("Origin", "http://evil.example.com");

    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("authentication middleware", () => {
  it("rejects protected routes without a token", async () => {
    const res = await API.get("/auth/me");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  it("rejects a malformed bearer token", async () => {
    const res = await API.get("/auth/me").set("Authorization", "Bearer not-a-jwt");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid token" });
  });

  it("rejects a token signed with the wrong secret", async () => {
    const token = jwt.sign({ userId: "abc", role: "ADMIN" }, "wrong-secret");
    const res = await API.get("/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid token" });
  });

  it("rejects a token with an unknown role", async () => {
    const token = jwt.sign({ userId: "abc", role: "HACKER" }, process.env.JWT_SECRET as string);
    const res = await API.get("/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid token" });
  });

  it("returns 403 when the role is not permitted", async () => {
    const token = jwt.sign({ userId: "abc", role: "STUDENT" }, process.env.JWT_SECRET as string);
    const res = await API.get("/auth/users").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Forbidden" });
  });
});
