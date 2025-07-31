const express = require('express');
const { query, param, body, validationResult } = require('express-validator');
const Alert = require('../models/Alert');
const authenticateJWT = require('../middlewares/auth');
const { io } = require('../../index');

const router = express.Router();

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get user alerts
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, acknowledged, resolved, dismissed]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [irrigation, pestRisk, anomaly, aiSuggestion, system, maintenance]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of alerts
 */
router.get('/', authenticateJWT, [
  query('status').optional().isIn(['active', 'acknowledged', 'resolved', 'dismissed']),
  query('type').optional().isIn(['irrigation', 'pestRisk', 'anomaly', 'aiSuggestion', 'system', 'maintenance']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { status, type, limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (type) filter.type = type;

    // Get alerts with pagination
    const alerts = await Alert.find(filter)
      .populate('sensorNode', 'nodeId name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Alert.countDocuments(filter);

    const formattedAlerts = alerts.map(alert => alert.toSummary());

    res.json({
      alerts: formattedAlerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get alerts', error: err.message });
  }
});

/**
 * @swagger
 * /api/alerts/unread:
 *   get:
 *     summary: Get unread alerts count
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread alerts count
 */
router.get('/unread', authenticateJWT, async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      user: req.user.id,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get unread count', error: err.message });
  }
});

/**
 * @swagger
 * /api/alerts/{alertId}:
 *   get:
 *     summary: Get alert details
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alert details
 */
router.get('/:alertId', authenticateJWT, [
  param('alertId').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { alertId } = req.params;

    const alert = await Alert.findOne({
      _id: alertId,
      user: req.user.id
    }).populate('sensorNode', 'nodeId name');

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get alert', error: err.message });
  }
});

/**
 * @swagger
 * /api/alerts/{alertId}/acknowledge:
 *   post:
 *     summary: Acknowledge an alert
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alert acknowledged
 */
router.post('/:alertId/acknowledge', authenticateJWT, [
  param('alertId').isMongoId(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { alertId } = req.params;
    const { notes } = req.body;

    const alert = await Alert.findOne({
      _id: alertId,
      user: req.user.id
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await alert.acknowledge(req.user.id, notes);

    // Emit real-time update
    io.emit('alertUpdated', {
      alertId: alert._id,
      userId: req.user.id,
      status: alert.status
    });

    res.json({
      message: 'Alert acknowledged successfully',
      alert: alert.toSummary()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to acknowledge alert', error: err.message });
  }
});

/**
 * @swagger
 * /api/alerts/{alertId}/resolve:
 *   post:
 *     summary: Resolve an alert
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alert resolved
 */
router.post('/:alertId/resolve', authenticateJWT, [
  param('alertId').isMongoId(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { alertId } = req.params;
    const { notes } = req.body;

    const alert = await Alert.findOne({
      _id: alertId,
      user: req.user.id
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await alert.resolve(req.user.id, notes);

    // Emit real-time update
    io.emit('alertUpdated', {
      alertId: alert._id,
      userId: req.user.id,
      status: alert.status
    });

    res.json({
      message: 'Alert resolved successfully',
      alert: alert.toSummary()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to resolve alert', error: err.message });
  }
});

/**
 * @swagger
 * /api/alerts/{alertId}/dismiss:
 *   post:
 *     summary: Dismiss an alert
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alert dismissed
 */
router.post('/:alertId/dismiss', authenticateJWT, [
  param('alertId').isMongoId(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { alertId } = req.params;
    const { notes } = req.body;

    const alert = await Alert.findOne({
      _id: alertId,
      user: req.user.id
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await alert.dismiss(req.user.id, notes);

    // Emit real-time update
    io.emit('alertUpdated', {
      alertId: alert._id,
      userId: req.user.id,
      status: alert.status
    });

    res.json({
      message: 'Alert dismissed successfully',
      alert: alert.toSummary()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to dismiss alert', error: err.message });
  }
});

/**
 * @swagger
 * /api/alerts/mark-all-read:
 *   post:
 *     summary: Mark all alerts as read
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All alerts marked as read
 */
router.post('/mark-all-read', authenticateJWT, async (req, res) => {
  try {
    const result = await Alert.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    // Emit real-time update
    io.emit('alertsMarkedRead', {
      userId: req.user.id,
      count: result.modifiedCount
    });

    res.json({
      message: 'All alerts marked as read',
      updatedCount: result.modifiedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to mark alerts as read', error: err.message });
  }
});

module.exports = router; 