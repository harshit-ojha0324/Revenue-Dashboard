/**
 * Wraps an async route handler so any rejected promise is forwarded to
 * Express's error-handling middleware via next(err). This removes the
 * need for a try/catch in every controller and ensures the central
 * errorHandler (CastError -> 404, duplicate key -> 400, etc.) runs.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
