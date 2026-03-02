import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { CREDIT_REQUEST_REPOSITORY } from './domain/interfaces/repositories/credit-request.repository';
import { PrismaCreditRequestRepository } from './infrastructure/prisma/repositories/prisma-credit-request.repository';
import { CreditRequestController } from './interfaces/http/credit-request.controller';
import { CreditRequestService } from './application/services/credit-request.service';
import { AuthModule } from './infrastructure/auth/auth.module';
import { AuthController } from './interfaces/http/auth.controller';
import { COUNTRY_REPOSITORY } from './domain/interfaces/repositories/country.repository';
import { PrismaCountryRepository } from './infrastructure/prisma/repositories/prisma-country.repository';
import { PrismaUserRepository } from './infrastructure/prisma/repositories/prisma-user.repository';
import { USER_REPOSITORY } from './domain/interfaces/repositories/user.repository';
import { AppLoggerModule } from './infrastructure/logger/logger.module';
import { BankWebhookController } from './infrastructure/webhook/bank-webhook/bank-webhook.controller';
import { BankWebhookService } from './infrastructure/webhook/bank-webhook/bank-webhook.service';
import { CreditGateway } from './infrastructure/websocket/credit.gateway';
import {
  EVENTPUBLISHER,
  WebsocketEventPublisher,
} from './infrastructure/websocket/websocket-event.publisher';
import {
  REDIS_SERVICE_TOKEN,
  RedisService,
} from './infrastructure/cache/redis.service';
import { PostgresListenerService } from './infrastructure/db/postgres/postgres-listener.service';

@Module({
  imports: [PrismaModule, AuthModule, AppLoggerModule],
  controllers: [CreditRequestController, AuthController, BankWebhookController],
  providers: [
    PostgresListenerService,
    CreditGateway,
    {
      provide: EVENTPUBLISHER,
      useClass: WebsocketEventPublisher,
    },
    CreditRequestService,
    BankWebhookService,
    {
      provide: CREDIT_REQUEST_REPOSITORY,
      useClass: PrismaCreditRequestRepository,
    },
    {
      provide: COUNTRY_REPOSITORY,
      useClass: PrismaCountryRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: REDIS_SERVICE_TOKEN,
      useClass: RedisService,
    },
  ],
  exports: [
    CREDIT_REQUEST_REPOSITORY,
    COUNTRY_REPOSITORY,
    USER_REPOSITORY,
    EVENTPUBLISHER,
    REDIS_SERVICE_TOKEN,
  ],
})
export class AppModule {}
