// italy.strategy.ts
import { ICountryStrategy } from './country-strategy.interface';
import { CreditRequest } from '../../domain/entities/credit-request.entity';
import { CreditRequestStatus } from '../entities/enums/credit-request-status.enum';

export class ItalyStrategy implements ICountryStrategy {
  validateDocument(document: string): boolean {
    // Codice Fiscale: 16 caracteres alfanuméricos
    return /^[A-Z0-9]{16}$/.test(document);
  }

  validateBusinessRules(request: CreditRequest): void {
    // si amount > 7000 y está pendiente, enviar a revisión
    if (
      request.amount > 7000 &&
      request.status === CreditRequestStatus.PENDING
    ) {
      request.submitForReview();
    }
  }

  async fetchBankInfo(request: CreditRequest): Promise<any> {
    return { score: 700, debts: 500 };
  }
}
