const pool = require('../config/database');

class Organizador {

  static async create(organizador) {
    try {
      const { nombre, email, telefono, descripcion } = organizador;
      const [result] = await pool.query(
        "INSERT INTO organizadores (nombre, email, telefono, descripcion) VALUES (?, ?, ?, ?)",
        [nombre, email, telefono, descripcion]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error al crear organizador:", error);
      throw error;
    }
  }

  
  static async getAll() {
    try {
      const [rows] = await pool.query("SELECT id, nombre, email, telefono, descripcion FROM organizadores");
      return rows;
    } catch (error) {
      console.error("Error al obtener organizadores:", error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query("SELECT id, nombre, email, telefono, descripcion FROM organizadores WHERE id = ?", [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("Error al obtener organizador por ID:", error);
      throw error;
    }
  }


  static async update(id, datosActualizados) {
    try {
      const [result] = await pool.query("UPDATE organizadores SET ? WHERE id = ?", [datosActualizados, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar organizador:", error);
      throw error;
    }
  }


  static async delete(id) {
    try {
      const [result] = await pool.query("DELETE FROM organizadores WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar organizador:", error);
      throw error;
    }
  }
}

module.exports = Organizador;
