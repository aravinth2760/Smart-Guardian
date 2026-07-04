import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  await prisma.$connect();
  console.log("✅ MySQL Connected");
};

export default prisma;
