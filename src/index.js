import 'dotenv/config';
import express from 'express';
import { loggerMiddleware } from './middlewares/logger.Middleware.js';

import authRoutes from './routers/auth.routes.js';
import libroRoutes from './routers/libro.routes.js';
import prestamoRoutes from './routers/prestamo.routes.js';

const app = express();
app.use(express.json());
app.use(loggerMiddleware);

app.use('/auth', authRoutes);
app.use('/libros', libroRoutes);
app.use('/prestamos', prestamoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose`);
});