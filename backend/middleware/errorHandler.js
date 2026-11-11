class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

/**
 * Catch-all middleware for unmatched API routes.
 */
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

/**
 * Centralized Express error handler that formats all errors as { success, data, message }.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON payload in request body';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid task ID format';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((item) => item.message);
    message = messages.join('. ');
  }

  if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error ${statusCode}]: ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
};

module.exports = {
  AppError,
  notFound,
  errorHandler,
};

