require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./src/config');

const server = http.createServer(app);

// Socket.IO configuration with security
const io = new Server(server, {
  cors: config.socket.cors,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

// Make io available to the app
app.set('io', io);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Send welcome message
  socket.emit('welcome', { 
    message: 'Welcome to AgroMesh real-time!',
    timestamp: new Date().toISOString(),
  });
  
  // Handle authentication
  socket.on('authenticate', (data) => {
    // TODO: Implement socket authentication
    console.log('Socket authentication requested:', socket.id);
  });
  
  // Handle sensor data subscription
  socket.on('subscribe_sensor', (nodeId) => {
    socket.join(`sensor_${nodeId}`);
    console.log(`Socket ${socket.id} subscribed to sensor ${nodeId}`);
  });
  
  // Handle sensor data unsubscription
  socket.on('unsubscribe_sensor', (nodeId) => {
    socket.leave(`sensor_${nodeId}`);
    console.log(`Socket ${socket.id} unsubscribed from sensor ${nodeId}`);
  });
  
  // Handle alerts subscription
  socket.on('subscribe_alerts', () => {
    socket.join('alerts');
    console.log(`Socket ${socket.id} subscribed to alerts`);
  });
  
  // Handle alerts unsubscription
  socket.on('unsubscribe_alerts', () => {
    socket.leave('alerts');
    console.log(`Socket ${socket.id} unsubscribed from alerts`);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Start server
server.listen(config.server.port, () => {
  console.log(`✅ AgroMesh backend server started`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log(`🚀 Server running on port ${config.server.port}`);
  console.log(`🌐 API available at: http://localhost:${config.server.port}${config.api.prefix}`);
  console.log(`📚 API Documentation: http://localhost:${config.server.port}${config.api.prefix}/docs`);
  console.log(`🔌 Socket.IO available at: http://localhost:${config.server.port}`);
  console.log(`💾 Database: ${config.database.uri.replace(/\/\/.*@/, '//***:***@')}`);
  
  // Security warnings in production
  if (config.server.isProduction) {
    console.log(`⚠️  Production mode - ensure all security settings are configured`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Export io for use in other modules
module.exports = { io }; 
