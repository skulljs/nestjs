import { faker } from '@faker-js/faker';
import { PrismaClient, Cats } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const data: Cats[] = [];
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: i,
      name: faker.animal.cat(),
      color: faker.color.human(),
      weight: faker.number.int({ min: 10, max: 80 }).toString(),
      eyes_color: faker.color.human(),
    });
  }

  const cats = await prisma.cats.createMany({ data, skipDuplicates: true });
  console.log({ cats });
}

main().catch(async (err) => {
  console.log(err);
  await prisma.$disconnect();
  process.exit(1);
});
