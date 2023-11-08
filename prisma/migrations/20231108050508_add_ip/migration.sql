/*
  Warnings:

  - Added the required column `ip` to the `Mail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mail" ADD COLUMN     "ip" VARCHAR(100) NOT NULL;
