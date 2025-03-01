-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "accessTokenExpires" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT;
