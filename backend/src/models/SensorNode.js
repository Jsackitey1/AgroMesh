const mongoose = require('mongoose');

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
    enum: ['online', 'offline', 'maintenance', 'error'],
    default: 'offline'
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
      enum: ['sandy', 'clay', 'loamy', 'silty', 'unknown'],
      default: 'unknown'
    },
    irrigationType: {
      type: String,
      enum: ['drip', 'sprinkler', 'flood', 'manual', 'none'],
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
        min: { type: Number, default: 20 },
        max: { type: Number, default: 80 }
      },
      temperature: {
        min: { type: Number, default: 10 },
        max: { type: Number, default: 35 }
      },
      ph: {
        min: { type: Number, default: 5.5 },
        max: { type: Number, default: 7.5 }
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
sensorNodeSchema.index({ location: '2dsphere' });

// Index for efficient queries by owner
sensorNodeSchema.index({ owner: 1, isActive: 1 });

// Method to get sensor status based on last seen time
sensorNodeSchema.methods.getStatus = function() {
  const now = new Date();
  const timeDiff = now - this.lastSeen;
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  if (timeDiff > fiveMinutes) {
    return 'offline';
  }
  return this.status;
};

// Method to get public data (without sensitive info)
sensorNodeSchema.methods.toPublicJSON = function() {
  const node = this.toObject();
  return {
    id: node._id,
    nodeId: node.nodeId,
    name: node.name,
    location: node.location,
    status: this.getStatus(),
    lastSeen: node.lastSeen,
    batteryLevel: node.batteryLevel,
    signalStrength: node.signalStrength,
    configuration: {
      cropType: node.configuration.cropType,
      soilType: node.configuration.soilType,
      irrigationType: node.configuration.irrigationType,
      sensors: node.configuration.sensors
    },
    firmware: {
      version: node.firmware.version
    }
  };
};

module.exports = mongoose.model('SensorNode', sensorNodeSchema); 