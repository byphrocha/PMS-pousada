import { Router, Request, Response } from 'express';
import ReportService from '../services/ReportService';

const router = Router();

/** GET /reports/financial?from=2025-01-01&to=2025-01-31 */
router.get('/financial', async (req: Request, res: Response) => {
  const { from, to } = req.query as { from: string; to: string };
  const report = await ReportService.financial(from, to);
  return res.json(report);
});

export default router;