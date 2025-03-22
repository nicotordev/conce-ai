-- CreateTable
CREATE TABLE "CondorAIFile" (
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

    CONSTRAINT "CondorAIFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CondorAIFile" ADD CONSTRAINT "CondorAIFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
