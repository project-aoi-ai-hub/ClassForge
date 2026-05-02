import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

async function checkUser() {
  const connectionString = process.env.DATABASE_URL;
  console.log("Connecting to:", connectionString?.replace(/:[^:@]+@/, ":****@"));
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.findUnique({
      where: { email: "admin@classforge.jp" },
    });

    if (!user) {
      console.log("User NOT found in database.");
      return;
    }

    console.log("User found:", user.email);
    console.log("Name in DB:", user.name);
    console.log("Role:", user.role);
    console.log("Has password hash:", !!user.passwordHash);

    if (user.passwordHash) {
      const isValid = await bcrypt.compare("admin123", user.passwordHash);
      console.log("Test bcrypt compare with 'admin123':", isValid);
    }
  } catch (error) {
    console.error("Error during check:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkUser();
