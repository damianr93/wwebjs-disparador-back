import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export default {
    port: toNumber(process.env.PORT, 3001),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        headless: process.env.PUPPETEER_HEADLESS !== 'false',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--single-process'
        ],
        defaultViewport: null,
        timeout: toNumber(process.env.PUPPETEER_TIMEOUT, 60000),
        ignoreHTTPSErrors: true
    },
    whatsappClientId: process.env.WHATSAPP_CLIENT_ID || 'encuestas',
    whatsappReadyTimeout: toNumber(process.env.WHATSAPP_READY_TIMEOUT, 60000),
    mensajeBienvenida: process.env.MENSAJE_BIENVENIDA || '',
    encuestaUrl: process.env.ENCUESTA_URL || ''
};
