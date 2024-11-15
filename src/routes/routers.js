const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const upload = multer();

const bookControllers = require("../controller/bookControllers");
const memberControllers = require("../controller/memberControllers");
const pinjamControllers = require("../controller/pinjamController");
const pengembalianControllers = require("../controller/pengembalianControllers");

// Middleware Save Image
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

const uploadImage = multer({ storage: fileStorage });

// Book Routes
router.get("/book", bookControllers.getAllBook);
router.get("/book/:id", bookControllers.getBookById);
router.get(
  "/detailstokbuku",
  upload.single("none"),
  bookControllers.getDetailStokBuku
);
router.get("/stokbuku", bookControllers.getAllStokBuku)
router.post("/book", uploadImage.single("foto_buku"), bookControllers.saveBook);
router.put(
  "/book/:id",
  uploadImage.single("foto_buku"),
  bookControllers.updateBookById
);
router.delete("/book/:id", bookControllers.deleteBookById);

// Member Routers
router.get("/member", memberControllers.getAllMember);
router.get("/member/:id", memberControllers.getMemberById);
router.post(
  "/member",
  uploadImage.single("foto_member"),
  memberControllers.createMember
);
router.put(
  "/member/:id",
  uploadImage.single("foto_member"),
  memberControllers.updateMemberById
);
router.delete("/member/:id", memberControllers.deleteMemberById);

// Pinjam Routers
router.get("/pinjam", pinjamControllers.getAllPinjaman);
router.get("/pinjam/:id", pinjamControllers.getPinjamanById);
router.get(
  "/reportpeminjaman",
  upload.single("none"),
  pinjamControllers.peminjamanReport
);
router.post(
  "/pinjam",
  upload.single("none"),
  pinjamControllers.createPeminjaman
);

// Pengembalian routers
router.get("/pengembalian", pengembalianControllers.getAllPengembalian);
router.get("/pengembalian/:id", pengembalianControllers.getPengembalianById);
router.get(
  "/pengembalianreport",
  upload.single("none"),
  pengembalianControllers.pengembalianReport
);
router.post(
  "/pengembalian",
  upload.single("none"),
  pengembalianControllers.createPengembalian
);

module.exports = router;
