const mysql = require("mysql2");
const config = require("config");
const user = config.get("server.user");
const pw = config.get("server.password");

// connecting to Database
const db = mysql.createConnection(
    {
      host: "localhost",
      user: user,
      password: pw,
      database: "election",
    },
    console.log("Connected to the election database.")
  );

  module.exports = db;