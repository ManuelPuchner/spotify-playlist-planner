/*
  Warnings:

  - The primary key for the `PlannedReleaseSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PlannedReleaseSong` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlannedReleaseSong" DROP CONSTRAINT "PlannedReleaseSong_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PlannedReleaseSong_pkey" PRIMARY KEY ("spotifyTrackId");
