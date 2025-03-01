/*
  Warnings:

  - The primary key for the `PlannedReleaseSong` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PlannedReleaseSong" DROP CONSTRAINT "PlannedReleaseSong_pkey",
ADD CONSTRAINT "PlannedReleaseSong_pkey" PRIMARY KEY ("plannedReleaseId", "spotifyTrackId");
