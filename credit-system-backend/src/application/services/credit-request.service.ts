import { Inject, Injectable } from '@nestjs/common';
import { CreateCreditRequestUseCase } from '../use-cases/credit-request/create-credit-request.use-case';
import { CreateCreditRequestDto } from '../dto/create-credit-request.dto';
import { CREDIT_REQUEST_REPOSITORY } from '../../domain/interfaces/repositories/credit-request.repository';
import type { CreditRequestRepository } from '../../domain/interfaces/repositories/credit-request.repository';
import { CreditRequest } from '@prisma/client';
import { GetAllCreditRequestsUseCase } from '../use-cases/credit-request/get-all-credit-request.use-case';
import { GetCreditRequestByIdUseCase } from '../use-cases/credit-request/get-credit-request-by-Id.use-case';
import { GetCreditRequestsByCountryUseCase } from '../use-cases/credit-request/get-credit-requests-by-country.use-case';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/domain/interfaces/repositories/country.repository';
import { GetCountryByIdUseCase } from '../use-cases/country/get-country-by-id.use-case';

@Injectable()
export class CreditRequestService {
  private readonly createCreditRequestUseCase: CreateCreditRequestUseCase;
  private readonly getAllUseCase: GetAllCreditRequestsUseCase;
  private readonly getByIdUseCase: GetCreditRequestByIdUseCase;
  private readonly getByCountryUseCase: GetCreditRequestsByCountryUseCase;

  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepository: CreditRequestRepository,

    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {
    const getCountryByIdUseCase = new GetCountryByIdUseCase(
      this.countryRepository,
    );

    this.createCreditRequestUseCase = new CreateCreditRequestUseCase(
      this.creditRequestRepository,
      getCountryByIdUseCase,
    );
    this.getAllUseCase = new GetAllCreditRequestsUseCase(
      this.creditRequestRepository,
    );
    this.getByIdUseCase = new GetCreditRequestByIdUseCase(
      this.creditRequestRepository,
    );
    this.getByCountryUseCase = new GetCreditRequestsByCountryUseCase(
      this.creditRequestRepository,
    );
  }

  async getAll() {
    return this.getAllUseCase.execute();
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
}
