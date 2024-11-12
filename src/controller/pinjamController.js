// Library
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Pinjaman
exports.createPeminjaman = async (req, res) => {
  const { id_member, id_buku, durasi_peminjaman } = req.body;

  try {
    const checkMember = await prisma.member.findUnique({
      where: {
        id_member: Number(id_member),
      },
    });

    if (!checkMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const checkBuku = await prisma.buku.findUnique({
      where: {
        id_buku: Number(id_buku),
      },
    });

    if (!checkBuku) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const status = true;
    await prisma.buku.update({
      where: {
        id_buku: Number(id_buku),
      },
      data: {
        status_pinjaman: status,
      },
    });

    const tanggal_pinjam = new Date();

    const tanggal_jatuh_tempo = new Date(tanggal_pinjam);
    tanggal_jatuh_tempo.setTime(
      tanggal_jatuh_tempo.getTime() + durasi_peminjaman * 24 * 60 * 60 * 1000
    );

    const saveData = await prisma.transaksi_pinjam.create({
      data: {
        id_member: Number(id_member),
        nama_member: checkMember.nama_member,
        id_buku: Number(id_buku),
        judul_buku: checkBuku.judul_buku,
        tanggal_pinjam: tanggal_pinjam,
        tanggal_jatuh_tempo: tanggal_jatuh_tempo,
      },
    });

    const upateStatusBuku = await prisma.buku.update({
      where: {
        id_buku: Number(id_buku),
      },
      data: { status_pinjaman: true },
    });

    return res.status(200).json({
      message: "Peminjaman data successfully created",
      data: saveData,
    });
  } catch (error) {
    console.log("Error creating data", error);
    return res.status(500).json({
      message: "There was an error creating peminjaman data",
      error: error.message,
    });
  }
};

// Get all pinjaman
exports.getAllPinjaman = async (req, res) => {
  try {
    const pinjamanData = await prisma.transaksi_pinjam.findMany();

    return res.status(200).json({
      message: "Pinjaman data successfully retreive",
      pinjamanData,
    });
  } catch (error) {
    console.log("Error retreiving data", error);
    return res.status(500).json({
      message: "There was an error retreiving peminjaman data",
      error: error.message,
    });
  }
};

// Get pinjaman by id
exports.getPinjamanById = async (req, res) => {
  const pinjamanId = req.params.id;

  try {
    const detailPinjaman = await prisma.transaksi_pinjam.findUnique({
      where: {
        id_transaksi_pinjam: Number(pinjamanId),
      },
    });

    return res.status(200).json({
      message: "Detail pinjaman successfully retreive",
      detailPinjaman,
    });
  } catch (error) {
    console.log("Error retreiving detail data", error);
    return res.status(500).json({
      message: "There was an error retreiving detail peminjaman",
      error: error.message,
    });
  }
};

// Laporan Peminjaman
exports.peminjamanReport = async (req, res) => {
  const bulanIndonesia = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const { tanggal_mulai, tanggal_akhir } = req.body;

  if (!tanggal_mulai) {
    return res.status(404).json({
      message: "Tanggal mulai required",
    });
  }

  let akhir = "";

  if (!tanggal_akhir) {
    akhir = tanggal_mulai;
  } else {
    akhir = tanggal_akhir;
  }

  try {
    function setStartOfDay(date) {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    }

    function setEndOfDay(date) {
      const newDate = new Date(date);
      newDate.setHours(23, 59, 59, 999);
      return newDate;
    }

    function capitalizeFirstLetter(kata) {
      return kata.charAt(0).toUpperCase() + kata.slice(1);
    }

    function parsing(tanggal) {
      const part = tanggal.split(" ");
      const hari = parseInt(part[0]);
      const bulanCapitalized = capitalizeFirstLetter(part[1]);
      const bulan = bulanIndonesia.indexOf(bulanCapitalized);
      const tahun = parseInt(part[2]);

      const newDate = new Date(tahun, bulan, hari);
      return newDate;
    }

    const tanggalMulai = parsing(tanggal_mulai);
    const tanggalAkhir = parsing(akhir);

    const startDate = setStartOfDay(tanggalMulai);
    const endDate = setEndOfDay(tanggalAkhir);

    const report = await prisma.transaksi_pinjam.findMany({
      where: {
        tanggal_pinjam: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return res.json({
      awal: startDate,
      akhir: endDate,
      report: report,
    });
  } catch (error) {
    console.log("Error processing date", error);
    return res.status(500).json({
      message: "There was an error processing the date",
      error: error.message,
    });
  }
};
