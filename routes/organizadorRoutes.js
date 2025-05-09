const express = require('express');
const router = express.Router();
const organizadorController = require('../controllers/organizadorController');
const { autenticarToken, verificarRol } = require('../middleware/authMiddleware'); 

router.get('/organizadores', organizadorController.listar);
router.get('/organizadores/:id', organizadorController.obtenerPorId);

router.post('/organizadores', autenticarToken, verificarRol('admin'), organizadorController.crear);
router.put('/organizadores/:id', autenticarToken, verificarRol('admin'), organizadorController.actualizar);
router.delete('/organizadores/:id', autenticarToken, verificarRol('admin'), organizadorController.eliminar);

module.exports = router;
