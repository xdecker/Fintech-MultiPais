import { randomUUID } from 'crypto';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CreditRequestRepository } from 'src/domain/interfaces/credit-request.repository';
import { CountryStrategyFactory } from 'src/domain/strategies/country-strategy.factory';
import { GetCountryByIdUseCase } from '../country/get-country-by-id.use-case';
import { BadRequestException } from '@nestjs/common';

interface CreateCreditRequestInput {
  amount: number;
  currency: string;
  applicantName: string;
  applicantEmail: string;
  document: string;
  countryId: string;
  createdById: string;
}

export class CreateCreditRequestUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
    private readonly getCountryByIdUseCase: GetCountryByIdUseCase,
  ) {}

  async execute(input: CreateCreditRequestInput): Promise<CreditRequest> {
    const country = await this.getCountryByIdUseCase.execute(input.countryId);
    if (!country) {
      throw new BadRequestException('Invalid country of the credit request');
    }
    const strategy = CountryStrategyFactory.getStrategy(country.code);
    const isValidDocument = strategy.validateDocument(input.document);

    if (!isValidDocument) {
      throw new BadRequestException('Invalid document for country');
    }

    const creditRequest = new CreditRequest(
      randomUUID(),
      input.amount,
      input.currency,
      input.applicantName,
      input.applicantEmail,
      input.document,
      input.countryId,
      input.createdById,
    );

    strategy.validateBusinessRules(creditRequest);

    await this.creditRequestRepository.save(creditRequest);

    return creditRequest;
  }
}
