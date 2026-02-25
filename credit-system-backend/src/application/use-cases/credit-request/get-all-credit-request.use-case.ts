import { randomUUID } from 'crypto';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CreditRequestRepository } from 'src/domain/interfaces/credit-request.repository';


export class GetAllCreditRequestsUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
  ) {}

  async execute(): Promise<CreditRequest[]> {
    return this.creditRequestRepository.findAll();
  }
}
