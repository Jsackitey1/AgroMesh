const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const authenticateJWT = require('../middlewares/auth');
const Video = require('../models/Video');
const VideoAnalysis = require('../models/VideoAnalysis');
const videoGeminiService = require('../services/videoGeminiService');
const { logger } = require('../utils/logger');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = process.env.VIDEO_UPLOAD_PATH || './uploads/videos';
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_VIDEO_TYPES || 'mp4,avi,mov,webm').split(',');
  const fileExt = path.extname(file.originalname).toLowerCase().substring(1);

  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_VIDEO_SIZE) || 100 * 1024 * 1024, // 100MB default
  }
});

/**
 * @swagger
 * /api/videos/test:
 *   get:
 *     summary: Test Gemini API connection
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: API connection status
 */
router.get('/test', async (req, res) => {
  try {
    const result = await videoGeminiService.testGeminiConnection();
    res.json({
      message: 'Gemini API test completed',
      ...result
    });
  } catch (error) {
    logger.error('Gemini API test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/videos/upload:
 *   post:
 *     summary: Upload a video file
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
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
 *                 description: Video file to upload
 *               title:
 *                 type: string
 *                 description: Video title
 *               description:
 *                 type: string
 *                 description: Video description
 *               fieldLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   fieldName:
 *                     type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', authenticateJWT, upload.single('video'), [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('fieldLocation.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('fieldLocation.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('fieldLocation.fieldName').optional().trim().isLength({ max: 100 }).withMessage('Field name must be less than 100 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { title, description, fieldLocation, tags } = req.body;

    // Create video record
    const video = new Video({
      userId: req.user.id,
      title,
      description,
      filename: req.file.filename,
      fileUrl: `/uploads/videos/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fieldLocation: fieldLocation ? JSON.parse(fieldLocation) : null,
      tags: tags ? JSON.parse(tags) : []
    });

    await video.save();

    logger.info(`Video uploaded successfully: ${video._id}`, {
      userId: req.user.id,
      filename: req.file.filename,
      fileSize: req.file.size
    });

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: video.toPublicJSON()
    });

  } catch (error) {
    logger.error('Video upload failed:', error);
    res.status(500).json({
      message: 'Failed to upload video',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get user's videos
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [uploading, processing, completed, failed]
 *     responses:
 *       200:
 *         description: List of videos
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };
    if (status) {
      query.status = status;
    }

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email');

    const total = await Video.countDocuments(query);

    res.json({
      videos: videos.map(video => video.toPublicJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Failed to fetch videos:', error);
    res.status(500).json({
      message: 'Failed to fetch videos',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get video details
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video details
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('userId', 'firstName lastName email');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({
      video: video.toPublicJSON()
    });

  } catch (error) {
    logger.error('Failed to fetch video:', error);
    res.status(500).json({
      message: 'Failed to fetch video',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/videos/{id}/analyze:
 *   post:
 *     summary: Analyze video with AI
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               prompt:
 *                 type: string
 *                 description: Analysis prompt
 *               analysisType:
 *                 type: string
 *                 enum: [summary, question, diagnosis, recommendation]
 *                 default: question
 *     responses:
 *       200:
 *         description: Analysis completed
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/analyze', authenticateJWT, [
  body('prompt').trim().isLength({ min: 1, max: 1000 }).withMessage('Prompt is required and must be less than 1000 characters'),
  body('analysisType').optional().isIn(['summary', 'question', 'diagnosis', 'recommendation']).withMessage('Invalid analysis type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const video = await Video.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const { prompt, analysisType = 'question' } = req.body;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create analysis record
    const analysis = new VideoAnalysis({
      videoId: video._id,
      userId: req.user.id,
      sessionId,
      prompt,
      status: 'processing',
      metadata: {
        analysisType,
        language: 'en'
      }
    });

    await analysis.save();

    // Get video file path
    const videoPath = path.join(process.env.VIDEO_UPLOAD_PATH || './uploads/videos', video.filename);

    // Perform AI analysis
    let result;
    switch (analysisType) {
      case 'summary':
        result = await videoGeminiService.generateVideoSummary(videoPath);
        break;
      case 'diagnosis':
        result = await videoGeminiService.diagnoseAgriculturalIssues(videoPath);
        break;
      default:
        result = await videoGeminiService.answerVideoQuestion(videoPath, prompt);
    }

    // Update analysis record
    analysis.status = result.success ? 'completed' : 'failed';
    analysis.response = result.success ? result.response : result.error;
    analysis.processingTime = result.processingTime;
    analysis.tokensUsed = result.tokensUsed || { input: 0, output: 0 };
    analysis.confidence = result.confidence || 0;
    analysis.model = result.model || 'gemini-2.0-flash';

    if (!result.success) {
      analysis.error = {
        message: result.error,
        code: 'ANALYSIS_FAILED'
      };
    }

    await analysis.save();

    // Update video with AI summary if this is the first analysis
    if (result.success && analysisType === 'summary' && !video.aiSummary) {
      video.aiSummary = result.response;
      video.status = 'completed';
      await video.save();
    }

    logger.info(`Video analysis completed: ${analysis._id}`, {
      videoId: video._id,
      userId: req.user.id,
      analysisType,
      processingTime: result.processingTime
    });

    res.json({
      message: result.success ? 'Analysis completed successfully' : 'Analysis failed',
      analysis: analysis.toPublicJSON(),
      success: result.success
    });

  } catch (error) {
    logger.error('Video analysis failed:', error);
    res.status(500).json({
      message: 'Failed to analyze video',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/videos/{id}/history:
 *   get:
 *     summary: Get video analysis history
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Analysis history
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/history', authenticateJWT, async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const { page = 1, limit = 20 } = req.query;
    const analyses = await VideoAnalysis.getHistory(video._id, parseInt(page), parseInt(limit));

    res.json({
      analyses: analyses.map(analysis => analysis.toPublicJSON())
    });

  } catch (error) {
    logger.error('Failed to fetch analysis history:', error);
    res.status(500).json({
      message: 'Failed to fetch analysis history',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: Delete video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete video file
    const videoPath = path.join(process.env.VIDEO_UPLOAD_PATH || './uploads/videos', video.filename);
    try {
      await fs.unlink(videoPath);
    } catch (error) {
      logger.warn(`Failed to delete video file: ${videoPath}`, error);
    }

    // Delete analysis records
    await VideoAnalysis.deleteMany({ videoId: video._id });

    // Delete video record
    await Video.findByIdAndDelete(video._id);

    logger.info(`Video deleted: ${video._id}`, {
      userId: req.user.id,
      filename: video.filename
    });

    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    logger.error('Failed to delete video:', error);
    res.status(500).json({
      message: 'Failed to delete video',
      error: error.message
    });
  }
});

module.exports = router;
