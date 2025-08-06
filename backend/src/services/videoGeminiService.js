const { GoogleGenAI } = require('@google/genai');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

// Initialize Gemini AI with the provided API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI = null;

if (!GEMINI_API_KEY) {
  logger.warn('⚠️ GEMINI_API_KEY not found in environment variables. Video analysis features will be disabled.');
} else {
  try {
    genAI = new GoogleGenAI(GEMINI_API_KEY);
    logger.info('✅ Gemini AI initialized successfully for video analysis');
  } catch (error) {
    logger.warn('Failed to initialize Gemini AI for video analysis:', error.message);
  }
}

/**
 * Analyze video content using Gemini AI
 * @param {string} videoPath - Path to the video file
 * @param {string} prompt - User prompt for analysis
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeVideo(videoPath, prompt, options = {}) {
  if (!genAI) {
    return {
      success: false,
      error: 'AI service not available. Please configure GEMINI_API_KEY.',
      processingTime: 0
    };
  }

  const startTime = Date.now();
  
  try {
    // Read video file
    const videoData = await fs.readFile(videoPath);
    const videoBuffer = Buffer.from(videoData);
    
    // Get file extension for MIME type
    const ext = path.extname(videoPath).toLowerCase();
    const mimeType = getMimeType(ext);
    
    if (!mimeType) {
      throw new Error(`Unsupported video format: ${ext}`);
    }

    // Create the content parts
    const parts = [
      {
        text: `You are an expert agricultural AI assistant. Analyze this video and provide insights about farming, crops, pests, or any agricultural concerns. 

User Question: ${prompt}

Please provide a detailed analysis focusing on:
1. What you observe in the video
2. Any potential issues or concerns
3. Recommendations for the farmer
4. Specific details about crops, pests, or equipment if visible

Be specific and actionable in your response.`
      },
      {
        inlineData: {
          mimeType: mimeType,
          data: videoBuffer.toString('base64')
        }
      }
    ];

    // Generate content using the new API
    const result = await genAI.models.generateContent({
      model: options.model || "models/gemini-1.5-flash",
      contents: [{ parts }],
      generationConfig: {
        temperature: options.temperature || 0.4,
        topK: options.topK || 32,
        topP: options.topP || 1,
        maxOutputTokens: options.maxOutputTokens || 2048,
      }
    });

    const text = result.candidates[0].content.parts[0].text;
    
    const processingTime = Date.now() - startTime;

    // Extract usage statistics if available
    const usageMetadata = result.usageMetadata;
    const tokensUsed = {
      input: usageMetadata?.promptTokenCount || 0,
      output: usageMetadata?.candidatesTokenCount || 0
    };

    logger.info(`Video analysis completed in ${processingTime}ms`, {
      videoPath,
      promptLength: prompt.length,
      responseLength: text.length,
      tokensUsed
    });

    return {
      success: true,
      response: text,
      processingTime,
      tokensUsed,
      model: options.model || "gemini-2.0-flash",
      confidence: calculateConfidence(text, processingTime)
    };

  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('Video analysis failed:', error);
    
    return {
      success: false,
      error: error.message,
      processingTime
    };
  }
}

/**
 * Generate a summary of video content
 * @param {string} videoPath - Path to the video file
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Summary result
 */
async function generateVideoSummary(videoPath, options = {}) {
  const defaultPrompt = `Please provide a comprehensive summary of this agricultural video. Include:
1. Main observations and key points
2. Any visible crops, pests, or equipment
3. Potential issues or areas of concern
4. Overall assessment of the field/farm condition
5. Suggested tags for categorization

Format your response as a structured summary with clear sections.`;

  return analyzeVideo(videoPath, defaultPrompt, {
    ...options,
    maxOutputTokens: 1024,
    temperature: 0.3
  });
}

/**
 * Answer specific questions about video content
 * @param {string} videoPath - Path to the video file
 * @param {string} question - Specific question about the video
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Answer result
 */
async function answerVideoQuestion(videoPath, question, options = {}) {
  return analyzeVideo(videoPath, question, {
    ...options,
    maxOutputTokens: 1024,
    temperature: 0.4
  });
}

/**
 * Diagnose agricultural issues from video
 * @param {string} videoPath - Path to the video file
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Diagnosis result
 */
async function diagnoseAgriculturalIssues(videoPath, options = {}) {
  const diagnosisPrompt = `Please analyze this video for agricultural issues and provide a diagnosis. Focus on:

1. Plant health and disease symptoms
2. Pest infestations and damage
3. Soil conditions and irrigation issues
4. Equipment problems or maintenance needs
5. Environmental factors affecting crops

Provide specific recommendations for each issue identified.`;

  return analyzeVideo(videoPath, diagnosisPrompt, {
    ...options,
    maxOutputTokens: 1500,
    temperature: 0.3
  });
}

/**
 * Get MIME type from file extension
 * @param {string} ext - File extension
 * @returns {string|null} MIME type
 */
function getMimeType(ext) {
  const mimeTypes = {
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
    '.mkv': 'video/x-matroska',
    '.flv': 'video/x-flv',
    '.wmv': 'video/x-ms-wmv',
    '.m4v': 'video/x-m4v'
  };
  
  return mimeTypes[ext] || null;
}

/**
 * Calculate confidence score based on response quality
 * @param {string} response - AI response text
 * @param {number} processingTime - Processing time in milliseconds
 * @returns {number} Confidence score (0-1)
 */
function calculateConfidence(response, processingTime) {
  let confidence = 0.5; // Base confidence
  
  // Factor in response length (longer responses tend to be more detailed)
  const responseLength = response.length;
  if (responseLength > 500) confidence += 0.2;
  else if (responseLength > 200) confidence += 0.1;
  
  // Factor in processing time (faster responses might be more confident)
  if (processingTime < 5000) confidence += 0.1;
  else if (processingTime > 30000) confidence -= 0.1;
  
  // Factor in response quality indicators
  if (response.includes('recommend') || response.includes('suggest')) confidence += 0.1;
  if (response.includes('observe') || response.includes('see')) confidence += 0.1;
  if (response.includes('issue') || response.includes('problem')) confidence += 0.1;
  
  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Test Gemini API connectivity
 * @returns {Promise<Object>} Test result
 */
async function testGeminiConnection() {
  if (!genAI) {
    return {
      success: false,
      error: 'Gemini AI not initialized'
    };
  }

  try {
    const result = await genAI.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [{ text: "Hello, this is a test message." }]
    });
    
    return {
      success: true,
      message: 'Gemini API connection successful',
      response: result.candidates[0].content.parts[0].text
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  analyzeVideo,
  generateVideoSummary,
  answerVideoQuestion,
  diagnoseAgriculturalIssues,
  testGeminiConnection,
  isAvailable: () => !!genAI
}; 