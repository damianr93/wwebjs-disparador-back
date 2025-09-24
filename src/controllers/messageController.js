import { enviarMensajes, cerrarSesion as cerrarSesionWhatsApp, obtenerEstadoCliente } from '../services/whatsappService.js';

export const enviarAMultiples = async (req, res) => {
    const { numeros, mensaje } = req.body ?? {};

    if (!Array.isArray(numeros) || numeros.length === 0) {
        return res.status(400).json({ success: false, error: 'Se requiere una lista de numeros.' });
    }

    if (typeof mensaje !== 'string' || mensaje.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Se requiere un mensaje de texto no vacio.' });
    }

    try {
        const { enviados, fallidos } = await enviarMensajes(numeros, mensaje.trim());
        const response = {
            success: fallidos.length === 0,
            mensaje: fallidos.length === 0 ? 'Mensajes enviados correctamente.' : 'Mensajes enviados con advertencias.',
            enviados,
            fallidos
        };
        const statusCode = fallidos.length === 0 ? 200 : 207;
        return res.status(statusCode).json(response);
    } catch (err) {
        console.error('Error en controller enviarAMultiples:', err);
        const status = err.statusCode && Number.isFinite(err.statusCode) ? err.statusCode : 500;
        return res.status(status).json({ success: false, error: err.message || 'Error inesperado.' });
    }
};

export const cerrarSesion = async (_req, res) => {
    try {
        await cerrarSesionWhatsApp();
        return res.json({ success: true });
    } catch (err) {
        console.error('Error al cerrar sesion de WhatsApp:', err);
        return res.status(500).json({ success: false, error: err.message || 'No se pudo cerrar la sesion.' });
    }
};

export const obtenerEstado = (_req, res) => {
    return res.json({ success: true, estado: obtenerEstadoCliente() });
};
