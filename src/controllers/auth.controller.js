import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

export const registrar = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const nuevoUsuario = await prisma.usuario.create({
            data: { nombre, email, password: hashedPassword, rol }
        });
        
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuarioId: nuevoUsuario.id });
    } catch (error) {
        res.status(400).json({ error: 'El email ya está registrado o datos inválidos.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(401).json({ error: 'Contraseña incorrecta.' });

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol }, 
        process.env.JWT_SECRET, 
        { expiresIn: '8h' }
    );

    res.json({ token, mensaje: 'Login exitoso' });
};