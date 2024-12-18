-- CreateTable
CREATE TABLE `Endpoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `frequency` INTEGER NOT NULL,
    `lastChecked` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `endpointId` INTEGER NOT NULL,
    `responseTime` INTEGER NOT NULL,
    `responseCode` INTEGER NOT NULL,
    `success` BOOLEAN NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_endpointId_fkey` FOREIGN KEY (`endpointId`) REFERENCES `Endpoint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
