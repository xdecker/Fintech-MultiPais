import { BankProvider } from './bank-provider.interface';

export class SpainBankProvider implements BankProvider {
  async getBankInformation(document: string) {
    return {
      debt: Math.floor(Math.random() * 5000),
      score: 650,
      accountStatus: 'ACTIVE',
    };
  }
}
