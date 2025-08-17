const path = require('path');

// Environment configuration
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5001,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  },

  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agromesh',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Security configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: 12,
  },

  // CORS configuration
  cors: {
    origins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : [
          'http://localhost:3000',
          'http://localhost:19006',
          'http://localhost:19000',
          'exp://localhost:19000',
          'exp://192.168.1.92:19000',
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  },

  // Socket.IO configuration
  socket: {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN 
        ? process.env.SOCKET_CORS_ORIGIN.split(',').map(origin => origin.trim())
        : ['http://localhost:3000', 'http://localhost:19006'],
      credentials: true,
    },
  },

  // API configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5001',
    version: '1.0.0',
    prefix: '/api',
  },

  // Swagger configuration
  swagger: {
    title: 'AgroMesh Backend API',
    version: '1.0.0',
    description: 'API documentation for AgroMesh AI endpoints',
    servers: [
      { 
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:5001', 
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Local server' 
      },
    ],
    apis: ['./src/routes/*.js'],
  },

  // File upload configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'],
    uploadDir: path.join(__dirname, '../../uploads'),
  },

  // External services
  services: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-pro',
    },
  },

  // Sensor configuration defaults
  sensors: {
    thresholds: {
      soilMoisture: {
        min: 20,
        max: 80,
      },
      temperature: {
        min: 10,
        max: 35,
      },
      ph: {
        min: 5.5,
        max: 7.5,
      },
    },
    status: {
      online: 'online',
      offline: 'offline',
      maintenance: 'maintenance',
      error: 'error',
    },
    soilTypes: ['sandy', 'clay', 'loamy', 'silty', 'unknown'],
    irrigationTypes: ['drip', 'sprinkler', 'flood', 'manual', 'none'],
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  },
};

// Validation function to ensure required config is present
const validateConfig = () => {
  const required = [
    'database.uri',
    'security.jwtSecret',
  ];

  const missing = required.filter(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config);
    return !value;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }

  // Warn about development settings in production
  if (config.server.isProduction) {
    if (config.security.jwtSecret === 'your-secret-key-change-in-production') {
      console.warn('⚠️  WARNING: Using default JWT secret in production!');
    }
    if (config.cors.origins.includes('*')) {
      console.warn('⚠️  WARNING: CORS is set to allow all origins in production!');
    }
  }
};

// Initialize and validate configuration
validateConfig();

module.exports = config;
