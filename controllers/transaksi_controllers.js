const {
  Pesanan,
  DetailPesanan,
  Produk,
  RiwayatTransaksi,
} = require("../models");

// --- 1. BUAT PESANAN (KASIR) ---
exports.buatPesanan = async (req, res) => {
  try {
    const { id_pengguna, items, metode_pembayaran } = req.body;

    // A. Validasi Stok Sebelum Proses
    for (const item of items) {
      const produkCek = await Produk.findByPk(item.id_produk);
      if (!produkCek) {
        return res
          .status(404)
          .json({ msg: `Produk ID ${item.id_produk} tidak ditemukan` });
      }
      if (produkCek.stok < item.jumlah) {
        return res
          .status(400)
          .json({ msg: `Stok ${produkCek.nama_produk} tidak mencukupi!` });
      }
    }

    // B. Hitung Total Harga
    let totalBayar = 0;
    items.forEach((item) => {
      totalBayar += item.harga * item.jumlah;
    });

    // C. Buat Record di Tabel Pesanan
    const pesananBaru = await Pesanan.create({
      id_pengguna: id_pengguna,
      total_harga: totalBayar,
      metode_pembayaran: metode_pembayaran,
      status: "selesai",
      tanggal_pesanan: new Date(),
    });

    // D. Simpan Detail Item & Kurangi Stok
    for (const item of items) {
      // Simpan ke detail_pesanan
      await DetailPesanan.create({
        id_pesanan: pesananBaru.id_pesanan,
        id_produk: item.id_produk,
        jumlah: item.jumlah,
        harga_satuan: item.harga,
        subtotal: item.harga * item.jumlah,
      });

      // Kurangi Stok Produk
      const produk = await Produk.findByPk(item.id_produk);
      if (produk) {
        await produk.update({ stok: produk.stok - item.jumlah });
      }
    }

    // E. Simpan ke Riwayat Transaksi (Untuk Laporan)
    if (pesananBaru.status === "selesai") {
      await RiwayatTransaksi.create({
        id_pesanan: pesananBaru.id_pesanan,
        tanggal_transaksi: new Date(),
        total_pendapatan: totalBayar,
        // Jika tabel riwayat_transaksi punya kolom 'periode', isi default:
        // periode: "harian",
      });
    }

    res.status(201).json({
      msg: "Transaksi Berhasil",
      id_pesanan: pesananBaru.id_pesanan,
      total: totalBayar,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi Kesalahan Server" });
  }
};

// --- 2. LIHAT RIWAYAT (ADMIN) ---
// --- 2. LIHAT RIWAYAT (ADMIN) ---
// REVISI: Mengambil data langsung dari tabel 'Pesanan' agar lebih akurat
exports.getRiwayat = async (req, res) => {
  try {
    const dataRaw = await Pesanan.findAll({
      include: [
        {
          model: DetailPesanan,
          include: [
            {
              model: Produk,
              attributes: ["nama_produk"], // Ambil nama produk saja
            },
          ],
        },
      ],
      // Urutkan berdasarkan ID Pesanan terbaru (Descending)
      order: [["id_pesanan", "DESC"]],
    });

    // Formatting Data agar sesuai dengan Frontend
    const formattedData = dataRaw.map((item) => {
      return {
        id_transaksi: item.id_pesanan,
        total_harga: item.total_harga,
        // Gunakan tanggal_pesanan atau createdAt dari database
        createdAt: item.tanggal_pesanan || item.createdAt,

        // List Item Belanjaan
        items: item.detail_pesanans.map((d) => ({
          nama_produk: d.produk ? d.produk.nama_produk : "Produk Dihapus",
          jumlah: d.jumlah,
          harga: d.harga_satuan,
        })),
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
