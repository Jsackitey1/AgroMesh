const express = require('express');
const authenticateJWT = require('../middlewares/auth');
const sensorController = require('../controllers/sensorController');
const { validationChains, validateThresholdRanges } = require('../validators/sensorValidators');

const router = express.Router();

// Get all sensor nodes for the authenticated user
router.get('/', authenticateJWT, validationChains.getSensors, sensorController.getSensors);

// Register a new sensor node
router.post('/register', authenticateJWT, validationChains.registerSensor, sensorController.registerSensor);

// Get sensor node details
router.get('/:nodeId', authenticateJWT, validationChains.getSensorDetails, sensorController.getSensorDetails);

// Update sensor node configuration
router.put('/:nodeId', authenticateJWT, validationChains.updateSensor, validateThresholdRanges, sensorController.updateSensor);

// Get sensor data for a specific node
router.get('/:nodeId/data', authenticateJWT, validationChains.getSensorData, sensorController.getSensorData);

// Submit sensor data for a specific node
router.post('/:nodeId/data', authenticateJWT, validationChains.submitSensorData, sensorController.submitSensorData);

// Delete a sensor node
router.delete('/:nodeId', authenticateJWT, validationChains.deleteSensor, sensorController.deleteSensor);

module.exports = router;
