/*
  Warnings:

  - You are about to drop the column `familyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Family` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_familyId_fkey`;

-- DropIndex
DROP INDEX `User_familyId_idx` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `familyId`;

-- DropTable
DROP TABLE `Family`;
