import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';      // ajuste o caminho se necessário

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err);

  const status = err.status || 500;
  const message =
    status === 500 ? 'Erro interno no servidor' : err.message;

  res.status(status).json({ error: message });
}