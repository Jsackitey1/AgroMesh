const path = require('path');
const { validateEnv } = require('./validation');

// Validate environment variables first
const env = validateEnv();

const parseOrigins = (originsString) => {
  if (!originsString) {
    return [];
  }

  return originsString
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const resolveBaseUrl = (providedUrl, port) => {
  if (providedUrl && providedUrl.trim().length > 0) {
    return providedUrl;
  }

  return `http://localhost:${port}`;
};

// Environment configuration
const config = {
  // Server configuration
  server: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
    isTest: env.NODE_ENV === 'test',
  },

  // Database configuration
  database: {
    uri: env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Security configuration
  security: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    bcryptRounds: 12,
  },

  // CORS configuration
  cors: {
    origins: parseOrigins(env.CORS_ORIGINS),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  },

  // Socket.IO configuration
  socket: {
    cors: {
      origin: parseOrigins(env.SOCKET_CORS_ORIGIN),
      credentials: true,
    },
    auth: {
      enabled: true,
      tokenKey: 'token',
    },
  },

  // API configuration
  api: {
    baseUrl: resolveBaseUrl(env.API_BASE_URL, env.PORT),
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
        url: resolveBaseUrl(env.SWAGGER_SERVER_URL, env.PORT), 
        description: env.NODE_ENV === 'production' ? 'Production server' : 'Local server' 
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
      apiKey: env.GEMINI_API_KEY,
      model: 'gemini-pro',
    },
    email: env.EMAIL_SERVICE ? {
      service: env.EMAIL_SERVICE,
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    } : null,
    sms: env.TWILIO_ACCOUNT_SID ? {
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
      phoneNumber: env.TWILIO_PHONE_NUMBER,
    } : null,
    firebase: env.FIREBASE_PROJECT_ID ? {
      projectId: env.FIREBASE_PROJECT_ID,
      privateKey: env.FIREBASE_PRIVATE_KEY,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
    } : null,
    redis: env.REDIS_URL ? {
      url: env.REDIS_URL,
    } : null,
    aws: env.AWS_ACCESS_KEY_ID ? {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      s3Bucket: env.AWS_S3_BUCKET,
    } : null,
    livekit: env.LIVEKIT_API_KEY ? {
      apiKey: env.LIVEKIT_API_KEY,
      apiSecret: env.LIVEKIT_API_SECRET,
      url: env.LIVEKIT_URL,
    } : null,
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
    level: env.LOG_LEVEL,
    format: env.NODE_ENV === 'production' ? 'combined' : 'dev',
  },
};

module.exports = config;
