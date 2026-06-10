import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

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
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await AuthService.getMe(userId);
  res.json(user);
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
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
