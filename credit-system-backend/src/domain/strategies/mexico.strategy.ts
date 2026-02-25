import { ICountryStrategy } from './country-strategy.interface';
import { CreditRequest } from '../entities/credit-request.entity';
import { CreditRequestStatus } from '../entities/credit-request-status.enum';

export class MexicoStrategy implements ICountryStrategy {
  validateDocument(document: string): boolean {
    return /^[A-Z]{4}[0-9]{6}[A-Z0-9]{6}$/.test(document);
  }

  validateBusinessRules(request: CreditRequest): void {
    if (
      request.amount > 5000 &&
      request.status === CreditRequestStatus.PENDING
    ) {
      request.submitForReview();
    }
  }

  async fetchBankInfo(request: CreditRequest): Promise<any> {
    return { score: 680, debts: 0 };
  }
}
