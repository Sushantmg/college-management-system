import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RequestWithUser } from "../types/global-types";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      message: "Registration successful",
      ...result,
    });
  } catch (err: any) {
    if (err.message === "USER_EXISTS") {
      res.status(409).json({ error: "User already exists" });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    res.json({
      message: "Login successful",
      ...result,
    });
  } catch {
    res.status(401).json({ error: "Invalid credentials" });
  }
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
  } catch (err: any) {
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
  } catch (err: any) {
    if (err.message === "OLD_PASSWORD_WRONG") {
      res.status(400).json({ error: "Old password incorrect" });
      return;
    }
    if (err.message === "SAME_PASSWORD") {
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
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.updateUser(req.params.id, req.body);
    res.json({ message: "User updated successfully", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await AuthService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(400).json({ error: err.message });
  }
};
