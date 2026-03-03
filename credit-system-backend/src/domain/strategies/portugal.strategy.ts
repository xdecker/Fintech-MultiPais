// portugal.strategy.ts
import { ICountryStrategy } from './country-strategy.interface';
import { CreditRequest } from '../../domain/entities/credit-request.entity';
import { CreditRequestStatus } from '../entities/enums/credit-request-status.enum';

export class PortugalStrategy implements ICountryStrategy {
  validateDocument(document: string): boolean {
    return /^[0-9]{9}$/.test(document);
  }

  validateBusinessRules(request: CreditRequest): void {
    // si amount > 5000 y está pendiente, enviar a revisión
    if (
      request.amount > 5000 &&
      request.status === CreditRequestStatus.PENDING
    ) {
      request.submitForReview();
    }
  }

  async fetchBankInfo(request: CreditRequest): Promise<any> {
    // Dummy info bancaria
    return { score: 650, debts: 1000 };
  }
}
