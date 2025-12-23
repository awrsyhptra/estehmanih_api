const { DataTypes } = require("sequelize");
const db = require("../config/database");

const RiwayatTransaksi = db.define(
  "riwayat_transaksi", 
  {
    // Sesuaikan nama kolom dengan struktur database Anda di phpMyAdmin
    id_transaksi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total_harga: {
      type: DataTypes.DECIMAL(10, 2),
    },
    tanggal_transaksi: { // Sesuaikan nama kolom tanggal di DB Anda (misal: createdAt, tanggal, dll)
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Tambahkan kolom lain jika ada, misal id_pengguna, status, dll
  },
  {
    freezeTableName: true,
    timestamps: false, // Set true jika tabel punya createdAt & updatedAt otomatis
  }
);

module.exports = RiwayatTransaksi;