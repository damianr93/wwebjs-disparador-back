import express from 'express';
import cors from 'cors';
import mensajeRoutes from './routes/mensaje.routes.js';
import initSocket from './sockets/socket.js';
import config from './config/index.js';
import { client } from './services/whatsappService.js';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', mensajeRoutes);

app.get('/health', (_req, res) => {
    res.status(200).type('text/plain').send('OK');
});

app.use(errorHandler);

const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: '*' } });
initSocket(io);

client.on('message', async msg => {
    const text = (msg.body || '').trim().toLowerCase();
    if (text === 'si') {
        await client.sendMessage(msg.from, 'Gracias por su respuesta!');
    }
});

const PORT = config.port;

httpServer.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} ya esta en uso. Cierra la otra instancia y vuelve a intentarlo.`);
        process.exit(1);
    }
    console.error('Error en HTTP Server:', err);
    process.exit(1);
});

httpServer.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
