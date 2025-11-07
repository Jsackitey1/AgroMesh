const Joi = require('joi');

const DEFAULT_PORT = 5001;
const DEFAULT_BASE_URL = `http://localhost:${DEFAULT_PORT}`;
const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/agromesh';
const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:19006',
  'http://localhost:19000',
  'exp://localhost:19000',
  'exp://127.0.0.1:19000',
].join(',');
const DEFAULT_SOCKET_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:19006',
].join(',');

// Environment validation schema
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(DEFAULT_PORT),

  // Database Configuration
  MONGODB_URI: Joi.string().uri().default(DEFAULT_MONGO_URI),

  // Security Configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // CORS Configuration
  CORS_ORIGINS: Joi.string().default(DEFAULT_CORS_ORIGINS),
  SOCKET_CORS_ORIGIN: Joi.string().default(DEFAULT_SOCKET_ORIGINS),

  // API Configuration
  API_BASE_URL: Joi.string().uri().default(DEFAULT_BASE_URL),
  SWAGGER_SERVER_URL: Joi.string().uri().default(DEFAULT_BASE_URL),

  // External Services
  GEMINI_API_KEY: Joi.string().allow('').default(''),

  // Logging Configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),

  // Optional: Email Configuration
  EMAIL_SERVICE: Joi.string().optional(),
  EMAIL_USER: Joi.string().email().optional(),
  EMAIL_PASS: Joi.string().optional(),

  // Optional: SMS Configuration
  TWILIO_ACCOUNT_SID: Joi.string().optional(),
  TWILIO_AUTH_TOKEN: Joi.string().optional(),
  TWILIO_PHONE_NUMBER: Joi.string().optional(),

  // Optional: Firebase Configuration
  FIREBASE_PROJECT_ID: Joi.string().optional(),
  FIREBASE_PRIVATE_KEY: Joi.string().optional(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().optional(),

  // Optional: Redis Configuration
  REDIS_URL: Joi.string().uri().optional(),

  // Optional: AWS Configuration
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().optional(),
  AWS_S3_BUCKET: Joi.string().optional(),

  // Optional: LiveKit Configuration
  LIVEKIT_API_KEY: Joi.string().optional(),
  LIVEKIT_API_SECRET: Joi.string().optional(),
  LIVEKIT_URL: Joi.string().uri().optional(),
}).unknown();

// Validate environment variables
const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = 'Environment validation failed:\n' +
      error.details.map(detail => `  - ${detail.path.join('.')}: ${detail.message}`).join('\n');
    
    console.error('❌ Environment validation failed:');
    console.error(errorMessage);
    process.exit(1);
  }

  // Additional security checks
  if (value.NODE_ENV === 'production') {
    if (value.JWT_SECRET === 'your-secret-key-change-in-production') {
      console.error('❌ CRITICAL: Using default JWT secret in production!');
      process.exit(1);
    }

    if (value.CORS_ORIGINS.includes('*')) {
      console.error('❌ CRITICAL: Wildcard CORS origins in production!');
      process.exit(1);
    }

    if (value.SOCKET_CORS_ORIGIN.includes('*')) {
      console.error('❌ CRITICAL: Wildcard Socket.IO CORS origins in production!');
      process.exit(1);
    }
  }

  if (!value.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY not set. AI-powered features will return "service unavailable" responses.');
  }

  return value;
};

module.exports = { validateEnv };
