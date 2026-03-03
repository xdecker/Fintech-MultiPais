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
import { EVENTPUBLISHER } from 'src/infrastructure/websocket/websocket-event.publisher';
import { EventPublisher } from 'src/domain/interfaces/event-publisher.interface';
import { REDIS_SERVICE_TOKEN } from 'src/infrastructure/cache/redis.service';
import { CacheService } from 'src/domain/interfaces/cache.interface';

@Injectable()
export class BankWebhookService {
  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private repo: CreditRequestRepository,

    @Inject(USER_REPOSITORY)
    private userRepo: UserRepository,
    @Inject(EVENTPUBLISHER)
    private eventPublisher: EventPublisher,
    @Inject(REDIS_SERVICE_TOKEN)
    private cache: CacheService,
  ) {}

  async handle(dto: BankResultDto) {
    const useCase = new ProcessBankWebhookUseCase(
      this.repo,
      this.userRepo,
      this.eventPublisher,
      this.cache,
    );

    await useCase.execute(dto);
  }
}
