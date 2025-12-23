const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Pesanan = db.define(
  "pesanan",
  {
    id_pesanan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pengguna: { type: DataTypes.INTEGER },
    tanggal_pesanan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total_harga: { type: DataTypes.DECIMAL(10, 2) },
    metode_pembayaran: { type: DataTypes.ENUM("Tunai", "QRIS") },
    status: { type: DataTypes.ENUM("pending", "selesai", "batal") },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Pesanan;
