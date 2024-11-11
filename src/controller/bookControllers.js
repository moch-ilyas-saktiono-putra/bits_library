// Library
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.saveBook = async (req, res) => {
  const {
    judul_buku,
    pengarang,
    penerbit,
    tahun_terbit,
    kategori,
    isbn,
    status_pinjaman,
  } = req.body;

  const foto_buku = req.file.path;

  try {
    const sendData = await prisma.buku.create({
      data: {
        judul_buku: judul_buku,
        pengarang: pengarang,
        penerbit: penerbit,
        tahun_terbit: tahun_terbit,
        kategori: kategori,
        isbn: isbn,
        status_pinjaman: status_pinjaman,
        foto_buku: foto_buku,
      },
    });

    return res.status(200).json({
      messege: "Book succescfully saved",
      data: sendData,
    });
  } catch (error) {
    console.log("error saving book", error);
    return res.status(500).json({
      message: "There was an error saving the book data",
      error: error.message,
    });
  }
};

exports.getAllBook = async (req, res) => {
  try {
    const bookData = await prisma.buku.findMany();

    return res.status(200).json({
      message: "Books fetched successfully",
      data: bookData,
    });
  } catch (error) {
    console.log("Error fetching books:", error);
    return res.status(500).json({
      message: "There was an error fetching the books",
      error: error.message,
    });
  }
};

exports.getBookById = async (req, res) => {
  const bookId = req.params.id;
  try {
    const bookData = await prisma.buku.findUnique({
      where: {
        id_buku: Number(bookId),
      },
    });

    if (bookData) {
      return res.status(200).json({
        message: "Book found successfully",
        data: bookData,
      });
    }

    return res.status(404).json({
      message: "Book not found",
    });
  } catch (error) {
    console.log("Error fetching book by ID", error);
    return res.status(500).json({
      message: "There was an error fetching the book data",
      error: error.message,
    });
  }
};
