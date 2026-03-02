import { Injectable } from '@nestjs/common';
import { Country } from 'src/domain/entities/country.entity';
import { CountryRepository } from 'src/domain/interfaces/repositories/country.repository';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class PrismaCountryRepository implements CountryRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAllAssigned(userId: string): Promise<Country[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { countries: { select: { countryId: true, country: true } } },
    });

    if (!user) throw new Error('Usuario no encontrado');

    let records: typeof user.countries = [];

    if (user.role === Role.ADMIN) {
      const allCountries = await this.prisma.country.findMany({
        select: { id: true, code: true, name: true, currency: true },
      });

      return allCountries.map(
        (c) => new Country(c.id, c.code, c.name, c.currency),
      );
    } else {
      records = user.countries;
    }

    return records.map(
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
