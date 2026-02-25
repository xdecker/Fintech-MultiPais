import { ICountryStrategy } from './country-strategy.interface';
import { SpainStrategy } from './spain.strategy';
import { MexicoStrategy } from './mexico.strategy';
import { BadRequestException } from '@nestjs/common';

export class CountryStrategyFactory {
  static getStrategy(country: string): ICountryStrategy {
    switch (country) {
      case 'ES':
        return new SpainStrategy();
      case 'MX':
        return new MexicoStrategy();
      default:
        throw new BadRequestException(`País ${country} no soportado`);
    }
  }
}
