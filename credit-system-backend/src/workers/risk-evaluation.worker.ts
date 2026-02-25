import { Worker, Queue } from 'bullmq';
import { PrismaCreditRequestRepository } from '../infrastructure/prisma/repositories/prisma-credit-request.repository';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { CreditRequestStatus } from '../domain/entities/enums/credit-request-status.enum';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { PrismaUserRepository } from 'src/infrastructure/prisma/repositories/prisma-user.repository';
import { BadRequestException } from '@nestjs/common';

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
      const { creditRequestId } = job.data;
      const creditRequest = await creditRequestRepo.findById(creditRequestId);

      if (!creditRequest) {
        console.log('Credit request not found:', creditRequestId);
        return;
      }

      const score = Math.floor(Math.random() * 400) + 400; // 400-800
      const riskLevel = score > 600 ? 'LOW' : score > 500 ? 'MEDIUM' : 'HIGH';

      let newStatus: CreditRequestStatus;
      if (riskLevel === 'LOW') newStatus = CreditRequestStatus.APPROVED;
      else if (riskLevel === 'MEDIUM')
        newStatus = CreditRequestStatus.UNDER_REVIEW;
      else newStatus = CreditRequestStatus.REJECTED;

      const previousStatus = creditRequest.status;
      console.log('DB status:', creditRequest.status);
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
    } catch (err) {
      console.error('Worker job failed:', err);
    }
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
);
