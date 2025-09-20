// instantiate the client
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// when creating a new message
await prisma.users.create({
  data: {
    username: 'player1',
    password: '1234',
    files: {
      create: {
        content: 'This is the first item added',
      },
    },
  },
  include: { files: true },
});

await prisma.users.create({
  data: {
    username: 'player2',
    password: '1234',
    files: {
      create: {
        content: 'This is the second item added',
      },
    },
  },
  include: { files: true },
});

// when fetching all messages
const messages = await prisma.message.findMany();
