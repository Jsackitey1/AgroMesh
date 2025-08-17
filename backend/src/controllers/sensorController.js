const { validationResult } = require('express-validator');
const SensorNode = require('../models/SensorNode');
const SensorData = require('../models/SensorData');
const Alert = require('../models/Alert');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');
const config = require('../config');

// Get all sensor nodes for a user
const getSensors = asyncHandler(async (req, res) => {
  const { status, limit = 50, page = 1 } = req.query;
  
  const query = { owner: req.user.id };
  if (status && config.sensors.status[status]) {
    query.status = status;
  }

  const options = {
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
    sort: { createdAt: -1 },
  };

  const [sensorNodes, total] = await Promise.all([
    SensorNode.find(query, null, options),
    SensorNode.countDocuments(query),
  ]);

  res.json({
    sensorNodes: sensorNodes.map(node => node.toPublicJSON()),
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / parseInt(limit)),
  });
});

// Register a new sensor node
const registerSensor = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation error', 400);
  }

  const { nodeId, name, coordinates, cropType, soilType } = req.body;

  // Check if node already exists
  const existingNode = await SensorNode.findOne({ nodeId });
  if (existingNode) {
    throw new AppError('Sensor node already exists', 409);
  }

  // Create new sensor node with default thresholds from config
  const sensorNode = new SensorNode({
    nodeId,
    name,
    owner: req.user.id,
    location: {
      coordinates: coordinates, // [longitude, latitude]
    },
    configuration: {
      cropType,
      soilType: soilType || 'unknown',
      thresholds: config.sensors.thresholds,
    },
  });

  await sensorNode.save();

  // Emit real-time update if socket is available
  if (req.app.get('io')) {
    req.app.get('io').emit('sensorNodeRegistered', {
      nodeId,
      name,
      owner: req.user.id,
    });
  }

  res.status(201).json({
    message: 'Sensor node registered successfully',
    sensorNode: sensorNode.toPublicJSON(),
  });
});

// Get sensor details
const getSensorDetails = asyncHandler(async (req, res) => {
  const { nodeId } = req.params;

  const sensorNode = await SensorNode.findOne({ 
    nodeId, 
    owner: req.user.id 
  });

  if (!sensorNode) {
    throw new AppError('Sensor node not found', 404);
  }

  res.json(sensorNode.toPublicJSON());
});

// Update sensor configuration
const updateSensor = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation error', 400);
  }

  const { nodeId } = req.params;
  const updateData = req.body;

  const sensorNode = await SensorNode.findOne({ 
    nodeId, 
    owner: req.user.id 
  });

  if (!sensorNode) {
    throw new AppError('Sensor node not found', 404);
  }

  // Validate soil type if provided
  if (updateData.configuration?.soilType && 
      !config.sensors.soilTypes.includes(updateData.configuration.soilType)) {
    throw new AppError('Invalid soil type', 400);
  }

  // Validate irrigation type if provided
  if (updateData.configuration?.irrigationType && 
      !config.sensors.irrigationTypes.includes(updateData.configuration.irrigationType)) {
    throw new AppError('Invalid irrigation type', 400);
  }

  // Update sensor node
  Object.assign(sensorNode, updateData);
  await sensorNode.save();

  res.json({
    message: 'Sensor node updated successfully',
    sensorNode: sensorNode.toPublicJSON(),
  });
});

// Get sensor data
const getSensorData = asyncHandler(async (req, res) => {
  const { nodeId } = req.params;
  const { startDate, endDate, limit = 100 } = req.query;

  // Verify sensor ownership
  const sensorNode = await SensorNode.findOne({ 
    nodeId, 
    owner: req.user.id 
  });

  if (!sensorNode) {
    throw new AppError('Sensor node not found', 404);
  }

  // Build query
  const query = { nodeId };
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const sensorData = await SensorData.find(query)
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  res.json({
    sensorData,
    total: sensorData.length,
    nodeId,
  });
});

