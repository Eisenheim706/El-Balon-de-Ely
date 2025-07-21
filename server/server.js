const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permite todos los orígenes
    methods: ["GET", "POST"]
  }
});

// Almacén para ubicaciones de pedidos
const pedidos = {};

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Unirse a sala de pedido
  socket.on('unirse_pedido', (pedidoId) => {
    socket.join(pedidoId);
    console.log(`Cliente unido a pedido ${pedidoId}`);
    
    // Enviar última ubicación si existe
    if (pedidos[pedidoId]) {
      socket.emit('actualizacion_ubicacion', pedidos[pedidoId]);
    }
  });

  // Recibir actualizaciones de ubicación
  socket.on('actualizar_ubicacion', (data) => {
    const { pedidoId, lat, lng } = data;
    console.log(`Actualización para ${pedidoId}: ${lat}, ${lng}`);
    
    // Guardar última ubicación
    pedidos[pedidoId] = { lat, lng };
    
    // Transmitir a todos en la sala
    io.to(pedidoId).emit('actualizacion_ubicacion', { pedidoId, lat, lng });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en puerto ${PORT}`);
});