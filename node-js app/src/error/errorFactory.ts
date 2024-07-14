import { getReasonPhrase } from 'http-status-codes';

/**
 * Interface extending the Error object to include statusCode and message attributes.
 */
interface CustomError extends Error {
  /**
   * HTTP status code associated with the error.
   */
  statusCode: number;
  
  /**
   * Error message describing the specific issue.
   */
  message: string;
}

/**
 * Factory class for creating custom error objects.
 * Implements a method to create errors with a specific status code and message.
 */
class ErrorFactory {
  /**
   * Creates a new custom error object.
   * @param statusCode - The HTTP status code for the error.
   * @param message - Optional. The error message. If not provided, the reason phrase for the status code will be used.
   * @returns A CustomError object with the specified status code and message.
   */
  static createError(statusCode: number, message?: string): CustomError {
    const error: CustomError = new Error(message || getReasonPhrase(statusCode)) as CustomError;
    error.statusCode = statusCode;
    error.message = message || getReasonPhrase(statusCode);
    return error;
  }
}

export default ErrorFactory;
