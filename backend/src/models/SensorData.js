const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
    trim: true
  },
  sensorNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SensorNode',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  readings: {
    soilMoisture: {
      value: { type: Number, min: 0, max: 100 },
      unit: { type: String, default: '%' }
    },
    temperature: {
      value: { type: Number, min: -50, max: 100 },
      unit: { type: String, default: '°C' }
    },
    humidity: {
      value: { type: Number, min: 0, max: 100 },
      unit: { type: String, default: '%' }
    },
    ph: {
      value: { type: Number, min: 0, max: 14 },
      unit: { type: String, default: 'pH' }
    },
    nutrients: {
      nitrogen: { type: Number, min: 0 },
      phosphorus: { type: Number, min: 0 },
      potassium: { type: Number, min: 0 },
      unit: { type: String, default: 'mg/kg' }
    },
    light: {
      value: { type: Number, min: 0 },
      unit: { type: String, default: 'lux' }
    },
    rainfall: {
      value: { type: Number, min: 0 },
      unit: { type: String, default: 'mm' }
    },
    windSpeed: {
      value: { type: Number, min: 0 },
      unit: { type: String, default: 'm/s' }
    },
    windDirection: {
      value: { type: Number, min: 0, max: 360 },
      unit: { type: String, default: 'degrees' }
    }
  },
  metadata: {
    batteryLevel: { type: Number, min: 0, max: 100 },
    signalStrength: { type: Number, min: -120, max: 0 },
    firmwareVersion: { type: String },
    dataQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  aiAnalysis: {
    irrigationRecommendation: {
      type: String,
      enum: ['irrigate', 'hold', 'reduce'],
      default: null
    },
    pestRisk: {
      level: { type: String, enum: ['low', 'medium', 'high'], default: null },
      probability: { type: Number, min: 0, max: 1, default: null }
    },
    anomaly: {
      detected: { type: Boolean, default: false },
      type: { type: String, default: null },
      confidence: { type: Number, min: 0, max: 1, default: null }
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
sensorDataSchema.index({ nodeId: 1, timestamp: -1 });
sensorDataSchema.index({ sensorNode: 1, timestamp: -1 });
sensorDataSchema.index({ location: '2dsphere' });
sensorDataSchema.index({ timestamp: -1 });

// TTL index to automatically delete old data (optional - keep for 2 years)
// sensorDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2 * 365 * 24 * 60 * 60 });

// Method to get formatted readings for mobile app
sensorDataSchema.methods.getFormattedReadings = function() {
  const readings = {};
  
  Object.keys(this.readings).forEach(key => {
    const reading = this.readings[key];
    if (reading && reading.value !== undefined) {
      readings[key] = {
        value: reading.value,
        unit: reading.unit
      };
    }
  });
  
  return readings;
};

// Method to check if readings are within normal ranges
sensorDataSchema.methods.checkThresholds = function() {
  const alerts = [];
  
  // Soil moisture thresholds
  if (this.readings.soilMoisture && this.readings.soilMoisture.value < 20) {
    alerts.push({
      type: 'irrigation',
      severity: 'high',
      message: 'Soil moisture is critically low',
      value: this.readings.soilMoisture.value,
      threshold: 20
    });
  }
  
  // Temperature thresholds
  if (this.readings.temperature) {
    if (this.readings.temperature.value > 35) {
      alerts.push({
        type: 'temperature',
        severity: 'high',
        message: 'Temperature is too high',
        value: this.readings.temperature.value,
        threshold: 35
      });
    } else if (this.readings.temperature.value < 10) {
      alerts.push({
        type: 'temperature',
        severity: 'medium',
        message: 'Temperature is too low',
        value: this.readings.temperature.value,
        threshold: 10
      });
    }
  }
  
  // pH thresholds
  if (this.readings.ph) {
    if (this.readings.ph.value < 5.5 || this.readings.ph.value > 7.5) {
      alerts.push({
        type: 'ph',
        severity: 'medium',
        message: 'pH is outside optimal range',
        value: this.readings.ph.value,
        threshold: '5.5-7.5'
      });
    }
  }
  
  return alerts;
};

module.exports = mongoose.model('SensorData', sensorDataSchema); 