const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');
const sensorRoutes = require('./routes/sensors');
const alertRoutes = require('./routes/alerts');
const dashboardRoutes = require('./routes/dashboard');
const videoRoutes = require('./routes/videos');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/mongoose');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:19006',
    'http://localhost:19000',
    'exp://localhost:19000',
    'exp://192.168.1.92:19000',
    // Add your production domains here
    'https://your-frontend-domain.com',
    // Allow all origins for development (remove in production)
    ...(process.env.NODE_ENV === 'development' ? ['*'] : [])
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AgroMesh Backend API',
    version: '1.0.0',
    description: 'API documentation for AgroMesh AI endpoints',
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/videos', videoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
