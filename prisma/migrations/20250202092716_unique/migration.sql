/*
  Warnings:

  - You are about to drop the column `title` on the `Submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[worker_id,task_id]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "title";

-- CreateIndex
CREATE UNIQUE INDEX "Submission_worker_id_task_id_key" ON "Submission"("worker_id", "task_id");
