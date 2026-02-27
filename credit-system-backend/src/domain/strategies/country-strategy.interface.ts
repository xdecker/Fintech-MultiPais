import { CreditRequest } from '../entities/credit-request.entity';

export interface ICountryStrategy {
  validateDocument(document: string): boolean;
  validateBusinessRules(request: CreditRequest): void;
  fetchBankInfo?(request: CreditRequest): Promise<any>; // opcional, simula proveedor bancario
}
