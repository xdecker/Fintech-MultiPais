import { Injectable } from '@nestjs/common';
import { CreditRequestRepository } from 'src/domain/interfaces/repositories/credit-request.repository';

@Injectable()
export class GetDashboardSummaryUseCase {
  constructor(private readonly creditRepo: CreditRequestRepository) {}

  execute() {
    return this.creditRepo.getDashboardSummary();
  }
}
