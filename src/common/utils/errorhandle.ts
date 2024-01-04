import { ErrorHandlerInterface } from 'typeorm';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import winston from 'winston';
import AppError from './appError';

export class CustomErrorHandler implements ErrorHandlerInterface {
  private logger: winston.Logger;

  constructor() {
    // Configure Winston logger
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log' })
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      )
    });
  }

  /**
   * Log error using Winston.
   */
  private logError(error: any): void {
    this.logger.error(error.message);
    // You can customize this to log additional information or handle errors differently
  }

  /**
   * This method is called when an error occurs during query execution.
   */
  handleQueryError(error: any): any {
    this.logError(error);

    // Throw a custom error
    throw new AppError('An error occurred during query execution', 500);
  }

  /**
   * This method is called when a JWT verification fails.
   */
  handleJWTError(error: JsonWebTokenError | TokenExpiredError): void {
    this.logError(error);

    // Throw a custom error
    throw new AppError('JWT verification failed', 401);
  }

  /**
   * This method is called when an error occurs during entity save.
   */
  handlePersistError(error: any): any {
    this.logError(error);

    // Throw a custom error
    throw new AppError('An error occurred during entity save', 500);
  }

  /**
   * This method is called when an error occurs during transaction execution.
   */
  handleTransactionError(error: any): any {
    this.logError(error);

    // Throw a custom error
    throw new AppError('An error occurred during transaction execution', 500);
  }

  /**
   * Generic error handler.
   */
  handleGenericError(error: any): any {
    this.logError(error);

    // Throw a custom error
    throw new AppError('An unexpected error occurred', 500);
  }
}
