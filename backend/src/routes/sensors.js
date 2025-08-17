const express = require('express');
const authenticateJWT = require('../middlewares/auth');
const sensorController = require('../controllers/sensorController');
const { validationChains, validateThresholdRanges } = require('../validators/sensorValidators');

const router = express.Router();

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Get all sensor nodes for the authenticated user
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [online, offline, maintenance, error]
 *         description: Filter by sensor status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of sensors to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of sensor nodes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sensorNodes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorNode'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 pages:
 *                   type: integer
 */
router.get('/', authenticateJWT, validationChains.getSensors, sensorController.getSensors);

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
 *                 description: Unique identifier for the sensor node
 *               name:
 *                 type: string
 *                 description: Human-readable name for the sensor node
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 minItems: 2
 *                 maxItems: 2
 *                 description: [longitude, latitude]
 *               cropType:
 *                 type: string
 *                 description: Type of crop being monitored
 *               soilType:
 *                 type: string
 *                 enum: [sandy, clay, loamy, silty, unknown]
 *                 description: Type of soil
 *     responses:
 *       201:
 *         description: Sensor node registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Sensor node already exists
 */
router.post('/register', authenticateJWT, validationChains.registerSensor, sensorController.registerSensor);

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
 *         description: Sensor node ID
 *     responses:
 *       200:
 *         description: Sensor node details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorNode'
 *       404:
 *         description: Sensor node not found
 */
router.get('/:nodeId', authenticateJWT, validationChains.getSensorDetails, sensorController.getSensorDetails);

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
 *         description: Sensor node ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               configuration:
 *                 type: object
 *                 properties:
 *                   cropType:
 *                     type: string
 *                   soilType:
 *                     type: string
 *                     enum: [sandy, clay, loamy, silty, unknown]
 *                   irrigationType:
 *                     type: string
 *                     enum: [drip, sprinkler, flood, manual, none]
 *                   thresholds:
 *                     type: object
 *     responses:
 *       200:
 *         description: Sensor node updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Sensor node not found
 */
router.put('/:nodeId', authenticateJWT, validationChains.updateSensor, validateThresholdRanges, sensorController.updateSensor);

/**
 * @swagger
 * /api/sensors/{nodeId}/data:
 *   get:
 *     summary: Get sensor data for a specific node
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor node ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for data range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for data range
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of data points to return
 *     responses:
 *       200:
 *         description: Sensor data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sensorData:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorData'
 *                 total:
 *                   type: integer
 *                 nodeId:
 *                   type: string
 *       404:
 *         description: Sensor node not found
 */
router.get('/:nodeId/data', authenticateJWT, validationChains.getSensorData, sensorController.getSensorData);

/**
 * @swagger
 * /api/sensors/{nodeId}/data:
 *   post:
 *     summary: Submit sensor data for a specific node
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor node ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soilMoisture:
 *                 type: number
 *                 description: Soil moisture percentage
 *               temperature:
 *                 type: number
 *                 description: Temperature in Celsius
 *               humidity:
 *                 type: number
 *                 description: Humidity percentage
 *               ph:
 *                 type: number
 *                 description: pH value
 *               nutrients:
 *                 type: object
 *                 description: Nutrient levels
 *               light:
 *                 type: number
 *                 description: Light intensity
 *               batteryLevel:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Battery level percentage
 *               signalStrength:
 *                 type: number
 *                 minimum: -120
 *                 maximum: 0
 *                 description: Signal strength in dBm
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Data timestamp
 *     responses:
 *       201:
 *         description: Sensor data submitted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Sensor node not found
 */
router.post('/:nodeId/data', authenticateJWT, validationChains.submitSensorData, sensorController.submitSensorData);

/**
 * @swagger
 * /api/sensors/{nodeId}:
 *   delete:
 *     summary: Delete a sensor node
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor node ID
 *     responses:
 *       200:
 *         description: Sensor node deleted successfully
 *       404:
 *         description: Sensor node not found
 */
router.delete('/:nodeId', authenticateJWT, validationChains.deleteSensor, sensorController.deleteSensor);

module.exports = router; 