import { ICountryStrategy } from './country-strategy.interface';
import { CreditRequest } from '../entities/credit-request.entity';
import { CreditRequestStatus } from '../entities/enums/credit-request-status.enum';

export class SpainStrategy implements ICountryStrategy {
  validateDocument(document: string): boolean {
    return /^[0-9]{8}[A-Z]$/.test(document);
  }

  validateBusinessRules(request: CreditRequest): void {
    if (
      request.amount > 10000 &&
      request.status === CreditRequestStatus.PENDING
    ) {
      request.submitForReview();
    }
  }

  async fetchBankInfo(request: CreditRequest): Promise<any> {
    return { score: 700, debts: 0 };
  }
}
