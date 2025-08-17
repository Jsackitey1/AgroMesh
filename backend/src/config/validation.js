const Joi = require('joi');

// Environment validation schema
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(5001),

  // Database Configuration
  MONGODB_URI: Joi.string().uri().required(),

  // Security Configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // CORS Configuration
  CORS_ORIGINS: Joi.string().required(),
  SOCKET_CORS_ORIGIN: Joi.string().required(),

  // API Configuration
  API_BASE_URL: Joi.string().uri().required(),
  SWAGGER_SERVER_URL: Joi.string().uri().required(),

  // External Services
  GEMINI_API_KEY: Joi.string().required(),

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

  return value;
};

module.exports = { validateEnv };
