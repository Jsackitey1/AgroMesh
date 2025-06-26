const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://api.gemini.google.com/v1';

// Sensor data -> AI suggestion
async function getSuggestionFromSensorData(sensorData) {
  const prompt = `Given the following data: ${JSON.stringify(sensorData)}, what should the farmer do next?`;
  const response = await axios.post(
    `${GEMINI_BASE_URL}/text/generate`,
    { prompt },
    { headers: { Authorization: `Bearer ${GEMINI_API_KEY}` } }
  );
  return response.data;
}

// Image-based plant diagnosis
async function diagnoseImage(imageBuffer, filename) {
  const formData = new FormData();
  formData.append('image', imageBuffer, filename);
  const response = await axios.post(
    `${GEMINI_BASE_URL}/image/diagnose`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
    }
  );
  return response.data;
}

// Video-based plant diagnosis (if supported)
async function diagnoseVideo(videoBuffer, filename) {
  const formData = new FormData();
  formData.append('video', videoBuffer, filename);
  const response = await axios.post(
    `${GEMINI_BASE_URL}/video/diagnose`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
    }
  );
  return response.data;
}

// Farmer Q&A (text)
async function askQuestion(question) {
  const response = await axios.post(
    `${GEMINI_BASE_URL}/text/generate`,
    { prompt: question },
    { headers: { Authorization: `Bearer ${GEMINI_API_KEY}` } }
  );
  return response.data;
}

module.exports = {
  getSuggestionFromSensorData,
  diagnoseImage,
  diagnoseVideo,
  askQuestion,
}; 