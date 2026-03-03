import { Country } from 'src/domain/entities/country.entity';
import { CountryRepository } from 'src/domain/interfaces/repositories/country.repository';

export class GetAllCountryAssignedUseCase {
  constructor(private readonly countryRepository: CountryRepository) {}

  async execute(userId: string): Promise<Country[]> {
    return this.countryRepository.findAllAssigned(userId);
  }
}
