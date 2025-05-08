const pool = require('../config/database');
const Venta = require('../models/Venta');

const ventaController = {
 
  async listar(req, res) {
    try {
      const ventas = await Venta.getAll();
      res.json(ventas);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      res.status(500).json({ error: "Error interno al obtener las ventas" });
    }
  },

 
  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const venta = await Venta.getById(id);

      if (!venta) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      res.json(venta);
    } catch (error) {
      console.error("Error al obtener venta:", error);
      res.status(500).json({ error: "Error interno al obtener la venta" });
    }
  },

  async crear(req, res) {
    try {
        const { evento_id, localidad_id, cantidad_disponible } = req.body;

        
        const [ventaExistente] = await pool.query(
            "SELECT id FROM venta WHERE evento_id = ? AND localidad_id = ?",
            [evento_id, localidad_id]
        );

        if (ventaExistente.length) {
            return res.status(400).json({ error: "Ya existe una venta para este evento y localidad." });
        }

        
        const [evento] = await pool.query("SELECT nombre FROM eventos WHERE id = ?", [evento_id]);
        if (!evento.length) {
            return res.status(400).json({ error: "El evento seleccionado no existe." });
        }

        const nombreEvento = evento[0].nombre;

        
        const [localidad] = await pool.query("SELECT precio_localidad FROM localidad WHERE id = ?", [localidad_id]);
        if (!localidad.length) {
            return res.status(400).json({ error: "La localidad seleccionada no existe." });
        }

        const precioLocalidad = localidad[0].precio_localidad;

        
        const sql = `
            INSERT INTO venta (evento_id, nombre, localidad_id, precio, cantidad_disponible) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const valores = [evento_id, nombreEvento, localidad_id, precioLocalidad, cantidad_disponible];

        await pool.query(sql, valores);
        res.status(201).json({ mensaje: "Venta creada exitosamente" });
    } catch (error) {
        console.error("Error al crear venta:", error);
        res.status(500).json({ error: "Error interno al crear la venta" });
    }
}

,
 
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = req.body;

      const ventaExistente = await Venta.getById(id);
      if (!ventaExistente) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      const actualizado = await Venta.update(id, datosActualizados);
      res.json({ mensaje: "Venta actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar venta:", error);
      res.status(500).json({ error: "Error interno al actualizar la venta" });
    }
  },

 
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);

      const ventaExistente = await Venta.getById(id);
      if (!ventaExistente) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      await Venta.delete(id);
      res.json({ mensaje: "Venta eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      res.status(500).json({ error: "Error interno al eliminar la venta" });
    }
  }
};

module.exports = ventaController;
