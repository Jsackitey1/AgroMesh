const express = require('express');
const { query, validationResult } = require('express-validator');
const SensorNode = require('../models/SensorNode');
const SensorData = require('../models/SensorData');
const Alert = require('../models/Alert');
const authenticateJWT = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary data
 */
router.get('/summary', authenticateJWT, async (req, res) => {
  try {
    // Get sensor nodes count by status
    const sensorNodes = await SensorNode.find({ owner: req.user.id, isActive: true });
    const nodeStatusCounts = {
      online: 0,
      offline: 0,
      maintenance: 0,
      error: 0
    };

    sensorNodes.forEach(node => {
      const status = node.getStatus();
      nodeStatusCounts[status]++;
    });

    // Get recent alerts count
    const recentAlertsCount = await Alert.countDocuments({
      user: req.user.id,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    // Get unread alerts count
    const unreadAlertsCount = await Alert.countDocuments({
      user: req.user.id,
      isRead: false
    });

    // Get latest sensor data
    const latestData = await SensorData.aggregate([
      {
        $lookup: {
          from: 'sensornodes',
          localField: 'sensorNode',
          foreignField: '_id',
          as: 'node'
        }
      },
      {
        $match: {
          'node.owner': req.user.id
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          nodeId: 1,
          timestamp: 1,
          readings: 1,
          'node.name': 1
        }
      }
    ]);

    res.json({
      summary: {
        totalNodes: sensorNodes.length,
        nodeStatusCounts,
        recentAlerts: recentAlertsCount,
        unreadAlerts: unreadAlertsCount
      },
      latestData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get dashboard summary', error: err.message });
  }
});

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: week
 *       - in: query
 *         name: nodeId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get('/analytics', authenticateJWT, [
  query('period').optional().isIn(['day', 'week', 'month']),
  query('nodeId').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { period = 'week', nodeId } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // Build query
    const query = { timestamp: { $gte: startDate } };
    if (nodeId) {
      const sensorNode = await SensorNode.findOne({ 
        nodeId, 
        owner: req.user.id,
        isActive: true 
      });
      if (!sensorNode) {
        return res.status(404).json({ message: 'Sensor node not found' });
      }
      query.sensorNode = sensorNode._id;
    } else {
      // Get all user's sensor nodes
      const userNodes = await SensorNode.find({ 
        owner: req.user.id, 
        isActive: true 
      }).select('_id');
      query.sensorNode = { $in: userNodes.map(node => node._id) };
    }

    // Get sensor data for analytics
    const sensorData = await SensorData.find(query)
      .sort({ timestamp: 1 })
      .select('timestamp readings');

    // Process data for charts
    const chartData = {
      soilMoisture: [],
      temperature: [],
      humidity: [],
      ph: []
    };

    sensorData.forEach(data => {
      const timestamp = data.timestamp;
      
      if (data.readings.soilMoisture?.value !== undefined) {
        chartData.soilMoisture.push({
          timestamp,
          value: data.readings.soilMoisture.value
        });
      }
      
      if (data.readings.temperature?.value !== undefined) {
        chartData.temperature.push({
          timestamp,
          value: data.readings.temperature.value
        });
      }
      
      if (data.readings.humidity?.value !== undefined) {
        chartData.humidity.push({
          timestamp,
          value: data.readings.humidity.value
        });
      }
      
      if (data.readings.ph?.value !== undefined) {
        chartData.ph.push({
          timestamp,
          value: data.readings.ph.value
        });
      }
    });

    // Calculate averages
    const averages = {};
    Object.keys(chartData).forEach(key => {
      const values = chartData[key].map(item => item.value);
      if (values.length > 0) {
        averages[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });

    res.json({
      period,
      nodeId,
      chartData,
      averages,
      totalReadings: sensorData.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get analytics', error: err.message });
  }
});

/**
 * @swagger
 * /api/dashboard/alerts-summary:
 *   get:
 *     summary: Get alerts summary for dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Alerts summary
 */
router.get('/alerts-summary', authenticateJWT, [
  query('days').optional().isInt({ min: 1, max: 30 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { days = 7 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get alerts by type and severity
    const alertsByType = await Alert.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { type: '$type', severity: '$severity' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get alerts by status
    const alertsByStatus = await Alert.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get daily alert counts
    const dailyAlerts = await Alert.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json({
      period: `${days} days`,
      alertsByType,
      alertsByStatus,
      dailyAlerts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get alerts summary', error: err.message });
  }
});

/**
 * @swagger
 * /api/dashboard/nodes-overview:
 *   get:
 *     summary: Get nodes overview for dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nodes overview
 */
router.get('/nodes-overview', authenticateJWT, async (req, res) => {
  try {
    // Get all user's sensor nodes with latest data
    const sensorNodes = await SensorNode.find({ 
      owner: req.user.id, 
      isActive: true 
    }).sort({ lastSeen: -1 });

    const nodesOverview = await Promise.all(
      sensorNodes.map(async (node) => {
        // Get latest data for this node
        const latestData = await SensorData.findOne({ sensorNode: node._id })
          .sort({ timestamp: -1 })
          .select('readings timestamp');

        // Get alerts count for this node
        const alertsCount = await Alert.countDocuments({
          user: req.user.id,
          sensorNode: node._id,
          status: 'active'
        });

        return {
          ...node.toPublicJSON(),
          latestData: latestData ? {
            readings: latestData.getFormattedReadings(),
            timestamp: latestData.timestamp
          } : null,
          activeAlerts: alertsCount
        };
      })
    );

    res.json({
      nodes: nodesOverview,
      total: nodesOverview.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get nodes overview', error: err.message });
  }
});

module.exports = router; 