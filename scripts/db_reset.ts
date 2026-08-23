import { prisma } from '../src/lib/prisma';

async function main() {
  await prisma.aiCaseMessage.deleteMany({});
  await prisma.aiCase.deleteMany({});
  console.log('Database cleared of previous AI Cases.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
