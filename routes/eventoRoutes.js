const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { autenticarToken, verificarRol } = require('../middleware/authMiddleware');



router.get('/eventos', eventoController.listar);
router.get('/eventos/:id', eventoController.obtenerPorId);


router.post('/eventos', autenticarToken, verificarRol('admin'), eventoController.crear);
router.put('/eventos/:id', autenticarToken, verificarRol('admin'), eventoController.actualizar);
router.delete('/eventos/:id', autenticarToken, verificarRol('admin'), eventoController.eliminar);


module.exports = router;
