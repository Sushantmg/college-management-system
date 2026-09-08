import { Request, Response } from "express";
import * as statsService from "../services/stats.service";

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [overall, byDepartment, recentEnrollments] = await Promise.all([
      statsService.getOverallStats(),
      statsService.getDepartmentBreakdown(),
      statsService.getRecentEnrollments(10),
    ]);

    res.json({
      ...overall,
      byDepartment,
      recentEnrollments,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
