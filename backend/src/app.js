const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

// Import centralized configuration
const config = require('./config');
const swaggerSpec = require('./config/swagger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { requestLogger, logger } = require('./utils/logger');

// Import routes
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');
const sensorRoutes = require('./routes/sensors');
const alertRoutes = require('./routes/alerts');
const dashboardRoutes = require('./routes/dashboard');
const videoRoutes = require('./routes/videos');

// Import database connection
const connectDB = require('./config/mongoose');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors(config.cors));

// Request logging middleware (before other middleware)
app.use(requestLogger);

// Logging middleware
app.use(morgan(config.logging.format, {
  stream: {
    write: (message) => {
      logger.info('HTTP Request', { message: message.trim() });
    },
  },
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: swaggerSpec.customCss,
  customSiteTitle: swaggerSpec.customSiteTitle,
}));

// API routes
app.use(`${config.api.prefix}/auth`, authRoutes);
app.use(`${config.api.prefix}/sensors`, sensorRoutes);
app.use(`${config.api.prefix}/alerts`, alertRoutes);
app.use(`${config.api.prefix}/dashboard`, dashboardRoutes);
app.use(`${config.api.prefix}/ai`, aiRoutes);
app.use(`${config.api.prefix}/videos`, videoRoutes);

// Health check endpoint
app.get(`${config.api.prefix}/health`, (req, res) => {
  logger.info('Health check requested', {
    requestId: req.headers['x-request-id'],
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: config.api.version,
    environment: config.server.nodeEnv,
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
