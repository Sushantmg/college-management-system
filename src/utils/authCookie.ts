import type { CookieOptions } from "express";

const DAY_MS = 60 * 60 * 24 * 1000;
const DEFAULT_MAX_AGE = 7 * DAY_MS;

function getCookieMaxAge(): number {
  const days = /^(\d+)d$/.exec(process.env.JWT_EXPIRES_IN || "7d");
  return days ? parseInt(days[1], 10) * DAY_MS : DEFAULT_MAX_AGE;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

// The token travels in an httpOnly cookie so it is never reachable from JS.
// In production the API and frontend live on different origins, so the cookie
// must be SameSite=None and Secure; locally a same-site Lax cookie is enough.
export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/",
    maxAge: getCookieMaxAge(),
  };
}

export function clearAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/",
  };
}