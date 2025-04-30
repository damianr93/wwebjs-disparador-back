import { enviarMensajes } from '../services/whatsappService.js';

export const enviarAMultiples = async (req, res) => {
    const { numeros, mensaje } = req.body;

    // Validaciones
    if (!Array.isArray(numeros) || numeros.length === 0) {
        return res.status(400).json({ error: 'Se requiere una lista de números.' });
    }
    if (typeof mensaje !== 'string' || mensaje.trim().length === 0) {
        return res.status(400).json({ error: 'Se requiere un mensaje de texto no vacío.' });
    }

    try {
        // Llamamos directamente a la función importada
        await enviarMensajes(numeros, mensaje.trim());
        return res.json({ success: true, mensaje: 'Mensajes enviados correctamente.' });
    } catch (err) {
        console.error('Error en controller enviarAMultiples:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};