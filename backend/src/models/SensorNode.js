const mongoose = require('mongoose');
const config = require('../config');
const {
  SENSOR_STATUS,
  SOIL_TYPES,
  IRRIGATION_TYPES,
  SENSOR_TYPES,
  DEFAULT_SENSOR_CONFIG,
  FIRMWARE_DEFAULTS,
} = require('../constants/sensorDefaults');

const sensorNodeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true // [longitude, latitude]
    },
    address: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: Object.values(SENSOR_STATUS),
    default: SENSOR_STATUS.OFFLINE
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  signalStrength: {
    type: Number,
    min: -120,
    max: 0,
    default: -100
  },
  configuration: {
    cropType: {
      type: String,
      trim: true
    },
    soilType: {
      type: String,
      enum: Object.values(SOIL_TYPES),
      default: SOIL_TYPES.UNKNOWN
    },
    irrigationType: {
      type: String,
      enum: Object.values(IRRIGATION_TYPES),
      default: IRRIGATION_TYPES.NONE
    },
    sensors: {
      [SENSOR_TYPES.SOIL_MOISTURE]: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.sensors[SENSOR_TYPES.SOIL_MOISTURE] },
      [SENSOR_TYPES.TEMPERATURE]: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.sensors[SENSOR_TYPES.TEMPERATURE] },
      [SENSOR_TYPES.HUMIDITY]: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.sensors[SENSOR_TYPES.HUMIDITY] },
      [SENSOR_TYPES.PH]: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.sensors[SENSOR_TYPES.PH] },
      [SENSOR_TYPES.NUTRIENTS]: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.sensors[SENSOR_TYPES.NUTRIENTS] },
      [SENSOR_TYPES.LIGHT]: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.sensors[SENSOR_TYPES.LIGHT] }
    },
    thresholds: {
      [SENSOR_TYPES.SOIL_MOISTURE]: {
        min: { type: Number, default: DEFAULT_SENSOR_CONFIG.thresholds[SENSOR_TYPES.SOIL_MOISTURE].min },
        max: { type: Number, default: DEFAULT_SENSOR_CONFIG.thresholds[SENSOR_TYPES.SOIL_MOISTURE].max }
      },
      [SENSOR_TYPES.TEMPERATURE]: {
        min: { type: Number, default: DEFAULT_SENSOR_CONFIG.thresholds[SENSOR_TYPES.TEMPERATURE].min },
        max: { type: Number, default: DEFAULT_SENSOR_CONFIG.thresholds[SENSOR_TYPES.TEMPERATURE].max }
      },
      [SENSOR_TYPES.PH]: {
        min: { type: Number, default: DEFAULT_SENSOR_CONFIG.thresholds[SENSOR_TYPES.PH].min },
        max: { type: Number, default: DEFAULT_SENSOR_CONFIG.thresholds[SENSOR_TYPES.PH].max }
      }
    },
    irrigation: {
      type: {
        type: String,
        enum: Object.values(IRRIGATION_TYPES),
        default: DEFAULT_SENSOR_CONFIG.irrigation.type
      },
      schedule: {
        enabled: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.irrigation.schedule.enabled },
        frequency: { type: String, default: DEFAULT_SENSOR_CONFIG.irrigation.schedule.frequency },
        time: { type: String, default: DEFAULT_SENSOR_CONFIG.irrigation.schedule.time },
        duration: { type: Number, default: DEFAULT_SENSOR_CONFIG.irrigation.schedule.duration }
      },
      thresholds: {
        soilMoisture: { type: Number, default: DEFAULT_SENSOR_CONFIG.irrigation.thresholds.soilMoisture },
        temperature: { type: Number, default: DEFAULT_SENSOR_CONFIG.irrigation.thresholds.temperature }
      }
    },
    alerts: {
      enabled: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.alerts.enabled },
      channels: {
        email: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.alerts.channels.email },
        push: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.alerts.channels.push },
        sms: { type: Boolean, default: DEFAULT_SENSOR_CONFIG.alerts.channels.sms }
      },
      thresholds: {
        soilMoisture: {
          low: { type: Number, default: DEFAULT_SENSOR_CONFIG.alerts.thresholds.soilMoisture.low },
          high: { type: Number, default: DEFAULT_SENSOR_CONFIG.alerts.thresholds.soilMoisture.high }
        },
        temperature: {
          low: { type: Number, default: DEFAULT_SENSOR_CONFIG.alerts.thresholds.temperature.low },
          high: { type: Number, default: DEFAULT_SENSOR_CONFIG.alerts.thresholds.temperature.high }
        },
        ph: {
          low: { type: Number, default: DEFAULT_SENSOR_CONFIG.alerts.thresholds.ph.low },
          high: { type: Number, default: DEFAULT_SENSOR_CONFIG.alerts.thresholds.ph.high }
        }
      }
    }
  },
  firmware: {
    version: {
      type: String,
      default: FIRMWARE_DEFAULTS.version
    },
    updateChannel: {
      type: String,
      default: FIRMWARE_DEFAULTS.updateChannel
    },
    autoUpdate: {
      type: Boolean,
      default: FIRMWARE_DEFAULTS.autoUpdate
    },
    checkInterval: {
      type: Number,
      default: FIRMWARE_DEFAULTS.checkInterval
    },
    lastUpdate: {
      type: Date,
      default: Date.now
    }
  },
  metadata: {
    manufacturer: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    serialNumber: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Index for geospatial queries
sensorNodeSchema.index({ location: '2dsphere' });

// Index for efficient queries
sensorNodeSchema.index({ owner: 1, status: 1 });
sensorNodeSchema.index({ nodeId: 1 }, { unique: true });

// Method to get public JSON representation
sensorNodeSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  
  // Remove sensitive fields
  delete obj.__v;
  
  return obj;
};

