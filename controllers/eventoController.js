const pool = require('../config/database');
const Evento = require('../models/Evento');

const eventoController = {

  async listar(req, res) {
    try {
      const eventos = await Evento.getAll();
      res.json(eventos);
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
      res.status(500).json({ error: "Error al obtener los eventos" });
    }
  },

 
  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const evento = await Evento.getById(id);
      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
      res.json(evento);
    } catch (error) {
      console.error("Error al obtener el evento:", error);
      res.status(500).json({ error: "Error al obtener el evento" });
    }
  },


  async crear(req, res) {
    try {
      console.log("Datos recibidos en el POST:", req.body);
      const { nombre, descripcion, fecha, ubicacion, artista_id, organizador_id } = req.body;

     
      if (!nombre || nombre.length > 100) {
        return res.status(400).json({ error: "El nombre es obligatorio y debe tener máximo 100 caracteres." });
      }

      if (!fecha || isNaN(new Date(fecha))) {
        return res.status(400).json({ error: "La fecha es obligatoria y debe tener un formato válido." });
      }

      const fechaEvento = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaEvento < hoy) {
        return res.status(400).json({ error: "La fecha del evento debe ser en el futuro." });
      }

      if (!ubicacion) {
        return res.status(400).json({ error: "La ubicación es obligatoria." });
      }

      if (!artista_id || isNaN(parseInt(artista_id))) {
        return res.status(400).json({ error: "Debe proporcionarse un artista válido." });
      }

      if (!organizador_id || isNaN(parseInt(organizador_id))) {
        return res.status(400).json({ error: "Debe proporcionarse un organizador válido." });
      }

    
      const [artista] = await pool.query("SELECT genero FROM artistas WHERE id = ?", [artista_id]);

      if (!artista.length) {
        return res.status(400).json({ error: "El artista seleccionado no existe." });
      }

      const genero = artista[0].genero;

     
      const nuevoEvento = {
        nombre,
        descripcion,
        fecha,
        ubicacion,
        genero,
        artista_id,
        organizador_id
      };

      console.log("Datos enviados a Evento.create:", nuevoEvento);

      const insertId = await Evento.create(nuevoEvento);

      res.status(201).json({ mensaje: "Evento creado exitosamente", id: insertId });
    } catch (error) {
      console.error("Error al crear evento:", error);
      res.status(500).json({ error: "Error al crear el evento" });
    }
  },

  async actualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const datosActualizados = req.body;

        const eventoExistente = await Evento.getById(id);
        if (!eventoExistente) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        
        const { nombre, descripcion, fecha, ubicacion, genero, artista_id, organizador_id } = datosActualizados;

        const actualizado = await Evento.update(id, { nombre, descripcion, fecha, ubicacion, genero, artista_id, organizador_id });

        res.json({ mensaje: "Evento actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar evento:", error);
        res.status(500).json({ error: "Error al actualizar el evento" });
    }
}
,

 
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);

      const eventoExistente = await Evento.getById(id);
      if (!eventoExistente) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }

      await Evento.delete(id);
      res.json({ mensaje: "Evento eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      res.status(500).json({ error: "Error al eliminar el evento" });
    }
  }
};

module.exports = eventoController;
