import { Inject, Injectable } from '@nestjs/common';
import { CreateCreditRequestUseCase } from '../use-cases/create-credit-request.use-case';
import { CreateCreditRequestDto } from '../dto/create-credit-request.dto';
import { CREDIT_REQUEST_REPOSITORY } from '../../domain/interfaces/credit-request.repository';
import type { CreditRequestRepository } from '../../domain/interfaces/credit-request.repository';

@Injectable()
export class CreditRequestService {
  private readonly createCreditRequestUseCase: CreateCreditRequestUseCase;

  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepository: CreditRequestRepository,
  ) {
    this.createCreditRequestUseCase = new CreateCreditRequestUseCase(
      this.creditRequestRepository,
    );
  }

  async create(dto: CreateCreditRequestDto) {
    return this.createCreditRequestUseCase.execute(dto);
  }
}