// Static method to get sensor statistics
sensorNodeSchema.statics.getStatistics = async function(userId) {
  const stats = await this.aggregate([
    { $match: { owner: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        online: {
          $sum: {
            $cond: [{ $eq: ['$status', SENSOR_STATUS.ONLINE] }, 1, 0]
          }
        },
        offline: {
          $sum: {
            $cond: [{ $eq: ['$status', SENSOR_STATUS.OFFLINE] }, 1, 0]
          }
        },
        maintenance: {
          $sum: {
            $cond: [{ $eq: ['$status', SENSOR_STATUS.MAINTENANCE] }, 1, 0]
          }
        },
        error: {
          $sum: {
            $cond: [{ $eq: ['$status', SENSOR_STATUS.ERROR] }, 1, 0]
          }
        },
        avgBatteryLevel: { $avg: '$batteryLevel' },
        avgSignalStrength: { $avg: '$signalStrength' }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    online: 0,
    offline: 0,
    maintenance: 0,
    error: 0,
    avgBatteryLevel: 0,
    avgSignalStrength: 0
  };
};

// Pre-save middleware to validate thresholds
sensorNodeSchema.pre('save', function(next) {
  const { thresholds } = this.configuration;
  
  // Validate soil moisture thresholds
  if (thresholds[SENSOR_TYPES.SOIL_MOISTURE]) {
    const { min, max } = thresholds[SENSOR_TYPES.SOIL_MOISTURE];
    if (min >= max) {
      return next(new Error('Soil moisture min must be less than max'));
    }
  }
  
  // Validate temperature thresholds
  if (thresholds[SENSOR_TYPES.TEMPERATURE]) {
    const { min, max } = thresholds[SENSOR_TYPES.TEMPERATURE];
    if (min >= max) {
      return next(new Error('Temperature min must be less than max'));
    }
  }
  
  // Validate pH thresholds
  if (thresholds[SENSOR_TYPES.PH]) {
    const { min, max } = thresholds[SENSOR_TYPES.PH];
    if (min >= max) {
      return next(new Error('pH min must be less than max'));
    }
  }
  
  next();
});

module.exports = mongoose.model('SensorNode', sensorNodeSchema); 