const { GoogleGenerativeAI } = require('@google/genai');
const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Only initialize Gemini if API key is provided
let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (error) {
    console.warn('Failed to initialize Gemini AI:', error.message);
  }
}

// Sensor data -> AI suggestion
async function getSuggestionFromSensorData(sensorData) {
  if (!genAI) {
    return { message: 'AI service not available. Please configure GEMINI_API_KEY.' };
  }
  
  try {
    const prompt = `Given the following data: ${JSON.stringify(sensorData)}, what should the farmer do next?`;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    return result.response;
  } catch (error) {
    console.error('Gemini AI error:', error);
    return { message: 'AI service temporarily unavailable.' };
  }
}

// Image-based plant diagnosis
async function diagnoseImage(imageBuffer, filename) {
  if (!genAI) {
    return { message: 'AI service not available. Please configure GEMINI_API_KEY.' };
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    // The SDK expects a base64 string for the image
    const base64Image = imageBuffer.toString('base64');
    const prompt = 'Diagnose the plant health in this image and give advice.';
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
    ]);
    return result.response;
  } catch (error) {
    console.error('Gemini AI error:', error);
    return { message: 'AI service temporarily unavailable.' };
  }
}

// Video-based plant diagnosis (if supported)
async function diagnoseVideo(videoBuffer, filename) {
  // Gemini API may not support video directly; if not, return not implemented
  // If supported, similar to image, but with video mimeType
  // For now, return a not implemented message
  return { message: 'Video diagnosis is not yet supported by Gemini API.' };
}

async function askQuestion(question) {
  if (!genAI) {
    return { message: 'AI service not available. Please configure GEMINI_API_KEY.' };
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(question);
    return result.response;
  } catch (error) {
    console.error('Gemini AI error:', error);
    return { message: 'AI service temporarily unavailable.' };
  }
}
module.exports = {
  getSuggestionFromSensorData,
  diagnoseImage,
  diagnoseVideo,
  askQuestion,
};
