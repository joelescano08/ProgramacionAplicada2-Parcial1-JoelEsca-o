import prisma from '../db.js';

export const pedirPrestado = async (req, res) => {
    const { libroId } = req.body;
    const usuarioId = req.usuario.id;

    try {
        const resultado = await prisma.$transaction(async (tx) => {
            const libro = await tx.libro.findUnique({ where: { id: parseInt(libroId) } });
            
            if (!libro){
                res.status(404).json({error: "Libro no encontrado"})
            } 
            if (!libro.disponible){
                res.status(404).json({error: "El libro no esta adisponible"})}
                

            const prestamo = await tx.prestamo.create({
                data: { usuarioId, libroId: parseInt(libroId) }
            });

            await tx.libro.update({
                where: { id: parseInt(libroId) },
                data: { disponible: false }
            });

            return prestamo;
        });

        res.status(201).json({ mensaje: 'Libro prestado exitosamente', resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const devolverLibro = async (req, res) => {
    const { id } = req.params; 
    const usuarioId = req.usuario.id;

    try {
        const prestamo = await prisma.prestamo.findUnique({ where: { id: parseInt(id) } });
        
        if (!prestamo) return res.status(404).json({ error: 'Préstamo no encontrado' });
        if (prestamo.usuarioId !== usuarioId) return res.status(403).json({ error: 'No puedes devolver un préstamo que no es tuyo' });
        if (prestamo.fechaFin) return res.status(400).json({ error: 'Este libro ya fue devuelto' });

        await prisma.$transaction([
            prisma.prestamo.update({
                where: { id: parseInt(id) },
                data: { fechaFin: new Date() }
            }),
            prisma.libro.update({
                where: { id: prestamo.libroId },
                data: { disponible: true }
            })
        ]);

        res.json({ mensaje: 'Libro devuelto exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerTodosLosPrestamos = async (req, res) => {
    const prestamos = await prisma.prestamo.findMany({ include: { libro: true, usuario: true } });
    res.json(prestamos);
};

export const obtenerMisPrestamos = async (req, res) => {
    const usuarioId = req.usuario.id;
    const prestamos = await prisma.prestamo.findMany({
        where: { usuarioId },
        include: { libro: true }
    });
    res.json(prestamos);
};