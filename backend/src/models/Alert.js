const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['irrigation', 'pestRisk', 'anomaly', 'aiSuggestion', 'system', 'maintenance'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sensorNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SensorNode'
  },
  sensorData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SensorData'
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
    default: 'active'
  },
  metadata: {
    // For irrigation alerts
    soilMoisture: { type: Number },
    threshold: { type: Number },
    
    // For pest risk alerts
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
    probability: { type: Number, min: 0, max: 1 },
    
    // For anomaly alerts
    anomalyType: { type: String },
    confidence: { type: Number, min: 0, max: 1 },
    
    // For AI suggestions
    aiRecommendation: { type: String },
    actionRequired: { type: Boolean, default: false },
    
    // For system alerts
    errorCode: { type: String },
    component: { type: String }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  notifications: {
    push: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date },
      deviceToken: { type: String }
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date },
      phoneNumber: { type: String }
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date },
      emailAddress: { type: String }
    }
  },
  actions: [{
    action: {
      type: String,
      enum: ['acknowledge', 'resolve', 'dismiss', 'escalate']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  expiresAt: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
alertSchema.index({ user: 1, status: 1, createdAt: -1 });
alertSchema.index({ sensorNode: 1, status: 1 });
alertSchema.index({ type: 1, severity: 1 });
alertSchema.index({ location: '2dsphere' });

// TTL index to automatically delete old resolved alerts (after 30 days)
alertSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Method to get alert summary for mobile app
alertSchema.methods.toSummary = function() {
  return {
    id: this._id,
    type: this.type,
    severity: this.severity,
    title: this.title,
    message: this.message,
    status: this.status,
    isRead: this.isRead,
    createdAt: this.createdAt,
    sensorNode: this.sensorNode,
    metadata: this.metadata
  };
};

// Method to acknowledge alert
alertSchema.methods.acknowledge = function(userId, notes = '') {
  this.status = 'acknowledged';
  this.isRead = true;
  this.actions.push({
    action: 'acknowledge',
    performedBy: userId,
    notes
  });
  return this.save();
};

// Method to resolve alert
alertSchema.methods.resolve = function(userId, notes = '') {
  this.status = 'resolved';
  this.isRead = true;
  this.actions.push({
    action: 'resolve',
    performedBy: userId,
    notes
  });
  return this.save();
};

// Method to dismiss alert
alertSchema.methods.dismiss = function(userId, notes = '') {
  this.status = 'dismissed';
  this.isRead = true;
  this.actions.push({
    action: 'dismiss',
    performedBy: userId,
    notes
  });
  return this.save();
};

// Static method to create irrigation alert
alertSchema.statics.createIrrigationAlert = function(userId, sensorNodeId, soilMoisture, threshold) {
  const severity = soilMoisture < 10 ? 'critical' : soilMoisture < 20 ? 'high' : 'medium';
  
  return this.create({
    type: 'irrigation',
    severity,
    title: 'Irrigation Alert',
    message: `Soil moisture is ${soilMoisture}% (threshold: ${threshold}%). Irrigation may be needed.`,
    user: userId,
    sensorNode: sensorNodeId,
    metadata: {
      soilMoisture,
      threshold
    }
  });
};

// Static method to create pest risk alert
alertSchema.statics.createPestRiskAlert = function(userId, sensorNodeId, riskLevel, probability, details) {
  const severity = riskLevel === 'high' ? 'high' : riskLevel === 'medium' ? 'medium' : 'low';
  
  return this.create({
    type: 'pestRisk',
    severity,
    title: 'Pest Risk Alert',
    message: `High pest risk detected: ${details}`,
    user: userId,
    sensorNode: sensorNodeId,
    metadata: {
      riskLevel,
      probability
    }
  });
};

// Static method to create AI suggestion alert
alertSchema.statics.createAISuggestionAlert = function(userId, sensorNodeId, suggestion, actionRequired = false) {
  return this.create({
    type: 'aiSuggestion',
    severity: actionRequired ? 'medium' : 'low',
    title: 'AI Recommendation',
    message: suggestion,
    user: userId,
    sensorNode: sensorNodeId,
    metadata: {
      aiRecommendation: suggestion,
      actionRequired
    }
  });
};

module.exports = mongoose.model('Alert', alertSchema); 