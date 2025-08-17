const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: config.swagger.title,
    version: config.swagger.version,
    description: config.swagger.description,
    contact: {
      name: 'AgroMesh Support',
      email: 'support@agromesh.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: config.swagger.servers,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token for authentication',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                msg: { type: 'string' },
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      SensorNode: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          nodeId: { type: 'string' },
          name: { type: 'string' },
          owner: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              coordinates: {
                type: 'array',
                items: { type: 'number' },
                minItems: 2,
                maxItems: 2,
              },
              address: { type: 'string' },
            },
          },
          status: { type: 'string', enum: ['online', 'offline', 'maintenance', 'error'] },
          lastSeen: { type: 'string', format: 'date-time' },
          batteryLevel: { type: 'number', minimum: 0, maximum: 100 },
          signalStrength: { type: 'number', minimum: -120, maximum: 0 },
        },
      },
      SensorData: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          nodeId: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          soilMoisture: { type: 'number' },
          temperature: { type: 'number' },
          humidity: { type: 'number' },
          ph: { type: 'number' },
          nutrients: { type: 'object' },
          light: { type: 'number' },
        },
      },
      Alert: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          type: { type: 'string', enum: ['threshold', 'system', 'maintenance'] },
          severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          status: { type: 'string', enum: ['active', 'acknowledged', 'resolved', 'dismissed'] },
          message: { type: 'string' },
          nodeId: { type: 'string' },
          owner: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Authentication', description: 'User authentication endpoints' },
    { name: 'Sensors', description: 'Sensor node management endpoints' },
    { name: 'Alerts', description: 'Alert management endpoints' },
    { name: 'Dashboard', description: 'Dashboard data endpoints' },
    { name: 'AI', description: 'AI analysis endpoints' },
    { name: 'Videos', description: 'Video analysis endpoints' },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: config.swagger.apis,
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AgroMesh API Documentation',
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
