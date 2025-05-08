const Artista = require('../models/Artista');

const artistaController = {
  async listar(req, res) {
    try {
      const artistas = await Artista.getAll();
      res.json(artistas);
    } catch (error) {
      console.error('Error al obtener artistas:', error);
      res.status(500).json({ error: 'Error al obtener artistas' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const artista = await Artista.getById(id);
      if (!artista) return res.status(404).json({ error: 'Artista no encontrado' });
      res.json(artista);
    } catch (error) {
      console.error('Error al obtener artista:', error);
      res.status(500).json({ error: 'Error al obtener artista' });
    }
  },

  async crear(req, res) {
    try {
      const nuevoArtista = req.body;
      const insertId = await Artista.create(nuevoArtista);
      res.status(201).json({ mensaje: 'Artista creado exitosamente', id: insertId });
    } catch (error) {
      console.error('Error al crear artista:', error);
      res.status(500).json({ error: 'Error al crear artista' });
    }
  },

  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = req.body;

      const artistaExistente = await Artista.getById(id);
      if (!artistaExistente) return res.status(404).json({ error: 'Artista no encontrado' });

      await Artista.update(id, datosActualizados);
      res.json({ mensaje: 'Artista actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar artista:', error);
      res.status(500).json({ error: 'Error al actualizar artista' });
    }
  },

  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const eliminado = await Artista.delete(id);
      if (!eliminado) return res.status(404).json({ error: 'Artista no encontrado' });
      res.json({ mensaje: 'Artista eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar artista:', error);
      res.status(500).json({ error: 'Error al eliminar artista' });
    }
  }
};

module.exports = artistaController;
