import { randomUUID } from 'crypto';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CreditRequestRepository } from 'src/domain/interfaces/repositories/credit-request.repository';

export class GetCreditRequestsByCountryUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
  ) {}

  async execute(countryId: string): Promise<CreditRequest[]> {
    return this.creditRequestRepository.findByCountry(countryId);
  }
}
