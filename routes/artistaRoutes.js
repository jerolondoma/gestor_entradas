const express = require('express');
const router = express.Router();
const artistaController = require('../controllers/artistaController');
const { autenticarToken, verificarRol } = require('../middleware/authMiddleware'); 


router.get('/artistas', artistaController.listar);
router.get('/artistas/:id', artistaController.obtenerPorId);


router.post('/artistas', autenticarToken, verificarRol('admin'), artistaController.crear);
router.put('/artistas/:id', autenticarToken, verificarRol('admin'), artistaController.actualizar);
router.delete('/artistas/:id', autenticarToken, verificarRol('admin'), artistaController.eliminar);

module.exports = router;
