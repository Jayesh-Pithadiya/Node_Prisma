import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: "iPhone", 
        price: 80000,
        userID: 1,
        description: "A smartphone by Apple"
      },
      { name: "Keyboard", 
        price: 10000,
        userID: 2,
        description: "A high-quality mechanical keyboard"
      },
    ]
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());