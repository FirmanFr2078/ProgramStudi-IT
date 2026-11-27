-- AlterEnum
ALTER TYPE "ActivityAction" ADD VALUE 'forbidden';

-- CreateIndex
CREATE INDEX "tbl_activity_log_entity_entity_id_idx" ON "tbl_activity_log"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "tbl_activity_log_actor_id_idx" ON "tbl_activity_log"("actor_id");
