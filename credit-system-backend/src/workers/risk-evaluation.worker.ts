import { Worker, Queue } from 'bullmq';
import { PrismaCreditRequestRepository } from '../infrastructure/prisma/repositories/prisma-credit-request.repository';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { CreditRequestStatus } from '../domain/entities/enums/credit-request-status.enum';
import { PrismaUserRepository } from 'src/infrastructure/prisma/repositories/prisma-user.repository';
import { BadRequestException } from '@nestjs/common';
import { BankProviderFactory } from 'src/domain/strategies/bank-provider.factory';
import { logger } from '../shared/logger/pino.logger';

logger.info('Risk worker started');

export const riskQueue = new Queue('risk-evaluation', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
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
        console.log('Credit request not found:', creditRequestId);
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
      switch (newStatus) {
        case CreditRequestStatus.APPROVED:
          creditRequest.approve();
          break;
        case CreditRequestStatus.REJECTED:
          creditRequest.reject();
          break;
        case CreditRequestStatus.UNDER_REVIEW:
          creditRequest.submitForReview();
          break;
      }

      //obtener user admin
      const user = await userRepo.findByEmail('admin@test.com');
      if (!user)
        throw new BadRequestException(
          'No tiene configurado el usuario administrador del sistema',
        );

      await creditRequestRepo.addStatusHistory({
        creditRequestId: creditRequest.id,
        previousStatus,
        newStatus: creditRequest.status,
        changedById: user.id,
      });

      await creditRequestRepo.addEvaluation({
        creditRequestId: creditRequest.id,
        score,
        riskLevel,
        decision: creditRequest.status,
      });

      console.log(
        `CreditRequest ${creditRequest.id} evaluated. Score: ${score}, Risk: ${riskLevel}, New Status: ${creditRequest.status}`,
      );
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
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
);
