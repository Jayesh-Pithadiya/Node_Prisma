import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const users = await prisma.user.findMany({
    include: {
      products: true, // Include all related products for each user
    }
  });

  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });



