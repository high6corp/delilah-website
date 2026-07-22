import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const password = process.env.FAMILY_PASSWORD;
  if (!password) {
    throw new Error('FAMILY_PASSWORD environment variable is required for seeding');
  }

  const rounds = parseInt(process.env.BCRYPT_ROUNDS ?? '12', 10);
  const passwordHash = await bcrypt.hash(password, rounds);

  await prisma.siteConfig.upsert({
    where: { key: 'passwordHash' },
    update: { value: passwordHash },
    create: {
      key: 'passwordHash',
      value: passwordHash,
    },
  });

  console.log('Seeded site config with password hash');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
