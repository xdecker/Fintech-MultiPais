import { CreditRequest } from '../entities/credit-request.entity';

export interface CreditRequestRepository {
  save(creditRequest: CreditRequest): Promise<void>;

  findById(id: string): Promise<CreditRequest | null>;

  findAll(): Promise<CreditRequest[]>;

  findByCountry(countryId: string): Promise<CreditRequest[]>;
}


export const CREDIT_REQUEST_REPOSITORY = 'CREDIT_REQUEST_REPOSITORY';