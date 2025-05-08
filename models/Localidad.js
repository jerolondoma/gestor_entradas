const pool = require('../config/database');

class Localidad {
 
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM localidad ORDER BY nombre_localidad');
      return rows;
    } catch (error) {
      console.error('Error al obtener localidades:', error);
      throw error;
    }
  }

  
  static async getById(id) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const [rows] = await pool.query('SELECT * FROM localidad WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error al obtener localidad con ID ${id}:`, error);
      throw error;
    }
  }

  
  static async create(localidad) {
    try {
      const { evento_id, nombre_localidad, precio_localidad } = localidad;

      const sql = `
        INSERT INTO localidad (evento_id, nombre_localidad, precio_localidad) 
        VALUES (?, ?, ?)
      `;
      const valores = [evento_id, nombre_localidad, precio_localidad];

      const [result] = await pool.query(sql, valores);
      return result.insertId;
    } catch (error) {
      console.error('Error al crear localidad:', error);
      throw error;
    }
  }

  static async update(id, localidad) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const { nombre_localidad, precio_localidad } = localidad;

      const sql = `
        UPDATE localidad SET nombre_localidad = ?, precio_localidad = ? WHERE id = ?
      `;
      const valores = [nombre_localidad, precio_localidad, id];

      const [result] = await pool.query(sql, valores);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al actualizar localidad con ID ${id}:`, error);
      throw error;
    }
  }


  static async delete(id) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const [result] = await pool.query('DELETE FROM localidad WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar localidad con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Localidad;
