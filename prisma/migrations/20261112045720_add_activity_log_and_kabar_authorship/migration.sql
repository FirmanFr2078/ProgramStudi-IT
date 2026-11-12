-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('create', 'update', 'delete', 'login', 'login_failed', 'logout', 'error');

-- AlterTable
ALTER TABLE "tbl_kabar" ADD COLUMN     "created_by_id" UUID,
ADD COLUMN     "updated_by_id" UUID;

-- CreateTable
CREATE TABLE "tbl_activity_log" (
    "id_log" BIGSERIAL NOT NULL,
    "actor_id" UUID,
    "actor_nama" VARCHAR(100),
    "actor_username" VARCHAR(50),
    "action" "ActivityAction" NOT NULL,
    "entity" VARCHAR(50),
    "entity_id" VARCHAR(50),
    "deskripsi" VARCHAR(255) NOT NULL,
    "data_lama" JSONB,
    "data_baru" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_activity_log_pkey" PRIMARY KEY ("id_log")
);

-- AddForeignKey
ALTER TABLE "tbl_activity_log" ADD CONSTRAINT "tbl_activity_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kabar" ADD CONSTRAINT "tbl_kabar_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kabar" ADD CONSTRAINT "tbl_kabar_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;
