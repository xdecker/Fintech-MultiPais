import { CreditRequestStatus } from '../entities/enums/credit-request-status.enum';
import { CreditRequest } from '../entities/credit-request.entity';

export interface CreditRequestRepository {
  save(creditRequest: CreditRequest): Promise<void>;

  findById(id: string): Promise<CreditRequest | null>;

  findAll(): Promise<CreditRequest[]>;

  findByCountry(countryId: string): Promise<CreditRequest[]>;

  addStatusHistory(entry: {
    creditRequestId: string;
    previousStatus: CreditRequestStatus;
    newStatus: CreditRequestStatus;
    changedById?: string;
  }): Promise<void>;

  addEvaluation(entry: {
    creditRequestId: string;
    score: number;
    riskLevel: string;
    decision: CreditRequestStatus;
  }): Promise<void>;
}

export const CREDIT_REQUEST_REPOSITORY = 'CREDIT_REQUEST_REPOSITORY';
