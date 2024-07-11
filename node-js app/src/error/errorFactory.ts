import { getReasonPhrase } from 'http-status-codes';
import { ErrorMessages } from '../error/errorMessages';

interface CustomError extends Error {
  statusCode: number;
  message: string;
}

class ErrorFactory {
  static createError(statusCode: number, message?: string): CustomError {
    const error: CustomError = new Error(message || getReasonPhrase(statusCode)) as CustomError;
    error.statusCode = statusCode;
    error.message = message || getReasonPhrase(statusCode);
    return error;
  }
}

export default ErrorFactory;
