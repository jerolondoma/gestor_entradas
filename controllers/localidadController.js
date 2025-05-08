const pool = require('../config/database');

const localidadController = {
  
  async listar(req, res) {
    try {
      const [localidades] = await pool.query("SELECT * FROM localidad ORDER BY nombre_localidad");
      res.json(localidades);
    } catch (error) {
      console.error("Error al obtener localidades:", error);
      res.status(500).json({ error: "Error interno al obtener localidades" });
    }
  },


  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const [localidad] = await pool.query("SELECT * FROM localidad WHERE id = ?", [id]);

      if (!localidad.length) {
        return res.status(404).json({ error: "Localidad no encontrada" });
      }

      res.json(localidad[0]);
    } catch (error) {
      console.error("Error al obtener localidad:", error);
      res.status(500).json({ error: "Error interno al obtener la localidad" });
    }
  },

  async crear(req, res) {
    try {
      const { evento_id, nombre_localidad, precio_localidad } = req.body;

     
      const [evento] = await pool.query("SELECT id FROM eventos WHERE id = ?", [evento_id]);

      if (!evento.length) {
        return res.status(400).json({ error: "El evento seleccionado no existe." });
      }

     
      const sql = `
        INSERT INTO localidad (evento_id, nombre_localidad, precio_localidad) 
        VALUES (?, ?, ?)
      `;
      const valores = [evento_id, nombre_localidad, precio_localidad];

      await pool.query(sql, valores);
      res.status(201).json({ mensaje: "Localidad creada exitosamente" });
    } catch (error) {
      console.error("Error al crear localidad:", error);
      res.status(500).json({ error: "Error interno al crear la localidad" });
    }
  },

  
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nombre_localidad, precio_localidad } = req.body;

     
      const [localidadExistente] = await pool.query("SELECT id FROM localidad WHERE id = ?", [id]);

      if (!localidadExistente.length) {
        return res.status(404).json({ error: "Localidad no encontrada" });
      }

  
      const sql = `
        UPDATE localidad 
        SET nombre_localidad = ?, precio_localidad = ?
        WHERE id = ?
      `;
      const valores = [nombre_localidad, precio_localidad, id];

      await pool.query(sql, valores);
      res.json({ mensaje: "Localidad actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar localidad:", error);
      res.status(500).json({ error: "Error interno al actualizar la localidad" });
    }
  },


  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);

   
      const [localidadExistente] = await pool.query("SELECT id FROM localidad WHERE id = ?", [id]);

      if (!localidadExistente.length) {
        return res.status(404).json({ error: "Localidad no encontrada" });
      }

      await pool.query("DELETE FROM localidad WHERE id = ?", [id]);
      res.json({ mensaje: "Localidad eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar localidad:", error);
      res.status(500).json({ error: "Error interno al eliminar la localidad" });
    }
  }
};

module.exports = localidadController;
