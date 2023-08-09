const errorHandler = (err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Something went wrong";
  return res.status(errStatus).send({
    success: false,
    stack: err.stack,
    message: errMessage,
    status: errStatus,
  });
};

module.exports = errorHandler;
