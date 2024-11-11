const express = require("express");
const path = require('path')

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use("/images", express.static(path.join(__dirname, "images")));

const PORT = 8080;

// Import Routers
const routers = require("./src/routes/routers");

// Router
app.use("/", routers);

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});
