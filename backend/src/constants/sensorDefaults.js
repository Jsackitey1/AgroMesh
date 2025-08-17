// Sensor status constants
const SENSOR_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance',
  ERROR: 'error',
};

// Soil type constants
const SOIL_TYPES = {
  SANDY: 'sandy',
  CLAY: 'clay',
  LOAMY: 'loamy',
  SILTY: 'silty',
  UNKNOWN: 'unknown',
};

// Irrigation type constants
const IRRIGATION_TYPES = {
  DRIP: 'drip',
  SPRINKLER: 'sprinkler',
  FLOOD: 'flood',
  MANUAL: 'manual',
  NONE: 'none',
};

// Sensor types constants
const SENSOR_TYPES = {
  SOIL_MOISTURE: 'soilMoisture',
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  PH: 'ph',
  NUTRIENTS: 'nutrients',
  LIGHT: 'light',
};

// Default sensor configuration
const DEFAULT_SENSOR_CONFIG = {
  // Default sensor availability
  sensors: {
    [SENSOR_TYPES.SOIL_MOISTURE]: true,
    [SENSOR_TYPES.TEMPERATURE]: true,
    [SENSOR_TYPES.HUMIDITY]: true,
    [SENSOR_TYPES.PH]: false,
    [SENSOR_TYPES.NUTRIENTS]: false,
    [SENSOR_TYPES.LIGHT]: false,
  },

  // Default thresholds
  thresholds: {
    [SENSOR_TYPES.SOIL_MOISTURE]: {
      min: 20,
      max: 80,
      unit: '%',
      critical: {
        low: 15,
        high: 85,
      },
    },
    [SENSOR_TYPES.TEMPERATURE]: {
      min: 10,
      max: 35,
      unit: '°C',
      critical: {
        low: 5,
        high: 40,
      },
    },
    [SENSOR_TYPES.PH]: {
      min: 5.5,
      max: 7.5,
      unit: 'pH',
      critical: {
        low: 5.0,
        high: 8.0,
      },
    },
  },

  // Default irrigation settings
  irrigation: {
    type: IRRIGATION_TYPES.NONE,
    schedule: {
      enabled: false,
      frequency: 'daily',
      time: '06:00',
      duration: 30, // minutes
    },
    thresholds: {
      soilMoisture: 25, // % - trigger irrigation when below this
      temperature: 30, // °C - trigger irrigation when above this
    },
  },

  // Default alert settings
  alerts: {
    enabled: true,
    channels: {
      email: true,
      push: false,
      sms: false,
    },
    thresholds: {
      soilMoisture: {
        low: 20,
        high: 80,
      },
      temperature: {
        low: 10,
        high: 35,
      },
      ph: {
        low: 5.5,
        high: 7.5,
      },
    },
  },
};

// Sensor reading ranges and units
const SENSOR_RANGES = {
  [SENSOR_TYPES.SOIL_MOISTURE]: {
    min: 0,
    max: 100,
    unit: '%',
    precision: 1,
  },
  [SENSOR_TYPES.TEMPERATURE]: {
    min: -50,
    max: 100,
    unit: '°C',
    precision: 1,
  },
  [SENSOR_TYPES.HUMIDITY]: {
    min: 0,
    max: 100,
    unit: '%',
    precision: 1,
  },
  [SENSOR_TYPES.PH]: {
    min: 0,
    max: 14,
    unit: 'pH',
    precision: 2,
  },
  [SENSOR_TYPES.LIGHT]: {
    min: 0,
    max: 100000,
    unit: 'lux',
    precision: 0,
  },
  batteryLevel: {
    min: 0,
    max: 100,
    unit: '%',
    precision: 1,
  },
  signalStrength: {
    min: -120,
    max: 0,
    unit: 'dBm',
    precision: 1,
  },
};

// Alert severity levels
const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Alert types
const ALERT_TYPES = {
  THRESHOLD: 'threshold',
  SYSTEM: 'system',
  MAINTENANCE: 'maintenance',
  BATTERY: 'battery',
  SIGNAL: 'signal',
};

// Sensor maintenance intervals (in days)
const MAINTENANCE_INTERVALS = {
  CALIBRATION: 90,
  CLEANING: 30,
  BATTERY_CHECK: 7,
  FIRMWARE_UPDATE: 180,
};

// Default firmware settings
const FIRMWARE_DEFAULTS = {
  version: '1.0.0',
  updateChannel: 'stable',
  autoUpdate: false,
  checkInterval: 24, // hours
};

// Export all constants
module.exports = {
  SENSOR_STATUS,
  SOIL_TYPES,
  IRRIGATION_TYPES,
  SENSOR_TYPES,
  DEFAULT_SENSOR_CONFIG,
  SENSOR_RANGES,
  ALERT_SEVERITY,
  ALERT_TYPES,
  MAINTENANCE_INTERVALS,
  FIRMWARE_DEFAULTS,
};
