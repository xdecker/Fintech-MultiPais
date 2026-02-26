import { Inject, Injectable } from '@nestjs/common';
import { ProcessBankWebhookUseCase } from 'src/application/use-cases/webhook/process-bank-webhook.use-case';
import {
  CREDIT_REQUEST_REPOSITORY,
  CreditRequestRepository,
} from 'src/domain/interfaces/repositories/credit-request.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/domain/interfaces/repositories/user.repository';
import { BankResultDto } from '../dto/bank-result.dto';
import { EVENTPUBLISHER } from 'src/domain/interfaces/websocket/websocket-event.publisher';
import { EventPublisher } from 'src/domain/interfaces/event-publisher.interface';

@Injectable()
export class BankWebhookService {
  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private repo: CreditRequestRepository,

    @Inject(USER_REPOSITORY)
    private userRepo: UserRepository,
    @Inject(EVENTPUBLISHER)
    private eventPublisher: EventPublisher,
  ) {}

  async handle(dto: BankResultDto) {
    const useCase = new ProcessBankWebhookUseCase(
      this.repo,
      this.userRepo,
      this.eventPublisher,
    );

    await useCase.execute(dto);
  }
}
