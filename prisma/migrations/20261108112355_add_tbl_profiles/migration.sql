/*
  Warnings:

  - Added the required column `password` to the `tbl_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbl_profiles" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login_at" TIMESTAMPTZ(6),
ADD COLUMN     "password" VARCHAR(255) NOT NULL,
ADD COLUMN     "session_version" INTEGER NOT NULL DEFAULT 1;
