import { client } from '../services/whatsappService.js';

export default function initSocket(io) {
    client.on('qr', qr => {
        io.emit('qr', qr);
        console.log('Nuevo QR enviado al frontend');
    });
    client.on('ready', () => {
        io.emit('ready', { status: 'ready' });
        console.log('Cliente WhatsApp inicializado');
    });
}
