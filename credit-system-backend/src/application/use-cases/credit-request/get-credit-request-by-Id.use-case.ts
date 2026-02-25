import { randomUUID } from 'crypto';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CreditRequestRepository } from 'src/domain/interfaces/credit-request.repository';

export class GetCreditRequestByIdUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
  ) {}

  async execute(id: string): Promise<CreditRequest | null> {
    return this.creditRequestRepository.findById(id);
  }
}
