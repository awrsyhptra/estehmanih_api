const { DataTypes } = require('sequelize');
const db = require('../config/database');

const DetailPesanan = db.define('detail_pesanan', {
    id_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_pesanan: { type: DataTypes.INTEGER },
    id_produk: { type: DataTypes.INTEGER },
    jumlah: { type: DataTypes.INTEGER },
    harga_satuan: { type: DataTypes.DECIMAL(10, 2) },
    subtotal: { type: DataTypes.DECIMAL(10, 2) }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = DetailPesanan;