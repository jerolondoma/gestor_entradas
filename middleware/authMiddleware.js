const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';


const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });

    req.usuario = usuario;
    next();
  });
};


const verificarRol = (rolRequerido) => (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ error: "Usuario no autenticado" });

  if (req.usuario.rol !== rolRequerido) {
    return res.status(403).json({ error: "No tienes permisos para esta acción" });
  }

  next();
};

module.exports = { autenticarToken, verificarRol };
