const mongoose = require('mongoose');
const { AppError } = require('./errorHandler');

/**
 * Validates that req.params.id is a valid MongoDB ObjectId before hitting the controller.
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid task ID format', 400));
  }
  return next();
};

module.exports = validateObjectId;

