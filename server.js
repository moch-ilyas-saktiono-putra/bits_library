const express = require("express");
const multer = require("multer");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Versi lebih bersih tanpa parameter kosong

const PORT = 8080;

// Import Routers
const routers = require("./src/routes/routers");

// Router
app.use("/", routers);

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});
