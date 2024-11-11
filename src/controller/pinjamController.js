// Library
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
