import { Worker, Queue } from 'bullmq';
import { PrismaCreditRequestRepository } from '../infrastructure/prisma/repositories/prisma-credit-request.repository';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { CreditRequestStatus } from '../domain/entities/enums/credit-request-status.enum';
import { PrismaUserRepository } from 'src/infrastructure/prisma/repositories/prisma-user.repository';
import { BadRequestException } from '@nestjs/common';
import { BankProviderFactory } from 'src/domain/strategies/bank-provider.factory';
import { logger } from '../shared/logger/pino.logger';
import axios from 'axios';

logger.info('Risk worker started');

export const riskQueue = new Queue('risk-evaluation', {
  connection: { url: process.env.REDIS_URL || 'redis://redis:6379' },
});

const prismaService = new PrismaService();
const creditRequestRepo = new PrismaCreditRequestRepository(prismaService);
const userRepo = new PrismaUserRepository(prismaService);

new Worker(
  'risk-evaluation',
  async (job) => {
    try {
      const { creditRequestId, codeCountry } = job.data;
      const creditRequest = await creditRequestRepo.findById(creditRequestId);

      if (!creditRequest) {
        logger.error('Credit request not found:', creditRequestId);
        return;
      }
      logger.info(`Credit request with: ${JSON.stringify(job.data)}`);

      const provider = BankProviderFactory.create(codeCountry);

      const bankInfo = await provider.getBankInformation(
        creditRequest.document,
      );

      const score = bankInfo.score;
      const riskLevel =
        score > 600 && bankInfo.debt < 5000
          ? 'LOW'
          : score > 500
            ? 'MEDIUM'
            : 'HIGH';

      let newStatus: CreditRequestStatus;
      if (riskLevel === 'LOW') newStatus = CreditRequestStatus.APPROVED;
      else if (riskLevel === 'MEDIUM')
        newStatus = CreditRequestStatus.UNDER_REVIEW;
      else newStatus = CreditRequestStatus.REJECTED;

      const previousStatus = creditRequest.status;
      logger.info({ status: creditRequest.status }, 'Current DB status');

      //webhook simulado
      await axios.post('http://localhost:3000/webhooks/bank-result', {
        creditRequestId,
        score,
        riskLevel,
        decision: newStatus,
      });

      logger.info(
        {
          creditRequestId,
          score,
          riskLevel,
          newStatus: creditRequest.status,
        },
        'Risk evaluation completed',
      );
    } catch (err) {
      logger.error({ err }, 'Worker job failed');
    }
  },
  {
    connection: { url: process.env.REDIS_URL || 'redis://redis:6379' },
  },
);
