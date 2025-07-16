require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('welcome', { message: 'Welcome to AgroMesh real-time!' });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`AgroMesh backend (with Socket.io) listening on port ${PORT}`);
});

module.exports = { io }; 
