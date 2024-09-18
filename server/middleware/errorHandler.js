const config = require('../config/index')

const devErrorResponse = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
    errorTrace: err.stack
  })
}

const prodErrorResponse = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
  })
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'server error';
  if (config.node_env.trim() === 'development') {
    devErrorResponse(err, res)
  } else if (config.node_env.trim() === 'production') {
    prodErrorResponse(err, res)
  }
};

module.exports = errorHandler;