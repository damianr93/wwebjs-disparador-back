import { client } from '../services/whatsappService.js';

let listenersRegistered = false;

export default function initSocket(io) {
    if (listenersRegistered) {
        return;
    }

    listenersRegistered = true;

    client.on('qr', qr => {
        io.emit('qr', qr);
        console.log('Nuevo QR enviado al frontend');
    });

    client.on('ready', () => {
        io.emit('ready', { status: 'ready' });
        console.log('Cliente WhatsApp inicializado');
    });

    client.on('authenticated', () => {
        io.emit('authenticated');
        console.log('Cliente WhatsApp autenticado');
    });

    client.on('auth_failure', message => {
        io.emit('auth_failure', { message });
        console.error('Fallo de autenticacion de WhatsApp:', message);
    });

    client.on('disconnected', reason => {
        io.emit('logged_out', { reason });
        console.warn('Cliente WhatsApp desconectado:', reason);
    });

    client.on('change_state', state => {
        io.emit('state_change', state);
    });
}
