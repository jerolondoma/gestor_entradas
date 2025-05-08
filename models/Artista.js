const pool = require('../config/database');

class Artista {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM artistas ORDER BY nombre');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM artistas WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(artista) {
    const { nombre, genero, nacionalidad, descripcion } = artista;
    const [result] = await pool.query(
      'INSERT INTO artistas (nombre, genero, nacionalidad, descripcion) VALUES (?, ?, ?, ?)',
      [nombre, genero, nacionalidad, descripcion]
    );
    return result.insertId;
  }

  static async update(id, artista) {
    const { nombre, genero, nacionalidad, descripcion } = artista;
    const [result] = await pool.query(
      'UPDATE artistas SET nombre = ?, genero = ?, nacionalidad = ?, descripcion = ? WHERE id = ?',
      [nombre, genero, nacionalidad, descripcion, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM artistas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Artista;
