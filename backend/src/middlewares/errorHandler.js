const config = require('../config');

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Error response formatter
const formatError = (error, req) => {
  const isDevelopment = config.server.isDevelopment;
  
  return {
    message: error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack }),
    ...(isDevelopment && { details: error }),
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };
};

// Centralized error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    user: req.user?.id,
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => ({
        path: err.path,
        msg: err.message,
      })),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
      error: 'The provided ID is not valid',
    });
  }

  if (error.name === 'MongoError' && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      message: `${field} already exists`,
      error: `Duplicate value for ${field}`,
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      error: 'Authentication failed',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
      error: 'Please log in again',
    });
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      message: 'File too large',
      error: `Maximum file size is ${config.upload.maxFileSize / (1024 * 1024)}MB`,
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      message: 'Unexpected file field',
      error: 'Invalid file upload',
    });
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const errorResponse = formatError(error, req);

  res.status(statusCode).json(errorResponse);
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  });
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  asyncHandler,
  errorHandler,
  notFoundHandler,
  AppError,
};
