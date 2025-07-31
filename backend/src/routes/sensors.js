const express = require('express');
const { body, validationResult, query } = require('express-validator');
const SensorNode = require('../models/SensorNode');
const SensorData = require('../models/SensorData');
const Alert = require('../models/Alert');
const authenticateJWT = require('../middlewares/auth');
const { io } = require('../../index');

const router = express.Router();

/**
 * @swagger
 * /api/sensors/register:
 *   post:
 *     summary: Register a new sensor node
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nodeId
 *               - name
 *               - coordinates
 *             properties:
 *               nodeId:
 *                 type: string
 *               name:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *               cropType:
 *                 type: string
 *               soilType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sensor node registered successfully
 */
router.post('/register', authenticateJWT, [
  body('nodeId').notEmpty().trim(),
  body('name').notEmpty().trim(),
  body('coordinates').isArray({ min: 2, max: 2 }),
  body('coordinates.*').isFloat({ min: -180, max: 180 }),
  body('cropType').optional().trim(),
  body('soilType').optional().isIn(['sandy', 'clay', 'loamy', 'silty', 'unknown'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { nodeId, name, coordinates, cropType, soilType } = req.body;

    // Check if node already exists
    const existingNode = await SensorNode.findOne({ nodeId });
    if (existingNode) {
      return res.status(400).json({ message: 'Sensor node already exists' });
    }

    // Create new sensor node
    const sensorNode = new SensorNode({
      nodeId,
      name,
      owner: req.user.id,
      location: {
        coordinates: coordinates // [longitude, latitude]
      },
      configuration: {
        cropType,
        soilType: soilType || 'unknown'
      }
    });

    await sensorNode.save();

    // Emit real-time update
    io.emit('sensorNodeRegistered', {
      nodeId,
      name,
      owner: req.user.id
    });

    res.status(201).json({
      message: 'Sensor node registered successfully',
      sensorNode: sensorNode.toPublicJSON()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register sensor node', error: err.message });
  }
});

/**
 * @swagger
 * /api/sensors/data:
 *   post:
 *     summary: Submit sensor data
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nodeId
 *               - readings
 *             properties:
 *               nodeId:
 *                 type: string
 *               readings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Sensor data submitted successfully
 */
router.post('/data', [
  body('nodeId').notEmpty().trim(),
  body('readings').isObject(),
  body('coordinates').optional().isArray({ min: 2, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { nodeId, readings, coordinates, metadata } = req.body;

    // Find sensor node
    const sensorNode = await SensorNode.findOne({ nodeId });
    if (!sensorNode) {
      return res.status(404).json({ message: 'Sensor node not found' });
    }

    // Create sensor data record
    const sensorData = new SensorData({
      nodeId,
      sensorNode: sensorNode._id,
      readings,
      location: {
        coordinates: coordinates || sensorNode.location.coordinates
      },
      metadata
    });

    await sensorData.save();

    // Update sensor node status
    sensorNode.status = 'online';
    sensorNode.lastSeen = new Date();
    if (metadata) {
      if (metadata.batteryLevel !== undefined) sensorNode.batteryLevel = metadata.batteryLevel;
      if (metadata.signalStrength !== undefined) sensorNode.signalStrength = metadata.signalStrength;
    }
    await sensorNode.save();

    // Check for alerts
    const alerts = sensorData.checkThresholds();
    if (alerts.length > 0) {
      for (const alertData of alerts) {
        const alert = await Alert.createIrrigationAlert(
          sensorNode.owner,
          sensorNode._id,
          readings.soilMoisture?.value || 0,
          alertData.threshold
        );

        // Emit real-time alert
        io.emit('newAlert', {
          alertId: alert._id,
          userId: sensorNode.owner,
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          message: alert.message
        });
      }
    }

    // Emit real-time data update
    io.emit('sensorDataUpdate', {
      nodeId,
      sensorData: sensorData.getFormattedReadings(),
      timestamp: sensorData.timestamp
    });

    res.json({
      message: 'Sensor data submitted successfully',
      sensorDataId: sensorData._id,
      alerts: alerts.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit sensor data', error: err.message });
  }
});

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Get user's sensor nodes
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of sensor nodes
 */
router.get('/', authenticateJWT, [
  query('status').optional().isIn(['online', 'offline', 'maintenance', 'error'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { status } = req.query;
    const filter = { owner: req.user.id, isActive: true };
    
    if (status) {
      filter.status = status;
    }

    const sensorNodes = await SensorNode.find(filter).sort({ lastSeen: -1 });
    
    const nodesWithStatus = sensorNodes.map(node => node.toPublicJSON());

    res.json({
      sensorNodes: nodesWithStatus,
      total: nodesWithStatus.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get sensor nodes', error: err.message });
  }
});

/**
 * @swagger
 * /api/sensors/{nodeId}:
 *   get:
 *     summary: Get sensor node details
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sensor node details
 */
router.get('/:nodeId', authenticateJWT, async (req, res) => {
  try {
    const { nodeId } = req.params;

    const sensorNode = await SensorNode.findOne({ 
      nodeId, 
      owner: req.user.id,
      isActive: true 
    });

    if (!sensorNode) {
      return res.status(404).json({ message: 'Sensor node not found' });
    }

    res.json(sensorNode.toPublicJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get sensor node', error: err.message });
  }
});

/**
 * @swagger
 * /api/sensors/{nodeId}/data:
 *   get:
 *     summary: Get sensor data for a node
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: Sensor data
 */
router.get('/:nodeId/data', authenticateJWT, [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('limit').optional().isInt({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { nodeId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    // Verify ownership
    const sensorNode = await SensorNode.findOne({ 
      nodeId, 
      owner: req.user.id,
      isActive: true 
    });

    if (!sensorNode) {
      return res.status(404).json({ message: 'Sensor node not found' });
    }

    // Build query
    const query = { sensorNode: sensorNode._id };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const sensorData = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    const formattedData = sensorData.map(data => ({
      id: data._id,
      timestamp: data.timestamp,
      readings: data.getFormattedReadings(),
      metadata: data.metadata,
      aiAnalysis: data.aiAnalysis
    }));

    res.json({
      sensorData: formattedData,
      total: formattedData.length,
      nodeId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get sensor data', error: err.message });
  }
});

/**
 * @swagger
 * /api/sensors/{nodeId}:
 *   put:
 *     summary: Update sensor node configuration
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cropType:
 *                 type: string
 *               soilType:
 *                 type: string
 *               thresholds:
 *                 type: object
 *     responses:
 *       200:
 *         description: Sensor node updated successfully
 */
router.put('/:nodeId', authenticateJWT, [
  body('name').optional().notEmpty().trim(),
  body('cropType').optional().trim(),
  body('soilType').optional().isIn(['sandy', 'clay', 'loamy', 'silty', 'unknown'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { nodeId } = req.params;
    const { name, cropType, soilType, thresholds } = req.body;

    const sensorNode = await SensorNode.findOne({ 
      nodeId, 
      owner: req.user.id,
      isActive: true 
    });

    if (!sensorNode) {
      return res.status(404).json({ message: 'Sensor node not found' });
    }

    // Update fields
    if (name) sensorNode.name = name;
    if (cropType) sensorNode.configuration.cropType = cropType;
    if (soilType) sensorNode.configuration.soilType = soilType;
    if (thresholds) {
      sensorNode.configuration.thresholds = { 
        ...sensorNode.configuration.thresholds, 
        ...thresholds 
      };
    }

    await sensorNode.save();

    res.json({
      message: 'Sensor node updated successfully',
      sensorNode: sensorNode.toPublicJSON()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update sensor node', error: err.message });
  }
});

module.exports = router; 