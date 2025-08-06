const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Only initialize Gemini if API key is provided
let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI(GEMINI_API_KEY);
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
    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [{ text: prompt }]
    });
    return result.response;
  } catch (error) {
    console.error('Gemini AI error:', error);
    return { message: 'AI service temporarily unavailable.' };
  }
}

// Image-based plant diagnosis
async function diagnoseImage(imageBuffer, filename, options = {}) {
  if (!genAI) {
    return { 
      success: false,
      message: 'AI service not available. Please configure GEMINI_API_KEY.' 
    };
  }
  
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const prompt = `You are an expert agricultural AI assistant specializing in plant health diagnosis. Analyze this image and provide a comprehensive assessment.

Please provide your analysis in the following structured format:

**Plant Health Assessment:**
- Overall health status (Healthy/Concerning/Critical)
- Visible symptoms and their severity
- Potential diseases or pests identified
- Environmental stress factors

**Diagnosis:**
- Specific disease or pest identification (if any)
- Confidence level in diagnosis (High/Medium/Low)
- Similar conditions or look-alike issues to consider

**Treatment Recommendations:**
- Immediate actions to take
- Long-term management strategies
- Preventive measures
- When to consult a professional

**Additional Observations:**
- Growth stage assessment
- Nutrient deficiency signs
- Watering or care issues
- Environmental conditions

Be specific, actionable, and provide evidence-based recommendations. If the image quality is poor or unclear, mention this and suggest what additional photos might help.`;

    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [
        { text: prompt },
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });
    
    const text = result.candidates[0].content.parts[0].text;
    
    // Extract usage statistics if available
    const usageMetadata = result.usageMetadata;
    const tokensUsed = {
      input: usageMetadata?.promptTokenCount || 0,
      output: usageMetadata?.candidatesTokenCount || 0
    };

    return {
      success: true,
      diagnosis: text,
      tokensUsed,
      model: 'models/gemini-1.5-flash',
      timestamp: new Date().toISOString(),
      filename: filename
    };
  } catch (error) {
    console.error('Gemini AI error:', error);
    return { 
      success: false,
      message: 'AI service temporarily unavailable.',
      error: error.message
    };
  }
}

// Video-based plant diagnosis
async function diagnoseVideo(videoBuffer, filename) {
  if (!genAI) {
    return { 
      success: false,
      message: 'AI service not available. Please configure GEMINI_API_KEY.' 
    };
  }
  
  try {
    const base64Video = videoBuffer.toString('base64');
    
    const prompt = `You are an expert agricultural AI assistant specializing in plant health diagnosis from video footage. Analyze this video and provide a comprehensive assessment.

Please provide your analysis in the following structured format:

**Video Content Analysis:**
- What you observe in the video
- Plant health indicators
- Environmental conditions visible
- Any equipment or farming activities shown

**Plant Health Assessment:**
- Overall health status (Healthy/Concerning/Critical)
- Visible symptoms and their severity
- Potential diseases or pests identified
- Environmental stress factors

**Diagnosis:**
- Specific disease or pest identification (if any)
- Confidence level in diagnosis (High/Medium/Low)
- Similar conditions or look-alike issues to consider

**Treatment Recommendations:**
- Immediate actions to take
- Long-term management strategies
- Preventive measures
- When to consult a professional

**Additional Observations:**
- Growth stage assessment
- Nutrient deficiency signs
- Watering or care issues
- Environmental conditions

Be specific, actionable, and provide evidence-based recommendations. If the video quality is poor or unclear, mention this and suggest what additional footage might help.`;

    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [
        { text: prompt },
        { inlineData: { data: base64Video, mimeType: 'video/mp4' } }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });
    
    const text = result.candidates[0].content.parts[0].text;
    
    // Extract usage statistics if available
    const usageMetadata = result.usageMetadata;
    const tokensUsed = {
      input: usageMetadata?.promptTokenCount || 0,
      output: usageMetadata?.candidatesTokenCount || 0
    };

    return {
      success: true,
      diagnosis: text,
      tokensUsed,
      model: 'models/gemini-1.5-flash',
      timestamp: new Date().toISOString(),
      filename: filename
    };
  } catch (error) {
    console.error('Gemini AI error:', error);
    return { 
      success: false,
      message: 'AI service temporarily unavailable.',
      error: error.message
    };
  }
}

