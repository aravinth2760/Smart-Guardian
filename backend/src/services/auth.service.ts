import { Relationship } from "@prisma/client";
import { prisma } from "../prisma/client.js";

interface CompleteProfileDto {
  name: string;
  email: string;
  relationship: Relationship;
}

interface UpdateProfileDto {
  name: string;
  email: string;
  relationship: Relationship;
}

const validateEmail = async (userId: string, email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingEmail = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      NOT: {
        id: userId,
      },
    },
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  return normalizedEmail;
};

export const completeProfile = async (
  userId: string,
  data: CompleteProfileDto,
) => {
  const email = await validateEmail(userId, data.email);

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name.trim(),
      email,
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
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const updateProfile = async (userId: string, data: UpdateProfileDto) => {
  console.log(userId, data);
  const email = await validateEmail(userId, data.email);

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name.trim(),
      email,
      relationship: data.relationship,
    },
    select: {
      id: true,
      familyId: true,
      phone: true,
      name: true,
      email: true,
      relationship: true,
      role: true,
      profileCompleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
