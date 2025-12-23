const { Produk } = require("../models");
const fs = require("fs");
const path = require("path");

// --- 1. TAMBAH PRODUK (CREATE) ---
exports.createProduk = async (req, res) => {
  // Cek apakah ada file yang diupload
  if (!req.file)
    return res.status(400).json({ msg: "Harap upload gambar produk!" });

  // Ambil data teks dari body dan nama file dari req.file
  const { nama_produk, harga, stok, kategori } = req.body;
  const foto = req.file.filename; // Nama file yang digenerate Multer

  try {
    await Produk.create({
      nama_produk: nama_produk,
      harga: harga,
      stok: stok,
      kategori: kategori,
      foto: foto, // Simpan nama file ke database
      is_available: true, // Default true agar produk langsung tampil
    });
    res.status(201).json({ msg: "Produk Berhasil Ditambahkan" });
  } catch (error) {
    console.log(error); // Log error ke terminal
    res.status(500).json({ msg: error.message });
  }
};

// --- 2. UPDATE PRODUK ---
exports.updateProduk = async (req, res) => {
  try {
    const produk = await Produk.findOne({
      where: { id_produk: req.params.id },
    });
    if (!produk) return res.status(404).json({ msg: "Produk tidak ditemukan" });

    let namaFoto = produk.foto; // Default: pakai foto lama

    // Jika user upload foto baru
    if (req.file) {
      namaFoto = req.file.filename; // Pakai foto baru

      // Hapus foto lama dari folder (Opsional tapi disarankan agar hemat storage)
      const oldPath = path.join(__dirname, "../public/assets", produk.foto);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await Produk.update(
      {
        nama_produk: req.body.nama_produk,
        harga: req.body.harga,
        stok: req.body.stok,
        kategori: req.body.kategori,
        foto: namaFoto,
      },
      {
        where: { id_produk: req.params.id },
      }
    );

    res.status(200).json({ msg: "Produk Berhasil Diupdate" });
  } catch (error) {
    console.log(error); // Log error ke terminal
    res.status(500).json({ msg: error.message });
  }
};

// --- 3. HAPUS PRODUK ---
exports.deleteProduk = async (req, res) => {
  try {
    const produk = await Produk.findOne({
      where: { id_produk: req.params.id },
    });
    if (!produk) return res.status(404).json({ msg: "Produk tidak ditemukan" });

    // Hapus file fisik di folder public/assets
    if (produk.foto) {
      const filepath = path.join(__dirname, "../public/assets", produk.foto);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    // Hapus data di database
    await Produk.destroy({ where: { id_produk: req.params.id } });
    res.status(200).json({ msg: "Produk Berhasil Dihapus" });
  } catch (error) {
    console.log(error); // Log error ke terminal
    res.status(500).json({ msg: error.message });
  }
};

// --- 4. GET PRODUK ---
exports.getProduk = async (req, res) => {
  try {
    const response = await Produk.findAll();

    // Mapping agar frontend menerima Full URL siap pakai
    const data = response.map((item) => {
      return {
        ...item.dataValues,
        foto: item.foto
          ? `${req.protocol}://${req.get("host")}/assets/${item.foto}`
          : null,
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error); // Log error ke terminal
    res.status(500).json({ msg: error.message });
  }
};