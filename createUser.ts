import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const user1 = await prisma.user.upsert({
    where: { email: "jayesh@gmail.com" },
    update: {
      name: "Jayesh",
      age: 22,
    },
    create: {
      name: "Jayesh",
      email: "jayesh@gmail.com",
      age: 22,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "rahul@gmail.com" },
    update: {
      name: "Rahul",
      age: 25,
    },
    create: {
      name: "Rahul",
      email: "rahul@gmail.com",
      age: 25,
    },
  });

  console.log(user1);
  console.log(user2);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });