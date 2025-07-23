// backend/models/userModel.js
import db from '../db.js';

export function createUser({ name, email, password, role, phone }, callback) {
  const sql = 'INSERT INTO persona (`name`, `email`, `password`, `role`, `phone`) VALUES (?, ?, ?, ?, ?)';
  const values = [name, email, password, role, phone];
  db.query(sql, values, callback);
}

export function assignRole(userId, role, callback) {
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

export function loginUser({ email, password }, callback) {
  const sql = "SELECT * FROM persona WHERE `email` = ? AND `password` = ?";
  db.query(sql, [email, password], callback);
}
