import { Relationship } from "@prisma/client";
import { prisma } from "../prisma/client.js";

interface CompleteProfileDto {
  name: string;
  email?: string;
  relationship: Relationship;
}

export const completeProfile = async (
  userId: string,
  data: CompleteProfileDto,
) => {
  // Check email already exists
  if (data.email) {
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: userId,
        },
      },
    });

    if (existingEmail) {
      throw new Error("Email already exists");
    }
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name.trim(),
      email: data.email?.trim().toLowerCase(),
      relationship: data.relationship,
      profileCompleted: true,
    },
    select: {
      id: true,
      phone: true,
      name: true,
      email: true,
      relationship: true,
      role: true,
      profileCompleted: true,
      familyId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
