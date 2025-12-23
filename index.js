// index.js
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const router = require("./routes/index");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Agar bisa menerima JSON dari body request
app.use(router);
app.use(express.static("public"));

// Test Koneksi Database
(async () => {
  try {
    await db.authenticate();
    console.log("Database Connected... (kasir_usaha_mikro)");
    // db.sync(); // HAPUS/COMMENT baris ini karena kita pakai tabel yg sudah ada
  } catch (error) {
    console.error("Connection Error:", error);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
