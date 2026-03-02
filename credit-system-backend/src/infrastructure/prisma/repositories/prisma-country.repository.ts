import { Injectable } from '@nestjs/common';
import { Country } from 'src/domain/entities/country.entity';
import { CountryRepository } from 'src/domain/interfaces/repositories/country.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaCountryRepository implements CountryRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAllAssigned(userId: string): Promise<Country[]> {
    const record = await this.prisma.userCountry.findMany({
      where: {
        userId,
      },
      select: {
        country: {
          select: { code: true, id: true, name: true, currency: true },
        },
      },
    });

    return record.map(
      (it) =>
        new Country(
          it.country.id,
          it.country.code,
          it.country.name,
          it.country.currency,
        ),
    );
  }

  async findById(id: string): Promise<Country | null> {
    const record = await this.prisma.country.findUnique({
      where: {
        id,
      },
    });
    if (!record) return null;

    return new Country(record.id, record.code, record.name, record.currency);
  }
}
