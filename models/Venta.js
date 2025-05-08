const pool = require('../config/database');

class Venta {

  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM venta ORDER BY fecha_venta');
      return rows;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  }


  static async getById(id) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const [rows] = await pool.query('SELECT * FROM venta WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error al obtener venta con ID ${id}:`, error);
      throw error;
    }
  }


  static async create(venta) {
    try {
      const { evento_id, nombre, localidad_id, precio, cantidad_disponible } = venta;


      const [evento] = await pool.query("SELECT id FROM eventos WHERE id = ?", [evento_id]);
      if (!evento.length) {
        throw new Error(`El evento con ID ${evento_id} no existe.`);
      }

      
      const [localidad] = await pool.query("SELECT id FROM localidad WHERE id = ?", [localidad_id]);
      if (!localidad.length) {
        throw new Error(`La localidad con ID ${localidad_id} no existe.`);
      }

      
      const sql = `
        INSERT INTO venta (evento_id, nombre, localidad_id, precio, cantidad_disponible) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const valores = [evento_id, nombre, localidad_id, precio, cantidad_disponible];

      const [result] = await pool.query(sql, valores);
      return result.insertId;
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  }


  static async update(id, venta) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const { nombre, localidad_id, precio, cantidad_disponible } = venta;

 
      const ventaExistente = await Venta.getById(id);
      if (!ventaExistente) {
        throw new Error(`Venta con ID ${id} no encontrada.`);
      }

      const sql = `
        UPDATE venta SET nombre = ?, localidad_id = ?, precio = ?, cantidad_disponible = ? WHERE id = ?
      `;
      const valores = [nombre, localidad_id, precio, cantidad_disponible, id];

      const [result] = await pool.query(sql, valores);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al actualizar venta con ID ${id}:`, error);
      throw error;
    }
  }


  static async delete(id) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const ventaExistente = await Venta.getById(id);
      if (!ventaExistente) {
        throw new Error(`Venta con ID ${id} no encontrada.`);
      }

      const [result] = await pool.query('DELETE FROM venta WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar venta con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Venta;
