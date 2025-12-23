// models/index.js
const Pengguna = require("./pengguna");
const Produk = require("./produk");
const Pesanan = require("./pesanan");
const DetailPesanan = require("./detail_pesanan");
const RiwayatTransaksi = require("./riwayat_transaksi");

// Relasi Pengguna -> Pesanan (1 user banyak pesanan)
Pengguna.hasMany(Pesanan, { foreignKey: "id_pengguna" });
Pesanan.belongsTo(Pengguna, { foreignKey: "id_pengguna" });

// Relasi Pesanan -> DetailPesanan (1 pesanan punya banyak detail item)
Pesanan.hasMany(DetailPesanan, { foreignKey: "id_pesanan" });
DetailPesanan.belongsTo(Pesanan, { foreignKey: "id_pesanan" });

// Relasi Produk -> DetailPesanan (1 produk bisa ada di banyak detail pesanan)
Produk.hasMany(DetailPesanan, { foreignKey: "id_produk" });
DetailPesanan.belongsTo(Produk, { foreignKey: "id_produk" });

module.exports = {
  Pengguna,
  Produk,
  Pesanan,
  DetailPesanan,
  RiwayatTransaksi,
};
