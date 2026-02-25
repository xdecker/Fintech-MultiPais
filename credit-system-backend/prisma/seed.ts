import 'dotenv/config';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaService();

  // Conectamos
  await prisma.$connect();

  console.log('Running seed...');

  // Limpiar datos si quieres pruebas limpias
  await prisma.creditRequest.deleteMany();
  await prisma.userCountry.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  // Crear países
  const spain = await prisma.country.create({
    data: { code: 'ES', name: 'España' },
  });

  const mexico = await prisma.country.create({
    data: { code: 'MX', name: 'México' },
  });

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: adminPassword,
      role: 'ADMIN',
      countries: {
        create: [{ countryId: spain.id }, { countryId: mexico.id }],
      },
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: userPassword,
      role: 'USER',
      countries: {
        create: [{ countryId: spain.id }],
      },
    },
  });

  console.log({ spain, mexico, admin, user });

  // Desconectar
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
