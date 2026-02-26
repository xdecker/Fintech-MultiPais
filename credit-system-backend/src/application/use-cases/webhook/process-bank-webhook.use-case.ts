import { CreditRequestRepository } from 'src/domain/interfaces/credit-request.repository';
import { CreditRequestStatus } from 'src/domain/entities/enums/credit-request-status.enum';
import { UserRepository } from 'src/domain/interfaces/user.repository';
import { BankResultDto } from 'src/infrastructure/webhook/dto/bank-result.dto';

export class ProcessBankWebhookUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,

    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: BankResultDto): Promise<void> {
    const creditRequest = await this.creditRequestRepository.findById(
      input.creditRequestId,
    );

    if (!creditRequest) return;

    const previousStatus = creditRequest.status;

    switch (input.decision) {
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

    const user = await this.userRepository.findByEmail('admin@test.com');

    await this.creditRequestRepository.addStatusHistory({
      creditRequestId: creditRequest.id,
      previousStatus,
      newStatus: creditRequest.status,
      changedById: user?.id,
    });

    await this.creditRequestRepository.addEvaluation({
      creditRequestId: creditRequest.id,
      score: input.score,
      riskLevel: input.riskLevel,
      decision: creditRequest.status,
    });
  }
}
