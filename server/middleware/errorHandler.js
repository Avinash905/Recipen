const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  return res.status(status).json({
    message: status >= 500 ? "Something went wrong" : err.message,
    isError: true,
  });
};

module.exports = errorHandler;