// Submit sensor data
const submitSensorData = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation error', 400);
  }

  const { nodeId } = req.params;
  const sensorData = req.body;

  // Verify sensor ownership
  const sensorNode = await SensorNode.findOne({ 
    nodeId, 
    owner: req.user.id 
  });

  if (!sensorNode) {
    throw new AppError('Sensor node not found', 404);
  }

  // Create sensor data record
  const newSensorData = new SensorData({
    nodeId,
    ...sensorData,
    timestamp: sensorData.timestamp || new Date(),
  });

  await newSensorData.save();

  // Update sensor node status and last seen
  sensorNode.status = config.sensors.status.online;
  sensorNode.lastSeen = new Date();
  if (sensorData.batteryLevel !== undefined) {
    sensorNode.batteryLevel = sensorData.batteryLevel;
  }
  if (sensorData.signalStrength !== undefined) {
    sensorNode.signalStrength = sensorData.signalStrength;
  }
  await sensorNode.save();

  // Check thresholds and create alerts if needed
  await checkThresholdsAndCreateAlerts(sensorNode, newSensorData);

  // Emit real-time update if socket is available
  if (req.app.get('io')) {
    req.app.get('io').emit('sensorDataReceived', {
      nodeId,
      data: newSensorData,
    });
  }

  res.status(201).json({
    message: 'Sensor data submitted successfully',
    sensorData: newSensorData,
  });
});

// Check thresholds and create alerts
const checkThresholdsAndCreateAlerts = async (sensorNode, sensorData) => {
  const { thresholds } = sensorNode.configuration;
  const alerts = [];

  // Check soil moisture
  if (sensorData.soilMoisture !== undefined && thresholds.soilMoisture) {
    if (sensorData.soilMoisture < thresholds.soilMoisture.min) {
      alerts.push({
        type: 'threshold',
        severity: 'high',
        message: `Soil moisture is too low: ${sensorData.soilMoisture}% (min: ${thresholds.soilMoisture.min}%)`,
        nodeId: sensorNode.nodeId,
        owner: sensorNode.owner,
      });
    } else if (sensorData.soilMoisture > thresholds.soilMoisture.max) {
      alerts.push({
        type: 'threshold',
        severity: 'medium',
        message: `Soil moisture is too high: ${sensorData.soilMoisture}% (max: ${thresholds.soilMoisture.max}%)`,
        nodeId: sensorNode.nodeId,
        owner: sensorNode.owner,
      });
    }
  }

  // Check temperature
  if (sensorData.temperature !== undefined && thresholds.temperature) {
    if (sensorData.temperature < thresholds.temperature.min) {
      alerts.push({
        type: 'threshold',
        severity: 'medium',
        message: `Temperature is too low: ${sensorData.temperature}°C (min: ${thresholds.temperature.min}°C)`,
        nodeId: sensorNode.nodeId,
        owner: sensorNode.owner,
      });
    } else if (sensorData.temperature > thresholds.temperature.max) {
      alerts.push({
        type: 'threshold',
        severity: 'high',
        message: `Temperature is too high: ${sensorData.temperature}°C (max: ${thresholds.temperature.max}°C)`,
        nodeId: sensorNode.nodeId,
        owner: sensorNode.owner,
      });
    }
  }

  // Check pH
  if (sensorData.ph !== undefined && thresholds.ph) {
    if (sensorData.ph < thresholds.ph.min || sensorData.ph > thresholds.ph.max) {
      alerts.push({
        type: 'threshold',
        severity: 'medium',
        message: `pH is out of range: ${sensorData.ph} (range: ${thresholds.ph.min}-${thresholds.ph.max})`,
        nodeId: sensorNode.nodeId,
        owner: sensorNode.owner,
      });
    }
  }

  // Create alerts
  if (alerts.length > 0) {
    await Alert.insertMany(alerts);
  }
};

// Delete sensor node
const deleteSensor = asyncHandler(async (req, res) => {
  const { nodeId } = req.params;

  const sensorNode = await SensorNode.findOne({ 
    nodeId, 
    owner: req.user.id 
  });

  if (!sensorNode) {
    throw new AppError('Sensor node not found', 404);
  }

  // Delete sensor data and alerts
  await Promise.all([
    SensorData.deleteMany({ nodeId }),
    Alert.deleteMany({ nodeId }),
    SensorNode.findByIdAndDelete(sensorNode._id),
  ]);

  // Emit real-time update if socket is available
  if (req.app.get('io')) {
    req.app.get('io').emit('sensorNodeDeleted', { nodeId });
  }

  res.json({
    message: 'Sensor node deleted successfully',
  });
});

module.exports = {
  getSensors,
  registerSensor,
  getSensorDetails,
  updateSensor,
  getSensorData,
  submitSensorData,
  deleteSensor,
};
