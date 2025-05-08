const pool = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
  static async crear({ nombre, email, password, rol = 'usuario' }) {
    const hash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [nombre, email, hash, rol]);
    return result.insertId;
  }

  static async buscarPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows.length ? rows[0] : null;
  }
}

module.exports = Usuario;
