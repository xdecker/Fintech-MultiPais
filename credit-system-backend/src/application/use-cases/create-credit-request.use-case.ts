import { randomUUID } from 'crypto';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CreditRequestRepository } from 'src/domain/interfaces/credit-request.repository';

interface CreateCreditRequestInput {
  amount: number;
  currency: string;
  applicantName: string;
  applicantEmail: string;
  countryId: string;
  createdById: string;
}

export class CreateCreditRequestUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
  ) {}

  async execute(input: CreateCreditRequestInput): Promise<CreditRequest> {
    const creditRequest = new CreditRequest(
      randomUUID(),
      input.amount,
      input.currency,
      input.applicantName,
      input.applicantEmail,
      input.countryId,
      input.createdById,
    );

    await this.creditRequestRepository.save(creditRequest);

    return creditRequest;
  }
}
