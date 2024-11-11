-- CreateTable
CREATE TABLE `buku` (
    `id_buku` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_buku` VARCHAR(255) NOT NULL,
    `pengarang` VARCHAR(255) NULL,
    `penerbit` VARCHAR(255) NULL,
    `tahun_terbit` VARCHAR(191) NULL,
    `kategori` VARCHAR(100) NULL,
    `isbn` VARCHAR(20) NULL,
    `status_pinjaman` BOOLEAN NULL DEFAULT false,
    `foto_buku` VARCHAR(255) NULL,

    PRIMARY KEY (`id_buku`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `id_member` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_member` VARCHAR(255) NOT NULL,
    `alamat` VARCHAR(255) NULL,
    `no_telepon` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `tanggal_bergabung` DATE NULL,
    `foto_member` VARCHAR(255) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id_member`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi_pengembalian` (
    `id_transaksi_pengembalian` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi_pinjam` INTEGER NULL,
    `tanggal_pengembalian` DATE NULL,
    `denda` DECIMAL(10, 2) NULL DEFAULT 0.00,

    INDEX `id_transaksi_pinjam`(`id_transaksi_pinjam`),
    PRIMARY KEY (`id_transaksi_pengembalian`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi_pinjam` (
    `id_transaksi_pinjam` INTEGER NOT NULL AUTO_INCREMENT,
    `id_member` INTEGER NULL,
    `id_buku` INTEGER NULL,
    `tanggal_pinjam` DATE NULL,
    `tanggal_jatuh_tempo` DATE NULL,
    `status_pinjam` BOOLEAN NULL DEFAULT true,

    INDEX `id_buku`(`id_buku`),
    INDEX `id_member`(`id_member`),
    PRIMARY KEY (`id_transaksi_pinjam`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaksi_pengembalian` ADD CONSTRAINT `transaksi_pengembalian_ibfk_1` FOREIGN KEY (`id_transaksi_pinjam`) REFERENCES `transaksi_pinjam`(`id_transaksi_pinjam`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transaksi_pinjam` ADD CONSTRAINT `transaksi_pinjam_ibfk_1` FOREIGN KEY (`id_member`) REFERENCES `member`(`id_member`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transaksi_pinjam` ADD CONSTRAINT `transaksi_pinjam_ibfk_2` FOREIGN KEY (`id_buku`) REFERENCES `buku`(`id_buku`) ON DELETE RESTRICT ON UPDATE RESTRICT;
