import { ICountryStrategy } from './country-strategy.interface';
import { CreditRequest } from '../../domain/entities/credit-request.entity';
import { CreditRequestStatus } from '../entities/enums/credit-request-status.enum';

export class ColombiaStrategy implements ICountryStrategy {
  validateDocument(document: string): boolean {
    // Cédula: 6-10 dígitos
    return /^[0-9]{6,10}$/.test(document);
  }

  validateBusinessRules(request: CreditRequest): void {
    // si amount > 6000 y está pendiente, enviar a revisión
    if (
      request.amount > 6000 &&
      request.status === CreditRequestStatus.PENDING
    ) {
      request.submitForReview();
    }
  }

  async fetchBankInfo(request: CreditRequest): Promise<any> {
    return { score: 600, debts: 1500 };
  }
}
