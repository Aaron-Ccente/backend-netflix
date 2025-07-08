// backend/models/userModel.js
const db = require('../db');

function createUser({ name, email, password, role }, callback) {
  const sql = 'INSERT INTO persona (`name`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)';
  const values = [name, email, password, role];
  db.query(sql, values, callback);
}

function assignRole(userId, role, callback) {
  let roleSql = '';
  if (role === 'administrador') {
    roleSql = 'INSERT INTO admin (`id_persona`) VALUES (?)';
  } else if (role === 'usuario') {
    roleSql = 'INSERT INTO user (`id_persona`) VALUES (?)';
  } else {
    return callback(new Error('Invalid role'));
  }
  db.query(roleSql, [userId], callback);
}

function loginUser({ email, password }, callback) {
  const sql = "SELECT * FROM persona WHERE `email` = ? AND `password` = ?";
  db.query(sql, [email, password], callback);
}

module.exports = {
  createUser,
  assignRole,
  loginUser,
};
