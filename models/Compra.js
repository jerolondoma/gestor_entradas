const pool = require('../config/database');

class Compra {

  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM compra ORDER BY fecha_compra DESC');
      return rows;
    } catch (error) {
      console.error('Error al obtener compras:', error);
      throw error;
    }
  }


  static async getById(id) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const [rows] = await pool.query('SELECT * FROM compra WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error al obtener compra con ID ${id}:`, error);
      throw error;
    }
  }


  static async create(usuario_id, venta_id, cantidad_comprada, nombre_usuario) {
    try {
     
      const [venta] = await pool.query("SELECT cantidad_disponible FROM venta WHERE id = ?", [venta_id]);
      if (!venta.length) {
        throw new Error("La venta seleccionada no existe.");
      }

      const cantidadDisponible = venta[0].cantidad_disponible;

      
      if (cantidad_comprada > cantidadDisponible) {
        throw new Error("No hay suficientes entradas disponibles.");
      }

      // ✅ Registrar la compra
      const sql = `
        INSERT INTO compra (usuario_id, venta_id, nombre_usuario, cantidad_comprada) 
        VALUES (?, ?, ?, ?)
      `;
      const valores = [usuario_id, venta_id, nombre_usuario, cantidad_comprada];

      await pool.query(sql, valores);

    
      await pool.query("UPDATE venta SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?", [cantidad_comprada, venta_id]);

      return true;
    } catch (error) {
      console.error('Error al registrar compra:', error);
      throw error;
    }
  }
}

module.exports = Compra;