async function askQuestion(question, context = {}) {
  if (!genAI) {
    return { 
      success: false,
      message: 'AI service not available. Please configure GEMINI_API_KEY.' 
    };
  }
  
  try {
    // Build context-aware prompt
    const contextInfo = context.location ? `Location: ${context.location}. ` : '';
    const seasonInfo = context.season ? `Current season: ${context.season}. ` : '';
    const cropInfo = context.crop ? `Crop type: ${context.crop}. ` : '';
    
    const enhancedPrompt = `You are an expert agricultural AI assistant with deep knowledge of farming practices, crop management, pest control, soil health, and sustainable agriculture.

${contextInfo}${seasonInfo}${cropInfo}

**User Question:** ${question}

Please provide a comprehensive, practical response that includes:

**Direct Answer:**
- Clear, actionable response to the question
- Step-by-step guidance if applicable

**Additional Context:**
- Relevant agricultural principles
- Best practices and recommendations
- Common mistakes to avoid

**Practical Tips:**
- Specific actions the farmer can take
- Tools or resources that might help
- Timing considerations

**Safety & Sustainability:**
- Environmental considerations
- Safety precautions
- Sustainable practices

Be specific, practical, and provide evidence-based advice. If the question requires more context or specific details, ask clarifying questions.`;

    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [{ text: enhancedPrompt }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });
    const text = result.candidates[0].content.parts[0].text;
    
    // Extract usage statistics if available
    const usageMetadata = result.usageMetadata;
    const tokensUsed = {
      input: usageMetadata?.promptTokenCount || 0,
      output: usageMetadata?.candidatesTokenCount || 0
    };

    return {
      success: true,
      answer: text,
      tokensUsed,
      model: 'models/gemini-1.5-flash',
      timestamp: new Date().toISOString(),
      context: context
    };
  } catch (error) {
    console.error('Gemini AI error:', error);
    return { 
      success: false,
      message: 'AI service temporarily unavailable.',
      error: error.message
    };
  }
}

// Smart recommendations based on multiple data sources
async function getSmartRecommendations(data = {}) {
  if (!genAI) {
    return { 
      success: false,
      message: 'AI service not available. Please configure GEMINI_API_KEY.' 
    };
  }
  
  try {
    const {
      sensorData = {},
      weather = {},
      season = 'current',
      crop = 'general',
      location = 'unknown',
      soilData = {},
      pestHistory = []
    } = data;

    const prompt = `You are an expert agricultural AI assistant providing personalized farming recommendations.

**Current Data:**
- Location: ${location}
- Season: ${season}
- Crop: ${crop}
- Sensor Data: ${JSON.stringify(sensorData)}
- Weather: ${JSON.stringify(weather)}
- Soil Data: ${JSON.stringify(soilData)}
- Pest History: ${pestHistory.join(', ') || 'None recorded'}

Please provide comprehensive, personalized recommendations in this format:

**Immediate Actions (Next 24-48 hours):**
- Priority tasks based on current conditions
- Urgent interventions if needed
- Weather-based adjustments

**Short-term Planning (Next 1-2 weeks):**
- Upcoming tasks and preparations
- Monitoring priorities
- Resource planning

**Long-term Strategy (Next 1-3 months):**
- Seasonal planning
- Crop rotation considerations
- Infrastructure improvements

**Risk Management:**
- Potential threats to watch for
- Preventive measures
- Contingency plans

**Resource Optimization:**
- Water usage recommendations
- Fertilizer application timing
- Labor planning

**Sustainability Focus:**
- Environmental best practices
- Soil health maintenance
- Biodiversity considerations

Provide specific, actionable advice tailored to the farmer's situation. Include timing, quantities, and methods where applicable.`;

    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [{ text: prompt }],
      generationConfig: {
        temperature: 0.3,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });
    const text = result.candidates[0].content.parts[0].text;
    
    // Extract usage statistics if available
    const usageMetadata = result.usageMetadata;
    const tokensUsed = {
      input: usageMetadata?.promptTokenCount || 0,
      output: usageMetadata?.candidatesTokenCount || 0
    };

    return {
      success: true,
      recommendations: text,
      tokensUsed,
      model: 'models/gemini-1.5-flash',
      timestamp: new Date().toISOString(),
      dataSource: data
    };
  } catch (error) {
    console.error('Gemini AI error:', error);
    return { 
      success: false,
      message: 'AI service temporarily unavailable.',
      error: error.message
    };
  }
}

module.exports = {
  getSuggestionFromSensorData,
  diagnoseImage,
  diagnoseVideo,
  askQuestion,
  getSmartRecommendations,
};
