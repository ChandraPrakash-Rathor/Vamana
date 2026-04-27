/**
 * Standardized API response helpers
 * All controllers use these to ensure consistent response format
 */

const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    error: null
  });
};

const created = (res, data = null, message = 'Created successfully') => {
  return success(res, data, message, 201);
};

const error = (res, message = 'Something went wrong', statusCode = 500, err = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    // Never expose stack traces or internal error details in production
    error: process.env.NODE_ENV === 'development' && err ? err.message : null
  });
};

const validationError = (res, message = 'Validation failed', errors = []) => {
  return res.status(400).json({
    success: false,
    message,
    data: null,
    error: errors.length > 0 ? errors : message
  });
};

const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404);
};

const unauthorized = (res, message = 'Not authorized') => {
  return error(res, message, 401);
};

const forbidden = (res, message = 'Access denied') => {
  return error(res, message, 403);
};

// Handle mongoose ObjectId cast errors
const isInvalidObjectId = (err) => err.name === 'CastError' && err.kind === 'ObjectId';

// Extract mongoose validation error messages
const getValidationMessages = (err) =>
  Object.values(err.errors).map(e => e.message);

module.exports = { success, created, error, validationError, notFound, unauthorized, forbidden, isInvalidObjectId, getValidationMessages };
