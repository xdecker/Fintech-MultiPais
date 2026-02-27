import { Country } from 'src/domain/entities/country.entity';
import { CountryRepository } from 'src/domain/interfaces/repositories/country.repository';

export class GetCountryByIdUseCase {
  constructor(private readonly countryRepository: CountryRepository) {}

  async execute(countryId: string): Promise<Country | null> {
    return this.countryRepository.findById(countryId);
  }
}
