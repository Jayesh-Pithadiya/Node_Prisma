import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";
import "dotenv/config";
import process from "node:process";

const prisma = new PrismaClient();

async function migrate() {
  const mongo = new MongoClient(process.env.MONGO_URL!);
  await mongo.connect();

  const db = mongo.db(); // This uses the DB name specified in the MONGO_URL

  console.log("MongoDB connected");
  console.log("Database:", db.databaseName);

  // Get all collections automatically
  const collections = await db.listCollections().toArray();
  console.log("Collections found:", collections.map(c => c.name));

  if (collections.length === 0) {
    console.log("No collections found in MongoDB");
    return;
  }

  // ==============================
  // LOOP THROUGH ALL COLLECTIONS
  // ==============================
  for (const col of collections) {
    const name = col.name;

    console.log(`\nMigrating collection: ${name}`);

    const data = await db.collection(name).find().toArray();

    console.log(`Records found: ${data.length}`);

    if (data.length === 0) continue;

    // ==============================
    // USER COLLECTION
    // ==============================
    if (name.toLowerCase() === "user" || name.toLowerCase() === "users") {
      for (const u of data) {
        if (!u.email) continue;

        await prisma.user.upsert({
          where: { email: u.email },
          update: {
            name: u.name ?? null,
            age: u.age ?? null,
          },
          create: {
            name: u.name ?? null,
            email: u.email,
            age: u.age ?? null,
          },
        });
      }

      console.log(" User migration done");
    }

    // ==============================
    // DEFAULT (optional)
    // ==============================
    else {
      console.log(`Skipping unknown collection: ${name}`);
    }
  }

  await mongo.close();
  await prisma.$disconnect();

  console.log("\nMigration Completed Successfully");
}

migrate().catch((err) => {
  console.error("Migration Error:", err);
});