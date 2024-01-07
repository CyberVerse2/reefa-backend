import { ENVIRONMENT } from '../config/environment';
import { logger } from './logger';
import { QueryFailedError } from 'typeorm';
import AppError from './appError';


function handleQueryFailedError(err: QueryFailedError) {
  return new AppError(err.message, 400)
}

/**
 * Error handler
 */
export const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went wrong';
  err.data = err.data || null;

  const { statusCode, message, data } = err;
  // console.log(err.detail);

  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  if (err.timeout) {
    return res.status(408).send({
      success: false,
      data: null,
      message: 'Request timeout'
    });
  }

  if (statusCode === 404) {
    return res.status(statusCode).json({
      success: false,
      data: null,
      message: message ?? 'resource not found'
    });
  }
  if (err instanceof QueryFailedError) {
    err = handleQueryFailedError(err);
  }

  if (ENVIRONMENT.APP.ENV === 'local') {
    console.log('==== Error ==== : ', err.stack);

    return res.status(statusCode).json({
      success: false,
      data: data,
      message: message,
      stackTrace: err.stack
    });
  }

  return res.status(statusCode).json({
    success: false,
    data: data,
    message: message
  });
};