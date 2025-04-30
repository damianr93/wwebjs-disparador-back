import express from 'express';
import cors from 'cors';
import mensajeRoutes from './routes/mensaje.routes.js';
import initSocket from './sockets/socket.js';
import config from './config/index.js';
import { client } from './services/whatsappService.js';  // <-- Importa aquí el client

// --- Express setup ---
const app = express();
app.use(cors());
app.use(express.json());

// Monta tus rutas
app.use('/', mensajeRoutes);

// --- HTTP + Socket.IO ---
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';

const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: '*' } });

// Inicializa los listeners de QR y ready
initSocket(io);

// --- Listener de respuestas de usuarios ---
client.on('message', async msg => {
  const texto = msg.body.trim().toLowerCase();
  if (texto === 'si' || texto === 'sí') {
    await client.sendMessage(msg.from, '¡Gracias por su respuesta!');
  }
});

// --- Arranca el servidor ---
const PORT = config.port;
httpServer.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
