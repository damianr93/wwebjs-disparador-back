import { Router } from 'express';
import { enviarAMultiples } from '../controllers/messageController.js';

const router = Router();

// Ruta: POST /api/enviar-mensaje
router.post('/enviar-mensaje', enviarAMultiples);

export default router;