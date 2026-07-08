import { prisma } from "../prisma/client.js";

export const checkContacts = async (phones: string[]) => {
  return prisma.user.findMany({
    where: {
      phone: {
        in: phones,
      },
    },
    select: {
      id: true,
      name: true,
      phone: true,
    },
  });
};
