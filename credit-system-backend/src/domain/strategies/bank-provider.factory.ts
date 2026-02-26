import { MexicoBankProvider } from './mexico.bank-provider';
import { SpainBankProvider } from './spain.bank-provider';

export class BankProviderFactory {
  static create(codeCountry: string) {
    switch (codeCountry) {
      case 'ES':
        return new SpainBankProvider();

      case 'MX':
        return new MexicoBankProvider();

      default:
        throw new Error('Unsupported country');
    }
  }
}
