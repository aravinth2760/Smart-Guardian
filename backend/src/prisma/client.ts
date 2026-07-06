import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDb = async () => {
  await prisma.$connect();
  console.log("DB Connected");
};
