/*
  Warnings:

  - You are about to drop the `CondorAIFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AppSuggestionIcon" AS ENUM ('PENSANDO', 'ALEGRE', 'MISTERIOSO', 'TECNOLOGICO', 'CREATIVO');

-- DropForeignKey
ALTER TABLE "CondorAIFile" DROP CONSTRAINT "CondorAIFile_userId_fkey";

-- DropTable
DROP TABLE "CondorAIFile";

-- CreateTable
CREATE TABLE "ConceAIFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "previewSrc" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "nameWithoutExtension" TEXT NOT NULL,
    "sizeInMB" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ConceAIFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSuggestion" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" "AppSuggestionIcon" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConceAIFile_name_key" ON "ConceAIFile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ConceAIFile_src_key" ON "ConceAIFile"("src");

-- AddForeignKey
ALTER TABLE "ConceAIFile" ADD CONSTRAINT "ConceAIFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
