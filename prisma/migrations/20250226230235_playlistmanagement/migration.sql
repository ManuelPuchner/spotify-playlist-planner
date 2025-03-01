-- CreateTable
CREATE TABLE "ManagedPlaylist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spotifyPlaylistId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagedPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedRelease" (
    "id" TEXT NOT NULL,
    "managedPlaylistId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "recurrenceRule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedReleaseSong" (
    "id" TEXT NOT NULL,
    "plannedReleaseId" TEXT NOT NULL,
    "spotifyTrackId" TEXT NOT NULL,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedReleaseSong_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ManagedPlaylist" ADD CONSTRAINT "ManagedPlaylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedRelease" ADD CONSTRAINT "PlannedRelease_managedPlaylistId_fkey" FOREIGN KEY ("managedPlaylistId") REFERENCES "ManagedPlaylist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedReleaseSong" ADD CONSTRAINT "PlannedReleaseSong_plannedReleaseId_fkey" FOREIGN KEY ("plannedReleaseId") REFERENCES "PlannedRelease"("id") ON DELETE CASCADE ON UPDATE CASCADE;
