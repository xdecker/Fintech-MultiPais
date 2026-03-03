// brazil.strategy.ts
import { ICountryStrategy } from './country-strategy.interface';
import { CreditRequest } from '../../domain/entities/credit-request.entity';
import { CreditRequestStatus } from '../entities/enums/credit-request-status.enum';

export class BrazilStrategy implements ICountryStrategy {
  validateDocument(document: string): boolean {
    // CPF: 11 dígitos
    return /^[0-9]{11}$/.test(document);
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
    return { score: 620, debts: 800 };
  }
}
