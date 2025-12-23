const { Sequelize } = require("sequelize");

const db = new Sequelize("kasir_usaha_mikro", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  timezone: "+07:00", // WIB
});

module.exports = db;
