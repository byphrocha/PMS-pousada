import { Router, Request, Response } from 'express';
import ChannelSyncService from '../services/ChannelSyncService';

const router = Router();

/**
 * GET /channel/sync
 * Dispara importação manual de iCal
 */
router.get('/sync', async (_req: Request, res: Response) => {
  try {
    await ChannelSyncService.importAll();
    return res.json({ message: 'Sincronização iniciada' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

export default router;