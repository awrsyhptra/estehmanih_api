const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Import Controller
const ProdukController = require("../controllers/produk_controllers");
const TransaksiController = require("../controllers/transaksi_controllers");

// --- Konfigurasi Multer (Logic Upload) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // File akan disimpan di folder: root_project/public/assets
        // Pastikan folder 'public/assets' sudah dibuat manual!
        cb(null, "public/assets"); 
    },
    filename: function (req, file, cb) {
        // Format nama file: foto-timestamp-angkaacak.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter agar hanya menerima file gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        cb(new Error("Hanya boleh upload file gambar (jpg, jpeg, png, gif)!"));
    }
};

// Inisialisasi Upload
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit maksimal 10MB
});

// --- Routes Produk ---
router.get("/produk", ProdukController.getProduk);

// UPDATE PENTING: Ganti 'image' menjadi 'foto' agar sesuai dengan Frontend
router.post("/produk", upload.single('foto'), ProdukController.createProduk);
router.patch("/produk/:id", upload.single('foto'), ProdukController.updateProduk);

router.delete("/produk/:id", ProdukController.deleteProduk);

// --- Routes Transaksi ---
router.post("/transaksi", TransaksiController.buatPesanan); // Kasir submit pesanan
router.get("/riwayat", TransaksiController.getRiwayat); // Admin lihat riwayat

module.exports = router;