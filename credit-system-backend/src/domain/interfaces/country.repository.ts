import { Country } from '../entities/country.entity';

export interface CountryRepository {
  findById(id: string): Promise<Country | null>;
}

export const COUNTRY_REPOSITORY = 'COUNTRY_REPOSITORY';
