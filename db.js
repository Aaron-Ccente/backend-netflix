// backend/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ccentejuan06@",
    database: "signup",
    multipleStatements: true
});

module.exports = db;
