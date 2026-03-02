import { CreditRequestStatus } from '../../entities/enums/credit-request-status.enum';
import { CreditRequest } from '../../entities/credit-request.entity';

export interface PaginatedCreditRequests {
  data: CreditRequest[];
  total: number;
}

export interface CreditRequestRepository {
  save(creditRequest: CreditRequest): Promise<void>;

  findById(id: string): Promise<CreditRequest | null>;

  findAll(page: number, limit: number): Promise<PaginatedCreditRequests>;

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

  delete(id: string): Promise<void>;

  changeStatus(id: string, status: CreditRequestStatus): Promise<CreditRequest>;

  getDashboardSummary(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    totalAmount: number;
    requestsLast7Days: { date: string; count: number }[];
    requestsByCountry: { country: string; count: number }[];
  }>;
}

export const CREDIT_REQUEST_REPOSITORY = 'CREDIT_REQUEST_REPOSITORY';
