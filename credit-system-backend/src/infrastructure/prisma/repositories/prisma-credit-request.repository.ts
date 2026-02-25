import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CreditRequestRepository } from 'src/domain/interfaces/credit-request.repository';
import { CreditStatus } from '@prisma/client';
import { CreditRequestStatus } from 'src/domain/entities/credit-request-status.enum';

@Injectable()
export class PrismaCreditRequestRepository implements CreditRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(creditRequest: CreditRequest): Promise<void> {
    await this.prisma.creditRequest.create({
      data: {
        id: creditRequest.id,
        amount: creditRequest.amount,
        currency: creditRequest.currency,
        applicantName: creditRequest.applicantName,
        applicantEmail: creditRequest.applicantEmail,
        document: creditRequest.document,
        countryId: creditRequest.countryId,
        createdById: creditRequest.createdById,
        status: creditRequest.status as CreditStatus,
      },
    });
  }
  async findById(id: string): Promise<CreditRequest | null> {
    const record = await this.prisma.creditRequest.findUnique({
      where: { id },
    });

    if (!record) return null;

    return new CreditRequest(
      record.id,
      Number(record.amount),
      record.currency,
      record.applicantName,
      record.applicantEmail,
      record.countryId,
      record.createdById,
      record.status as CreditRequestStatus,
    );
  }
  async findAll(): Promise<CreditRequest[]> {
    const records = await this.prisma.creditRequest.findMany();

    return records.map(
      (record) =>
        new CreditRequest(
          record.id,
          Number(record.amount),
          record.currency,
          record.applicantName,
          record.applicantEmail,
          record.countryId,
          record.createdById,
          record.status as CreditRequestStatus,
        ),
    );
  }
  async findByCountry(countryId: string): Promise<CreditRequest[]> {
    const records = await this.prisma.creditRequest.findMany({
      where: { countryId },
    });

    return records.map(
      (record) =>
        new CreditRequest(
          record.id,
          Number(record.amount),
          record.currency,
          record.applicantName,
          record.applicantEmail,
          record.countryId,
          record.createdById,
          record.status as CreditRequestStatus,
        ),
    );
  }
}
