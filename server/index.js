require('dotenv').config();
const compression = require("compression");
const express = require("express");
const path = require("path");

const app = express();

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "..", "frontend", "public");

if (process.env.COMPRESSION !== 'false') {
  app.use(compression());
}

app.use(express.static(publicDir));

app.get("/", (_, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
