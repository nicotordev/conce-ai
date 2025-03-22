/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CondorAIFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[src]` on the table `CondorAIFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CondorAIFile_name_key" ON "CondorAIFile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CondorAIFile_src_key" ON "CondorAIFile"("src");
