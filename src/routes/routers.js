const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const upload = multer();

const bookControllers = require("../controller/bookControllers");

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
router.post("/book", uploadImage.single("foto_buku"), bookControllers.saveBook);
router.put("/book/:id", uploadImage.single('foto_buku'),bookControllers.updateBookById);

module.exports = router;
