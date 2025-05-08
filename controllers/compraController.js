const pool = require('../config/database');
const Compra = require('../models/Compra');

const compraController = {

  async listar(req, res) {
    try {
      const compras = await Compra.getAll();
      res.json(compras);
    } catch (error) {
      console.error("Error al obtener compras:", error);
      res.status(500).json({ error: "Error interno al obtener compras." });
    }
  },


  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const compra = await Compra.getById(id);

      if (!compra) {
        return res.status(404).json({ error: "Compra no encontrada." });
      }

      res.json(compra);
    } catch (error) {
      console.error("Error al obtener compra:", error);
      res.status(500).json({ error: "Error interno al obtener la compra." });
    }
  },


  async crear(req, res) {
    try {
 
      const usuario_id = req.usuario.id; 
      const { venta_id, cantidad_comprada } = req.body;

      
      const [usuario] = await pool.query("SELECT nombre FROM usuarios WHERE id = ?", [usuario_id]);
      if (!usuario.length) {
        return res.status(400).json({ error: "Usuario no válido." });
      }

      const nombre_usuario = usuario[0].nombre;


      await Compra.create(usuario_id, venta_id, cantidad_comprada, nombre_usuario);

      res.status(201).json({ mensaje: "Compra realizada exitosamente" });
    } catch (error) {
      console.error("Error al registrar compra:", error);
      res.status(500).json({ error: "Error interno al procesar la compra." });
    }
  }
};

module.exports = compraController;
