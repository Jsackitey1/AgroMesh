const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const path = require('path');
const config = require('./index');

// Load external OpenAPI specification
const swaggerSpec = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

// Update server URLs based on environment
swaggerSpec.servers = [
  {
    url: config.server.isProduction
      ? `${config.api.baseUrl}${config.api.prefix}`
      : `http://localhost:${config.server.port}${config.api.prefix}`,
    description: config.server.isProduction ? 'Production server' : 'Local development server',
  },
];

// Add custom CSS for better styling
swaggerSpec.customCss = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info .title { color: #2c3e50; }
  .swagger-ui .scheme-container { background: #f8f9fa; }
`;

// Add custom site title
swaggerSpec.customSiteTitle = 'AgroMesh API Documentation';

module.exports = swaggerSpec;
