const { body, query, param } = require('express-validator');

// Common validation rules
const commonValidators = {
  nodeId: body('nodeId')
    .notEmpty()
    .trim()
    .withMessage('Node ID is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Node ID must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Node ID can only contain letters, numbers, hyphens, and underscores'),

  name: body('name')
    .notEmpty()
    .trim()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  coordinates: body('coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of 2 numbers')
    .custom((value) => {
      if (!Array.isArray(value) || value.length !== 2) {
        throw new Error('Coordinates must be an array of 2 numbers');
      }
      const [lng, lat] = value;
      if (typeof lng !== 'number' || typeof lat !== 'number') {
        throw new Error('Coordinates must be numbers');
      }
      if (lng < -180 || lng > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
      if (lat < -90 || lat > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      return true;
    }),

  soilType: body('soilType')
    .optional()
    .isIn(['sandy', 'clay', 'loamy', 'silty', 'unknown'])
    .withMessage('Invalid soil type'),

  cropType: body('cropType')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Crop type must be less than 100 characters'),

  status: query('status')
    .optional()
    .isIn(['online', 'offline', 'maintenance', 'error'])
    .withMessage('Invalid status filter'),

  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  startDate: query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  endDate: query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),

  nodeIdParam: param('nodeId')
    .notEmpty()
    .trim()
    .withMessage('Node ID parameter is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Node ID must be between 3 and 50 characters'),
};

// Sensor data validation rules
const sensorDataValidators = {
  soilMoisture: body('soilMoisture')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Soil moisture must be between 0 and 100'),

  temperature: body('temperature')
    .optional()
    .isFloat({ min: -50, max: 100 })
    .withMessage('Temperature must be between -50 and 100°C'),

  humidity: body('humidity')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Humidity must be between 0 and 100'),

  ph: body('ph')
    .optional()
    .isFloat({ min: 0, max: 14 })
    .withMessage('pH must be between 0 and 14'),

  light: body('light')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Light intensity must be positive'),

  batteryLevel: body('batteryLevel')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Battery level must be between 0 and 100'),

  signalStrength: body('signalStrength')
    .optional()
    .isFloat({ min: -120, max: 0 })
    .withMessage('Signal strength must be between -120 and 0 dBm'),

  timestamp: body('timestamp')
    .optional()
    .isISO8601()
    .withMessage('Timestamp must be a valid ISO 8601 date'),
};

// Configuration validation rules
const configurationValidators = {
  soilType: body('configuration.soilType')
    .optional()
    .isIn(['sandy', 'clay', 'loamy', 'silty', 'unknown'])
    .withMessage('Invalid soil type'),

  irrigationType: body('configuration.irrigationType')
    .optional()
    .isIn(['drip', 'sprinkler', 'flood', 'manual', 'none'])
    .withMessage('Invalid irrigation type'),

  soilMoistureMin: body('configuration.thresholds.soilMoisture.min')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Soil moisture min must be between 0 and 100'),

  soilMoistureMax: body('configuration.thresholds.soilMoisture.max')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Soil moisture max must be between 0 and 100'),

  temperatureMin: body('configuration.thresholds.temperature.min')
    .optional()
    .isFloat({ min: -50, max: 100 })
    .withMessage('Temperature min must be between -50 and 100°C'),

  temperatureMax: body('configuration.thresholds.temperature.max')
    .optional()
    .isFloat({ min: -50, max: 100 })
    .withMessage('Temperature max must be between -50 and 100°C'),

  phMin: body('configuration.thresholds.ph.min')
    .optional()
    .isFloat({ min: 0, max: 14 })
    .withMessage('pH min must be between 0 and 14'),

  phMax: body('configuration.thresholds.ph.max')
    .optional()
    .isFloat({ min: 0, max: 14 })
    .withMessage('pH max must be between 0 and 14'),
};

// Validation chains for different operations
const validationChains = {
  // Register sensor validation
  registerSensor: [
    commonValidators.nodeId,
    commonValidators.name,
    commonValidators.coordinates,
    commonValidators.cropType,
    commonValidators.soilType,
  ],

  // Update sensor validation
  updateSensor: [
    commonValidators.name.optional(),
    configurationValidators.soilType,
    configurationValidators.irrigationType,
    configurationValidators.soilMoistureMin,
    configurationValidators.soilMoistureMax,
    configurationValidators.temperatureMin,
    configurationValidators.temperatureMax,
    configurationValidators.phMin,
    configurationValidators.phMax,
  ],

  // Get sensors validation
  getSensors: [
    commonValidators.status,
    commonValidators.limit,
    commonValidators.page,
  ],

  // Get sensor details validation
  getSensorDetails: [
    commonValidators.nodeIdParam,
  ],

  // Get sensor data validation
  getSensorData: [
    commonValidators.nodeIdParam,
    commonValidators.startDate,
    commonValidators.endDate,
    commonValidators.limit,
  ],

  // Submit sensor data validation
  submitSensorData: [
    commonValidators.nodeIdParam,
    sensorDataValidators.soilMoisture,
    sensorDataValidators.temperature,
    sensorDataValidators.humidity,
    sensorDataValidators.ph,
    sensorDataValidators.light,
    sensorDataValidators.batteryLevel,
    sensorDataValidators.signalStrength,
    sensorDataValidators.timestamp,
  ],

  // Delete sensor validation
  deleteSensor: [
    commonValidators.nodeIdParam,
  ],
};

// Custom validation for threshold ranges
const validateThresholdRanges = (req, res, next) => {
  const { configuration } = req.body;
  
  if (configuration?.thresholds) {
    const { soilMoisture, temperature, ph } = configuration.thresholds;
    
    if (soilMoisture && soilMoisture.min >= soilMoisture.max) {
      return res.status(400).json({
        message: 'Validation error',
        errors: [{ path: 'configuration.thresholds.soilMoisture', msg: 'Min must be less than max' }]
      });
    }
    
    if (temperature && temperature.min >= temperature.max) {
      return res.status(400).json({
        message: 'Validation error',
        errors: [{ path: 'configuration.thresholds.temperature', msg: 'Min must be less than max' }]
      });
    }
    
    if (ph && ph.min >= ph.max) {
      return res.status(400).json({
        message: 'Validation error',
        errors: [{ path: 'configuration.thresholds.ph', msg: 'Min must be less than max' }]
      });
    }
  }
  
  next();
};

module.exports = {
  commonValidators,
  sensorDataValidators,
  configurationValidators,
  validationChains,
  validateThresholdRanges,
};
