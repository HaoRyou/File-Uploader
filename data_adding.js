import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // Create player1 with a file
  const player1 = await prisma.users.create({
    data: {
      username: 'player1',
      password: '1234',
      files: {
        create: { content: 'This is the first item added' },
      },
    },
    include: { files: true }, // include the created files in the returned object
  });
  console.log(player1);

  // Create player2 with a file
  const player2 = await prisma.users.create({
    data: {
      username: 'player2',
      password: '1234',
      files: {
        create: { content: 'This is the second item added' },
      },
    },
    include: { files: true },
  });
  console.log(player2);

  // Fetch all messages
  const messages = await prisma.users.findMany({
    include: { author: true }, // include author info
  });
  console.log(messages);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
