import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3001,
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
        timeout: 60000,
        ignoreHTTPSErrors: true
    },
    whatsappClientId: process.env.WHATSAPP_CLIENT_ID || 'encuestas',
    mensajeBienvenida: process.env.MENSAJE_BIENVENIDA || '',
    encuestaUrl: process.env.ENCUESTA_URL || '',
  };