-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('admin', 'customer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'customer';
