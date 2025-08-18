const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');
const { logger } = require('../utils/logger');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      path: error.path || error.param,
      msg: error.msg,
    }));

    logger.warn('Validation failed', {
      requestId: req.headers['x-request-id'],
      userId: req.user?.id,
      errors: formattedErrors,
      path: req.path,
    });

    return res.status(400).json({
      message: 'Validation error',
      errors: formattedErrors,
      statusCode: 400,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

// Pagination middleware
const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const skip = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    skip,
  };

  next();
};

// Date range middleware
const dateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate || endDate) {
    req.dateRange = {};

    if (startDate) {
      req.dateRange.startDate = new Date(startDate);
      if (isNaN(req.dateRange.startDate.getTime())) {
        return res.status(400).json({
          message: 'Invalid start date format',
          statusCode: 400,
        });
      }
    }

    if (endDate) {
      req.dateRange.endDate = new Date(endDate);
      if (isNaN(req.dateRange.endDate.getTime())) {
        return res.status(400).json({
          message: 'Invalid end date format',
          statusCode: 400,
        });
      }
    }

    if (req.dateRange.startDate && req.dateRange.endDate &&
        req.dateRange.startDate > req.dateRange.endDate) {
      return res.status(400).json({
        message: 'Start date must be before end date',
        statusCode: 400,
      });
    }
  }

  next();
};

// Sorting middleware
const sort = (req, res, next) => {
  const { sortBy, sortOrder } = req.query;

  if (sortBy) {
    req.sort = {
      field: sortBy,
      order: sortOrder === 'desc' ? -1 : 1,
    };
  }

  next();
};

// Filtering middleware
const filter = (req, res, next) => {
  const filters = {};
  const allowedFilters = ['status', 'type', 'severity', 'nodeId'];

  allowedFilters.forEach(filterName => {
    if (req.query[filterName]) {
      filters[filterName] = req.query[filterName];
    }
  });

  if (Object.keys(filters).length > 0) {
    req.filters = filters;
  }

  next();
};

// Response formatting middleware
const formatResponse = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    // Add metadata to responses
    const response = {
      data,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'],
    };

    // Add pagination info if available
    if (req.pagination && Array.isArray(data)) {
      response.pagination = {
        page: req.pagination.page,
        limit: req.pagination.limit,
        total: data.length, // This should be updated with actual total count
      };
    }

    return originalJson.call(this, response);
  };

  next();
};

// Rate limiting helper
const createRateLimit = (windowMs, maxRequests) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(key)) {
      const userRequests = requests.get(key).filter(time => time > windowStart);
      requests.set(key, userRequests);
    } else {
      requests.set(key, []);
    }

    const userRequests = requests.get(key);

    if (userRequests.length >= maxRequests) {
      logger.warn('Rate limit exceeded', {
        requestId: req.headers['x-request-id'],
        ip: key,
        path: req.path,
      });

      return res.status(429).json({
        message: 'Too many requests',
        statusCode: 429,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    userRequests.push(now);
    next();
  };
};

// CORS helper
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request', {
        origin,
        allowedOrigins,
      });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

module.exports = {
  validateRequest,
  paginate,
  dateRange,
  sort,
  filter,
  formatResponse,
  createRateLimit,
  corsOptions,
};
