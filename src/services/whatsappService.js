import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import config from '../config/index.js';

const { Client, LocalAuth } = pkg;

const readyTimeoutMs = config.whatsappReadyTimeout || 60000;

export const client = new Client({
    puppeteer: config.puppeteer,
    authStrategy: new LocalAuth({ clientId: config.whatsappClientId }),
    restartOnAuthFail: true,
    qrMaxRetries: 5
});

let isClientReady = false;
let pendingReadyPromise = null;

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('[WhatsApp] Sesion autenticada.');
});

client.on('ready', () => {
    isClientReady = true;
    pendingReadyPromise = null;
    console.log('[WhatsApp] Cliente listo.');
});

client.on('auth_failure', message => {
    isClientReady = false;
    pendingReadyPromise = null;
    console.error('[WhatsApp] Fallo de autenticacion:', message);
});

client.on('disconnected', reason => {
    isClientReady = false;
    pendingReadyPromise = null;
    console.warn('[WhatsApp] Cliente desconectado:', reason);
    setTimeout(() => client.initialize(), 3000);
});

client.on('loading_screen', (percent, message) => {
    console.log(`[WhatsApp] Pantalla de carga ${percent}% - ${message}`);
});

client.initialize();

const removeListener = (event, handler) => {
    if (typeof client.off === 'function') {
        client.off(event, handler);
    } else {
        client.removeListener(event, handler);
    }
};

function withTimeout(promise, timeoutMs, onTimeout) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            if (onTimeout) {
                onTimeout();
            }
            reject(new Error('Timeout esperando al cliente de WhatsApp.'));
        }, timeoutMs);

        promise
            .then(value => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
    });
}

async function waitForClientReady(timeoutMs = readyTimeoutMs) {
    if (isClientReady) {
        return;
    }

    if (!pendingReadyPromise) {
        pendingReadyPromise = new Promise((resolve, reject) => {
            const cleanup = () => {
                removeListener('ready', onReady);
                removeListener('auth_failure', onAuthFailure);
                removeListener('disconnected', onDisconnected);
                pendingReadyPromise = null;
            };

            const onReady = () => {
                isClientReady = true;
                cleanup();
                resolve();
            };

            const onAuthFailure = message => {
                isClientReady = false;
                cleanup();
                reject(new Error(`Fallo de autenticacion con WhatsApp: ${message || 'sin detalle'}`));
            };

            const onDisconnected = reason => {
                isClientReady = false;
                cleanup();
                reject(new Error(`Cliente de WhatsApp desconectado: ${reason || 'sin detalle'}`));
            };

            client.once('ready', onReady);
            client.once('auth_failure', onAuthFailure);
            client.once('disconnected', onDisconnected);
        });
    }

    await withTimeout(pendingReadyPromise, timeoutMs, () => {
        pendingReadyPromise = null;
    });
}

function normalizeNumber(raw) {
    const digits = String(raw ?? '').replace(/\D/g, '');
    if (!digits) {
        return null;
    }

    let normalized = digits;

    if (normalized.startsWith('549')) {
        normalized = normalized.slice(3);
    } else if (normalized.startsWith('54')) {
        normalized = normalized.slice(2);
    }

    if (normalized.startsWith('9') && normalized.length > 9) {
        normalized = normalized.slice(1);
    }

    if (normalized.length < 6) {
        return null;
    }

    return `549${normalized}`;
}

function normalizeNumbers(numeros = []) {
    const unique = new Map();

    numeros.forEach(raw => {
        const normalized = normalizeNumber(raw);
        if (normalized) {
            unique.set(normalized, String(raw).trim());
        }
    });

    return unique;
}

export async function enviarMensajes(numeros, mensaje) {
    await waitForClientReady();

    const normalized = normalizeNumbers(numeros);
    if (normalized.size === 0) {
        const error = new Error('No se encontraron numeros validos para enviar.');
        error.statusCode = 400;
        throw error;
    }

    const enviados = [];
    const fallidos = [];

    for (const [normalizedNumber, original] of normalized.entries()) {
        const wid = `${normalizedNumber}@c.us`;
        try {
            await client.sendMessage(wid, mensaje);
            enviados.push({ original, numero: normalizedNumber });
        } catch (err) {
            fallidos.push({ original, numero: normalizedNumber, motivo: err.message });
            console.error(`[WhatsApp] Error al enviar a ${normalizedNumber}:`, err);
        }
    }

    return { enviados, fallidos };
}

export async function cerrarSesion() {
    try {
        await client.logout();
    } catch (err) {
        console.warn('[WhatsApp] No se pudo cerrar la sesion:', err);
    } finally {
        isClientReady = false;
        pendingReadyPromise = null;
        setTimeout(() => client.initialize(), 2000);
    }
}

export function obtenerEstadoCliente() {
    return {
        ready: isClientReady,
        info: client.info ?? null
    };
}
