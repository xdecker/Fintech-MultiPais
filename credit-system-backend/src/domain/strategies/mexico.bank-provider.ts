import { BankProvider } from './bank-provider.interface';

export class MexicoBankProvider implements BankProvider {
  async getBankInformation(document: string) {
    return {
      debt: Math.floor(Math.random() * 8000),
      score: 580,
      accountStatus: 'ACTIVE',
    };
  }
}
