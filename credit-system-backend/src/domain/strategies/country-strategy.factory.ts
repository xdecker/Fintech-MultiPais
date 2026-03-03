import { ICountryStrategy } from './country-strategy.interface';
import { SpainStrategy } from './spain.strategy';
import { MexicoStrategy } from './mexico.strategy';
import { BadRequestException } from '@nestjs/common';
import { PortugalStrategy } from './portugal.strategy';
import { ItalyStrategy } from './italy.strategy';
import { ColombiaStrategy } from './colombia.strategy';
import { BrazilStrategy } from './brasil.strategy';

export class CountryStrategyFactory {
  static getStrategy(country: string): ICountryStrategy {
    switch (country) {
      case 'ES':
        return new SpainStrategy();
      case 'MX':
        return new MexicoStrategy();

      case 'PT':
        return new PortugalStrategy();
      case 'IT':
        return new ItalyStrategy();
      case 'CO':
        return new ColombiaStrategy();
      case 'BR':
        return new BrazilStrategy();

      default:
        throw new BadRequestException(`País ${country} no soportado`);
    }
  }
}
