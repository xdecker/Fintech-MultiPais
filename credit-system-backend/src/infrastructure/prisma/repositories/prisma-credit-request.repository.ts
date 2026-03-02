import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import {
  CreditRequestRepository,
  PaginatedCreditRequests,
} from 'src/domain/interfaces/repositories/credit-request.repository';
import { CreditStatus } from '@prisma/client';
import { CreditRequestStatus } from 'src/domain/entities/enums/credit-request-status.enum';

@Injectable()
export class PrismaCreditRequestRepository implements CreditRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(creditRequest: CreditRequest): Promise<void> {
    await this.prisma.creditRequest.upsert({
      where: { id: creditRequest.id },
      update: {
        amount: creditRequest.amount,
        currency: creditRequest.currency,
        applicantName: creditRequest.applicantName,
        applicantEmail: creditRequest.applicantEmail,
        document: creditRequest.document,
        countryId: creditRequest.countryId,
        createdById: creditRequest.createdById,
        status: creditRequest.status as CreditStatus,
      },
      create: {
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
      where: {
        id,
        active: true,
      },
      include: {
        country: {
          select: {
            name: true,
            code: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
          include: {
            changedBy: {
              select: { email: true },
            },
          },
        },
        evaluations: {
          orderBy: { evaluatedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!record) return null;

    const history = record.statusHistory.map((h) => ({
      previousStatus: h.previousStatus as CreditRequestStatus,
      newStatus: h.newStatus as CreditRequestStatus,
      changedBy: h.changedBy?.email ?? 'system',
      createdAt: h.createdAt,
    }));

    const evaluation = record.evaluations[0]
      ? {
          score: record.evaluations[0].score,
          riskLevel: record.evaluations[0].riskLevel,
          decision: record.evaluations[0].decision as CreditRequestStatus,
          evaluatedAt: record.evaluations[0].evaluatedAt,
        }
      : undefined;

    return new CreditRequest(
      record.id,
      Number(record.amount),
      record.currency,
      record.applicantName,
      record.applicantEmail,
      record.document,
      record.countryId,
      record.createdById,
      {
        countryName: record.country.name,
        countryCode: record.country.code,
      },
      record.status as CreditRequestStatus,
      history,
      evaluation,
    );
  }

  async findAll(page: number, limit: number): Promise<PaginatedCreditRequests> {
    const [records, total] = await this.prisma.$transaction([
      this.prisma.creditRequest.findMany({
        where: { active: true },
        skip: (page - 1) * limit,
        take: Number(limit),
        include: {
          country: { select: { name: true, code: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.creditRequest.count({ where: { active: true } }),
    ]);

    return {
      total,
      data: records.map(
        (r) =>
          new CreditRequest(
            r.id,
            Number(r.amount),
            r.currency,
            r.applicantName,
            r.applicantEmail,
            r.document,
            r.countryId,
            r.createdById,
            {
              countryName: r.country.name,
              countryCode: r.country.code,
            },
            r.status as CreditRequestStatus,
          ),
      ),
    };
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

  async addStatusHistory(entry: {
    creditRequestId: string;
    previousStatus: CreditRequestStatus;
    newStatus: CreditRequestStatus;
    changedById?: string;
  }): Promise<void> {
    await this.prisma.creditStatusHistory.create({
      data: {
        creditRequestId: entry.creditRequestId,
        previousStatus: entry.previousStatus as CreditStatus,
        newStatus: entry.newStatus as CreditStatus,
        changedById: entry.changedById,
      },
    });
  }

  async addEvaluation(entry: {
    creditRequestId: string;
    score: number;
    riskLevel: string;
    decision: CreditRequestStatus;
  }): Promise<void> {
    await this.prisma.creditEvaluation.create({
      data: {
        creditRequestId: entry.creditRequestId,
        score: entry.score,
        riskLevel: entry.riskLevel,
        decision: entry.decision as CreditStatus,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.creditRequest.update({
      where: { id },
      data: { active: false },
    });
  }

  async changeStatus(
    id: string,
    status: CreditRequestStatus,
  ): Promise<CreditRequest> {
    const record = await this.prisma.creditRequest.update({
      data: { status },
      where: { id },
    });
    return new CreditRequest(
      record.id,
      Number(record.amount),
      record.currency,
      record.applicantName,
      record.applicantEmail,
      record.document,
      record.countryId,
      record.createdById,
      undefined,
      record.status as CreditRequestStatus,
    );
  }

  async getDashboardSummary() {
    // KPIs
    const [totalRequests, pendingRequests, approvedRequests, totalAmount] =
      await Promise.all([
        this.prisma.creditRequest.count(),
        this.prisma.creditRequest.count({
          where: { status: 'PENDING' },
        }),
        this.prisma.creditRequest.count({
          where: { status: 'APPROVED' },
        }),
        this.prisma.creditRequest.aggregate({
          _sum: { amount: true },
        }),
      ]);

    // últimos 7 días
    const last7Days = await this.prisma.$queryRaw<
      { date: string; count: number }[]
    >`
      SELECT
        DATE("createdAt") as date,
        COUNT(*)::int as count
      FROM "CreditRequest"
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date;
    `;

    // por país
    const byCountry = await this.prisma.$queryRaw<
      { country: string; count: number }[]
    >`
      SELECT
        c.name AS country,
        COUNT(cr.id)::int AS total
      FROM "Country" c
      LEFT JOIN "CreditRequest" cr
        ON cr."countryId" = c.id
      GROUP BY c.name
      ORDER BY total DESC;
      `;

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      totalAmount: Number(totalAmount._sum.amount) ?? 0,
      requestsLast7Days: last7Days,
      requestsByCountry: byCountry,
    };
  }
}
