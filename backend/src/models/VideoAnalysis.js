const mongoose = require('mongoose');

const videoAnalysisSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 1000
  },
  response: {
    type: String,
    required: true,
    maxlength: 5000
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  processingTime: {
    type: Number,
    default: 0
  },
  model: {
    type: String,
    default: 'gemini-2.0-flash',
    enum: ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash']
  },
  tokensUsed: {
    input: {
      type: Number,
      default: 0
    },
    output: {
      type: Number,
      default: 0
    }
  },
  cost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  error: {
    message: String,
    code: String,
    details: String
  },
  metadata: {
    videoTimestamp: Number,
    analysisType: {
      type: String,
      enum: ['summary', 'question', 'diagnosis', 'recommendation'],
      default: 'question'
    },
    language: {
      type: String,
      default: 'en'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
videoAnalysisSchema.index({ videoId: 1, createdAt: -1 });
videoAnalysisSchema.index({ sessionId: 1, createdAt: -1 });
videoAnalysisSchema.index({ status: 1, createdAt: -1 });
videoAnalysisSchema.index({ userId: 1, createdAt: -1 });

// Virtual for total tokens
videoAnalysisSchema.virtual('totalTokens').get(function() {
  return (this.tokensUsed.input || 0) + (this.tokensUsed.output || 0);
});

// Virtual for formatted processing time
videoAnalysisSchema.virtual('formattedProcessingTime').get(function() {
  const ms = this.processingTime;
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
});

// Method to get public analysis data
videoAnalysisSchema.methods.toPublicJSON = function() {
  const analysis = this.toObject();
  delete analysis.error;
  delete analysis.cost;
  return analysis;
};

// Static method to get analysis history for a video
videoAnalysisSchema.statics.getHistory = function(videoId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ videoId, status: 'completed' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'firstName lastName');
};

// Static method to get session history
videoAnalysisSchema.statics.getSessionHistory = function(sessionId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  return this.find({ sessionId, status: 'completed' })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get user's analysis statistics
videoAnalysisSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalAnalyses: { $sum: 1 },
        totalTokens: { $sum: { $add: ['$tokensUsed.input', '$tokensUsed.output'] } },
        totalCost: { $sum: '$cost' },
        avgProcessingTime: { $avg: '$processingTime' },
        successRate: {
          $avg: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        }
      }
    }
  ]);
};

// Pre-save middleware to calculate cost (approximate)
videoAnalysisSchema.pre('save', function(next) {
  if (this.isModified('tokensUsed')) {
    // Approximate cost calculation (adjust based on actual Gemini pricing)
    const inputCost = (this.tokensUsed.input || 0) * 0.0000005; // $0.0005 per 1K tokens
    const outputCost = (this.tokensUsed.output || 0) * 0.0000015; // $0.0015 per 1K tokens
    this.cost = inputCost + outputCost;
  }
  next();
});

module.exports = mongoose.model('VideoAnalysis', videoAnalysisSchema); 