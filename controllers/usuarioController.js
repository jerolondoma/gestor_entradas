const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

const usuarioController = {
  async registrar(req, res) {
    const { nombre, email, password, rol } = req.body;

    try {
      const existe = await Usuario.buscarPorEmail(email);
      if (existe) return res.status(400).json({ error: 'El email ya está registrado' });

      const id = await Usuario.crear({ nombre, email, password, rol });
      res.status(201).json({ mensaje: 'Usuario registrado', id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el registro' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

      const valido = await bcrypt.compare(password, usuario.password);
      if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
        JWT_SECRET,
        { expiresIn: '4h' }
      );

      res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el login' });
    }
  }
};

module.exports = usuarioController;
