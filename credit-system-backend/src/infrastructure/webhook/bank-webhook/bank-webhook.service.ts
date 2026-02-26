import { Inject, Injectable } from '@nestjs/common';
import { ProcessBankWebhookUseCase } from 'src/application/use-cases/webhook/process-bank-webhook.use-case';
import {
  CREDIT_REQUEST_REPOSITORY,
  CreditRequestRepository,
} from 'src/domain/interfaces/credit-request.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/domain/interfaces/user.repository';
import { BankResultDto } from '../dto/bank-result.dto';

@Injectable()
export class BankWebhookService {
  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private repo: CreditRequestRepository,

    @Inject(USER_REPOSITORY)
    private userRepo: UserRepository,
  ) {}

  async handle(dto: BankResultDto) {
    const useCase = new ProcessBankWebhookUseCase(this.repo, this.userRepo);

    await useCase.execute(dto);
  }
}
