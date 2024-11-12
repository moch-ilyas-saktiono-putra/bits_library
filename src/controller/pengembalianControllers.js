// Library
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create pengembalian
exports.createPengembalian = async (req, res) => {
  const { id_member, id_buku, id_transaksi_pinjam } = req.body;

  if (!id_member || !id_buku || !id_transaksi_pinjam) {
    return res.status(400).json({
      message: "Member, Buku, and Transaksi are required",
    });
  }

  try {
    const dataPeminjaman = await prisma.transaksi_pinjam.findUnique({
      where: { id_transaksi_pinjam: Number(id_transaksi_pinjam) },
    });

    if (!dataPeminjaman) {
      return res.status(404).json({ message: "Data peminjaman not found" });
    }

    if (
      dataPeminjaman.id_member !== Number(id_member) ||
      dataPeminjaman.id_buku !== Number(id_buku)
    ) {
      return res.status(404).json({
        message: "Invalid member or book for this transaction",
      });
    }

    const checkDenda =
      new Date(dataPeminjaman.tanggal_jatuh_tempo) - new Date();
    const selisihHari = Math.floor(checkDenda / (1000 * 60 * 60 * 24));
    const denda = selisihHari < 0 ? selisihHari * 10000 : 0;

    const tanggal_pengembalian = new Date();

    const createNotaPengembalian = await prisma.transaksi_pengembalian.create({
      data: {
        id_transaksi_pinjam: Number(id_transaksi_pinjam),
        id_member: Number(id_member),
        nama_member: dataPeminjaman.nama_member,
        id_buku: Number(id_buku),
        judul_buku: dataPeminjaman.judul_buku,
        tanggal_pengembalian: tanggal_pengembalian,
        denda: denda,
      },
    });

    const updateStatus = await prisma.transaksi_pinjam.update({
      where: { id_transaksi_pinjam: Number(id_transaksi_pinjam) },
      data: { status_pinjam: false },
    });

    const upateStatusBuku = await prisma.buku.update({
      where: {
        id_buku: Number(id_buku),
      },
      data: { status_pinjaman: false },
    });

    return res.status(200).json({
      message: "Data pengembalian successfully created",
      data: createNotaPengembalian,
    });
  } catch (error) {
    console.log("Error creating data", error);
    return res.status(500).json({
      message: "There was an error creating the data",
      error: error.message,
    });
  }
};

// Get all pinjaman
exports.getAllPengembalian = async (req, res) => {
  try {
    const pengembalianData = await prisma.transaksi_pengembalian.findMany();

    return res.status(200).json({
      message: "Pengembalian data successfully retreive",
      pengembalianData,
    });
  } catch (error) {
    console.log("Error retreiving data", error);
    return res.status(500).json({
      message: "There was an error retreiving pengembalian data",
      error: error.message,
    });
  }
};

// Get pinjaman by id
exports.getPengembalianById = async (req, res) => {
  const pengembalianId = req.params.id;

  try {
    const detailPengembalian = await prisma.transaksi_pengembalian.findUnique({
      where: {
        id_transaksi_pengembalian: Number(pengembalianId),
      },
    });

    return res.status(200).json({
      message: "Detail pengembalian successfully retreive",
      detailPengembalian,
    });
  } catch (error) {
    console.log("Error retreiving detail data", error);
    return res.status(500).json({
      message: "There was an error retreiving detail pengembalian",
      error: error.message,
    });
  }
};
