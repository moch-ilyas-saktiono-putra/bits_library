// Library
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require('path')
const fs = require('fs')

// Save Book
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

// Get all book
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

// Get detail book
exports.getBookById = async (req, res) => {
  const bookId = req.params.id;
  try {
    const bookData = await prisma.buku.findUnique({
      where: {
        id_buku: Number(bookId),
      },
    });

    if (bookData) {
      const imageUrl = `${req.protocol}://${req.get("host")}/${
        bookData.foto_buku
      }`;

      return res.status(200).json({
        message: "Book found successfully",
        data: { bookData, foto_buku: imageUrl },
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

// Update book
exports.updateBookById = async (req, res) => {
  const bookId = req.params.id;

  const {
    judul_buku,
    pengarang,
    penerbit,
    tahun_terbit,
    kategori,
    isbn,
    status_pinjaman,
  } = req.body;

  const updateData = {};

  try {
    const bookData = await prisma.buku.findUnique({
      where: { id_buku: Number(bookId) },
    });

    if (!bookData) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (judul_buku) {
      updateData.judul_buku = judul_buku;
    }

    if (pengarang) {
      updateData.pengarang = pengarang;
    }

    if (penerbit) {
      updateData.penerbit = penerbit;
    }

    if (tahun_terbit) {
      updateData.tahun_terbit = tahun_terbit;
    }

    if (kategori) {
      updateData.kategori = kategori;
    }

    if (isbn) {
      updateData.isbn = isbn;
    }

    if (status_pinjaman) {
      updateData.status_pinjaman = status_pinjaman;
    }

    if (req.file) {
      updateData.foto_buku = req.file.path;
    }

    const updatedBook = await prisma.buku.update({
      where: {
        id_buku: Number(bookId),
      },
      data: updateData,
    });

    return res.status(200).json({
      message: "Book successfully updated",
      data: updatedBook,
    });
  } catch (error) {
    console.log("Error updating book:", error);
    return res.status(500).json({
      message: "There was an error updating the book data",
      error: error.message,
    });
  }
};

// Delete book
exports.deleteBookById = async (req, res) => {
  const bookId = req.params.id;

  try {
    const deleteData = await prisma.buku.delete({
      where: {
        id_buku: Number(bookId),
      },
    });

    return res.status(200).json({
      message: "Book successfully deleted",
    });
  } catch (error) {
    console.log("Error deleting book:", error);
    return res.status(500).json({
      message: "There was an error deleting the book",
      error: error.message,
    });
  }
};
