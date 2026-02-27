import { CreditRequestStatus } from 'src/domain/entities/enums/credit-request-status.enum';

export class BankResultDto {
  creditRequestId: string;
  score: number;
  riskLevel: string;
  decision: CreditRequestStatus;
}
