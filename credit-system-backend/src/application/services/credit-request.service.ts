import { Inject, Injectable } from '@nestjs/common';
import { CreateCreditRequestUseCase } from '../use-cases/credit-request/create-credit-request.use-case';
import { CreateCreditRequestDto } from '../dto/create-credit-request.dto';
import { CREDIT_REQUEST_REPOSITORY } from '../../domain/interfaces/repositories/credit-request.repository';
import type { CreditRequestRepository } from '../../domain/interfaces/repositories/credit-request.repository';
import { GetAllCreditRequestsUseCase } from '../use-cases/credit-request/get-all-credit-request.use-case';
import { GetCreditRequestByIdUseCase } from '../use-cases/credit-request/get-credit-request-by-Id.use-case';
import { GetCreditRequestsByCountryUseCase } from '../use-cases/credit-request/get-credit-requests-by-country.use-case';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/domain/interfaces/repositories/country.repository';
import { GetCountryByIdUseCase } from '../use-cases/country/get-country-by-id.use-case';
import { CacheService } from 'src/domain/interfaces/cache.interface';
import { REDIS_SERVICE_TOKEN } from 'src/infrastructure/cache/redis.service';
import { DeleteCreditRequestByIdUseCase } from '../use-cases/credit-request/delete-credit-request.use-case';
import { CreditRequestStatus } from 'src/domain/entities/enums/credit-request-status.enum';
import { UpdateStatusCreditUseCase } from '../use-cases/credit-request/update-status-credit-request.use-case';
import { CreditGateway } from 'src/infrastructure/websocket/credit.gateway';
import { GetDashboardSummaryUseCase } from '../use-cases/dashboard/get-dashboard-summary.use-case';

@Injectable()
export class CreditRequestService {
  private readonly createCreditRequestUseCase: CreateCreditRequestUseCase;
  private readonly getAllUseCase: GetAllCreditRequestsUseCase;
  private readonly getByIdUseCase: GetCreditRequestByIdUseCase;
  private readonly getByCountryUseCase: GetCreditRequestsByCountryUseCase;
  private readonly deleteUsecase: DeleteCreditRequestByIdUseCase;
  private readonly updateStatusCreditUseCase: UpdateStatusCreditUseCase;
  private readonly getDashboardSummaryUseCase: GetDashboardSummaryUseCase;

  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepository: CreditRequestRepository,

    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,

    @Inject(REDIS_SERVICE_TOKEN)
    private cache: CacheService,

    private readonly creditGateway: CreditGateway,
  ) {
    const getCountryByIdUseCase = new GetCountryByIdUseCase(
      this.countryRepository,
    );

    this.createCreditRequestUseCase = new CreateCreditRequestUseCase(
      this.creditRequestRepository,
      getCountryByIdUseCase,
      this.creditGateway,
    );
    this.getAllUseCase = new GetAllCreditRequestsUseCase(
      this.creditRequestRepository,
      this.cache,
    );
    this.getByIdUseCase = new GetCreditRequestByIdUseCase(
      this.creditRequestRepository,
      this.cache,
    );
    this.getByCountryUseCase = new GetCreditRequestsByCountryUseCase(
      this.creditRequestRepository,
    );

    this.deleteUsecase = new DeleteCreditRequestByIdUseCase(
      this.creditRequestRepository,
      this.cache,
    );

    this.updateStatusCreditUseCase = new UpdateStatusCreditUseCase(
      this.creditRequestRepository,
      this.creditGateway,
    );

    this.getDashboardSummaryUseCase = new GetDashboardSummaryUseCase(
      this.creditRequestRepository,
    );
  }

  async getAll(page = 1, limit = 10, userId: string) {
    return this.getAllUseCase.execute(page, limit, userId);
  }

  async getById(id: string) {
    return this.getByIdUseCase.execute(id);
  }

  async getByCountry(countryId: string) {
    return this.getByCountryUseCase.execute(countryId);
  }

  async create(dto: CreateCreditRequestDto, id: string) {
    return this.createCreditRequestUseCase.execute({ ...dto, createdById: id });
  }

  async delete(id: string) {
    return this.deleteUsecase.execute(id);
  }

  async updateStatus(id: string, status: CreditRequestStatus, userId: string) {
    return this.updateStatusCreditUseCase.execute(id, status, userId);
  }

  async getSummaryOfDashboard() {
    return this.getDashboardSummaryUseCase.execute();
  }
}
