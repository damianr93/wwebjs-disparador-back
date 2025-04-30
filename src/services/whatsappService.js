import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import config from '../config/index.js';

const { Client, LocalAuth } = pkg;

export const client = new Client({
    puppeteer: config.puppeteer,
    authStrategy: new LocalAuth({ clientId: config.whatsappClientId }),
    restartOnAuthFail: true,
    qrMaxRetries: 5,
});

// QR en consola
client.on('qr', qr => { qrcode.generate(qr, { small: true }); });
// Cliente listo
client.on('ready', () => console.log('WhatsApp listo.'));
client.initialize();

/**
 * Envía el mismo texto a todos los números dados.
 * @param {string[]} numeros 
 * @param {string} mensaje    
 */
export async function enviarMensajes(numeros, mensaje) {
    for (const n of numeros) {
        const wid = `549${n}@c.us`;
        await client.sendMessage(wid, mensaje);
    }
}