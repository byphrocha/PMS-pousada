// src/services/ReportService.ts
import db from '../models';
import { Op } from 'sequelize';

export default {
  /**
   * Relatório financeiro simples: soma de pagamentos no intervalo
   */
  async financial(from: string, to: string) {
    const totalRevenue = await db.Payment.sum('amount', {
      where: {
        createdAt: {
          [Op.between]: [from, to]
        }
      }
    });

    return {
      from,
      to,
      totalRevenue
    };
  }
};