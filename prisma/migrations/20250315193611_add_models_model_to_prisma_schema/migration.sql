-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "inputTokenLimit" INTEGER NOT NULL,
    "outputTokenLimit" INTEGER NOT NULL,
    "supportedGenerationMethods" TEXT[],
    "temperature" DOUBLE PRECISION,
    "topP" DOUBLE PRECISION,
    "topK" INTEGER,
    "maxTemperature" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");
