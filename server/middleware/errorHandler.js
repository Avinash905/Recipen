const errorHandler = (err, req, res, next) => {
  const errStatus = req.statusCode || 500;
  const errMessage = err.message || "Something went wrong";
  return res.status(errStatus).json({
    message: errMessage,
    isError: true,
  });
};

module.exports = errorHandler;
