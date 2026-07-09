/*
  Warnings:

  - A unique constraint covering the columns `[privateKey]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Chat` ADD COLUMN `privateKey` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Chat_privateKey_key` ON `Chat`(`privateKey`);
