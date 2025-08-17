const mongoose = require('mongoose');
const config = require('../config');

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
    enum: Object.values(config.sensors.status),
    default: config.sensors.status.offline
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
      enum: config.sensors.soilTypes,
      default: 'unknown'
    },
    irrigationType: {
      type: String,
      enum: config.sensors.irrigationTypes,
      default: 'none'
    },
    sensors: {
      soilMoisture: { type: Boolean, default: true },
      temperature: { type: Boolean, default: true },
      humidity: { type: Boolean, default: true },
      ph: { type: Boolean, default: false },
      nutrients: { type: Boolean, default: false },
      light: { type: Boolean, default: false }
    },
    thresholds: {
      soilMoisture: {
        min: { type: Number, default: config.sensors.thresholds.soilMoisture.min },
        max: { type: Number, default: config.sensors.thresholds.soilMoisture.max }
      },
      temperature: {
        min: { type: Number, default: config.sensors.thresholds.temperature.min },
        max: { type: Number, default: config.sensors.thresholds.temperature.max }
      },
      ph: {
        min: { type: Number, default: config.sensors.thresholds.ph.min },
        max: { type: Number, default: config.sensors.thresholds.ph.max }
      }
    }
  },
  firmware: {
    version: {
      type: String,
      default: '1.0.0'
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
            $cond: [{ $eq: ['$status', config.sensors.status.online] }, 1, 0]
          }
        },
        offline: {
          $sum: {
            $cond: [{ $eq: ['$status', config.sensors.status.offline] }, 1, 0]
          }
        },
        maintenance: {
          $sum: {
            $cond: [{ $eq: ['$status', config.sensors.status.maintenance] }, 1, 0]
          }
        },
        error: {
          $sum: {
            $cond: [{ $eq: ['$status', config.sensors.status.error] }, 1, 0]
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
  if (thresholds.soilMoisture) {
    if (thresholds.soilMoisture.min >= thresholds.soilMoisture.max) {
      return next(new Error('Soil moisture min must be less than max'));
    }
  }
  
  // Validate temperature thresholds
  if (thresholds.temperature) {
    if (thresholds.temperature.min >= thresholds.temperature.max) {
      return next(new Error('Temperature min must be less than max'));
    }
  }
  
  // Validate pH thresholds
  if (thresholds.ph) {
    if (thresholds.ph.min >= thresholds.ph.max) {
      return next(new Error('pH min must be less than max'));
    }
  }
  
  next();
});

module.exports = mongoose.model('SensorNode', sensorNodeSchema); 