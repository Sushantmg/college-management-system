import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RequestWithUser } from "../types/global-types";
import { getErrorMessage } from "../utils/errors";
import { authCookieOptions, clearAuthCookieOptions } from "../utils/authCookie";

const TOKEN_COOKIE = "token";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.register(req.body);
    res.cookie(TOKEN_COOKIE, result.token, authCookieOptions());
    res.status(201).json({
      message: "Registration successful",
      user: result.user,
    });
  } catch (err) {
    if (getErrorMessage(err) === "USER_EXISTS") {
      res.status(409).json({ error: "User already exists" });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    res.cookie(TOKEN_COOKIE, result.token, authCookieOptions());
    res.json({
      message: "Login successful",
      user: result.user,
    });
  } catch {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie(TOKEN_COOKIE, clearAuthCookieOptions());
  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as RequestWithUser).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await AuthService.getMe(userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = (req as RequestWithUser).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { oldPassword, newPassword } = req.body;

  try {
    await AuthService.changePassword(userId, oldPassword, newPassword);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    const msg = getErrorMessage(err);
    if (msg === "OLD_PASSWORD_WRONG") {
      res.status(400).json({ error: "Old password incorrect" });
      return;
    }
    if (msg === "SAME_PASSWORD") {
      res.status(400).json({ error: "New password must be different" });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const result = await AuthService.listUsers(page, limit, search);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.updateUser(req.params.id, req.body);
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await AuthService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    const msg = getErrorMessage(err);
    if (msg === "USER_NOT_FOUND") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(400).json({ error: msg });
  }
};
