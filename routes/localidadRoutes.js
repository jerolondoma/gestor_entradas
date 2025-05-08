const express = require('express');
const localidadController = require('../controllers/localidadController');
const router = express.Router();


router.get('/localidades', localidadController.listar);
router.get('/localidades/:id', localidadController.obtenerPorId);
router.post('/localidades', localidadController.crear);
router.put('/localidades/:id', localidadController.actualizar);
router.delete('/localidades/:id', localidadController.eliminar);

module.exports = router;
