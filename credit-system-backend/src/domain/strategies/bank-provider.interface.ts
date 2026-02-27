export interface BankProvider {
    getBankInformation(document: string): Promise<{
      debt: number;
      score: number;
      accountStatus: string;
    }>;
  }