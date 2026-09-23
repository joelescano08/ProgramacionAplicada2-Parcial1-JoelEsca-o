import prisma from '../db.js';

export const obtenerLibros = async (req, res) => {
    const libros = await prisma.libro.findMany();
    res.json(libros);
};

export const crearLibro = async (req, res) => {
    const { titulo, autor } = req.body;
    const libro = await prisma.libro.create({
        data: { titulo, autor }
    });
    res.status(201).json(libro);
};

export const eliminarLibro = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.libro.delete({ where: { id: parseInt(id) } });
        res.json({ mensaje: 'Libro eliminado exitosamente.' });
    } catch (error) {
        res.status(404).json({ error: 'Libro no encontrado.' });
    }
};