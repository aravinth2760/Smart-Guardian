/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Chat` ADD COLUMN `inviteCode` VARCHAR(191) NULL,
    ADD COLUMN `inviteEnabled` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT 'Safety Circle';

-- AlterTable
ALTER TABLE `ChatMember` ADD COLUMN `role` ENUM('owner', 'member') NOT NULL DEFAULT 'member';

-- CreateTable
CREATE TABLE `JoinRequest` (
    `id` VARCHAR(191) NOT NULL,
    `chatId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `respondedAt` DATETIME(3) NULL,

    INDEX `JoinRequest_chatId_idx`(`chatId`),
    INDEX `JoinRequest_userId_idx`(`userId`),
    INDEX `JoinRequest_status_idx`(`status`),
    UNIQUE INDEX `JoinRequest_chatId_userId_key`(`chatId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Chat_inviteCode_key` ON `Chat`(`inviteCode`);

-- AddForeignKey
ALTER TABLE `JoinRequest` ADD CONSTRAINT `JoinRequest_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JoinRequest` ADD CONSTRAINT `JoinRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
