-- AlterTable
ALTER TABLE "tbl_dosen" ADD COLUMN     "created_by_id" UUID,
ADD COLUMN     "updated_by_id" UUID;

-- AddForeignKey
ALTER TABLE "tbl_dosen" ADD CONSTRAINT "tbl_dosen_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_dosen" ADD CONSTRAINT "tbl_dosen_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;
