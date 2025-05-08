const express = require('express');
const ventaController = require('../controllers/ventaController');
const router = express.Router();


router.get('/ventas', ventaController.listar);
router.get('/ventas/:id', ventaController.obtenerPorId);
router.post('/ventas', ventaController.crear);
router.put('/ventas/:id', ventaController.actualizar);
router.delete('/ventas/:id', ventaController.eliminar);

module.exports = router;
