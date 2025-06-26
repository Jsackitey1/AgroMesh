const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const geminiService = require('../services/geminiService');
const authenticateJWT = require('../middlewares/auth');

const router = express.Router();
const upload = multer();

// Rate limiter: max 10 requests per minute per IP for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { message: 'Too many requests, please try again later.' },
});

// Simple logger for AI requests/responses
async function aiLogger(req, res, next) {
  const start = Date.now();
  const originalJson = res.json;
  res.json = function (body) {
    const duration = Date.now() - start;
    console.log(`[AI LOG] User: ${req.user ? req.user.id : 'unknown'} | Endpoint: ${req.originalUrl} | Duration: ${duration}ms | Request:`, req.method === 'POST' ? req.body : {}, '| Response:', body);
    return originalJson.call(this, body);
  };
  next();
}

// All routes below require authentication, rate limiting, and logging
router.use(authenticateJWT, aiLimiter, aiLogger);

/**
 * @swagger
 * /api/ai/suggest:
 *   post:
 *     summary: Get AI suggestions based on sensor data
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: AI suggestion
 */
router.post('/suggest', async (req, res) => {
  try {
    const sensorData = req.body;
    if (!sensorData || typeof sensorData !== 'object' || Array.isArray(sensorData)) {
      return res.status(400).json({ message: 'Invalid or missing sensor data' });
    }
    const result = await geminiService.getSuggestionFromSensorData(sensorData);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get AI suggestion', error: err.message });
  }
});

/**
 * @swagger
 * /api/ai/diagnose-image:
 *   post:
 *     summary: Diagnose plant health from an image
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: AI diagnosis
 */
router.post('/diagnose-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    const result = await geminiService.diagnoseImage(req.file.buffer, req.file.originalname);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to diagnose image', error: err.message });
  }
});

/**
 * @swagger
 * /api/ai/diagnose-video:
 *   post:
 *     summary: Diagnose plant health from a video
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: AI diagnosis
 */
router.post('/diagnose-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'Video file is required' });
    }
    const result = await geminiService.diagnoseVideo(req.file.buffer, req.file.originalname);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to diagnose video', error: err.message });
  }
});

/**
 * @swagger
 * /api/ai/ask:
 *   post:
 *     summary: Ask a question and get an AI answer
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI answer
 */
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid question' });
    }
    const result = await geminiService.askQuestion(question);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get AI answer', error: err.message });
  }
});

module.exports = router; 