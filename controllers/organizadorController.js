const Organizador = require('../models/Organizador');

const organizadorController = {
  async listar(req, res) {
    try {
      const data = await Organizador.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar organizadores' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const organizador = await Organizador.getById(id);
      if (!organizador) return res.status(404).json({ error: 'No encontrado' });
      res.json(organizador);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener organizador' });
    }
  },

  async crear(req, res) {
    try {
      const nuevoId = await Organizador.create(req.body);
      res.status(201).json({ mensaje: 'Organizador creado', id: nuevoId });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear organizador' });
    }
  },

  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const actualizado = await Organizador.update(id, req.body);
      if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
      res.json({ mensaje: 'Actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar organizador' });
    }
  },

  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const eliminado = await Organizador.delete(id);
      if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
      res.json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar organizador' });
    }
  }
};

module.exports = organizadorController;
  