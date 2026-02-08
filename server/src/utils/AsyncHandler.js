/**
 * Higher-order function to wrap async route handlers
 * Automatically catches errors and passes them to error handling middleware
 */
export const AsyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error);
    });
  };
};
