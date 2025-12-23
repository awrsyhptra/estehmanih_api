const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Produk = db.define(
  "produk",
  {
    id_produk: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_produk: { type: DataTypes.STRING },
    harga: { type: DataTypes.DECIMAL(10, 2) },
    kategori: {
      type: DataTypes.ENUM("esteh", "teh", "squash", "latte"),
      defaultValue: "esteh",
    },
    foto: { type: DataTypes.STRING },
    stok: { type: DataTypes.INTEGER },
    is_available: { type: DataTypes.BOOLEAN },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Produk;
