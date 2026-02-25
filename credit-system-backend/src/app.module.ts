import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { CREDIT_REQUEST_REPOSITORY } from './domain/interfaces/credit-request.repository';
import { PrismaCreditRequestRepository } from './infrastructure/prisma/repositories/prisma-credit-request.repository';
import { CreditRequestController } from './interfaces/http/credit-request.controller';
import { CreditRequestService } from './application/services/credit-request.service';
import { AuthModule } from './infrastructure/auth/auth.module';
import { AuthController } from './interfaces/http/auth.controller';
import { COUNTRY_REPOSITORY } from './domain/interfaces/country.repository';
import { PrismaCountryRepository } from './infrastructure/prisma/repositories/prisma-country.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CreditRequestController, AuthController],
  providers: [
    CreditRequestService,
    {
      provide: CREDIT_REQUEST_REPOSITORY,
      useClass: PrismaCreditRequestRepository,
    },
    {
      provide: COUNTRY_REPOSITORY,
      useClass: PrismaCountryRepository,
    },
  ],
  exports: [CREDIT_REQUEST_REPOSITORY, COUNTRY_REPOSITORY],
})
export class AppModule {}
