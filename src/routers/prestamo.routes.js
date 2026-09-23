import express from 'express';
import { pedirPrestado, devolverLibro, obtenerTodosLosPrestamos, obtenerMisPrestamos } from '../controllers/prestamo.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verificarToken, pedirPrestado);
router.put('/:id/devolver', verificarToken, devolverLibro);
router.get('/mis-prestamos', verificarToken, obtenerMisPrestamos);
router.get('/', verificarToken, verificarAdmin, obtenerTodosLosPrestamos);

export default router;