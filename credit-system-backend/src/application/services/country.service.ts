import { Inject, Injectable } from '@nestjs/common';
import { GetAllCountryAssignedUseCase } from '../use-cases/country/get-all-country-assigned.use-case';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/domain/interfaces/repositories/country.repository';

@Injectable()
export class CountryService {
  private readonly getAllCountryAssignedUseCase: GetAllCountryAssignedUseCase;

  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {
    this.getAllCountryAssignedUseCase = new GetAllCountryAssignedUseCase(
      this.countryRepository,
    );
  }

  async getAllAssigned(userId: string) {
    return this.getAllCountryAssignedUseCase.execute(userId);
  }
}
