-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('signup', 'google');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'signup';
