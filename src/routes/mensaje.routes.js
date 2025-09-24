import { Router } from 'express';
import { enviarAMultiples, cerrarSesion, obtenerEstado } from '../controllers/messageController.js';

const router = Router();

router.post('/enviar-mensaje', enviarAMultiples);
router.post('/logout', cerrarSesion);
router.get('/estado', obtenerEstado);

export default router;
