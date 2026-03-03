import 'dotenv/config';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { logger } from 'src/shared/logger/pino.logger';

async function main() {
  const prisma = new PrismaService();

  // Conectamos
  await prisma.$connect();

  logger.info('Running seed...');

  await prisma.creditStatusHistory.deleteMany();
  await prisma.creditEvaluation.deleteMany();
  await prisma.creditRequest.deleteMany();
  await prisma.userCountry.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  const countriesData = [
    { code: 'ES', name: 'España', currency: 'EUR' },
    { code: 'PT', name: 'Portugal', currency: 'EUR' },
    { code: 'IT', name: 'Italia', currency: 'EUR' },
    { code: 'MX', name: 'México', currency: 'MXN' },
    { code: 'CO', name: 'Colombia', currency: 'COP' },
    { code: 'BR', name: 'Brasil', currency: 'BRL' },
  ];

  await prisma.country.createMany({
    data: countriesData,
    skipDuplicates: true,
  });

  const countries = await prisma.country.findMany();

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  const reviewerPassword = await bcrypt.hash('review123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: adminPassword,
      role: 'ADMIN',
      countries: {
        create: countries.map((c) => ({ countryId: c.id })),
      },
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: userPassword,
      role: 'USER',
      countries: {
        create: [
          { countryId: countries.find((c) => c.code === 'ES')!.id },
          { countryId: countries.find((c) => c.code === 'MX')!.id },
          { countryId: countries.find((c) => c.code === 'CO')!.id },
        ],
      },
    },
  });

  const reviewer = await prisma.user.create({
    data: {
      email: 'reviewer@test.com',
      password: reviewerPassword,
      role: 'REVIEWER',
      countries: {
        create: [
          { countryId: countries.find((c) => c.code === 'ES')!.id },
          { countryId: countries.find((c) => c.code === 'MX')!.id },
          { countryId: countries.find((c) => c.code === 'CO')!.id },
          { countryId: countries.find((c) => c.code === 'BR')!.id },
        ],
      },
    },
  });

  logger.info({ countries, admin, user, reviewer });

  // Desconectar
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
