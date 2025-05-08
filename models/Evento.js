const pool = require('../config/database');

class Evento {
 
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM eventos ORDER BY fecha');
      return rows;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  }


  static async getById(id) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const [rows] = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
      return rows.length ? rows[0] : null; 
    } catch (error) {
      console.error(`Error al obtener evento con ID ${id}:`, error);
      throw error;
    }
  }


  static async create(evento) {
    try {
      const { nombre, descripcion, fecha, ubicacion, genero, artista_id, organizador_id } = evento;

    
      const [artista] = await pool.query("SELECT id FROM artistas WHERE id = ?", [artista_id]);
      const [organizador] = await pool.query("SELECT id FROM organizadores WHERE id = ?", [organizador_id]);

      if (!artista.length) {
        throw new Error(`El artista con ID ${artista_id} no existe.`);
      }
      if (!organizador.length) {
        throw new Error(`El organizador con ID ${organizador_id} no existe.`);
      }

   
      const sql = `
        INSERT INTO eventos (nombre, descripcion, fecha, ubicacion, genero, artista_id, organizador_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const valores = [nombre, descripcion, fecha, ubicacion, genero,  artista_id, organizador_id];

      const [result] = await pool.query(sql, valores);
      return result.insertId;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  }

  static async update(id, evento) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

      const { nombre, descripcion, fecha, ubicacion, genero, artista_id, organizador_id } = evento;

  
      const eventoExistente = await Evento.getById(id);
      if (!eventoExistente) {
        throw new Error(`Evento con ID ${id} no encontrado.`);
      }

      const sql = `
        UPDATE eventos 
        SET nombre = ?, descripcion = ?, fecha = ?, ubicacion = ?, genero = ?, artista_id = ?, organizador_id = ?
        WHERE id = ?
      `;
      const valores = [nombre, descripcion, fecha, ubicacion, genero,  artista_id, organizador_id, id];

      const [result] = await pool.query(sql, valores);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al actualizar evento con ID ${id}:`, error);
      throw error;
    }
  }


  static async delete(id) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`ID inválido: ${id}`);
      }

     
      const eventoExistente = await Evento.getById(id);
      if (!eventoExistente) {
        throw new Error(`Evento con ID ${id} no encontrado.`);
      }

      const [result] = await pool.query('DELETE FROM eventos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar evento con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Evento;
