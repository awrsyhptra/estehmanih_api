const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Pengguna = db.define('pengguna', {
    id_pengguna: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    nama_lengkap: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('Kasir', 'Admin') }
}, {
    freezeTableName: true, // Agar nama tabel tetap 'pengguna' tidak berubah jadi plural
    timestamps: false      // Karena di SQL pake created_at manual (timestamp), matikan default sequelize
});

module.exports = Pengguna;