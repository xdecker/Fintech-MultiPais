import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/interfaces/repositories/user.repository';
import { PrismaService } from '../prisma.service';
import { Role } from 'src/domain/entities/enums/user-role.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        countries: { select: { country: { select: { code: true } } } },
      },
    });
    if (!record) return null;

    return new User(
      record.id,
      record.email,
      record.role as Role,
      record.countries.map((it) => it.country.code),
    );
  }
  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        countries: { select: { country: { select: { code: true } } } },
      },
    });
    if (!record) return null;

    return new User(
      record.id,
      record.email,
      record.role as Role,
      record.countries.map((it) => it.country.code),
    );
  }
}
