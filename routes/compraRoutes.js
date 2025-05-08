const express = require('express');
const compraController = require('../controllers/compraController');
const { autenticarToken, verificarRol } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/compras', compraController.listar);
router.get('/compras/:id', compraController.obtenerPorId);
router.post('/compras', autenticarToken, compraController.crear); 

module.exports = router;
