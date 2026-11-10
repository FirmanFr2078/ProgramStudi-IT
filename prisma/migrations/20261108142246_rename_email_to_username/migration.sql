/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `tbl_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `tbl_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbl_profiles" ADD COLUMN     "username" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_profiles_username_key" ON "tbl_profiles"("username");
