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

export const getUserSOSSettings = async (userId: string) => {
  let settings = await prisma.sOSSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    settings = await prisma.sOSSettings.create({
      data: {
        userId,
        message: "🚨 I need help! This is an emergency. My live location is being shared. Please contact me immediately.",
        countdown: 5,
        liveLocation: true,
        liveLocationDuration: 30,
        autoCall: true,
        smsBackup: true,
        alertSound: false,
        silentSOS: false,
        flashlightBlink: false,
        vibration: true,
      },
    });
  }

  return settings;
};

export const updateUserSOSSettings = async (userId: string, data: any) => {
  // Ensure we don't accidentally update userId or id
  const { id, userId: _, createdAt, updatedAt, ...updateData } = data;

  return prisma.sOSSettings.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      message: updateData.message || "🚨 I need help! This is an emergency. My live location is being shared. Please contact me immediately.",
      countdown: updateData.countdown ?? 5,
      liveLocation: updateData.liveLocation ?? true,
      liveLocationDuration: updateData.liveLocationDuration ?? 30,
      autoCall: updateData.autoCall ?? true,
      smsBackup: updateData.smsBackup ?? true,
      alertSound: updateData.alertSound ?? false,
      silentSOS: updateData.silentSOS ?? false,
      flashlightBlink: updateData.flashlightBlink ?? false,
      vibration: updateData.vibration ?? true,
    },
  });
};

