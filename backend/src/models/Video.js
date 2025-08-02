const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  filename: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fieldLocation: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    fieldName: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'failed'],
    default: 'uploading',
    index: true
  },
  aiSummary: {
    type: String,
    maxlength: 2000
  },
  aiTags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  processingError: {
    type: String,
    maxlength: 500
  },
  thumbnailUrl: {
    type: String
  },
  metadata: {
    width: Number,
    height: Number,
    fps: Number,
    codec: String,
    bitrate: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
videoSchema.index({ userId: 1, createdAt: -1 });
videoSchema.index({ status: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ aiTags: 1 });

// Virtual for formatted file size
videoSchema.virtual('formattedFileSize').get(function() {
  const bytes = this.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for formatted duration
videoSchema.virtual('formattedDuration').get(function() {
  const seconds = this.duration;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
});

// Method to get public video data (without sensitive info)
videoSchema.methods.toPublicJSON = function() {
  const video = this.toObject();
  delete video.processingError;
  return video;
};

// Static method to get videos by user with pagination
videoSchema.statics.findByUser = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'firstName lastName email');
};

// Static method to get videos by status
videoSchema.statics.findByStatus = function(status, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'firstName lastName email');
};

module.exports = mongoose.model('Video', videoSchema); 