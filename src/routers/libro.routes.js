import express from 'express';
import { obtenerLibros, crearLibro, eliminarLibro } from '../controllers/libro.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verificarToken, obtenerLibros);
router.post('/', verificarToken, verificarAdmin, crearLibro);
router.delete('/:id', verificarToken, verificarAdmin, eliminarLibro);

export default router;