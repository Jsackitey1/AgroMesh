require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./src/config');
const { socketLogger, errorLogger, logger } = require('./src/utils/logger');

const server = http.createServer(app);

// Socket.IO configuration with security
const io = new Server(server, {
  cors: config.socket.cors,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

// Make io available to the app
app.set('io', io);

// Socket authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, config.security.jwtSecret);
    socket.userId = decoded.id;
    socket.user = decoded;
    
    socketLogger(socket, 'authenticated', { userId: decoded.id });
    next();
  } catch (error) {
    errorLogger(error, { socketId: socket.id, event: 'authentication' });
    next(new Error('Invalid authentication token'));
  }
};

// Apply authentication middleware
io.use(authenticateSocket);

// Socket.io event handlers
io.on('connection', (socket) => {
  socketLogger(socket, 'connected');
  
  // Send welcome message
  socket.emit('welcome', { 
    message: 'Welcome to AgroMesh real-time!',
    timestamp: new Date().toISOString(),
    userId: socket.userId,
  });
  
  // Handle sensor data subscription
  socket.on('subscribe_sensor', (nodeId) => {
    try {
      socket.join(`sensor_${nodeId}`);
      socketLogger(socket, 'subscribe_sensor', { nodeId });
      
      socket.emit('subscription_confirmed', {
        type: 'sensor',
        nodeId,
        message: `Subscribed to sensor ${nodeId}`,
      });
    } catch (error) {
      errorLogger(error, { socketId: socket.id, event: 'subscribe_sensor', nodeId });
      socket.emit('subscription_error', {
        type: 'sensor',
        nodeId,
        error: 'Failed to subscribe to sensor',
      });
    }
  });
  
  // Handle sensor data unsubscription
  socket.on('unsubscribe_sensor', (nodeId) => {
    try {
      socket.leave(`sensor_${nodeId}`);
      socketLogger(socket, 'unsubscribe_sensor', { nodeId });
      
      socket.emit('unsubscription_confirmed', {
        type: 'sensor',
        nodeId,
        message: `Unsubscribed from sensor ${nodeId}`,
      });
    } catch (error) {
      errorLogger(error, { socketId: socket.id, event: 'unsubscribe_sensor', nodeId });
    }
  });
  
  // Handle alerts subscription
  socket.on('subscribe_alerts', () => {
    try {
      socket.join('alerts');
      socketLogger(socket, 'subscribe_alerts');
      
      socket.emit('subscription_confirmed', {
        type: 'alerts',
        message: 'Subscribed to alerts',
      });
    } catch (error) {
      errorLogger(error, { socketId: socket.id, event: 'subscribe_alerts' });
      socket.emit('subscription_error', {
        type: 'alerts',
        error: 'Failed to subscribe to alerts',
      });
    }
  });
  
  // Handle alerts unsubscription
  socket.on('unsubscribe_alerts', () => {
    try {
      socket.leave('alerts');
      socketLogger(socket, 'unsubscribe_alerts');
      
      socket.emit('unsubscription_confirmed', {
        type: 'alerts',
        message: 'Unsubscribed from alerts',
      });
    } catch (error) {
      errorLogger(error, { socketId: socket.id, event: 'unsubscribe_alerts' });
    }
  });

  // Handle dashboard subscription
  socket.on('subscribe_dashboard', () => {
    try {
      socket.join(`dashboard_${socket.userId}`);
      socketLogger(socket, 'subscribe_dashboard');
      
      socket.emit('subscription_confirmed', {
        type: 'dashboard',
        message: 'Subscribed to dashboard updates',
      });
    } catch (error) {
      errorLogger(error, { socketId: socket.id, event: 'subscribe_dashboard' });
      socket.emit('subscription_error', {
        type: 'dashboard',
        error: 'Failed to subscribe to dashboard',
      });
    }
  });

  // Handle ping/pong for connection health
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });

  socket.on('disconnect', (reason) => {
    socketLogger(socket, 'disconnected', { reason });
  });
  
  // Handle errors
  socket.on('error', (error) => {
    errorLogger(error, { socketId: socket.id, event: 'socket_error' });
  });
});

// Start server
server.listen(config.server.port, () => {
  logger.info('Server started successfully', {
    port: config.server.port,
    environment: config.server.nodeEnv,
    apiUrl: `${config.api.baseUrl}${config.api.prefix}`,
    docsUrl: `${config.api.baseUrl}${config.api.prefix}/docs`,
    socketUrl: config.api.baseUrl,
  });
  
  // Security warnings in production
  if (config.server.isProduction) {
    logger.warn('Production mode - ensure all security settings are configured');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Export io for use in other modules
module.exports = { io }; 
