const express = require("express");
const router = express.Router();
const multer = require("multer");

const bookControllers = require("../controller/bookControllers");

// Book
router.get("/book", bookControllers.getBook);

module.exports = router;
