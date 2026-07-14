-- AlterTable
ALTER TABLE `ChatMember` ADD COLUMN `lastReadAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `sosEnabled` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `status` ENUM('sent', 'delivered', 'read') NOT NULL DEFAULT 'sent';

-- CreateTable
CREATE TABLE `SOSSettings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `countdown` INTEGER NOT NULL DEFAULT 5,
    `liveLocation` BOOLEAN NOT NULL DEFAULT true,
    `liveLocationDuration` INTEGER NOT NULL DEFAULT 30,
    `autoCall` BOOLEAN NOT NULL DEFAULT true,
    `smsBackup` BOOLEAN NOT NULL DEFAULT true,
    `alertSound` BOOLEAN NOT NULL DEFAULT false,
    `silentSOS` BOOLEAN NOT NULL DEFAULT false,
    `flashlightBlink` BOOLEAN NOT NULL DEFAULT false,
    `vibration` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SOSSettings_userId_key`(`userId`),
    INDEX `SOSSettings_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SOSSettings` ADD CONSTRAINT `SOSSettings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
