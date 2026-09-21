import { Request, Response } from "express";
import * as statsService from "../services/stats.service";
import { getErrorMessage } from "../utils/errors";

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
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};
