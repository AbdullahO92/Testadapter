-- CreateTable
CREATE TABLE "Config" (
    "key" VARCHAR(128) NOT NULL,
    "value" VARCHAR(128) NOT NULL,
    "type" VARCHAR(128),

    CONSTRAINT "Config_pkey" PRIMARY KEY ("key")
);
